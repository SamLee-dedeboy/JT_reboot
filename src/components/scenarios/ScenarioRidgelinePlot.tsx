import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Box, Button, CircularProgress, Stack, Typography, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { ScenarioDataset } from '../../features/scenario-explorer/types';
import { assetUrl } from '../../utils/baseUrl';

interface ScenarioRidgelinePlotProps {
  selectedIndex: number | null;
  onSelect: (index: number | null) => void;
  active: boolean;
  seaLevelRise: boolean;
}

const scenarioKeys = ['ecomachine', 'newgreen', 'reserve', 'bolster', 'tunnel'] as const;
const scenarioLabels = ['Eco Machine', 'New Green Watershed', 'Calling on Reserves', 'Bolster and Fortify', 'A Tunnel'];
const samples = 260;
const plotWidth = 1000;
const plotHeight = 500;

function sampleSeries(values: number[]) {
  if (!values.length) return Array.from({ length: samples }, () => 0);
  return Array.from({ length: samples }, (_, index) => {
    const start = Math.floor(index / samples * values.length);
    const end = Math.max(start + 1, Math.floor((index + 1) / samples * values.length));
    const bucket = values.slice(start, end).filter(Number.isFinite);
    return bucket.length ? bucket.reduce((sum, value) => sum + value, 0) / bucket.length : 0;
  });
}

