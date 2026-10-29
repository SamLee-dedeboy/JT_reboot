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
import type { EcologySpeciesKey } from './ecologyNiche'
import { WATER_AGE_GRID, WATER_AGE_MONTHS, WATER_AGE_REGIONS } from './ejWaterAge'
import {
  REC_SALINITY_DAYS,
  REC_SALINITY_SCORES,
  REC_SLR_SALINITY_DAYS,
  REC_SLR_SALINITY_SCORES,
  REC_SLR_TEMPERATURE_DAYS,
  REC_SLR_TEMPERATURE_SCORES,
  REC_TEMPERATURE_DAYS,
  REC_TEMPERATURE_SCORES,
} from './recreationThresholds'
import type { RecActivityKey, RecTable } from './recreationThresholds'
import { ECOLOGY_SLR_DELTA, ECOLOGY_SLR_REGION, EJ_SLR_DRINKING } from './seaLevelRise'
import { ANY, sliceKey } from './model'
import type { ClimateRun, CriterionNode, Facet, ScenarioKey, SliceValues, Source } from './model'
import { roundScore } from '../data'
import type { TeamKey } from '../data'

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

// ---------- Sea level rise ----------

/**
 * Which teams' tables can switch to the sea-level-rise runs. 'pending' shows the
 * switch disabled, for a team whose SLR runs have arrived but are not loaded yet.
 */
export const SLR_STATUS: Partial<Record<TeamKey, 'loaded' | 'pending'>> = {
  ecology: 'loaded',
  environmentalJustice: 'loaded',
  recreation: 'loaded',
  economy: 'loaded',
}

/** Ecology pools its sea-level-rise regions over both years; the period says so. */
const ECO_SLR_PERIODS: Facet[] = [...YEARS, { key: 'both', label: '2019–20 together' }]

const ECO_SLR_SOURCES: Source[] = [
  {
    doc: 'data',
    where: 'Sea Level Rise Scenario Analysis - Eco, 15 Oct 2026 · Results and Results part 2',
    quote:
      'Overall scenario proportions of days, under the sea level rise scenarios. … The top value in each cell is the proportion of suitable days between 2019 and 2020, and the bottom number is the number of consecutive days.',
  },
]

function ecologySlr(species: EcologySpeciesKey): ClimateRun {
  const values: Partial<Record<ScenarioKey, SliceValues>> = {}
  const regions = ECOLOGY_SLR_REGION[species]
  for (const [scenario, [wet, dry]] of Object.entries(ECOLOGY_SLR_DELTA[species])) {
    const series: SliceValues = {
      [sliceKey('delta', '2019')]: wet,
      [sliceKey('delta', '2020')]: dry,
    }
    for (const [region, value] of Object.entries(regions[scenario as keyof typeof regions])) {
      series[sliceKey(region, 'both')] = value
    }
    values[scenario as ScenarioKey] = series
  }
  return {
    periods: ECO_SLR_PERIODS,
    values,
    note: 'With sea level rise, against its own Business as Usual. Delta-wide is split by water year; each region is one number for 2019 and 2020 together. Calling on Reserves and A Tunnel were not run with sea level rise.',
    sources: ECO_SLR_SOURCES,
  }
}

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
    note: `Proportion of days within ${species.salinity} and ${species.temperature}; A Tunnel was run only on the 27 Oct base, shown on the Ecology page.`,
    places: ECO_PLACES,
    periods: YEARS,
    values,
    slr: ecologySlr(species.key),
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
  note: 'Neither source gives an overall score, so this acreage score is the mean of two acreage ranks, landscape and food web, rounded to a whole point. The species work now ranks each species, but those ranks do not affect this score.',
  places: NO_FACET,
  periods: NO_FACET,
  values: flat({ ngw: roundScore((5 + 4) / 2), em: 2, bf: 0, cor: 0, tunnel: 0, bau: 0 }),
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
      slr: {
        periods: ECO_SLR_PERIODS,
        values: {},
        note: 'The sea-level-rise analysis covers the same eight species, under four scenarios. Open this metric to read them.',
        sources: ECO_SLR_SOURCES,
      },
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

const REC_SLR_NOTE =
  'With sea level rise, against the SLR run’s own Business as Usual: the same activities, regions and periods for every scenario. Calling on Reserves and A Tunnel are CalSim runs, scored against CalSim’s own Business as Usual with sea level rise.'

function recSlrSources(metric: 'salinity' | 'temperature'): Source[] {
  const book =
    metric === 'salinity' ? 'RMA SLR Salinity Analyzed.xlsx' : 'RMA SLR Temperature Analyzed.xlsx'
  return [
    {
      doc: 'data',
      where: `${book} · OVERALL · TOTAL RUN, WET SEASON and DRY SEASON SCORES; % EXCEEDANCES by scenario`,
      quote:
        'Ranking / Scale: 5 greater than or equal to 5% less; … 0 No change from baseline; … -5 greater than or equal to 5% more',
    },
  ]
}

