import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Box, CircularProgress, FormControl, IconButton, MenuItem, Select, Slider, Stack, Tab, Tabs, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import type { SelectChangeEvent } from '@mui/material/Select';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import Navbar from '../../components/common/Navbar';
import { assetUrl } from '../../utils/baseUrl';
import DeltaMap from "./components/DeltaMap";
import RegionalChart from "./components/RegionalChart";
import StationHistogram from "./components/StationHistogram";
import { formatDate } from './format';
import { explorerPalette as palette, scenarioNameSx } from './theme';
import type { DashboardMode, HistogramBrush, ModelKey, Scenario, ScenarioDataset, ScenarioDatasets, ValueMode, ValueSeries } from './types';

interface LabeledSelectProps {
  children: ReactNode;
  disabled?: boolean;
  label: string;
  onChange: (event: SelectChangeEvent<string>) => void;
  value: string;
}

function LabeledSelect({ children, disabled = false, label, onChange, value }: LabeledSelectProps) {
  return (
    <FormControl size="small" sx={{ minWidth: "14rem" }}>
      <Typography component="label" variant="caption" sx={{ mb: 0.75, color: "text.secondary" }}>{label}</Typography>
      <Select
        disabled={disabled}
        value={value}
        onChange={onChange}
        sx={{
          height: '2.5rem',
          '& .MuiSelect-select': {
            ...scenarioNameSx,
            alignItems: 'center',
            color: label.startsWith("Map") || label.startsWith("Selected") || label === "Scenario"
              ? 'brand.primaryGreen'
              : label.startsWith("Base")
                ? 'brand.primaryBlue'
                : 'text.primary',
            display: 'flex',
            py: 0,
          },
        }}
      >
        {children}
      </Select>
    </FormControl>
  );
}

function SwapButton({ onClick, label = 'Swap base and selected scenarios' }: { onClick: () => void; label?: string }) {
  return <Box sx={{ alignSelf: "end", display: "grid", height: "2.5rem", placeItems: "center" }}><IconButton aria-label={label} onClick={onClick} sx={{ border: 1, borderColor: "divider", borderRadius: 1, color: "text.secondary" }}><SwapHorizIcon fontSize="small" /></IconButton></Box>;
}

