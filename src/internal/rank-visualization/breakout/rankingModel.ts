// The breakout table's model: ranking scores first, each opening into what it is
// based on. Every team reads the same way: the criterion score, then the scores it
// ranks scenarios by, and under each score the entities behind it (species,
// activities, vulnerability classes, habitat types…) in their own units, with an
// entity's own rank beside its value where it has one. RANKINGS.md documents every
// number here and where it came from.
//
// The tree reuses the 4C pivot's nodes (../drilldown/tree.ts) as copies with a
// `bk-` id, so this page can relabel periods, regroup rows and add ranks without
// changing the pivot or the by-subteam pages.
import { ANY, sliceKey } from '../drilldown/model'
import type { CriterionNode, Facet, ScenarioKey, SliceValues, Source } from '../drilldown/model'
import { NODE_INDEX, sourcesFor } from '../drilldown/tree'
import { MEASURE_LABELS } from './labels'

const node = (id: string): CriterionNode => {
  const found = NODE_INDEX.get(id)
  if (!found) throw new Error(`rankingModel: no node ${id}`)
  return found
}

// ---------- periods: wet / dry seasons and water years, with their months ----------

const PERIOD_LABEL: Record<string, string> = {
  run: 'Whole run · Oct 2018 – Dec 2020',
  wet: 'Wet season · Oct – Mar',
  dry: 'Dry season · Apr – Sep',
  '2019': 'WY 2019 · wet year',
  '2020': 'WY 2020 · dry year',
  both: 'WY 2019 + 2020 together',
}

/** Ecology's species work covers only Feb 1 – Jun 1 of each water year. */
const ECOLOGY_PERIOD_LABEL: Record<string, string> = {
  '2019': 'WY 2019 · wet · Feb – Jun',
  '2020': 'WY 2020 · dry · Feb – Jun',
  both: 'WY 2019 + 2020 · Feb – Jun',
}

const relabel = (facets: Facet[], labels: Record<string, string>): Facet[] =>
  facets.map((facet) => ({
    ...facet,
    label: labels[facet.key] ?? PERIOD_LABEL[facet.key] ?? facet.label,
  }))

const SLIDES: Source = {
  doc: 'slides',
  where: 'Bay-Delta Science Conference slides, Oct 2026',
  quote: 'Rank charts read cell by cell; see RANKINGS.md.',
}

/**
 * A pivot node as this page shows it: a `bk-` id, its citations carried over (they
 * are looked up by the original id), periods relabelled with their months, and the
 * same done to its children and its sea-level-rise run.
 */
function adapt(
  base: CriterionNode,
  over: Partial<CriterionNode> = {},
  labels: Record<string, string> = {},
): CriterionNode {
  const sources = base.sources ?? sourcesFor(base.id)
  return {
    ...base,
    id: `bk-${base.id}`,
    sources: sources.length > 0 ? sources : undefined,
    periods: relabel(base.periods, labels),
    slr: base.slr && {
      ...base.slr,
      periods: base.slr.periods && relabel(base.slr.periods, labels),
    },
    children: base.children?.map((child) => adapt(child, {}, labels)),
    ...over,
  }
}

/** Same value for every slice: `{ ngw: 4, … }`. */
function flat(by: Partial<Record<ScenarioKey, number | null>>) {
  const out: Partial<Record<ScenarioKey, SliceValues>> = {}
  for (const [scenario, value] of Object.entries(by))
    out[scenario as ScenarioKey] = { [sliceKey(ANY, ANY)]: value }
  return out
}

/** Values keyed by place and period: `{ bau: { moderate: { run: 0, wet: 0 } } }`. */
function byPlacePeriod(
  by: Partial<Record<ScenarioKey, Record<string, Record<string, number | null>>>>,
) {
  const out: Partial<Record<ScenarioKey, SliceValues>> = {}
  for (const [scenario, places] of Object.entries(by)) {
    const series: SliceValues = {}
    for (const [place, periods] of Object.entries(places ?? {}))
      for (const [period, value] of Object.entries(periods)) series[sliceKey(place, period)] = value
    out[scenario as ScenarioKey] = series
  }
  return out
}

