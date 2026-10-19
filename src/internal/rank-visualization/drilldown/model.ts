// Shared model for the drill-down (4c) and the by-subteam pages.
//
// A number on this page is always a cell in three dimensions:
//   scenario  ×  criterion path (subteam → metric → entity)  ×  slice (place, period)
// The four drill-down intents the design has to support — scenario-, subteam-,
// metric- and entity-driven — are not four flows. They are which dimension is
// pinned while the others vary, which is why one selection state serves them all.
import { SCENARIOS, TEAMS } from '../data'
import type { Score, TeamKey } from '../data'

/** Scenario ids, in the order SCENARIOS is declared in ../data.ts. */
export const SCENARIO_KEYS = ['ngw', 'em', 'bf', 'cor', 'tunnel', 'bau'] as const
export type ScenarioKey = (typeof SCENARIO_KEYS)[number]

/** The six scenarios with the names and colors ../data.ts already defines for them. */
export const DRILL_SCENARIOS = SCENARIOS.map((scenario, i) => ({
  key: SCENARIO_KEYS[i],
  name: scenario.name,
  color: scenario.color,
}))

export const SCENARIO_NAME = Object.fromEntries(
  DRILL_SCENARIOS.map((scenario) => [scenario.key, scenario.name]),
) as Record<ScenarioKey, string>

/** Depth in the criterion tree. */
export type NodeLevel = 'team' | 'metric' | 'entity'

/**
 * How a child relates to its parent. Drilling down is not always "what is inside
 * this number", and the reports differ sharply on this — naming the edge is what
 * keeps the uneven depth legible instead of looking like missing data.
 */
export type EdgeKind =
  /** Parent averages this child together with its siblings. */
  | 'averages'
  /** One of the measurements the parent is made of. */
  | 'measures'
  /** Parent is calculated from this child by a stated rule. */
  | 'derives'
  /**
   * A finer version of one scenario rather than a part of the parent. It holds a
   * number for that scenario alone, so reading along its row is a category error:
   * the other columns are not missing, they never existed.
   */
  | 'refines'
  /** Child carries the same number as its siblings; the split adds nothing. */
  | 'duplicates'
  /** Evidence the subteam gathered that never enters the parent's score. */
  | 'beside'
  /** Described in the report, never scored. */
  | 'unscored'

/**
 * Where a number came from. `derived` and `provisional` used to be separate — one
 * for arithmetic on published scores, one for a mapping nobody published — but both
 * say the same thing to a reader: this is not the subteam's own number.
 */
export type Provenance = 'reported' | 'inferred' | 'unscored'

/**
 * Where a number came from, close enough to go and check. `doc: 'ours'` is the
 * honest case for a value no subteam published: the rule we applied stands in for
 * the quote, because there is nothing to quote.
 */
export interface Source {
  doc: 'slides' | 'report' | 'data' | 'ours'
  /** Slide title, table number or section heading — how a reader would find it. */
  where: string
  /** Verbatim from the document, or the rule where `doc` is 'ours'. */
  quote: string
}

export const DOC_LABEL: Record<Source['doc'], string> = {
  slides: 'BDSC 2026 conference slides · Oct 2026',
  report: 'The Story Behind the Criterion · Sept 2026',
  data: 'Subteam data files · Oct 2026',
  ours: 'Ours — not published by the subteam',
}

export type Unit =
  /** −5…+5 against Business as Usual. */
  | 'score'
  /** 0–1 proportion, shown as a percentage. */
  | 'share'
  | 'acres'
  /** Millions of US dollars per year. */
  | 'dollars'
  /** Plain US dollars, for the zone-level economic differences. */
  | 'usd'
  | 'jobs'
  /** Days, for the water-age change against today. */
  | 'days'
  /** The reports' slight → extreme qualitative ladder, signed. */
  | 'ladder'

export interface Facet {
  key: string
  label: string
}

/** No place / no period. Used as both the facet key and the wildcard in a slice key. */
export const ANY = '*'

export type SliceValues = Partial<Record<string, Score>>

