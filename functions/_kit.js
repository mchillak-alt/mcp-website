// Kit (formerly ConvertKit) subscribe, server side.
//
// Two paths, picked by whether an API key is configured:
//
//   No KIT_API_KEY  — posts to the same public form endpoint the homepage
//                     signup already uses (src/App.jsx). Works with zero extra
//                     setup. Running it server side instead of in the browser
//                     also means we can actually read the response, which the
//                     homepage form cannot: its fetch uses mode "no-cors", so
//                     it reports success even when Kit rejects the address.
//
//   KIT_API_KEY set — uses the v4 API, which additionally lets us tag the
//                     subscriber so pack claimers are segmentable from general
//                     launch-news signups. Adding an address to a form in v4 is
//                     a TWO step call: Kit only adds subscribers that already
//                     exist, so create-subscriber runs first. Create is an
//                     upsert (201 new, 200 existing), so repeat claims are safe.
//
// Optional env:
//   KIT_FORM_ID     — defaults to the form the homepage already subscribes to
//   KIT_API_KEY     — Kit → Settings → Developer → API keys (v4 key)
//   KIT_FREE_TAG_ID — only used when KIT_API_KEY is set

// Keep in sync with KIT_FORM_ID in src/App.jsx.
const DEFAULT_KIT_FORM_ID = "10037259";
const KIT_API = "https://api.kit.com/v4";

function formId(env) {
  return env.KIT_FORM_ID || DEFAULT_KIT_FORM_ID;
}

async function kitApiPost(env, path, body) {
  const res = await fetch(`${KIT_API}${path}`, {
    method: "POST",
    headers: {
      "X-Kit-Api-Key": env.KIT_API_KEY,
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });

  // 200 and 201 are both success — Kit returns 200 for "already existed".
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Kit ${path} -> ${res.status} ${detail.slice(0, 300)}`);
  }

  return res.json().catch(() => ({}));
}

async function subscribeViaPublicForm(env, { email, firstName }) {
  const body = new URLSearchParams({ email_address: email });
  if (firstName) body.set("first_name", firstName);

  const res = await fetch(
    `https://app.kit.com/forms/${formId(env)}/subscriptions`,
    {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body,
    }
  );

  if (!res.ok) {
    throw new Error(`Kit public form -> ${res.status}`);
  }
}

async function subscribeViaApi(env, { email, firstName, referrer }) {
  await kitApiPost(env, "/subscribers", {
    email_address: email,
    // Kit rejects an explicit null, so only send a name we actually have.
    ...(firstName ? { first_name: firstName } : {}),
  });

  await kitApiPost(env, `/forms/${formId(env)}/subscribers`, {
    email_address: email,
    ...(referrer ? { referrer } : {}),
  });

  if (env.KIT_FREE_TAG_ID) {
    await kitApiPost(env, `/tags/${env.KIT_FREE_TAG_ID}/subscribers`, {
      email_address: email,
    });
  }
}

// Throws on any Kit failure. The caller is responsible for making sure that
// never costs the visitor their download.
export async function subscribeToKit(env, { email, firstName, referrer }) {
  if (env.KIT_API_KEY) {
    return subscribeViaApi(env, { email, firstName, referrer });
  }
  return subscribeViaPublicForm(env, { email, firstName });
}
