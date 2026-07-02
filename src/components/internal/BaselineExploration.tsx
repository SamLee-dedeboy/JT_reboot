import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import Navbar from '../common/Navbar';
import { assetUrl } from '../../utils/baseUrl';

const DATA_URL = assetUrl('/data/baseline-exploration/region_ec_avg_avg_timeseries.json');
const SALINITY_COLORS = ['#7ed2e1', '#70c1d5', '#5eaac5', '#4991b1', '#32759a', '#235c86', '#174670'];

type ScaleMode = 'log' | 'linear';

interface RegionTimeseries {
  name: string;
  stationCount: number;
  stations: string[];
  values: Array<number | null>;
  mean: number | null;
  min: number | null;
  max: number | null;
}

interface RegionTimeseriesPayload {
  generatedAt: string;
  source: string;
  units: string;
  dates: string[];
  min: number;
  max: number;
  regions: RegionTimeseries[];
  stationCount: number;
  unmatchedStations: string[];
}

function formatNumber(value: number | null | undefined, digits = 0) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return 'n/a';
  }

  return Number(value).toLocaleString(undefined, { maximumFractionDigits: digits });
}

function formatDate(value: string | undefined) {
  if (!value) {
    return 'n/a';
  }

  return new Date(`${value}T00:00:00`).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function midpoint(min: number, max: number, scaleMode: ScaleMode) {
  if (scaleMode === 'log') {
    return Math.sqrt(Math.max(min, 1) * Math.max(max, 1));
  }

  return (min + max) / 2;
}

function colorForValue(value: number | null, min: number, max: number, scaleMode: ScaleMode) {
  if (value === null || value === undefined) {
    return 'rgba(16, 22, 24, 0.82)';
  }

  let t: number;

  if (scaleMode === 'log') {
    const logMin = Math.log10(Math.max(min, 1));
    const logMax = Math.log10(Math.max(max, min + 1));
    t = (Math.log10(Math.max(value, 1)) - logMin) / (logMax - logMin || 1);
  } else {
    t = (value - min) / (max - min || 1);
  }

  t = Math.min(1, Math.max(0, t));
  const scaled = t * (SALINITY_COLORS.length - 1);
  const index = Math.min(SALINITY_COLORS.length - 1, Math.max(0, Math.round(scaled)));

  return SALINITY_COLORS[index];
}

function HighlightMark({ children }: { children: ReactNode }) {
  return (
    <Box
      component="mark"
      sx={{
        bgcolor: 'translucent.primaryGreen',
        borderRadius: '4px',
        color: 'common.white',
        px: '0.22em',
      }}
    >
      {children}
    </Box>
  );
}

function ScaleButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <Button
      aria-pressed={active}
      onClick={onClick}
      sx={{
        minWidth: 0,
        border: '1px solid',
        borderColor: active ? 'primary.main' : 'base.300',
        borderRadius: 999,
        bgcolor: active ? 'translucent.primaryGreen' : 'surface',
        color: active ? 'common.white' : 'base.100',
        typography: 'button',
        lineHeight: 1.1,
        px: 1.25,
        py: 0.72,
        '&:hover': {
          bgcolor: 'translucent.primaryGreen',
          borderColor: 'primary.main',
        },
      }}
    >
      {children}
    </Button>
  );
}

