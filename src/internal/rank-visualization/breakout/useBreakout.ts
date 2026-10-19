// State for one breakout table: what is on screen, and the views the host pinned.
//
// The selection is deliberately smaller than the 4C pivot's. A table host has a
// minute, not an afternoon: scenarios are a set, place and period are single
// picks, and the criteria are the host team's own metrics, opened into their
// parts on demand. Pins live in localStorage so the laptop can be offline and
// the table's notes survive a reload.
import { useCallback, useEffect, useMemo, useState } from 'react'
import type { TeamKey } from '../data'
import { ANY, SCENARIO_KEYS } from '../drilldown/model'
import type { CriterionNode, Facet, ScenarioKey } from '../drilldown/model'
import { CRITERION_TREE, NODE_INDEX } from '../drilldown/tree'
import { valueAt } from '../drilldown/cellValue'

export type Reading = 'level' | 'change'
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

/** The facets the selected nodes offer, pooled; `[ANY]` nodes contribute nothing. */
function pooled(nodes: CriterionNode[], axis: 'places' | 'periods'): Facet[] {
  const seen = new Map<string, Facet>()
  for (const node of nodes) {
    for (const facet of node[axis])
      if (facet.key !== ANY && !seen.has(facet.key)) seen.set(facet.key, facet)
  }
  return [...seen.values()]
}

/** True where the team itself published a number for this node under some scenario. */
function published(node: CriterionNode): boolean {
  return SCENARIO_KEYS.some((scenario) => {
    const cell = valueAt({ criterion: node.id, scenario, place: ANY, period: ANY })
    return cell.value !== null && !cell.inferred
  })
}

/**
 * Where a table starts: the team's score and its metrics, except that a metric
 * whose own value is ours opens straight into the parts the team did publish, so
 * the first screen is never a row of placeholders.
 */
function startNodes(root: CriterionNode): string[] {
  const out = [root.id]
  for (const metric of root.children ?? []) {
    const parts = (metric.children ?? []).filter(published)
    if (!published(metric) && parts.length > 0) out.push(...parts.map((part) => part.id))
    else out.push(metric.id)
  }
  return out
}

export function useBreakout(team: TeamKey) {
  const root = useMemo(
    () => CRITERION_TREE.find((node) => node.id === team) ?? CRITERION_TREE[0],
    [team],
  )
  const metrics = useMemo(() => root.children ?? [], [root])

  const [nodes, setNodes] = useState<string[]>(() => startNodes(root))
  const [scenarios, setScenarios] = useState<ScenarioKey[]>([...SCENARIO_KEYS])
  const [placeRaw, setPlace] = useState<string>(ANY)
  const [periodRaw, setPeriod] = useState<string>(ANY)
  const [reading, setReading] = useState<Reading>('level')
  const [view, setView] = useState<View>('table')
  const [pins, setPins] = useState<Pin[]>(() => loadPins(team))

  useEffect(() => {
    try {
      localStorage.setItem(storageKey(team), JSON.stringify(pins))
    } catch {
      // Storage can be unavailable in a private window; the pins then live for the session only.
    }
  }, [pins, team])

  const selectedNodes = useMemo(
    () => nodes.map((id) => NODE_INDEX.get(id)).filter((n): n is CriterionNode => !!n),
    [nodes],
  )
  const placeFacets = useMemo(() => pooled(selectedNodes, 'places'), [selectedNodes])
  // A team's own "whole run" facet is the same pick as "all periods"; one button covers both.
  const periodFacets = useMemo(
    () => pooled(selectedNodes, 'periods').filter((f) => !/^whole run$/i.test(f.label)),
    [selectedNodes],
  )

  // A place or period that no selected node offers reads as "all", without
  // touching the stored pick, so it comes back when its node is ticked again.
  const place = placeFacets.some((f) => f.key === placeRaw) ? placeRaw : ANY
  const period = periodFacets.some((f) => f.key === periodRaw) ? periodRaw : ANY

  const toggleNode = useCallback((id: string) => {
    setNodes((prev) => (prev.includes(id) ? prev.filter((n) => n !== id) : [...prev, id]))
  }, [])
  /** Open a metric into its parts: the parts replace it; closing restores it. */
  const toggleParts = useCallback((id: string) => {
    const node = NODE_INDEX.get(id)
    const kids = node?.children?.map((k) => k.id) ?? []
    if (!kids.length) return
    setNodes((prev) => {
      const open = kids.every((k) => prev.includes(k))
      if (open)
        return [...prev.filter((n) => !kids.includes(n)), id].filter(
          (n, i, a) => a.indexOf(n) === i,
        )
      const without = prev.filter((n) => n !== id)
      const at = prev.indexOf(id)
      return at === -1
        ? [...without, ...kids]
        : [...without.slice(0, at), ...kids, ...without.slice(at)]
    })
  }, [])
  const partsOpen = useCallback(
    (id: string) => {
      const kids = NODE_INDEX.get(id)?.children?.map((k) => k.id) ?? []
      return kids.length > 0 && kids.every((k) => nodes.includes(k))
    },
    [nodes],
  )
  const toggleScenario = useCallback((key: ScenarioKey) => {
    setScenarios((prev) => {
      const next = prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key]
      return SCENARIO_KEYS.filter((s) => next.includes(s))
    })
  }, [])

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
        note,
      }
      setPins((prev) => [...prev, entry])
    },
    [nodes, scenarios, place, period, reading, view],
  )
  const restore = useCallback((entry: Pin) => {
    setNodes(entry.nodes)
    setScenarios(entry.scenarios)
    setPlace(entry.place)
    setPeriod(entry.period)
    setReading(entry.reading)
    setView(entry.view)
  }, [])
  const unpin = useCallback((id: string) => setPins((prev) => prev.filter((p) => p.id !== id)), [])
  const clearPins = useCallback(() => setPins([]), [])

  return {
    root,
    metrics,
    nodes,
    selectedNodes,
    scenarios,
    place,
    period,
    reading,
    view,
    placeFacets,
    periodFacets,
    pins,
    toggleNode,
    toggleParts,
    partsOpen,
    toggleScenario,
    setAllScenarios: () => setScenarios([...SCENARIO_KEYS]),
    setPlace,
    setPeriod,
    setReading,
    setView,
    pin,
    unpin,
    restore,
    clearPins,
  }
}

export type Breakout = ReturnType<typeof useBreakout>
