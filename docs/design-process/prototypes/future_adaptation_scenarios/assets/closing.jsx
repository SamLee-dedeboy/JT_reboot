/* Closing sections — mission quote, how it works, footer */

function Mission() {
  return (
    <section className="section mission" id="mission">
      <div className="container mission-grid">
        <Reveal className="quote mission-quote">
          Salinity management in the Delta during drought has historically been done on an emergency basis.
          However, with future droughts and sea-level rise more likely, long-range planning that creatively
          visions new futures for salinity management while holistically considering the tradeoffs associated
          with those futures is needed.
        </Reveal>
        <Reveal className="mission-statement" delay={0.1}>
          <Icon name="waves" size={40} stroke="var(--brand-green)" />
          <p className="h3 mission-text">
            The Just Transitions in the Delta project aims to address this need.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

const WORKS_STEPS = [
  'collaborative design of future scenarios',
  'community dialogue',
  'advanced modeling and visualization',
  'co-learning that emphasizes underrepresented voices',
];

function HowItWorks() {
  return (
    <section className="section works" id="works">
      <div className="container works-grid">
        <Reveal className="works-media" delay={0.08}>
          <Placeholder label="Community workshop session" ratio="5 / 4" />
        </Reveal>
        <div>
          <Reveal className="sec-head">
            <span className="eyebrow">The Project</span>
            <h2 className="h2">How Our Project Works</h2>
          </Reveal>
          <Reveal className="works-lede body1" delay={0.06}>
            Our project aims to raise awareness of the tradeoffs involved in managing the
            Sacramento-San Joaquin Delta amid future droughts and rising sea levels.
          </Reveal>
          <Reveal className="works-steps" delay={0.12}>
            <p className="works-steps-intro body2">Through&hellip;</p>
            <ul>
              {WORKS_STEPS.map((s, n) => (
                <li key={n}><span className="works-step-n">{String(n + 1).padStart(2, '0')}</span>{s}</li>
              ))}
            </ul>
            <p className="works-steps-out body2">&hellip;we build shared understanding of what's possible and what's at stake.</p>
          </Reveal>
          <Reveal className="works-cta" delay={0.18}>
            <a href="#" className="btn btn-primary">View Adaptation Scenarios <Icon name="arrow-right" size={18} /></a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div>
            <h2 className="h2 green footer-h">Project Funding</h2>
            <p className="quote footer-quote">
              This project is supported by the University of California's Multicampus Research Programs
              and Initiatives (MRPI) grant, which funds system-wide, cross-campus collaborative research
              of significance to the State of California.
            </p>
          </div>
          <div className="footer-logo">
            <Placeholder label="University of California" ratio="5 / 2" style={{ maxWidth: 280 }} />
          </div>
        </div>
        <div className="footer-bottom">
          <p className="h4">Just Transitions in the Delta</p>
          <p className="body2" style={{ opacity: 0.5 }}>© {year} All rights reserved.</p>
          <a href="mailto:just.transitions@ucdavis.edu" className="footer-mail">
            <Icon name="mail" size={18} /> just.transitions@ucdavis.edu
          </a>
          <p className="body2" style={{ opacity: 0.6 }}>UC Multicampus Research Program Initiative</p>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { Mission, HowItWorks, Footer });
