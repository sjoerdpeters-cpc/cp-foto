# Handoff — CP-sportfotografie · Website

## Overview

CP-sportfotografie is a new Dutch sports-photography business by Chris P. (CP). The website lets visitors of sports events (mainly **running** and **team sports**) find and purchase individual photos taken during the event.

This bundle contains a high-fidelity design exploration of the four key flows:

1. **Homepage** — brand introduction + quick "find my photo" search
2. **Event overview** — list of all events the photographer has shot
3. **Event gallery** — single-event photo grid with search-by-bib, filter-by-team-colour, filter-by-moment
4. **Photo detail + cart** — single-photo purchase view with related photos and shopping cart

Plus two mobile screens (gallery, photo detail) for the same flow.

## About the Design Files

The HTML/JSX files in this bundle are **design references** built as an interactive React prototype hosted in a single page. They are **not** production code to copy directly. They use a `design-canvas.jsx` wrapper to present all artboards side-by-side and a `tweaks-panel.jsx` for live design knobs — neither belongs in the final product.

The task is to **re-implement these designs in the target codebase's environment** (likely Next.js/React or Astro for a marketing+commerce site) using whichever component library and styling system the project already uses (or — if green-field — pick something sensible like Next.js App Router + Tailwind + a headless e-commerce backend such as Shopify, Snipcart, or a custom Stripe integration).

## Fidelity

**High-fidelity.** All colours, fonts, spacing, copy and interaction states are final and intentional. Replicate pixel-for-pixel where possible. Photographs in the prototype are placeholders from `picsum.photos` — the real product uses photos uploaded by the photographer.

## Brand foundations

### Logo
`assets/logo.png` — primary lockup contains a stylised CP shutter mark in navy + red with motion lines, paired with the wordmark "CP SPORTFOTOGRAFIE". Two alternate lockups exist (horizontal and stacked). An SVG re-creation of just the mark is included in `ui.jsx` (`<Logo>`).

### Colours

| Token              | Hex         | Use                                                    |
|--------------------|-------------|--------------------------------------------------------|
| `--cp-navy`        | `#0E2A55`   | Primary brand, headings, dark CTA, navy panels         |
| `--cp-navy-deep`   | `#091A36`   | Footer, deep contrast surfaces                         |
| `--cp-navy-soft`   | `#1A3A6E`   | Hover / secondary navy                                 |
| `--cp-red`         | `#E62333`   | Brand accent, primary CTA, "live" indicators, prices   |
| `--cp-red-deep`    | `#B81620`   | Pressed state for red                                  |
| `--cp-paper`       | `#F7F5F2`   | Page background (warm off-white)                       |
| `--cp-paper-2`     | `#EFEBE3`   | Section backgrounds, hover surfaces                    |
| `--cp-paper-3`     | `#E4DFD3`   | Dividers, oversized decorative type                    |
| `--cp-ink`         | `#0A1530`   | Body text                                              |
| `--cp-mute`        | `#6B7385`   | Secondary text, captions                               |
| `--cp-line`        | `rgba(10,21,48,0.12)` | Borders, dividers                            |
| `--cp-zest`        | `#F2FF49`   | Energy accent — live ticker stats, checkmark fills     |

The "zest" yellow is used **sparingly** as an energy pop. Do not use it as a primary surface or CTA fill.

### Typography

Three families, loaded from Google Fonts:

| Token           | Family            | Use                                                       |
|-----------------|-------------------|-----------------------------------------------------------|
| `--font-display`| **Anton**         | Headlines, oversized numerals, bib numbers, date blocks. Always uppercase, condensed, line-height ~0.92, letter-spacing ~0.005em. |
| `--font-body`   | **Manrope**       | All body, UI labels, buttons. Weights 400/500/600/700/800. Letter-spacing -0.005em. |
| `--font-mono`   | **JetBrains Mono**| Timestamps, bib metadata, eyebrows, kicker labels. Letter-spacing 0.12–0.18em uppercase for kickers. |

Type scale (high-end):
- Hero display: 124px (Anton)
- Page title: 96px / 78px
- Section title: 72px / 56px
- Card display: 32–40px
- Body: 14–17px
- Eyebrow / mono kicker: 10.5–12px tracked 0.14–0.18em uppercase

### Spacing & radius

- Page padding: 64px desktop, 16–20px mobile
- Section vertical padding: 80–96px
- Card padding: 20–28px
- Radius: 6 (small), 10–12 (cards), 16–22 (large cards), 999 (pills)
- Shadow card: `0 1px 0 rgba(10,21,48,.04), 0 12px 32px -16px rgba(10,21,48,.18)`

