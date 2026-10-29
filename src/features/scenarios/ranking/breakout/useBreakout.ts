// State for one breakout table: what is on screen, and the views the host pinned.
//
// The selection is deliberately smaller than the 4C pivot's. A table host has a
// minute, not an afternoon: scenarios are a set, place and period are single
// picks, and the rows are the host team's ranking scores, each opened on demand
// into the entities it is based on (./rankingModel.ts). Pins live in localStorage
// so the laptop can be offline and the table's notes survive a reload.
import { useCallback, useEffect, useMemo, useState } from 'react'
import type { TeamKey } from '../../../../internal/rank-visualization/data'
import { ANY, CALSIM_BAU, inClimate } from '../../../../internal/rank-visualization/drilldown/model'
import type {
  Climate,
  CriterionNode,
  Facet,
  ScenarioKey,
} from '../../../../internal/rank-visualization/drilldown/model'
import { SLR_STATUS } from '../../../../internal/rank-visualization/drilldown/tree'
import { SCENARIO_GROUPS } from './model/labels'
import { ADAPTATION_TREE, OUTFLOW_BASELINE, OUTFLOW_COLUMN } from './model/outflowColumn'
import { OUTFLOW_TREE } from './model/outflowModel'
import { BREAKOUT_TREE, isRanked } from './model/rankingModel'

export type Reading = 'level' | 'change'

/**
 * The breakout's column order: Business as Usual first as the reference, then the
 * nature-based futures, then the engineered ones. Every view keeps all six in this
 * order and fades the ones switched off, so the screen never reshuffles.
 */
export const BREAKOUT_SCENARIOS: ScenarioKey[] = ['bau', 'em', 'ngw', 'bf', 'cor', 'tunnel']

/** The two scenario sets a table can show; they are never shown together. */
export type ScenarioSetId = 'adaptation' | 'outflow'

export interface ScenarioSet {
  /** The columns, in their fixed order. */
  columns: ScenarioKey[]
  /** The columns in their groups, drawn with a gap between groups. */
  groups: ScenarioKey[][]
  /** A heading over each group, where the groups have names. */
  groupLabels?: string[]
  /** The run the set is named against ("Deviation from …"). */
  baseline: ScenarioKey
  /** The run one column's difference is read against. */
  baselineOf: (scenario: ScenarioKey) => ScenarioKey
  /** The teams' trees for this set. */
  tree: CriterionNode[]
  /** The whole run's span, for the period control. */
  wholeRun: string
  /** The whole run's months, for the TIME PERIOD info card. */
  wholeRunMonths: string
}

/**
 * The adaptation table's two groups: the RMA runs read against Business as Usual,
 * then the CalSim runs read against CalSim's own Business as Usual, with the +30%
 * outflow run read against its Historic Baseline. Business as Usual is no column:
 * every column is shown as its difference from its own baseline by default.
 */
const RMA_GROUP: ScenarioKey[] = ['em', 'ngw', 'bf']
const CALSIM_GROUP: ScenarioKey[] = ['cor', 'tunnel', OUTFLOW_COLUMN]

export const SCENARIO_SETS: Record<ScenarioSetId, ScenarioSet> = {
  adaptation: {
    columns: [...RMA_GROUP, ...CALSIM_GROUP],
    groups: [RMA_GROUP, CALSIM_GROUP],
    groupLabels: [SCENARIO_GROUPS.landscape, SCENARIO_GROUPS.waterFlow],
    baseline: 'bau',
    baselineOf: (scenario) =>
      scenario === OUTFLOW_COLUMN
        ? OUTFLOW_BASELINE
        : scenario === 'cor' || scenario === 'tunnel'
          ? CALSIM_BAU
          : 'bau',
    tree: ADAPTATION_TREE,
    wholeRun: 'Whole period',
    wholeRunMonths: 'Oct 2018 – Dec 2020',
  },
  // The tiered outflow runs, read against their own Historic Baseline.
  outflow: {
    columns: ['hist', 'more', 'less'],
    groups: [['hist', 'more', 'less']],
    baseline: 'hist',
    baselineOf: () => 'hist',
    tree: OUTFLOW_TREE,
    wholeRun: 'Whole period',
    wholeRunMonths: 'Oct 2020 – Jan 2022',
  },
}
export type View = 'table' | 'chart' | 'map'

export interface Pin {
  id: string
  at: string
  nodes: string[]
  scenarios: ScenarioKey[]
  place: string
  period: string
  reading: Reading
  view: View
  /** The ranking rows that were open. Absent on older pins: none. */
  expanded?: string[]
  /** Absent on pins made before the sea-level-rise switch: those are today's run. */
  climate?: Climate
  note: string
}

