import { useEffect, useMemo, useRef, useState } from 'react'
import { Box, Slider, Tooltip, Typography } from '@mui/material'
import { DISABLED_SCENARIOS, SCENARIOS, type ComparisonFilter, type RegionalScenario, type SelectedRegionTimeline } from '../types'

const DATA_URL = `${import.meta.env.BASE_URL}data/regional-summary/all-scenario-comparisons.json`

interface DatedComparison {
  scenario: string
  comparison_scenario: string
  start_date: string
  end_date: string
  difference_us_cm: number
  difference_percent: number
}

interface TimeRangeControlProps {
  filter: ComparisonFilter
  scenario: RegionalScenario
  selectedRegion: SelectedRegionTimeline | null
  onReportSelect: (comparisonId: string) => void
  onChange: (filter: ComparisonFilter) => void
}

const toMonthIndex = (value: string) => {
  const [year, month] = value.slice(0, 7).split('-').map(Number)
  return year * 12 + month - 1
}

const fromMonthIndex = (value: number) => {
  const year = Math.floor(value / 12)
  const month = value % 12
  return `${year}-${String(month + 1).padStart(2, '0')}`
}

const formatMonth = (value: number) => {
  const year = Math.floor(value / 12)
  const month = value % 12
  return new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' })
    .format(new Date(Date.UTC(year, month, 1)))
}

const formatDate = (value: string) => new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
  year: 'numeric',
}).format(new Date(`${value}T00:00:00Z`))

