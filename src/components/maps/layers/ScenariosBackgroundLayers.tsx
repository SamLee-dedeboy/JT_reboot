import { Layer, Source } from 'react-map-gl/mapbox';
import type { LayerProps } from 'react-map-gl/mapbox';
import type { FeatureCollection, LineString, Point } from 'geojson';

export type ScenariosBackgroundMapStep = 'overview' | 'rivers' | 'flow' | 'x2';

interface ScenariosBackgroundLayersProps {
  activeStep?: ScenariosBackgroundMapStep;
}

const lineSourceData: FeatureCollection<LineString, { name: string; color: string }> = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        name: 'Sacramento River',
        color: '#7ed957',
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [-121.63, 38.49],
          [-121.59, 38.34],
          [-121.65, 38.21],
          [-121.79, 38.09],
          [-121.94, 38.06],
          [-122.08, 38.05],
          [-122.19, 38.04],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        name: 'San Joaquin River',
        color: '#79e1e4',
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [-121.25, 37.77],
          [-121.39, 37.84],
          [-121.53, 37.91],
          [-121.67, 37.99],
          [-121.82, 38.03],
          [-121.96, 38.05],
          [-122.08, 38.05],
        ],
      },
    },
  ],
};

const x2SourceData: FeatureCollection<Point, { name: string }> = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { name: 'X2 65 km' },
      geometry: { type: 'Point', coordinates: [-122.15, 38.04] },
    },
    {
      type: 'Feature',
      properties: { name: 'X2 70 km' },
      geometry: { type: 'Point', coordinates: [-122.06, 38.05] },
    },
    {
      type: 'Feature',
      properties: { name: 'X2 75 km' },
      geometry: { type: 'Point', coordinates: [-121.96, 38.05] },
    },
    {
      type: 'Feature',
      properties: { name: 'X2 80 km' },
      geometry: { type: 'Point', coordinates: [-121.86, 38.04] },
    },
    {
      type: 'Feature',
      properties: { name: 'X2 85 km' },
      geometry: { type: 'Point', coordinates: [-121.75, 38.02] },
    },
  ],
};

const pumpSourceData: FeatureCollection<Point, { name: string }> = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { name: 'Banks Pumping Plant' },
      geometry: { type: 'Point', coordinates: [-121.62, 37.80] },
    },
    {
      type: 'Feature',
      properties: { name: 'Jones Pumping Plant' },
      geometry: { type: 'Point', coordinates: [-121.59, 37.81] },
    },
  ],
};

const riverGlowLayer: LayerProps = {
  id: 'scenario-background-river-glow',
  type: 'line',
  paint: {
    'line-color': ['get', 'color'],
    'line-width': ['interpolate', ['linear'], ['zoom'], 8, 8, 11, 18],
    'line-opacity': 0.22,
    'line-blur': 8,
  },
};

const riverLabelLayer: LayerProps = {
  id: 'scenario-background-river-label',
  type: 'symbol',
  layout: {
    'symbol-placement': 'line',
    'text-field': ['get', 'name'],
    'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Regular'],
    'text-size': 13,
    'text-letter-spacing': 0.04,
  },
  paint: {
    'text-color': '#f2f0ef',
    'text-halo-color': '#162226',
    'text-halo-width': 1.4,
  },
};

function getRiverOpacity(activeStep: ScenariosBackgroundMapStep) {
  return activeStep === 'flow' || activeStep === 'x2' ? 0.62 : 0.94;
}

function getX2Opacity(activeStep: ScenariosBackgroundMapStep) {
  return activeStep === 'x2' ? 0.95 : 0.28;
}

function getPumpOpacity(activeStep: ScenariosBackgroundMapStep) {
  return activeStep === 'flow' ? 0.95 : 0.36;
}

export default function ScenariosBackgroundLayers({ activeStep = 'overview' }: ScenariosBackgroundLayersProps) {
  const riverOpacity = getRiverOpacity(activeStep);
  const x2Opacity = getX2Opacity(activeStep);
  const pumpOpacity = getPumpOpacity(activeStep);

  const riverLineWithState: LayerProps = {
    id: 'scenario-background-river-line',
    type: 'line',
    paint: {
      'line-color': ['get', 'color'],
      'line-width': ['interpolate', ['linear'], ['zoom'], 8, 3.6, 11, 8],
      'line-opacity': riverOpacity,
    },
  };

  const x2CircleWithState: LayerProps = {
    id: 'scenario-background-x2-circle',
    type: 'circle',
    paint: {
      'circle-radius': ['interpolate', ['linear'], ['zoom'], 8, 6, 11, 10],
      'circle-color': '#f2c820',
      'circle-opacity': x2Opacity,
      'circle-stroke-color': '#162226',
      'circle-stroke-width': 2,
    },
  };

  const x2LabelWithState: LayerProps = {
    id: 'scenario-background-x2-label',
    type: 'symbol',
    layout: {
      'text-field': ['get', 'name'],
      'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Regular'],
      'text-size': 12,
      'text-offset': [0, 1.25],
      'text-anchor': 'top',
      'text-allow-overlap': false,
    },
    paint: {
      'text-color': '#f2c820',
      'text-halo-color': '#162226',
      'text-halo-width': 1.4,
      'text-opacity': activeStep === 'x2' ? 1 : 0,
    },
  };

  const pumpCircleWithState: LayerProps = {
    id: 'scenario-background-pump-circle',
    type: 'circle',
    paint: {
      'circle-radius': ['interpolate', ['linear'], ['zoom'], 8, 6, 11, 11],
      'circle-color': '#f77c3b',
      'circle-opacity': pumpOpacity,
      'circle-stroke-color': '#ffffff',
      'circle-stroke-width': 2,
    },
  };

  const pumpLabelWithState: LayerProps = {
    id: 'scenario-background-pump-label',
    type: 'symbol',
    layout: {
      'text-field': ['get', 'name'],
      'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Regular'],
      'text-size': 12,
      'text-offset': [1, 0],
      'text-anchor': 'left',
    },
    paint: {
      'text-color': '#ffffff',
      'text-halo-color': '#162226',
      'text-halo-width': 1.4,
      'text-opacity': activeStep === 'flow' ? 1 : 0,
    },
  };

  return (
    <>
      <Source id="scenario-background-rivers" type="geojson" data={lineSourceData}>
        <Layer {...riverGlowLayer} />
        <Layer {...riverLineWithState} />
        <Layer {...riverLabelLayer} />
      </Source>
      <Source id="scenario-background-x2" type="geojson" data={x2SourceData}>
        <Layer {...x2CircleWithState} />
        <Layer {...x2LabelWithState} />
      </Source>
      <Source id="scenario-background-pumps" type="geojson" data={pumpSourceData}>
        <Layer {...pumpCircleWithState} />
        <Layer {...pumpLabelWithState} />
      </Source>
    </>
  );
}
