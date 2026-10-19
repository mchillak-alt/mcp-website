import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { samples } from '../data/samples';
import { getPaddle } from '../lib/paddle';

function Arrow({ diagonal = false }) {
  return <span aria-hidden="true">{diagonal ? "↗" : "→"}</span>;
}

export default function SamplePack() {
  const { id } = useParams();
  const navigate = useNavigate();
  const pack = samples.find(s => s.id === id);
  const [status, setStatus] = React.useState('idle');

  const openCheckout = React.useCallback(async () => {
    setStatus('opening');
    try {
      const paddle = await getPaddle();
      paddle.Checkout.open({
        items: [{ priceId: pack.priceId, quantity: 1 }],
        settings: {
          variant: 'one-page',
          // Fallback if the completed event is missed; Paddle appends _ptxn.
          successUrl: `${window.location.origin}/download`,
        },
        eventCallback(event) {
          // The transaction id is what the download page claims against. Taking
          // it from the event is more reliable than parsing the redirect URL.
          if (event?.name === 'checkout.completed') {
            const txn = event.data?.transaction_id;
            if (txn) navigate(`/download?transaction=${encodeURIComponent(txn)}`);
          }
          if (event?.name === 'checkout.error') setStatus('error');
        },
      });
      setStatus('idle');
    } catch {
      setStatus('error');
    }
  }, [pack, navigate]);


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
                {pack.price === 0 ? (
                  <a className="button button-primary" href={`/api/free/${pack.id}`}>
                    Download <Arrow />
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
