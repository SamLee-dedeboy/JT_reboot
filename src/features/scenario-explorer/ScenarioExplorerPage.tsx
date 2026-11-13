import { useEffect, useMemo, useRef, useState, useTransition, type ReactNode } from 'react'
import {
  Box,
  CircularProgress,
  IconButton,
  Link,
  ListSubheader,
  MenuItem,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import { explorerControl } from '@/theme'
import { explorerFontSizes, explorerTypographyTheme, useCompactExplorer } from './explorerType'
import { summarizeSpread } from './format'
import { assetUrl } from '@/utils/baseUrl'
import DeltaMap from './components/DeltaMap'
import RegionalChart from './components/RegionalChart'
import StationHistogram from './components/StationHistogram'
import ExplorerHeader from './components/ExplorerHeader'
import SalinityScale from './components/SalinityScale'
import ExplorerInfoPopover from './components/ExplorerInfoPopover'
import { ControlLabel, InfoButton, LabeledSelect } from './components/controls'
import {
  menuGroupHeadDividedSx,
  menuGroupHeadSx,
  menuItemSx,
  segmentedSx,
  smallIconSx,
} from './components/controlStyles'
import ExplorerTutorial from './components/ExplorerTutorial'
import type {
  D1641Dataset,
  DashboardMode,
  HistogramBrush,
  ModelKey,
  RangeMode,
  Scenario,
  ScenarioDataset,
  ScenarioDatasets,
  ValueMode,
  ValueSeries,
} from './types'
import { scenarioCodeForLabel } from '@/content/names'

const DATASET_CONFIG: Record<DashboardMode, { key: keyof ScenarioDatasets; url: string }> = {
  'rma-scenarios': {
    key: 'rmaScenarios',
    url: '/data/salinity/scenario-explorer/salinity_dashboard.json',
  },
  'rma-schism': {
    key: 'rmaSchism',
    url: '/data/salinity/scenario-explorer/rma_schism_dashboard.json',
  },
  'rma-calsim': {
    key: 'rmaCalsim',
    url: '/data/salinity/scenario-explorer/rma_calsim_dashboard.json',
  },
  'calsim-scenarios': {
    key: 'calsimScenarios',
    url: '/data/salinity/scenario-explorer/calsim_scenarios_dashboard.json',
  },
  'tiered-outflows': {
    key: 'tieredOutflows',
    url: '/data/salinity/scenario-explorer/tiered_outflows_dashboard.json',
  },
  'schism-runs': {
    key: 'schismRuns',
    url: '/data/salinity/scenario-explorer/schism_runs_dashboard.json',
  },
  'slr-current': {
    key: 'slrScenarios',
    url: '/data/salinity/scenario-explorer/slr_scenarios_dashboard.json',
  },
  'slr-scenarios': {
    key: 'slrScenarios',
    url: '/data/salinity/scenario-explorer/slr_scenarios_dashboard.json',
  },
}

const renameBaseline = (label: string) => label.replace(/\bBaseline\b/gi, 'Business as Usual')
const isModelComparisonMode = (mode: DashboardMode) =>
  mode === 'rma-schism' || mode === 'rma-calsim'
const SLR_SCENARIO_ORDER = [
  'baseline-slr',
  'baseline-calsim-slr',
  'bolster-slr',
  'ecomachine-slr',
  'newgreen-slr',
  'reserve-slr',
  'tunnel-slr',
]
const calsimFamilyScenarios = new Set(['reserve', 'tunnel', 'reserve-slr', 'tunnel-slr'])
const requiredComparisonBaseline = (mode: DashboardMode, scenarioKey: string) => {
  if (!calsimFamilyScenarios.has(scenarioKey)) return null
  if (mode === 'rma-scenarios') return 'baseline-calsim'
  if (mode === 'slr-scenarios') return 'baseline-calsim-slr'
  return null
}
const scenarioAbbreviation = (label: string) => scenarioCodeForLabel(label)

function ResponsiveScenarioLabel({
  fullName = false,
  label,
}: {
  fullName?: boolean
  label: string
}) {
  if (fullName) return label

  return (
    <>
      <Box component="span" sx={{ display: { xs: 'none', xl: 'inline' } }}>
        {label}
      </Box>
      <Box component="span" sx={{ display: { xs: 'inline', xl: 'none' } }}>
        {scenarioAbbreviation(label)}
      </Box>
    </>
  )
}

// Lists that mix Business as Usual with the scenarios compared against it are split in two
// groups; the head names the second group.
const SCENARIO_GROUP_HEAD: Partial<Record<DashboardMode, string>> = {
  'rma-scenarios': 'Adaptation scenarios',
  'calsim-scenarios': 'Adaptation scenarios',
  'tiered-outflows': 'Outflow changes',
}

const isBaselineScenario = (item: Scenario) =>
  item.key.startsWith('baseline') || /^business as usual/i.test(item.label)

/** A scenario dropdown's rows, under group heads where the mode has them. */
function scenarioMenuItems(
  items: Scenario[],
  mode: DashboardMode,
  fullName: boolean,
  isDisabled: (key: string) => boolean,
) {
  const row = (item: Scenario) => (
    <MenuItem disabled={isDisabled(item.key)} key={item.key} value={item.key} sx={menuItemSx}>
      <ResponsiveScenarioLabel fullName={fullName} label={item.label} />
    </MenuItem>
  )
  const head = SCENARIO_GROUP_HEAD[mode]
  const baselines = items.filter(isBaselineScenario)
  const others = items.filter((item) => !isBaselineScenario(item))
  if (!head || baselines.length === 0 || others.length === 0) return items.map(row)

  return [
    <ListSubheader key="group-baseline" disableSticky sx={menuGroupHeadSx}>
      {baselines.length > 1 ? 'Baselines' : 'Baseline'}
    </ListSubheader>,
    ...baselines.map(row),
    <ListSubheader key="group-scenarios" disableSticky sx={menuGroupHeadDividedSx}>
      {head}
    </ListSubheader>,
    ...others.map(row),
  ]
}

function SwapButton({
  disabled = false,
  onClick,
  label = 'Swap base and selected scenarios',
}: {
  disabled?: boolean
  onClick: () => void
  label?: string
}) {
  return (
    <IconButton
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      sx={{
        ...smallIconSx,
        alignSelf: 'flex-end',
        border: 1,
        borderColor: 'border.strong',
        color: 'text.secondary',
        flex: '0 0 auto',
        height: explorerControl.height,
        p: 0,
        width: explorerControl.height,
      }}
    >
      <SwapHorizIcon />
    </IconButton>
  )
}

interface ScenarioExplorerPageProps {
  enableDateHighlights?: boolean
  enableSlrModes?: boolean
  d1641StationsOnly?: boolean
  publicModesOnly?: boolean
}

function filterDatasetToStations(dataset: ScenarioDataset, stationIds: Set<string>) {
  const includedIndices = dataset.stations
    .map((station, index) => (stationIds.has(String(station.station_id)) ? index : -1))
    .filter((index) => index >= 0)
  const stations = includedIndices.map((index) => dataset.stations[index])
  const regions = dataset.regions.filter((regionName) =>
    stations.some((station) => station.region === regionName),
  )
  const filterSeries = (series: ValueSeries[]) => includedIndices.map((index) => series[index])
  const regionValues = (stationValues: ValueSeries[]) =>
    Object.fromEntries(
      regions.map((regionName) => {
        const indices = stations
          .map((station, index) => (station.region === regionName ? index : -1))
          .filter((index) => index >= 0)
        return [
          regionName,
          dataset.dates.map((_, dateIndex) => {
            const values = indices
              .map((index) => stationValues[index]?.[dateIndex])
              .filter((value): value is number => value != null && Number.isFinite(value))
            return values.length
              ? values.reduce((sum, value) => sum + value, 0) / values.length
              : null
          }),
        ]
      }),
    )

  return {
    ...dataset,
    stations,
    regions,
    referenceStationValues: dataset.referenceStationValues
      ? filterSeries(dataset.referenceStationValues)
      : undefined,
    referenceStationValuesByKey: dataset.referenceStationValuesByKey
      ? Object.fromEntries(
          Object.entries(dataset.referenceStationValuesByKey).map(([key, series]) => [
            key,
            filterSeries(series),
          ]),
        )
      : undefined,
    scenarios: dataset.scenarios.map((scenario) => {
      const stationValues = filterSeries(scenario.stationValues)
      return {
        ...scenario,
        stationValues,
        regionValues: regionValues(stationValues),
        referenceStationValues: scenario.referenceStationValues
          ? filterSeries(scenario.referenceStationValues)
          : undefined,
      }
    }),
  }
}

export default function ScenarioExplorerPage({
  enableDateHighlights = false,
  enableSlrModes = false,
  d1641StationsOnly = false,
  publicModesOnly = false,
}: ScenarioExplorerPageProps) {
  const [datasets, setDatasets] = useState<Partial<ScenarioDatasets> | null>(null)
  const [d1641Data, setD1641Data] = useState<D1641Dataset | null>(null)
  const [schismD1641Data, setSchismD1641Data] = useState<D1641Dataset | null>(null)
  const [slrD1641Data, setSlrD1641Data] = useState<D1641Dataset | null>(null)
  const [calsimD1641Data, setCalsimD1641Data] = useState<D1641Dataset | null>(null)
  const [dashboardMode, setDashboardMode] = useState<DashboardMode>('rma-scenarios')
  const [baseScenario, setBaseScenario] = useState('baseline')
  const [scenario, setScenario] = useState('bolster')
  const [region, setRegion] = useState('All regions')
  const [dateIndex, setDateIndex] = useState(0)
  const [histogramDateIndex, setHistogramDateIndex] = useState(0)
  const [activeKeys, setActiveKeys] = useState<string[]>(['bolster'])
  const [histogramBrush, setHistogramBrush] = useState<HistogramBrush>(null)
  const [lassoStationIds, setLassoStationIds] = useState<string[]>([])
  const lassoed = useMemo(() => new Set(lassoStationIds), [lassoStationIds])
  const [valueMode, setValueMode] = useState<ValueMode>('percent')
  const [rangeMode, setRangeMode] = useState<RangeMode>('minmax')
  const [selectedModel, setSelectedModel] = useState<ModelKey>('schism')
  const [isModeTransitioning, setIsModeTransitioning] = useState(false)
  const [regionInfoAnchor, setRegionInfoAnchor] = useState<HTMLButtonElement | null>(null)
  const [valuesInfoAnchor, setValuesInfoAnchor] = useState<HTMLButtonElement | null>(null)
  const [tutorialOpen, setTutorialOpen] = useState(false)
  const [isChartExpanded, setIsChartExpanded] = useState(false)
  const compactScenarioLabel = (label: string) =>
    publicModesOnly ? undefined : scenarioAbbreviation(label)

  useEffect(() => {
    // Expansion is only meaningful while at least two scenario lines are visible.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (activeKeys.length <= 1 && isChartExpanded) setIsChartExpanded(false)
  }, [activeKeys.length, isChartExpanded])
  const [, startTransition] = useTransition()
  const compact = useCompactExplorer()
  const modeTransitionTimerRef = useRef<number | null>(null)
  const dateFrameRef = useRef<number | null>(null)
  const pendingDateIndexRef = useRef(0)

  useEffect(
    () => () => {
      if (modeTransitionTimerRef.current !== null)
        window.clearTimeout(modeTransitionTimerRef.current)
      if (dateFrameRef.current !== null) window.cancelAnimationFrame(dateFrameRef.current)
    },
    [],
  )

  useEffect(() => {
    const initialMode: DashboardMode = 'rma-scenarios'
    const initialConfig = DATASET_CONFIG[initialMode]
    Promise.all([
      fetch(assetUrl(initialConfig.url)).then(
        (response) => response.json() as Promise<ScenarioDataset>,
      ),
      fetch(assetUrl('/data/salinity/scenario-explorer/d1641_rma.json')).then(
        (response) => response.json() as Promise<D1641Dataset>,
      ),
    ]).then(([initialData, compliance]) => {
      setDatasets({ [initialConfig.key]: initialData })
      setD1641Data(compliance)
      setDateIndex(0)
      setHistogramDateIndex(0)
    })
  }, [])

  const sourceData =
    dashboardMode === 'rma-schism'
      ? datasets?.rmaSchism
      : dashboardMode === 'rma-calsim'
        ? datasets?.rmaCalsim
        : dashboardMode === 'calsim-scenarios'
          ? datasets?.calsimScenarios
          : dashboardMode === 'tiered-outflows'
            ? datasets?.tieredOutflows
            : dashboardMode === 'schism-runs'
              ? datasets?.schismRuns
              : dashboardMode === 'slr-current' || dashboardMode === 'slr-scenarios'
                ? datasets?.slrScenarios
                : datasets?.rmaScenarios

  const d1641StationIds = useMemo(() => {
    if (!d1641Data) return null
    return new Set(
      Object.values(d1641Data.scenarios).flatMap((scenarioCompliance) =>
        Object.keys(scenarioCompliance.stations),
      ),
    )
  }, [d1641Data])
  const data = useMemo(
    () =>
      sourceData && d1641StationsOnly && d1641StationIds
        ? filterDatasetToStations(sourceData, d1641StationIds)
        : sourceData,
    [d1641StationIds, d1641StationsOnly, sourceData],
  )

  const selectDashboardMode = async (nextMode: DashboardMode) => {
    if (!datasets || nextMode === dashboardMode) return
    if (modeTransitionTimerRef.current !== null) window.clearTimeout(modeTransitionTimerRef.current)
    setIsModeTransitioning(true)
    const config = DATASET_CONFIG[nextMode]
    let nextData = datasets[config.key]
    if (!nextData) {
      const [loadedData, loadedCompliance] = await Promise.all([
        fetch(assetUrl(config.url)).then((response) => response.json() as Promise<ScenarioDataset>),
        (nextMode === 'rma-schism' || nextMode === 'schism-runs') && !schismD1641Data
          ? fetch(assetUrl('/data/salinity/scenario-explorer/d1641_schism.json')).then(
              (response) => response.json() as Promise<D1641Dataset>,
            )
          : (nextMode === 'slr-current' || nextMode === 'slr-scenarios') && !slrD1641Data
            ? fetch(assetUrl('/data/salinity/scenario-explorer/d1641_rma_slr.json')).then(
                (response) => response.json() as Promise<D1641Dataset>,
              )
            : (nextMode === 'rma-calsim' || nextMode === 'calsim-scenarios') && !calsimD1641Data
              ? fetch(assetUrl('/data/salinity/scenario-explorer/d1641_calsim.json')).then(
                  (response) => response.json() as Promise<D1641Dataset>,
                )
              : Promise.resolve(null),
      ])
      nextData = loadedData
      if (loadedCompliance) {
        if (nextMode === 'slr-current' || nextMode === 'slr-scenarios')
          setSlrD1641Data(loadedCompliance)
        else if (nextMode === 'rma-calsim' || nextMode === 'calsim-scenarios')
          setCalsimD1641Data(loadedCompliance)
        else setSchismD1641Data(loadedCompliance)
      }
      setDatasets((current) => ({ ...current, [config.key]: nextData }))
    }
    if (!nextData) return
    if (nextMode === 'rma-schism') {
      setBaseScenario('rma')
      setSelectedModel('schism')
      setScenario('baseline')
      setActiveKeys(['baseline'])
    } else if (nextMode === 'rma-calsim') {
      setBaseScenario('rma')
      setSelectedModel('calsim')
      setScenario('baseline-calsim')
      setActiveKeys(['baseline-calsim'])
    } else if (nextMode === 'calsim-scenarios') {
      setBaseScenario('baseline-calsim')
      setScenario('reserve-calsim')
      setActiveKeys(['reserve-calsim'])
    } else if (nextMode === 'tiered-outflows') {
      setBaseScenario('run15')
      setScenario('run16')
      setActiveKeys(['run16'])
    } else if (nextMode === 'schism-runs') {
      setBaseScenario('run27')
      setScenario('run30')
      setActiveKeys(['run30'])
    } else if (nextMode === 'slr-current') {
      setBaseScenario('baseline')
      setScenario('baseline-slr')
      setActiveKeys(['baseline-slr'])
    } else if (nextMode === 'slr-scenarios') {
      setBaseScenario('baseline-slr')
      setScenario('bolster-slr')
      setActiveKeys(['bolster-slr'])
    } else {
      setBaseScenario('baseline')
      setScenario('bolster')
      setActiveKeys(['bolster'])
    }
    setRegion('All regions')
    const nextDateIndex = 0
    setDateIndex(nextDateIndex)
    setHistogramDateIndex(nextDateIndex)
    setHistogramBrush(null)
    setLassoStationIds([])
    setDashboardMode(nextMode)
    modeTransitionTimerRef.current = window.setTimeout(() => {
      setIsModeTransitioning(false)
      modeTransitionTimerRef.current = null
    }, 420)
  }

  const scenarioOptions = useMemo(() => {
    if (!data) return []
    if (dashboardMode === 'slr-current' || dashboardMode === 'slr-scenarios')
      return data.scenarios
        .filter((item) => item.climateCondition === 'slr')
        .sort((a, b) => SLR_SCENARIO_ORDER.indexOf(a.key) - SLR_SCENARIO_ORDER.indexOf(b.key))
    if (dashboardMode === 'tiered-outflows')
      return data.scenarios.map((item) => {
        if (item.key === 'run15') return { ...item, label: 'Business As Usual' }
        if (item.key === 'run16') return { ...item, label: '+30% Delta outflow' }
        if (item.key === 'run17') return { ...item, label: '-10% Delta outflow' }
        return item
      })
    if (dashboardMode === 'schism-runs') return data.scenarios
    if (dashboardMode !== 'rma-scenarios' && dashboardMode !== 'calsim-scenarios')
      return data.scenarios.map((item) => ({ ...item, label: renameBaseline(item.label) }))
    const zeroSeries = data.dates.map(() => 0)
    const baseline: Scenario = {
      key: dashboardMode === 'calsim-scenarios' ? 'baseline-calsim' : 'baseline',
      label:
        dashboardMode === 'calsim-scenarios' ? 'Business as Usual (CalSim)' : 'Business as Usual',
      stationValues: data.stations.map(() => zeroSeries),
      regionValues: Object.fromEntries(data.regions.map((regionName) => [regionName, zeroSeries])),
    }
    return [baseline, ...data.scenarios]
  }, [dashboardMode, data])
  // Mode 01 offers BaseCalSim only as the locked base COR and TUN are computed against.
  const hiddenScenarioKey = dashboardMode === 'rma-scenarios' ? 'baseline-calsim' : null
  const comparisonBaseLabel = useMemo(
    () =>
      isModelComparisonMode(dashboardMode)
        ? baseScenario.toUpperCase()
        : dashboardMode === 'slr-current'
          ? `Current ${scenarioOptions.find((item) => item.key === scenario)?.label.replace(/\s*\(SLR\)$/, '') ?? 'scenario'}`
          : scenarioOptions.find((item) => item.key === baseScenario)?.label || 'Business as Usual',
    [baseScenario, dashboardMode, scenario, scenarioOptions],
  )
  const rawComparisonData = useMemo<ScenarioDataset | undefined>(() => {
    if (!data) return data
    if (isModelComparisonMode(dashboardMode)) {
      const comparisonModel = dashboardMode === 'rma-calsim' ? 'calsim' : 'schism'
      if (baseScenario === 'rma' && selectedModel === comparisonModel)
        return { ...data, scenarios: scenarioOptions }
      return {
        ...data,
        scenarios: scenarioOptions.map((item) => ({
          ...item,
          stationValues: item.stationValues.map((values) =>
            values.map((value) => (value == null ? null : -value)),
          ),
          regionValues: Object.fromEntries(
            Object.entries(item.regionValues).map(([regionName, values]) => [
              regionName,
              values.map((value) => (value == null ? null : -value)),
            ]),
          ),
        })),
      }
    }
    if (dashboardMode === 'slr-current') {
      const byKey = new Map(data.scenarios.map((item) => [item.key, item]))
      const subtractSeries = (
        values: ValueSeries,
        baseValues: ValueSeries | undefined,
        usesCurrentBaseline: boolean,
      ) =>
        values.map((value, index) => {
          const baseValue = usesCurrentBaseline ? 0 : baseValues?.[index]
          return value == null || baseValue == null ? null : value - baseValue
        })
      return {
        ...data,
        scenarios: scenarioOptions.map((item) => {
          const counterpart = byKey.get(item.currentCounterpart ?? '')
          const usesCurrentBaseline = item.currentCounterpart === 'baseline'
          return {
            ...item,
            stationValues: item.stationValues.map((values, stationIndex) =>
              subtractSeries(values, counterpart?.stationValues[stationIndex], usesCurrentBaseline),
            ),
            regionValues: Object.fromEntries(
              Object.entries(item.regionValues).map(([regionName, values]) => [
                regionName,
                subtractSeries(values, counterpart?.regionValues[regionName], usesCurrentBaseline),
              ]),
            ),
          }
        }),
      }
    }
    const base = scenarioOptions.find((item) => item.key === baseScenario)
    if (!base) return data

    const subtractSeries = (values: ValueSeries, baseValues?: ValueSeries) =>
      values.map((value, index) => {
        const baseValue = baseValues?.[index]
        return value == null || baseValue == null ? null : value - baseValue
      })

    const compared: ScenarioDataset = {
      ...data,
      scenarios: scenarioOptions.map((item) => ({
        ...item,
        stationValues: item.stationValues.map((values, stationIndex) =>
          subtractSeries(values, base.stationValues[stationIndex]),
        ),
        regionValues: Object.fromEntries(
          Object.entries(item.regionValues).map(([regionName, values]) => [
            regionName,
            subtractSeries(values, base.regionValues[regionName]),
          ]),
        ),
      })),
    }
    if (dashboardMode !== 'schism-runs') return compared

    const selected = scenarioOptions.find((item) => item.key === scenario)
    if (!selected) return compared
    const available = data.dates.map((_, dateIndex) =>
      base.stationValues.some(
        (values, stationIndex) =>
          values[dateIndex] != null && selected.stationValues[stationIndex]?.[dateIndex] != null,
      ),
    )
    const first = available.findIndex(Boolean)
    const last = available.findLastIndex(Boolean)
    if (first < 0 || last < first) return compared
    const sliceSeries = (values: ValueSeries) => values.slice(first, last + 1)
    return {
      ...compared,
      dates: compared.dates.slice(first, last + 1),
      referenceStationValues: compared.referenceStationValues?.map(sliceSeries),
      scenarios: compared.scenarios.map((item) => ({
        ...item,
        stationValues: item.stationValues.map(sliceSeries),
        regionValues: Object.fromEntries(
          Object.entries(item.regionValues).map(([regionName, values]) => [
            regionName,
            sliceSeries(values),
          ]),
        ),
        referenceStationValues: item.referenceStationValues?.map(sliceSeries),
      })),
    }
  }, [baseScenario, dashboardMode, data, scenario, scenarioOptions, selectedModel])
  const percentComparisonData = useMemo<ScenarioDataset | undefined>(() => {
    if (!rawComparisonData) return rawComparisonData
    const canonicalReference = rawComparisonData.referenceStationValues
    const baseDeltas =
      !isModelComparisonMode(dashboardMode) && dashboardMode !== 'slr-current'
        ? scenarioOptions.find((item) => item.key === baseScenario)?.stationValues
        : null
    const toPercent = (difference: number | null, reference: number | null) =>
      difference == null || reference == null || reference === 0
        ? null
        : (100 * difference) / reference
    const scenarios = rawComparisonData.scenarios.map((item) => {
      const itemReference =
        item.referenceStationValues ??
        (item.referenceKey
          ? rawComparisonData.referenceStationValuesByKey?.[item.referenceKey]
          : undefined) ??
        canonicalReference
      const stationValues = item.stationValues.map((values, stationIndex) => {
        const pairedCurrent =
          dashboardMode === 'slr-current'
            ? data?.scenarios.find((candidate) => candidate.key === item.currentCounterpart)
            : null
        const referenceSeries =
          dashboardMode === 'schism-runs'
            ? (scenarioOptions.find((scenarioItem) => scenarioItem.key === baseScenario)
                ?.stationValues[stationIndex] ?? [])
            : (itemReference?.[stationIndex]?.map((canonical, dateIndex) => {
                if (canonical == null) return null
                if (dashboardMode === 'slr-current')
                  return canonical + (pairedCurrent?.stationValues[stationIndex]?.[dateIndex] ?? 0)
                if (!isModelComparisonMode(dashboardMode))
                  return canonical + (baseDeltas?.[stationIndex]?.[dateIndex] ?? 0)
                return baseScenario === 'schism' ? canonical - (values[dateIndex] ?? 0) : canonical
              }) ?? [])
        const validReferenceValues = referenceSeries.filter(
          (value): value is number => value != null && Number.isFinite(value),
        )
        const periodMeanReference = validReferenceValues.length
          ? validReferenceValues.reduce((sum, value) => sum + value, 0) /
            validReferenceValues.length
          : null
        return values.map((difference) => toPercent(difference, periodMeanReference))
      })
      const regionValues = Object.fromEntries(
        rawComparisonData.regions.map((regionName) => {
          const indices = rawComparisonData.stations
            .map((station, index) => (station.region === regionName ? index : -1))
            .filter((index) => index >= 0)
          return [
            regionName,
            rawComparisonData.dates.map((_, dateIndex) => {
              const values = indices
                .map((index) => stationValues[index][dateIndex])
                .filter((value): value is number => value != null && Number.isFinite(value))
              return values.length
                ? values.reduce((sum, value) => sum + value, 0) / values.length
                : null
            }),
          ]
        }),
      )
      return { ...item, stationValues, regionValues }
    })
    return { ...rawComparisonData, scenarios, units: '%' }
  }, [rawComparisonData, dashboardMode, scenarioOptions, baseScenario, data])
  const comparisonData = valueMode === 'raw' ? rawComparisonData : percentComparisonData
  const selectBaseScenario = (nextBaseScenario: string) => {
    const nextMapScenario = nextBaseScenario === scenario ? baseScenario : scenario
    startTransition(() => {
      setBaseScenario(nextBaseScenario)
      setScenario(nextMapScenario)
      setActiveKeys([nextMapScenario])
      setHistogramBrush(null)
      if (dashboardMode === 'schism-runs') {
        setDateIndex(0)
        setHistogramDateIndex(0)
      }
    })
  }
  const selectMapScenario = (nextMapScenario: string) => {
    if (nextMapScenario === baseScenario) return
    const requiredBase = requiredComparisonBaseline(dashboardMode, nextMapScenario)
    const leavingCalsimFamily =
      !requiredBase &&
      (baseScenario === 'baseline-calsim' || baseScenario === 'baseline-calsim-slr')
    startTransition(() => {
      if (requiredBase) setBaseScenario(requiredBase)
      else if (leavingCalsimFamily)
        setBaseScenario(dashboardMode === 'slr-scenarios' ? 'baseline-slr' : 'baseline')
      setScenario(nextMapScenario)
      setActiveKeys([nextMapScenario])
      setHistogramBrush(null)
      if (dashboardMode === 'schism-runs') {
        setDateIndex(0)
        setHistogramDateIndex(0)
      }
    })
  }
  const selectSlrFamily = (nextSlrScenario: string) => {
    const next = scenarioOptions.find((item) => item.key === nextSlrScenario)
    if (!next?.currentCounterpart) return
    startTransition(() => {
      setBaseScenario(next.currentCounterpart!)
      setScenario(nextSlrScenario)
      setActiveKeys([nextSlrScenario])
      setHistogramBrush(null)
    })
  }
  const selectDateIndex = (nextDateIndex: number) => {
    pendingDateIndexRef.current = nextDateIndex
    if (dateFrameRef.current !== null) return
    dateFrameRef.current = window.requestAnimationFrame(() => {
      setDateIndex(pendingDateIndexRef.current)
      dateFrameRef.current = null
    })
  }

  const commitDateIndex = (nextDateIndex: number) => {
    if (dateFrameRef.current !== null) {
      window.cancelAnimationFrame(dateFrameRef.current)
      dateFrameRef.current = null
    }
    setDateIndex(nextDateIndex)
    setHistogramDateIndex(nextDateIndex)
  }
  const selectRegion = (nextRegion: string) => {
    startTransition(() => {
      setLassoStationIds([])
      setRegion(nextRegion)
      setHistogramBrush(null)
    })
  }
  const swapScenarios = () => {
    const previousBase = baseScenario
    startTransition(() => {
      setBaseScenario(scenario)
      setScenario(previousBase)
      setActiveKeys([previousBase])
      setHistogramBrush(null)
      if (dashboardMode === 'schism-runs') {
        setDateIndex(0)
        setHistogramDateIndex(0)
      }
    })
  }
  const selectedScenario = useMemo<Scenario | undefined>(
    () => comparisonData?.scenarios.find((item) => item.key === scenario),
    [comparisonData, scenario],
  )
  const rawSelectedScenario = useMemo(
    () => rawComparisonData?.scenarios.find((item) => item.key === scenario),
    [rawComparisonData, scenario],
  )
  const chartD1641Data = useMemo<D1641Dataset | null>(() => {
    if (dashboardMode === 'rma-scenarios') return d1641Data
    if (dashboardMode === 'calsim-scenarios') return calsimD1641Data
    if (dashboardMode === 'schism-runs') return schismD1641Data
    if (dashboardMode === 'slr-scenarios') return slrD1641Data
    if (dashboardMode === 'slr-current') {
      if (!d1641Data || !slrD1641Data) return null
      const currentCompliance = d1641Data.scenarios[baseScenario]
      const slrCompliance = slrD1641Data.scenarios[scenario]
      if (!currentCompliance || !slrCompliance) return null
      return {
        source: `${d1641Data.source}; ${slrD1641Data.source}`,
        generatedFrom: `${d1641Data.generatedFrom}; ${slrD1641Data.generatedFrom}`,
        scenarios: {
          [baseScenario]: currentCompliance,
          [scenario]: slrCompliance,
        },
      }
    }
    if (dashboardMode === 'rma-calsim') {
      if (!d1641Data || !calsimD1641Data) return null
      const originalKey = scenario.replace(/-calsim$/, '')
      const originalCompliance = d1641Data.scenarios[originalKey]
      const calsimCompliance = calsimD1641Data.scenarios[scenario]
      if (!originalCompliance || !calsimCompliance) return null
      const byModel = { rma: originalCompliance, calsim: calsimCompliance }
      return {
        source: `${d1641Data.source}; ${calsimD1641Data.source}`,
        generatedFrom: `${d1641Data.generatedFrom}; ${calsimD1641Data.generatedFrom}`,
        scenarios: {
          [baseScenario]: byModel[baseScenario as 'rma' | 'calsim'],
          [scenario]: byModel[selectedModel as 'rma' | 'calsim'],
        },
      }
    }
    if (dashboardMode !== 'rma-schism' || !d1641Data || !schismD1641Data) return null
    const schismScenarioKey = (
      { baseline: 'run27', reserve: 'run30', tunnel: 'run31' } as Record<string, string>
    )[scenario]
    const rmaCompliance = d1641Data.scenarios[scenario]
    const schismCompliance = schismD1641Data.scenarios[schismScenarioKey]
    if (!rmaCompliance || !schismCompliance) return null
    const byModel = { rma: rmaCompliance, schism: schismCompliance }
    return {
      source: `${d1641Data.source}; ${schismD1641Data.source}`,
      generatedFrom: `${d1641Data.generatedFrom}; ${schismD1641Data.generatedFrom}`,
      scenarios: {
        [baseScenario]: byModel[baseScenario as 'rma' | 'schism'],
        [scenario]: byModel[selectedModel as 'rma' | 'schism'],
      },
    }
  }, [
    baseScenario,
    calsimD1641Data,
    d1641Data,
    dashboardMode,
    scenario,
    schismD1641Data,
    selectedModel,
    slrD1641Data,
  ])
  const mapExtent = useMemo(() => {
    if (!comparisonData || !selectedScenario) return 1
    const stationIndices = comparisonData.stations
      .map((station, index) => ({ station, index }))
      .filter(({ station }) => region === 'All regions' || station.region === region)
      .map(({ index }) => index)
    const magnitudes = stationIndices
      .flatMap((index) => selectedScenario.stationValues[index])
      .filter((value): value is number => value != null)
      .map(Math.abs)
      .sort((a, b) => a - b)
    return Math.max(1, magnitudes[Math.floor((magnitudes.length - 1) * 0.9)] || 1)
  }, [comparisonData, selectedScenario, region])
  const currentRegionValue = (item: Scenario | undefined) => {
    if (!item) return null
    if (rangeMode !== 'minmax' || lassoed.size) {
      const inRegion = item.stationValues
        .filter((_, index) => {
          const station = rawComparisonData?.stations[index]
          return (
            (region === 'All regions' || station?.region === region) &&
            (!lassoed.size || lassoed.has(String(station?.station_id)))
          )
        })
        .map((series) => series[dateIndex])
        .filter((value): value is number => value != null && Number.isFinite(value))
      return summarizeSpread(inRegion, rangeMode).average
    }
    const values = item.stationValues
      .map((series) => series[dateIndex])
      .filter((value): value is number => value != null)
    return region === 'All regions'
      ? values.reduce((sum, value) => sum + value, 0) / (values.length || 1)
      : item.regionValues[region][dateIndex]
  }
  const rawRegionValue = currentRegionValue(rawSelectedScenario)
  const regionalBaseMean = useMemo(() => {
    if (!rawComparisonData || !rawSelectedScenario) return null
    const canonicalReference = rawComparisonData.referenceStationValues
    const itemReference = rawSelectedScenario.referenceStationValues ?? canonicalReference
    const baseDeltas =
      !isModelComparisonMode(dashboardMode) && dashboardMode !== 'slr-current'
        ? scenarioOptions.find((item) => item.key === baseScenario)?.stationValues
        : null
    const pairedCurrent =
      dashboardMode === 'slr-current'
        ? data?.scenarios.find((item) => item.key === rawSelectedScenario.currentCounterpart)
        : null
    const stationIndices = rawComparisonData.stations
      .map((station, index) =>
        (region === 'All regions' || station.region === region) &&
        (!lassoed.size || lassoed.has(String(station.station_id)))
          ? index
          : -1,
      )
      .filter((index) => index >= 0)
    const stationMeans = stationIndices
      .map((stationIndex) => {
        const references =
          (dashboardMode === 'schism-runs'
            ? scenarioOptions.find((scenarioItem) => scenarioItem.key === baseScenario)
                ?.stationValues[stationIndex]
            : itemReference?.[stationIndex]?.map((canonical, referenceDateIndex) => {
                if (canonical == null) return null
                if (dashboardMode === 'slr-current')
                  return (
                    canonical +
                    (pairedCurrent?.stationValues[stationIndex]?.[referenceDateIndex] ?? 0)
                  )
                if (!isModelComparisonMode(dashboardMode))
                  return canonical + (baseDeltas?.[stationIndex]?.[referenceDateIndex] ?? 0)
                return baseScenario === 'schism'
                  ? canonical -
                      (rawSelectedScenario.stationValues[stationIndex][referenceDateIndex] ?? 0)
                  : canonical
              })
          )?.filter((value): value is number => value != null && Number.isFinite(value)) ?? []
        return references.length
          ? references.reduce((sum, value) => sum + value, 0) / references.length
          : null
      })
      .filter((value): value is number => value != null && Number.isFinite(value))
    return stationMeans.length
      ? stationMeans.reduce((sum, value) => sum + value, 0) / stationMeans.length
      : null
  }, [
    baseScenario,
    dashboardMode,
    data,
    lassoed,
    rawComparisonData,
    rawSelectedScenario,
    region,
    scenarioOptions,
  ])
  const percentRegionValue =
    rawRegionValue == null || regionalBaseMean == null || regionalBaseMean === 0
      ? null
      : (100 * rawRegionValue) / regionalBaseMean
  if (!datasets || !data || !comparisonData || !selectedScenario) {
    return (
      <Box sx={{ display: 'grid', minHeight: '100dvh', placeItems: 'center' }}>
        <Stack sx={(theme) => ({ alignItems: 'center', gap: theme.jtSpacing.gap.sm })}>
          <CircularProgress color="primary" />
          <Typography variant="caption" color="text.secondary">
            Loading scenario explorer…
          </Typography>
        </Stack>
      </Box>
    )
  }
  const headerDescription = d1641StationsOnly
    ? `D-1641 station view · showing only the ${data.stations.length} mapped Decision 1641 monitoring locations. The map, regional timeline, and station distribution are all recalculated from this subset.`
    : `Explore salinity changes across scenarios, regions, stations, and time with the linked map, timeline, and station distribution. See Tutorial for help.${publicModesOnly ? '' : ' If the layout feels crowded, use a larger screen or zoom out in your browser (Ctrl/Cmd + −).'}`

  return (
    <ThemeProvider theme={explorerTypographyTheme}>
      <Box
        component="main"
        sx={(theme) => ({
          ...explorerFontSizes(theme),
          bgcolor: 'base.800',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          height: { xs: 'auto', lg: '100dvh' },
          minHeight: { xs: '100dvh', lg: 0 },
          overflow: { xs: 'visible', lg: 'auto' },
          p: {
            xs: theme.jtSpacing.component.sm,
            md: theme.jtSpacing.component.md,
            xl: theme.jtSpacing.component.lg,
          },
          position: 'relative',
        })}
      >
        {isModeTransitioning && (
          <Box
            role="status"
            aria-live="polite"
            sx={{
              alignItems: 'center',
              backdropFilter: 'blur(3px)',
              bgcolor: 'base.800',
              display: 'flex',
              flexDirection: 'column',
              gap: (theme) => theme.jtSpacing.gap.sm,
              inset: 0,
              justifyContent: 'center',
              position: 'absolute',
              zIndex: 20,
            }}
          >
            <CircularProgress sx={{ color: 'common.white' }} />
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Loading comparison…
            </Typography>
          </Box>
        )}
        <ExplorerHeader
          description={headerDescription}
          mode={dashboardMode}
          onModeChange={selectDashboardMode}
          onTutorialOpen={() => setTutorialOpen(true)}
          showSchismRuns={enableDateHighlights}
          showSlrModes={enableSlrModes}
          publicModesOnly={publicModesOnly}
        />
        <ExplorerTutorial
          open={tutorialOpen}
          onClose={() => setTutorialOpen(false)}
          publicModesOnly={publicModesOnly}
        />

        <Box
          sx={(theme) => ({
            alignItems: 'stretch',
            display: 'grid',
            flex: 1,
            gap: theme.jtSpacing.gap.sm,
            gridTemplateColumns: isChartExpanded
              ? 'minmax(0, 1fr)'
              : {
                  xs: '1fr',
                  lg: 'minmax(0, 2.4fr) minmax(18rem, .7fr)',
                  xl: 'minmax(0, 2fr) minmax(20rem, .85fr)',
                },
          })}
        >
          <Box
            sx={(theme) => ({
              display: 'grid',
              gap: theme.jtSpacing.gap.sm,
              // The charts keep their minimum size; a short window scrolls the page instead.
              gridTemplateRows: 'auto minmax(min-content, 1fr)',
              minHeight: 0,
              minWidth: 0,
            })}
          >
            <PaperControls>
              {isModelComparisonMode(dashboardMode) ? (
                <>
                  <LabeledSelect
                    tourId="scenario-controls"
                    label="Base Model"
                    value={baseScenario}
                    onChange={(event) => {
                      const next = event.target.value as ModelKey
                      setBaseScenario(next)
                      setSelectedModel(
                        next === 'rma'
                          ? dashboardMode === 'rma-calsim'
                            ? 'calsim'
                            : 'schism'
                          : 'rma',
                      )
                      setHistogramBrush(null)
                    }}
                  >
                    <MenuItem value="rma" sx={menuItemSx}>
                      RMA
                    </MenuItem>
                    <MenuItem
                      value={dashboardMode === 'rma-calsim' ? 'calsim' : 'schism'}
                      sx={menuItemSx}
                    >
                      {dashboardMode === 'rma-calsim' ? 'CalSim' : 'SCHISM'}
                    </MenuItem>
                  </LabeledSelect>
                  <SwapButton
                    label="Swap base and selected models"
                    onClick={() => {
                      const previousBase = baseScenario as ModelKey
                      setBaseScenario(selectedModel)
                      setSelectedModel(previousBase)
                      setHistogramBrush(null)
                    }}
                  />
                  <LabeledSelect
                    tourId="scenario-controls"
                    label="Selected Model"
                    value={selectedModel}
                    onChange={(event) => {
                      const next = event.target.value as ModelKey
                      setSelectedModel(next)
                      setBaseScenario(
                        next === 'rma'
                          ? dashboardMode === 'rma-calsim'
                            ? 'calsim'
                            : 'schism'
                          : 'rma',
                      )
                      setHistogramBrush(null)
                    }}
                  >
                    <MenuItem value="rma" sx={menuItemSx}>
                      RMA
                    </MenuItem>
                    <MenuItem
                      value={dashboardMode === 'rma-calsim' ? 'calsim' : 'schism'}
                      sx={menuItemSx}
                    >
                      {dashboardMode === 'rma-calsim' ? 'CalSim' : 'SCHISM'}
                    </MenuItem>
                  </LabeledSelect>
                  <LabeledSelect
                    tourId="scenario-controls"
                    label="Scenario"
                    value={scenario}
                    displayValue={scenarioOptions.find((item) => item.key === scenario)?.label}
                    compactValue={compactScenarioLabel(
                      scenarioOptions.find((item) => item.key === scenario)?.label ?? scenario,
                    )}
                    onChange={(event) => selectMapScenario(event.target.value)}
                  >
                    {data.scenarios.map((item) => (
                      <MenuItem key={item.key} value={item.key} sx={menuItemSx}>
                        <ResponsiveScenarioLabel fullName={publicModesOnly} label={item.label} />
                      </MenuItem>
                    ))}
                  </LabeledSelect>
                </>
              ) : dashboardMode === 'slr-current' ? (
                <>
                  <LabeledSelect
                    tourId="scenario-controls"
                    label="Scenario"
                    value={scenario}
                    displayValue={scenarioOptions.find((item) => item.key === scenario)?.label}
                    compactValue={compactScenarioLabel(
                      scenarioOptions.find((item) => item.key === scenario)?.label ?? scenario,
                    )}
                    onChange={(event) => selectSlrFamily(event.target.value)}
                  >
                    {scenarioOptions.map((item) => (
                      <MenuItem key={item.key} value={item.key} sx={menuItemSx}>
                        <ResponsiveScenarioLabel
                          fullName={publicModesOnly}
                          label={item.label.replace(/\s*\(SLR\)$/, '')}
                        />
                      </MenuItem>
                    ))}
                  </LabeledSelect>
                </>
              ) : dashboardMode === 'tiered-outflows' || dashboardMode === 'schism-runs' ? (
                <>
                  <LabeledSelect
                    tourId="scenario-controls"
                    label="Base Scenario"
                    value={baseScenario}
                    displayValue={scenarioOptions.find((item) => item.key === baseScenario)?.label}
                    compactValue={compactScenarioLabel(
                      scenarioOptions.find((item) => item.key === baseScenario)?.label ??
                        baseScenario,
                    )}
                    onChange={(event) => selectBaseScenario(event.target.value)}
                  >
                    {scenarioMenuItems(
                      scenarioOptions,
                      dashboardMode,
                      publicModesOnly,
                      (key) => key === scenario,
                    )}
                  </LabeledSelect>
                  <SwapButton onClick={swapScenarios} />
                  <LabeledSelect
                    tourId="scenario-controls"
                    label="Selected Scenario"
                    value={scenario}
                    displayValue={scenarioOptions.find((item) => item.key === scenario)?.label}
                    compactValue={compactScenarioLabel(
                      scenarioOptions.find((item) => item.key === scenario)?.label ?? scenario,
                    )}
                    onChange={(event) => selectMapScenario(event.target.value)}
                  >
                    {scenarioMenuItems(
                      scenarioOptions,
                      dashboardMode,
                      publicModesOnly,
                      (key) => key === baseScenario,
                    )}
                  </LabeledSelect>
                </>
              ) : (
                <>
                  <LabeledSelect
                    tourId="scenario-controls"
                    label="Base Scenario"
                    value={baseScenario}
                    displayValue={scenarioOptions.find((item) => item.key === baseScenario)?.label}
                    compactValue={compactScenarioLabel(
                      scenarioOptions.find((item) => item.key === baseScenario)?.label ??
                        baseScenario,
                    )}
                    onChange={(event) => selectBaseScenario(event.target.value)}
                  >
                    {scenarioMenuItems(
                      scenarioOptions.filter(
                        (item) => item.key !== hiddenScenarioKey || item.key === baseScenario,
                      ),
                      dashboardMode,
                      publicModesOnly,
                      (key) =>
                        key === scenario ||
                        (requiredComparisonBaseline(dashboardMode, scenario) !== null &&
                          key !== requiredComparisonBaseline(dashboardMode, scenario)),
                    )}
                  </LabeledSelect>
                  <SwapButton
                    disabled={requiredComparisonBaseline(dashboardMode, scenario) !== null}
                    onClick={swapScenarios}
                  />
                  <LabeledSelect
                    tourId="scenario-controls"
                    label="Selected Scenario"
                    value={scenario}
                    displayValue={scenarioOptions.find((item) => item.key === scenario)?.label}
                    compactValue={compactScenarioLabel(
                      scenarioOptions.find((item) => item.key === scenario)?.label ?? scenario,
                    )}
                    onChange={(event) => selectMapScenario(event.target.value)}
                  >
                    {scenarioMenuItems(
                      scenarioOptions.filter((item) => item.key !== hiddenScenarioKey),
                      dashboardMode,
                      publicModesOnly,
                      (key) => key === baseScenario,
                    )}
                  </LabeledSelect>
                </>
              )}
              <LabeledSelect
                tourId="region-values"
                label={compact ? 'Region' : 'Selected Region'}
                fixedBasis={explorerControl.regionBasis}
                value={region}
                infoLabel="About the region definitions"
                onInfoClick={setRegionInfoAnchor}
                onChange={(event) => selectRegion(event.target.value)}
              >
                <MenuItem value="All regions" sx={menuItemSx}>
                  All regions
                </MenuItem>
                {data.regions.map((item) => (
                  <MenuItem key={item} value={item} sx={menuItemSx}>
                    {item}
                  </MenuItem>
                ))}
              </LabeledSelect>
              <Box data-tour="region-values" sx={{ flex: { xs: '1 1 100%', sm: '0 0 auto' } }}>
                <ControlLabel label="Values">
                  <InfoButton label="About value calculations" onClick={setValuesInfoAnchor} />
                </ControlLabel>
                <ToggleButtonGroup
                  exclusive
                  size="small"
                  value={valueMode}
                  onChange={(_, value) => {
                    if (value) {
                      setValueMode(value as ValueMode)
                      setHistogramBrush(null)
                    }
                  }}
                  aria-label="Value display mode"
                  sx={segmentedSx}
                >
                  <ToggleButton value="raw">{'\u00B5S/cm'}</ToggleButton>
                  <ToggleButton value="percent">% change</ToggleButton>
                </ToggleButtonGroup>
              </Box>
              <Box
                data-tour="color-scale"
                sx={{
                  flex: `1 1 ${compact ? explorerControl.compactScaleBasis : explorerControl.scaleBasis}`,
                  minWidth: 0,
                }}
              >
                <SalinityScale extent={mapExtent} units={valueMode === 'percent' ? '%' : 'µS/cm'} />
              </Box>
            </PaperControls>
            <ExplorerInfoPopover
              anchor={regionInfoAnchor}
              onClose={() => setRegionInfoAnchor(null)}
            >
              <Typography variant="caption" color="brand.primaryGreen">
                About selected regions
              </Typography>
              <Typography variant="h5" sx={{ '&&': { color: 'brand.primaryGreen' } }}>
                How are regions defined?
              </Typography>
              <Typography variant="captionSmall" component="p" color="text.secondary">
                Each monitoring station is assigned to an estuary region using the{' '}
                <strong>REGION</strong> field in the project’s station{' '}
                <Link
                  href="https://docs.google.com/spreadsheets/d/1bdGbzRU4dCnA_S8pO347uhh9eaViKDFXfqPmO3AfFaY/edit?usp=sharing"
                  target="_blank"
                  rel="noreferrer"
                  color="brand.primaryBlue"
                >
                  reference workbook
                </Link>
                . Selecting a region filters the map, timeline, and station distribution to stations
                carrying that assignment.
              </Typography>
              <Typography variant="captionSmall" component="p" color="text.secondary">
                <strong>All regions</strong> includes every station available in the active
                comparison.
              </Typography>
            </ExplorerInfoPopover>
            <ExplorerInfoPopover
              anchor={valuesInfoAnchor}
              onClose={() => setValuesInfoAnchor(null)}
            >
              <Typography variant="caption" color="brand.primaryGreen">
                About displayed values
              </Typography>
              <Typography variant="h5" sx={{ '&&': { color: 'brand.primaryGreen' } }}>
                How is percent change calculated?
              </Typography>
              <Typography variant="captionSmall" component="p" color="text.secondary">
                Percent change expresses the{' '}
                <Box component="span" sx={{ color: 'brand.primaryGreen' }}>
                  selected scenario
                </Box>{' '}
                relative to the{' '}
                <Box component="span" sx={{ color: 'brand.primaryBlue' }}>
                  selected base scenario
                </Box>
                . For each station, the explorer calculates the EC difference, then divides it by
                that station’s selected base-scenario period-mean EC.
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
                <Typography variant="captionSmall" component="p" color="common.white">
                  Percent change = 100 × (selected EC − base EC) ÷ selected base-scenario
                  period-mean EC
                </Typography>
              </Box>
              <Typography variant="captionSmall" component="p" color="text.secondary">
                On the map and in the station distribution, this calculation is applied to each
                station. The current average deviation uses the same relationship: it averages the
                EC differences across the selected station spread and the base-scenario references
                across the selected region, or across the lassoed stations when there are any.
              </Typography>
              <Typography variant="captionSmall" component="p" color="text.secondary">
                Positive values indicate saltier conditions than the selected base scenario;
                negative values indicate fresher conditions. If the selected base-scenario reference
                is zero or missing, no percentage is shown.
              </Typography>
              <Typography variant="captionSmall" component="p" color="text.secondary">
                Choose <strong>µS/cm</strong> to view the absolute EC difference instead.
              </Typography>
            </ExplorerInfoPopover>

            <Box
              sx={(theme) => ({
                alignItems: 'stretch',
                display: 'grid',
                gap: theme.jtSpacing.gap.sm,
                gridTemplateColumns: isChartExpanded
                  ? 'minmax(0, 1fr)'
                  : {
                      xs: '1fr',
                      md: 'minmax(0, 1fr) minmax(9rem, .18fr)',
                      lg: 'minmax(0, 1fr) minmax(12rem, .22fr)',
                      xl: 'minmax(0, 1fr) minmax(8rem, .22fr)',
                    },
                minWidth: 0,
              })}
            >
              <RegionalChart
                data={comparisonData}
                d1641Data={chartD1641Data}
                dashboardMode={dashboardMode}
                region={region}
                selectedScenario={selectedScenario}
                baseScenarioKey={baseScenario}
                baseScenarioLabel={comparisonBaseLabel}
                rawRegionValue={rawRegionValue}
                percentRegionValue={percentRegionValue}
                activeKeys={activeKeys}
                onActiveKeysChange={setActiveKeys}
                dateIndex={dateIndex}
                onDateChange={selectDateIndex}
                onDateCommit={commitDateIndex}
                rangeMode={rangeMode}
                onRangeModeChange={setRangeMode}
                units={valueMode === 'percent' ? '%' : 'µS/cm'}
                expanded={isChartExpanded}
                onExpandedChange={setIsChartExpanded}
                enableDateHighlights={enableDateHighlights}
                useFullScenarioNames={publicModesOnly}
                hiddenOverlayKey={hiddenScenarioKey}
                lassoStationIds={lassoStationIds}
                showTimeframeSelector={!publicModesOnly}
              />
              {!isChartExpanded && (
                <StationHistogram
                  data={comparisonData}
                  region={region}
                  lassoStationIds={lassoStationIds}
                  scenario={selectedScenario}
                  dateIndex={histogramDateIndex}
                  onBrushChange={setHistogramBrush}
                  mapExtent={mapExtent}
                  rangeMode={rangeMode}
                  units={valueMode === 'percent' ? '%' : 'µS/cm'}
                />
              )}
            </Box>
          </Box>
          {!isChartExpanded && (
            <DeltaMap
              key={`${dashboardMode}-map`}
              data={comparisonData}
              d1641Data={
                dashboardMode === 'rma-scenarios'
                  ? d1641Data
                  : dashboardMode === 'calsim-scenarios'
                    ? calsimD1641Data
                    : dashboardMode === 'schism-runs'
                      ? schismD1641Data
                      : dashboardMode === 'slr-current' || dashboardMode === 'slr-scenarios'
                        ? chartD1641Data
                        : null
              }
              baseScenario={baseScenario}
              scenario={scenario}
              dateIndex={dateIndex}
              region={region}
              mapExtent={mapExtent}
              histogramBrush={histogramBrush}
              showBrushStationLabels={!publicModesOnly}
              emphasizeD1641Stations={d1641StationsOnly}
              lassoStationIds={lassoStationIds}
              onLassoChange={setLassoStationIds}
            />
          )}
        </Box>
      </Box>
    </ThemeProvider>
  )
}

function PaperControls({ children }: { children: ReactNode }) {
  const compact = useCompactExplorer()
  return (
    <Box
      component="section"
      sx={{
        alignItems: 'flex-end',
        bgcolor: 'base.700',
        border: 1,
        borderColor: 'divider',
        borderRadius: 1,
        columnGap: 1.25,
        display: 'flex',
        flex: '0 0 auto',
        flexWrap: compact ? 'nowrap' : 'wrap',
        minWidth: 0,
        px: 1.5,
        py: 1,
        rowGap: 1,
      }}
    >
      {children}
    </Box>
  )
}