export interface CriterionNode {
  id: string
  label: string
  level: NodeLevel
  team: TeamKey
  /** Relation to the parent; absent on a subteam, which has no parent. */
  edge?: EdgeKind
  provenance: Provenance
  unit: Unit
  /** True where a larger number is the better outcome (suitable days, acres). */
  betterHigher: boolean
  /** One line: what this measures, or why it has no number. */
  note: string
  /** Places this node resolves; `[ANY]` means it is not broken out by place. */
  places: Facet[]
  /** Periods this node resolves; `[ANY]` means it is not broken out by period. */
  periods: Facet[]
  /** scenario → `${place}|${period}` → value. Missing means the report has none. */
  values: Partial<Record<ScenarioKey, SliceValues>>
  /**
   * Scenarios whose value we worked out rather than read. A node is usually all
   * one or all the other, but not always: Ecology ranked food webs for Eco Machine
   * and New Green Watershed only, and the zeros we carry for the other three are
   * ours. Without this the table would hand Ecology the credit for them.
   */
  inferredFor?: ScenarioKey[]
  /**
   * Slice keys whose value we worked out, whatever the scenario. Eco-cultural
   * publishes three upland ranges and no total, so the upland figure and the
   * all-places figure are our sums of their low ends while the in-Delta figure
   * beside them is theirs. Scenario-level marking cannot say that.
   */
  inferredSlices?: string[]
  /** Rich grid with its own renderer, where one scalar would misreport the source. */
  detail?: 'waterAge'
  children?: CriterionNode[]
}

export const sliceKey = (place: string, period: string) => `${place}|${period}`

/**
 * A node's value for one scenario at the selected slice, and how exactly the
 * slice was honored. Falling back is the common case: most criteria are not
 * broken out by place or period at all, so an exact hit is the exception.
 */
export interface Resolved {
  value: Score
  /** 'exact' | 'place' | 'period' | 'none' — which parts of the slice the node resolved. */
  matched: 'exact' | 'place' | 'period' | 'none'
  /** True where the node has no number for this scenario under any slice. */
  missing: boolean
}

export function resolve(
  node: CriterionNode,
  scenario: ScenarioKey,
  place: string,
  period: string,
): Resolved {
  const series = node.values[scenario]
  if (!series) return { value: null, matched: 'none', missing: true }
  const tries: [string, Resolved['matched']][] = [
    [sliceKey(place, period), 'exact'],
    [sliceKey(place, ANY), 'place'],
    [sliceKey(ANY, period), 'period'],
    [sliceKey(ANY, ANY), 'none'],
  ]
  for (const [key, matched] of tries) {
    if (key in series) return { value: series[key] ?? null, matched, missing: false }
  }
  return { value: null, matched: 'none', missing: true }
}

/**
 * The slice actually used for a node. "Any" means "whatever this node gives as its
 * headline": for a node that only exists per place or per period, that is its first
 * facet, and the view says so rather than showing an empty table.
 */
export function effectiveSlice(node: CriterionNode, place: string, period: string) {
  // Prefer a facet the node actually holds data for. Picking the first one blindly
  // landed upland habitats on "In-Delta", where every scenario reads empty.
  const holds = (axis: 'place' | 'period', key: string) =>
    Object.values(node.values).some((series) =>
      Object.keys(series ?? {}).some(
        (sliceId) => sliceId.split('|')[axis === 'place' ? 0 : 1] === key,
      ),
    )
  /**
   * A node that is not cut along this axis resolves to ANY whatever is selected,
   * and one that is cut along it never keeps a key from somebody else's geography:
   * carrying a water-age month onto an eco-cultural acreage printed "in 2020-10".
   */
  const resolve1 = (list: Facet[], axis: 'place' | 'period', selected: string) => {
    const real = list.filter((facet) => facet.key !== ANY)
    if (real.length === 0) return ANY
    if (real.some((facet) => facet.key === selected)) return selected
    return (real.find((facet) => holds(axis, facet.key)) ?? real[0]).key
  }
  const resolvedPlace = resolve1(node.places, 'place', place)
  const resolvedPeriod = resolve1(node.periods, 'period', period)
  return {
    place: resolvedPlace,
    period: resolvedPeriod,
    defaulted: resolvedPlace !== place || resolvedPeriod !== period,
  }
}

