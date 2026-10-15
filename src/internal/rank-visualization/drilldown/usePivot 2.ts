// State for 4c.
//
// There is deliberately no "current node". An earlier version had one — you stood
// somewhere in the criterion tree and compared that node's children — and it made
// the one thing this design is for impossible: two criteria from different subtrees
// could never share a table, and moving between them tore the selection down at
// every step. Here the selection *is* a set of node ids drawn from anywhere in the
// tree, so a lateral jump is a tick rather than a journey.
//
// Every dimension holds a set: one value selected means fixed, two or more means
// that dimension is an axis of the comparison.
import { useCallback, useMemo, useState } from 'react'
import { ANY, SCENARIO_KEYS, effectiveSlice } from './model'
import type { CriterionNode, Facet, ScenarioKey } from './model'
import { CRITERION_TREE, FLAT_TREE, NODE_INDEX } from './tree'

export type Dim = 'scenario' | 'criterion' | 'place' | 'period'

/** A table has two axes, so at most two dimensions may vary at once. */
export const MAX_AXES = 2

export const DIM_LABEL: Record<Dim, string> = {
  scenario: 'Scenarios',
  criterion: 'Criteria',
  place: 'Where',
  period: 'When',
}

export const DIM_PLURAL: Record<Dim, string> = {
  scenario: 'scenarios',
  criterion: 'criteria',
  place: 'places',
  period: 'periods',
}

export const LEVEL_PLURAL: Record<CriterionNode['level'], string> = {
  team: 'subteams',
  metric: 'metrics',
  entity: 'measurements',
}

/** Union of the facets the ticked criteria offer, in first-seen order. */
function unionFacets(nodes: CriterionNode[], axis: 'places' | 'periods'): Facet[] {
  const seen = new Map<string, Facet>()
  for (const node of nodes) {
    for (const facet of node[axis]) {
      if (facet.key !== ANY && !seen.has(facet.key)) seen.set(facet.key, facet)
    }
  }
  return [...seen.values()]
}

