import { ACCENTS_FREE, TOKEN_TTL_SECONDS } from "../_products.js";

// Free packs are the trade for an email address, so the download is minted only
// after the subscriber is recorded. The old open /api/free/<pack> route is gone.

const FREE_PACKS = { [ACCENTS_FREE.packId]: ACCENTS_FREE };

// Deliberately loose: the point is to catch typos, not to police addresses.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

async function subscribeToKit(apiKey, email, packId) {
  const res = await fetch("https://api.kit.com/v4/subscribers", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "X-Kit-Api-Key": apiKey,
    },
    // state defaults to active: no double opt-in, so the buyer is not left
    // waiting on a confirmation click before the pack they came for.
    body: JSON.stringify({
      email_address: email,
      fields: { source: `free-pack:${packId}` },
    }),
  });

  if (!res.ok) {
    throw new Error(`kit ${res.status}: ${(await res.text()).slice(0, 200)}`);
  }
}

export async function onRequestPost({ request, env }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Malformed request." }, { status: 400 });
  }

  const email = String(body?.email ?? "").trim().toLowerCase();
  const packId = String(body?.packId ?? "");
  const pack = FREE_PACKS[packId];

  if (!pack) return Response.json({ error: "Unknown pack." }, { status: 404 });
  if (!EMAIL.test(email)) {
    return Response.json({ error: "That email doesn't look right." }, { status: 400 });
  }

  let debug = { keyPresent: Boolean(env.KIT_API_KEY), kit: null };

  if (env.KIT_API_KEY) {
    try {
      await subscribeToKit(env.KIT_API_KEY, email, packId);
      debug.kit = "ok";
    } catch (e) {
      debug.kit = e.message;
      // Deliver anyway. They gave a real address in good faith, and a Kit
      // outage should not read to them as a broken download — but log it
      // loudly, because silent failure here means the giveaway costs us
      // the subscriber it exists to earn.
      console.error("free-claim: kit subscribe failed:", e.message);
    }
  } else {
    console.error("free-claim: KIT_API_KEY is not set; delivered without subscribing");
    debug.kit = "no key";
  }

  const token = crypto.randomUUID().replace(/-/g, "");
  await env.DOWNLOAD_TOKENS.put(
    `token:${token}`,
    JSON.stringify({
      packs: [{ packId: pack.packId, key: pack.key, filename: pack.filename }],
      transactionId: "free",
      customerId: null,
      email,
      downloads: 0,
      issuedAt: new Date().toISOString(),
    }),
    { expirationTtl: TOKEN_TTL_SECONDS }
  );

  const wantsDebug = new URL(request.url).searchParams.has("debug");

  return Response.json({
    url: `/api/download/${token}/${pack.packId}`,
    filename: pack.filename,
    ...(wantsDebug ? { debug } : {}),
  });
}
