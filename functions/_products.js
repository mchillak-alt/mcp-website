// Maps Whop plan IDs to the R2 object each purchase unlocks.
//
// `key`      = the object's name inside the mcp-audio-downloads bucket
// `filename` = what the buyer's browser saves the download as
// `free`     = $0 products, which are fulfilled from membership.went_valid
//              because Whop does not raise payment.succeeded for them
export const PRODUCTS = {
  plan_KeHnsH96XuDwQ: {
    packId: "vol-1",
    key: "vol-1.zip",
    filename: "Mischa Chillak Vol.1.zip",
  },
  plan_nwju39qm0UuSC: {
    packId: "vol-2",
    key: "vol-2.zip",
    filename: "Mischa Chillak Vol.2.zip",
  },
  plan_7JB4RyrM9LEvd: {
    packId: "vol-3",
    key: "vol-3.zip",
    filename: "Mischa Chillak Vol.3.zip",
  },
  plan_Z4dXSkTDzS0ay: {
    packId: "vol-4",
    key: "vol-4.zip",
    filename: "Mischa Chillak Vol.4.zip",
  },
  plan_B3i1mQPFJkbox: {
    packId: "vol-5",
    key: "vol-5.zip",
    filename: "Mischa Chillak Vol.5.zip",
  },
  plan_yLRuWlmYtaJmu: {
    packId: "accents",
    key: "accents-vol-1.zip",
    filename: "Mischa Chillak Accents Vol.1.zip",
    free: true,
  },
};

// How many times a single purchase can download, and how long the link lives.
export const MAX_DOWNLOADS = 10;
export const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 90; // 90 days

export function productForPlan(planId) {
  return PRODUCTS[planId] ?? null;
}
