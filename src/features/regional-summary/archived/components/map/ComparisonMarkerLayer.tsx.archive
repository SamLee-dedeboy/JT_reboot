import { useEffect, useMemo, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import ShowChartRoundedIcon from '@mui/icons-material/ShowChartRounded'
import { Box, Chip, IconButton, Stack, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { AnimatePresence, motion } from 'framer-motion'
import { Marker, useMap } from 'react-map-gl/mapbox'
import { palette } from '../../../../theme/index'
import type { ComparisonFilter, RegionalScenario, SelectedRegionTimeline } from '../../types'
import ComparisonTimeSeriesDialog from './ComparisonTimeSeriesDialog'

const DATA_URL = `${import.meta.env.BASE_URL}data/regional-summary/all-scenario-comparisons.json`

interface Comparison {
  comparison_id: string
  scenario: string
  comparison_scenario: string
  direction: 'saltier' | 'fresher'
  place: string
  original_rma_region: string
  start_date: string
  end_date: string
  difference_us_cm: number
  difference_percent: number
  directional_day_count: number
  directional_consistency: number
  agreeing_station_month_count: number
  station_month_count: number
  station_agreement: number
  strongest_month: string
  strongest_month_difference_us_cm: number
  strongest_date: string
  strongest_rolling_difference_us_cm: number
  evidence_type: 'regional' | 'station' | 'both' | 'none'
  narrative: string
  is_strongest_signal?: boolean
  station_count: number
  month_count?: number
  coverage_note: string
  paired_days: number
  time_series_ref: string
}

interface ComparisonPlace {
  name: string
  longitude: number
  latitude: number
  stationCount: number
  comparisonCount: number
  strongestCount: number
  comparisons: Comparison[]
}

interface ComparisonPayload {
  places: ComparisonPlace[]
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
    year: 'numeric',
  }).format(new Date(`${value}T00:00:00Z`))
}

function formatMonth(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    timeZone: 'UTC',
    year: 'numeric',
  }).format(new Date(`${value}-01T00:00:00Z`))
}

function formatShare(value: number) {
  return (value * 100).toLocaleString('en-US', { maximumFractionDigits: 1 })
}

function formatStoryPeriod(startDate: string, endDate: string) {
  const start = new Date(`${startDate}T00:00:00Z`)
  const end = new Date(`${endDate}T00:00:00Z`)
  const startMonth = new Intl.DateTimeFormat('en-US', { month: 'long', timeZone: 'UTC' }).format(
    start,
  )
  const endMonth = new Intl.DateTimeFormat('en-US', { month: 'long', timeZone: 'UTC' }).format(end)
  const startYear = start.getUTCFullYear()
  const endYear = end.getUTCFullYear()
  if (startMonth === endMonth && startYear === endYear) return `${startMonth} ${startYear}`
  if (startYear === endYear) return `${startMonth}–${endMonth} ${startYear}`
  return `${startMonth} ${startYear}–${endMonth} ${endYear}`
}

