import { Box } from '@mui/material'
import { Layer, NavigationControl, Source } from 'react-map-gl/mapbox'
import BaseMap from '@/map/BaseMap'
import Camera from '@/map/scenarios/Camera'
import Layers from '@/map/scenarios/Layers'
import { getConfig } from '@/map/scenarios/config'
import { assetUrl } from '@/utils/baseUrl'
import { MODELING_CAMERAS } from '@/map/cameras'
import { SALINITY_MAP_STYLE } from '@/map/mapStyles'
import { type Implementation } from '@/content/modeling'
import MapLabel, { type MapLabelData } from './MapLabel'
import { map } from '@/theme'

/**
 * Suisun Marsh and Franks Tract are drawn as areas, and the Lindsey-Cache Slough area is drawn around
 * three of the additions. The four areas New Green Watershed adds have no mapped boundaries of their
 * own yet, so each is marked at its approximate location.
 */
const ecoMachinePlaces: MapLabelData[] = [
  { text: 'Suisun Marsh', longitude: -121.99, latitude: 38.15 },
  { text: 'Franks Tract', longitude: -121.615, latitude: 38.042 },
]

// Green marks what a scenario adds: these two are new in Eco Machine, and carried over in New Green Watershed.
const ecoMachineLabels = ecoMachinePlaces.map((place) => ({ ...place, added: true }))

const newGreenWatershedLabels: MapLabelData[] = [
  ...ecoMachinePlaces,
  { text: 'Dutch Slough', longitude: -121.675, latitude: 38.005, side: 'right', added: true },
  { text: 'Egbert Tract', longitude: -121.665, latitude: 38.265, added: true },
  { text: 'Hastings Tract', longitude: -121.76, latitude: 38.272, side: 'right', added: true },
  {
    text: 'Northern Cache Slough Complex',
    longitude: -121.72,
    latitude: 38.325,
    side: 'right',
    added: true,
  },
]

const BOLSTER_LABEL_OFFSET = 16

/** The gates sit at the centers of their footprints in bolster-and-fortify/operable-gates.geojson. */
const bolsterLabels: MapLabelData[] = [
  {
    text: 'Operable gate',
    longitude: -121.58435,
    latitude: 38.06291,
    added: true,
    offset: BOLSTER_LABEL_OFFSET,
  },
  {
    text: 'Reconstructed levees',
    longitude: -121.582,
    latitude: 38.047,
    bare: true,
    offset: BOLSTER_LABEL_OFFSET,
  },
  {
    text: 'Operable gate',
    longitude: -121.58494,
    latitude: 38.03057,
    added: true,
    offset: BOLSTER_LABEL_OFFSET,
  },
]

const tunnelLabels: MapLabelData[] = [
  {
    text: 'Northern Delta intakes',
    longitude: -121.535,
    latitude: 38.363,
    side: 'right',
    bare: true,
  },
  { text: 'Tunnel alignment', longitude: -121.42, latitude: 38.117, bare: true },
  { text: 'Bethany pumping facilities', longitude: -121.56, latitude: 37.79, bare: true },
]

export default function ScenarioMap({ implementation }: { implementation: Implementation }) {
  const { id, slug, label } = implementation
  // New Green Watershed builds on Eco Machine's two areas, then marks the four it adds.
  const layerSlug = id === 'ngw' ? 'eco-machine' : slug
  const mapConfig = getConfig(slug)
  const labels = {
    eco: ecoMachineLabels,
    ngw: newGreenWatershedLabels,
    bolster: bolsterLabels,
    tunnel: tunnelLabels,
  }[id as string]
  const bounds =
    id === 'eco' || id === 'ngw'
      ? MODELING_CAMERAS.restoredAreas
      : id === 'bolster'
        ? MODELING_CAMERAS.bolsterGates
        : mapConfig.bounds.delta

  return (
    <Box
      aria-label={`Interactive map for ${label}`}
      sx={{
        height: id === 'bolster' ? 340 : { xs: 420, lg: 480 },
        position: 'relative',
        overflow: 'hidden',
        border: 1,
        borderColor: 'border.default',
        bgcolor: 'base.700',
        '& .mapboxgl-ctrl-bottom-left': { display: 'none' },
      }}
    >
      <BaseMap
        key={slug}
        initialViewState={mapConfig.initialViewState}
        mapStyleUrl={SALINITY_MAP_STYLE}
        interactive={mapConfig.interactive}
        dragPan={mapConfig.interactive}
        dragRotate={false}
        scrollZoom={mapConfig.interactive}
        touchZoomRotate={mapConfig.interactive}
        maxBounds={mapConfig.maxBounds}
      >
        {bounds && (
          <Camera
            bounds={bounds}
            padding={id === 'bolster' ? MODELING_CAMERAS.bolsterGatesPadding : undefined}
          />
        )}
        <Layers
          scenarioSlug={layerSlug}
          showAdaptationLayers
          visibilityScope="delta"
          hiddenSelectionKeys={
            id === 'bolster' ? ['freshwater-corridor', 'operable-gates'] : undefined
          }
        />
        {id === 'ngw' && (
          <Source
            id="ngw-lindsey-cache-slough"
            type="geojson"
            data={assetUrl('/data/geospatial-assets/subteams/lindsey-cache-slough.geojson')}
          >
            <Layer
              id="ngw-lindsey-cache-slough-fill"
              type="fill"
              paint={{
                'fill-color': map.scenarios.cartography.mutedFeature,
                'fill-opacity': 0.42,
              }}
            />
            <Layer
              id="ngw-lindsey-cache-slough-line"
              type="line"
              paint={{
                'line-color': map.scenarios.cartography.feature,
                'line-opacity': 0.95,
                'line-width': 2,
              }}
            />
          </Source>
        )}
        {labels?.map((place) => (
          <MapLabel key={`${place.text}-${place.latitude}`} {...place} />
        ))}
        {mapConfig.showNavigationControl && (
          <NavigationControl position="top-right" showCompass={false} />
        )}
      </BaseMap>
    </Box>
  )
}
