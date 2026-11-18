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

/**
 * The story's map; the chapters' scroll position and selections drive it. From lg up it is
 * the sticky column beside the story (`column`); below lg it fills the sheet or preview
 * that holds it (`fill`).
 */
export default function StoryMap({
  scenario,
  selectedHabitatType,
  layout = 'column',
  showLegend = true,
}: {
  scenario: ScenarioContent
  selectedHabitatType: string | null
  layout?: 'column' | 'fill'
  /** Off where the holder lists the map's sites itself, or has no room for a key. */
  showLegend?: boolean
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

  const fill = layout === 'fill'

  return (
    <Box
      id="map-features"
      sx={fill ? { height: 1 } : { position: 'sticky', top: 110, scrollMarginTop: 110 }}
    >
      <Box
        aria-label={`Interactive map for ${scenario.title}`}
        sx={{
          height: fill ? 1 : 'calc(100dvh - 110px)',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: fill ? 0 : 1,
          border: fill ? 0 : 1,
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
        {showLegend && (
          <Legend
            scenarioSlug={scenario.slug}
            visibilityScope={mapState.scope}
            visible={showAdaptationLayers}
            selectedHabitatType={selectedHabitatType}
          />
        )}
      </Box>
    </Box>
  )
}
