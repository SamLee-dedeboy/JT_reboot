import { Layer, Source } from 'react-map-gl/mapbox';
import type { LayerProps } from 'react-map-gl/mapbox';

export const DELTA_STATION_POINTS_LAYER_ID = 'delta-station-points-circle';

const waterQualityStationIndices = [
  184, 84, 173, 24, 171, 324, 40, 200, 320, 322,
  321, 323, 327, 31, 88, 325, 201, 37, 7, 13,
  303, 66, 288, 319, 175, 96, 86, 50, 328, 318,
  326, 176, 2, 316, 311, 192, 117, 121, 145, 146,
  164, 307, 308, 309, 310, 312, 313, 314, 315, 317,
];

interface DeltaStationPointsLayerProps {
  highlightedStationIndex?: number | null;
  unacceptableOver75?: number[];
  goodOver75?: number[];
}

export default function DeltaStationPointsLayer({
  highlightedStationIndex = null,
  unacceptableOver75 = [],
  goodOver75 = [],
}: DeltaStationPointsLayerProps) {
  const baseLayer: LayerProps = {
    id: DELTA_STATION_POINTS_LAYER_ID,
    type: 'circle',
    'source-layer': 'Delta_Station_Locations_JT_Sa-20pbps',
    filter: ['in', ['get', 'index_'], ['literal', waterQualityStationIndices]],
    paint: {
      'circle-radius': 6,
      'circle-color': [
        'case',
        ['in', ['get', 'index_'], ['literal', unacceptableOver75]],
        '#f77c3b',
        ['in', ['get', 'index_'], ['literal', goodOver75]],
        '#51a2bd',
        '#757575',
      ],
      'circle-stroke-width': 2,
      'circle-stroke-color': '#f2f0ef',
    },
  };

  const highlightLayer: LayerProps = {
    id: 'delta-station-points-highlight',
    type: 'circle',
    'source-layer': 'Delta_Station_Locations_JT_Sa-20pbps',
    filter: ['==', ['get', 'index_'], highlightedStationIndex ?? -999999],
    paint: {
      'circle-radius': 10,
      'circle-color': '#f2c820',
      'circle-stroke-width': 3,
      'circle-stroke-color': '#ffffff',
      'circle-opacity': 0.95,
    },
  };

  return (
    <Source id="delta-station-points-source" type="vector" url="mapbox://justtransition.2am7ol9m">
      <Layer {...baseLayer} />
      <Layer {...highlightLayer} />
    </Source>
  );
}
