/* global React */
const { useState, useEffect, useMemo } = React;

// ──────────────────────────────────────────────────────────────────────────
// Logo — inline SVG re-creation of the CP shutter mark (motion-line C + P sliver)
// ──────────────────────────────────────────────────────────────────────────
function Logo({ size = 36, wordmark = true }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <svg viewBox="0 0 60 36" width={size * 1.7} height={size} style={{ display: 'block' }}>
        {/* speed lines */}
        <path d="M0 14 L12 14" stroke="var(--cp-navy)" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M3 21 L14 21" stroke="var(--cp-red)" strokeWidth="2.2" strokeLinecap="round" />
        {/* C ring */}
        <path
          d="M40 18 a14 14 0 1 0 -14 14"
          stroke="var(--cp-navy)" strokeWidth="6.5" fill="none" strokeLinecap="round"
        />
        {/* P stem */}
        <rect x="32" y="9.5" width="6" height="22" rx="1" fill="var(--cp-red)" transform="skewX(-12)" />
        {/* shutter aperture */}
        <circle cx="44" cy="18" r="6.5" fill="var(--cp-navy)" />
        <path d="M44 12 L47 16 L43 19 Z M44 24 L41 20 L45 17 Z" fill="var(--cp-red)" />
      </svg>
      {wordmark && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 1, height: 26, background: 'var(--cp-line)' }} />
          <div className="display" style={{ fontSize: 18, lineHeight: 1, color: 'var(--cp-navy)' }}>
            CP<br />
            <span style={{ fontSize: 9, letterSpacing: '.14em', fontFamily: 'var(--font-mono)', color: 'var(--cp-mute)', fontWeight: 600 }}>SPORTFOTOGRAFIE</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Photo data — fake catalog. picsum.photos works for hi-fi prototypes.
// ──────────────────────────────────────────────────────────────────────────
const SPORTS = ['hardlopen', 'voetbal', 'hockey', 'trail'];
const TEAMS = [
  { id: 'red',    label: 'Rood',     color: '#E62333' },
  { id: 'blue',   label: 'Blauw',    color: '#1E63D6' },
  { id: 'yellow', label: 'Geel',     color: '#F2C400' },
  { id: 'white',  label: 'Wit',      color: '#F5F2EB' },
  { id: 'green',  label: 'Groen',    color: '#1F8A5B' },
  { id: 'black',  label: 'Zwart',    color: '#1A1A1F' },
];

// Stable seeded photo set. Bib numbers/timestamps are deterministic so the
// gallery and detail screens reference the same items.
const PHOTOS = (() => {
  const seeds = [
    'cp-101','cp-102','cp-103','cp-104','cp-105','cp-106','cp-107','cp-108',
    'cp-201','cp-202','cp-203','cp-204','cp-205','cp-206','cp-207','cp-208',
    'cp-301','cp-302','cp-303','cp-304','cp-305','cp-306','cp-307','cp-308',
  ];
  const bibs = [218,4218,87,512,1402,33,2901,177, 89,4042,612,3120,77,2204,499,1818, 308,156,2740,901,4451,265,1188,3344];
  const ts   = ['09:14:32','09:14:47','09:15:01','09:15:22','09:15:48','09:16:03','09:16:19','09:16:40',
                '09:17:04','09:17:22','09:17:39','09:18:01','09:18:18','09:18:35','09:18:54','09:19:11',
                '09:19:29','09:19:48','09:20:03','09:20:18','09:20:32','09:20:47','09:21:01','09:21:18'];
  const ratios = [4/5, 3/2, 1/1, 4/5, 2/3, 3/2, 5/4, 4/5];
  return seeds.map((s, i) => ({
    id: s,
    src: `https://picsum.photos/seed/${s}/600/${Math.round(600 / ratios[i % ratios.length])}`,
    ratio: ratios[i % ratios.length],
    bib: bibs[i],
    ts: ts[i],
    team: TEAMS[i % TEAMS.length].id,
    sport: i < 8 ? 'hardlopen' : (i < 16 ? 'voetbal' : 'hockey'),
    price: [5, 7, 9, 12][i % 4],
    event: 'rotterdam-stadsloop-2026',
  }));
})();

