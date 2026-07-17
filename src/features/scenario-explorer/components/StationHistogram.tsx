import { useCallback, useLayoutEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { Box, Stack, Typography } from "@mui/material";
import { motion } from 'framer-motion';
import { formatDate, formatNumber, valueColor } from '../format';
import { explorerPalette as palette } from '../theme';
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

export default function StationHistogram({ data, region, scenario, dateIndex, onBrushChange, mapExtent, units }: StationHistogramProps) {
  const [brush, setBrush] = useState<HistogramBrush>(null);
  const [dragStart, setDragStart] = useState<number | null>(null);
  const plotRef = useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = useState(310);
  useLayoutEffect(() => {
    const node = plotRef.current;
    if (!node) return undefined;
    const observer = new ResizeObserver(([entry]) => setHeight(Math.max(310, Math.round(entry.contentRect.height))));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
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
  const textStyle = { fill: palette.base300, fontFamily: 'var(--font-body)', fontSize: "clamp(.625rem,.55rem + .18vw,.75rem)" };
  const tickColor = (tick: number) => tick > 0 ? palette.pink : tick < 0 ? palette.teal : palette.white;
  const formatTick = (tick: number) => `${formatNumber(tick)}${units === "%" && Math.round(tick) !== 0 ? "%" : ""}`;
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
  return <Box sx={{ bgcolor: "base.700", border: 1, borderColor: "divider", display: "flex", flexDirection: "column", height: '100%', minHeight: 0, minWidth: 0, px: 1, pt: 1.5 }}>
    <Stack spacing={0.5} sx={{ alignItems: 'center' }}>
      <Typography variant="caption" sx={{ color: "text.secondary" }}>Station distribution</Typography>
      <Typography variant="captionSmall" sx={{ color: "text.primary" }}>{brush ? `${selectedCount} selected` : formatDate(data.dates[dateIndex])}</Typography>
    </Stack>
    <Box ref={plotRef} sx={{ flex: 1, minHeight: { xs: 310, lg: 0 }, overflow: "hidden", position: "relative" }}>
    <Box component="svg" viewBox={`0 0 ${WIDTH} ${height}`} role="img" aria-label={`Distribution of ${values.length} station deltas. Drag vertically to highlight stations on the map.`} sx={{ bottom: 0, cursor: "crosshair", display: "block", height: "100%", left: 0, position: "absolute", right: 0, top: 0, touchAction: "none", userSelect: "none", width: "100%" }}
      onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); const value = valueFromPointer(event); setDragStart(value); setBrush([value, value]); }}
      onPointerMove={(event) => { if (dragStart == null) return; const value = valueFromPointer(event); const next: [number, number] = [Math.min(dragStart, value), Math.max(dragStart, value)]; setBrush(next); publish(next); }}
      onPointerUp={(event) => { event.currentTarget.releasePointerCapture(event.pointerId); const end = valueFromPointer(event); const final: HistogramBrush = dragStart == null ? null : [Math.min(dragStart, end), Math.max(dragStart, end)]; if (!final || Math.abs(final[1] - final[0]) < Math.max(1, (maximum - minimum) * .01)) { setBrush(null); publish(null); } else { setBrush(final); publish(final); } setDragStart(null); }}
      onDoubleClick={() => { setBrush(null); publish(null); }}>
      <line x1={PAD.left} x2={PAD.left} y1={PAD.top} y2={height - PAD.bottom} stroke={palette.base500} />
      {brush && <rect x={PAD.left} y={y(brush[1])} width={WIDTH - PAD.left - PAD.right} height={Math.max(1, y(brush[0]) - y(brush[1]))} fill={palette.green} opacity=".12" stroke={palette.green} strokeWidth="1.5" />}
      {swarm.map((point, index) => <motion.circle key={`${scenario.key}-${dateIndex}-${point.station.station_id}`} cx={point.x} cy={point.y} r="3.5" fill={valueColor(point.value, mapExtent)} opacity={brush && !includes(point.value) ? .22 : .88} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: brush && !includes(point.value) ? .22 : .88, scale: 1 }} transition={{ duration: .35, delay: Math.min(index * .002, .35) }}><title>Station {point.station.station_id} · {point.station.long_name} · {formatNumber(point.value, 1)} {units}</title></motion.circle>)}
      {minimum <= 0 && maximum >= 0 && <><line x1={PAD.left} x2={WIDTH - PAD.right} y1={y(0)} y2={y(0)} stroke={palette.base100} strokeWidth="2" /><text x={WIDTH - PAD.right} y={y(0) - 6} textAnchor="end" style={{ ...textStyle, fill: palette.base100, fontWeight: 700 }}>Baseline</text></>}
      {ticks.map((tick, index) => <text key={index} x={PAD.left - 7} y={y(tick) + 4} textAnchor="end" style={{ ...textStyle, fill: tickColor(tick), fontWeight: 700 }}>{formatTick(tick)}</text>)}
      <text transform={`translate(13 ${height / 2}) rotate(-90)`} textAnchor="middle" style={{ ...textStyle, fontSize: ".75rem" }}>{units === "%" ? "Change from base (%)" : "Δ EC-AVG-AVG (µS/cm)"}</text>
    </Box>
    </Box>
  </Box>;
}
