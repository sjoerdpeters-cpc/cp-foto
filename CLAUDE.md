# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```powershell
# Regenerate album-manifest.json and album/<slug>/index.html pages from Albums/
node scripts/generate-albums.js

# Serve locally (after generating the manifest)
python -m http.server 8000
# → http://localhost:8000
```

There is no build step, linter, or test runner. The "build" is just `node scripts/generate-albums.js`. All other files are served as-is.

**Deployment** happens automatically: pushing to `main` triggers `.github/workflows/deploy.yml`, which runs `generate-albums.js` and deploys to GitHub Pages. Vercel uses the same `buildCommand` from `vercel.json`.

## Architecture

### Rendering model
`index.html` is a near-empty shell (`<div id="app">`). `script.js` owns all rendering — it sets `app.innerHTML` on every state change. There is no virtual DOM, no components, no framework. Each screen is a function that returns an HTML string:

| Screen | Function | Triggered by |
|---|---|---|
| `home` | `homeHtml()` | default / `data-nav="home"` |
| `events` | `eventsHtml()` | `data-nav="events"` |
| `gallery` | `galleryHtml()` | `data-nav="gallery"` / `openAlbum()` |
| `detail` | `detailHtml()` | `data-detail="<id>"` clicks |
| `checkout` | `checkoutHtml()` | `data-nav="checkout"` |

`render()` dispatches to the right function and sets `app.innerHTML`. Call `nav(screen)` or `openAlbum(albumId)` — never mutate `state.screen` directly without calling `render()`.

### Event handling
All interactions use **delegated events** on `document`. Handlers check `event.target.closest("[data-*]")` for:

- `data-nav` — screen navigation
- `data-album` — open a specific album by id
- `data-detail` — open photo detail
- `data-cart` / `data-remove-cart` — cart toggling
- `data-sport` — filter chip
- `data-place-order` / `data-reset-checkout` — checkout flow
- `data-clear` / `data-clear-bib` — filter reset

Add new interactive elements using these `data-*` attributes and handle them in the `click` listener block in `script.js`.

### State
A single `state` object at the top of `script.js` holds all UI state. Cart items are photo IDs persisted in `localStorage` under the key `cp-cart`. Photo data (bib, src, ts, price, ratio) lives in the loaded albums.

### Album pipeline
`scripts/generate-albums.js` is the data pipeline:

1. Scans `Albums/<folder>/` directories for a `Content.data` file and image files.
2. Parses `Content.data` (format: `[Key] = 'Value'`). Keys used: `datum`, `locatie`, `evenement`, `sport`, `regio`, `live`, `omschrijving`.
3. Reads EXIF `DateTimeOriginal` / `DateTimeDigitized` directly from JPEG bytes (no npm dependency) for per-photo timestamps.
4. Slugifies the folder name to generate the album `id`.
5. Writes `album-manifest.json` (the runtime data source) and `album/<slug>/index.html` (sets `window.CP_ALBUM_SLUG` so the SPA preselects the album).

**Never edit `album-manifest.json` or `album/*/index.html` manually** — they are regenerated on every build.

Per-album pages use `<base href="../../">` so all asset references resolve from the root.

When albums are loaded, the static `EVENTS` array in `script.js` is replaced with `ALBUMS.map(albumToEvent)`. The fallback static events and photos only appear when `album-manifest.json` cannot be fetched.

## Design system

All design tokens are CSS custom properties in `styles.css`. Key tokens:

| Token | Value | Use |
|---|---|---|
| `--cp-navy` | `#0E2A55` | Primary brand, headings, dark CTAs |
| `--cp-red` | `#E62333` | Accent, primary CTA, live indicators, prices |
| `--cp-zest` | `#F2FF49` | Energy pop — use sparingly |
| `--cp-paper` | `#F7F5F2` | Page background (warm off-white) |
| `--cp-ink` | `#0A1530` | Body text |
| `--cp-mute` | `#6B7385` | Secondary text, captions |
| `--cp-line` | `rgba(10,21,48,0.12)` | Borders, dividers |

**Typography** — three Google Fonts families:
- `Anton` (`--font-display`) — headlines, bib numbers, date blocks. Always uppercase, ~0.92 line-height.
- `Manrope` (`--font-body`) — all body and UI text.
- `JetBrains Mono` (`--font-mono`) — timestamps, eyebrow kickers, metadata. Tracked 0.12–0.18em uppercase for kickers.

**Visual motifs** — maintain these throughout; do not invent new ones:
- `.speed-bg` — diagonal red speed-lines CSS gradient (115°) behind hero areas.
- `.crop` with corner-mark children `<span class="crop-tr">` / `<span class="crop-br">` — square `[ ]` crop marks around hero photos.
- `.wm` inside photo elements — the diagonal watermark (`CP·SPORTFOTOGRAFIE` at -22°, `mix-blend-mode: overlay`).
- `.live` / `.live-badge` — pulsing red dot + tracked mono "LIVE".

**Button classes**: `.btn.primary` (red), `.btn.dark` (navy), `.btn.ghost` (outline), `.btn.lg` / `.btn.sm` size modifiers.

## Content language

All copy, UI labels, and new strings must be **Dutch (NL)**. Use the brand voice: short, imperative, sport-spreuken style (e.g. "Stilstaan is geen optie.", "Geen foto. Geen bewijs.").

## Design reference

`design_handoff_cp_sportfotografie/` is a React prototype for reference only — it contains detailed screen specs, component specs, and the complete colour/type/spacing system in its `README.md`. **Do not ship any file from this directory.** The `design-canvas.jsx` and `tweaks-panel.jsx` inside are prototype scaffolding.

## Pricing logic

Cart discounts are hardcoded in `cartTotal()` in `script.js`:
- 1–2 photos: €5 each
- 3–4 photos: €12 flat
- 5+ photos: €25 flat

The checkout is currently simulated (no real payment provider). The placeholder note in `checkoutHtml()` calls out Mollie/Stripe as the intended integration point.