### Visual motifs (use throughout, do not invent new ones)

1. **Diagonal red speed lines** — repeating linear gradient at 115°, echoes the motion lines next to the logo's C. CSS class `.speed-bg` in `styles.css`. Use behind hero areas and as a subtle backdrop.
2. **Square crop-marks** `[ ]` — taken from the alternate horizontal lockup. Implemented as `.crop` with `::before` `::after` and two extra child spans. Use around hero photo and main product photo.
3. **Oversized numerals as ornament** — Anton numerals at 84–280px in a muted paper colour or red, behind cards. Used in the "Hoe het werkt" step cards and in the giant quote section.
4. **Diagonal photo watermark** — `CP·SPORTFOTOGRAFIE` repeated at -22° at 55% opacity with `mix-blend-mode: overlay`. Applied to every preview image. Toggled off after purchase.
5. **Live indicator** — pulsing red dot + tracked mono caps "LIVE". Used in the event banner and any "just uploaded" badge.

### Copy voice

Dutch, short, sport-spreuken / sport sayings. Imperative, confident. Examples:
- "Jij. Aan de finish."
- "Geen foto. Geen bewijs."
- "Stilstaan is geen optie."
- "Elke seconde gevangen."

UI labels are Dutch and informal: "Vind mijn foto's →", "Mandje", "Voeg toe", "Afrekenen →".

---

## Screen 1 — Homepage

**File:** `screens.jsx` → `<Homepage>`
**Canvas size:** 1440 × 1860

### Layout (top to bottom)
1. **Top nav** — white, 18px vertical padding, bottom border `--cp-line`. Logo (left), nav links (centre-right): "Evenementen / Hoe het werkt / Voor organisatoren / Contact", a "Inloggen" link with avatar icon, and a dark "Mandje" button with cart count badge.

2. **Hero** — 64px page padding, 80px bottom. Two-column grid `1.05fr 0.95fr`, 56px gap.
   - **Left column**:
     - Eyebrow (mono caps): `LIVE` pulsing dot + "SINDS 06:14 — LIVE UPLOAD / Stadsloop Rotterdam · 24 mei 2026"
     - H1 in Anton, 124px, navy. Two lines: "Jij. Aan de finish." with "Aan de" in red.
     - Red 36×3px tick + paragraph (max 520px) in 18px Manrope 500.
     - Dark navy panel, 24px padding, 22px radius, max-w 580px:
       - Eyebrow "Snel zoeken · startnummer" (60% white)
       - Pill input with red `#` prefix, Anton 28px placeholder "4218", numeric-only, max 5 chars. Inline red CTA button "Vind mijn foto's →".
       - Helper row: mono "Geen nummer?" + underlined link "Zoek op kleur of moment →"
   - **Right column**: wrapped in `.crop` (red corner marks). Inside, a 4:5 photo (`picsum.photos/seed/cp-hero/900/1100`) with linear gradient overlay (navy → transparent from bottom). Overlaid bottom-left:
     - Mono "SHOT BY · CHRIS P."
     - Anton 48px "#4218"
     - Mono "09:14:32 — KM 18"
     - Top-right red pill badge "NIEUW"
   - Two huge red `[` and `]` Anton glyphs (84px) at top-left and bottom-right of the photo container, with `mix-blend-mode: multiply`.
   - Behind the whole hero section: `.speed-bg` at 35% opacity.

3. **Marquee stat bar** — full-bleed deep navy `#091A36`, 22×64 padding. Inline row of 5 stat pairs: large zest-yellow Anton number + tracked mono label. Right edge: mono "EST. 2026 — UTRECHT, NL".
   - Stats: `142 evenementen / 68K foto's online / 09:14 snelste upload / €5 vanaf / 24/7 download`

4. **Hoe het werkt** — 80px padding. Section header row: eyebrow "Drie stappen" + Anton 72px "Zo werkt het." (left), paragraph + caption (right). Below: 3-column grid of cards.
   - Each card: white, 28px padding, 16px radius, shadow-card. Giant Anton number ("01"/"02"/"03") at 160px in `--cp-paper-2` positioned absolute top-right with negative offsets, behind a real Anton 32px navy title and a 14px Manrope description.
   - Card 1: **Zoek** — "Voer je startnummer in. Geen nummer? Filter op teamkleur en het tijdsblok dat je voorbij kwam."
   - Card 2: **Kies** — "Bekijk previews gratis. Klik door, selecteer je favorieten — meerdere foto's = meer korting."
   - Card 3: **Download** — "Reken af. Hoge-res zonder watermerk direct in je inbox. Print los te bestellen."