// ──────────────────────────────────────────────────────────────────────────
// PhotoCard — used in gallery & detail.
// ──────────────────────────────────────────────────────────────────────────
function PhotoCard({ photo, watermark = true, showMeta = true, onClick, inCart, onCart }) {
  const aspect = photo.ratio || 4/5;
  return (
    <div
      className={`photo${watermark ? '' : ' no-wm'}`}
      style={{ aspectRatio: aspect }}
      onClick={onClick}
    >
      <img src={photo.src} alt="" loading="lazy" />
      {watermark && <span className="wm" />}
      {showMeta && (
        <>
          <span className="bib mono">#{photo.bib}</span>
          <button
            className={`heart${inCart ? ' on' : ''}`}
            onClick={(e) => { e.stopPropagation(); onCart && onCart(photo); }}
            aria-label="toevoegen"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill={inCart ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 21s-7-4.35-9.5-9C.9 8.5 3 4 7.5 4c2 0 3.4 1.1 4.5 2.5C13.1 5.1 14.5 4 16.5 4 21 4 23.1 8.5 21.5 12c-2.5 4.65-9.5 9-9.5 9z" />
            </svg>
          </button>
          <span className="ts">{photo.ts}</span>
          <span className="px">€{photo.price.toFixed(2)}</span>
        </>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Nav (web)
// ──────────────────────────────────────────────────────────────────────────
function Nav({ active = 'home', cartCount = 0, onNav }) {
  return (
    <div className="nav">
      <a className="logo" onClick={() => onNav && onNav('home')}>
        <Logo size={32} />
      </a>
      <div style={{ flex: 1 }} />
      <div className="links">
        <a className={active==='events'?'active':''} onClick={() => onNav && onNav('events')}>Evenementen</a>
        <a>Hoe het werkt</a>
        <a>Voor organisatoren</a>
        <a>Contact</a>
      </div>
      <div style={{ width: 1, height: 24, background: 'var(--cp-line)' }} />
      <a className="links" style={{ display:'flex', alignItems:'center', gap:6, cursor:'pointer' }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7"/></svg>
        <span style={{ fontSize: 13, fontWeight: 600 }}>Inloggen</span>
      </a>
      <button className="btn dark" style={{ position: 'relative' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M6 6h15l-2 11H8L6 6z"/><circle cx="9" cy="20" r="1.6"/><circle cx="18" cy="20" r="1.6"/><path d="M6 6L4 3H2"/></svg>
        Mandje
        {cartCount > 0 && (
          <span style={{
            background: 'var(--cp-red)', color: '#fff', minWidth: 20, height: 20,
            borderRadius: 999, padding: '0 6px', display: 'inline-flex',
            alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700,
            marginLeft: 2,
          }}>{cartCount}</span>
        )}
      </button>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Event data
// ──────────────────────────────────────────────────────────────────────────
const EVENTS = [
  { id:'rotterdam', name:'Stadsloop Rotterdam', date:'24 MEI', year:'2026', sport:'Hardlopen', dist:'10K · 21K · 42K', photos:14203, live:true, region:'Zuid-Holland', img:'https://picsum.photos/seed/cp-evt-1/900/600' },
  { id:'fcnoord',   name:'FC Noord — Sparta U17', date:'18 MEI', year:'2026', sport:'Voetbal', dist:'Jeugd · Eredivisie', photos:982, live:false, region:'Amsterdam', img:'https://picsum.photos/seed/cp-evt-2/900/600' },
  { id:'trailveluwe',name:'Trail Veluwe',date:'11 MEI', year:'2026', sport:'Trail', dist:'15K · 30K · 55K', photos:6710, live:false, region:'Gelderland', img:'https://picsum.photos/seed/cp-evt-3/900/600' },
  { id:'hockeyrijswijk',name:'HC Rijswijk — Bloemendaal', date:'04 MEI', year:'2026', sport:'Hockey', dist:'Hoofdklasse Heren', photos:1240, live:false, region:'Zuid-Holland', img:'https://picsum.photos/seed/cp-evt-4/900/600' },
  { id:'duinrun',   name:'Duinen Halve', date:'27 APR', year:'2026', sport:'Hardlopen', dist:'10K · 21K', photos:8390, live:false, region:'Noord-Holland', img:'https://picsum.photos/seed/cp-evt-5/900/600' },
  { id:'kampioenschap',name:'NK Veldlopen U23', date:'20 APR', year:'2026', sport:'Hardlopen', dist:'Elite · U23', photos:3120, live:false, region:'Utrecht', img:'https://picsum.photos/seed/cp-evt-6/900/600' },
];

// Make accessible globally to other script files
Object.assign(window, {
  Logo, PhotoCard, Nav, PHOTOS, EVENTS, TEAMS, SPORTS,
});
