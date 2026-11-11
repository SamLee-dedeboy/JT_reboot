// Builds the two ranking tables from the team files in ../data/: the adaptation table
// (By criterion, with the +30% outflow run as its sixth column) and the tiered outflow
// table. Nothing here holds a number; change the data files instead.
import { TEAM_DATA } from '../data'
import type { Row, ScenarioEntries, Value } from '../data/types'
import { ANY, OUTFLOW_KEYS, sliceKey } from './criteria'
import type { CriterionNode, ScenarioKey, SliceValues } from './criteria'
import { registerNodes } from './nodeIndex'
import { TEAMS } from './teams'

/** Every scenario in the order the data files list them. */
const SCENARIO_ORDER: ScenarioKey[] = [
  'bau',
  'csbau',
  'em',
  'ngw',
  'bf',
  'cor',
  'tunnel',
  'hist',
  'more',
  'less',
]
const OUTFLOW_RUNS = new Set<ScenarioKey>(OUTFLOW_KEYS)

/** The run shown as the adaptation table's sixth column, and the run it is read against. */
export const OUTFLOW_COLUMN: ScenarioKey = 'more'
export const OUTFLOW_BASELINE: ScenarioKey = 'hist'

interface Table {
  prefix: 'bk-' | 'of-'
  /** The scenarios whose values belong to this table. */
  holds: (scenario: ScenarioKey) => boolean
  /** Baselines: their scores are 0 wherever the row has a score for another scenario. */
  baselines: ScenarioKey[]
}

const ADAPTATION: Table = {
  prefix: 'bk-',
  holds: (scenario) => !OUTFLOW_RUNS.has(scenario),
  baselines: ['bau', 'csbau'],
}
const OUTFLOW: Table = {
  prefix: 'of-',
  holds: (scenario) => OUTFLOW_RUNS.has(scenario),
  baselines: ['hist'],
}

/** A data-file value as the table's slices: `place|period` → number. */
export function expandValue(value: Value): SliceValues {
  if (value === null || typeof value === 'number') return { [sliceKey(ANY, ANY)]: value }
  const out: SliceValues = {}
  for (const [place, periods] of Object.entries(value))
    for (const [period, cell] of Object.entries(periods)) out[sliceKey(place, period)] = cell
  return out
}

const inOrder = (entries: ScenarioEntries) =>
  SCENARIO_ORDER.filter((key) => entries[key]).map((key) => [key, entries[key]!] as const)

type BySlice = Partial<Record<ScenarioKey, SliceValues>>

/** One row's values and ranks in one climate, baselines filled in. */
function numbersFor(row: Row, table: Table, entries: ScenarioEntries) {
  const values: BySlice = {}
  const ranks: BySlice = {}
  for (const [key, entry] of inOrder(entries)) {
    if (!table.holds(key)) continue
    const value = entry.scores?.[row.id] ?? entry.measures?.[row.id]
    if (value !== undefined) values[key] = expandValue(value)
    const rank = entry.ranks?.[row.id]
    if (rank !== undefined) ranks[key] = expandValue(rank)
  }
  const scored = Object.keys(values).some((key) => !table.baselines.includes(key as ScenarioKey))
  if (row.unit === 'score' && scored)
    for (const baseline of table.baselines) values[baseline] ??= { [sliceKey(ANY, ANY)]: 0 }
  return { values, ranks: Object.keys(ranks).length > 0 ? ranks : undefined }
}

