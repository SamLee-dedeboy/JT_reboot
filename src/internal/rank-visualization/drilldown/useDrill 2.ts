// One selection state shared by both drill-down designs.
//
// The four intents (scenario-, subteam-, metric-, entity-driven) are not four
// flows: they are which dimension is pinned while the others vary. Because focus
// and the three selections are independent pieces of state, re-anchoring on a
// different dimension never resets the rest — which is what lets the user arrive
// at the same cell in any order.
import { useCallback, useMemo, useState } from 'react'
import { ANY, SCENARIO_KEYS, hasPeriods, hasPlaces } from './model'
import type { ScenarioKey } from './model'
import { NODE_INDEX, pathTo } from './tree'

/** Which dimension is held still. `slice` only exists where place/time is an axis (4a). */
export type Focus = 'scenario' | 'criterion' | 'slice'

/** Pseudo-node id for "all five subteams", the top of the criterion axis. */
export const ALL_CRITERIA = 'all'

export interface DrillState {
  focus: Focus
  /** Pinned when focus is `scenario`; the comparison set otherwise. */
  scenario: ScenarioKey
  nodeId: string
  place: string
  period: string
}

const INITIAL: DrillState = {
  focus: 'criterion',
  scenario: 'ngw',
  nodeId: ALL_CRITERIA,
  place: ANY,
  period: ANY,
}

export function useDrill(initial?: Partial<DrillState>) {
  const [state, setState] = useState<DrillState>({ ...INITIAL, ...initial })

  const node = state.nodeId === ALL_CRITERIA ? undefined : NODE_INDEX.get(state.nodeId)
  const path = useMemo(
    () => (state.nodeId === ALL_CRITERIA ? [] : pathTo(state.nodeId)),
    [state.nodeId],
  )

  const setFocus = useCallback((focus: Focus) => setState((s) => ({ ...s, focus })), [])
  const setScenario = useCallback(
    (scenario: ScenarioKey) => setState((s) => ({ ...s, scenario })),
    [],
  )
  const setPlace = useCallback((place: string) => setState((s) => ({ ...s, place })), [])
  const setPeriod = useCallback((period: string) => setState((s) => ({ ...s, period })), [])

  /**
   * Move to a node, keeping place and period even when the new node does not
   * break out along them — the view says so rather than silently dropping them.
   */
  const setNode = useCallback((nodeId: string) => setState((s) => ({ ...s, nodeId })), [])

  return { ...state, node, path, setFocus, setScenario, setNode, setPlace, setPeriod }
}

export type Drill = ReturnType<typeof useDrill>

/** Scenario keys in display order, for the comparison views. */
export const SCENARIO_COMPARE_ORDER = SCENARIO_KEYS

/** Whether the current node offers anything along each slice axis. */
export function sliceSupport(drill: Drill) {
  if (!drill.node) return { place: false, period: false }
  return { place: hasPlaces(drill.node), period: hasPeriods(drill.node) }
}
