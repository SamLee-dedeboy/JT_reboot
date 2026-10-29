// The +30% outflow run as the adaptation table's sixth column.
//
// The outflow tree (./outflowModel.ts) mirrors the adaptation tree under `of-` ids,
// so each adaptation row takes its counterpart's +30% values, and the Historic
// Baseline they are read against, as extra scenarios. A row with no counterpart
// inherits its nearest counterpart's state: not applicable where the runs cannot
// move it (they change no landscape), otherwise forthcoming.
import type {
  CriterionNode,
  ScenarioKey,
} from '../../../../../internal/rank-visualization/drilldown/model'
import { NODE_INDEX } from '../../../../../internal/rank-visualization/drilldown/tree'
import { OUTFLOW_TREE } from './outflowModel'
import { BREAKOUT_TREE } from './rankingModel'

/** The run shown as a column, and the run it is read against. */
export const OUTFLOW_COLUMN: ScenarioKey = 'more'
export const OUTFLOW_BASELINE: ScenarioKey = 'hist'

const OUTFLOW_INDEX = new Map<string, CriterionNode>()
const index = (n: CriterionNode) => {
  OUTFLOW_INDEX.set(n.id, n)
  n.children?.forEach(index)
}
OUTFLOW_TREE.forEach(index)

/** `bk-eco-niche-longfinJuv` → `of-eco-longfinJuv`; every other row swaps its prefix. */
const counterpartId = (id: string) => id.replace(/^bk-/, 'of-').replace(/^of-eco-niche-/, 'of-eco-')

type Inherited = 'notApplicable' | 'forthcoming'

const stateOf = (of: CriterionNode, inherited: Inherited): Inherited =>
  of.notApplicable?.includes(OUTFLOW_COLUMN)
    ? 'notApplicable'
    : of.forthcoming
      ? 'forthcoming'
      : inherited

function withOutflow(row: CriterionNode, inherited: Inherited = 'forthcoming'): CriterionNode {
  const of = OUTFLOW_INDEX.get(counterpartId(row.id))
  const state = of ? stateOf(of, inherited) : inherited
  const run = of?.values[OUTFLOW_COLUMN]
  const merged: CriterionNode = {
    ...row,
    children: row.children?.map((child) => withOutflow(child, state)),
  }
  if (run) {
    merged.values = {
      ...row.values,
      [OUTFLOW_COLUMN]: run,
      [OUTFLOW_BASELINE]: of.values[OUTFLOW_BASELINE],
    }
    if (of.ranks?.[OUTFLOW_COLUMN])
      merged.ranks = { ...row.ranks, [OUTFLOW_COLUMN]: of.ranks[OUTFLOW_COLUMN] }
  } else if (state === 'notApplicable') {
    merged.notApplicable = [...(row.notApplicable ?? []), OUTFLOW_COLUMN]
  } else {
    merged.forthcomingFor = [...(row.forthcomingFor ?? []), OUTFLOW_COLUMN]
  }
  return merged
}

/** The adaptation tree with the +30% outflow run beside the five adaptations. */
export const ADAPTATION_TREE: CriterionNode[] = BREAKOUT_TREE.map((root) => withOutflow(root))

// The merged rows replace the plain ones in the shared lookup, so the cells, the
// cell detail and the maps all read the sixth column.
const register = (n: CriterionNode) => {
  NODE_INDEX.set(n.id, n)
  n.children?.forEach(register)
}
ADAPTATION_TREE.forEach(register)