export default function ScenarioRidgelinePlot({ selectedIndex, onSelect, active, seaLevelRise }: ScenarioRidgelinePlotProps) {
  const theme = useTheme();
  const [data, setData] = useState<ScenarioDataset | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    fetch(assetUrl('/data/scenario-explorer/salinity_dashboard.json'))
      .then((response) => {
        if (!response.ok) throw new Error(`Unable to load scenario data (${response.status})`);
        return response.json() as Promise<ScenarioDataset>;
      })
      .then((dataset) => { if (active) setData(dataset); })
      .catch(() => { if (active) setFailed(true); });
    return () => { active = false; };
  }, []);

  const plot = useMemo(() => {
    if (!data) return null;
    const byKey = new Map(data.scenarios.map((scenario) => [scenario.key, scenario]));
    const lines = scenarioKeys.map((key) => {
      const scenario = byKey.get(key);
      if (!scenario) return Array.from({ length: samples }, () => 0);
      const values = data.dates.map((_, dateIndex) => {
        const stationValues = scenario.stationValues
          .map((stationSeries) => stationSeries[dateIndex])
          .filter((value): value is number => value != null && Number.isFinite(value));
        return stationValues.length
          ? stationValues.reduce((sum, value) => sum + value, 0) / stationValues.length
          : 0;
      });
      return sampleSeries(values);
    });
    const magnitudes = lines.flatMap((line) => line.map(Math.abs)).sort((a, b) => a - b);
    const extent = Math.max(1, magnitudes[Math.floor(magnitudes.length * 0.985)] ?? 1);
    const yearTicks = [2018, 2019, 2020].map((year) => {
      const target = `${year}-01-01`;
      const index = year === 2018 ? 0 : Math.max(0, data.dates.findIndex((date) => date >= target));
      return { year, progress: index / Math.max(1, data.dates.length - 1) };
    });
    return { lines, extent, yearTicks };
  }, [data]);

  return (
    <Box
      component="section"
      aria-labelledby="ridgeline-title"
      sx={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', bgcolor: seaLevelRise ? 'base.900' : 'base.500', transition: theme.transitions.create('background-color', { duration: theme.transitions.duration.complex }), display: 'grid', gridTemplateColumns: { xs: '1fr', md: '20dvw minmax(0, 1fr)' }, gridTemplateRows: { xs: 'auto minmax(0, 1fr) 5dvh', md: '15dvh minmax(0, 1fr) 5dvh' } }}
    >
      <Box sx={{ gridColumn: '1 / -1', gridRow: 1, position: 'relative', zIndex: 2, minWidth: 0, borderBottom: 1, borderColor: 'translucent.primaryGreen' }}>
        <Stack spacing={theme.jtSpacing.component.xs} sx={{ p: theme.jtSpacing.scenario.comparisonHeader, maxWidth: { md: theme.jtSpacing.paragraphMaxWidth.default } }}>
          <Typography variant="eyebrow">Scenario comparison</Typography>
          <Typography id="ridgeline-title" variant="h3">
            Five paths through time
            <Box component={motion.span} initial={false} animate={{ opacity: seaLevelRise ? 1 : 0, marginLeft: seaLevelRise ? '0.35em' : '0em' }} transition={{ duration: 0.45 }} sx={{ display: 'inline-block', color: 'primary.main' }}>
              {seaLevelRise ? 'with sea level rise' : ''}
            </Box>
          </Typography>
          <Typography variant="body2" sx={{ color: 'base.200' }}>
            Daily average across all stations relative to <Box component="span" sx={{ color: 'brand.primaryBlue' }}>Business as Usual</Box>. Above the blue line is saltier; below the blue line is fresher.
          </Typography>
        </Stack>
      </Box>

      <Box sx={{ gridColumn: { md: 1 }, gridRow: 2, minWidth: 0, display: 'grid', gridTemplateRows: 'repeat(5, 1fr)', alignItems: 'stretch', borderRight: { md: 1 }, borderColor: 'base.200' }}>
        {scenarioLabels.map((label, index) => {
          const panelIndex = index + 1;
          const selected = selectedIndex === panelIndex;
          return (
            <Box
              key={label}
              onMouseEnter={() => onSelect(panelIndex)}
              onMouseLeave={() => onSelect(null)}
              onFocus={() => onSelect(panelIndex)}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node | null)) onSelect(null);
              }}
              sx={{ borderLeft: 3, borderColor: selected ? 'primary.main' : 'transparent', bgcolor: selected ? 'translucent.primaryGreen' : 'transparent', display: 'flex', alignItems: 'center', gap: theme.jtSpacing.gap.xs, minWidth: 0, px: theme.jtSpacing.scenario.comparisonRowInline, transition: theme.transitions.create(['background-color', 'border-color'], { duration: theme.transitions.duration.short }) }}
            >
              <Box
                component="button"
                type="button"
                aria-pressed={selected}
                sx={{ appearance: 'none', border: 0, bgcolor: 'transparent', color: selected ? 'primary.main' : 'base.100', cursor: 'pointer', flex: 1, minWidth: 0, p: 0, textAlign: 'left', '&:hover, &:focus-visible': { color: 'primary.main', outline: 'none' } }}
              >
                <Typography variant="button" component="span">{label}</Typography>
              </Box>
              <Button
                component={Link}
                to={`/pages/scenario-explorer/internal?scenario=${scenarioKeys[index]}${seaLevelRise ? '&seaLevelRise=true' : ''}`}
                variant={seaLevelRise ? 'contained' : 'outlined'}
                color="primary"
                size="small"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  flex: '0 0 auto',
                  minWidth: 0,
                  borderColor: 'primary.main',
                  color: seaLevelRise ? 'base.900' : 'primary.main',
                  bgcolor: seaLevelRise ? 'primary.main' : 'transparent',
                  '& .MuiButton-endIcon': {
                    ml: theme.jtSpacing.gap.xs,
                    mr: 0,
                  },
                  '& .MuiButton-endIcon svg': {
                    fontSize: '1em',
                  },
                  '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: seaLevelRise ? 'primary.light' : 'translucent.primaryGreen',
                  },
                }}
              >
                Explore
              </Button>
            </Box>
          );
        })}
      </Box>

      {!plot && !failed && (
        <CircularProgress size={28} sx={{ position: 'absolute', top: '52%', left: '50%', color: 'primary.main' }} />
      )}
      {failed && (
        <Typography sx={{ position: 'absolute', top: '52%', width: '100%', textAlign: 'center', color: 'base.200' }}>
          Scenario data could not be loaded.
        </Typography>
      )}

      {plot && (
        <Box
          sx={{ gridColumn: { md: 2 }, gridRow: 2, position: 'relative', width: '100%', height: '100%', minWidth: 0, overflow: 'hidden' }}
        >
          <Box
            component="svg"
            viewBox={`0 0 ${plotWidth} ${plotHeight}`}
            role="img"
            aria-label="Five salinity-deviation ridgelines with Business as Usual zero references"
            preserveAspectRatio="none"
            sx={{ position: 'absolute', inset: 0, display: 'block', width: '100%', height: '100%', maxWidth: 'none' }}
          >
          <defs>
            <filter id="ridge-glow" x="-20%" y="-100%" width="140%" height="300%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          {plot.yearTicks.map(({ year, progress }) => {
            const x = progress * plotWidth;
            return (
              <g key={year} aria-hidden="true">
                <line x1={x} x2={x} y1="0" y2={plotHeight} stroke={theme.palette.base[300]} strokeWidth="1" strokeDasharray="4 8" opacity="0.24" vectorEffect="non-scaling-stroke" />
              </g>
            );
          })}
          {plot.lines.map((values, index) => {
            const panelIndex = index + 1;
            const selected = selectedIndex === panelIndex;
            const hasHighlightedScenario = selectedIndex != null && selectedIndex > 0;
            const muted = hasHighlightedScenario && !selected;
            const rowGap = plotHeight / 5;
            const baseline = (index + 0.5) * rowGap;
            const amplitudeScale = Math.min(64, rowGap * 0.4);
            const point = (value: number, pointIndex: number) => {
              const progress = pointIndex / (values.length - 1);
              const x = progress * plotWidth;
              const amplitude = Math.max(-1.2, Math.min(1.2, value / plot.extent)) * amplitudeScale;
              return { x, y: baseline - amplitude };
            };
            const displayValues = values.map((value, pointIndex) => {
              if (!seaLevelRise) return value;
              const progress = pointIndex / Math.max(1, values.length - 1);
              const acceleratingRise = plot.extent * (0.28 + index * 0.07) * Math.pow(progress, 1.35);
              const surge = plot.extent * (0.08 + index * 0.012) * Math.sin(progress * Math.PI * (4 + index) + index * 0.8);
              const lateCenturyPulse = plot.extent * (0.12 + index * 0.02) * Math.exp(-Math.pow((progress - (0.72 + index * 0.025)) / 0.1, 2));
              return value + acceleratingRise + surge + lateCenturyPulse;
            });
            const points = displayValues.map((value, pointIndex) => {
              const position = point(value, pointIndex);
              return `${position.x.toFixed(1)},${position.y.toFixed(1)}`;
            }).join(' ');
            return (
              <g
                key={scenarioKeys[index]}
                tabIndex={0}
                aria-label={`${scenarioLabels[index]} salinity deviation`}
                onMouseEnter={() => onSelect(panelIndex)}
                onMouseLeave={() => onSelect(null)}
                onFocus={() => onSelect(panelIndex)}
                onBlur={() => onSelect(null)}
                style={{ cursor: 'pointer', outline: 'none' }}
              >
                <defs>
                  <clipPath id={`baseline-reveal-${scenarioKeys[index]}`}>
                    <motion.rect
                      x="0"
                      width="0"
                      y={baseline - rowGap / 2}
                      height={rowGap}
                      initial={false}
                      animate={{ width: active ? plotWidth : 0 }}
                      transition={{ duration: 0.85, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </clipPath>
                  <clipPath id={`deviation-reveal-${scenarioKeys[index]}`}>
                    <motion.rect
                      x="0"
                      width="0"
                      y={baseline - rowGap / 2}
                      height={rowGap}
                      initial={false}
                      animate={{ width: active ? plotWidth : 0 }}
                      transition={{ duration: 1.05, delay: 1.35 + index * 0.07, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </clipPath>
                </defs>
                <motion.path
                  d={`M 0 ${baseline} L ${plotWidth} ${baseline}`}
                  fill="none"
                  stroke={theme.palette.brand.primaryBlue}
                  strokeWidth="1.5"
                  vectorEffect="non-scaling-stroke"
                  clipPath={`url(#baseline-reveal-${scenarioKeys[index]})`}
                  initial={false}
                  animate={{ opacity: active ? 0.58 : 0 }}
                  transition={{ duration: 0.2 }}
                />
                <polyline points={points} fill="none" stroke="transparent" strokeWidth="24" />
                <motion.polyline
                  fill="none"
                  stroke={selected ? theme.palette.primary.main : theme.palette.base[50]}
                  strokeWidth={selected ? 4 : 2}
                  vectorEffect="non-scaling-stroke"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  filter={selected ? 'url(#ridge-glow)' : undefined}
                  clipPath={`url(#deviation-reveal-${scenarioKeys[index]})`}
                  initial={false}
                  animate={{ points, opacity: active ? (muted ? 0.18 : selected ? 1 : 0.78) : 0 }}
                  transition={{ points: { duration: 1.35, ease: [0.22, 1, 0.36, 1] }, opacity: { duration: 0.25 } }}
                />
              </g>
            );
          })}
          </Box>
          <motion.div
            aria-hidden="true"
            style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
            initial={false}
            animate={{ opacity: active ? [0, 1, 1, 0] : 0 }}
            transition={{ duration: 1.35, times: [0, 0.16, 0.68, 1] }}
          >
            <Box sx={{ width: '100%', height: '100%', display: 'grid', gridTemplateRows: 'repeat(5, 1fr)' }}>
              {scenarioLabels.map((label) => (
                <Typography key={label} variant="captionSmall" sx={{ alignSelf: 'center', color: 'brand.primaryBlue', px: theme.jtSpacing.component.sm, transform: `translateY(-${theme.spacing(2)})` }}>
                  Business as usual
                </Typography>
              ))}
            </Box>
          </motion.div>
        </Box>
      )}
      {plot && (
        <Box sx={{ gridColumn: '1 / -1', gridRow: 3, display: 'grid', gridTemplateColumns: { xs: '1fr', md: '20dvw minmax(0, 1fr)' }, borderTop: 1, borderColor: 'translucent.primaryGreen' }}>
          <Box aria-hidden="true" sx={{ display: { xs: 'none', md: 'block' } }} />
          <Box aria-label="Timeline years" sx={{ position: 'relative', minWidth: 0 }}>
            {plot.yearTicks.map(({ year, progress }) => (
              <Typography
                key={year}
                component="span"
                variant="captionSmall"
                sx={{ position: 'absolute', top: '50%', left: `${progress * 100}%`, color: 'base.300', transform: year === 2018 ? 'translateY(-50%)' : 'translate(-50%, -50%)' }}
              >
                {year}
              </Typography>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}