/** Move a series' place key: the pivot's `*|run` becomes this page's `moderate|run`. */
function atPlace(
  values: Partial<Record<ScenarioKey, SliceValues>>,
  place: string,
): Partial<Record<ScenarioKey, SliceValues>> {
  const out: Partial<Record<ScenarioKey, SliceValues>> = {}
  for (const [scenario, series] of Object.entries(values)) {
    const moved: SliceValues = {}
    for (const [key, value] of Object.entries(series ?? {})) {
      const [, period] = key.split('|')
      moved[sliceKey(place, period)] = value
    }
    out[scenario as ScenarioKey] = moved
  }
  return out
}

function merge(...parts: Partial<Record<ScenarioKey, SliceValues>>[]) {
  const out: Partial<Record<ScenarioKey, SliceValues>> = {}
  for (const part of parts)
    for (const [scenario, series] of Object.entries(part))
      out[scenario as ScenarioKey] = { ...out[scenario as ScenarioKey], ...series }
  return out
}

// ---------- Ecology ----------

/**
 * Per-species suitability ranks, Delta-wide, from the slides' rule (+1 per
 * percentage point of suitable days against Business as Usual, sign reversed for
 * the three undesirable species) applied to the report's Table 16. They reproduce
 * the dots on slides 12–13. Unlisted cells are 0; A Tunnel was never run.
 */
const SPECIES_RANKS: Record<string, Partial<Record<ScenarioKey, [number, number]>>> = {
  longfinJuv: { em: [1, 0], ngw: [1, 0] },
  longfinAdult: {},
  chinook: { cor: [1, 0] },
  stripedBassJuv: {},
  stripedBassAdult: {},
  largemouthBass: { em: [0, 2], ngw: [0, 2], cor: [0, 2] },
  overbiteClam: { em: [0, -1], ngw: [0, -1], cor: [0, -1] },
  egeria: { em: [0, 1], ngw: [0, 1], cor: [0, 2] },
}

/** The species whose ranks the slides reverse: less habitat for them is better. */
const INVASIVE = new Set(['largemouthBass', 'overbiteClam', 'egeria'])

function speciesRanks(key: string): Partial<Record<ScenarioKey, SliceValues>> {
  const out: Partial<Record<ScenarioKey, SliceValues>> = {}
  for (const scenario of ['bau', 'em', 'ngw', 'bf', 'cor'] as ScenarioKey[]) {
    const [wet, dry] = SPECIES_RANKS[key]?.[scenario] ?? [0, 0]
    out[scenario] = { [sliceKey('delta', '2019')]: wet, [sliceKey('delta', '2020')]: dry }
  }
  return out
}

function ecologyTree(): CriterionNode {
  const niche = node('eco-niche')
  const species = (niche.children ?? []).map((base) => {
    const key = base.id.replace('eco-niche-', '')
    return adapt(
      base,
      {
        ranks: speciesRanks(key),
        sources: [...sourcesFor(base.id), SLIDES],
        // For an invasive species, less suitable habitat is the better outcome.
        betterHigher: !INVASIVE.has(key),
      },
      ECOLOGY_PERIOD_LABEL,
    )
  })
  const suitability: CriterionNode = {
    ...adapt(niche, {}, ECOLOGY_PERIOD_LABEL),
    id: 'bk-eco-species',
    label: 'Species suitability',
    unit: 'score',
    edge: 'beside',
    provenance: 'reported',
    entityNoun: 'species',
    note: 'The slides rank each species on its proportion of suitable days (+1 per percentage point against Business as Usual, reversed for largemouth bass, overbite clam and Brazilian waterweed) and never combine them. Open the row to see each species’ value and rank. The ranks are Delta-wide; regions carry values only. Feb 1 – Jun 1 of each water year; there is no whole run. These ranks do not feed the Ecology score.',
    values: {},
    sources: [SLIDES, ...sourcesFor('eco-niche-')],
    slr: niche.slr && {
      ...niche.slr,
      periods: niche.slr.periods && relabel(niche.slr.periods, ECOLOGY_PERIOD_LABEL),
    },
    children: species,
  }
  const root = node('ecology')
  return adapt(root, {
    children: [
      adapt(node('eco-habitat')),
      adapt(node('eco-foodweb')),
      suitability,
      adapt(node('eco-conceptual')),
    ],
  })
}

