// Charts for the breakout screen: one panel per measure, drawn large.
//
// A measure broken out by period gets a line chart, one line per scenario, so a
// season or a water year reads as a slope rather than a column of numbers. A
// measure with no periods gets bars across the scenarios. Both hide values we
// inferred, as the whole screen does, and name what is missing beneath.
import { Box, Typography, useTheme } from '@mui/material'
import { cellFill } from '../data'
import { ANY, DRILL_SCENARIOS, SCENARIO_NAME, fmtValue } from '../drilldown/model'
import type { CriterionNode, Facet, ScenarioKey } from '../drilldown/model'

export interface Point {
  scenario: ScenarioKey
  period: string
  value: number | null
  why: string
}

const W = 760
const H = 300
const PAD = { top: 28, right: 24, bottom: 56, left: 64 }

const scenarioColor = (key: ScenarioKey) =>
  DRILL_SCENARIOS.find((s) => s.key === key)?.color ?? 'currentColor'

/** A bar's value label: above a positive bar, below a negative one, but never into the axis names. */
function labelY(value: number | null, top: number, h: number): number {
  if (value === null) return top + 26
  if (value >= 0) return top - 8
  const below = top + h + 20
  return below > H - PAD.bottom - 4 ? top + 22 : below
}

/** Room on the left for the widest axis label, so "248,815 ac" is not cut off. */
function leftPad(labels: string[]): number {
  const widest = Math.max(0, ...labels.map((l) => l.length))
  return Math.max(PAD.left, 14 + Math.ceil(widest * 8.6))
}

/** Value labels sharing one x column: one label per distinct text, pushed apart so none overlap. */
function spreadLabels(
  items: { text: string; y: number; color: string }[],
): { text: string; y: number; at: number; color: string }[] {
  const byText = new Map<string, { y: number; color: string; n: number }>()
  for (const it of items) {
    const prev = byText.get(it.text)
    if (prev)
      byText.set(it.text, {
        y: (prev.y * prev.n + it.y) / (prev.n + 1),
        color: prev.color,
        n: prev.n + 1,
      })
    else byText.set(it.text, { y: it.y, color: it.color, n: 1 })
  }
  const out = [...byText.entries()]
    .map(([text, v]) => ({ text, y: v.y, at: v.y, color: v.color }))
    .sort((a, b) => a.y - b.y)
  const GAP = 16
  for (let i = 1; i < out.length; i++) out[i].at = Math.max(out[i].at, out[i - 1].at + GAP)
  const floor = H - PAD.bottom - 6
  for (let i = out.length - 1; i >= 0; i--) {
    const cap = i === out.length - 1 ? floor : out[i + 1].at - GAP
    out[i].at = Math.min(out[i].at, cap)
  }
  return out
}

function scale(values: number[]) {
  const lo = Math.min(0, ...values)
  const hi = Math.max(0, ...values)
  const span = hi - lo || 1
  const y = (v: number) => PAD.top + ((hi - v) / span) * (H - PAD.top - PAD.bottom)
  return { lo, hi, y }
}

/** The whole panel when no point is published: one placeholder, not empty axes. */
function Nothing({ points }: { points: Point[] }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gap: 0.5,
        px: 2,
        py: 2.5,
        borderRadius: 1,
        border: 1,
        borderStyle: 'dashed',
        borderColor: 'border.default',
      }}
    >
      <Typography variant="body1" sx={{ color: 'base.100' }}>
        Nothing published for this measure yet.
      </Typography>
      <Missing points={points} />
    </Box>
  )
}

function Missing({ points }: { points: Point[] }) {
  const gone = points.filter((p) => p.value === null)
  if (gone.length === 0) return null
  const byWhy = new Map<string, string[]>()
  for (const p of gone) byWhy.set(p.why, [...(byWhy.get(p.why) ?? []), SCENARIO_NAME[p.scenario]])
  return (
    <Typography variant="body2" sx={{ color: 'base.100' }}>
      {[...byWhy.entries()]
        .map(([why, names]) => `${why}: ${[...new Set(names)].join(', ')}`)
        .join('. ')}
    </Typography>
  )
}

