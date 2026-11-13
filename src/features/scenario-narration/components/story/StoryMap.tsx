import { Box } from '@mui/material'
import { NavigationControl } from 'react-map-gl/mapbox'
import BaseMap from '@/map/BaseMap'
import Annotations from '@/map/scenarios/Annotations'
import Camera from '@/map/scenarios/Camera'
import Layers from '@/map/scenarios/Layers'
import Legend from '@/map/scenarios/Legend'
import SalinitySnapshot from '@/map/scenarios/SalinitySnapshot'
import { getConfig } from '@/map/scenarios/config'
import { SALINITY_MAP_STYLE } from '@/map/mapStyles'
import type { ScenarioContent } from '@/content/scenarios'
import useMapState from './useMapState'

/** The sticky map beside the story; the chapters' scroll position and selections drive it. */
export default function StoryMap({
  scenario,
  selectedHabitatType,
}: {
  scenario: ScenarioContent
  selectedHabitatType: string | null
}) {
  const mapConfig = getConfig(scenario.slug)
  const mapState = useMapState(mapConfig)
  const showAdaptationLayers =
    mapConfig.legendActivation === 'always' ||
    mapState.showAdaptationLayers ||
    selectedHabitatType != null
  const cameraBounds =
    (selectedHabitatType ? mapConfig.selectionBounds?.[selectedHabitatType] : undefined) ??
    mapConfig.bounds[mapState.scope] ??
    mapConfig.bounds.delta

  return (
    <Box
      id="map-features"
      sx={{
        position: { xs: mapConfig.interactive ? 'sticky' : 'static', lg: 'sticky' },
        top: 110,
        // On small screens the map stays above the rows that control it.
        order: { xs: mapConfig.interactive ? -1 : 0, lg: 0 },
        zIndex: { xs: 1, lg: 'auto' },
        scrollMarginTop: 110,
      }}
    >
      <Box
        aria-label={`Interactive map for ${scenario.title}`}
        sx={{
          height: { xs: mapConfig.interactive ? 300 : 360, lg: 'calc(100dvh - 110px)' },
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 1,
          border: 1,
          borderColor: 'base.400',
          bgcolor: 'base.700',
          '& .mapboxgl-ctrl-bottom-left': { display: 'none' },
        }}
      >
        <BaseMap
          initialViewState={mapConfig.initialViewState}
          mapStyleUrl={mapConfig.mapStyleUrl ?? SALINITY_MAP_STYLE}
          interactive={mapConfig.interactive}
          dragPan={mapConfig.interactive}
          dragRotate={false}
          scrollZoom={mapConfig.interactive}
          touchZoomRotate={mapConfig.interactive}
          maxBounds={mapConfig.maxBounds}
        >
          {cameraBounds && (
            <Camera bounds={cameraBounds} topClearance={mapConfig.legendClearance} />
          )}
          {mapConfig.salinitySnapshotFrame != null && (
            <SalinitySnapshot frame={mapConfig.salinitySnapshotFrame} />
          )}
          <Layers
            scenarioSlug={scenario.slug}
            showAdaptationLayers={showAdaptationLayers}
            selectedHabitatType={selectedHabitatType}
            visibilityScope={mapState.scope}
          />
          {mapConfig.annotations && <Annotations {...mapConfig.annotations} />}
          {mapConfig.showNavigationControl && (
            <NavigationControl position="bottom-right" showCompass={false} />
          )}
        </BaseMap>
        <Legend
          scenarioSlug={scenario.slug}
          visibilityScope={mapState.scope}
          visible={showAdaptationLayers}
          selectedHabitatType={selectedHabitatType}
        />
      </Box>
    </Box>
  )
}
