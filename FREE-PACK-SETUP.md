# Free pack funnel (`/free`)

The Instagram "comment PACK → DM" funnel lands here. One short, permanent link
— **`mcpaudio.com/free`** — serves whichever pack is currently featured, so the
link in your DM automation never has to change when the pack does.

Accents Vol.1 is **not** part of this. It stays a straight public download at
`/api/free/accents`, exactly as before.

## What happens on a claim

1. Visitor opens `/free`, sees the pack, a **Follow @mcp_audio** button, and an
   email field (first name optional).
2. `POST /api/free-claim` writes the subscriber to KV, mints a download token,
   and returns the download link — all before Kit is contacted.
3. Kit is subscribed afterwards, off the critical path. **If Kit is down or
   rejects the address, the visitor still gets their pack and the email is still
   saved** against `subscriber:<email>` in KV with `kit: "failed"`.
4. The download streams from R2 through the existing
   `/api/download/<token>/<packId>` route — same 90 day, 10 download limits a
   purchase gets.

The follow button is a link, not a gate. Instagram gives a website no way to
check whether someone follows an account, so anything claiming to verify it
would be theatre. Gate the follow in ManyChat instead, before the DM goes out.

## To go live — four things

### 1. Upload the zip to R2

```bash
./scripts/upload-packs.sh
```

The object name must match `key` in `functions/_products.js`.

### 2. Fill in the pack details

Two files, both marked `TODO(mischa)`:

- `functions/_products.js` → `GATED_FREE_PACKS` — `packId`, `key` (the R2 object
  name), `filename` (what the browser saves), `title`.
- `src/data/freePack.js` — the copy the visitor reads: title, blurb, contents
  list, and which paid packs appear as the upsell.

Keep the `packId` in both files identical. If you rename it, update
`FEATURED_FREE_PACK_ID` too.

### 3. Kit

Works right now with **no setup** — it posts server-side to the same form the
homepage signup uses (`10037259`). Note this means pack claimers and general
launch-news signups land in the same Kit form.

To separate them, set either or both as Pages environment variables:

| Variable | Effect |
| --- | --- |
| `KIT_FORM_ID` | Subscribe claims to a different Kit form |
| `KIT_API_KEY` | Switch to Kit's v4 API — enables first-name and tagging |
| `KIT_FREE_TAG_ID` | Tag claimers (requires `KIT_API_KEY`) |

The API key goes in as an **encrypted** variable:
Cloudflare → Pages → mcp-website → Settings → Environment variables.

### 4. Point the DM automation at it

```
Hey! Here's the free pack: https://mcpaudio.com/free?src=ig-dm

(No card needed — just your email so we can send it over and tell you when
the next kit drops.)

Make sure you're following @mcp_audio so you don't miss it 🎛️
```

The `?src=` is recorded on each subscriber, so you can tell DM claims apart from
people who found the page on their own. Use a different value per campaign.

## The homepage newsletter form

The homepage signup posts to `/api/subscribe` rather than to Kit directly. It
used to call Kit's form endpoint from the browser, which has to use
`mode: "no-cors"` — that makes the response unreadable, so the form showed
"check your inbox" even when Kit rejected the address. Going through the Worker
means real failures are now reported.

It differs from the free-pack claim in one way, on purpose:

| | `/api/subscribe` | `/api/free-claim` |
| --- | --- | --- |
| Waits for Kit | yes — no download to protect, so it reports the truth | no — the pack is released first |
| On Kit failure | shows an error, email still saved | visitor never sees it, email still saved |
| Rate limit | 6/hour per IP | 12/hour per IP |

Both write to KV before contacting Kit, so no path loses a signup.

## Reading the list

Subscribers are stored in KV under `subscriber:<email>`, independent of Kit, and
both forms write to the same record:

```bash
npx wrangler kv key list --namespace-id 5a13154ac31c4764a00f3e8e1888a4e7 --prefix "subscriber:"
```

Each record keeps `source` (first touch — where they originally came from, e.g.
`ig-dm`) and `lastSource` (their most recent form), plus `packId` if they
claimed a pack.

`kit: "failed"` on a record means Kit never accepted it — those are the ones to
re-add by hand.

## Not done yet

- **No pixels.** There is no Meta Pixel or GA on the site, so claims are not yet
  tracked for retargeting. Needs your pixel IDs.
- **No backup email.** The download link appears on the page but is not emailed.
  Easiest fix: build a Kit automation that sends the link when someone joins the
  form, so Kit does the sending rather than the site.
