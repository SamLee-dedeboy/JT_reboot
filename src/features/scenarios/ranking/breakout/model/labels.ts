// Every word the breakout table shows (By criterion, and the /pages/breakout kiosk),
// in one place to edit. Sections, in order:
//
//   TEAM_TAKEAWAYS    the paragraph under "How the score is built", one per criterion
//   TEAM_CAVEATS      the "Read with care" notes before a criterion's table
//   SCENARIO_LABELS   a scenario's name in the table heads, chips and sentence
//   SCENARIO_GROUPS   the headings over the two groups of scenario columns
//   PLACE_LABELS      a place's name on its tab and in the sentence
//   PLACE_TRAYS       which place tabs sit together after "All together"
//   MEASURE_LABELS    the score and measure row names
//   UI                headings, buttons, legend, notes, and the words for empty cells
//   CRITERION_DEFINITIONS  a criterion score's info card: its metrics and how they combine
//   METRIC_DEFINITIONS     a metric's info card: what, how computed, what is considered, how scored
//   PERIOD_WHY, PERIOD_MONTHS, TEAM_PERIOD_MONTHS  the TIME PERIOD info card
//   PLACE_WHY              the PLACE info card, above the map
//   SCENARIO_TAKEAWAYS     a team's takeaway in a score cell's card
//
// Criterion names on the tabs (Ecology, Recreation, …) are shared with the whole
// site: TEAMS in ../data.ts.
//
// Two rules the page relies on:
//   - A species name ending ", juvenile" or ", adult" is shown as the species with
//     a life-stage chip, and the map groups the stages under one tab. Keep that
//     ending to keep the chip.
//   - The team-level names (bk-ecology, …) are also the team's own score row.
import type { TeamKey } from '../../../../../internal/rank-visualization/data'
import { SCENARIO_NAME } from '../../../../../internal/rank-visualization/drilldown/model'
import type { ScenarioKey } from '../../../../../internal/rank-visualization/drilldown/model'

/**
 * One paragraph from each criterion's team: its takeaway, under "How the score is
 * built". Leave a team out and the page shows UI.openingPlaceholder instead.
 */
export const TEAM_TAKEAWAYS: Partial<Record<TeamKey, string>> = {
  // ecology: '',
  // recreation: '',
  // environmentalJustice: '',
  // economy: '',
  // ecoCultural: '',
}

/**
 * What to keep in mind across a whole criterion, shown under "Read with care" just
 * above its table. One string per note; a criterion with none shows no box.
 */
export const TEAM_CAVEATS: Partial<Record<TeamKey, string[]>> = {
  economy: [
    'For Eco Machine and New Green Watershed, these scores count only the cost of turning farmland into wetland, net of carbon credits. Restoration’s benefits, such as halting subsidence, lower flood risk, cleaner water and habitat, are left out.',
  ],
}

/**
 * A scenario's name wherever this table shows it. Leave one out to use the site's
 * name for it (SCENARIO_NAME in ../drilldown/model.ts).
 */
export const SCENARIO_LABELS: Partial<Record<ScenarioKey, string>> = {
  // em: 'Eco Machine',
  // ngw: 'New Green Watershed',
  // bf: 'Bolster & Fortify',
  // cor: 'Calling on Reserves',
  // tunnel: 'A Tunnel',
  more: 'Increased Delta outflow',
}

export const scenarioName = (key: ScenarioKey) => SCENARIO_LABELS[key] ?? SCENARIO_NAME[key]

/** The headings over the scenario columns' two groups, and over their chips. */
export const SCENARIO_GROUPS = {
  landscape: 'Changes to landscape',
  waterFlow: 'Changes to water flow',
}

/**
 * A place's name on its tab and in the sentence, keyed by its name in the data.
 * Leave one out to show the data's name.
 */
export const PLACE_LABELS: Partial<Record<TeamKey, Record<string, string>>> = {
  ecology: { 'Delta-wide': 'All together' },
  recreation: { 'Delta-wide': 'All together' },
  environmentalJustice: {
    'All 49 points': 'All together',
    'Moderate vulnerability · 10': 'Medium vulnerability',
    'High vulnerability · 36': 'High vulnerability',
    'High vulnerability · 33': 'High vulnerability',
    'Highest vulnerability · 3': 'Highest vulnerability',
  },
}

