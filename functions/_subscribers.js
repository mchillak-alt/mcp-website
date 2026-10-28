// Shared between /api/subscribe (the homepage newsletter form) and
// /api/free-claim (the gated free pack).
//
// The rule both endpoints follow: the email lands in KV before Kit is ever
// contacted, so a Kit outage can never lose a signup. KV is the record of
// truth; Kit is a sync target.

// Good enough to catch typos and junk; real validation is Kit accepting it.
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function normaliseEmail(value) {
  const email = String(value ?? "").trim().toLowerCase();
  return EMAIL_RE.test(email) && email.length <= 254 ? email : null;
}

// Counts attempts rather than successes, which is what throttling wants.
export async function overRateLimit(env, request, { prefix, limit, windowSeconds }) {
  const ip = request.headers.get("cf-connecting-ip") ?? "unknown";
  const key = `rl:${prefix}:${ip}`;
  const used = Number((await env.DOWNLOAD_TOKENS.get(key)) ?? 0);

  if (used >= limit) return true;

  await env.DOWNLOAD_TOKENS.put(key, String(used + 1), {
    expirationTtl: windowSeconds,
  });
  return false;
}

const key = (email) => `subscriber:${email}`;

// Merges rather than overwrites: someone who claims the free pack and later
// joins the newsletter (or the reverse) must not lose whichever fields the
// first signup set.
export async function recordSubscriber(env, email, patch) {
  const existing = await env.DOWNLOAD_TOKENS.get(key(email), "json");

  const merged = {
    email,
    firstName: patch.firstName || existing?.firstName || null,
    packId: patch.packId ?? existing?.packId ?? null,
    // First-touch wins: knowing someone originally arrived from an Instagram
    // DM is worth more than knowing their most recent form. The latest is kept
    // alongside it rather than thrown away.
    source: existing?.source || patch.source || null,
    lastSource: patch.source || existing?.lastSource || null,
    firstSeenAt: existing?.firstSeenAt ?? new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    kit: "pending",
  };

  await env.DOWNLOAD_TOKENS.put(key(email), JSON.stringify(merged));
  return merged;
}

export async function markKitStatus(env, email, status, errorMessage) {
  const record = (await env.DOWNLOAD_TOKENS.get(key(email), "json")) ?? { email };
  await env.DOWNLOAD_TOKENS.put(
    key(email),
    JSON.stringify({
      ...record,
      kit: status,
      // Clear a stale error once a later attempt succeeds.
      kitError: status === "failed" ? errorMessage : undefined,
    })
  );
}
