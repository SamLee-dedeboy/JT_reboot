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
    note: `Share of days inside ${species.salinity} and ${species.temperature}. A Tunnel was never run.`,
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
  note: 'Still no overall score in either source. This is its two acreage ranks — landscape and food web — averaged, so the criterion score is an acreage score. The species work is ranked now, per species, and enters nothing.',
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
      note: 'Called "Species fundamental niches" in the Sept report. The deepest evidence anywhere — 8 species × 8 regions × 2 water years. The Oct 2026 slides now rank it, but per species rather than as one number, so it still reaches no criterion score. Its finding is why so little moves: almost every cell is 0, and water year shifts the numbers far more than scenario does. Note the slides rank a Feb 1 – Jun 1 spring window, while the per-region values below cover whole water years.',
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
      note: 'The Sept report called this "Pelagic Food Webs". An acre-weighted proxy (tidal wetland 0.4, managed wetland 0.2, wet-soil ag 0.1) over baseline acreage of 5,100 managed wetland and 17,178 wet-soil ag. Only Eco Machine and New Green Watershed change the landscape, so only they move; the scores are unchanged by the Oct 2026 slides, which group this with Landscape as one metric but rank the two separately. One arithmetic note: the report’s 50/50 line writes the wet-soil-ag term as 128,001 − 17,178 but computes 14,518, which is the two added rather than subtracted. Subtracting gives a proxy of 66,225 rather than 69,661; the 25/75 line subtracts correctly. It probably does not move the +4, since the corrected figure still sits between the other two sub-scenarios.',
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
          note: 'New Green Watershed at its 50/50 primary sub-scenario, as the Ecology report gives it — a TOTAL, including the 5,100 acres already there, which its own food-web formula then subtracts. The other teams\u2019 figures are not the same measurement: eco-cultural\u2019s 102,982 counts restored acres only, and Economy\u2019s 85,523 converts farmland inside a 207,004-acre footprint rather than the 248,815 mapped Delta islands this splits. Net of the baseline Ecology still reads 115,714, so a real gap with eco-cultural survives the correction.',
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
          note: 'Weighted highest of the three, at 0.4 per acre. Eco Machine’s 53,000 assumes Suisun is restored in full — see the Landscape metric’s note.',
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
          note: 'Weighted lowest, at 0.1 per acre.',
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
      note: 'The Sept report called this "Accessible Aquatic Habitat". Added accessible wetland acres only — managed wetlands and rice drain periodically, so they do not count as accessible. Scores unchanged by the Oct 2026 slides.',
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
          note: 'The whole metric: one acreage, no place or period breakdown — the only scenario-level detail Ecology’s score actually rests on. The three Eco Machine figures are three assumptions, not three readings of one number: Economy’s 53,614 restores all 52,244 leveed Suisun acres plus 1,370 at Franks Tract, eco-cultural’s 43,100 restores about 80% of Suisun (41,720) plus 1,380, and Ecology’s 53,000 sits with Economy at full restoration. Economy says outright that the scenario \u201cdoes not yet fix how much is restored\u201d, so the scenarios being scored differ by criterion. The app keeps 53,000 until the fraction is settled.',
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
      note: 'Declared on the Oct 2026 metrics slide and absent from the Sept report: a series of conceptual models describing ecosystem-wide interactions, meant to condense the food-web and habitat changes per scenario. Narrative by design — no scenario is scored on it.',
      places: NO_FACET,
      periods: NO_FACET,
      values: {},
    },
  ],
}

// ---------- Recreation ----------

const REC_PLACES: Facet[] = [
  { key: 'delta', label: 'Delta-wide' },
  { key: 'suisunMarsh', label: 'Suisun Marsh' },
  { key: 'centralDelta', label: 'Central Delta' },
  { key: 'northDelta', label: 'North Delta' },
  { key: 'southDelta', label: 'South Delta' },
]

interface ActivitySpec {
  key: string
  label: string
  threshold: string
  season: string
  /** % of the whole run over this activity's threshold, in SCENARIO order below. */
  run: (number | null)[]
  /** % over the threshold in summer, then winter, in the same order. */
  summer: (number | null)[]
  winter: (number | null)[]
}

/** Scenario order for the activity tables: NGW, Eco Machine, B&F, COR, A Tunnel, BAU. */
const ACTIVITY_ORDER: ScenarioKey[] = ['ngw', 'em', 'bf', 'cor', 'tunnel', 'bau']

