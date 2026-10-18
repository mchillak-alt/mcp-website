import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Checkout, CheckoutElement } from '@whop/elements-react';
import { samples } from '../data/samples';

function Arrow({ diagonal = false }) {
  return <span aria-hidden="true">{diagonal ? "↗" : "→"}</span>;
}

export default function SamplePack() {
  const { id } = useParams();
  const pack = samples.find(s => s.id === id);
  const [checkoutOpen, setCheckoutOpen] = React.useState(false);

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
                {!checkoutOpen && (
                  <button
                    type="button"
                    className="button button-primary"
                    onClick={() => setCheckoutOpen(true)}
                  >
                    {pack.price === 0 ? "Get it" : "Buy"} <Arrow />
                  </button>
                )}
              </div>
            </div>
          </div>

          {checkoutOpen && (
            <div className="pack-checkout" style={{ marginTop: '4rem', maxWidth: '34rem', marginInline: 'auto' }}>
              {/* Payment is collected in Whop's iframe; the pack itself is
                  delivered from our own storage once the webhook confirms. */}
              <Checkout
                plan={pack.planId}
                returnUrl={`${window.location.origin}/download`}
                metadata={{ packId: pack.id }}
              >
                <CheckoutElement />
              </Checkout>
            </div>
          )}

          <div className="tiny-hero-caption eyebrow" style={{ marginTop: '4rem' }}>
            <span>Available for instant download.</span>
          </div>
        </div>
      </section>
    </main>
  );
}