function RegionRow({
  region,
  dateCount,
  min,
  max,
  activeIndex,
  onHover,
  scaleMode,
  units,
}: {
  region: RegionTimeseries;
  dateCount: number;
  min: number;
  max: number;
  activeIndex: number;
  onHover: (index: number | null) => void;
  scaleMode: ScaleMode;
  units: string;
}) {
  const activeValue = region.values[activeIndex];

  return (
    <Box
      component="article"
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: 'var(--label-width) minmax(720px, 1fr)',
          md: 'var(--label-width) minmax(0, 1fr)',
        },
        minHeight: 'var(--row-height)',
        '& + &': {
          borderTop: '5px solid',
          borderColor: 'base.900',
        },
      }}
    >
      <Box
        sx={{
          display: 'grid',
          alignItems: 'center',
          alignContent: 'center',
          gap: 1,
          gridTemplateColumns: 'minmax(0, 1fr)',
          py: 1.5,
          pr: 1.5,
          pl: { xs: '20px', md: '54px' },
          bgcolor: 'base.900',
        }}
      >
        <Box>
          <Typography
            variant="h5"
            component="h2"
            sx={{
              color: 'common.white',
              m: 0,
              mb: 0.5,
              textTransform: 'uppercase',
            }}
          >
            {region.name}
          </Typography>
          <Typography
            variant="captionSmall"
            component="p"
            sx={{
              color: 'base.300',
              m: 0,
              textTransform: 'uppercase',
            }}
          >
            {region.stationCount} stations
          </Typography>
        </Box>
        <Typography
          variant="captionSmall"
          component="strong"
          sx={{
            color: 'base.100',
            fontWeight: 800,
            lineHeight: 1.2,
          }}
        >
          {formatNumber(activeValue)} {units}
        </Typography>
      </Box>

      <Box
        sx={{
          cursor: 'crosshair',
          display: 'grid',
          gridTemplateColumns: `repeat(${dateCount}, minmax(1px, 1fr))`,
          minHeight: 'var(--row-height)',
          overflow: 'hidden',
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, color-mix(in srgb, var(--mui-palette-base-900) 24%, transparent), transparent 14%, transparent 90%, color-mix(in srgb, var(--mui-palette-base-900) 10%, transparent))',
            pointerEvents: 'none',
          },
        }}
        onMouseLeave={() => onHover(null)}
        onMouseMove={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          const x = Math.min(rect.width, Math.max(0, event.clientX - rect.left));
          onHover(Math.min(dateCount - 1, Math.floor((x / rect.width) * dateCount)));
        }}
      >
        {region.values.map((value, valueIndex) => (
          <Box
            component="span"
            key={`${region.name}-${valueIndex}`}
            title={`${region.name} - ${formatNumber(value)} ${units}`}
            sx={{
              minWidth: 1,
              filter: valueIndex === activeIndex ? 'brightness(1.45) saturate(1.2)' : 'none',
              bgcolor: colorForValue(value, min, max, scaleMode),
            }}
          />
        ))}
      </Box>
    </Box>
  );
}

