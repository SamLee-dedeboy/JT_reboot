/* ============================================================
   OPTION A — Comparison Matrix
   Scenarios as columns (topped by mini maps), factors as rows.
   Data-forward; built to compare tradeoffs at a glance.
   ============================================================ */

function MatrixHead({ s }) {
  return (
    <div className="mx-head">
      <div className="mx-head-mapwrap">
        <DeltaMap intrusion={s.intrusion} accent={s.accent} labels={false} caption={false} height={72} className="mx-head-map" />
        <span className="mx-head-rank" style={{ borderColor: s.accent, color: s.accent }}>#{s.rank}</span>
      </div>
      <div className="mx-head-name" style={{ color: s.accent }}>{s.name}</div>
      <div className="mx-head-type">{s.type}</div>
    </div>
  );
}

function Matrix() {
  return (
    <section className="section" id="matrix">
      <div className="container">
        <Reveal className="sec-head">
          <span className="eyebrow">Compare</span>
          <h2 className="h2">Tradeoffs across every future</h2>
          <p className="body1" style={{ marginTop: '1rem', maxWidth: '60ch' }}>
            Read <strong>across a row</strong> to compare one tradeoff between scenarios; read <strong>down a column</strong>
            {' '}to understand a single future. Mini-maps show each scenario’s modelled salinity line.
          </p>
        </Reveal>

        <Reveal className="mx-scroll" delay={0.06}>
          <div className="mx-grid">
            <div className="mx-corner"><span>Tradeoff ↓ / Scenario →</span></div>
            {SCENARIOS.map((s) => <MatrixHead key={s.id} s={s} />)}

            {FACTORS.map((f) => (
              <React.Fragment key={f.key}>
                <div className="mx-rowlabel">
                  <Icon name={f.icon} size={19} stroke={f.stroke} />
                  {f.label}
                </div>
                {SCENARIOS.map((s) => (
                  <div className="mx-cell" key={s.id + f.key}>
                    <RatingDots value={s.ratings[f.key]} accent={s.accent} />
                    <span className="mx-cell-word">{RATING_WORDS[s.ratings[f.key]]}</span>
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </Reveal>

        <Reveal className="legend" delay={0.1}>
          <span className="legend-item">Rating <RatingDots value={4} accent="var(--brand-green)" /></span>
          <span className="legend-item"><RatingDots value={1} accent="var(--base-200)" /> = more tradeoffs · <RatingDots value={4} accent="var(--brand-green)" /> = stronger performance</span>
          <span className="legend-note">Ratings illustrative — pending model outputs.</span>
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
      <OptionSwitcher current="matrix" />
      <main>
        <PageHero mapIntrusion={0.5} mapAccent="var(--brand-green)" />
        <Matrix />
        <CtaBand />
      </main>
      <Footer />
      <ScenarioTweaks t={t} setTweak={setTweak} />
    </>
  );
}

mountApp(App);
