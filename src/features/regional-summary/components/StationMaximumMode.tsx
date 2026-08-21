import { useEffect, useMemo, useState } from 'react'
import { Box, Chip, CircularProgress, Paper, Typography } from '@mui/material'
import { csvParse, extent, line, scaleLinear, scaleTime } from 'd3'
import { assetUrl } from '../../../utils/baseUrl'
import { palette, typography } from '../../../theme'
import type { RegionalScenario } from '../types'

interface DailyMaximum {
  date: Date
  maximumDifferenceUsCm: number
  maximumDifferencePercent: number
  maximumDirection: 'saltier' | 'fresher'
  maximumStationId: string
  maximumStationName: string
  minimumDifferenceUsCm: number
  stationSpreadUsCm: number
  scenario: string
}

interface DirectionPeriod {
  direction: 'saltier' | 'fresher'
  dominantMaximumDays: number
  dominantMaximumShare: number
  dominantMaximumStationId: string
  dominantMaximumStationName: string
  endDate: string
  meanDifferencePercent: number
  meanDifferenceUsCm: number
  meetsBoth: boolean
  pairedDays: number
  scenario: string
  startDate: string
}

interface ScenarioSummary {
  dominantDays: number
  dominantShare: number
  dominantStationId: string
  dominantStationName: string
  endDate: string
  meanPercent: number
  meanUsCm: number
  scenario: string
  startDate: string
  strongestDirection: 'saltier' | 'fresher'
  strongestPercent: number
  strongestPeriod: string
  strongestStation: string
  strongestUsCm: number
}

interface StationMaximumModeProps {
  scenario: RegionalScenario
}

const DATA_PATH = 'data/regional-summary/station-max-tracking/'
const normalizeScenario = (value: string) =>
  value === 'Calling on Reserve' ? 'Calling on Reserves' : value
const number = (value: string | undefined) => Number(value ?? 0)
const formatDate = (value: string | Date) =>
  new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
    year: 'numeric',
  }).format(typeof value === 'string' ? new Date(`${value}T00:00:00Z`) : value)

function Metric({ label, value, detail }: { label: string; value: string; detail?: string }) {
  return (
    <Box>
      <Typography variant="captionSmall" component="p" sx={{ color: 'base.200' }}>
        {label}
      </Typography>
      <Typography variant="h5" component="p" sx={{ color: 'base.50', mt: 0.5 }}>
        {value}
      </Typography>
      {detail && (
        <Typography variant="captionSmall" component="p" sx={{ color: 'base.100', mt: 0.5 }}>
          {detail}
        </Typography>
      )}
    </Box>
  )
}

