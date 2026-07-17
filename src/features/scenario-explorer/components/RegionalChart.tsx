import { useLayoutEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { Box, FormControlLabel, IconButton, Paper, Popover, Stack, Switch, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { AnimatePresence, motion } from 'framer-motion';
import { area, line } from "d3-shape";
import { chartTransition, formatDate, formatNumber, quantile } from '../format';
import { explorerPalette as palette, scenarioNameSx } from '../theme';
import type { HistogramBrush, RangeMode, Scenario, ScenarioDataset } from '../types';

const DEFAULT_WIDTH = 900;
const DEFAULT_HEIGHT = 390;
const PAD = { left: 86, right: 18, top: 18, bottom: 34 };

interface ChartSvgProps {
  data: ScenarioDataset;
  region: string;
  activeKeys: string[];
  dateIndex: number;
  onDateChange: (index: number) => void;
  rangeMode: RangeMode;
  selectedScenarioKey: string;
  baseScenarioLabel: string;
  units: string;
}

interface RangeDatum { q1: number | null; q3: number | null }

function ChartSvg({ data, region, activeKeys, dateIndex, onDateChange, rangeMode, selectedScenarioKey, baseScenarioLabel, units }: ChartSvgProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
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
    const dailyStations = data.dates.map((_, date) => stationIndices.map((index) => scenario.stationValues[index][date]).filter((value) => value != null));
    return {
      ...scenario,
      values: dailyStations.map((values) => values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null),
      rangeLow: dailyStations.map((values) => rangeMode === "iqr" ? quantile(values, 0.25) : rangeMode === "p90" ? quantile(values, 0.05) : values.length ? Math.min(...values) : null),
      rangeHigh: dailyStations.map((values) => rangeMode === "iqr" ? quantile(values, 0.75) : rangeMode === "p90" ? quantile(values, 0.95) : values.length ? Math.max(...values) : null),
      color: scenario.key === selectedScenarioKey ? palette.green : palette.white,
    };
  }), [data.dates, data.scenarios, stationIndices, activeKeys, rangeMode, selectedScenarioKey]);
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
  const wetDryIndex = data.dates.indexOf("2019-10-01");
  const dateTicks = [0, Math.floor((data.dates.length - 1) / 2), data.dates.length - 1]
    .filter((index) => wetDryIndex < 0 || index === 0 || index === data.dates.length - 1 || Math.abs(x(index) - x(wetDryIndex)) > 110);
  const indexFromPointer = (event: ReactPointerEvent<SVGSVGElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const pointerX = (event.clientX - bounds.left) / bounds.width * width;
    return Math.max(0, Math.min(data.dates.length - 1, Math.round((pointerX - PAD.left) / (width - PAD.left - PAD.right) * (data.dates.length - 1))));
  };
  const textStyle = { fill: palette.base300, fontFamily: 'var(--font-body)', fontSize: "clamp(.625rem,.55rem + .18vw,.75rem)" };
  const tickColor = (tick: number) => tick > 0 ? palette.pink : tick < 0 ? palette.teal : palette.white;
  const formatTick = (tick: number) => `${formatNumber(tick)}${units === "%" && Math.round(tick) !== 0 ? "%" : ""}`;

  return (
    <Box sx={{ display: "flex", flex: 1, flexDirection: "column", minHeight: 0 }}>
    <Box ref={plotRef} sx={{ flex: 1, minHeight: { xs: DEFAULT_HEIGHT, lg: 0 }, mx: 1.5, overflow: "hidden", position: "relative" }}>
      <Box component="svg" viewBox={`0 0 ${width} ${height}`} sx={{ bottom: 0, cursor: scrubbing ? "ew-resize" : "pointer", display: "block", height: "100%", left: 0, overflow: "visible", position: "absolute", right: 0, top: 0, touchAction: "none", width: "100%" }}
        onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); setScrubbing(true); const index = indexFromPointer(event); onDateChange(index); setHoverIndex(index); }}
        onPointerUp={(event) => { event.currentTarget.releasePointerCapture(event.pointerId); setScrubbing(false); }}
        onPointerCancel={() => setScrubbing(false)} onPointerLeave={() => { if (!scrubbing) setHoverIndex(null); }}
        onPointerMove={(event) => { const index = indexFromPointer(event); setHoverIndex(index); if (scrubbing) onDateChange(index); }}
      >
        <text transform={`translate(12 ${height / 2}) rotate(-90)`} textAnchor="middle" style={{ ...textStyle, fontSize: ".75rem" }}>{units === "%" ? "Change from base (%)" : "Δ EC-AVG-AVG (µS/cm)"}</text>
        <AnimatePresence>
          <motion.g key={`axis-${extent.toFixed(2)}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.5, ease: "easeOut" }}>
            {ticks.map((tick, index) => <g key={index}><line x1={PAD.left} x2={width - PAD.right} y1={y(tick)} y2={y(tick)} stroke={palette.base500} strokeWidth="1" /><text x={PAD.left - 10} y={y(tick) + 4} textAnchor="end" style={{ ...textStyle, fill: tickColor(tick), fontWeight: 700 }}>{formatTick(tick)}</text></g>)}
          </motion.g>
        </AnimatePresence>
        {dateTicks.map((index) => <text key={index} x={x(index)} y={height - 8} textAnchor={index === 0 ? "start" : index === data.dates.length - 1 ? "end" : "middle"} style={textStyle}>{formatDate(data.dates[index])}</text>)}
        <motion.line key={`baseline-${sequence}`} 
          x1={PAD.left} x2={width - PAD.right} y1={y(0)} y2={y(0)} stroke={palette.base400} strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }} onAnimationComplete={() => { if (phase === "baseline") setPhase("line"); }} />
        <motion.text key={`baseline-label-${sequence}`} x={PAD.left + 8} y={y(0) - 8} fill={palette.base100} style={{ ...textStyle, fontWeight: 700 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1, duration: 0.3 }}>{baseScenarioLabel}</motion.text>
        <AnimatePresence>{(phase === "band" || phase === "ready") && series.map((item, index) => {
          const range = item.rangeLow.map((q1, date) => ({ q1, q3: item.rangeHigh[date] }));
          return <motion.path key={`range-${item.key}-${sequence}`} initial={{ d: collapsedAreaPath(range) || "", opacity: 0 }} animate={{ d: areaPath(range) || "", opacity: 0.24 }} exit={{ opacity: 0 }} transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }} onAnimationComplete={() => { if (index === series.length - 1) setPhase("ready"); }} fill={item.color} />;
        })}</AnimatePresence>
        <AnimatePresence>{phase !== "baseline" && series.map((item, index) => {
          const clipId = `timeline-reveal-${item.key}-${sequence}`;
          return <g key={`${item.key}-${sequence}`}>
            <defs><clipPath id={clipId}><motion.rect x={PAD.left} y={PAD.top} height={height - PAD.top - PAD.bottom} initial={{ width: phase === "regionLine" ? width - PAD.left - PAD.right : 0 }} animate={{ width: width - PAD.left - PAD.right }} transition={{ duration: phase === "line" ? 2.4 : 1.4, ease: [0.22, 1, 0.36, 1] }} onAnimationComplete={() => { if (index === series.length - 1 && (phase === "line" || phase === "regionLine")) setPhase("band"); }} /></clipPath></defs>
            <motion.path initial={{ d: linePath(item.values) || "", opacity: phase === "regionLine" ? 1 : 0 }} animate={{ d: linePath(item.values) || "", opacity: 1 }} exit={{ opacity: 0 }} transition={{ d: { duration: 1.4, ease: [0.22, 1, 0.36, 1] }, opacity: { duration: 0.2 } }} clipPath={`url(#${clipId})`} fill="none" stroke={item.color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" vectorEffect="non-scaling-stroke" />
          </g>;
        })}</AnimatePresence>
        {wetDryIndex >= 0 && <g aria-label="September 1, 2019 separates the wet year from the dry year">
          <line x1={x(wetDryIndex)} x2={x(wetDryIndex)} y1={PAD.top} y2={height - PAD.bottom} stroke={palette.base300} strokeDasharray="5 5" strokeWidth="1.5" />
          <text x={x(wetDryIndex) - 8} y={PAD.top + 14} textAnchor="end" style={{ ...textStyle, fill: palette.base100, fontWeight: 700 }}>Wet year</text>
          <text x={x(wetDryIndex) + 8} y={PAD.top + 14} textAnchor="start" style={{ ...textStyle, fill: palette.base100, fontWeight: 700 }}>Dry year</text>
          <text x={x(wetDryIndex)} y={height - PAD.bottom + 18} textAnchor="middle" style={textStyle}>Oct 1, 2019</text>
        </g>}
        <motion.line animate={{ x1: x(dateIndex), x2: x(dateIndex) }} transition={{ duration: 0.16, ease: "easeOut" }} y1={PAD.top} y2={height - PAD.bottom} stroke={palette.white} strokeWidth="1.5" opacity=".85" />
        <AnimatePresence>{(phase === "band" || phase === "ready") && series.map((item) => item.values[dateIndex] != null && <motion.circle key={`selected-${item.key}`} initial={{ opacity: 0 }} animate={{ cx: x(dateIndex), cy: y(item.values[dateIndex]), opacity: 1 }} exit={{ opacity: 0 }} transition={chartTransition} r="5" fill={item.color} stroke={palette.base900} strokeWidth="2" />)}</AnimatePresence>
        {hoverIndex != null && <><line x1={x(hoverIndex)} x2={x(hoverIndex)} y1={PAD.top} y2={height - PAD.bottom} stroke={palette.white} strokeDasharray="3 3" opacity=".5" />{series.map((item) => item.values[hoverIndex] != null && <circle key={item.key} cx={x(hoverIndex)} cy={y(item.values[hoverIndex])} r="4" fill={item.color} />)}</>}
      </Box>
      </Box>
      <Box sx={{ alignItems: "center", display: "flex", justifyContent: "flex-end", minHeight: "4.5rem", px: 2, pb: 1 }}>
      {hoverIndex != null && (
        <Paper sx={{ alignItems: "center", bgcolor: "rgba(16,22,24,.94)", display: "flex", flexWrap: "wrap", gap: 1.5, maxWidth: "100%", p: 1.5 }}>
          <Typography variant="h5" sx={{ alignItems: "center", borderRight: 1, borderColor: "divider", display: "flex", pr: 1.5, whiteSpace: "nowrap" }}>{formatDate(data.dates[hoverIndex])}</Typography>
          {series.map((item) => {
            const lowLabel = rangeMode === "iqr" ? "25th percentile" : rangeMode === "p90" ? "5th percentile" : "Lowest station";
            const highLabel = rangeMode === "iqr" ? "75th percentile" : rangeMode === "p90" ? "95th percentile" : "Highest station";
            return <Box key={item.key} sx={{ alignItems: "center", display: "flex", flexWrap: "wrap", gap: 1.5 }}>
              <Box sx={{ alignItems: "center", columnGap: 1, display: "grid", gridTemplateColumns: "0.5rem auto" }}>
                <Box sx={{ bgcolor: item.color, borderRadius: "50%", height: "0.5rem", width: "0.5rem" }} />
                <Box component="span" sx={{ ...scenarioNameSx, lineHeight: 1.2, whiteSpace: "nowrap" }}>{item.label}</Box>
              </Box>
              <Box sx={{ alignItems: "center", display: "flex", flexWrap: "wrap", gap: 1.5 }}>
                <Box sx={{ display: "flex", gap: 0.6, whiteSpace: "nowrap" }}><Typography variant="body2" color="text.secondary">Daily station average</Typography><Typography variant="body2">{formatNumber(item.values[hoverIndex], 1)}</Typography></Box>
                <Box sx={{ display: "flex", gap: 0.6, whiteSpace: "nowrap" }}><Typography color="text.secondary">{lowLabel}</Typography><Typography>{formatNumber(item.rangeLow[hoverIndex], 1)}</Typography></Box>
                <Box sx={{ display: "flex", gap: 0.6, whiteSpace: "nowrap" }}><Typography color="text.secondary">{highLabel}</Typography><Typography>{formatNumber(item.rangeHigh[hoverIndex], 1)}</Typography></Box>
              </Box>
            </Box>;
          })}
        </Paper>
      )}
      </Box>
    </Box>
  );
}

