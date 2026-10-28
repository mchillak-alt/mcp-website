import { verifyPaddleWebhook } from "../_paddle-verify.js";
import { productForPrice, TOKEN_TTL_SECONDS } from "../_products.js";

// Paddle's authoritative fulfillment signal. The browser's checkout callback
// fires before this lands, so downloads are only ever unlocked here.
//
// Paddle treats ONLY a 2xx as delivered; every other status is retried (60
// attempts over ~3 days on live). So anything we might recover from must
// return non-2xx, and only a genuinely unfulfillable event returns 200.
export async function onRequestPost({ request, env }) {
  const signature = request.headers.get("paddle-signature");

  // Must read the body as raw text — parsing first changes the bytes and the
  // signature no longer matches.
  const rawBody = await request.text();

  if (!signature || !rawBody) {
    return new Response("Missing signature or body", { status: 400 });
  }

  const secret = env.PADDLE_WEBHOOK_SECRET;
  if (!secret) {
    // Retryable: a deploy that forgot the secret should not lose the sale.
    return new Response("Not configured", { status: 500 });
  }

  if (!(await verifyPaddleWebhook(secret, signature, rawBody))) {
    // Non-2xx so Paddle retries — a rotated secret recovers once redeployed.
    return new Response("Invalid signature", { status: 401 });
  }

  let event;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return new Response("Malformed payload", { status: 400 });
  }

  // One-time purchases complete here. Everything else we are subscribed to but
  // do not act on is a no-op, which must still be a 200 or Paddle retries it.
  if (event.event_type !== "transaction.completed") {
    return new Response("Ignored", { status: 200 });
  }

  const data = event.data ?? {};
  const transactionId = data.id;
  const eventId = event.event_id;

  if (!transactionId || !eventId) {
    return new Response("No transaction id", { status: 200 });
  }

  // Idempotency: Paddle re-sends the same event_id on every retry.
  const already = await env.DOWNLOAD_TOKENS.get(`event:${eventId}`);
  if (already) return new Response("Already fulfilled", { status: 200 });

  // A transaction can carry several packs; each item unlocks its own file.
  const items = Array.isArray(data.items) ? data.items : [];
  const grants = [];

  for (const item of items) {
    const priceId = item?.price?.id ?? item?.price_id;
    const product = productForPrice(priceId);
    if (product) grants.push(product);
  }

  if (grants.length === 0) {
    // Nothing we sell. Retrying will never change that, so 200 and move on —
    // but say so loudly, because a silent 200 here is exactly how a
    // mismatched price id hides as a working webhook.
    console.error(
      `paddle-webhook: no known price on ${transactionId}; saw`,
      JSON.stringify(items.map((i) => i?.price?.id ?? i?.price_id))
    );
    return new Response("No matching product", { status: 200 });
  }

  const token = crypto.randomUUID().replace(/-/g, "");
  const grant = {
    packs: grants.map(({ packId, key, filename }) => ({ packId, key, filename })),
    transactionId,
    customerId: data.customer_id ?? null,
    // Present because the notification destination has sensitive fields
    // enabled; without that Paddle sends only customer_id and the email
    // would cost an API call inside the webhook's 5 second budget.
    email: data.customer?.email ?? null,
    downloads: 0,
    issuedAt: new Date().toISOString(),
  };

  await Promise.all([
    env.DOWNLOAD_TOKENS.put(`token:${token}`, JSON.stringify(grant), {
      expirationTtl: TOKEN_TTL_SECONDS,
    }),
    // Lets the buyer's browser claim the token after checkout completes.
    env.DOWNLOAD_TOKENS.put(`txn:${transactionId}`, token, {
      expirationTtl: TOKEN_TTL_SECONDS,
    }),
    env.DOWNLOAD_TOKENS.put(`event:${eventId}`, "1", {
      expirationTtl: TOKEN_TTL_SECONDS,
    }),
  ]);

  return new Response("OK", { status: 200 });
}
