# MCP Audio Website — Project Status

**Last updated:** September 18, 2026  
**Workspace:** `/Users/mischachillak/Documents/MCP Website`  
**Project type:** Local React/Vite design prototype  
**Git status:** This folder is **not currently a Git repository**. There is no `.git` directory, branch, remote, or commit history.

## Current direction

The working direction combines the parts of both design versions that Mischa preferred:

- The **original header and navigation** are restored: the `Mischa Chillak presents` logo, connecting line, uppercase Plugins / Samples / Account links, and outlined Cart control.
- The homepage uses the **original botanical background treatment**. `bg-artwork2.png` is fixed to the viewport, positioned at `right top`, sized to `auto 100vh`, and sits flush against the right edge of the browser window.
- The **newer homepage content layout** remains: stronger product hierarchy, a featured TinyChain section, Bandz preview, approach section, and prelaunch section.
- The **newer TinyChain page** remains: botanical product opening, original plugin screenshot, control descriptions, planned listening room, FAQ, and launch messaging.
- The current visual system follows `/Users/mischachillak/Documents/mcp-audio-os/MCP-AUDIO-STYLE-GUIDE.md`:
  - Inter Regular and Medium
  - cream `#f5f4f0`
  - ink `#1a1a1a`
  - neutral warm grays
  - fine rules and square corners
  - orange reserved for active/status accents and artwork

## Important corrections already made

- The initial generated approximation of the TinyChain interface was removed.
- The website now uses the **original supplied screenshots without alteration**:
  - `artwork/Screen Shot 2026-09-15 at 3.15.11 PM.png` → `src/assets/tinychain-screenshot.png`
  - `artwork/Screen Shot 2026-09-15 at 3.15.32 PM.png` → `src/assets/bandz-screenshot.png`
- SHA-256 checks confirmed that the copied website assets are byte-for-byte identical to the files in `artwork/`.
- Serif display styling, gradients, drop shadows, olive tones, and overused orange were removed after reviewing the MCP Audio style guide.

## Current local preview routes

Start the site with:

```sh
npm run dev -- --host 127.0.0.1
```

Then open:

- Current homepage: `http://127.0.0.1:5173/`
- Current TinyChain page: `http://127.0.0.1:5173/tinychain`
- Saved comparison page: `http://127.0.0.1:5173/compare/`
- Reconstructed original prototype: `http://127.0.0.1:5173/original/`

## Preserved comparison and recovery points

Because Git was not set up, recovery points were saved manually.

### Frozen browser comparison

`/compare/` points to fixed copies saved before the September 17 header/background reversion. Those copies live under:

`history/2026-09-17-before-reversion/`

The frozen comparison itself is available at:

`http://127.0.0.1:5173/history/2026-09-17-before-reversion/compare/`

Future design changes should not be applied inside this history directory.

### ZIP snapshots

The `snapshots/` directory contains:

- `current-before-comparison-20260915T231630Z.zip`
  - Current design as it existed before the first comparison page was added.
- `before-header-reversion-20260917T185838Z.zip`
  - The complete project state immediately before restoring the original header and right-edge background treatment.

Both archives contain source and assets; the later archive also includes a SHA-256 manifest.

### Reconstructed original

The `original/` directory reconstructs the site from source captured earlier in the conversation. It includes the centered “Slick, minimal, professional.” hero, placeholder product grid, sample cards, prices, newsletter, and Coming Soon behavior.

It is useful for visual comparison, but it is a reconstruction rather than an untouched backup.

## Current behavior

- Plugins links to the current product section.
- TinyChain cards and links open the dedicated TinyChain page.
- Samples, Account, and Cart open short prelaunch notices because Whop checkout functions are not connected yet.
- The TinyChain control selector changes explanatory text. It does not alter the original screenshot or process audio.
- The listening room is visibly marked “Coming soon” and has no fake playback behavior.
- No email addresses are collected yet.
- No sales, confirmed pricing, or firm release date are presented as live.

## Main files

- `src/App.jsx` — current homepage, TinyChain page, shared restored header, dialogs, footer, and interactions
- `src/App.css` — current layouts, original header restoration, responsive behavior, and right-edge background treatment
- `src/index.css` — Inter font setup, palette, shared typography, buttons, and global styles
- `src/assets/` — original plugin screenshots, botanical artwork, logos, and Inter font files
- `compare/index.html` — saved design comparison entry point
- `original/` — reconstructed original prototype
- `history/2026-09-17-before-reversion/` — frozen pre-reversion pages and assets
- `review/` — desktop and mobile browser-review screenshots
- `snapshots/` — ZIP recovery points
- `README.md` — technical preview and implementation notes

## Verification completed

The latest implementation passed:

- `npm run build`
- `npm run lint`
- Desktop layouts at 1440 px
- Tablet layouts at 1024 and 768 px
- Mobile layouts at 390 and 320 px
- No horizontal overflow at the tested widths
- Original header geometry comparison
- Fixed, right-aligned homepage background comparison
- Homepage ↔ TinyChain navigation
- Samples, Account, and Cart prelaunch dialogs
- Control selector and FAQ behavior
- Direct TinyChain route loading
- Frozen comparison and archived page navigation
- Original plugin screenshot loading and Inter font loading

## Still to do

- Continue reviewing the homepage now that the preferred header/background and newer content layout are combined.
- Refine copy once the exact positioning for TinyChain and Bandz is settled.
- Choose and license vintage bird footage for the TinyChain product opening, then implement it with:
  - a poster image
  - pause control
  - reduced-motion behavior
  - accessible text contrast
  - intentional mobile framing
- Add real, level-matched audio demonstrations.
- Confirm plugin formats, operating-system support, system requirements, pricing, and launch timing.
- Choose an email provider and connect launch notifications.
- Connect real Whop navigation, account, cart, and checkout widget integration for digital products and licenses.
- Recheck accessibility and performance after video, audio, and Whop integration.
- Deploy the React site as a static frontend (e.g., Vercel, Netlify).

## Recommended source-control next step

Initialize Git before the next design round so every revision is recoverable and comparable. The sensible first commit would capture the project exactly as documented here, including the current source, original screenshots, comparison pages, frozen history, and this status file. The large ZIP files in `snapshots/` can either remain outside Git or be tracked with Git LFS.

