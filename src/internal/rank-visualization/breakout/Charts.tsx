// Charts for the breakout screen. Metrics stay on rows and scenarios on columns, in
// the breakout's fixed order, exactly as in the table, so switching view never
// moves anything the audience has found. Everything is sized to the room it is
// given: the result card never scrolls.
//
// Ranking scores (−5…+5) each get one bar chart, packed side by side for an
// overview: scenarios along x, bars in neutral ink, grouped where the score has
// periods. Details are a matrix: one row per measure, one cell per scenario, a
// small bar per period on the row's own scale. A difference from Business as
// Usual is drawn the same way, growing up or down from a middle line. A scenario
// switched off stays in its column, faded.
import { Box, Stack, Typography, useTheme } from '@mui/material'
import { SCENARIO_NAME, fmtValue } from '../drilldown/model'
import type { CriterionNode, Facet, ScenarioKey } from '../drilldown/model'
import { FADED, SCENARIO_SHORT, periodShade, svgType } from './chartKit'
import type { Point } from './chartKit'
import { BREAKOUT_SCENARIOS } from './useBreakout'
import { useElementSize } from './useElementSize'

/** The periods' shades, for a chart whose periods differ from the panel legend's. */
export function PeriodKey({ groups }: { groups: Facet[] }) {
  const theme = useTheme()
  if (groups.length < 2) return null
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
      {groups.map((group, i) => (
        <Box key={group.key} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Box sx={{ width: 10, height: 10, borderRadius: 0.3, bgcolor: periodShade(theme, i) }} />
          <Typography variant="captionSmall">{group.label}</Typography>
        </Box>
      ))}
    </Box>
  )
}

export interface ScoreChartData {
  node: CriterionNode
  groups: Facet[]
  points: Point[]
}

/**
 * Every ranking score's chart, packed into the space given: as many columns as fit
 * a readable chart, as many rows as that needs, each chart drawn at its cell's size.
 */
export function ScoreGrid({
  charts,
  active,
  showKeys,
}: {
  charts: ScoreChartData[]
  active: ScenarioKey[]
  showKeys: boolean
}) {
  const { ref, width, height } = useElementSize<HTMLDivElement>()
  const gap = 16
  const n = charts.length
  // The column count that makes the charts closest to a 1.6:1 landscape shape.
  let cols = 1
  let best = Infinity
  for (let c = 1; c <= n; c++) {
    const rows = Math.ceil(n / c)
    const w = (width - gap * (c - 1)) / c
    const h = (height - gap * (rows - 1)) / rows
    if (w < 180) break
    const score = Math.abs(Math.log(w / Math.max(1, h) / 1.6))
    if (score < best) {
      best = score
      cols = c
    }
  }
  const rows = Math.ceil(n / cols)
  const cellW = (width - gap * (cols - 1)) / cols
  const cellH = (height - gap * (rows - 1)) / rows
  return (
    <Box
      ref={ref}
      sx={{
        height: 1,
        minHeight: 0,
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
        gap: `${gap}px`,
      }}
    >
      {width > 0 &&
        charts.map((chart) => (
          <ScoreChart
            key={chart.node.id}
            {...chart}
            active={active}
            showKey={showKeys}
            width={cellW}
            height={cellH}
          />
        ))}
    </Box>
  )
}

/**
 * One ranking score across the six scenarios. The scale is fixed at −5…+5 (wider
 * only if a difference runs past it) so charts side by side compare at a glance.
 */