/** Adaptation pins keep their original key, so pins saved before the outflow tab survive. */
const storageKey = (team: TeamKey, set: ScenarioSetId) =>
  set === 'adaptation' ? `breakout:${team}` : `breakout:${team}:${set}`

function loadPins(team: TeamKey, set: ScenarioSetId): Pin[] {
  try {
    const raw = localStorage.getItem(storageKey(team, set))
    return raw ? (JSON.parse(raw) as Pin[]) : []
  } catch {
    return []
  }
}

/**
 * The facets the selected nodes offer, pooled. `[ANY]` nodes contribute nothing,
 * and neither does a row with no data in this run (a score with no sea-level-rise
 * result): it would offer periods nobody on screen can show.
 */
function pooled(nodes: CriterionNode[], axis: 'places' | 'periods'): Facet[] {
  const seen = new Map<string, Facet>()
  for (const node of nodes) {
    if (Object.keys(node.values).length === 0 && !node.ranks) continue
    for (const facet of node[axis])
      if (facet.key !== ANY && !seen.has(facet.key)) seen.set(facet.key, facet)
  }
  return [...seen.values()]
}

/**
 * Teams whose metrics described in words, never scored, are rows of their own:
 * Eco-cultural's three are as much its criterion as its scored one.
 */
const SHOW_UNSCORED: TeamKey[] = ['ecoCultural']

/** Where a table starts: the team's score and every ranking score, all closed. */
function startNodes(root: CriterionNode): string[] {
  const shown = (row: CriterionNode) => isRanked(row) || SHOW_UNSCORED.includes(root.team)
  return [root.id, ...(root.children ?? []).filter(shown).map((row) => row.id)]
}

/** An entity row's height against a ranking row's: the detail sits lower and tighter. */
export const ENTITY_ROW = 0.7

/**
 * The most rows any team's table can show with every ranking score open (Economy:
 * its score, three metrics and their thirteen entities). Every table reserves this
 * many row heights, so one row height holds everywhere, open or closed, for every
 * team; a short table leaves the rest of the card empty rather than stretching.
 */
export const DENSEST_TABLE_ROWS = Math.max(
  ...[...BREAKOUT_TREE, ...OUTFLOW_TREE].map(
    (root) =>
      1 +
      (root.children ?? [])
        .filter(isRanked)
        .reduce((n, row) => n + 1 + (row.children?.length ?? 0) * ENTITY_ROW, 0),
  ),
)

/** One row on screen: a ranking row, or an entity under an open one. */
export interface Row {
  node: CriterionNode
  depth: 0 | 1
  /** For a ranking row: whether it is open. */
  open?: boolean
}

