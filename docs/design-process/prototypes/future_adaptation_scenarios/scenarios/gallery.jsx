/* ============================================================
   OPTION B — Card Gallery
   Central anchor map + a browsable grid of scenario cards.
   Airy, visual, comfortable density.
   ============================================================ */

function GalleryCard({ s, i }) {
  return (
    <Reveal className="gal-card card" delay={(i % 3) * 0.06} as="article">
      <div className="ph gal-ph">
        <span className="ph-label">{s.name} — site photo</span>
      </div>
      <div className="gal-body">
        <div className="gal-top">
          <span className="gal-type" style={{ color: s.accent }}>{s.type}</span>
          <span className="gal-rank" style={{ borderColor: s.accent, color: s.accent }}>Rank #{s.rank}</span>
        </div>
        <h3 className="gal-name">{s.name}</h3>
        <p className="gal-summary">{s.summary}</p>

        <div className="gal-tradeoffs">
          {FACTORS.map((f) => (
            <span className="gal-to" key={f.key}>
              <Icon name={f.icon} size={15} stroke={f.stroke} />
              {f.short}
              <RatingDots value={s.ratings[f.key]} accent={s.accent} size={7} />
            </span>
          ))}
        </div>

        <div className="gal-levers">
          {s.levers.map((l) => <span className="gal-lever" key={l}>{l}</span>)}
        </div>

        <a href="#" className="gal-link" style={{ color: s.accent }}>
          Read the scenario <Icon name="arrow-right" size={17} />
        </a>
      </div>
    </Reveal>
  );
}

function Gallery() {
  return (
    <section className="section" id="gallery">
      <div className="container">
        <Reveal className="gal-anchor">
          <div className="gal-anchor-map">
            <DeltaMap intrusion={0.5} accent="var(--brand-green)" labels height="100%" />
          </div>
          <div className="gal-anchor-copy">
            <span className="eyebrow">Where this plays out</span>
            <h3 className="h2" style={{ marginTop: '0.6rem' }}>One estuary, six futures</h3>
            <p className="body1" style={{ marginTop: '0.9rem' }}>
              Each scenario reshapes where salt water can travel between Suisun Bay and the south Delta.
              Browse the futures below — every card carries its salinity strategy, community rank, and a
              quick read on its tradeoffs.
            </p>
          </div>
        </Reveal>

        <Reveal className="sec-head" delay={0.05} style={{ marginTop: '1rem' }}>
          <span className="eyebrow">The scenarios</span>
          <h2 className="h2">Browse the adaptation futures</h2>
        </Reveal>

        <div className="gal-grid">
          {SCENARIOS.map((s, i) => <GalleryCard key={s.id} s={s} i={i} />)}
        </div>
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
      <OptionSwitcher current="gallery" />
      <main>
        <PageHero showMap={false} />
        <Gallery />
        <CtaBand />
      </main>
      <Footer />
      <ScenarioTweaks t={t} setTweak={setTweak} />
    </>
  );
}

mountApp(App);
