/* ============================================================
   Adaptation Scenarios — shared page shell
   PageHero, CtaBand, ScenarioTweaks, mount helper.
   ============================================================ */

const SCEN_TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "motion": "full",
  "density": "comfortable"
}/*EDITMODE-END*/;

function useChrome(t) {
  useEffect(() => {
    document.documentElement.setAttribute('data-motion', t.motion === 'off' ? 'off' : 'on');
    document.documentElement.setAttribute('data-density', t.density);
  }, [t.motion, t.density]);
}

function PageHero({ showMap = true, mapIntrusion = 0.5, mapAccent = 'var(--brand-green)', mapLabels = true }) {
  return (
    <header className="page-hero">
      <div className="container">
        <div className={`page-hero-grid ${showMap ? '' : 'no-map'}`} style={showMap ? null : { gridTemplateColumns: '1fr' }}>
          <div>
            <Reveal>
              <span className="eyebrow page-eyebrow">{PAGE.eyebrow}</span>
              <h1 className="h1 page-title">{PAGE.title}</h1>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="page-lede">{PAGE.lede}</p>
              <p className="page-note"><span className="dot" />{PAGE.note}</p>
            </Reveal>
          </div>
          {showMap && (
            <Reveal delay={0.14}>
              <DeltaMap intrusion={mapIntrusion} accent={mapAccent} labels={mapLabels} height={300} />
            </Reveal>
          )}
        </div>
      </div>
    </header>
  );
}

function CtaBand() {
  return (
    <section className="section cta-band">
      <div className="container">
        <Reveal>
          <span className="eyebrow" style={{ color: 'var(--white)', opacity: 0.8 }}>Get involved</span>
          <h2 className="h2" style={{ marginTop: '0.7rem' }}>Help shape which future the Delta moves toward</h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="body1">These scenarios are built with Delta communities. Join a workshop, review the models, or tell us which tradeoffs matter most to you.</p>
        </Reveal>
        <Reveal delay={0.14} className="cta-row">
          <a href="#" className="btn btn-primary">Join a public workshop <Icon name="arrow-right" size={18} /></a>
          <a href="#" className="btn btn-outline">Read the methodology</a>
        </Reveal>
      </div>
    </section>
  );
}

function ScenarioTweaks({ t, setTweak, children }) {
  return (
    <TweaksPanel>
      <TweakSection label="Motion" />
      <TweakRadio label="Animation" value={t.motion} options={['full', 'off']} onChange={(v) => setTweak('motion', v)} />
      <TweakSection label="Layout" />
      <TweakRadio label="Density" value={t.density} options={['comfortable', 'compact']} onChange={(v) => setTweak('density', v)} />
      {children}
    </TweaksPanel>
  );
}

function mountApp(App) {
  ReactDOM.createRoot(document.getElementById('root')).render(<App />);
}

Object.assign(window, { SCEN_TWEAK_DEFAULTS, useChrome, PageHero, CtaBand, ScenarioTweaks, mountApp });
