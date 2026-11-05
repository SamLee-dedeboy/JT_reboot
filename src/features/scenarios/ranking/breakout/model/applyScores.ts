// Puts ../../scores.ts onto each team's score and metric rows. It runs last, after a tree
// is built, so that file wins over any workbook or report data a row was assembled from.
import { ANY, sliceKey } from '../../../../../internal/rank-visualization/drilldown/model'
import type {
  CriterionNode,
  ScenarioKey,
  SliceValues,
} from '../../../../../internal/rank-visualization/drilldown/model'
import { CRITERION_SCORES } from '../../scores'
import type { RowScores } from '../../scores'

type Values = Partial<Record<ScenarioKey, SliceValues>>
type ByScenario = Partial<Record<ScenarioKey, number | null>>

/** Drinking water is sliced by class and period; scores.ts holds its all-points, whole-period score. */
const HEADLINE_SLICE: Record<string, string> = { 'ej-drinking': sliceKey('all', 'run') }

const rowId = (node: CriterionNode) => node.id.replace(/^(bk|of)-/, '')

/** Writes each score into the row's headline slice and leaves its other slices as they are. */
function withScores(base: Values, scores: ByScenario, slice: string): Values {
  const out = { ...base }
  for (const [key, score] of Object.entries(scores) as [ScenarioKey, number | null][]) {
    const series = { ...out[key] }
    if (score === null) delete series[slice]
    else series[slice] = score
    if (Object.keys(series).length > 0) out[key] = series
    else delete out[key]
  }
  return out
}

/** An arrow row's numbers are its steps; nulls have no step to show. */
function withSteps(steps: CriterionNode['steps'], scores: ByScenario): CriterionNode['steps'] {
  const out = { ...steps }
  for (const [key, score] of Object.entries(scores) as [ScenarioKey, number | null][]) {
    if (score === null) delete out[key]
    else out[key] = score
  }
  return out
}

function adaptationRow(node: CriterionNode, scores: RowScores): CriterionNode {
  const slice = HEADLINE_SLICE[rowId(node)] ?? sliceKey(ANY, ANY)
  const { current, seaLevelRise, ngwLevels, outflow } = scores
  if (node.steps) {
    // The table shows the +30% run's arrows in the same row.
    const more = outflow?.more === undefined ? {} : { more: outflow.more }
    return { ...node, steps: withSteps(node.steps, { ...current, ...more }) }
  }
  return {
    ...node,
    values: withScores(node.values, current, slice),
    ngwLevels:
      ngwLevels && typeof current.ngw === 'number'
        ? [ngwLevels.wetland25, current.ngw, ngwLevels.wetland100]
        : node.ngwLevels,
    slr: seaLevelRise && {
      note: '',
      sources: node.sources ?? [],
      ...node.slr,
      values: withScores(node.slr?.values ?? {}, seaLevelRise, slice),
    },
  }
}

function outflowRow(node: CriterionNode, scores: RowScores): CriterionNode {
  const { outflow } = scores
  if (!outflow) return node
  const slice = HEADLINE_SLICE[rowId(node)] ?? sliceKey(ANY, ANY)
  return {
    ...node,
    values: withScores(node.values, outflow, slice),
    steps: node.steps && withSteps(node.steps, outflow),
  }
}

/** Every row reads the same under sea level rise as it does today. */
function repeatUnderSlr(row: CriterionNode): CriterionNode {
  return {
    ...row,
    slr: { values: row.values, note: row.note, sources: row.sources ?? [] },
    children: row.children?.map(repeatUnderSlr),
  }
}

function applyTo(
  root: CriterionNode,
  apply: (node: CriterionNode, scores: RowScores) => CriterionNode,
): CriterionNode {
  const team = CRITERION_SCORES[root.team]
  return {
    ...apply(root, team),
    children: root.children?.map((child) => {
      const scores = team.metrics[rowId(child)]
      return scores ? apply(child, scores) : child
    }),
  }
}

/** A team's rows in the adaptation table. Eco-cultural's repeat under sea level rise. */
export function applyAdaptationScores(root: CriterionNode): CriterionNode {
  const applied = applyTo(root, adaptationRow)
  return root.team === 'ecoCultural' ? repeatUnderSlr(applied) : applied
}

/** A team's rows in the outflow table. */
export function applyOutflowScores(root: CriterionNode): CriterionNode {
  return applyTo(root, outflowRow)
}
