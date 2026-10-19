// The criterion tree: subteam → metric → entity, with every number taken from the
// five subteams' own sources in research/criteria-stories/ — the "Story Behind the
// Criterion" reports (Sept 2026) and the Bay-Delta Science Conference slides
// (Oct 2026), which supersede them. Provenance, what the slides changed and the
// remaining gaps: that folder's RANKINGS.md.
//
// The tree is deliberately uneven, because the reports are. Three things it records
// that a uniform hierarchy would hide:
//   - edge kind: a child can average into its parent, derive it, duplicate it, sit
//     beside it without ever entering it, or never be scored at all.
//   - unit: the value column changes units as you descend — a score at the top, a
//     percentage or an acreage below. Only the top level is comparable across teams.
//   - slice support: most nodes are not broken out by place or period, and the five
//     subteams use five different geographies that do not line up.
//
// Metric names follow each subteam's Oct 2026 "<Criterion> Metrics" slide, which
// renames several of them against the Sept report; the old name is recorded in the
// node's note wherever it changed.
import { ECOLOGY_NICHE, ECOLOGY_REGIONS, ECOLOGY_SPECIES } from './ecologyNiche'
import { WATER_AGE_GRID, WATER_AGE_MONTHS, WATER_AGE_REGIONS } from './ejWaterAge'
import {
  REC_SALINITY_DAYS,
  REC_SALINITY_SCORES,
  REC_TEMPERATURE_DAYS,
  REC_TEMPERATURE_SCORES,
} from './recreationThresholds'
import type { RecActivityKey, RecTable } from './recreationThresholds'
import { ANY, sliceKey } from './model'
import type { CriterionNode, Facet, ScenarioKey, SliceValues, Source } from './model'

const NO_FACET: Facet[] = [{ key: ANY, label: 'Not broken out' }]

/** Same value for every scenario slice: `{ ngw: 4, em: 2, ... }` → unsliced series. */
function flat(by: Partial<Record<ScenarioKey, number | null>>) {
  const out: Partial<Record<ScenarioKey, SliceValues>> = {}
  for (const [scenario, value] of Object.entries(by)) {
    out[scenario as ScenarioKey] = { [sliceKey(ANY, ANY)]: value }
  }
  return out
}

/** One row per scenario, one column per period: `{ bau: [run, wet, dry] }`. */
function byPeriod(periods: string[], by: Partial<Record<ScenarioKey, (number | null)[]>>) {
  const out: Partial<Record<ScenarioKey, SliceValues>> = {}
  for (const [scenario, values] of Object.entries(by)) {
    const series: SliceValues = {}
    periods.forEach((period, i) => {
      series[sliceKey(ANY, period)] = values?.[i] ?? null
    })
    out[scenario as ScenarioKey] = series
  }
  return out
}

// ---------- Ecology ----------

const YEARS: Facet[] = [
  { key: '2019', label: '2019 · wet' },
  { key: '2020', label: '2020 · dry' },
]
const ECO_PLACES: Facet[] = [
  { key: 'delta', label: 'Delta-wide' },
  ...ECOLOGY_REGIONS.map((region) => ({ key: region.key, label: region.label })),
]

/** One species: the full region × water year cube from the report's own tables. */
function speciesNode(species: (typeof ECOLOGY_SPECIES)[number]): CriterionNode {
  const values: Partial<Record<ScenarioKey, SliceValues>> = {}
  for (const [scenario, byPlace] of Object.entries(ECOLOGY_NICHE[species.key])) {
    const series: SliceValues = {}
    for (const [place, [wet, dry]] of Object.entries(byPlace)) {
      series[sliceKey(place, '2019')] = wet
      series[sliceKey(place, '2020')] = dry
    }
    values[scenario as ScenarioKey] = series
  }
  return {
    id: `eco-niche-${species.key}`,
    label: species.label,
    level: 'entity',
    team: 'ecology',
    edge: 'measures',
    provenance: 'reported',
    unit: 'share',
    betterHigher: true,
    note: `Proportion of days within ${species.salinity} and ${species.temperature}; A Tunnel was never run.`,
    places: ECO_PLACES,
    periods: YEARS,
    values,
  }
}

const BASELINE_MANAGED_WETLAND = 5100
const BASELINE_WET_SOIL_AG = 17178

const ECOLOGY: CriterionNode = {
  id: 'ecology',
  label: 'Ecology',
  level: 'team',
  team: 'ecology',
  provenance: 'inferred',
  unit: 'score',
  betterHigher: true,
  note: 'Neither source gives an overall score, so this acreage score is the mean of two acreage ranks: landscape and food web. The species work now ranks each species, but those ranks do not affect this score.',
  places: NO_FACET,
  periods: NO_FACET,
  values: flat({ ngw: 4.5, em: 2, bf: 0, cor: 0, tunnel: 0, bau: 0 }),
  children: [
    {
      id: 'eco-niche',
      label: 'Species-specific modeling',
      level: 'metric',
      team: 'ecology',
      edge: 'beside',
      provenance: 'unscored',
      unit: 'share',
      betterHigher: true,
      note: 'The Sept report calls this "Species fundamental niches", and it has the most detailed evidence: 8 species × 8 regions × 2 water years. The Oct 2026 slides rank each species but do not combine them into one criterion score; almost every cell is 0, and the variation between water years is much greater than the variation among scenarios. The slides rank a Feb 1 – Jun 1 spring window, while the values below cover whole water years by region.',
      places: ECO_PLACES,
      periods: YEARS,
      values: {},
      children: ECOLOGY_SPECIES.map(speciesNode),
    },
    {
      id: 'eco-foodweb',
      label: 'Food webs',
      level: 'metric',
      team: 'ecology',
      edge: 'averages',
      provenance: 'reported',
      unit: 'score',
      betterHigher: true,
      note: 'The Sept report calls this "Pelagic Food Webs" and uses an acre-weighted proxy (tidal wetland 0.4, managed wetland 0.2, wet-soil ag 0.1). The baseline has 5,100 managed wetland acres and 17,178 wet-soil ag acres; only Eco Machine and New Green Watershed change the landscape, so only their scores change. The Oct 2026 slides retain these scores and group this with Landscape as one metric, although they rank the two separately. The report’s 50/50 line writes the wet-soil-ag term as 128,001 − 17,178 but gives 14,518, the result of adding the two. Subtracting gives a proxy of 66,225 rather than 69,661, while the 25/75 line subtracts correctly. This probably does not change the +4 because the corrected value still falls between the other two sub-scenarios.',
      places: NO_FACET,
      periods: NO_FACET,
      values: flat({ ngw: 4, em: 1, bf: 0, cor: 0, tunnel: 0, bau: 0 }),
      // The slide ranks Business as Usual, Eco Machine and the three New Green
      // Watershed levels, and says so: "only evaluating Eco-Machine and NGW
      // (landscape changes)". The other three zeros follow from that sentence
      // rather than from the grid, so they are ours.
      inferredFor: ['bf', 'cor', 'tunnel'],
      children: [
        {
          id: 'eco-foodweb-managed',
          label: 'Managed wetland',
          level: 'entity',
          team: 'ecology',
          edge: 'derives',
          provenance: 'reported',
          unit: 'acres',
          betterHigher: true,
          note: 'The Ecology report gives New Green Watershed’s 50/50 primary sub-scenario as a TOTAL, including the 5,100 acres already there that the report’s own food-web formula then subtracts. The other teams measure something different: Eco-cultural’s 102,982 counts only restored acres, while Economy’s 85,523 converts farmland within a 207,004-acre footprint rather than splitting the 248,815 mapped Delta islands. After removing the baseline, Ecology still gives 115,714, so the gap with eco-cultural remains.',
          places: NO_FACET,
          periods: NO_FACET,
          values: flat({
            ngw: 120814,
            em: BASELINE_MANAGED_WETLAND,
            bf: BASELINE_MANAGED_WETLAND,
            cor: BASELINE_MANAGED_WETLAND,
            tunnel: BASELINE_MANAGED_WETLAND,
            bau: BASELINE_MANAGED_WETLAND,
          }),
        },
        {
          id: 'eco-foodweb-tidal',
          label: 'Added tidal wetland',
          level: 'entity',
          team: 'ecology',
          edge: 'derives',
          provenance: 'reported',
          unit: 'acres',
          betterHigher: true,
          note: 'This has the highest weight, 0.4 per acre, and Eco Machine’s 53,000 assumes full restoration of Suisun; see the Landscape metric’s note.',
          places: NO_FACET,
          periods: NO_FACET,
          values: flat({ ngw: 80000, em: 53000, bf: 0, cor: 0, tunnel: 0, bau: 0 }),
        },
        {
          id: 'eco-foodweb-wetsoil',
          label: 'Wet-soil agriculture',
          level: 'entity',
          team: 'ecology',
          edge: 'derives',
          provenance: 'reported',
          unit: 'acres',
          betterHigher: true,
          note: 'This has the lowest weight, at 0.1 per acre.',
          places: NO_FACET,
          periods: NO_FACET,
          values: flat({
            ngw: 128001,
            em: BASELINE_WET_SOIL_AG,
            bf: BASELINE_WET_SOIL_AG,
            cor: BASELINE_WET_SOIL_AG,
            tunnel: BASELINE_WET_SOIL_AG,
            bau: BASELINE_WET_SOIL_AG,
          }),
        },
      ],
    },
    {
      id: 'eco-habitat',
      label: 'Landscape',
      level: 'metric',
      team: 'ecology',
      edge: 'averages',
      provenance: 'reported',
      unit: 'score',
      betterHigher: true,
      note: 'The Sept report calls this "Accessible Aquatic Habitat" and counts only added accessible wetland acres. Managed wetlands and rice drain at times, so neither counts as accessible; the Oct 2026 slides retain the scores.',
      places: NO_FACET,
      periods: NO_FACET,
      values: flat({ ngw: 5, em: 3, bf: 0, cor: 0, tunnel: 0, bau: 0 }),
      children: [
        {
          id: 'eco-habitat-acres',
          label: 'Added tidal wetland',
          level: 'entity',
          team: 'ecology',
          edge: 'derives',
          provenance: 'reported',
          unit: 'acres',
          betterHigher: true,
          note: 'This metric has one acreage and no breakdown by place or period, making it the only scenario-level detail behind Ecology’s score. The three Eco Machine values use three different assumptions: Economy’s 53,614 restores all 52,244 leveed Suisun acres plus 1,370 at Franks Tract; Eco-cultural’s 43,100 restores about 80% of Suisun (41,720) plus 1,380; and Ecology’s 53,000 follows Economy and assumes full restoration. Economy says the scenario \u201cdoes not yet fix how much is restored\u201d, so each criterion scores a different version of the scenario. The app uses 53,000 until the fraction is settled.',
          places: NO_FACET,
          periods: NO_FACET,
          values: flat({ ngw: 80000, em: 53000, bf: 0, cor: 0, tunnel: 0, bau: 0 }),
        },
      ],
    },
    {
      id: 'eco-conceptual',
      label: 'Conceptual models',
      level: 'metric',
      team: 'ecology',
      edge: 'unscored',
      provenance: 'unscored',
      unit: 'score',
      betterHigher: true,
      note: 'The Oct 2026 metrics slide adds conceptual models that are absent from the Sept report; they describe ecosystem-wide interactions and summarize food-web and habitat changes for each scenario. These models are narrative by design, so no scenario receives a score.',
      places: NO_FACET,
      periods: NO_FACET,
      values: {},
    },
  ],
}

