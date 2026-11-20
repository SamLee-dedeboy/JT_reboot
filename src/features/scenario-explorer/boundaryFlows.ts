// Monthly CalSim boundary flows for the scenarios that have them (Calling on Reserves and A Tunnel,
// against BAU CalSim), and where each boundary sits on the map. The numbers come from
// public/data/operations/boundary-flows-monthly.json; rebuild it with
// scripts/scenario-explorer/build_boundary_flows.py.
import flows from '../../../public/data/operations/boundary-flows-monthly.json'

export type BoundaryKey =
  'sacramento' | 'sanJoaquin' | 'netDeltaOutflow' | 'swpExports' | 'cvpExports' | 'tunnelDiversion'

type LngLat = [number, number]

export interface Boundary {
  key: BoundaryKey
  label: string
  /** The arrow runs from `from` to `to`, in the direction the water moves. */
  from: LngLat
  to: LngLat
  /**
   * Where the label sits: beside the arrow's middle (left of the flow, or right with `side-right`),
   * or past its tip (`end`), for arrows whose sides are crowded.
   */
  labelAt?: 'side-left' | 'side-right' | 'end'
}

/**
 * Where each boundary flow enters or leaves the Delta, drawn as an arrow along that direction.
 * The arrows and their labels sit just off the station network so they never cover a station: the
 * Sacramento arrow runs west of the river's stations, outflow passes south of Martinez, and the
 * export and San Joaquin arrows sit outside the south Delta's stations.
 */
export const BOUNDARIES: readonly Boundary[] = [
  { key: 'sacramento', label: 'Sacramento R.', from: [-121.674, 38.545], to: [-121.674, 38.425] },
  {
    key: 'tunnelDiversion',
    label: 'Tunnel intakes',
    from: [-121.478, 38.351],
    to: [-121.374, 38.303],
    labelAt: 'end',
  },
  {
    key: 'sanJoaquin',
    label: 'San Joaquin R.',
    from: [-121.063, 37.739],
    to: [-121.174, 37.788],
    labelAt: 'side-right',
  },
  {
    key: 'netDeltaOutflow',
    label: 'Net Delta outflow',
    from: [-121.897, 38.008],
    to: [-122.014, 38.008],
    labelAt: 'side-right',
  },
  {
    key: 'swpExports',
    label: 'SWP exports',
    from: [-121.616, 37.796],
    to: [-121.703, 37.751],
    labelAt: 'end',
  },
  {
    key: 'cvpExports',
    label: 'CVP exports',
    from: [-121.554, 37.774],
    to: [-121.535, 37.718],
    labelAt: 'end',
  },
]

type FlowSeries = Record<BoundaryKey, number[]>
const scenarios = flows.scenarios as Record<string, FlowSeries>

/**
 * What each scenario changes, by boundary: that one is drawn in the brand green with a bold label,
 * and boundaries the scenario doesn't have are left off (Calling on Reserves has no tunnel).
 */
const SCENARIO_FOCUS: Record<string, { emphasized: BoundaryKey; hidden: BoundaryKey[] }> = {
  reserve: { emphasized: 'sacramento', hidden: ['tunnelDiversion'] },
  tunnel: { emphasized: 'tunnelDiversion', hidden: [] },
}

/** The base the flows are compared with; the salinity map uses the same one for these runs. */
export const BOUNDARY_FLOW_BASE = 'baseline-calsim'

export interface BoundaryFlowChange {
  boundary: Boundary
  base: number
  scenario: number
  change: number
  /** The boundary this scenario acts on, drawn to stand out. */
  emphasized: boolean
}

/**
 * Each boundary's flow in one month (`YYYY-MM`) against BAU CalSim, or null when the comparison
 * has no boundary flows (any scenario other than Calling on Reserves and A Tunnel, any other base).
 */
export function boundaryFlowChanges(
  scenarioKey: string,
  baseKey: string,
  month: string,
): BoundaryFlowChange[] | null {
  const series = scenarios[scenarioKey]
  const baseSeries = scenarios[baseKey]
  const index = flows.months.indexOf(month)
  if (baseKey !== BOUNDARY_FLOW_BASE || scenarioKey === baseKey || !series || !baseSeries)
    return null
  if (index < 0) return null
  const focus = SCENARIO_FOCUS[scenarioKey]
  return BOUNDARIES.filter((boundary) => !focus?.hidden.includes(boundary.key)).map((boundary) => {
    const base = baseSeries[boundary.key][index]
    const scenario = series[boundary.key][index]
    return {
      boundary,
      base,
      scenario,
      change: scenario - base,
      emphasized: focus?.emphasized === boundary.key,
    }
  })
}