5. **Recent events grid** — header row "Recent geüpload" / Anton 56px "Vers van de lens." with ghost button "Alle evenementen →" on the right. Below: 4-column grid of event cards.
   - Card: white, rounded, 4:3 image with navy gradient overlay. Top-left mono badge with sport name. Top-right red pill "● LIVE" if live. Bottom-left: Anton 22px event name + mono date. Below the image: mono distance label and big Anton photo count.

6. **Big quote section** — full-bleed `--cp-paper-2` background, 88×64 padding. Giant decorative `"` glyph at 280px positioned absolute top-right. Content max-w 980:
   - Eyebrow "Manifest"
   - Anton 88px two-line "Geen foto. / Geen bewijs." second line red.
   - Body paragraph (max 600px).
   - Dark navy "Mijn verhaal →" CTA.

7. **Footer** — see Footer section below.

### Interactions
- Bib input accepts digits only (max 5).
- Clicking the "Vind mijn foto's" button navigates to the gallery.
- All cards have a subtle hover (raise by 1px, shadow grow).
- Live dot pulses every 1.6s.

---

## Screen 2 — Event overview

**File:** `screens.jsx` → `<Events>`
**Canvas size:** 1440 × 1400

### Layout
1. **Top nav** (same as Homepage, "Evenementen" link active in red).
2. **Page header** — 56×64 padding, bottom border.
   - Left: eyebrow "Archief & live" + Anton 96px "Evenementen." with "menten" in red.
   - Right: 340px search field with magnifier icon, placeholder "Zoek evenement, plaats, datum...".
3. **Filter chip bar** — same row, wrapped. Sport chips ("Alle sporten / Hardlopen / Voetbal / Hockey / Trail"), divider, month chips ("Mei 2026 / April 2026 / Maart 2026"), divider, status chips ("Met live-foto's", "Regio: Zuid-Holland"). Right-aligned counter "N EVENEMENTEN · GESORTEERD OP DATUM".
4. **Event list** — 32×64 padding, 16px gap. Each row is a 4-column grid card: `180px 1.4fr 1fr auto`, 0 padding, overflow-hidden, 16px radius.
   - Col 1: Solid navy block. Centred mono year, Anton 56px day, Anton 22px red month abbreviation. Top-right "LIVE" indicator if live.
   - Col 2: Full-bleed cover image.
   - Col 3: Padded meta. Inline row: red mono sport name (tracked) · dot · mute mono region. Below: Anton 32px event name, mono distance line.
   - Col 4: Right-aligned. Big Anton photo count, tracked mono "foto's" caption, red primary "Bekijk →" button.
5. **Pagination** — centred chip row: `← 1 2 3 … 12 →` with active "1".
6. **Footer**.

### Interactions
- Clicking a chip toggles filter state. Active chip: navy fill, white text.
- Clicking a card navigates to the gallery.
- Sport filter actually filters the visible event list (state).

### Data shape

```ts
type Event = {
  id: string;            // 'rotterdam'
  name: string;          // 'Stadsloop Rotterdam'
  date: string;          // '24 MEI'
  year: string;          // '2026'
  sport: string;         // 'Hardlopen'
  dist: string;          // '10K · 21K · 42K'
  photos: number;        // 14203
  live: boolean;
  region: string;        // 'Zuid-Holland'
  img: string;           // cover URL
};
```

---

## Screen 3 — Event gallery (search & filter)

**File:** `screens.jsx` → `<Gallery>`
**Canvas size:** 1440 × 1700

### Layout
1. **Top nav** with cart count badge.
2. **Event banner** — 260px tall full-bleed image with `linear-gradient(to right, rgba(14,42,85,.85), rgba(14,42,85,.5) 50%, transparent)`. Overlaid left:
   - Breadcrumb "← EVENEMENTEN / HARDLOPEN"
   - Anton 78px "Stadsloop Rotterdam" — "Rotterdam" in zest yellow.
   - Mono meta row: date · separator · photo count · separator · live indicator with "laatste upload 2 min geleden".
