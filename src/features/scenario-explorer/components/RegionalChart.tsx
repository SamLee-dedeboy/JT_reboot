import { useLayoutEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { Box, Divider, IconButton, Paper, Slider, ToggleButton, ToggleButtonGroup, Tooltip, Typography, useTheme } from "@mui/material";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { AnimatePresence, motion } from 'framer-motion';
import { area, line } from "d3-shape";
import { chartTransition, formatDate, formatNumber } from '../format';
import type { DashboardMode, RangeMode, Scenario, ScenarioDataset } from '../types';
import ExplorerInfoPopover from './ExplorerInfoPopover';

const DEFAULT_WIDTH = 900;
const DEFAULT_HEIGHT = 390;
const PAD = { left: 86, right: 18, top: 18, bottom: 68 };
const DATE_LABEL_Y_OFFSET = 44;
const YEAR_BAND_Y_OFFSET = 32;
const YEAR_BAND_HEIGHT = 26;

interface ChartSvgProps {
  data: ScenarioDataset;
  dashboardMode: DashboardMode;
  region: string;
  activeKeys: string[];
  dateIndex: number;
  onDateChange: (index: number) => void;
  onDateCommit: (index: number) => void;
  rangeMode: RangeMode;
  selectedScenarioKey: string;
  selectedScenarioLabel: string;
  hoveredScenarioKey: string | null;
  baseScenarioLabel: string;
  units: string;
}

interface RangeDatum { q1: number | null; q3: number | null }
interface SeriesSummary {
  values: Array<number | null>;
  rangeLow: Array<number | null>;
  rangeHigh: Array<number | null>;
}

const regionalSummaryCache = new WeakMap<ScenarioDataset, Map<string, SeriesSummary>>();

const sortedQuantile = (sorted: number[], fraction: number): number | null => {
  if (!sorted.length) return null;
  const position = (sorted.length - 1) * fraction;
  const lower = Math.floor(position);
  const upper = Math.ceil(position);
  const weight = position - lower;
  return sorted[lower] * (1 - weight) + sorted[upper] * weight;
};

const SCENARIO_ABBREVIATIONS: Record<string, string> = {
  'Business as Usual': 'BAU',
  'Bolster & Fortify': 'B&F',
  'Calling on Reserve': 'COR',
  'A Tunnel': 'TUN',
  'Eco Machine': 'ECO',
  'New Green Watershed': 'NGW',
};

const abbreviateScenario = (label: string) => SCENARIO_ABBREVIATIONS[label] ?? label;

function ChartSvg({ data, dashboardMode, region, activeKeys, dateIndex, onDateChange, onDateCommit, rangeMode, selectedScenarioKey, selectedScenarioLabel, hoveredScenarioKey, baseScenarioLabel, units }: ChartSvgProps) {
  const theme = useTheme();
  const [scrubbing, setScrubbing] = useState(false);
  const plotRef = useRef<HTMLDivElement | null>(null);
  const [{ height, width }, setPlotSize] = useState({ height: DEFAULT_HEIGHT, width: DEFAULT_WIDTH });
  useLayoutEffect(() => {
    const node = plotRef.current;
    if (!node) return undefined;
    const observer = new ResizeObserver(([entry]) => setPlotSize({
      height: Math.max(DEFAULT_HEIGHT, Math.round(entry.contentRect.height)),
      width: Math.max(320, Math.round(entry.contentRect.width)),
    }));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  const stationIndices = useMemo(() => data.stations.map((station, index) => ({ station, index })).filter(({ station }) => region === "All regions" || station.region === region).map(({ index }) => index), [data.stations, region]);
  const series = useMemo(() => data.scenarios.filter((scenario) => activeKeys.includes(scenario.key)).map((scenario) => {
    let datasetCache = regionalSummaryCache.get(data);
    if (!datasetCache) {
      datasetCache = new Map();
      regionalSummaryCache.set(data, datasetCache);
    }
    const cacheKey = `${scenario.key}|${region}|${rangeMode}`;
    let summary = datasetCache.get(cacheKey);
    if (!summary) {
      const dailySummaries = data.dates.map((_, date) => {
        const values = stationIndices.map((index) => scenario.stationValues[index][date]).filter((value): value is number => value != null && Number.isFinite(value));
        if (!values.length) return { average: null, low: null, high: null };
        const sorted = [...values].sort((a, b) => a - b);
        return {
          average: values.reduce((sum, value) => sum + value, 0) / values.length,
          low: rangeMode === "iqr" ? sortedQuantile(sorted, 0.25) : rangeMode === "p90" ? sortedQuantile(sorted, 0.05) : sorted[0],
          high: rangeMode === "iqr" ? sortedQuantile(sorted, 0.75) : rangeMode === "p90" ? sortedQuantile(sorted, 0.95) : sorted[sorted.length - 1],
        };
      });
      summary = {
        values: dailySummaries.map(({ average }) => average),
        rangeLow: dailySummaries.map(({ low }) => low),
        rangeHigh: dailySummaries.map(({ high }) => high),
      };
      datasetCache.set(cacheKey, summary);
    }
    return {
      ...scenario,
      ...summary,
      color: scenario.key === selectedScenarioKey ? theme.palette.brand.primaryGreen : theme.palette.common.white,
    };
  }), [data, data.scenarios, stationIndices, activeKeys, rangeMode, region, selectedScenarioKey, theme.palette.brand.primaryGreen, theme.palette.common.white]);
  const scenarioSignature = activeKeys.join("|");
  const previousScenario = useRef(scenarioSignature);
  const previousRegion = useRef(region);
  const [phase, setPhase] = useState("baseline");
  const [sequence, setSequence] = useState(0);

  useLayoutEffect(() => {
    const scenarioChanged = previousScenario.current !== scenarioSignature;
    const regionChanged = previousRegion.current !== region;
    if (scenarioChanged) {
      // Animation phase changes are intentionally synchronized to the selected series.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSequence((value) => value + 1);
      setPhase("baseline");
    } else if (regionChanged) {
      setPhase("regionLine");
    }
    previousScenario.current = scenarioSignature;
    previousRegion.current = region;
  }, [scenarioSignature, region]);
  const allValues = series.flatMap((item) => [...item.values, ...item.rangeLow, ...item.rangeHigh]).filter((value): value is number => value != null && Number.isFinite(value));
  const extent = Math.max(1, ...allValues.map(Math.abs));
  const x = (index: number) => PAD.left + index / Math.max(1, data.dates.length - 1) * (width - PAD.left - PAD.right);
  const y = (value: number) => PAD.top + (extent - value) / (extent * 2) * (height - PAD.top - PAD.bottom);
  const linePath = line<number | null>().defined((value): value is number => value != null).x((_, index) => x(index)).y((value) => y(value!));
  const areaPath = area<RangeDatum>().defined((value) => value.q1 != null && value.q3 != null).x((_, index) => x(index)).y0((value) => y(value.q1!)).y1((value) => y(value.q3!));
  const collapsedAreaPath = area<RangeDatum>().defined((value) => value.q1 != null && value.q3 != null).x((_, index) => x(index)).y0(y(0)).y1(y(0));
  const ticks = [-extent, -extent / 2, 0, extent / 2, extent];
  const boundaryIndex = (date: string) => data.dates.findIndex((item) => item >= date);
  const finalDateIndex = data.dates.length - 1;
  const periods = (() => {
    if (dashboardMode === 'rma-schism') {
      const criticalStart = boundaryIndex('2020-10-01');
      return criticalStart >= 0
        ? [{ start: 0, end: criticalStart, label: 'Dry year' }, { start: criticalStart, end: finalDateIndex, label: 'Critical' }]
        : [];
    }
    if (dashboardMode === 'tiered-outflows') {
      const criticalStart = boundaryIndex('2020-10-01');
      const secondCriticalStart = boundaryIndex('2021-10-01');
      return criticalStart >= 0 && secondCriticalStart >= 0
        ? [
            { start: 0, end: criticalStart, label: 'Dry year' },
            { start: criticalStart, end: secondCriticalStart, label: 'Critical' },
            { start: secondCriticalStart, end: finalDateIndex, label: 'Critical' },
          ]
        : [];
    }
    const dryStart = boundaryIndex('2019-10-01');
    const criticalStart = boundaryIndex('2020-10-01');
    return dryStart >= 0 && criticalStart >= 0
      ? [
          { start: 0, end: dryStart, label: 'Wet year' },
          { start: dryStart, end: criticalStart, label: 'Dry year' },
          { start: criticalStart, end: finalDateIndex, label: 'Critical' },
        ]
      : [];
  })();
  const periodBoundaries = periods.slice(1).map(({ start }) => start);
  const dateTicks = [0, data.dates.length - 1];
  const indexFromPointer = (event: ReactPointerEvent<SVGSVGElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const pointerX = (event.clientX - bounds.left) / bounds.width * width;
    return Math.max(0, Math.min(data.dates.length - 1, Math.round((pointerX - PAD.left) / (width - PAD.left - PAD.right) * (data.dates.length - 1))));
  };
  const textStyle = { fill: theme.palette.base[300], fontFamily: theme.typography.captionSmall.fontFamily, fontSize: theme.typography.captionSmall.fontSize };
  const tickColor = (tick: number) => tick > 0 ? theme.palette.salinity.pink : tick < 0 ? theme.palette.salinity.teal : theme.palette.common.white;
  const formatTick = (tick: number) => `${formatNumber(tick)}${units === "%" && tick !== 0 ? "%" : ""}`;

  return (
    <Box sx={{ display: "flex", flex: 1, flexDirection: "column", minHeight: 0 }}>
    <Box sx={(theme) => ({ alignItems: 'start', display: 'grid', gap: theme.jtSpacing.gap.xs, gridTemplateColumns: `${PAD.left}px minmax(0, 1fr)`, mx: theme.jtSpacing.component.sm, py: theme.jtSpacing.component.xs })}>
      <Typography variant="captionSmall" color="text.secondary" sx={{ alignSelf: 'end', lineHeight: 1.15, textAlign: 'right' }}>
        {units === "%" ? <><Box component="span" sx={{ display: 'block' }}>Change from</Box><Box component="span" sx={{ display: 'block' }}>base (%)</Box></> : <><Box component="span" sx={{ display: 'block' }}>Δ EC-AVG-AVG</Box><Box component="span" sx={{ display: 'block' }}>(µS/cm)</Box></>}
      </Typography>
      <Box sx={{ display: 'grid', gap: 'inherit', mr: `${PAD.right}px` }}>
        <Box sx={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="caption" color="text.secondary">Date</Typography>
          <Typography variant="h5" sx={{ '&&': { color: 'brand.primaryBlue' } }}>{formatDate(data.dates[dateIndex])}</Typography>
        </Box>
        <Slider
          aria-label="Dashboard date"
          min={0}
          max={data.dates.length - 1}
          value={dateIndex}
          onChange={(_, value) => onDateChange(value as number)}
          onChangeCommitted={(_, value) => onDateCommit(value as number)}
          sx={{ color: 'common.white', '& .MuiSlider-rail': { opacity: 0.38 } }}
        />
      </Box>
    </Box>
    <Box ref={plotRef} sx={(theme) => ({ flex: 1, minHeight: { xs: DEFAULT_HEIGHT, lg: 0 }, mx: theme.jtSpacing.component.sm, overflow: "hidden", position: "relative" })}>
      <Box component="svg" viewBox={`0 0 ${width} ${height}`} sx={{ bottom: 0, cursor: scrubbing ? "ew-resize" : "pointer", display: "block", height: "100%", left: 0, overflow: "visible", position: "absolute", right: 0, top: 0, touchAction: "none", width: "100%" }}
        onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); setScrubbing(true); onDateChange(indexFromPointer(event)); }}
        onPointerUp={(event) => { const index = indexFromPointer(event); event.currentTarget.releasePointerCapture(event.pointerId); setScrubbing(false); onDateChange(index); onDateCommit(index); }}
        onPointerCancel={() => setScrubbing(false)}
        onPointerMove={(event) => { if (scrubbing) onDateChange(indexFromPointer(event)); }}
      >
        <g aria-label="Value axis">
          {ticks.map((tick, index) => <g key={index}><line x1={PAD.left} x2={width - PAD.right} y1={y(tick)} y2={y(tick)} stroke={tickColor(tick)} strokeOpacity="0.24" strokeWidth="1" /><text x={PAD.left - 10} y={y(tick) + 4} textAnchor="end" style={{ ...textStyle, fill: tickColor(tick), fontWeight: 700 }}>{formatTick(tick)}</text></g>)}
        </g>
        {dateTicks.map((index) => <text key={index} x={x(index)} y={height - DATE_LABEL_Y_OFFSET} textAnchor={index === 0 ? "start" : "end"} style={textStyle}>{formatDate(data.dates[index])}</text>)}
        <motion.line key={`baseline-${sequence}`}
          x1={PAD.left} x2={width - PAD.right} y1={y(0)} y2={y(0)} stroke={theme.palette.base[400]} strokeWidth="3" initial={{ pathLength: 0, x1: PAD.left, x2: width - PAD.right, y1: y(0), y2: y(0) }} animate={{ pathLength: 1, x1: PAD.left, x2: width - PAD.right, y1: y(0), y2: y(0) }} transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }} onAnimationComplete={() => { if (phase === "baseline") setPhase("line"); }} />
        <motion.text key={`baseline-label-${sequence}`} x={PAD.left + 8} y={y(0) - 8} fill={theme.palette.base[100]} style={{ ...textStyle, fontWeight: 700 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1, duration: 0.3 }}>{baseScenarioLabel}</motion.text>
        <text x={width - PAD.right} y={PAD.top + 16} textAnchor="end" style={{ ...textStyle, fill: theme.palette.brand.primaryGreen, fontWeight: 700 }}>Selected: {selectedScenarioLabel}</text>
        <AnimatePresence>{(phase === "regionLine" || phase === "band" || phase === "ready") && series.map((item, index) => {
          const range = item.rangeLow.map((q1, date) => ({ q1, q3: item.rangeHigh[date] }));
          const highlighted = item.key === hoveredScenarioKey;
          const deEmphasized = hoveredScenarioKey != null && item.key !== selectedScenarioKey && !highlighted;
          return <motion.path key={`range-${item.key}-${sequence}`} initial={{ d: collapsedAreaPath(range) || "", opacity: 0 }} animate={{ d: areaPath(range) || "", opacity: highlighted ? 0.64 : deEmphasized ? 0.05 : 0.24, fill: highlighted ? theme.palette.brand.primaryBlue : item.color }} exit={{ opacity: 0 }} transition={{ d: { duration: phase === "regionLine" ? 0 : 1.15, ease: [0.22, 1, 0.36, 1] }, opacity: { duration: phase === "regionLine" ? 0 : 1.15 } }} onAnimationComplete={() => { if (index === series.length - 1 && phase === "band") setPhase("ready"); }} />;
        })}</AnimatePresence>
        <AnimatePresence>{phase !== "baseline" && series.map((item, index) => {
          const clipId = `timeline-reveal-${item.key}-${sequence}`;
          return <g key={`${item.key}-${sequence}`}>
            <defs><clipPath id={clipId}><motion.rect x={PAD.left} y={PAD.top} height={height - PAD.top - PAD.bottom} initial={{ width: phase === "regionLine" ? width - PAD.left - PAD.right : 0 }} animate={{ width: width - PAD.left - PAD.right }} transition={{ duration: phase === "line" ? 1.6 : 1.4, ease: [0.22, 1, 0.36, 1] }} onAnimationComplete={() => { if (index === series.length - 1 && (phase === "line" || phase === "regionLine")) setPhase("band"); }} /></clipPath></defs>
            <motion.path initial={{ d: linePath(item.values) || "", opacity: phase === "regionLine" ? 1 : 0 }} animate={{ d: linePath(item.values) || "", opacity: hoveredScenarioKey != null && item.key !== selectedScenarioKey && item.key !== hoveredScenarioKey ? 0.2 : 1, stroke: item.key === hoveredScenarioKey ? theme.palette.brand.primaryBlue : item.color, strokeWidth: item.key === hoveredScenarioKey ? 5 : 2 }} exit={{ opacity: 0 }} transition={{ d: { duration: 1.4, ease: [0.22, 1, 0.36, 1] }, opacity: { duration: 0.2 }, stroke: { duration: 0.18 }, strokeWidth: { duration: 0.18 } }} clipPath={`url(#${clipId})`} fill="none" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
          </g>;
        })}</AnimatePresence>
        {periodBoundaries.map((index) => <line key={`period-boundary-${index}`} x1={x(index)} x2={x(index)} y1={PAD.top} y2={height - PAD.bottom} stroke={theme.palette.base[300]} strokeDasharray="5 5" strokeWidth="1.5" />)}
        {periods.length > 0 && <g aria-label="Water year periods">
          {periods.map((period, index) => <g key={`${period.label}-${period.start}`}>
            <rect x={x(period.start)} y={height - YEAR_BAND_Y_OFFSET} width={Math.max(0, x(period.end) - x(period.start))} height={YEAR_BAND_HEIGHT} rx="4" fill={index === 0 ? theme.palette.base[400] : 'none'} stroke={index === 0 ? 'none' : theme.palette.base[300]} strokeWidth="1.5" />
            <text x={(x(period.start) + x(period.end)) / 2} y={height - YEAR_BAND_Y_OFFSET + 17} textAnchor="middle" style={{ ...textStyle, fill: index === 0 ? theme.palette.common.white : theme.palette.base[100], fontWeight: 700 }}>{period.label}</text>
          </g>)}
        </g>}
        <motion.line x1={x(dateIndex)} x2={x(dateIndex)} y1={PAD.top} y2={height - PAD.bottom} initial={{ x1: x(dateIndex), x2: x(dateIndex), y1: PAD.top, y2: height - PAD.bottom }} animate={{ x1: x(dateIndex), x2: x(dateIndex), y1: PAD.top, y2: height - PAD.bottom }} transition={{ duration: 0.16, ease: "easeOut" }} stroke={theme.palette.common.white} strokeWidth="1.5" opacity=".85" />
        <AnimatePresence>{(phase === "band" || phase === "ready") && series.map((item) => {
          const selectedValue = item.values[dateIndex];
          if (selectedValue == null) return null;
          const pointX = x(dateIndex);
          const pointY = y(selectedValue);
          const pointRadius = item.key === hoveredScenarioKey ? 7 : 5;
          const pointFill = item.key === hoveredScenarioKey ? theme.palette.brand.primaryBlue : item.color;
          return <motion.circle key={`selected-${item.key}`} cx={pointX} cy={pointY} r={pointRadius} fill={pointFill} initial={{ cx: pointX, cy: pointY, opacity: 0, r: pointRadius }} animate={{ cx: pointX, cy: pointY, opacity: 1, fill: pointFill, r: pointRadius }} exit={{ cx: pointX, cy: pointY, opacity: 0, r: pointRadius }} transition={chartTransition} stroke={theme.palette.base[900]} strokeWidth="2" />;
        })}</AnimatePresence>
      </Box>
      </Box>
    </Box>
  );
}