export default function TimeRangeControl({ filter, scenario, selectedRegion, onReportSelect, onChange }: TimeRangeControlProps) {
  const [bounds, setBounds] = useState<[number, number] | null>(null)
  const [comparisons, setComparisons] = useState<DatedComparison[]>([])
  const [draftValue, setDraftValue] = useState<[number, number] | null>(null)
  const draftValueRef = useRef<[number, number] | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    fetch(DATA_URL, { signal: controller.signal })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error('Unable to load comparisons')))
      .then((payload) => {
        const comparisons = payload.places.flatMap((place: { comparisons: DatedComparison[] }) => place.comparisons) as DatedComparison[]
        setComparisons(comparisons)
        setBounds([
          Math.min(...comparisons.map((comparison) => toMonthIndex(comparison.start_date))),
          Math.max(...comparisons.map((comparison) => toMonthIndex(comparison.end_date))) + 1,
        ])
      })
      .catch((error: unknown) => {
        if (!(error instanceof DOMException && error.name === 'AbortError')) console.error(error)
      })
    return () => controller.abort()
  }, [])

  const marks = useMemo(() => {
    if (!bounds) return []
    const result: { value: number; label: string }[] = []
    for (let value = bounds[0]; value <= bounds[1]; value += 1) {
      const month = value % 12
      if (month % 3 !== 0) continue
      const year = Math.floor(value / 12)
      result.push({ value, label: month === 0 ? `${year} · Q1` : `Q${month / 3 + 1}` })
    }
    return result
  }, [bounds])

  useEffect(() => {
    if (!bounds) return
    const nextValue: [number, number] = [
      filter.startMonth ? toMonthIndex(filter.startMonth) : bounds[0],
      filter.endMonth ? toMonthIndex(filter.endMonth) : bounds[1],
    ]
    draftValueRef.current = nextValue
    setDraftValue(nextValue)
  }, [bounds, filter.endMonth, filter.startMonth])

  const density = useMemo(() => {
    if (!bounds) return { monthly: [], sharedMaximum: 0 }
    const qualifyingComparisons = comparisons
      .filter((comparison) => comparison.comparison_scenario === 'Business as Usual')
      .filter((comparison) => {
        const passesUs = Math.abs(comparison.difference_us_cm) >= filter.minimumUsCm
        const passesPercent = Math.abs(comparison.difference_percent) >= filter.minimumPercent
        if (!filter.showUsCm && !filter.showPercent) return true
        if (!filter.showUsCm) return passesPercent
        if (!filter.showPercent) return passesUs
        return filter.mode === 'either' ? passesUs || passesPercent : passesUs && passesPercent
      })

    const forScenario = (scenarioName: RegionalScenario) => {
      const counts = Array.from({ length: bounds[1] - bounds[0] }, () => 0)
      qualifyingComparisons
      .filter((comparison) => comparison.scenario === scenarioName)
      .forEach((comparison) => {
        const start = Math.max(bounds[0], toMonthIndex(comparison.start_date))
        const end = Math.min(bounds[1] - 1, toMonthIndex(comparison.end_date))
        for (let month = start; month <= end; month += 1) counts[month - bounds[0]] += 1
      })
      return counts
    }

    const enabledDensities = SCENARIOS
      .filter((scenarioName) => !DISABLED_SCENARIOS.includes(scenarioName))
      .map(forScenario)
    return {
      monthly: forScenario(scenario),
      sharedMaximum: Math.max(0, ...enabledDensities.flat()),
    }
  }, [bounds, comparisons, filter.minimumPercent, filter.minimumUsCm, filter.mode, filter.showPercent, filter.showUsCm, scenario])

  const monthlyDensity = density.monthly

  if (!bounds) return <Box aria-hidden sx={{ minHeight: 52 }} />

  const committedValue: [number, number] = [
    filter.startMonth ? toMonthIndex(filter.startMonth) : bounds[0],
    filter.endMonth ? toMonthIndex(filter.endMonth) : bounds[1],
  ]
  const value = draftValue ?? committedValue
  const peakCount = Math.max(0, ...monthlyDensity)
  const peakMonth = bounds[0] + Math.max(0, monthlyDensity.indexOf(peakCount))
  const timelineStart = Date.UTC(Math.floor(bounds[0] / 12), bounds[0] % 12, 1)
  const timelineEnd = Date.UTC(Math.floor(bounds[1] / 12), bounds[1] % 12, 1)
  const intervalPosition = (startDate: string, endDate: string) => {
    const start = new Date(`${startDate}T00:00:00Z`).getTime()
    const endExclusive = new Date(`${endDate}T00:00:00Z`).getTime() + 86_400_000
    const duration = timelineEnd - timelineStart
    const left = Math.max(0, Math.min(100, ((start - timelineStart) / duration) * 100))
    const right = Math.max(0, Math.min(100, ((endExclusive - timelineStart) / duration) * 100))
    return { left, width: Math.max(0.35, right - left) }
  }

  return (
    <Box data-tour="regional-time" role="group" aria-label="Comparison time period" sx={(theme) => ({ display: 'grid', gridTemplateColumns: `${theme.spacing(12)} minmax(0, 1fr) ${theme.spacing(12)}`, alignItems: 'start', columnGap: theme.jtSpacing.gap.sm, minWidth: 0, px: theme.jtSpacing.component.xs })}>
      <Typography variant="captionSmall" sx={{ color: 'base.100', fontVariantNumeric: 'tabular-nums', pt: 2.5, whiteSpace: 'nowrap' }}>
        {formatMonth(value[0])}
      </Typography>
      <Box sx={{ minWidth: 0, mx: 1 }}>
        <Typography component="p" variant="captionSmall" sx={{ color: 'base.100', lineHeight: 1, mb: 0.5 }}>
          Monthly report count
        </Typography>
        <Box sx={{ height: 24, overflow: 'hidden', position: 'relative', width: '100%' }}>
          <Box
            aria-label={`Monthly summary density on a shared scenario scale. Peak is ${formatMonth(peakMonth)} with ${peakCount} summaries.`}
            role="img"
            sx={{ alignItems: 'end', display: 'grid', gridTemplateColumns: `repeat(${monthlyDensity.length}, minmax(2px, 1fr))`, height: 24, overflow: 'hidden', width: '100%' }}
          >
            {monthlyDensity.map((count, index) => {
              const month = bounds[0] + index
              const isPeak = count === peakCount && peakCount > 0
              const isSelected = month >= value[0] && month < value[1]
              return (
                <Tooltip arrow key={month} title={`${formatMonth(month)}: ${count.toLocaleString()} summaries`}>
                  <Box component="span" sx={{ bgcolor: 'base.100', borderInlineEnd: '2px solid', borderColor: 'base.800', boxSizing: 'border-box', height: density.sharedMaximum ? `${Math.max(12, (count / density.sharedMaximum) * 100)}%` : 0, minWidth: 0, opacity: isSelected ? (isPeak ? 0.9 : 0.62) : 0.14, transition: 'height 160ms ease, opacity 160ms ease' }} />
                </Tooltip>
              )
            })}
          </Box>
        </Box>
        <Slider
          aria-label="Scenario comparison month range"
          min={bounds[0]}
          max={bounds[1]}
          step={1}
          marks={marks}
          value={value}
          valueLabelDisplay="auto"
          valueLabelFormat={formatMonth}
          onChange={(_, nextValue, activeThumb) => {
            const [nextStart, nextEnd] = nextValue as number[]
            const [start, end] = activeThumb === 0 ? [Math.min(nextStart, value[1] - 1), value[1]] : [value[0], Math.max(nextEnd, value[0] + 1)]
            const nextDraft: [number, number] = [start, end]
            draftValueRef.current = nextDraft
            setDraftValue(nextDraft)
          }}
          onChangeCommitted={() => {
            const [start, end] = draftValueRef.current ?? committedValue
            onChange({ ...filter, startMonth: fromMonthIndex(start), endMonth: fromMonthIndex(end) })
          }}
          disableSwap
          sx={(theme) => ({ color: 'brand.primaryGreen', mb: 0, mt: -2.75, '& .MuiSlider-markLabel': { ...theme.typography.captionSmall, color: theme.palette.base[100], mt: -0.25 }, '& .MuiSlider-thumb': { height: 16, width: 16 }, '& .MuiSlider-track, & .MuiSlider-rail': { height: 3 } })}
        />
        {selectedRegion && selectedRegion.periods.length > 0 && (
          <Box sx={{ mt: 2.5 }}>
            <Typography variant="captionSmall" sx={{ color: 'base.100', display: 'block', mb: 0.5 }}>
              {selectedRegion.place} · {selectedRegion.periods.length} report{selectedRegion.periods.length === 1 ? '' : 's'}
            </Typography>
            <Box aria-label={`Report periods for ${selectedRegion.place}`} role="group" sx={{ bgcolor: 'base.700', borderRadius: 999, height: 8, position: 'relative' }}>
              {selectedRegion.periods.map((period) => {
                const interval = intervalPosition(period.startDate, period.endDate)
                const label = `${period.direction === 'fresher' ? 'Fresher' : 'Saltier'} · ${formatDate(period.startDate)}–${formatDate(period.endDate)}. Open report.`
                return (
                  <Tooltip arrow key={period.comparisonId} title={label}>
                    <Box aria-label={label} component="button" onClick={() => onReportSelect(period.comparisonId)} sx={{ bgcolor: period.direction === 'fresher' ? 'accent.blue' : 'brand.primaryPink', border: 0, borderRadius: 999, cursor: 'pointer', height: '100%', left: `${interval.left}%`, minWidth: 3, p: 0, position: 'absolute', top: 0, width: `${interval.width}%`, '&:focus-visible': { outline: '2px solid', outlineColor: 'brand.primaryGreen', outlineOffset: 2 } }} type="button" />
                  </Tooltip>
                )
              })}
            </Box>
          </Box>
        )}
      </Box>
      <Typography variant="captionSmall" sx={{ color: 'base.100', fontVariantNumeric: 'tabular-nums', pt: 2.5, textAlign: 'right', whiteSpace: 'nowrap' }}>
        {formatMonth(value[1])}
      </Typography>
    </Box>
  )
}
