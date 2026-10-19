// Paddle webhook signature verification.
// Header: `Paddle-Signature: ts=<unix>;h1=<hex>`
// Signed payload: `${ts}:${rawBody}`, HMAC-SHA256, hex encoded.

// Paddle's own SDK defaults to a 5 second tolerance, which is tight enough that
// ordinary network delay or clock skew causes spurious rejections. Five minutes
// is the usual industry window; replayed deliveries are caught by the event_id
// idempotency check in the handler regardless.
const TOLERANCE_SECONDS = 60 * 5;

function constantTimeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function parseSignatureHeader(header) {
  const parts = { ts: null, h1: null };
  for (const segment of header.split(";")) {
    const [key, value] = segment.split("=");
    if (key === "ts") parts.ts = value;
    if (key === "h1") parts.h1 = value;
  }
  return parts;
}

export async function verifyPaddleWebhook(secret, signatureHeader, rawBody) {
  if (!signatureHeader || !secret) return false;

  const { ts, h1 } = parseSignatureHeader(signatureHeader);
  if (!ts || !h1) return false;

  const age = Math.abs(Math.floor(Date.now() / 1000) - Number(ts));
  if (!Number.isFinite(age) || age > TOLERANCE_SECONDS) return false;

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const mac = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(`${ts}:${rawBody}`)
  );

  const expected = [...new Uint8Array(mac)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return constantTimeEqual(h1, expected);
}
