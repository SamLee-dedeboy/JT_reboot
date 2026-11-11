/* ============================================================
   Repository — shared shell
   RepoHero (eyebrow + title + lede + sub-tab strip), RepoFooter,
   useRepoChrome, RepoTweaks, mount helper.
   ============================================================ */

const REPO_TABS = [
  { n: '01', label: 'Project Documentation', href: 'Project Documentation.html', key: 'docs' },
  { n: '02', label: 'Service Learning', href: 'Service Learning.html', key: 'learning' },
  { n: '03', label: 'References & Resources', href: 'References & Resources.html', key: 'resources' },
];

function RepoTabs({ current }) {
  return (
    <nav className="repo-tabs" aria-label="Repository sections">
      {REPO_TABS.map((tb) => (
        <a key={tb.key} href={tb.href} className={`repo-tab ${tb.key === current ? 'on' : ''}`} aria-current={tb.key === current ? 'page' : undefined}>
          <span className="repo-tab-n">{tb.n}</span>{tb.label}
        </a>
      ))}
    </nav>
  );
}

function RepoHero({ eyebrow, title, lede, current }) {
  return (
    <header className="repo-hero" id="top">
      <div className="container">
        <Reveal>
          <span className="eyebrow">{eyebrow}</span>
          <h1 className="h1 repo-hero-title">{title}</h1>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="repo-lede">{lede}</p>
        </Reveal>
        <Reveal delay={0.14}>
          <RepoTabs current={current} />
        </Reveal>
      </div>
    </header>
  );
}

function RepoFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="repo-footer">
      <div className="container">
        <p className="h3">Just Transitions in the Delta</p>
        <p style={{ opacity: 0.5 }}>© {year} All rights reserved.</p>
        <a href="mailto:just.transitions@ucdavis.edu" className="repo-mail">
          <Icon name="mail" size={18} /> just.transitions@ucdavis.edu
        </a>
        <p style={{ opacity: 0.6 }}>University of California Multicampus Research Program Initiative</p>
      </div>
    </footer>
  );
}

const REPO_TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "motion": "full",
  "density": "comfortable"
}/*EDITMODE-END*/;

function useRepoChrome(t) {
  useEffect(() => {
    document.documentElement.setAttribute('data-motion', t.motion === 'off' ? 'off' : 'on');
    document.documentElement.setAttribute('data-density', t.density);
  }, [t.motion, t.density]);
}

function RepoTweaks({ t, setTweak, children }) {
  return (
    <TweaksPanel>
      {children}
      <TweakSection label="Motion" />
      <TweakRadio label="Animation" value={t.motion} options={['full', 'off']} onChange={(v) => setTweak('motion', v)} />
      <TweakSection label="Layout" />
      <TweakRadio label="Density" value={t.density} options={['comfortable', 'compact']} onChange={(v) => setTweak('density', v)} />
    </TweaksPanel>
  );
}

function mountRepo(App) {
  ReactDOM.createRoot(document.getElementById('root')).render(<App />);
}

/* Resolve an asset path to a bundled blob URL when running as a
   standalone file (window.__resources is populated by the bundler);
   otherwise return the normal relative path. Resource id = filename
   without extension. */
function asset(path) {
  if (!path) return path;
  const r = window.__resources;
  if (r) {
    const key = String(path).split('/').pop().replace(/\.[^.]+$/, '');
    if (r[key]) return r[key];
  }
  return path;
}

Object.assign(window, { RepoHero, RepoTabs, RepoFooter, RepoFooter, useRepoChrome, RepoTweaks, REPO_TWEAK_DEFAULTS, mountRepo, asset });