// ---------- Recreation ----------

const REC_PLACES: Facet[] = [
  { key: 'delta', label: 'Delta-wide' },
  { key: 'suisun', label: 'Suisun Marsh' },
  { key: 'centralDelta', label: 'Central Delta' },
  { key: 'northDelta', label: 'North Delta' },
  { key: 'southDelta', label: 'South Delta' },
]

/** Whole run, wet seasons, dry seasons: the same cut Recreation and EJ both use. */
const SEASONS = ['run', 'wet', 'dry']
const SEASON_FACETS: Facet[] = [
  { key: 'run', label: 'Whole run' },
  { key: 'wet', label: 'Wet season' },
  { key: 'dry', label: 'Dry season' },
]

interface RecActivitySpec {
  key: RecActivityKey
  label: string
  /** The salinity threshold, where the activity has one. */
  salinity?: string
  /** The temperature threshold, where the activity has one. */
  temperature?: string
  season: string
}

/** The activities as the 18 Oct 2026 workbooks group them: day use and boating share a threshold. */
const REC_ACTIVITIES: RecActivitySpec[] = [
  {
    key: 'dayUseBoating',
    label: 'Day use and boating',
    salinity: '1,000 µS/cm, the lowest threshold',
    temperature: '19 °C eases harmful algal bloom expansion',
    season: 'In-season May–Sep',
  },
  {
    key: 'birding',
    label: 'Birding',
    salinity: '2,640 µS/cm raises avian botulism risk',
    temperature: '20 °C for wetland bird species',
    season: 'Fall migration Aug–Oct, spring Apr–Jun, winter Oct–Apr',
  },
  {
    key: 'waterfowl',
    label: 'Waterfowl hunting',
    salinity: '3,600 µS/cm for sub-lethal effects',
    temperature: '23 °C',
    season: 'Brooding Apr–Jul, hunting Oct–Feb',
  },
  {
    key: 'angling',
    label: 'Angling',
    salinity: '9,130 µS/cm, the recreation fishery habitat threshold and the highest',
    temperature: '18.42 °C',
    season: 'In-season May–Sep',
  },
  {
    key: 'dayUseCold',
    label: 'Day use, cold water',
    temperature: 'below 18 °C is too cold for day use',
    season: 'In-season May–Sep',
  },
]

const REC_SALINITY_ACTIVITIES = REC_ACTIVITIES.filter((spec) => spec.salinity)

/** One activity's table as node values: region × period under each scenario. */
function recValues(
  table: RecTable<number | null>,
  activity: RecActivityKey,
): Partial<Record<ScenarioKey, SliceValues>> {
  const values: Partial<Record<ScenarioKey, SliceValues>> = {}
  for (const [scenario, byRegion] of Object.entries(table[activity] ?? {})) {
    const series: SliceValues = {}
    for (const [region, byPeriod] of Object.entries(byRegion)) {
      for (const [period, value] of Object.entries(byPeriod)) {
        series[sliceKey(region, period)] = value
      }
    }
    values[scenario as ScenarioKey] = series
  }
  return values
}

/**
 * The mean of several activities' scores at every region and period — ours, since
 * the subteam scores activities and stops there. A scenario missing from any
 * activity is left out rather than averaged over fewer.
 */
function recMean(
  table: RecTable<number | null>,
  activities: RecActivityKey[],
): Partial<Record<ScenarioKey, SliceValues>> {
  const perActivity = activities.map((activity) => recValues(table, activity))
  const out: Partial<Record<ScenarioKey, SliceValues>> = {}
  for (const scenario of Object.keys(perActivity[0] ?? {}) as ScenarioKey[]) {
    if (!perActivity.every((values) => values[scenario])) continue
    const series: SliceValues = {}
    for (const key of Object.keys(perActivity[0][scenario] ?? {})) {
      const parts = perActivity.map((values) => values[scenario]?.[key] ?? null)
      series[key] = parts.some((part) => part === null)
        ? null
        : Math.round(
            (parts.reduce<number>((sum, part) => sum + (part ?? 0), 0) / parts.length) * 100,
          ) / 100
    }
    out[scenario] = series
  }
  return out
}

