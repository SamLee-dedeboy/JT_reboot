/* ============================================================
   Adaptation Scenarios — shared data
   Source: Just Transitions in the Delta participatory scenario set
   (Business as Usual, Delta Tunnel, Bolster & Fortify, Eco Machine,
   New Green Watershed). Ratings are ILLUSTRATIVE placeholders pending
   model outputs — swap freely.
   ============================================================ */

/* Tradeoff factors. Ratings run 1–4 where MORE = stronger performance /
   fewer tradeoffs on that dimension. */
const FACTORS = [
  { key: 'salinity',   label: 'Salinity control',     short: 'Salinity', icon: 'drop',   stroke: 'var(--brand-blue)' },
  { key: 'supply',     label: 'Water supply & exports', short: 'Supply',  icon: 'waves',  stroke: 'var(--brand-blue)' },
  { key: 'ecosystem',  label: 'Ecosystem & habitat',  short: 'Ecosystem', icon: 'leaf',  stroke: 'var(--brand-green)' },
  { key: 'equity',     label: 'Equity & community',   short: 'Equity',   icon: 'users',  stroke: 'var(--brand-green)' },
  { key: 'agriculture',label: 'Agriculture & land',   short: 'Land use', icon: 'layers', stroke: 'var(--accent-yellow)' },
  { key: 'feasibility',label: 'Cost & feasibility',   short: 'Feasibility', icon: 'coins', stroke: 'var(--accent-orange)' },
];

const RATING_WORDS = { 1: 'Low', 2: 'Moderate', 3: 'Strong', 4: 'Very strong' };

/* intrusion: schematic salinity-line position, 0 = pushed west toward the
   bay (well controlled), 1 = intrudes far east into the Delta. */
