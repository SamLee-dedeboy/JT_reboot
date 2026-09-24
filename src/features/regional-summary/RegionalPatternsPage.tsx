import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { Box, Button, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Layer, Marker, Source, type LayerProps } from 'react-map-gl/mapbox'
import BaseMap from '../../map/BaseMap'
import { assetUrl } from '../../utils/baseUrl'
import type { ScenarioContent } from '../scenarios/content/scenarioContent'
import { SCENARIO_EXPLORER_MAP_STYLE } from '../scenario-explorer/mapConfig'
import {
  type PatternEvidence,
  type PatternStationEvidence,
  usePatternEvidence,
} from './regionalPatternEvidence'
import type { RegionalPattern, RegionalPlace } from './regionalSummaryData'
import {
  regionalSummaryControlStyles,
  regionalSummarySizing,
  regionalSummaryTypography,
} from './regionalSummaryStyles'

interface Props {
  scenario: ScenarioContent
  place: RegionalPlace
  places: RegionalPlace[]
  onPlaceChange: (place: RegionalPlace) => void
  onBack: () => void
}

interface EventSeries {
  dates: string[]
  baseline: Array<number | null>
  scenario: Array<number | null>
  scenarioMin: Array<number | null>
  scenarioMax: Array<number | null>
}

type EventSeriesDataset = Record<string, EventSeries>

const simulationStart = Date.parse('2018-10-01T00:00:00Z')
const simulationEnd = Date.parse('2020-11-29T00:00:00Z')
const simulationDuration = simulationEnd - simulationStart
const valueFormat = new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 })
const quarterTicks = [
  ['2018-10-01', 'Oct 2018'],
  ['2019-01-01', 'Jan 2019'],
  ['2019-04-01', 'Apr 2019'],
  ['2019-07-01', 'Jul 2019'],
  ['2019-10-01', 'Oct 2019'],
  ['2020-01-01', 'Jan 2020'],
  ['2020-04-01', 'Apr 2020'],
  ['2020-07-01', 'Jul 2020'],
  ['2020-10-01', 'Oct 2020'],
] as const

const illustrativeActions = [
  { id: 'action-2018', startDate: '2018-10-17', endDate: '2018-12-15', label: 'Gates closed' },
  { id: 'action-2019', startDate: '2019-01-01', endDate: '2019-03-01', label: 'Gates closed' },
  { id: 'action-2020', startDate: '2020-09-30', endDate: '2020-11-28', label: 'Gates closed' },
]

function datedEvents(place: RegionalPlace) {
  return place.patterns
    .filter(
      (pattern) =>
        pattern.startDate && pattern.endDate && pattern.candidateType !== 'threshold_consequence',
    )
    .toSorted((left, right) => (left.startDate ?? '').localeCompare(right.startDate ?? ''))
}

function datePosition(date: string) {
  const value = Date.parse(`${date}T00:00:00Z`)
  return Math.min(100, Math.max(0, ((value - simulationStart) / simulationDuration) * 100))
}

function eventPlacement(pattern: RegionalPattern) {
  const left = datePosition(pattern.startDate as string)
  return { left, width: Math.max(0.7, datePosition(pattern.endDate as string) - left) }
}