function recActivityNode(
  metric: 'salinity' | 'temperature',
  spec: RecActivitySpec,
  scores: RecTable<number | null>,
  days: RecTable<number | null>,
): CriterionNode {
  const id = `rec-${metric}-${spec.key}`
  const threshold = metric === 'salinity' ? spec.salinity : spec.temperature
  return {
    id,
    label: spec.label,
    level: 'entity',
    team: 'recreation',
    edge: 'averages',
    provenance: 'reported',
    unit: 'score',
    betterHigher: true,
    note: `The subteam’s own score for this activity, by region and period: one point per percentage point of days over the threshold against Business as Usual, ±5 at five points or more. Threshold: ${threshold}. ${spec.season}.`,
    places: REC_PLACES,
    periods: SEASON_FACETS,
    values: recValues(scores, spec.key),
    children: [
      {
        id: `${id}-days`,
        label: 'Days over the threshold',
        level: 'entity',
        team: 'recreation',
        edge: 'derives',
        provenance: 'reported',
        unit: 'share',
        betterHigher: false,
        note: `Proportion of days whose daily mean crosses the ${metric} threshold (${threshold}), at 32 points in 4 regions, Oct 2018–Dec 2020. The score above is read from this.`,
        places: REC_PLACES,
        periods: SEASON_FACETS,
        values: recValues(days, spec.key),
      },
    ],
  }
}

const REC_SALINITY_KEYS = REC_SALINITY_ACTIVITIES.map((spec) => spec.key)
const REC_SALINITY_MEAN = recMean(REC_SALINITY_SCORES, REC_SALINITY_KEYS)
const REC_TEMPERATURE_MEAN = recMean(
  REC_TEMPERATURE_SCORES,
  REC_ACTIVITIES.map((spec) => spec.key),
)

/** The criterion score: the salinity metric's Delta-wide, whole-run mean, lifted to a flat value. */
const REC_CRITERION: Partial<Record<ScenarioKey, SliceValues>> = Object.fromEntries(
  Object.entries(REC_SALINITY_MEAN).map(([scenario, series]) => [
    scenario,
    { [sliceKey(ANY, ANY)]: series?.[sliceKey('delta', 'run')] ?? null },
  ]),
)

const RECREATION: CriterionNode = {
  id: 'recreation',
  label: 'Recreation',
  level: 'team',
  team: 'recreation',
  provenance: 'inferred',
  unit: 'score',
  betterHigher: true,
  note: 'The subteam now scores each activity itself, by region and by season (its 18 Oct 2026 workbooks), but publishes no criterion score. This value is the mean of its four salinity activity scores, Delta-wide, whole run: Bolster & Fortify 0, Eco Machine −1, New Green Watershed −1, Calling on Reserves −2.5, A Tunnel −4. Temperature scores are 0 Delta-wide for every scenario and are left out.',
  places: NO_FACET,
  periods: NO_FACET,
  values: REC_CRITERION,
  children: [
    {
      id: 'rec-salinity',
      label: 'Salinity thresholds',
      level: 'metric',
      team: 'recreation',
      edge: 'derives',
      provenance: 'inferred',
      unit: 'score',
      betterHigher: true,
      note: 'The mean of the four activity scores at each region and period; the criterion score is its Delta-wide, whole-run value. Exceedance concentrates in Suisun Marsh and the Central Delta, while the North and South Delta sit at 0% for every activity. A Tunnel is the worst scenario, −2 to −5 in Suisun Marsh and the Central Delta, and Calling on Reserves the second worst. Bolster & Fortify scores 0 everywhere but one cell.',
      places: REC_PLACES,
      periods: SEASON_FACETS,
      values: REC_SALINITY_MEAN,
      children: REC_SALINITY_ACTIVITIES.map((spec) =>
        recActivityNode('salinity', spec, REC_SALINITY_SCORES, REC_SALINITY_DAYS),
      ),
    },
    {
      id: 'rec-temperature',
      label: 'Temperature thresholds',
      level: 'metric',
      team: 'recreation',
      edge: 'beside',
      provenance: 'inferred',
      unit: 'score',
      betterHigher: true,
      note: 'The same construction against temperature thresholds, for the four scenarios run so far; Calling on Reserves and A Tunnel are pending. Every Delta-wide score is 0 and Suisun Marsh is the only region that moves (±1), so this metric is kept beside the criterion score rather than in it. Dry seasons drive the crossings; cold water matters only for day use, in wet seasons.',
      places: REC_PLACES,
      periods: SEASON_FACETS,
      values: REC_TEMPERATURE_MEAN,
      children: REC_ACTIVITIES.map((spec) =>
        recActivityNode('temperature', spec, REC_TEMPERATURE_SCORES, REC_TEMPERATURE_DAYS),
      ),
    },
    {
      id: 'rec-restoration',
      label: 'Restoration',
      level: 'metric',
      team: 'recreation',
      edge: 'unscored',
      provenance: 'unscored',
      unit: 'acres',
      betterHigher: true,
      note: 'New since the report, this compares accessible acres from wetland restoration with the CVJV 2020 habitat deficits of 21,454 shorebird and 21,336 waterfowl acres. New Green Watershed exceeds them by +264% at 0.25MW, +483% at 0.5MW, and +1,166% at Full MW, which is why Recreation favours it; the measure is not scored and does not affect the score above.',
      places: NO_FACET,
      periods: NO_FACET,
      values: flat({ ngw: 102982, em: null, bf: 0, cor: 0, tunnel: 0, bau: 0 }),
    },
    {
      id: 'rec-economy',
      label: 'Recreation economy',
      level: 'metric',
      team: 'recreation',
      edge: 'unscored',
      provenance: 'unscored',
      unit: 'score',
      betterHigher: true,
      note: 'Also new are visitor-sector earnings 2001–2023 by water-year type: earnings are +19.6% in critical years and +20.3% in wet years, but −21.8% in dry and −27.5% in above-normal years. Earnings are therefore lowest in the middle rather than at the extremes; this is narrative only, and no scenario is scored. An island-by-island valuation of ecosystem benefits under New Green Watershed arrived on 18 Oct 2026 and is under discussion within the subteam, so it is not loaded here yet.',
      places: NO_FACET,
      periods: NO_FACET,
      values: {},
    },
  ],
}

// ---------- EJ and vulnerable communities ----------

/** One vulnerability class: exceedance of 1,050 µS/cm, by season. */
function vulnerabilityNode(
  key: string,
  label: string,
  points: number,
  by: Partial<Record<ScenarioKey, (number | null)[]>>,
  note: string,
): CriterionNode {
  return {
    id: `ej-drinking-${key}`,
    label: `${label} (${points} points)`,
    level: 'entity',
    team: 'environmentalJustice',
    edge: 'measures',
    provenance: 'reported',
    unit: 'share',
    betterHigher: false,
    note,
    places: NO_FACET,
    periods: SEASON_FACETS,
    values: byPeriod(SEASONS, by),
  }
}

const WATER_AGE_PLACES: Facet[] = WATER_AGE_REGIONS.map((region) => ({
  key: region.key,
  label: region.label,
}))
const WATER_AGE_PERIODS: Facet[] = WATER_AGE_MONTHS.map((month) => ({
  key: month.key,
  label: month.label,
}))

/** Signed ladder: positive = water gets younger (better), negative = older. */
function waterAgeValues() {
  const out: Partial<Record<ScenarioKey, SliceValues>> = {}
  for (const [scenario, byRegion] of Object.entries(WATER_AGE_GRID)) {
    const series: SliceValues = {}
    for (const [region, byMonth] of Object.entries(byRegion)) {
      for (const [month, cell] of Object.entries(byMonth)) {
        series[sliceKey(region, month)] = cell.down - cell.up
      }
    }
    out[scenario as ScenarioKey] = series
  }
  return out
}