3. **Sticky filter bar** — `position: sticky; top: 0`, white, bottom border, 14×64 padding. Single row, gap 16:
   - Bib pill input (min-width 220) with red `#` prefix, Anton placeholder.
   - Vertical divider.
   - "KLEUR" mono label + 6 team-colour chips (swatch + label). Toggle multi-select.
   - Vertical divider.
   - "MOMENT" mono label + 4 chips: Alle / Start / KM 10 / Finish.
   - Right-aligned: count "N / M foto's" + "Sorteer: nieuwste ↓" chip.
4. **Active filters strip** (only when filters are set) — `--cp-paper-2` background, 14×64 padding. Shows applied filter chips with ✕ + "Wis alles" link.
5. **Main content** — 24×64×80 padding. Grid `1fr 320px`, 32px gap:
   - **Left**: photo grid. Three layout options driven by a tweak (default `masonry`):
     - `masonry`: CSS `column-count: 4`, `column-gap: 10`, `margin-bottom: 10` per card.
     - `grid`: 4-column CSS grid, 10px gap.
     - `justified`: 3-column CSS grid, 10px gap.
     - Each card is a `<PhotoCard>` (see component spec below).
   - **Right sidebar** — sticky `top: 80`, three stacked cards:
     - "Jouw selectie" card: eyebrow + cart count. Empty state: muted help text. Active state: row of thumbnail mini-images, subtotal row (mono "SUBTOTAAL" + Anton price), red "Naar afrekenen →" CTA.
     - Navy "Tip" card with helper copy.
     - Dashed-border "Prijzen" card: small price table — `1 foto · €7`, `3 foto's · €18` (red), `Alles van # · €29` (red).
6. **Footer**.

### Interactions
- Typing in the bib field filters cards client-side (`String(p.bib).includes(bib)`).
- Clicking a team chip toggles its presence in the filter array; only photos with `photo.team` in the list are shown.
- "Wis alles" clears bib + teams.
- Clicking a photo opens the detail screen (passes the photo).
- Clicking the heart icon toggles the photo in the cart.

---

## Screen 4 — Photo detail + cart

**File:** `screens.jsx` → `<PhotoDetail>`
**Canvas size:** 1440 × 1500

### Layout
1. **Top nav** with cart count.
2. **Breadcrumb** — mono caps `EVENEMENTEN / STADSLOOP ROTTERDAM / FOTO #{bib}-{idsuffix}`.
3. **Main content** — `1fr 380px` grid, 40px gap:
   - **Left column**:
     - **Hero photo** wrapped in `.crop` corner-marks. Photo at aspect 3:2 with watermark + Anton 28px bib badge + mono timestamp "09:14:32 — KM 18.4 — KETHELPLEIN".
     - **Meta strip** — 4-column row, 1px navy lines between, 12px radius, white. Cells:
       - "Startnummer" — Anton 30 #4218
       - "Tijdstip" — mono 16 09:14:47
       - "Locatie" — mono 16 KM 18.4
       - "Fotograaf" — mono 16 Chris P.
     - **"Meer met #4218"** section — eyebrow + Anton 32 bib + ghost button "Alles van #4218 · €29 →". 4-column grid of related 3:2 photos.
     - **"Verder bladeren"** section — eyebrow + 6-column grid of 1:1 thumbnails (no meta).
   - **Right column** (sticky top 24), three stacked cards:
     - **Purchase card**: white, 24px padding.
       - Eyebrow "Hoge-res download"
       - Anton 56px price `€{p.price}` + 14px mute "incl. BTW"
       - Bullet list, each with a zest-yellow round 16px checkmark badge: "JPG · 6000 × 4000 px (24 MP) / Zonder watermerk / Persoonlijk gebruik · social toegestaan / Direct in je inbox"
       - Red "Voeg toe — €X" primary CTA, full-width.
       - Ghost "Alles van #X — €29" secondary CTA.
     - **Mandje card**: eyebrow + Anton count. List of up to 3 items: 44×44 thumb + Anton bib + mono ts + Anton price. Total row + dark "Afrekenen →" CTA.
     - **Trust card**: paper-2 bg. Mono caps "VEILIG · NEDERLANDS" + body "iDEAL · Tikkie · Apple Pay. Direct downloaden na betaling. 14 dagen niet-goed-geld-terug."
4. **Footer**.

### Interactions
- "Voeg toe" toggles the displayed photo into the cart array. Button text becomes "In mandje ✓".
- Clicking related/more thumbnails navigates to that photo's detail page.
- Cart is shared with the gallery screen.

---

## Mobile screens

**File:** `mobile.jsx`
**Canvas size:** 390 × 844 (inside a phone bezel)