interface RegionalChartProps {
  data: ScenarioDataset;
  region: string;
  selectedScenario: Scenario;
  baseScenarioKey: string;
  baseScenarioLabel: string;
  regionValue: number | null;
  activeKeys: string[];
  onActiveKeysChange: (keys: string[]) => void;
  dateIndex: number;
  onDateChange: (index: number) => void;
  onHistogramBrush: (brush: HistogramBrush) => void;
  mapExtent: number;
  units: string;
}

export default function RegionalChart({ data, region, selectedScenario, baseScenarioKey, baseScenarioLabel, regionValue, activeKeys, onActiveKeysChange, dateIndex, onDateChange, units }: RegionalChartProps) {
  const [rangeMode, setRangeMode] = useState<RangeMode>('minmax');
  const [bandInfoAnchor, setBandInfoAnchor] = useState<HTMLButtonElement | null>(null);
  const coverage = rangeMode === "iqr" ? { first: 5, last: 14, label: "Middle 50% of stations" } : rangeMode === "p90" ? { first: 1, last: 18, label: "Middle 90% of stations" } : { first: 0, last: 19, label: "All stations" };
  return (
    <Paper
      variant="outlined"
      component="article"
      sx={{
        bgcolor: 'base.700',
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
      <Box sx={{ borderBottom: 1, borderColor: "divider", display: "grid", gap: 2, p: 2.25 }}>
        <Box sx={{ alignItems: "flex-start", display: "flex", gap: 3, justifyContent: "space-between" }}>
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>Station range</Typography>
            <ToggleButtonGroup exclusive size="small" value={rangeMode} onChange={(_, value) => { if (value) setRangeMode(value); }} aria-label="Shaded station range">
              <ToggleButton value="minmax">All stations</ToggleButton>
              <ToggleButton value="p90">Middle 90%</ToggleButton>
              <ToggleButton value="iqr">Middle 50%</ToggleButton>
            </ToggleButtonGroup>
            <IconButton aria-label="Explain the shaded station range" onClick={(event) => setBandInfoAnchor(event.currentTarget)} size="small" sx={{ color: "text.secondary" }}><InfoOutlinedIcon sx={{ fontSize: '1.1rem' }} /></IconButton>
          </Stack>
          <Box sx={{ display: "grid", justifyItems: "end", ml: "auto" }}>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>Current Deviation</Typography>
            <Typography variant="h4" sx={{ color: Number(regionValue) > 0 ? palette.pink : Number(regionValue) < 0 ? palette.teal : palette.white, whiteSpace: "nowrap" }}>{Number(regionValue) > 0 ? "+" : ""}{formatNumber(regionValue, 1)} <Box component="span" sx={{ color: "text.secondary", typography: 'captionSmall', textTransform: "none" }}>{units}</Box></Typography>
          </Box>
        </Box>
          <Box sx={{ alignItems: 'center', display: 'grid', gap: 1.5, gridTemplateColumns: 'auto minmax(0, 1fr)', minWidth: 0, width: '100%' }}>
            <Typography variant="caption" sx={{ color: "text.secondary", whiteSpace: 'nowrap' }}>Visible scenarios</Typography>
            <Box sx={{ display: 'grid', gap: 0.75, gridTemplateColumns: `repeat(${data.scenarios.length}, minmax(0, 1fr))`, minWidth: 0 }}>
            {data.scenarios.map((scenario) => {
              const active = activeKeys.includes(scenario.key);
              const primary = scenario.key === selectedScenario.key;
              const comparisonBase = scenario.key === baseScenarioKey;
              const color = primary ? palette.green : palette.white;
              return <FormControlLabel key={scenario.key} control={<Switch size="small" checked={!comparisonBase && (primary || active)} disabled={primary || comparisonBase} onChange={() => onActiveKeysChange(active ? activeKeys.filter((key) => key !== scenario.key) : [...activeKeys, scenario.key])} sx={{ flex: '0 0 auto', "& .MuiSwitch-switchBase.Mui-checked": { color }, "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: color }, "& .MuiSwitch-switchBase.Mui-checked.Mui-disabled": { color: `${palette.green} !important`, opacity: 1 }, "& .MuiSwitch-switchBase.Mui-checked.Mui-disabled + .MuiSwitch-track": { backgroundColor: `${palette.green} !important`, opacity: 0.5 } }} />} label={scenario.label} sx={{ bgcolor: primary || active ? "rgba(81,93,97,.22)" : "transparent", borderRadius: 3, display: 'grid', gridTemplateColumns: 'auto minmax(0, 1fr)', justifyContent: "start", m: 0, minHeight: '3rem', minWidth: 0, px: 0.75, "& .MuiFormControlLabel-label": { display: '-webkit-box', fontFamily: 'var(--font-heading)', fontSize: '0.72rem', fontWeight: 400, letterSpacing: '0.04em', lineHeight: 1.15, overflow: 'hidden', textAlign: 'left', textOverflow: 'ellipsis', textTransform: 'uppercase', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2 }, "& .MuiFormControlLabel-label.Mui-disabled": { color: comparisonBase ? palette.base300 : "text.primary", WebkitTextFillColor: 'currentColor' } }} />;
            })}
            </Box>
          </Box>
      </Box>
      <Popover open={Boolean(bandInfoAnchor)} anchorEl={bandInfoAnchor} onClose={() => setBandInfoAnchor(null)} anchorOrigin={{ vertical: "bottom", horizontal: "left" }}>
        <Box sx={{ bgcolor: "background.paper", boxSizing: "border-box", maxWidth: "calc(100vw - 2rem)", p: 2.5, width: "28rem" }}>
          <Typography variant="h3">What does the shaded range show?</Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>The line shows the daily station average. The shaded range shows how station values are distributed around it.</Typography>
          <Typography color="text.secondary" sx={{ mt: 1.5 }}>For each date, stations are ordered from lowest to highest. The selected range includes:</Typography>
          <Typography variant="h5" sx={{ color: "brand.primaryGreen", mt: 2 }}>{coverage.label}</Typography>
          <Box aria-label={`${coverage.label}, shown across stations ordered by value`} sx={{ alignItems: "center", display: "flex", justifyContent: "space-between", mt: 1.5, width: "100%" }}>
            {Array.from({ length: 20 }, (_, index) => {
              const selected = index >= coverage.first && index <= coverage.last;
              return <Box key={index} sx={{ bgcolor: selected ? palette.green : palette.base700, border: `2px solid ${selected ? palette.green : palette.base300}`, borderRadius: "50%", boxSizing: "border-box", height: 12, opacity: selected ? 1 : 0.85, width: 12 }} />;
            })}
          </Box>
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", mt: 0.75, width: "100%" }}><Typography variant="caption" color="text.secondary" sx={{ justifySelf: "start" }}>Lowest</Typography><Typography variant="caption" color="text.secondary" sx={{ justifySelf: "end", textAlign: "right" }}>Highest</Typography></Box>
          <Box sx={{ alignItems: "center", display: "flex", gap: 2.5, mt: 1.5 }}>
            <Box sx={{ alignItems: "center", display: "inline-flex", gap: 0.75 }}><Box sx={{ bgcolor: palette.green, borderRadius: "50%", flex: "0 0 10px", height: 10, width: 10 }} /><Typography variant="caption" sx={{ lineHeight: 1 }}>Included in range</Typography></Box>
            <Box sx={{ alignItems: "center", display: "inline-flex", gap: 0.75 }}><Box sx={{ bgcolor: palette.base700, border: `2px solid ${palette.base300}`, borderRadius: "50%", boxSizing: "border-box", flex: "0 0 10px", height: 10, width: 10 }} /><Typography variant="caption" sx={{ lineHeight: 1 }}>Excluded</Typography></Box>
          </Box>
          <Typography color="text.secondary" sx={{ mt: 2 }}><strong>All stations</strong> spans the lowest to highest station value. <strong>Middle 90%</strong> excludes the lowest and highest 5%. <strong>Middle 50%</strong> excludes the lowest and highest 25%.</Typography>
          <Typography color="text.secondary" sx={{ mt: 1.5 }}>The stations inside the range can change from day to day; this is not a fixed station-ID selection.</Typography>
        </Box>
      </Popover>
      <ChartSvg data={data} region={region} activeKeys={activeKeys} dateIndex={dateIndex} onDateChange={onDateChange} rangeMode={rangeMode} selectedScenarioKey={selectedScenario.key} baseScenarioLabel={baseScenarioLabel} units={units} />
    </Paper>
  );
}