function ScoreChart({
  node,
  groups,
  points,
  active,
  showKey,
  width,
  height,
}: ScoreChartData & {
  active: ScenarioKey[]
  showKey: boolean
  width: number
  height: number
}) {
  const theme = useTheme()
  const titleH = 26 + (showKey && groups.length > 1 ? 22 : 0)
  const W = Math.max(120, width)
  const H = Math.max(60, height - titleH)
  const band = (W - 28 - 4) / BREAKOUT_SCENARIOS.length
  const PAD = { top: groups.length === 1 ? 20 : 8, right: 4, bottom: 20, left: 28 }
  const span = Math.max(5, ...points.map((p) => Math.ceil(Math.abs(p.value ?? 0))))
  const y = (v: number) => PAD.top + ((span - v) / (2 * span)) * (H - PAD.top - PAD.bottom)
  const gap = 2
  const barW = Math.max(3, Math.min(22, (band * 0.72 - gap * (groups.length - 1)) / groups.length))
  const single = groups.length === 1
  const axisType = svgType(theme, 'chartLabel')
  const valueType = svgType(theme, 'chartValueLarge')

  return (
    <Stack spacing={0.5} sx={{ minHeight: 0, overflow: 'hidden' }}>
      <Typography variant="chartTitle" component="h3" noWrap>
        {node.level === 'team' ? `${node.label}: the score` : node.label}
      </Typography>
      {showKey && <PeriodKey groups={groups} />}
      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`${node.label}, score by scenario`}
        style={{ display: 'block' }}
      >
        {[-span, 0, span].map((tick) => (
          <g key={tick}>
            <line
              x1={PAD.left}
              x2={W - PAD.right}
              y1={y(tick)}
              y2={y(tick)}
              stroke={tick === 0 ? theme.chart.voting.zeroLine : theme.chart.axis.grid}
              strokeWidth={1}
            />
            <text
              x={PAD.left - 5}
              y={y(tick) + 4}
              textAnchor="end"
              style={axisType}
              fill={theme.chart.axis.text}
            >
              {tick > 0 ? `+${tick}` : tick < 0 ? `−${-tick}` : '0'}
            </text>
          </g>
        ))}
        {BREAKOUT_SCENARIOS.map((scenario, s) => {
          const groupW = barW * groups.length + gap * (groups.length - 1)
          const x0 = PAD.left + band * s + (band - groupW) / 2
          return (
            <g key={scenario} opacity={active.includes(scenario) ? 1 : FADED}>
              {groups.map((group, g) => {
                const p = points.find((q) => q.scenario === scenario && q.period === group.key)
                const x = x0 + g * (barW + gap)
                const where = `${SCENARIO_NAME[scenario]}${group.label ? `, ${group.label}` : ''}`
                if (!p || p.value === null)
                  return (
                    <rect
                      key={group.key}
                      x={x}
                      y={y(0) - 6}
                      width={barW}
                      height={12}
                      fill="none"
                      stroke={theme.chart.voting.drill.gap}
                      strokeDasharray="3 2"
                      rx={2}
                    >
                      <title>{`${where}: ${p?.why ?? 'no value'}`}</title>
                    </rect>
                  )
                const top = Math.min(y(0), y(p.value))
                const h = Math.max(2, Math.abs(y(p.value) - y(0)))
                return (
                  <g key={group.key}>
                    <rect x={x} y={top} width={barW} height={h} rx={2} fill={periodShade(theme, g)}>
                      <title>{`${where}: ${fmtValue(p.value, 'score')}`}</title>
                    </rect>
                    {single && (
                      <text
                        x={x + barW / 2}
                        y={p.value >= 0 ? top - 5 : top + h + 18}
                        textAnchor="middle"
                        style={valueType}
                        fill={theme.palette.common.white}
                      >
                        {fmtValue(p.value, 'score')}
                      </text>
                    )}
                  </g>
                )
              })}
              <text
                x={PAD.left + band * s + band / 2}
                y={H - 6}
                textAnchor="middle"
                style={axisType}
                fill={theme.chart.axis.text}
              >
                <title>{SCENARIO_NAME[scenario]}</title>
                {SCENARIO_SHORT[scenario]}
              </text>
            </g>
          )
        })}
      </svg>
    </Stack>
  )
}

export interface DetailRow {
  node: CriterionNode
  unitLabel: string
  groups: Facet[]
  points: Point[]
}

/**
 * The details as a matrix of small bars: rows are measures, columns the scenarios,
 * every row sharing the height there is. Each row has its own scale, since a
 * proportion and an acreage share nothing.
 */
