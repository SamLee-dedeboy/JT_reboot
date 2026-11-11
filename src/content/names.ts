// What the website calls each evaluation team (criterion) and each scenario.
//
// Every page takes its team and scenario names from here. To rename something across
// the site, change `name` (or `shortName`, or `code`). Where one place needs different
// wording, add it under `variants`, keyed by that place, instead of typing the name into
// the page: the place then reads `teamName(key, place)` or `scenarioName(key, place)`.

/** Places that word a name their own way. Add one here before using it in `variants`. */
export type NamePlace =
  /** The scenario's own story page, the landing cards and the modeling overview. */
  | 'scenarioStory'
  /** The ranking table's column heads, chips and sentence (By criterion). */
  | 'rankingTable'
  /** The "<team> first" weight presets on By scenario. */
  | 'weightPresets'

interface Names {
  /** The full name, used wherever a place has no variant. */
  name: string
  /** A shorter name for tabs, chips and legends. */
  shortName: string
  variants?: Partial<Record<NamePlace, string>>
}

// ---------- teams ----------

/** Stable id per team: keys icons, colors and data, independent of display name. */
export type TeamKey = 'ecology' | 'recreation' | 'environmentalJustice' | 'economy' | 'ecoCultural'

export interface TeamNames extends Names {
  key: TeamKey
  /** The team's URL segment, as in /scenarios/evaluation/<slug>. */
  slug: string
  /** Its number on the evaluation pages. */
  number: string
}

export const TEAM_NAMES: Record<TeamKey, TeamNames> = {
  ecology: {
    key: 'ecology',
    slug: 'ecology',
    number: '01',
    name: 'Ecology',
    shortName: 'Ecology',
  },
  environmentalJustice: {
    key: 'environmentalJustice',
    slug: 'environmental-justice',
    number: '02',
    name: 'Environmental Justice & Vulnerable Communities',
    shortName: 'Env. Justice',
    variants: { weightPresets: 'Justice' },
  },
  ecoCultural: {
    key: 'ecoCultural',
    slug: 'ecocultural-restoration',
    number: '03',
    name: 'Eco-cultural Restoration & Indigenous Sovereignty',
    shortName: 'Eco-cultural',
  },
  recreation: {
    key: 'recreation',
    slug: 'recreation',
    number: '04',
    name: 'Recreation',
    shortName: 'Recreation',
  },
  economy: {
    key: 'economy',
    slug: 'economy',
    number: '05',
    name: 'Economy',
    shortName: 'Economy',
  },
}

/** A team's full name, or its wording in `place`. */
export const teamName = (key: TeamKey, place?: NamePlace) =>
  (place && TEAM_NAMES[key].variants?.[place]) || TEAM_NAMES[key].name

/** A team's short name, or its wording in `place`. */
export const teamShortName = (key: TeamKey, place?: NamePlace) =>
  (place && TEAM_NAMES[key].variants?.[place]) || TEAM_NAMES[key].shortName

/** The team whose URL segment is `slug`. */
export const teamBySlug = (slug: string) =>
  Object.values(TEAM_NAMES).find((team) => team.slug === slug)

// ---------- scenarios ----------

/**
 * Stable id per scenario. The six adaptation scenarios (with Business as Usual), the
 * tiered outflow runs (+30%, −10%, and their Historical Baseline), and CalSim's own
 * Business as Usual, which some results are read against.
 */
export type ScenarioKey =
  'bau' | 'em' | 'ngw' | 'bf' | 'cor' | 'tunnel' | 'hist' | 'more' | 'less' | 'csbau'

export interface ScenarioNames extends Names {
  key: ScenarioKey
  /** The scenario's page, as in /scenarios/<slug>, where it has one. */
  slug?: string
  /** The abbreviation on crowded charts: BAU, ECO, … */
  code: string
}

export const SCENARIO_NAMES: Record<ScenarioKey, ScenarioNames> = {
  bau: {
    key: 'bau',
    slug: 'business-as-usual',
    name: 'Business as Usual',
    shortName: 'Business as Usual',
    code: 'BAU',
  },
  em: {
    key: 'em',
    slug: 'eco-machine',
    name: 'Eco Machine',
    shortName: 'Eco Machine',
    code: 'ECO',
  },
  ngw: {
    key: 'ngw',
    slug: 'new-green-watershed',
    name: 'New Green Watershed',
    shortName: 'New Green Watershed',
    code: 'NGW',
  },
  bf: {
    key: 'bf',
    slug: 'bolster-and-fortify',
    name: 'Bolster & Fortify',
    shortName: 'Bolster & Fortify',
    code: 'B&F',
    variants: { scenarioStory: 'Bolster and Fortify' },
  },
  cor: {
    key: 'cor',
    slug: 'calling-on-reserves',
    name: 'Calling on Reserves',
    shortName: 'Calling on Reserves',
    code: 'COR',
  },
  tunnel: {
    key: 'tunnel',
    slug: 'a-tunnel',
    name: 'A Tunnel',
    shortName: 'A Tunnel',
    code: 'TUN',
  },
  hist: {
    key: 'hist',
    name: 'Historical Baseline',
    shortName: 'Historical Baseline',
    code: 'HIST',
  },
  more: {
    key: 'more',
    name: 'More outflow (+30%)',
    shortName: '+30% outflow',
    code: '+30% outflow',
    variants: { rankingTable: 'Increased Delta outflow' },
  },
  less: {
    key: 'less',
    name: 'Less outflow (−10%)',
    shortName: '−10% outflow',
    code: '−10% outflow',
  },
  csbau: {
    key: 'csbau',
    name: 'Business as Usual (CalSim)',
    shortName: 'BAU (CalSim)',
    code: 'BAU CalSim',
  },
}

/** A scenario's full name, or its wording in `place`. */
export const scenarioName = (key: ScenarioKey, place?: NamePlace) =>
  (place && SCENARIO_NAMES[key].variants?.[place]) || SCENARIO_NAMES[key].name

/** A scenario's URL segment, as in /scenarios/<slug>. */
export const scenarioSlug = (key: ScenarioKey) => SCENARIO_NAMES[key].slug ?? key

/** The scenario whose page is /scenarios/<slug>. */
export const scenarioBySlug = (slug: string) =>
  Object.values(SCENARIO_NAMES).find((scenario) => scenario.slug === slug)

/**
 * A chart abbreviation for a scenario label as a dataset spells it, such as
 * "Eco Machine (SLR)" → "ECO SLR". Labels it does not know come back unchanged.
 */
export function scenarioCodeForLabel(label: string, { keepSlr = true } = {}) {
  const slr = /\s*\(SLR\)$/.exec(label)
  const base = slr ? label.slice(0, slr.index) : label
  // The SCHISM datasets' plain "Baseline" keeps its own word; only its SLR run is abbreviated.
  const code =
    base === 'Baseline' && !slr ? undefined : (DATASET_LABEL_CODES[base] ?? codeByName.get(base))
  if (!code) return label
  return slr && keepSlr ? `${code} SLR` : code
}

const codeByName = new Map(Object.values(SCENARIO_NAMES).map((s) => [s.name, s.code]))

/** How the salinity datasets spell some scenarios, where that differs from `name`. */
const DATASET_LABEL_CODES: Record<string, string> = {
  Baseline: 'BAU',
  'Business As Usual': 'BAU',
  'Business as Usual (CalSim, SLR)': 'BAU CalSim SLR',
  '+30% Delta outflow': '+30% outflow',
  '-10% Delta outflow': '-10% outflow',
}
