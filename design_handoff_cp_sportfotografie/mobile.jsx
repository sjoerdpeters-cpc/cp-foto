/* global React, Logo, PhotoCard, PHOTOS, TEAMS */
const { useState: useStateM } = React;

function PhoneFrame({ children }) {
  return (
    <div className="cp" style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
      <div className="phone">
        <div className="screen">
          <div className="notch" />
          <div className="status">
            <span>9:14</span>
            <span style={{ display:'flex', gap: 6, alignItems:'center' }}>
              <svg width="16" height="11" viewBox="0 0 16 11"><path d="M0 8h2v3H0zM4 6h2v5H4zM8 3h2v8H8zM12 0h2v11h-2z" fill="currentColor"/></svg>
              <svg width="14" height="10" viewBox="0 0 14 10" fill="none"><rect x="1" y="3" width="11" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><rect x="2.5" y="4.5" width="8" height="3" rx=".5" fill="currentColor"/><rect x="12.5" y="4.5" width="1" height="3" rx=".4" fill="currentColor"/></svg>
            </span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

// ── MOBILE 1 — Gallery
function MobileGallery({ watermark = true }) {
  const [bib, setBib] = useStateM('');
  const [cart, setCart] = useStateM(['cp-202','cp-204']);
  const filtered = bib ? PHOTOS.filter(p => String(p.bib).includes(bib)) : PHOTOS;
  const toggle = (id) => setCart(c => c.includes(id) ? c.filter(x=>x!==id) : [...c, id]);

  return (
    <PhoneFrame>
      <div style={{ height: '100%', overflowY: 'hidden', display:'flex', flexDirection:'column', background:'var(--cp-paper)' }}>
        {/* event banner */}
        <div style={{ position:'relative', height: 160, flexShrink: 0, marginTop: 0 }}>
          <img src="https://picsum.photos/seed/cp-evt-1/800/400" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(14,42,85,.92) 0%, rgba(14,42,85,.3) 60%, rgba(14,42,85,.5) 100%)' }} />
          <div style={{ position:'absolute', top: 50, left: 20, color:'#fff' }}>
            <span className="mono" style={{ fontSize: 9, letterSpacing:'.16em', opacity:.75 }}>← TERUG</span>
          </div>
          <div style={{ position:'absolute', bottom: 16, left: 20, right: 20, color:'#fff' }}>
            <div className="display" style={{ fontSize: 32, lineHeight: .96 }}>Stadsloop<br /><span style={{ color:'var(--cp-zest)' }}>Rotterdam</span></div>
            <div style={{ display:'flex', alignItems:'center', gap: 10, marginTop: 8 }}>
              <span className="mono" style={{ fontSize: 10, letterSpacing: '.1em', opacity: .85 }}>24 MEI · 14.203 FOTO'S</span>
              <span className="live" style={{ color: '#fff', fontSize: 9 }}>LIVE</span>
            </div>
          </div>
        </div>

        {/* sticky search */}
        <div style={{ padding: '14px 16px 10px', background: '#fff', borderBottom: '1px solid var(--cp-line)', flexShrink: 0 }}>
          <div className="field bib" style={{ padding:'4px 4px 4px 14px' }}>
            <span className="pre" style={{ color:'var(--cp-red)' }}>#</span>
            <input value={bib} onChange={e=>setBib(e.target.value.replace(/\D/g,'').slice(0,5))} placeholder="startnummer" inputMode="numeric" style={{ fontSize: 18 }} />
            <button className="btn primary sm" style={{ padding:'8px 12px' }}>Zoek</button>
          </div>
          <div style={{ display:'flex', gap: 6, marginTop: 10, overflowX:'auto', paddingBottom: 4 }}>
            {TEAMS.slice(0, 5).map(t => (
              <button key={t.id} className="chip" style={{ flexShrink: 0, padding:'5px 9px 5px 7px' }}>
                <span className="swatch" style={{ background: t.color }} />{t.label}
              </button>
            ))}
            <button className="chip" style={{ flexShrink: 0 }}>Moment ▾</button>
          </div>
        </div>

        {/* photo grid */}
        <div style={{ flex: 1, overflow:'hidden', padding: 8 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6 }}>
            {filtered.slice(0, 8).map(p => (
              <PhotoCard
                key={p.id}
                photo={{...p, ratio: 4/5}}
                watermark={watermark}
                inCart={cart.includes(p.id)}
                onCart={() => toggle(p.id)}
                showMeta={true}
              />
            ))}
          </div>
        </div>

        {/* bottom cart bar */}
        {cart.length > 0 && (
          <div style={{ position:'absolute', bottom: 0, left:0, right:0, padding: 14, background: 'var(--cp-navy)', color: '#fff', display:'flex', alignItems:'center', gap: 12, borderRadius: '20px 20px 0 0' }}>
            <div style={{ display:'flex' }}>
              {cart.slice(0,3).map((id, i) => {
                const ph = PHOTOS.find(x=>x.id===id);
                return <img key={id} src={ph.src} style={{ width: 34, height: 34, borderRadius: 6, objectFit:'cover', marginLeft: i ? -8 : 0, border: '2px solid var(--cp-navy)' }} />;
              })}
            </div>
            <div style={{ flex: 1 }}>
              <div className="mono" style={{ fontSize: 10, letterSpacing:'.12em', opacity:.7 }}>{cart.length} FOTO{cart.length>1?"'S":''}</div>
              <div className="num" style={{ fontSize: 20 }}>€{cart.reduce((s,id)=>s+(PHOTOS.find(x=>x.id===id)?.price||0),0).toFixed(2)}</div>
            </div>
            <button className="btn primary">Afrekenen →</button>
          </div>
        )}
      </div>
    </PhoneFrame>
  );
}

// ── MOBILE 2 — Detail
function MobileDetail({ watermark = true }) {
  const p = PHOTOS[1];
  const [inCart, setInCart] = useStateM(false);
  return (
    <PhoneFrame>
      <div style={{ height:'100%', display:'flex', flexDirection:'column', background: 'var(--cp-paper)', overflow:'hidden' }}>
        {/* top translucent bar */}
        <div style={{ position:'absolute', top: 50, left: 20, right: 20, zIndex: 4, display:'flex', justifyContent:'space-between' }}>
          <button style={{ width: 38, height: 38, background:'rgba(255,255,255,.92)', border:0, borderRadius: 999, display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(8px)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <button style={{ width: 38, height: 38, background:'rgba(255,255,255,.92)', border:0, borderRadius: 999, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13"/></svg>
          </button>
        </div>

        {/* photo */}
        <div className={`photo${watermark ? '' : ' no-wm'}`} style={{ aspectRatio: '3/4', borderRadius: 0, flexShrink: 0 }}>
          <img src={p.src.replace(/\/\d+\/\d+$/, '/800/1000')} />
          {watermark && <span className="wm" />}
          <span className="bib mono" style={{ fontSize: 22, padding: '6px 9px', top: 100, left: 16 }}>#{p.bib}</span>
        </div>

        {/* content */}
        <div style={{ flex: 1, overflow:'hidden', padding: '18px 20px 0', display:'flex', flexDirection:'column', gap: 14 }}>
          <div>
            <div className="eyebrow">Stadsloop Rotterdam</div>
            <div className="display" style={{ fontSize: 32, color:'var(--cp-navy)', marginTop: 4, lineHeight: 1 }}>FOTO #{p.bib}</div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap: 0, border:'1px solid var(--cp-line)', borderRadius: 10, overflow:'hidden' }}>
            {[['TIJD', p.ts.slice(0,5)],['KM','18.4'],['LOC','Kethel']].map(([l,v],i)=>(
              <div key={i} style={{ padding:'10px', borderLeft: i?'1px solid var(--cp-line)':0, textAlign:'center' }}>
                <div className="eyebrow" style={{ fontSize: 9 }}>{l}</div>
                <div className="display" style={{ fontSize: 18, color:'var(--cp-navy)', marginTop: 2 }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ display:'flex', alignItems:'baseline', gap: 8 }}>
            <span className="num" style={{ fontSize: 40, color: 'var(--cp-navy)' }}>€{p.price}</span>
            <span style={{ fontSize: 12, color:'var(--cp-mute)' }}>· hi-res zonder watermerk</span>
          </div>
        </div>

        {/* sticky bottom CTA */}
        <div style={{ padding: 14, background: '#fff', borderTop: '1px solid var(--cp-line)', display:'flex', gap: 8 }}>
          <button className="btn ghost" style={{ flexShrink: 0, padding: 14 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21s-7-4.35-9.5-9C.9 8.5 3 4 7.5 4c2 0 3.4 1.1 4.5 2.5C13.1 5.1 14.5 4 16.5 4 21 4 23.1 8.5 21.5 12c-2.5 4.65-9.5 9-9.5 9z"/></svg>
          </button>
          <button className="btn primary lg" style={{ flex: 1, justifyContent:'center' }} onClick={() => setInCart(v => !v)}>
            {inCart ? 'In mandje ✓' : `Voeg toe — €${p.price}`}
          </button>
        </div>
      </div>
    </PhoneFrame>
  );
}

Object.assign(window, { MobileGallery, MobileDetail });