export const placeName = (label: string, team: TeamKey) => PLACE_LABELS[team]?.[label] ?? label

/**
 * The place tabs after "All together", in groups set apart. One place is picked
 * across all groups. Places are listed by their name in the data; a team shows only
 * the ones it has, and a group it has none of is left out. Places listed nowhere
 * here (Environmental Justice's vulnerability classes) share one group. The heading
 * is read out to screen readers, not shown.
 */
export const PLACE_TRAYS: { heading: string; places: string[] }[] = [
  { heading: 'Bay area', places: ['South Bay', 'Central Bay', 'San Pablo Bay'] },
  {
    heading: 'Delta',
    places: [
      'Suisun Bay',
      'Suisun Marsh',
      'Confluence',
      'North Delta',
      'Central Delta',
      'South Delta',
      'West Delta',
    ],
  },
]

export const MEASURE_LABELS: Record<string, string> = {
  // Ecology
  'bk-ecology': 'Ecology',
  'bk-eco-habitat': 'Landscape',
  'bk-eco-habitat-acres': 'Added wetland',
  'bk-eco-foodweb': 'Food webs',
  'bk-eco-foodweb-managed': 'Managed wetland',
  'bk-eco-foodweb-tidal': 'Added wetland',
  'bk-eco-foodweb-wetsoil': 'Wet-soil agriculture',
  'bk-eco-species': 'Species suitability',
  'bk-eco-niche-longfinJuv': 'Longfin smelt, juvenile',
  'bk-eco-niche-longfinAdult': 'Longfin smelt, adult',
  'bk-eco-niche-chinook': 'Chinook salmon, juvenile',
  'bk-eco-niche-stripedBassJuv': 'Striped bass, juvenile',
  'bk-eco-niche-stripedBassAdult': 'Striped bass, adult',
  'bk-eco-niche-largemouthBass': 'Largemouth bass',
  'bk-eco-niche-overbiteClam': 'Overbite clam, juvenile',
  'bk-eco-niche-egeria': 'Brazilian waterweed',
  'bk-eco-conceptual': 'Conceptual models',

  // Recreation
  'bk-recreation': 'Recreation',
  'bk-rec-salinity': '% of days under Salinity Stress',
  'bk-rec-salinity-dayUseBoating': 'Day use and boating',
  'bk-rec-salinity-birding': 'Birding',
  'bk-rec-salinity-waterfowl': 'Waterfowl hunting',
  'bk-rec-salinity-angling': 'Angling',
  'bk-rec-temperature': '% of days under Temperature Stress',
  'bk-rec-temperature-dayUseBoating': 'Day use and boating',
  'bk-rec-temperature-birding': 'Birding',
  'bk-rec-temperature-waterfowl': 'Waterfowl hunting',
  'bk-rec-temperature-angling': 'Angling',
  'bk-rec-temperature-dayUseCold': 'Cold-water day use',
  'bk-rec-restoration': 'Habitat Restoration',
  'bk-rec-restoration-acres': 'Restored acres',
  'bk-rec-economy': 'Recreation economy',

  // Environmental justice
  'bk-environmentalJustice': 'Environmental Justice',
  'bk-ej-drinking': 'Salinity impacts to in-Delta drinking water',
  'bk-ej-drinking-pct': '% of days with unsuitable water quality',
  'bk-ej-flood': 'Flood risk attenuation',
  'bk-ej-waterage': 'Water age + temperature',
  'bk-ej-waterage-suisun': 'Suisun Marsh',
  'bk-ej-waterage-franksTract': 'Franks Tract',
  'bk-ej-waterage-southDelta': 'South Delta',
  'bk-ej-waterage-mcCormackWilliamson': 'McCormack-Williamson Tract',
  'bk-ej-waterage-lindseyCache': 'Lindsey-Cache Slough',

  // Economy
  'bk-economy': 'Economy',
  'bk-econ-revenue': 'Annual gross agricultural revenues',
  'bk-econ-revenue-salinity': 'Salinity effects across the Delta',
  'bk-econ-revenue-land': 'Change from converting farmland to wetland',
  'bk-econ-jobs': 'Agriculture-supported Jobs',
  'bk-econ-jobs-salinity': 'Salinity effects across the Delta',
  'bk-econ-jobs-land': 'Change from converting farmland to wetland',
  'bk-econ-value': 'Economic value added',
  'bk-econ-value-salinity': 'Salinity effects across the Delta',
  'bk-econ-value-land': 'Change from converting farmland to wetland',
  'bk-econ-value-zones': 'Dry-year salinity effects by Delta area',

  // Eco-cultural
  'bk-ecoCultural': 'Eco-cultural',
  'bk-ec-restoration': 'Habitat restoration',
  'bk-ec-restoration-acres': 'Total restored area',
  'bk-ec-restoration-managed': 'Managed wetlands',
  'bk-ec-restoration-rice': 'Wet-soil agriculture (rice)',
  'bk-ec-restoration-tidal': 'Tidal wetlands',
  'bk-ec-restoration-uplandWetland': 'Upland wetlands',
  'bk-ec-restoration-meadow': 'Meadows',
  'bk-ec-restoration-floodplain': 'Floodplains',
  'bk-ec-access': 'Tribal land access',
  'bk-ec-tek': 'Indigenous science & Traditional Ecological Knowledge (TEK)',
  'bk-ec-sovereignty': 'Tribal sovereignty',
  // Eco-cultural's conditions, under each described metric (strongest access first)
  'bk-ec-access-ownership': 'Tribal ownership',
  'bk-ec-access-landTrust': 'Land trust partnership',
  'bk-ec-access-conservationEasement': 'Conservation easement',
  'bk-ec-access-culturalEasement': 'Cultural easement',
  'bk-ec-access-mou': 'MOU / MOA',
  'bk-ec-tek-privacy': 'Privacy',
  'bk-ec-tek-unrestrictedAccess': 'Unrestricted access',
  'bk-ec-tek-siteAccess': 'Site access',
  'bk-ec-tek-stewardshipGroups': 'Tribal stewardship groups',
  'bk-ec-sovereignty-dataSovereignty': 'Data sovereignty',
  'bk-ec-sovereignty-education': 'Education',
  'bk-ec-sovereignty-foodSovereignty': 'Food sovereignty',
  'bk-ec-sovereignty-waterRights': 'Water rights / Tribal beneficial uses',

  // Qualitative rows under a scored metric
  'bk-ej-flood-judgement': '[Qualitative row, to be named]',
  'bk-rec-economy-infrastructure': 'Infrastructure impact',
}

