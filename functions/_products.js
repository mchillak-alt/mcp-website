// Maps Paddle price IDs to the R2 object each purchase unlocks.
//
// `key`      = the object's name inside the mcp-audio-downloads bucket
// `filename` = what the buyer's browser saves the download as
//
// These are SANDBOX price IDs. Paddle's sandbox and live catalogs are entirely
// separate, so these must be replaced with live `pri_...` IDs at launch —
// re-run scripts/seed-paddle-catalog.js against the live account.
//
// Accents Vol.1 is free and never goes through checkout; it is served directly
// from ACCENTS_FREE_KEY below.
export const PRODUCTS = {
  pri_01m5athbeqtqbckxbmmsv5y9y0: {
    packId: "vol-1",
    key: "vol-1.zip",
    filename: "Mischa Chillak Vol.1.zip",
  },
  pri_01m5athby7mvjmn4070dja8fmd: {
    packId: "vol-2",
    key: "vol-2.zip",
    filename: "Mischa Chillak Vol.2.zip",
  },
  pri_01m5athc7agsaj53jhn6zfgwz0: {
    packId: "vol-3",
    key: "vol-3.zip",
    filename: "Mischa Chillak Vol.3.zip",
  },
  pri_01m5athcg5k8h63pwx538qb1c9: {
    packId: "vol-4",
    key: "vol-4.zip",
    filename: "Mischa Chillak Vol.4.zip",
  },
  pri_01m5athcs9pfxjgnha2g4cspkn: {
    packId: "vol-5",
    key: "vol-5.zip",
    filename: "Mischa Chillak Vol.5.zip",
  },
};

export const ACCENTS_FREE = {
  packId: "accents",
  key: "accents-vol-1.zip",
  filename: "Mischa Chillak Accents Vol.1.zip",
};

// ---------------------------------------------------------------------------
// Gated free packs
//
// Different from ACCENTS_FREE above. Accents Vol.1 is already published and
// stays a straight public download at /api/free/accents — nothing about it
// changes. These are packs released by /api/free-claim in exchange for an
// email address, which mints the same kind of token a purchase does.
//
// TODO(mischa): fill in the real values for the new pack before launch.
//   packId   — the URL slug at /free/<packId>. /free alone serves FEATURED_FREE_PACK.
//   key      — the object name inside the mcp-audio-downloads R2 bucket
//              (upload with scripts/upload-packs.sh)
//   filename — what the visitor's browser saves it as
//   title    — shown on the claim page
export const GATED_FREE_PACKS = {
  "new-pack": {
    packId: "new-pack",
    key: "new-pack.zip",
    filename: "MCP Audio Free Pack.zip",
    title: "MCP Audio Free Pack",
  },
};

// What /free serves, so the Instagram DM link can stay short and permanent
// while the pack behind it changes.
export const FEATURED_FREE_PACK_ID = "new-pack";

export function freePackById(packId) {
  return GATED_FREE_PACKS[packId] ?? null;
}

export function featuredFreePack() {
  return GATED_FREE_PACKS[FEATURED_FREE_PACK_ID] ?? null;
}

// How many times a single purchase can download, and how long the link lives.
export const MAX_DOWNLOADS = 10;
export const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 90; // 90 days

// A free claim costs nothing to mint, so it is the one endpoint worth throttling.
// Generous enough that a shared office or phone network never trips it.
export const FREE_CLAIMS_PER_IP = 12;
export const FREE_CLAIM_WINDOW_SECONDS = 60 * 60;

// The newsletter form is cheaper still to spam, and nobody legitimately signs
// up for a mailing list a dozen times an hour.
export const SIGNUPS_PER_IP = 6;

export function productForPrice(priceId) {
  return PRODUCTS[priceId] ?? null;
}