const ACTIVITIES: ActivitySpec[] = [
  {
    key: 'birding',
    label: 'Birding',
    threshold: '2,640 µS/cm raises avian botulism risk',
    season: 'Fall migration Aug–Oct, spring Apr–Jun, winter Oct–Apr',
    run: [39.2, 39, 38, 44, null, 38],
    summer: [41, 40, 40, 48, null, 40],
    winter: [44, 44, 41, 49, null, 41],
  },
  {
    key: 'angling',
    label: 'Angling',
    threshold: '9,130 µS/cm, the recreation fishery habitat threshold',
    season: 'In-season May–Sep',
    run: [7.5, 7.5, 5.5, 9, null, 5.5],
    summer: [8, 8, 5, 8, null, 5],
    winter: [7, 7, 6, 10, null, 6],
  },
  {
    key: 'boating',
    label: 'Boating',
    threshold: '1,000 µS/cm; 19 °C eases harmful algal bloom expansion',
    season: 'In-season May–Sep',
    run: [53.7, 53.6, 53.1, 53.1, null, 53.1],
    summer: [61, 61, 60.5, 62, null, 60.5],
    winter: [67.5, 67.5, 66, 65, null, 66],
  },
  {
    key: 'dayUse',
    label: 'State park day use',
    threshold: '1,000 µS/cm; below 18 °C too cold, above 31 °C too warm',
    season: 'In-season May–Sep',
    run: [58.2, 58.2, 57, 58, null, 57],
    summer: [61, 61, 60.5, 62, null, 60.5],
    winter: [67.5, 67.5, 66, 65, null, 66],
  },
  {
    key: 'waterfowl',
    label: 'Waterfowl hunting',
    threshold: '3,600 µS/cm for sub-lethal effects',
    season: 'Brooding Apr–Jul, hunting Oct–Feb',
    run: [22.2, 22.3, 21, 25, null, 21],
    summer: [32.6, 32.7, 32, 38, null, 32],
    winter: [37, 38, 34, 43, null, 34],
  },
]

const RUN_PERIOD: Facet[] = [{ key: 'run', label: 'Whole run' }]
const REC_SEASONS: Facet[] = [
  { key: 'summer', label: 'Summer' },
  { key: 'winter', label: 'Winter' },
]

/**
 * One activity under one of Recreation's two threshold metrics. Values are the
 * share of days over that activity's salinity threshold, so lower is better —
 * which is why Eco Machine and New Green Watershed read slightly worse than today.
 */
function activityNode(metric: string, activity: ActivitySpec, seasonal: boolean): CriterionNode {
  const values: Partial<Record<ScenarioKey, SliceValues>> = {}
  ACTIVITY_ORDER.forEach((scenario, i) => {
    if (seasonal) {
      if (activity.summer[i] === null) return
      values[scenario] = {
        [sliceKey(ANY, 'summer')]: (activity.summer[i] ?? 0) / 100,
        [sliceKey(ANY, 'winter')]: (activity.winter[i] ?? 0) / 100,
      }
    } else {
      if (activity.run[i] === null) return
      values[scenario] = { [sliceKey(ANY, 'run')]: (activity.run[i] ?? 0) / 100 }
    }
  })
  return {
    id: `${metric}-${activity.key}`,
    label: activity.label,
    level: 'entity',
    team: 'recreation',
    edge: 'measures',
    provenance: 'reported',
    unit: 'share',
    betterHigher: false,
    note: `${activity.threshold}. ${activity.season}. A Tunnel is absent from every published table.`,
    places: REC_PLACES,
    periods: seasonal ? REC_SEASONS : RUN_PERIOD,
    values,
  }
}