const NUMBER_WORDS = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight']
/** Small counts in words, as the sentence over the table reads: "all six scenarios". */
const numberWord = (n: number) => NUMBER_WORDS[n] ?? String(n)

export const UI = {
  // The sentence over the table.
  comparing: 'Comparing ',
  comparingChange: (baseline: string) => `Difference from ${baseline} for `,
  allScenarios: (n: number, set: 'adaptation' | 'outflow') =>
    set === 'outflow' ? `all ${numberWord(n)} outflow runs` : `all ${numberWord(n)} scenarios`,
  someScenarios: (n: number, set: 'adaptation' | 'outflow') =>
    `${numberWord(n)} ${set === 'outflow' ? 'run' : 'scenario'}${n === 1 ? '' : 's'}`,
  withSeaLevelRise: 'with sea level rise',
  readWithCare: 'Read with care',
  openingPlaceholder: 'The team’s takeaway: forthcoming.',
  /** The heading over the table, under the criterion tabs. */
  howBuilt: 'How the score is built',

  // The rail.
  seaLevel: 'CONDITIONS',
  current: 'Current',
  seaLevelRise: 'Sea level rise',
  seaLevelNotLoaded: 'This team’s sea-level-rise runs are not loaded yet.',
  scenarios: 'SCENARIOS',
  allOn: 'All',
  baselineLocked: (baseline: string) =>
    `${baseline} is the baseline every deviation is measured from, so it stays off while deviations are shown.`,
  places: 'PLACE',
  aboutPlaces: (team: string) => `Where ${team} looks`,
  /** Why the team cuts the Delta this way: theirs to write. */
  placesWhy: 'Why the team uses these regions: forthcoming.',
  allPlaces: 'All together',
  wholePeriod: 'Whole period',
  /** The info button beside TIME PERIOD, and what it opens (the team's to write). */
  aboutPeriods: (team: string) => `When ${team} looks`,
  periodsWhy: 'Why the team uses these time periods: forthcoming.',

  // New Green Watershed's restoration levels, where a team reports them.
  ngwLevels: ['25% wetland', '50% wetland', '100% wetland'],
  ngwDefault: 'Default: 50% wetland restoration',
  ngwLevelsClosed: '50% wetland',
  ngwLevelsOpen: '25 · 50 · 100%',
  ngwLevelsShow: 'Show 25%, 50% and 100% wetland restoration',
  ngwLevelsHide: 'Show 50% wetland restoration only',
  sameAtAllLevels: 'Same at all three levels',
  timePeriods: 'TIME PERIOD',
  metrics: 'METRICS',
  /** A team's own row, "Ecology score", and the line beneath it. */
  teamScore: (team: string) => `${team} score`,
  criterionScore: 'Criterion score',

  // The view switch and legend.
  table: 'Table',
  metric: 'Metric',
  map: 'Map',
  legendScores: 'Score',
  legendDetails: 'Details \u2014',
  /** The legend for a measure's difference: blue better, orange worse. */
  better: 'Better',
  worse: 'Worse',
  noValue: 'Forthcoming',
  switchedOff: 'scenario switched off',
  notApplicableKey: 'N/A · doesn’t apply to this scenario',

  // The table.
  rankingHeading: 'Ranking scores · −5 to +5',
  showAsBars: 'Show as bars',
  showValues: 'Show values',
  footnote: 'Open a score to see what it is based on. Click a number for its values.',
  footnotePlaceholder: ' “Forthcoming” marks a number the team has not published yet.',
  footnoteSeaLevelRise:
    ' These are the sea-level-rise runs, compared with their own Business as Usual.',

  // What a cell shows without a number.
  awaiting: 'Forthcoming',
  /** A difference whose baseline run the team has not published yet. */
  baselineForthcoming: 'baseline forthcoming',
  /** A number the subteam has not published yet for this set of runs. */
  forthcoming: 'Forthcoming',
  notRun: 'not run',
  /** A row that is one version of New Green Watershed, under the other scenarios. */
  versionOnly: 'NGW only',
  /** A scenario the subteam marks N/A for this row. */
  notApplicable: 'N/A',
  notScored: 'Forthcoming',
  notRunWithSlr: 'not run with SLR',
  noSlrResult: 'no SLR result',
  bothYearsOnly: 'both years only',
  /** A row scored per entity: "per species", "per activity". */
  perEntity: (noun: string) => `per ${noun}`,
  /** A metric the team describes in words and never scores. */
  qualitative: 'Qualitative · described in the team’s report, not scored',
  /** The tag beside a qualitative row's name, and what its cells say. */
  qualitativeTag: 'Qualitative',
  noChange: 'No change',
  inPlace: 'In place',
  notInPlace: 'Not in place',
  stepsAria: (steps: number) =>
    `${Math.abs(steps)} step${Math.abs(steps) === 1 ? '' : 's'} ${steps > 0 ? 'better' : 'worse'}`,

  // The map.
  /** The tab for a score's own map, beside its entities' tabs (Recreation, Economy). */
  mapScoreTab: 'The score',
  mapScorePicker: 'Ranking score',
  mapMeasurePicker: 'Measure on the map',
  lifeStagePicker: 'Life stage',

  // The info cards (explainers) and the cell cards (lookups).
  aboutScore: (score: string) => `How ${score} is built`,
  metricsUsed: (n: number) => `${n} metrics used`,
  howCombine: 'How they combine',
  notInScore: 'Not in this score',
  measures: 'What it measures',
  computed: 'How it is computed',
  considered: 'What is considered',
  howScored: 'How it is scored',
  whyPeriods: 'Why these periods',
  monthRanges: 'Month ranges',
  whyRegions: 'Why these regions',
  readByPlace: 'Metrics read by place',
  score: 'Score',
  difference: 'Difference',
  takeaway: 'Team takeaway',
  takeawayForthcoming: 'The team’s takeaway for this scenario: forthcoming.',
  currentConditions: 'Current conditions',
  businessAsUsual: 'Business as Usual',
  /** The chip beside Business as Usual when it is another model's run, by baseline key. */
  baselineRun: { csbau: 'CalSim', hist: 'SCHISM' } as Record<string, string>,
} as const