// ---------- Recreation ----------

/** An activity: its days over the threshold, with its score as the rank beside them. */
function activity(activityNode: CriterionNode): CriterionNode {
  const days = activityNode.children?.[0] ?? activityNode
  return adapt(days, {
    id: `bk-${activityNode.id}`,
    label: activityNode.label,
    ranks: activityNode.values,
    sources: sourcesFor(activityNode.id),
    slr: days.slr && {
      ...days.slr,
      periods: days.slr.periods && relabel(days.slr.periods, {}),
      ranks: activityNode.slr?.values,
    },
  })
}

function thresholdRow(id: string, label: string, note: string): CriterionNode {
  const base = node(id)
  return adapt(base, {
    label,
    note,
    // The team scores activities and stops there; their mean is ours, so the row
    // shows the activities' ranks instead of a number of its own.
    values: {},
    provenance: 'reported',
    entityNoun: 'activity',
    slr: base.slr && { ...base.slr, values: {} },
    children: (base.children ?? []).map(activity),
  })
}

const NOT_BROKEN_OUT: Facet[] = [{ key: ANY, label: 'Not broken out' }]

/**
 * Habitat restoration as a ranking score, with Recreation's acres beneath it. The
 * scoring email sets the four scenarios that restore nothing at 0; Recreation has
 * not scored Eco Machine or New Green Watershed against Business as Usual.
 */
function habitatRestoration(): CriterionNode {
  const acres = node('rec-restoration')
  return adapt(acres, {
    label: 'Habitat Restoration',
    edge: 'beside',
    unit: 'score',
    places: NOT_BROKEN_OUT,
    // Eco Machine and New Green Watershed are stand-ins, shown as "awaiting subteam".
    values: flat({ bau: 0, bf: 0, cor: 0, tunnel: 0, em: 0, ngw: 0 }),
    inferredFor: ['em', 'ngw'],
    sources: [
      {
        doc: 'ours',
        where: 'Recreation scoring email, 22 Oct 2026',
        quote:
          'BAU, BAF, COR, TUN → all will be scored at 0. Eco Machine and New Green Watershed (the 50-50 regime) are for Recreation to score.',
      },
      ...sourcesFor('rec-restoration'),
    ],
    note: 'Business as Usual, Bolster & Fortify, Calling on Reserves and A Tunnel restore nothing and score 0 (scoring email). Eco Machine and New Green Watershed are awaiting Recreation’s scores; the workbook’s own acre scores compare New Green Watershed’s versions with each other, not scenarios with Business as Usual. Open the row for the acres Recreation reports.',
    children: [
      adapt(acres, {
        id: 'bk-rec-restoration-acres',
        label: 'Restored acres',
        level: 'entity',
        edge: 'measures',
        notApplicable: ['bf', 'cor', 'tunnel'],
      }),
    ],
  })
}

/**
 * Recreation economy as Recreation publishes it: a score per service and no single
 * score, so the row reads "per service" and its services carry the ranks. The
 * "Overall $" sheet has columns for New Green Watershed and Business as Usual only.
 */
