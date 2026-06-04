/* ============================================================
   References & Resources — layouts
   ============================================================ */

function AbstractBody({ a }) {
  return (
    <>
      {a.paras.map((p, i) => <p key={i}>{p}</p>)}
      {a.list && (
        <ol>{a.list.map((li, i) => <li key={i}>{li}</li>)}</ol>
      )}
    </>
  );
}

/* ---------------- Reading list (accordion) ---------------- */
function ArticleAccordion({ a, n, open, onToggle }) {
  return (
    <div className={`art-item ${open ? 'open' : ''}`}>
      <button className="art-head" onClick={onToggle} aria-expanded={open}>
        <span className="art-num">{String(n).padStart(2, '0')}</span>
        <span className="art-head-main">
          <span className="art-htitle">{a.title}</span>
          <span className="art-hmeta">
            <span className="art-hsource">{a.source}</span>
            <span>{a.meta}</span>
          </span>
        </span>
        <span className="art-toggle"><Icon name="plus" size={18} /></span>
      </button>
      <div className="art-body">
        <div className="art-body-inner">
          <div className="art-body-pad">
            <div className="art-kicker">{a.kicker}</div>
            <AbstractBody a={a} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ReadingListLayout() {
  const [open, setOpen] = useState(0);
  return (
    <div className="art-list">
      {ARTICLES.map((a, i) => (
        <Reveal key={a.title} delay={Math.min(i, 4) * 0.04}>
          <ArticleAccordion a={a} n={i + 1} open={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />
        </Reveal>
      ))}
    </div>
  );
}

/* ---------------- Index (two-column, expanded) ---------------- */
function IndexLayout() {
  return (
    <div>
      {ARTICLES.map((a, i) => (
        <Reveal key={a.title} className="idx-item">
          <div className="idx-cite">
            <span className="idx-cnum">{String(i + 1).padStart(2, '0')}</span>
            <h3 className="idx-ctitle">{a.title}</h3>
            <span className="idx-csource"><Icon name="arrow-up-right" size={14} />{a.source}</span>
            <p className="idx-cmeta">{a.meta}</p>
          </div>
          <div className="idx-body">
            <div className="idx-kicker">{a.kicker}</div>
            <AbstractBody a={a} />
          </div>
        </Reveal>
      ))}
    </div>
  );
}

const RES_DEFAULTS = /*EDITMODE-BEGIN*/{
  "motion": "full",
  "density": "comfortable",
  "layout": "reading-list"
}/*EDITMODE-END*/;

function ResourcesApp() {
  const [t, setTweak] = useTweaks(RES_DEFAULTS);
  useRepoChrome(t);

  return (
    <>
      <Navbar />
      <RepoHero
        current="resources"
        eyebrow="Repository · 03"
        title={<>References <span className="green">&amp; Resources</span></>}
        lede="A curated collection of reference literature that has informed the Just Transitions project — spanning disciplines, concerns, and public interests across the Delta."
      />

      <main>
        {/* Building on existing research */}
        <section className="section" id="building">
          <div className="container">
            <Reveal className="res-hero-img">
              <img src={asset("assets/repo/resources-hero.png")} alt="Aerial view of the Sacramento-San Joaquin Delta" loading="lazy" />
            </Reveal>
            <Reveal className="sec-head">
              <span className="eyebrow">Foundations</span>
              <h2 className="h2">Building on Existing Delta Research</h2>
            </Reveal>
            <Reveal className="res-intro-quote body1" delay={0.06}>
              The following content is provided as a small collection of reference literature that has informed the research of the Just Transition project. It includes literature from a wide range of disciplines, and across a range of concerns and public interests in the Delta. All content shared here is the intellectual property of the credited authors and agencies.
            </Reveal>
            <div className="ref-grid">
              {REFERENCES.map((r, i) => (
                <Reveal key={r.title} className="ref-item" as="a" href="#" delay={(i % 2) * 0.05}>
                  <div className="ref-title">{r.title}</div>
                  <div className="ref-source"><Icon name="arrow-up-right" size={15} />{r.source}</div>
                  <div className="ref-meta">{r.meta}</div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Research articles */}
        <section className="section" id="articles" style={{ paddingTop: 0 }}>
          <div className="container">
            <Reveal className="sec-head">
              <span className="eyebrow">Literature</span>
              <h2 className="h2">Research Articles</h2>
            </Reveal>
            {t.layout === 'reading-list' ? <ReadingListLayout /> : <IndexLayout />}
          </div>
        </section>

        {/* Modeling resources */}
        <section className="section model-band" id="modeling">
          <div className="container model-grid">
            <Reveal className="model-logo">
              <img src={asset("assets/repo/cwemf.png")} alt="California Water & Environmental Modeling Forum (CWEMF)" loading="lazy" />
            </Reveal>
            <Reveal className="model-copy" delay={0.08}>
              <span className="eyebrow">Modeling Resources</span>
              <h3 className="h2" style={{ marginTop: '0.6rem' }}>California Water &amp; Environmental Modeling Forum</h3>
              <p>This wiki serves as a collaborative platform for sharing information, resources, and documentation related to modeling efforts focused on the Delta ecosystem.</p>
              <a href="#" className="btn btn-primary">Model Inventory <Icon name="arrow-right" size={18} /></a>
            </Reveal>
          </div>
        </section>
      </main>

      <RepoFooter />

      <RepoTweaks t={t} setTweak={setTweak}>
        <TweakSection label="Research articles" />
        <TweakRadio label="View" value={t.layout} options={['reading-list', 'index']} onChange={(v) => setTweak('layout', v)} />
      </RepoTweaks>
    </>
  );
}

mountRepo(ResourcesApp);
