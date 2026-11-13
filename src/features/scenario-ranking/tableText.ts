// The general words of the ranking table (By criterion, and the /pages/breakout
// kiosk): scenario and place names, headings, buttons, the legend, and the words for
// empty cells. A criterion's own words (takeaways, caveats, info cards, a scenario's
// takeaway) live in its file in ../data/.
//
//   SCENARIO_GROUPS   the headings over the two groups of scenario columns
//   PLACE_TRAYS       which place tabs sit together after "All together"
//   UI                headings, buttons, legend, notes, and the words for empty cells
//   PERIOD_MONTHS     the months behind each period, in the TIME PERIOD info card
//
// Team and scenario names are shared with the whole site: src/content/names.ts. Where
// this table words a scenario its own way, that is a `rankingTable` variant there.
//
// A species name ending ", juvenile" or ", adult" is shown as the species with a
// life-stage chip, and the map groups the stages under one tab. Keep that ending in
// the data files to keep the chip.
import { teamText } from './data/index'
import { scenarioName as siteScenarioName } from '@/content/names'
import type { ScenarioKey } from './model/criteria'
import type { TeamKey } from './model/teams'

/** A scenario's name wherever this table shows it. */
export const scenarioName = (key: ScenarioKey) => siteScenarioName(key, 'rankingTable')

/** The headings over the scenario columns' two groups, and over their chips. */
export const SCENARIO_GROUPS = {
  landscape: 'Changes to landscape',
  waterFlow: 'Changes to water flow',
}

export const placeName = (label: string, team: TeamKey) =>
  teamText(team).placeNames?.[label] ?? label

/**
 * The place tabs after "All together", in groups set apart. One place is picked
 * across all groups. Places are listed by their name in the data; a team shows only
 * the ones it has, and a group it has none of is left out. Places listed nowhere
 * here (Environmental Justice's vulnerability classes) share one group. The heading
 * is read out to screen readers, not shown.
 */
export const PLACE_TRAYS: { heading: string; places: string[] }[] = [
  { heading: 'Bay area', places: ['Central Bay', 'South Bay', 'San Pablo Bay'] },
  {
    heading: 'Delta',
    places: [
      'North Delta',
      'Suisun Marsh',
      'Confluence',
      'Central Delta',
      'South Delta',
      'West Delta',
    ],
  },
]

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
  caveatsHeading: 'Caveats and Clarifications',
  openingPlaceholder: 'The criterion takeaway: forthcoming.',
  learnMoreCriterion: 'Learn more about this criterion',
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
  levelScoresHeading: 'New Green Watershed, by restoration level',
  scenarioScoresHeading: 'Where the scenarios land',
  sameAtAllLevels: 'Same at all three levels',
  timePeriods: 'TIME PERIOD',
  metrics: 'METRICS',
  /** A team's own row, "Ecology score", and the line beneath it. */
  teamScore: (team: string) => `${team} score`,
  criterionScore: 'Criterion score',
  criterionScoreHint: 'Click the score to see criterion takeaway',

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
  restorationSplit: 'Managed wetlands and wet-soil agriculture',
  restorationSplitTag: '50/50 split',
  notRun: 'not run',
  /** A row that is one version of New Green Watershed, under the other scenarios. */
  versionOnly: 'NGW only',
  /** A scenario the subteam marks N/A for this row. */
  notApplicable: 'N/A',
  notScored: 'Forthcoming',
  notRunWithSlr: 'not run with SLR',
  noSlrResult: 'no SLR result',
  bothYearsOnly: 'both years only',
  mapYearPicker: 'Year',
  /** A row scored per entity: "per species", "per activity". */
  perEntity: (noun: string) => `per ${noun}`,
  /** A metric the team describes in words and never scores. */
  qualitative: 'Qualitative · described in the team’s report, not scored',
  /** The tag beside a qualitative row's name, and what its cells say. */
  qualitativeTag: 'Qualitative',
  preliminaryTag: 'Preliminary',
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
  /** Above the map view's region table. */
  mapPickRegion: 'Pick an area below to outline it on every map.',
  mapPickedRegion: (region: string) =>
    `${region} is outlined on every map. Pick it again to clear.`,
  lifeStagePicker: 'Life stage',

  // The info cards (explainers) and the cell cards (lookups).
  aboutScore: (score: string) => `How ${score} is built`,
  metricsUsed: (n: number) => `${n} metrics used`,
  howCombine: 'How they combine',
  notInScore: 'Not in this score',
  measures: 'What it measures',
  computed: 'How it is computed',
  howScored: 'How it is scored',
  whyPeriods: 'Why these periods',
  monthRanges: 'Month ranges',
  whyRegions: 'Why these regions',
  readByPlace: 'Metrics read by place',
  score: 'Score',
  difference: 'Difference',
  takeaway: 'Criterion takeaway',
  takeawayForthcoming: 'The criterion takeaway for this scenario: forthcoming.',
  /** Under the scenario's name in a score's card, so a 0 reads as a comparison. */
  scoredAgainst: (baseline: string) => `Scored −5 to +5, with ${baseline} at 0`,
  currentConditions: 'Current conditions',
  businessAsUsual: 'Business as Usual',
  /** The chip beside Business as Usual when it is another model's run, by baseline key. */
  baselineRun: { csbau: 'CalSim', hist: 'SCHISM' } as Record<string, string>,
} as const

const ECONOMY_ZONE_NAMES: Record<string, string> = {
  north: 'the North Delta',
  central: 'the Central Delta',
  south: 'the South Delta',
  west: 'the West Delta',
}

const ECONOMY_SALINITY_ROWS = new Set([
  'bk-econ-revenue-salinity',
  'bk-econ-jobs-salinity',
  'bk-econ-value-salinity',
])

/** A row whose name follows the picked place: Economy's salinity rows. */
export const placedMeasureLabel = (id: string, place: string) =>
  ECONOMY_SALINITY_ROWS.has(id) && ECONOMY_ZONE_NAMES[place]
    ? `Salinity effects in ${ECONOMY_ZONE_NAMES[place]}`
    : undefined

export const PERIOD_MONTHS: Record<string, string> = {
  run: 'Oct 2018 – Dec 2020',
  wet: 'Oct – Mar, each year',
  dry: 'Apr – Sep, each year',
  '2019': 'Oct 2018 – Sep 2019',
  '2020': 'Oct 2019 – Sep 2020',
  both: 'Oct 2018 – Sep 2020',
}