const RECREATION: CriterionNode = {
  id: 'recreation',
  label: 'Recreation',
  level: 'team',
  team: 'recreation',
  provenance: 'inferred',
  unit: 'score',
  betterHigher: true,
  note: 'No criterion score exists in either source. These values are derived from the Oct 2026 slides: the mean change in threshold exceedance across the five activities, against Business as Usual. They reverse the earlier stand-ins, which read the report’s prose as putting Eco Machine and New Green Watershed nominally best.',
  places: NO_FACET,
  periods: NO_FACET,
  values: flat({ ngw: -1, em: -1, bf: 0, cor: -3, tunnel: -3, bau: 0 }),
  children: [
    {
      id: 'rec-overall',
      label: 'Overall use',
      level: 'metric',
      team: 'recreation',
      edge: 'unscored',
      provenance: 'reported',
      unit: 'share',
      betterHigher: false,
      note: 'Share of the whole run over each activity’s threshold, across 32 points and 4 recreation regions. The numbers exist; the −5…+5 score the report defined a formula for has never been run.',
      places: REC_PLACES,
      periods: RUN_PERIOD,
      values: {},
      children: ACTIVITIES.map((activity) => activityNode('rec-overall', activity, false)),
    },
    {
      id: 'rec-seasonal',
      label: 'Seasonal use',
      level: 'metric',
      team: 'recreation',
      edge: 'unscored',
      provenance: 'reported',
      unit: 'share',
      betterHigher: false,
      note: 'The same five activities split summer and winter. This is where the criterion’s story lives: every scenario is worse in winter than in summer, and Calling on Reserves is worst in both — except for boating and day use, where it is the only scenario that beats today in winter.',
      places: REC_PLACES,
      periods: REC_SEASONS,
      values: {},
      children: ACTIVITIES.map((activity) => activityNode('rec-seasonal', activity, true)),
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
      note: 'New since the report: accessible acreage gained through wetland restoration, against the CVJV 2020 habitat deficits of 21,454 shorebird and 21,336 waterfowl acres. New Green Watershed clears them many times over — +264% at 0.25MW, +483% at 0.5MW, +1,166% at Full MW — which is the one place Recreation favours it. Not scored, so it does not reach the column above.',
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
      note: 'Also new: visitor-sector earnings 2001–2023 by water-year type. Earnings run +19.6% in critical years and +20.3% in wet years, but −21.8% in dry and −27.5% in above-normal — so the sector does worst in the middle, not at the extremes. Narrative only; no scenario is scored on it.',
      places: NO_FACET,
      periods: NO_FACET,
      values: {},
    },
  ],
}

// ---------- EJ and vulnerable communities ----------

const SEASONS = ['run', 'wet', 'dry']
const SEASON_FACETS: Facet[] = [
  { key: 'run', label: 'Whole run' },
  { key: 'wet', label: 'Wet season' },
  { key: 'dry', label: 'Dry season' },
]

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
  note: 'The mean of three numbers, rounded — drinking water (whole run), flood risk and water age. It averaged five until the Oct 2026 slides dropped the two seasonal drinking-water scores, which is what cost Eco Machine its +1. Still the only criterion whose chain from score to measurement holds together. Calling on Reserves and A Tunnel are now both pending for want of a water-age result; step 1 carries stand-ins of −1 and −2.',
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
      note: 'One metric, scored three times — whole run, wet season, dry season. Until Oct 2026 all three entered the criterion average; now only the whole run does, and the seasonal scores are computed but unused. A Tunnel has been dropped from the published chart entirely.',
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
          note: 'The number the score is read off. The Sept report’s Comparative Scenario Performance Ranking sets the scale out as bands one percentage point wide against Business as Usual, with ±5 as “≥5% more/less” — so A Tunnel’s wet season, seven points above Business as Usual, sits in the bottom band at −5 rather than being truncated there. That same table scores Eco Machine and New Green Watershed at +3 for the total run, where the Oct 2026 slides show +2; the slides’ own raw column (0.66 for New Green Watershed) only works at +2, so the app follows the slides. The slides republish the five scenarios below unchanged and omit A Tunnel.',
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
      note: 'One qualitative judgement per scenario, read off each scenario’s own flood-reduction design. Since the average dropped to three numbers it carries a full third of the EJ score — the same weight as the 39,659-measurement drinking-water number, and the only metric A Tunnel still has.',
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
      note: 'Water at or above 19 °C and older than 14 days is a harmful-algal-bloom proxy, over 5 hotspot regions. This is where green infrastructure loses what it wins on drinking water: the wetlands that freshen water also slow it down. Every scenario moved a step worse in Oct 2026, and the two that would have told us most — Calling on Reserves and A Tunnel — are pending.',
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
          note: 'The number the rank is read off. Suisun Marsh is the whole story: green infrastructure adds about eight days there, against a Delta-wide baseline of 17–29 days, while three of the five regions barely move. Bolster & Fortify is the only scenario that takes a day off anywhere.',
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
          note: 'The Sept report’s own slight → extreme ladder across 5 regions and 13 months — the only month-by-month view either source gives. A cell holding both an increase and a decrease is shown here as the net; A Tunnel is absent and Calling on Reserves stops after Oct 2019, which is why both are now pending.',
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
    note: 'A New Green Watershed sub-scenario, so this is extra scenario depth rather than a part of the criterion. The other scenarios have no restoration level to report — their score comes from the salinity pathway. The page scores the 50/50 primary.',
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
  note: 'One number, on whichever effect dominates that scenario. The three metrics below do not average into it — the Oct 2026 slides give a single score and state that gross revenue, jobs and value added all carry it, which is why the three rows are identical. Salinity is a non-story — every scenario modelled moves gross revenue by less than 0.01% of a $1.107B Delta farm economy — so land conversion is the whole criterion. Calling on Reserves is 0 in the dry year and +1 in the wet; the app takes 0. A Tunnel is still pending.',
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
      note: `Dollar sales from Delta farms, against a $1.107B/yr base. The largest salinity-only effect anywhere is Bolster & Fortify at −$34,000 in the dry year. ${ECONOMY_GAP} ${ECONOMY_NOTE}`,
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
      note: `Direct farm jobs (7,650 at base) and total once IMPLAN multipliers are applied (11,814). The levels below are the total change, where revenue and value added below use the direct change — the slides publish no direct jobs column. The largest salinity-only job change anywhere is +0.13 jobs, Eco Machine in the dry year. ${ECONOMY_GAP} ${ECONOMY_NOTE}`,
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
      note: `Wages, business income and taxes once revenue circulates — roughly regional GDP, $671M direct and $999M with multipliers. The largest salinity-only loss is −$9,500, Bolster & Fortify in the dry year. ${ECONOMY_GAP} ${ECONOMY_NOTE}`,
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
          note: 'New in Oct 2026, and the only place the salinity pathway produces a shape rather than a rounding error: every scenario moves the Central Delta hardest, and Calling on Reserves and Bolster & Fortify move it in opposite directions. The whole range is a few thousand dollars against a $999M economy, which is the point — zone detail does not rescue a non-effect.',
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
  note: 'One composite score, driven almost entirely by restored acres. Three of its four metrics are described and never scored — by design, not omission. The Oct 2026 slides republish exactly these values, which settles the conflict with the report’s earlier RANK grid (Eco Machine 1, Calling on Reserves 0) in favour of what the app already used.',
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
      note: 'The only quantified metric, and now ranked on its own: BAU 0, Bolster & Fortify 0, Eco Machine +2, New Green Watershed +5, Calling on Reserves 0, A Tunnel 0. The Oct 2026 slides dropped montane forests from the upland total and rebased the rest, cutting the upper-watershed figure from millions of acres to hundreds of thousands. New Green Watershed\u2019s in-Delta 248,815 is theirs; the upland 66,159 and the 314,974 total are ours, the low end of three published ranges and so the minimal-restoration case out of their nine upland sub-scenarios. The honest span is 314,974 to 1,106,782 acres.',
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

