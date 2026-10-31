// Land cover change for the nine scenarios: forest cover lost to the left of zero, meadow
// wetland, marsh and riparian habitat gained to the right. Drawn at the container's pixel
// width so its labels keep the site's type sizes.
import { Box, Stack, Typography, useTheme } from '@mui/material'
import { palette } from '../../theme'
import { ChartTitle } from './ChangeRangeChart'
import { LOSS_COLOR, MIN_CHART_WIDTH, compactNumber, useElementWidth } from './chartUtils'
import { HABITAT_META, LEVEL_LABELS, PRIORITIES, RESTORATION_LEVELS, landscapeOf } from './habitats'
import type { WatershedOutcome, WatershedOutcomeMetric } from './types'

type Category = 'forest' | 'meadow' | 'marsh' | 'riparian'

const FLOODPLAIN_BLUE = '#51a2bd'

const CATEGORIES: Array<{
  key: Category
  label: string
  metric: WatershedOutcomeMetric
  color: string
  shades: [string, string, string]
}> = [
  {
    key: 'forest',
    label: 'Forests',
    metric: 'forestCover',
    color: HABITAT_META.forests.baseColor,
    shades: ['#b7d6bd', '#7fc694', '#4fb06f'],
  },
  {
    key: 'meadow',
    label: 'Meadows',
    metric: 'meadowWetland',
    color: HABITAT_META.meadows.baseColor,
    shades: ['#eee59a', '#e3cf66', '#d8bf42'],
  },
  {
    key: 'marsh',
    label: 'Floodplain Marsh / Wetland',
    metric: 'marsh',
    color: FLOODPLAIN_BLUE,
    shades: ['#b9ddec', '#86c5df', FLOODPLAIN_BLUE],
  },
  {
    key: 'riparian',
    label: 'Riparian',
    metric: 'riparian',
    color: FLOODPLAIN_BLUE,
    shades: ['#b9ddec', '#86c5df', FLOODPLAIN_BLUE],
  },
]

const FOREST_EXTENT = 2_000_000
const HABITAT_EXTENT = 200_000
const FOREST_TICKS = [-2_000_000, -1_500_000, -1_000_000, -500_000]
const HABITAT_TICKS = [50_000, 100_000, 150_000, 200_000]

function LegendItem({ color, label, range }: { color: string; label: string; range?: boolean }) {
  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
      <Box
        aria-hidden
        sx={{ width: range ? 40 : 12, height: range ? 3 : 12, borderRadius: 999, bgcolor: color }}
      />
      <Typography variant="body1" component="span" sx={{ color: 'base.200' }}>
        {label}
      </Typography>
    </Box>
  )
}

