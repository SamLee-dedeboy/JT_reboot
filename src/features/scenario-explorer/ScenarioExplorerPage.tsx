import { useEffect, useMemo, useRef, useState, useTransition, type ReactNode } from 'react';
import { Box, CircularProgress, FormControl, IconButton, Link, MenuItem, Select, Stack, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import type { SelectChangeEvent } from '@mui/material/Select';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { assetUrl } from '../../utils/baseUrl';
import DeltaMap from "./components/DeltaMap";
import RegionalChart from "./components/RegionalChart";
import StationHistogram from "./components/StationHistogram";
import ExplorerHeader from './components/ExplorerHeader';
import SalinityScale from './components/SalinityScale';
import ExplorerInfoPopover from './components/ExplorerInfoPopover';
import ExplorerTutorial from './components/ExplorerTutorial';
import type { D1641Dataset, DashboardMode, HistogramBrush, ModelKey, RangeMode, Scenario, ScenarioDataset, ScenarioDatasets, ValueMode, ValueSeries } from './types';

const DATASET_CONFIG: Record<DashboardMode, { key: keyof ScenarioDatasets; url: string }> = {
  'rma-scenarios': { key: 'rmaScenarios', url: '/data/scenario-explorer/salinity_dashboard.json' },
  'rma-schism': { key: 'rmaSchism', url: '/data/scenario-explorer/rma_schism_dashboard.json' },
  'tiered-outflows': { key: 'tieredOutflows', url: '/data/scenario-explorer/tiered_outflows_dashboard.json' },
  'schism-runs': { key: 'schismRuns', url: '/data/scenario-explorer/schism_runs_dashboard.json' },
};

interface LabeledSelectProps {
  children: ReactNode;
  disabled?: boolean;
  label: string;
  onChange: (event: SelectChangeEvent<string>) => void;
  onInfoClick?: (button: HTMLButtonElement) => void;
  infoLabel?: string;
  value: string;
  tourId?: string;
  displayValue?: string;
  compactValue?: string;
}

const renameBaseline = (label: string) => label.replace(/\bBaseline\b/gi, 'Business as Usual');
const scenarioAbbreviation = (label: string) => ({
  'Business as Usual': 'BAU',
  'Bolster & Fortify': 'B&F',
  'Calling on Reserves': 'COR',
  'A Tunnel': 'TUN',
  'Eco Machine': 'ECO',
  'New Green Watershed': 'NGW',
  'Business As Usual': 'BAU',
  '+30% Delta outflow': '+30% outflow',
  '-10% Delta outflow': '-10% outflow',
}[label] ?? label);
const menuItemSx = (color: 'brand.primaryBlue' | 'brand.primaryGreen') => ({
  color,
  typography: 'button',
  '&&:hover': { color: 'text.primary' },
} as const);

function ResponsiveScenarioLabel({ label }: { label: string }) {
  return <>
    <Box component="span" sx={{ display: { xs: 'none', xl: 'inline' } }}>{label}</Box>
    <Box component="span" sx={{ display: { xs: 'inline', xl: 'none' } }}>{scenarioAbbreviation(label)}</Box>
  </>;
}

function LabeledSelect({ children, compactValue, disabled = false, displayValue, infoLabel, label, onChange, onInfoClick, tourId, value }: LabeledSelectProps) {
  return (
    <FormControl data-tour={tourId} size="small" sx={{ minWidth: 0, width: '100%' }}>
      <Box sx={(theme) => ({ alignItems: 'center', display: 'flex', gap: theme.jtSpacing.gap.xs, mb: theme.jtSpacing.component.xs })}>
        <Typography component="label" variant="caption" sx={{ color: "text.secondary" }}>{label}</Typography>
        {onInfoClick && <IconButton aria-label={infoLabel ?? `About ${label}`} onClick={(event) => onInfoClick(event.currentTarget)} size="small" sx={{ color: 'text.secondary', p: 0 }}><InfoOutlinedIcon fontSize="small" /></IconButton>}
      </Box>
      <Select
        disabled={disabled}
        value={value}
        onChange={onChange}
        renderValue={compactValue ? () => (
          <Box component="span">
            <Box component="span" sx={{ display: { xs: 'none', xl: 'inline' } }}>{displayValue ?? value}</Box>
            <Box component="span" sx={{ display: { xs: 'inline', xl: 'none' } }}>{compactValue}</Box>
          </Box>
        ) : undefined}
        sx={{
          height: '2.5rem',
          '& .MuiSelect-select': {
            typography: 'button',
            alignItems: 'center',
            color: label.startsWith("Map") || label.startsWith("Selected") || label === "Scenario"
              ? 'brand.primaryGreen'
              : label.startsWith("Base")
                ? 'brand.primaryBlue'
                : 'text.primary',
            display: 'flex',
            minWidth: 0,
            overflow: 'hidden',
            py: 0,
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          },
        }}
      >
        {children}
      </Select>
    </FormControl>
  );
}

function SwapButton({ onClick, label = 'Swap base and selected scenarios' }: { onClick: () => void; label?: string }) {
  return <Box sx={(theme) => ({ alignSelf: "end", display: "grid", height: theme.spacing(5), placeItems: "center" })}><IconButton aria-label={label} onClick={onClick} sx={{ border: 1, borderColor: "divider", borderRadius: 1, color: "text.secondary" }}><SwapHorizIcon fontSize="small" /></IconButton></Box>;
}

interface ScenarioExplorerPageProps {
  enableDateHighlights?: boolean;
}

export default function ScenarioExplorerPage({ enableDateHighlights = false }: ScenarioExplorerPageProps) {
  const [datasets, setDatasets] = useState<Partial<ScenarioDatasets> | null>(null);
  const [d1641Data, setD1641Data] = useState<D1641Dataset | null>(null);
  const [schismD1641Data, setSchismD1641Data] = useState<D1641Dataset | null>(null);
  const [dashboardMode, setDashboardMode] = useState<DashboardMode>('rma-scenarios');
  const [baseScenario, setBaseScenario] = useState("baseline");
  const [scenario, setScenario] = useState("bolster");
  const [region, setRegion] = useState("All regions");
  const [dateIndex, setDateIndex] = useState(0);
  const [histogramDateIndex, setHistogramDateIndex] = useState(0);
  const [activeKeys, setActiveKeys] = useState<string[]>(['bolster']);
  const [histogramBrush, setHistogramBrush] = useState<HistogramBrush>(null);
  const [valueMode, setValueMode] = useState<ValueMode>('percent');
  const [rangeMode, setRangeMode] = useState<RangeMode>('minmax');
  const [selectedModel, setSelectedModel] = useState<ModelKey>('schism');
  const [isModeTransitioning, setIsModeTransitioning] = useState(false);
  const [regionInfoAnchor, setRegionInfoAnchor] = useState<HTMLButtonElement | null>(null);
  const [valuesInfoAnchor, setValuesInfoAnchor] = useState<HTMLButtonElement | null>(null);
  const [tutorialOpen, setTutorialOpen] = useState(false);
  const [isChartExpanded, setIsChartExpanded] = useState(false);

  useEffect(() => {
    // Expansion is only meaningful while at least two scenario lines are visible.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (activeKeys.length <= 1 && isChartExpanded) setIsChartExpanded(false);
  }, [activeKeys.length, isChartExpanded]);
  const [, startTransition] = useTransition();
  const modeTransitionTimerRef = useRef<number | null>(null);
  const dateFrameRef = useRef<number | null>(null);
  const pendingDateIndexRef = useRef(0);

  useEffect(() => () => {
    if (modeTransitionTimerRef.current !== null) window.clearTimeout(modeTransitionTimerRef.current);
    if (dateFrameRef.current !== null) window.cancelAnimationFrame(dateFrameRef.current);
  }, []);

  useEffect(() => {
    const initialConfig = DATASET_CONFIG['rma-scenarios'];
    Promise.all([
      fetch(assetUrl(initialConfig.url)).then((response) => response.json() as Promise<ScenarioDataset>),
      fetch(assetUrl('/data/scenario-explorer/d1641_rma.json')).then((response) => response.json() as Promise<D1641Dataset>),
    ]).then(([rmaScenarios, compliance]) => {
      setDatasets({ rmaScenarios });
      setD1641Data(compliance);
      setDateIndex(0);
      setHistogramDateIndex(0);
    });
  }, []);

  const data = dashboardMode === "rma-schism"
    ? datasets?.rmaSchism
    : dashboardMode === "tiered-outflows"
      ? datasets?.tieredOutflows
      : dashboardMode === "schism-runs"
        ? datasets?.schismRuns
      : datasets?.rmaScenarios;

  const selectDashboardMode = async (nextMode: DashboardMode) => {
    if (!datasets || nextMode === dashboardMode) return;
    if (modeTransitionTimerRef.current !== null) window.clearTimeout(modeTransitionTimerRef.current);
    setIsModeTransitioning(true);
    const config = DATASET_CONFIG[nextMode];
    let nextData = datasets[config.key];
    if (!nextData) {
      const [loadedData, loadedCompliance] = await Promise.all([
        fetch(assetUrl(config.url)).then((response) => response.json() as Promise<ScenarioDataset>),
        (nextMode === 'rma-schism' || nextMode === 'schism-runs') && !schismD1641Data
          ? fetch(assetUrl('/data/scenario-explorer/d1641_schism.json')).then((response) => response.json() as Promise<D1641Dataset>)
          : Promise.resolve(null),
      ]);
      nextData = loadedData;
      if (loadedCompliance) setSchismD1641Data(loadedCompliance);
      setDatasets((current) => ({ ...current, [config.key]: nextData }));
    }
    if (!nextData) return;
    if (nextMode === "rma-schism") {
      setBaseScenario("rma");
      setSelectedModel("schism");
      setScenario("baseline");
      setActiveKeys(["baseline"]);
    } else if (nextMode === "tiered-outflows") {
      setBaseScenario("run15");
      setScenario("run16");
      setActiveKeys(["run16"]);
    } else if (nextMode === "schism-runs") {
      setBaseScenario("run27");
      setScenario("run30");
      setActiveKeys(["run30"]);
    } else {
      setBaseScenario("baseline");
      setScenario("bolster");
      setActiveKeys(["bolster"]);
    }
    setRegion("All regions");
    const nextDateIndex = 0;
    setDateIndex(nextDateIndex);
    setHistogramDateIndex(nextDateIndex);
    setHistogramBrush(null);
    setDashboardMode(nextMode);
    modeTransitionTimerRef.current = window.setTimeout(() => {
      setIsModeTransitioning(false);
      modeTransitionTimerRef.current = null;
    }, 420);
  };

  const scenarioOptions = useMemo(() => {
    if (!data) return [];
    if (dashboardMode === "tiered-outflows") return data.scenarios.map((item) => {
      if (item.key === "run15") return { ...item, label: "Business As Usual" };
      if (item.key === "run16") return { ...item, label: "+30% Delta outflow" };
      if (item.key === "run17") return { ...item, label: "-10% Delta outflow" };
      return item;
    });
    if (dashboardMode === "schism-runs") return data.scenarios;
    if (dashboardMode !== "rma-scenarios") return data.scenarios.map((item) => ({ ...item, label: renameBaseline(item.label) }));
    const zeroSeries = data.dates.map(() => 0);
    const baseline = {
      key: "baseline",
      label: "Business as Usual",
      stationValues: data.stations.map(() => zeroSeries),
      regionValues: Object.fromEntries(data.regions.map((regionName) => [regionName, zeroSeries])),
    };
    return [baseline, ...data.scenarios];
  }, [dashboardMode, data]);
  const comparisonBaseLabel = useMemo(() => dashboardMode === "rma-schism"
    ? baseScenario.toUpperCase()
    : scenarioOptions.find((item) => item.key === baseScenario)?.label || "Business as Usual", [baseScenario, dashboardMode, scenarioOptions]);
  const rawComparisonData = useMemo<ScenarioDataset | undefined>(() => {
    if (!data) return data;
    if (dashboardMode === "rma-schism") {
      if (baseScenario === "rma" && selectedModel === "schism") return { ...data, scenarios: scenarioOptions };
      return {
        ...data,
        scenarios: scenarioOptions.map((item) => ({
          ...item,
          stationValues: item.stationValues.map((values) => values.map((value) => value == null ? null : -value)),
          regionValues: Object.fromEntries(Object.entries(item.regionValues).map(([regionName, values]) => [regionName, values.map((value) => value == null ? null : -value)])),
        })),
      };
    }
    const base = scenarioOptions.find((item) => item.key === baseScenario);
    if (!base) return data;

    const subtractSeries = (values: ValueSeries, baseValues?: ValueSeries) => values.map((value, index) => {
      const baseValue = baseValues?.[index];
      return value == null || baseValue == null ? null : value - baseValue;
    });

    const compared: ScenarioDataset = {
      ...data,
      scenarios: scenarioOptions.map((item) => ({
        ...item,
        stationValues: item.stationValues.map((values, stationIndex) => subtractSeries(values, base.stationValues[stationIndex])),
        regionValues: Object.fromEntries(Object.entries(item.regionValues).map(([regionName, values]) => [
          regionName,
          subtractSeries(values, base.regionValues[regionName]),
        ])),
      })),
    };
    if (dashboardMode !== 'schism-runs') return compared;

    const selected = scenarioOptions.find((item) => item.key === scenario);
    if (!selected) return compared;
    const available = data.dates.map((_, dateIndex) => base.stationValues.some((values, stationIndex) =>
      values[dateIndex] != null && selected.stationValues[stationIndex]?.[dateIndex] != null));
    const first = available.findIndex(Boolean);
    const last = available.findLastIndex(Boolean);
    if (first < 0 || last < first) return compared;
    const sliceSeries = (values: ValueSeries) => values.slice(first, last + 1);
    return {
      ...compared,
      dates: compared.dates.slice(first, last + 1),
      referenceStationValues: compared.referenceStationValues?.map(sliceSeries),
      scenarios: compared.scenarios.map((item) => ({
        ...item,
        stationValues: item.stationValues.map(sliceSeries),
        regionValues: Object.fromEntries(Object.entries(item.regionValues).map(([regionName, values]) => [regionName, sliceSeries(values)])),
        referenceStationValues: item.referenceStationValues?.map(sliceSeries),
      })),
    };
  }, [baseScenario, dashboardMode, data, scenario, scenarioOptions, selectedModel]);
  const percentComparisonData = useMemo<ScenarioDataset | undefined>(() => {
    if (!rawComparisonData) return rawComparisonData;
    const canonicalReference = rawComparisonData.referenceStationValues;
    const baseDeltas = dashboardMode !== "rma-schism"
      ? scenarioOptions.find((item) => item.key === baseScenario)?.stationValues
      : null;
    const toPercent = (difference: number | null, reference: number | null) => difference == null || reference == null || reference === 0
      ? null
      : 100 * difference / reference;
    const scenarios = rawComparisonData.scenarios.map((item) => {
      const itemReference = item.referenceStationValues ?? canonicalReference;
      const stationValues = item.stationValues.map((values, stationIndex) => {
        const referenceSeries = dashboardMode === 'schism-runs'
          ? scenarioOptions.find((scenarioItem) => scenarioItem.key === baseScenario)?.stationValues[stationIndex] ?? []
          : itemReference?.[stationIndex]?.map((canonical, dateIndex) => {
          if (canonical == null) return null;
          if (dashboardMode !== "rma-schism") return canonical + (baseDeltas?.[stationIndex]?.[dateIndex] ?? 0);
          return baseScenario === "schism" ? canonical - (values[dateIndex] ?? 0) : canonical;
        }) ?? [];
        const validReferenceValues = referenceSeries.filter((value): value is number => value != null && Number.isFinite(value));
        const periodMeanReference = validReferenceValues.length
          ? validReferenceValues.reduce((sum, value) => sum + value, 0) / validReferenceValues.length
          : null;
        return values.map((difference) => toPercent(difference, periodMeanReference));
      });
      const regionValues = Object.fromEntries(rawComparisonData.regions.map((regionName) => {
        const indices = rawComparisonData.stations.map((station, index) => station.region === regionName ? index : -1).filter((index) => index >= 0);
        return [regionName, rawComparisonData.dates.map((_, dateIndex) => {
          const values = indices.map((index) => stationValues[index][dateIndex]).filter((value): value is number => value != null && Number.isFinite(value));
          return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;
        })];
      }));
      return { ...item, stationValues, regionValues };
    });
    return { ...rawComparisonData, scenarios, units: "%" };
  }, [rawComparisonData, dashboardMode, scenarioOptions, baseScenario]);
  const comparisonData = valueMode === "raw" ? rawComparisonData : percentComparisonData;
  const selectBaseScenario = (nextBaseScenario: string) => {
    const nextMapScenario = nextBaseScenario === scenario ? baseScenario : scenario;
    startTransition(() => {
      setBaseScenario(nextBaseScenario);
      setScenario(nextMapScenario);
      setActiveKeys([nextMapScenario]);
      setHistogramBrush(null);
      if (dashboardMode === 'schism-runs') {
        setDateIndex(0);
        setHistogramDateIndex(0);
      }
    });
  };
  const selectMapScenario = (nextMapScenario: string) => {
    if (nextMapScenario === baseScenario) return;
    startTransition(() => {
      setScenario(nextMapScenario);
      setActiveKeys([nextMapScenario]);
      setHistogramBrush(null);
      if (dashboardMode === 'schism-runs') {
        setDateIndex(0);
        setHistogramDateIndex(0);
      }
    });
  };
  const selectDateIndex = (nextDateIndex: number) => {
    pendingDateIndexRef.current = nextDateIndex;
    if (dateFrameRef.current !== null) return;
    dateFrameRef.current = window.requestAnimationFrame(() => {
      setDateIndex(pendingDateIndexRef.current);
      dateFrameRef.current = null;
    });
  };

  const commitDateIndex = (nextDateIndex: number) => {
    if (dateFrameRef.current !== null) {
      window.cancelAnimationFrame(dateFrameRef.current);
      dateFrameRef.current = null;
    }
    setDateIndex(nextDateIndex);
    setHistogramDateIndex(nextDateIndex);
  };
  const selectRegion = (nextRegion: string) => {
    startTransition(() => {
      setRegion(nextRegion);
      setHistogramBrush(null);
    });
  };
  const swapScenarios = () => {
    const previousBase = baseScenario;
    startTransition(() => {
      setBaseScenario(scenario);
      setScenario(previousBase);
      setActiveKeys([previousBase]);
      setHistogramBrush(null);
      if (dashboardMode === 'schism-runs') {
        setDateIndex(0);
        setHistogramDateIndex(0);
      }
    });
  };
  const selectedScenario = useMemo<Scenario | undefined>(() => comparisonData?.scenarios.find((item) => item.key === scenario), [comparisonData, scenario]);
  const rawSelectedScenario = useMemo(() => rawComparisonData?.scenarios.find((item) => item.key === scenario), [rawComparisonData, scenario]);
  const chartD1641Data = useMemo<D1641Dataset | null>(() => {
    if (dashboardMode === 'rma-scenarios') return d1641Data;
    if (dashboardMode === 'schism-runs') return schismD1641Data;
    if (dashboardMode !== 'rma-schism' || !d1641Data || !schismD1641Data) return null;
    const schismScenarioKey = ({ baseline: 'run27', reserve: 'run30', tunnel: 'run31' } as Record<string, string>)[scenario];
    const rmaCompliance = d1641Data.scenarios[scenario];
    const schismCompliance = schismD1641Data.scenarios[schismScenarioKey];
    if (!rmaCompliance || !schismCompliance) return null;
    const byModel = { rma: rmaCompliance, schism: schismCompliance };
    return {
      source: `${d1641Data.source}; ${schismD1641Data.source}`,
      generatedFrom: `${d1641Data.generatedFrom}; ${schismD1641Data.generatedFrom}`,
      scenarios: {
        [baseScenario]: byModel[baseScenario as ModelKey],
        [scenario]: byModel[selectedModel],
      },
    };
  }, [baseScenario, d1641Data, dashboardMode, scenario, schismD1641Data, selectedModel]);
  const mapExtent = useMemo(() => {
    if (!comparisonData || !selectedScenario) return 1;
    const stationIndices = comparisonData.stations
      .map((station, index) => ({ station, index }))
      .filter(({ station }) => region === "All regions" || station.region === region)
      .map(({ index }) => index);
    const magnitudes = stationIndices
      .flatMap((index) => selectedScenario.stationValues[index])
      .filter((value): value is number => value != null)
      .map(Math.abs)
      .sort((a, b) => a - b);
    return Math.max(1, magnitudes[Math.floor((magnitudes.length - 1) * 0.9)] || 1);
  }, [comparisonData, selectedScenario, region]);
  const currentRegionValue = (item: Scenario | undefined) => {
    if (!item) return null;
    const values = item.stationValues.map((series) => series[dateIndex]).filter((value): value is number => value != null);
    return region === "All regions"
      ? values.reduce((sum, value) => sum + value, 0) / (values.length || 1)
      : item.regionValues[region][dateIndex];
  };
  const rawRegionValue = currentRegionValue(rawSelectedScenario);
  const regionalBaseMean = useMemo(() => {
    if (!rawComparisonData || !rawSelectedScenario) return null;
    const canonicalReference = rawComparisonData.referenceStationValues;
    const itemReference = rawSelectedScenario.referenceStationValues ?? canonicalReference;
    const baseDeltas = dashboardMode !== "rma-schism"
      ? scenarioOptions.find((item) => item.key === baseScenario)?.stationValues
      : null;
    const stationIndices = rawComparisonData.stations
      .map((station, index) => region === "All regions" || station.region === region ? index : -1)
      .filter((index) => index >= 0);
    const stationMeans = stationIndices.map((stationIndex) => {
      const references = (dashboardMode === 'schism-runs'
        ? scenarioOptions.find((scenarioItem) => scenarioItem.key === baseScenario)?.stationValues[stationIndex]
        : itemReference?.[stationIndex]?.map((canonical, referenceDateIndex) => {
        if (canonical == null) return null;
        if (dashboardMode !== "rma-schism") return canonical + (baseDeltas?.[stationIndex]?.[referenceDateIndex] ?? 0);
        return baseScenario === "schism" ? canonical - (rawSelectedScenario.stationValues[stationIndex][referenceDateIndex] ?? 0) : canonical;
      }))?.filter((value): value is number => value != null && Number.isFinite(value)) ?? [];
      return references.length ? references.reduce((sum, value) => sum + value, 0) / references.length : null;
    }).filter((value): value is number => value != null && Number.isFinite(value));
    return stationMeans.length ? stationMeans.reduce((sum, value) => sum + value, 0) / stationMeans.length : null;
  }, [baseScenario, dashboardMode, rawComparisonData, rawSelectedScenario, region, scenarioOptions]);
  const percentRegionValue = rawRegionValue == null || regionalBaseMean == null || regionalBaseMean === 0
    ? null
    : 100 * rawRegionValue / regionalBaseMean;
  if (!datasets || !data || !comparisonData || !selectedScenario) {
    return <Box sx={{ display: "grid", minHeight: "100dvh", placeItems: "center" }}><Stack sx={(theme) => ({ alignItems: 'center', gap: theme.jtSpacing.gap.sm })}><CircularProgress color="primary" /><Typography variant="caption" color="text.secondary">Loading scenario explorer…</Typography></Stack></Box>;
  }
  const headerDescription = 'Explore salinity changes across scenarios, regions, stations, and time with the linked map, timeline, and station distribution. See Tutorial for help. If the layout feels crowded, use a larger screen or zoom out in your browser (Ctrl/Cmd + −).';

  return (
    <>
      <Box component="main" sx={(theme) => ({ bgcolor: 'base.800', boxSizing: "border-box", display: "flex", flexDirection: "column", height: { xs: 'auto', lg: '100dvh' }, minHeight: { xs: '100dvh', lg: 0 }, overflow: { xs: 'visible', lg: 'hidden' }, p: { xs: theme.jtSpacing.component.sm, md: theme.jtSpacing.component.md, xl: theme.jtSpacing.component.lg }, position: 'relative' })}>
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
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>Loading comparison…</Typography>
        </Box>
      )}
      <ExplorerHeader
        description={headerDescription}
        mode={dashboardMode}
        onModeChange={selectDashboardMode}
        onTutorialOpen={() => setTutorialOpen(true)}
        showSchismRuns={enableDateHighlights}
      />
      <ExplorerTutorial open={tutorialOpen} onClose={() => setTutorialOpen(false)} />

      <Box sx={(theme) => ({ alignItems: 'stretch', display: 'grid', flex: 1, gap: theme.jtSpacing.gap.sm, gridTemplateColumns: isChartExpanded ? 'minmax(0, 1fr)' : { xs: '1fr', lg: 'minmax(0, 2.4fr) minmax(18rem, .7fr)', xl: 'minmax(0, 2fr) minmax(20rem, .85fr)' }, minHeight: 0, overflow: { xs: 'visible', lg: 'hidden' } })}>
        <Box sx={(theme) => ({ display: 'grid', gap: theme.jtSpacing.gap.sm, gridTemplateRows: 'auto minmax(0, 1fr)', minHeight: 0, minWidth: 0 })}>
        <PaperControls mode={dashboardMode}>
        {dashboardMode === "rma-schism" ? (
          <>
            <LabeledSelect tourId="scenario-controls" label="Base Model" value={baseScenario} onChange={(event) => { const next = event.target.value as ModelKey; setBaseScenario(next); setSelectedModel(next === "rma" ? "schism" : "rma"); setHistogramBrush(null); }}>
              <MenuItem value="rma" sx={menuItemSx('brand.primaryBlue')}>RMA</MenuItem>
              <MenuItem value="schism" sx={menuItemSx('brand.primaryBlue')}>SCHISM</MenuItem>
            </LabeledSelect>
            <SwapButton label="Swap base and selected models" onClick={() => { const previousBase = baseScenario as ModelKey; setBaseScenario(selectedModel); setSelectedModel(previousBase); setHistogramBrush(null); }} />
            <LabeledSelect tourId="scenario-controls" label="Selected Model" value={selectedModel} onChange={(event) => { const next = event.target.value as ModelKey; setSelectedModel(next); setBaseScenario(next === "rma" ? "schism" : "rma"); setHistogramBrush(null); }}>
              <MenuItem value="rma" sx={menuItemSx('brand.primaryGreen')}>RMA</MenuItem>
              <MenuItem value="schism" sx={menuItemSx('brand.primaryGreen')}>SCHISM</MenuItem>
            </LabeledSelect>
            <LabeledSelect tourId="scenario-controls" label="Scenario" value={scenario} displayValue={scenarioOptions.find((item) => item.key === scenario)?.label} compactValue={scenarioAbbreviation(scenarioOptions.find((item) => item.key === scenario)?.label ?? scenario)} onChange={(event) => selectMapScenario(event.target.value)}>
              {data.scenarios.map((item) => <MenuItem key={item.key} value={item.key} sx={menuItemSx('brand.primaryGreen')}><ResponsiveScenarioLabel label={item.label} /></MenuItem>)}
            </LabeledSelect>
          </>
        ) : dashboardMode === "tiered-outflows" || dashboardMode === "schism-runs" ? (
          <>
            <LabeledSelect tourId="scenario-controls" label="Base Scenario" value={baseScenario} displayValue={scenarioOptions.find((item) => item.key === baseScenario)?.label} compactValue={scenarioAbbreviation(scenarioOptions.find((item) => item.key === baseScenario)?.label ?? baseScenario)} onChange={(event) => selectBaseScenario(event.target.value)}>
              {scenarioOptions.map((item) => <MenuItem disabled={item.key === scenario} key={item.key} value={item.key} sx={menuItemSx('brand.primaryBlue')}><ResponsiveScenarioLabel label={item.label} /></MenuItem>)}
            </LabeledSelect>
            <SwapButton onClick={swapScenarios} />
            <LabeledSelect tourId="scenario-controls" label="Selected Scenario" value={scenario} displayValue={scenarioOptions.find((item) => item.key === scenario)?.label} compactValue={scenarioAbbreviation(scenarioOptions.find((item) => item.key === scenario)?.label ?? scenario)} onChange={(event) => selectMapScenario(event.target.value)}>
              {scenarioOptions.map((item) => <MenuItem disabled={item.key === baseScenario} key={item.key} value={item.key} sx={menuItemSx('brand.primaryGreen')}><ResponsiveScenarioLabel label={item.label} /></MenuItem>)}
            </LabeledSelect>
          </>
        ) : (
          <>
            <LabeledSelect tourId="scenario-controls" label="Base Scenario" value={baseScenario} displayValue={scenarioOptions.find((item) => item.key === baseScenario)?.label} compactValue={scenarioAbbreviation(scenarioOptions.find((item) => item.key === baseScenario)?.label ?? baseScenario)} onChange={(event) => selectBaseScenario(event.target.value)}>
              {scenarioOptions.map((item) => <MenuItem key={item.key} value={item.key} sx={menuItemSx('brand.primaryBlue')}><ResponsiveScenarioLabel label={item.label} /></MenuItem>)}
            </LabeledSelect>
            <SwapButton onClick={swapScenarios} />
            <LabeledSelect tourId="scenario-controls" label="Selected Scenario" value={scenario} displayValue={scenarioOptions.find((item) => item.key === scenario)?.label} compactValue={scenarioAbbreviation(scenarioOptions.find((item) => item.key === scenario)?.label ?? scenario)} onChange={(event) => selectMapScenario(event.target.value)}>
              {scenarioOptions.map((item) => <MenuItem disabled={item.key === baseScenario} key={item.key} value={item.key} sx={menuItemSx('brand.primaryGreen')}><ResponsiveScenarioLabel label={item.label} /></MenuItem>)}
            </LabeledSelect>
          </>
        )}
        <LabeledSelect tourId="region-values" label="Selected Region" value={region} infoLabel="About the region definitions" onInfoClick={setRegionInfoAnchor}
          onChange={(event) => selectRegion(event.target.value)}>
          <MenuItem value="All regions" sx={menuItemSx('brand.primaryGreen')}>All regions</MenuItem>
          {data.regions.map((item) => <MenuItem key={item} value={item} sx={menuItemSx('brand.primaryGreen')}>{item}</MenuItem>)}
        </LabeledSelect>
        <Box data-tour="region-values">
          <Box sx={(theme) => ({ alignItems: 'center', display: 'flex', gap: theme.jtSpacing.gap.xs, mb: theme.jtSpacing.component.xs })}>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>Values</Typography>
            <IconButton aria-label="About value calculations" onClick={(event) => setValuesInfoAnchor(event.currentTarget)} size="small" sx={{ color: 'text.secondary', p: 0 }}><InfoOutlinedIcon fontSize="small" /></IconButton>
          </Box>
          <ToggleButtonGroup exclusive size="small" value={valueMode} onChange={(_, value) => { if (value) { setValueMode(value as ValueMode); setHistogramBrush(null); } }} aria-label="Value display mode" sx={{ height: '2.5rem' }}>
            <ToggleButton value="raw" sx={{ textTransform: 'none' }}>{"\u00B5S/cm"}</ToggleButton>
            <ToggleButton value="percent">
              <Box component="span" sx={{ display: { xs: 'none', xl: 'inline' } }}>% change</Box>
              <Box component="span" sx={{ display: { xs: 'inline', xl: 'none' } }}>% change</Box>
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <Box data-tour="color-scale"><SalinityScale extent={mapExtent} units={valueMode === "percent" ? "%" : "µS/cm"} /></Box>
      </PaperControls>
      <ExplorerInfoPopover anchor={regionInfoAnchor} onClose={() => setRegionInfoAnchor(null)}>
        <Typography variant="caption" color="brand.primaryGreen">About selected regions</Typography>
        <Typography variant="h5" sx={{ '&&': { color: 'brand.primaryGreen' } }}>How are regions defined?</Typography>
        <Typography variant="captionSmall" component="p" color="text.secondary">
          Each monitoring station is assigned to an estuary region using the <strong>REGION</strong> field in the project’s station <Link href="https://docs.google.com/spreadsheets/d/1bdGbzRU4dCnA_S8pO347uhh9eaViKDFXfqPmO3AfFaY/edit?usp=sharing" target="_blank" rel="noreferrer" color="brand.primaryBlue">reference workbook</Link>. Selecting a region filters the map, timeline, and station distribution to stations carrying that assignment.
        </Typography>
        <Typography variant="captionSmall" component="p" color="text.secondary">
          <strong>All regions</strong> includes every station available in the active comparison.
        </Typography>
      </ExplorerInfoPopover>
      <ExplorerInfoPopover anchor={valuesInfoAnchor} onClose={() => setValuesInfoAnchor(null)}>
        <Typography variant="caption" color="brand.primaryGreen">About displayed values</Typography>
        <Typography variant="h5" sx={{ '&&': { color: 'brand.primaryGreen' } }}>How is percent change calculated?</Typography>
        <Typography variant="captionSmall" component="p" color="text.secondary">
          Percent change expresses the <Box component="span" sx={{ color: 'brand.primaryGreen' }}>selected scenario</Box> relative to the <Box component="span" sx={{ color: 'brand.primaryBlue' }}>selected base scenario</Box>. For each station, the explorer calculates the EC difference, then divides it by that station’s selected base-scenario period-mean EC.
        </Typography>
        <Box sx={(theme) => ({ bgcolor: 'surface', border: 1, borderColor: 'divider', borderRadius: 1, p: theme.jtSpacing.component.sm, textAlign: 'center' })}>
          <Typography variant="captionSmall" component="p" color="common.white">
            Percent change = 100 × (selected EC − base EC) ÷ selected base-scenario period-mean EC
          </Typography>
        </Box>
        <Typography variant="captionSmall" component="p" color="text.secondary">
          On the map and in the station distribution, this calculation is applied to each station. The current regional average uses the same relationship after averaging the station EC differences and selected base-scenario references across the selected region.
        </Typography>
        <Typography variant="captionSmall" component="p" color="text.secondary">
          Positive values indicate saltier conditions than the selected base scenario; negative values indicate fresher conditions. If the selected base-scenario reference is zero or missing, no percentage is shown.
        </Typography>
        <Typography variant="captionSmall" component="p" color="text.secondary">
          Choose <strong>µS/cm</strong> to view the absolute EC difference instead.
        </Typography>
      </ExplorerInfoPopover>

        <Box sx={(theme) => ({ alignItems: 'stretch', display: 'grid', gap: theme.jtSpacing.gap.sm, gridTemplateColumns: isChartExpanded ? 'minmax(0, 1fr)' : { xs: '1fr', md: 'minmax(0, 1fr) minmax(9rem, .18fr)', xl: 'minmax(0, 1fr) minmax(8rem, .22fr)' }, minHeight: 0, minWidth: 0, overflow: { xs: 'visible', lg: 'hidden' } })}>
        <RegionalChart data={comparisonData} d1641Data={chartD1641Data} dashboardMode={dashboardMode} region={region} selectedScenario={selectedScenario} baseScenarioKey={baseScenario} baseScenarioLabel={comparisonBaseLabel} rawRegionValue={rawRegionValue} percentRegionValue={percentRegionValue} activeKeys={activeKeys} onActiveKeysChange={setActiveKeys} dateIndex={dateIndex} onDateChange={selectDateIndex} onDateCommit={commitDateIndex} rangeMode={rangeMode} onRangeModeChange={setRangeMode} units={valueMode === "percent" ? "%" : "µS/cm"} expanded={isChartExpanded} onExpandedChange={setIsChartExpanded} enableDateHighlights={enableDateHighlights} />
        {!isChartExpanded && <StationHistogram data={comparisonData} region={region} scenario={selectedScenario} dateIndex={histogramDateIndex} onBrushChange={setHistogramBrush} mapExtent={mapExtent} rangeMode={rangeMode} units={valueMode === "percent" ? "%" : "µS/cm"} />}
        </Box>
        </Box>
        {!isChartExpanded && <DeltaMap key={`${dashboardMode}-map`} data={comparisonData} d1641Data={dashboardMode === 'rma-scenarios' ? d1641Data : dashboardMode === 'schism-runs' ? schismD1641Data : null} baseScenario={baseScenario} scenario={scenario} dateIndex={dateIndex} region={region} mapExtent={mapExtent} histogramBrush={histogramBrush} />}
      </Box>
    </Box></>
  );
}

