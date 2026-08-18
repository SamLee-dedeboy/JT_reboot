import { Box } from '@mui/material'

interface LandCoverMetricRecord {
  habitat_focus: string
  metric: string
  restoration_level: string
  scenario_habitat: string
  value_low: number | null
  value_high: number | null
}

interface WatershedLandCoverChartProps {
  records: LandCoverMetricRecord[]
}

const priorities = [
  { key: 'forest', label: 'Prioritize Forests', color: '#4fb06f' },
  { key: 'meadow', label: 'Prioritize Meadows', color: '#d8bf42' },
  { key: 'floodplain', label: 'Prioritize Floodplains', color: '#62b6d9' },
]

const levels = [
  { key: 'min', label: 'Minimum' },
  { key: 'med', label: 'Medium' },
  { key: 'max', label: 'Maximum' },
]

const metrics = {
  forest: { label: 'Forests', color: '#4fb06f' },
  meadow: { label: 'Meadows', color: '#d8bf42' },
  marsh: { label: 'Floodplain Marsh / Wetland', color: '#51a2bd' },
  riparian: { label: 'Riparian', color: '#51a2bd' },
}

const metricShades: Record<string, Record<string, string>> = {
  forest: { min: '#b7d6bd', med: '#7fc694', max: '#4fb06f' },
  meadow: { min: '#eee59a', med: '#e3cf66', max: '#d8bf42' },
  marsh: { min: '#b9ddec', med: '#86c5df', max: '#51a2bd' },
  riparian: { min: '#b9ddec', med: '#86c5df', max: '#51a2bd' },
}

const compactNumber = (value: number) => {
  const absolute = Math.abs(value)
  if (absolute >= 1_000_000)
    return `${(value / 1_000_000).toFixed(absolute % 1_000_000 === 0 ? 0 : 1)}M`
  if (absolute >= 1_000) return `${(value / 1_000).toFixed(absolute % 1_000 === 0 ? 0 : 1)}K`
  return Math.round(value).toLocaleString('en-US')
}