/**
 * True where this node's numbers are changes against Business as Usual, so zero
 * is a real midpoint and the sign says which way the scenario moved.
 *
 * This is what lets a measurement wear the same blue/orange scale as the score it
 * feeds. It cannot be decided by unit: "acres" is a change for added tidal wetland,
 * whose Business as Usual is 0, and a level for total managed wetland, whose
 * Business as Usual is the 5,100-acre baseline — colouring the second one would
 * claim a direction the number does not have. So the data decides: a node is
 * signed when Business as Usual sits at zero. The exception is a node with no
 * Business as Usual row at all — the New Green Watershed restoration levels — where
 * the unit itself is a reported change ("Direct revenue change", "Total jobs change").
 */
export function isSigned(node: CriterionNode): boolean {
  if (node.unit === 'score') return true
  const baseline = node.values.bau
  if (baseline) {
    const marks = Object.values(baseline)
    return marks.length > 0 && marks.every((value) => value === 0 || value === null)
  }
  return node.unit === 'dollars' || node.unit === 'jobs' || node.unit === 'usd'
}

/**
 * Where one cell's number came from. Provenance is recorded per node, but it is
 * read per cell, because a node can be the subteam's own work for one scenario and
 * ours for another, and because a node with no number for a scenario is pending
 * rather than anything.
 *
 * The line between reported and inferred is whether we chose something. Adding up
 * three acreages a subteam published is still their number; averaging two ranks to
 * manufacture a criterion score is ours, because nothing in the source says to use
 * those two or to weight them equally.
 */
export function cellProvenance(
  node: CriterionNode,
  scenario: ScenarioKey,
  value: Score,
  slice?: string,
): Provenance | 'pending' {
  if (node.provenance === 'unscored') return 'unscored'
  if (value === null) return 'pending'
  if (node.inferredFor?.includes(scenario)) return 'inferred'
  if (slice && node.inferredSlices?.includes(slice)) return 'inferred'
  return node.provenance
}

/** True where this node is broken out along the given axis at all. */
export const TEAM_BY_KEY = Object.fromEntries(TEAMS.map((team) => [team.key, team])) as Record<
  TeamKey,
  (typeof TEAMS)[number]
>

// ---------- formatting ----------

const LADDER = ['no change', 'slight', 'moderate', 'significant', 'major', 'extreme']

/** A value in its own units. Scores keep ../data.ts's fmtScore; the rest read plainly. */
export function fmtValue(value: number, unit: Unit): string {
  switch (unit) {
    case 'share':
      return `${Math.round(value * 1000) / 10}%`
    case 'acres':
      return `${Math.round(value).toLocaleString('en-US')} ac`
    case 'dollars':
      return `${value < 0 ? '−' : ''}$${Math.abs(Math.round(value)).toLocaleString('en-US')}M`
    case 'usd':
      return `${value < 0 ? '−' : '+'}$${Math.abs(Math.round(value)).toLocaleString('en-US')}`
    case 'days': {
      const days = Math.round(value * 10) / 10
      if (days === 0) return 'no change'
      return `${days > 0 ? '+' : '−'}${Math.abs(days)} d`
    }
    case 'jobs': {
      // The salinity pathway moves fractions of a job, so rounding to a whole
      // number printed +0 for a figure the source states as +0.13.
      const jobs = Math.abs(value) < 10 ? Math.round(value * 100) / 100 : Math.round(value)
      return `${value < 0 ? '−' : '+'}${Math.abs(jobs).toLocaleString('en-US')}`
    }
    case 'ladder': {
      const step = LADDER[Math.min(LADDER.length - 1, Math.abs(Math.round(value)))]
      if (value === 0) return 'no change'
      return `${step} ${value > 0 ? 'younger' : 'older'}`
    }
    default: {
      const rounded = Math.round(value * 10) / 10
      if (rounded === 0) return '0'
      return rounded > 0 ? `+${rounded}` : `−${Math.abs(rounded)}`
    }
  }
}

/** Short label for the edge badge on a child row. */
export const EDGE_LABEL: Record<EdgeKind, string> = {
  averages: 'averages into',
  measures: 'measurement',
  derives: 'derives',
  refines: 'one scenario, finer',
  duplicates: 'same number',
  beside: 'beside the score',
  unscored: 'not scored',
}

export const PROVENANCE_LABEL: Record<Provenance, string> = {
  reported: 'reported',
  inferred: 'inferred',
  unscored: 'not scored',
}
