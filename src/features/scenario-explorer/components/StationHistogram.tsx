import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { Box, Stack, Typography, useTheme } from "@mui/material";
import { motion } from 'framer-motion';
import { formatDate, formatNumber, valueColor } from '../format';
import type { HistogramBrush, Scenario, ScenarioDataset, Station } from '../types';

const WIDTH = 190;
const PAD = { left: 52, right: 18, top: 18, bottom: 34 };

interface StationHistogramProps {
  data: ScenarioDataset;
  region: string;
  scenario: Scenario;
  dateIndex: number;
  onBrushChange: (brush: HistogramBrush) => void;
  mapExtent: number;
  units: string;
}

interface SwarmPoint { station: Station; value: number; x: number; y: number }
interface StationEntry { station: Station; value: number }

function StationHistogram({ data, region, scenario, dateIndex, onBrushChange, mapExtent, units }: StationHistogramProps) {
  const theme = useTheme();
  const [brush, setBrush] = useState<HistogramBrush>(null);
  const [dragStart, setDragStart] = useState<number | null>(null);
  const plotRef = useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = useState(310);
  const [isMeasured, setIsMeasured] = useState(false);
  useLayoutEffect(() => {
    const node = plotRef.current;
    if (!node) return undefined;
    const observer = new ResizeObserver(([entry]) => {
      setHeight(Math.max(310, Math.round(entry.contentRect.height)));
      setIsMeasured(true);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    setBrush(null);
    setDragStart(null);
  }, [scenario.key, region, dateIndex]);
  const entries = useMemo<StationEntry[]>(() => data.stations
    .map((station, index) => ({ station, value: scenario.stationValues[index][dateIndex] }))
    .filter((entry): entry is StationEntry => (region === "All regions" || entry.station.region === region) && entry.value != null && Number.isFinite(entry.value)),
  [data.stations, scenario, dateIndex, region]);
  const values = useMemo(() => entries.map(({ value }) => value), [entries]);
  const minimum = values.length ? Math.min(...values, 0) : -1;
  const maximum = values.length ? Math.max(...values, 0) : 1;
  const y = useCallback((value: number) => height - PAD.bottom - (value - minimum) / Math.max(1, maximum - minimum) * (height - PAD.top - PAD.bottom), [height, maximum, minimum]);
  const swarm = useMemo(() => {
    const radius = 3.5;
    const center = PAD.left + (WIDTH - PAD.left - PAD.right) / 2;
    const placed: SwarmPoint[] = [];
    [...entries].sort((a, b) => a.value - b.value).forEach((entry) => {
      const py = y(entry.value);
      const candidates = [0];
      for (let offset = radius * 2; offset < (WIDTH - PAD.left - PAD.right) / 2; offset += radius * 1.65) candidates.push(-offset, offset);
      const offset = candidates.find((candidate) => placed.every((point) => {
        const dx = center + candidate - point.x;
        const dy = py - point.y;
        return dx * dx + dy * dy >= (radius * 2.15) ** 2;
      })) ?? 0;
      placed.push({ ...entry, x: center + offset, y: py });
    });
    return placed;
  }, [entries, y]);
  const ticks = [minimum, minimum + (maximum - minimum) / 2, maximum];
  const textStyle = { fill: theme.palette.base[300], fontFamily: theme.typography.captionSmall.fontFamily, fontSize: theme.typography.captionSmall.fontSize };
  const tickColor = (tick: number) => tick > 0 ? theme.palette.salinity.pink : tick < 0 ? theme.palette.salinity.teal : theme.palette.common.white;
  const formatTick = (tick: number) => `${formatNumber(tick)}${units === "%" && tick !== 0 ? "%" : ""}`;
  const epsilon = Math.max(0.000001, (maximum - minimum) * 0.000001);
  const includes = (value: number) => Boolean(brush && value >= brush[0] - epsilon && value <= brush[1] + epsilon);
  const publish = (range: HistogramBrush) => onBrushChange(range ? [range[0] - epsilon, range[1] + epsilon] : null);
  const selectedCount = brush ? values.filter(includes).length : 0;
  const valueFromPointer = (event: ReactPointerEvent<SVGSVGElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const pointerY = (event.clientY - bounds.top) / bounds.height * height;
    const fraction = Math.max(0, Math.min(1, (height - PAD.bottom - pointerY) / (height - PAD.top - PAD.bottom)));
    return minimum + fraction * (maximum - minimum);
  };
  return <Box data-tour="beeswarm" sx={(theme) => ({ bgcolor: "base.700", border: 1, borderColor: "divider", borderRadius: 1, display: "flex", flexDirection: "column", height: '100%', minHeight: 0, minWidth: 0, overflow: 'hidden', px: theme.jtSpacing.component.xs, pt: theme.jtSpacing.component.sm })}>
    <Stack sx={(theme) => ({ alignItems: 'center', gap: theme.jtSpacing.gap.xs, [theme.breakpoints.between('lg', 'xl')]: { gap: 0 } })}>
      <Typography variant="caption" sx={(theme) => ({ color: "text.secondary", [theme.breakpoints.between('lg', 'xl')]: { ...theme.typography.captionSmall } })}>Station distribution</Typography>
      <Typography variant="h5" sx={(theme) => ({ '&&': { color: 'brand.primaryBlue' }, textTransform: 'uppercase', [theme.breakpoints.between('lg', 'xl')]: { ...theme.typography.button } })}>{brush ? `${selectedCount} selected` : formatDate(data.dates[dateIndex])}</Typography>
    </Stack>
    <Typography variant="captionSmall" color="text.secondary" noWrap sx={(theme) => ({ mt: theme.jtSpacing.component.xs, [theme.breakpoints.between('lg', 'xl')]: { mt: 0 } })}>{units === "%" ? "Change from base (%)" : "Δ EC-AVG-AVG (µS/cm)"}</Typography>
    <Box ref={plotRef} sx={{ flex: 1, minHeight: { xs: 310, lg: 0 }, overflow: "hidden", position: "relative" }}>
    <Box component="svg" viewBox={`0 0 ${WIDTH} ${height}`} role="img" aria-label={`Distribution of ${values.length} station deltas. Drag vertically to highlight stations on the map.`} sx={{ bottom: 0, cursor: "crosshair", display: "block", height: "100%", left: 0, pointerEvents: isMeasured ? 'auto' : 'none', position: "absolute", right: 0, top: 0, touchAction: "none", userSelect: "none", visibility: isMeasured ? 'visible' : 'hidden', width: "100%" }}
      onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); const value = valueFromPointer(event); setDragStart(value); setBrush([value, value]); }}
      onPointerMove={(event) => { if (dragStart == null) return; const value = valueFromPointer(event); const next: [number, number] = [Math.min(dragStart, value), Math.max(dragStart, value)]; setBrush(next); publish(next); }}
      onPointerUp={(event) => { event.currentTarget.releasePointerCapture(event.pointerId); const end = valueFromPointer(event); const final: HistogramBrush = dragStart == null ? null : [Math.min(dragStart, end), Math.max(dragStart, end)]; if (!final || Math.abs(final[1] - final[0]) < Math.max(1, (maximum - minimum) * .01)) { setBrush(null); publish(null); } else { setBrush(final); publish(final); } setDragStart(null); }}
      onDoubleClick={() => { setBrush(null); publish(null); }}>
      <line x1={PAD.left} x2={PAD.left} y1={PAD.top} y2={height - PAD.bottom} stroke={theme.palette.base[500]} />
      {brush && <rect x={PAD.left} y={y(brush[1])} width={WIDTH - PAD.left - PAD.right} height={Math.max(1, y(brush[0]) - y(brush[1]))} fill={theme.palette.brand.primaryGreen} opacity=".12" stroke={theme.palette.brand.primaryGreen} strokeWidth="1.5" />}
      {swarm.map((point, index) => <motion.circle key={`${scenario.key}-${dateIndex}-${point.station.station_id}`} cx={point.x} cy={point.y} r="3.5" fill={valueColor(point.value, mapExtent)} opacity={brush && !includes(point.value) ? .22 : .88} initial={{ cx: point.x, cy: point.y, opacity: 0, r: 3.5, scale: 0 }} animate={{ cx: point.x, cy: point.y, opacity: brush && !includes(point.value) ? .22 : .88, r: 3.5, scale: 1 }} transition={{ duration: .35, delay: Math.min(index * .002, .35) }}><title>Station {point.station.station_id} · {point.station.long_name} · {formatNumber(point.value)} {units}</title></motion.circle>)}
      {minimum <= 0 && maximum >= 0 && <><line x1={PAD.left} x2={WIDTH - PAD.right} y1={y(0)} y2={y(0)} stroke={theme.palette.base[100]} strokeWidth="2" /><text x={WIDTH - PAD.right} y={y(0) - 6} textAnchor="end" style={{ ...textStyle, fill: theme.palette.base[100], fontWeight: 700 }}>Business as Usual</text></>}
      {ticks.map((tick, index) => <text key={index} x={PAD.left - 7} y={y(tick) + 4} textAnchor="end" style={{ ...textStyle, fill: tickColor(tick), fontWeight: 700 }}>{formatTick(tick)}</text>)}
    </Box>
    </Box>
  </Box>;
}

export default memo(StationHistogram);
