/* ============================================================
   Project Documentation & Reports — data + layouts
   Content verbatim from the source site; presentation redesigned.
   ============================================================ */

const IMG = 'assets/repo/';

const DOC_YEARS = [
  { year: '2025', workshops: [
    { date: 'December 2nd, 2025', title: 'Tribal Workshop', tag: 'Eco-Cultural Values & Uses (with COEQWAL)', docs: [
      { badge: 'Report', title: 'Full Report', img: IMG + 'report-cover.png',
        desc: 'Complete workshop documentation and summary of tribal feedback and findings.',
        actions: [{ label: 'Download', kind: 'dl' }] },
    ]},
    { date: 'June 9th, 2025', title: 'Public Workshop #2', docs: [
      { badge: 'Summary', title: 'Executive Summary', green: true,
        desc: 'High-level overview of workshop findings and scenario rankings.',
        actions: [{ label: 'Download', kind: 'dl' }] },
      { badge: 'Report', title: 'Full Report', img: IMG + 'report-cover.png',
        desc: 'Complete workshop documentation and summary of public feedback and findings.',
        actions: [{ label: 'Download', kind: 'dl' }] },
      { badge: 'Appendix', title: 'Appendix', img: IMG + 'watershed.png',
        desc: 'Resources and tools utilized in the public workshop and exhibition.',
        actions: [{ label: 'Download', kind: 'dl' }] },
    ]},
  ]},
  { year: '2024', workshops: [
    { date: 'December 3rd, 2024', title: 'Environmental Justice Workshop', docs: [
      { badge: 'Report', title: 'Full Report', img: IMG + 'report-cover.png',
        desc: 'Complete workshop documentation and summary of public feedback and findings.',
        actions: [{ label: 'Download', kind: 'dl' }] },
    ]},
    { date: 'June 11th, 2024', title: 'Public Workshop #1', docs: [
      { badge: 'Summary', title: 'Executive Summary', green: true,
        desc: 'High-level overview of workshop findings and scenario rankings.',
        actions: [{ label: 'Download', kind: 'dl' }] },
      { badge: 'Recording', title: 'Plenary Session Live Recording', img: IMG + 'plenary.png',
        desc: 'Research team presentation with interview and scenario overviews.',
        actions: [{ label: 'View', kind: 'view' }] },
      { badge: 'Report', title: 'Full Report', img: IMG + 'report-cover.png',
        desc: 'Complete workshop summary of findings and documentation.',
        actions: [{ label: 'Download', kind: 'dl' }] },
      { badge: 'Workbooks', title: 'Breakout Session Workbooks', img: IMG + 'workbook.png',
        desc: 'Scanned copies of the breakout sessions workbook results (distilled in full report).',
        actions: [{ label: 'Group 1.A', kind: 'multi' }, { label: 'Group 1.B', kind: 'multi' }] },
      { badge: 'Slides', title: 'Presentation Slides', img: IMG + 'project-goals.png',
        desc: 'Introduction to the project objectives and workshop goals.',
        actions: [{ label: 'Download', kind: 'dl' }] },
      { badge: 'Slides', title: 'Interview Presentation Slides', img: IMG + 'interview.png',
        desc: 'Extensive summary analysis of responses from the initial interviews.',
        actions: [{ label: 'Download', kind: 'dl' }] },
    ]},
  ]},
  { year: '2023', workshops: [
    { date: 'Context Gathering', title: 'Context Gathering', docs: [
      { badge: 'Brochure', title: 'Project Brochure', img: IMG + 'brochure.png',
        desc: 'Overview of the Just Transitions project and core objectives.',
        actions: [{ label: 'Download', kind: 'dl' }] },
      { badge: 'Fact Sheet', title: 'Fact Sheet', img: IMG + 'factsheet.png',
        desc: 'The drivers of change and management strategies in the Delta.',
        actions: [{ label: 'Download', kind: 'dl' }] },
    ]},
  ]},
];