/** Bars across the scenarios, for a measure with one value per scenario. */
export function Bars({
  node,
  points,
  diff,
}: {
  node: CriterionNode
  points: Point[]
  diff: boolean
}) {
  const theme = useTheme()
  const present = points.filter((p) => p.value !== null)
  if (present.length === 0) return <Nothing points={points} />
  const { lo, hi, y } = scale(present.map((p) => p.value as number))
  const axis = [lo, hi].filter((v, i, a) => a.indexOf(v) === i && v !== 0)
  const left = leftPad(axis.map((v) => fmtValue(v, node.unit)))
  const n = points.length
  const slot = (W - left - PAD.right) / n
  const bar = Math.min(96, slot * 0.6)
  const score = node.unit === 'score' && !diff
  return (
    <Box sx={{ display: 'grid', gap: 1 }}>
      <Box
        component="svg"
        viewBox={`0 0 ${W} ${H}`}
        sx={{ width: '100%', height: 'auto', display: 'block' }}
        role="img"
        aria-label={`${node.label} by scenario`}
      >
        <line
          x1={left}
          x2={W - PAD.right}
          y1={y(0)}
          y2={y(0)}
          stroke={theme.palette.base[300]}
          strokeWidth={1}
        />
        {axis.map((v) => (
          <text
            key={v}
            x={left - 10}
            y={y(v) + 5}
            textAnchor="end"
            fontFamily={theme.typography.fontFamily}
            fontSize={15}
            fill={theme.palette.base[100]}
          >
            {fmtValue(v, node.unit)}
          </text>
        ))}
        {points.map((p, i) => {
          const cx = left + slot * i + slot / 2
          const fill =
            p.value === null ? 'none' : score ? cellFill(p.value) : scenarioColor(p.scenario)
          // A missing bar is a dashed ghost: above the zero line when there is room, else below it.
          const ghostTop = y(0) - 40 >= 8 ? y(0) - 40 : y(0)
          const top = p.value === null ? ghostTop : Math.min(y(0), y(p.value))
          const h = p.value === null ? 0 : Math.abs(y(p.value) - y(0))
          return (
            <g key={p.scenario}>
              {p.value === null ? (
                <rect
                  x={cx - bar / 2}
                  y={ghostTop}
                  width={bar}
                  height={40}
                  fill="none"
                  stroke={theme.palette.base[400]}
                  strokeDasharray="6 4"
                  rx={4}
                />
              ) : (
                <rect
                  x={cx - bar / 2}
                  y={top}
                  width={bar}
                  height={Math.max(2, h)}
                  fill={fill}
                  rx={4}
                />
              )}
              <text
                x={cx}
                y={labelY(p.value, top, h)}
                textAnchor="middle"
                fontFamily={theme.typography.fontFamily}
                fontSize={17}
                fontWeight={700}
                fill={theme.palette.base[50]}
              >
                {p.value === null ? '—' : fmtValue(p.value, node.unit)}
              </text>
              {SCENARIO_NAME[p.scenario]
                .split(' ')
                .reduce<string[][]>((lines, word) => {
                  const last = lines[lines.length - 1]
                  if (last && (last.join(' ') + ' ' + word).length <= 12) last.push(word)
                  else lines.push([word])
                  return lines
                }, [])
                .map((line, li) => (
                  <text
                    key={li}
                    x={cx}
                    y={H - PAD.bottom + 22 + li * 17}
                    textAnchor="middle"
                    fontFamily={theme.typography.fontFamily}
                    fontSize={15}
                    fill={theme.palette.base[100]}
                  >
                    {line.join(' ')}
                  </text>
                ))}
            </g>
          )
        })}
      </Box>
      <Missing points={points} />
    </Box>
  )
}

