import { subscribeToKit } from "../_kit.js";
import {
  normaliseEmail,
  overRateLimit,
  recordSubscriber,
  markKitStatus,
} from "../_subscribers.js";
import { SIGNUPS_PER_IP, FREE_CLAIM_WINDOW_SECONDS } from "../_products.js";

// The homepage newsletter signup.
//
// This exists because the form used to POST to Kit straight from the browser
// with `mode: "no-cors"`, which makes the response unreadable — it reported
// success even when Kit rejected the address. Going through the Worker means
// we can actually read Kit's status and tell the visitor the truth.
//
// Unlike /api/free-claim there is no download to protect here, so this one
// waits for Kit and surfaces a real failure. The email is still written to KV
// first, so a reported failure never means a lost signup.

function bad(message, status = 400) {
  return Response.json({ error: message }, { status });
}

export async function onRequestPost({ request, env }) {
  let payload;
  try {
    payload = await request.json();
  } catch {
    return bad("Malformed request.");
  }

  // A bot that fills in every field it finds trips this; a human never sees it.
  if (payload.company) return bad("Something went wrong.");

  const email = normaliseEmail(payload.email);
  if (!email) return bad("Enter a valid email address.");

  if (
    await overRateLimit(env, request, {
      prefix: "signup",
      limit: SIGNUPS_PER_IP,
      windowSeconds: FREE_CLAIM_WINDOW_SECONDS,
    })
  ) {
    return bad("Too many requests from this connection. Try again later.", 429);
  }

  await recordSubscriber(env, email, {
    firstName: String(payload.firstName ?? "").trim().slice(0, 80),
    source: String(payload.source ?? "").slice(0, 120) || "homepage",
  });

  try {
    await subscribeToKit(env, { email, firstName: payload.firstName });
  } catch (error) {
    console.error(`subscribe: Kit rejected ${email}:`, error.message);
    await markKitStatus(env, email, "failed", error.message);
    return bad("We couldn't sign you up just now. Please try again.", 502);
  }

  await markKitStatus(env, email, "synced");
  return Response.json({ ok: true });
}