function PaperControls({ children, mode }: { children: ReactNode; mode: DashboardMode }) {
  return <Box component="section" sx={(theme) => ({
    alignItems: "end", bgcolor: "base.700", border: 1, borderColor: "divider", borderRadius: 1,
    display: "grid", flex: '0 0 auto', gap: theme.jtSpacing.gap.sm,
    gridTemplateColumns: mode === 'rma-schism'
      ? 'minmax(0,.8fr) auto minmax(0,.8fr) minmax(0,1fr) minmax(0,1fr) auto minmax(10rem,1.35fr)'
      : 'minmax(0,1fr) auto minmax(0,1.2fr) minmax(0,1fr) auto minmax(10rem,1.35fr)',
    minWidth: 0, overflow: 'hidden', p: theme.jtSpacing.component.sm,
    '@media (max-width: 1919.95px)': {
      '& .MuiTypography-caption': { ...theme.typography.captionSmall },
    },
    [theme.breakpoints.down('xl')]: {
      gridTemplateColumns: mode === 'rma-schism'
        ? 'minmax(4rem,.7fr) auto minmax(4rem,.7fr) minmax(4rem,.8fr) minmax(5rem,.8fr) auto minmax(7rem,1fr)'
        : 'minmax(4rem,.75fr) auto minmax(4rem,.8fr) minmax(5rem,.8fr) auto minmax(7rem,1fr)',
    },
    [theme.breakpoints.down('md')]: {
      '& .MuiTypography-caption': { ...theme.typography.captionSmall },
      gap: theme.jtSpacing.gap.xs,
      gridTemplateColumns: mode === 'rma-schism'
        ? 'minmax(3.5rem,.55fr) auto minmax(3.5rem,.55fr) minmax(3.5rem,.65fr) minmax(4rem,.65fr) auto minmax(5rem,.7fr)'
        : 'minmax(3.5rem,.6fr) auto minmax(3.5rem,.65fr) minmax(4rem,.65fr) auto minmax(5rem,.7fr)',
      p: theme.jtSpacing.component.xs,
    },
    [theme.breakpoints.between('lg', 'xl')]: {
      '& .MuiTypography-caption': { ...theme.typography.captionSmall },
      gap: theme.jtSpacing.gap.xs,
    },
  })}>{children}</Box>;
}
