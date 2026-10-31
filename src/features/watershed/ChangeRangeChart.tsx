// One outcome's low-to-high range for the nine scenarios, drawn like the land cover
// chart: a group per prioritized landscape, a range per restoration level, values at
// both ends of each range.
import * as d3 from 'd3'
import { Box, Stack, Typography, useTheme } from '@mui/material'
import { LOSS_COLOR, MIN_CHART_WIDTH, compactNumber, useElementWidth } from './chartUtils'
import {
  HABITAT_META,
  LEVEL_LABELS,
  PRIORITIES,
  RESTORATION_LEVELS,
  landscapeOf,
  levelShade,
} from './habitats'
import type { WatershedOutcome } from './types'

/** A chart title and its fully written unit. */
export function ChartTitle({ title, unit }: { title: string; unit: string }) {
  return (
    <Typography variant="chartTitle" component="p" sx={{ color: 'common.white' }}>
      {title.toUpperCase()}{' '}
      <Box component="span" sx={{ color: 'base.200', textTransform: 'none' }}>
        ({unit})
      </Box>
    </Typography>
  )
}

/** Each restoration level with its shade in all three landscapes. */
export function RestorationLevelLegend() {
  return (
    <Stack
      direction="row"
      useFlexGap
      sx={{ flexWrap: 'wrap', alignItems: 'center', columnGap: 4, rowGap: 1 }}
    >
      <Typography variant="eyebrow" component="span" sx={{ color: 'base.200' }}>
        Restoration level
      </Typography>
      {RESTORATION_LEVELS.map((level) => (
        <Box key={level} sx={{ display: 'inline-flex', alignItems: 'center', gap: 1.25 }}>
          <Stack direction="row" spacing={0.5} aria-hidden>
            {PRIORITIES.map((priority) => (
              <Box
                key={priority}
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  bgcolor: levelShade(priority, level),
                }}
              />
            ))}
          </Stack>
          <Typography variant="body1" component="span" sx={{ color: 'base.100' }}>
            {LEVEL_LABELS[level]}
          </Typography>
        </Box>
      ))}
    </Stack>
  )
}

export default function ChangeRangeChart({
  title,
  unit,
  records,
}: {
  title: string
  unit: string
  records: WatershedOutcome[]
}) {
  const theme = useTheme()
  const [containerRef, containerWidth] = useElementWidth(840)

  const axisType = theme.typography.chartAxis
  const labelType = theme.typography.chartLabel
  const valueType = theme.typography.chartValue
  const axisFont = String(axisType.fontFamily ?? theme.typography.fontFamily)
  const labelFont = String(labelType.fontFamily ?? theme.typography.fontFamily)
  const valueFont = String(valueType.fontFamily ?? theme.typography.fontFamily)
  const halo = {
    paintOrder: 'stroke' as const,
    stroke: theme.palette.base[800],
    strokeWidth: 4,
  }

  const width = Math.max(containerWidth, MIN_CHART_WIDTH)
  // Room for the priority labels plus a value label left of the lowest range
  const left = 270
  const right = 70
  const plotTop = 40
  const levelGap = 24
  const groupHeight = 22 + (RESTORATION_LEVELS.length - 1) * levelGap + 22
  const height = plotTop + PRIORITIES.length * groupHeight + 4

  const values = records.flatMap((record) => [record.low, record.high])
  const x = d3
    .scaleLinear()
    .domain([Math.min(0, ...values), Math.max(0, ...values)])
    .nice(5)
    .range([left, width - right])
  const ticks = x.ticks(5).filter((tick) => tick !== 0)

  return (
    <Box component="figure" sx={{ m: 0 }}>
      <Box component="figcaption" sx={{ mb: 2 }}>
        <ChartTitle title={title} unit={unit} />
      </Box>
      <Box ref={containerRef} sx={{ overflowX: 'auto' }}>
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label={`${title} in ${unit}, low to high, for the nine scenarios`}
          style={{ display: 'block' }}
        >
          {ticks.map((tick) => (
            <g key={tick}>
              <line
                x1={x(tick)}
                x2={x(tick)}
                y1={plotTop - 10}
                y2={height}
                stroke={theme.palette.base[300]}
                strokeOpacity={0.35}
              />
              <text
                x={x(tick)}
                y={plotTop - 20}
                textAnchor="middle"
                fill={tick < 0 ? LOSS_COLOR : theme.chart.axis.text}
                fontFamily={axisFont}
                fontSize={String(axisType.fontSize)}
              >
                {compactNumber(tick)}
              </text>
            </g>
          ))}
          {x.domain()[0] < 0 && x.domain()[1] > 0 && (
            <line
              x1={x(0)}
              x2={x(0)}
              y1={plotTop - 10}
              y2={height}
              stroke={theme.palette.base[50]}
              strokeOpacity={0.45}
              strokeDasharray="4 5"
            />
          )}

          {PRIORITIES.map((priority, priorityIndex) => {
            const groupY = plotTop + priorityIndex * groupHeight
            const meta = HABITAT_META[landscapeOf(priority)]
            return (
              <g key={priority}>
                <text
                  x={0}
                  y={groupY + 22 + levelGap}
                  dominantBaseline="middle"
                  fill={meta.baseColor}
                  fontFamily={labelFont}
                  fontSize={String(labelType.fontSize)}
                  fontWeight={labelType.fontWeight}
                  letterSpacing={String(labelType.letterSpacing)}
                >
                  PRIORITIZE {meta.label.toUpperCase()}
                </text>

                {RESTORATION_LEVELS.map((level, levelIndex) => {
                  const record = records.find(
                    (item) => item.priority === priority && item.level === level,
                  )
                  if (!record) return null
                  const low = Math.min(record.low, record.high)
                  const high = Math.max(record.low, record.high)
                  const y = groupY + 22 + levelIndex * levelGap
                  const shade = levelShade(priority, level)
                  const valueLabel = {
                    y,
                    dominantBaseline: 'middle' as const,
                    fill: shade,
                    fontFamily: valueFont,
                    fontSize: String(valueType.fontSize),
                    fontWeight: valueType.fontWeight,
                    ...halo,
                  }
                  return (
                    <g key={level}>
                      <title>
                        {LEVEL_LABELS[level]} restoration, prioritize {meta.label.toLowerCase()}:{' '}
                        {compactNumber(low)} to {compactNumber(high)} {unit}
                      </title>
                      <line
                        x1={x(low)}
                        x2={x(high)}
                        y1={y}
                        y2={y}
                        stroke={shade}
                        strokeWidth={3}
                        strokeLinecap="round"
                      />
                      <circle cx={x(low)} cy={y} r={3.5} fill={shade} />
                      <circle cx={x(high)} cy={y} r={3.5} fill={shade} />
                      <text x={x(low) - 10} textAnchor="end" {...valueLabel}>
                        {compactNumber(low)}
                      </text>
                      <text x={x(high) + 10} {...valueLabel}>
                        {compactNumber(high)}
                      </text>
                    </g>
                  )
                })}

                {priorityIndex < PRIORITIES.length - 1 && (
                  <line
                    x1={0}
                    x2={width - right}
                    y1={groupY + groupHeight}
                    y2={groupY + groupHeight}
                    stroke={theme.chart.axis.line}
                    strokeOpacity={0.6}
                  />
                )}
              </g>
            )
          })}
        </svg>
      </Box>
    </Box>
  )
}