export function useBreakout(team: TeamKey, setId: ScenarioSetId = 'adaptation') {
  const set = SCENARIO_SETS[setId]
  const { columns, baseline } = set
  const root = useMemo(
    () => set.tree.find((node) => node.team === team) ?? set.tree[0],
    [set, team],
  )
  const metrics = useMemo(() => root.children ?? [], [root])

  const [nodes, setNodes] = useState<string[]>(() => startNodes(root))
  const [expanded, setExpanded] = useState<string[]>([])
  const [scenariosRaw, setScenarios] = useState<ScenarioKey[]>([...columns])
  const [placeRaw, setPlace] = useState<string>(ANY)
  const [periodRaw, setPeriod] = useState<string>(ANY)
  /** The table only ever shows differences from each column's baseline. */
  const reading: Reading = 'change'
  /**
   * A baseline that is also a column (the outflow runs' Historic Baseline) is the zero
   * every other column is read against, so it stays switched off.
   */
  const baselineLocked = columns.includes(baseline)
  const scenarios = useMemo(
    () => (baselineLocked ? scenariosRaw.filter((s) => s !== baseline) : scenariosRaw),
    [scenariosRaw, baselineLocked, baseline],
  )
  const [view, setView] = useState<View>('table')
  // The outflow runs were never run with sea level rise.
  const slrStatus = setId === 'adaptation' ? SLR_STATUS[team] : undefined
  const [climateRaw, setClimate] = useState<Climate>('current')
  // Only a team whose SLR runs are loaded can leave today's run.
  const climate: Climate = slrStatus === 'loaded' ? climateRaw : 'current'
  const [pins, setPins] = useState<Pin[]>(() => loadPins(team, setId))

  useEffect(() => {
    try {
      localStorage.setItem(storageKey(team, setId), JSON.stringify(pins))
    } catch {
      // Storage can be unavailable in a private window; the pins then live for the session only.
    }
  }, [pins, team, setId])

  // The rows on screen, in the tree's order: each chosen ranking row, followed by
  // its entities when it is open. Read through the climate, so facets and values
  // are the ones that run has.
  const rows = useMemo<Row[]>(() => {
    const out: Row[] = []
    for (const row of [root, ...(root.children ?? [])]) {
      if (!nodes.includes(row.id)) continue
      // The team's score is not based on entities: its children are the ranking rows themselves.
      const open = row !== root && expanded.includes(row.id) && !!row.children?.length
      out.push({ node: inClimate(row, climate), depth: 0, open })
      if (open)
        for (const child of row.children ?? [])
          out.push({ node: inClimate(child, climate), depth: 1 })
    }
    return out
  }, [root, nodes, expanded, climate])
  const selectedNodes = useMemo(() => rows.map((row) => row.node), [rows])
  // A row offers its children's places and periods whether it is open or closed, so
  // the rail's choices are there from the start (Economy's Delta areas sit one level
  // down) and do not vanish when a row is closed.
  const facetNodes = useMemo(
    () => selectedNodes.flatMap((n) => [n, ...(n.children ?? [])]),
    [selectedNodes],
  )
  /** The metrics read by place, for the PLACE info card: a metric, or its parts. */
  const placeMetrics = useMemo(() => {
    const byPlace = (n: CriterionNode) => n.places.some((f) => f.key !== ANY)
    return (root.children ?? []).flatMap((metric) => {
      const parts = (metric.children ?? []).filter(byPlace)
      // Most of its parts by place: name the metric; a few: name those parts.
      if (byPlace(metric) || parts.length * 2 >= (metric.children?.length ?? 0) + 1)
        return [metric.label]
      return parts.map((part) => `${metric.label}: ${part.label}`)
    })
  }, [root])
  const placeFacets = useMemo(() => pooled(facetNodes, 'places'), [facetNodes])
  // A team's own "whole run" facet is the same pick as "all periods"; one button covers both.
  const periodFacets = useMemo(
    () => pooled(facetNodes, 'periods').filter((f) => f.key !== 'run'),
    [facetNodes],
  )
  /** Whether any row on screen has a whole run, so the "Whole run" choice means something. */
  const hasWholeRun = useMemo(
    () => selectedNodes.some((n) => n.periods.some((f) => f.key === 'run')),
    [selectedNodes],
  )

  // A place or period that no selected node offers reads as "all", without
  // touching the stored pick, so it comes back when its node is ticked again.
  const place = placeFacets.some((f) => f.key === placeRaw) ? placeRaw : ANY
  const period = periodFacets.some((f) => f.key === periodRaw) ? periodRaw : ANY

  const toggleNode = useCallback((id: string) => {
    setNodes((prev) => (prev.includes(id) ? prev.filter((n) => n !== id) : [...prev, id]))
  }, [])
  /** Open a ranking row into the entities it is based on, or close it again. */
  const toggleExpanded = useCallback((id: string) => {
    setExpanded((prev) => (prev.includes(id) ? prev.filter((n) => n !== id) : [...prev, id]))
  }, [])
  const toggleScenario = useCallback(
    (key: ScenarioKey) => {
      if (baselineLocked && key === baseline) return
      setScenarios((prev) => {
        const next = prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key]
        return columns.filter((s) => next.includes(s))
      })
    },
    [baselineLocked, baseline, columns],
  )

  const pin = useCallback(
    (note: string) => {
      const entry: Pin = {
        id: `${Date.now()}`,
        at: new Date().toISOString(),
        nodes,
        scenarios,
        place,
        period,
        reading,
        view,
        expanded,
        climate,
        note,
      }
      setPins((prev) => [...prev, entry])
    },
    [nodes, scenarios, place, period, reading, view, expanded, climate],
  )
  const restore = useCallback((entry: Pin) => {
    setNodes(entry.nodes)
    setScenarios(entry.scenarios)
    setPlace(entry.place)
    setPeriod(entry.period)
    setView(entry.view)
    setExpanded(entry.expanded ?? [])
    setClimate(entry.climate ?? 'current')
  }, [])
  const unpin = useCallback((id: string) => setPins((prev) => prev.filter((p) => p.id !== id)), [])
  const clearPins = useCallback(() => setPins([]), [])

  return {
    setId,
    columns,
    groups: set.groups,
    groupLabels: set.groupLabels,
    baseline,
    baselineOf: set.baselineOf,
    wholeRun: set.wholeRun,
    wholeRunMonths: set.wholeRunMonths,
    root,
    metrics,
    nodes,
    rows,
    expanded,
    selectedNodes,
    hasWholeRun,
    scenarios,
    baselineLocked,
    place,
    period,
    reading,
    view,
    climate,
    slrStatus,
    placeFacets,
    placeMetrics,
    periodFacets,
    pins,
    toggleNode,
    toggleExpanded,
    toggleScenario,
    setAllScenarios: () => setScenarios([...columns]),
    setPlace,
    setPeriod,
    setView,
    setClimate,
    pin,
    unpin,
    restore,
    clearPins,
  }
}

export type Breakout = ReturnType<typeof useBreakout>