const EJ: CriterionNode = {
  id: 'environmentalJustice',
  label: 'Env. Justice',
  level: 'team',
  team: 'environmentalJustice',
  provenance: 'reported',
  unit: 'score',
  betterHigher: true,
  note: 'This is the rounded mean of three values: drinking water (whole run), flood risk, and water age. It was the mean of five values until the Oct 2026 slides dropped the two seasonal drinking-water scores, after which Eco Machine lost its +1. This remains the only criterion with a complete path from score to measurement. Calling on Reserves and A Tunnel are pending because they lack a water-age result; Step 1 uses stand-ins of −1 and −2.',
  places: NO_FACET,
  periods: NO_FACET,
  values: flat({ ngw: 1, em: 0, bf: 0, cor: null, tunnel: null, bau: 0 }),
  children: [
    {
      id: 'ej-drinking',
      label: 'Salinity impacts to in-Delta drinking water',
      level: 'metric',
      team: 'environmentalJustice',
      edge: 'averages',
      provenance: 'reported',
      unit: 'score',
      betterHigher: true,
      note: 'This metric has three scores: whole run, wet season, and dry season. Until Oct 2026, all three contributed to the criterion mean; now only the whole-run score counts, while the seasonal scores are calculated but unused. A Tunnel no longer appears in the chart.',
      places: NO_FACET,
      periods: SEASON_FACETS,
      values: byPeriod(SEASONS, {
        ngw: [2, 2, 0],
        em: [2, 2, 1],
        bf: [0, -1, 0],
        cor: [-2, -4, 0],
        tunnel: [-3, -5, 0],
        bau: [0, 0, 0],
      }),
      children: [
        {
          id: 'ej-drinking-all',
          label: 'All 49 points',
          level: 'entity',
          team: 'environmentalJustice',
          edge: 'derives',
          provenance: 'reported',
          unit: 'share',
          betterHigher: false,
          note: 'This measurement determines the score. The Sept report’s Comparative Scenario Performance Ranking uses bands one percentage point wide relative to the Business as Usual baseline and defines ±5 as “≥5% more/less”. A Tunnel’s wet season is seven points above baseline, so it falls in the bottom band at −5 rather than being truncated. The same table gives Eco Machine and New Green Watershed +3 for the total run, whereas the Oct 2026 slides give them +2. The slides’ raw column (0.66 for New Green Watershed) supports only +2, so the app follows the slides; the slides show the five scenarios below unchanged and omit A Tunnel.',
          places: NO_FACET,
          periods: SEASON_FACETS,
          values: byPeriod(SEASONS, {
            ngw: [0.07, 0.08, 0.07],
            em: [0.07, 0.08, 0.06],
            bf: [0.09, 0.11, 0.07],
            cor: [0.11, 0.14, 0.07],
            tunnel: [0.12, 0.17, 0.07],
            bau: [0.09, 0.1, 0.07],
          }),
        },
        vulnerabilityNode(
          'moderate',
          'Moderate vulnerability',
          10,
          {
            ngw: [0.04, 0.05, 0.04],
            em: [0.04, 0.05, 0.03],
            bf: [0.05, 0.07, 0.04],
            cor: [0.11, 0.19, 0.03],
            tunnel: [0.13, 0.22, 0.03],
            bau: [0.06, 0.09, 0.05],
          },
          'Where the whole criterion turns: Calling on Reserves and A Tunnel more than double the wet-season exceedance here while leaving the dry season alone — and since Oct 2026 the wet-season score no longer counts towards the criterion.',
        ),
        vulnerabilityNode(
          'high',
          'High vulnerability',
          36,
          {
            ngw: [0.08, 0.1, 0.08],
            em: [0.08, 0.1, 0.08],
            bf: [0.1, 0.13, 0.09],
            cor: [0.11, 0.15, 0.09],
            tunnel: [0.13, 0.17, 0.09],
            bau: [0.1, 0.12, 0.09],
          },
          'Three quarters of the points sit in this class, so it dominates the all-points number.',
        ),
        vulnerabilityNode(
          'highest',
          'Highest vulnerability',
          3,
          {
            ngw: [0, 0, 0],
            em: [0, 0, 0],
            bf: [0, 0, 0],
            cor: [0, 0, 0],
            tunnel: [0, 0, 0],
            bau: [0, 0, 0],
          },
          'Never exceeds the threshold under any scenario, in either season — the most vulnerable communities are not where this burden lands.',
        ),
      ],
    },
    {
      id: 'ej-flood',
      label: 'Flood risk attenuation',
      level: 'metric',
      team: 'environmentalJustice',
      edge: 'averages',
      provenance: 'reported',
      unit: 'score',
      betterHigher: true,
      note: 'Each scenario receives one qualitative judgment based on its flood-reduction design. As one of three values in the mean, it makes up one third of the EJ score and has the same weight as the drinking-water metric with 39,659 measurements; it is the only metric for A Tunnel.',
      places: NO_FACET,
      periods: NO_FACET,
      values: flat({ ngw: 3, em: 0, bf: 2, cor: 0, tunnel: 1, bau: 0 }),
    },
    {
      id: 'ej-waterage',
      label: 'Water age + temperature',
      level: 'metric',
      team: 'environmentalJustice',
      edge: 'averages',
      provenance: 'reported',
      unit: 'score',
      betterHigher: true,
      note: 'Water at or above 19 °C and older than 14 days is a harmful-algal-bloom proxy across 5 hotspot regions. Green infrastructure reduces drinking-water exceedance but increases this proxy because the wetlands freshen the water and also slow it down. Every scenario received a score one step lower in Oct 2026. Calling on Reserves and A Tunnel are pending, although they would add the most information.',
      places: NO_FACET,
      periods: NO_FACET,
      values: flat({ ngw: -3, em: -2, bf: -1, cor: null, tunnel: null, bau: 0 }),
      children: [
        {
          id: 'ej-waterage-days',
          label: 'Average water age against today, by region',
          level: 'entity',
          team: 'environmentalJustice',
          edge: 'derives',
          provenance: 'reported',
          unit: 'days',
          betterHigher: false,
          note: 'This measurement determines the rank. The largest difference from the Business as Usual baseline occurs in Suisun Marsh, where green infrastructure adds about eight days relative to a Delta-wide baseline of 17–29 days. Three of five regions differ little from baseline, and Bolster & Fortify is the only scenario that reduces water age anywhere.',
          places: WATER_AGE_PLACES,
          periods: NO_FACET,
          values: {
            bf: {
              [sliceKey('suisun', ANY)]: 0.1,
              [sliceKey('franksTract', ANY)]: 2.2,
              [sliceKey('southDelta', ANY)]: -0.5,
              [sliceKey('lindseyCache', ANY)]: 0,
              [sliceKey('mcCormackWilliamson', ANY)]: 0,
            },
            em: {
              [sliceKey('suisun', ANY)]: 7.9,
              [sliceKey('franksTract', ANY)]: 5.2,
              [sliceKey('southDelta', ANY)]: 0.3,
              [sliceKey('lindseyCache', ANY)]: 0.4,
              [sliceKey('mcCormackWilliamson', ANY)]: 0.5,
            },
            ngw: {
              [sliceKey('suisun', ANY)]: 8.0,
              [sliceKey('franksTract', ANY)]: 5.3,
              [sliceKey('southDelta', ANY)]: 0.4,
              [sliceKey('lindseyCache', ANY)]: 3.9,
              [sliceKey('mcCormackWilliamson', ANY)]: 0.6,
            },
            bau: {
              [sliceKey('suisun', ANY)]: 0,
              [sliceKey('franksTract', ANY)]: 0,
              [sliceKey('southDelta', ANY)]: 0,
              [sliceKey('lindseyCache', ANY)]: 0,
              [sliceKey('mcCormackWilliamson', ANY)]: 0,
            },
          },
        },
        {
          id: 'ej-waterage-grid',
          label: 'Change against today, by region and month',
          level: 'entity',
          team: 'environmentalJustice',
          edge: 'derives',
          provenance: 'reported',
          unit: 'ladder',
          betterHigher: true,
          note: 'This uses the Sept report’s slight → extreme ladder across 5 regions and 13 months, making it the only month-by-month view in either source. A cell with both an increase and a decrease shows the net difference. A Tunnel is absent, while Calling on Reserves stops after Oct 2019; both are therefore pending.',
          places: WATER_AGE_PLACES,
          periods: WATER_AGE_PERIODS,
          values: waterAgeValues(),
          detail: 'waterAge',
        },
      ],
    },
  ],
}

// ---------- Economy ----------

