// Creates (or reuses) the Paddle notification destination that delivers
// purchase events to the site, and stores its signing secret in Cloudflare.
//
//   node --env-file=paddle.env.local scripts/setup-paddle-webhook.js
//
// The signing secret is piped straight into `wrangler pages secret put` and is
// never printed, so it does not end up in a terminal scrollback or a chat log.
// The client-side token IS printed — it is public and belongs in frontend code.

import { spawn } from "node:child_process";
import { Environment, Paddle } from "@paddle/paddle-node-sdk";

const WEBHOOK_URL = "https://mcpaudio.com/api/paddle-webhook";
const SUBSCRIBED_EVENTS = ["transaction.completed"];
const CF_PROJECT = "mcp-website";
const CF_SECRET_NAME = "PADDLE_WEBHOOK_SECRET";

const apiKey = process.env.PADDLE_API_KEY;
if (!apiKey) {
  console.error("error: PADDLE_API_KEY is not set.");
  process.exit(1);
}
if (apiKey.startsWith("pdl_live_")) {
  console.error("error: that is a live API key. This script only targets sandbox.");
  process.exit(1);
}

const paddle = new Paddle(apiKey, { environment: Environment.sandbox });

// Some SDK list methods return an array, others a paginated async iterable.
async function collect(listed) {
  const result = await listed;
  if (Array.isArray(result)) return result;
  const out = [];
  for await (const item of result) out.push(item);
  return out;
}

function putCloudflareSecret(name, value) {
  return new Promise((resolve, reject) => {
    const child = spawn(
      "npx",
      ["wrangler", "pages", "secret", "put", name, "--project-name", CF_PROJECT],
      { stdio: ["pipe", "inherit", "inherit"] }
    );
    child.on("error", reject);
    child.on("close", (code) =>
      code === 0 ? resolve() : reject(new Error(`wrangler exited ${code}`))
    );
    child.stdin.write(value);
    child.stdin.end();
  });
}

async function main() {
  // Reuse the destination if it already points at our endpoint, so re-running
  // does not litter the account with duplicates (each has its own secret, and
  // only the newest would be the one we stored).
  // list() resolves to a plain array here, not an async iterable.
  const settings = await paddle.notificationSettings.list();
  let destination =
    settings.find((setting) => setting.destination === WEBHOOK_URL) ?? null;

  if (destination) {
    console.log(`destination exists: ${destination.id}`);
    console.log(`  subscribed: ${destination.subscribedEvents.map((e) => e.name).join(", ")}`);
  } else {
    destination = await paddle.notificationSettings.create({
      description: "mcpaudio.com — sandbox",
      destination: WEBHOOK_URL,
      subscribedEvents: SUBSCRIBED_EVENTS,
      type: "url",
      apiVersion: 1,
    });
    console.log(`destination created: ${destination.id}`);
  }

  console.log(`\nstoring signing secret as ${CF_SECRET_NAME}...`);
  await putCloudflareSecret(CF_SECRET_NAME, destination.endpointSecretKey);
  console.log("stored.");

  // Public token for Paddle.js in the browser.
  const tokens = await collect(paddle.clientTokens.list());
  let clientToken =
    tokens.find((t) => t.name === "mcpaudio.com web" && t.status === "active") ?? null;
  if (!clientToken) {
    clientToken = await paddle.clientTokens.create({
      name: "mcpaudio.com web",
      description: "Paddle.js on the site",
    });
  }

  console.log(`\nclient-side token (public, goes in frontend code):\n${clientToken.token}`);
}

main().catch((e) => {
  console.error("\nfailed:", e?.detail ?? e?.message ?? e);
  process.exit(1);
});