/** Economy's shared score rule (v16 report), the same for all three metrics. */
const ECONOMY_RULE =
  'Each scenario is scored on whichever pathway dominates for it: Business as Usual 0; Calling on Reserves 0 (salinity, very small); Bolster & Fortify −1 and A Tunnel −1 (salinity, small); Eco Machine 0 (land use, little farmland); New Green Watershed −4 (land use; the 50/50 version, −3 at 25/75, −5 all wetland).'
const ECONOMY_RULE_NOTE =
  'The same in both water years and with 2 ft of sea level rise. Calling on Reserves and A Tunnel are compared with their own RMA base run.'

/**
 * What a criterion score is made of, behind the info button on the team's own row:
 * the metrics it combines and how. Text between ** ** is drawn in the team's colour.
 */
export const CRITERION_DEFINITIONS: Record<
  TeamKey,
  { metrics: string[]; combine: string; outside?: string }
> = {
  ecology: {
    metrics: ['Landscape', 'Food webs'],
    combine:
      'Ecology publishes no single score yet, so the table shows none until the team sets one. [How Landscape and Food webs combine: forthcoming.]',
    outside: 'Species suitability.',
  },
  recreation: {
    metrics: [
      '% of days under salinity stress',
      '% of days under salinity stress, with sea level rise',
      '% of days under temperature stress',
      '% of days under temperature stress, with sea level rise',
    ],
    combine: 'The **unweighted mean** of the four metric scores, not rounded (26 Oct 2026).',
    outside: 'Habitat restoration and recreation economy, scored separately.',
  },
  environmentalJustice: {
    metrics: [
      'Salinity impacts to in-Delta drinking water',
      'Flood risk attenuation',
      'Water age + temperature',
    ],
    combine: 'The **unweighted mean** of the three, rounded to a whole point (October slides).',
  },
  economy: {
    metrics: [
      'Annual gross agricultural revenues',
      'Agriculture-supported jobs',
      'Economic value added',
    ],
    combine:
      'One score the three metrics **share**, set by whichever pathway (salinity or land use) dominates for each scenario. The same with 2 ft of sea level rise.',
  },
  ecoCultural: {
    metrics: [
      'Habitat restoration',
      'Tribal land access',
      'Indigenous science & traditional ecological knowledge (TEK)',
      'Tribal sovereignty',
    ],
    combine:
      'One overall score, **set by the team** from restoration acres, flow and qualitative judgement.',
  },
}

