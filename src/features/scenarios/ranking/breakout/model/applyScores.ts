// Puts ../../scores.ts onto each team's score and metric rows, and ../../values/ onto the
// rows beneath them. It runs last, after a tree is built, so those files win over any
// workbook or report data a row was assembled from.
import { ANY, sliceKey } from '../../../../../internal/rank-visualization/drilldown/model'
import type {
  CriterionNode,
  ScenarioKey,
  SliceValues,
} from '../../../../../internal/rank-visualization/drilldown/model'
import { CRITERION_SCORES } from '../../scores'
import type { RowScores } from '../../scores'
import { TEAM_VALUES } from '../../values'
import type { MeasureRow, ScenarioValues } from '../../values/types'

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

/** A values file's scenarios as the slices the table reads. */
export function expandValues(values: ScenarioValues): Values {
  const out: Values = {}
  for (const [key, value] of Object.entries(values)) {
    const series: SliceValues = {}
    if (value === null || typeof value === 'number') series[sliceKey(ANY, ANY)] = value
    else
      for (const [place, periods] of Object.entries(value))
        for (const [period, cell] of Object.entries(periods)) series[sliceKey(place, period)] = cell
    out[key as ScenarioKey] = series
  }
  return out
}

/** The rows beneath the metrics, from the team's values file. */
function withMeasures(node: CriterionNode, rows: Record<string, MeasureRow>): CriterionNode {
  const row = rows[rowId(node)]
  return {
    ...node,
    ...(row?.values && { values: expandValues(row.values) }),
    ...(row?.seaLevelRise && {
      slr: {
        note: '',
        sources: node.sources ?? [],
        ...node.slr,
        values: expandValues(row.seaLevelRise),
      },
    }),
    ...(row?.steps && { steps: row.steps }),
    ...(row?.ngwLevels && { ngwLevels: row.ngwLevels }),
    children: node.children?.map((child) => withMeasures(child, rows)),
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
  const measured = withMeasures(root, TEAM_VALUES[root.team].adaptation)
  const applied = applyTo(measured, adaptationRow)
  return root.team === 'ecoCultural' ? repeatUnderSlr(applied) : applied
}

/** A team's rows in the outflow table. */
export function applyOutflowScores(root: CriterionNode): CriterionNode {
  return applyTo(withMeasures(root, TEAM_VALUES[root.team].outflow), outflowRow)
}
