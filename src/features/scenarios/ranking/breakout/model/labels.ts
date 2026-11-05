// Every word the breakout table shows (By criterion, and the /pages/breakout kiosk),
// in one place to edit. Sections, in order:
//
//   TEAM_TAKEAWAYS    the points under "Criterion takeaway", one list per criterion
//   TEAM_CAVEATS      the "Caveats and Clarifications" notes beside the takeaway
//   SCENARIO_LABELS   a scenario's name in the table heads, chips and sentence
//   SCENARIO_GROUPS   the headings over the two groups of scenario columns
//   PLACE_LABELS      a place's name on its tab and in the sentence
//   PLACE_TRAYS       which place tabs sit together after "All together"
//   MEASURE_LABELS    the score and measure row names
//   UI                headings, buttons, legend, notes, and the words for empty cells
//   CRITERION_DEFINITIONS  a criterion score's info card: its metrics and how they combine
//   METRIC_DEFINITIONS     a metric's info card: criterion takeaway, what, how computed, how scored
//   PERIOD_WHY, PERIOD_MONTHS, TEAM_PERIOD_MONTHS  the TIME PERIOD info card
//   PLACE_WHY              the PLACE info card, above the map
//   SCENARIO_TAKEAWAYS     a team's takeaway in a score cell's card
//   NGW_LEVEL_TAKEAWAYS    the same, for each of New Green Watershed's restoration levels
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
 * Each criterion's takeaway, as points set apart under UI.takeaway. Text between
 * ** ** is drawn in the team's colour. Leave a team out and the page shows
 * UI.openingPlaceholder instead.
 */
export const TEAM_TAKEAWAYS: Partial<Record<TeamKey, string[]>> = {
  ecology: [
    'Estuarine subregions, particularly those in the middle of the estuary (the Confluence, Suisun Marsh, and San Pablo Bay regions) — **saw the most variation in species fundamental niche.** The Delta remained consistently fresh across adaptation and tiered outflow scenarios, and the Bay consistently salty.',
    'In general, the adaptation scenarios have a far more minimal impact on the functional niche of specific species of interest than water year type and region.',
    'In terms of suitability for less desirable species, **some tradeoffs were apparent across scenarios.** Decreases in nuisance freshwater species consistently coincided with increases in overbite clam suitability, and vice versa.',
    'The most impactful way an adaptation scenario, like the ones presented in this exercise, can influence a system likely lies in **landscape-level conversion and habitat creation.**',
  ],
  recreation: [
    'Our main "recreation" score floats around zero, showing that, at a grand scale, no perceived changes would sway Delta recreation to happen less or more under salinity and temperature changes. However, because the score averages regional and seasonal differences, it acts as a muffling step.',
    'In reality, scores and metrics interact with each other and with regional thresholds, showing that **potential recreation displacement from one region to another** could happen based on days above our selected thresholds, which in turn would affect the mosaic of recreational access at different times for Delta regions.',
  ],
  environmentalJustice: [
    '++Increased Delta Outflow++ changed the amount of exceedance of acceptable drinking water salinity thresholds more than adaptation scenarios. **An increase in volume of water within the Delta has the most positive effect on this criterion.**',
    'In terms of water age and water temperature, **Franks Tract and Suisun Marsh experience the highest increase in water age,** which is heavily attributed to the wetland restoration in these areas in ++Eco Machine++ and ++New Green Watershed++.',
    'Lastly, **flood risk benefits are highest in scenarios that affect the entire Delta,** rather than interventions in segmented regions; upland restoration in ++New Green Watershed++ provides the largest flood risk benefit across scenarios.',
  ],
  economy: [
    'The Economy score measures how each scenario changes the Delta’s farm economy: annual farm sales (gross revenue), farm-supported jobs, and value added (wages, business income and taxes). Scenarios can affect farming in two ways: **by changing the salinity of irrigation water,** which lowers crop yields, and **by converting farmland to wetland or rice.** Farm revenue is reported as direct on-farm sales; jobs and value added are reported as totals, which include spending in the regional economy (IMPLAN multipliers).',
    'Salinity changes in every scenario are very small compared with the Delta’s $1.1 billion farm economy; **converting farmland to wetland is what moves the score.** The score counts costs to the farm economy only. It does not count carbon-credit income or other benefits of restoration, such as subsidence reversal, lower flood risk, better water quality, habitat and recreation.',
  ],
  ecoCultural: [
    'At the beginning, the team set out to **spotlight historically underrepresented or intentionally excluded communities and people.** The research team intentionally set out to invite people and groups who have typically not been as involved in Delta decision-making processes. This included reviewing public comments and meeting attendees from previous Delta decision-making processes, such as the 2019 WaterFix Hearing and the 2023 Temporary Urgency Change Petitions. Additionally, the team held **specific meetings with Indigenous communities and nations** to build trust and create a more welcoming listening environment.',
    'In a round of semi-structured interviews, the Just Transitions in the Delta team specifically invited members of Indigenous communities to participate to ensure **Indigenous perspectives and Traditional Ecological Knowledge (TEK)** were incorporated into the research from the beginning. The team used interview findings to inform preliminary scenario narratives.',
  ],
}

/**
 * A metric's takeaway as its info card lays it out: a lead sentence, the sentences that
 * follow, and any list those introduce. Text between ** ** is drawn in the team's colour.
 */
export interface MetricTakeaway {
  lead: string
  details?: string[]
  rows?: [string, string][]
}

/** A takeaway as one run of text, for the notes that quote it whole. */
const takeawayText = ({ lead, details = [] }: MetricTakeaway) =>
  [lead, ...details].join(' ').replace(/\*\*/g, '')

