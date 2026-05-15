import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import Map from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapLayerOrchestrator from './MapLayerOrchestrator';
import { DELTA_STATION_POINTS_LAYER_ID } from './layers/DeltaStationPointsLayer';

const mapContainerStyle = { position: 'relative', width: '100%', height: '100%' } as const;
const mapStyle = { width: '100%', height: '100%' } as const;
const tooltipSx: SxProps<Theme> = {
  position: 'absolute',
  backgroundColor: 'rgba(22, 22, 22, 0.94)',
  color: 'grey.100',
  border: '1px solid rgba(242, 200, 32, 0.75)',
  borderRadius: 1,
  px: 1,
  py: 0.5,
  typography: 'body2',
  lineHeight: 1.4,
  pointerEvents: 'none',
  zIndex: 20,
  maxWidth: 220,
};
const dateBadgeSx: SxProps<Theme> = {
  position: 'absolute',
  top: 1,
  left: 1,
  backgroundColor: 'rgba(22, 22, 22, 0.9)',
  color: 'grey.100',
  border: '2px solid rgba(126, 217, 87, 0.75)',
  borderRadius: 1,
  px: 1,
  py: 0.5,
  typography: 'body2',
  lineHeight: 1.35,
  zIndex: 21,
  pointerEvents: 'none',
};

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
      <div className="playground-map-fallback">
        Add VITE_MAPBOX_TOKEN to render the map.
      </div>
    );
  }

  return (
    <div style={mapContainerStyle}>
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
        <Box
          sx={{
            ...tooltipSx,
            left: tooltip.x + 12,
            top: tooltip.y + 12,
          }}
        >
          <Typography variant="body2" component="div"><strong>Index:</strong> {tooltip.stationIndex}</Typography>
          <Typography variant="body2" component="div"><strong>ID:</strong> {tooltip.stationID}</Typography>
          <Typography variant="body2" component="div"><strong>Name:</strong> {tooltip.stationName}</Typography>
        </Box>
      )}

      <Box sx={dateBadgeSx}>
        <Typography variant="body2" component="strong">Currently Viewing:</Typography> {currentViewingDate ?? 'N/A'}
      </Box>
    </div>
  );
}