export function DetailMatrix({
  rows,
  active,
  diff,
  showKeys,
}: {
  rows: DetailRow[]
  active: ScenarioKey[]
  diff: boolean
  showKeys: boolean
}) {
  const theme = useTheme()
  return (
    <Box
      sx={{
        height: 1,
        minHeight: 0,
        display: 'grid',
        gridTemplateColumns: `minmax(0, 1.6fr) repeat(${BREAKOUT_SCENARIOS.length}, minmax(0, 1fr))`,
        gridTemplateRows: `auto repeat(${rows.length}, minmax(0, 1fr))`,
        columnGap: 1,
        rowGap: 0.75,
      }}
    >
      <Box />
      {BREAKOUT_SCENARIOS.map((scenario) => (
        <Typography
          key={scenario}
          variant="chartTitle"
          sx={{
            alignSelf: 'end',
            opacity: active.includes(scenario) ? 1 : FADED,
            transition: 'opacity 200ms ease',
          }}
        >
          {SCENARIO_NAME[scenario]}
        </Typography>
      ))}
      {rows.map(({ node, unitLabel, groups, points }) => {
        const max = Math.max(0.000001, ...points.map((p) => Math.abs(p.value ?? 0)))
        return (
          <Box key={node.id} sx={{ display: 'contents' }}>
            <Box
              sx={{
                minHeight: 0,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                pl: node.level === 'entity' ? 1.5 : 0,
              }}
            >
              <Typography variant="body1" sx={{ color: 'base.50' }} noWrap>
                {node.label}
              </Typography>
              <Typography variant="body2" component="p" sx={{ color: 'base.300' }} noWrap>
                {unitLabel}
              </Typography>
              {showKeys && <PeriodKey groups={groups} />}
            </Box>
            {BREAKOUT_SCENARIOS.map((scenario) => (
              <Box
                key={scenario}
                sx={{
                  minHeight: 0,
                  display: 'flex',
                  gap: 0.5,
                  px: 0.5,
                  pt: 0.5,
                  borderRadius: 0.6,
                  bgcolor: 'translucent.100',
                  opacity: active.includes(scenario) ? 1 : FADED,
                  transition: 'opacity 200ms ease',
                }}
              >
                {groups.map((group, g) => {
                  const p = points.find((q) => q.scenario === scenario && q.period === group.key)
                  return (
                    <MiniBar
                      key={group.key}
                      point={p}
                      unit={node.unit}
                      strength={p?.value == null ? 0 : Math.abs(p.value) / max}
                      diff={diff}
                      shade={periodShade(theme, g)}
                      label={group.label}
                    />
                  )
                })}
              </Box>
            ))}
          </Box>
        )
      })}
    </Box>
  )
}

/** One bar in a detail cell, sized to the cell, with its value beneath. */
function MiniBar({
  point,
  unit,
  strength,
  diff,
  shade,
  label,
}: {
  point?: Point
  unit: CriterionNode['unit']
  strength: number
  diff: boolean
  shade: string
  label: string
}) {
  const value = point?.value ?? null
  const shown = value === null ? (point?.why ?? 'no value') : fmtValue(value, unit)
  const pct = `${Math.max(3, strength * (diff ? 50 : 100))}%`
  const text =
    value === null
      ? '—'
      : diff && value !== 0
        ? `${value > 0 ? '+' : '−'}${fmtValue(Math.abs(value), unit).replace(/^[+\-−]\s*/, '')}`
        : fmtValue(value, unit)
  return (
    <Box
      title={`${label ? `${label}: ` : ''}${shown}`}
      sx={{
        flex: '1 1 0',
        minWidth: 0,
        maxWidth: 44,
        mx: 'auto',
        display: 'grid',
        gridTemplateRows: 'minmax(0, 1fr) auto',
        justifyItems: 'center',
      }}
    >
      <Box sx={{ position: 'relative', width: 1, minHeight: 0 }}>
        {value === null ? (
          <Box
            sx={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: diff ? 'calc(50% - 6px)' : 0,
              height: 12,
              borderRadius: 0.4,
              border: 1,
              borderStyle: 'dashed',
              borderColor: 'border.default',
            }}
          />
        ) : (
          <Box
            sx={{
              position: 'absolute',
              left: 0,
              right: 0,
              borderRadius: 0.4,
              bgcolor: shade,
              height: pct,
              ...(diff ? (value >= 0 ? { bottom: '50%' } : { top: '50%' }) : { bottom: 0 }),
            }}
          />
        )}
        {diff && (
          <Box
            sx={{
              position: 'absolute',
              left: -2,
              right: -2,
              top: '50%',
              height: '1px',
              bgcolor: 'base.300',
            }}
          />
        )}
      </Box>
      <Typography
        variant="captionSmall"
        sx={{ color: value === null ? 'base.300' : 'base.50', whiteSpace: 'nowrap' }}
      >
        {text}
      </Typography>
    </Box>
  )
}