/** An SLR run for a Recreation node, in the same region × period slices as today's. */
function recSlr(
  metric: 'salinity' | 'temperature',
  values: Partial<Record<ScenarioKey, SliceValues>>,
): ClimateRun {
  return { values, note: REC_SLR_NOTE, sources: recSlrSources(metric) }
}

function recActivityNode(
  metric: 'salinity' | 'temperature',
  spec: RecActivitySpec,
  scores: RecTable<number | null>,
  days: RecTable<number | null>,
  slrScores: RecTable<number | null>,
  slrDays: RecTable<number | null>,
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
    note: `The subteam’s own score for this activity, by region and period: one point per percentage point of days over the threshold against Business as Usual, ±5 at five points or more. Calling on Reserves and A Tunnel are scored against CalSim’s Business as Usual instead. Threshold: ${threshold}. ${spec.season}.`,
    places: REC_PLACES,
    periods: SEASON_FACETS,
    values: recValues(scores, spec.key),
    slr: recSlr(metric, recValues(slrScores, spec.key)),
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
        note: `Proportion of days whose daily mean crosses the ${metric} threshold (${threshold}), at 32 points in 4 regions, Oct 2018–Dec 2020. The score above is read from this. Calling on Reserves and A Tunnel come from CalSim runs, whose own Business as Usual differs from RMA’s, so their days compare with each other rather than with the Business as Usual column here.`,
        places: REC_PLACES,
        periods: SEASON_FACETS,
        values: recValues(days, spec.key),
        slr: recSlr(metric, recValues(slrDays, spec.key)),
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

const REC_SLR_SALINITY_MEAN = recMean(REC_SLR_SALINITY_SCORES, REC_SALINITY_KEYS)
const REC_SLR_TEMPERATURE_MEAN = recMean(
  REC_SLR_TEMPERATURE_SCORES,
  REC_ACTIVITIES.map((spec) => spec.key),
)

/** Values in REC_PLACES order (Delta-wide first); null where the sheet says NA. */
function byRecPlace(by: Partial<Record<ScenarioKey, (number | null)[]>>) {
  const out: Partial<Record<ScenarioKey, SliceValues>> = {}
  for (const [scenario, values] of Object.entries(by)) {
    const series: SliceValues = {}
    REC_PLACES.forEach((place, i) => {
      if (values?.[i] !== null && values?.[i] !== undefined)
        series[sliceKey(place.key, ANY)] = values[i]
    })
    out[scenario as ScenarioKey] = series
  }
  return out
}

/**
 * The four Delta regions in REC_PLACES order, with Delta-wide as their sum: the
 * sheets' own Delta-wide totals add an upland band outside the Delta, which is
 * left out here.
 */
function byRecRegion(by: Partial<Record<ScenarioKey, (number | null)[]>>) {
  return byRecPlace(
    Object.fromEntries(
      Object.entries(by).map(([scenario, regions]) => [
        scenario,
        [(regions ?? []).reduce<number>((sum, v) => sum + (v ?? 0), 0), ...(regions ?? [])],
      ]),
    ),
  )
}

/**
 * Recreation's "Overall $" sheet (26 Oct 2026) as published, $M a year (2025): New
 * Green Watershed's 50% restoration and Business as Usual (existing protected land,
 * CPAD) by Delta region, with New Green Watershed's −5…+5 score against Business
 * as Usual (Delta-wide first, as the sheet scores it). `emAdded` is what Eco
 * Machine's restoration adds on top of Business as Usual, Delta-wide only
 * ("Recreation The Score.xlsx", table 2), where every service scores +5.
 * `quarter` and `full` are New Green Watershed at 25% and 100% restoration, by
 * region, from the same sheet's "Ecosystem service value by scenario" table.
 */
const REC_ECONOMY_SERVICES: {
  key: string
  label: string
  ngw: number[]
  quarter: number[]
  full: number[]
  bau: number[]
  score: number[]
  emAdded: number
}[] = [
  {
    key: 'amenity',
    label: 'Amenity and recreation · day use and boating',
    ngw: [15.613, 15.747, 20.865, 23.127],
    quarter: [15.613, 10.939, 20.865, 10.541],
    full: [15.613, 15.747, 22.767, 54.682],
    bau: [6.757, 8.875, 20.865, 3.845],
    score: [5, 5, 5, 0, 5],
    emAdded: 16.127,
  },
  {
    key: 'biodiversity',
    label: 'Biodiversity · birding',
    ngw: [6.791, 6.849, 9.075, 10.059],
    quarter: [6.791, 4.758, 9.075, 4.585],
    full: [6.791, 6.849, 9.903, 23.785],
    bau: [2.939, 3.86, 9.075, 1.672],
    score: [5, 5, 5, 0, 5],
    emAdded: 7.015,
  },
  {
    key: 'hunting',
    label: 'Recreational hunting · waterfowl',
    ngw: [3.903, 3.937, 5.216, 5.782],
    quarter: [3.903, 2.735, 5.216, 2.635],
    full: [3.903, 3.937, 5.691, 13.67],
    bau: [1.689, 2.219, 5.216, 0.961],
    score: [5, 5, 5, 0, 5],
    emAdded: 4.032,
  },
  {
    key: 'fishing',
    label: 'Recreational fishing · angling',
    ngw: [11.868, 11.97, 15.86, 17.58],
    quarter: [11.868, 8.315, 15.86, 8.013],
    full: [11.868, 11.97, 17.306, 41.567],
    bau: [5.136, 6.746, 15.86, 2.923],
    score: [5, 5, 5, 0, 5],
    emAdded: 12.259,
  },
]

/**
 * The criterion score as Recreation computes it ("Recreation The Score.xlsx", 26 Oct
 * 2026): the whole-run activity means for salinity and temperature, today and with
 * sea level rise, averaged with equal weight, (A + A SLR + B + B SLR) / 4, at each
 * place, rounded to a whole point (the sheet keeps the decimals).
 */
function recCriterion(
  ...means: Partial<Record<ScenarioKey, SliceValues>>[]
): Partial<Record<ScenarioKey, SliceValues>> {
  const out: Partial<Record<ScenarioKey, SliceValues>> = {}
  for (const scenario of Object.keys(means[0]) as ScenarioKey[]) {
    const series: SliceValues = {}
    for (const place of REC_PLACES) {
      const parts = means.map((mean) => mean[scenario]?.[sliceKey(place.key, 'run')] ?? null)
      series[sliceKey(place.key, ANY)] = parts.some((part) => part === null)
        ? null
        : roundScore(parts.reduce<number>((sum, part) => sum + (part ?? 0), 0) / parts.length)
    }
    out[scenario] = series
  }
  return out
}
const REC_CRITERION = recCriterion(
  REC_SALINITY_MEAN,
  REC_SLR_SALINITY_MEAN,
  REC_TEMPERATURE_MEAN,
  REC_SLR_TEMPERATURE_MEAN,
)

const REC_SCORE_SOURCE: Source = {
  doc: 'data',
  where: 'Recreation The Score.xlsx (Recreation, 26 Oct 2026) · Recreation Score · tables 1 and 4',
  quote:
    'RECREATION: THE SCORE — BAU 0, BAF 0, ECO −0.375, NGW −0.375, COR vs CS 0.0625, Tunnel vs CS −0.125. Table 1 combines Standard + SLR hydrology: (A Std + A SLR + B Std + B SLR) / 4.',
}

const RECREATION: CriterionNode = {
  id: 'recreation',
  label: 'Recreation',
  level: 'team',
  team: 'recreation',
  provenance: 'reported',
  unit: 'score',
  betterHigher: true,
  note: 'Recreation’s own score (26 Oct 2026): the mean of four equally weighted parts, salinity and temperature, each today and with sea level rise, where each part is the mean of its activity scores over the whole run, rounded to a whole point. Delta-wide every scenario rounds to 0 (unrounded: Calling on Reserves +0.06, A Tunnel −0.13, Eco Machine and New Green Watershed −0.38). Calling on Reserves and A Tunnel are scored against CalSim’s Business as Usual. Suisun Marsh drives the losses (Eco Machine and New Green Watershed −1.83 there, −2 rounded) and the Central Delta the gains (+0.56). Habitat restoration and recreation economy are scored separately and do not enter it.',
  places: REC_PLACES,
  periods: NO_FACET,
  values: REC_CRITERION,
  sources: [REC_SCORE_SOURCE],
  // The score already blends both climates, so it reads the same under either.
  slr: {
    values: REC_CRITERION,
    note: 'Recreation’s score already averages today’s runs with the sea-level-rise runs, so it is the same under either climate.',
    sources: [REC_SCORE_SOURCE],
  },
  children: [
    {
      id: 'rec-salinity',
      label: 'Salinity thresholds',
      level: 'metric',
      team: 'recreation',
      edge: 'averages',
      provenance: 'reported',
      unit: 'score',
      betterHigher: true,
      note: 'The mean of the four activity scores at each region and period (Recreation’s component A). Its whole-run value, today and with sea level rise, makes up half of the criterion score. Exceedance concentrates in Suisun Marsh and the Central Delta, while the North and South Delta sit near 0% for every activity. Eco Machine and New Green Watershed lose heavily in Suisun Marsh (−4 to −5 for birding, waterfowl and angling) and gain in the Central Delta. Against CalSim’s Business as Usual, A Tunnel is slightly worse and Calling on Reserves slightly better. Bolster & Fortify scores 0 everywhere but the Central Delta’s day use.',
      places: REC_PLACES,
      periods: SEASON_FACETS,
      values: REC_SALINITY_MEAN,
      slr: recSlr('salinity', REC_SLR_SALINITY_MEAN),
      children: REC_SALINITY_ACTIVITIES.map((spec) =>
        recActivityNode(
          'salinity',
          spec,
          REC_SALINITY_SCORES,
          REC_SALINITY_DAYS,
          REC_SLR_SALINITY_SCORES,
          REC_SLR_SALINITY_DAYS,
        ),
      ),
    },
    {
      id: 'rec-temperature',
      label: 'Temperature thresholds',
      level: 'metric',
      team: 'recreation',
      edge: 'averages',
      provenance: 'reported',
      unit: 'score',
      betterHigher: true,
      note: 'The same construction against temperature thresholds over five activities (Recreation’s component B); its whole-run value, today and with sea level rise, makes up the other half of the criterion score. Over the whole run every scenario is 0 Delta-wide; the only regional moves are New Green Watershed and Eco Machine’s cold-water day use in Suisun Marsh (+1) and A Tunnel’s waterfowl in the Central and North Delta (−1). Dry seasons drive the crossings; cold water matters only for day use, in wet seasons.',
      places: REC_PLACES,
      periods: SEASON_FACETS,
      values: REC_TEMPERATURE_MEAN,
      slr: recSlr('temperature', REC_SLR_TEMPERATURE_MEAN),
      children: REC_ACTIVITIES.map((spec) =>
        recActivityNode(
          'temperature',
          spec,
          REC_TEMPERATURE_SCORES,
          REC_TEMPERATURE_DAYS,
          REC_SLR_TEMPERATURE_SCORES,
          REC_SLR_TEMPERATURE_DAYS,
        ),
      ),
    },
    {
      id: 'rec-restoration',
      label: 'Restoration',
      level: 'metric',
      team: 'recreation',
      edge: 'unscored',
      provenance: 'reported',
      unit: 'acres',
      betterHigher: true,
      note: 'Acres as Recreation’s “Overall Restoration (Acres)” sheet gives them (26 Oct 2026): New Green Watershed at its middle (50%) bound; Eco Machine (NA in the North and South Delta); Business as Usual as existing protected areas. Delta-wide is the sum of the four regions; the sheet’s own totals add an upland band outside the Delta, which is left out. Bolster & Fortify, Calling on Reserves and A Tunnel are not in the sheet. Every New Green Watershed version exceeds the CVJV 2020 deficits of 21,454 shorebird and 21,336 waterfowl acres, which is why Recreation favours it.',
      places: REC_PLACES,
      periods: NO_FACET,
      values: byRecRegion({
        ngw: [41720, 66946.765, 283904.184, 277681.437],
        em: [41720, 1380, null, null],
        bau: [18138.948, 23825.864, 56014.074, 10321.817],
      }),
      notApplicableAt: { em: ['northDelta', 'southDelta'] },
    },
    {
      id: 'rec-economy',
      label: 'Recreation economy',
      level: 'metric',
      team: 'recreation',
      edge: 'unscored',
      provenance: 'reported',
      unit: 'dollars',
      betterHigher: true,
      note: 'Recreation’s “Overall $” sheet (26 Oct 2026) as published: the yearly value of four recreation services, in 2025 dollars, for New Green Watershed at 50% restoration and for Business as Usual (existing protected land), each with a score against Business as Usual. Per-acre values are from Brander and Schuyt (2004), adjusted by the CPI. Delta-wide is the sum of the four regions (the sheet’s own Delta-wide adds an upland band outside the Delta, which is left out); the Delta-wide score is the sheet’s. The team scores each service and publishes no single economy score; the sheet has no Eco Machine, Bolster & Fortify, Calling on Reserves or A Tunnel column. Separately, visitor-sector earnings 2001–2023 run +19.6% in critical years and +20.3% in wet years but −21.8% in dry and −27.5% in above-normal years.',
      places: REC_PLACES,
      periods: NO_FACET,
      values: {},
      children: REC_ECONOMY_SERVICES.map(recService),
    },
  ],
}

// ---------- EJ and vulnerable communities ----------

/** One vulnerability class: exceedance of 1,050 µS/cm, by season. */
function vulnerabilityNode(
  key: keyof typeof EJ_SLR_DRINKING,
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
    slr: ejSlr(key),
  }
}

