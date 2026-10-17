// Standard Webhooks signature verification (the scheme Whop uses).
// Signs `${webhook-id}.${webhook-timestamp}.${rawBody}` with HMAC-SHA256.

const TOLERANCE_SECONDS = 60 * 5;

function constantTimeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function verifyWebhook(secret, headers, rawBody) {
  const id = headers.get("webhook-id");
  const timestamp = headers.get("webhook-timestamp");
  const signatureHeader = headers.get("webhook-signature");
  if (!id || !timestamp || !signatureHeader) return false;

  // Reject replays of old deliveries.
  const age = Math.abs(Math.floor(Date.now() / 1000) - Number(timestamp));
  if (!Number.isFinite(age) || age > TOLERANCE_SECONDS) return false;

  const rawKey = secret.startsWith("whsec_") ? secret.slice(6) : secret;
  const keyBytes = Uint8Array.from(atob(rawKey), (c) => c.charCodeAt(0));
  const key = await crypto.subtle.importKey(
    "raw",
    keyBytes,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signed = new TextEncoder().encode(`${id}.${timestamp}.${rawBody}`);
  const mac = await crypto.subtle.sign("HMAC", key, signed);
  const expected = btoa(String.fromCharCode(...new Uint8Array(mac)));

  // Header can carry several space-separated `v1,<sig>` pairs during key rotation.
  return signatureHeader
    .split(" ")
    .some((part) => {
      const [version, signature] = part.split(",");
      return version === "v1" && signature && constantTimeEqual(signature, expected);
    });
}