const ECONOMY_NOTE =
  'Reported Delta-wide and by four Delta zones — North, Central and South Delta on water-agency boundaries, plus West Delta — for a wet (2019) and a dry (2020) water year. Suisun Marsh sits outside the zones and enters only through the Eco Machine land-use estimate.'

/**
 * Why this metric has a score where its own rows are blank.
 *
 * Two pathways reach one score, and only one of them has rows here. The land-use
 * pathway converts farmland and belongs to New Green Watershed alone — those are
 * the three restoration levels. Every other scenario scores through the salinity
 * pathway, which converts nothing and is published as a chart in both sources,
 * never as a table, so none of it is in this tree.
 */
const ECONOMY_GAP =
  'The rows below come from two different pathways. The restoration levels are New Green Watershed’s land conversion. The salinity row carries every other scenario, and it is mostly blank because both sources publish that pathway as a chart and name only its extremes in text. The Sept report’s “Comparative Scenario Performance Ranking” states the method, and it is deliberate rather than missing: −5 to +5 anchored at 0 for Business as Usual, and “each scenario on whichever effect actually dominates for it, rather than forcing every scenario onto one percent-based scale”. Its table names the dominant effect per scenario — land-use conversion for New Green Watershed and Eco Machine, salinity (small) for Bolster & Fortify and Calling on Reserves — which is why a −4 from −25.5% of revenue sits beside a −1 from −0.003%. What the report does not give is a step size: nothing says why −$34,000 is −1 while −$1,000 is 0, or why the three restoration levels land on −3, −4 and −5.'

const ECONOMY_ZONES: Facet[] = [
  { key: 'north', label: 'North Delta' },
  { key: 'central', label: 'Central Delta' },
  { key: 'south', label: 'South Delta' },
  { key: 'west', label: 'West Delta' },
]

/** Change in total value added by zone, dry year 2020, salinity pathway (US$). */
const ZONE_VALUE_ADDED: Partial<Record<ScenarioKey, [number, number, number, number]>> = {
  ngw: [60, -2216, 1325, 4908],
  em: [325, -413, 2582, 5243],
  cor: [769, 5931, -8211, 1062],
  bf: [-646, -11417, -1797, 4340],
  bau: [0, 0, 0, 0],
}

function zoneValues() {
  const out: Partial<Record<ScenarioKey, SliceValues>> = {}
  for (const [scenario, byZone] of Object.entries(ZONE_VALUE_ADDED)) {
    const series: SliceValues = {}
    ECONOMY_ZONES.forEach((zone, i) => {
      series[sliceKey(zone.key, ANY)] = byZone[i]
    })
    out[scenario as ScenarioKey] = series
  }
  return out
}

/**
 * The pathway behind every score in the Economy column except New Green
 * Watershed's: modelled salinity changes crop yields, and no land changes hands.
 *
 * Both sources give it a slide of its own and then publish it as a chart, naming
 * only the extremes in text. So the row is mostly blank while the score above it
 * is full, and that is the honest shape of the evidence rather than a gap in the
 * transcription.
 */
function salinityPathway(
  metric: string,
  unit: 'usd' | 'jobs',
  by: Partial<Record<ScenarioKey, (number | null)[]>>,
  note: string,
): CriterionNode {
  return {
    id: `${metric}-salinity`,
    label: 'Salinity pathway, Delta-wide',
    level: 'entity',
    team: 'economy',
    edge: 'measures',
    provenance: 'reported',
    unit,
    betterHigher: true,
    note,
    places: NO_FACET,
    // Same keys Ecology uses, so one When control moves both teams together.
    periods: YEARS,
    values: byPeriod(['2019', '2020'], by),
  }
}

/** New Green Watershed's three restoration intensities — a finer scenario, not an entity. */
function restorationLevels(
  metric: string,
  unit: 'dollars' | 'jobs',
  full: number,
  half: number,
  quarter: number,
): CriterionNode[] {
  const levels: [string, string, number][] = [
    ['full', 'Full managed wetland · 207,000 ac', full],
    ['half', '50/50 wetland and rice · the primary', half],
    ['quarter', '25/75 wetland and rice', quarter],
  ]
  return levels.map(([key, label, value]) => ({
    id: `${metric}-${key}`,
    label,
    level: 'entity',
    team: 'economy',
    // Not 'derives': these are three settings of New Green Watershed, so the row
    // holds one scenario and the parent's other columns come from the salinity
    // pathway, which has no restoration levels at all.
    edge: 'refines',
    provenance: 'reported',
    unit,
    betterHigher: true,
    note: 'This New Green Watershed sub-scenario adds detail to the scenario rather than a part of the criterion. The other scenarios have no restoration level because their scores come from the salinity pathway, and the page uses the 50/50 primary for the score.',
    places: NO_FACET,
    periods: NO_FACET,
    values: { ngw: { [sliceKey(ANY, ANY)]: value } },
  }))
}

const ECONOMY_SCORES = { ngw: -4, em: 0, bf: -1, cor: 0, tunnel: null, bau: 0 }

const ECONOMY: CriterionNode = {
  id: 'economy',
  label: 'Economy',
  level: 'team',
  team: 'economy',
  provenance: 'reported',
  unit: 'score',
  betterHigher: true,
  note: 'Each scenario receives one value based on its larger effect; the three metrics below are not combined into a mean. The Oct 2026 slides give one score and state that gross revenue, jobs, and value added all use it, which is why the three rows are identical. Every modeled scenario changes gross revenue by less than 0.01% of a $1.107B Delta farm economy through salinity, so land conversion determines the criterion. Calling on Reserves is 0 in the dry year and +1 in the wet year; the app uses 0, and A Tunnel is still pending.',
  places: NO_FACET,
  periods: NO_FACET,
  values: flat(ECONOMY_SCORES),
  children: [
    {
      id: 'econ-revenue',
      label: 'Gross revenues',
      level: 'metric',
      team: 'economy',
      edge: 'duplicates',
      provenance: 'reported',
      unit: 'score',
      betterHigher: true,
      note: `Dollar sales from Delta farms relative to a $1.107B/yr base. The largest salinity-only effect is Bolster & Fortify at −$34,000 in the dry year. ${ECONOMY_GAP} ${ECONOMY_NOTE}`,
      places: NO_FACET,
      periods: NO_FACET,
      values: flat(ECONOMY_SCORES),
      children: [
        salinityPathway(
          'econ-revenue',
          'usd',
          { ngw: [468000, null], bf: [null, -34000], cor: [4000, -1000], bau: [0, 0] },
          'Every salinity figure either source states, against a $1,107.3M base: Bolster & Fortify −$34,000 in the dry year, the largest loss anywhere and mostly Central Delta; Calling on Reserves about −$1,000 dry and +$4,000 wet; New Green Watershed’s salinity run +$468,000 in the wet year. Eco Machine is called slightly positive with no number attached, and A Tunnel is pending. Every one of these is under 0.04% of the base, which is what the criterion means by salinity being a non-story.',
        ),
        ...restorationLevels('econ-revenue', 'dollars', -504.5, -282.5, -212.4),
      ],
    },
    {
      id: 'econ-jobs',
      label: 'Jobs',
      level: 'metric',
      team: 'economy',
      edge: 'duplicates',
      provenance: 'reported',
      unit: 'score',
      betterHigher: true,
      note: `This includes direct farm jobs (7,650 at base) and the total after IMPLAN multipliers (11,814). The levels below show the total difference from baseline, while revenue and value added show the direct difference from baseline. The slides do not publish a direct jobs column. The largest salinity-only difference in jobs is +0.13 jobs for Eco Machine in the dry year. ${ECONOMY_GAP} ${ECONOMY_NOTE}`,
      places: NO_FACET,
      periods: NO_FACET,
      values: flat(ECONOMY_SCORES),
      children: [
        salinityPathway(
          'econ-jobs',
          'jobs',
          { em: [null, 0.13], bau: [0, 0] },
          'The only salinity job figure either source states: +0.13 jobs, Eco Machine in the dry year, given as the largest job change anywhere. The slides put the baseline at 11,860 jobs here and 11,814 elsewhere, a 46-job difference nobody has reconciled.',
        ),
        ...restorationLevels('econ-jobs', 'jobs', -5125, -4121, -3783),
      ],
    },
    {
      id: 'econ-value',
      label: 'Value added',
      level: 'metric',
      team: 'economy',
      edge: 'duplicates',
      provenance: 'reported',
      unit: 'score',
      betterHigher: true,
      note: `Wages, business income, and taxes after revenue circulates, approximately regional GDP: $671M direct and $999M with multipliers. The largest salinity-only loss is −$9,500 for Bolster & Fortify in the dry year. ${ECONOMY_GAP} ${ECONOMY_NOTE}`,
      places: NO_FACET,
      periods: NO_FACET,
      values: flat(ECONOMY_SCORES),
      children: [
        salinityPathway(
          'econ-value',
          'usd',
          { bf: [null, -9500], bau: [0, 0] },
          'The only salinity value-added figure either source states: −$9,500, Bolster & Fortify in the dry year, given as the largest loss anywhere, against $999M of total regional value added.',
        ),
        ...restorationLevels('econ-value', 'dollars', -307, -141, -89),
        {
          id: 'econ-value-zones',
          label: 'By Delta zone, dry year',
          level: 'entity',
          team: 'economy',
          edge: 'measures',
          provenance: 'reported',
          unit: 'usd',
          betterHigher: true,
          note: 'New in Oct 2026, this is the only view where the salinity pathway shows a regional pattern rather than a rounding error. Every scenario has its largest difference from baseline in the Central Delta, with Calling on Reserves and Bolster & Fortify differing in opposite directions. The full range is only a few thousand dollars in a $999M economy, so zone detail does not make the effect meaningful.',
          places: ECONOMY_ZONES,
          periods: NO_FACET,
          values: zoneValues(),
        },
      ],
    },
  ],
}

