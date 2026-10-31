// Issues a download link by hand, for a purchase the webhook never saw —
// a Whop order, a support request, a reissued expired link.
//
//   node scripts/issue-download.js vol-1 [more-packs...]
//
// Prints a URL to send the customer. Requires wrangler to be logged in.

import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { PRODUCTS, ACCENTS_FREE, TOKEN_TTL_SECONDS } from "../functions/_products.js";

const KV_NAMESPACE_ID = "5a13154ac31c4764a00f3e8e1888a4e7";
const SITE = "https://mcpaudio.com";

// packId -> pack, across both paid and free catalogues.
const BY_PACK_ID = {};
for (const product of Object.values(PRODUCTS)) BY_PACK_ID[product.packId] = product;
BY_PACK_ID[ACCENTS_FREE.packId] = ACCENTS_FREE;

const requested = process.argv.slice(2);
if (requested.length === 0) {
  console.error("usage: node scripts/issue-download.js <packId> [packId...]");
  console.error("available: " + Object.keys(BY_PACK_ID).join(", "));
  process.exit(1);
}

const packs = [];
for (const packId of requested) {
  const pack = BY_PACK_ID[packId];
  if (!pack) {
    console.error(`unknown pack "${packId}". available: ${Object.keys(BY_PACK_ID).join(", ")}`);
    process.exit(1);
  }
  packs.push({ packId: pack.packId, key: pack.key, filename: pack.filename });
}

function run(args) {
  return new Promise((resolve, reject) => {
    const child = spawn("npx", args, { stdio: ["ignore", "ignore", "inherit"] });
    child.on("error", reject);
    child.on("close", (code) => (code === 0 ? resolve() : reject(new Error(`exit ${code}`))));
  });
}

const token = randomUUID().replace(/-/g, "");
const grant = {
  packs,
  transactionId: "manual",
  customerId: null,
  email: null,
  downloads: 0,
  issuedAt: new Date().toISOString(),
};

// wrangler reads the value from a real file; a pipe is not reliable here.
const dir = mkdtempSync(join(tmpdir(), "grant-"));
const file = join(dir, "grant.json");
writeFileSync(file, JSON.stringify(grant));
try {
  await run([
    "wrangler", "kv", "key", "put", `token:${token}`,
    "--namespace-id", KV_NAMESPACE_ID,
    "--remote",
    "--expiration-ttl", String(TOKEN_TTL_SECONDS),
    "--path", file,
  ]);
} finally {
  rmSync(dir, { recursive: true, force: true });
}

console.log("\nSend this link to the customer:\n");
console.log(`${SITE}/download?token=${token}`);
console.log(`\nValid 90 days, 10 downloads. Packs: ${packs.map((p) => p.filename).join(", ")}`);