export default function ScenarioExplorerPage() {
  const [datasets, setDatasets] = useState<ScenarioDatasets | null>(null);
  const [dashboardMode, setDashboardMode] = useState<DashboardMode>('rma-scenarios');
  const [baseScenario, setBaseScenario] = useState("baseline");
  const [scenario, setScenario] = useState("bolster");
  const [region, setRegion] = useState("All regions");
  const [dateIndex, setDateIndex] = useState(0);
  const [activeKeys, setActiveKeys] = useState<string[]>(['bolster']);
  const [histogramBrush, setHistogramBrush] = useState<HistogramBrush>(null);
  const [valueMode, setValueMode] = useState<ValueMode>('percent');
  const [selectedModel, setSelectedModel] = useState<ModelKey>('schism');
  const [isModeTransitioning, setIsModeTransitioning] = useState(false);
  const modeTransitionTimerRef = useRef<number | null>(null);

  useEffect(() => () => {
    if (modeTransitionTimerRef.current !== null) window.clearTimeout(modeTransitionTimerRef.current);
  }, []);

  useEffect(() => {
    Promise.all([
      fetch(assetUrl('/data/scenario-explorer/salinity_dashboard.json'), { cache: 'no-store' }).then((response) => response.json() as Promise<ScenarioDataset>),
      fetch(assetUrl('/data/scenario-explorer/rma_schism_dashboard.json'), { cache: 'no-store' }).then((response) => response.json() as Promise<ScenarioDataset>),
      fetch(assetUrl('/data/scenario-explorer/tiered_outflows_dashboard.json'), { cache: 'no-store' }).then((response) => response.json() as Promise<ScenarioDataset>),
    ]).then(([rmaScenarios, rmaSchism, tieredOutflows]) => {
      setDatasets({ rmaScenarios, rmaSchism, tieredOutflows });
      setDateIndex(rmaScenarios.dates.length - 1);
    });
  }, []);

  const data = dashboardMode === "rma-schism"
    ? datasets?.rmaSchism
    : dashboardMode === "tiered-outflows"
      ? datasets?.tieredOutflows
      : datasets?.rmaScenarios;

  const selectDashboardMode = (nextMode: DashboardMode) => {
    if (!datasets || nextMode === dashboardMode) return;
    if (modeTransitionTimerRef.current !== null) window.clearTimeout(modeTransitionTimerRef.current);
    setIsModeTransitioning(true);
    const nextData = nextMode === "rma-schism"
      ? datasets.rmaSchism
      : nextMode === "tiered-outflows"
        ? datasets.tieredOutflows
        : datasets.rmaScenarios;
    if (nextMode === "rma-schism") {
      setBaseScenario("rma");
      setSelectedModel("schism");
      setScenario("baseline");
      setActiveKeys(["baseline"]);
    } else if (nextMode === "tiered-outflows") {
      setBaseScenario("run15");
      setScenario("run16");
      setActiveKeys(["run16"]);
    } else {
      setBaseScenario("baseline");
      setScenario("bolster");
      setActiveKeys(["bolster"]);
    }
    setRegion("All regions");
    setDateIndex(nextData.dates.length - 1);
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
      if (item.key === "run15") return { ...item, label: "Run 15 · Baseline" };
      const runLabel = `Run ${item.key.replace("run", "")}`;
      const name = item.label.replace(/\s*·\s*Run\s*\d+\s*$/i, "");
      return { ...item, label: `${runLabel} · ${name}` };
    });
    if (dashboardMode !== "rma-scenarios") return data.scenarios;
    const zeroSeries = data.dates.map(() => 0);
    const baseline = {
      key: "baseline",
      label: "Baseline",
      stationValues: data.stations.map(() => zeroSeries),
      regionValues: Object.fromEntries(data.regions.map((regionName) => [regionName, zeroSeries])),
    };
    return [baseline, ...data.scenarios];
  }, [dashboardMode, data]);
  const comparisonBaseLabel = useMemo(() => dashboardMode === "rma-schism"
    ? baseScenario.toUpperCase()
    : scenarioOptions.find((item) => item.key === baseScenario)?.label || "Baseline", [baseScenario, dashboardMode, scenarioOptions]);
  const rawComparisonData = useMemo<ScenarioDataset | undefined>(() => {
    if (!data) return data;
    if (dashboardMode === "rma-schism") {
      if (baseScenario === "rma" && selectedModel === "schism") return data;
      return {
        ...data,
        scenarios: data.scenarios.map((item) => ({
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

    return {
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
  }, [baseScenario, dashboardMode, data, scenarioOptions, selectedModel]);
  const comparisonData = useMemo<ScenarioDataset | undefined>(() => {
    if (!rawComparisonData || valueMode === "raw") return rawComparisonData;
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
        const referenceSeries = itemReference?.[stationIndex]?.map((canonical, dateIndex) => {
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
  }, [rawComparisonData, valueMode, dashboardMode, scenarioOptions, baseScenario]);
  const selectBaseScenario = (nextBaseScenario: string) => {
    const nextMapScenario = nextBaseScenario === scenario ? baseScenario : scenario;
    setBaseScenario(nextBaseScenario);
    setScenario(nextMapScenario);
    setActiveKeys([nextMapScenario]);
    setHistogramBrush(null);
  };
  const selectMapScenario = (nextMapScenario: string) => {
    if (nextMapScenario === baseScenario) return;
    setScenario(nextMapScenario);
    setActiveKeys([nextMapScenario]);
    setHistogramBrush(null);
  };
  const selectDateIndex = (nextDateIndex: number) => {
    setDateIndex(nextDateIndex);
    setHistogramBrush(null);
  };
  const selectRegion = (nextRegion: string) => {
    setRegion(nextRegion);
    setHistogramBrush(null);
  };
  const swapScenarios = () => {
    const previousBase = baseScenario;
    setBaseScenario(scenario);
    setScenario(previousBase);
    setActiveKeys([previousBase]);
    setHistogramBrush(null);
  };
  const selectedScenario = useMemo<Scenario | undefined>(() => comparisonData?.scenarios.find((item) => item.key === scenario), [comparisonData, scenario]);
  const currentValues = useMemo(() => selectedScenario ? selectedScenario.stationValues.map((values) => values[dateIndex]).filter((value): value is number => value != null) : [], [selectedScenario, dateIndex]);
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
  const regionValue = useMemo(() => {
    if (!selectedScenario) return null;
    return region === "All regions"
      ? currentValues.reduce((sum, value) => sum + value, 0) / (currentValues.length || 1)
      : selectedScenario.regionValues[region][dateIndex];
  }, [selectedScenario, region, currentValues, dateIndex]);
  if (!datasets || !data || !comparisonData || !selectedScenario) {
    return <><Navbar /><Box sx={{ display: "grid", minHeight: "calc(100vh - 76px)", placeItems: "center" }}><Stack sx={{ alignItems: 'center', gap: 2 }}><CircularProgress color="primary" /><Typography variant="caption" color="text.secondary">Loading scenario explorer…</Typography></Stack></Box></>;
  }

  return (
    <><Navbar />
      <Box component="main" sx={{ bgcolor: 'base.800', backgroundImage: "radial-gradient(circle at 15% 0, rgba(81,93,97,.18), transparent 34%)", boxSizing: "border-box", display: "flex", flexDirection: "column", height: { xs: 'auto', lg: 'calc(100dvh - 76px)' }, minHeight: { xs: 'calc(100vh - 72px)', lg: 0 }, overflow: { xs: 'visible', lg: 'hidden' }, p: 2, position: 'relative' }}>
      {isModeTransitioning && (
        <Box
          role="status"
          aria-live="polite"
          sx={{
            alignItems: 'center',
            backdropFilter: 'blur(3px)',
            bgcolor: 'rgba(20, 29, 31, 0.94)',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
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
      <Box component="header" sx={{ display: "grid", flex: '0 0 auto', gap: 2, gridTemplateColumns: { xs: "1fr", lg: "minmax(0,1fr) auto" }, mb: 2 }}>
        <Box>
          <Typography variant="h2">Salinity <Box component="span" color="primary.main">difference</Box> explorer</Typography>
          <Typography variant="caption"color="text.secondary" sx={{ mt: 1.25 }}>
            {dashboardMode === "rma-schism"
              ? "Daily station delta = SCHISM daily mean EC minus RMA daily mean EC over paired stations and their shared time period. Regional lines average station deltas; bands show the selected region spread across stations."
              : dashboardMode === "tiered-outflows"
                ? "Daily station delta = the selected SCHISM outflow run daily mean EC minus Run 15 daily mean EC over shared stations and dates. Compare the +30% and −10% outflow tiers across the map, regional timeline, and station distribution."
              : "Daily station delta = Selected scenario daily mean minus the selected base scenario daily mean. EC-AVG-AVG. Regional lines average station deltas; bands show the selected region spread across stations."}
          </Typography>
        </Box>
        <Tabs
          aria-label="Dashboard comparison mode"
          onChange={(_, value) => selectDashboardMode(value as DashboardMode)}
          value={dashboardMode}
          sx={{
            alignSelf: "start",
            border: 1,
            borderColor: "divider",
            justifySelf: { xs: "stretch", lg: "end" },
            minHeight: "3rem",
            "& .MuiTab-root": { minHeight: "3rem" },
            "& .Mui-selected": { color: `${palette.pink} !important` },
            "& .MuiTabs-indicator": { backgroundColor: palette.pink, height: 3 },
          }}
        >
          <Tab label="RMA Scenario Comparison" value="rma-scenarios" />
          <Tab label="RMA vs. SCHISM" value="rma-schism" />
          <Tab label="Tiered Outflows" value="tiered-outflows" />
        </Tabs>
      </Box>

      <PaperControls>
        {dashboardMode === "rma-schism" ? (
          <>
            <LabeledSelect label="Base Model" value={baseScenario} onChange={(event) => { const next = event.target.value as ModelKey; setBaseScenario(next); setSelectedModel(next === "rma" ? "schism" : "rma"); setHistogramBrush(null); }}>
              <MenuItem value="rma" sx={{ ...scenarioNameSx, color: "brand.primaryBlue" }}>RMA</MenuItem>
              <MenuItem value="schism" sx={{ ...scenarioNameSx, color: "brand.primaryBlue" }}>SCHISM</MenuItem>
            </LabeledSelect>
            <SwapButton label="Swap base and selected models" onClick={() => { const previousBase = baseScenario as ModelKey; setBaseScenario(selectedModel); setSelectedModel(previousBase); setHistogramBrush(null); }} />
            <LabeledSelect label="Selected Model" value={selectedModel} onChange={(event) => { const next = event.target.value as ModelKey; setSelectedModel(next); setBaseScenario(next === "rma" ? "schism" : "rma"); setHistogramBrush(null); }}>
              <MenuItem value="rma" sx={{ ...scenarioNameSx, color: "brand.primaryGreen" }}>RMA</MenuItem>
              <MenuItem value="schism" sx={{ ...scenarioNameSx, color: "brand.primaryGreen" }}>SCHISM</MenuItem>
            </LabeledSelect>
            <LabeledSelect label="Scenario" value={scenario} onChange={(event) => selectMapScenario(event.target.value)}>
              {data.scenarios.map((item) => <MenuItem key={item.key} value={item.key} sx={{ ...scenarioNameSx, color: "brand.primaryGreen" }}>{item.label}</MenuItem>)}
            </LabeledSelect>
          </>
        ) : dashboardMode === "tiered-outflows" ? (
          <>
            <LabeledSelect label="Base Scenario" value={baseScenario} onChange={(event) => selectBaseScenario(event.target.value)}>
              {scenarioOptions.map((item) => <MenuItem disabled={item.key === scenario} key={item.key} value={item.key} sx={{ ...scenarioNameSx, color: "brand.primaryBlue" }}>{item.label}</MenuItem>)}
            </LabeledSelect>
            <SwapButton onClick={swapScenarios} />
            <LabeledSelect label="Selected Scenario" value={scenario} onChange={(event) => selectMapScenario(event.target.value)}>
              {scenarioOptions.map((item) => <MenuItem disabled={item.key === baseScenario} key={item.key} value={item.key} sx={{ ...scenarioNameSx, color: "brand.primaryGreen" }}>{item.label}</MenuItem>)}
            </LabeledSelect>
          </>
        ) : (
          <>
            <LabeledSelect label="Base Scenario" value={baseScenario} onChange={(event) => selectBaseScenario(event.target.value)}>
              {scenarioOptions.map((item) => <MenuItem key={item.key} value={item.key} sx={{ ...scenarioNameSx, color: "brand.primaryBlue" }}>{item.label}</MenuItem>)}
            </LabeledSelect>
            <SwapButton onClick={swapScenarios} />
            <LabeledSelect label="Selected Scenario" value={scenario} onChange={(event) => selectMapScenario(event.target.value)}>
              {scenarioOptions.map((item) => <MenuItem disabled={item.key === baseScenario} key={item.key} value={item.key} sx={{...scenarioNameSx, color: "brand.primaryGreen"}}>{item.label}</MenuItem>)}
            </LabeledSelect>
          </>
        )}
        <LabeledSelect label="Selected Region" value={region}
          onChange={(event) => selectRegion(event.target.value)}>
          <MenuItem value="All regions">All regions</MenuItem>
          {data.regions.map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}
        </LabeledSelect>
        <Box>
          <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mb: 0.75 }}>Values</Typography>
          <ToggleButtonGroup exclusive size="small" value={valueMode} onChange={(_, value) => { if (value) { setValueMode(value as ValueMode); setHistogramBrush(null); } }} aria-label="Value display mode" sx={{ height: '2.5rem' }}>
            <ToggleButton value="raw" sx={{ textTransform: 'none' }}>{"\u00B5S/cm"}</ToggleButton>
            <ToggleButton value="percent">Percent change</ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <Box sx={{ display: "grid", flex: 1, minWidth: { xs: "100%", md: "20rem" } }}>
          <Stack direction="row" spacing={2} sx={{ justifyContent: 'space-between', mb: 0.75 }}>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>Date</Typography>
            <Typography variant="h5">{formatDate(data.dates[dateIndex])}</Typography>
          </Stack>
          <Slider
            min={0}
            max={data.dates.length - 1}
            value={dateIndex}
            onChange={(_, value) => selectDateIndex(value)}
            aria-label="Dashboard date"
            sx={{
              color: 'common.white',
              '& .MuiSlider-rail': { color: 'common.white', opacity: 0.38 },
              '& .MuiSlider-track, & .MuiSlider-thumb': { color: 'common.white' },
            }}
          />
        </Box>
      </PaperControls>

      <Box sx={{ alignItems: "stretch", display: "grid", flex: 1, gap: 2, gridAutoRows: { lg: "minmax(0, 1fr)" }, gridTemplateColumns: { xs: "1fr", lg: "minmax(24rem,.88fr) minmax(10rem,.3fr) minmax(34rem,1.35fr)" }, minHeight: 0, overflow: { xs: 'visible', lg: 'hidden' } }}>
        <DeltaMap key={`${dashboardMode}-map`} data={comparisonData} scenario={scenario} dateIndex={dateIndex} region={region} mapExtent={mapExtent} selectedScenario={selectedScenario} baseScenarioLabel={comparisonBaseLabel} mapModelLabel={dashboardMode === "rma-schism" ? selectedModel.toUpperCase() : null} histogramBrush={histogramBrush} units={valueMode === "percent" ? "%" : "µS/cm"} />
        <StationHistogram key={`${scenario}-${region}-${dateIndex}`} data={comparisonData} region={region} scenario={selectedScenario} dateIndex={dateIndex} onBrushChange={setHistogramBrush} mapExtent={mapExtent} units={valueMode === "percent" ? "%" : "µS/cm"} />
        <RegionalChart key={`${dashboardMode}-chart`} data={comparisonData} region={region} selectedScenario={selectedScenario} baseScenarioKey={baseScenario} baseScenarioLabel={comparisonBaseLabel} regionValue={regionValue} activeKeys={activeKeys} onActiveKeysChange={setActiveKeys} dateIndex={dateIndex} onDateChange={selectDateIndex} onHistogramBrush={setHistogramBrush} mapExtent={mapExtent} units={valueMode === "percent" ? "%" : "µS/cm"} />
      </Box>
    </Box></>
  );
}

function PaperControls({ children }: { children: ReactNode }) {
  return <Box component="section" sx={{ alignItems: "end", bgcolor: "base.700", border: 1, borderColor: "divider", display: "flex", flex: '0 0 auto', flexWrap: "wrap", gap: 2, mb: 2, p: 1.5 }}>{children}</Box>;
}
