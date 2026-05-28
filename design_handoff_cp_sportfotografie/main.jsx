/* global React, ReactDOM, DesignCanvas, DCSection, DCArtboard, TweaksPanel, useTweaks,
          TweakSection, TweakColor, TweakRadio, TweakToggle, TweakSelect,
          Homepage, Events, Gallery, PhotoDetail, MobileGallery, MobileDetail, PHOTOS */
const { useState, useEffect } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#E62333",
  "watermark": true,
  "layout": "masonry",
  "energyColor": "#F2FF49"
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Shared cart state across gallery and detail screens
  const [cart, setCart] = useState(['cp-202', 'cp-105']);
  const addToCart = (p) => setCart(c => c.includes(p.id) ? c.filter(x => x !== p.id) : [...c, p.id]);

  // For the detail artboard, default to a representative photo
  const [detailPhoto, setDetailPhoto] = useState(PHOTOS[3]);
  const navigate = (target, photo) => {
    if (target === 'detail' && photo) setDetailPhoto(photo);
  };

  // Apply tweaks via CSS variables
  useEffect(() => {
    document.documentElement.style.setProperty('--cp-accent', t.accent);
    document.documentElement.style.setProperty('--cp-zest', t.energyColor);
  }, [t.accent, t.energyColor]);

  return (
    <>
      <DesignCanvas>
        <DCSection id="hero-intro" title="CP-sportfotografie" subtitle="Visueel systeem afgeleid van het logo — navy + rood, Anton + Manrope, crop-marks en grote startnummers als ornament. Klik op een artboard om fullscreen te bekijken.">

          <DCArtboard id="palette" label="Visueel systeem" width={620} height={460}>
            <DesignSystemBoard />
          </DCArtboard>

        </DCSection>

        <DCSection id="desktop" title="Web — desktop" subtitle="Vier kernschermen voor de hele aankoopflow.">

          <DCArtboard id="home" label="01 · Homepage" width={1440} height={1860}>
            <Homepage onNav={navigate} />
          </DCArtboard>

          <DCArtboard id="events" label="02 · Evenementen" width={1440} height={1400}>
            <Events onNav={navigate} />
          </DCArtboard>

          <DCArtboard id="gallery" label="03 · Galerij + zoek/filter" width={1440} height={1700}>
            <Gallery
              onNav={navigate}
              watermark={t.watermark}
              layout={t.layout}
              cart={cart}
              addToCart={addToCart}
            />
          </DCArtboard>

          <DCArtboard id="detail" label="04 · Foto-detail + mandje" width={1440} height={1500}>
            <PhotoDetail
              onNav={navigate}
              photo={detailPhoto}
              watermark={t.watermark}
              cart={cart}
              addToCart={addToCart}
            />
          </DCArtboard>

        </DCSection>

        <DCSection id="mobile" title="Mobiel" subtitle="Sporters openen meestal op de telefoon — galerij & koop-flow getuned voor één duim.">

          <DCArtboard id="m-gallery" label="Galerij" width={440} height={892}>
            <MobileGallery watermark={t.watermark} />
          </DCArtboard>

          <DCArtboard id="m-detail" label="Foto-detail" width={440} height={892}>
            <MobileDetail watermark={t.watermark} />
          </DCArtboard>

        </DCSection>
      </DesignCanvas>

      <TweaksPanel>
        <TweakSection label="Merk" />
        <TweakColor
          label="Accentkleur"
          value={t.accent}
          options={['#E62333', '#0E2A55', '#F2FF49', '#1F8A5B', '#F26B1C']}
          onChange={(v) => setTweak('accent', v)}
        />
        <TweakColor
          label="Energy-pop"
          value={t.energyColor}
          options={['#F2FF49', '#FF7A00', '#00E5C7', '#E62333']}
          onChange={(v) => setTweak('energyColor', v)}
        />
        <TweakSection label="Galerij" />
        <TweakRadio
          label="Layout"
          value={t.layout}
          options={['masonry', 'grid', 'justified']}
          onChange={(v) => setTweak('layout', v)}
        />
        <TweakToggle
          label="Watermerk"
          value={t.watermark}
          onChange={(v) => setTweak('watermark', v)}
        />
      </TweaksPanel>
    </>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Design-system board — single artboard showing the visual rules at a glance.
// ──────────────────────────────────────────────────────────────────────────
function DesignSystemBoard() {
  return (
    <div className="cp" style={{ width: 620, height: 460, padding: 28, background: 'var(--cp-paper)', display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between' }}>
        <div>
          <div className="eyebrow">Visueel systeem · v1</div>
          <div className="display" style={{ fontSize: 36, color: 'var(--cp-navy)', lineHeight: .95, marginTop: 6 }}>
            Snel.<br /><span style={{ color: 'var(--cp-red)' }}>Scherp. Sportief.</span>
          </div>
        </div>
        <Logo size={32} />
      </div>

      {/* color palette */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 6 }}>
        {[
          ['#0E2A55', 'Navy', '#fff'],
          ['#E62333', 'Rood', '#fff'],
          ['#F2FF49', 'Zest', '#0E2A55'],
          ['#F7F5F2', 'Papier', '#0A1530'],
          ['#0A1530', 'Inkt', '#fff'],
          ['#6B7385', 'Mute', '#fff'],
        ].map(([c, n, fg]) => (
          <div key={c} style={{ height: 60, background: c, color: fg, borderRadius: 6, padding: 8, display:'flex', flexDirection:'column', justifyContent:'space-between', border: c === '#F7F5F2' ? '1px solid var(--cp-line)' : 0 }}>
            <span className="display" style={{ fontSize: 13, lineHeight: 1 }}>{n}</span>
            <span className="mono" style={{ fontSize: 9, opacity: .8 }}>{c}</span>
          </div>
        ))}
      </div>

      {/* type pairing */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, padding: '14px 16px', background: '#fff', borderRadius: 10 }}>
        <div>
          <div className="eyebrow">Display · Anton</div>
          <div className="display" style={{ fontSize: 40, color: 'var(--cp-navy)', marginTop: 4, lineHeight: .95 }}>#4218</div>
        </div>
        <div>
          <div className="eyebrow">Body · Manrope</div>
          <p style={{ fontSize: 12, lineHeight: 1.45, color: 'var(--cp-ink)', margin: '4px 0 0' }}>Elke seconde gevangen. Jouw moment in hi-res.</p>
        </div>
      </div>

      {/* motifs */}
      <div style={{ display:'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, flex: 1 }}>
        <div className="speed-bg" style={{ background: 'var(--cp-paper-2)', borderRadius: 8, padding: 10, display:'flex', flexDirection:'column', justifyContent:'flex-end' }}>
          <div className="mono" style={{ fontSize: 10, letterSpacing: '.12em', color: 'var(--cp-mute)' }}>SPEED LINES</div>
        </div>
        <div className="crop" style={{ background: '#fff', borderRadius: 4, padding: 10, display:'flex', alignItems:'center', justifyContent:'center', position:'relative' }}>
          <div className="crop-tr" /><div className="crop-br" />
          <div className="display" style={{ fontSize: 38, color: 'var(--cp-navy)' }}>[ #87 ]</div>
        </div>
        <div style={{ background: 'var(--cp-navy)', color: '#fff', borderRadius: 8, padding: 10, display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
          <span className="live" style={{ color: '#fff' }}>LIVE TICKER</span>
          <span className="mono" style={{ fontSize: 10, opacity: .65 }}>09:14:32 · KM 18.4</span>
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
