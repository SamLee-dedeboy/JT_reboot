// Interactive map container for the playground, including hover/date badges,
// layer toggles, and station highlighting coordination.
import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import Map from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapLayerOrchestrator from './MapLayerOrchestrator';
import { DELTA_STATION_POINTS_LAYER_ID } from './layers/deltaStationConstants';

const mapStyle = { width: '100%', height: '100%' } as const;
const mapContainerSx: SxProps<Theme> = {
  position: 'relative',
  width: '100%',
  height: '100%',
};

function getTooltipSx(tooltip: TooltipState): SxProps<Theme> {
  return (theme) => ({
  position: 'absolute',
  left: `calc(${tooltip.x}px + ${theme.spacing(theme.jtSpacing.component.sm)})`,
  top: `calc(${tooltip.y}px + ${theme.spacing(theme.jtSpacing.component.sm)})`,
  bgcolor: 'rgba(37,52,57,0.94)',
  color: 'common.white',
  border: '1px solid',
  borderColor: 'rgba(242,200,32,0.65)',
  borderRadius: 1,
  px: theme.jtSpacing.component.xs,
  py: theme.jtSpacing.component.xs / 2,
  typography: 'body2',
  lineHeight: 1.4,
  pointerEvents: 'none',
  zIndex: 20,
  maxWidth: 220,
  });
}

const dateBadgeSx: SxProps<Theme> = (theme) => ({
  position: 'absolute',
  top: theme.jtSpacing.component.xs,
  left: theme.jtSpacing.component.xs,
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.jtSpacing.component.xs,
  bgcolor: 'rgba(37,52,57,0.82)',
  color: 'common.white',
  border: '1px solid',
  borderColor: 'rgba(155,162,164,0.28)',
  borderRadius: 1,
  mx: theme.jtSpacing.component.xs,
  my: theme.jtSpacing.component.xs,
  px: theme.jtSpacing.component.xs,
  py: theme.jtSpacing.component.xs,
  boxShadow: '0 6px 18px rgba(16,22,24,0.22)',
  backdropFilter: 'blur(8px)',
  zIndex: 21,
  pointerEvents: 'none',
  maxWidth: `calc(100% - ${theme.spacing(theme.jtSpacing.component.sm * 2)})`,
});

interface TooltipState {
  x: number;
  y: number;
  stationIndex: string;
  stationID: string;
  stationName: string;
}

interface MapContainerProps {
  currentViewingDate?: string | null;
  highlightedStationIndex?: number | null;
  unacceptableOver75?: number[];
  goodOver75?: number[];
}

function buildTooltipState(props: Record<string, unknown>, x: number, y: number): TooltipState {
  const stationIndex = props.index_ ?? props.station_index ?? props.index ?? 'N/A';
  const stationId = props.short_name ?? 'Unknown';
  const stationName = props.long_name ?? 'Unknown';

  return {
    x,
    y,
    stationIndex: String(stationIndex),
    stationID: String(stationId).toUpperCase(),
    stationName: String(stationName),
  };
}

export default function MapContainer({
  currentViewingDate = null,
  highlightedStationIndex = null,
  unacceptableOver75 = [],
  goodOver75 = [],
}: MapContainerProps) {
  const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  if (!mapboxToken) {
    return (
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'common.white',
          typography: 'body2',
        }}
      >
        Add VITE_MAPBOX_TOKEN to render the map.
      </Box>
    );
  }

  return (
    <Box sx={mapContainerSx}>
      <Map
        initialViewState={{
          longitude: -121.95,
          latitude: 37.95,
          zoom: 9.5,
        }}
        mapStyle="mapbox://styles/justtransition/cmo0kote1006j01st023g37ga"
        mapboxAccessToken={mapboxToken}
        style={mapStyle}
        interactiveLayerIds={[DELTA_STATION_POINTS_LAYER_ID]}
        onMouseMove={(event) => {
          const feature = event.features?.[0];
          if (!feature) {
            setTooltip(null);
            return;
          }

          const props = feature.properties as Record<string, unknown>;
          setTooltip(buildTooltipState(props, event.point.x, event.point.y));
        }}
        onMouseLeave={() => setTooltip(null)}
      >
        <MapLayerOrchestrator
          highlightedStationIndex={highlightedStationIndex}
          unacceptableOver75={unacceptableOver75}
          goodOver75={goodOver75}
        />
      </Map>

      {tooltip && (
        <Box sx={getTooltipSx(tooltip)}>
          <Typography variant="body2" component="div"><strong>Index:</strong> {tooltip.stationIndex}</Typography>
          <Typography variant="body2" component="div"><strong>ID:</strong> {tooltip.stationID}</Typography>
          <Typography variant="body2" component="div"><strong>Name:</strong> {tooltip.stationName}</Typography>
        </Box>
      )}

      <Box sx={dateBadgeSx}>
        <Typography variant="eyebrow" component="span" sx={{ color: 'primary.main', fontSize: '0.66rem', lineHeight: 1, whiteSpace: 'nowrap' }}>
          Date
        </Typography>
        <Typography variant="captionSmall" component="span" sx={{ color: 'common.white', fontWeight: 800, lineHeight: 1, whiteSpace: 'nowrap' }}>
          {currentViewingDate ?? 'Hover timeline'}
        </Typography>
      </Box>
    </Box>
  );
}