// Environmental Justice's metric takeaways: its caveats, and each metric's info card.
const EJ_DRINKING_TAKEAWAY: MetricTakeaway = {
  lead: '++Increased Delta Outflow++, by far, **reduces drinking water salinity threshold exceedances the most.**',
  details: [
    'Across adaptation scenarios, ++Eco Machine++ and ++New Green Watershed++ perform the best, and decrease threshold exceedances overall.',
  ],
}
const EJ_FLOOD_TAKEAWAY: MetricTakeaway = {
  lead: 'Scenarios that produce **Delta-wide effects,** rather than localized benefits, performed the best for this metric.',
  details: [
    '++New Green Watershed++ was the leading scenario, attributed to the flood risk benefits associated with upland restoration.',
    '++Bolster & Fortify++ performed second-best; while fortification of levees definitely reduces flood risk, these benefits are only observed along the freshwater corridor pathway, not the entire Delta.',
    'Lastly, ++A Tunnel++ was expected to slightly decrease flood risk, on the assumption that the two northern intakes would intercept water in high storm events prior to inundation into the Delta.',
    '++Eco Machine++ and ++Calling on Reserves++ did not deviate from baseline.',
  ],
}
const EJ_WATER_AGE_TAKEAWAY: MetricTakeaway = {
  lead: 'An increase in water age itself is not inherently negative, nor does it mean harmful algal blooms will definitely form, but it does indicate suitable conditions for their formation.',
  details: [
    "Both ++New Green Watershed++ and ++Eco Machine++ increased water age the most, in the regions in which restoration was incorporated."
  ],
}

/**
 * What to keep in mind across a whole criterion, shown under UI.caveatsHeading beside
 * its takeaway. One string per note; a criterion with none shows no box. A note
 * written "Keyword: the rest" opens from its keyword; any other shows whole.
 */
