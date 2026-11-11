/* ============================================================
   OPTION D — Narrative Scroll
   One scenario per full section, ordered baseline → most-preferred.
   Cinematic, large type, alternating sides, builds to a summary.
   ============================================================ */

/* Baseline first (rank 6) → most-preferred last (rank 1) */
const NARR_ORDER = [...SCENARIOS].sort((a, b) => b.rank - a.rank);

function NarrSection({ s, i }) {
  const text = (
    <div className="narr-text">
      <Reveal className="narr-index">
        <span className="narr-num">{String(i + 1).padStart(2, '0')}</span>
        <span className="narr-rank-tag" style={{ borderColor: s.accent, color: s.accent }}>Community rank #{s.rank}</span>
      </Reveal>
      <Reveal delay={0.05}>
        <div className="narr-type" style={{ color: s.accent }}>{s.type}</div>
        <h2 className="narr-name">{s.name}</h2>
      </Reveal>
      <Reveal delay={0.1}>
        <p className="narr-narrative">{s.summary}</p>
        <p className="narr-detail">{s.detail}</p>
        <div className="narr-levers">
          {s.levers.map((l) => <span className="gal-lever" key={l}>{l}</span>)}
        </div>
      </Reveal>
      <Reveal delay={0.14} className="narr-trades">
        {FACTORS.map((f) => (
          <TradeoffRow key={f.key} factor={f} value={s.ratings[f.key]} accent={s.accent} variant="bar" />
        ))}
      </Reveal>
    </div>
  );

  const map = (
    <Reveal className="narr-mapwrap" delay={0.08}>
      <DeltaMap intrusion={s.intrusion} accent={s.accent} labels height={380} className="narr-map" />
      <p className="caption" style={{ textAlign: 'center' }}>{s.tagline}</p>
    </Reveal>
  );

  return (
    <section className="narr-sec" id={s.id} data-screen-label={s.name}>
      <div className="container narr-inner">
        {text}
        {map}
      </div>
    </section>
  );
}

function Narrative() {
  return (
    <>
      {NARR_ORDER.map((s, i) => <NarrSection key={s.id} s={s} i={i} />)}

      <section className="section" id="summary">
        <div className="container">
          <Reveal className="sec-head">
            <span className="eyebrow">In summary</span>
            <h2 className="h2">How the community ranked them</h2>
          </Reveal>
          <Reveal className="narr-summary-strip" delay={0.06}>
            {[...SCENARIOS].sort((a, b) => a.rank - b.rank).map((s) => (
              <div className="narr-ss-card" key={s.id} style={{ borderTopColor: s.accent, borderTopWidth: 3 }}>
                <span className="narr-ss-rank" style={{ color: s.accent }}>#{s.rank}</span>
                <span className="narr-ss-name">{s.name}</span>
                <span className="caption" style={{ fontSize: '0.8rem' }}>{s.type}</span>
              </div>
            ))}
          </Reveal>
        </div>
      </section>
    </>
  );
}

function App() {
  const [t, setTweak] = useTweaks(SCEN_TWEAK_DEFAULTS);
  useChrome(t);
  return (
    <>
      <Navbar />
      <OptionSwitcher current="narrative" />
      <main>
        <PageHero showMap={false} />
        <Narrative />
        <CtaBand />
      </main>
      <Footer />
      <ScenarioTweaks t={t} setTweak={setTweak} />
    </>
  );
}

mountApp(App);