function recreationEconomy(): CriterionNode {
  const economy = node('rec-economy')
  return adapt(economy, {
    edge: 'beside',
    entityNoun: 'service',
    // The "Overall $" sheet covers New Green Watershed (against Business as Usual) only,
    // so each service is a version of that scenario and the other columns read "NGW only".
    children: (economy.children ?? []).map((service) => adapt(service, { edge: 'refines' })),
  })
}

function recreationTree(): CriterionNode {
  return adapt(node('recreation'), {
    children: [
      thresholdRow(
        'rec-salinity',
        'Salinity thresholds',
        'Each activity is scored on its proportion of days over its salinity threshold: day use & boating 1,000 µS/cm, birding 2,640, waterfowl hunting 3,600, angling 9,130. One point per percentage point against Business as Usual, ±5 at five or more. Open the row for each activity’s days over the threshold with its score beside it.',
      ),
      thresholdRow(
        'rec-temperature',
        'Temperature thresholds',
        'The same construction against water temperature: 19 °C for day use & boating, > 20 °C birding, 23 °C waterfowl, 18.4 / 22.3 °C angling, < 18 °C cold-water day use. Calling on Reserves and A Tunnel have no temperature runs.',
      ),
      habitatRestoration(),
      recreationEconomy(),
    ],
  })
}

// ---------- Environmental Justice ----------

/** EJ's places are the Delta Vulnerability Index classes of its 49 drinking-water points. */
const EJ_CLASSES: Facet[] = [
  { key: 'all', label: 'All 49 points' },
  { key: 'moderate', label: 'Moderate vulnerability · 10' },
  { key: 'high', label: 'High vulnerability · 36' },
  { key: 'highest', label: 'Highest vulnerability · 3' },
]

const S = (run: number, wet: number, dry: number) => ({ run, wet, dry })

/** The report's drinking-water scores by class and season (Tables 12 and 15). */
const DRINKING_SCORES = byPlacePeriod({
  bau: { all: S(0, 0, 0), moderate: S(0, 0, 0), high: S(0, 0, 0) },
  em: { all: S(2, 2, 1), moderate: S(2, 4, 2), high: S(2, 2, 1) },
  ngw: { all: S(2, 2, 0), moderate: S(2, 4, 1), high: S(2, 2, 1) },
  bf: { all: S(0, -1, 0), moderate: S(1, 2, 1), high: S(0, -1, 0) },
  cor: { all: S(-2, -4, 0), moderate: S(-5, -5, 2), high: S(-1, -3, 0) },
  tunnel: { all: S(-3, -5, 0), moderate: S(-5, -5, 2), high: S(-3, -5, 0) },
})

function ejTree(): CriterionNode {
  const classNode = (key: string) => node(`ej-drinking-${key}`)
  const keys = ['all', 'moderate', 'high', 'highest']
  const exceedance: CriterionNode = {
    ...adapt(classNode('all')),
    id: 'bk-ej-drinking-pct',
    label: 'Readings over 1,050 µS/cm',
    edge: 'derives',
    places: EJ_CLASSES,
    values: merge(...keys.map((key) => atPlace(classNode(key).values, key))),
    note: 'The share of daily readings at or above 1,050 µS/cm, the drinking-water threshold, at the 49 SAFER drinking-water points: all together or by Delta Vulnerability Index class. The highest-vulnerability class never exceeds it in any scenario.',
    slr: classNode('all').slr && {
      ...classNode('all').slr!,
      places: EJ_CLASSES,
      periods: relabel(classNode('all').slr!.periods ?? [], {}),
      values: merge(...keys.map((key) => atPlace(classNode(key).slr?.values ?? {}, key))),
    },
  }
  const drinking: CriterionNode = {
    ...adapt(node('ej-drinking')),
    places: EJ_CLASSES,
    values: DRINKING_SCORES,
    note: 'One point per percentage point of readings over 1,050 µS/cm against Business as Usual, ±5 at five or more. Scored for all 49 points and for the moderate and high classes; the highest class is always 0% and has no score. Only the whole-run, all-points score enters the EJ criterion (Oct 2026); the seasonal and class scores are the report’s.',
    children: [exceedance],
  }
  const waterAge = node('ej-waterage')
  const days = node('ej-waterage-days')
  const areas: CriterionNode[] = days.places.map((place) => {
    const values: Partial<Record<ScenarioKey, SliceValues>> = {}
    for (const [scenario, series] of Object.entries(days.values))
      values[scenario as ScenarioKey] = {
        [sliceKey(ANY, ANY)]: series?.[sliceKey(place.key, ANY)] ?? null,
      }
    return {
      ...adapt(days),
      id: `bk-ej-waterage-${place.key}`,
      label: place.label,
      level: 'entity',
      places: [{ key: ANY, label: 'Not broken out' }],
      values,
      note: 'Change in average water age (days) against Business as Usual during the months with water at or above 19 °C: Oct 2018, May – Oct 2019 and May – Oct 2020. Older water favours algal blooms.',
    }
  })
  return adapt(node('environmentalJustice'), {
    children: [
      drinking,
      adapt(node('ej-flood')),
      {
        ...adapt(waterAge),
        entityNoun: undefined,
        note: `${waterAge.note} Open the row for the change in water age at each of the five hotspot areas.`,
        children: areas,
      },
    ],
  })
}