export const TEAM_CAVEATS: Partial<Record<TeamKey, string[]>> = {
  ecology: [
    'Regional Maps: In our regional maps, we included three regions within the greater Bay **(the North Bay, Central Bay, and South Bay)**, despite the adaptation scenarios not being particularly impactful in these regions **(they maintain stable temperatures and salinities).**\n\nThe incorporation of bay regions was to demonstrate that for many euryhaline species, alterations in salinities do not necessarily mean that those species decrease from the system as whole, and rather they move throughout the system, including into the San Pablo Bay and West.',
    'Species of Interest Selection: We received many responses, and specific species, from stakeholders, during our June 2025 workshop. We could not incorporate many of the species of interest for our analysis because many would have required data that was out of the scope of this project.',
    'Data Limitations for Adaptation Scenarios: We chose to approach this from the perspective of functional abiotic niches, specifically where conditions meet the minimum requirements for a species not to experience physiological stress. When a species does experience physiological stress it will likely move until it either perishes, or finds an area that does meet its physiological needs. The data we are working with are **daily maximum temperatures and salinities during the spring pulse flows and key spawning periods** for our focal species of interest. Despite having acreage data regarding additional tidal wetland habitat per different adaptation scenarios, the details regarding this new wetland habitat were beyond the scope of this project.',
    'Residence Time in Food Web Models: Our food web modeling takes the most conservative but informative approach that we could design. The modeling outputs do include residence time (measured by change from baseline run water ages), but those results were difficult to interpret in a quantitative way to incorporate into our general food webs model. Specifically, matching up residence time variations spatially with a generalized food web model involved too many assumptions to be incorporated in the final version of our model.',
    'Upstream restoration: Our evaluation metrics are primarily based on **conditions within the Delta proper, and its downstream waterways.** However, the ++New Green Watershed++ scenario incorporates restoration throughout the entire watershed, including montane meadows, floodplains, and forests in the Sierra. These upstream alterations would likely increase the flows entering the estuary, and might also extend new habitat to anadromous and migratory species of concern, like salmon. Our models were not able to incorporate these hydrological or land-related effects. Collaborators have assessed the general benefits of expanding upstream habitat, but their evaluations are not reliant on hydrological model outputs.',
  ],
  recreation: [
    'Component scores: Salinity stress and Temperature stress score 0 for every adaptation scenario. Increased Delta outflow scores +1 for Salinity stress and 0 for Temperature stress. Habitat Restoration and Recreation Economy score +3 for ++Eco Machine++, +5 for ++New Green Watershed++, and 0 otherwise.',
    'Infrastructure impacts: Infrastructure impacts affect only ++Bolster & Fortify++ and ++A Tunnel++ because of their anticipated future changes, expanding on the caveat scores’ reasoning for Habitat Restoration based on infrastructural changes. Their scores, ++Bolster & Fortify++ (-1) and ++A Tunnel++ (-3), imply that for ++Bolster & Fortify++, the building of salinity gates surrounding Franks Tract would be detrimental to boaters, blocking access to waterways during dry periods to prevent salinity encroachment, while ++A Tunnel++ would impact recreation economies throughout Delta towns that depend on recreation and tourism and would also make certain areas inaccessible for extended periods of time.',
    'Restored acres: Restored acres for ++Eco Machine++ and ++New Green Watershed++ are positive (+) changes relative to ++Business as Usual++’s existing protected areas (current inventory, accessible and non-accessible: 108,301 acres). ++Eco Machine++’s +43,100 acres would bring the total to 151,401 acres; ++New Green Watershed++’s +458,948 acres, without upland restoration, to about 567,249 acres.',
    'Sea level rise columns: The sea level rise columns reuse current-conditions acres and dollars, so restoration and economy weren’t re-modeled for sea level rise.',
  ],
  environmentalJustice: [
    `Salinity impacts to in-Delta drinking water: ${takeawayText(EJ_DRINKING_TAKEAWAY)}`,
    `Flood risk attenuation: ${takeawayText(EJ_FLOOD_TAKEAWAY)}`,
    `Water age + temperature: ${takeawayText(EJ_WATER_AGE_TAKEAWAY)}`,
  ],
  economy: [
    'Carbon-offset revenue is reported but not counted in the score: it is not farm revenue, it has no IMPLAN estimate, and its price is uncertain ($15 per metric ton of CO2 in these results). If it were counted, one score would change: ++New Green Watershed++’s 50% wetland revenue would move from −4 to −3.',
    'The Economy scores for ++Eco Machine++ and ++New Green Watershed++ measure changes in farm revenue, jobs and value added. They do not include the other benefits of restoration (subsidence reversal, lower flood risk and levee costs, water-supply and water-quality gains from Franks Tract, habitat, and recreation), so these scores show the cost side of the two scenarios, not their net economic effect.',
  ],
  ecoCultural: [
    'Although all four metrics are equally important and interdependent on one another to meet this criterion, only the ecosystem restoration metric can be spatially and quantitatively evaluated across the scenarios. The other three metrics are envisioned and assumed in ++Eco Machine++ and ++New Green Watershed++ scenarios (the two scenarios that restore land and habitats) but cannot be prescribed within the scope of this project (e.g., assigning specific areas for land-back initiatives, or determining where access may be most desired and granted on private land). Thus, the evaluation for Tribal land access, Tribal Sovereignty and Application of Indigenous Science and Traditional Ecological Knowledge are expressed qualitatively, **where the scenarios offer the increased potential to achieve these metrics.**',
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

export const MEASURE_LABELS: Record<string, string> = {
  // Ecology
  'bk-ecology': 'Ecology',
  'bk-eco-habitat': 'Habitat availability',
  'bk-eco-habitat-acres': 'Tidal wetlands',
  'bk-eco-foodweb': 'Food webs',
  'bk-eco-foodweb-managed': 'Managed wetland',
  'bk-eco-foodweb-tidal': 'Tidal wetlands',
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
  'bk-rec-salinity': 'Salinity stress',
  'bk-rec-salinity-dayUse': 'Day use',
  'bk-rec-salinity-boating': 'Boating',
  'bk-rec-salinity-birding': 'Birding',
  'bk-rec-salinity-waterfowl': 'Waterfowl hunting',
  'bk-rec-salinity-angling': 'Angling',
  'bk-rec-temperature': 'Temperature stress',
  'bk-rec-temperature-dayUse': 'Day use',
  'bk-rec-temperature-boating': 'Boating',
  'bk-rec-temperature-birding': 'Birding',
  'bk-rec-temperature-waterfowl': 'Waterfowl hunting',
  'bk-rec-temperature-angling': 'Angling',
  'bk-rec-temperature-dayUseCold': 'Cold-water day use',
  'bk-rec-restoration': 'Habitat Restoration',
  'bk-rec-restoration-acres': 'Restored acres',
  'bk-rec-economy': 'Recreation economy',
  'bk-rec-infrastructure': 'Infrastructure impact',

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
  'bk-econ-revenue-carbon': 'Carbon-offset revenue',
  'bk-econ-jobs': 'Agriculture-supported Jobs',
  'bk-econ-jobs-salinity': 'Salinity effects across the Delta',
  'bk-econ-jobs-land': 'Change from converting farmland to wetland',
  'bk-econ-value': 'Economic value added',
  'bk-econ-value-salinity': 'Salinity effects across the Delta',
  'bk-econ-value-land': 'Change from converting farmland to wetland',

  // Eco-cultural
  'bk-ecoCultural': 'Eco-cultural',
  'bk-ec-restoration': 'Ecosystem Restoration',
  'bk-ec-restoration-managed': 'Managed wetlands',
  'bk-ec-restoration-rice': 'Wet-soil agriculture',
  'bk-ec-restoration-tidal': 'Tidal wetlands',
  'bk-ec-restoration-uplandWetland': 'Forests',
  'bk-ec-restoration-meadow': 'Meadows',
  'bk-ec-restoration-floodplain': 'Floodplains',
  'bk-ec-restoration-functional-flow': 'Potential for functional flow',
  'bk-ec-access': 'Increased Land Access',
  'bk-ec-tek':
    'Implementation and Application of Indigenous Science & Traditional Ecological Knowledge (TEK)',
  'bk-ec-sovereignty': 'Recognition and Application of Tribal Sovereignty',
  // Eco-cultural's conditions, under each described metric (strongest access first)
  'bk-ec-access-ownership': 'Tribal ownership',
  'bk-ec-access-landTrust': 'Land trust partnership',
  'bk-ec-access-conservationEasement': 'Conservation easement',
  'bk-ec-access-culturalEasement': 'Cultural conservation easement',
  'bk-ec-access-mou': 'Memorandum of Understanding (MOU) and Memorandum of Agreement (MOA)',
  'bk-ec-tek-privacy': 'Privacy',
  'bk-ec-tek-unrestrictedAccess': 'Unrestricted access',
  'bk-ec-tek-siteAccess': 'Site selection',
  'bk-ec-tek-stewardshipGroups': 'Tribal stewardship group collaboration',
  'bk-ec-sovereignty-dataSovereignty': 'Data Sovereignty',
  'bk-ec-sovereignty-education': 'Education',
  'bk-ec-sovereignty-foodSovereignty': 'Food Sovereignty',
  'bk-ec-sovereignty-waterRights': 'Water Rights',

  // Qualitative rows under a scored metric
  'bk-ej-flood-judgement': 'Flood risk descriptive change from Business as Usual',
  'bk-rec-infrastructure-descriptive': 'Descriptive change from Business as Usual',
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

/** Economy's score rule (v20 Scores sheet), the same for all three metrics. */
const ECONOMY_RULE =
  'Each scenario’s net percentage change from Business as Usual determines its score: under 1% is 0; 1–5% is ±1, 5–15% is ±2, 15–25% is ±3, 25–35% is ±4, and 35% or more is ±5.'
/** The same rule drawn: each score's band, narrowest at 0. The label reads it aloud. */
const ECONOMY_SCALE = {
  axis: 'Net percent change from Business as Usual. Under 1% scores 0; 1–5% is ±1, 5–15% ±2, 15–25% ±3, 25–35% ±4, and 35% or more ±5.',
  bands: ['35+', '25–35', '15–25', '5–15', '1–5', '<1', '1–5', '5–15', '15–25', '25–35', '35+'],
  ends: ['% lower than Business as Usual', '% higher'],
}
/** New Green Watershed's change and score at 25%, 50% and 100% wetland. */
const ngwLevelRows = (...levels: [string, number][]) => ({
  heading: UI.levelScoresHeading,
  rows: levels.map(([amount, score], index): [string, string, number] => [
    UI.ngwLevels[index],
    amount,
    score,
  ]),
})
/**
 * What a criterion score is made of, behind the info button on the team's own row:
 * the metrics it combines and how. Text between ** ** is drawn in the team's colour.
 */
export const CRITERION_DEFINITIONS: Record<
  TeamKey,
  { metrics: string[]; combine: string; outside?: string }
> = {
  ecology: {
    metrics: ['Habitat availability', 'Food webs', 'Species suitability'],
    combine: 'The **unweighted mean** of the three, rounded to a whole point.',
  },
  recreation: {
    metrics: [
      'Salinity stress',
      'Temperature stress',
      'Habitat Restoration ×2',
      'Recreation Economy',
      'Infrastructure Impact',
    ],
    combine:
      'The mean of the five listed metrics, with **Habitat Restoration counted twice**, rounded to a whole point. The same rule applies with sea level rise.',
  },
  environmentalJustice: {
    metrics: [
      'Salinity impacts to in-Delta drinking water x2',
      'Flood risk attenuation',
      'Water age + temperature',
    ],
    combine:
      'The mean of the three listed metrics, with **Drinking Water counted twice**, rounded to a whole point. The same rule applies with sea level rise.',
  },
  economy: {
    metrics: [
      'Annual gross agricultural revenues',
      'Agriculture-supported jobs',
      'Economic value added',
    ],
    combine:
      'Their **unweighted mean, rounded to a whole point**: −4 at 50% wetland (−3 at 25%, −5 at 100%). The same with 2 ft of sea level rise.',
  },
  ecoCultural: {
    metrics: [
      'Ecosystem Restoration',
      'Increased Land Access',
      'Implementation and Application of Indigenous Science & Traditional Ecological Knowledge (TEK)',
      'Recognition and Application of Tribal Sovereignty',
    ],
    combine:
      'One overall score informed by restoration acres, flow and qualitative judgement.',
  },
}

/**
 * What a metric is, behind the info button on its row: what it measures, how it is
 * computed, and how it is scored. Each text section can be omitted. `scale` draws the −5…+5 scale for a score set one
 * point per `step` against Business as Usual (`lowerBetter`: more of it scores lower).
 * `takeaway` is the criterion's own summary of the metric, shown first; where it already says
 * what the metric measures (Ecology), `measures` is left out.
 */
export const METRIC_DEFINITIONS: Record<
  string,
  {
    measures?: string
    computed?: string
    scored?: string
    scale?: {
      step?: string
      axis: string
      lowerBetter?: boolean
      bands?: string[]
      ends?: string[]
      scores?: number[]
    }
    /** Where results land on the scale: [name, the amount that earns it, its score]. */
    scoreRows?: { heading: string; rows: [string, string, number][] }
    takeaway?: MetricTakeaway
  }
> = {
  // Ecology
  'bk-eco-habitat': {
    takeaway: {
      lead: 'The increase in **accessible aquatic habitat**, within the Delta, against ++Business as Usual++.',
    },
    computed: 'Acres of added tidal wetland within the Delta against Business as Usual.',
    scale: {
      axis: 'Acres added against Business as Usual. About 16,000 acres scores +1, rising to +5 at about 80,000 acres.',
      scores: [0, 1, 2, 3, 4, 5],
      bands: ['0', '16k', '32k', '48k', '64k', '80k+'],
      ends: ['Acres added against Business as Usual'],
    },
    scoreRows: {
      heading: UI.scenarioScoresHeading,
      rows: [
        ['Eco Machine', '43,100 acres', 3],
        ['New Green Watershed', '67,000 acres', 4],
      ],
    },
    scored: '+1 for every 16,000 acres added against Business as Usual, up to +5.',
  },
  'bk-eco-foodweb': {
    takeaway: {
      lead: 'The increase in **productive habitats** (tidal wetlands, managed wetlands, wet-soil agriculture) that have the capacity to contribute to food webs, relative to ++Business as Usual++.',
    },
    computed: 'managed wetland × 0.2 + tidal wetland × 0.4 + wet-soil agriculture × 0.1.',
    scale: {
      axis: 'Food web index points against Business as Usual. About 16,148 points scores +1, rising to +5 at about 80,740 points.',
      scores: [0, 1, 2, 3, 4, 5],
      bands: ['0', '16.1k', '32.3k', '48.4k', '64.6k', '80.7k+'],
      ends: ['Index points against Business as Usual'],
    },
    scoreRows: {
      heading: UI.scenarioScoresHeading,
      rows: [
        ['Eco Machine', '17,240 points', 1],
        ['New Green Watershed', '61,980 points', 3],
      ],
    },
    scored: '+1 for about every 16,148 points against Business as Usual, up to +5.',
  },
  'bk-eco-species': {
    takeaway: {
      lead: 'The proportion of time and/or length of consecutive days that conditions remain **within a species’ fundamental tolerance limits** for water temperature and salinity.',
      details: [
        'This does not necessarily mean species are more abundant at the given location, only that **water quality conditions are favorable for their survival**.',
      ],
    },
    computed: 'Each species’ proportion of days inside its salinity and temperature range.',
    scored:
      'Each 1-percentage-point change in suitable days from Business as Usual changes the species score by 1, capped at ±5; increases score positively for desired species and negatively for invasive species.',
    scale: { step: '%', axis: 'Days in range vs Business as Usual' },
  },

  // Recreation
  'bk-rec-salinity': {
    takeaway: {
      lead: 'Salinity generally affects recreation most **in the western regions (Suisun, Central Delta),** especially during the winter seasons, for four out of five activities. Angling thresholds are crossed more in summer under ++Business as Usual++ and shift to more salinity days in winter under sea-level-rise scenarios.',
    },
    measures: 'How often the water is too salty for each activity.',
    computed:
      'Each activity’s share of days over its salinity threshold, at 32 points in 4 regions.',
    scored:
      'Each 1-percentage-point decrease in days over the threshold from Business as Usual changes the score by +1; each 1-percentage-point increase changes it by −1, capped at ±5.',
    scale: { step: '%', axis: 'Days under stress vs Business as Usual', lowerBetter: true },
  },
  'bk-rec-temperature': {
    takeaway: {
      lead: '**Overall temperature differences are minimal across scenarios.**',
      details: [
        'The South Delta is the hottest for waterfowl (with about 41 to 44% threshold days crossed in summer compared to 10% in Suisun), while cold-water days that hinder Day Use are present nearly the whole winter season in the North Delta.',
      ],
    },
    measures:
      'How often the water is too warm (or, for cold-water use, too cold) for each activity.',
    computed:
      'Each activity’s share of days past its temperature threshold, at 32 points in 4 regions.',
    scored:
      'Each 1-percentage-point decrease in days past the threshold from Business as Usual changes the score by +1; each 1-percentage-point increase changes it by −1, capped at ±5.',
    scale: { step: '%', axis: 'Days under stress vs Business as Usual', lowerBetter: true },
  },
  'bk-rec-restoration': {
    takeaway: {
      lead: 'Habitat restoration would create **net acreage benefits** for currently available Delta land inventories.',
      details: [
        'Increasing current protected area acres (108,301 acres) under ++Eco Machine++ (+43,100 acres) at Suisun and Franks Tract, and ++New Green Watershed++ (+458,948 acres) Delta-wide through transitional, managed wetlands and tidal areas.',
      ],
    },
    measures: 'How much land a scenario restores for recreation.',
    scored:
      'The Recreation criterion assigns a score from restored acres on the −5 to +5 scale. This component is counted twice in the overall Recreation score.',
  },
  'bk-rec-economy': {
    takeaway: {
      lead: 'The recreation economy is measured by **a conservative valuation of ecosystem services in dollars per acre per year,** encompassing the five activities.',
      details: [
        'In short, we calculate four ecosystem service scenarios for restored acres from the Ecology criterion (separate from the Habitat Restoration Metric), assigning monetary values to the following measures:',
      ],
      rows: [
        ['Recreational fishing', 'Angling'],
        ['Amenity', 'Day Use and Boating combined'],
        ['Biodiversity', 'Birding'],
        ['Recreational Hunting', 'Waterfowl Hunting'],
      ],
    },
    measures: 'The yearly value of recreation on restored land.',
    computed:
      'The value of four recreation services on restored land, with day use and boating sharing the amenity values, added on top of Business as Usual’s existing protected land.',
    scored:
      'Each 1% increase in annual value from Business as Usual changes the score by +1; each 1% decrease changes it by −1, capped at ±5.',
    scale: { step: '%', axis: 'Value vs Business as Usual' },
  },

  'bk-rec-infrastructure': {
    measures: 'How a scenario’s built changes would affect recreation.',
    computed: 'A qualitative judgement for the Recreation criterion.',
    scored:
      'The Recreation criterion translates this qualitative judgement into the −5 to +5 scale.',
  },

  // Environmental justice
  'bk-ej-drinking': {
    takeaway: EJ_DRINKING_TAKEAWAY,
    measures: 'How often in-Delta drinking water is too salty.',
    computed:
      'The share of salinity readings at or above 1,050 µS/cm at in-Delta drinking-water points, over the whole run.',
    scored:
      'Each 1-percentage-point decrease in readings over the threshold from Business as Usual changes the score by +1; each 1-percentage-point increase changes it by −1, capped at ±5 for each place.',
    scale: { step: '%', axis: 'Readings over the line vs Business as Usual', lowerBetter: true },
  },
  'bk-ej-flood': {
    takeaway: EJ_FLOOD_TAKEAWAY,
    measures: 'Flood risk across the Delta.',
    computed: 'A Delta-wide qualitative judgement for the Environmental Justice criterion.',
    scored:
      'The Environmental Justice criterion sets the result on the −5 to +5 scale.',
  },
  'bk-ej-waterage': {
    takeaway: EJ_WATER_AGE_TAKEAWAY,
    measures: 'How long water sits in the Delta, and how warm it gets.',
    computed:
      'The change in average water age, in days, against Business as Usual, with water temperature.',
    scored:
      '',
  },

  // Economy
  'bk-econ-revenue': {
    takeaway: {
      lead: 'Gross revenue is the value of crops sold from Delta farmland, **about $1.1 billion per year.**',
      details: [
        'Salinity changes it by less than $100,000 per year in every scenario, even with sea level rise. Only ++New Green Watershed++ changes it substantially (19% to 46% lower), because land leaves farming.',
        'Readers should keep in mind that gross revenue is sales, not profit: farmers’ net income falls by less than this.',
      ],
    },
    measures: 'Farm gross revenue in the Delta.',
    computed: 'Direct gross revenue against Business as Usual ($1.105B a year).',
    scale: ECONOMY_SCALE,
    scoreRows: ngwLevelRows(['−19.1%', -3], ['−25.5%', -4], ['−45.5%', -5]),
    scored: ECONOMY_RULE,
  },
  'bk-econ-jobs': {
    takeaway: {
      lead: 'Jobs include farm work and jobs in businesses that serve farms and farm households (**about 11,700 in total,** including multiplier effects).',
      details: [
        'Through salinity, no scenario differs from ++Business as Usual++ by more than about half a job. ++New Green Watershed++ reduces total jobs by about 3,700 to 5,000 (31% to 43%), so its job scores (−4, −4, −5) are as low as or lower than its revenue scores.',
        'Job losses are proportionally larger than revenue losses when land switches to rice, because rice needs fewer workers per dollar of revenue.',
      ],
    },
    measures: 'Farm jobs in the Delta.',
    computed: 'Total jobs against Business as Usual (7,526 direct, 11,679 total).',
    scale: ECONOMY_SCALE,
    scoreRows: ngwLevelRows(['−31.3%', -4], ['−34.2%', -4], ['−42.8%', -5]),
    scored: ECONOMY_RULE,
  },
  'bk-econ-value': {
    takeaway: {
      lead: 'Value added is the income that Delta farming generates in the regional economy: wages, business income and taxes, **about $1 billion per year in total.**',
      details: [
        'It follows the same pattern as revenue: negligible change from salinity, and a 16% to 46% reduction under ++New Green Watershed++.',
        'Construction spending and carbon-credit income are not included in value added.',
      ],
    },
    measures: 'Value added: wages, business income and taxes from Delta farming.',
    computed: 'Total value added against Business as Usual ($670M direct, $997M total a year).',
    scale: ECONOMY_SCALE,
    scoreRows: ngwLevelRows(['−16.1%', -3], ['−23.2%', -3], ['−45.8%', -5]),
    scored: ECONOMY_RULE,
  },

  // Eco-cultural
  'bk-ec-restoration': {
    measures: 'How much land a scenario restores.',
    computed: '',
    scored:
      'The Eco-cultural criterion sets the result on the −5 to +5 scale.',
  },
  'bk-ec-access': {
    measures: 'How far a scenario secures Tribal access to land.',
    computed: '',
    scored:
      'Qualitative, in steps rather than a −5 to +5 score: each arrow is one step of gain over Business as Usual.',
  },
  'bk-ec-tek': {
    measures:
      'How far a scenario supports Indigenous science and traditional ecological knowledge (TEK).',
    computed: '',
    scored:
      'Qualitative, in steps rather than a −5 to +5 score: each arrow is one step of gain over Business as Usual.',
  },
  'bk-ec-sovereignty': {
    measures: 'How far a scenario supports Tribal sovereignty.',
    computed: '',
    scored:
      'Qualitative, in steps rather than a −5 to +5 score: each arrow is one step of gain over Business as Usual.',
  },
}

/**
 * Behind the info button beside TIME PERIOD: why each criterion reads the periods it
 * does, and the months behind each period's tab, by the period's key (a team's own
 * months win). A team with no reason written shows UI.periodsWhy.
 */
export const PERIOD_WHY: Partial<Record<TeamKey, string>> = {
  ecology:
    'For species fundamental niches, we chose to use values in spring, since we are looking at both juvenile and adult stages for some species. Most native fish species spawn in spring, and that is when they are in their juvenile stages.',
  recreation:
    'Visitation to state parks for day use and boating peaks in the summer season (April–September) when temperatures are highest and water-dependent activities are most in demand, whereas birding and waterfowl hunting at wildlife reserves peak in the winter (October–March) when migratory populations overwinter and when permits are issued for harvests. In the summer, boating depends directly on expected hydrological conditions, including those associated with fisheries, while land-based day use depends indirectly on hydrological conditions as they relate to scenery and near-riverine recreational activities. In the winter, access for birders is directly dependent on hydrological conditions, and waterfowl hunting is indirectly dependent, as permit systems set a take quota that is independent of expected hydrological conditions.',
  environmentalJustice:
    'Understanding how scenarios perform over a wet-water year and a dry water-year allows us to observe nuance associated with overall conditions that may be otherwise washed out in the full model run (which combines both water years).',
  economy:
    'We use a wet year (2019) and a dry year (2020) to show the range of effects; salinity is higher and its effect on crops is larger in dry years. Salinity is averaged over April to September, when crops are irrigated and most sensitive to salt. Each scenario is evaluated under current climate and with 2 feet of sea level rise. Land-conversion results are for a typical year of farming (DWR 2024 land use) and are not tied to a wet or dry year. All dollars are annual, in 2024 dollars.',
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
  ecology:
    'We compared sub-regions within and outside the Delta, stretching all the way through Suisun Marsh, San Pablo, and out into San Francisco Bay. We wanted to include downstream regions of the estuary because aquatic species are mobile (especially anadromous fishes like salmon), and can relocate if conditions in the upper estuary are not favorable. It is more informative for the entire population of those species to show where their fundamental niches are available throughout the estuary.',
  recreation:
    'Tidal geography, salinity, and regional hydrological differences influence Delta regions (Andrews et al., 2017), while roadways and regional attractions drive access to recreational opportunities throughout the Legal Delta (Delta Plan, 2013).',
  environmentalJustice:
    'Using community vulnerability classifications instead of geographic regions highlights how each scenario affects people, rather than places. Understanding where and how negative impacts may manifest, taking into account a community’s capacity to address these impacts, can inform decision-makers to intervene or choose alternative strategies to avoid these burdens coming to fruition.',
  economy:
    'We look at the farmland of the legal Delta because that is where salinity and land conversion affect the economy. Results are calculated for about 130 farming areas (mostly individual islands and tracts) and summed into four zones (North, Central, South and West Delta) and a Delta-wide total. Each area uses the salinity at the nearest model station. Eco Machine also covers Suisun Marsh, which has very little farmland. Jobs and value added include spending in the surrounding regional economy (IMPLAN multipliers).',
}

/**
 * A takeaway as the card lays it out: one lead sentence, then labelled points. Text
 * between ** ** is drawn in the team's colour, as in the other notes here.
 */
export interface ScenarioTakeaway {
  lead: string
  points?: { label: string; text: string }[]
}

const ECONOMY_NGW_LEAD =
  'New Green Watershed has **the largest economic cost of the scenarios** because it takes farmland out of production.'
const ECONOMY_NGW_CONVERSION =
  'Converting land to rice instead of wetland keeps more revenue but fewer jobs.'
const ECONOMY_NGW_NOT_COUNTED =
  'Subsidence reversal, lower levee and flood costs, and habitat are not counted, so the score shows the cost side only.'

/** New Green Watershed's takeaway at one restoration level, from what differs by level. */
const economyNgwLevel = (farmEconomy: string, carbonCredits: string): ScenarioTakeaway => ({
  lead: ECONOMY_NGW_LEAD,
  points: [
    { label: 'Farm economy', text: farmEconomy },
    { label: 'Carbon credits', text: carbonCredits },
    {
      label: 'Conversion',
      text: `${ECONOMY_NGW_CONVERSION} Construction would cost about $1.6 to $1.9 billion.`,
    },
    { label: 'Not counted', text: ECONOMY_NGW_NOT_COUNTED },
  ],
})

/**
 * New Green Watershed's takeaway at 25%, 50% and 100% wetland, shown when that level's
 * score cell is clicked in the opened column. The closed column, and a team with none
 * here, show the scenario's own takeaway below.
 */
export const NGW_LEVEL_TAKEAWAYS: Partial<Record<TeamKey, ScenarioTakeaway[]>> = {
  economy: [
    economyNgwLevel(
      'At 25% wetland, direct farm revenue falls 19.1%, total jobs (including multiplier effects) fall 31.3%, and total value added falls 16.1%. Scores: −3 (revenue), −4 (jobs), −3 (value added).',
      'Carbon credits would replace about 12% of the lost farm revenue.',
    ),
    economyNgwLevel(
      'At 50% wetland, direct farm revenue falls 25.5%, total jobs (including multiplier effects) fall 34.2%, and total value added falls 23.2%. Scores: −4 (revenue), −4 (jobs), −3 (value added).',
      'Carbon credits would replace about 10% of the lost farm revenue.',
    ),
    economyNgwLevel(
      'At 100% wetland, direct farm revenue falls 45.5%, total jobs (including multiplier effects) fall 42.8%, and total value added falls 45.8%. Scores: −5 on all three.',
      'Carbon credits would replace about 8% of the lost farm revenue.',
    ),
  ],
}

const WATER_AGE_NOTE =
  'An increase in water age itself is not inherently negative, nor does it mean harmful algal blooms will definitely form, but it does indicate suitable conditions for their formation.'

/**
 * A team's takeaway for one scenario, shown when one of its score cells is clicked.
 * A scenario with none shows UI.takeawayForthcoming.
 */
export const SCENARIO_TAKEAWAYS: Partial<
  Record<TeamKey, Partial<Record<ScenarioKey, ScenarioTakeaway>>>
> = {
  ecology: {
    em: {
      lead: 'Eco Machine increased salinity in Franks Tract, **reducing suitability for freshwater invasives like Brazilian waterweed and largemouth bass** but increasing suitability for overbite clams.',
      points: [
        {
          label: 'Longfin smelt',
          text: 'Juvenile longfin smelt also saw an increase in proportion of suitable days.',
        },
        {
          label: 'Habitat and food webs',
          text: 'It does expand habitat and improve food web contributions relative to baseline, but not as much as New Green Watershed.',
        },
      ],
    },
    ngw: {
      lead: 'The effects on species fundamental niches were the same as Eco Machine, but **contributions to food webs were much higher,** due to the expansion of managed wetlands and wet soil agriculture within the Delta.',
      points: [
        { label: 'Habitat', text: 'It also contributed a larger area of accessible habitat.' },
      ],
    },
    bf: {
      lead: 'We detected **no differences** between Bolster and Fortify and the baseline, Business as Usual.',
    },
    cor: {
      lead: 'Calling on Reserves **only had small differences from the baseline.**',
      points: [
        {
          label: '2019',
          text: 'It decreased the proportion of suitable points for longfin smelt and salmon, two desirable species, in 2019.',
        },
        {
          label: '2020',
          text: 'In 2020, it slightly decreased the suitability for freshwater invasives, and slightly increased suitability for overbite clam.',
        },
      ],
    },
    tunnel: {
      lead: 'A Tunnel **affected the most number of species** of all the adaptation scenarios.',
      points: [
        {
          label: 'Species',
          text: 'It decreased the proportion of suitable points for longfin smelt juveniles and overbite clams, while increasing proportions of suitable points for Brazilian waterweed and largemouth bass in 2020.',
        },
        {
          label: 'Chinook salmon',
          text: 'It had variable effects for Chinook salmon across the two years.',
        },
        {
          label: 'Food webs',
          text: 'We do not have a way to estimate how A Tunnel would affect food webs.',
        },
      ],
    },
  },
  economy: {
    em: {
      lead: 'Eco Machine restores about 43,120 acres of tidal marsh in Suisun Marsh and Franks Tract, but **almost none of this land is farmed.**',
      points: [
        {
          label: 'Farm economy',
          text: 'Converting that land lowers farm revenue by about $0.9 million per year and affects about 10 jobs (including multiplier effects).',
        },
        {
          label: 'Salinity',
          text: 'The fresher irrigation water it brings to Delta farms adds about $3,500 per year in a dry year ($24,000 with 2 feet of sea level rise), which offsets at most about 3% of that loss.',
        },
        { label: 'Score', text: 'The net change is less than 0.1%, so the score is 0.' },
        {
          label: 'Construction and credits',
          text: 'The main economic cost is construction, about $1.3 billion one time. Carbon credits would bring about $4.7 million per year.',
        },
        {
          label: 'Not counted',
          text: 'Benefits such as better water quality for exports from the Franks Tract redesign and new habitat are not counted in the score.',
        },
      ],
    },
    ngw: {
      lead: ECONOMY_NGW_LEAD,
      points: [
        {
          label: 'Farm economy',
          text: 'Depending on how much land becomes wetland, direct farm revenue falls 19% to 46%, total jobs (including multiplier effects) fall 31% to 43%, and total value added falls 16% to 46%.',
        },
        {
          label: 'Scores',
          text: 'Scores: −3 (revenue), −4 (jobs), −3 (value added) at 25% wetland; −4, −4, −3 at 50%; and −5 on all three at 100%.',
        },
        { label: 'Conversion', text: ECONOMY_NGW_CONVERSION },
        {
          label: 'Construction and credits',
          text: 'Carbon credits would replace about 8% to 12% of the lost farm revenue. Construction would cost about $1.6 to $1.9 billion.',
        },
        { label: 'Not counted', text: ECONOMY_NGW_NOT_COUNTED },
      ],
    },
    bf: {
      lead: 'Bolster & Fortify **affects farming only through salinity.**',
      points: [
        {
          label: 'Salinity',
          text: 'In a dry year it makes irrigation water slightly saltier, mostly in the Central Delta, and lowers farm revenue by about $10,000 per year (about $27,000 with 2 feet of sea level rise).',
        },
        {
          label: 'Score',
          text: 'This is less than 0.003% of Delta farm revenue, so the score is 0.',
        },
      ],
    },
    cor: {
      lead: 'Calling on Reserves **leaves irrigation-water salinity and farm income about where they are.**',
      points: [
        {
          label: 'Salinity',
          text: 'In a dry year it makes water slightly fresher on some western islands, a gain of a few thousand dollars per year.',
        },
        { label: 'Score', text: 'The score is 0.' },
      ],
    },
    tunnel: {
      lead: 'A Tunnel **shifts dry-year salinity from the western to the central Delta:** water becomes somewhat saltier on central islands such as Rindge Tract, Roberts Island, McDonald Island and Jones Tract, and fresher on western islands.',
      points: [
        {
          label: 'Farm revenue',
          text: 'Farm revenue falls by about $27,000 per year in a dry year (about $19,000 with sea level rise).',
        },
        {
          label: 'Score',
          text: 'This is less than 0.003% of Delta farm revenue, so the score is 0.',
        },
      ],
    },
    more: {
      lead: 'Increasing Sacramento River flow by 30% **makes Delta irrigation water fresher,** especially in the Central Delta and on Sherman Island, and raises farm revenue by about $20,000 per year in a dry year (water year 2021), with about a quarter of a job gained (including multiplier effects).',
      points: [
        {
          label: 'Score',
          text: 'This is less than 0.002% of Delta farm revenue, so the score is 0.',
        },
        {
          label: 'Comparison',
          text: 'These results come from a different model (SCHISM) and year than the other scenarios (RMA, 2019–2020), so they are less directly comparable.',
        },
      ],
    },
  },
  ecoCultural: {
    em: {
      lead: 'This scenario is ranked as **the second best** because it has less restoration than New Green Watershed.',
      points: [
        {
          label: 'Benefits for Tribes',
          text: 'It would provide all the same benefits for Tribes as listed below',
        },
      ],
    },
    ngw: {
      lead: 'Overall, New Green Watershed **performs the best among the adaptation scenarios,** due to the magnitude of restoration included.',
      points: [
        {
          label: 'Benefits for Tribes',
          text: 'The restoration creates opportunities for Tribes to gather culturally important material and gather as a community',
        },
      ],
    },
    more: {
      lead: 'Our analysis of flow tiers shows that a 30% increase in flows **would decrease salinity.**',
      points: [
        {
          label: 'Cultural meaning',
          text: 'In addition to the salinity implications that an increase in flows would result in, people shared with us that flows were the “soul” of the rivers. This indicates a deep cultural meaning beyond a decrease in salinity.',
        },
      ],
    },
  },
  recreation: {
    em: {
      lead: 'Eco Machine generally **moves salinity away from the Central Delta region (+1 to +3) and into Suisun Marsh (-2 to -5).**',
      points: [
        {
          label: 'Angling',
          text: 'This interaction raises our highest angling threshold (9,130 µS/cm), making Suisun saltier and affecting all activities in that region.',
        },
        {
          label: 'Temperature and sea level',
          text: 'Temperature changes are negligible, while sea-level rise increases the total days above threshold for all of our EC thresholds.',
        },
      ],
    },
    ngw: {
      lead: 'New Green Watershed is **practically identical to Eco Machine,** with slightly more negative losses for summer-season birding at Suisun (slightly more threshold days crossed).',
      points: [
        {
          label: 'Sea level rise',
          text: 'Under Sea-level rise, EC eases in Suisun, and birding conditions are better (fewer threshold days crossed) in the Central Delta.',
        },
        {
          label: 'Temperature',
          text: 'No major discernible differences emerge across temperature scenarios under New Green Watershed.',
        },
      ],
    },
    bf: {
      lead: 'Bolster & Fortify is **very similar to Business as Usual,** for both salinity EC and temperature, scoring equal to or 0 change from Business as Usual nearly at every score.',
    },
    cor: {
      lead: 'Calling on Reserves **performs better than Business as Usual for EC salinity** (0 to +1, with +3 for winter seasons in the Central Delta Day Use).',
      points: [
        {
          label: 'Temperature',
          text: 'The effects of temperature are negligible alongside sea-level rise.',
        },
      ],
    },
    tunnel: {
      lead: 'The Delta Conveyance Project, or A Tunnel, is **the only scenario that worsens EC salinity intrusion** into both Suisun and the Central Delta (-1 to -3).',
      points: [
        {
          label: 'Temperature',
          text: 'Warmer summer-season conditions for waterfowl during their brooding season diminish (-1 to -2) at both the baseline and sea-level-rise levels.',
        },
      ],
    },
    more: {
      lead: 'Greater outflows **improve recreation conditions,** mainly by reducing salinity in the Central Delta and Suisun, where exceedances are otherwise most frequent.',
      points: [
        {
          label: 'Elsewhere',
          text: 'North and South Delta regions are otherwise unchanged from baseline, as temperature and salinity do little to change them.',
        },
      ],
    },
  },
  environmentalJustice: {
    em: {
      lead: 'The in-Delta tidal restoration incorporated in Eco Machine **lowers overall drinking water threshold exceedances across the run the most** (tied with New Green Watershed) across scenarios, in both wet and dry water years, and the total run.',
      points: [
        {
          label: 'Water age',
          text: `However, water age does increase in these restored regions. ${WATER_AGE_NOTE}`,
        },
        {
          label: 'Flood risk',
          text: 'There is no change from Business as Usual in flood risk for this scenario.',
        },
      ],
    },
    ngw: {
      lead: 'The extensive watershed restoration included in this New Green Watershed **lowers overall drinking water threshold exceedances across the run the most** (tied with Eco Machine) across scenarios, in both wet and dry water years, and the total run.',
      points: [
        {
          label: 'Flood risk',
          text: 'New Green Watershed also lowers flood risk the most of all the scenarios.',
        },
        {
          label: 'Water age',
          text: `However, this restoration slows water down; water age increases in many restored regions. ${WATER_AGE_NOTE}`,
        },
      ],
    },
    bf: {
      lead: 'Bolster & Fortify **performs very similarly to Business as Usual** for both drinking water threshold exceedances and flood risk.',
      points: [
        {
          label: 'Drinking water',
          text: 'During a wet year, Bolster & Fortify incurs slightly fewer drinking water salinity threshold exceedances than Business as Usual, but slightly more in a dry year. Overall for the total run, there is no change from Business as Usual.',
        },
        {
          label: 'Flood risk',
          text: 'Bolster & Fortify does reduce flood risk, but only along the freshwater corridor pathway; this benefit is not felt Delta-wide.',
        },
        {
          label: 'Water age',
          text: `Due to this pathway, Bolster & Fortify also slightly decreases water age in the South Delta during certain months, but water age increases in Franks Tract. ${WATER_AGE_NOTE}`,
        },
      ],
    },
    cor: {
      lead: 'Calling on Reserves does not deviate from baseline for drinking water salinity threshold exceedances for total run or the wet year portion of the modeling, but it does **perform better than Business as Usual in a dry year.**',
      points: [{ label: 'Flood risk', text: 'There is no change in flood risk from baseline.' }],
    },
    tunnel: {
      lead: 'A Tunnel **does not differ from baseline** for drinking water salinity threshold exceedances at all.',
      points: [
        {
          label: 'Flood risk',
          text: 'There is a slight decrease in flood risk attributed to A Tunnel, on the assumption that the two northern intakes would intercept water in high storm events prior to inundation into the Delta.',
        },
      ],
    },
    more: {
      lead: 'Increased Delta Outflow **decreases the drinking water salinity threshold exceedances the most** out of all scenarios.',
    },
  },
}
