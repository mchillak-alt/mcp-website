import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { samples } from '../data/samples';
import { getPaddle, paddleCheckoutEnabled } from '../lib/paddle';

function Arrow({ diagonal = false }) {
  return <span aria-hidden="true">{diagonal ? "↗" : "→"}</span>;
}

export default function SamplePack() {
  const { id } = useParams();
  const pack = samples.find(s => s.id === id);
  const [status, setStatus] = React.useState('idle');
  const paddleOn = paddleCheckoutEnabled(window.location.search);
  const [email, setEmail] = React.useState('');
  const [freeState, setFreeState] = React.useState('idle');
  const [freeUrl, setFreeUrl] = React.useState(null);
  const [freeError, setFreeError] = React.useState(null);

  const claimFree = React.useCallback(async (event) => {
    event.preventDefault();
    setFreeState('sending');
    setFreeError(null);
    try {
      const res = await fetch('/api/free-claim', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, packId: pack.id }),
      });
      const body = await res.json();
      if (!res.ok) {
        setFreeError(body.error ?? 'Something went wrong. Try again?');
        setFreeState('idle');
        return;
      }
      setFreeUrl(body.url);
      setFreeState('ready');
    } catch {
      setFreeError('Something went wrong. Try again?');
      setFreeState('idle');
    }
  }, [email, pack]);


  const openCheckout = React.useCallback(async () => {
    setStatus('opening');
    try {
      const paddle = await getPaddle();
      paddle.Checkout.open({
        items: [{ priceId: pack.priceId, quantity: 1 }],
        settings: {
          variant: 'one-page',
          // Deliberately no successUrl: Paddle redirects there the instant
          // payment completes, with no transaction id attached, which beats
          // our checkout.completed handler to the navigation. Without it the
          // overlay holds and the handler redirects with the id.
        },
      });
      setStatus('idle');
    } catch {
      setStatus('error');
    }
  }, [pack]);


  React.useEffect(() => {
    if (pack) {
      document.title = `${pack.title} — MCP Audio`;
    }
  }, [pack]);

  if (!pack) {
    return (
      <main id="main" className="shell" style={{ padding: '8rem 0', textAlign: 'center' }}>
        <h2>Sample pack not found.</h2>
        <Link to="/samples" className="button button-outline" style={{ marginTop: '2rem' }}>
          Back to library <Arrow />
        </Link>
      </main>
    );
  }

  return (
    <main id="main">
      <section className="tiny-hero" aria-labelledby="pack-title">
        <div className="shell tiny-hero-inner">
          <div className="hero-topline eyebrow">
            <Link to="/samples">← The Library</Link>
            <span>Curated Sound</span>
          </div>
          
          <div className="product-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center', marginTop: '2rem' }}>
            <div className="product-image">
              <img 
                src={pack.image} 
                alt={pack.title}
                style={{ width: '100%', height: 'auto', borderRadius: 'var(--interface-radius)' }}
              />
            </div>
            
            <div className="tiny-identity" style={{ textAlign: 'left', margin: '0' }}>
              <p className="eyebrow">
                <span className="status-dot" /> Sample Library
              </p>
              <h1 id="pack-title" style={{ fontSize: '3rem', margin: '1rem 0' }}>
                {pack.title}
              </h1>
              <p style={{ fontSize: '1.25rem', marginBottom: '2rem', maxWidth: '100%', whiteSpace: 'pre-line' }}>
                {pack.description}
              </p>
              
              <div className="pricing-buy" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <span style={{ fontSize: '1.5rem', fontFamily: 'var(--font-medium)' }}>
                  {pack.price === 0 ? "Free" : `$${pack.price}`}
                </span>
                {pack.price === 0 ? null : !paddleOn ? (
                  // Checkout is being migrated to Paddle. Until it is live,
                  // send interest to us rather than to a checkout we cannot
                  // fulfil — the packs exceed Whop's 128MB delivery limit.
                  <a
                    className="button button-primary"
                    href={`mailto:hello@mcpaudio.com?subject=${encodeURIComponent(`Notify me — ${pack.title}`)}`}
                  >
                    Notify me <Arrow />
                  </a>
                ) : (
                  <button
                    type="button"
                    className="button button-primary"
                    onClick={openCheckout}
                    disabled={status === 'opening'}
                  >
                    {status === 'opening' ? 'Opening…' : 'Buy'} <Arrow />
                  </button>
                )}
              </div>

              {pack.price === 0 && (
                <div className="free-claim">
                  {freeState === 'ready' ? (
                    <>
                      <a className="button button-primary" href={freeUrl}>
                        Download {pack.title} <Arrow />
                      </a>
                      <p className="free-claim-note">
                        Check your inbox too — you’re on the list for new packs.
                      </p>
                    </>
                  ) : (
                    <form onSubmit={claimFree}>
                      <label htmlFor="free-email">
                        Enter your email and the pack is yours.
                      </label>
                      <div className="free-claim-row">
                        <input
                          id="free-email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          autoComplete="email"
                        />
                        <button
                          type="submit"
                          className="button button-primary"
                          disabled={freeState === 'sending'}
                        >
                          {freeState === 'sending' ? 'Sending…' : 'Get it'} <Arrow />
                        </button>
                      </div>
                      <p className="free-claim-note">
                        You’ll join the MCP Audio list and hear when new packs land.
                        Unsubscribe any time — we don’t share your address.
                      </p>
                      {freeError && <p className="free-claim-error">{freeError}</p>}
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="tiny-hero-caption eyebrow" style={{ marginTop: '4rem' }}>
            <span>
              {status === 'error'
                ? "Checkout couldn't open. Email hello@mcpaudio.com and we'll sort it out."
                : 'Available for instant download.'}
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}