function ActionLink({ a }) {
  const cls = a.kind === 'dl' ? 'doc-link' : 'doc-link ghost';
  const icon = a.kind === 'dl' ? 'arrow-down' : a.kind === 'view' ? 'arrow-up-right' : null;
  return (
    <a href="#" className={cls}>
      {a.label}{icon && <Icon name={icon} size={15} />}
    </a>
  );
}

function DocCover({ doc }) {
  return (
    <div className="doc-cover">
      {doc.green
        ? <div className="doc-cover-green"><span>{doc.title}</span></div>
        : <img src={asset(doc.img)} alt={doc.title} loading="lazy" />}
      <span className="doc-badge">{doc.badge}</span>
    </div>
  );
}

function DocCard({ doc, delay = 0 }) {
  return (
    <Reveal className="doc-card" delay={delay}>
      <DocCover doc={doc} />
      <div className="doc-body">
        <h4 className="doc-title">{doc.title}</h4>
        <p className="doc-desc">{doc.desc}</p>
        <div className="doc-actions">
          {doc.actions.map((a, i) => <ActionLink key={i} a={a} />)}
        </div>
      </div>
    </Reveal>
  );
}

/* ---------------- Timeline layout ---------------- */
function TimelineLayout() {
  return (
    <div className="tl">
      {DOC_YEARS.map((y) => (
        <div className="tl-year" key={y.year}>
          <Reveal><div className="tl-year-n">{y.year}</div></Reveal>
          {y.workshops.map((w) => (
            <div className="tl-workshop" key={w.title + w.date}>
              <Reveal className="tl-ws-head">
                <span className="tl-ws-date">{w.date}</span>
                <h3 className="tl-ws-title">{w.title}</h3>
                {w.tag && <p className="body2" style={{ marginTop: '0.4rem', opacity: 0.7 }}>{w.tag}</p>}
              </Reveal>
              <div className={`tl-cards ${w.docs.length === 1 ? 'single' : ''}`}>
                {w.docs.map((d, i) => <DocCard key={d.title + i} doc={d} delay={i * 0.05} />)}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

/* ---------------- Gallery layout ---------------- */
function GalleryLayout() {
  return (
    <div>
      {DOC_YEARS.map((y) => (
        <section className="gal-year" key={y.year}>
          <Reveal className="gal-year-head">
            <span className="gal-year-n">{y.year}</span>
          </Reveal>
          {y.workshops.map((w) => (
            <div className="gal-ws" key={w.title + w.date}>
              <Reveal>
                <h3 className="gal-ws-title">{w.title} <span style={{ color: 'var(--base-200)', fontWeight: 400 }}>· {w.date}</span></h3>
              </Reveal>
              <div className="gal-grid">
                {w.docs.map((d, i) => <DocCard key={d.title + i} doc={d} delay={i * 0.05} />)}
              </div>
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}

const DOCS_DEFAULTS = /*EDITMODE-BEGIN*/{
  "motion": "full",
  "density": "comfortable",
  "layout": "timeline"
}/*EDITMODE-END*/;

function DocsApp() {
  const [t, setTweak] = useTweaks(DOCS_DEFAULTS);
  useRepoChrome(t);

  return (
    <>
      <Navbar />
      <RepoHero
        current="docs"
        eyebrow="Repository · 01"
        title={<>Project Documentation <span className="green">&amp; Reports</span></>}
        lede="Here's a look at our project findings and outreach tools. This page will be updated with more content as public engagement and scenario refinement continue."
      />
      <main className="section">
        <div className="container">
          <Reveal className="repo-meta">
            <span><span className="green">9</span> documents</span>
            <span>·</span>
            <span>2023 – 2025</span>
          </Reveal>
          {t.layout === 'timeline' ? <TimelineLayout /> : <GalleryLayout />}
        </div>
      </main>
      <RepoFooter />

      <RepoTweaks t={t} setTweak={setTweak}>
        <TweakSection label="Presentation" />
        <TweakRadio label="View" value={t.layout} options={['timeline', 'gallery']} onChange={(v) => setTweak('layout', v)} />
      </RepoTweaks>
    </>
  );
}

mountRepo(DocsApp);