/**
 * The SLR workbook splits by water year where the report split by season, so the
 * periods change with the climate rather than pretending a year is a season.
 */
const EJ_SLR_PERIODS: Facet[] = [{ key: 'run', label: 'Whole run' }, ...YEARS]

function ejSlr(key: keyof typeof EJ_SLR_DRINKING): ClimateRun {
  return {
    periods: EJ_SLR_PERIODS,
    values: byPeriod(['run', '2019', '2020'], EJ_SLR_DRINKING[key]),
    note: 'With sea level rise, against its own Business as Usual: the share of SAFER points over 1,050 µS/cm for the whole run and each water year. Calling on Reserves and A Tunnel were not run with sea level rise, and no score was published for these runs.',
    sources: [
      {
        doc: 'data',
        where: 'SLR COMM.xlsx · OVERALL - SLR (SAFER POINTS) · TOTAL, WY 19, WY 20',
        quote:
          '% moderate exceedances … % high exceedances … % highest exceedances … % TOTAL EXCEEDANCES',
      },
    ],
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
          slr: ejSlr('all'),
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
  'Reported Delta-wide and by four Delta zones — North, Central and South Delta on water-agency boundaries, plus West Delta — for a wet (2019) and a dry (2020) water year, under current climate and with 2 ft of sea level rise. Suisun Marsh sits outside the zones and enters only through the Eco Machine land-use estimate.'

/**
 * Why a −4 and a −1 sit side by side.
 *
 * Two pathways reach one score. The land-use pathway converts farmland: New
 * Green Watershed's three restoration levels, and Eco Machine's small farmed
 * share of Suisun Marsh. Every scenario is also run through the salinity pathway,
 * which converts nothing; the v16 workbook tables it in full, for both water years
 * and both climates.
 */
const ECONOMY_GAP =
  'The rows below come from two different pathways. The restoration levels are New Green Watershed’s land conversion. The salinity row carries all six scenarios. The v16 report’s “Comparative Scenario Performance Ranking” states the method: −5 to +5 anchored at 0 for Business as Usual, and each scenario scored “on whichever effect actually dominates for it, rather than forcing every scenario onto one percent-based scale”. Land use dominates for New Green Watershed and Eco Machine; salinity decides Bolster & Fortify, Calling on Reserves and A Tunnel. That is why a −4 from −25.5% of revenue sits beside a −1 from −0.002%. The report gives no step size: nothing says why −$10,000 (Bolster & Fortify) or −$27,000 (A Tunnel) is −1 while +$2,900 (Calling on Reserves) is 0, or why the three restoration levels land on −3, −4 and −5.'

/** v16 compares Calling on Reserves and A Tunnel with RMA's own base run delivered with them. */
const ECONOMY_REFERENCE =
  'Business As Usual, Eco Machine, New Green Watershed and Bolster & Fortify are compared with Business as Usual in the same climate; Calling on Reserves and A Tunnel with the RMA base run delivered with them (BaseCalSim), which differs from Business as Usual by under $1,000 a year Delta-wide.'

const ECONOMY_DATA: Source = {
  doc: 'data',
  where:
    'JT_Economy_results_for_dataviz_v16.xlsx (25 Oct 2026) · DeltaWide_vs_BAU, COR_Tunnel_DeltaWide',
  quote:
    'DeltaWide_vs_BAU — each scenario minus Business As Usual in the same climate (current or 2 ft SLR). COR_Tunnel_DeltaWide — Calling on Reserves and A Tunnel compared with their own RMA base run.',
}

const ECONOMY_SCORE_SOURCE: Source = {
  doc: 'report',
  where:
    'The Story Behind the Criterion: Economy, v16 (25 Oct 2026) · Comparative Scenario Performance Ranking',
  quote: 'Scores apply to both current climate and 2 ft sea-level rise for all scenarios.',
}

const ECONOMY_LAND_USE_SOURCE: Source = {
  doc: 'data',
  where: 'JT_Economy_results_for_dataviz_v16.xlsx (25 Oct 2026) · README',
  quote:
    'New Green Watershed and Eco Machine salinity results here are the salinity pathway only. Their land-use effects (farmland conversion) are unchanged from the v13 memo and drive their scores.',
}

const ECONOMY_ZONE_SOURCE: Source = {
  doc: 'data',
  where:
    'JT_Economy_results_for_dataviz_v16.xlsx (25 Oct 2026) · ByZone, Dry (2020), total value added',
  quote:
    'ByZone — gross revenue, total value added and total jobs change … by Delta zone. To get a same-climate comparison, subtract the BaseCalSim 2 ft SLR row.',
}

const ECONOMY_ZONES: Facet[] = [
  { key: 'north', label: 'North Delta' },
  { key: 'central', label: 'Central Delta' },
  { key: 'south', label: 'South Delta' },
  { key: 'west', label: 'West Delta' },
]

type ZoneTable = Partial<Record<ScenarioKey, [number, number, number, number]>>

/**
 * Change in total value added by zone (North, Central, South, West), dry year
 * 2020, salinity pathway (US$), from the v16 ByZone sheet against the same
 * reference in the same climate. The sheet gives sea-level-rise rows against
 * today's reference; those are rebased here on the reference's own SLR row, as
 * its README says to do, so each zone sums to the Delta-wide figure.
 */
const ZONE_VALUE_ADDED: ZoneTable = {
  ngw: [463, -1993, 1113, 2327],
  em: [605, -712, 1813, 2529],
  cor: [138, 1311, 705, 512],
  bf: [-528, -8548, -1084, 2104],
  tunnel: [-251, -18821, -2513, -2405],
  bau: [0, 0, 0, 0],
}

const ZONE_VALUE_ADDED_SLR: ZoneTable = {
  ngw: [3256, -4123, 9730, 10189],
  em: [3357, 160, 11648, 11030],
  cor: [480, 2919, 245, 1717],
  bf: [-4244, -25145, 481, 7975],
  tunnel: [-984, -19825, 3296, 1644],
  bau: [0, 0, 0, 0],
}

function zoneValues(table: ZoneTable) {
  const out: Partial<Record<ScenarioKey, SliceValues>> = {}
  for (const [scenario, byZone] of Object.entries(table)) {
    const series: SliceValues = {}
    ECONOMY_ZONES.forEach((zone, i) => {
      series[sliceKey(zone.key, ANY)] = byZone[i]
    })
    out[scenario as ScenarioKey] = series
  }
  return out
}

type WetDry = Partial<Record<ScenarioKey, [number, number]>>

/**
 * The pathway that decides Bolster & Fortify, Calling on Reserves and A Tunnel:
 * modelled salinity changes crop yields, and no land changes hands. Every scenario
 * is run through it; for Eco Machine and New Green Watershed it is outweighed by
 * land use. Values are [wet 2019, dry 2020], from the v16 workbook.
 */
function salinityPathway(
  metric: string,
  unit: 'usd' | 'jobs',
  current: WetDry,
  slr: WetDry,
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
    values: byPeriod(['2019', '2020'], current),
    sources: [ECONOMY_DATA],
    slr: {
      values: byPeriod(['2019', '2020'], slr),
      note: `With 2 ft of sea level rise, against the same reference with sea level rise. ${ECONOMY_REFERENCE} Sea level rise itself lowers dry-year farm revenue by $55,000–$93,000 a year depending on the scenario, and wet-year revenue by under $1,700.`,
      sources: [ECONOMY_DATA],
    },
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
    // Land conversion does not depend on sea level; the report carries it unchanged.
    slr: {
      values: { ngw: { [sliceKey(ANY, ANY)]: value } },
      note: 'Land conversion is the same with sea level rise: the report carries these figures unchanged into the 2 ft runs, and its scores (−3, −4, −5) do not change.',
      sources: [ECONOMY_LAND_USE_SOURCE],
    },
  }))
}

