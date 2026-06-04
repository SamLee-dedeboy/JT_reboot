/* Mid-page sections — copy verbatim, presentation redesigned for lower load */

/* Split off the first sentence as an emphasized lead */
function splitLead(text) {
  const m = text.match(/^(.*?[.?!])\s+(.*)$/s);
  return m ? [m[1], m[2]] : [text, ''];
}

/* Prose that shows a lead, with the remainder collapsible. Optionally
   wraps a verbatim substring in an inline highlight (no copy change). */
function ExpandableProse({ text, emphasize }) {
  const [open, setOpen] = useState(false);
  const [lead, rest] = splitLead(text);

  const render = (str) => {
    if (!emphasize || !str.includes(emphasize)) return str;
    const idx = str.indexOf(emphasize);
    return (<>
      {str.slice(0, idx)}
      <mark className="hl">{emphasize}</mark>
      {str.slice(idx + emphasize.length)}
    </>);
  };

  return (
    <div className="prose">
      <p className="prose-lead">{render(lead)}</p>
      <div className={`prose-rest ${open ? 'open' : ''}`}>
        <p>{render(rest)}</p>
      </div>
      {rest && (
        <button className="prose-toggle" onClick={() => setOpen(!open)} aria-expanded={open}>
          {open ? 'Show less' : 'Read more'}
          <Icon name="chevron-down" size={16} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }} />
        </button>
      )}
    </div>
  );
}

/* ---- Foundations: the two scenario definitions ---- */
const FOUNDATIONS = [
  { n: '01', icon: 'compass', title: 'What Are Scenarios?',
    text: 'Scenarios are models and depictions of possible futures and the pathways through which they could manifest. Participatory scenario planning is a "bottom up" approach that involves working directly with public contributors to create and evaluate future scenarios for a particular place.' },
  { n: '02', icon: 'users', title: 'Why Participatory Scenario Planning?',
    text: 'Scenario planning is an approach increasingly used in conservation and climate change adaptation research, especially when uncertainty, vulnerability, and divergent stakeholder interests create conflicting mandates. By envisioning diverse ways in which climate, governance and ecosystems might co-evolve, scenario-based planning offers tools to reflect on current actions and goals, and in turn, fosters shared learning and socio-technical innovation.' },
];

function Foundations() {
  return (
    <section className="section" id="foundations">
      <div className="container">
        <Reveal className="sec-head">
          <span className="eyebrow">Foundations</span>
          <h2 className="h2">The Idea Behind the Work</h2>
        </Reveal>
        <div className="found-grid">
          {FOUNDATIONS.map((f, n) => {
            const [lead, rest] = splitLead(f.text);
            return (
              <Reveal key={f.n} className="found-card card" delay={n * 0.08}>
                <div className="found-top">
                  <span className="found-num">{f.n}</span>
                  <Icon name={f.icon} size={28} stroke="var(--brand-green)" />
                </div>
                <h3 className="h3 found-title">{f.title}</h3>
                <p className="found-lead">{lead}</p>
                <p className="found-rest body2">{rest}</p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---- Our Approach ---- */
const APPROACH_MODES = [
  'public workshops', 'interviews', 'surveys', 'partnerships', 'exhibitions', 'field work',
];

function OurApproach() {
  return (
    <section className="section approach" id="approach">
      <div className="container approach-grid">
        <div>
          <Reveal className="sec-head">
            <span className="eyebrow">Methodology</span>
            <h2 className="h2">Our Approach</h2>
          </Reveal>
          <Reveal className="quote approach-quote body1" delay={0.06}>
            Our approach to this participatory scenario planning process is built in a variety of ways,
            including public workshops, interviews, surveys, partnerships, exhibitions, and field work
            in the Sacramento-San Joaquin Delta.
          </Reveal>
          <Reveal className="approach-chips" delay={0.12}>
            {APPROACH_MODES.map((m) => (
              <span key={m} className="chip"><span className="dot" />{m}</span>
            ))}
          </Reveal>
          <Reveal className="approach-cta" delay={0.18}>
            <a href="#" className="btn btn-primary">Project Documentation &amp; Reports</a>
            <a href="#" className="btn btn-outline">Participatory Scenario Planning</a>
          </Reveal>
        </div>
        <Reveal className="approach-media" delay={0.1}>
          <Placeholder label="Participatory process diagram" ratio="4 / 5" />
        </Reveal>
      </div>
    </section>
  );
}

/* ---- What's at Stake / Drought ---- */
const STAKE = {
  text: "The Bay-Delta region holds immense economic, ecological, and cultural significance, yet funding for research in this area has historically lagged behind other large-scale waterbodies. In addition, the lack of estuary-scale approaches for envisioning alternative futures and evaluating tradeoffs through inclusive public engagement has seen limited progress. Furthermore, the complex science-governance nexus of this area has often been fraught with conflict due to fragmented governance and competing demands on the region's natural resources. As a consequence, responses to climate management in the Delta have often been short-term 'bandaid' solutions with significant and possibly inequitable tradeoffs, leaving long-term solutions unclear.",
  emphasize: "responses to climate management in the Delta have often been short-term 'bandaid' solutions with significant and possibly inequitable tradeoffs",
};
const DROUGHT = {
  text: "During extreme drought years, the amount of water required to be released from reservoirs to keep salinity from entering the Delta is nearly the same amount that is available for water use in the Delta and exported to southern California. These managed water releases for salinity control are intended to protect both in-Delta uses as well as this major source of exports to central and southern California. If ocean tides were to push salinity into the southern Delta—which would be accelerated by sea-level rise—the recovery of freshwater exports would take months to years. As drought stretches into multiple years and reservoir water supplies become more limited, controlling salinity becomes problematic, typically involving reduced exports, temporary relaxation of salinity standards in some parts of the Delta, and the construction of emergency barriers that redirect tidal energy away from the southern Delta. While effective at decreasing the amount of water needed to maintain salinity in the southern Delta, each of these actions has tradeoffs for different groups of people and ecosystems.",
  emphasize: "the amount of water required to be released from reservoirs to keep salinity from entering the Delta is nearly the same amount that is available for water use in the Delta and exported to southern California",
};

function Stakes() {
  return (
    <section className="section stakes" id="stakes">
      <div className="container">
        <Reveal className="sec-head">
          <span className="eyebrow">Context</span>
          <h2 className="h2">What's at Stake</h2>
        </Reveal>
        <div className="stakes-grid">
          <Reveal className="stake-card card">
            <div className="stake-tag"><Icon name="layers" size={20} stroke="var(--brand-blue)" /> The Bay-Delta Region</div>
            <ExpandableProse text={STAKE.text} emphasize={STAKE.emphasize} />
          </Reveal>
          <Reveal className="stake-card card" delay={0.08}>
            <div className="stake-tag"><Icon name="drop" size={20} stroke="var(--brand-blue)" /> Drought, Salinity &amp; Sea-Level Rise</div>
            <ExpandableProse text={DROUGHT.text} emphasize={DROUGHT.emphasize} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { Foundations, OurApproach, Stakes });
