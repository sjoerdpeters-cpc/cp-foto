/* global React, Logo, PhotoCard, Nav, PHOTOS, EVENTS, TEAMS */
const { useState: useStateS, useMemo: useMemoS } = React;

// ════════════════════════════════════════════════════════════════════════════
// 1. HOMEPAGE
// ════════════════════════════════════════════════════════════════════════════
function Homepage({ onNav }) {
  const [bib, setBib] = useStateS('');
  return (
    <div className="cp" style={{ width: 1440, minHeight: 1860, position: 'relative' }} data-screen-label="01 Homepage">
      <Nav active="home" onNav={onNav} />

      {/* HERO */}
      <section style={{ position: 'relative', padding: '64px 64px 80px', overflow: 'hidden' }}>
        {/* speed-line accent */}
        <div className="speed-bg" style={{ position: 'absolute', inset: 0, opacity: .35, pointerEvents: 'none' }} />
        <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1.05fr .95fr', gap: 56, alignItems: 'start' }}>
          {/* left: headline + bib search */}
          <div>
            <div className="eyebrow" style={{ marginBottom: 22 }}>
              <span className="live">SINDS 06:14 — LIVE UPLOAD</span>
              <span style={{ margin: '0 10px', color: 'var(--cp-line)' }}>/</span>
              Stadsloop Rotterdam · 24 mei 2026
            </div>
            <h1 className="display" style={{ fontSize: 124, margin: '0 0 0', color: 'var(--cp-navy)' }}>
              Jij. <span style={{ color: 'var(--cp-red)' }}>Aan&nbsp;de</span><br />finish.
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '26px 0 32px' }}>
              <span className="tick" />
              <p style={{ margin: 0, fontSize: 18, fontWeight: 500, color: 'var(--cp-ink)', maxWidth: 520, lineHeight: 1.45 }}>
                Zoek je foto op startnummer, op teamkleur of op het moment.
                Voorbeeld gratis. Hoge-res zonder watermerk vanaf €5.
              </p>
            </div>

            {/* Bib quicksearch */}
            <div style={{ background: 'var(--cp-navy)', padding: 24, borderRadius: 22, color: '#fff', maxWidth: 580 }}>
              <div className="eyebrow" style={{ color: 'rgba(255,255,255,.6)', marginBottom: 14 }}>Snel zoeken · startnummer</div>
              <div className="field bib lg" style={{ background: '#fff' }}>
                <span className="pre" style={{ color: 'var(--cp-red)' }}>#</span>
                <input
                  value={bib}
                  onChange={(e) => setBib(e.target.value.replace(/\D/g,'').slice(0,5))}
                  placeholder="4218"
                  inputMode="numeric"
                />
                <button className="btn primary lg" style={{ borderRadius: 999 }} onClick={() => onNav && onNav('gallery')}>
                  Vind mijn foto's →
                </button>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 14, fontSize: 12, color: 'rgba(255,255,255,.7)' }}>
                <span className="mono" style={{ letterSpacing: '.12em', textTransform: 'uppercase' }}>Geen nummer?</span>
                <a style={{ color:'#fff', textDecoration:'underline', textUnderlineOffset:3, fontWeight:600, cursor:'pointer' }} onClick={() => onNav && onNav('gallery')}>Zoek op kleur of moment →</a>
              </div>
            </div>
          </div>

          {/* right: hero photo with crop marks */}
          <div className="crop" style={{ position: 'relative' }}>
            <div className="crop-tr" /><div className="crop-br" />
            <div style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', aspectRatio: '4/5' }}>
              <img src="https://picsum.photos/seed/cp-hero/900/1100" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'saturate(1.1) contrast(1.05)' }} />
              {/* watermark */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(14,42,85,.55), transparent 40%)',
                pointerEvents: 'none',
              }} />
              <div style={{ position: 'absolute', bottom: 24, left: 24, color: '#fff' }}>
                <div className="mono" style={{ fontSize: 11, letterSpacing: '.14em', opacity: .85 }}>SHOT BY · CHRIS P.</div>
                <div className="display" style={{ fontSize: 48, marginTop: 6, color: '#fff' }}>#4218</div>
                <div className="mono" style={{ fontSize: 12, opacity: .9, marginTop: 4 }}>09:14:32 — KM 18</div>
              </div>
              <div style={{ position:'absolute', top:20, right:20, background:'var(--cp-red)', color:'#fff', padding:'6px 12px', borderRadius:999, fontFamily:'var(--font-mono)', fontSize:11, fontWeight:700, letterSpacing:'.12em' }}>
                NIEUW
              </div>
            </div>
            {/* big bracket numeral as ornament */}
            <div className="display" style={{ position: 'absolute', top: -28, left: -8, fontSize: 84, color: 'var(--cp-red)', lineHeight: 1, mixBlendMode: 'multiply' }}>[</div>
            <div className="display" style={{ position: 'absolute', bottom: -28, right: -8, fontSize: 84, color: 'var(--cp-red)', lineHeight: 1, mixBlendMode: 'multiply' }}>]</div>
          </div>
        </div>
      </section>

      {/* MARQUEE STAT BAR */}
      <section style={{ background: 'var(--cp-navy-deep)', color: '#fff', padding: '22px 64px', display: 'flex', alignItems: 'center', gap: 48 }}>
        {[
          ['142', 'evenementen'],
          ['68K', 'foto\'s online'],
          ['09:14', 'snelste upload'],
          ['€5', 'vanaf'],
          ['24/7', 'download'],
        ].map(([n, l], i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <span className="num" style={{ fontSize: 34, color: 'var(--cp-zest)' }}>{n}</span>
            <span className="mono" style={{ fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,.7)' }}>{l}</span>
          </div>
        ))}
        <div style={{ flex: 1 }} />
        <span className="mono" style={{ fontSize: 11, letterSpacing: '.18em', color: 'rgba(255,255,255,.5)' }}>EST. 2026 — UTRECHT, NL</span>
      </section>

      {/* HOE HET WERKT */}
      <section style={{ padding: '80px 64px' }}>
        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom: 40 }}>
          <div>
            <div className="eyebrow">Drie stappen</div>
            <h2 className="display" style={{ fontSize: 72, margin: '8px 0 0', color: 'var(--cp-navy)' }}>Zo werkt het.</h2>
          </div>
          <p style={{ maxWidth: 380, fontSize: 15, color: 'var(--cp-mute)', margin: 0, lineHeight: 1.5 }}>
            Foto's verschijnen live tijdens het evenement. Geen account nodig om te zoeken.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {[
            ['01', 'Zoek', 'Voer je startnummer in. Geen nummer? Filter op teamkleur en het tijdsblok dat je voorbij kwam.'],
            ['02', 'Kies', 'Bekijk previews gratis. Klik door, selecteer je favorieten — meerdere foto\'s = meer korting.'],
            ['03', 'Download', 'Reken af. Hoge-res zonder watermerk direct in je inbox. Print los te bestellen.'],
          ].map(([n, t, d]) => (
            <div key={n} className="card" style={{ padding: 28, position: 'relative', overflow: 'hidden' }}>
              <div className="display" style={{ position: 'absolute', top: -20, right: -10, fontSize: 160, color: 'var(--cp-paper-2)', lineHeight: 1, pointerEvents: 'none' }}>{n}</div>
              <div className="display" style={{ fontSize: 32, color: 'var(--cp-navy)', position: 'relative' }}>{t}</div>
              <p style={{ position: 'relative', margin: '14px 0 0', fontSize: 14, color: 'var(--cp-ink)', lineHeight: 1.55, maxWidth: 320 }}>{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* RECENT EVENTS GRID */}
      <section style={{ padding: '24px 64px 96px' }}>
        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom: 28 }}>
          <div>
            <div className="eyebrow">Recent geüpload</div>
            <h2 className="display" style={{ fontSize: 56, margin: '8px 0 0', color: 'var(--cp-navy)' }}>Vers van de lens.</h2>
          </div>
          <a className="btn ghost" onClick={() => onNav && onNav('events')} style={{ textDecoration: 'none' }}>Alle evenementen →</a>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap: 16 }}>
          {EVENTS.slice(0, 4).map(e => (
            <div key={e.id} className="card" style={{ overflow:'hidden', cursor:'pointer' }} onClick={() => onNav && onNav(e.id === 'rotterdam' ? 'gallery' : 'events')}>
              <div style={{ position:'relative', aspectRatio:'4/3' }}>
                <img src={e.img} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(14,42,85,.7), transparent 50%)' }} />
                <div style={{ position:'absolute', left:14, top:14, background:'#fff', padding:'4px 8px', borderRadius:4, fontFamily:'var(--font-mono)', fontSize:10, fontWeight:700, letterSpacing:'.14em', color:'var(--cp-navy)' }}>{e.sport.toUpperCase()}</div>
                {e.live && <div style={{ position:'absolute', right:14, top:14, background:'var(--cp-red)', color:'#fff', padding:'4px 10px', borderRadius:999, fontFamily:'var(--font-mono)', fontSize:10, fontWeight:700, letterSpacing:'.18em' }}>● LIVE</div>}
                <div style={{ position:'absolute', left:14, bottom:14, color:'#fff' }}>
                  <div className="display" style={{ fontSize: 22, lineHeight:1 }}>{e.name}</div>
                  <div className="mono" style={{ fontSize:11, opacity:.85, marginTop:4 }}>{e.date} {e.year}</div>
                </div>
              </div>
              <div style={{ padding:'14px 16px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <span className="mono" style={{ fontSize:12, color:'var(--cp-mute)' }}>{e.dist}</span>
                <span className="num" style={{ fontSize:22, color:'var(--cp-navy)' }}>{e.photos.toLocaleString('nl-NL')}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BIG QUOTE */}
      <section style={{ background: 'var(--cp-paper-2)', padding: '88px 64px', position: 'relative', overflow:'hidden' }}>
        <div className="display" style={{ fontSize: 280, color: 'var(--cp-paper-3)', position: 'absolute', top: -60, right: -20, lineHeight: 1 }}>"</div>
        <div style={{ position: 'relative', maxWidth: 980 }}>
          <div className="eyebrow" style={{ marginBottom: 18 }}>Manifest</div>
          <p className="display" style={{ fontSize: 88, color: 'var(--cp-navy)', margin: 0, lineHeight: .96 }}>
            Geen foto.<br />
            <span style={{ color: 'var(--cp-red)' }}>Geen bewijs.</span>
          </p>
          <p style={{ fontSize: 17, color: 'var(--cp-ink)', maxWidth: 600, marginTop: 28, lineHeight: 1.5 }}>
            Ik fotografeer sport zoals ik 'm zelf beleef — vol gas, lage hoek, oog voor de seconde dat het ertoe doet.
            Eén klik, jouw moment.
          </p>
          <button className="btn dark lg" style={{ marginTop: 28 }}>Mijn verhaal →</button>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 2. EVENT OVERVIEW
// ════════════════════════════════════════════════════════════════════════════
function Events({ onNav }) {
  const [sport, setSport] = useStateS('alle');
  const filtered = sport === 'alle' ? EVENTS : EVENTS.filter(e => e.sport.toLowerCase() === sport);
  return (
    <div className="cp" style={{ width: 1440, minHeight: 1400 }} data-screen-label="02 Evenementen">
      <Nav active="events" onNav={onNav} />

      <section style={{ padding: '56px 64px 32px', borderBottom: '1px solid var(--cp-line)' }}>
        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom: 24 }}>
          <div>
            <div className="eyebrow">Archief & live</div>
            <h1 className="display" style={{ fontSize: 96, margin: '8px 0 0', color: 'var(--cp-navy)' }}>
              Evene<span style={{ color:'var(--cp-red)' }}>menten</span>.
            </h1>
          </div>
          <div className="field" style={{ width: 340 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3-3"/></svg>
            <input placeholder="Zoek evenement, plaats, datum..." />
          </div>
        </div>

        <div style={{ display:'flex', alignItems:'center', gap: 8, flexWrap:'wrap' }}>
          {['alle', 'hardlopen', 'voetbal', 'hockey', 'trail'].map(s => (
            <button key={s} className={`chip${sport === s ? ' active' : ''}`} onClick={() => setSport(s)}>
              {s === 'alle' ? 'Alle sporten' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
          <div style={{ width: 1, height: 22, background: 'var(--cp-line)', margin: '0 6px' }} />
          {['Mei 2026', 'April 2026', 'Maart 2026'].map(m => (
            <button key={m} className="chip">{m}</button>
          ))}
          <div style={{ width: 1, height: 22, background: 'var(--cp-line)', margin: '0 6px' }} />
          <button className="chip">Met live-foto's</button>
          <button className="chip">Regio: Zuid-Holland</button>
          <div style={{ flex: 1 }} />
          <span className="mono" style={{ fontSize: 12, color: 'var(--cp-mute)' }}>
            {filtered.length} EVENEMENTEN · GESORTEERD OP DATUM
          </span>
        </div>
      </section>

      <section style={{ padding: '32px 64px 80px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {filtered.map(e => (
            <div key={e.id} className="card" style={{ display: 'grid', gridTemplateColumns: '180px 1.4fr 1fr auto', gap: 24, padding: 0, overflow:'hidden', cursor: 'pointer' }} onClick={() => onNav && onNav(e.id === 'rotterdam' ? 'gallery' : 'gallery')}>
              {/* date block */}
              <div style={{ background: 'var(--cp-navy)', color:'#fff', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding: 16, position: 'relative' }}>
                <div className="mono" style={{ fontSize: 11, letterSpacing: '.16em', opacity: .65 }}>{e.year}</div>
                <div className="display" style={{ fontSize: 56, marginTop: 4, lineHeight: 1 }}>{e.date.split(' ')[0]}</div>
                <div className="display" style={{ fontSize: 22, marginTop: 4, color: 'var(--cp-red)' }}>{e.date.split(' ')[1]}</div>
                {e.live && (
                  <div style={{ position:'absolute', top:10, right:10 }}>
                    <span className="live" style={{ color: '#fff' }}>LIVE</span>
                  </div>
                )}
              </div>
              {/* cover */}
              <div style={{ position:'relative', minHeight: 140 }}>
                <img src={e.img} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', position:'absolute', inset:0 }} />
              </div>
              {/* meta */}
              <div style={{ padding: '20px 4px', display: 'flex', flexDirection:'column', justifyContent:'center', gap: 8 }}>
                <div style={{ display: 'flex', alignItems:'center', gap:8 }}>
                  <span className="mono" style={{ fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--cp-red)', fontWeight:700 }}>{e.sport}</span>
                  <span style={{ width:3, height:3, borderRadius:99, background:'var(--cp-line)' }} />
                  <span className="mono" style={{ fontSize: 11, color: 'var(--cp-mute)' }}>{e.region}</span>
                </div>
                <div className="display" style={{ fontSize: 32, color:'var(--cp-navy)' }}>{e.name}</div>
                <div className="mono" style={{ fontSize: 12, color:'var(--cp-mute)' }}>{e.dist}</div>
              </div>
              {/* CTA */}
              <div style={{ padding: '20px 24px', display:'flex', flexDirection:'column', alignItems:'flex-end', justifyContent:'center', gap: 12, minWidth: 200 }}>
                <div style={{ textAlign:'right' }}>
                  <div className="num" style={{ fontSize: 40, color: 'var(--cp-navy)', lineHeight: 1 }}>{e.photos.toLocaleString('nl-NL')}</div>
                  <div className="mono" style={{ fontSize: 11, letterSpacing: '.14em', color: 'var(--cp-mute)', textTransform: 'uppercase' }}>foto's</div>
                </div>
                <button className="btn primary">Bekijk →</button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div style={{ display: 'flex', alignItems:'center', justifyContent:'center', gap: 6, marginTop: 40 }}>
          <button className="chip">←</button>
          <button className="chip active">1</button>
          <button className="chip">2</button>
          <button className="chip">3</button>
          <span className="mono" style={{ fontSize: 12, color: 'var(--cp-mute)', margin: '0 6px' }}>...</span>
          <button className="chip">12</button>
          <button className="chip">→</button>
        </div>
      </section>

      <Footer />
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 3. GALLERY — single event, search & filter
// ════════════════════════════════════════════════════════════════════════════
function Gallery({ onNav, watermark = true, layout = 'masonry', cart, addToCart }) {
  const [bib, setBib] = useStateS('');
  const [teams, setTeams] = useStateS([]);
  const [moment, setMoment] = useStateS('alle');

  const filtered = useMemoS(() => {
    return PHOTOS.filter(p => {
      if (bib && !String(p.bib).includes(bib)) return false;
      if (teams.length && !teams.includes(p.team)) return false;
      return true;
    });
  }, [bib, teams, moment]);

  const toggleTeam = (id) => setTeams(t => t.includes(id) ? t.filter(x => x !== id) : [...t, id]);

  return (
    <div className="cp" style={{ width: 1440, minHeight: 1700, background: 'var(--cp-paper)' }} data-screen-label="03 Galerij">
      <Nav cartCount={cart.length} onNav={onNav} />

      {/* Event banner */}
      <section style={{ position: 'relative', height: 260, overflow:'hidden' }}>
        <img src="https://picsum.photos/seed/cp-evt-1/1600/500" alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
        <div style={{ position:'absolute', inset: 0, background: 'linear-gradient(to right, rgba(14,42,85,.85) 0%, rgba(14,42,85,.5) 50%, transparent 100%)' }} />
        <div style={{ position:'absolute', inset: 0, padding: '40px 64px', display:'flex', flexDirection:'column', justifyContent:'center', color:'#fff' }}>
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:10 }}>
            <span className="mono" style={{ fontSize:11, letterSpacing:'.16em', opacity:.8 }}>← <a onClick={() => onNav && onNav('events')} style={{ color:'#fff', cursor:'pointer', textDecoration:'underline', textUnderlineOffset:3 }}>EVENEMENTEN</a></span>
            <span style={{ opacity:.4 }}>/</span>
            <span className="mono" style={{ fontSize:11, letterSpacing:'.16em', opacity:.8 }}>HARDLOPEN</span>
          </div>
          <h1 className="display" style={{ fontSize: 78, margin: 0, lineHeight: .96 }}>
            Stadsloop <span style={{ color:'var(--cp-zest)' }}>Rotterdam</span>
          </h1>
          <div style={{ display:'flex', alignItems:'center', gap: 24, marginTop: 14, fontSize: 14 }}>
            <span className="mono" style={{ letterSpacing:'.1em' }}>24 MEI 2026 · 09:00</span>
            <span style={{ width:4, height:4, borderRadius:99, background:'rgba(255,255,255,.4)' }} />
            <span className="mono" style={{ letterSpacing:'.1em' }}>14.203 FOTO'S</span>
            <span style={{ width:4, height:4, borderRadius:99, background:'rgba(255,255,255,.4)' }} />
            <span className="live">LIVE — laatste upload 2 min geleden</span>
          </div>
        </div>
      </section>

      {/* Sticky filter bar */}
      <section style={{ position: 'sticky', top: 0, zIndex: 5, background:'#fff', borderBottom:'1px solid var(--cp-line)', padding: '14px 64px', display:'flex', alignItems:'center', gap: 16 }}>
        <div className="field bib" style={{ minWidth: 220 }}>
          <span className="pre" style={{ color:'var(--cp-red)' }}>#</span>
          <input value={bib} onChange={e=>setBib(e.target.value.replace(/\D/g,'').slice(0,5))} placeholder="startnummer" inputMode="numeric" />
        </div>
        <div style={{ width:1, height: 28, background:'var(--cp-line)' }} />
        <div style={{ display:'flex', alignItems:'center', gap: 6 }}>
          <span className="mono" style={{ fontSize: 11, letterSpacing:'.14em', color:'var(--cp-mute)', marginRight: 4 }}>KLEUR</span>
          {TEAMS.map(t => (
            <button
              key={t.id}
              className={`chip${teams.includes(t.id) ? ' active' : ''}`}
              onClick={() => toggleTeam(t.id)}
              style={{ padding:'6px 10px 6px 8px' }}
            >
              <span className="swatch" style={{ background: t.color }} />
              {t.label}
            </button>
          ))}
        </div>
        <div style={{ width:1, height: 28, background:'var(--cp-line)' }} />
        <div style={{ display:'flex', alignItems:'center', gap: 6 }}>
          <span className="mono" style={{ fontSize: 11, letterSpacing:'.14em', color:'var(--cp-mute)', marginRight: 4 }}>MOMENT</span>
          {[['alle','Alle'],['start','Start'],['kmpl','KM 10'],['finish','Finish']].map(([k, l]) => (
            <button key={k} className={`chip${moment === k ? ' active' : ''}`} onClick={() => setMoment(k)}>{l}</button>
          ))}
        </div>
        <div style={{ flex:1 }} />
        <span className="mono" style={{ fontSize: 12, color: 'var(--cp-mute)' }}>
          {filtered.length} / {PHOTOS.length} foto's
        </span>
        <button className="chip">Sorteer: nieuwste ↓</button>
      </section>

      {/* Active filters strip */}
      {(bib || teams.length > 0) && (
        <div style={{ padding: '14px 64px', background: 'var(--cp-paper-2)', borderBottom: '1px solid var(--cp-line)', display:'flex', alignItems:'center', gap: 10 }}>
          <span className="mono" style={{ fontSize: 11, letterSpacing: '.14em', color: 'var(--cp-mute)' }}>FILTERS:</span>
          {bib && <span className="chip active">#{bib} ✕</span>}
          {teams.map(id => {
            const t = TEAMS.find(x => x.id === id);
            return <span key={id} className="chip active" onClick={() => toggleTeam(id)}><span className="swatch" style={{ background: t.color }} />{t.label} ✕</span>;
          })}
          <button className="chip" onClick={() => { setBib(''); setTeams([]); }}>Wis alles</button>
        </div>
      )}

      {/* Photo grid */}
      <section style={{ padding: '24px 64px 80px', display: 'grid', gridTemplateColumns: '1fr 320px', gap: 32, alignItems: 'flex-start' }}>
        <div style={{
          columnCount: layout === 'masonry' ? 4 : undefined,
          columnGap: 10,
          display: layout === 'justified' ? 'grid' : (layout === 'grid' ? 'grid' : undefined),
          gridTemplateColumns: layout === 'grid' ? 'repeat(4, 1fr)' : (layout === 'justified' ? 'repeat(3, 1fr)' : undefined),
          gap: layout !== 'masonry' ? 10 : undefined,
        }}>
          {filtered.map((p, i) => (
            <div key={p.id} style={{ breakInside: 'avoid', marginBottom: layout === 'masonry' ? 10 : 0 }}>
              <PhotoCard
                photo={p}
                watermark={watermark}
                inCart={cart.includes(p.id)}
                onCart={() => addToCart(p)}
                onClick={() => onNav && onNav('detail', p)}
              />
            </div>
          ))}
        </div>

        {/* Right sidebar — selection + tips */}
        <aside style={{ position: 'sticky', top: 80, display:'flex', flexDirection:'column', gap: 16 }}>
          <div className="card" style={{ padding: 20 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 12 }}>
              <span className="eyebrow">Jouw selectie</span>
              <span className="num" style={{ fontSize: 28, color: 'var(--cp-navy)' }}>{cart.length}</span>
            </div>
            {cart.length === 0 ? (
              <p style={{ margin: 0, fontSize: 13, color: 'var(--cp-mute)', lineHeight: 1.5 }}>
                Tik op het hartje om foto's te verzamelen. Korting vanaf 3 foto's.
              </p>
            ) : (
              <>
                <div style={{ display:'flex', flexWrap:'wrap', gap: 6, marginBottom: 14 }}>
                  {cart.slice(0, 8).map(id => {
                    const p = PHOTOS.find(x => x.id === id);
                    return <img key={id} src={p.src} style={{ width: 44, height: 44, borderRadius: 4, objectFit:'cover' }} />;
                  })}
                </div>
                <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', paddingTop: 12, borderTop: '1px solid var(--cp-line)' }}>
                  <span className="mono" style={{ fontSize: 11, color: 'var(--cp-mute)', letterSpacing: '.12em' }}>SUBTOTAAL</span>
                  <span className="num" style={{ fontSize: 24, color: 'var(--cp-navy)' }}>€{cart.reduce((s, id) => s + (PHOTOS.find(x=>x.id===id)?.price || 0), 0).toFixed(2)}</span>
                </div>
                <button className="btn primary lg" style={{ width: '100%', marginTop: 14, justifyContent: 'center' }}>
                  Naar afrekenen →
                </button>
              </>
            )}
          </div>

          <div className="card" style={{ padding: 18, background: 'var(--cp-navy)', color: '#fff' }}>
            <div className="eyebrow" style={{ color: 'rgba(255,255,255,.6)' }}>Tip</div>
            <p style={{ margin: '8px 0 0', fontSize: 13, lineHeight: 1.55 }}>
              Geen nummer gevonden? Check het tijdsblok of je teamkleur. Foto's worden continue toegevoegd — refresh om nieuwe te zien.
            </p>
          </div>

          <div style={{ padding: 16, border: '1.5px dashed var(--cp-line)', borderRadius: 12 }}>
            <span className="eyebrow">Prijzen</span>
            <table style={{ width:'100%', marginTop: 10, borderCollapse: 'collapse', fontSize: 13 }}>
              <tbody>
                <tr><td style={{ padding:'4px 0' }}>1 foto</td><td className="num" style={{ textAlign:'right', fontSize:18 }}>€7</td></tr>
                <tr><td style={{ padding:'4px 0' }}>3 foto's</td><td className="num" style={{ textAlign:'right', fontSize:18, color:'var(--cp-red)' }}>€18</td></tr>
                <tr><td style={{ padding:'4px 0' }}>Alles van #</td><td className="num" style={{ textAlign:'right', fontSize:18, color:'var(--cp-red)' }}>€29</td></tr>
              </tbody>
            </table>
          </div>
        </aside>
      </section>
      <Footer />
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 4. PHOTO DETAIL + CART
// ════════════════════════════════════════════════════════════════════════════
function PhotoDetail({ onNav, photo, watermark = true, cart, addToCart }) {
  const p = photo || PHOTOS[1];
  const related = PHOTOS.filter(x => x.bib === p.bib && x.id !== p.id).slice(0, 4);
  const more = PHOTOS.filter(x => x.id !== p.id).slice(0, 6);

  return (
    <div className="cp" style={{ width: 1440, minHeight: 1500 }} data-screen-label="04 Foto-detail + mandje">
      <Nav cartCount={cart.length} onNav={onNav} />

      {/* breadcrumb */}
      <div style={{ padding: '16px 64px 0', display:'flex', alignItems:'center', gap: 8 }}>
        <span className="mono" style={{ fontSize: 11, letterSpacing: '.12em', color: 'var(--cp-mute)' }}>
          <a onClick={() => onNav('events')} style={{ color: 'inherit', cursor:'pointer' }}>EVENEMENTEN</a>
          {' / '}
          <a onClick={() => onNav('gallery')} style={{ color: 'inherit', cursor:'pointer' }}>STADSLOOP ROTTERDAM</a>
          {' / '}
          <span style={{ color: 'var(--cp-ink)' }}>FOTO #{p.bib}-{p.id.slice(-3)}</span>
        </span>
      </div>

      <section style={{ padding: '20px 64px 48px', display: 'grid', gridTemplateColumns: '1fr 380px', gap: 40, alignItems: 'flex-start' }}>
        {/* MAIN PHOTO */}
        <div>
          <div className="crop" style={{ position:'relative' }}>
            <div className="crop-tr" /><div className="crop-br" />
            <div className={`photo${watermark ? '' : ' no-wm'}`} style={{ aspectRatio: '3/2', cursor: 'default', borderRadius: 8 }}>
              <img src={p.src.replace(/\/\d+\/\d+$/, '/1200/800')} />
              {watermark && <span className="wm" />}
              <span className="bib mono" style={{ fontSize: 28, padding: '8px 12px' }}>#{p.bib}</span>
              <span className="ts" style={{ fontSize: 13, bottom: 14, left: 14 }}>{p.ts} — KM 18.4 — KETHELPLEIN</span>
            </div>
          </div>

          {/* photo meta strip */}
          <div style={{ display:'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, marginTop: 26, border:'1px solid var(--cp-line)', borderRadius: 12, overflow:'hidden' }}>
            {[
              ['Startnummer', `#${p.bib}`, 'display'],
              ['Tijdstip', p.ts, 'mono'],
              ['Locatie', 'KM 18.4', 'mono'],
              ['Fotograaf', 'Chris P.', 'mono'],
            ].map(([l, v, f], i) => (
              <div key={i} style={{ padding: 16, borderLeft: i === 0 ? 0 : '1px solid var(--cp-line)', background:'#fff' }}>
                <div className="eyebrow">{l}</div>
                <div className={f === 'display' ? 'display' : 'mono'} style={{ marginTop: 6, fontSize: f === 'display' ? 30 : 16, color:'var(--cp-navy)', fontWeight: f==='mono'? 600 : undefined }}>{v}</div>
              </div>
            ))}
          </div>

          {/* Related: meer van dit bib */}
          <div style={{ marginTop: 40 }}>
            <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom: 16 }}>
              <div>
                <div className="eyebrow">Meer met</div>
                <h3 className="display" style={{ margin: '6px 0 0', fontSize: 32, color: 'var(--cp-navy)' }}>#{p.bib}</h3>
              </div>
              <button className="btn ghost sm">Alles van #{p.bib} · €29 →</button>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap: 10 }}>
              {(related.length ? related : more.slice(0,4)).map(r => (
                <PhotoCard key={r.id} photo={{...r, ratio: 3/2}} watermark={watermark} inCart={cart.includes(r.id)} onCart={() => addToCart(r)} onClick={() => onNav('detail', r)} />
              ))}
            </div>
          </div>

          {/* Verder bladeren */}
          <div style={{ marginTop: 40 }}>
            <div className="eyebrow" style={{ marginBottom: 14 }}>Verder bladeren in dit evenement</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(6, 1fr)', gap: 8 }}>
              {more.map(r => (
                <PhotoCard key={r.id} photo={{...r, ratio: 1}} watermark={watermark} showMeta={false} onClick={() => onNav('detail', r)} />
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT RAIL: buy + cart */}
        <aside style={{ position:'sticky', top: 24, display:'flex', flexDirection:'column', gap: 16 }}>
          <div className="card" style={{ padding: 24 }}>
            <div className="eyebrow">Hoge-res download</div>
            <div style={{ display:'flex', alignItems:'baseline', gap: 8, marginTop: 8 }}>
              <span className="num" style={{ fontSize: 56, color: 'var(--cp-navy)' }}>€{p.price}</span>
              <span style={{ fontSize: 14, color: 'var(--cp-mute)' }}>incl. BTW</span>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '16px 0 20px', display:'flex', flexDirection:'column', gap: 8, fontSize: 13.5 }}>
              {[
                'JPG · 6000 × 4000 px (24 MP)',
                'Zonder watermerk',
                'Persoonlijk gebruik · social toegestaan',
                'Direct in je inbox',
              ].map((x, i) => (
                <li key={i} style={{ display:'flex', alignItems:'center', gap: 10 }}>
                  <span style={{ width: 16, height: 16, borderRadius: 99, background: 'var(--cp-zest)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink: 0 }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--cp-navy-deep)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </span>
                  {x}
                </li>
              ))}
            </ul>
            <button className="btn primary lg" style={{ width: '100%', justifyContent: 'center' }} onClick={() => addToCart(p)}>
              {cart.includes(p.id) ? 'In mandje ✓' : `Voeg toe — €${p.price}`}
            </button>
            <button className="btn ghost" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}>
              Alles van #{p.bib} — €29
            </button>
          </div>

          {/* Cart */}
          <div className="card" style={{ padding: 20 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <span className="eyebrow">Mandje</span>
              <span className="num" style={{ fontSize: 22, color:'var(--cp-navy)' }}>{cart.length}</span>
            </div>
            {cart.length === 0 && (
              <p style={{ margin: '12px 0 0', fontSize: 13, color: 'var(--cp-mute)', lineHeight: 1.5 }}>Nog leeg. Voeg deze foto toe of selecteer er meer voor korting.</p>
            )}
            {cart.length > 0 && (
              <div style={{ marginTop: 14, display:'flex', flexDirection:'column', gap: 10 }}>
                {cart.slice(0, 3).map(id => {
                  const ph = PHOTOS.find(x => x.id === id);
                  return (
                    <div key={id} style={{ display:'flex', gap: 10, alignItems:'center' }}>
                      <img src={ph.src} style={{ width: 44, height: 44, borderRadius: 4, objectFit:'cover' }} />
                      <div style={{ flex: 1 }}>
                        <div className="display" style={{ fontSize: 16, color: 'var(--cp-navy)' }}>#{ph.bib}</div>
                        <div className="mono" style={{ fontSize: 11, color: 'var(--cp-mute)' }}>{ph.ts}</div>
                      </div>
                      <div className="num" style={{ fontSize: 16, color: 'var(--cp-navy)' }}>€{ph.price}</div>
                    </div>
                  );
                })}
                {cart.length > 3 && <div className="mono" style={{ fontSize: 11, color: 'var(--cp-mute)' }}>+ {cart.length - 3} meer</div>}
                <div style={{ display:'flex', justifyContent:'space-between', paddingTop: 12, borderTop: '1px solid var(--cp-line)', alignItems: 'baseline' }}>
                  <span className="mono" style={{ fontSize: 11, letterSpacing:'.12em', color: 'var(--cp-mute)' }}>TOTAAL</span>
                  <span className="num" style={{ fontSize: 28, color: 'var(--cp-navy)' }}>€{cart.reduce((s, id) => s + (PHOTOS.find(x=>x.id===id)?.price || 0), 0).toFixed(2)}</span>
                </div>
                <button className="btn dark lg" style={{ width:'100%', justifyContent:'center' }}>Afrekenen →</button>
              </div>
            )}
          </div>

          {/* Trust */}
          <div style={{ padding: 18, background: 'var(--cp-paper-2)', borderRadius: 12, fontSize: 12.5, color: 'var(--cp-ink)', lineHeight: 1.55 }}>
            <div className="mono" style={{ fontSize: 10.5, letterSpacing: '.16em', color: 'var(--cp-mute)', marginBottom: 8 }}>VEILIG · NEDERLANDS</div>
            iDEAL · Tikkie · Apple Pay. Direct downloaden na betaling. 14 dagen niet-goed-geld-terug.
          </div>
        </aside>
      </section>
      <Footer />
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// FOOTER
// ════════════════════════════════════════════════════════════════════════════
function Footer() {
  return (
    <footer className="footer">
      <div style={{ display:'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: 40, marginBottom: 40 }}>
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <Logo size={28} wordmark={false} />
            <div className="display" style={{ fontSize: 22, color: '#fff', lineHeight: 1 }}>CP<br/><span style={{ fontSize: 11, letterSpacing: '.14em', fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,.6)', fontWeight: 600 }}>SPORTFOTOGRAFIE</span></div>
          </div>
          <p style={{ marginTop: 18, fontSize: 13, lineHeight: 1.6, maxWidth: 320, color: 'rgba(255,255,255,.7)' }}>
            Sportfotograaf voor lopers, voetballers en alles ertussen. Vanuit Utrecht — overal in NL.
          </p>
          <div style={{ display:'flex', gap: 10, marginTop: 18 }}>
            {['IG','FB','LI','YT'].map(s => (
              <span key={s} className="mono" style={{ width: 36, height: 36, borderRadius: 99, border: '1.5px solid rgba(255,255,255,.2)', display: 'flex', alignItems:'center', justifyContent:'center', fontSize: 11, fontWeight: 700, letterSpacing: '.08em' }}>{s}</span>
            ))}
          </div>
        </div>
        <div>
          <h4>Voor sporters</h4>
          <a>Zoek mijn foto</a>
          <a>Hoe het werkt</a>
          <a>Prijzen</a>
          <a>Account</a>
        </div>
        <div>
          <h4>Voor organisatoren</h4>
          <a>Boek CP voor je event</a>
          <a>Sponsor packages</a>
          <a>Resultatenkoppeling</a>
          <a>Cases</a>
        </div>
        <div>
          <h4>Over</h4>
          <a>Mijn verhaal</a>
          <a>Contact</a>
          <a>Veelgestelde vragen</a>
          <a>Voorwaarden · Privacy</a>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems:'center', justifyContent:'space-between', paddingTop: 18, borderTop: '1px solid rgba(255,255,255,.1)', fontSize: 11.5, color: 'rgba(255,255,255,.5)' }}>
        <span>© 2026 CP-sportfotografie · KvK 12345678</span>
        <span className="mono" style={{ letterSpacing: '.18em' }}>STILSTAAN IS GEEN OPTIE.</span>
      </div>
    </footer>
  );
}

Object.assign(window, { Homepage, Events, Gallery, PhotoDetail });
