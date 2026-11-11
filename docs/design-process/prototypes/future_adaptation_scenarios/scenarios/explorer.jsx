/* ============================================================
   OPTION C — Map Explorer
   Map-central. Pick a scenario; the salinity line and detail
   panel update. Light interactivity over an editorial base.
   ============================================================ */

function Explorer() {
  const [sel, setSel] = useState(0);
  const s = SCENARIOS[sel];

  return (
    <section className="section" id="explorer">
      <div className="container">
        <Reveal className="sec-head">
          <span className="eyebrow">Explore</span>
          <h2 className="h2">Pick a future, watch the salinity line move</h2>
          <p className="body1" style={{ marginTop: '1rem', maxWidth: '60ch' }}>
            Select a scenario to see how its strategy pushes the modelled salinity line through the
            estuary — and what it trades off to get there.
          </p>
        </Reveal>

        <div className="explorer">
          <Reveal className="exp-mapwrap">
            <DeltaMap intrusion={s.intrusion} accent={s.accent} labels height="100%" className="exp-map" />
            <div className="exp-tabs" role="tablist" aria-label="Scenarios">
              {SCENARIOS.map((sc, i) => (
                <button
                  key={sc.id}
                  role="tab"
                  aria-selected={i === sel}
                  className="exp-tab"
                  onClick={() => setSel(i)}
                  style={i === sel ? { borderColor: sc.accent, color: sc.accent, background: 'rgba(255,255,255,0.04)' } : null}
                >
                  <span className="swatch" style={{ background: sc.accent }} />
                  {sc.name}
                </button>
              ))}
            </div>
          </Reveal>

          <div className="exp-panel" key={sel}>
            <div className={`exp-fade`}>
              <div className="exp-panel-top">
                <div>
                  <div className="exp-type" style={{ color: s.accent }}>{s.type}</div>
                  <h3 className="exp-name">{s.name}</h3>
                </div>
                <RankBadge rank={s.rank} accent={s.accent} />
              </div>
              <p className="exp-tagline">{s.tagline}</p>
              <p className="exp-summary">{s.summary}</p>

              <div className="exp-sub">Key levers</div>
              <div className="exp-levers">
                {s.levers.map((l) => (
                  <span className="gal-lever" key={l}>{l}</span>
                ))}
              </div>

              <div className="exp-sub">Tradeoffs</div>
              <div className="exp-trades">
                {FACTORS.map((f) => (
                  <TradeoffRow key={f.key} factor={f} value={s.ratings[f.key]} accent={s.accent} variant="bar" />
                ))}
              </div>
            </div>
          </div>
        </div>

        <Reveal className="legend" delay={0.1}>
          <span className="legend-item">More bar = stronger performance / fewer tradeoffs.</span>
          <span className="legend-note">Ratings &amp; salinity lines illustrative — pending model outputs.</span>
        </Reveal>
      </div>
    </section>
  );
}

function App() {
  const [t, setTweak] = useTweaks(SCEN_TWEAK_DEFAULTS);
  useChrome(t);
  return (
    <>
      <Navbar />
      <OptionSwitcher current="explorer" />
      <main>
        <PageHero showMap={false} />
        <Explorer />
        <CtaBand />
      </main>
      <Footer />
      <ScenarioTweaks t={t} setTweak={setTweak} />
    </>
  );
}

mountApp(App);
