// The home hero's map on its own: a breakpoint-tuned framing of the salinity front
// (Carquinez Strait into the western Delta) with the 155-frame salinity animation
// playing over the hero style, and the ocean beyond the model filled in. HeroMap places
// it under the title.
import { useCallback, useEffect, useState } from 'react'
import type { Map as MapboxMap } from 'mapbox-gl'
import { useTheme, type Theme } from '@mui/material'
import BaseMap from '../BaseMap'
import HeroSalinityLayer from './HeroSalinityLayer'
import { DELTA_START_VIEW, HERO_CAMERA_BY_BREAKPOINT } from '../cameras'
import { HERO_MAP_STYLE } from '../mapStyles'
import { Layer, Source } from 'react-map-gl/mapbox'
import { map } from '@/theme'
import { assetUrl } from '@/utils/baseUrl'

/**
 * The Pacific and Monterey Bay beyond the salinity model, in the marine (euhaline) color.
 * Built by scripts/build-hero-ocean.mjs from the basemap's water, so it follows the coast.
 * It sits under the salinity layers in their own marine color, so the 85% salinity ocean
 * over it reads as the same color and the model's edge never shows.
 */
const HERO_OCEAN_URL = assetUrl('/data/geospatial-assets/shared/hero-ocean.geojson')
const HERO_OCEAN_SOURCE_ID = 'hero-ocean-source'
const HERO_OCEAN_LAYER_ID = 'hero-ocean-fill'

interface HeroSalinityMapProps {
  /** Milliseconds between salinity frames. */
  intervalMs?: number
}

/** The breakpoint for the map's own width, so the framing follows the hero, not the window. */
function getHeroBreakpoint(width: number, theme: Theme): keyof typeof HERO_CAMERA_BY_BREAKPOINT {
  const { values } = theme.breakpoints
  if (width >= values.xl) return 'xl'
  if (width >= values.lg) return 'lg'
  if (width >= values.md) return 'md'
  if (width >= values.sm) return 'sm'
  return 'xs'
}

function fitHeroCamera(map: MapboxMap, theme: Theme) {
  const { clientWidth: width, clientHeight: height } = map.getContainer()
  if (!width || !height) return
  const { bounds, padding } = HERO_CAMERA_BY_BREAKPOINT[getHeroBreakpoint(width, theme)]
  map.fitBounds(bounds, {
    padding: {
      top: Math.round(padding.top * height),
      bottom: Math.round(padding.bottom * height),
      left: Math.round(padding.left * width),
      right: Math.round(padding.right * width),
    },
    duration: 0,
  })
}

export default function HeroSalinityMap({ intervalMs = 100 }: HeroSalinityMapProps) {
  const theme = useTheme()
  const [mapObj, setMapObj] = useState<MapboxMap | null>(null)
  const [firstLabelLayerId, setFirstLabelLayerId] = useState<string>()

  const handleMapReady = useCallback(
    (map: MapboxMap) => {
      fitHeroCamera(map, theme)
      setMapObj(map)
      const labelLayerId = map.getStyle().layers?.find((layer) => layer.type === 'symbol')?.id
      setFirstLabelLayerId((current) => (current === labelLayerId ? current : labelLayerId))
    },
    [theme],
  )

  const handleMapStyleData = useCallback((map: MapboxMap) => {
    const labelLayerId = map.getStyle().layers?.find((layer) => layer.type === 'symbol')?.id
    setFirstLabelLayerId((current) => (current === labelLayerId ? current : labelLayerId))
  }, [])

  // Refit when the hero changes size (rotation, window resize), so the subject stays clear
  // of the title.
  useEffect(() => {
    if (!mapObj) return
    const refit = () => fitHeroCamera(mapObj, theme)
    mapObj.on('resize', refit)
    return () => {
      mapObj.off('resize', refit)
    }
  }, [mapObj, theme])

  return (
    <BaseMap
      initialViewState={DELTA_START_VIEW}
      mapStyleUrl={HERO_MAP_STYLE}
      interactive={false}
      fadeDuration={0}
      onMapReady={handleMapReady}
      onMapStyleData={handleMapStyleData}
    >
      {/* Added first, so the salinity layers land above it. */}
      <Source id={HERO_OCEAN_SOURCE_ID} type="geojson" data={HERO_OCEAN_URL}>
        <Layer
          id={HERO_OCEAN_LAYER_ID}
          type="fill"
          beforeId={firstLabelLayerId}
          paint={{ 'fill-color': map.salinityAnimation.euhaline, 'fill-antialias': true }}
        />
      </Source>
      <HeroSalinityLayer map={mapObj} intervalMs={intervalMs} beforeId={firstLabelLayerId} />
    </BaseMap>
  )
}