function dateLabel(date: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00Z`))
}

export default function RegionalPatternsPage({
  scenario,
  place,
  places,
  onPlaceChange,
  onBack,
}: Props) {
  const evidence = usePatternEvidence()
  const [eventSeries, setEventSeries] = useState<EventSeriesDataset>({})
  const [activePlace, setActivePlace] = useState(place)
  const [selectedPattern, setSelectedPattern] = useState<RegionalPattern | null>(null)
  const events = useMemo(() => datedEvents(activePlace), [activePlace])

  useEffect(() => {
    const controller = new AbortController()
    fetch(assetUrl('/data/regional-summary/pattern-ec-series-7d.json'), {
      signal: controller.signal,
    })
      .then((response) => response.json() as Promise<EventSeriesDataset>)
      .then(setEventSeries)
      .catch(() => setEventSeries({}))
    return () => controller.abort()
  }, [])

  const selectedEvidence = selectedPattern ? evidence?.patterns[selectedPattern.id] : undefined
  const selectedSeries = selectedPattern ? eventSeries[selectedPattern.id] : undefined

  return (
    <Box sx={{ height: '100dvh', bgcolor: 'base.900', color: 'common.white', overflow: 'hidden' }}>
      <Box
        component="header"
        sx={{
          height: regionalSummarySizing.headerHeight,
          px: regionalSummarySizing.pageInset,
          display: 'grid',
          gridTemplateColumns: 'auto minmax(0, 1fr) auto',
          alignItems: 'center',
          gap: regionalSummarySizing.sectionGap,
          borderBottom: 1,
          borderColor: 'translucent.primaryGreen',
        }}
      >
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
          sx={{
            ...regionalSummaryControlStyles.primaryTouchButton,
            color: 'common.white',
            borderColor: 'primary.main',
          }}
        >
          Map
        </Button>
        <Box>
          <Typography sx={{ ...regionalSummaryTypography.scenarioNumber, color: 'primary.main' }}>
            {scenario.title}
          </Typography>
          <Typography
            component="h1"
            sx={{
              ...regionalSummaryTypography.regionTitle,
              mt: 0.5,
            }}
          >
            {activePlace.name}
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'right', display: { xs: 'none', md: 'block' } }}>
          <Typography sx={regionalSummaryTypography.pagePrompt}>
            Regional pattern evidence
          </Typography>
          <Typography sx={{ ...regionalSummaryTypography.instruction, color: 'base.100' }}>
            Tap an event or comparison row to inspect it
          </Typography>
        </Box>
      </Box>

      <Box
        component="main"
        sx={{
          height: regionalSummarySizing.contentHeight,
          width: '90dvw',
          mx: 'auto',
          overflow: 'hidden',
          py: '1.5dvh',
          display: 'grid',
          gridTemplateRows: '35dvh 8dvh 19dvh minmax(0, 1fr)',
          gap: '1dvh',
        }}
      >
        <Box
          sx={{
            height: '100%',
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: 'minmax(0, 2fr) minmax(250px, 0.9fr) minmax(250px, 0.9fr)',
            },
            gap: 2,
          }}
        >
          <EvidencePanel title="Regional EC during selected event">
            {selectedPattern && selectedSeries ? (
              <RegionalEcChart pattern={selectedPattern} series={selectedSeries} />
            ) : (
              <EmptyEvidence text="Select a dated event to display its regional EC response." />
            )}
          </EvidencePanel>
          <EvidencePanel title="EC deviation across stations">
            {selectedEvidence?.stationEvidence.stations.length ? (
              <StationDistribution stations={selectedEvidence.stationEvidence.stations} />
            ) : (
              <EmptyEvidence text="Station evidence is not available for this event yet." />
            )}
          </EvidencePanel>
          <EvidencePanel title="Stations within the region">
            {selectedEvidence?.stationEvidence.stations.length ? (
              <StationMap
                place={activePlace}
                stations={selectedEvidence.stationEvidence.stations}
              />
            ) : (
              <EmptyEvidence text="Station locations are not available for this event yet." />
            )}
          </EvidencePanel>
        </Box>

        <Box sx={{ minHeight: 0 }}>
          {selectedPattern ? (
            <InterpretationCard pattern={selectedPattern} evidence={selectedEvidence} />
          ) : (
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                borderLeft: 4,
                borderColor: 'base.600',
                bgcolor: 'base.800',
                px: 2,
              }}
            >
              <Typography sx={{ ...regionalSummaryTypography.instruction, color: 'base.200' }}>
                Tap an event on the timeline to see its interpretation.
              </Typography>
            </Box>
          )}
        </Box>

        <Box sx={{ minHeight: 0 }}>
          <Timeline
            events={events}
            selectedPattern={selectedPattern}
            onSelect={setSelectedPattern}
          />
        </Box>

        <Box sx={{ minHeight: 0, overflow: 'hidden' }}>
          <Typography sx={{ ...regionalSummaryTypography.pagePrompt, mb: 0.5 }}>
            Compare regions
          </Typography>
          <Box sx={{ display: 'grid', gap: 0.25 }}>
            {places.map((candidate) => (
              <ComparisonRow
                key={candidate.id}
                place={candidate}
                active={candidate.id === activePlace.id}
                onSelect={() => {
                  if (candidate.id !== activePlace.id) {
                    setActivePlace(candidate)
                    onPlaceChange(candidate)
                  }
                  setSelectedPattern(null)
                }}
              />
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

function EvidencePanel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Box
      sx={{
        minWidth: 0,
        minHeight: 0,
        overflow: 'hidden',
        display: 'grid',
        gridTemplateRows: 'auto minmax(0, 1fr)',
        borderTop: 1,
        borderColor: 'base.700',
        pt: 1.25,
      }}
    >
      <Typography sx={{ ...regionalSummaryTypography.pagePrompt, color: 'common.white', mb: 1 }}>
        {title}
      </Typography>
      {children}
    </Box>
  )
}

function EmptyEvidence({ text }: { text: string }) {
  return (
    <Box
      sx={{ display: 'grid', placeItems: 'center', color: 'base.200', px: 3, textAlign: 'center' }}
    >
      <Typography sx={regionalSummaryTypography.instruction}>{text}</Typography>
    </Box>
  )
}

function RegionalEcChart({ pattern, series }: { pattern: RegionalPattern; series: EventSeries }) {
  const theme = useTheme()
  const values = [...series.baseline, ...series.scenario].filter(
    (value): value is number => value != null,
  )
  if (!values.length) return null
  const plot = { left: 72, right: 720, top: 28, bottom: 260 }
  const max = Math.max(1, ...values) * 1.08
  const x = (index: number) =>
    plot.left + (index / Math.max(1, series.dates.length - 1)) * (plot.right - plot.left)
  const y = (value: number) => plot.bottom - (value / max) * (plot.bottom - plot.top)
  const path = (data: Array<number | null>) =>
    data
      .map((value, index) =>
        value == null
          ? ''
          : `${index === 0 || data[index - 1] == null ? 'M' : 'L'}${x(index)},${y(value)}`,
      )
      .filter(Boolean)
      .join(' ')
  const color =
    pattern.direction === 'fresher' ? theme.palette.salinity.teal : theme.palette.salinity.pink
  const ticks = [0, max / 2, max]
  const dateIndexes = [0, Math.floor((series.dates.length - 1) / 2), series.dates.length - 1]
  return (
    <Box sx={{ minHeight: 0, position: 'relative' }}>
      <Box sx={{ position: 'absolute', right: 1, top: 0, display: 'flex', gap: 2, zIndex: 1 }}>
        <Typography sx={{ ...regionalSummaryTypography.instruction, color: 'common.white' }}>
          — Baseline
        </Typography>
        <Typography sx={{ ...regionalSummaryTypography.instruction, color }}>— Scenario</Typography>
      </Box>
      <svg
        role="img"
        aria-label="Regional baseline and scenario electrical conductivity"
        viewBox="0 0 760 310"
        width="100%"
        height="100%"
        preserveAspectRatio="none"
      >
        {ticks.map((tick) => (
          <g key={tick}>
            <line
              x1={plot.left}
              x2={plot.right}
              y1={y(tick)}
              y2={y(tick)}
              stroke={theme.palette.base[700]}
              strokeDasharray="3 5"
            />
            <text
              x={plot.left - 10}
              y={y(tick) + 5}
              fill={theme.palette.base[100]}
              fontSize={regionalSummarySizing.chartAxisFontSize}
              textAnchor="end"
            >
              {valueFormat.format(tick)}
            </text>
          </g>
        ))}
        {dateIndexes.map((index) => (
          <text
            key={index}
            x={x(index)}
            y={plot.bottom + 28}
            fill={theme.palette.base[100]}
            fontSize={regionalSummarySizing.chartAxisFontSize}
            textAnchor="middle"
          >
            {dateLabel(series.dates[index])}
          </text>
        ))}
        <line
          x1={plot.left}
          x2={plot.left}
          y1={plot.top}
          y2={plot.bottom}
          stroke="white"
          strokeWidth="1.5"
        />
        <line
          x1={plot.left}
          x2={plot.right}
          y1={plot.bottom}
          y2={plot.bottom}
          stroke="white"
          strokeWidth="1.5"
        />
        <text
          x="18"
          y="150"
          fill="white"
          fontSize={regionalSummarySizing.chartAxisFontSize}
          textAnchor="middle"
          transform="rotate(-90 18 150)"
        >
          EC (µS/cm)
        </text>
        <path
          d={path(series.baseline)}
          fill="none"
          stroke="white"
          strokeWidth="2.5"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d={path(series.scenario)}
          fill="none"
          stroke={color}
          strokeWidth="3.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </Box>
  )
}

function StationDistribution({ stations }: { stations: PatternStationEvidence[] }) {
  const theme = useTheme()
  const values = stations.map((station) => station.differencePct ?? 0)
  const minimum = Math.min(...values, 0)
  const maximum = Math.max(...values, 0)
  const y = (value: number) => 24 + ((maximum - value) / Math.max(1, maximum - minimum)) * 226
  const placed: Array<{ station: PatternStationEvidence; x: number; y: number }> = []
  ;[...stations]
    .sort((left, right) => (left.differencePct ?? 0) - (right.differencePct ?? 0))
    .forEach((station) => {
      const pointY = y(station.differencePct ?? 0)
      const candidates = [0, -9, 9, -18, 18, -27, 27, -36, 36]
      const offset =
        candidates.find((candidate) =>
          placed.every((point) => {
            const dx = 165 + candidate - point.x
            const dy = pointY - point.y
            return dx * dx + dy * dy >= 72
          }),
        ) ?? 0
      placed.push({ station, x: 165 + offset, y: pointY })
    })
  return (
    <svg
      role="img"
      aria-label="Distribution of station EC differences from baseline"
      viewBox="0 0 300 285"
      width="100%"
      height="100%"
    >
      <line x1="112" x2="218" y1={y(0)} y2={y(0)} stroke="white" strokeWidth="2" />
      <text
        x="104"
        y={y(0) - 7}
        fill="white"
        fontSize={regionalSummarySizing.chartAxisFontSize}
        textAnchor="end"
      >
        Business
      </text>
      <text
        x="104"
        y={y(0) + 9}
        fill="white"
        fontSize={regionalSummarySizing.chartAxisFontSize}
        textAnchor="end"
      >
        as usual
      </text>
      {placed.map(({ station, x, y: pointY }) => (
        <circle
          key={station.stationId}
          cx={x}
          cy={pointY}
          r="5"
          fill={
            station.differenceEc < 0 ? theme.palette.salinity.teal : theme.palette.salinity.pink
          }
        />
      ))}
      {[maximum, 0, minimum].map((label) => (
        <text
          key={label}
          x="96"
          y={y(label) + 5}
          fill={
            label > 0
              ? theme.palette.salinity.pink
              : label < 0
                ? theme.palette.salinity.teal
                : 'white'
          }
          fontSize={regionalSummarySizing.chartAxisFontSize}
          fontWeight="700"
          textAnchor="end"
        >
          {valueFormat.format(label)}%
        </text>
      ))}
    </svg>
  )
}

function StationMap({
  place,
  stations,
}: {
  place: RegionalPlace
  stations: PatternStationEvidence[]
}) {
  const theme = useTheme()
  const fillLayer: LayerProps = {
    id: `evidence-fill-${place.id}`,
    type: 'fill',
    paint: { 'fill-color': theme.palette.primary.main, 'fill-opacity': 0.12 },
  }
  const lineLayer: LayerProps = {
    id: `evidence-line-${place.id}`,
    type: 'line',
    paint: { 'line-color': theme.palette.primary.main, 'line-width': 2 },
  }
  return (
    <Box sx={{ minHeight: 0, overflow: 'hidden' }}>
      <BaseMap
        mapStyleUrl={SCENARIO_EXPLORER_MAP_STYLE}
        initialViewState={{
          longitude: place.coordinates[0],
          latitude: place.coordinates[1],
          zoom: place.id.includes('freshwater') ? 9.7 : 11.2,
        }}
        dragPan={false}
        scrollZoom={false}
        doubleClickZoom={false}
        touchZoomRotate={false}
        attributionControl={false}
        onMapReady={(map) => {
          const longitudes = stations.map((station) => station.longitude)
          const latitudes = stations.map((station) => station.latitude)
          map.fitBounds(
            [
              [Math.min(...longitudes), Math.min(...latitudes)],
              [Math.max(...longitudes), Math.max(...latitudes)],
            ],
            { padding: 34, maxZoom: 12, duration: 0 },
          )
        }}
      >
        {place.geometry ? (
          <Source
            id={`evidence-${place.id}`}
            type="geojson"
            data={{ type: 'Feature', properties: {}, geometry: place.geometry }}
          >
            <Layer {...fillLayer} />
            <Layer {...lineLayer} />
          </Source>
        ) : null}
        {stations.map((station) => (
          <Marker
            key={station.stationId}
            longitude={station.longitude}
            latitude={station.latitude}
            anchor="center"
          >
            <Box
              title={`${station.shortName || station.name}: ${valueFormat.format(station.differenceEc)} µS/cm`}
              sx={{
                width: 13,
                height: 13,
                borderRadius: '50%',
                bgcolor: station.differenceEc < 0 ? 'salinity.teal' : 'salinity.pink',
                border: 2,
                borderColor: 'common.white',
              }}
            />
          </Marker>
        ))}
      </BaseMap>
    </Box>
  )
}

function Timeline({
  events,
  selectedPattern,
  onSelect,
}: {
  events: RegionalPattern[]
  selectedPattern: RegionalPattern | null
  onSelect: (pattern: RegionalPattern) => void
}) {
  const theme = useTheme()
  return (
    <Box sx={{ position: 'relative', height: '100%', minHeight: 0 }}>
      <Box sx={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 28, display: 'flex' }}>
        <Box
          sx={{
            width: `${datePosition('2019-10-01')}%`,
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            borderLeft: 2,
            borderColor: 'primary.main',
            px: 1,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Typography sx={regionalSummaryTypography.timelineLabel}>Wet year</Typography>
        </Box>
        <Box
          sx={{
            width: `${datePosition('2020-10-01') - datePosition('2019-10-01')}%`,
            bgcolor: alpha(theme.palette.salinity.pink, 0.16),
            borderLeft: 2,
            borderColor: 'salinity.pink',
            px: 1,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Typography sx={regionalSummaryTypography.timelineLabel}>Dry year</Typography>
        </Box>
        <Box
          sx={{
            flex: 1,
            bgcolor: alpha(theme.palette.salinity.pink, 0.22),
            borderLeft: 2,
            borderRight: 2,
            borderColor: 'salinity.pink',
            px: 1,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Typography sx={regionalSummaryTypography.timelineLabel}>Critical dry year</Typography>
        </Box>
      </Box>
      {illustrativeActions.map((action) => {
        const left = datePosition(action.startDate)
        const width = datePosition(action.endDate) - left
        return (
          <Box
            key={action.id}
            sx={{
              position: 'absolute',
              left: `${left}%`,
              width: `${width}%`,
              minWidth: 76,
              top: 68,
              height: 18,
              px: 0.75,
              display: 'flex',
              alignItems: 'center',
              bgcolor: 'brand.primaryBlue',
              color: 'base.900',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
            }}
          >
            <Typography sx={{ ...regionalSummaryTypography.timelineLabel, fontWeight: 800 }}>
              Illustrative: {action.label}
            </Typography>
          </Box>
        )
      })}
      <Box
        sx={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 14,
          height: 3,
          bgcolor: 'common.white',
        }}
      />
      {quarterTicks.map(([date, label]) => (
        <Box
          key={date}
          sx={{
            position: 'absolute',
            left: `${datePosition(date)}%`,
            top: 6,
            transform: 'translateX(-50%)',
            textAlign: 'center',
          }}
        >
          <Box sx={{ width: 2, height: 16, bgcolor: 'common.white', mx: 'auto' }} />
          <Typography
            sx={{
              ...regionalSummaryTypography.instruction,
              ...regionalSummaryTypography.timelineLabel,
              color: 'base.100',
              mt: 0.5,
              whiteSpace: 'nowrap',
            }}
          >
            {label}
          </Typography>
        </Box>
      ))}
      {events.map((pattern, index) => {
        const placement = eventPlacement(pattern)
        const color = pattern.direction === 'fresher' ? 'salinity.teal' : 'salinity.pink'
        const glowColor =
          pattern.direction === 'fresher'
            ? theme.palette.salinity.teal
            : theme.palette.salinity.pink
        return (
          <Button
            key={pattern.id}
            onClick={() => onSelect(pattern)}
            aria-pressed={selectedPattern?.id === pattern.id}
            sx={{
              position: 'absolute',
              left: `${placement.left}%`,
              width: `${placement.width}%`,
              minWidth: 8,
              top: 10 + index * 7,
              height: 8,
              p: 0,
              borderRadius: 0,
              bgcolor: color,
              boxShadow:
                selectedPattern?.id === pattern.id
                  ? `0 0 12px 4px ${alpha(glowColor, 0.72)}`
                  : 'none',
              '&:hover, &:focus-visible': {
                bgcolor: color,
                boxShadow: `0 0 12px 4px ${alpha(glowColor, 0.72)}`,
              },
            }}
          />
        )
      })}
      {selectedPattern ? (
        <Typography
          sx={{
            ...regionalSummaryTypography.instruction,
            position: 'absolute',
            left: `${eventPlacement(selectedPattern).left}%`,
            top: 43,
            pl: 0.75,
            borderLeft: 2,
            borderColor:
              selectedPattern.direction === 'fresher' ? 'salinity.teal' : 'salinity.pink',
            color: 'common.white',
            ...regionalSummaryTypography.timelineLabel,
            fontWeight: 700,
            whiteSpace: 'nowrap',
          }}
        >
          {selectedPattern.durationDays ?? 'Detected'} days ·{' '}
          {selectedPattern.direction === 'fresher' ? 'fresher' : 'saltier'} ·{' '}
          {selectedPattern.differencePct == null
            ? 'change under review'
            : `${selectedPattern.differencePct > 0 ? '+' : ''}${valueFormat.format(selectedPattern.differencePct)}% from baseline`}
        </Typography>
      ) : null}
    </Box>
  )
}

function InterpretationCard({
  pattern,
  evidence,
}: {
  pattern: RegionalPattern
  evidence?: PatternEvidence
}) {
  const color = pattern.direction === 'fresher' ? 'salinity.teal' : 'salinity.pink'
  return (
    <Box
      sx={{
        mt: 0,
        height: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden',
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'minmax(240px, 0.6fr) minmax(0, 1.4fr)' },
        gap: 2,
        borderLeft: 4,
        borderColor: color,
        bgcolor: 'base.800',
        px: 2,
        py: 1,
      }}
    >
      <Box>
        <Typography sx={{ ...regionalSummaryTypography.scenarioNumber, color }}>
          Event interpretation
        </Typography>
        <Typography sx={{ ...regionalSummaryTypography.pagePrompt, mt: 0.25 }}>
          {evidence?.narrative.headline ??
            `${pattern.durationDays ?? 'Detected'} day salinity event`}
        </Typography>
      </Box>
      <Box>
        <Typography sx={{ ...regionalSummaryTypography.instruction, color: 'common.white' }}>
          {evidence?.narrative.description ?? pattern.reviewNote}
        </Typography>
        <Typography sx={{ ...regionalSummaryTypography.instruction, color: 'base.200', mt: 0.4 }}>
          {dateLabel(pattern.startDate as string)}–{dateLabel(pattern.endDate as string)} ·{' '}
          {pattern.differenceEc == null
            ? 'Change pending'
            : `${pattern.differenceEc > 0 ? '+' : ''}${valueFormat.format(pattern.differenceEc)} µS/cm`}{' '}
          · {evidence?.stationEvidence.stationCount ?? pattern.stationCount ?? '—'} stations
        </Typography>
        {evidence?.narrative.reviewStatus === 'needs-review' ? (
          <Typography
            sx={{ ...regionalSummaryTypography.instruction, color: 'primary.main', mt: 0.25 }}
          >
            Generated interpretation — ready for editorial review
          </Typography>
        ) : null}
      </Box>
    </Box>
  )
}

function ComparisonRow({
  place,
  active,
  onSelect,
}: {
  place: RegionalPlace
  active: boolean
  onSelect: () => void
}) {
  const events = datedEvents(place)
  return (
    <Box
      component="button"
      type="button"
      onClick={onSelect}
      sx={{
        minHeight: 34,
        width: '100%',
        display: 'grid',
        gridTemplateColumns: 'minmax(190px, 0.24fr) minmax(0, 1fr)',
        alignItems: 'center',
        gap: 2,
        bgcolor: active ? 'base.800' : 'transparent',
        px: 1,
        borderLeft: 3,
        borderTop: 0,
        borderRight: 0,
        borderBottom: 0,
        borderColor: active ? 'primary.main' : 'base.700',
        color: 'inherit',
        cursor: 'pointer',
        textAlign: 'left',
        '&:hover, &:focus-visible': { bgcolor: 'base.800' },
      }}
    >
      <Typography
        sx={{
          ...regionalSummaryTypography.action,
          color: active ? 'primary.main' : 'common.white',
        }}
      >
        {place.name}
      </Typography>
      <Box sx={{ position: 'relative', height: 18, borderBottom: 1, borderColor: 'base.500' }}>
        {events.map((pattern) => {
          const placement = eventPlacement(pattern)
          const color = pattern.direction === 'fresher' ? 'salinity.teal' : 'salinity.pink'
          return (
            <Box
              key={pattern.id}
              sx={{
                position: 'absolute',
                left: `${placement.left}%`,
                width: `${placement.width}%`,
                minWidth: 8,
                height: 10,
                bottom: -5,
                bgcolor: color,
              }}
            />
          )
        })}
      </Box>
    </Box>
  )
}