// ---------- Eco-cultural ----------

const EC_PLACES: Facet[] = [
  { key: 'inDelta', label: 'In-Delta' },
  { key: 'upper', label: 'Upper watershed' },
]

/** One habitat type's restored acres. Only the two restoration scenarios move. */
function habitatNode(
  key: string,
  label: string,
  place: string,
  ngwAcres: number | null,
  note: string,
  emAcres = 0,
): CriterionNode {
  const zeros = Object.fromEntries(
    (['em', 'bf', 'cor', 'tunnel', 'bau'] as ScenarioKey[]).map((scenario) => [
      scenario,
      { [sliceKey(place, ANY)]: scenario === 'em' ? emAcres : 0 },
    ]),
  )
  return {
    id: `ec-restoration-${key}`,
    label,
    level: 'entity',
    team: 'ecoCultural',
    edge: 'measures',
    provenance: 'reported',
    unit: 'acres',
    betterHigher: true,
    note,
    // A habitat belongs to one side of the watershed, so it offers only that one.
    places: EC_PLACES.filter((facet) => facet.key === place),
    periods: NO_FACET,
    values: { ngw: { [sliceKey(place, ANY)]: ngwAcres }, ...zeros },
  }
}

const EC_QUALITATIVE: [string, string, string][] = [
  [
    'ec-access',
    'Increased access to landscapes for stewardship, subsistence, ceremony, and cultural practices',
    'The access ladder is itself the finding: ownership > land trust > conservation easement > cultural conservation easement > MOU. No scenario is scored on it.',
  ],
  [
    'ec-tek',
    'Implementation and application of Indigenous science & Traditional Ecological Knowledge (TEK)',
    'Enabling conditions rather than outcomes — privacy, unrestricted access, site selection, partnership with Tribal stewardship groups. Specific practice sites are deliberately not mapped.',
  ],
  [
    'ec-sovereignty',
    'Recognition and application of Indigenous sovereignty, Tribal governance, and rights',
    'Data sovereignty under CARE, education, food sovereignty, Tribal water rights. Workshop-derived content needs Tribal review before it is published anywhere.',
  ],
]

const ECO_CULTURAL: CriterionNode = {
  id: 'ecoCultural',
  label: 'Eco-cultural',
  level: 'team',
  team: 'ecoCultural',
  provenance: 'reported',
  unit: 'score',
  betterHigher: true,
  note: 'This composite score comes almost entirely from restored acres. Three of its four metrics are intentionally described but never scored, and the Oct 2026 slides publish these same values. This resolves the conflict with the report’s earlier RANK grid (Eco Machine 1, Calling on Reserves 0) in favor of the values already used by the app.',
  places: NO_FACET,
  periods: NO_FACET,
  values: flat({ ngw: 4, em: 2, bf: 0, cor: 1, tunnel: -2, bau: 0 }),
  children: [
    {
      id: 'ec-restoration',
      label: 'Restoration of native ecosystems and ecosystem functions',
      level: 'metric',
      team: 'ecoCultural',
      edge: 'derives',
      provenance: 'reported',
      unit: 'acres',
      betterHigher: true,
      note: 'The only quantified metric now has its own rank: BAU 0, Bolster & Fortify 0, Eco Machine +2, New Green Watershed +5, Calling on Reserves 0, A Tunnel 0. The Oct 2026 slides remove montane forests from the upland total and recalculate the rest, reducing the upper-watershed value from millions of acres to hundreds of thousands. New Green Watershed’s in-Delta 248,815 comes from the subteam, while we calculated the upland 66,159 and the 314,974 total. They use the low end of three published ranges, the smallest of nine upland sub-scenarios; the full range is 314,974 to 1,106,782 acres.',
      places: EC_PLACES,
      periods: NO_FACET,
      // The in-Delta figure is published; the upland total and the all-places
      // total are sums we made of the low end of three ranges.
      inferredSlices: [sliceKey(ANY, ANY), sliceKey('upper', ANY)],
      values: {
        ngw: {
          [sliceKey(ANY, ANY)]: 314974,
          [sliceKey('inDelta', ANY)]: 248815,
          [sliceKey('upper', ANY)]: 66159,
        },
        em: { [sliceKey(ANY, ANY)]: 43100, [sliceKey('inDelta', ANY)]: 43100 },
        bf: { [sliceKey(ANY, ANY)]: 0 },
        cor: { [sliceKey(ANY, ANY)]: 0 },
        tunnel: { [sliceKey(ANY, ANY)]: 0 },
        bau: { [sliceKey(ANY, ANY)]: 0 },
      },
      children: [
        habitatNode(
          'managed',
          'Managed wetlands',
          'inDelta',
          102982,
          'Restored acres, from the table eco-cultural titles RESTORED ACRES. Ecology’s 120,814 is not a rival reading of this: it is the total including the 5,100-acre baseline. Economy’s 85,523 splits a 207,004-acre farmland footprint rather than these 248,815 mapped Delta islands, and lands on the same 41% share this does.',
        ),
        habitatNode(
          'rice',
          'Wet-soil agriculture (rice)',
          'inDelta',
          145833,
          'From the 50/50 split.',
        ),
        habitatNode(
          'tidal',
          'Tidal wetlands',
          'inDelta',
          null,
          'Eco Machine’s only restoration: 41,720 acres in Suisun Marsh plus 1,380 at Franks Tract. New Green Watershed’s cell is left blank in the source — a gap, not a zero.',
          43100,
        ),
        habitatNode(
          'uplandWetland',
          'Upland managed wetland',
          'upper',
          48213,
          'At the 0.25MW level; 85,523 at 0.5MW and 207,004 at Full MW. These match Economy’s land-conversion table exactly, which the earlier figures did not.',
        ),
        habitatNode('meadow', 'Meadows', 'upper', 11586, 'Range: 11,586 to 347,591 acres.'),
        habitatNode('floodplain', 'Floodplains', 'upper', 6360, 'Range: 6,360 to 303,372 acres.'),
      ],
    },
    ...EC_QUALITATIVE.map(([id, label, note]): CriterionNode => ({
      id,
      label,
      level: 'metric',
      team: 'ecoCultural',
      edge: 'unscored',
      provenance: 'unscored',
      unit: 'score',
      betterHigher: true,
      note,
      places: NO_FACET,
      periods: NO_FACET,
      values: {},
    })),
  ],
}

