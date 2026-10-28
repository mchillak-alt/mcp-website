// Copy for the gated free-pack claim page at /free.
//
// The pack's download details (R2 key, filename) live server side in
// functions/_products.js — this file is only what the visitor reads. Keep
// `id` matching the packId there.
//
// TODO(mischa): replace the placeholder copy below with the real pack.
export const INSTAGRAM_HANDLE = "mcp_audio";
export const INSTAGRAM_URL = `https://instagram.com/${INSTAGRAM_HANDLE}`;

export const freePack = {
  id: "new-pack",
  title: "MCP Audio Free Pack",
  eyebrow: "Free download",
  blurb:
    "A free collection of original one-shots and textures, recorded through analog outboard gear. Yours for an email address — no card, no account.",
  // What the visitor gets, shown as a short list. Keep it to three or four lines.
  contents: [
    "Original one-shots and textures",
    "24-bit WAV, royalty-free in your productions",
    "Recorded through analog outboard gear",
  ],
  // Paid packs shown underneath the download, once they have claimed. Ids must
  // match src/data/samples.js.
  upsell: ["vol-5", "vol-4"],
};
