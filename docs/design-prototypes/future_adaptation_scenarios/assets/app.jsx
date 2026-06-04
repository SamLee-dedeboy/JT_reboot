/* App — assembles sections, section-progress rail, Tweaks panel */

const SECTIONS = [
  { id: 'top', label: 'Home' },
  { id: 'whatif', label: 'What If?' },
  { id: 'foundations', label: 'Foundations' },
  { id: 'approach', label: 'Approach' },
  { id: 'stakes', label: "What's at Stake" },
  { id: 'mission', label: 'Mission' },
  { id: 'works', label: 'How It Works' },
];

function NavRail({ enabled }) {
  const [active, setActive] = useState('top');
  useEffect(() => {
    if (!enabled) return;
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [enabled]);

  if (!enabled) return null;
  return (
    <nav className="rail" aria-label="Section navigation">
      {SECTIONS.map((s) => (
        <a key={s.id} href={`#${s.id}`} className={`rail-item ${active === s.id ? 'on' : ''}`}>
          <span className="rail-dot" />
          <span className="rail-label">{s.label}</span>
        </a>
      ))}
    </nav>
  );
}

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "motion": "full",
  "density": "comfortable",
  "whatIfSpeed": 5.2
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  useEffect(() => {
    document.documentElement.setAttribute('data-motion', t.motion === 'off' ? 'off' : 'on');
    document.documentElement.setAttribute('data-density', t.density);
  }, [t.motion, t.density]);

  const motionOff = t.motion === 'off';

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <WhatIf interval={Math.round(t.whatIfSpeed * 1000)} motionOff={motionOff} />
        <Foundations />
        <OurApproach />
        <Stakes />
        <Mission />
        <HowItWorks />
      </main>
      <Footer />

      <TweaksPanel>
        <TweakSection label="Motion" />
        <TweakRadio
          label="Animation" value={t.motion}
          options={['full', 'off']}
          onChange={(v) => setTweak('motion', v)}
        />
        <TweakSlider
          label="What If? speed" value={t.whatIfSpeed} min={2.5} max={9} step={0.1} unit="s"
          onChange={(v) => setTweak('whatIfSpeed', v)}
        />
        <TweakSection label="Layout" />
        <TweakRadio
          label="Density" value={t.density}
          options={['comfortable', 'compact']}
          onChange={(v) => setTweak('density', v)}
        />
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
