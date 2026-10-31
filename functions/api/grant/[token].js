// Resolves a download token straight to its packs, for links issued by hand
// (scripts/issue-download.js) that never had a Paddle transaction behind them.
export async function onRequestGet({ params, env }) {
  const grant = await env.DOWNLOAD_TOKENS.get(`token:${params.token}`, "json");

  if (!grant) {
    return Response.json({ ready: false }, { status: 404 });
  }

  return Response.json({
    ready: true,
    token: params.token,
    packs: grant.packs.map(({ packId, filename }) => ({
      packId,
      filename,
      url: `/api/download/${params.token}/${packId}`,
    })),
  });
}
