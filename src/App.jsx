import { useEffect, useRef, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Link } from "react-router-dom";
import Samples from "./pages/Samples";
import SamplePack from "./pages/SamplePack";
import logo from "./assets/logo.svg";
import originalLogo from "./assets/logo.png";
import botanical from "./assets/tinychain-art.png";
import tinychainScreenshot from "./assets/tinychain-screenshot.png";
import bandzScreenshot from "./assets/bandz-screenshot.png";
import "./App.css";

const stages = [
  {
    id: "tilt",
    title: "Find your balance.",
    name: "Tilt & filters",
    text: "Tilt, high-pass, and low-pass controls keep your tone shaping together, right at the start of the chain.",
    number: "01",
  },
  {
    id: "drive",
    title: "Turn up the character.",
    name: "Drive",
    text: "Give drive its own place in the chain. A dedicated dry/wet control lets you decide how much of the effect comes through.",
    number: "02",
  },
  {
    id: "tape",
    title: "Add a little movement.",
    name: "Tape",
    text: "Explore the tape section with Flutter, Speed, and Azimuth controls. Switch it in when the sound calls for it.",
    number: "03",
  },
  {
    id: "out",
    title: "Bring it all together.",
    name: "Output",
    text: "Finish with output and compression controls, then use Match and Bypass to check your choices.",
    number: "04",
  },
];
const bandzStages = [
  {
    id: "bands",
    title: "Shape the frequencies.",
    name: "Frequency Bands",
    text: "Adjust specific frequency bands to sculpt your sound with precision.",
    number: "01",
  },
  {
    id: "master",
    title: "Control the output.",
    name: "Master Controls",
    text: "Fine-tune the overall level and balance of the processed signal.",
    number: "02",
  },
];
function Arrow({ diagonal = false }) {
  return <span aria-hidden="true">{diagonal ? "↗" : "→"}</span>;
}
function Status({ children = "Currently in beta" }) {
  return (
    <span className="status">
      <span className="status-dot" />
      {children}
    </span>
  );
}
function Header() {
  const dialog = useRef(null);
  const [notice, setNotice] = useState("cart");
  const notices = {
    samples: {
      title: "Samples",
      text: "Sample libraries are coming later. TinyChain and Bandz are currently in beta.",
    },
    account: {
      title: "Account",
      text: "Customer accounts will be available when the store opens.",
    },
    cart: {
      title: "Your cart is empty.",
      text: "TinyChain and Bandz are currently in beta. Purchases will open at launch.",
    },
  };
  function openNotice(event, name) {
    event.preventDefault();
    setNotice(name);
    dialog.current.showModal();
  }
  return (
    <>
      <header className="original-header">
        <div className="original-header-inner">
          <a className="original-logo" href="/" aria-label="MCP Audio home">
            <img
              src={originalLogo}
              alt="Mischa Chillak presents"
              width="631"
              height="195"
            />
          </a>
          <div className="original-header-wire" aria-hidden="true" />
          <nav className="original-nav" aria-label="Main navigation">
            <a href="/#plugins">Plugins</a>
            <Link to="/samples">Samples</Link>
            <a
              href="#account"
              aria-haspopup="dialog"
              onClick={(event) => openNotice(event, "account")}
            >
              Account
            </a>
            <button
              className="original-cart"
              type="button"
              aria-haspopup="dialog"
              onClick={(event) => openNotice(event, "cart")}
            >
              Cart (0)
            </button>
          </nav>
        </div>
      </header>
      <dialog
        className="store-notice"
        ref={dialog}
        aria-labelledby="store-notice-title"
      >
        <button
          className="notice-close"
          type="button"
          onClick={() => dialog.current.close()}
        >
          Close ×
        </button>
        <h2 id="store-notice-title">{notices[notice].title}</h2>
        <p>{notices[notice].text}</p>
        <a
          className="button button-outline"
          href="#launch"
          onClick={() => dialog.current.close()}
        >
          Launch updates <Arrow />
        </a>
      </dialog>
    </>
  );
}
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
function LaunchSection() {
  return (
    <section
      className="launch-section"
      id="launch"
      aria-labelledby="launch-title"
    >
      <div className="shell launch-layout">
        <div>
          <p className="eyebrow">
            <span className="status-dot" /> A work in progress. A sound of our
            own.
          </p>
          <h2 id="launch-title">
            Good things
            <br />
            are <span>taking shape.</span>
          </h2>
        </div>
        <div className="launch-copy">
          <Status>TinyChain & Bandz · in beta</Status>
          <p>
            We’re putting the finishing touches on our first two plugins. Take a
            look around, get to know the tools, and check back for launch news.
          </p>
          <div className="signup-pending">
            <span className="plus" aria-hidden="true">
              +
            </span>
            <span>Launch notifications opening soon</span>
          </div>
          <p className="fineprint">
            Release details and audio demos will be shared here as they’re
            ready.
          </p>
        </div>
      </div>
    </section>
  );
}
function Home() {
  return (
    <>
      <section className="home-hero shell" aria-labelledby="home-title">
        <div className="hero-topline eyebrow">
          <span>DIGITAL AUDIO TOOLS <span className="tiny-cross" aria-hidden="true">+</span> MADE FOR ORGANIC SOUND.</span>
        </div>
        <div className="home-hero-copy">
          <h1 id="home-title">
            Audio tools.
            <br />
            Individual
            <br />
            character.
          </h1>
          <p className="hero-description">
            Tone, texture, and frequency shaping.
            <br className="desktop-break" /> Two plugins from Mischa Chillak.
          </p>
          <a className="button button-primary" href="#plugins">
            Meet the plugins <Arrow />
          </a>
        </div>
        <div className="hero-bottom">
          <span className="eyebrow">Designed by Mischa Chillak</span>
          <Circuit />
        </div>
      </section>
      <div className="index-strip">
        <div className="shell">
          <Status>Two tools. Taking shape.</Status>
          <span className="eyebrow">
            TinyChain <span className="separator">/</span> Bandz
          </span>
          <span className="eyebrow strip-last">Sound comes naturally.</span>
        </div>
      </div>
      <section
        className="plugins-section shell"
        id="plugins"
        aria-labelledby="plugins-title"
      >
        <div className="section-heading">
          <p className="eyebrow">01 / The instruments</p>
          <h2 id="plugins-title">
            Small details.
            <br />
            <span>A different feeling.</span>
          </h2>
          <p>
            Two ways into your sound.
            <br />
            One shared attention to character.
          </p>
        </div>
        <article className="featured-product">
          <a
            href="/tinychain"
            className="product-art"
            aria-label="Explore TinyChain"
          >
            <div className="art-corners" aria-hidden="true">
              <span>+</span>
              <span>+</span>
            </div>
            <img
              className="plugin-screenshot"
              src={tinychainScreenshot}
              alt="TinyChain beta interface with input and output meters, Tilt, Drive, Tape, and output controls"
              width="2242"
              height="1400"
              loading="lazy"
              decoding="async"
            />
            <div className="art-caption eyebrow">
              <span>Fig. 01 — TinyChain</span>
              <span>Beta interface</span>
            </div>
          </a>
          <div className="featured-copy">
            <div className="product-meta eyebrow">
              <span>001 / Tone & character</span>
              <Status>In beta</Status>
            </div>
            <h3>TinyChain</h3>
            <p className="product-tagline">
              A small chain.
              <br />
              Room to make it yours.
            </p>
            <p>
              Tone shaping, drive, and tape controls in one considered space.
              Follow the signal, explore the details, and find your own balance.
            </p>
            <div className="signal-list eyebrow">
              <span>Tilt</span>
              <span>Drive</span>
              <span>Tape</span>
              <span>Out</span>
            </div>
            <a className="button button-outline" href="/tinychain">
              Discover TinyChain <Arrow />
            </a>
          </div>
        </article>
        <article className="bandz-preview">
          <a href="/bandz" className="bandz-label" style={{textDecoration: 'none', color: 'inherit'}}>
            <span className="eyebrow">002 / Frequency shaping</span>
            <h3>Bandz</h3>
          </a>
          <a href="/bandz">
            <img
              className="bandz-screenshot"
              src={bandzScreenshot}
              alt="Bandz beta interface with paired rows of frequency faders and master controls"
              width="2162"
              height="1620"
              loading="lazy"
              decoding="async"
            />
          </a>
          <div className="bandz-copy">
            <Status>Also in beta</Status>
            <p>
              A closer look at the details.
              <br />
              More on Bandz soon.
            </p>
            <a className="text-link" href="/bandz">
              Discover Bandz <Arrow />
            </a>
          </div>
        </article>
      </section>
      <section
        className="philosophy shell"
        id="approach"
        aria-labelledby="approach-title"
      >
        <div className="philosophy-label">
          <p className="eyebrow">02 / A natural connection</p>
          <Circuit />
        </div>
        <div>
          <h2 id="approach-title">
            Precision in the controls.
            <br />
            <span>Personality in the sound.</span>
          </h2>
          <p>
            Clean lines meet organic details. Familiar controls leave room for
            discovery. MCP Audio brings that same approach to every tool:
            something considered, tactile, and inviting to make music with.
          </p>
          <span className="signature">
            Mischa Chillak <span>/ MCP Audio</span>
          </span>
        </div>
      </section>
      <LaunchSection />
    </>
  );
}
function TinyChain() {
  const [selected, setSelected] = useState("tilt");
  const current = stages.find((stage) => stage.id === selected);
  return (
    <>
      <section className="tiny-hero" aria-labelledby="tiny-title">
        <img
          className="tiny-botanical"
          src={botanical}
          alt=""
          fetchPriority="high"
        />
        <div className="shell tiny-hero-inner">
          <div className="hero-topline eyebrow">
            <a href="/#plugins">← All plugins</a>
            <span>001 / MCP Audio</span>
          </div>
          <div className="tiny-identity">
            <p className="eyebrow">
              <span className="status-dot" /> Tone. Texture. A little movement.
            </p>
            <h1 id="tiny-title">
              Tiny<span>Chain</span>
              <span className="title-terminal" aria-hidden="true" />
            </h1>
            <div className="identity-bottom">
              <div className="identity-wire" aria-hidden="true" />
              <p>
                Tilt. Drive. Tape.
                <br />
                Find your own kind of character.
              </p>
              <span className="eyebrow identity-credit">
                Developed by
                <br />
                <strong>Mischa Chillak</strong>
              </span>
            </div>
          </div>
          <div className="tiny-hero-caption eyebrow">
            <span>Nature in the details.</span>
            <span>001 — TinyChain / In development</span>
          </div>
        </div>
      </section>
      <div className="product-action-strip">
        <div className="shell">
          <Status>TinyChain / In beta</Status>
          <div>
            <a className="text-link" href="#inside">
              Explore the controls <span aria-hidden="true">↓</span>
            </a>
            <a className="button button-primary" href="#launch">
              Launch updates <Arrow />
            </a>
          </div>
        </div>
      </div>
      <section
        className="inside-section shell"
        id="inside"
        aria-labelledby="inside-title"
      >
        <div className="section-heading">
          <p className="eyebrow">01 / Inside the chain</p>
          <h2 id="inside-title">
            Everything in its place.
            <br />
            <span>Nothing in your way.</span>
          </h2>
          <p>
            From the first adjustment
            <br />
            to the finishing touch.
          </p>
        </div>
        <div className="interface-stage">
          <div className="interface-stage-label eyebrow">
            <span>MCP Audio / TinyChain</span>
            <a href={tinychainScreenshot} target="_blank" rel="noreferrer">
              View full-size screenshot ↗
            </a>
          </div>
          <img
            className="plugin-screenshot"
            src={tinychainScreenshot}
            alt="Original TinyChain beta screenshot showing all plugin controls"
            width="2242"
            height="1400"
            loading="lazy"
            decoding="async"
          />
          <div className="interface-stage-label eyebrow">
            <span>Input → Tilt → Drive → Tape → Output</span>
            <span>Follow the signal.</span>
          </div>
        </div>
        <div className="feature-explorer">
          <div
            className="stage-selector"
            aria-label="Explore TinyChain controls"
          >
            {stages.map((stage) => (
              <button
                key={stage.id}
                type="button"
                aria-pressed={selected === stage.id}
                onClick={() => setSelected(stage.id)}
                className={
                  selected === stage.id ? "stage-button active" : "stage-button"
                }
              >
                <span className="eyebrow">{stage.number}</span>
                <span>{stage.name}</span>
                <Arrow />
              </button>
            ))}
          </div>
          <div
            className="stage-description"
            aria-live="polite"
            aria-atomic="true"
          >
            <p className="eyebrow">Signal notes / {current.number}</p>
            <h3>{current.title}</h3>
            <p>{current.text}</p>
          </div>
        </div>
      </section>
      <section
        className="listening-section shell"
        aria-labelledby="listening-title"
      >
        <div>
          <p className="eyebrow">02 / The listening room</p>
          <h2 id="listening-title">
            The proof is
            <br />
            <span>in the listening.</span>
          </h2>
        </div>
        <div className="listening-card">
          <div className="waveform" aria-hidden="true">
            {Array.from({ length: 47 }, (_, i) => (
              <i
                key={i}
                style={{
                  height: `${12 + Math.sin(i * 1.7) ** 2 * Math.sin((i / 46) * Math.PI) * 70}%`,
                }}
              />
            ))}
          </div>
          <div className="listening-caption">
            <span className="eyebrow">TinyChain / Audio demos</span>
            <span className="coming-label">Coming soon</span>
          </div>
          <p>
            We’re preparing examples from the beta. Hear the controls in context
            when the listening room opens.
          </p>
        </div>
      </section>
      <section className="faq-section shell" aria-labelledby="faq-title">
        <div>
          <p className="eyebrow">03 / A few notes</p>
          <h2 id="faq-title">
            Before you
            <br />
            <span>plug in.</span>
          </h2>
        </div>
        <div className="faq-list">
          <details>
            <summary>
              Can I buy TinyChain yet?<span aria-hidden="true">+</span>
            </summary>
            <p>
              Not yet. TinyChain is currently in beta. Pricing and release
              details will be announced when it’s ready.
            </p>
          </details>
          <details>
            <summary>
              Where can I find compatibility details?
              <span aria-hidden="true">+</span>
            </summary>
            <p>
              Supported formats, operating systems, and installation
              requirements will be published ahead of launch.
            </p>
          </details>
          <details>
            <summary>
              Will there be audio demonstrations?
              <span aria-hidden="true">+</span>
            </summary>
            <p>
              Yes. Audio examples are planned for the listening room on this
              page as the beta progresses.
            </p>
          </details>
        </div>
      </section>
      <LaunchSection />
    </>
  );
}
function Bandz() {
  const [selected, setSelected] = useState("bands");
  const current = bandzStages.find((stage) => stage.id === selected);
  return (
    <>
      <section className="tiny-hero" aria-labelledby="bandz-title">
        <img
          className="tiny-botanical"
          src={botanical}
          alt=""
          fetchPriority="high"
        />
        <div className="shell tiny-hero-inner">
          <div className="hero-topline eyebrow">
            <a href="/#plugins">← All plugins</a>
            <span>002 / MCP Audio</span>
          </div>
          <div className="tiny-identity">
            <p className="eyebrow">
              <span className="status-dot" /> Frequency shaping.
            </p>
            <h1 id="bandz-title">
              Bandz
              <span className="title-terminal" aria-hidden="true" />
            </h1>
            <div className="identity-bottom">
              <div className="identity-wire" aria-hidden="true" />
              <p>
                A closer look at the details.
                <br />
                Shape the character of your sound.
              </p>
              <span className="eyebrow identity-credit">
                Developed by
                <br />
                <strong>Mischa Chillak</strong>
              </span>
            </div>
          </div>
          <div className="tiny-hero-caption eyebrow">
            <span>Precision shaping.</span>
            <span>002 — Bandz / In development</span>
          </div>
        </div>
      </section>
      <div className="product-action-strip">
        <div className="shell">
          <Status>Bandz / In beta</Status>
          <div>
            <a className="text-link" href="#inside">
              Explore the controls <span aria-hidden="true">↓</span>
            </a>
            <a className="button button-primary" href="#launch">
              Launch updates <Arrow />
            </a>
          </div>
        </div>
      </div>
      <section
        className="inside-section shell"
        id="inside"
        aria-labelledby="inside-title"
      >
        <div className="section-heading">
          <p className="eyebrow">01 / Inside the bands</p>
          <h2 id="inside-title">
            Precision control.
            <br />
            <span>Character included.</span>
          </h2>
          <p>
            From the first adjustment
            <br />
            to the finishing touch.
          </p>
        </div>
        <div className="interface-stage">
          <div className="interface-stage-label eyebrow">
            <span>MCP Audio / Bandz</span>
            <a href={bandzScreenshot} target="_blank" rel="noreferrer">
              View full-size screenshot ↗
            </a>
          </div>
          <img
            className="plugin-screenshot"
            src={bandzScreenshot}
            alt="Original Bandz beta screenshot showing frequency faders and master controls"
            width="2162"
            height="1620"
            loading="lazy"
            decoding="async"
          />
          <div className="interface-stage-label eyebrow">
            <span>Frequency Bands → Master Controls</span>
            <span>Follow the signal.</span>
          </div>
        </div>
        <div className="feature-explorer">
          <div
            className="stage-selector"
            aria-label="Explore Bandz controls"
          >
            {bandzStages.map((stage) => (
              <button
                key={stage.id}
                type="button"
                aria-pressed={selected === stage.id}
                onClick={() => setSelected(stage.id)}
                className={
                  selected === stage.id ? "stage-button active" : "stage-button"
                }
              >
                <span className="eyebrow">{stage.number}</span>
                <span>{stage.name}</span>
                <Arrow />
              </button>
            ))}
          </div>
          <div
            className="stage-description"
            aria-live="polite"
            aria-atomic="true"
          >
            <p className="eyebrow">Signal notes / {current.number}</p>
            <h3>{current.title}</h3>
            <p>{current.text}</p>
          </div>
        </div>
      </section>
      <section
        className="listening-section shell"
        aria-labelledby="listening-title"
      >
        <div>
          <p className="eyebrow">02 / The listening room</p>
          <h2 id="listening-title">
            The proof is
            <br />
            <span>in the listening.</span>
          </h2>
        </div>
        <div className="listening-card">
          <div className="waveform" aria-hidden="true">
            {Array.from({ length: 47 }, (_, i) => (
              <i
                key={i}
                style={{
                  height: `${12 + Math.sin(i * 1.7) ** 2 * Math.sin((i / 46) * Math.PI) * 70}%`,
                }}
              />
            ))}
          </div>
          <div className="listening-caption">
            <span className="eyebrow">Bandz / Audio demos</span>
            <span className="coming-label">Coming soon</span>
          </div>
          <p>
            We’re preparing examples from the beta. Hear the controls in context
            when the listening room opens.
          </p>
        </div>
      </section>
      <section className="faq-section shell" aria-labelledby="faq-title">
        <div>
          <p className="eyebrow">03 / A few notes</p>
          <h2 id="faq-title">
            Before you
            <br />
            <span>plug in.</span>
          </h2>
        </div>
        <div className="faq-list">
          <details>
            <summary>
              Can I buy Bandz yet?<span aria-hidden="true">+</span>
            </summary>
            <p>
              Not yet. Bandz is currently in beta. Pricing and release
              details will be announced when it’s ready.
            </p>
          </details>
          <details>
            <summary>
              Where can I find compatibility details?
              <span aria-hidden="true">+</span>
            </summary>
            <p>
              Supported formats, operating systems, and installation
              requirements will be published ahead of launch.
            </p>
          </details>
          <details>
            <summary>
              Will there be audio demonstrations?
              <span aria-hidden="true">+</span>
            </summary>
            <p>
              Yes. Audio examples are planned for the listening room on this
              page as the beta progresses.
            </p>
          </details>
        </div>
      </section>
      <LaunchSection />
    </>
  );
}
function AppLayout() {
  const location = useLocation();
  const path = location.pathname.replace(/\/$/, "");
  const isPluginPage = path === "/tinychain" || path === "/bandz";

  useEffect(() => {
    if (path === "/tinychain") document.title = "TinyChain — MCP Audio";
    else if (path === "/bandz") document.title = "Bandz — MCP Audio";
    else if (path === "") document.title = "MCP Audio — Sound, with character";
  }, [path]);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <div className={isPluginPage ? "tinychain-page" : "homepage"}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tinychain" element={<TinyChain />} />
          <Route path="/bandz" element={<Bandz />} />
          <Route path="/samples" element={<Samples />} />
          <Route path="/samples/:id" element={<SamplePack />} />
        </Routes>
      </div>
      <footer className="site-footer">
        <div className="shell footer-main">
          <a className="brand" href="/" aria-label="MCP Audio home">
            <img src={logo} alt="MCP Audio" width="299" height="55" />
          </a>
          <p>Independent tools. Individual character.</p>
          <a className="text-link" href="#main">
            Back to top ↑
          </a>
        </div>
        <div className="shell footer-bottom">
          <span>© {new Date().getFullYear()} MCP Audio</span>
          <span>Designed by Mischa Chillak</span>
        </div>
      </footer>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}
export default App;
