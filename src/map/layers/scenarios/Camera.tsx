import { useEffect } from 'react'
import { useMap } from 'react-map-gl/mapbox'
import type { MapBounds } from './config'

export default function Camera({
  bounds,
  topClearance = 16,
}: {
  bounds: MapBounds
  topClearance?: number
}) {
  const { current: map } = useMap()

  useEffect(() => {
    if (!map) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const duration = reduceMotion ? 0 : 900

    // On a short panel, a full clearance would leave too little room to fit the bounds.
    const top = Math.min(topClearance, map.getContainer().clientHeight * 0.3)

    map.fitBounds(bounds, {
      padding: { top, right: 16, bottom: 16, left: 16 },
      duration,
      essential: false,
    })
  }, [bounds, map, topClearance])

  return null
}