const SCENARIOS = [
  {
    id: 'bau',
    name: 'Business as Usual',
    type: 'Baseline',
    accent: '#9ba2a4',
    rank: 6,
    intrusion: 0.72,
    tagline: 'Today’s emergency-basis management, extended into the future.',
    summary:
      'The baseline against which every other scenario is compared — current trends and reactive, emergency salinity management projected forward.',
    detail:
      'Evaluated with and without temporary urgency change petitions, it relies on the familiar toolkit of reduced exports, relaxed standards, and emergency barriers. In the workshop ranking it was by far the least preferred — a signal that the status quo is working for almost no one.',
    levers: ['Reactive releases', 'Emergency barriers', 'Relaxed standards', 'Urgency petitions'],
    ratings: { salinity: 1, supply: 2, ecosystem: 1, equity: 1, agriculture: 2, feasibility: 4 },
  },
  {
    id: 'reserves',
    name: 'Calling on Reserves',
    type: 'Reservoir operations',
    accent: '#b280ff',
    rank: 4,
    intrusion: 0.5,
    tagline: 'Draw down upstream storage to keep salinity at bay.',
    summary:
      'Leans on upstream reservoir reserves, releasing stored water to sustain the freshwater outflow that repels salinity intrusion during drought.',
    detail:
      'It works the system we already have — trading banked storage for salinity control. Effective while reserves hold, but every release spends water that could have served other uses, and multi-year droughts steadily erode the buffer.',
    levers: ['Reservoir releases', 'Stored reserves', 'Outflow for salinity', 'Operational'],
    ratings: { salinity: 3, supply: 2, ecosystem: 2, equity: 2, agriculture: 2, feasibility: 3 },
  },
  {
    id: 'tunnel',
    name: 'Delta Tunnel',
    type: 'Conveyance',
    accent: '#79e1e4',
    rank: 5,
    intrusion: 0.6,
    tagline: 'The Delta Conveyance tunnel, modelled for comparison.',
    summary:
      'A 40-mile water-supply tunnel beneath the Delta, included so its tradeoffs can be weighed directly against the other adaptations.',
    detail:
      'Conveyance routes exports around the estuary, hardening supply reliability for two-thirds of Californians. Locally contested, it was modelled because many participants wanted to see how it rated against nature-based options. It finished second to last.',
    levers: ['Delta Conveyance', 'Isolated exports', 'Hardened supply', 'Through-Delta change'],
    ratings: { salinity: 3, supply: 4, ecosystem: 1, equity: 1, agriculture: 2, feasibility: 1 },
  },
  {
    id: 'bolster',
    name: 'Bolster & Fortify',
    type: 'Gray infrastructure',
    accent: '#f77c3b',
    rank: 3,
    intrusion: 0.32,
    tagline: 'Engineered barriers, operable gates and augmented levees.',
    summary:
      'A gray-infrastructure path that holds salinity back with hardened, controllable structures across the Delta’s channels.',
    detail:
      'Operable gates and reinforced levees give managers strong, direct control of where salt water can travel — effective for supply and salinity, but engineering-heavy with limited ecological or community co-benefits.',
    levers: ['Operable gates', 'Tidal barriers', 'Augmented levees', 'Active control'],
    ratings: { salinity: 4, supply: 4, ecosystem: 2, equity: 2, agriculture: 3, feasibility: 2 },
  },
  {
    id: 'eco',
    name: 'Eco Machine',
    type: 'Nature-based',
    accent: '#51a2bd',
    rank: 2,
    intrusion: 0.5,
    tagline: 'In-Delta tidal restoration that attenuates salinity.',
    summary:
      'Tests how strategically located tidal restoration can attenuate salinity while delivering ecological, ecocultural, recreational and community benefits.',
    detail:
      'Building on precedents like Franks Tract Futures and Suisun Marsh restoration, it reshapes how salty water moves through the estuary using living systems rather than concrete. It ranked second among participants.',
    levers: ['Tidal restoration', 'Franks Tract', 'Suisun Marsh', 'Nature-based'],
    ratings: { salinity: 2, supply: 2, ecosystem: 4, equity: 3, agriculture: 2, feasibility: 3 },
  },
  {
    id: 'green',
    name: 'New Green Watershed',
    type: 'Region-wide transition',
    accent: '#7ed957',
    rank: 1,
    intrusion: 0.4,
    tagline: 'Green infrastructure phased across the entire watershed.',
    summary:
      'The most ambitious path: green infrastructure region-wide, paired with carbon banking, land repatriation to Indigenous communities, and wet-soil agriculture.',
    detail:
      'Phased across the watershed, it pairs salinity adaptation with reversing land subsidence and broad social and ecological repair. Participants ranked it first — the most-preferred future of the set.',
    levers: ['Watershed-wide', 'Carbon banking', 'Land repatriation', 'Wet-soil agriculture'],
    ratings: { salinity: 3, supply: 2, ecosystem: 4, equity: 4, agriculture: 3, feasibility: 2 },
  },
];

const PAGE = {
  eyebrow: 'Scenarios',
  title: 'Adaptation Scenarios',
  lede:
    'Six futures for salinity management in the Sacramento–San Joaquin Delta — modelled under long-term drought and sea-level rise, then weighed against one another for their benefits and tradeoffs.',
  note:
    'Scenarios were co-developed with Delta communities and run through climate and operations models so outcomes can be compared side by side.',
};

const OPTIONS = [
  { id: 'matrix',    letter: 'A', label: 'Comparison Matrix', file: 'Adaptation Scenarios - Comparison Matrix.html' },
  { id: 'gallery',   letter: 'B', label: 'Card Gallery',      file: 'Adaptation Scenarios - Card Gallery.html' },
  { id: 'explorer',  letter: 'C', label: 'Map Explorer',      file: 'Adaptation Scenarios - Map Explorer.html' },
  { id: 'narrative', letter: 'D', label: 'Narrative Scroll',  file: 'Adaptation Scenarios - Narrative Scroll.html' },
];

Object.assign(window, { FACTORS, RATING_WORDS, SCENARIOS, PAGE, OPTIONS });