export function usePivot() {
  const [criteria, setCriteria] = useState<string[]>(CRITERION_TREE.map((team) => team.id))
  const [expanded, setExpanded] = useState<string[]>([])
  const [filter, setFilter] = useState('')
  const [scenarios, setScenarios] = useState<ScenarioKey[]>([...SCENARIO_KEYS])
  const [places, setPlaces] = useState<string[]>([])
  const [periods, setPeriods] = useState<string[]>([])
  const [swapped, setSwapped] = useState(false)
  /**
   * What a dimension held before a click in the table narrowed it to one value.
   * Isolating is only safe to offer because it is reversible, and reversible is
   * only useful if the way back is visible — hence the bar above the table.
   */
  const [stash, setStash] = useState<Partial<Record<Dim, string[]>>>({})
  /**
   * Which dimension was on the rows and which on the columns when the first click
   * narrowed something, kept until the last narrowing is undone.
   *
   * Without this the table re-axes itself the moment a dimension drops to one
   * value — criteria that were rows become columns, scenarios that were columns
   * become rows — and the reader has to find their place again from scratch. Held
   * roles turn every narrowing into the same, readable event: the rows and columns
   * you did not pick go away, and the one you did stays where you clicked it.
   */
  const [heldAxes, setHeldAxes] = useState<Dim[] | null>(null)

  const selectedNodes = useMemo(
    () => criteria.map((id) => NODE_INDEX.get(id)).filter((node): node is CriterionNode => !!node),
    [criteria],
  )

  /**
   * Rows of the picker. Typing flattens the tree — every match shown wherever it
   * lives — which is what makes reaching another subtree one keystroke instead of
   * a walk up and back down.
   */
  const rows = useMemo(() => {
    const needle = filter.trim().toLowerCase()
    if (needle) {
      return FLAT_TREE.filter((row) => row.node.label.toLowerCase().includes(needle)).map(
        (row) => ({ ...row, depth: 0 }),
      )
    }
    const open = new Set(expanded)
    return FLAT_TREE.filter((row) => {
      let parent = row.parentId
      while (parent) {
        if (!open.has(parent)) return false
        parent = FLAT_TREE.find((entry) => entry.node.id === parent)?.parentId
      }
      return true
    })
  }, [expanded, filter])

  const placeFacets = useMemo(() => unionFacets(selectedNodes, 'places'), [selectedNodes])
  const periodFacets = useMemo(() => unionFacets(selectedNodes, 'periods'), [selectedNodes])

  /**
   * Keep the slice controls honest against the ticked criteria: drop any facet they
   * no longer offer, and when nothing is chosen but something is on offer, choose
   * the one the data actually resolves. Leaving it unchosen made the table read a
   * default the control never showed — the control and the table have to agree.
   */
  const reconcile = useCallback((nodes: CriterionNode[]) => {
    const settle = (
      axis: 'places' | 'periods',
      part: 'place' | 'period',
      set: (fn: (prev: string[]) => string[]) => void,
    ) => {
      const keys = unionFacets(nodes, axis).map((facet) => facet.key)
      set((prev) => {
        const kept = prev.filter((key) => keys.includes(key))
        if (kept.length || keys.length === 0) return keys.length === 0 ? [] : kept
        const host = nodes.find((node) => node[axis].some((facet) => facet.key !== ANY))
        const pick = host ? effectiveSlice(host, ANY, ANY)[part] : ANY
        return [pick === ANY ? keys[0] : pick]
      })
    }
    settle('places', 'place', setPlaces)
    settle('periods', 'period', setPeriods)
  }, [])

  const commit = useCallback(
    (next: string[]) => {
      const kept = next.length ? next : criteria.slice(0, 1)
      // Always store in tree order, so a ticked child lands under its parent in the
      // table instead of at the end of the list in the order it was clicked.
      const order = new Map(FLAT_TREE.map((row, i) => [row.node.id, i]))
      kept.sort((a, b) => (order.get(a) ?? 0) - (order.get(b) ?? 0))
      setCriteria(kept)
      reconcile(kept.map((id) => NODE_INDEX.get(id)).filter((n): n is CriterionNode => !!n))
    },
    [criteria, reconcile],
  )

  const toggle = <T extends string>(setter: (fn: (prev: T[]) => T[]) => void, value: T, min = 1) =>
    setter((prev) =>
      prev.includes(value)
        ? prev.length > min
          ? prev.filter((entry) => entry !== value)
          : prev
        : [...prev, value],
    )

  const selection: Record<Dim, string[]> = {
    scenario: scenarios,
    criterion: criteria,
    place: places.length ? places : [ANY],
    period: periods.length ? periods : [ANY],
  }

  const varying = (Object.keys(selection) as Dim[]).filter((dim) => selection[dim].length > 1)
  const cells = varying.reduce((n, dim) => n * selection[dim].length, 1)

  // Criterion labels are the long ones, so they take the rows by default; the swap
  // is then a real choice rather than a workaround for an arbitrary ordering.
  const ordered = [...varying].sort((a, b) => (a === 'criterion' ? -1 : b === 'criterion' ? 1 : 0))
  const axes = swapped ? [...ordered].reverse() : ordered

  /** How many of a node's ancestors are also ticked — its indent in the table. */
  const tickedDepth = useCallback(
    (id: string) => {
      let depth = 0
      let parent = FLAT_TREE.find((row) => row.node.id === id)?.parentId
      while (parent) {
        if (criteria.includes(parent)) depth += 1
        parent = FLAT_TREE.find((row) => row.node.id === parent)?.parentId
      }
      return depth
    },
    [criteria],
  )

  const raw = useCallback(
    (dim: Dim): string[] =>
      dim === 'scenario'
        ? scenarios
        : dim === 'criterion'
          ? criteria
          : dim === 'place'
            ? places
            : periods,
    [criteria, periods, places, scenarios],
  )

  const setDim = useCallback(
    (dim: Dim, keys: string[]) => {
      if (dim === 'scenario') setScenarios(keys as ScenarioKey[])
      else if (dim === 'criterion') commit([...keys])
      else if (dim === 'place') setPlaces(keys)
      else setPeriods(keys)
    },
    [commit],
  )

  /** Editing a dimension by hand makes any stashed "before" for it stale. */
  const forget = useCallback(
    (dim: Dim) =>
      setStash((prev) => {
        if (!prev[dim]) return prev
        const next = { ...prev }
        delete next[dim]
        return next
      }),
    [],
  )

  /**
   * Narrow a dimension to one value, remembering what it held.
   *
   * There is no click-the-same-thing-again undo, because there is nothing left to
   * click: a dimension narrowed to one value stops being an axis, so the header or
   * label that was clicked leaves the table in the same gesture. The bar above the
   * table is the way back, and being the only way back is what makes it findable.
   */
  const isolate = useCallback(
    (dim: Dim, key: string) => {
      if (raw(dim).length === 1) return
      setHeldAxes((prev) => prev ?? axes)
      setStash((prev) => ({ ...prev, [dim]: prev[dim] ?? raw(dim) }))
      setDim(dim, [key])
    },
    [axes, raw, setDim],
  )

  const isolated = (Object.keys(stash) as Dim[]).filter((dim) => stash[dim]?.length)
  // Held roles lapse on their own once nothing is narrowed, so there is no state
  // to clear and no way for a stale pair of axes to outlive the thing it explains.
  const liveAxes = isolated.length > 0 && heldAxes ? heldAxes : axes

  return {
    criteria,
    tickedDepth,
    isolate,
    isolated,
    /** How many values a dimension had before it was isolated. */
    stashedCount: (dim: Dim) => stash[dim]?.length ?? 0,
    restore: (dim: Dim) => {
      const before = stash[dim]
      if (before) setDim(dim, before)
      forget(dim)
    },
    selectedNodes,
    rows,
    expanded,
    filter,
    scenarios,
    places,
    periods,
    placeFacets,
    periodFacets,
    selection,
    varying,
    axes: liveAxes,
    cells,
    swapped,
    setFilter,
    setSwapped,
    toggleExpanded: (id: string) =>
      setExpanded((prev) => (prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id])),
    toggleCriterion: (id: string) => {
      forget('criterion')
      commit(criteria.includes(id) ? criteria.filter((entry) => entry !== id) : [...criteria, id])
    },
    /** True where every part of a node is ticked — the open state of its chevron. */
    partsOpen: (id: string) => {
      const children = NODE_INDEX.get(id)?.children
      return !!children?.length && children.every((child) => criteria.includes(child.id))
    },
    /**
     * Expand or collapse a node's parts beneath it, keeping the node itself. This
     * is the table's chevron; the sidebar's "N parts" trades the total away for
     * its components instead, which is a different question.
     */
    toggleParts: (id: string) => {
      const node = NODE_INDEX.get(id)
      if (!node?.children?.length) return
      const childIds = node.children.map((child) => child.id)
      const allOn = childIds.every((childId) => criteria.includes(childId))
      forget('criterion')
      commit(
        allOn
          ? criteria.filter((entry) => !childIds.includes(entry))
          : [...new Set([...criteria, ...childIds])],
      )
      setExpanded((prev) => (prev.includes(id) ? prev : [...prev, id]))
    },
    /** Swap a node for its parts: its own total and its children rarely belong together. */
    pickParts: (id: string) => {
      const node = NODE_INDEX.get(id)
      if (!node?.children?.length) return
      forget('criterion')
      const childIds = node.children.map((child) => child.id)
      const allOn = childIds.every((childId) => criteria.includes(childId))
      commit(
        allOn
          ? criteria.filter((entry) => !childIds.includes(entry))
          : [...new Set([...criteria.filter((entry) => entry !== id), ...childIds])],
      )
      setExpanded((prev) => (prev.includes(id) ? prev : [...prev, id]))
    },
    setAllCriteria: (all: boolean) => {
      forget('criterion')
      commit(all ? CRITERION_TREE.map((team) => team.id) : [criteria[0]])
    },
    toggleScenario: (key: ScenarioKey) => {
      forget('scenario')
      toggle(setScenarios, key)
    },
    togglePlace: (key: string) => {
      forget('place')
      toggle(setPlaces, key, 0)
    },
    togglePeriod: (key: string) => {
      forget('period')
      toggle(setPeriods, key, 0)
    },
    setAllScenarios: (all: boolean) => {
      forget('scenario')
      setScenarios(all ? [...SCENARIO_KEYS] : [SCENARIO_KEYS[0]])
    },
    setAllPlaces: (all: boolean) => {
      forget('place')
      setPlaces(all ? placeFacets.map((f) => f.key) : [])
    },
    setAllPeriods: (all: boolean) => {
      forget('period')
      setPeriods(all ? periodFacets.map((f) => f.key) : [])
    },
    /** Used by the too-many-axes guard; the same call the "one" shortcuts make. */
    collapseDim: (dim: Dim) => {
      forget(dim)
      if (dim === 'scenario') setScenarios([scenarios[0]])
      if (dim === 'criterion') commit([criteria[0]])
      if (dim === 'place') setPlaces([])
      if (dim === 'period') setPeriods([])
    },
  }
}

export type Pivot = ReturnType<typeof usePivot>