function buildRow(row: Row, team: CriterionNode['team'], table: Table): CriterionNode {
  const data = TEAM_DATA[team]
  const { seaLevelRise: slrRow, children, condition, info, ...rest } = row
  const { values, ranks } = numbersFor(row, table, data.current)
  const node: CriterionNode = { ...rest, id: table.prefix + row.id, team, values, info }
  if (ranks) node.ranks = ranks

  // Arrows, conditions and wetland levels come from today's run only.
  const steps: Partial<Record<ScenarioKey, number>> = {}
  const metBy: ScenarioKey[] = []
  for (const [key, entry] of inOrder(data.current)) {
    // The adaptation table also draws the +30% run's arrows in the same row.
    const step =
      table.holds(key) || (table === ADAPTATION && key === OUTFLOW_COLUMN)
        ? entry.steps?.[row.id]
        : undefined
    if (step !== undefined) steps[key] = step
    if (entry.conditionsMet?.includes(row.id)) metBy.push(key)
  }
  if (Object.keys(steps).length > 0) node.steps = steps
  if (condition) node.metBy = metBy
  const levels = data.current.ngw?.wetlandLevels?.[row.id]
  if (levels && table === ADAPTATION)
    node.ngwLevels = [levels.wetland25, values.ngw?.[sliceKey(ANY, ANY)] ?? null, levels.wetland100]

  if (data.seaLevelRise === 'sameAsCurrent') {
    if (table === ADAPTATION) node.slr = { values, note: row.note, sources: row.sources ?? [] }
  } else if (slrRow) {
    const slr = numbersFor(row, table, data.seaLevelRise)
    node.slr = { ...slrRow, values: slr.values, ...(slr.ranks && { ranks: slr.ranks }) }
  }
  if (children) node.children = children.map((child) => buildRow(child, team, table))
  return node
}

// ---------- the +30% run as the adaptation table's sixth column ----------
//
// The outflow table mirrors the adaptation table under `of-` ids, so each adaptation
// row takes its counterpart's +30% values, and the Historical Baseline they are read
// against, as extra scenarios. A row with no counterpart inherits its nearest
// counterpart's state: not applicable where the runs cannot move it (they change no
// landscape), otherwise forthcoming.

/** `bk-eco-niche-longfinJuv` → `of-eco-longfinJuv`; every other row swaps its prefix. */
const counterpartId = (id: string) => id.replace(/^bk-/, 'of-').replace(/^of-eco-niche-/, 'of-eco-')

type Inherited = 'notApplicable' | 'forthcoming'

function withOutflow(
  row: CriterionNode,
  outflowIndex: Map<string, CriterionNode>,
  inherited: Inherited = 'forthcoming',
): CriterionNode {
  const of = outflowIndex.get(counterpartId(row.id))
  const state: Inherited = of
    ? of.notApplicable?.includes(OUTFLOW_COLUMN)
      ? 'notApplicable'
      : of.forthcoming
        ? 'forthcoming'
        : inherited
    : inherited
  const run = of?.values[OUTFLOW_COLUMN]
  const merged: CriterionNode = {
    ...row,
    children: row.children?.map((child) => withOutflow(child, outflowIndex, state)),
  }
  if (!row.children) delete merged.children
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

/** The tiered outflow table: one tree per criterion, read against the Historical Baseline. */
export const OUTFLOW_TREE: CriterionNode[] = TEAMS.map(({ key }) =>
  buildRow(TEAM_DATA[key].outflowRows, key, OUTFLOW),
)

const outflowIndex = new Map<string, CriterionNode>()
const indexOutflow = (node: CriterionNode) => {
  outflowIndex.set(node.id, node)
  node.children?.forEach(indexOutflow)
}
OUTFLOW_TREE.forEach(indexOutflow)

/** The adaptation table: five adaptation scenarios plus the +30% outflow run. */
export const ADAPTATION_TREE: CriterionNode[] = TEAMS.map(({ key }) =>
  withOutflow(buildRow(TEAM_DATA[key].rows, key, ADAPTATION), outflowIndex),
)

OUTFLOW_TREE.forEach(registerNodes)
ADAPTATION_TREE.forEach(registerNodes)

/** A row that counts toward its criterion's score, rather than one shown beside it. */
export const isRanked = (node: CriterionNode) =>
  node.provenance !== 'unscored' && node.edge !== 'unscored'

/** Whether each criterion's sea-level-rise results are in. */
export const SLR_STATUS = Object.fromEntries(
  TEAMS.map(({ key }) => [key, TEAM_DATA[key].seaLevelRiseStatus]),
) as Partial<Record<CriterionNode['team'], 'loaded' | 'pending'>>
