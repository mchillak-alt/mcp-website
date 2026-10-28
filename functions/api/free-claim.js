import {
  freePackById,
  featuredFreePack,
  TOKEN_TTL_SECONDS,
  FREE_CLAIMS_PER_IP,
  FREE_CLAIM_WINDOW_SECONDS,
} from "../_products.js";
import { subscribeToKit } from "../_kit.js";
import {
  normaliseEmail,
  overRateLimit,
  recordSubscriber,
  markKitStatus,
} from "../_subscribers.js";

// Trades an email address for a gated free pack.
//
// The guiding rule: the visitor must get their download even if Kit is down,
// and we must never lose the email even if Kit rejects it. So the subscriber is
// written to KV first, the download token is minted second, and the call out to
// Kit happens after the response has already been handed back.
//
// That is the one way this differs from /api/subscribe, which has no download
// to protect and so waits for Kit and reports a real failure.
//
// The token is deliberately the same shape a purchase mints, so free claims
// stream through the existing /api/download/<token>/<packId> route and inherit
// its download counting and expiry rather than duplicating them.

function bad(message, status = 400) {
  return Response.json({ error: message }, { status });
}

export async function onRequestPost({ request, env, waitUntil }) {
  let payload;
  try {
    payload = await request.json();
  } catch {
    return bad("Malformed request.");
  }

  // A bot that fills in every field it finds trips this; a human never sees it.
  if (payload.company) return bad("Something went wrong.");

  // No packId means the visitor came in via the short /free link.
  const pack = payload.packId ? freePackById(payload.packId) : featuredFreePack();
  if (!pack) return bad("That pack is not available.", 404);

  const email = normaliseEmail(payload.email);
  if (!email) return bad("Enter a valid email address.");

  if (
    await overRateLimit(env, request, {
      prefix: "free",
      limit: FREE_CLAIMS_PER_IP,
      windowSeconds: FREE_CLAIM_WINDOW_SECONDS,
    })
  ) {
    return bad(
      "Too many requests from this connection. Try again later, or email hello@mcpaudio.com.",
      429
    );
  }

  const token = crypto.randomUUID().replace(/-/g, "");
  const grant = {
    packs: [{ packId: pack.packId, key: pack.key, filename: pack.filename }],
    free: true,
    email,
    downloads: 0,
    issuedAt: new Date().toISOString(),
  };

  // Optional on purpose — every required field costs conversions, and the email
  // is the only one we actually need.
  const firstName = String(payload.firstName ?? "").trim().slice(0, 80);

  // The subscriber record is the asset worth protecting: written before the
  // download is released, and what an export reads if Kit ever fails.
  await Promise.all([
    recordSubscriber(env, email, {
      firstName,
      packId: pack.packId,
      source: String(payload.source ?? "").slice(0, 120) || "free-page",
    }),
    env.DOWNLOAD_TOKENS.put(`token:${token}`, JSON.stringify(grant), {
      expirationTtl: TOKEN_TTL_SECONDS,
    }),
  ]);

  // Kit is explicitly off the critical path. A failure is recorded against the
  // subscriber so it can be retried or exported, and the visitor never sees it.
  waitUntil(
    subscribeToKit(env, {
      email,
      firstName,
      referrer: payload.referrer ? String(payload.referrer).slice(0, 500) : null,
    })
      .then(() => markKitStatus(env, email, "synced"))
      .catch((error) => {
        console.error(`free-claim: Kit sync failed for ${email}:`, error.message);
        return markKitStatus(env, email, "failed", error.message);
      })
  );

  return Response.json({
    packs: grant.packs.map(({ packId, filename }) => ({
      packId,
      filename,
      url: `/api/download/${token}/${packId}`,
    })),
  });
}