/**
 * What a metric is, behind the info button on its row: what it measures, how it is
 * computed, what it considers, and how it is scored. `considered` is a sentence or
 * a list of [item, detail] rows. `scale` draws the −5…+5 scale for a score set one
 * point per `step` against Business as Usual (`lowerBetter`: more of it scores lower).
 */
export const METRIC_DEFINITIONS: Record<
  string,
  {
    measures: string
    computed: string
    considered: string | [string, string][]
    scored: string
    scale?: { step: string; axis: string; lowerBetter?: boolean }
  }
> = {
  // Ecology
  'bk-eco-habitat': {
    measures: 'Accessible aquatic habitat: how much tidal wetland a scenario adds.',
    computed: 'Acres of added tidal wetland against Business as Usual.',
    considered: [
      ['Eco Machine', '53,000 acres'],
      ['New Green Watershed', '80,000 acres'],
    ],
    scored: '+1 for about every 16,000 acres added against Business as Usual, up to +5.',
  },
  'bk-eco-foodweb': {
    measures: 'Food available to fish, as an index in acres.',
    computed:
      '(managed wetland − 5,100) × 0.2 + added tidal wetland × 0.4 + (wet-soil agriculture − 17,178) × 0.1.',
    considered: 'Managed wetland, added tidal wetland and wet-soil agriculture.',
    scored: '+1 for about every 16,148 index points against Business as Usual, up to +5.',
  },
  'bk-eco-species': {
    measures: 'How much of the time each species finds water it can live in.',
    computed: 'Each species’ proportion of days inside its salinity and temperature range.',
    considered:
      'Feb 1 – Jun 1 of WY 2019 (wet) and WY 2020 (dry). Largemouth bass, overbite clam and Brazilian waterweed are scored in reverse: less habitat is better.',
    scored:
      'Each percentage point of days in range above or below Business as Usual moves the score by 1. Each species is ranked on its own; the ranks are never combined.',
    scale: { step: '%', axis: 'Days in range vs Business as Usual' },
  },

  // Recreation
  'bk-rec-salinity': {
    measures: 'How often the water is too salty for each activity.',
    computed:
      'Each activity’s share of days over its salinity threshold, at 32 points in 4 regions, Oct 2018 – Dec 2020.',
    considered: [
      ['Day use and boating', '1,000 µS/cm'],
      ['Birding', '2,640 µS/cm'],
      ['Waterfowl hunting', '3,600 µS/cm'],
      ['Angling', '9,130 µS/cm'],
    ],
    scored:
      'Each percentage point of days under stress above or below Business as Usual moves an activity’s score by 1. The metric is the **unweighted mean** of the activities.',
    scale: { step: '%', axis: 'Days under stress vs Business as Usual', lowerBetter: true },
  },
  'bk-rec-temperature': {
    measures:
      'How often the water is too warm (or, for cold-water use, too cold) for each activity.',
    computed:
      'Each activity’s share of days past its temperature threshold, at 32 points in 4 regions, Oct 2018 – Dec 2020.',
    considered: [
      ['Day use and boating', 'over 19 °C'],
      ['Birding', 'over 20 °C'],
      ['Waterfowl hunting', 'over 23 °C'],
      ['Angling', 'over 18.4 / 22.3 °C'],
      ['Cold-water day use', 'below 18 °C'],
    ],
    scored:
      'Each percentage point of days under stress above or below Business as Usual moves an activity’s score by 1. The metric is the **unweighted mean** of the activities.',
    scale: { step: '%', axis: 'Days under stress vs Business as Usual', lowerBetter: true },
  },
  'bk-rec-restoration': {
    measures: 'How much land a scenario restores for recreation.',
    computed:
      'Restored acres added on top of Business as Usual’s protected areas, by Delta region.',
    considered:
      'Eco Machine 41,720 acres in Suisun Marsh and 1,380 in the Central Delta; New Green Watershed at its 50% bound 41,720, 66,947, 283,904 and 277,681 (Suisun, Central, North, South).',
    scored:
      'Eco Machine +5, New Green Watershed +5 at every bound (26 Oct 2026). Scenarios that restore nothing score 0. Kept apart from the Recreation score.',
  },
  'bk-rec-economy': {
    measures: 'The yearly value of recreation on restored land.',
    computed:
      'The value of four recreation services on restored land, added on top of Business as Usual’s existing protected land.',
    considered: [
      [
        'Services',
        'Amenity and recreation, biodiversity, recreational hunting, recreational fishing',
      ],
      ['New Green Watershed', 'By Delta region'],
      ['Eco Machine', 'Delta-wide'],
    ],
    scored:
      'Each 1% more value than Business as Usual adds 1. Eco Machine +5, New Green Watershed +5 at every bound; scenarios that restore nothing score 0.',
    scale: { step: '%', axis: 'Value vs Business as Usual' },
  },

  // Environmental justice
  'bk-ej-drinking': {
    measures: 'How often in-Delta drinking water is too salty.',
    computed:
      'The share of salinity readings at or above 1,050 µS/cm at in-Delta drinking-water points, over the whole run.',
    considered:
      'All 49 points, and the moderate and high vulnerability classes. The highest class is always 0% and has no score.',
    scored:
      'Each percentage point of readings over the line above or below Business as Usual moves the score by 1, for each place.',
    scale: { step: '%', axis: 'Readings over the line vs Business as Usual', lowerBetter: true },
  },
  'bk-ej-flood': {
    measures: 'Flood risk across the Delta.',
    computed: 'A Delta-wide qualitative judgement by the team.',
    considered: '[What the team weighs: forthcoming.]',
    scored: 'Set by the team on the −5 to +5 scale; there is no published formula.',
  },
  'bk-ej-waterage': {
    measures: 'How long water sits in the Delta, and how warm it gets.',
    computed:
      'The change in average water age, in days, against Business as Usual, with water temperature.',
    considered: 'Five hotspot areas.',
    scored:
      'Each area is placed on a monthly ladder (slight, moderate, significant, major, extreme) and the areas are averaged; older water scores lower.',
  },

  // Economy
  'bk-econ-revenue': {
    measures: 'Farm gross revenue in the Delta.',
    computed: 'Direct gross revenue against Business as Usual ($1.107B a year).',
    considered:
      'Salinity effects across the Delta, and the change from converting farmland to wetland.',
    scored: `One score shared with jobs and value added. ${ECONOMY_RULE} ${ECONOMY_RULE_NOTE}`,
  },
  'bk-econ-jobs': {
    measures: 'Farm jobs in the Delta.',
    computed: 'Jobs against Business as Usual (7,720 direct, 11,860 total).',
    considered:
      'Salinity effects across the Delta, and the change from converting farmland to wetland.',
    scored: `One score shared with gross revenue and value added. ${ECONOMY_RULE} ${ECONOMY_RULE_NOTE}`,
  },
  'bk-econ-value': {
    measures: 'Value added: wages, business income and taxes from Delta farming.',
    computed: 'Value added against Business as Usual ($671M direct, $999M total a year).',
    considered:
      'Salinity effects across the Delta, and the change from converting farmland to wetland.',
    scored: `One score shared with gross revenue and jobs. ${ECONOMY_RULE} ${ECONOMY_RULE_NOTE}`,
  },

  // Eco-cultural
  'bk-ec-restoration': {
    measures: 'How much land a scenario restores.',
    computed: 'Restored acres.',
    considered:
      'Eco Machine 41,720 acres in Suisun and 1,380 at Franks Tract; New Green Watershed 248,815 in the Delta, plus upper-watershed ranges.',
    scored:
      'Set by the team on the −5 to +5 scale (slide 55); there is no published rule per acre.',
  },
  'bk-ec-access': {
    measures: 'How far a scenario secures Tribal access to land.',
    computed: '[How the team judges access: forthcoming.]',
    considered: [
      ['Tribal ownership', 'strongest'],
      ['Land trust partnership', ''],
      ['Conservation easement', ''],
      ['Cultural easement', ''],
      ['MOU / MOA', 'weakest'],
    ],
    scored:
      'Qualitative, in steps rather than a −5 to +5 score: each arrow is one step of gain over Business as Usual. The conditions beneath are checked where a scenario puts them in place. [Confirm the steps and conditions with the team.]',
  },
  'bk-ec-tek': {
    measures:
      'How far a scenario supports Indigenous science and traditional ecological knowledge (TEK).',
    computed: '[How the team judges this: forthcoming.]',
    considered: 'Privacy, unrestricted access, site access, and Tribal stewardship groups.',
    scored:
      'Qualitative, in steps rather than a −5 to +5 score: each arrow is one step of gain over Business as Usual. The conditions beneath are checked where a scenario puts them in place. [Confirm the steps and conditions with the team.]',
  },
  'bk-ec-sovereignty': {
    measures: 'How far a scenario supports Tribal sovereignty.',
    computed: '[How the team judges this: forthcoming.]',
    considered:
      'Data sovereignty, education, food sovereignty, and water rights / Tribal beneficial uses.',
    scored:
      'Qualitative, in steps rather than a −5 to +5 score: each arrow is one step of gain over Business as Usual. The conditions beneath are checked where a scenario puts them in place. [Confirm the steps and conditions with the team.]',
  },
}

