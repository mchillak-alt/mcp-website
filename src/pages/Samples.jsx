import React from 'react';
import { Link } from 'react-router-dom';
import { samples } from '../data/samples';

function Circuit({ className = "" }) {
  return (
    <svg
      className={`circuit ${className}`}
      viewBox="0 0 480 65"
      fill="none"
      aria-hidden="true"
    >
      <path d="M0 32H90L99 22L109 42L119 22L129 42L139 32H224V10H310V32H470" />
      <circle cx="224" cy="32" r="3" />
      <circle cx="470" cy="32" r="5" />
      <path d="M280 32V57M266 57H294M272 61H288M278 65H282" />
    </svg>
  );
}

export default function Samples() {
  React.useEffect(() => {
    document.title = "Samples — MCP Audio";
  }, []);

  return (
    <main id="main">
      <section className="home-hero shell" aria-labelledby="samples-title">
        <div className="hero-topline eyebrow">
          <span>SAMPLE LIBRARIES <span className="tiny-cross" aria-hidden="true">+</span> CURATED TONE & TEXTURE.</span>
        </div>
        <div className="home-hero-copy">
          <h1 id="samples-title">
            Sounds.
            <br />
            With
            <br />
            character.
          </h1>
          <p className="hero-description">
            Unique one-shots and melodic collections.
            <br className="desktop-break" /> Hand-crafted for your productions.
          </p>
        </div>
        <div className="hero-bottom">
          <span className="eyebrow">Designed by Mischa Chillak</span>
          <Circuit />
        </div>
      </section>

      <div className="index-strip">
        <div className="shell">
          <span className="status">
            <span className="status-dot" /> Explore the archives
          </span>
          <span className="eyebrow strip-last">Sound comes naturally.</span>
        </div>
      </div>

      <section className="plugins-section shell" id="library">
        <div className="section-heading">
          <p className="eyebrow">01 / The Library</p>
          <h2>
            Original recordings.
            <br />
            <span>Analog processing.</span>
          </h2>
          <p>
            Collections of sounds made with purpose.
          </p>
        </div>

        <div className="samples-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '3rem' }}>
          {samples.map((pack) => (
            <article key={pack.id} className="sample-pack-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Link to={`/samples/${pack.id}`} className="product-art sample-hover-effect" style={{ position: 'relative', display: 'block', aspectRatio: '1/1', overflow: 'hidden', borderRadius: 'var(--interface-radius)' }}>
                <img 
                  src={pack.image} 
                  alt={pack.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </Link>
              <div style={{ paddingTop: '1rem' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem', fontFamily: 'var(--font-medium)' }}>{pack.title}</h3>
                <div className="product-meta eyebrow" style={{ margin: '0' }}>
                  <span>{pack.price === 0 ? "Free" : `$${pack.price}`}</span>
                </div>
                <Link className="text-link" to={`/samples/${pack.id}`} style={{ marginTop: '0.75rem', display: 'inline-block' }}>
                  View details <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
