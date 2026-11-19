// Lays out the path tree: the six scenarios start as one bundle of lanes and branch off
// top to bottom; each aligned action is one path whose length is its score.
import type { GovernanceAction, GovernanceScenarioKey } from '../data/types'

/** Branching order, top to bottom: the scenario with the fewest actions of its own first. */
export const BRANCH_ORDER: GovernanceScenarioKey[] = ['tunnel', 'cor', 'bf', 'more', 'em', 'ngw']

/** The score levels the team coded, low to high (0 is "not relevant"). */
export const SCORE_LEVELS = [0.2, 0.25, 0.5, 0.75, 1] as const

/** Lane positions (0 = branches first) of the scenarios that consider the action. */
export const membersOf = (action: GovernanceAction) =>
  BRANCH_ORDER.flatMap((key, lane) => (action.scores[key] > 0 ? [lane] : []))

const totalOf = (action: GovernanceAction) =>
  BRANCH_ORDER.reduce((sum, key) => sum + action.scores[key], 0)

/** The average over the scenarios that consider the action. */
export function averageScore(action: GovernanceAction) {
  const count = membersOf(action).length
  return count ? totalOf(action) / count : 0
}

/** R's default quantile (type 7), as the team's scripts compute it. */
function quantile(values: number[], p: number) {
  const sorted = [...values].sort((a, b) => a - b)
  const h = (sorted.length - 1) * p
  const low = Math.floor(h)
  return sorted[low] + (h - low) * ((sorted[low + 1] ?? sorted[low]) - sorted[low])
}

/**
 * The team's overall top actions: the top quarter of all 129 actions by their score
 * summed over the six scenarios (data_wrangling.R, `overall_top_actions`).
 */
export function topActionIds(actions: GovernanceAction[]) {
  const cutoff = quantile(actions.map(totalOf), 0.75)
  return new Set(actions.filter((action) => totalOf(action) >= cutoff).map((a) => a.id))
}

export interface TreeRow {
  action: GovernanceAction
  /** Row center, from the top of the tree. */
  y: number
  /** Where the path starts: the first lane, in branching order, that considers it. */
  lane: number
  members: number[]
  /** The path's length: the average, or the pinned scenario's own score. */
  value: number
}

export interface TreeLane {
  key: GovernanceScenarioKey
  /** Where the lane leaves the bundle and curves out to its label. */
  branchY: number
  /** How many actions the scenario considers. */
  count: number
}

/** The actions only one scenario considers, under a shaded band with its own label line. */
export interface TreeBand {
  key: GovernanceScenarioKey
  lane: number
  top: number
  bottom: number
}

export interface TreeLayout {
  rows: TreeRow[]
  lanes: TreeLane[]
  bands: TreeBand[]
  height: number
}

export interface TreeMetrics {
  top: number
  rowHeight: number
  groupGap: number
  segmentGap: number
  branchDrop: number
  bottom: number
  /** The label line at the top of a one-scenario band. */
  bandHead: number
}

export function layoutTree(
  actions: GovernanceAction[],
  valueOf: (action: GovernanceAction) => number,
  metrics: TreeMetrics,
): TreeLayout {
  const aligned = actions.map((action) => ({ action, members: membersOf(action) }))
  const rows: TreeRow[] = []
  const lanes: TreeLane[] = []
  const bands: TreeBand[] = []
  let y = metrics.top

  BRANCH_ORDER.forEach((key, lane) => {
    const segment = aligned.filter(({ members }) => members[0] === lane)
    // Group by the exact set of scenarios: the most widely shared sets first.
    const groups = new Map<string, typeof segment>()
    segment.forEach((entry) => {
      const id = entry.members.join(',')
      groups.set(id, [...(groups.get(id) ?? []), entry])
    })
    const ordered = [...groups.values()].sort(
      (a, b) => b[0].members.length - a[0].members.length || b.length - a.length,
    )
    ordered.forEach((group, index) => {
      if (index > 0) y += metrics.groupGap
      // The one-scenario group (always last) gets a band, its label line first.
      const single = group[0].members.length === 1
      const bandTop = y
      if (single) y += metrics.bandHead
      group
        .map((entry) => ({ ...entry, value: valueOf(entry.action) }))
        .sort((a, b) => b.value - a.value || a.action.id.localeCompare(b.action.id))
        .forEach((entry) => {
          rows.push({ ...entry, lane, y: y + metrics.rowHeight / 2 })
          y += metrics.rowHeight
        })
      if (single) bands.push({ key, lane, top: bandTop, bottom: y + 3 })
    })

    lanes.push({
      key,
      branchY: y + metrics.branchDrop,
      count: actions.filter((action) => action.scores[key] > 0).length,
    })
    y += metrics.segmentGap
  })

  return { rows, lanes, bands, height: y + metrics.bottom }
}