export default function BaselineExploration() {
  const [data, setData] = useState<RegionTimeseriesPayload | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [scaleMode, setScaleMode] = useState<ScaleMode>('log');

  useEffect(() => {
    let isMounted = true;

    fetch(DATA_URL)
      .then((response) => response.json() as Promise<RegionTimeseriesPayload>)
      .then((payload) => {
        if (isMounted) {
          setData(payload);
        }
      })
      .catch(() => {
        if (isMounted) {
          setData(null);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const activeIndex = hoverIndex ?? Math.max(0, (data?.dates.length ?? 1) - 1);
  const rankedRegions = useMemo(
    () => (data ? [...data.regions].sort((a, b) => (a.mean ?? 0) - (b.mean ?? 0)) : []),
    [data],
  );
  const activeDate = data?.dates[activeIndex];
  const activeValues = data
    ? data.regions
        .map((region) => region.values[activeIndex])
        .filter((value): value is number => value !== null && value !== undefined)
    : [];
  const activeAverage = activeValues.length ? activeValues.reduce((sum, value) => sum + value, 0) / activeValues.length : null;

  if (!data) {
    return (
      <Box
        component="main"
        sx={{
          display: 'grid',
          minHeight: '100vh',
          placeItems: 'center',
          bgcolor: 'base.900',
          color: 'base.100',
          typography: 'eyebrow',
          textTransform: 'uppercase',
        }}
      >
        Loading Delta region time lapse...
      </Box>
    );
  }

  return (
    <>
      <Navbar />
      <Box
        component="main"
        sx={{
        '--label-width': '220px',
        '--frame-right-pad': '42px',
        '--row-height': 'calc((100vh - 342px) / 8)',
        '@media (max-width: 980px)': {
          '--label-width': '190px',
          '--frame-right-pad': '20px',
          '--row-height': '74px',
        },
        minHeight: { xs: 'calc(100vh - 72px)', md: 'calc(100vh - 76px)' },
        overflow: 'hidden',
        position: 'relative',
        color: 'common.white',
        bgcolor: 'base.800',
      }}
    >
      <Box
        component="section"
        sx={{
          position: 'relative',
          zIndex: 2,
          display: 'grid',
          gap: { xs: 2, lg: 2.5 },
          gridTemplateColumns: {
            xs: '1fr',
            lg: 'minmax(280px, 0.78fr) minmax(520px, 1.7fr) minmax(360px, 0.9fr)',
          },
          alignItems: 'center',
          px: { xs: '20px', md: '54px' },
          py: { xs: '22px', md: '28px' },
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              lineHeight: 1,
              m: 0,
              mb: 2,
              textTransform: 'uppercase',
            }}
          >
            <Box component="span" sx={{ color: 'primary.main' }}>
              Baseline
            </Box>{' '}
            EC-Avg Time Lapse
          </Typography>
          <Typography
            variant="eyebrow"
            component="span"
            sx={{
              display: 'block',
              color: 'base.100',
            }}
          >
            {formatDate(activeDate)}
          </Typography>
          <Typography
            variant="h4"
            component="strong"
            sx={{
              display: 'block',
              fontWeight: 400,
              mt: 0.75,
            }}
          >
            {formatNumber(activeAverage)} {data.units}
          </Typography>
        </Box>

        <Box
          sx={{
            alignSelf: 'center',
            bgcolor: 'surface',
            border: '1px solid',
            borderColor: 'translucent.primaryGreen',
            borderLeft: 4,
            borderLeftColor: 'primary.main',
            borderRadius: 1,
            minWidth: 0,
            px: (theme) => theme.jtSpacing.component.md,
            py: (theme) => theme.jtSpacing.component.sm,
          }}
        >
          <Typography
            variant="eyebrow"
            component="p"
            sx={{
              mb: 1,
            }}
          >
            Regional Aggregation
          </Typography>
          <Typography
            variant="body2"
            component="p"
            sx={{
              color: 'base.100',
              m: 0,
            }}
          >
            Daily means from <HighlightMark>{data.stationCount} unique baseline stations</HighlightMark> in all teams
            across <HighlightMark>{data.dates.length} days</HighlightMark>, grouped by the finalized workbook region.
            Toggle the color scale to compare broad bay-to-Delta gradients or local interior variation.
          </Typography>
        </Box>

        <Box sx={{ minWidth: 0 }}>
          <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end', mb: '10px' }}>
            <ScaleButton active={scaleMode === 'log'} onClick={() => setScaleMode('log')}>
              Log
            </ScaleButton>
            <ScaleButton active={scaleMode === 'linear'} onClick={() => setScaleMode('linear')}>
              Linear
            </ScaleButton>
          </Stack>
          <Stack direction="row" sx={{ justifyContent: 'space-between', mb: '7px' }}>
            <Typography variant="captionSmall" component="span" sx={legendEndpointSx}>
              Fresher
            </Typography>
            <Typography variant="captionSmall" component="span" sx={legendEndpointSx}>
              Saltier
            </Typography>
          </Stack>
          <Box
            sx={{
              height: 11,
              borderRadius: 999,
            background: `linear-gradient(90deg, ${SALINITY_COLORS.join(', ')})`,
            boxShadow: '0 0 28px rgba(121,225,228,0.34), 0 0 10px rgba(126,217,87,0.12)',
            }}
          />
          <Stack direction="row" sx={{ justifyContent: 'space-between', mt: '8px', pb: '2px' }}>
            <Typography variant="captionSmall" component="span" sx={legendLabelSx}>
              {formatNumber(data.min)}
            </Typography>
            <Typography variant="captionSmall" component="span" sx={legendLabelSx}>
              {formatNumber(midpoint(data.min, data.max, scaleMode))}
            </Typography>
            <Typography variant="captionSmall" component="span" sx={legendLabelSx}>
              {formatNumber(data.max)}
            </Typography>
          </Stack>
        </Box>
      </Box>

      <Box
        component="section"
        sx={{
          position: 'relative',
          zIndex: 2,
          minHeight: 48,
          borderTop: '1px solid',
          borderColor: 'base.700',
          boxShadow: 'inset 0 30px 80px rgba(0,0,0,0.22)',
          mt: 0,
          pr: 'var(--frame-right-pad)',
          overflowX: { xs: 'auto', md: 'hidden' },
        }}
      >
        {rankedRegions.map((region) => (
          <RegionRow
            key={region.name}
            region={region}
            dateCount={data.dates.length}
            min={data.min}
            max={data.max}
            activeIndex={activeIndex}
            onHover={setHoverIndex}
            scaleMode={scaleMode}
            units={data.units}
          />
        ))}
      </Box>
    </Box>
    </>
  );
}

const legendLabelSx = {
  color: 'base.300',
  fontWeight: 800,
  textTransform: 'uppercase',
} as const;

const legendEndpointSx = {
  color: 'common.white',
  fontWeight: 800,
  textTransform: 'uppercase',
} as const;
