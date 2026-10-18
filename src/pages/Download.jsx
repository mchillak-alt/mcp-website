import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';

function Arrow() {
  return <span aria-hidden="true">→</span>;
}

// Whop's checkout redirects here with `payment` and `status`. The payment only
// becomes a download once the webhook has landed and minted a token, which is
// usually a beat behind this redirect — so poll rather than assume.
const POLL_INTERVAL_MS = 2000;
const POLL_TIMEOUT_MS = 90000;

export default function Download() {
  const [params] = useSearchParams();
  const paymentId = params.get('payment');
  const status = params.get('status');

  const [state, setState] = React.useState('waiting');
  const [grant, setGrant] = React.useState(null);

  React.useEffect(() => {
    document.title = 'Your download — MCP Audio';
  }, []);

  React.useEffect(() => {
    // Never treat the visit as a sale without checking status first.
    if (status !== 'succeeded' || !paymentId) return;

    let cancelled = false;
    const startedAt = Date.now();

    async function poll() {
      try {
        const res = await fetch(`/api/claim/${encodeURIComponent(paymentId)}`);
        const body = await res.json();

        if (cancelled) return;

        if (body.ready) {
          setGrant(body);
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
  }, [paymentId, status]);

  let body;

  if (status === 'canceled') {
    body = (
      <>
        <h1>Checkout canceled</h1>
        <p>Nothing was charged. You can pick up where you left off whenever you like.</p>
        <Link to="/samples" className="button button-primary">
          Back to the library <Arrow />
        </Link>
      </>
    );
  } else if (status === 'failed') {
    body = (
      <>
        <h1>That payment didn’t go through</h1>
        <p>No charge was made. Trying again with another card usually sorts it.</p>
        <Link to="/samples" className="button button-primary">
          Back to the library <Arrow />
        </Link>
      </>
    );
  } else if (status !== 'succeeded' || !paymentId) {
    body = (
      <>
        <h1>Nothing to download here</h1>
        <p>This page appears after a purchase. If you’ve just bought a pack, use the link in your receipt email.</p>
        <Link to="/samples" className="button button-primary">
          Browse the library <Arrow />
        </Link>
      </>
    );
  } else if (state === 'ready') {
    body = (
      <>
        <h1>Thank you — your pack is ready</h1>
        <p>{grant.filename}</p>
        <a className="button button-primary" href={grant.url}>
          Download <Arrow />
        </a>
        <p className="eyebrow" style={{ marginTop: '2rem' }}>
          Save this link — it stays good for 90 days and up to 10 downloads.
        </p>
      </>
    );
  } else if (state === 'timeout') {
    body = (
      <>
        <h1>Your payment went through</h1>
        <p>
          The download is taking longer than usual to prepare. Refresh in a minute,
          or email support and we’ll send it over directly.
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
        <div className="shell tiny-hero-inner" style={{ textAlign: 'center', padding: '6rem 0' }}>
          <div className="tiny-identity" id="download-title">{body}</div>
        </div>
      </section>
    </main>
  );
}