// ---------- Economy ----------

/**
 * One score shared by the three metrics, the same in both water years and both
 * climates (v16). The scores carry the water years anyway so the When control
 * reaches the salinity rows beneath them.
 */
const WATER_YEARS: Facet[] = relabel(
  [
    { key: '2019', label: '' },
    { key: '2020', label: '' },
  ],
  {},
)

function economyTree(): CriterionNode {
  const metric = (id: string) => adapt(node(id), { periods: WATER_YEARS })
  return adapt(node('economy'), {
    periods: WATER_YEARS,
    note: `${node('economy').note} New Green Watershed uses the 50/50 primary version (−4; −3 at 25/75, −5 all wetland).`,
    children: [metric('econ-revenue'), metric('econ-jobs'), metric('econ-value')],
  })
}

// ---------- Eco-cultural ----------

function ecoCulturalTree(): CriterionNode {
  const restoration = node('ec-restoration')
  return adapt(node('ecoCultural'), {
    children: [
      adapt(restoration, {
        label: 'Restoration',
        unit: 'score',
        places: [{ key: ANY, label: 'Not broken out' }],
        inferredSlices: undefined,
        values: flat({ bau: 0, em: 2, ngw: 5, bf: 0, cor: 0, tunnel: 0 }),
        sources: [SLIDES, ...sourcesFor('ec-restoration')],
        note: 'Slide 55 ranks restored acres: Eco Machine +2, New Green Watershed +5, every other scenario 0. Open the row for the acres themselves, by habitat type.',
        children: [
          adapt(restoration, {
            id: 'bk-ec-restoration-acres',
            label: 'Restored acres, all habitats',
            children: undefined,
            level: 'entity',
          }),
          ...(restoration.children ?? []).map((child) => adapt(child)),
        ],
      }),
      ...(node('ecoCultural').children ?? []).slice(1).map((child) => adapt(child)),
    ],
  })
}

/** The five teams, in the order the tab bar shows them. */
export const BREAKOUT_TREE: CriterionNode[] = [
  ecologyTree(),
  recreationTree(),
  ejTree(),
  economyTree(),
  ecoCulturalTree(),
]

// Register every row so the shared value lookup, the cell detail and the maps can
// find them by id like any pivot node.
function register(n: CriterionNode) {
  n.label = MEASURE_LABELS[n.id] ?? n.label
  NODE_INDEX.set(n.id, n)
  n.children?.forEach(register)
}
BREAKOUT_TREE.forEach(register)

/** Whether a row is a ranking score rather than a narrative metric: it is scored. */
export const isRanked = (n: CriterionNode) => n.provenance !== 'unscored' && n.edge !== 'unscored'
