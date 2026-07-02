import MapIcon from '@mui/icons-material/Map';
import { Box, Stack, Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import type { Map as MapboxMap } from 'mapbox-gl';
import { useCallback, useEffect, useRef, useState } from 'react';
import BaseMap from '../BaseMap';
import MapLayerOrchestrator from '../MapLayerOrchestrator';
import ScenariosBackgroundLayers, { type ScenariosBackgroundMapStep } from '../layers/ScenariosBackgroundLayers';

interface ScenariosBackgroundMapProps {
  activeStep?: ScenariosBackgroundMapStep;
  showInfoOverlay?: boolean;
  sx?: SxProps<Theme>;
}

const scenarioCameraByStep: Record<ScenariosBackgroundMapStep, {
  longitude: number;
  latitude: number;
  zoom: number;
  pitch: number;
  bearing: number;
}> = {
  overview: {
    longitude: -121.82,
    latitude: 38.06,
    zoom: 8.75,
    pitch: 18,
    bearing: -8,
  },
  rivers: {
    longitude: -121.78,
    latitude: 38.11,
    zoom: 9.15,
    pitch: 22,
    bearing: -12,
  },
  flow: {
    longitude: -121.71,
    latitude: 37.94,
    zoom: 9.45,
    pitch: 24,
    bearing: -10,
  },
  x2: {
    longitude: -121.99,
    latitude: 38.04,
    zoom: 9.72,
    pitch: 20,
    bearing: -8,
  },
};

const mapCopyByStep: Record<ScenariosBackgroundMapStep, { eyebrow: string; title: string; body: string }> = {
  overview: {
    eyebrow: 'Delta Map',
    title: 'Salinity context map',
    body: 'Rivers, export pumps, and X2 distance markers for reading the scenario maps.',
  },
  rivers: {
    eyebrow: 'Two Rivers',
    title: 'Sacramento and San Joaquin',
    body: 'The two river systems meet in the Delta before freshwater moves west toward the Bay.',
  },
  flow: {
    eyebrow: 'Push and Pull',
    title: 'Outflow, tides, and exports',
    body: 'Freshwater outflow pushes west while tides, sea level pressure, and export pumps shape salinity risk.',
  },
  x2: {
    eyebrow: 'X2 Distance',
    title: 'Low-salinity zone marker',
    body: 'X2 markers show distance inland from the Golden Gate, helping locate the freshwater-saltwater balance.',
  },
};

const scenariosBackgroundViewState = {
  longitude: -121.82,
  latitude: 38.06,
  zoom: 8.75,
  pitch: 18,
  bearing: -8,
};

const mapContainerSx: SxProps<Theme> = {
  position: 'relative',
  width: '100%',
  height: { xs: 390, md: 'calc(100vh - 156px)' },
  minHeight: 390,
  border: '1px solid rgba(155,162,164,0.28)',
  bgcolor: '#162226',
  overflow: 'hidden',
  isolation: 'isolate',
  '& .mapboxgl-ctrl-bottom-left, & .mapboxgl-ctrl-bottom-right': {
    display: 'none',
  },
};

const mapLayers = [
  ['Sacramento River', '#7ed957'],
  ['San Joaquin River', '#79e1e4'],
  ['X2 intervals', '#f2c820'],
  ['Export pumps', '#f77c3b'],
] as const;

export default function ScenariosBackgroundMap({
  activeStep = 'overview',
  showInfoOverlay = true,
  sx = [],
}: ScenariosBackgroundMapProps) {
  const [mapObj, setMapObj] = useState<MapboxMap | null>(null);
  const mapRef = useRef<MapboxMap | null>(null);
  const activeCopy = mapCopyByStep[activeStep];

  const handleMapAvailable = useCallback((map: MapboxMap) => {
    if (mapRef.current === map) return;
    mapRef.current = map;
    setMapObj(map);
  }, []);

  useEffect(() => {
    if (!mapObj) return;

    const camera = scenarioCameraByStep[activeStep];
    mapObj.flyTo({
      center: [camera.longitude, camera.latitude],
      zoom: camera.zoom,
      pitch: camera.pitch,
      bearing: camera.bearing,
      duration: 900,
      essential: true,
    });
  }, [activeStep, mapObj]);

  return (
    <Box
      aria-label="Interactive Delta salinity background map"
      sx={[mapContainerSx, ...(Array.isArray(sx) ? sx : [sx])]}
    >
      <BaseMap
        initialViewState={scenariosBackgroundViewState}
        cooperativeGestures
        onMapReady={handleMapAvailable}
        onMapStyleData={handleMapAvailable}
      >
        <MapLayerOrchestrator showDeltaStations={false}>
          <ScenariosBackgroundLayers activeStep={activeStep} />
        </MapLayerOrchestrator>
      </BaseMap>

      {showInfoOverlay && (
        <Stack
          spacing={1.1}
          sx={{
            position: 'absolute',
            top: 18,
            left: 18,
            right: 18,
            p: 2,
            bgcolor: 'rgba(16,22,24,0.82)',
            border: '1px solid rgba(155,162,164,0.24)',
            backdropFilter: 'blur(10px)',
            pointerEvents: 'none',
            zIndex: 2,
          }}
        >
          <Box
            sx={{
              typography: 'eyebrow',
              color: 'primary.main',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <MapIcon fontSize="small" />
            {activeCopy.eyebrow}
          </Box>
          <Typography variant="h5" component="p" sx={{ color: 'common.white' }}>
            {activeCopy.title}
          </Typography>
          <Typography variant="captionSmall" component="p" sx={{ color: 'base.100', lineHeight: 1.45 }}>
            {activeCopy.body}
          </Typography>
        </Stack>
      )}

      <Stack
        direction="row"
        useFlexGap
        sx={{
          position: 'absolute',
          left: 18,
          right: 18,
          bottom: 18,
          flexWrap: 'wrap',
          gap: 1,
          pointerEvents: 'none',
          zIndex: 2,
        }}
      >
        {mapLayers.map(([layer, color]) => (
          <Box
            key={layer}
            component="span"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.75,
              px: 1.2,
              py: 0.7,
              border: '1px solid rgba(155,162,164,0.24)',
              bgcolor: 'rgba(16,22,24,0.76)',
              color: 'base.50',
              fontSize: '0.82rem',
              lineHeight: 1,
              fontWeight: 800,
            }}
          >
            <Box
              component="span"
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: color,
                boxShadow: `0 0 12px ${color}`,
              }}
            />
            {layer}
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
