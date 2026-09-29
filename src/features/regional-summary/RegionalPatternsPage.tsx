import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import HelpIcon from '@mui/icons-material/Help'
import { Box, Button, Typography } from '@mui/material'
import { alpha, lighten, useTheme, type Theme } from '@mui/material/styles'
import { motion, useReducedMotion } from 'framer-motion'
import type { Map as MapboxMap } from 'mapbox-gl'
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Layer, Marker, Source, type LayerProps } from 'react-map-gl/mapbox'
import BaseMap from '../../map/BaseMap'
import { assetUrl } from '../../utils/baseUrl'
import type { ScenarioContent } from '../scenarios/content/scenarioContent'
import { SCENARIO_EXPLORER_MAP_STYLE } from '../scenario-explorer/mapConfig'
import { createOfflineBasemapStyle, isOfflineMapEnabled } from '../../map/offlineBasemapStyle'
import {
  type PatternEvidence,
  type PatternStationEvidence,
  usePatternEvidence,
} from './regionalPatternEvidence'
import { regionalPatternIds, registerRegionalPolygonPatterns } from './regionalPolygonPatterns'
import { getRegionalTimelineContextPeriods } from './regionalTimelineContext'
import { excludedRegionalPatternIds } from './regionalPlaceContent'
import type { RegionalPattern, RegionalPlace } from './regionalSummaryData'
import {
  regionalSummaryControlStyles,
  regionalSummaryDetailGrid,
  regionalSummaryDetailTypography,
  regionalSummarySizing,
  regionalSummaryTimelineStyles,
} from './regionalSummaryStyles'
import RegionalPatternsTutorial from './RegionalPatternsTutorial'

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