### MobileGallery
- 160px image banner with navy gradient, back chevron top-left, big Anton title bottom-left.
- Sticky white search section: pill bib input with red `#` and small "Zoek" CTA. Horizontal scroll of team-colour chips + "Moment ▾".
- 2-column photo grid, 6px gap, 4:5 cards.
- Sticky bottom "cart drawer" (only when cart is non-empty): rounded 20px top corners, navy. Shows overlapped thumbnails, count + total, red "Afrekenen →" CTA.

### MobileDetail
- Full-bleed 3:4 photo with watermark + bib overlay.
- Floating back & share buttons (38×38 round, translucent white).
- Below: event eyebrow, Anton 32 "FOTO #4218" title, 3-column tile meta (TIJD / KM / LOC), big price.
- Sticky bottom action bar: ghost heart button + red full-width "Voeg toe — €X" primary.

---

## Component spec — `<PhotoCard>`

The core repeating component. Props: `photo, watermark, showMeta, onClick, inCart, onCart`.

- Wrapper `.photo`: `position: relative`, aspect-ratio from `photo.ratio`, 6px radius, dark fallback bg.
- `<img>` fills with `object-fit: cover`, `filter: saturate(1.05) contrast(1.04)`, hover scale 1.04 over 350ms.
- Top-left bib badge: white pill, Anton 18, navy text, 5×7 padding, slight shadow.
- Top-right heart button (28×28 white round). Default opacity 0, fades in on hover. Filled red when `inCart`.
- Bottom-left timestamp: mono 10, white, text-shadow for legibility.
- Bottom-right price tag: white pill, mono 11 bold.
- Bottom gradient overlay (`::after`) for text contrast.
- Watermark overlay: diagonal repeating "CP·SPORTFOTOGRAFIE" text rotated -22°, scale 1.5, opacity 0.55, `mix-blend-mode: overlay`.
- When `showMeta={false}`: hides bib/heart/ts/price (used for tiny "verder bladeren" grid).
- When `watermark={false}` (post-purchase): hides the watermark layer.

---

## Component spec — `<Logo>`

Inline SVG, 60×36 viewBox. Re-creates the CP shutter mark:
- Two horizontal speed lines (navy and red) on the left.
- A thick navy C-ring (stroke 6.5).
- A skewed red P stem.
- A small navy circle with two red triangle slivers as shutter blades.

Plus optional wordmark right of a 1px divider: Anton 18 "CP" stacked over mono 9 tracked "SPORTFOTOGRAFIE".

For final implementation, prefer the official PNG/SVG asset in `assets/logo.png` over the inline re-creation.

---

## Component spec — Buttons

Class names in `styles.css`.

- `.btn` — base. 12×18 padding, 999 radius, 13px bold, gap 8, transitions 120ms.
- `.btn.primary` — red bg, white text. Hover: navy bg, lift 1px.
- `.btn.dark` — navy bg, white text. Hover: deeper navy + lift.
- `.btn.ghost` — transparent, 1.5px line border. Hover: ink border + white bg.
- `.btn.zest` — zest yellow bg, deep navy text, inset 2px navy border.
- `.btn.lg` — 16×26 padding, 14px size.
- `.btn.sm` — 8×12 padding, 12px size.

## Component spec — Chips

- `.chip` — 6×12 padding, 999 radius, 1.2px line border, white bg, 12px semibold.
- `.chip.active` — navy fill, white text.
- `.chip .swatch` — 10×10 circle prefix, used in team-colour filter.

## Component spec — Field (pill input)

- `.field` — flex, 999 radius, 1.5px line border, white bg, 6×6×6×18 padding.
- Focus: border becomes navy.
- `.field.bib input` — Anton 22px placeholder.
- `.field.lg` — bumps padding and input size.
- `.field .pre` — mono prefix label (e.g. red `#`).

## Component spec — Footer

Dark navy, 48×48×24 padding. 4-column grid `1.4fr 1fr 1fr 1fr`, 40px gap.
- Col 1: logo + tagline + 4 round social initial badges (IG/FB/LI/YT).
- Cols 2–4: link groups with tracked mono caps headings.
  - "Voor sporters": Zoek mijn foto, Hoe het werkt, Prijzen, Account
  - "Voor organisatoren": Boek CP voor je event, Sponsor packages, Resultatenkoppeling, Cases
  - "Over": Mijn verhaal, Contact, Veelgestelde vragen, Voorwaarden · Privacy
