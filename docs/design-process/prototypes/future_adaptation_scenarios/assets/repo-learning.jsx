/* ============================================================
   Service Learning & Educational Design Studios — data + layouts
   Content verbatim from the source site; presentation redesigned.
   ============================================================ */

const SL_IMG = 'assets/repo/';

const STUDIOS = [
  { n: '01', title: 'Futures for Isleton', place: 'Town of Isleton', img: SL_IMG + 'studio-isleton.png',
    desc: 'Applying sustainable strategies to the town of Isleton using Scenario Planning.' },
  { n: '02', title: 'Feral by Design', place: 'Delta Meadows State Park', img: SL_IMG + 'studio-feral-meadows.png',
    desc: 'Site planning design concepts envisioned for the Delta Meadows State Park.' },
  { n: '03', title: 'Feral by Design', place: 'Cosumnes River Corridor', img: SL_IMG + 'studio-feral-cosumnes.png',
    desc: 'Public access and multi-benefit design concepts for the Cosumnes River Corridor.' },
];

/* ---------------- Showcase (alternating feature rows) ---------------- */
function ShowcaseLayout() {
  return (
    <div>
      <Reveal className="studio-year-head">
        <span className="studio-year-n">2025</span>
        <span className="eyebrow" style={{ color: 'var(--brand-blue)' }}>Undergraduate Design Studios</span>
      </Reveal>
      {STUDIOS.map((s, i) => (
        <Reveal key={s.title + s.place} className={`studio-feature ${i % 2 ? 'flip' : ''}`} delay={0.04}>
          <div className="studio-media">
            <img src={asset(s.img)} alt={`${s.title} — ${s.place}`} loading="lazy" />
          </div>
          <div className="studio-info">
            <span className="doc-badge">Design Studio</span>
            <div className="studio-index">{s.n}</div>
            <h3 className="studio-title">{s.title}</h3>
            <p className="studio-sub">{s.place}</p>
            <p className="studio-desc">{s.desc}</p>
            <a href="#" className="doc-link">Download <Icon name="arrow-down" size={16} /></a>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

/* ---------------- Grid (poster cards) ---------------- */
function StudioGridLayout() {
  return (
    <div>
      <Reveal className="studio-year-head">
        <span className="studio-year-n">2025</span>
        <span className="eyebrow" style={{ color: 'var(--brand-blue)' }}>Undergraduate Design Studios</span>
      </Reveal>
      <div className="studio-grid">
        {STUDIOS.map((s, i) => (
          <Reveal key={s.title + s.place} className="doc-card" delay={i * 0.06}>
            <div className="doc-cover">
              <img src={asset(s.img)} alt={`${s.title} — ${s.place}`} loading="lazy" />
              <span className="doc-badge">Design Studio</span>
            </div>
            <div className="doc-body">
              <h4 className="doc-title" style={{ color: 'var(--brand-green)', fontFamily: 'var(--font-heading)', fontWeight: 400 }}>{s.title}</h4>
              <p className="studio-sub" style={{ marginBottom: 0 }}>{s.place}</p>
              <p className="doc-desc">{s.desc}</p>
              <div className="doc-actions">
                <a href="#" className="doc-link">Download <Icon name="arrow-down" size={15} /></a>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

const SL_DEFAULTS = /*EDITMODE-BEGIN*/{
  "motion": "full",
  "density": "comfortable",
  "layout": "showcase"
}/*EDITMODE-END*/;

function LearningApp() {
  const [t, setTweak] = useTweaks(SL_DEFAULTS);
  useRepoChrome(t);

  return (
    <>
      <Navbar />
      <RepoHero
        current="learning"
        eyebrow="Repository · 02"
        title={<>Service Learning <span className="green">&amp; Design Studios</span></>}
        lede="Here's a look at University of California undergraduate coursework focused on service learning and education through publicly engaged design studios. This page will be updated with more content as public engagement continues."
      />
      <main className="section">
        <div className="container">
          {t.layout === 'showcase' ? <ShowcaseLayout /> : <StudioGridLayout />}
        </div>
      </main>
      <RepoFooter />

      <RepoTweaks t={t} setTweak={setTweak}>
        <TweakSection label="Presentation" />
        <TweakRadio label="View" value={t.layout} options={['showcase', 'grid']} onChange={(v) => setTweak('layout', v)} />
      </RepoTweaks>
    </>
  );
}

mountRepo(LearningApp);