/** Root-to-node path, so any node can be reached and re-anchored in any order. */
export function pathTo(id: string): CriterionNode[] {
  const path: CriterionNode[] = []
  let current: string | undefined = id
  while (current) {
    const node = NODE_INDEX.get(current)
    if (!node) break
    path.unshift(node)
    current = PARENT_OF.get(current)
  }
  return path
}

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

/** Every node at a level, for the "all subteams" and metric-driven listings. */
export function nodesAtLevel(level: CriterionNode['level']): CriterionNode[] {
  return [...NODE_INDEX.values()].filter((node) => node.level === level)
}

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
  'rec-overall': [
    {
      doc: 'slides',
      where: 'Scenario Ranking: Salinity + Temperature (% of -5 to 5)',
      quote:
        'Bird Watching, Angling, SP Day Use, Boating, Waterfowl Hunting — one whole-run percentage per activity per scenario; A Tunnel (Pending).',
    },
  ],
  'rec-seasonal': [
    {
      doc: 'slides',
      where: 'Results — one Performance Ranking table per activity',
      quote: '% Mean, Summer and Winter, for each of the five activities.',
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
    'rec-overall-',
    [
      {
        doc: 'slides',
        where: 'Scenario Ranking: Salinity + Temperature (% of -5 to 5)',
        quote:
          'Bird Watching 38 / 38 / 39 / 39.2 / 44; Angling 5.5 / 5.5 / 7.5 / 7.5 / 9; SP Day Use 57 / 57 / 58.2 / 58.2 / 58; Boating 53.1 / 53.1 / 53.6 / 53.7 / 53.1; Waterfowl Hunting 21 / 21 / 22.3 / 22.2 / 25 (BAU / B&F / Eco Machine / NGW / COR)',
      },
    ],
  ],
  [
    'rec-seasonal-',
    [
      {
        doc: 'slides',
        where: 'Results — Performance Ranking, one table per activity',
        quote:
          '% Mean Summer and Winter per scenario, for Birdwatcher Sightings, Angler participation, Marina boaters, State Parks Day Use and Waterfowl hunting.',
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