const valueFormat = new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 })
const defaultQuarterTicks = [
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

const outflowQuarterTicks = [
  ['2020-08-01', 'Aug 2020'],
  ['2020-10-01', 'Oct 2020'],
  ['2021-01-01', 'Jan 2021'],
  ['2021-04-01', 'Apr 2021'],
  ['2021-07-01', 'Jul 2021'],
  ['2021-10-01', 'Oct 2021'],
  ['2022-01-01', 'Jan 2022'],
] as const

interface TimelineDomain {
  start: number
  end: number
  ticks: readonly (readonly [string, string])[]
  isOutflowComparison: boolean
}

function timelineDomain(scenarioSlug: string): TimelineDomain {
  const isOutflowComparison = scenarioSlug === 'alternative-delta-outflows'
  return {
    start: Date.parse(isOutflowComparison ? '2020-08-01T00:00:00Z' : '2018-10-01T00:00:00Z'),
    end: Date.parse(isOutflowComparison ? '2022-01-01T00:00:00Z' : '2020-11-29T00:00:00Z'),
    ticks: isOutflowComparison ? outflowQuarterTicks : defaultQuarterTicks,
    isOutflowComparison,
  }
}

function datedEvents(place: RegionalPlace) {
  return place.patterns
    .filter(
      (pattern) =>
        pattern.startDate &&
        pattern.endDate &&
        pattern.candidateType !== 'threshold_consequence' &&
        !excludedRegionalPatternIds.has(pattern.id),
    )
    .toSorted((left, right) => (left.startDate ?? '').localeCompare(right.startDate ?? ''))
}

function datePosition(date: string, domain: TimelineDomain) {
  const value = Date.parse(`${date}T00:00:00Z`)
  return Math.min(100, Math.max(0, ((value - domain.start) / (domain.end - domain.start)) * 100))
}

function eventPlacement(pattern: RegionalPattern, domain: TimelineDomain) {
  const left = datePosition(pattern.startDate as string, domain)
  return {
    left,
    width: Math.max(0.7, datePosition(pattern.endDate as string, domain) - left),
  }
}

function dateLabel(date: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00Z`))
}

function stationValueColor(
  station: PatternStationEvidence,
  stations: PatternStationEvidence[],
  direction: RegionalPattern['direction'],
  theme: Theme,
) {
  const values = stations.map((candidate) => Math.abs(candidate.differencePct ?? 0))
  const maximum = Math.max(...values, 1)
  const intensity = Math.min(1, Math.abs(station.differencePct ?? 0) / maximum)
  const target = direction === 'fresher' ? theme.palette.salinity.teal : theme.palette.salinity.pink
  return lighten(target, 1 - intensity)
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
  const activePlace = place
  const [selectedPattern, setSelectedPattern] = useState<RegionalPattern | null>(null)
  const [selectedPatternPlaceId, setSelectedPatternPlaceId] = useState<string | null>(null)
  const [highlightedStationId, setHighlightedStationId] = useState<number | null>(null)
  const [tutorialOpen, setTutorialOpen] = useState(true)
  const events = useMemo(() => datedEvents(activePlace), [activePlace])
  const activePattern = selectedPatternPlaceId === activePlace.id ? selectedPattern : null

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

  const selectedEvidence = activePattern ? evidence?.patterns[activePattern.id] : undefined
  const selectedSeries = activePattern ? eventSeries[activePattern.id] : undefined
  const defaultMapStations = useMemo(
    () =>
      events
        .map((event) => evidence?.patterns[event.id]?.stationEvidence.stations)
        .find((stations) => stations?.length) ?? [],
    [events, evidence],
  )
  const mapStations = selectedEvidence?.stationEvidence.stations.length
    ? selectedEvidence.stationEvidence.stations
    : defaultMapStations

  return (
    <Box
      sx={{
        ...regionalSummaryDetailGrid.page,
        bgcolor: 'base.900',
        color: 'common.white',
      }}
    >
      <Box
        component="header"
        sx={{
          ...regionalSummaryDetailGrid.header,
          px: regionalSummarySizing.pageInset,
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
          Back to Map
        </Button>
        <Box data-tour="regional-pattern-header" sx={{ minWidth: 0 }}>
          <Typography sx={{ ...regionalSummaryDetailTypography.eyebrow, color: 'primary.main' }}>
            {scenario.title}
          </Typography>
          <Typography
            component="h1"
            sx={{
              ...regionalSummaryDetailTypography.title,
              mt: 0.5,
            }}
          >
            {activePlace.name}
          </Typography>
          <Typography sx={{ ...regionalSummaryDetailTypography.lead, color: 'base.100' }}>
            <Box component="span" sx={{ color: 'primary.main', fontWeight: 800 }}>
              Tap
            </Box>{' '}
            an event to inspect its evidence.{' '}
            <Box component="span" sx={{ color: 'primary.main', fontWeight: 800 }}>
              Tap
            </Box>{' '}
            another region to explore its patterns. For deeper analysis, visit the Salinity
            Difference Explorer on the nearby screens.
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<HelpIcon />}
          onClick={() => setTutorialOpen(true)}
          sx={{
            ...regionalSummaryControlStyles.primaryTouchButton,
            color: 'common.white',
            borderColor: 'primary.main',
            justifySelf: 'end',
          }}
        >
          Tutorial
        </Button>
      </Box>

      <RegionalPatternsTutorial open={tutorialOpen} onClose={() => setTutorialOpen(false)} />

      <Box
        component="main"
        sx={{
          ...regionalSummaryDetailGrid.detail,
          width: '90dvw',
          mx: 'auto',
          overflow: 'hidden',
          py: '1.5dvh',
        }}
      >
        <Box data-tour="regional-pattern-timeline" sx={regionalSummaryDetailGrid.timeline}>
          <Typography sx={{ ...regionalSummaryDetailTypography.sectionTitle, mb: 0.5 }}>
            Salinity Pattern Timeline
          </Typography>
          <Box sx={{ minHeight: 0 }}>
            <Timeline
              scenarioSlug={scenario.slug}
              events={events}
              selectedPattern={activePattern}
              onSelect={(pattern) => {
                setSelectedPattern(pattern)
                setSelectedPatternPlaceId(activePlace.id)
              }}
            />
          </Box>
        </Box>

        <Box sx={regionalSummaryDetailGrid.workspace}>
          <Box data-tour="regional-pattern-map" sx={regionalSummaryDetailGrid.map}>
            <EvidencePanel title="Stations within the Region">
              <StationMap
                key={activePlace.id}
                place={activePlace}
                stations={mapStations}
                selectedDirection={activePattern?.direction ?? null}
                highlightedStationId={highlightedStationId}
                onHighlightStation={setHighlightedStationId}
              />
            </EvidencePanel>
          </Box>

          <Box data-tour="regional-pattern-details" sx={regionalSummaryDetailGrid.patternDetails}>
            {activePattern ? (
              <>
                <Box sx={regionalSummaryDetailGrid.charts}>
                  <EvidencePanel title="Regional Salinity Change Over Time">
                    {selectedSeries ? (
                      <RegionalEcChart
                        key={activePattern.id}
                        pattern={activePattern}
                        series={selectedSeries}
                      />
                    ) : (
                      <EmptyEvidence text="Regional EC series unavailable." />
                    )}
                  </EvidencePanel>
                  <EvidencePanel title="Salinity Deviation across Stations">
                    {selectedEvidence?.stationEvidence.stations.length ? (
                      <StationDistribution
                        key={activePattern.id}
                        stations={selectedEvidence.stationEvidence.stations}
                        direction={activePattern.direction}
                        highlightedStationId={highlightedStationId}
                        onHighlightStation={setHighlightedStationId}
                      />
                    ) : (
                      <EmptyEvidence text="Station evidence unavailable." />
                    )}
                  </EvidencePanel>
                </Box>
                <Box sx={regionalSummaryDetailGrid.interpretation}>
                  <InterpretationCard
                    key={activePattern.id}
                    scenarioTitle={scenario.title}
                    placeName={activePlace.name}
                    pattern={activePattern}
                    evidence={selectedEvidence}
                  />
                </Box>
              </>
            ) : (
              <Box
                sx={{
                  gridRow: '1 / -1',
                  display: 'grid',
                  placeItems: 'center',
                  bgcolor: 'base.800',
                  px: regionalSummarySizing.surfacePadding,
                }}
              >
                <Typography sx={{ ...regionalSummaryDetailTypography.lead, color: 'base.200' }}>
                  Select a pattern to see its details
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        <Box data-tour="regional-pattern-regions" sx={regionalSummaryDetailGrid.regions}>
          <Typography sx={{ ...regionalSummaryDetailTypography.sectionTitle, mb: 0.5 }}>
            Explore Other Regions
          </Typography>
          <Box sx={{ display: 'grid', gap: 0.25 }}>
            {places.map((candidate) => (
              <ComparisonRow
                key={candidate.id}
                scenarioSlug={scenario.slug}
                place={candidate}
                active={candidate.id === activePlace.id}
                onSelect={() => {
                  if (candidate.id !== activePlace.id) {
                    onPlaceChange(candidate)
                  }
                  setSelectedPattern(null)
                  setSelectedPatternPlaceId(null)
                  setHighlightedStationId(null)
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
        width: '100%',
        height: '100%',
        minWidth: 0,
        minHeight: 0,
        overflow: 'hidden',
        display: 'grid',
        gridTemplateRows: 'auto minmax(0, 1fr)',
        pt: 1.25,
      }}
    >
      <Typography
        sx={{ ...regionalSummaryDetailTypography.sectionTitle, color: 'common.white', mb: 1 }}
      >
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
      <Typography sx={regionalSummaryDetailTypography.body}>{text}</Typography>
    </Box>
  )
}

function RegionalEcChart({ pattern, series }: { pattern: RegionalPattern; series: EventSeries }) {
  const theme = useTheme()
  const eventStart = pattern.startDate ? Date.parse(`${pattern.startDate}T00:00:00Z`) : -Infinity
  const eventEnd = pattern.endDate ? Date.parse(`${pattern.endDate}T23:59:59Z`) : Infinity
  const eventIndexes = series.dates.reduce<number[]>((indexes, date, index) => {
    const timestamp = Date.parse(`${date}T00:00:00Z`)
    if (timestamp >= eventStart && timestamp <= eventEnd) indexes.push(index)
    return indexes
  }, [])
  const windowIndexes = eventIndexes.length ? eventIndexes : series.dates.map((_, index) => index)
  const firstPopulated = windowIndexes.findIndex(
    (index) => series.baseline[index] != null && series.scenario[index] != null,
  )
  const lastPopulatedFromEnd = [...windowIndexes]
    .reverse()
    .findIndex((index) => series.baseline[index] != null && series.scenario[index] != null)
  const indexes =
    firstPopulated >= 0
      ? windowIndexes.slice(firstPopulated, windowIndexes.length - lastPopulatedFromEnd)
      : windowIndexes
  const eventSeries = {
    dates: indexes.map((index) => series.dates[index]),
    baseline: indexes.map((index) => series.baseline[index]),
    scenario: indexes.map((index) => series.scenario[index]),
  }
  const values = [...eventSeries.baseline, ...eventSeries.scenario].filter(
    (value): value is number => value != null,
  )
  if (!values.length) return null
  const plot = { left: 108, right: 730, top: 28, bottom: 260 }
  const max = Math.max(1, ...values) * 1.08
  const x = (index: number) =>
    plot.left + (index / Math.max(1, eventSeries.dates.length - 1)) * (plot.right - plot.left)
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
  const dateIndexes = [
    0,
    Math.floor((eventSeries.dates.length - 1) / 2),
    eventSeries.dates.length - 1,
  ]
  return (
    <Box sx={{ minHeight: 0, position: 'relative' }}>
      <Box sx={{ position: 'absolute', right: 1, top: 0, display: 'flex', gap: 2, zIndex: 1 }}>
        <Typography
          sx={{ ...regionalSummaryDetailTypography.timelineLabel, color: 'common.white' }}
        >
          — Baseline
        </Typography>
        <Typography sx={{ ...regionalSummaryDetailTypography.timelineLabel, color }}>
          — Scenario
        </Typography>
      </Box>
      <svg
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
            {dateLabel(eventSeries.dates[index])}
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
          x="24"
          y="150"
          fill="white"
          fontSize={regionalSummarySizing.chartAxisFontSize}
          textAnchor="middle"
          transform="rotate(-90 24 150)"
        >
          EC (µS/cm)
        </text>
        <path
          d={path(eventSeries.baseline)}
          fill="none"
          stroke="white"
          strokeWidth="2.5"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d={path(eventSeries.scenario)}
          fill="none"
          stroke={color}
          strokeWidth="3.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </Box>
  )
}

function StationDistribution({
  stations,
  direction,
  highlightedStationId,
  onHighlightStation,
}: {
  stations: PatternStationEvidence[]
  direction: RegionalPattern['direction']
  highlightedStationId: number | null
  onHighlightStation: (stationId: number | null) => void
}) {
  const theme = useTheme()
  const reduceMotion = useReducedMotion()
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
        x="230"
        y={y(0) - 7}
        fill="white"
        fontSize={regionalSummarySizing.chartAxisFontSize}
        textAnchor="start"
      >
        Business
      </text>
      <text
        x="230"
        y={y(0) + 9}
        fill="white"
        fontSize={regionalSummarySizing.chartAxisFontSize}
        textAnchor="start"
      >
        as usual
      </text>
      {placed.map(({ station, x, y: pointY }, index) => (
        <motion.circle
          key={station.stationId}
          cx={x}
          cy={pointY}
          r={highlightedStationId === station.stationId ? 10 : 7}
          fill={stationValueColor(station, stations, direction, theme)}
          stroke="white"
          strokeWidth={highlightedStationId === station.stationId ? 3 : 2}
          role="button"
          tabIndex={0}
          aria-label={`${station.shortName || station.name}: ${valueFormat.format(station.differencePct ?? 0)}% from baseline`}
          onMouseEnter={() => onHighlightStation(station.stationId)}
          onMouseLeave={() => onHighlightStation(null)}
          onFocus={() => onHighlightStation(station.stationId)}
          onBlur={() => onHighlightStation(null)}
          onClick={() =>
            onHighlightStation(
              highlightedStationId === station.stationId ? null : station.stationId,
            )
          }
          vectorEffect="non-scaling-stroke"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.25 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: reduceMotion ? 0 : 0.32,
            delay: reduceMotion ? 0 : index * 0.035,
          }}
          style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
        />
      ))}
      {[maximum, minimum].map((label) => (
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
  selectedDirection,
  highlightedStationId,
  onHighlightStation,
}: {
  place: RegionalPlace
  stations: PatternStationEvidence[]
  selectedDirection: RegionalPattern['direction'] | null
  highlightedStationId: number | null
  onHighlightStation: (stationId: number | null) => void
}) {
  const theme = useTheme()
  const mapRef = useRef<MapboxMap | null>(null)
  const [patternReady, setPatternReady] = useState(false)
  const offlineMapStyle = useMemo(
    () => (isOfflineMapEnabled() ? createOfflineBasemapStyle() : undefined),
    [],
  )
  const regionColor =
    place.trend === 'fresher'
      ? theme.palette.salinity.teal
      : place.trend === 'saltier'
        ? theme.palette.salinity.pink
        : place.trend === 'flipping'
          ? theme.palette.base[900]
          : theme.palette.base[100]
  const fillLayer: LayerProps = {
    id: `evidence-fill-${place.id}`,
    type: 'fill',
    paint: { 'fill-color': regionColor, 'fill-opacity': 0.4 },
  }
  const patternLayer: LayerProps = {
    id: `evidence-pattern-${place.id}`,
    type: 'fill',
    paint: {
      'fill-pattern': regionalPatternIds[place.trend],
      'fill-opacity': 0.76,
    },
  }
  const fitMapToRegion = useCallback(
    (map: MapboxMap) => {
      if (!stations.length) return
      const longitudes = stations.map((station) => station.longitude)
      const latitudes = stations.map((station) => station.latitude)
      map.fitBounds(
        [
          [Math.min(...longitudes), Math.min(...latitudes)],
          [Math.max(...longitudes), Math.max(...latitudes)],
        ],
        { padding: 34, maxZoom: 12, duration: 0 },
      )
      map.setZoom(Math.max(7.5, map.getZoom() - 0.8))
    },
    [stations],
  )

  useEffect(() => {
    if (mapRef.current) fitMapToRegion(mapRef.current)
  }, [fitMapToRegion, place.id])

  const colorScaleStations = stations
  return (
    <Box sx={{ width: '100%', height: '100%', minHeight: 0, overflow: 'hidden' }}>
      <BaseMap
        mapStyle={offlineMapStyle}
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
          mapRef.current = map
          registerRegionalPolygonPatterns(map, {
            saltier: theme.palette.salinity.pink,
            fresher: theme.palette.salinity.teal,
            flipping: theme.palette.accent.yellow,
            unclear: theme.palette.base[100],
          })
          setPatternReady(true)
          fitMapToRegion(map)
        }}
      >
        {place.geometry ? (
          <Source
            id={`evidence-${place.id}`}
            type="geojson"
            data={{ type: 'Feature', properties: {}, geometry: place.geometry }}
          >
            <Layer {...fillLayer} />
            {patternReady ? <Layer {...patternLayer} /> : null}
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
              role="button"
              tabIndex={0}
              aria-label={`${station.shortName || station.name}: ${valueFormat.format(station.differenceEc)} µS/cm from baseline`}
              onMouseEnter={() => onHighlightStation(station.stationId)}
              onMouseLeave={() => onHighlightStation(null)}
              onFocus={() => onHighlightStation(station.stationId)}
              onBlur={() => onHighlightStation(null)}
              onClick={() =>
                onHighlightStation(
                  highlightedStationId === station.stationId ? null : station.stationId,
                )
              }
              sx={{
                width:
                  highlightedStationId === station.stationId
                    ? regionalSummarySizing.stationPointSize * 1.55
                    : regionalSummarySizing.stationPointSize,
                height:
                  highlightedStationId === station.stationId
                    ? regionalSummarySizing.stationPointSize * 1.55
                    : regionalSummarySizing.stationPointSize,
                borderRadius: '50%',
                bgcolor: selectedDirection
                  ? stationValueColor(station, colorScaleStations, station.direction, theme)
                  : 'common.white',
                border: 2,
                borderColor: 'base.700',
                boxShadow:
                  highlightedStationId === station.stationId
                    ? `0 0 0 4px ${theme.palette.common.white}`
                    : 'none',
                cursor: 'pointer',
              }}
            />
          </Marker>
        ))}
      </BaseMap>
    </Box>
  )
}

function Timeline({
  scenarioSlug,
  events,
  selectedPattern,
  onSelect,
}: {
  scenarioSlug: string
  events: RegionalPattern[]
  selectedPattern: RegionalPattern | null
  onSelect: (pattern: RegionalPattern) => void
}) {
  const theme = useTheme()
  const reduceMotion = useReducedMotion()
  const contextPeriods = getRegionalTimelineContextPeriods(scenarioSlug)
  const domain = timelineDomain(scenarioSlug)
  return (
    <Box
      sx={{
        position: 'relative',
        height: 184,
        minHeight: 0,
        display: 'grid',
        direction: 'column',
      }}
    >
      <Box
        component={motion.div}
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.45, delay: reduceMotion ? 0 : 0.3 }}
        sx={{ position: 'absolute', left: 0, right: 0, top: 132, height: 36, display: 'flex' }}
      >
        {domain.isOutflowComparison ? (
          <>
            {[
              ['2020-08-01', '2020-10-01', 'Dry year'],
              ['2020-10-01', '2021-10-01', 'Critical dry year'],
              ['2021-10-01', '2022-01-01', 'Critical dry year'],
            ].map(([startDate, endDate, label], index) => {
              const left = datePosition(startDate, domain)
              const width = datePosition(endDate, domain) - left
              return (
                <Box
                  key={startDate}
                  sx={{
                    width: `${width}%`,
                    bgcolor: alpha(theme.palette.salinity.pink, index === 0 ? 0.14 : 0.22),
                    borderLeft: 4,
                    borderRight: index === 2 ? 4 : 0,
                    borderColor: 'salinity.pink',
                    px: 1,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Typography sx={regionalSummaryDetailTypography.timelineLabel}>
                    {label}
                  </Typography>
                </Box>
              )
            })}
          </>
        ) : (
          <>
            <Box
              sx={{
                width: `${datePosition('2019-10-01', domain)}%`,
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                borderLeft: 4,
                borderColor: 'primary.main',
                px: 1,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Typography sx={regionalSummaryDetailTypography.timelineLabel}>Wet year</Typography>
            </Box>
            <Box
              sx={{
                width: `${datePosition('2020-10-01', domain) - datePosition('2019-10-01', domain)}%`,
                bgcolor: alpha(theme.palette.salinity.pink, 0.16),
                borderLeft: 4,
                borderColor: 'salinity.pink',
                px: 1,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Typography sx={regionalSummaryDetailTypography.timelineLabel}>Dry year</Typography>
            </Box>
            <Box
              sx={{
                flex: 1,
                bgcolor: alpha(theme.palette.salinity.pink, 0.22),
                borderLeft: 4,
                borderRight: 4,
                borderColor: 'salinity.pink',
                px: 1,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Typography sx={regionalSummaryDetailTypography.timelineLabel}>
                Critical dry year
              </Typography>
            </Box>
          </>
        )}
      </Box>
      {contextPeriods.map((action) => {
        const left = datePosition(action.startDate, domain)
        const width = datePosition(action.endDate, domain) - left
        return (
          <Box
            component={motion.div}
            key={action.id}
            initial={reduceMotion ? false : { opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.55, ease: 'easeOut' }}
            sx={{
              ...regionalSummaryTimelineStyles.contextBar,
              left: `${left}%`,
              width: `${width}%`,
              transformOrigin: left > 75 ? 'right center' : 'left center',
            }}
          >
            <Typography
              sx={{
                ...regionalSummaryTimelineStyles.contextLabel,
                ...(left > 75 ? { right: 4 } : { left: 4 }),
              }}
            >
              {action.label}
            </Typography>
          </Box>
        )
      })}
      <Box
        sx={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 44,
          height: 3,
          bgcolor: 'common.white',
        }}
      />
      {domain.ticks.map(([date, label], index) => (
        <Box
          component={motion.div}
          key={date}
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reduceMotion ? 0 : 0.38,
            delay: reduceMotion ? 0 : 0.05 + index * 0.045,
          }}
          sx={{
            position: 'absolute',
            left: `${datePosition(date, domain)}%`,
            top: 36,
            transform: index === 0 ? 'none' : 'translateX(-50%)',
            textAlign: index === 0 ? 'left' : 'center',
          }}
        >
          <Box
            sx={{
              width: 2,
              height: 16,
              bgcolor: 'common.white',
              mx: index === 0 ? 0 : 'auto',
            }}
          />
          <Typography
            sx={{
              ...regionalSummaryDetailTypography.timelineLabel,
              color: 'base.100',
              mt: 0.5,
              whiteSpace: 'nowrap',
            }}
          >
            {label}
          </Typography>
        </Box>
      ))}
      {events.map((pattern) => {
        const placement = eventPlacement(pattern, domain)
        const color = pattern.direction === 'fresher' ? 'salinity.teal' : 'salinity.pink'
        const glowColor =
          pattern.direction === 'fresher'
            ? theme.palette.salinity.teal
            : theme.palette.salinity.pink
        return (
          <Button
            component={motion.button}
            key={pattern.id}
            onClick={() => onSelect(pattern)}
            aria-pressed={selectedPattern?.id === pattern.id}
            initial={reduceMotion ? false : { opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.62, ease: 'easeOut' }}
            sx={{
              position: 'absolute',
              left: `${placement.left}%`,
              width: `${placement.width}%`,
              minWidth: 18,
              top: 2,
              height: 30,
              p: 0,
              borderRadius: 0,
              bgcolor: color,
              transformOrigin: 'left center',
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
    </Box>
  )
}

function InterpretationCard({
  scenarioTitle,
  placeName,
  pattern,
  evidence,
}: {
  scenarioTitle: string
  placeName: string
  pattern: RegionalPattern
  evidence?: PatternEvidence
}) {
  const reduceMotion = useReducedMotion()
  const color = pattern.direction === 'fresher' ? 'salinity.teal' : 'salinity.pink'
  const directionLabel = pattern.direction ?? 'different'
  const differenceLabel =
    pattern.differenceEc == null
      ? 'an unavailable EC change'
      : `${pattern.differenceEc > 0 ? '+' : ''}${valueFormat.format(pattern.differenceEc)} µS/cm`
  const percentageLabel =
    pattern.differencePct == null
      ? null
      : `${pattern.differencePct > 0 ? '+' : ''}${valueFormat.format(pattern.differencePct)}%`
  const qualifyingDays = pattern.qualifyingDays ?? pattern.durationDays
  const baselineLabel =
    pattern.baselineEc == null ? 'Baseline unavailable' : valueFormat.format(pattern.baselineEc)
  const scenarioLabel =
    pattern.scenarioEc == null ? 'scenario unavailable' : valueFormat.format(pattern.scenarioEc)
  return (
    <Box
      component={motion.div}
      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.42, ease: 'easeOut' }}
      sx={{
        mt: 0,
        height: '100%',
        boxSizing: 'border-box',
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr)',
        gap: 2,
        borderLeft: 4,
        borderColor: color,
        bgcolor: 'base.800',
        px: 2,
        py: 2,
      }}
    >
      <Box>
        <Typography sx={{ ...regionalSummaryDetailTypography.eyebrow, color }}>
          Event details
        </Typography>
        <Typography sx={{ ...regionalSummaryDetailTypography.body, color: 'common.white' }}>
          In{' '}
          <Box component="span" sx={{ color: 'primary.main', fontWeight: 800 }}>
            {scenarioTitle}
          </Box>
          , {placeName} was{' '}
          <Box component="span" sx={{ color, fontWeight: 800 }}>
            {directionLabel}
          </Box>{' '}
          than Business as Usual:{' '}
          <Box component="span" sx={{ fontWeight: 800 }}>
            {differenceLabel}
          </Box>{' '}
          on average
          {percentageLabel ? (
            <>
              {' ('}
              <Box component="span" sx={{ fontWeight: 800 }}>
                {percentageLabel}
              </Box>
              )
            </>
          ) : null}
          {qualifyingDays == null ? '.' : `, sustained for ${qualifyingDays} qualifying days.`}
        </Typography>
        <Typography
          sx={{ ...regionalSummaryDetailTypography.supporting, color: 'base.200', mt: 0.4 }}
        >
          {pattern.startDate} to {pattern.endDate} · {baselineLabel} → {scenarioLabel} µS/cm ·{' '}
          {evidence?.stationEvidence.stationCount ?? pattern.stationCount ?? '—'} stations
        </Typography>
      </Box>
    </Box>
  )
}

function ComparisonRow({
  scenarioSlug,
  place,
  active,
  onSelect,
}: {
  scenarioSlug: string
  place: RegionalPlace
  active: boolean
  onSelect: () => void
}) {
  const events = datedEvents(place)
  const domain = timelineDomain(scenarioSlug)
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
          ...regionalSummaryDetailTypography.action,
          color: active ? 'primary.main' : 'common.white',
        }}
      >
        {place.name}
      </Typography>
      <Box sx={{ position: 'relative', height: 18, borderBottom: 1, borderColor: 'base.500' }}>
        {events.map((pattern) => {
          const placement = eventPlacement(pattern, domain)
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
