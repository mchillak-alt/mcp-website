import { verifyWebhook } from "../_webhook-verify.js";
import { productForPlan, TOKEN_TTL_SECONDS } from "../_products.js";

// Whop's authoritative fulfillment signal. The browser's onComplete callback
// fires before this lands, so downloads are only ever unlocked here.
export async function onRequestPost({ request, env }) {
  const secret = env.WHOP_WEBHOOK_SECRET;
  if (!secret) return new Response("Not configured", { status: 500 });

  // Must read the body as raw text — parsing first changes the bytes and the
  // signature no longer matches.
  const rawBody = await request.text();

  if (!(await verifyWebhook(secret, request.headers, rawBody))) {
    return new Response("Invalid signature", { status: 401 });
  }

  let event;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return new Response("Malformed payload", { status: 400 });
  }

  const data = event.data ?? {};
  const product = productForPlan(data.plan_id ?? data.plan?.id);
  if (!product) {
    // 200 so Whop stops retrying something we will never fulfil.
    return new Response("No matching product", { status: 200 });
  }

  // Paid packs fulfil on payment. Free ones never raise payment.succeeded, so
  // they fulfil on the membership going valid instead — and only free ones do,
  // otherwise a paid purchase would mint a second token for the same sale.
  let claimKey;
  if (event.type === "payment.succeeded") {
    claimKey = `payment:${data.id}`;
  } else if (event.type === "membership.went_valid" && product.free) {
    claimKey = `membership:${data.id}`;
  } else {
    return new Response("Ignored", { status: 200 });
  }

  if (!data.id) return new Response("No id on event", { status: 200 });

  // Idempotency: a retried delivery must not mint a second token.
  const existing = await env.DOWNLOAD_TOKENS.get(claimKey);
  if (existing) return new Response("Already fulfilled", { status: 200 });

  const token = crypto.randomUUID().replace(/-/g, "");
  const grant = {
    packId: product.packId,
    key: product.key,
    filename: product.filename,
    email: data.user_email ?? data.user?.email ?? null,
    claimKey,
    downloads: 0,
    issuedAt: new Date().toISOString(),
  };

  await Promise.all([
    env.DOWNLOAD_TOKENS.put(`token:${token}`, JSON.stringify(grant), {
      expirationTtl: TOKEN_TTL_SECONDS,
    }),
    // Lets the buyer's browser claim the token after checkout completes.
    env.DOWNLOAD_TOKENS.put(claimKey, token, {
      expirationTtl: TOKEN_TTL_SECONDS,
    }),
  ]);

  return new Response("OK", { status: 200 });
}
