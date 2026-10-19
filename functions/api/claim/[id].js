// After checkout, the buyer's browser polls this until the webhook has landed.
// `id` is the Paddle transaction id returned by the checkout.
export async function onRequestGet({ params, env }) {
  const token = await env.DOWNLOAD_TOKENS.get(`txn:${params.id}`);

  if (!token) {
    // Not an error — the webhook is usually a beat behind the redirect.
    return Response.json({ ready: false }, { status: 202 });
  }

  const grant = await env.DOWNLOAD_TOKENS.get(`token:${token}`, "json");
  if (!grant) return Response.json({ ready: false }, { status: 202 });

  return Response.json({
    ready: true,
    token,
    packs: grant.packs.map(({ packId, filename }) => ({
      packId,
      filename,
      url: `/api/download/${token}/${packId}`,
    })),
  });
}
