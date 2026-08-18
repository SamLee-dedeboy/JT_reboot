import { useEffect, useMemo, useState } from 'react'
import { Box, CircularProgress, Typography } from '@mui/material'
import { palette } from '../../../../theme/index'

const DATA_URL = `${import.meta.env.BASE_URL}data/regional-summary/comparison-daily-timeseries.json.gz`

interface DailyDeviation {
  average_deviation_b_minus_a_us_cm: number
  date: string
  rolling_average_deviation_us_cm: number
}

interface DailySeriesPayload {
  seriesByComparisonId: Record<string, DailyDeviation[]>
}

let seriesPromise: Promise<DailySeriesPayload> | null = null

function loadSeries() {
  if (!seriesPromise) {
    seriesPromise = fetch(DATA_URL).then(async (response) => {
      if (!response.ok) throw new Error('Unable to load daily deviation series')
      if (!response.body || typeof DecompressionStream === 'undefined') {
        throw new Error('This browser cannot decompress daily deviation series')
      }
      const stream = response.body.pipeThrough(new DecompressionStream('gzip'))
      return new Response(stream).json() as Promise<DailySeriesPayload>
    })
  }
  return seriesPromise
}

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
    year: 'numeric',
  }).format(new Date(`${value}T00:00:00Z`))