- Bottom row: © line + right-aligned mono tagline "STILSTAAN IS GEEN OPTIE."

---

## State management

Minimal cross-screen state needed:

```ts
type CartState = string[]; // array of photo IDs

type GalleryFilters = {
  bib: string;          // numeric string
  teams: string[];      // team IDs from TEAMS
  moment: 'alle' | 'start' | 'kmpl' | 'finish';
};
```

Cart should persist client-side (localStorage) across navigation and survive refresh.

Photo data is fetched per event. The prototype hard-codes a 24-photo array; in production this is a paginated/infinite-scroll feed from the photographer's upload backend, keyed by `event.id`.

## Search / filter behaviour

- **Bib search**: substring match on `String(photo.bib)`. Display recent searches.
- **Team colour**: multi-select. Photo has a single `team` ID; show photos where `team ∈ selectedTeams`.
- **Moment**: maps to a time bucket on the course (start / mid / finish). Each photo carries a coarse location code; filter matches against it.
- All filters AND together.
- Counter "N / M foto's" updates live.

## Performance notes

- Photo grid will commonly have 1,000–15,000 photos per event. **You must virtualise the gallery** in production (`react-virtuoso`, `react-window`, or similar). The prototype only shows 24.
- Image URLs should be served at multiple sizes: gallery thumb (~300px), detail (~1200px), purchased hi-res (~6000px). Use a CDN with on-the-fly resizing.
- Watermark overlay is CSS-only in the prototype; for production, **bake the watermark into the served image** (server-side) so it can't be removed by inspecting the DOM.

## Pricing model

- Per photo: €5 / €7 / €9 / €12 tiers (price stored on the photo).
- Bundle: "Alles van #X" — all photos with a given bib for €29.
- Watermark preview is free. Purchase removes watermark and delivers hi-res JPG.

## Payment

Dutch market. Must support **iDEAL**, **Tikkie**, **Apple Pay**, **credit card**. The prototype shows a hint string only — implement with Mollie, Stripe (with iDEAL enabled), or Adyen.

## Assets

- `assets/logo.png` — official logo lockups (provided by the client). Use this, not the inline SVG.
- All other photos in the prototype are placeholders from `https://picsum.photos/seed/<seed>/W/H`. Replace with real uploads.
- Icons in the prototype are inline SVG (search, heart, share, download, cart, chevrons, checkmark) — keep them or swap for Lucide / Heroicons.

## Files in this bundle

| File                       | Purpose                                                       |
|----------------------------|---------------------------------------------------------------|
| `CP-sportfotografie.html`  | Entry HTML — loads React + Babel + all script modules         |
| `styles.css`               | Design tokens + component styles + utilities                  |
| `ui.jsx`                   | Shared components: `<Logo>`, `<PhotoCard>`, `<Nav>` + data    |
| `screens.jsx`              | Desktop screens: Homepage, Events, Gallery, PhotoDetail, Footer |
| `mobile.jsx`               | Mobile screens: MobileGallery, MobileDetail (+ PhoneFrame)    |
| `main.jsx`                 | App entry — DesignCanvas assembly + Tweaks panel              |
| `design-canvas.jsx`        | Prototype-only wrapper (artboards) — **do not ship**          |
| `tweaks-panel.jsx`         | Prototype-only design knob panel — **do not ship**            |
| `assets/logo.png`          | Official logo lockups                                         |

To run the prototype locally, just open `CP-sportfotografie.html` in a browser (needs network for Google Fonts and picsum images).

## Open product questions (resolve before shipping)

1. **Account model** — does buying require an account, or is email-only checkout enough?
2. **Photographer upload backend** — desktop app (e.g. Capture One plugin), mobile uploader, or admin web tool?
3. **Bib detection** — manual tagging by the photographer, or automated OCR/ML at upload time?
4. **Face recognition opt-in** — was asked about but not selected in design phase; may return as a feature.
5. **Print-on-demand** — mentioned in UI ("print los te bestellen") but not yet flowed. Add a separate sub-flow after digital download.
6. **Event embed / white-label** — organisers may want to embed the gallery on their own site. Plan a `<iframe>` or web-component delivery.

## Quick re-skin checklist (if the brand evolves)

Override these CSS variables in `:root` and most of the design follows:
- `--cp-navy`, `--cp-red`, `--cp-zest` for hue.
- `--font-display`, `--font-body`, `--font-mono` for type pairing.
- Keep the `.crop`, `.speed-bg`, `.live` motifs — they're the brand's visual fingerprint.
