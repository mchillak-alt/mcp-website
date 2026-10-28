import React from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { freePack, INSTAGRAM_HANDLE, INSTAGRAM_URL } from '../data/freePack';
import { samples } from '../data/samples';

function Arrow({ diagonal = false }) {
  return <span aria-hidden="true">{diagonal ? '↗' : '→'}</span>;
}

// The claim page behind the Instagram DM link. Two jobs, in this order:
// send people to @mcp_audio, and take an email on the way to the download.
//
// The follow step is deliberately a link and not a gate — Instagram gives a
// website no way to check whether someone follows an account, so anything that
// claimed to verify it would be theatre.
export default function FreePack() {
  // /free serves the featured pack; /free/:id is there for a second one later.
  const { id } = useParams();
  const [search] = useSearchParams();

  const [email, setEmail] = React.useState('');
  const [firstName, setFirstName] = React.useState('');
  const [company, setCompany] = React.useState(''); // honeypot
  const [state, setState] = React.useState('idle'); // idle | loading | done | error
  const [error, setError] = React.useState('');
  const [packs, setPacks] = React.useState([]);

  const upsells = freePack.upsell
    .map((packId) => samples.find((s) => s.id === packId))
    .filter(Boolean);

  React.useEffect(() => {
    document.title = `${freePack.title} — free download — MCP Audio`;
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setState('loading');
    setError('');

    try {
      const res = await fetch('/api/free-claim', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          packId: id ?? freePack.id,
          email,
          firstName,
          company,
          // Lets a DM link carry ?src=ig-dm so claims are attributable.
          source: search.get('src') ?? 'free-page',
          referrer: document.referrer || null,
        }),
      });

      const body = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(body.error ?? 'Something went wrong. Try again in a moment.');
        setState('error');
        return;
      }

      setPacks(body.packs ?? []);
      setState('done');
    } catch {
      setError('Could not reach the server. Check your connection and try again.');
      setState('error');
    }
  }

  const follow = (
    <a
      className="button button-primary"
      href={INSTAGRAM_URL}
      target="_blank"
      rel="noreferrer"
    >
      Follow @{INSTAGRAM_HANDLE} <Arrow diagonal />
    </a>
  );

  return (
    <main id="main">
      <section className="tiny-hero" aria-labelledby="free-title">
        <div className="shell tiny-hero-inner">
          <div className="hero-topline eyebrow">
            <Link to="/samples">← The Library</Link>
            <span>@{INSTAGRAM_HANDLE}</span>
          </div>

          <div className="free-claim">
            <p className="eyebrow">
              <span className="status-dot" /> {freePack.eyebrow}
            </p>
            <h1 id="free-title">{freePack.title}</h1>
            <p className="free-claim-blurb">{freePack.blurb}</p>

            {freePack.contents?.length > 0 && (
              <ul className="free-claim-contents">
                {freePack.contents.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            )}

            {state === 'done' ? (
              <div className="free-claim-done">
                <h2>Your pack is ready</h2>
                <div className="download-actions">
                  {packs.map((pack) => (
                    <a
                      key={pack.packId}
                      className="button button-primary"
                      href={pack.url}
                    >
                      Download {pack.filename} <Arrow />
                    </a>
                  ))}
                </div>
                <p className="eyebrow free-claim-note">
                  Save this page — the link stays good for 90 days.
                </p>

                <div className="free-claim-follow">
                  <p>
                    One more thing — the next kit drops on Instagram first.
                  </p>
                  {follow}
                </div>
              </div>
            ) : (
              <div className="free-claim-steps">
                <div className="free-claim-step">
                  <p className="eyebrow">Step 01 — Follow for the next drop</p>
                  {follow}
                </div>

                <div className="free-claim-step">
                  <p className="eyebrow">Step 02 — Where should it go?</p>
                  <form className="signup-form" onSubmit={handleSubmit}>
                    <label className="sr-only" htmlFor="free-name">
                      First name (optional)
                    </label>
                    <input
                      id="free-name"
                      type="text"
                      autoComplete="given-name"
                      placeholder="First name (optional)"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      disabled={state === 'loading'}
                    />
                    <label className="sr-only" htmlFor="free-email">
                      Email address
                    </label>
                    <input
                      id="free-email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={state === 'loading'}
                    />
                    {/* Bots fill every field they find; humans never see this. */}
                    <input
                      type="text"
                      name="company"
                      tabIndex={-1}
                      autoComplete="off"
                      aria-hidden="true"
                      className="free-claim-honeypot"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                    />
                    <button type="submit" disabled={state === 'loading'}>
                      {state === 'loading' ? 'Sending…' : 'Get the pack'} <Arrow />
                    </button>
                    {state === 'error' && (
                      <p className="signup-error" role="alert">
                        {error}
                      </p>
                    )}
                  </form>
                  <p className="eyebrow free-claim-note">
                    No card needed. We'll email you when the next kit drops —
                    unsubscribe any time.
                  </p>
                </div>
              </div>
            )}

            {upsells.length > 0 && (
              <div className="free-claim-upsell">
                <p className="eyebrow">Also from the library</p>
                <div className="free-claim-upsell-grid">
                  {upsells.map((pack) => (
                    <Link
                      key={pack.id}
                      to={`/samples/${pack.id}`}
                      className="free-claim-upsell-card"
                    >
                      <img src={pack.image} alt="" />
                      <span className="free-claim-upsell-title">{pack.title}</span>
                      <span className="eyebrow">${pack.price}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
