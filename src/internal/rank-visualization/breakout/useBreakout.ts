// State for one breakout table: what is on screen, and the views the host pinned.
//
// The selection is deliberately smaller than the 4C pivot's. A table host has a
// minute, not an afternoon: scenarios are a set, place and period are single
// picks, and the rows are the host team's ranking scores, each opened on demand
// into the entities it is based on (./rankingModel.ts). Pins live in localStorage
// so the laptop can be offline and the table's notes survive a reload.
import { useCallback, useEffect, useMemo, useState } from 'react'
import type { TeamKey } from '../data'
import { ANY, inClimate } from '../drilldown/model'
import type { Climate, CriterionNode, Facet, ScenarioKey } from '../drilldown/model'
import { SLR_STATUS } from '../drilldown/tree'
import { BREAKOUT_TREE, isRanked } from './rankingModel'

export type Reading = 'level' | 'change'

/**
 * The breakout's column order: Business as Usual first as the reference, then the
 * nature-based futures, then the engineered ones. Every view keeps all six in this
 * order and fades the ones switched off, so the screen never reshuffles.
 */
export const BREAKOUT_SCENARIOS: ScenarioKey[] = ['bau', 'em', 'ngw', 'bf', 'cor', 'tunnel']
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

const storageKey = (team: TeamKey) => `breakout:${team}`

function loadPins(team: TeamKey): Pin[] {
  try {
    const raw = localStorage.getItem(storageKey(team))
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

/** Where a table starts: the team's score and every ranking score, all closed. */
function startNodes(root: CriterionNode): string[] {
  return [root.id, ...(root.children ?? []).filter(isRanked).map((row) => row.id)]
}

/**
 * The most rows any team's table can show with every ranking score open (Economy:
 * its score, three metrics and their thirteen entities). Every table reserves this
 * many row heights, so one row height holds everywhere, open or closed, for every
 * team; a short table leaves the rest of the card empty rather than stretching.
 */
export const DENSEST_TABLE_ROWS = Math.max(
  ...BREAKOUT_TREE.map(
    (root) =>
      1 +
      (root.children ?? [])
        .filter(isRanked)
        .reduce((n, row) => n + 1 + (row.children?.length ?? 0), 0),
  ),
)

/** One row on screen: a ranking row, or an entity under an open one. */
export interface Row {
  node: CriterionNode
  depth: 0 | 1
  /** For a ranking row: whether it is open. */
  open?: boolean
}

export function useBreakout(team: TeamKey) {
  const root = useMemo(
    () => BREAKOUT_TREE.find((node) => node.team === team) ?? BREAKOUT_TREE[0],
    [team],
  )
  const metrics = useMemo(() => root.children ?? [], [root])

  const [nodes, setNodes] = useState<string[]>(() => startNodes(root))
  const [expanded, setExpanded] = useState<string[]>([])
  const [scenariosRaw, setScenarios] = useState<ScenarioKey[]>([...BREAKOUT_SCENARIOS])
  const [placeRaw, setPlace] = useState<string>(ANY)
  const [periodRaw, setPeriod] = useState<string>(ANY)
  const [reading, setReading] = useState<Reading>('level')
  /**
   * In a difference from Business as Usual, Business as Usual is the zero every
   * other column is read against, so it is switched off and cannot be switched on
   * while that reading lasts. The host's own pick is kept and comes back with the values.
   */
  const baselineLocked = reading === 'change'
  const scenarios = useMemo(
    () => (baselineLocked ? scenariosRaw.filter((s) => s !== 'bau') : scenariosRaw),
    [scenariosRaw, baselineLocked],
  )
  const [view, setView] = useState<View>('table')
  const slrStatus = SLR_STATUS[team]
  const [climateRaw, setClimate] = useState<Climate>('current')
  // Only a team whose SLR runs are loaded can leave today's run.
  const climate: Climate = slrStatus === 'loaded' ? climateRaw : 'current'
  const [pins, setPins] = useState<Pin[]>(() => loadPins(team))

  useEffect(() => {
    try {
      localStorage.setItem(storageKey(team), JSON.stringify(pins))
    } catch {
      // Storage can be unavailable in a private window; the pins then live for the session only.
    }
  }, [pins, team])

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
  // A score held only per entity offers its entities' places and periods, open or
  // closed, so its choices do not vanish from the rail until the row is opened.
  const facetNodes = useMemo(
    () =>
      selectedNodes.flatMap((n) =>
        n.entityNoun && Object.keys(n.values).length === 0 ? [n, ...(n.children ?? [])] : [n],
      ),
    [selectedNodes],
  )
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
      if (baselineLocked && key === 'bau') return
      setScenarios((prev) => {
        const next = prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key]
        return BREAKOUT_SCENARIOS.filter((s) => next.includes(s))
      })
    },
    [baselineLocked],
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
    setReading(entry.reading)
    setView(entry.view)
    setExpanded(entry.expanded ?? [])
    setClimate(entry.climate ?? 'current')
  }, [])
  const unpin = useCallback((id: string) => setPins((prev) => prev.filter((p) => p.id !== id)), [])
  const clearPins = useCallback(() => setPins([]), [])

  return {
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
    periodFacets,
    pins,
    toggleNode,
    toggleExpanded,
    toggleScenario,
    setAllScenarios: () => setScenarios([...BREAKOUT_SCENARIOS]),
    setPlace,
    setPeriod,
    setReading,
    setView,
    setClimate,
    pin,
    unpin,
    restore,
    clearPins,
  }
}

export type Breakout = ReturnType<typeof useBreakout>