interface RegionalChartProps {
  data: ScenarioDataset;
  dashboardMode: DashboardMode;
  region: string;
  selectedScenario: Scenario;
  baseScenarioKey: string;
  baseScenarioLabel: string;
  rawRegionValue: number | null;
  percentRegionValue: number | null;
  activeKeys: string[];
  onActiveKeysChange: (keys: string[]) => void;
  dateIndex: number;
  onDateChange: (index: number) => void;
  onDateCommit: (index: number) => void;
  units: string;
}

export default function RegionalChart({ data, dashboardMode, region, selectedScenario, baseScenarioKey, baseScenarioLabel, rawRegionValue, percentRegionValue, activeKeys, onActiveKeysChange, dateIndex, onDateChange, onDateCommit, units }: RegionalChartProps) {
  const [rangeMode, setRangeMode] = useState<RangeMode>('minmax');
  const [bandInfoAnchor, setBandInfoAnchor] = useState<HTMLButtonElement | null>(null);
  const [visibilityInfoAnchor, setVisibilityInfoAnchor] = useState<HTMLButtonElement | null>(null);
  const [hoveredScenarioKey, setHoveredScenarioKey] = useState<string | null>(null);
  const coverage = rangeMode === "iqr" ? { first: 5, last: 14, label: "Middle 50% of stations" } : rangeMode === "p90" ? { first: 1, last: 18, label: "Middle 90% of stations" } : { first: 0, last: 19, label: "All stations" };
  return (
    <Paper
      variant="outlined"
      component="article"
      sx={{
        bgcolor: 'base.700',
        borderRadius: 1,
        display: "flex",
        flexDirection: "column",
        height: '100%',
        minWidth: 0,
        overflow: "hidden",
        position: "relative",
        userSelect: "none",
        WebkitUserSelect: "none",
        "& text, & .MuiTypography-root, & .MuiFormControlLabel-label": {
          pointerEvents: "none",
        },
      }}
    >
      <Box sx={(theme) => ({ alignItems: 'start', borderBottom: 1, borderColor: "divider", display: "grid", gap: theme.jtSpacing.gap.lg, gridTemplateColumns: 'auto minmax(0, 1fr) auto', p: theme.jtSpacing.component.sm })}>
          <Box sx={(theme) => ({ display: 'grid', gap: theme.jtSpacing.gap.xs })}>
            <Box sx={(theme) => ({ alignItems: 'center', display: 'flex', gap: theme.jtSpacing.gap.xs })}>
              <Typography variant="caption" color="text.secondary">Station range</Typography>
              <IconButton aria-label="Explain the shaded station range" onClick={(event) => setBandInfoAnchor(event.currentTarget)} size="small" sx={{ color: "text.secondary", p: 0 }}><InfoOutlinedIcon fontSize="small" /></IconButton>
            </Box>
            <Box sx={(theme) => ({ alignItems: 'center', display: 'flex', gap: theme.jtSpacing.gap.xs })}>
            <ToggleButtonGroup exclusive size="small" value={rangeMode} onChange={(_, value) => { if (value) setRangeMode(value); }} aria-label="Shaded station range">
              <ToggleButton value="minmax">All stations</ToggleButton>
              <ToggleButton value="p90">Middle 90%</ToggleButton>
              <ToggleButton value="iqr">Middle 50%</ToggleButton>
            </ToggleButtonGroup>
            </Box>
          </Box>
          <Box sx={(theme) => ({ display: 'grid', gap: theme.jtSpacing.gap.xs, minWidth: 0, overflow: 'hidden' })}>
            <Box sx={(theme) => ({ alignItems: 'center', display: 'flex', gap: theme.jtSpacing.gap.xs })}>
              <Typography variant="caption" color="text.secondary">Visible scenarios</Typography>
              <IconButton aria-label="Explain scenario visibility" onClick={(event) => setVisibilityInfoAnchor(event.currentTarget)} size="small" sx={{ color: 'text.secondary', p: 0 }}><InfoOutlinedIcon fontSize="small" /></IconButton>
            </Box>
            <Box sx={(theme) => ({ display: 'flex', flexWrap: 'nowrap', gap: theme.jtSpacing.gap.xs, minWidth: 0, overflowX: 'auto', scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } })}>
            {data.scenarios.filter((scenario) => scenario.key !== baseScenarioKey).map((scenario) => {
              const active = activeKeys.includes(scenario.key);
              const primary = scenario.key === selectedScenario.key;
              const visible = primary || active;
              return (
                <Tooltip key={scenario.key} title={scenario.label}>
                  <span>
                    <ToggleButton
                      aria-label={`${visible ? 'Hide' : 'Show'} ${scenario.label}`}
                      selected={visible}
                      size="small"
                      value={scenario.key}
                      onChange={() => { if (!primary) onActiveKeysChange(active ? activeKeys.filter((key) => key !== scenario.key) : [...activeKeys, scenario.key]); }}
                      onMouseEnter={() => { if (active && !primary) setHoveredScenarioKey(scenario.key); }}
                      onMouseLeave={() => setHoveredScenarioKey(null)}
                      sx={(theme) => ({ border: 0, gap: theme.jtSpacing.gap.xs, height: theme.spacing(5), minWidth: theme.spacing(7), px: theme.jtSpacing.component.xs, typography: 'button', '&.Mui-selected': { bgcolor: 'surface', color: primary ? 'brand.primaryGreen' : 'common.white' } })}
                    >
                      {visible ? <VisibilityOutlinedIcon fontSize="small" /> : <VisibilityOffOutlinedIcon fontSize="small" />}
                      {abbreviateScenario(scenario.label)}
                    </ToggleButton>
                  </span>
                </Tooltip>
              );
            })}
            </Box>
          </Box>
          <Box sx={(theme) => ({ display: "grid", gap: theme.jtSpacing.gap.xs, justifyItems: "end" })}>
            <Typography variant="caption" color="text.secondary">Current average deviation</Typography>
            <Box sx={(theme) => ({ alignItems: 'baseline', display: 'flex', gap: theme.jtSpacing.gap.sm, whiteSpace: 'nowrap' })}>
              <Typography variant="h4" sx={{ color: Number(rawRegionValue) > 0 ? "salinity.pink" : Number(rawRegionValue) < 0 ? "salinity.teal" : "common.white" }}>{Number(rawRegionValue) > 0 ? "+" : ""}{formatNumber(rawRegionValue)} <Box component="span" sx={{ color: "text.secondary", typography: 'captionSmall', textTransform: "none" }}>µS/cm</Box></Typography>
              <Typography variant="h4" sx={{ color: Number(percentRegionValue) > 0 ? "salinity.pink" : Number(percentRegionValue) < 0 ? "salinity.teal" : "common.white" }}>{Number(percentRegionValue) > 0 ? "+" : ""}{formatNumber(percentRegionValue)}<Box component="span" sx={{ color: "text.secondary", typography: 'captionSmall', textTransform: "none" }}>%</Box></Typography>
            </Box>
          </Box>
      </Box>
      <ExplorerInfoPopover anchor={bandInfoAnchor} onClose={() => setBandInfoAnchor(null)}>
          <Typography variant="caption" color="brand.primaryGreen">About the station range</Typography>
          <Typography variant="h5" sx={{ '&&': { color: 'brand.primaryGreen' } }}>What does the shaded range show?</Typography>
          <Typography variant="captionSmall" component="p" color="text.secondary">
            The <Box component="span" sx={{ color: 'brand.primaryGreen' }}>line</Box> shows the <strong>daily station average</strong>. The <Box component="span" sx={{ color: 'brand.primaryGreen' }}>shaded range</Box> shows how station values are <strong>distributed</strong> around it.
          </Typography>
          <Typography variant="captionSmall" component="p" color="text.secondary">For each date, stations are ordered from lowest to highest. The selected range includes:</Typography>
          <Divider />
          <Typography variant="caption" color="brand.primaryGreen">{coverage.label}</Typography>
          <Box aria-label={`${coverage.label}, shown across stations ordered by value`} sx={{ alignItems: "center", display: "flex", justifyContent: "space-between", width: "100%" }}>
            {Array.from({ length: 20 }, (_, index) => {
              const selected = index >= coverage.first && index <= coverage.last;
              return <Box key={index} sx={{ bgcolor: selected ? "brand.primaryGreen" : "base.700", border: 2, borderColor: selected ? "brand.primaryGreen" : "base.300", borderRadius: "50%", boxSizing: "border-box", height: 12, opacity: selected ? 1 : 0.85, width: 12 }} />;
            })}
          </Box>
          <Box sx={(theme) => ({ display: "grid", gridTemplateColumns: "1fr 1fr", mt: theme.jtSpacing.component.xs, width: "100%" })}><Typography variant="captionSmall" color="text.secondary" sx={{ justifySelf: "start" }}>Lowest</Typography><Typography variant="captionSmall" color="text.secondary" sx={{ justifySelf: "end", textAlign: "right" }}>Highest</Typography></Box>
          <Box sx={(theme) => ({ alignItems: "center", display: "flex", gap: theme.jtSpacing.gap.sm, mt: theme.jtSpacing.component.xs })}>
            <Box sx={(theme) => ({ alignItems: "center", display: "inline-flex", gap: theme.jtSpacing.gap.xs })}><Box sx={{ bgcolor: "brand.primaryGreen", borderRadius: "50%", flex: "0 0 10px", height: 10, width: 10 }} /><Typography variant="captionSmall">Included in range</Typography></Box>
            <Box sx={(theme) => ({ alignItems: "center", display: "inline-flex", gap: theme.jtSpacing.gap.xs })}><Box sx={{ bgcolor: "base.700", border: 2, borderColor: "base.300", borderRadius: "50%", boxSizing: "border-box", flex: "0 0 10px", height: 10, width: 10 }} /><Typography variant="captionSmall">Excluded</Typography></Box>
          </Box>
          <Divider />
          <Typography variant="captionSmall" component="p" color="text.secondary" sx={(theme) => ({ mt: theme.jtSpacing.component.sm })}><strong>All stations</strong> spans the lowest to highest station value. <strong>Middle 90%</strong> excludes the lowest and highest 5%. <strong>Middle 50%</strong> excludes the lowest and highest 25%.</Typography>
          <Typography variant="captionSmall" component="p" color="text.secondary" sx={(theme) => ({ mt: theme.jtSpacing.component.xs })}>The stations inside the range can change from day to day; this is not a fixed station-ID selection.</Typography>
      </ExplorerInfoPopover>
      <ExplorerInfoPopover anchor={visibilityInfoAnchor} onClose={() => setVisibilityInfoAnchor(null)}>
        <Typography variant="caption" color="brand.primaryGreen">About visible scenarios</Typography>
        <Typography variant="h5" sx={{ '&&': { color: 'brand.primaryGreen' } }}>Compare scenarios on the timeline</Typography>
        <Typography variant="captionSmall" component="p" color="text.secondary">
          Use the eye controls to add or remove scenario lines from the regional timeline. This makes it easier to compare alternative strategies without changing the selected scenario, map, or station distribution.
        </Typography>
        <Typography variant="captionSmall" component="p" color="text.secondary">
          The selected scenario is always visible as the <Box component="span" sx={{ color: 'brand.primaryGreen' }}>green line</Box>. Other visible scenarios appear as supporting comparison lines. The <Box component="span" sx={{ color: 'brand.primaryBlue' }}>base scenario</Box> is represented by the chart reference line and is intentionally omitted from these controls.
        </Typography>
      </ExplorerInfoPopover>
      <ChartSvg data={data} dashboardMode={dashboardMode} region={region} activeKeys={activeKeys} dateIndex={dateIndex} onDateChange={onDateChange} onDateCommit={onDateCommit} rangeMode={rangeMode} selectedScenarioKey={selectedScenario.key} selectedScenarioLabel={selectedScenario.label} hoveredScenarioKey={hoveredScenarioKey} baseScenarioLabel={baseScenarioLabel} units={units} />
    </Paper>
  );
}
