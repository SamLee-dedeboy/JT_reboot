// The home hero's map on its own: the Suisun Bay camera at a breakpoint-tuned
// zoom with the 155-frame salinity animation playing over the hero style.
// HeroMap places it under the title.
import { useCallback, useState } from 'react'
import type { Map as MapboxMap } from 'mapbox-gl'
import { useMediaQuery, useTheme } from '@mui/material'
import BaseMap from '../BaseMap'
import HeroSalinityLayer from './HeroSalinityLayer'
import { HERO_CENTER, HERO_ZOOM_BY_BREAKPOINT } from '../cameras'
import { HERO_MAP_STYLE } from '../mapStyles'

interface HeroSalinityMapProps {
  /** Milliseconds between salinity frames. */
  intervalMs?: number
}

function getHeroBreakpoint(isXlUp: boolean, isLgUp: boolean, isMdUp: boolean, isSmUp: boolean) {
  if (isXlUp) return 'xl'
  if (isLgUp) return 'lg'
  if (isMdUp) return 'md'
  if (isSmUp) return 'sm'
  return 'xs'
}

export default function HeroSalinityMap({ intervalMs = 100 }: HeroSalinityMapProps) {
  const theme = useTheme()
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'))
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'))
  const isLgUp = useMediaQuery(theme.breakpoints.up('lg'))
  const isXlUp = useMediaQuery(theme.breakpoints.up('xl'))
  const [mapObj, setMapObj] = useState<MapboxMap | null>(null)
  const [firstLabelLayerId, setFirstLabelLayerId] = useState<string>()
  const heroBreakpoint = getHeroBreakpoint(isXlUp, isLgUp, isMdUp, isSmUp)
  const [heroInitialViewState] = useState(() => ({
    ...HERO_CENTER,
    zoom: HERO_ZOOM_BY_BREAKPOINT[heroBreakpoint],
  }))

  const handleMapAvailable = useCallback((map: MapboxMap) => {
    setMapObj(map)
    const labelLayerId = map.getStyle().layers?.find((layer) => layer.type === 'symbol')?.id
    setFirstLabelLayerId((current) => (current === labelLayerId ? current : labelLayerId))
  }, [])

  return (
    <BaseMap
      initialViewState={heroInitialViewState}
      mapStyleUrl={HERO_MAP_STYLE}
      interactive={false}
      fadeDuration={0}
      onMapReady={handleMapAvailable}
      onMapStyleData={handleMapAvailable}
    >
      <HeroSalinityLayer map={mapObj} intervalMs={intervalMs} beforeId={firstLabelLayerId} />
    </BaseMap>
  )
}