export default function ComparisonTimeSeriesChart({
  comparisonId,
  direction,
  endDate,
  startDate,
}: {
  comparisonId: string
  direction: 'saltier' | 'fresher'
  endDate: string
  startDate: string
}) {
  const [series, setSeries] = useState<DailyDeviation[] | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    let active = true
    loadSeries()
      .then((payload) => {
        if (!active) return
        setSeries(
          (payload.seriesByComparisonId[comparisonId] ?? []).filter(
            (point) => point.date >= startDate && point.date <= endDate,
          ),
        )
      })
      .catch(() => active && setError(true))
    return () => {
      active = false
    }
  }, [comparisonId, endDate, startDate])

  const chart = useMemo(() => {
    if (!series?.length) return null
    const width = 1000
    const height = 520
    const padding = { bottom: 58, left: 92, right: 30, top: 28 }
    const values = series.flatMap((point) => [
      point.average_deviation_b_minus_a_us_cm,
      point.rolling_average_deviation_us_cm,
      0,
    ])
    const rawMinimum = Math.min(...values)
    const rawMaximum = Math.max(...values)
    const rawRange = rawMaximum - rawMinimum || 1
    const minimum = rawMinimum - rawRange * 0.08
    const maximum = rawMaximum + rawRange * 0.08
    const range = maximum - minimum
    const x = (index: number) =>
      padding.left +
      (index / Math.max(1, series.length - 1)) * (width - padding.left - padding.right)
    const y = (value: number) =>
      padding.top + ((maximum - value) / range) * (height - padding.top - padding.bottom)
    const path = (key: 'average_deviation_b_minus_a_us_cm' | 'rolling_average_deviation_us_cm') =>
      series
        .map(
          (point, index) =>
            `${index ? 'L' : 'M'} ${x(index).toFixed(2)} ${y(point[key]).toFixed(2)}`,
        )
        .join(' ')
    const ticks = Array.from(
      new Set(
        [
          minimum,
          minimum + range * 0.25,
          minimum + range * 0.5,
          minimum + range * 0.75,
          maximum,
          0,
        ].map((value) => Math.round(value * 10) / 10),
      ),
    ).sort((a, b) => a - b)
    return { height, maximum, minimum, padding, path, ticks, width, x, y, zeroY: y(0) }
  }, [series])

  if (error)
    return (
      <Typography variant="body2" sx={{ color: 'error.main' }}>
        Daily deviation data could not be loaded.
      </Typography>
    )
  if (series && !series.length)
    return (
      <Typography variant="body2" sx={{ color: 'base.200' }}>
        No daily deviation values were found for this report.
      </Typography>
    )
  if (!series || !chart) {
    return (
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          gap: 1.5,
          justifyContent: 'center',
          minHeight: 360,
        }}
      >
        <CircularProgress size={24} />
        <Typography variant="body2" sx={{ color: 'base.100' }}>
          Loading daily deviations…
        </Typography>
      </Box>
    )
  }

  const directionColor = direction === 'saltier' ? palette.brand.primaryPink : palette.accent.blue
  const plotRight = chart.width - chart.padding.right
  const plotBottom = chart.height - chart.padding.bottom

  return (
    <Box>
      <Box sx={{ alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: 2.5, mb: 1.5 }}>
        <Typography variant="body2" sx={{ color: palette.base[100] }}>
          Deviation from Business as Usual
        </Typography>
        <Typography variant="captionSmall" sx={{ color: palette.base[100] }}>
          — Daily deviation
        </Typography>
        <Typography variant="captionSmall" sx={{ color: directionColor }}>
          — Rolling deviation used for evidence
        </Typography>
        <Typography variant="captionSmall" sx={{ color: palette.brand.primaryGreen }}>
          — Business as Usual
        </Typography>
      </Box>
      <Box
        component="svg"
        role="img"
        aria-label={`Daily and rolling salinity deviation from ${formatDate(startDate)} through ${formatDate(endDate)}. The horizontal Business as Usual reference is zero microsiemens per centimeter.`}
        viewBox={`0 0 ${chart.width} ${chart.height}`}
        sx={{ display: 'block', height: 'auto', maxHeight: 'calc(100dvh - 260px)', width: '100%' }}
      >
        {chart.ticks.map((tick) => (
          <g key={tick}>
            <line
              x1={chart.padding.left}
              x2={plotRight}
              y1={chart.y(tick)}
              y2={chart.y(tick)}
              stroke={tick === 0 ? palette.brand.primaryGreen : palette.base[600]}
              strokeDasharray={tick === 0 ? undefined : '3 4'}
              strokeWidth={tick === 0 ? 2.5 : 1}
            />
            <text
              x={chart.padding.left - 12}
              y={chart.y(tick) + 4}
              fill={
                tick === 0
                  ? palette.brand.primaryGreen
                  : tick < 0
                    ? palette.accent.blue
                    : palette.brand.primaryPink
              }
              fontSize="13"
              fontWeight={tick === 0 ? 700 : 600}
              textAnchor="end"
            >
              {tick.toLocaleString()}
            </text>
          </g>
        ))}
        <line
          x1={chart.padding.left}
          x2={chart.padding.left}
          y1={chart.padding.top}
          y2={plotBottom}
          stroke={palette.base[300]}
          strokeWidth="1.5"
        />
        <line
          x1={chart.padding.left}
          x2={plotRight}
          y1={plotBottom}
          y2={plotBottom}
          stroke={palette.base[300]}
          strokeWidth="1.5"
        />
        <text
          x={chart.padding.left + 10}
          y={chart.zeroY - 8}
          fill={palette.brand.primaryGreen}
          fontSize="13"
          fontWeight="700"
        >
          Business as Usual · 0 µS/cm
        </text>
        <path
          d={chart.path('average_deviation_b_minus_a_us_cm')}
          fill="none"
          stroke={palette.base[100]}
          strokeOpacity="0.72"
          strokeWidth="1.75"
        />
        <path
          d={chart.path('rolling_average_deviation_us_cm')}
          fill="none"
          stroke={directionColor}
          strokeWidth="3.5"
        />
        {series.map((point, index) => (
          <circle
            key={point.date}
            cx={chart.x(index)}
            cy={chart.y(point.rolling_average_deviation_us_cm)}
            fill="transparent"
            r="7"
          >
            <title>{`${formatDate(point.date)} — daily ${point.average_deviation_b_minus_a_us_cm.toLocaleString()} µS/cm; rolling ${point.rolling_average_deviation_us_cm.toLocaleString()} µS/cm`}</title>
          </circle>
        ))}
        <text x={chart.padding.left} y={chart.height - 24} fill={palette.base[100]} fontSize="13">
          {formatDate(series[0].date)}
        </text>
        <text
          x={plotRight}
          y={chart.height - 24}
          fill={palette.base[100]}
          fontSize="13"
          textAnchor="end"
        >
          {formatDate(series[series.length - 1].date)}
        </text>
        <text
          x="22"
          y={(chart.padding.top + plotBottom) / 2}
          fill={palette.base[100]}
          fontSize="14"
          textAnchor="middle"
          transform={`rotate(-90 22 ${(chart.padding.top + plotBottom) / 2})`}
        >
          Deviation (µS/cm)
        </text>
      </Box>
    </Box>
  )
}
