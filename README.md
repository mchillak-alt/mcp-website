# MCP Audio website preview

A local React/Vite design preview for the MCP Audio homepage and TinyChain product page. This is designed as a standalone static site that will integrate with Whop for checkout and digital product delivery.

## Preview

```sh
npm install
npm run dev -- --host 127.0.0.1
```

- Homepage: http://127.0.0.1:5173/
- TinyChain: http://127.0.0.1:5173/tinychain
- Comparison: http://127.0.0.1:5173/compare/
- Reconstructed pre-redesign site: http://127.0.0.1:5173/original/

The original is reconstructed from source captured in the conversation, rather than an untouched backup. It retains the original placeholder cards and Coming Soon behavior. It runs from its own HTML, React, CSS, and copied artwork files, isolated from the current design.

A dated ZIP in `snapshots/` preserves the current design before the comparison was added, including source, assets, review images, and a SHA-256 manifest. The comparison page now links to fixed copies of both versions saved before the September 17 header/background reversion. It also provides a link to the latest homepage.

Vite supports opening and reloading either route. Production hosting must serve `index.html` for `/tinychain`. The site can be deployed statically to a platform like Vercel or Netlify.

## Design direction

Follow `/Users/mischachillak/Documents/mcp-audio-os/MCP-AUDIO-STYLE-GUIDE.md` for the visual system:

- Inter Regular and Medium, using the actual embedded font files from the TinySat project. Fonts and their license are included in `src/assets/fonts/`.
- Cream `#f5f4f0`, ink `#1a1a1a`, neutral warm gray panels, thin rules, and square corners.
- Reserve orange for status/active indicators and the original artwork. No serif accents, gradients, drop shadows, or olive tones.
- Keep the original TinyChain and Bandz screenshots intact. Never redraw, generate, retouch, crop, or substitute the product UI.

The homepage introduces the company, features TinyChain, and briefly introduces Bandz. TinyChain has a botanical opening, the actual product screenshot, a control description selector, a planned listening section, and FAQ. The selector changes explanatory text without altering the screenshot or processing audio.

## Original screenshots

The website assets are byte-for-byte copies of the supplied files now in `artwork/`:

- `Screen Shot 2026-09-15 at 3.15.11 PM.png` → `src/assets/tinychain-screenshot.png` (2242 × 1400).
- `Screen Shot 2026-09-15 at 3.15.32 PM.png` → `src/assets/bandz-screenshot.png` (2162 × 1620).

The product page includes a link to the full-resolution TinyChain image. The previous reconstructed SVG interface has been removed.

## Assets and launch work still needed

- The TinyChain opening uses existing botanical artwork as a static stand-in for the proposed bird footage. Choose footage and a poster image before implementing video. Preserve pause controls, reduced-motion support, text contrast, and mobile framing.
- Add real audio demonstrations. The listening room is explicitly marked as coming soon and has no pretend playback controls.
- Connect launch notifications to the chosen email provider before adding a subscription form. No email addresses are collected in this preview.
- Confirm final product copy, formats, system requirements, pricing, and release timing. Neither sales nor a firm release date is advertised.
- Integrate Whop checkout widgets and links into the React components to handle purchases, file delivery, and software licensing. No live store was modified.

## Checks

```sh
npm run build
npm run lint
```

Browser review screenshots are saved in `review/`. The preview was checked at desktop, tablet, and phone widths, including 320 px, along with navigation, direct product-page reloads, section links, the control explorer, and FAQ disclosure controls.

## September 17: original header and background restored

- The current shared header restores the original Mischa Chillak presents logo, full connecting wire, uppercase Plugins / Samples / Account navigation, and outlined Cart (0) control. Mobile spacing is adjusted to avoid the original overflow.
- Samples, Account, and Cart open brief prelaunch notices; no Whop account or checkout connection is established yet.
- The homepage uses the original `bg-artwork2.png` as a fixed viewport background: `right top`, `no-repeat`, `auto 100vh`. It is no longer a positioned image clipped inside the content column. TinyChain keeps its newer hero artwork and all newer content layouts are retained.
- `/compare/` retains the earlier visual comparison and points to frozen versions under `/history/2026-09-17-before-reversion/`. The original comparison page itself is available at `/history/2026-09-17-before-reversion/compare/`.
- The entire previous source, comparison, reconstructed original, and review assets were also saved in a dated `before-header-reversion-*.zip` under `snapshots/`. The ZIP includes a SHA-256 manifest. Do not edit the saved history directory when making future design changes.
