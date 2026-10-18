import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { legalPages, LAST_UPDATED } from '../data/legal';

export default function Legal() {
  const { page } = useParams();
  const doc = legalPages[page];

  React.useEffect(() => {
    if (doc) document.title = `${doc.title} — MCP Audio`;
  }, [doc]);

  if (!doc) {
    return (
      <main id="main" className="shell" style={{ padding: '8rem 0', textAlign: 'center' }}>
        <h2>Page not found.</h2>
        <Link to="/" className="button button-outline" style={{ marginTop: '2rem' }}>
          Back home
        </Link>
      </main>
    );
  }

  return (
    <main id="main">
      <section className="tiny-hero" aria-labelledby="legal-title">
        <div className="shell tiny-hero-inner">
          <div className="hero-topline eyebrow">
            <Link to="/">← MCP Audio</Link>
            <span>Last updated {LAST_UPDATED}</span>
          </div>

          <div className="legal-doc" style={{ maxWidth: '44rem', margin: '3rem auto 0', textAlign: 'left' }}>
            <h1 id="legal-title" style={{ fontSize: '2.5rem', marginBottom: '3rem' }}>
              {doc.title}
            </h1>

            {doc.sections.map((section) => (
              <section key={section.heading} style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>
                  {section.heading}
                </h2>
                <p style={{ whiteSpace: 'pre-line', lineHeight: 1.7 }}>{section.body}</p>
              </section>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
