const app = document.querySelector("#app");

const state = {
  screen: "home",
  albumId: "",
  sport: "alle",
  bib: "",
  eventSearch: "",
  detailId: "cp-102",
  checkoutStep: "details",
  menuOpen: false,
  checkout: {
    name: "",
    email: "",
    payment: "ideal",
    terms: false,
  },
  cart: JSON.parse(localStorage.getItem("cp-cart") || "[]"),
  contactForm: { naam: "", email: "", telefoon: "", bericht: "", sent: false },
};

let EVENTS = [
  { id: "rotterdam", name: "Stadsloop Rotterdam", date: "24 MEI", year: "2026", sport: "Hardlopen", dist: "10K · 21K · 42K", photos: 14203, live: true, region: "Zuid-Holland", img: "https://picsum.photos/seed/cp-evt-1/900/600" },
  { id: "fcnoord", name: "FC Noord · Sparta U17", date: "18 MEI", year: "2026", sport: "Voetbal", dist: "Jeugd · Eredivisie", photos: 982, live: false, region: "Amsterdam", img: "https://picsum.photos/seed/cp-evt-2/900/600" },
  { id: "trailveluwe", name: "Trail Veluwe", date: "11 MEI", year: "2026", sport: "Trail", dist: "15K · 30K · 55K", photos: 6710, live: false, region: "Gelderland", img: "https://picsum.photos/seed/cp-evt-3/900/600" },
  { id: "hockeyrijswijk", name: "HC Rijswijk · Bloemendaal", date: "04 MEI", year: "2026", sport: "Hockey", dist: "Hoofdklasse Heren", photos: 1240, live: false, region: "Zuid-Holland", img: "https://picsum.photos/seed/cp-evt-4/900/600" },
  { id: "duinrun", name: "Duinen Halve", date: "27 APR", year: "2026", sport: "Hardlopen", dist: "10K · 21K", photos: 8390, live: false, region: "Noord-Holland", img: "https://picsum.photos/seed/cp-evt-5/900/600" },
  { id: "kampioenschap", name: "NK Veldlopen U23", date: "20 APR", year: "2026", sport: "Hardlopen", dist: "Elite · U23", photos: 3120, live: false, region: "Utrecht", img: "https://picsum.photos/seed/cp-evt-6/900/600" },
];

let PHOTOS = (() => {
  const seeds = [
    "cp-101", "cp-102", "cp-103", "cp-104", "cp-105", "cp-106", "cp-107", "cp-108",
    "cp-201", "cp-202", "cp-203", "cp-204", "cp-205", "cp-206", "cp-207", "cp-208",
    "cp-301", "cp-302", "cp-303", "cp-304", "cp-305", "cp-306", "cp-307", "cp-308",
  ];
  const bibs = [218, 4218, 87, 512, 1402, 33, 2901, 177, 89, 4042, 612, 3120, 77, 2204, 499, 1818, 308, 156, 2740, 901, 4451, 265, 1188, 3344];
  const ts = ["09:14:32", "09:14:47", "09:15:01", "09:15:22", "09:15:48", "09:16:03", "09:16:19", "09:16:40", "09:17:04", "09:17:22", "09:17:39", "09:18:01", "09:18:18", "09:18:35", "09:18:54", "09:19:11", "09:19:29", "09:19:48", "09:20:03", "09:20:18", "09:20:32", "09:20:47", "09:21:01", "09:21:18"];
  const ratios = [4 / 5, 3 / 2, 1, 4 / 5, 2 / 3, 3 / 2, 5 / 4, 4 / 5];
  return seeds.map((seed, i) => ({
    id: seed,
    src: `https://picsum.photos/seed/${seed}/720/${Math.round(720 / ratios[i % ratios.length])}`,
    ratio: ratios[i % ratios.length],
    bib: bibs[i],
    ts: ts[i],
    team: "",
    moment: "alle",
    price: 5,
  }));
})();

let ALBUMS = [];

// Fallback pricing — wordt overschreven zodra pricing.json geladen is
let PRICING = {
  foto: { prijs: 5, korting_3: 12, korting_5: 25 },
  pakketten: [],
};

async function loadPricing() {
  try {
    const res = await fetch("pricing.json", { cache: "no-store" });
    if (!res.ok) throw new Error(`pricing.json HTTP ${res.status}`);
    PRICING = await res.json();
  } catch (e) {
    console.warn("pricing.json niet geladen; fallback gebruikt.", e);
  }
}