/** One line per scenario across the measure's periods. */
export function Lines({
  node,
  periods,
  points,
}: {
  node: CriterionNode
  periods: Facet[]
  points: Point[]
}) {
  const theme = useTheme()
  const present = points.filter((p) => p.value !== null)
  if (present.length === 0) return <Nothing points={points} />
  const { lo, hi, y } = scale(present.map((p) => p.value as number))
  const axis = [lo, hi].filter((v, i, a) => a.indexOf(v) === i)
  const left = leftPad(axis.map((v) => fmtValue(v, node.unit)))
  const x = (i: number) =>
    left + 48 + (i * (W - left - PAD.right - 96)) / Math.max(1, periods.length - 1)
  const scenarios = [...new Set(points.map((p) => p.scenario))]
  const labels = periods.map((f, i) =>
    spreadLabels(
      present
        .filter((p) => p.period === f.key)
        .map((p) => ({
          text: fmtValue(p.value as number, node.unit),
          y: y(p.value as number),
          color: scenarioColor(p.scenario),
        })),
    ).map((l) => ({ ...l, i })),
  )
  return (
    <Box sx={{ display: 'grid', gap: 1 }}>
      <Box
        component="svg"
        viewBox={`0 0 ${W} ${H}`}
        sx={{ width: '100%', height: 'auto', display: 'block' }}
        role="img"
        aria-label={`${node.label} by period and scenario`}
      >
        {periods.map((f, i) => (
          <g key={f.key}>
            <line
              x1={x(i)}
              x2={x(i)}
              y1={PAD.top}
              y2={H - PAD.bottom}
              stroke={theme.palette.base[400]}
              strokeWidth={1}
            />
            <text
              x={x(i)}
              y={H - PAD.bottom + 24}
              textAnchor="middle"
              fontFamily={theme.typography.fontFamily}
              fontSize={16}
              fill={theme.palette.base[50]}
            >
              {f.label}
            </text>
          </g>
        ))}
        {axis.map((v) => (
          <text
            key={v}
            x={left - 10}
            y={y(v) + 5}
            textAnchor="end"
            fontFamily={theme.typography.fontFamily}
            fontSize={15}
            fill={theme.palette.base[100]}
          >
            {fmtValue(v, node.unit)}
          </text>
        ))}
        {scenarios.map((s) => {
          const series = periods.map((f, i) => ({
            i,
            p: points.find((p) => p.scenario === s && p.period === f.key),
          }))
          const d = series
            .filter((e) => e.p && e.p.value !== null)
            .map((e, k) => `${k === 0 ? 'M' : 'L'}${x(e.i)},${y(e.p!.value as number)}`)
            .join(' ')
          return (
            <g key={s}>
              <path
                d={d}
                fill="none"
                stroke={scenarioColor(s)}
                strokeWidth={3}
                strokeLinejoin="round"
              />
              {series.map(({ i, p }) =>
                p && p.value !== null ? (
                  <circle
                    key={i}
                    cx={x(i)}
                    cy={y(p.value)}
                    r={6}
                    fill={scenarioColor(s)}
                    stroke={theme.palette.base[900]}
                    strokeWidth={2}
                  />
                ) : null,
              )}
            </g>
          )
        })}
        {labels.flat().map((l) => {
          const last = l.i === periods.length - 1
          const lx = x(l.i) + (last ? 14 : -14)
          return (
            <g key={`${l.i}-${l.text}`}>
              {Math.abs(l.at - l.y) > 4 ? (
                <line
                  x1={x(l.i) + (last ? 7 : -7)}
                  x2={lx - (last ? 3 : -3)}
                  y1={l.y}
                  y2={l.at}
                  stroke={theme.palette.base[300]}
                  strokeWidth={1}
                />
              ) : null}
              <text
                x={lx}
                y={l.at + 5}
                textAnchor={last ? 'start' : 'end'}
                fontFamily={theme.typography.fontFamily}
                fontSize={14}
                fill={theme.palette.base[50]}
                stroke={theme.palette.base[900]}
                strokeWidth={4}
                paintOrder="stroke"
              >
                {l.text}
              </text>
            </g>
          )
        })}
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
        {scenarios.map((s) => (
          <Typography key={s} variant="body2" sx={{ color: 'base.50' }}>
            <Box
              component="span"
              sx={{
                display: 'inline-block',
                width: 14,
                height: 4,
                borderRadius: 2,
                verticalAlign: '3px',
                mr: 0.6,
                bgcolor: scenarioColor(s),
              }}
            />
            {SCENARIO_NAME[s]}
          </Typography>
        ))}
      </Box>
      <Missing points={points.filter((p) => p.period !== ANY)} />
    </Box>
  )
}
