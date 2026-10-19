// Creates the Paddle products and prices for the sample packs.
//
//   export PADDLE_API_KEY=pdl_sdbx_...
//   node scripts/seed-paddle-catalog.js
//
// Safe to re-run: it skips any product whose name already exists rather than
// creating duplicates. Prints the price IDs to paste into functions/_products.js.
//
// Accents Vol.1 is deliberately absent — it is free, so it is served as a plain
// download rather than put through checkout.

import { Environment, Paddle } from "@paddle/paddle-node-sdk";

const apiKey = process.env.PADDLE_API_KEY;
if (!apiKey) {
  console.error("error: PADDLE_API_KEY is not set. See the header of this file.");
  process.exit(1);
}

// Live keys start pdl_live_; refuse to touch production from this script.
if (apiKey.startsWith("pdl_live_")) {
  console.error("error: that is a live API key. This script only seeds sandbox.");
  process.exit(1);
}

const paddle = new Paddle(apiKey, { environment: Environment.sandbox });

// Downloadable asset packs. Cannot be changed after the first sale.
const TAX_CATEGORY = "digital-goods";

const PACKS = [
  { packId: "vol-1", name: "Mischa Chillak Vol.1", amount: "2499" },
  { packId: "vol-2", name: "Mischa Chillak Vol.2", amount: "2499" },
  { packId: "vol-3", name: "Mischa Chillak Vol.3", amount: "2499" },
  { packId: "vol-4", name: "Mischa Chillak Vol.4", amount: "2499" },
  { packId: "vol-5", name: "Mischa Chillak Vol.5", amount: "2499" },
];

async function existingProductsByName() {
  const byName = new Map();
  for await (const product of paddle.products.list({ status: ["active"] })) {
    byName.set(product.name, product);
  }
  return byName;
}

async function seed() {
  const existing = await existingProductsByName();
  const results = [];

  for (const pack of PACKS) {
    let product = existing.get(pack.name);

    if (product) {
      console.log(`exists   ${pack.name} (${product.id})`);
    } else {
      product = await paddle.products.create({
        name: pack.name,
        taxCategory: TAX_CATEGORY,
        description: "Sample pack — instant download.",
        customData: { packId: pack.packId },
      });
      console.log(`created  ${pack.name} (${product.id})`);
    }

    // One-time purchase: no billingCycle, no trialPeriod.
    const price = await paddle.prices.create({
      productId: product.id,
      description: `${pack.name} — one-time USD`,
      unitPrice: { amount: pack.amount, currencyCode: "USD" },
      customData: { packId: pack.packId },
    });
    console.log(`  price  ${price.id}  $${(Number(pack.amount) / 100).toFixed(2)}`);

    results.push({ packId: pack.packId, productId: product.id, priceId: price.id });
  }

  console.log("\nPaste these price IDs back to Claude:\n");
  console.log(JSON.stringify(results, null, 2));
}

seed().catch((e) => {
  console.error("\nfailed:", e?.detail ?? e?.message ?? e);
  if (String(e?.code ?? "").includes("forbidden")) {
    console.error("The API key is missing product.write / price.write scopes.");
  }
  process.exit(1);
});
