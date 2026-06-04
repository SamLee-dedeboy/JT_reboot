/* Hero — map-driven backdrop with title overlay + scroll cue */
function Hero() {
  return (
    <section className="hero" id="top">
      {/* Map backdrop (placeholder — production renders the live HeroMap) */}
      <div className="hero-map">
        <Placeholder label="Interactive map — Sacramento–San Joaquin Delta" minHeight="100%" style={{ height: '100%', borderRadius: 0, border: 'none' }}>
          <div className="hero-map-grid" aria-hidden="true" />
        </Placeholder>
      </div>
      <div className="hero-veil" aria-hidden="true" />

      <div className="hero-content container">
        <Reveal className="hero-eyebrow eyebrow">UC Davis · Participatory Scenario Planning</Reveal>
        <Reveal as="h1" className="h1 hero-title" delay={0.08}>Just Transitions<br />in the Delta</Reveal>
        <Reveal className="hero-lede body1" delay={0.16}>
          Envisioning equitable futures for water management in the Sacramento–San Joaquin
          Delta amid drought, salinity, and sea-level rise.
        </Reveal>
        <Reveal className="hero-cta" delay={0.24}>
          <a href="#approach" className="btn btn-outline">Our Approach</a>
        </Reveal>
      </div>

      <a href="#whatif" className="hero-scroll" aria-label="Scroll to content">
        <span>Scroll</span>
        <Icon name="arrow-down" size={20} />
      </a>
    </section>
  );
}

window.Hero = Hero;