/** The five subteams, in the order ../data.ts lists them. */
export const CRITERION_TREE: CriterionNode[] = [ECOLOGY, RECREATION, EJ, ECONOMY, ECO_CULTURAL]

/** Flat index for breadcrumb and path lookups. */
export const NODE_INDEX = new Map<string, CriterionNode>()
const PARENT_OF = new Map<string, string>()

function index(node: CriterionNode, parent?: string) {
  NODE_INDEX.set(node.id, node)
  if (parent) PARENT_OF.set(node.id, parent)
  node.children?.forEach((child) => index(child, node.id))
}
CRITERION_TREE.forEach((team) => index(team))

/** The whole tree flattened in display order, with depth, for the picker. */
export interface FlatNode {
  node: CriterionNode
  depth: number
  parentId?: string
}

export const FLAT_TREE: FlatNode[] = (() => {
  const out: FlatNode[] = []
  const walk = (node: CriterionNode, depth: number, parentId?: string) => {
    out.push({ node, depth, parentId })
    node.children?.forEach((child) => walk(child, depth + 1, node.id))
  }
  CRITERION_TREE.forEach((team) => walk(team, 0))
  return out
})()

// ---------- where each number came from ----------
//
// Kept as one block rather than scattered over the nodes, so the citations can be
// read against the sources in one pass. Quotes are verbatim; `ours` entries carry
// the rule we applied instead, because there is nothing to quote.
//
// Families generated by a function (species, activities, vulnerability classes,
// habitat types, restoration levels) share one entry via the prefix table below,
// which is accurate: they come from one table apiece.

const SOURCES: Record<string, Source[]> = {
  // --- Ecology ---
  ecology: [
    {
      doc: 'ours',
      where: 'Mean of the two ranked metrics',
      quote:
        'Neither source gives Ecology a criterion score. We average Landscape and Food webs, which at New Green Watershed is (5 + 4) / 2 = 4.5.',
    },
  ],
  'eco-niche': [
    {
      doc: 'slides',
      where: 'PERFORMANCE: ALL SPECIES SUITABILITY (four grids)',
      quote:
        'Proportion of suitable points (2019 ONLY) … (2020 only); Average Streak of Consecutive Suitable Days (2019 ONLY) … (2020 ONLY)',
    },
  ],
  'eco-foodweb': [
    {
      doc: 'slides',
      where: 'PERFORMANCE: FOOD WEBS',
      quote:
        'Business As Usual 0; Eco Machine +1; New Green Watershed #1 +5, #2 +4, #3 +4. "Only evaluating Eco-Machine and NGW (landscape changes)."',
    },
    {
      doc: 'report',
      where: 'Results — pelagic food web proxy',
      quote:
        'Total baseline managed wetland acres-5100*(0.2) + additional tidal wetland acres*(0.4)+ total wet soil ag acres-17,178*(0.1) = Proxy for food web production',
    },
  ],
  'eco-habitat': [
    {
      doc: 'slides',
      where: 'PERFORMANCE: LANDSCAPE — additional accessible wetland acres',
      quote:
        'Business As Usual 0; Eco Machine +3; New Green Watershed +5; Bolster & Fortify 0; Calling On Reserves 0; A Tunnel 0',
    },
  ],
  'eco-conceptual': [
    {
      doc: 'slides',
      where: 'Ecology Metrics — Conceptual models',
      quote:
        'To describe the food web changes and changes in habitat accessibility for each scenario, we will create a series of conceptual models describing ecosystem-wide interactions.',
    },
  ],

  // --- Recreation ---
  recreation: [
    {
      doc: 'ours',
      where: 'Mean change in threshold exceedance against Business as Usual',
      quote:
        'Recreation publishes no score at any level. We average the five activities’ change in exceedance against Business as Usual and negate it, because a higher share of days over threshold is the worse outcome.',
    },
    {
      doc: 'report',
      where: 'Comparative Scenarios Performance Ranking, p.391',
      quote:
        'Score -5 to 5 = 5 - 10 × (days exceeding threshold / total days in that period (month))',
    },
  ],
  'rec-salinity': [
    {
      doc: 'data',
      where: 'RMA Salinity Scenarios Analyzed.xlsx · OVERALL · Notes 2',
      quote:
        'Scenario rankings (-5 to 5 vs BAU) reflect that BAF is effectively the same as BAU, scoring at 0, except for one instance for Central Delta Day use (Total Run). Tunnel performs the worst, scoring -2 to -5 across both Suisun Marsh and the Central Delta, and is the only scenario that pushes Southern Delta boating and day uses over the threshold during wet seasons (84%) or greater than a -5 move on the charts. Calling on Reserves (COR) is the second worst scenario across Suisun and the Central Delta, but having one surprising movement of (+2) in the wet seasons.',
    },
    {
      doc: 'ours',
      where: 'Mean of the four activity scores',
      quote:
        'The criterion score is the mean of day use and boating, birding, waterfowl and angling, Delta-wide, whole run.',
    },
  ],
  'rec-temperature': [
    {
      doc: 'data',
      where: 'RMA Temperature Scenarios Analyzed.xlsx · Overall · Notes 2',
      quote:
        'RMA scenario -5 to 5 rankings show that all four models are evenly distributed across most breakdowns, Delta-wide and regional, with notable exceptions: ECO and NGW performing well in Suisun Marsh, with a 1% increase for Day use and Boating Total Run, and in dry seasons. Likewise, they showed positive moves for birding and angling during wet seasons. Negative moves of (-1%) during the dry season also appear in Suisun Marsh, making it the only region affected under the -5 to 5 scoring scenario, with both waterfowl and Angling performing worse than BAU.',
    },
  ],
  'rec-restoration': [
    {
      doc: 'slides',
      where: 'Restoration — Waterfowl & Shorebird Seasonal Wetland Deficits',
      quote:
        'Shorebird Wetland Deficit 21,454; Waterfowl Wetland Deficit 21,336; NGW 0.25 MW 56,286 (+264%); NGW 0.5 MW 102,982 (+483%); NGW Full MW 248,815 (+1166%)',
    },
  ],
  'rec-economy': [
    {
      doc: 'slides',
      where: 'Results — Visitor-sector Earnings by Water Year',
      quote:
        'Earnings by place of work (BEA Regional Economic Accounts): Arts, entertainment and recreation, & Accommodation and food services',
    },
  ],

  // --- EJ ---
  environmentalJustice: [
    {
      doc: 'slides',
      where: 'Overall EJ Score: Adaptation Scenarios',
      quote:
        'Business As Usual 0 / 0; Bolster and Fortify 0.33 / 0; Eco Machine 0 / 0; New Green Watershed 0.66 / 1; Calling on Reserves Pending; A Tunnel Pending (Raw / Rounded)',
    },
  ],
  'ej-drinking': [
    {
      doc: 'report',
      where: 'Tables 3 and 4 — percentage of run exceeding 1,050 µS/cm',
      quote:
        'Table 3. Percentage of run exceeding 1,050 𝜇/cm in each adaptation scenario run. … Table 4. … broken down by season.',
    },
  ],
  'ej-flood': [
    {
      doc: 'slides',
      where: 'Flood Risk: Results & Ranking',
      quote:
        'No Change: 0 — Eco Machine, Calling on Reserves. Slight Decrease: 1 — A Tunnel. Moderate Decrease: 2 — Bolster and Fortify. Significant Decrease: 3 — New Green Watershed.',
    },
  ],
  'ej-waterage': [
    {
      doc: 'slides',
      where: 'Scenario Ranking: Water Age',
      quote:
        'Business As Usual 0; Bolster and Fortify −1; Eco Machine −2; New Green Watershed −3; Calling on Reserves (Pending); A Tunnel (Pending)',
    },
  ],
  'ej-waterage-days': [
    {
      doc: 'slides',
      where: 'Change in Average Days from Business As Usual',
      quote:
        'Suisun Marsh & Surrounding Wetlands +0.1 / +7.9 / +8.0; Franks Tract +2.2 / +5.2 / +5.3; South Delta −0.5 / +0.3 / +0.4; Lindsey-Cache Slough 0 / +0.4 / +3.9; McCormack-Williamson Tract 0 / +0.5 / +0.6 (Bolster and Fortify / Eco Machine / New Green Watershed)',
    },
  ],
  'ej-waterage-grid': [
    {
      doc: 'report',
      where: 'Water age and temperature — monthly change ladder',
      quote:
        'The report’s own slight → extreme ladder across 5 hotspot regions and 13 months with water temperature consistently over 19 °C.',
    },
  ],

  // --- Economy ---
  economy: [
    {
      doc: 'slides',
      where: 'Scenario Ranking: Economy',
      quote:
        'Same score for gross revenue, jobs and value added. 0 = Business As Usual. A Tunnel: results pending.',
    },
  ],
  'econ-value-zones': [
    {
      doc: 'slides',
      where:
        'Delta Sub-regional Zones — Value Added Difference by Delta Subregion and Scenario, Dry Year 2020',
      quote:
        'Values show scenario − baseline. Each panel uses its own color scale to improve visibility of small differences. (Published as a 736 × 292 image; three of the sixteen figures are not legible at that size.)',
    },
  ],
  'econ-revenue-salinity': [
    {
      doc: 'slides',
      where: 'Salinity Pathway: Gross Revenue',
      quote:
        'Base: $1.107 billion/yr. Largest dry-year loss: Bolster and Fortify, –$34,000 (–0.003%), mostly Central Delta. Calling on Reserves: about –$1,000 (dry) and +$4,000 (wet). Wet year: New Green Watershed salinity run +$468,000 (+0.04%).',
    },
  ],
  'econ-jobs-salinity': [
    {
      doc: 'slides',
      where: 'Salinity Pathway: Jobs and Value Added',
      quote:
        'All changes below 0.01% of the Delta baseline (11,860 jobs; $1.0 billion value added). Largest job change: +0.13 jobs (Eco Machine, dry year).',
    },
  ],
  'econ-value-salinity': [
    {
      doc: 'slides',
      where: 'Salinity Pathway: Jobs and Value Added',
      quote: 'Largest value-added loss: –$9,500 (Bolster and Fortify, dry year).',
    },
  ],

  // --- Eco-cultural ---
  ecoCultural: [
    {
      doc: 'slides',
      where: 'Overall Score: Adaptation Scenarios',
      quote:
        'Business As Usual 0; Bolster and Fortify 0; Eco Machine +2; New Green Watershed +4; Calling on Reserves +1; A Tunnel −2',
    },
  ],
  'ec-restoration': [
    {
      doc: 'slides',
      where: 'Restoration Results & Scenario Ranking: Adaptation Scenarios',
      quote:
        'Business As Usual 0; Bolster and Fortify 0; Eco Machine +2; New Green Watershed +5; Calling on Reserves 0; A Tunnel 0',
    },
    {
      doc: 'slides',
      where: 'Restoration Ranges',
      quote:
        'ECO MACHINE — Suisun Marsh tidal wetland restoration 41,720 acres; Franks Tract 1,380 acres. NEW GREEN WATERSHED — In-Delta: 248,815 restored acres. Watershed (upland): managed wetland 48,213–207,004; meadow 11,586–347,591; floodplain 6,360–303,372.',
    },
  ],
}

