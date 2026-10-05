import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { samples } from '../data/samples';

function Arrow({ diagonal = false }) {
  return <span aria-hidden="true">{diagonal ? "↗" : "→"}</span>;
}

export default function SamplePack() {
  const { id } = useParams();
  const pack = samples.find(s => s.id === id);

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
              <p style={{ fontSize: '1.25rem', marginBottom: '2rem', maxWidth: '100%' }}>
                {pack.description}
              </p>
              
              <div className="pricing-buy" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <span style={{ fontSize: '1.5rem', fontFamily: 'var(--font-medium)' }}>
                  {pack.price === 0 ? "Free" : `$${pack.price}`}
                </span>
                {/* Whop Checkout Link Integration */}
                <a 
                  href={pack.checkoutUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="button button-primary"
                >
                  {pack.price === 0 ? "Download" : "Buy"} <Arrow diagonal />
                </a>
              </div>
            </div>
          </div>

          <div className="tiny-hero-caption eyebrow" style={{ marginTop: '4rem' }}>
            <span>Available for instant download.</span>
          </div>
        </div>
      </section>
    </main>
  );
}