function euro(value) {
  return `€${Number(value).toFixed(2).replace(".", ",")}`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function updateHash() {
  let hash = state.screen;
  if (state.screen === "gallery" && state.albumId) hash = `gallery/${state.albumId}`;
  if (state.screen === "detail" && state.detailId) hash = `detail/${state.detailId}`;
  const next = "#" + hash;
  if (window.location.hash !== next) history.pushState(null, "", next);
}

function applyHash() {
  if (window.CP_ALBUM_SLUG) return; // per-album page — loadAlbums already handled it
  const raw = window.location.hash.slice(1);
  if (!raw) return;
  const [screen, param] = raw.split("/");
  const valid = ["home", "events", "gallery", "detail", "checkout", "organizers", "contact", "privacy"];
  if (!valid.includes(screen)) return;
  state.screen = screen;
  if (screen === "gallery" && param && ALBUMS.length) {
    const album = ALBUMS.find((a) => a.id === param);
    if (album) state.albumId = album.id;
  }
  if (screen === "detail" && param) state.detailId = param;
}

function nav(screen, detailId) {
  state.screen = screen;
  state.menuOpen = false;
  if (detailId) state.detailId = detailId;
  updateHash();
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function openAlbum(albumId) {
  const album = ALBUMS.find((item) => item.id === albumId) || ALBUMS[0];
  if (!album) {
    nav("gallery");
    return;
  }

  state.albumId = album.id;
  state.screen = "gallery";
  state.bib = "";
  state.menuOpen = false;
  state.detailId = album.photos[0]?.id || state.detailId;
  updateHash();
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

window.addEventListener("popstate", () => {
  applyHash();
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

function currentAlbum() {
  return ALBUMS.find((album) => album.id === state.albumId) || ALBUMS[0] || null;
}

function albumPhotos() {
  return currentAlbum()?.photos || PHOTOS;
}

function albumToEvent(album) {
  const dateParts = album.date.match(/(\d{1,2})[-/](\d{1,3})[-/](\d{4})/);
  const months = ["JAN", "FEB", "MRT", "APR", "MEI", "JUN", "JUL", "AUG", "SEP", "OKT", "NOV", "DEC"];
  const rawMonth = dateParts?.[2] || "";
  const monthNumber = Number(rawMonth) > 12 && rawMonth.startsWith("0") ? Number(rawMonth.slice(0, 2)) : Number(rawMonth);
  const date = dateParts ? `${dateParts[1].padStart(2, "0")} ${months[monthNumber - 1] || ""}` : album.date || "ALBUM";
  const year = dateParts ? dateParts[3] : "";

  return {
    id: album.id,
    albumId: album.id,
    name: album.title,
    date,
    year,
    sport: album.sport || "Sport",
    dist: album.location || album.folder,
    photos: album.photos.length,
    live: album.live,
    region: album.region || album.location || "",
    img: album.cover || "Logo/cp_sportfotografie_variant5_volledige_presentatie.png",
    sortDate: album.sortDate || "",
  };
}

async function loadAlbums() {
  const initialSlug = window.CP_ALBUM_SLUG || new URLSearchParams(window.location.search).get("album") || "";

  try {
    const response = await fetch("album-manifest.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`Manifest HTTP ${response.status}`);
    const manifest = await response.json();
    ALBUMS = Array.isArray(manifest.albums) ? manifest.albums : [];

    if (ALBUMS.length) {
      EVENTS = ALBUMS.map(albumToEvent);
      EVENTS.sort((a, b) => (b.sortDate || "").localeCompare(a.sortDate || ""));
      state.albumId = ALBUMS.find((album) => album.id === initialSlug)?.id || ALBUMS[0].id;
      state.detailId = currentAlbum()?.photos[0]?.id || state.detailId;
      if (initialSlug) state.screen = "gallery";

      // Verwijder verouderde cart-items die niet meer in de geladen albums bestaan
      const validIds = new Set(ALBUMS.flatMap((album) => album.photos.map((p) => p.id)));
      const cleanCart = state.cart.filter((id) => validIds.has(id));
      if (cleanCart.length !== state.cart.length) setCart(cleanCart);
    }
  } catch (error) {
    console.warn("Album manifest niet geladen; fallback data wordt gebruikt.", error);
  }
}

function setCart(cart) {
  state.cart = cart;
  localStorage.setItem("cp-cart", JSON.stringify(cart));
}

function toggleCart(id) {
  state.checkoutStep = "details";
  setCart(state.cart.includes(id) ? state.cart.filter((x) => x !== id) : [...state.cart, id]);
  render();
}

function cartPhotos() {
  const allPhotos = ALBUMS.length ? ALBUMS.flatMap((album) => album.photos) : PHOTOS;
  return state.cart.map((id) => allPhotos.find((p) => p.id === id)).filter(Boolean);
}

function cartTotal() {
  const count = cartPhotos().length;
  const { prijs, korting_3, korting_5 } = PRICING.foto;
  if (count >= 5) return korting_5;
  if (count >= 3) return korting_3;
  return count * prijs;
}

function priceLabel(count = cartPhotos().length) {
  const { korting_3, korting_5 } = PRICING.foto;
  if (count >= 5) return `${count} foto's · 5+ deal (${euro(korting_5)})`;
  if (count >= 3) return `${count} foto's · 3-deal (${euro(korting_3)})`;
  return count === 1 ? "1 foto" : `${count} foto's`;
}

function availableSports() {
  const sports = [...new Set(EVENTS.map((event) => event.sport).filter(Boolean))].sort((a, b) => a.localeCompare(b, "nl"));
  return ["alle", ...sports.map((sport) => sport.toLowerCase())];
}

function icon(name) {
  const icons = {
    cart: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M6 6h15l-2 11H8L6 6z"/><circle cx="9" cy="20" r="1.6"/><circle cx="18" cy="20" r="1.6"/><path d="M6 6L4 3H2"/></svg>',
    user: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7"/></svg>',
    search: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3-3"/></svg>',
    heart: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-4.35-9.5-9C.9 8.5 3 4 7.5 4c2 0 3.4 1.1 4.5 2.5C13.1 5.1 14.5 4 16.5 4 21 4 23.1 8.5 21.5 12c-2.5 4.65-9.5 9-9.5 9z"/></svg>',
    heartFill: '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-4.35-9.5-9C.9 8.5 3 4 7.5 4c2 0 3.4 1.1 4.5 2.5C13.1 5.1 14.5 4 16.5 4 21 4 23.1 8.5 21.5 12c-2.5 4.65-9.5 9-9.5 9z"/></svg>',
    check: '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--cp-navy-deep)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
  };
  return icons[name] || "";
}

function navHtml(active = "home") {
  const eventsActive = active === "events" || active === "gallery" || active === "detail";
  return `
    <nav class="nav">
      <button class="logo" data-nav="home" aria-label="CP-sportfotografie home">
        <img src="Logo/cp_sportfotografie_variant5_hoofdlogo.png" alt="CP-sportfotografie" />
      </button>
      <div class="nav-links">
        <a class="${eventsActive ? "active" : ""}" data-nav="events">Albums</a>
        <a data-nav="home" data-scroll="steps">Hoe het werkt</a>
        <a class="${active === "organizers" ? "active" : ""}" data-nav="organizers">Foto's laten maken?</a>
        <a class="${active === "contact" ? "active" : ""}" data-nav="contact">Contact</a>
        <a class="nav-privacy ${active === "privacy" ? "active" : ""}" data-nav="privacy">Privacy</a>
      </div>
      <span class="nav-divider"></span>
      <button class="btn dark" data-nav="checkout">${icon("cart")} Mandje <span class="cart-pill">${state.cart.length}</span></button>
      <button class="hamburger ${state.menuOpen ? "open" : ""}" data-menu-toggle
        aria-label="${state.menuOpen ? "Menu sluiten" : "Menu openen"}"
        aria-expanded="${state.menuOpen}">
        <span></span><span></span><span></span>
      </button>
    </nav>
    <div class="mobile-nav-backdrop ${state.menuOpen ? "open" : ""}" data-menu-close></div>
    <div class="mobile-nav-drawer ${state.menuOpen ? "open" : ""}">
      <button class="mobile-nav-close" data-menu-close aria-label="Menu sluiten">✕</button>
      <a class="mobile-nav-link ${active === "home" ? "active" : ""}" data-nav="home">Home</a>
      <a class="mobile-nav-link ${eventsActive ? "active" : ""}" data-nav="events">Albums</a>
      <a class="mobile-nav-link" data-nav="home" data-scroll="steps">Hoe het werkt</a>
      <a class="mobile-nav-link ${active === "organizers" ? "active" : ""}" data-nav="organizers">Foto's laten maken?</a>
      <a class="mobile-nav-link ${active === "contact" ? "active" : ""}" data-nav="contact">Contact</a>
      <a class="mobile-nav-link ${active === "privacy" ? "active" : ""}" data-nav="privacy">Privacy</a>
      <button class="btn dark mobile-nav-cart" data-nav="checkout">${icon("cart")} Mandje <span class="cart-pill">${state.cart.length}</span></button>
    </div>
  `;
}

function reportMailto(photo) {
  const album = currentAlbum();
  const subject = encodeURIComponent(`Privacymelding – foto ${photo.id}`);
  const body = encodeURIComponent(
    `Beste CP-sportfotografie,\n\nIk wil verzoeken om de volgende foto offline te halen:\n\nFoto-ID: ${photo.id}\nStartnummer: #${photo.bib}\nAlbum: ${album?.title || "onbekend"}\n\nMijn naam:\nMijn reden:\n\nMet vriendelijke groet,`
  );
  return `mailto:info@cp-sportfotografie.nl?subject=${subject}&body=${body}`;
}

function photoCard(photo, showMeta = true) {
  const inCart = state.cart.includes(photo.id);
  return `
    <div class="photo-wrap">
      <button class="photo" style="aspect-ratio:${photo.ratio}" data-detail="${photo.id}">
        <img src="${photo.src}" alt="Sportfoto van startnummer ${photo.bib}" loading="lazy" />
        <span class="wm"></span>
        ${showMeta ? `
          <span class="bib-badge display">#${photo.bib}</span>
          <button class="photo-heart ${inCart ? "on" : ""}" data-cart="${photo.id}" aria-label="Voeg foto toe aan mandje">${inCart ? icon("heartFill") : icon("heart")}</button>
          <span class="photo-ts">${photo.ts}</span>
          <span class="photo-price">${euro(photo.price)}</span>
        ` : ""}
      </button>
      ${showMeta ? `<a class="photo-report" href="${reportMailto(photo)}" title="Verzoek om verwijdering">Privacy melden</a>` : ""}
    </div>
  `;
}

function footerHtml() {
  return `
    <footer class="footer" id="contact">
      <div class="footer-grid">
        <div>
          <img class="footer-logo" src="Logo/cp_sportfotografie_variant5_volledige_presentatie.png" alt="CP-sportfotografie" />
          <p style="margin-top:18px;font-size:13px;line-height:1.6;max-width:320px;color:rgba(255,255,255,.72)">
            Sportfotograaf voor lopers, voetballers en alles ertussen. Vanuit Utrecht, overal in NL.
          </p>
          <div class="socials">${["IG", "FB", "LI", "YT"].map((s) => `<span class="mono">${s}</span>`).join("")}</div>
        </div>
        <div><h4>Voor sporters</h4><a data-nav="gallery">Zoek mijn foto</a><a data-nav="home" data-scroll="steps">Hoe het werkt</a><a data-nav="gallery">Prijzen</a><a>Account</a></div>
        <div><h4>Voor organisatoren</h4><a id="organizers">Boek CP voor je event</a><a>Sponsor packages</a><a>Resultatenkoppeling</a><a>Cases</a></div>
        <div><h4>Over</h4><a>Mijn verhaal</a><a data-nav="contact">Contact</a><a>Veelgestelde vragen</a><a data-nav="privacy">Voorwaarden · Privacy</a></div>
      </div>
      <div class="footer-bottom"><span>© 2026 CP-sportfotografie · KvK 12345678</span><span class="mono" style="letter-spacing:.18em">STILSTAAN IS GEEN OPTIE.</span></div>
    </footer>
  `;
}

function homeHtml() {
  return `
    ${navHtml("home")}
    <main>
      <section class="hero">
        <div class="speed-bg"></div>
        <div class="hero-grid">
          <div>
            <div class="eyebrow" style="margin-bottom:22px"><span class="live">SINDS 06:14 · LIVE UPLOAD</span><span style="margin:0 10px;color:var(--cp-line)">/</span> Stadsloop Rotterdam · 24 mei 2026</div>
            <h1 class="display">Jouw moment,<br /><span style="color:var(--cp-red)">jouw herinnering,</span><br />jouw sportfoto.</h1>
            <div class="hero-copy"><span class="tick"></span><p>Zoek je foto, voorbeeld gratis. Hoge-res zonder watermerk vanaf €5.</p></div>
            <div class="quick-search">
              <div class="eyebrow">Snel zoeken · startnummer</div>
              <div class="field bib lg">
                <span class="pre" style="color:var(--cp-red)">#</span>
                <input id="home-bib" value="${state.bib}" placeholder="4218" inputmode="numeric" maxlength="5" />
                <button class="btn primary lg" data-nav="gallery">Vind mijn foto's →</button>
              </div>
              <div class="helper-row"><span class="mono" style="letter-spacing:.12em;text-transform:uppercase">Geen nummer?</span><a data-nav="events">Zoek je evenement →</a></div>
            </div>
          </div>
          <div class="hero-photo crop">
            <span class="crop-tr"></span><span class="crop-br"></span>
            <div class="hero-photo-frame">
              <img src="https://picsum.photos/seed/cp-hero/900/1100" alt="Hardloper tijdens Stadsloop Rotterdam" />
              <div class="hero-shot"><div class="mono" style="font-size:11px;letter-spacing:.14em;opacity:.86">SHOT BY · CHRIS P.</div><div class="display">#4218</div><div class="mono" style="font-size:12px;opacity:.9">09:14:32 · KM 18</div></div>
            </div>
            <div class="display big-bracket left">[</div><div class="display big-bracket right">]</div>
          </div>
        </div>
      </section>
      <section class="section" id="steps">
        <div class="section-head"><div><div class="eyebrow">Drie stappen</div><h2 class="display">Zo werkt het.</h2></div><p>Foto's verschijnen live tijdens het evenement. Geen account nodig om te zoeken.</p></div>
        <div class="steps-grid">
          ${[
            ["01", "Zoek", "Zoek je evenement en foto."],
            ["02", "Kies", "Bekijk previews gratis. Klik door, selecteer je favorieten. Meerdere foto's = meer korting."],
            ["03", "Download", "Reken af. Hoge-res zonder watermerk direct in je inbox. Print los te bestellen."],
          ].map(([n, t, d]) => `<article class="card card-hover step-card"><div class="display ghost-num">${n}</div><h3 class="display">${t}</h3><p>${d}</p></article>`).join("")}
        </div>
      </section>
      <section class="section-tight">
        <div class="section-head"><div><div class="eyebrow">Recent geüpload</div><h2 class="display">Vers van de lens.</h2></div><button class="btn ghost" data-nav="events">Alle evenementen →</button></div>
        <div class="event-grid">${EVENTS.slice(0, 4).map(eventCard).join("")}</div>
      </section>
      <section class="quote-section">
        <div class="display quote-mark">"</div>
        <div><div class="eyebrow">Manifest</div><p class="display">Geen foto.<br /><span style="color:var(--cp-red)">Geen bewijs.</span><br />Geen herinnering.</p><p class="body">Ik fotografeer sport zoals ik 'm zelf beleef: vol gas, lage hoek, oog voor de seconde dat het ertoe doet. Een klik, jouw moment, geen herinnering.</p><button class="btn dark lg" style="margin-top:28px">Mijn verhaal →</button></div>
      </section>
    </main>
    ${footerHtml()}
  `;
}

function eventCard(e) {
  return `
    <article class="card card-hover event-card" ${e.albumId ? `data-album="${e.albumId}"` : 'data-nav="gallery"'}>
      <div class="event-card-image">
        <img src="${e.img}" alt="${e.name}" loading="lazy" />
        <span class="sport-badge">${e.sport.toUpperCase()}</span>
        ${e.live ? '<span class="live-badge">● LIVE</span>' : ""}
        <div class="event-card-title"><div class="display">${e.name}</div><div class="mono" style="font-size:11px;opacity:.85;margin-top:4px">${e.date} ${e.year}</div></div>
      </div>
      <div class="event-card-meta"><span class="mono" style="font-size:12px;color:var(--cp-mute)">${e.dist}</span><span class="num" style="font-size:22px;color:var(--cp-navy)">${e.photos.toLocaleString("nl-NL")}</span></div>
    </article>
  `;
}

function eventsHtml() {
  const q = state.eventSearch.toLowerCase();
  const filtered = EVENTS.filter((e) => {
    const sportMatch = state.sport === "alle" || e.sport.toLowerCase() === state.sport;
    const searchMatch = !q || e.name.toLowerCase().includes(q) || (e.region || "").toLowerCase().includes(q) || (e.dist || "").toLowerCase().includes(q);
    return sportMatch && searchMatch;
  });
  const sports = availableSports();
  return `
    ${navHtml("events")}
    <main>
      <section class="page-header">
        <div class="page-header-row">
          <div><div class="eyebrow">Archief & live</div><h1 class="display page-title">Evene<span style="color:var(--cp-red)">menten</span>.</h1></div>
          <label class="field" style="width:min(340px,100%)">${icon("search")}<input id="events-search" value="${escapeHtml(state.eventSearch)}" placeholder="Zoek evenement, plaats, datum..." /></label>
        </div>
        <div class="chip-row">
          ${sports.map((s) => `<button class="chip ${state.sport === s ? "active" : ""}" data-sport="${s}">${s === "alle" ? "Alle sporten" : s[0].toUpperCase() + s.slice(1)}</button>`).join("")}
          <span style="flex:1"></span><span class="mono" style="font-size:12px;color:var(--cp-mute)">${filtered.length} EVENEMENTEN · GESORTEERD OP DATUM</span>
        </div>
      </section>
      <section class="section">
        ${filtered.length ? `<div class="event-list">${filtered.map(eventRow).join("")}</div>` : `<p style="color:var(--cp-mute);font-size:15px">Geen evenementen gevonden voor "<strong>${escapeHtml(state.eventSearch)}</strong>".</p>`}
      </section>
    </main>
    ${footerHtml()}
  `;
}

function eventRow(e) {
  const [day, month = ""] = e.date.split(" ");
  return `
    <article class="card card-hover event-row" ${e.albumId ? `data-album="${e.albumId}"` : 'data-nav="gallery"'}>
      <div class="date-block"><div class="mono" style="font-size:11px;letter-spacing:.16em;opacity:.65">${e.year}</div><div class="display" style="font-size:56px;margin-top:4px">${day}</div><div class="display" style="font-size:22px;margin-top:4px;color:var(--cp-red)">${month}</div>${e.live ? '<span class="live" style="position:absolute;top:10px;right:10px;color:white">LIVE</span>' : ""}</div>
      <div class="event-row-cover"><img src="${e.img}" alt="${e.name}" loading="lazy" /></div>
      <div class="event-row-meta"><div><span class="mono" style="font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:var(--cp-red);font-weight:800">${e.sport}</span><span style="display:inline-block;width:3px;height:3px;border-radius:99px;background:var(--cp-line);margin:0 8px 2px"></span><span class="mono" style="font-size:11px;color:var(--cp-mute)">${e.region}</span></div><div class="display" style="font-size:32px;color:var(--cp-navy)">${e.name}</div><div class="mono" style="font-size:12px;color:var(--cp-mute)">${e.dist}</div></div>
      <div class="event-row-cta"><div style="text-align:right"><div class="num" style="font-size:40px;color:var(--cp-navy)">${e.photos.toLocaleString("nl-NL")}</div><div class="mono" style="font-size:11px;letter-spacing:.14em;color:var(--cp-mute);text-transform:uppercase">foto's</div></div><button class="btn primary">Bekijk →</button></div>
    </article>
  `;
}

function filteredPhotos() {
  return albumPhotos().filter((p) => {
    const bibMatch = !state.bib || String(p.bib).includes(state.bib);
    return bibMatch;
  });
}

function galleryHtml() {
  const album = currentAlbum();
  const photos = filteredPhotos();
  const title = album?.title || "Stadsloop Rotterdam";
  const [firstTitleWord, ...restTitleWords] = title.split(" ");
  const secondTitlePart = restTitleWords.join(" ");
  const cover = album?.cover || "https://picsum.photos/seed/cp-evt-1/1600/560";
  const date = album?.date || "24 MEI 2026";
  const location = album?.location || "Rotterdam";
  return `
    ${navHtml("gallery")}
    <main>
      <section class="banner">
        <img src="${cover}" alt="${title}" />
        <div class="banner-content"><div class="mono" style="font-size:11px;letter-spacing:.14em;opacity:.8">← EVENEMENTEN / ${album?.sport?.toUpperCase() || "HARDLOPEN"}</div><h1 class="display">${firstTitleWord} <span style="color:var(--cp-zest)">${secondTitlePart || location}</span></h1><div class="mono" style="display:flex;align-items:center;gap:12px;font-size:12px;letter-spacing:.1em">${date} <span>·</span> ${photos.length.toLocaleString("nl-NL")} FOTO'S <span>·</span> <span class="live">${album?.live ? "live upload" : location}</span></div></div>
      </section>
      <section class="filter-bar">
        <label class="field bib" style="min-width:220px"><span class="pre" style="color:var(--cp-red)">#</span><input id="gallery-bib" value="${state.bib}" placeholder="startnummer" inputmode="numeric" maxlength="5" /></label>
        <span style="flex:1"></span><span class="mono" style="font-size:12px;color:var(--cp-mute)">${photos.length} / ${albumPhotos().length} foto's</span><button class="chip">Sorteer: nieuwste ↓</button>
      </section>
      ${state.bib ? activeFilterHtml() : ""}
      <section class="gallery-layout">
        <div class="photo-grid">${photos.map((p) => photoCard(p)).join("")}</div>
        ${sideRailHtml()}
      </section>
    </main>
    ${footerHtml()}
  `;
}

function activeFilterHtml() {
  return `<div class="active-filters"><span class="mono" style="font-size:11px;letter-spacing:.14em;color:var(--cp-mute)">FILTERS:</span><button class="chip active" data-clear-bib>#${state.bib} ×</button><button class="chip" data-clear>Wis alles</button></div>`;
}

function sideRailHtml() {
  const selected = cartPhotos();
  return `
    <aside class="side-rail">
      <div class="card" style="padding:20px">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px"><span class="eyebrow">Jouw selectie</span><span class="num" style="font-size:28px;color:var(--cp-navy)">${state.cart.length}</span></div>
        ${selected.length ? `<div class="selection-thumbs">${selected.slice(0, 8).map((p) => `<img src="${p.src}" alt="" />`).join("")}</div><div style="display:flex;align-items:baseline;justify-content:space-between;padding-top:12px;border-top:1px solid var(--cp-line)"><span class="mono" style="font-size:11px;color:var(--cp-mute);letter-spacing:.12em">SUBTOTAAL</span><span class="num" style="font-size:24px;color:var(--cp-navy)">${euro(cartTotal())}</span></div><button class="btn primary lg" data-nav="checkout" style="width:100%;margin-top:14px">Naar afrekenen →</button>` : `<p style="margin:0;font-size:13px;color:var(--cp-mute);line-height:1.5">Tik op het hartje om foto's te verzamelen. Korting vanaf 3 foto's.</p>`}
      </div>
      <div class="price-table"><span class="eyebrow">Prijzen</span><table style="width:100%;margin-top:10px;border-collapse:collapse;font-size:13px"><tbody><tr><td style="padding:4px 0">1 foto</td><td class="num" style="text-align:right;font-size:18px">€5</td></tr><tr><td style="padding:4px 0">3 foto's</td><td class="num" style="text-align:right;font-size:18px;color:var(--cp-red)">€12</td></tr><tr><td style="padding:4px 0">5 en meer foto's per album</td><td class="num" style="text-align:right;font-size:18px;color:var(--cp-red)">€25</td></tr></tbody></table></div>
    </aside>
  `;
}

function detailHtml() {
  const photos = albumPhotos();
  const p = photos.find((photo) => photo.id === state.detailId) || photos[0] || PHOTOS[1];
  const album = currentAlbum();
  const more = photos.filter((photo) => photo.id !== p.id);
  const title = album?.title || "Stadsloop Rotterdam";
  const location = album?.location || "KETHELPLEIN";
  const selected = cartPhotos();
  return `
    ${navHtml("detail")}
    <main>
      <div class="breadcrumb mono"><a data-nav="events">EVENEMENTEN</a> / <a data-nav="gallery">${title.toUpperCase()}</a> / <span style="color:var(--cp-ink)">FOTO #${p.bib}-${p.id.slice(-3)}</span></div>
      <section class="detail-grid">
        <div>
          <div class="crop"><span class="crop-tr"></span><span class="crop-br"></span><div class="photo detail-photo"><img src="${p.src.replace(/\/720\/\d+$/, "/1200/800")}" alt="Foto #${p.bib}" /><span class="wm"></span><span class="bib-badge display">#${p.bib}</span><span class="photo-ts">${p.ts || "CP"} · ${location.toUpperCase()}</span></div></div>
          <div class="meta-strip">${[["Startnummer", `#${p.bib}`, "display"], ["Tijdstip", p.ts || "-", "mono"], ["Locatie", location, "mono"], ["Fotograaf", "S. Peters", "mono"]].map(([l, v, c]) => `<div class="meta-cell"><div class="eyebrow">${l}</div><div class="${c}" style="margin-top:6px;font-size:${c === "display" ? "30px" : "16px"};color:var(--cp-navy);font-weight:${c === "mono" ? "700" : "400"}">${v}</div></div>`).join("")}</div>
          <div style="margin-top:14px;text-align:right">
            <a class="photo-report photo-report--detail" href="${reportMailto(p)}">Sta je op deze foto en wil je hem offline laten halen? Klik hier →</a>
          </div>
          <div style="margin-top:40px"><div style="display:flex;align-items:baseline;justify-content:space-between;margin-bottom:16px"><div><div class="eyebrow">Meer met</div><h3 class="display" style="margin:6px 0 0;font-size:32px;color:var(--cp-navy)">#${p.bib}</h3></div><button class="btn ghost sm">5 en meer foto's per album · €25 →</button></div><div class="related-grid">${more.slice(0, 4).map((r) => photoCard({ ...r, ratio: 3 / 2 })).join("")}</div></div>
          <div style="margin-top:40px"><div class="eyebrow" style="margin-bottom:14px">Verder bladeren in dit evenement</div><div class="browse-grid">${more.slice(4, 10).map((r) => photoCard({ ...r, ratio: 1 }, false)).join("")}</div></div>
        </div>
        <aside class="side-rail" style="top:24px">
          <div class="card" style="padding:24px"><div class="eyebrow">Hoge-res download</div><div style="display:flex;align-items:baseline;gap:8px;margin-top:8px"><span class="num" style="font-size:56px;color:var(--cp-navy)">${euro(p.price)}</span><span style="font-size:14px;color:var(--cp-mute)">incl. BTW</span></div><ul class="buy-list">${["JPG · 6000 × 4000 px (24 MP)", "Zonder watermerk", "Persoonlijk gebruik · social toegestaan", "Direct in je inbox"].map((x) => `<li><span class="check">${icon("check")}</span>${x}</li>`).join("")}</ul><button class="btn primary lg" style="width:100%" data-cart="${p.id}">${state.cart.includes(p.id) ? "In mandje ✓" : `Voeg toe · ${euro(p.price)}`}</button><button class="btn ghost" style="width:100%;margin-top:8px">5 en meer foto's per album · €25</button></div>
          <div class="card" style="padding:20px"><div style="display:flex;align-items:center;justify-content:space-between"><span class="eyebrow">Mandje</span><span class="num" style="font-size:22px;color:var(--cp-navy)">${state.cart.length}</span></div>${selected.length ? `<div style="margin-top:14px;display:flex;flex-direction:column;gap:10px">${selected.slice(0, 3).map((ph) => `<div class="cart-line"><img src="${ph.src}" alt="" /><div style="flex:1"><div class="display" style="font-size:16px;color:var(--cp-navy)">#${ph.bib}</div><div class="mono" style="font-size:11px;color:var(--cp-mute)">${ph.ts}</div></div><div class="num" style="font-size:16px;color:var(--cp-navy)">${euro(ph.price)}</div></div>`).join("")}${selected.length > 3 ? `<div class="mono" style="font-size:11px;color:var(--cp-mute)">+ ${selected.length - 3} meer</div>` : ""}<div style="display:flex;justify-content:space-between;padding-top:12px;border-top:1px solid var(--cp-line);align-items:baseline"><span class="mono" style="font-size:11px;letter-spacing:.12em;color:var(--cp-mute)">TOTAAL</span><span class="num" style="font-size:28px;color:var(--cp-navy)">${euro(cartTotal())}</span></div><button class="btn dark lg" data-nav="checkout" style="width:100%">Afrekenen →</button></div>` : `<p style="margin:12px 0 0;font-size:13px;color:var(--cp-mute);line-height:1.5">Nog leeg. Voeg deze foto toe of selecteer er meer voor korting.</p>`}</div>
          <div style="padding:18px;background:var(--cp-paper-2);border-radius:12px;font-size:12.5px;line-height:1.55"><div class="mono" style="font-size:10.5px;letter-spacing:.16em;color:var(--cp-mute);margin-bottom:8px">VEILIG · NEDERLANDS</div>iDEAL · Tikkie · Apple Pay. Direct downloaden na betaling. 14 dagen niet-goed-geld-terug.</div>
        </aside>
      </section>
    </main>
    ${footerHtml()}
  `;
}

function checkoutItemsHtml(items) {
  return items.map((photo) => `
    <div class="checkout-item">
      <img src="${photo.src}" alt="Foto #${photo.bib}" />
      <div>
        <div class="display" style="font-size:20px;color:var(--cp-navy)">#${photo.bib}</div>
        <div class="mono" style="font-size:11px;color:var(--cp-mute)">${photo.ts || "tijd onbekend"} · ${photo.filename || "sportfoto"}</div>
      </div>
      <button class="btn ghost sm" data-remove-cart="${photo.id}">Verwijder</button>
    </div>
  `).join("");
}

function checkoutSummaryHtml(items) {
  return `
    <aside class="checkout-summary card">
      <div class="eyebrow">Bestelling</div>
      <div class="checkout-summary-count">
        <span class="num">${items.length}</span>
        <span class="mono">${items.length === 1 ? "FOTO" : "FOTO'S"}</span>
      </div>
      <div class="checkout-rule">
        <span>${priceLabel(items.length)}</span>
        <strong>${euro(cartTotal())}</strong>
      </div>
      <div class="checkout-rule muted">
        <span>BTW</span>
        <span>inbegrepen</span>
      </div>
      <div class="checkout-total">
        <span>Totaal</span>
        <strong>${euro(cartTotal())}</strong>
      </div>
      <p>Na betaling ontvang je direct een downloadlink per e-mail. De previews blijven watermarked; de download is hoge-res zonder watermerk.</p>
    </aside>
  `;
}

function checkoutHtml() {
  const items = cartPhotos();
  if (state.checkoutStep === "done") return checkoutDoneHtml();

  return `
    ${navHtml("checkout")}
    <main>
      <section class="page-header">
        <div class="page-header-row">
          <div><div class="eyebrow">Afrekenen</div><h1 class="display page-title">Rond je bestelling af.</h1></div>
          <button class="btn ghost" data-nav="gallery">Verder zoeken →</button>
        </div>
      </section>
      ${items.length ? `
        <section class="checkout-layout">
          <div class="checkout-main">
            <section class="card checkout-card">
              <div class="checkout-step-head">
                <span class="eyebrow">Stap 01</span>
                <h2 class="display">Jouw selectie.</h2>
              </div>
              <div class="checkout-list">${checkoutItemsHtml(items)}</div>
            </section>
            <section class="card checkout-card">
              <div class="checkout-step-head">
                <span class="eyebrow">Stap 02</span>
                <h2 class="display">Gegevens.</h2>
              </div>
              <div class="checkout-fields">
                <label>Naam<input data-checkout-field="name" value="${escapeHtml(state.checkout.name)}" autocomplete="name" placeholder="S. Peters" /></label>
                <label>E-mail<input data-checkout-field="email" value="${escapeHtml(state.checkout.email)}" autocomplete="email" inputmode="email" placeholder="naam@example.nl" /></label>
              </div>
            </section>
            <section class="card checkout-card">
              <div class="checkout-step-head">
                <span class="eyebrow">Stap 03</span>
                <h2 class="display">Betalen.</h2>
              </div>
              <div class="payment-grid">
                ${[
                  ["ideal", "iDEAL", "Nederlandse banken"],
                  ["tikkie", "Tikkie", "Betaalverzoek"],
                  ["apple-pay", "Apple Pay", "Snel op mobiel"],
                  ["card", "Creditcard", "Visa · Mastercard"],
                ].map(([id, label, hint]) => `
                  <label class="payment-option ${state.checkout.payment === id ? "active" : ""}">
                    <input type="radio" name="payment" value="${id}" ${state.checkout.payment === id ? "checked" : ""} data-payment />
                    <strong>${label}</strong>
                    <span>${hint}</span>
                  </label>
                `).join("")}
              </div>
              <label class="terms-row">
                <input type="checkbox" data-checkout-terms ${state.checkout.terms ? "checked" : ""} />
                <span>Ik ga akkoord met levering van digitale downloads direct na betaling.</span>
              </label>
              <button class="btn primary lg" data-place-order style="width:100%;margin-top:18px">Betaal ${euro(cartTotal())} →</button>
              <p class="checkout-note">Deze knop simuleert nu de betaling. Later koppelen we hier Mollie of Stripe aan.</p>
            </section>
          </div>
          ${checkoutSummaryHtml(items)}
        </section>
      ` : `
        <section class="section">
          <div class="card checkout-empty">
            <div class="eyebrow">Mandje leeg</div>
            <h2 class="display">Nog geen foto's gekozen.</h2>
            <p>Kies eerst foto's in een album. Daarna kun je hier afrekenen.</p>
            <button class="btn primary lg" data-nav="events">Bekijk evenementen →</button>
          </div>
        </section>
      `}
    </main>
    ${footerHtml()}
  `;
}

function checkoutDoneHtml() {
  return `
    ${navHtml("checkout")}
    <main>
      <section class="section">
        <div class="checkout-done card">
          <div class="eyebrow">Bestelling geplaatst</div>
          <h1 class="display">Downloadlink onderweg.</h1>
          <p>We sturen de hoge-res downloads naar ${escapeHtml(state.checkout.email || "je e-mailadres")}. In de echte checkout wordt dit gekoppeld aan de betaalprovider en downloadbackend.</p>
          <div class="checkout-actions">
            <button class="btn dark lg" data-nav="events">Meer evenementen</button>
            <button class="btn ghost lg" data-reset-checkout>Nieuwe bestelling</button>
          </div>
        </div>
      </section>
    </main>
    ${footerHtml()}
  `;
}

// Fallback pakketten — worden vervangen door pricing.json zodra geladen
const PACKAGES_FALLBACK = [
  { id: "light",       naam: "Light",        tagline: "Kennismaking",  prijs: 50,  omschrijving: "Eerste keer kennis maken met sportfotografie van jouw team.",       features: ["1 wedstrijd","20 downloadcredits","Beelden naar keuze","Hi-res zonder watermerk"], populair: false, donker: false },
  { id: "basis",       naam: "Basispakket",  tagline: "Meest gekozen", prijs: 75,  omschrijving: "Een volledige wedstrijd met een ruime selectie hoge-resolutiebeelden.", features: ["1 wedstrijd","Min. 100 hi-res beelden","Online galerij","Downloadlink binnen 48u"], populair: true,  donker: false },
  { id: "individueel", naam: "Individueel",  tagline: "Persoonlijk",   prijs: 100, omschrijving: "De fotograaf focust op één speler en levert een persoonlijke selectie.",  features: ["1 wedstrijd","Focus op 1 speler","Persoonlijke selectie","Hi-res zonder watermerk"], populair: false, donker: false },
  { id: "totaal",      naam: "Totaalpakket", tagline: "Alles erin",    prijs: 250, omschrijving: "Alle beelden van de wedstrijd in volle resolutie — niets wordt achtergehouden.", features: ["1 wedstrijd","Alle beelden hi-res","Onbeperkte downloads","Online galerij inbegrepen"], populair: false, donker: true  },
];

function packages() {
  return PRICING.pakketten.length ? PRICING.pakketten : PACKAGES_FALLBACK;
}

function organizersHtml() {
  return `
    ${navHtml("organizers")}
    <main>
      <section class="page-header">
        <div class="page-header-row">
          <div>
            <div class="eyebrow">Voor clubs &amp; organisaties</div>
            <h1 class="display page-title">Foto's laten <span style="color:var(--cp-red)">maken?</span></h1>
          </div>
        </div>
        <p style="max-width:640px;font-size:17px;line-height:1.65;color:var(--cp-ink);margin:0">
          CP-sportfotografie fotografeert jouw wedstrijd van begin tot eind. Kies een pakket dat past bij jouw club of evenement — van een eerste kennismaking tot een complete galerij voor de hele selectie.
        </p>
      </section>
      <section class="section">
        <div class="pkg-grid">
          ${packages().map((pkg) => `
            <article class="card pkg-card ${pkg.donker ? "pkg-dark" : ""} ${pkg.populair ? "pkg-popular" : ""}">
              ${pkg.populair ? `<div class="pkg-badge">⭐ Meest gekozen</div>` : ""}
              <div class="eyebrow" style="${pkg.donker ? "color:rgba(255,255,255,.55)" : ""}">${pkg.tagline}</div>
              <h2 class="display pkg-name" style="${pkg.donker ? "color:white" : ""}">${pkg.naam}</h2>
              <p class="pkg-desc" style="${pkg.donker ? "color:rgba(255,255,255,.72)" : ""}">${pkg.omschrijving}</p>
              <div class="pkg-price">
                <span class="num" style="color:${pkg.donker ? "var(--cp-zest)" : "var(--cp-navy)"};font-size:64px">${euro(pkg.prijs)}</span>
                <span style="font-size:13px;color:${pkg.donker ? "rgba(255,255,255,.55)" : "var(--cp-mute)"}">per wedstrijd</span>
              </div>
              <ul class="pkg-list" style="${pkg.donker ? "color:rgba(255,255,255,.85)" : ""}">
                ${pkg.features.map((f) => `<li><span class="check">${icon("check")}</span>${f}</li>`).join("")}
              </ul>
              <button class="btn ${pkg.donker ? "primary" : "dark"} lg pkg-cta" data-nav="contact" data-pkg="${pkg.id}">Boek ${pkg.naam} →</button>
            </article>
          `).join("")}
        </div>
      </section>
      <section class="quote-section" style="text-align:center">
        <div style="position:relative;max-width:720px;margin:0 auto">
          <div class="eyebrow" style="margin-bottom:18px">Op maat</div>
          <p class="display" style="font-size:clamp(36px,4vw,56px);color:var(--cp-navy);margin:0 0 20px">Toch iets anders nodig?</p>
          <p style="font-size:16px;line-height:1.65;color:var(--cp-ink);max-width:480px;margin:0 auto 28px">Meerdere wedstrijden, een seizoenspakket of iets speciaals? Stuur een berichtje en ik denk graag mee.</p>
          <button class="btn dark lg" data-nav="contact">Neem contact op →</button>
        </div>
      </section>
    </main>
    ${footerHtml()}
  `;
}

function contactHtml() {
  if (state.contactForm.sent) {
    return `
      ${navHtml("contact")}
      <main>
        <section class="section">
          <div class="checkout-done card">
            <div class="eyebrow">Bericht verstuurd</div>
            <h1 class="display">Bedankt!<br /><span style="color:var(--cp-red)">Ik neem snel contact op.</span></h1>
            <p>Je bericht is ontvangen. Ik reageer meestal binnen één werkdag op <strong>${escapeHtml(state.contactForm.email || "je e-mailadres")}</strong>.</p>
            <div class="checkout-actions">
              <button class="btn dark lg" data-nav="home">Terug naar home</button>
              <button class="btn ghost lg" data-reset-contact>Nieuw bericht</button>
            </div>
          </div>
        </section>
      </main>
      ${footerHtml()}
    `;
  }

  return `
    ${navHtml("contact")}
    <main>
      <section class="page-header">
        <div class="page-header-row">
          <div>
            <div class="eyebrow">Stuur een berichtje</div>
            <h1 class="display page-title">Con<span style="color:var(--cp-red)">tact</span>.</h1>
          </div>
        </div>
      </section>
      <section class="section" style="padding-top:40px">
        <div class="contact-grid">
          <div class="card contact-form">
            <div class="checkout-fields">
              <label>Naam<input data-contact-field="naam" value="${escapeHtml(state.contactForm.naam)}" placeholder="Jan de Vries" autocomplete="name" /></label>
              <label>E-mail<input data-contact-field="email" type="email" value="${escapeHtml(state.contactForm.email)}" placeholder="naam@example.nl" autocomplete="email" inputmode="email" /></label>
            </div>
            <label class="contact-label">Telefoon <span style="font-weight:400;opacity:.55">(optioneel)</span>
              <input data-contact-field="telefoon" type="tel" value="${escapeHtml(state.contactForm.telefoon)}" placeholder="+31 6 12 34 56 78" autocomplete="tel" />
            </label>
            <label class="contact-label">Bericht
              <textarea data-contact-field="bericht" rows="6" placeholder="Vertel iets over je club, de wedstrijd of het evenement...">${escapeHtml(state.contactForm.bericht)}</textarea>
            </label>
            <div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap">
              <button class="btn primary lg" data-send-contact>Verstuur bericht →</button>
              <span class="checkout-note" style="margin:0">Ik reageer meestal binnen één werkdag.</span>
            </div>
          </div>
          <div class="contact-sidebar">
            <div class="card" style="padding:28px">
              <div class="eyebrow" style="margin-bottom:18px">Direct contact</div>
              <div class="contact-info-row">
                <span class="mono" style="font-size:11px;letter-spacing:.14em;color:var(--cp-mute)">E-MAIL</span>
                <a href="mailto:info@cp-sportfotografie.nl" style="color:var(--cp-navy);font-weight:700;text-decoration:none">info@cp-sportfotografie.nl</a>
              </div>
              <div class="contact-info-row">
                <span class="mono" style="font-size:11px;letter-spacing:.14em;color:var(--cp-mute)">GEBASEERD IN</span>
                <span style="font-weight:700;color:var(--cp-navy)">Utrecht · heel Nederland</span>
              </div>
              <div class="contact-info-row" style="border:0;padding-bottom:0">
                <span class="mono" style="font-size:11px;letter-spacing:.14em;color:var(--cp-mute)">REACTIETIJD</span>
                <span style="font-weight:700;color:var(--cp-navy)">Binnen 1 werkdag</span>
              </div>
            </div>
            <div class="card" style="padding:28px;margin-top:16px">
              <div class="eyebrow" style="margin-bottom:14px">Pakketten</div>
              <p style="margin:0 0 18px;font-size:14px;line-height:1.6;color:var(--cp-ink)">Interesse in een pakket? Vermeld dan welk pakket en de datum van de wedstrijd in je bericht.</p>
              <button class="btn ghost" data-nav="organizers">Bekijk pakketten →</button>
            </div>
          </div>
        </div>
      </section>
    </main>
    ${footerHtml()}
  `;
}

function privacyHtml() {
  return `
    ${navHtml("privacy")}
    <main>
      <section class="page-header">
        <div class="page-header-row">
          <div>
            <div class="eyebrow">Jouw rechten</div>
            <h1 class="display page-title">Pri<span style="color:var(--cp-red)">vacy</span>.</h1>
          </div>
        </div>
      </section>
      <section class="section privacy-content">
        <div class="privacy-body">

          <div class="privacy-block">
            <h2 class="display" style="font-size:36px;color:var(--cp-navy)">We vinden privacy belangrijk.</h2>
            <p>Bij CP-sportfotografie fotograferen we sport zoals het hoort: met respect voor iedereen in beeld. We werken uitsluitend <strong>op uitnodiging van clubs, teams of individuele sporters</strong>. Foto's worden nooit zonder context of toestemming gepubliceerd.</p>
          </div>

          <div class="privacy-block">
            <h2 class="display" style="font-size:28px;color:var(--cp-navy)">Hoe we werken</h2>
            <ul class="privacy-list">
              <li><span class="check">${icon("check")}</span>We fotograferen alleen na een boeking of uitnodiging van een club, team of organisator.</li>
              <li><span class="check">${icon("check")}</span>Foto's worden uitsluitend geplaatst in een afgeschermde galerij die gekoppeld is aan een specifiek evenement.</li>
              <li><span class="check">${icon("check")}</span>We verkopen geen persoonsgegevens aan derden.</li>
              <li><span class="check">${icon("check")}</span>Betaalgegevens worden verwerkt via een gecertificeerde betaalprovider en nooit door ons opgeslagen.</li>
              <li><span class="check">${icon("check")}</span>E-mailadressen die worden achtergelaten bij een aankoop gebruiken we alleen voor het bezorgen van de downloadlink.</li>
            </ul>
          </div>

          <div class="privacy-block privacy-highlight">
            <h2 class="display" style="font-size:28px;color:var(--cp-navy)">Sta je op een foto en wil je hem offline laten halen?</h2>
            <p>Dat kan — en we handelen dit snel af. Ga naar de foto in kwestie en klik op de link <strong>"Privacy melden"</strong> onder de foto. Er opent automatisch een e-mail met de foto-informatie al ingevuld. Verstuur de e-mail en we halen de foto <strong>binnen 5 werkdagen offline</strong>.</p>
            <p>Je hoeft geen account te hebben om een melding te doen.</p>
            <button class="btn dark" data-nav="events">Ga naar de albums →</button>
          </div>

          <div class="privacy-block">
            <h2 class="display" style="font-size:28px;color:var(--cp-navy)">Cookies &amp; analytics</h2>
            <p>Deze website plaatst geen tracking-cookies en gebruikt geen externe analysediensten zoals Google Analytics. We slaan alleen de inhoud van je winkelmandje op in je browser (localStorage) zodat je selectie bewaard blijft. Zodra je je browser sluit of het mandje leegt, verdwijnen deze gegevens.</p>
          </div>

          <div class="privacy-block">
            <h2 class="display" style="font-size:28px;color:var(--cp-navy)">Contact &amp; vragen</h2>
            <p>Heb je vragen over hoe we omgaan met jouw gegevens, of wil je een foto laten verwijderen? Neem dan contact op via <a href="mailto:info@cp-sportfotografie.nl" style="color:var(--cp-red);font-weight:700">info@cp-sportfotografie.nl</a> of via het contactformulier.</p>
            <div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:18px">
              <button class="btn primary" data-nav="contact">Contactformulier →</button>
              <a class="btn ghost" href="mailto:info@cp-sportfotografie.nl">Stuur direct een e-mail</a>
            </div>
          </div>

          <p class="privacy-meta">Laatste update: mei 2026 · CP-sportfotografie · Utrecht</p>
        </div>
      </section>
    </main>
    ${footerHtml()}
  `;
}

function render() {
  const album = currentAlbum();
  const titles = {
    home: "CP-sportfotografie",
    events: "Albums · CP-sportfotografie",
    gallery: `${album?.title || "Galerij"} · CP-sportfotografie`,
    detail: `Foto · CP-sportfotografie`,
    checkout: "Afrekenen · CP-sportfotografie",
    organizers: "Foto's laten maken · CP-sportfotografie",
    contact: "Contact · CP-sportfotografie",
    privacy: "Privacy · CP-sportfotografie",
  };
  document.title = titles[state.screen] || "CP-sportfotografie";
  app.className = "app-shell";
  app.innerHTML = state.screen === "events" ? eventsHtml()
    : state.screen === "gallery" ? galleryHtml()
    : state.screen === "detail" ? detailHtml()
    : state.screen === "checkout" ? checkoutHtml()
    : state.screen === "organizers" ? organizersHtml()
    : state.screen === "contact" ? contactHtml()
    : state.screen === "privacy" ? privacyHtml()
    : homeHtml();
}

document.addEventListener("click", (event) => {
  // Mobile menu toggle — no full re-render, just toggle classes
  const menuToggle = event.target.closest("[data-menu-toggle]");
  if (menuToggle) {
    event.preventDefault();
    state.menuOpen = !state.menuOpen;
    document.querySelector(".hamburger")?.classList.toggle("open", state.menuOpen);
    document.querySelector(".mobile-nav-drawer")?.classList.toggle("open", state.menuOpen);
    document.querySelector(".mobile-nav-backdrop")?.classList.toggle("open", state.menuOpen);
    menuToggle.setAttribute("aria-expanded", state.menuOpen);
    menuToggle.setAttribute("aria-label", state.menuOpen ? "Menu sluiten" : "Menu openen");
    return;
  }

  const menuClose = event.target.closest("[data-menu-close]");
  if (menuClose) {
    state.menuOpen = false;
    document.querySelector(".hamburger")?.classList.remove("open");
    document.querySelector(".mobile-nav-drawer")?.classList.remove("open");
    document.querySelector(".mobile-nav-backdrop")?.classList.remove("open");
    return;
  }

  const cartButton = event.target.closest("[data-cart]");
  if (cartButton) {
    event.preventDefault();
    event.stopPropagation();
    toggleCart(cartButton.dataset.cart);
    return;
  }

  const removeCartButton = event.target.closest("[data-remove-cart]");
  if (removeCartButton) {
    event.preventDefault();
    setCart(state.cart.filter((id) => id !== removeCartButton.dataset.removeCart));
    render();
    return;
  }

  const paymentInput = event.target.closest("[data-payment]");
  if (paymentInput) {
    state.checkout.payment = paymentInput.value;
    render();
    return;
  }

  const termsInput = event.target.closest("[data-checkout-terms]");
  if (termsInput) {
    state.checkout.terms = termsInput.checked;
    return;
  }

  const placeOrderButton = event.target.closest("[data-place-order]");
  if (placeOrderButton) {
    event.preventDefault();
    // Remove any stacked error messages first
    document.querySelectorAll(".checkout-error").forEach((el) => el.remove());
    if (!cartPhotos().length) {
      nav("events");
      return;
    }
    if (!state.checkout.email || !state.checkout.terms) {
      placeOrderButton.insertAdjacentHTML("afterend", '<p class="checkout-error">Vul je e-mail in en accepteer de digitale levering.</p>');
      return;
    }
    setCart([]);
    state.checkoutStep = "done";
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  const resetCheckoutButton = event.target.closest("[data-reset-checkout]");
  if (resetCheckoutButton) {
    state.checkoutStep = "details";
    state.checkout = { name: "", email: "", payment: "ideal", terms: false };
    nav("events");
    return;
  }

  const sendContactButton = event.target.closest("[data-send-contact]");
  if (sendContactButton) {
    event.preventDefault();
    document.querySelectorAll(".contact-error").forEach((el) => el.remove());
    if (!state.contactForm.naam || !state.contactForm.email || !state.contactForm.bericht) {
      sendContactButton.insertAdjacentHTML("afterend", '<p class="contact-error checkout-error">Vul je naam, e-mail en bericht in.</p>');
      return;
    }
    // TODO: koppel hier Formspree of een andere form-backend aan
    state.contactForm.sent = true;
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  const resetContactButton = event.target.closest("[data-reset-contact]");
  if (resetContactButton) {
    state.contactForm = { naam: "", email: "", telefoon: "", bericht: "", sent: false };
    nav("contact");
    return;
  }

  const pkgButton = event.target.closest("[data-pkg]");
  if (pkgButton && event.target.closest("[data-nav='contact']")) {
    const pkg = packages().find((p) => p.id === pkgButton.dataset.pkg);
    if (pkg) state.contactForm.bericht = `Ik heb interesse in het ${pkg.naam} (€${pkg.prijs}). `;
  }

  const detailButton = event.target.closest("[data-detail]");
  if (detailButton) {
    event.preventDefault();
    nav("detail", detailButton.dataset.detail);
    return;
  }

  const navButton = event.target.closest("[data-nav]");
  if (navButton) {
    event.preventDefault();
    state.menuOpen = false;
    const target = navButton.dataset.nav;
    nav(target);
    const scrollTarget = navButton.dataset.scroll;
    if (scrollTarget) requestAnimationFrame(() => document.getElementById(scrollTarget)?.scrollIntoView());
    return;
  }

  const sportButton = event.target.closest("[data-sport]");
  if (sportButton) {
    state.sport = sportButton.dataset.sport;
    render();
    return;
  }

  const albumButton = event.target.closest("[data-album]");
  if (albumButton) {
    event.preventDefault();
    openAlbum(albumButton.dataset.album);
    return;
  }

  if (event.target.closest("[data-clear]")) {
    state.bib = "";
    render();
    return;
  }

  if (event.target.closest("[data-clear-bib]")) {
    state.bib = "";
    render();
  }
});

document.addEventListener("input", (event) => {
  if (event.target.matches("[data-checkout-field]")) {
    state.checkout[event.target.dataset.checkoutField] = event.target.value;
    document.querySelectorAll(".checkout-error").forEach((el) => el.remove());
    return;
  }

  if (event.target.matches("[data-contact-field]")) {
    state.contactForm[event.target.dataset.contactField] = event.target.value;
    document.querySelectorAll(".contact-error").forEach((el) => el.remove());
    return;
  }

  if (event.target.matches("#events-search")) {
    state.eventSearch = event.target.value;
    render();
    // Restore focus to the search input after re-render
    const restored = document.getElementById("events-search");
    if (restored) { restored.focus(); restored.setSelectionRange(restored.value.length, restored.value.length); }
    return;
  }

  if (event.target.matches("#home-bib, #gallery-bib")) {
    state.bib = event.target.value.replace(/\D/g, "").slice(0, 5);
    event.target.value = state.bib;
    if (event.target.id === "gallery-bib") render();
  }
});

Promise.all([loadAlbums(), loadPricing()]).then(() => {
  applyHash(); // pas URL-hash toe vóórdat we renderen
  render();
});
