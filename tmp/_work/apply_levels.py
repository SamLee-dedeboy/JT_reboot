import sys

S = sys.argv[1]


def ed(p, pairs):
    path = f'{S}/{p}'
    s = open(path, encoding='utf-8').read()
    for o, n in pairs:
        assert s.count(o) == 1, (p, o[:80], s.count(o))
        s = s.replace(o, n)
    open(path, 'w', encoding='utf-8', newline='').write(s)


T = 'internal/rank-visualization/drilldown/tree.ts'
ed(T, [
    (""" * ("Recreation The Score.xlsx", table 2), where every service scores +5.
 */
const REC_ECONOMY_SERVICES: {
  key: string
  label: string
  ngw: number[]
  bau: number[]""", """ * ("Recreation The Score.xlsx", table 2), where every service scores +5.
 * `quarter` and `full` are New Green Watershed at 25% and 100% restoration, by
 * region, from the same sheet's "Ecosystem service value by scenario" table.
 */
const REC_ECONOMY_SERVICES: {
  key: string
  label: string
  ngw: number[]
  quarter: number[]
  full: number[]
  bau: number[]"""),
    ("""    ngw: [15.613, 15.747, 20.865, 23.127],
""", """    ngw: [15.613, 15.747, 20.865, 23.127],
    quarter: [15.613, 10.939, 20.865, 10.541],
    full: [15.613, 15.747, 22.767, 54.682],
"""),
    ("""    ngw: [6.791, 6.849, 9.075, 10.059],
""", """    ngw: [6.791, 6.849, 9.075, 10.059],
    quarter: [6.791, 4.758, 9.075, 4.585],
    full: [6.791, 6.849, 9.903, 23.785],
"""),
    ("""    ngw: [3.903, 3.937, 5.216, 5.782],
""", """    ngw: [3.903, 3.937, 5.216, 5.782],
    quarter: [3.903, 2.735, 5.216, 2.635],
    full: [3.903, 3.937, 5.691, 13.67],
"""),
    ("""    ngw: [11.868, 11.97, 15.86, 17.58],
""", """    ngw: [11.868, 11.97, 15.86, 17.58],
    quarter: [11.868, 8.315, 15.86, 8.013],
    full: [11.868, 11.97, 17.306, 41.567],
"""),
    ("""    ranks: byRecPlace({ ngw: spec.score, bau: spec.score.map(() => 0), em: [5] }),
  }
}""", """    ranks: byRecPlace({ ngw: spec.score, bau: spec.score.map(() => 0), em: [5] }),
    // Delta-wide (the four regions' sum) at 25%, 50% and 100% restoration.
    ngwLevels: [spec.quarter, spec.ngw, spec.full].map(
      (regions) => Math.round(regions.reduce((sum, v) => sum + v, 0) * 1000) / 1000,
    ) as [number, number, number],
  }
}"""),
])

ed('internal/rank-visualization/drilldown/model.ts', [
    ("""  ngwLevels?: [number | null, number | null, number | null]
""", """  ngwLevels?: [number | null, number | null, number | null]
  /**
   * The row has one New Green Watershed value that holds at every restoration level
   * (its model run has a single New Green Watershed), so opening the levels shows
   * that value once across all three.
   */
  levelsSame?: boolean
"""),
])

R = 'features/scenarios/ranking/breakout/model/rankingModel.ts'
ed(R, [
    ("""function recreationTree(): CriterionNode {
  return adapt(node('recreation'), {""", """/**
 * Recreation reports restoration levels only for restoration and its recreation
 * economy; every other row comes from the one New Green Watershed water run, so its
 * value is the same at 25%, 50% and 100% wetland.
 */
function sameAtAllLevels(row: CriterionNode): CriterionNode {
  return {
    ...row,
    levelsSame: row.ngwLevels ? undefined : true,
    children: row.children?.map(sameAtAllLevels),
  }
}

function recreationTree(): CriterionNode {
  return sameAtAllLevels(recreationRoot())
}

function recreationRoot(): CriterionNode {
  return adapt(node('recreation'), {"""),
])

M = 'features/scenarios/ranking/breakout/components/Matrix.tsx'
ed(M, [
    ("""  const levels = node.ngwLevels
  // No value at 25% or 100%: the cell stays empty, but a measure keeps its hairline.""",
     """  // Levels are reported Delta-wide only; at one place, the row shows its own value.
  const levels = whole ? node.ngwLevels : undefined
  if (node.levelsSame || (node.ngwLevels && !levels))
    return box(
      'levels',
      3,
      cell(fallback.value ?? null, fallback.value === null ? undefined : UI.sameAtAllLevels),
    )
  // Levels hold the runs' own values; as differences they move by what the 50% cell
  // does (its baseline), so a level beside Business as Usual reads as its change too.
  const shift =
    levels?.[1] != null && fallback.value !== null ? fallback.value - levels[1] : 0
  // No value at 25% or 100%: the cell stays empty, but a measure keeps its hairline."""),
    ("""  if (levels.every((value) => value === levels[0]))
    return box('levels', 3, cell(levels[0], UI.sameAtAllLevels))
  return <>{levels.map((value, index) => box(`level-${index}`, 1, cell(value)))}</>""",
     """  const shown = levels.map((value) => (value === null ? null : value + shift))
  if (shown.every((value) => value === shown[0]))
    return box('levels', 3, cell(shown[0], UI.sameAtAllLevels))
  return <>{shown.map((value, index) => box(`level-${index}`, 1, cell(value)))}</>"""),
])
print('ok')