/** Families built by a generator; every sibling shares the table it came from. */
const SOURCE_PREFIXES: [string, Source[]][] = [
  [
    'eco-niche-',
    [
      {
        doc: 'report',
        where: 'Species fundamental niches — region × water year tables',
        quote:
          'Share of days inside each species’ salinity and temperature bracket, by region, for water years 2019 and 2020. A Tunnel was never run.',
      },
    ],
  ],
  [
    'eco-foodweb-',
    [
      {
        doc: 'report',
        where: 'The total acreages of the three different landscape types are below',
        quote:
          'New Green Watershed 2 (50% managed, 50% wet soil ag): managed wetland 120,814; additional tidal wetland 80,000; wet soil ag 128,001. Eco Machine: 5,100 (baseline); 53,000; 17,178 (baseline).',
      },
    ],
  ],
  [
    'eco-habitat-',
    [
      {
        doc: 'report',
        where: 'The total acreages of the three different landscape types are below',
        quote:
          'Total additional tidal wetland acreage — New Green Watershed 80,000; Eco Machine 53,000.',
      },
    ],
  ],
  [
    'rec-salinity-',
    [
      {
        doc: 'data',
        where:
          'RMA Salinity Scenarios Analyzed.xlsx · OVERALL · TOTAL RUN, WET SEASON and DRY SEASON SCORES; % EXCEEDANCES by scenario',
        quote:
          'Ranking / Scale: 5 greater than or equal to 5% less; 4 4% less; 3 3% less; 2 2% less; 1 1% less; 0 No change from baseline; -1 1% more than baseline; -2 2% more; -3 3% more; -4 4% more; -5 greater than or equal to 5% more',
      },
    ],
  ],
  [
    'rec-temperature-',
    [
      {
        doc: 'data',
        where:
          'RMA Temperature Scenarios Analyzed.xlsx · Overall · TOTAL RUN, WET SEASON and DRY SEASON SCORES; % EXCEEDANCES by scenario',
        quote:
          'Dry seasons drive dangerous threshold-crossing days for activities and recreation important species alike. Cold water, by contrast, applies only to day use (<18C) and crosses threshold days across four exceedance models during the wet seasons, Delta-wide at over 90% rates.',
      },
    ],
  ],
  [
    'ej-drinking-',
    [
      {
        doc: 'report',
        where: 'Tables 3 and 4 — percentage of run exceeding 1,050 µS/cm',
        quote:
          'Exceedance Percentage by Vulnerability Index: Moderate (n = 10), High (n = 36), Highest (n = 3), and Total Run Exceedance; Table 4 repeats it for wet and dry season.',
      },
    ],
  ],
  [
    'econ-revenue-',
    [
      {
        doc: 'slides',
        where: 'New Green Watershed: Land Conversion',
        quote:
          'Full MW 207,004 ac — Direct revenue change –$504.5M (-45.6%); 0.5MW 85,523 ac — –$282.5M (-25.5%); 0.25MW 48,213 ac — –$212.4M (-19.2%)',
      },
    ],
  ],
  [
    'econ-jobs-',
    [
      {
        doc: 'slides',
        where: 'New Green Watershed: Land Conversion',
        quote:
          'Total jobs change — Full MW -5,125 (-43.4%); 0.5MW -4,121 (-34.9%); 0.25MW -3,783 (-32.0%)',
      },
    ],
  ],
  [
    'econ-value-',
    [
      {
        doc: 'report',
        where: 'Value added — Direct and Total change by restoration level',
        quote:
          'Full MW: Direct change approx. –$307M/yr (–46%). 0.5MW: approx. –$141M/yr (–21%). 0.25MW: approx. –$89M/yr (–13%).',
      },
    ],
  ],
  [
    'ec-restoration-',
    [
      {
        doc: 'report',
        where: 'Table 4: RESTORED ACRES — NEW GREEN WATERSHED IN-DELTA SUB-SCENARIOS',
        quote:
          'Sub-scenario 2: 50/50 (primary scenario) — managed wetlands 102,982 acres; wet soil ag (rice) 145,833 acres.',
      },
    ],
  ],
]

/** Every citation recorded for a node, most specific first. */
export function sourcesFor(id: string): Source[] {
  if (SOURCES[id]) return SOURCES[id]
  const prefixed = SOURCE_PREFIXES.filter(([prefix]) => id.startsWith(prefix))
  // Longest prefix wins, so eco-foodweb-managed does not match eco-foodweb-.
  prefixed.sort((a, b) => b[0].length - a[0].length)
  return prefixed[0]?.[1] ?? []
}