/**
 * Behind the info button beside TIME PERIOD: why each criterion reads the periods it
 * does, and the months behind each period's tab, by the period's key (a team's own
 * months win). A team with no reason written shows UI.periodsWhy.
 */
export const PERIOD_WHY: Partial<Record<TeamKey, string>> = {
  // recreation: '',
}
export const PERIOD_MONTHS: Record<string, string> = {
  run: 'Oct 2018 – Dec 2020',
  wet: 'Oct – Mar, each year',
  dry: 'Apr – Sep, each year',
  '2019': 'Oct 2018 – Sep 2019',
  '2020': 'Oct 2019 – Sep 2020',
  both: 'Oct 2018 – Sep 2020',
}
export const TEAM_PERIOD_MONTHS: Partial<Record<TeamKey, Record<string, string>>> = {
  ecology: {
    '2019': 'Feb 1 – Jun 1, 2019',
    '2020': 'Feb 1 – Jun 1, 2020',
    both: 'Feb 1 – Jun 1 of both years',
  },
}

/** Why each criterion divides the Delta as it does, above its map. */
export const PLACE_WHY: Partial<Record<TeamKey, string>> = {
  // recreation: '',
}

/**
 * A team's takeaway for one scenario, shown when one of its score cells is clicked.
 * A scenario with none shows UI.takeawayForthcoming.
 */
export const SCENARIO_TAKEAWAYS: Partial<Record<TeamKey, Partial<Record<ScenarioKey, string>>>> = {
  // recreation: { em: '' },
}