/** One score for all three metrics, the same under current climate and 2 ft of sea level rise. */
const ECONOMY_SCORES = { ngw: -4, em: 0, bf: -1, cor: 0, tunnel: -1, bau: 0 }

/** The score row's sea-level-rise run: the v16 Scores sheet repeats every score. */
const economyScoreSlr = (): ClimateRun => ({
  values: flat(ECONOMY_SCORES),
  note: 'With 2 ft of sea level rise. The v16 report scores every scenario the same as under current climate: sea level rise lowers each by a similar small amount and does not change their order.',
  sources: [ECONOMY_SCORE_SOURCE],
})

/** One recreation service from the "Overall $" sheet: its dollars, with its score as the rank. */
function recService(spec: (typeof REC_ECONOMY_SERVICES)[number]): CriterionNode {
  return {
    id: `rec-economy-${spec.key}`,
    label: spec.label,
    level: 'entity',
    team: 'recreation',
    edge: 'measures',
    provenance: 'reported',
    unit: 'dollars',
    betterHigher: true,
    note: 'Yearly value in 2025 dollars as Recreation’s “Overall $” sheet gives it: New Green Watershed at 50% restoration, Business as Usual as existing protected land. Eco Machine is Business as Usual plus what its restoration adds, Delta-wide only (“Recreation The Score.xlsx”, 26 Oct 2026). The score beside each value is the team’s, against Business as Usual: 1 point per 1% more value, capped at ±5. North Delta has no restoration at 50%, so the sheet carries its existing protected land and scores it 0.',
    places: REC_PLACES,
    periods: NO_FACET,
    values: {
      ...byRecRegion({ ngw: spec.ngw, bau: spec.bau }),
      ...byRecPlace({
        em: [Math.round((spec.bau.reduce((sum, v) => sum + v, 0) + spec.emAdded) * 1000) / 1000],
      }),
    },
    ranks: byRecPlace({ ngw: spec.score, bau: spec.score.map(() => 0), em: [5] }),
    // Delta-wide (the four regions' sum) at 25%, 50% and 100% restoration.
    ngwLevels: [spec.quarter, spec.ngw, spec.full].map(
      (regions) => Math.round(regions.reduce((sum, v) => sum + v, 0) * 1000) / 1000,
    ) as [number, number, number],
  }
}