function ComparisonPanel({
  focusedReportId,
  onClose,
  place,
}: {
  focusedReportId: string | null
  onClose: () => void
  place: ComparisonPlace
}) {
  const [chartComparison, setChartComparison] = useState<Comparison | null>(null)

  const openComparison = (comparison: Comparison) => setChartComparison(comparison)

  useEffect(() => {
    if (!focusedReportId) return
    const frame = window.requestAnimationFrame(() => {
      const card = document.getElementById(`regional-report-${focusedReportId}`)
      card?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    })
    return () => window.cancelAnimationFrame(frame)
  }, [focusedReportId])

  return (
    <>
      <Box
        component={motion.aside}
        aria-label={`Comparisons for ${place.name}`}
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        exit={{ x: '-100%' }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        sx={{
          backgroundColor: palette.base[900],
          borderRight: `1px solid ${palette.base[400]}`,
          bottom: 0,
          boxShadow: '18px 0 48px rgba(16,22,24,0.5)',
          color: palette.common.white,
          left: 0,
          maxWidth: 'calc(100vw - 32px)',
          overflowY: 'auto',
          position: 'absolute',
          top: 0,
          width: { xs: 340, sm: 420 },
          zIndex: 8,
        }}
      >
        <Box sx={{ color: palette.common.white }}>
          <Box
            sx={{
              backgroundColor: palette.base[800],
              borderBottom: `1px solid ${palette.base[400]}`,
              p: 2.25,
              pr: 6,
              position: 'sticky',
              top: 0,
              zIndex: 1,
            }}
          >
            <IconButton
              aria-label={`Close comparisons for ${place.name}`}
              onClick={onClose}
              size="small"
              sx={{ color: palette.brand.primaryGreen, position: 'absolute', right: 10, top: 10 }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
            <Typography component="h2" sx={{ fontSize: 19, fontWeight: 700, lineHeight: 1.15 }}>
              {place.name}
            </Typography>
            <Typography
              component="p"
              variant="captionSmall"
              sx={{ color: palette.base[100], mt: 0.75 }}
            >
              {place.comparisonCount} comparison period{place.comparisonCount === 1 ? '' : 's'} ·{' '}
              {place.stationCount} mapped stations
            </Typography>
            <Typography
              component="p"
              variant="captionSmall"
              sx={{ color: palette.base[200], mt: 1 }}
            >
              Showing exact qualifying periods compared with Business as Usual. Evidence may reflect
              the regional trend, station hotspots, or both.
            </Typography>
          </Box>

          <Stack spacing={1.25} sx={{ backgroundColor: palette.base[900], p: 1.5 }}>
            {place.comparisons.map((comparison, index) => {
              const directionColor =
                comparison.direction === 'saltier' ? palette.brand.primaryPink : palette.accent.blue
              const directionalDays = comparison.directional_day_count
              const stationMonthTotal = comparison.station_month_count
              const agreeingStationMonths = comparison.agreeing_station_month_count
              const isExpanded = chartComparison?.comparison_id === comparison.comparison_id
              const isFocused = focusedReportId === comparison.comparison_id
              return (
                <Box
                  component="article"
                  aria-expanded={isExpanded}
                  id={`regional-report-${comparison.comparison_id}`}
                  key={`${comparison.scenario}-${comparison.start_date}-${comparison.end_date}-${index}`}
                  onClick={() => openComparison(comparison)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      openComparison(comparison)
                    }
                  }}
                  role="button"
                  sx={{
                    backgroundColor: isFocused
                      ? alpha(palette.brand.primaryGreen, 0.07)
                      : palette.base[800],
                    border: `1px solid ${comparison.is_strongest_signal ? palette.brand.primaryGreen : palette.base[500]}`,
                    borderRadius: 1.5,
                    boxShadow: 'none',
                    cursor: 'pointer',
                    p: 1.75,
                    transition: 'background-color 140ms ease, box-shadow 140ms ease',
                    '&:hover': {
                      backgroundColor: isFocused
                        ? alpha(palette.brand.primaryGreen, 0.11)
                        : palette.base[700],
                    },
                    '&:focus-visible': {
                      outline: `2px solid ${palette.brand.primaryGreen}`,
                      outlineOffset: 2,
                    },
                  }}
                  tabIndex={0}
                >
                  <Stack
                    direction="row"
                    sx={{ alignItems: 'flex-start', gap: 1, justifyContent: 'space-between' }}
                  >
                    {comparison.is_strongest_signal && (
                      <Chip
                        label="Strongest signal"
                        size="small"
                        variant="outlined"
                        sx={{
                          backgroundColor: 'transparent',
                          borderColor: palette.brand.primaryGreen,
                          color: palette.brand.primaryGreen,
                          flex: '0 0 auto',
                          typography: 'captionSmall',
                          fontWeight: 700,
                          height: 28,
                        }}
                      />
                    )}
                  </Stack>
                  <Typography
                    component="p"
                    variant="captionSmall"
                    sx={{ color: palette.base[100], mt: 0.5 }}
                  >
                    {formatDate(comparison.start_date)} – {formatDate(comparison.end_date)} ·{' '}
                    {comparison.paired_days} paired days
                  </Typography>
                  <Typography
                    component="p"
                    variant="captionSmall"
                    sx={{ color: palette.base[100], fontWeight: 400, lineHeight: 1.5, mt: 1.25 }}
                  >
                    {comparison.scenario} was{' '}
                    <Box component="span" sx={{ color: directionColor, fontWeight: 700 }}>
                      {comparison.direction}
                    </Box>{' '}
                    in {comparison.place} during{' '}
                    {formatStoryPeriod(comparison.start_date, comparison.end_date)},{' '}
                    <Box component="span" sx={{ color: palette.common.white, fontWeight: 700 }}>
                      strongest in {formatMonth(comparison.strongest_month)}.
                    </Box>
                  </Typography>
                  <Box
                    sx={{
                      borderBottom: `1px solid ${palette.base[500]}`,
                      borderTop: `1px solid ${palette.base[500]}`,
                      mt: 1.25,
                      py: 1,
                    }}
                  >
                    <Typography
                      component="p"
                      variant="captionSmall"
                      sx={{ color: palette.base[200] }}
                    >
                      Overall regional change
                    </Typography>
                    <Typography
                      component="p"
                      variant="captionSmall"
                      sx={{ color: directionColor, fontWeight: 800, mt: 0.25 }}
                    >
                      {comparison.direction === 'saltier' ? 'Saltier' : 'Fresher'} ·{' '}
                      {comparison.difference_us_cm.toLocaleString()} µS/cm ·{' '}
                      {comparison.difference_percent.toLocaleString()}%
                    </Typography>
                  </Box>
                  <Box sx={{ borderTop: `1px solid ${palette.base[500]}`, mt: 1.25, pt: 1.25 }}>
                    <Typography
                      component="p"
                      variant="captionSmall"
                      sx={{ color: palette.base[100], lineHeight: 1.45 }}
                    >
                      Peak monthly average in{' '}
                      <Box component="span" sx={{ color: palette.common.white, fontWeight: 700 }}>
                        {formatMonth(comparison.strongest_month)}
                      </Box>
                      {' – '}
                      <Box component="span" sx={{ color: directionColor, fontWeight: 700 }}>
                        {Math.abs(comparison.strongest_month_difference_us_cm).toLocaleString()}{' '}
                        µS/cm
                      </Box>
                    </Typography>
                    <Box sx={{ display: 'grid', gap: 0.75, mt: 1 }}>
                      <Box
                        sx={{
                          alignItems: 'baseline',
                          display: 'grid',
                          gap: 1,
                          gridTemplateColumns: 'minmax(0, 1fr) auto',
                        }}
                      >
                        <Typography
                          component="p"
                          variant="captionSmall"
                          sx={{ color: palette.base[200] }}
                        >
                          Strongest rolling daily change
                        </Typography>
                        <Typography
                          component="p"
                          variant="captionSmall"
                          sx={{ color: directionColor, textAlign: 'right' }}
                        >
                          {formatDate(comparison.strongest_date)} ·{' '}
                          {Math.abs(comparison.strongest_rolling_difference_us_cm).toLocaleString()}{' '}
                          µS/cm
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          alignItems: 'baseline',
                          display: 'grid',
                          gap: 1,
                          gridTemplateColumns: 'minmax(0, 1fr) auto',
                        }}
                      >
                        <Typography
                          component="p"
                          variant="captionSmall"
                          sx={{ color: palette.base[200] }}
                        >
                          Days matching the regional trend
                        </Typography>
                        <Typography
                          component="p"
                          variant="captionSmall"
                          sx={{ color: palette.common.white, textAlign: 'right' }}
                        >
                          {directionalDays} of {comparison.paired_days} ·{' '}
                          {formatShare(comparison.directional_consistency)}%
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          alignItems: 'baseline',
                          display: 'grid',
                          gap: 1,
                          gridTemplateColumns: 'minmax(0, 1fr) auto',
                        }}
                      >
                        <Typography
                          component="p"
                          variant="captionSmall"
                          sx={{ color: palette.base[200] }}
                        >
                          Station-months matching the trend
                        </Typography>
                        <Typography
                          component="p"
                          variant="captionSmall"
                          sx={{ color: palette.common.white, textAlign: 'right' }}
                        >
                          {agreeingStationMonths} of {stationMonthTotal} ·{' '}
                          {formatShare(comparison.station_agreement)}%
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Typography
                    component="p"
                    variant="captionSmall"
                    sx={{
                      borderTop: `1px solid ${palette.base[500]}`,
                      color: palette.base[200],
                      mt: 1.25,
                      pt: 1,
                    }}
                  >
                    {comparison.coverage_note}
                  </Typography>
                  <Box
                    sx={{
                      alignItems: 'center',
                      color: palette.brand.primaryGreen,
                      display: 'flex',
                      gap: 0.75,
                      mt: 1,
                    }}
                  >
                    <ShowChartRoundedIcon fontSize="small" />
                    <Typography variant="captionSmall" sx={{ color: 'inherit', fontWeight: 700 }}>
                      View daily deviation
                    </Typography>
                  </Box>
                </Box>
              )
            })}
          </Stack>
        </Box>
      </Box>
      <ComparisonTimeSeriesDialog
        comparison={chartComparison}
        onClose={() => setChartComparison(null)}
      />
    </>
  )
}

