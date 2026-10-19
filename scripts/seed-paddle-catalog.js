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

// "digital-goods" is the correct category for downloadable asset packs, but
// Paddle gates it behind approval. Sandbox runs on "standard" so development is
// not blocked; set PADDLE_TAX_CATEGORY=digital-goods for the live seed once
// Paddle has approved it. Cannot be changed after a product's first sale.
const TAX_CATEGORY = process.env.PADDLE_TAX_CATEGORY ?? "standard";

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
  console.log(`tax category: ${TAX_CATEGORY}\n`);
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

    // Reuse a matching price if one is already on the product, so re-running
    // this script does not leave a pile of duplicate prices behind.
    let price = null;
    for await (const existingPrice of paddle.prices.list({
      productId: [product.id],
      status: ["active"],
    })) {
      if (
        existingPrice.unitPrice?.amount === pack.amount &&
        existingPrice.unitPrice?.currencyCode === "USD" &&
        !existingPrice.billingCycle
      ) {
        price = existingPrice;
        break;
      }
    }

    if (price) {
      console.log(`  price  ${price.id}  (existing)`);
    } else {
      // One-time purchase: no billingCycle, no trialPeriod.
      price = await paddle.prices.create({
        productId: product.id,
        description: `${pack.name} — one-time USD`,
        unitPrice: { amount: pack.amount, currencyCode: "USD" },
        customData: { packId: pack.packId },
      });
      console.log(`  price  ${price.id}  $${(Number(pack.amount) / 100).toFixed(2)}`);
    }

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
