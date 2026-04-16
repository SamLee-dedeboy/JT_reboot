import { useState } from 'react';
import Map from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapLayerOrchestrator from './MapLayerOrchestrator';
import { DELTA_STATION_POINTS_LAYER_ID } from './layers/DeltaStationPointsLayer';

const mapContainerStyle = { position: 'relative', width: '100%', height: '100%' } as const;
const mapStyle = { width: '100%', height: '100%' } as const;
const tooltipStyle = {
  position: 'absolute',
  background: 'rgba(22, 22, 22, 0.94)',
  color: '#f2f2f2',
  border: '1px solid rgba(242, 200, 32, 0.75)',
  borderRadius: 6,
  padding: '0.45rem 0.55rem',
  fontSize: '0.78rem',
  lineHeight: 1.4,
  pointerEvents: 'none',
  zIndex: 20,
  maxWidth: 220,
} as const;
const dateBadgeStyle = {
  position: 'absolute',
  top: 10,
  left: 10,
  background: 'rgba(22, 22, 22, 0.9)',
  color: '#f2f2f2',
  border: '2px solid rgba(126, 217, 87, 0.75)',
  borderRadius: 6,
  padding: '0.4rem 0.55rem',
  fontSize: '0.78rem',
  lineHeight: 1.35,
  zIndex: 21,
  pointerEvents: 'none',
} as const;

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
        <div
          style={{
            ...tooltipStyle,
            left: tooltip.x + 12,
            top: tooltip.y + 12,
          }}
        >
          <div><strong>Index:</strong> {tooltip.stationIndex}</div>
          <div><strong>ID:</strong> {tooltip.stationID}</div>
          <div><strong>Name:</strong> {tooltip.stationName}</div>
        </div>
      )}

      <div
        style={dateBadgeStyle}
      >
        <strong>Currently Viewing:</strong> {currentViewingDate ?? 'N/A'}
      </div>
    </div>
  );
}
