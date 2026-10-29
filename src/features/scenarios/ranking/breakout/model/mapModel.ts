// What the map view can draw for a team, and how its measures group into tabs.
import type { TeamKey } from '../../../../../internal/rank-visualization/data'
import { ANY, inClimate } from '../../../../../internal/rank-visualization/drilldown/model'
import type { CriterionNode } from '../../../../../internal/rank-visualization/drilldown/model'
import { REGION_DATA_KEY } from '../../../../../internal/rank-visualization/subteams/regionKeys'
import { lifeStage } from './cells'
import { UI } from './labels'
import type { Breakout } from '../useBreakout'

/**
 * Outline name → place key, per team. The shared keys, plus EJ: on this page its
 * places are the three vulnerability classes, which are exactly its outlines.
 */
export const MAP_REGION_KEY: Partial<Record<TeamKey, Record<string, string>>> = {
  ...REGION_DATA_KEY,
  environmentalJustice: { Moderate: 'moderate', High: 'high', Highest: 'highest' },
}

/** One measure the map can draw, under the ranking score it belongs to. */
export interface MapItem {
  node: CriterionNode
  score: CriterionNode
}

/** Teams whose map shows only the measures under a score, not the score's own map. */
const MAP_ENTITIES_ONLY: TeamKey[] = ['environmentalJustice']

/**
 * Every measure the map can draw, whatever is open in the table: each ranking
 * score on screen with numbers by place, and each of its entities that has them.
 */
export function mapItems(state: Breakout, team: TeamKey): MapItem[] {
  if (!MAP_REGION_KEY[team]) return []
  const ownMap = !MAP_ENTITIES_ONLY.includes(team)
  const mapped = (node: CriterionNode) =>
    node.places[0]?.key !== ANY &&
    Object.keys(inClimate(node, state.climate).values).some((key) => !key.startsWith(`${ANY}|`))
  return state.rows
    .filter((row) => row.depth === 0 && row.node.level !== 'team')
    .flatMap(({ node }) => [
      ...(ownMap && mapped(node) ? [{ node, score: node }] : []),
      ...(node.children ?? []).filter(mapped).map((child) => ({ node: child, score: node })),
    ])
}

/** Teams whose map picks a score first, then a measure under it, in two rows of tabs. */
export const NESTED_MAP_TABS: TeamKey[] = ['recreation', 'economy']

/**
 * Mapped measures as tabs, life stages together. Nested, a score's own tab sits
 * among its entities as "The score"; flat, every measure of the team is one row
 * and a score's tab carries its name.
 */
export function entityTabs(items: MapItem[], score: CriterionNode | null) {
  return items
    .filter((item) => score === null || item.score === score)
    .reduce<{ name: string; items: MapItem[] }[]>((out, item) => {
      const own = item.node === item.score
      const name = own
        ? score
          ? UI.mapScoreTab
          : item.node.label
        : lifeStage(item.node.label).name
      const tab = out.find((t) => t.name === name)
      if (tab) tab.items.push(item)
      else out.push({ name, items: [item] })
      return out
    }, [])
}