function ComparisonMarkerLayer({
  scenario,
  filter,
  focusedReportId,
  onHoveredPlaceChange,
  onSelectedRegionChange,
}: {
  scenario: RegionalScenario
  filter: ComparisonFilter
  focusedReportId: string | null
  onHoveredPlaceChange: (place: string | null) => void
  onSelectedRegionChange: (region: SelectedRegionTimeline | null) => void
}) {
  const { current: map } = useMap()
  const [places, setPlaces] = useState<ComparisonPlace[]>([])
  const [selectedPlace, setSelectedPlace] = useState<ComparisonPlace | null>(null)

  useEffect(() => {
    if (!map) return

    const panelWidth = selectedPlace
      ? Math.min(window.innerWidth < 600 ? 340 : 420, window.innerWidth - 32)
      : 0

    map.easeTo({
      ...(selectedPlace
        ? { center: [selectedPlace.longitude, selectedPlace.latitude] as [number, number] }
        : {}),
      duration: 320,
      padding: { bottom: 0, left: panelWidth, right: 0, top: 0 },
    })
  }, [map, selectedPlace])

  const filteredPlaces = useMemo(
    () =>
      places.flatMap((place) => {
        const comparisons = place.comparisons
          .filter(
            (comparison) =>
              comparison.scenario === scenario &&
              comparison.comparison_scenario === 'Business as Usual',
          )
          .filter((comparison) => {
            const comparisonStart = comparison.start_date.slice(0, 7)
            const comparisonEnd = comparison.end_date.slice(0, 7)
            if (filter.startMonth && comparisonEnd < filter.startMonth) return false
            if (filter.endMonth && comparisonStart >= filter.endMonth) return false
            const passesUs = Math.abs(comparison.difference_us_cm) >= filter.minimumUsCm
            const passesPercent = Math.abs(comparison.difference_percent) >= filter.minimumPercent
            if (!filter.showUsCm && !filter.showPercent) return true
            if (!filter.showUsCm) return passesPercent
            if (!filter.showPercent) return passesUs
            return filter.mode === 'either' ? passesUs || passesPercent : passesUs && passesPercent
          })
          .map((comparison) => ({
            ...comparison,
            is_strongest_signal: Math.abs(comparison.strongest_rolling_difference_us_cm) > 700,
          }))
          .sort(
            (a, b) =>
              b.directional_consistency - a.directional_consistency ||
              b.station_agreement - a.station_agreement ||
              a.start_date.localeCompare(b.start_date),
          )
        if (!comparisons.length) return []
        return [
          {
            ...place,
            comparisonCount: comparisons.length,
            strongestCount: comparisons.filter((comparison) => comparison.is_strongest_signal)
              .length,
            comparisons,
          },
        ]
      }),
    [filter, places, scenario],
  )

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setSelectedPlace(null)
      onHoveredPlaceChange(null)
      onSelectedRegionChange(null)
    }, 0)
    return () => window.clearTimeout(timeout)
  }, [filter, onHoveredPlaceChange, onSelectedRegionChange, scenario])

  useEffect(() => {
    const controller = new AbortController()
    fetch(DATA_URL, { signal: controller.signal })
      .then((response) => {
        if (!response.ok)
          throw new Error(`Unable to load scenario comparisons (${response.status})`)
        return response.json() as Promise<ComparisonPayload>
      })
      .then((payload) => setPlaces(payload.places))
      .catch((error: unknown) => {
        if (!(error instanceof DOMException && error.name === 'AbortError')) {
          console.error(error)
        }
      })
    return () => controller.abort()
  }, [])

  return (
    <>
      {filteredPlaces.map((place) => (
        <Marker
          anchor="center"
          key={place.name}
          latitude={place.latitude}
          longitude={place.longitude}
        >
          <span
            className={`comparison-marker-shell${selectedPlace?.name === place.name ? ' comparison-marker-shell--selected' : ''}`}
          >
            <button
              aria-label={`${place.name}: ${place.comparisonCount} comparisons with Business as Usual${place.strongestCount ? `, including ${place.strongestCount} strongest signal periods` : ''}. Click to open details.`}
              aria-pressed={selectedPlace?.name === place.name}
              className={`comparison-marker${place.strongestCount ? ' comparison-marker--strongest' : ''}`}
              onClick={(event) => {
                event.stopPropagation()
                onHoveredPlaceChange(place.name)
                onSelectedRegionChange({
                  place: place.name,
                  periods: place.comparisons.map((comparison) => ({
                    comparisonId: comparison.comparison_id,
                    direction: comparison.direction,
                    endDate: comparison.end_date,
                    place: comparison.place,
                    startDate: comparison.start_date,
                  })),
                })
                setSelectedPlace(place)
              }}
              onMouseEnter={() => onHoveredPlaceChange(place.name)}
              onMouseLeave={() => {
                if (selectedPlace?.name !== place.name) onHoveredPlaceChange(null)
              }}
              onFocus={() => onHoveredPlaceChange(place.name)}
              onBlur={() => {
                if (selectedPlace?.name !== place.name) onHoveredPlaceChange(null)
              }}
              type="button"
            >
              <span>{place.comparisonCount}</span>
            </button>
            <span aria-hidden="true" className="comparison-marker__label">
              {place.name}
            </span>
          </span>
        </Marker>
      ))}
      <AnimatePresence>
        {selectedPlace && (
          <ComparisonPanel
            focusedReportId={focusedReportId}
            key={selectedPlace.name}
            onClose={() => {
              onHoveredPlaceChange(null)
              onSelectedRegionChange(null)
              setSelectedPlace(null)
            }}
            place={selectedPlace}
          />
        )}
      </AnimatePresence>
    </>
  )
}

export default ComparisonMarkerLayer