const ECONOMY: CriterionNode = {
  id: 'economy',
  label: 'Economy',
  level: 'team',
  team: 'economy',
  provenance: 'reported',
  unit: 'score',
  betterHigher: true,
  note: 'Each scenario receives one value based on its larger effect; the three metrics below are not combined into a mean. The v16 report (25 Oct 2026) gives one score and states that gross revenue, jobs, and value added all use it, which is why the three rows are identical. Through salinity every scenario changes gross revenue by under 0.01% of a $1.107B Delta farm economy, so land conversion decides New Green Watershed (−4 at 50/50) and Eco Machine (0), and small salinity losses decide Bolster & Fortify and A Tunnel (−1). Calling on Reserves is 0 in both water years. Every score is the same with 2 ft of sea level rise.',
  places: NO_FACET,
  periods: NO_FACET,
  values: flat(ECONOMY_SCORES),
  slr: economyScoreSlr(),
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
      note: `Dollar sales from Delta farms relative to a $1.107B/yr base. The largest salinity-only loss is A Tunnel at −$27,000 in the dry year, about 80% of it in the Central Delta. ${ECONOMY_GAP} ${ECONOMY_NOTE}`,
      places: NO_FACET,
      periods: NO_FACET,
      values: flat(ECONOMY_SCORES),
      slr: economyScoreSlr(),
      children: [
        salinityPathway(
          'econ-revenue',
          'usd',
          {
            bau: [0, 0],
            em: [-650, 3534],
            ngw: [-824, 967],
            bf: [26, -10167],
            cor: [-262, 2880],
            tunnel: [339, -26953],
          },
          {
            bau: [0, 0],
            em: [-1107, 24425],
            ngw: [-1359, 16573],
            bf: [-4, -27133],
            cor: [-348, 5674],
            tunnel: [-183, -18626],
          },
          `Change in farm gross revenue from salinity alone, against a $1,107.3M base. In the dry year A Tunnel loses about $27,000 (mostly Central Delta: Rindge Tract, Lower Roberts Island, McDonald Island, Jones Tract) and Bolster & Fortify about $10,000; Eco Machine, New Green Watershed and Calling on Reserves gain a few thousand. Wet-year effects are under $1,000. Every one is under 0.003% of the base. ${ECONOMY_REFERENCE} A full OpenAg run, which also shifts land among crops, gives effects 1.3–1.8 times these, which changes no score.`,
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
      note: `This includes direct farm jobs and the total after IMPLAN multipliers. The salinity baseline is 7,720 direct and 11,860 total jobs; New Green Watershed's land-use run uses 7,650 and 11,814, a difference the report does not reconcile. The rows below show total jobs. The largest salinity-only change is A Tunnel at −0.25 jobs in the dry year. ${ECONOMY_GAP} ${ECONOMY_NOTE}`,
      places: NO_FACET,
      periods: NO_FACET,
      values: flat(ECONOMY_SCORES),
      slr: economyScoreSlr(),
      children: [
        salinityPathway(
          'econ-jobs',
          'jobs',
          {
            bau: [0, 0],
            em: [-0.01, 0.09],
            ngw: [-0.01, 0.06],
            bf: [0, -0.06],
            cor: [0, 0.03],
            tunnel: [0, -0.25],
          },
          {
            bau: [0, 0],
            em: [-0.01, 0.47],
            ngw: [-0.01, 0.38],
            bf: [0, -0.15],
            cor: [0, 0.07],
            tunnel: [-0.01, -0.12],
          },
          `Change in total jobs (with IMPLAN multipliers) from salinity alone, against 11,860 total jobs. No scenario moves employment by more than about half a job. ${ECONOMY_REFERENCE}`,
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
      note: `Wages, business income, and taxes after revenue circulates, approximately regional GDP: $671M direct and $999M with multipliers. The largest salinity-only loss is A Tunnel at −$24,000 total value added in the dry year. ${ECONOMY_GAP} ${ECONOMY_NOTE}`,
      places: NO_FACET,
      periods: NO_FACET,
      values: flat(ECONOMY_SCORES),
      slr: economyScoreSlr(),
      children: [
        salinityPathway(
          'econ-value',
          'usd',
          {
            bau: [0, 0],
            em: [-577, 4236],
            ngw: [-736, 1911],
            bf: [23, -8056],
            cor: [-237, 2665],
            tunnel: [276, -23990],
          },
          {
            bau: [0, 0],
            em: [-965, 26196],
            ngw: [-1194, 19052],
            bf: [-3, -20933],
            cor: [-324, 5361],
            tunnel: [-244, -15870],
          },
          `Change in total value added (with IMPLAN multipliers) from salinity alone, against $999M of regional value added. ${ECONOMY_REFERENCE}`,
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
          note: `Salinity-pathway change in total value added by Delta zone, dry year 2020. Every scenario's largest loss is in the Central Delta: A Tunnel −$18,800 and Bolster & Fortify −$8,500. Eco Machine and New Green Watershed gain slightly in the West and South Delta. The full range is a few tens of thousands of dollars in a $999M economy. ${ECONOMY_REFERENCE}`,
          places: ECONOMY_ZONES,
          periods: NO_FACET,
          values: zoneValues(ZONE_VALUE_ADDED),
          sources: [ECONOMY_ZONE_SOURCE],
          slr: {
            values: zoneValues(ZONE_VALUE_ADDED_SLR),
            note: `With 2 ft of sea level rise, against the same reference with sea level rise. The Central Delta still carries the largest losses: Bolster & Fortify −$25,100 and A Tunnel −$19,800. Sea level rise itself costs every scenario most in the Central and West Delta. ${ECONOMY_REFERENCE}`,
            sources: [ECONOMY_ZONE_SOURCE],
          },
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
        'Neither source gives Ecology a criterion score. We average Landscape and Food webs, which at New Green Watershed is (5 + 4) / 2 = 4.5, rounded to +5.',
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
      doc: 'data',
      where: 'Recreation The Score.xlsx (Recreation, 26 Oct 2026) · Recreation Score · table 1',
      quote: 'Table 1 combines Standard + SLR hydrology: (A Std + A SLR + B Std + B SLR) / 4.',
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
      doc: 'data',
      where: 'Recreation The Score.xlsx (Recreation, 26 Oct 2026) · Recreation Score · table 4',
      quote: 'each A/B = average of activity scores in that region',
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
      doc: 'data',
      where:
        'Restoration Scenarios NGW and ECO.xlsx (Recreation, 26 Oct 2026) · Overall Restoration (Acres)',
      quote:
        'NGW Total (Middle, 50%) 1,132,315: 41,720, 66,947, 283,904, 277,681, 462,063 … ECO Total (Only One Scenario) 43,100: 41,720, 1,380, NA, NA, NA … BAU — Existing Protected Areas (Current Inventory) 108,301: 18,139, 23,826, 56,014, 10,322',
    },
    {
      doc: 'slides',
      where: 'Restoration — Waterfowl & Shorebird Seasonal Wetland Deficits',
      quote:
        'Shorebird Wetland Deficit 21,454; Waterfowl Wetland Deficit 21,336; NGW 0.25 MW 56,286 (+264%); NGW 0.5 MW 102,982 (+483%); NGW Full MW 248,815 (+1166%)',
    },
  ],
  'rec-economy': [
    {
      doc: 'data',
      where:
        'Restoration Scenarios NGW and ECO.xlsx (Recreation, 26 Oct 2026) · Overall $ and Restoration ($) Combined',
      quote:
        'AMENITY/RECREATION (SP Day Use & Boating) … BIODIVERSITY (Birding) … RECREATIONAL HUNTING (Waterfowl) … RECREATIONAL FISHING (Angling) … $/acre/yr (all islands): Recreational fishing 283.15, Amenity/recreation 372.49, Biodiversity 162.02, Recreational hunting 93.12',
    },
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
  // The salinity rows and the zone row carry their own v16 workbook citations.
  economy: [
    {
      doc: 'report',
      where:
        'The Story Behind the Criterion: Economy, v16 (25 Oct 2026) · Comparative Scenario Performance Ranking',
      quote:
        'The scores are the same under current climate and with 2 feet of sea-level rise … [Calling on Reserves and A Tunnel:] their scores (0 and −1) do not change.',
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
  ['rec-economy-', [SOURCES['rec-economy'][0]]],
  ['rec-restoration-', [SOURCES['rec-restoration'][0]]],
  [
    'eco-niche-',
    [
      {
        doc: 'report',
        where: 'Species fundamental niches — region × water year tables',
        quote:
          'Share of days inside each species’ salinity and temperature bracket, by region, for water years 2019 and 2020. A Tunnel is not in these tables; it was first run on the 27 Oct base.',
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
