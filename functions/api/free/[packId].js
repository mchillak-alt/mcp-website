import { ACCENTS_FREE } from "../../_products.js";

// Free packs never go through checkout, so there is no token to check — the
// file is simply public. Kept on its own path rather than under /api/download
// so it cannot be confused with the token-gated route.
const FREE_PACKS = { [ACCENTS_FREE.packId]: ACCENTS_FREE };

export async function onRequestGet({ params, env }) {
  const pack = FREE_PACKS[params.packId];
  if (!pack) return new Response("Not found.", { status: 404 });

  const object = await env.DOWNLOADS.get(pack.key);
  if (!object) {
    console.error(`free download: missing R2 object ${pack.key}`);
    return new Response("That file is missing. We've been notified.", {
      status: 500,
    });
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  headers.set("content-type", "application/zip");
  headers.set("content-disposition", `attachment; filename="${pack.filename}"`);

  return new Response(object.body, { headers });
}
