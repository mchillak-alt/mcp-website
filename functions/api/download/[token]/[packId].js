import { MAX_DOWNLOADS, TOKEN_TTL_SECONDS } from "../../../_products.js";

// Streams the pack straight out of R2. Egress is free, so a multi-gigabyte
// download costs nothing regardless of how many times it is pulled.
export async function onRequestGet({ params, env, waitUntil }) {
  const grant = await env.DOWNLOAD_TOKENS.get(`token:${params.token}`, "json");

  if (!grant) {
    return new Response("This download link is invalid or has expired.", {
      status: 404,
    });
  }

  // The token may cover several packs; only serve one it actually paid for.
  const pack = grant.packs.find((p) => p.packId === params.packId);
  if (!pack) {
    return new Response("That pack is not part of this purchase.", {
      status: 404,
    });
  }

  if (grant.downloads >= MAX_DOWNLOADS) {
    return new Response(
      "This link has reached its download limit. Email hello@mcpaudio.com and we'll reissue it.",
      { status: 403 }
    );
  }

  const object = await env.DOWNLOADS.get(pack.key);
  if (!object) {
    console.error(`download: missing R2 object ${pack.key}`);
    return new Response("That file is missing. We've been notified.", {
      status: 500,
    });
  }

  // Count the download without making the buyer wait on the KV write.
  waitUntil(
    env.DOWNLOAD_TOKENS.put(
      `token:${params.token}`,
      JSON.stringify({ ...grant, downloads: grant.downloads + 1 }),
      { expirationTtl: TOKEN_TTL_SECONDS }
    )
  );

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  headers.set("content-type", "application/zip");
  headers.set("content-disposition", `attachment; filename="${pack.filename}"`);
  // Never let a CDN or browser cache a per-buyer URL.
  headers.set("cache-control", "private, no-store");

  return new Response(object.body, { headers });
}
