import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';

function Arrow() {
  return <span aria-hidden="true">→</span>;
}

// Paddle sends the buyer here after checkout with the transaction id. A payment
// only becomes a download once the webhook has landed and minted a token, which
// is usually a beat behind the buyer — so poll rather than assume.
const POLL_INTERVAL_MS = 2000;
const POLL_TIMEOUT_MS = 90000;

export default function Download() {
  const [params] = useSearchParams();
  // Paddle appends _ptxn on its own redirect; `transaction` is ours.
  const transactionId = params.get('transaction') ?? params.get('_ptxn');
  // Links issued by hand carry the token itself, with no transaction behind it.
  const directToken = params.get('token');

  const [state, setState] = React.useState('waiting');
  const [packs, setPacks] = React.useState([]);

  React.useEffect(() => {
    document.title = 'Your download — MCP Audio';
  }, []);

  React.useEffect(() => {
    if (directToken) {
      let stale = false;
      fetch(`/api/grant/${encodeURIComponent(directToken)}`)
        .then((r) => r.json())
        .then((b) => {
          if (stale) return;
          if (b.ready) {
            setPacks(b.packs ?? []);
            setState('ready');
          } else {
            setState('notfound');
          }
        })
        .catch(() => !stale && setState('notfound'));
      return () => {
        stale = true;
      };
    }

    if (!transactionId) return;

    let cancelled = false;
    const startedAt = Date.now();

    async function poll() {
      try {
        const res = await fetch(`/api/claim/${encodeURIComponent(transactionId)}`);
        const body = await res.json();

        if (cancelled) return;

        if (body.ready) {
          setPacks(body.packs ?? []);
          setState('ready');
          return;
        }
      } catch {
        // Network blips are expected mid-poll; the timeout below is the backstop.
      }

      if (cancelled) return;

      if (Date.now() - startedAt > POLL_TIMEOUT_MS) {
        setState('timeout');
        return;
      }
      setTimeout(poll, POLL_INTERVAL_MS);
    }

    poll();
    return () => {
      cancelled = true;
    };
  }, [transactionId, directToken]);

  let body;

  if (state === 'notfound') {
    body = (
      <>
        <h1>This link has expired</h1>
        <p>
          Download links last 90 days. Email hello@mcpaudio.com with the address
          you bought under and we’ll issue a fresh one.
        </p>
      </>
    );
  } else if (!transactionId && !directToken) {
    body = (
      <>
        <h1>Nothing to download here</h1>
        <p>
          This page appears after a purchase. If you’ve just bought a pack and
          landed here by mistake, email hello@mcpaudio.com and we’ll sort it out.
        </p>
        <Link to="/samples" className="button button-primary">
          Browse the library <Arrow />
        </Link>
      </>
    );
  } else if (state === 'ready') {
    body = (
      <>
        <h1>Thank you — {packs.length > 1 ? 'your packs are' : 'your pack is'} ready</h1>
        <div className="download-actions">
          {packs.map((pack) => (
            <a key={pack.packId} className="button button-primary" href={pack.url}>
              {pack.filename} <Arrow />
            </a>
          ))}
        </div>
        <p className="download-note eyebrow">
          Save this page — the links stay good for 90 days and up to 10 downloads.
        </p>
      </>
    );
  } else if (state === 'timeout') {
    body = (
      <>
        <h1>Your payment went through</h1>
        <p>
          The download is taking longer than usual to prepare. Refresh in a minute,
          or email hello@mcpaudio.com and we’ll send it over directly.
        </p>
      </>
    );
  } else {
    body = (
      <>
        <h1>Preparing your download…</h1>
        <p>Payment confirmed. This usually takes a few seconds.</p>
      </>
    );
  }

  return (
    <main id="main">
      <section className="tiny-hero" aria-labelledby="download-title">
        <div className="shell tiny-hero-inner">
          <div className="download-panel" id="download-title">{body}</div>
        </div>
      </section>
    </main>
  );
}