export default function LandCoverChart({ outcomes }: { outcomes: WatershedOutcome[] }) {
  const theme = useTheme()
  const [containerRef, containerWidth] = useElementWidth(960)

  const axisType = theme.typography.chartAxis
  const labelType = theme.typography.chartLabel
  const valueType = theme.typography.chartValue
  const axisFont = String(axisType.fontFamily ?? theme.typography.fontFamily)
  const labelFont = String(labelType.fontFamily ?? theme.typography.fontFamily)
  const valueFont = String(valueType.fontFamily ?? theme.typography.fontFamily)
  const halo = { paintOrder: 'stroke' as const, stroke: palette.base[800], strokeWidth: 5 }

  const width = Math.max(containerWidth, MIN_CHART_WIDTH)
  const labelWidth = width * 0.2
  const scaleWidth = (width - labelWidth - 48) / 2
  const zeroX = labelWidth + scaleWidth
  const chartRight = zeroX + scaleWidth
  const plotTop = 84
  const levelGap = 20
  const categoryGap = 80
  const groupHeight = 18 + CATEGORIES.length * categoryGap
  const height = plotTop + PRIORITIES.length * groupHeight

  const forestX = (value: number) => zeroX - (Math.abs(value) / FOREST_EXTENT) * scaleWidth
  const habitatX = (value: number) => zeroX + (Math.max(value, 0) / HABITAT_EXTENT) * scaleWidth
  const recordFor = (priority: string, level: string, metric: WatershedOutcomeMetric) =>
    outcomes.find(
      (record) =>
        record.level === level && record.priority === priority && record.metric === metric,
    )

  return (
    <Box>
      <ChartTitle title="Land cover change" unit="acres" />
      <Stack
        direction="row"
        useFlexGap
        sx={{ flexWrap: 'wrap', columnGap: 3, rowGap: 1, mt: 1, mb: 2 }}
      >
        {CATEGORIES.map((category) => (
          <LegendItem
            key={category.key}
            color={category.color}
            label={category.label}
            range={category.key === 'forest'}
          />
        ))}
      </Stack>

      <Box ref={containerRef} sx={{ overflowX: 'auto' }}>
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-labelledby="land-cover-title land-cover-description"
          style={{ display: 'block' }}
        >
          <title id="land-cover-title">Land cover change for the nine scenarios</title>
          <desc id="land-cover-description">
            {RESTORATION_LEVELS.map((level) => LEVEL_LABELS[level]).join(', ')} restoration within
            each prioritized landscape. Forest cover change is a low-to-high range to the left of
            zero; meadow, marsh and riparian habitat gains are points to the right.
          </desc>

          <text
            x={zeroX - 14}
            y={18}
            textAnchor="end"
            fill={LOSS_COLOR}
            fontFamily={labelFont}
            fontSize={String(labelType.fontSize)}
            fontWeight={labelType.fontWeight}
            letterSpacing={String(labelType.letterSpacing)}
          >
            ← FOREST COVER CHANGE
          </text>
          <text
            x={zeroX + 14}
            y={18}
            fill={palette.base[200]}
            fontFamily={labelFont}
            fontSize={String(labelType.fontSize)}
            fontWeight={labelType.fontWeight}
            letterSpacing={String(labelType.letterSpacing)}
          >
            HABITAT COVER CHANGE →
          </text>

          {[
            ...FOREST_TICKS.map((tick) => ({ tick, x: forestX(tick), color: LOSS_COLOR })),
            ...HABITAT_TICKS.map((tick) => ({
              tick,
              x: habitatX(tick),
              color: palette.base[200],
            })),
          ].map(({ tick, x, color }) => (
            <g key={tick}>
              <line
                x1={x}
                x2={x}
                y1={plotTop - 12}
                y2={height}
                stroke={theme.palette.base[300]}
                strokeOpacity={0.35}
              />
              <text
                x={x}
                y={plotTop - 22}
                textAnchor="middle"
                fill={color}
                fontFamily={axisFont}
                fontSize={String(axisType.fontSize)}
              >
                {compactNumber(tick)}
              </text>
            </g>
          ))}
          <line
            x1={zeroX}
            x2={zeroX}
            y1={plotTop - 12}
            y2={height}
            stroke={palette.base[50]}
            strokeOpacity={0.45}
            strokeDasharray="4 5"
          />

          {PRIORITIES.map((priority, priorityIndex) => {
            const groupY = plotTop + priorityIndex * groupHeight
            const meta = HABITAT_META[landscapeOf(priority)]
            return (
              <g key={priority}>
                <text
                  x={0}
                  // Between the Meadows and Marsh rows, clear of both labels
                  y={groupY + 18 + 1.5 * categoryGap + levelGap}
                  dominantBaseline="middle"
                  fill={meta.baseColor}
                  fontFamily={labelFont}
                  fontSize={String(labelType.fontSize)}
                  fontWeight={labelType.fontWeight}
                  letterSpacing={String(labelType.letterSpacing)}
                >
                  PRIORITIZE {meta.label.toUpperCase()}
                </text>

                {CATEGORIES.map((category, categoryIndex) => {
                  const categoryY = groupY + 18 + categoryIndex * categoryGap
                  const isForest = category.key === 'forest'
                  return (
                    <g key={category.key}>
                      <text
                        x={isForest ? zeroX + 14 : zeroX - 14}
                        // Forests sits on the maximum row, whose values lie far from zero
                        y={categoryY + (isForest ? 2 : 1) * levelGap}
                        dominantBaseline="middle"
                        textAnchor={isForest ? 'start' : 'end'}
                        fill={palette.base[200]}
                        fontFamily={axisFont}
                        fontSize={String(axisType.fontSize)}
                      >
                        {category.label}
                      </text>

                      {RESTORATION_LEVELS.map((level, levelIndex) => {
                        const y = categoryY + levelIndex * levelGap
                        const shade = category.shades[levelIndex]
                        const record = recordFor(priority, level, category.metric)
                        const valueLabel = {
                          y,
                          dominantBaseline: 'middle' as const,
                          fill: shade,
                          fontFamily: valueFont,
                          fontSize: String(valueType.fontSize),
                          fontWeight: valueType.fontWeight,
                          ...halo,
                        }

                        if (isForest) {
                          const lessLoss = Math.max(record?.low ?? 0, record?.high ?? 0)
                          const moreLoss = Math.min(record?.low ?? 0, record?.high ?? 0)
                          const startX = forestX(moreLoss)
                          const endX = forestX(lessLoss)
                          return (
                            <g key={level}>
                              <title>
                                {LEVEL_LABELS[level]} restoration · forest cover{' '}
                                {compactNumber(moreLoss)} to {compactNumber(lessLoss)} acres
                              </title>
                              <line
                                x1={startX}
                                x2={endX}
                                y1={y}
                                y2={y}
                                stroke={shade}
                                strokeWidth={3}
                                strokeLinecap="round"
                              />
                              <circle cx={startX} cy={y} r={3.5} fill={shade} />
                              <circle cx={endX} cy={y} r={3.5} fill={shade} />
                              <text x={startX - 9} textAnchor="end" {...valueLabel}>
                                {compactNumber(moreLoss)}
                              </text>
                              <text x={endX + 9} {...valueLabel}>
                                {compactNumber(lessLoss)}
                              </text>
                            </g>
                          )
                        }

                        const value = record?.low ?? 0
                        const x = habitatX(value)
                        return (
                          <g key={level}>
                            <title>
                              {LEVEL_LABELS[level]} restoration · {category.label}{' '}
                              {compactNumber(value)} acres
                            </title>
                            <circle cx={x} cy={y} r={6} fill={shade} />
                            <text x={x + 10} {...valueLabel}>
                              {compactNumber(value)}
                            </text>
                          </g>
                        )
                      })}
                    </g>
                  )
                })}

                {priorityIndex < PRIORITIES.length - 1 && (
                  <line
                    x1={0}
                    x2={chartRight}
                    y1={groupY + groupHeight}
                    y2={groupY + groupHeight}
                    stroke={palette.base[300]}
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
