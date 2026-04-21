import { Layer, Source } from 'react-map-gl/mapbox';
import type { LayerProps } from 'react-map-gl/mapbox';

export const DELTA_STATION_POINTS_LAYER_ID = 'delta-station-points-circle';
const DELTA_STATION_POINTS_HIGHLIGHT_LAYER_ID = 'delta-station-points-highlight';
const DELTA_STATION_POINTS_SOURCE_ID = 'delta-station-points-source';
const DELTA_STATION_POINTS_SOURCE_URL = 'mapbox://justtransition.2am7ol9m';
const DELTA_STATION_POINTS_SOURCE_LAYER = 'Delta_Station_Locations_JT_Sa-20pbps';

const waterQualityStationIndices: ReadonlyArray<number> = [
  13, 24, 86, 322, 323, 326, 175, 201, 200, 171,
  320, 288, 319, 164, 66, 31, 88, 317, 318, 316,
  2, 37, 121, 145, 146, 192, 309, 310, 311, 312,
  313, 314, 315, 7, 321, 324, 325, 328, 40, 176,
  117, 307, 308, 96, 173, 327,
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
    'source-layer': DELTA_STATION_POINTS_SOURCE_LAYER,
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
    id: DELTA_STATION_POINTS_HIGHLIGHT_LAYER_ID,
    type: 'circle',
    'source-layer': DELTA_STATION_POINTS_SOURCE_LAYER,
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
    <Source id={DELTA_STATION_POINTS_SOURCE_ID} type="vector" url={DELTA_STATION_POINTS_SOURCE_URL}>
      <Layer {...baseLayer} />
      <Layer {...highlightLayer} />
    </Source>
  );
}