export default function WatershedLandCoverChart({ records }: WatershedLandCoverChartProps) {
  const width = 1500
  const height = 1260
  const labelWidth = 330
  const scaleWidth = 540
  const zeroX = labelWidth + scaleWidth
  const chartRight = zeroX + scaleWidth
  const plotTop = 232
  const priorityHeight = 330
  const categoryGap = 72
  const levelGap = 16
  const forestExtent = 2_000_000
  const habitatExtent = 200_000
  const forestTicks = [-2_000_000, -1_500_000, -1_000_000, -500_000, 0]
  const habitatTicks = [50_000, 100_000, 150_000, 200_000]

  const recordFor = (priority: string, level: string, habitatFocus: string, metric: string) =>
    records.find(
      (record) =>
        record.restoration_level === level &&
        record.scenario_habitat === priority &&
        record.habitat_focus === habitatFocus &&
        record.metric === metric,
    )

  const valuesFor = (priority: string, level: string) => {
    const forest = recordFor(priority, level, 'forests', 'Change in forest cover')
    const meadow = recordFor(priority, level, 'meadows', 'Change in wetland cover')
    const marsh = recordFor(priority, level, 'floodplains', 'Increase in marsh habitat')
    const riparian = recordFor(priority, level, 'floodplains', 'Increase in riparian habitat')

    return {
      forestLow: forest?.value_low ?? 0,
      forestHigh: forest?.value_high ?? 0,
      meadow: meadow?.value_low ?? meadow?.value_high ?? 0,
      marsh: marsh?.value_low ?? marsh?.value_high ?? 0,
      riparian: riparian?.value_low ?? riparian?.value_high ?? 0,
    }
  }

  const forestX = (value: number) => zeroX - (Math.abs(value) / forestExtent) * scaleWidth
  const habitatX = (value: number) => zeroX + (Math.max(value, 0) / habitatExtent) * scaleWidth
  const textHalo = { paintOrder: 'stroke' as const, stroke: '#1a2528', strokeWidth: 6 }

  return (
    <Box
      component="svg"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-labelledby="watershed-land-cover-title watershed-land-cover-description"
      sx={{
        display: 'block',
        width: '100%',
        height: 'auto',
        minWidth: 0,
        borderRadius: 1,
        bgcolor: 'base.700',
      }}
    >
      <title id="watershed-land-cover-title">Land cover change across all restoration levels</title>
      <desc id="watershed-land-cover-description">
        Minimum, medium, and maximum restoration levels are grouped within three habitat priorities.
        Forest cover change is shown as a magnitude bar with a measured range extension; other
        habitat quantities are shown as bars.
      </desc>
      <rect width={width} height={height} rx="10" fill="#1a2528" />

      <text
        x="32"
        y="43"
        fill="#f2f0ef"
        fontFamily="var(--font-heading)"
        fontSize="27"
        fontWeight="700"
        letterSpacing="0.8"
      >
        ALL RESTORATION LEVELS — LAND COVER CHANGE (ACRES)
      </text>
      {levels.map((level, index) => {
        const x = 1010 + index * 155
        return (
          <g key={`level-legend-${level.key}`}>
            <rect
              x={x}
              y="30"
              width="28"
              height="10"
              rx="5"
              fill={metricShades.forest[level.key]}
            />
            <text x={x + 38} y="41" fill="#bbc0c2" fontFamily="var(--font-body)" fontSize="13">
              {level.label}
            </text>
          </g>
        )
      })}

      <g transform="translate(32 76)">
        <line
          x1="0"
          x2="48"
          y1="14"
          y2="14"
          stroke={metrics.forest.color}
          strokeWidth="7"
          strokeLinecap="round"
        />
        <circle cx="0" cy="14" r="6" fill={metrics.forest.color} />
        <circle cx="48" cy="14" r="6" fill={metrics.forest.color} />
        <text x="66" y="20" fill="#bbc0c2" fontFamily="var(--font-body)" fontSize="16">
          {metrics.forest.label}
        </text>
      </g>
      <g transform="translate(390 76)">
        <circle cx="8" cy="14" r="8" fill={metrics.meadow.color} />
        <text x="30" y="20" fill="#bbc0c2" fontFamily="var(--font-body)" fontSize="16">
          {metrics.meadow.label}
        </text>
      </g>
      <g transform="translate(650 76)">
        <circle cx="8" cy="14" r="8" fill={metrics.marsh.color} />
        <text x="30" y="20" fill="#bbc0c2" fontFamily="var(--font-body)" fontSize="16">
          {metrics.marsh.label}
        </text>
      </g>
      <g transform="translate(1055 76)">
        <circle cx="8" cy="14" r="8" fill={metrics.riparian.color} />
        <text x="30" y="20" fill="#bbc0c2" fontFamily="var(--font-body)" fontSize="16">
          {metrics.riparian.label}
        </text>
      </g>

      <text
        x={zeroX - 18}
        y="156"
        textAnchor="end"
        fill="#b9685e"
        fontFamily="var(--font-heading)"
        fontSize="18"
        letterSpacing="2.2"
      >
        ← FOREST COVER CHANGE
      </text>
      <text
        x={zeroX + 18}
        y="156"
        textAnchor="start"
        fill="#818b8e"
        fontFamily="var(--font-heading)"
        fontSize="18"
        letterSpacing="2.2"
      >
        HABITAT COVER CHANGE →
      </text>

      {forestTicks.map((tick) => {
        const x = forestX(tick)
        return (
          <g key={`forest-${tick}`}>
            <line x1={x} y1="212" x2={x} y2={height - 38} stroke="#6d777a" strokeOpacity="0.25" />
            <text
              x={x}
              y="196"
              textAnchor="middle"
              fill={tick === 0 ? '#f2f0ef' : '#b9685e'}
              fontFamily="var(--font-body)"
              fontSize="15"
              {...textHalo}
            >
              {compactNumber(tick)}
            </text>
          </g>
        )
      })}
      {habitatTicks.map((tick) => {
        const x = habitatX(tick)
        return (
          <g key={`habitat-${tick}`}>
            <line x1={x} y1="212" x2={x} y2={height - 38} stroke="#6d777a" strokeOpacity="0.25" />
            <text
              x={x}
              y="196"
              textAnchor="middle"
              fill="#818b8e"
              fontFamily="var(--font-body)"
              fontSize="15"
              {...textHalo}
            >
              {compactNumber(tick)}
            </text>
          </g>
        )
      })}
      <line
        x1={zeroX}
        y1="212"
        x2={zeroX}
        y2={height - 38}
        stroke="#f2f0ef"
        strokeOpacity="0.7"
        strokeDasharray="7 7"
      />

      {priorities.map((priority, priorityIndex) => {
        const groupY = plotTop + priorityIndex * priorityHeight
        const categoryDefinitions = [
          { key: 'forest', label: 'Forests', color: metrics.forest.color },
          { key: 'meadow', label: metrics.meadow.label, color: metrics.meadow.color },
          { key: 'marsh', label: metrics.marsh.label, color: metrics.marsh.color },
          { key: 'riparian', label: metrics.riparian.label, color: metrics.riparian.color },
        ]

        return (
          <g key={priority.key}>
            <text
              x="28"
              y={groupY + 143}
              fill={priority.color}
              fontFamily="var(--font-heading)"
              fontSize="17"
              letterSpacing="3.7"
            >
              {priority.label.toUpperCase()}
            </text>

            {categoryDefinitions.map((category, categoryIndex) => {
              const categoryY = groupY + 22 + categoryIndex * categoryGap
              return (
                <g key={category.key}>
                  <text
                    x={category.key === 'forest' ? zeroX + 16 : zeroX - 16}
                    y={categoryY + levelGap + 5}
                    textAnchor={category.key === 'forest' ? 'start' : 'end'}
                    fill={category.color}
                    fontFamily="var(--font-body)"
                    fontSize="14"
                    fontWeight="600"
                  >
                    {category.label}
                  </text>

                  {levels.map((level, levelIndex) => {
                    const y = categoryY + levelIndex * levelGap
                    const values = valuesFor(priority.key, level.key)
                    const shade = metricShades[category.key][level.key]
                    const barHeight = 9

                    if (category.key === 'forest') {
                      const lessLoss = Math.max(values.forestLow, values.forestHigh)
                      const moreLoss = Math.min(values.forestLow, values.forestHigh)
                      const lessLossX = forestX(lessLoss)
                      const moreLossX = forestX(moreLoss)
                      return (
                        <g key={level.key}>
                          <line
                            x1={moreLossX}
                            x2={lessLossX}
                            y1={y}
                            y2={y}
                            stroke={shade}
                            strokeWidth={barHeight}
                            strokeLinecap="round"
                          >
                            <title>
                              {level.label} · forest range · {compactNumber(moreLoss)} to{' '}
                              {compactNumber(lessLoss)} acres
                            </title>
                          </line>
                          <circle cx={moreLossX} cy={y} r="6" fill={shade} />
                          <circle cx={lessLossX} cy={y} r="6" fill={shade} />
                          <text
                            x={moreLossX - 8}
                            y={y + 4}
                            textAnchor="end"
                            fill={shade}
                            fontFamily="var(--font-body)"
                            fontSize="11"
                            fontWeight="600"
                            {...textHalo}
                          >
                            {compactNumber(moreLoss)}
                          </text>
                          <text
                            x={lessLossX + 8}
                            y={y + 4}
                            textAnchor="start"
                            fill={shade}
                            fontFamily="var(--font-body)"
                            fontSize="11"
                            fontWeight="600"
                            {...textHalo}
                          >
                            {compactNumber(lessLoss)}
                          </text>
                        </g>
                      )
                    }

                    const value = values[category.key as 'meadow' | 'marsh' | 'riparian']
                    const endX = habitatX(value)
                    return (
                      <g key={level.key}>
                        <circle cx={endX} cy={y} r="7" fill={shade}>
                          <title>
                            {level.label} · {category.label} · {compactNumber(value)} acres
                          </title>
                        </circle>
                        <text
                          x={endX + 9}
                          y={y + 4}
                          fill={shade}
                          fontFamily="var(--font-body)"
                          fontSize="11"
                          fontWeight="600"
                          {...textHalo}
                        >
                          {compactNumber(value)}
                        </text>
                      </g>
                    )
                  })}
                </g>
              )
            })}

            {priorityIndex < priorities.length - 1 && (
              <line
                x1="28"
                y1={groupY + priorityHeight - 16}
                x2={chartRight}
                y2={groupY + priorityHeight - 16}
                stroke="#6d777a"
                strokeOpacity="0.25"
              />
            )}
          </g>
        )
      })}
    </Box>
  )
}
