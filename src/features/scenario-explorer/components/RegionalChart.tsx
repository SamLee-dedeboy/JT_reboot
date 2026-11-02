import {
  type ReactNode,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import {
  Box,
  Divider,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Slider,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material'
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen'
import OpenInFullIcon from '@mui/icons-material/OpenInFull'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import { AnimatePresence, motion } from 'framer-motion'
import { area, line } from 'd3-shape'
import { chartTransition, formatDate, formatNumber, summarizeSpread } from '../format'
import { chartTextSize, useCompactExplorer } from '../explorerType'
import { getScenarioAnnotation } from '../scenarioAnnotations'
import type { D1641Dataset, DashboardMode, RangeMode, Scenario, ScenarioDataset } from '../types'
import ExplorerInfoPopover from './ExplorerInfoPopover'
import { ControlLabel, InfoButton } from './controls'
import { overlayChipSx, segmentedSx, smallIconSx } from './controlStyles'

const DEFAULT_WIDTH = 900
const DEFAULT_HEIGHT = 390
// The shortest the plot gets. Past this the page scrolls, so the drawing and its text never shrink.
const MIN_PLOT_HEIGHT = 340
const FULL_GEOMETRY = {
  pad: { left: 86, right: 18, top: 18, bottom: 116 },
  dateLabelOffset: 92,
  yearBandOffset: 80,
  yearBandHeight: 22,
  yearBandText: 17,
  exceedanceTitle: 43,
  tickGap: 10,
}
const COMPACT_GEOMETRY = {
  pad: { left: 66, right: 8, top: 18, bottom: 98 },
  dateLabelOffset: 83,
  yearBandOffset: 78,
  yearBandHeight: 18,
  yearBandText: 14,
  exceedanceTitle: 44,
  tickGap: 6,
}
// Roughly one captionSmall character, to keep a label from running into the next window.
const ANNOTATION_CHAR_WIDTH = 7
const COMPLIANCE_ROW_HEIGHT = 14

interface ChartSvgProps {
  data: ScenarioDataset
  dashboardMode: DashboardMode
  region: string
  lassoStationIds: string[]
  activeKeys: string[]
  dateIndex: number
  onDateChange: (index: number) => void
  onDateCommit: (index: number) => void
  rangeMode: RangeMode
  selectedScenarioKey: string
  selectedScenarioLabel: string
  hoveredScenarioKey: string | null
  baseScenarioLabel: string
  baseScenarioKey: string
  units: string
  d1641Data: D1641Dataset | null
  timeframeFocus: TimeframeFocus
  onTimeframeFocusChange: (value: TimeframeFocus) => void
  enableDateHighlights: boolean
  showTimeframeSelector: boolean
  reading: ReactNode
}

interface RangeDatum {
  q1: number | null
  q3: number | null
}
interface SeriesSummary {
  values: Array<number | null>
  rangeLow: Array<number | null>
  rangeHigh: Array<number | null>
}

type TimeframeFocus = 'all' | 'recreation' | 'ej-communities'

const TIMEFRAME_OPTIONS: Array<{ key: TimeframeFocus; label: string }> = [
  { key: 'all', label: 'All dates' },
  { key: 'recreation', label: 'Recreation · Apr 1–Sep 30' },
  { key: 'ej-communities', label: 'EJ & Communities · Sep–Oct' },
]

const regionalSummaryCache = new WeakMap<ScenarioDataset, Map<string, SeriesSummary>>()

const SCENARIO_ABBREVIATIONS: Record<string, string> = {
  'Business as Usual': 'BAU',
  'Bolster & Fortify': 'B&F',
  'Calling on Reserves': 'COR',
  'A Tunnel': 'TUN',
  'Eco Machine': 'ECO',
  'New Green Watershed': 'NGW',
  'Baseline (SLR)': 'BAU',
  'Bolster & Fortify (SLR)': 'B&F',
  'Eco Machine (SLR)': 'ECO',
  'New Green Watershed (SLR)': 'NGW',
  'Business As Usual': 'BAU',
  '+30% Delta outflow': '+30% outflow',
  '-10% Delta outflow': '-10% outflow',
}

const abbreviateScenario = (label: string) => SCENARIO_ABBREVIATIONS[label] ?? label

function ChartSvg({
  data,
  d1641Data,
  dashboardMode,
  region,
  lassoStationIds,
  activeKeys,
  dateIndex,
  onDateChange,
  onDateCommit,
  rangeMode,
  selectedScenarioKey,
  selectedScenarioLabel,
  hoveredScenarioKey,
  baseScenarioKey,
  baseScenarioLabel,
  timeframeFocus,
  onTimeframeFocusChange,
  enableDateHighlights,
  showTimeframeSelector,
  units,
  reading,
}: ChartSvgProps) {
  const theme = useTheme()
  const compact = useCompactExplorer()
  const geometry = compact ? COMPACT_GEOMETRY : FULL_GEOMETRY
  const { pad } = geometry
  const [scrubbing, setScrubbing] = useState(false)
  const plotRef = useRef<HTMLDivElement | null>(null)
  const [{ height, width }, setPlotSize] = useState({
    height: DEFAULT_HEIGHT,
    width: DEFAULT_WIDTH,
  })
  useLayoutEffect(() => {
    const node = plotRef.current
    if (!node) return undefined
    const observer = new ResizeObserver(([entry]) =>
      setPlotSize({
        height: Math.max(MIN_PLOT_HEIGHT, Math.round(entry.contentRect.height)),
        width: Math.max(320, Math.round(entry.contentRect.width)),
      }),
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])
  const lassoKey = lassoStationIds.join('|')
  const stationIndices = useMemo(() => {
    const lassoed = new Set(lassoStationIds)
    return data.stations
      .map((station, index) => ({ station, index }))
      .filter(
        ({ station }) =>
          (region === 'All regions' || station.region === region) &&
          (!lassoed.size || lassoed.has(String(station.station_id))),
      )
      .map(({ index }) => index)
  }, [data.stations, lassoStationIds, region])
  const series = useMemo(
    () =>
      data.scenarios
        .filter((scenario) => activeKeys.includes(scenario.key))
        .map((scenario) => {
          let datasetCache = regionalSummaryCache.get(data)
          if (!datasetCache) {
            datasetCache = new Map()
            regionalSummaryCache.set(data, datasetCache)
          }
          const cacheKey = `${scenario.key}|${region}|${rangeMode}|${lassoKey}`
          let summary = datasetCache.get(cacheKey)
          if (!summary) {
            const dailySummaries = data.dates.map((_, date) => {
              const values = stationIndices
                .map((index) => scenario.stationValues[index][date])
                .filter((value): value is number => value != null && Number.isFinite(value))
              return summarizeSpread(values, rangeMode)
            })
            summary = {
              values: dailySummaries.map(({ average }) => average),
              rangeLow: dailySummaries.map(({ low }) => low),
              rangeHigh: dailySummaries.map(({ high }) => high),
            }
            datasetCache.set(cacheKey, summary)
          }
          return {
            ...scenario,
            ...summary,
            color:
              scenario.key === selectedScenarioKey
                ? theme.palette.brand.primaryGreen
                : theme.palette.common.white,
          }
        }),
    [
      data,
      stationIndices,
      activeKeys,
      lassoKey,
      rangeMode,
      region,
      selectedScenarioKey,
      theme.palette.brand.primaryGreen,
      theme.palette.common.white,
    ],
  )
  const previousSelectedScenario = useRef(selectedScenarioKey)
  const previousStationSet = useRef(`${region}|${lassoKey}`)
  const [phase, setPhase] = useState('baseline')
  const [sequence, setSequence] = useState(0)

  useLayoutEffect(() => {
    const scenarioChanged = previousSelectedScenario.current !== selectedScenarioKey
    const stationSetChanged = previousStationSet.current !== `${region}|${lassoKey}`
    if (scenarioChanged) {
      // Animation phase changes are intentionally synchronized to the selected series.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSequence((value) => value + 1)
      setPhase('baseline')
    } else if (stationSetChanged) {
      setPhase('regionLine')
    }
    previousSelectedScenario.current = selectedScenarioKey
    previousStationSet.current = `${region}|${lassoKey}`
  }, [selectedScenarioKey, region, lassoKey])
  const allValues = series
    .flatMap((item) => [...item.values, ...item.rangeLow, ...item.rangeHigh])
    .filter((value): value is number => value != null && Number.isFinite(value))
  const extent = Math.max(1, ...allValues.map(Math.abs))
  const x = (index: number) =>
    pad.left + (index / Math.max(1, data.dates.length - 1)) * (width - pad.left - pad.right)
  const y = (value: number) =>
    pad.top + ((extent - value) / (extent * 2)) * (height - pad.top - pad.bottom)
  const linePath = line<number | null>()
    .defined((value): value is number => value != null)
    .x((_, index) => x(index))
    .y((value) => y(value!))
  const areaPath = area<RangeDatum>()
    .defined((value) => value.q1 != null && value.q3 != null)
    .x((_, index) => x(index))
    .y0((value) => y(value.q1!))
    .y1((value) => y(value.q3!))
  const collapsedAreaPath = area<RangeDatum>()
    .defined((value) => value.q1 != null && value.q3 != null)
    .x((_, index) => x(index))
    .y0(y(0))
    .y1(y(0))
  const ticks = [-extent, -extent / 2, 0, extent / 2, extent]
  const boundaryIndex = (date: string) => data.dates.findIndex((item) => item >= date)
  const finalDateIndex = data.dates.length - 1
  const periods = (() => {
    if (dashboardMode === 'rma-schism') {
      const dryStart = boundaryIndex('2019-10-01')
      const criticalStart = boundaryIndex('2020-10-01')
      return dryStart >= 0 && criticalStart >= 0
        ? [
            { start: 0, end: dryStart, label: 'Wet year' },
            { start: dryStart, end: criticalStart, label: 'Dry year' },
            { start: criticalStart, end: finalDateIndex, label: 'Critical' },
          ]
        : []
    }
    if (dashboardMode === 'tiered-outflows') {
      const criticalStart = boundaryIndex('2020-10-01')
      const secondCriticalStart = boundaryIndex('2021-10-01')
      return criticalStart >= 0 && secondCriticalStart >= 0
        ? [
            { start: 0, end: criticalStart, label: 'Dry year' },
            { start: criticalStart, end: secondCriticalStart, label: 'Critical' },
            { start: secondCriticalStart, end: finalDateIndex, label: 'Critical' },
          ]
        : []
    }
    if (dashboardMode === 'schism-runs') {
      const dryStart = boundaryIndex('2019-10-01')
      const criticalStart = boundaryIndex('2020-10-01')
      return dryStart >= 0 && criticalStart >= 0
        ? [
            { start: 0, end: dryStart, label: 'Wet year' },
            { start: dryStart, end: criticalStart, label: 'Dry year' },
            { start: criticalStart, end: finalDateIndex, label: 'Critical' },
          ]
        : []
    }
    const dryStart = boundaryIndex('2019-10-01')
    const criticalStart = boundaryIndex('2020-10-01')
    return dryStart >= 0 && criticalStart >= 0
      ? [
          { start: 0, end: dryStart, label: 'Wet year' },
          { start: dryStart, end: criticalStart, label: 'Dry year' },
          { start: criticalStart, end: finalDateIndex, label: 'Critical' },
        ]
      : []
  })()
  const periodBoundaries = periods.slice(1).map(({ start }) => start)
  const timeframeSegments = useMemo(() => {
    if (timeframeFocus === 'all') return []
    const matches = (date: string) => {
      const month = Number(date.slice(5, 7))
      return timeframeFocus === 'recreation' ? month >= 4 && month <= 9 : month >= 9 && month <= 10
    }
    const segments: Array<{ start: number; end: number }> = []
    data.dates.forEach((date, index) => {
      if (!matches(date)) return
      const current = segments[segments.length - 1]
      if (current && index === current.end + 1) current.end = index
      else segments.push({ start: index, end: index })
    })
    return segments
  }, [data.dates, timeframeFocus])
  const complianceRows = useMemo(() => {
    if (!d1641Data) return []
    const visibleStationIds = new Set(
      data.stations
        .filter((station) => region === 'All regions' || station.region === region)
        .map((station) => String(station.station_id)),
    )
    const toSegments = (scenarioKey: string) => {
      const scenarioCompliance = d1641Data.scenarios[scenarioKey]
      if (!scenarioCompliance) return []
      const activeDates = new Set<number>()
      Object.entries(scenarioCompliance.stations).forEach(([stationId, station]) => {
        if (!visibleStationIds.has(stationId)) return
        station.objectives.forEach((objective) => {
          if (objective.status !== 'calculated_exceedance' || !objective.start || !objective.end)
            return
          const start = data.dates.findIndex((date) => date >= objective.start!)
          const end = data.dates.findLastIndex((date) => date <= objective.end!)
          if (start < 0 || end < start) return
          for (let index = start; index <= end; index += 1) activeDates.add(index)
        })
      })
      const segments: Array<{ start: number; end: number }> = []
      ;[...activeDates]
        .sort((a, b) => a - b)
        .forEach((index) => {
          const current = segments[segments.length - 1]
          if (current && index === current.end + 1) current.end = index
          else segments.push({ start: index, end: index })
        })
      return segments
    }
    return [
      {
        key: 'base',
        label: dashboardMode === 'slr-current' ? 'Current' : 'Base',
        color: theme.palette.brand.primaryBlue,
        segments: toSegments(baseScenarioKey),
      },
      {
        key: 'selected',
        label: dashboardMode === 'slr-current' ? 'SLR' : 'Selected',
        color: theme.palette.brand.primaryGreen,
        segments: toSegments(selectedScenarioKey),
      },
    ]
  }, [
    baseScenarioKey,
    d1641Data,
    data.dates,
    data.stations,
    dashboardMode,
    region,
    selectedScenarioKey,
    theme.palette.brand.primaryBlue,
    theme.palette.brand.primaryGreen,
  ])
  const annotation = getScenarioAnnotation(dashboardMode, selectedScenarioKey)
  const annotationWindows = (annotation?.periods ?? [])
    .map(({ startDate, endDate, note }) => ({
      startDate,
      endDate,
      note,
      start: boundaryIndex(startDate),
      end: data.dates.findLastIndex((date) => date <= endDate),
    }))
    .filter(({ start, end }) => start >= 0 && end >= start)
  const dateTicks = [0, data.dates.length - 1]
  const indexFromPointer = (event: ReactPointerEvent<SVGSVGElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    const pointerX = ((event.clientX - bounds.left) / bounds.width) * width
    return Math.max(
      0,
      Math.min(
        data.dates.length - 1,
        Math.round(
          ((pointerX - pad.left) / (width - pad.left - pad.right)) * (data.dates.length - 1),
        ),
      ),
    )
  }
  const textStyle = {
    fill: theme.palette.base[300],
    fontFamily: theme.typography.captionSmall.fontFamily,
    fontSize: chartTextSize(theme),
  }
  const tickColor = (tick: number) =>
    tick > 0
      ? theme.palette.salinity.pink
      : tick < 0
        ? theme.palette.salinity.teal
        : theme.palette.common.white
  const formatTick = (tick: number) =>
    `${formatNumber(tick)}${units === '%' && tick !== 0 ? '%' : ''}`

  const dateRow = (
    <>
      <Typography variant="chartTitle">Date</Typography>
      <Typography
        variant={compact ? 'chartTitle' : 'h5'}
        sx={{ '&&': { color: 'brand.primaryBlue' } }}
      >
        {formatDate(data.dates[dateIndex])}
      </Typography>
      {enableDateHighlights && showTimeframeSelector && (
        <Select
          aria-label="Highlighted domain-specific timeframe"
          size="small"
          value={timeframeFocus}
          onChange={(event) => onTimeframeFocusChange(event.target.value as TimeframeFocus)}
          sx={(theme) => ({
            height: theme.spacing(4),
            minWidth: theme.spacing(20),
            ml: 'auto',
            typography: 'captionSmall',
          })}
        >
          {TIMEFRAME_OPTIONS.map((option) => (
            <MenuItem key={option.key} value={option.key} sx={{ typography: 'captionSmall' }}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      )}
    </>
  )
  const slider = (
    <Slider
      aria-label="Dashboard date"
      min={0}
      max={data.dates.length - 1}
      value={dateIndex}
      onChange={(_, value) => onDateChange(value as number)}
      onChangeCommitted={(_, value) => onDateCommit(value as number)}
      sx={{
        color: 'common.white',
        ...(compact && { py: 1 }),
        '& .MuiSlider-rail': { opacity: 0.38 },
      }}
    />
  )

  return (
    <Box sx={{ display: 'flex', flex: 1, flexDirection: 'column', minHeight: 0 }}>
      {compact ? (
        <>
          <Box
            sx={(theme) => ({
              alignItems: 'center',
              columnGap: theme.jtSpacing.gap.sm,
              display: 'flex',
              flexWrap: 'wrap',
              mx: theme.jtSpacing.component.xs,
              pt: 0.5,
            })}
          >
            {dateRow}
            <Box sx={{ ml: 'auto', minWidth: 0 }}>{reading}</Box>
          </Box>
          <Box
            sx={(theme) => ({
              mx: theme.jtSpacing.component.xs,
              pl: `${pad.left}px`,
              pr: `${pad.right}px`,
            })}
          >
            {slider}
          </Box>
        </>
      ) : (
        <Box
          sx={(theme) => ({
            alignItems: 'start',
            display: 'grid',
            gap: theme.jtSpacing.gap.xs,
            gridTemplateColumns: `${pad.left}px minmax(0, 1fr)`,
            mx: theme.jtSpacing.component.sm,
            py: theme.jtSpacing.component.xs,
          })}
        >
          <Typography
            variant="captionSmall"
            color="text.secondary"
            sx={(theme) => ({
              alignSelf: 'end',
              lineHeight: 1.15,
              pr: theme.jtSpacing.gap.xs,
              textAlign: 'right',
            })}
          >
            {units === '%' ? (
              <>
                <Box component="span" sx={{ display: 'block' }}>
                  Change
                </Box>
                <Box component="span" sx={{ display: 'block' }}>
                  from
                </Box>
                <Box component="span" sx={{ display: 'block' }}>
                  base (%)
                </Box>
              </>
            ) : (
              <>
                <Box component="span" sx={{ display: 'block' }}>
                  Δ EC-AVG-AVG
                </Box>
                <Box component="span" sx={{ display: 'block' }}>
                  (µS/cm)
                </Box>
              </>
            )}
          </Typography>
          <Box sx={{ display: 'grid', gap: 'inherit', mr: `${pad.right}px` }}>
            <Box
              sx={(theme) => ({
                alignItems: 'center',
                display: 'flex',
                flexWrap: 'wrap',
                gap: theme.jtSpacing.gap.sm,
              })}
            >
              {dateRow}
            </Box>
            {slider}
          </Box>
        </Box>
      )}
      <Box
        ref={plotRef}
        sx={(theme) => ({
          flex: 1,
          minHeight: { xs: DEFAULT_HEIGHT, lg: MIN_PLOT_HEIGHT },
          mx: compact ? theme.jtSpacing.component.xs : theme.jtSpacing.component.sm,
          overflow: 'hidden',
          position: 'relative',
        })}
      >
        <Box
          component="svg"
          viewBox={`0 0 ${width} ${height}`}
          sx={{
            bottom: 0,
            cursor: scrubbing ? 'ew-resize' : 'pointer',
            display: 'block',
            height: '100%',
            left: 0,
            overflow: 'visible',
            position: 'absolute',
            right: 0,
            top: 0,
            touchAction: 'none',
            width: '100%',
          }}
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture(event.pointerId)
            setScrubbing(true)
            onDateChange(indexFromPointer(event))
          }}
          onPointerUp={(event) => {
            const index = indexFromPointer(event)
            event.currentTarget.releasePointerCapture(event.pointerId)
            setScrubbing(false)
            onDateChange(index)
            onDateCommit(index)
          }}
          onPointerCancel={() => setScrubbing(false)}
          onPointerMove={(event) => {
            if (scrubbing) onDateChange(indexFromPointer(event))
          }}
        >
          {timeframeSegments.map((segment) => (
            <rect
              key={`timeframe-${segment.start}-${segment.end}`}
              x={x(segment.start)}
              y={pad.top}
              width={Math.max(2, x(Math.min(finalDateIndex, segment.end + 1)) - x(segment.start))}
              height={height - pad.top - pad.bottom}
              fill={theme.palette.brand.primaryBlue}
              opacity=".09"
            />
          ))}
          {annotation && (
            <g aria-label={annotation.legend}>
              {annotationWindows.map((item, index) => {
                const left = x(item.start)
                const next = annotationWindows[index + 1]
                const room = (next ? x(next.start) : width - pad.right) - left
                return (
                  <g key={item.start}>
                    <Tooltip
                      placement="top"
                      title={`${annotation.label}: ${formatDate(item.startDate)} – ${formatDate(item.endDate)}. ${item.note ?? annotation.note}`}
                    >
                      <rect
                        x={left}
                        y={pad.top}
                        width={Math.max(2, x(Math.min(finalDateIndex, item.end + 1)) - left)}
                        height={height - pad.top - pad.bottom}
                        fill={theme.palette.base[100]}
                        opacity=".14"
                      />
                    </Tooltip>
                    {room > annotation.label.length * ANNOTATION_CHAR_WIDTH && (
                      <text
                        x={left + 4}
                        y={pad.top + 34}
                        style={{
                          ...textStyle,
                          fill: theme.palette.common.white,
                          pointerEvents: 'none',
                        }}
                      >
                        {annotation.label}
                      </text>
                    )}
                  </g>
                )
              })}
            </g>
          )}
          <g aria-label="Value axis">
            {ticks.map((tick, index) => (
              <g key={index}>
                <line
                  x1={pad.left}
                  x2={width - pad.right}
                  y1={y(tick)}
                  y2={y(tick)}
                  stroke={tickColor(tick)}
                  strokeOpacity="0.24"
                  strokeWidth="1"
                />
                <text
                  x={pad.left - geometry.tickGap}
                  y={y(tick) + 4}
                  textAnchor="end"
                  style={{ ...textStyle, fill: tickColor(tick), fontWeight: 700 }}
                >
                  {formatTick(tick)}
                </text>
              </g>
            ))}
          </g>
          {dateTicks.map((index) => (
            <text
              key={index}
              x={x(index)}
              y={height - geometry.dateLabelOffset}
              textAnchor={index === 0 ? 'start' : 'end'}
              style={textStyle}
            >
              {formatDate(data.dates[index])}
            </text>
          ))}
          <motion.path
            key={`baseline-${sequence}`}
            d={`M ${pad.left} ${y(0)} L ${width - pad.right} ${y(0)}`}
            fill="none"
            stroke={theme.palette.base[400]}
            strokeLinecap="round"
            strokeWidth="3"
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            onAnimationComplete={() => {
              if (phase === 'baseline') setPhase('line')
            }}
          />
          <motion.text
            key={`baseline-label-${sequence}`}
            x={pad.left + 8}
            y={y(0) - 8}
            fill={theme.palette.base[100]}
            style={{ ...textStyle, fontWeight: 700 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.3 }}
          >
            {baseScenarioLabel}
          </motion.text>
          {compact && (
            <text x={pad.left + 4} y={pad.top + 16} style={{ ...textStyle, pointerEvents: 'none' }}>
              {units === '%' ? 'Change from base (%)' : 'Δ EC-AVG-AVG (µS/cm)'}
            </text>
          )}
          <text
            x={width - pad.right}
            y={pad.top + 16}
            textAnchor="end"
            style={{ ...textStyle, fill: theme.palette.brand.primaryGreen, fontWeight: 700 }}
          >
            Selected: {selectedScenarioLabel}
          </text>
          <AnimatePresence>
            {(phase === 'regionLine' || phase === 'band' || phase === 'ready') &&
              series.map((item, index) => {
                const range = item.rangeLow.map((q1, date) => ({ q1, q3: item.rangeHigh[date] }))
                const highlighted = item.key === hoveredScenarioKey
                const deEmphasized =
                  hoveredScenarioKey != null && item.key !== selectedScenarioKey && !highlighted
                return (
                  <motion.path
                    key={`range-${item.key}-${sequence}`}
                    initial={{ d: collapsedAreaPath(range) || '', opacity: 0 }}
                    animate={{
                      d: areaPath(range) || '',
                      opacity: highlighted ? 0.64 : deEmphasized ? 0.05 : 0.24,
                      fill: highlighted ? theme.palette.brand.primaryBlue : item.color,
                    }}
                    exit={{ opacity: 0 }}
                    transition={{
                      d: { duration: phase === 'regionLine' ? 0 : 1.15, ease: [0.22, 1, 0.36, 1] },
                      opacity: { duration: phase === 'regionLine' ? 0 : 1.15 },
                    }}
                    onAnimationComplete={() => {
                      if (index === series.length - 1 && phase === 'band') setPhase('ready')
                    }}
                  />
                )
              })}
          </AnimatePresence>
          <AnimatePresence>
            {phase !== 'baseline' &&
              series.map((item, index) => {
                const clipId = `timeline-reveal-${item.key}-${sequence}`
                return (
                  <g key={`${item.key}-${sequence}`}>
                    <defs>
                      <clipPath id={clipId}>
                        <motion.rect
                          x={pad.left}
                          y={pad.top}
                          height={height - pad.top - pad.bottom}
                          initial={{
                            width: phase === 'regionLine' ? width - pad.left - pad.right : 0,
                          }}
                          animate={{ width: width - pad.left - pad.right }}
                          transition={{
                            duration: phase === 'line' ? 1.6 : 1.4,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          onAnimationComplete={() => {
                            if (
                              index === series.length - 1 &&
                              (phase === 'line' || phase === 'regionLine')
                            )
                              setPhase('band')
                          }}
                        />
                      </clipPath>
                    </defs>
                    <motion.path
                      initial={{
                        d: linePath(item.values) || '',
                        opacity: phase === 'regionLine' ? 1 : 0,
                      }}
                      animate={{
                        d: linePath(item.values) || '',
                        opacity:
                          hoveredScenarioKey != null &&
                          item.key !== selectedScenarioKey &&
                          item.key !== hoveredScenarioKey
                            ? 0.2
                            : 1,
                        stroke:
                          item.key === hoveredScenarioKey
                            ? theme.palette.brand.primaryBlue
                            : item.color,
                        strokeWidth: item.key === hoveredScenarioKey ? 5 : 2,
                      }}
                      exit={{ opacity: 0 }}
                      transition={{
                        d: { duration: 1.4, ease: [0.22, 1, 0.36, 1] },
                        opacity: { duration: 0.2 },
                        stroke: { duration: 0.18 },
                        strokeWidth: { duration: 0.18 },
                      }}
                      clipPath={`url(#${clipId})`}
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      vectorEffect="non-scaling-stroke"
                    />
                  </g>
                )
              })}
          </AnimatePresence>
          {periodBoundaries.map((index) => (
            <line
              key={`period-boundary-${index}`}
              x1={x(index)}
              x2={x(index)}
              y1={pad.top}
              y2={height - pad.bottom}
              stroke={theme.palette.base[300]}
              strokeDasharray="5 5"
              strokeWidth="1.5"
            />
          ))}
          {periods.length > 0 && (
            <g aria-label="Water year periods">
              {periods.map((period, index) => (
                <g key={`${period.label}-${period.start}`}>
                  <rect
                    x={x(period.start)}
                    y={height - geometry.yearBandOffset}
                    width={Math.max(0, x(period.end) - x(period.start))}
                    height={geometry.yearBandHeight}
                    rx="4"
                    fill={index === 0 ? theme.palette.base[400] : 'none'}
                    stroke={index === 0 ? 'none' : theme.palette.base[300]}
                    strokeWidth="1.5"
                  />
                  <text
                    x={(x(period.start) + x(period.end)) / 2}
                    y={height - geometry.yearBandOffset + geometry.yearBandText}
                    textAnchor="middle"
                    style={{
                      ...textStyle,
                      fill: index === 0 ? theme.palette.common.white : theme.palette.base[100],
                      fontWeight: 700,
                    }}
                  >
                    {period.label}
                  </text>
                </g>
              ))}
            </g>
          )}
          {complianceRows.length > 0 && (
            <text
              x={pad.left}
              y={height - geometry.exceedanceTitle}
              style={{
                fill: theme.palette.common.white,
                fontFamily: theme.typography.chartTitle.fontFamily,
                fontSize: theme.typography.chartTitle.fontSize,
                letterSpacing: theme.typography.chartTitle.letterSpacing,
                textTransform: theme.typography.chartTitle.textTransform,
              }}
            >
              D-1641 exceedance periods
            </text>
          )}
          {complianceRows.map((row, rowIndex) => {
            const rowY = height - 37 + rowIndex * (COMPLIANCE_ROW_HEIGHT + 3)
            return (
              <g key={row.key} aria-label={`${row.label} D-1641 exceedance periods`}>
                <text
                  x={pad.left - geometry.tickGap}
                  y={rowY + 11}
                  textAnchor="end"
                  style={{ ...textStyle, fill: row.color, fontWeight: 700 }}
                >
                  {row.label}
                </text>
                <rect
                  x={pad.left}
                  y={rowY}
                  width={width - pad.left - pad.right}
                  height={COMPLIANCE_ROW_HEIGHT}
                  rx="3"
                  fill="none"
                  stroke={theme.palette.base[400]}
                  strokeWidth="1"
                />
                {row.segments.map((segment) => (
                  <Tooltip
                    key={`${segment.start}-${segment.end}`}
                    placement="top"
                    title={`${row.label}: ${formatDate(data.dates[segment.start])} – ${formatDate(data.dates[segment.end])}`}
                  >
                    <rect
                      x={x(segment.start)}
                      y={rowY + 2}
                      width={Math.max(
                        3,
                        x(Math.min(finalDateIndex, segment.end + 1)) - x(segment.start),
                      )}
                      height={COMPLIANCE_ROW_HEIGHT - 4}
                      rx="2"
                      fill={row.color}
                      opacity=".9"
                    />
                  </Tooltip>
                ))}
                {!row.segments.length && (
                  <text
                    x={pad.left + 6}
                    y={rowY + 11}
                    style={{ ...textStyle, fill: theme.palette.base[300], fontWeight: 700 }}
                  >
                    No calculated exceedance
                  </text>
                )}
              </g>
            )
          })}
          <motion.line
            x1={x(dateIndex)}
            x2={x(dateIndex)}
            y1={pad.top}
            y2={height - pad.bottom}
            initial={{ x1: x(dateIndex), x2: x(dateIndex), y1: pad.top, y2: height - pad.bottom }}
            animate={{ x1: x(dateIndex), x2: x(dateIndex), y1: pad.top, y2: height - pad.bottom }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            stroke={theme.palette.common.white}
            strokeWidth="1.5"
            opacity=".85"
          />
          <AnimatePresence>
            {(phase === 'band' || phase === 'ready') &&
              series.map((item) => {
                const selectedValue = item.values[dateIndex]
                if (selectedValue == null) return null
                const pointX = x(dateIndex)
                const pointY = y(selectedValue)
                const pointRadius = item.key === hoveredScenarioKey ? 7 : 5
                const pointFill =
                  item.key === hoveredScenarioKey ? theme.palette.brand.primaryBlue : item.color
                return (
                  <motion.circle
                    key={`selected-${item.key}`}
                    cx={pointX}
                    cy={pointY}
                    r={pointRadius}
                    fill={pointFill}
                    initial={{ cx: pointX, cy: pointY, opacity: 0, r: pointRadius }}
                    animate={{
                      cx: pointX,
                      cy: pointY,
                      opacity: 1,
                      fill: pointFill,
                      r: pointRadius,
                    }}
                    exit={{ cx: pointX, cy: pointY, opacity: 0, r: pointRadius }}
                    transition={chartTransition}
                    stroke={theme.palette.base[900]}
                    strokeWidth="2"
                  />
                )
              })}
          </AnimatePresence>
        </Box>
      </Box>
    </Box>
  )
}

interface RegionalChartProps {
  data: ScenarioDataset
  dashboardMode: DashboardMode
  region: string
  selectedScenario: Scenario
  baseScenarioKey: string
  baseScenarioLabel: string
  rawRegionValue: number | null
  percentRegionValue: number | null
  activeKeys: string[]
  onActiveKeysChange: (keys: string[]) => void
  dateIndex: number
  onDateChange: (index: number) => void
  onDateCommit: (index: number) => void
  rangeMode: RangeMode
  onRangeModeChange: (rangeMode: RangeMode) => void
  units: string
  expanded: boolean
  onExpandedChange: (expanded: boolean) => void
  d1641Data: D1641Dataset | null
  enableDateHighlights?: boolean
  useFullScenarioNames?: boolean
  /** A scenario this comparison never offers as an overlay. */
  hiddenOverlayKey?: string | null
  lassoStationIds: string[]
  disableTunnelScenario?: boolean
  showTimeframeSelector?: boolean
}

export default function RegionalChart({
  data,
  d1641Data,
  dashboardMode,
  region,
  selectedScenario,
  baseScenarioKey,
  baseScenarioLabel,
  rawRegionValue,
  percentRegionValue,
  activeKeys,
  onActiveKeysChange,
  dateIndex,
  onDateChange,
  onDateCommit,
  rangeMode,
  onRangeModeChange,
  units,
  expanded,
  onExpandedChange,
  enableDateHighlights = false,
  useFullScenarioNames = false,
  hiddenOverlayKey = null,
  lassoStationIds,
  disableTunnelScenario = false,
  showTimeframeSelector = true,
}: RegionalChartProps) {
  const [bandInfoAnchor, setBandInfoAnchor] = useState<HTMLButtonElement | null>(null)
  const [visibilityInfoAnchor, setVisibilityInfoAnchor] = useState<HTMLButtonElement | null>(null)
  const [deviationInfoAnchor, setDeviationInfoAnchor] = useState<HTMLButtonElement | null>(null)
  const [hoveredScenarioKey, setHoveredScenarioKey] = useState<string | null>(null)
  const [timeframeFocus, setTimeframeFocus] = useState<TimeframeFocus>('all')
  const coverage =
    rangeMode === 'iqr'
      ? { first: 5, last: 14, label: 'Central 50% of stations', legend: 'central 50%' }
      : rangeMode === 'p90'
        ? { first: 1, last: 18, label: 'Central 90% of stations', legend: 'central 90%' }
        : { first: 0, last: 19, label: 'All stations', legend: 'all stations' }
  const annotation = getScenarioAnnotation(dashboardMode, selectedScenario.key)
  const compact = useCompactExplorer()
  const readingVariant = compact ? 'chartTitle' : 'numberScore'
  const deviationReading = (
    <Box
      sx={(theme) =>
        compact
          ? {
              alignItems: 'center',
              columnGap: theme.jtSpacing.gap.sm,
              display: 'flex',
              flexWrap: 'wrap',
              minWidth: 0,
            }
          : {
              display: 'grid',
              gridArea: 'deviation',
              justifyItems: { xs: 'start', md: 'end' },
              minWidth: 0,
            }
      }
    >
      <ControlLabel inline={compact} label="Current average deviation">
        <InfoButton label="Explain current average deviation" onClick={setDeviationInfoAnchor} />
      </ControlLabel>
      <Box
        sx={(theme) => ({
          alignItems: 'baseline',
          display: 'flex',
          gap: theme.jtSpacing.gap.sm,
          whiteSpace: 'nowrap',
        })}
      >
        <Typography
          variant={readingVariant}
          sx={{
            color:
              Number(rawRegionValue) > 0
                ? 'salinity.pink'
                : Number(rawRegionValue) < 0
                  ? 'salinity.teal'
                  : 'common.white',
          }}
        >
          {Number(rawRegionValue) > 0 ? '+' : ''}
          {formatNumber(rawRegionValue)}{' '}
          <Box
            component="span"
            sx={{ color: 'text.secondary', typography: 'captionSmall', textTransform: 'none' }}
          >
            µS/cm
          </Box>
        </Typography>
        <Typography
          variant={readingVariant}
          sx={{
            color:
              Number(percentRegionValue) > 0
                ? 'salinity.pink'
                : Number(percentRegionValue) < 0
                  ? 'salinity.teal'
                  : 'common.white',
          }}
        >
          {Number(percentRegionValue) > 0 ? '+' : ''}
          {formatNumber(percentRegionValue)}
          <Box
            component="span"
            sx={{ color: 'text.secondary', typography: 'captionSmall', textTransform: 'none' }}
          >
            %
          </Box>
        </Typography>
      </Box>
    </Box>
  )
  const lassoLabel = `${lassoStationIds.length} lassoed ${lassoStationIds.length === 1 ? 'station' : 'stations'}`
  const legendStations = !lassoStationIds.length
    ? coverage.legend
    : rangeMode === 'minmax'
      ? lassoLabel
      : `${coverage.legend} of ${lassoLabel}`
  const chartLegend = (
    <Box
      aria-label="Chart legend"
      sx={{
        color: 'text.secondary',
        display: 'grid',
        minWidth: 0,
        ...(compact
          ? { mt: 0.5, typography: 'captionSmall' }
          : { gap: 0.25, gridArea: 'legend', typography: 'controlValue' }),
      }}
    >
      <Box component="span" sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
        <Box
          component="span"
          sx={{
            bgcolor: 'brand.primaryGreen',
            borderRadius: 999,
            flex: '0 0 auto',
            height: 2,
            width: 24,
          }}
        />
        <span>
          Average of <strong>{legendStations}</strong>
        </span>
      </Box>
      <Box component="span" sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
        <Box
          component="span"
          sx={{
            bgcolor: 'brand.primaryGreen',
            border: 1,
            borderColor: 'brand.primaryGreen',
            borderRadius: 0.5,
            flex: '0 0 auto',
            height: 10,
            opacity: 0.28,
            width: 24,
          }}
        />
        <span>
          Range of <strong>{legendStations}</strong>
        </span>
      </Box>
      {annotation && (
        <Box component="span" sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
          <Box
            component="span"
            sx={{
              bgcolor: 'base.100',
              borderRadius: 0.5,
              flex: '0 0 auto',
              height: 10,
              opacity: 0.32,
              width: 24,
            }}
          />
          {annotation.legend}
        </Box>
      )}
    </Box>
  )
  return (
    <Paper
      variant="outlined"
      component="article"
      data-tour="line-chart"
      sx={{
        bgcolor: 'base.700',
        borderRadius: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minWidth: 0,
        overflow: 'hidden',
        position: 'relative',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        '& text, & .MuiTypography-root, & .MuiFormControlLabel-label': {
          pointerEvents: 'none',
        },
      }}
    >
      {/* Chart settings. Compact: the spread over its legend, beside the overlays. Otherwise the spread, legend, and reading share a row, with overlays beneath */}
      <Box
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          columnGap: 2,
          display: 'grid',
          rowGap: 1,
          ...(compact
            ? { alignItems: 'start', gridTemplateColumns: 'auto minmax(0, 1fr)', px: 1, py: 0.5 }
            : {
                alignItems: 'end',
                gridTemplateAreas: {
                  xs: '"spread" "legend" "deviation" "overlay"',
                  md: '"spread legend deviation" "overlay overlay overlay"',
                },
                gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'auto minmax(0, 1fr) auto' },
                px: 1.5,
                py: 1,
              }),
        }}
      >
        <Box sx={{ minWidth: 0, ...(!compact && { gridArea: 'spread' }) }}>
          <ControlLabel label="Station spread">
            <InfoButton label="Explain the station spread" onClick={setBandInfoAnchor} />
          </ControlLabel>
          <ToggleButtonGroup
            exclusive
            size="small"
            value={rangeMode}
            onChange={(_, value) => {
              if (value) onRangeModeChange(value)
            }}
            aria-label="Station spread"
            sx={segmentedSx}
          >
            <ToggleButton value="minmax">All stations</ToggleButton>
            <ToggleButton value="p90">Central 90%</ToggleButton>
            <ToggleButton value="iqr">Central 50%</ToggleButton>
          </ToggleButtonGroup>
          {compact && chartLegend}
        </Box>
        {!compact && chartLegend}
        {!compact && deviationReading}
        <Box
          sx={
            compact
              ? { minWidth: 0 }
              : {
                  alignItems: 'center',
                  columnGap: 1,
                  display: 'grid',
                  gridArea: 'overlay',
                  gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'auto minmax(0, 1fr)' },
                  minWidth: 0,
                }
          }
        >
          <ControlLabel label="Scenario overlay">
            <InfoButton label="Explain scenario visibility" onClick={setVisibilityInfoAnchor} />
            <Tooltip
              title={
                activeKeys.length > 1
                  ? expanded
                    ? 'Restore dashboard layout'
                    : 'Expand line chart'
                  : 'Select another scenario to expand the line chart'
              }
            >
              <Box
                component="span"
                data-tour="scenario-overlay-expand"
                sx={{ alignItems: 'center', display: 'inline-flex', lineHeight: 0 }}
              >
                <IconButton
                  aria-label={
                    expanded
                      ? 'Restore map and station distribution'
                      : 'Expand line chart and hide map and station distribution'
                  }
                  disabled={activeKeys.length <= 1}
                  onClick={() => onExpandedChange(!expanded)}
                  size="small"
                  sx={{
                    ...smallIconSx,
                    color: expanded ? 'brand.primaryGreen' : 'text.secondary',
                    p: 0.25,
                  }}
                >
                  {expanded ? <CloseFullscreenIcon /> : <OpenInFullIcon />}
                </IconButton>
              </Box>
            </Tooltip>
          </ControlLabel>
          <Box
            sx={{
              gap: 0.25,
              minWidth: 0,
              ...(compact
                ? { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, max-content))' }
                : { display: 'flex', flexWrap: 'wrap' }),
            }}
          >
            {data.scenarios
              .filter(
                (scenario) => scenario.key !== baseScenarioKey && scenario.key !== hiddenOverlayKey,
              )
              .map((scenario) => {
                const active = activeKeys.includes(scenario.key)
                const primary = scenario.key === selectedScenario.key
                const visible = primary || active
                const unavailable =
                  disableTunnelScenario && scenario.label.trim().toLowerCase() === 'a tunnel'
                return (
                  <Tooltip key={scenario.key} title={scenario.label}>
                    <span>
                      <ToggleButton
                        aria-label={`${visible ? 'Hide' : 'Show'} ${scenario.label}`}
                        selected={visible}
                        disabled={unavailable}
                        size="small"
                        value={scenario.key}
                        onChange={() => {
                          if (!primary)
                            onActiveKeysChange(
                              active
                                ? activeKeys.filter((key) => key !== scenario.key)
                                : [...activeKeys, scenario.key],
                            )
                        }}
                        onMouseEnter={() => {
                          if (active && !primary) setHoveredScenarioKey(scenario.key)
                        }}
                        onMouseLeave={() => setHoveredScenarioKey(null)}
                        sx={overlayChipSx(primary, compact)}
                      >
                        {visible ? <VisibilityOutlinedIcon /> : <VisibilityOffOutlinedIcon />}
                        {useFullScenarioNames ? scenario.label : abbreviateScenario(scenario.label)}
                      </ToggleButton>
                    </span>
                  </Tooltip>
                )
              })}
          </Box>
        </Box>
      </Box>
      <ExplorerInfoPopover anchor={bandInfoAnchor} onClose={() => setBandInfoAnchor(null)}>
        <Typography variant="caption" color="brand.primaryGreen">
          About the station spread
        </Typography>
        <Typography variant="h5" sx={{ '&&': { color: 'brand.primaryGreen' } }}>
          What does the station spread show?
        </Typography>
        <Typography variant="captionSmall" component="p" color="text.secondary">
          The{' '}
          <Box component="span" sx={{ color: 'brand.primaryGreen' }}>
            line
          </Box>{' '}
          shows the <strong>daily average of the stations in the selected spread</strong>. The{' '}
          <Box component="span" sx={{ color: 'brand.primaryGreen' }}>
            shaded band
          </Box>{' '}
          shows how station values are <strong>distributed</strong> around it.
        </Typography>
        <Typography variant="captionSmall" component="p" color="text.secondary">
          For each date, stations are ordered from lowest to highest. The selected spread includes:
        </Typography>
        <Divider />
        <Typography variant="caption" color="brand.primaryGreen">
          {coverage.label}
        </Typography>
        <Box
          aria-label={`${coverage.label}, shown across stations ordered by value`}
          sx={{
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          {Array.from({ length: 20 }, (_, index) => {
            const selected = index >= coverage.first && index <= coverage.last
            return (
              <Box
                key={index}
                sx={{
                  bgcolor: selected ? 'brand.primaryGreen' : 'base.700',
                  border: 2,
                  borderColor: selected ? 'brand.primaryGreen' : 'base.300',
                  borderRadius: '50%',
                  boxSizing: 'border-box',
                  height: 12,
                  opacity: selected ? 1 : 0.85,
                  width: 12,
                }}
              />
            )
          })}
        </Box>
        <Box
          sx={(theme) => ({
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            mt: theme.jtSpacing.component.xs,
            width: '100%',
          })}
        >
          <Typography variant="captionSmall" color="text.secondary" sx={{ justifySelf: 'start' }}>
            Lowest
          </Typography>
          <Typography
            variant="captionSmall"
            color="text.secondary"
            sx={{ justifySelf: 'end', textAlign: 'right' }}
          >
            Highest
          </Typography>
        </Box>
        <Box
          sx={(theme) => ({
            alignItems: 'center',
            display: 'flex',
            gap: theme.jtSpacing.gap.sm,
            mt: theme.jtSpacing.component.xs,
          })}
        >
          <Box
            sx={(theme) => ({
              alignItems: 'center',
              display: 'inline-flex',
              gap: theme.jtSpacing.gap.xs,
            })}
          >
            <Box
              sx={{
                bgcolor: 'brand.primaryGreen',
                borderRadius: '50%',
                flex: '0 0 10px',
                height: 10,
                width: 10,
              }}
            />
            <Typography variant="captionSmall">Included in spread</Typography>
          </Box>
          <Box
            sx={(theme) => ({
              alignItems: 'center',
              display: 'inline-flex',
              gap: theme.jtSpacing.gap.xs,
            })}
          >
            <Box
              sx={{
                bgcolor: 'base.700',
                border: 2,
                borderColor: 'base.300',
                borderRadius: '50%',
                boxSizing: 'border-box',
                flex: '0 0 10px',
                height: 10,
                width: 10,
              }}
            />
            <Typography variant="captionSmall">Excluded</Typography>
          </Box>
        </Box>
        <Divider />
        <Typography
          variant="captionSmall"
          component="p"
          color="text.secondary"
          sx={(theme) => ({ mt: theme.jtSpacing.component.sm })}
        >
          <strong>All stations</strong> spans the lowest to highest station value.{' '}
          <strong>Central 90%</strong> excludes the lowest and highest 5%.{' '}
          <strong>Central 50%</strong> excludes the lowest and highest 25%.
        </Typography>
        <Typography
          variant="captionSmall"
          component="p"
          color="text.secondary"
          sx={(theme) => ({ mt: theme.jtSpacing.component.xs })}
        >
          The stations inside the spread can change from day to day; this is not a fixed station-ID
          selection.
        </Typography>
      </ExplorerInfoPopover>
      <ExplorerInfoPopover
        anchor={visibilityInfoAnchor}
        onClose={() => setVisibilityInfoAnchor(null)}
      >
        <Typography variant="caption" color="brand.primaryGreen">
          About scenario overlay
        </Typography>
        <Typography variant="h5" sx={{ '&&': { color: 'brand.primaryGreen' } }}>
          Compare scenarios on the timeline
        </Typography>
        <Typography variant="captionSmall" component="p" color="text.secondary">
          Use the eye controls to add or remove scenario lines from the regional timeline. This
          makes it easier to compare alternative strategies without changing the selected scenario,
          map, or station distribution.
        </Typography>
        <Typography variant="captionSmall" component="p" color="text.secondary">
          The selected scenario is always visible as the{' '}
          <Box component="span" sx={{ color: 'brand.primaryGreen' }}>
            green line
          </Box>
          . Other visible scenarios appear as supporting comparison lines. The{' '}
          <Box component="span" sx={{ color: 'brand.primaryBlue' }}>
            base scenario
          </Box>{' '}
          is represented by the chart reference line and is intentionally omitted from these
          controls.
        </Typography>
      </ExplorerInfoPopover>
      <ExplorerInfoPopover
        anchor={deviationInfoAnchor}
        onClose={() => setDeviationInfoAnchor(null)}
      >
        <Typography variant="caption" color="brand.primaryGreen">
          About current average deviation
        </Typography>
        <Typography variant="h5" sx={{ '&&': { color: 'brand.primaryGreen' } }}>
          How are these values computed?
        </Typography>
        <Typography variant="captionSmall" component="p" color="text.secondary">
          The{' '}
          <Box component="span" sx={{ color: 'brand.primaryBlue' }}>
            µS/cm value
          </Box>{' '}
          is the average EC difference between the{' '}
          <Box component="span" sx={{ color: 'brand.primaryGreen' }}>
            selected scenario
          </Box>{' '}
          and the{' '}
          <Box component="span" sx={{ color: 'brand.primaryBlue' }}>
            selected base scenario
          </Box>{' '}
          across the stations in the selected spread and region on the displayed date. It is the
          same value shown here when Values is switched to µS/cm.
        </Typography>
        <Divider />
        <Typography variant="captionSmall" component="p" color="text.secondary">
          The{' '}
          <Box component="span" sx={{ color: 'brand.primaryGreen' }}>
            percent change
          </Box>{' '}
          expresses the selected scenario relative to the selected base scenario. It divides that
          average EC difference by the region’s average selected base-scenario period-mean EC:
        </Typography>
        <Box
          sx={(theme) => ({
            bgcolor: 'surface',
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
            p: theme.jtSpacing.component.sm,
            textAlign: 'center',
          })}
        >
          <Typography variant="captionSmall">
            Percent change = 100 × average EC difference ÷ regional average selected base-scenario
            period-mean EC
          </Typography>
        </Box>
        <Typography variant="captionSmall" component="p" color="text.secondary">
          Because both values use the same average EC difference, they always have the same
          direction. Positive values indicate saltier conditions than the selected base scenario;
          negative values indicate fresher conditions.
        </Typography>
      </ExplorerInfoPopover>
      <ChartSvg
        data={data}
        d1641Data={d1641Data}
        dashboardMode={dashboardMode}
        region={region}
        lassoStationIds={lassoStationIds}
        activeKeys={activeKeys}
        dateIndex={dateIndex}
        onDateChange={onDateChange}
        onDateCommit={onDateCommit}
        rangeMode={rangeMode}
        selectedScenarioKey={selectedScenario.key}
        selectedScenarioLabel={selectedScenario.label}
        hoveredScenarioKey={hoveredScenarioKey}
        baseScenarioKey={baseScenarioKey}
        baseScenarioLabel={baseScenarioLabel}
        timeframeFocus={enableDateHighlights ? timeframeFocus : 'all'}
        onTimeframeFocusChange={setTimeframeFocus}
        enableDateHighlights={enableDateHighlights}
        showTimeframeSelector={showTimeframeSelector}
        units={units}
        reading={compact ? deviationReading : null}
      />
    </Paper>
  )
}
