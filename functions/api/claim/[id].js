// After checkout, the buyer's browser polls this until the webhook has landed.
// Paid packs are claimed by payment id, free ones by membership id — try both.
export async function onRequestGet({ params, env }) {
  const token =
    (await env.DOWNLOAD_TOKENS.get(`payment:${params.id}`)) ??
    (await env.DOWNLOAD_TOKENS.get(`membership:${params.id}`));

  if (!token) {
    // Not an error — the webhook is usually a beat behind the redirect.
    return Response.json({ ready: false }, { status: 202 });
  }

  const grant = await env.DOWNLOAD_TOKENS.get(`token:${token}`, "json");

  return Response.json({
    ready: true,
    token,
    filename: grant?.filename ?? null,
    url: `/api/download/${token}`,
  });
}