function DailyMaximumChart({ rows }: { rows: DailyMaximum[] }) {
  const width = 1120
  const height = 360
  const margin = { bottom: 42, left: 74, right: 24, top: 24 }
  const dates = extent(rows, (row) => row.date)
  const values = extent(
    rows.flatMap((row) => [row.maximumDifferenceUsCm, row.minimumDifferenceUsCm]),
  )
  if (!dates[0] || !dates[1] || values[0] === undefined || values[1] === undefined) return null

  const x = scaleTime()
    .domain(dates as [Date, Date])
    .range([margin.left, width - margin.right])
  const yPadding = Math.max(50, (values[1] - values[0]) * 0.08)
  const y = scaleLinear()
    .domain([Math.min(0, values[0] - yPadding), Math.max(0, values[1] + yPadding)])
    .nice()
    .range([height - margin.bottom, margin.top])
  const maximumLine = line<DailyMaximum>()
    .x((row) => x(row.date))
    .y((row) => y(row.maximumDifferenceUsCm))(rows)
  const minimumLine = line<DailyMaximum>()
    .x((row) => x(row.date))
    .y((row) => y(row.minimumDifferenceUsCm))(rows)
  const yTicks = y.ticks(5)
  const xTicks = x.ticks(6)

  return (
    <Box>
      <Box
        sx={(theme) => ({
          alignItems: 'center',
          display: 'flex',
          flexWrap: 'wrap',
          gap: theme.jtSpacing.gap.md,
          mb: theme.jtSpacing.component.sm,
        })}
      >
        <Typography variant="captionSmall" sx={{ color: 'base.100' }}>
          Deviation from Business as Usual (µS/cm)
        </Typography>
        <Box
          sx={(theme) => ({ alignItems: 'center', display: 'flex', gap: theme.jtSpacing.gap.xs })}
        >
          <Box sx={{ bgcolor: 'brand.primaryPink', height: 3, width: 24 }} />
          <Typography variant="captionSmall">Daily maximum</Typography>
        </Box>
        <Box
          sx={(theme) => ({ alignItems: 'center', display: 'flex', gap: theme.jtSpacing.gap.xs })}
        >
          <Box sx={{ bgcolor: 'accent.blue', height: 2, width: 24 }} />
          <Typography variant="captionSmall">Daily minimum</Typography>
        </Box>
      </Box>
      <Box sx={{ overflowX: 'auto' }}>
        <Box
          component="svg"
          role="img"
          aria-label="Daily maximum and minimum station-level deviation from Business as Usual"
          viewBox={`0 0 ${width} ${height}`}
          sx={{ display: 'block', minWidth: 720, width: '100%' }}
        >
          {yTicks.map((tick) => (
            <g key={tick}>
              <line
                x1={margin.left}
                x2={width - margin.right}
                y1={y(tick)}
                y2={y(tick)}
                stroke={palette.translucent[400]}
                strokeDasharray="4 6"
              />
              <text
                x={margin.left - 12}
                y={y(tick) + 4}
                fill={
                  tick < 0
                    ? palette.accent.blue
                    : tick > 0
                      ? palette.brand.primaryPink
                      : palette.brand.primaryGreen
                }
                textAnchor="end"
                style={typography.captionSmall}
              >
                {tick.toLocaleString()}
              </text>
            </g>
          ))}
          {xTicks.map((tick) => (
            <text
              key={tick.toISOString()}
              x={x(tick)}
              y={height - 14}
              fill={palette.base[100]}
              textAnchor="middle"
              style={typography.captionSmall}
            >
              {new Intl.DateTimeFormat('en-US', {
                month: 'short',
                year: 'numeric',
                timeZone: 'UTC',
              }).format(tick)}
            </text>
          ))}
          <line
            x1={margin.left}
            x2={width - margin.right}
            y1={y(0)}
            y2={y(0)}
            stroke={palette.brand.primaryGreen}
            strokeWidth="2"
          />
          <text
            x={margin.left + 8}
            y={y(0) - 8}
            fill={palette.brand.primaryGreen}
            style={typography.captionSmall}
          >
            Business as Usual · 0
          </text>
          {minimumLine && (
            <path
              d={minimumLine}
              fill="none"
              stroke={palette.accent.blue}
              strokeOpacity="0.65"
              strokeWidth="1.5"
            />
          )}
          {maximumLine && (
            <path
              d={maximumLine}
              fill="none"
              stroke={palette.brand.primaryPink}
              strokeWidth="2.5"
            />
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default function StationMaximumMode({ scenario }: StationMaximumModeProps) {
  const [daily, setDaily] = useState<DailyMaximum[]>([])
  const [periods, setPeriods] = useState<DirectionPeriod[]>([])
  const [summaries, setSummaries] = useState<ScenarioSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    const load = async () => {
      try {
        const [dailyText, periodText, summaryText] = await Promise.all([
          fetch(assetUrl(`${DATA_PATH}daily_station_maximum_tracking.csv`), {
            signal: controller.signal,
          }).then((response) => response.text()),
          fetch(assetUrl(`${DATA_PATH}station_maximum_direction_periods.csv`), {
            signal: controller.signal,
          }).then((response) => response.text()),
          fetch(assetUrl(`${DATA_PATH}station_maximum_scenario_summary.csv`), {
            signal: controller.signal,
          }).then((response) => response.text()),
        ])
        setDaily(
          csvParse(dailyText, (row) => ({
            date: new Date(`${row.date}T00:00:00Z`),
            maximumDifferencePercent: number(row.maximum_difference_percent_same_station),
            maximumDifferenceUsCm: number(row.maximum_difference_us_cm),
            maximumDirection: row.maximum_direction as DailyMaximum['maximumDirection'],
            maximumStationId: row.maximum_station_id ?? '',
            maximumStationName: row.maximum_station_name ?? '',
            minimumDifferenceUsCm: number(row.minimum_difference_us_cm),
            scenario: normalizeScenario(row.scenario ?? ''),
            stationSpreadUsCm: number(row.station_spread_us_cm),
          })),
        )
        setPeriods(
          csvParse(periodText, (row) => ({
            direction: row.direction as DirectionPeriod['direction'],
            dominantMaximumDays: number(row.dominant_maximum_days),
            dominantMaximumShare: number(row.dominant_maximum_share),
            dominantMaximumStationId: row.dominant_maximum_station_id ?? '',
            dominantMaximumStationName: row.dominant_maximum_station_name ?? '',
            endDate: row.end_date ?? '',
            meanDifferencePercent: number(row.mean_daily_maximum_difference_percent_same_station),
            meanDifferenceUsCm: number(row.mean_daily_maximum_difference_us_cm),
            meetsBoth: row.meets_both_thresholds === 'True',
            pairedDays: number(row.paired_days),
            scenario: normalizeScenario(row.scenario ?? ''),
            startDate: row.start_date ?? '',
          })),
        )
        setSummaries(
          csvParse(summaryText, (row) => ({
            dominantDays: number(row.full_period_dominant_maximum_days),
            dominantShare: number(row.full_period_dominant_maximum_share),
            dominantStationId: row.full_period_dominant_maximum_station_id ?? '',
            dominantStationName: row.full_period_dominant_maximum_station_name ?? '',
            endDate: row.full_period_end ?? '',
            meanPercent: number(row.full_period_mean_daily_maximum_percent_signed),
            meanUsCm: number(row.full_period_mean_daily_maximum_us_cm_signed),
            scenario: normalizeScenario(row.scenario ?? ''),
            startDate: row.full_period_start ?? '',
            strongestDirection:
              row.strongest_sustained_direction as ScenarioSummary['strongestDirection'],
            strongestPercent: number(row.strongest_sustained_percent),
            strongestPeriod: row.strongest_sustained_period ?? '',
            strongestStation: row.strongest_sustained_dominant_station ?? '',
            strongestUsCm: number(row.strongest_sustained_us_cm),
          })),
        )
      } catch (reason) {
        if (!(reason instanceof DOMException && reason.name === 'AbortError'))
          setError('Unable to load station-maximum results.')
      } finally {
        setLoading(false)
      }
    }
    void load()
    return () => controller.abort()
  }, [])

  const scenarioDaily = useMemo(
    () => daily.filter((row) => row.scenario === scenario),
    [daily, scenario],
  )
  const scenarioPeriods = useMemo(
    () => periods.filter((row) => row.scenario === scenario),
    [periods, scenario],
  )
  const summary = summaries.find((row) => row.scenario === scenario)
  const stationCounts = useMemo(() => {
    const counts = new Map<string, { days: number; id: string; name: string }>()
    scenarioDaily.forEach((row) => {
      const current = counts.get(row.maximumStationId)
      counts.set(row.maximumStationId, {
        days: (current?.days ?? 0) + 1,
        id: row.maximumStationId,
        name: row.maximumStationName,
      })
    })
    return [...counts.values()].sort((a, b) => b.days - a.days)
  }, [scenarioDaily])

  if (loading)
    return (
      <Box sx={{ alignItems: 'center', display: 'flex', flex: 1, justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    )
  if (error || !summary)
    return (
      <Box sx={(theme) => ({ p: theme.jtSpacing.section.sm })}>
        <Typography variant="body1">
          {error ?? 'No station-maximum results are available for this scenario.'}
        </Typography>
      </Box>
    )

  const directionColor = summary.meanUsCm >= 0 ? 'brand.primaryPink' : 'accent.blue'
  return (
    <Box
      component="section"
      aria-label="Franks Tract station maximum analysis"
      sx={(theme) => ({
        bgcolor: 'base.900',
        display: 'grid',
        flex: '1 1 auto',
        gap: theme.jtSpacing.gap.lg,
        overflowY: 'auto',
        p: { xs: theme.jtSpacing.component.md, md: theme.jtSpacing.component.lg },
      })}
    >
      <Box
        sx={(theme) => ({
          display: 'grid',
          gap: theme.jtSpacing.gap.md,
          gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1.7fr) minmax(300px, 0.8fr)' },
        })}
      >
        <Paper
          variant="outlined"
          sx={(theme) => ({
            bgcolor: 'base.800',
            display: 'grid',
            gap: theme.jtSpacing.gap.md,
            p: theme.jtSpacing.component.md,
          })}
        >
          <Box>
            <Typography variant="h4" component="h2">
              Franks Tract daily station maximum
            </Typography>
            <Typography
              variant="caption"
              component="p"
              sx={(theme) => ({ color: 'base.100', mt: theme.jtSpacing.component.xs })}
            >
              Each day selects the largest station-level scenario-minus-Business-as-Usual difference
              among 10 Franks Tract stations.
            </Typography>
          </Box>
          <Box
            sx={(theme) => ({
              display: 'grid',
              gap: theme.jtSpacing.gap.md,
              gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, minmax(0, 1fr))' },
            })}
          >
            <Metric
              label="Full-period average maximum"
              value={`${Math.abs(summary.meanUsCm).toLocaleString(undefined, { maximumFractionDigits: 1 })} µS/cm ${summary.meanUsCm >= 0 ? 'saltier' : 'fresher'}`}
              detail={`${Math.abs(summary.meanPercent).toFixed(1)}% · ${formatDate(summary.startDate)}–${formatDate(summary.endDate)}`}
            />
            <Metric
              label="Most frequent daily maximum"
              value={summary.dominantStationName}
              detail={`Station ${summary.dominantStationId} · ${summary.dominantDays} days (${(summary.dominantShare * 100).toFixed(1)}%)`}
            />
            <Metric
              label="Strongest sustained period"
              value={`${Math.abs(summary.strongestUsCm).toFixed(1)} µS/cm ${summary.strongestDirection}`}
              detail={`${Math.abs(summary.strongestPercent).toFixed(1)}% · ${summary.strongestPeriod}`}
            />
            <Metric label="Strongest-period station" value={summary.strongestStation} />
          </Box>
          <Box sx={{ color: directionColor }}>
            <DailyMaximumChart rows={scenarioDaily} />
          </Box>
        </Paper>

        <Box sx={(theme) => ({ display: 'grid', gap: theme.jtSpacing.gap.md })}>
          <Paper
            variant="outlined"
            sx={(theme) => ({ bgcolor: 'base.800', p: theme.jtSpacing.component.md })}
          >
            <Typography variant="h5" component="h2">
              How to read this mode
            </Typography>
            <Typography
              variant="caption"
              component="p"
              sx={(theme) => ({ color: 'base.100', mt: theme.jtSpacing.component.sm })}
            >
              This is a conservative{' '}
              <Box component="span" sx={{ color: 'brand.primaryGreen', fontWeight: 700 }}>
                worst-location indicator
              </Box>
              , not a Franks Tract average. The winning station can change daily. Use the cyan
              minimum line and the station spread to see when locations disagree.
            </Typography>
          </Paper>
          <Paper
            variant="outlined"
            sx={(theme) => ({ bgcolor: 'base.800', p: theme.jtSpacing.component.md })}
          >
            <Typography variant="h5" component="h2">
              Daily-maximum station ranking
            </Typography>
            <Box
              sx={(theme) => ({
                display: 'grid',
                gap: theme.jtSpacing.gap.sm,
                mt: theme.jtSpacing.component.sm,
              })}
            >
              {stationCounts.map((station, index) => (
                <Box
                  key={station.id}
                  sx={(theme) => ({
                    alignItems: 'center',
                    display: 'grid',
                    gap: theme.jtSpacing.gap.sm,
                    gridTemplateColumns: '24px minmax(0, 1fr) auto',
                  })}
                >
                  <Typography variant="captionSmall" sx={{ color: 'base.200' }}>
                    {index + 1}
                  </Typography>
                  <Box>
                    <Typography variant="captionSmall" sx={{ color: 'base.50' }}>
                      {station.name}
                    </Typography>
                    <Box sx={{ bgcolor: 'base.600', height: 4, mt: 0.5 }}>
                      <Box
                        sx={{
                          bgcolor: 'brand.primaryGreen',
                          height: '100%',
                          width: `${(station.days / scenarioDaily.length) * 100}%`,
                        }}
                      />
                    </Box>
                  </Box>
                  <Typography variant="captionSmall">{station.days} days</Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Box>
      </Box>

      <Box>
        <Typography variant="h4" component="h2">
          Directional periods
        </Typography>
        <Typography
          variant="caption"
          component="p"
          sx={(theme) => ({ color: 'base.100', mt: theme.jtSpacing.component.xs })}
        >
          Adjacent days with the same maximum direction are grouped into periods. Threshold badges
          use the source analysis criteria of 50 µS/cm and 10%.
        </Typography>
        <Box
          sx={(theme) => ({
            display: 'grid',
            gap: theme.jtSpacing.gap.md,
            gridTemplateColumns: {
              xs: '1fr',
              md: 'repeat(2, minmax(0, 1fr))',
              xl: 'repeat(3, minmax(0, 1fr))',
            },
            mt: theme.jtSpacing.component.md,
          })}
        >
          {scenarioPeriods.map((period) => (
            <Paper
              key={`${period.startDate}-${period.endDate}`}
              variant="outlined"
              sx={(theme) => ({
                bgcolor: 'base.800',
                borderTop: 3,
                borderTopColor:
                  period.direction === 'saltier' ? 'brand.primaryPink' : 'accent.blue',
                display: 'grid',
                gap: theme.jtSpacing.gap.sm,
                p: theme.jtSpacing.component.md,
              })}
            >
              <Box sx={{ alignItems: 'start', display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h5" component="h3">
                  {formatDate(period.startDate)}–{formatDate(period.endDate)}
                </Typography>
                {period.meetsBoth && (
                  <Chip label="≥50 µS/cm and ≥10%" size="small" variant="outlined" />
                )}
              </Box>
              <Typography
                variant="body2"
                sx={{ color: period.direction === 'saltier' ? 'brand.primaryPink' : 'accent.blue' }}
              >
                {period.direction === 'saltier' ? 'Saltier' : 'Fresher'} by{' '}
                {Math.abs(period.meanDifferenceUsCm).toFixed(1)} µS/cm ·{' '}
                {Math.abs(period.meanDifferencePercent).toFixed(1)}%
              </Typography>
              <Typography variant="captionSmall">{period.pairedDays} paired days</Typography>
              <Typography variant="captionSmall" sx={{ color: 'base.100' }}>
                {period.dominantMaximumStationName} (station {period.dominantMaximumStationId})
                supplied the daily maximum on {period.dominantMaximumDays} days ·{' '}
                {(period.dominantMaximumShare * 100).toFixed(1)}%.
              </Typography>
            </Paper>
          ))}
        </Box>
      </Box>
    </Box>
  )
}
