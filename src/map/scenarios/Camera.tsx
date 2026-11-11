import { useEffect } from 'react'
import { useMap } from 'react-map-gl/mapbox'
import type { MapBounds } from './config'

export default function Camera({
  bounds,
  topClearance = 16,
  padding = 16,
}: {
  bounds: MapBounds
  topClearance?: number
  /** Space kept free on the other three sides. */
  padding?: number
}) {
  const { current: map } = useMap()

  useEffect(() => {
    if (!map) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const duration = reduceMotion ? 0 : 900

    // On a short panel, a full clearance would leave too little room to fit the bounds.
    const top = Math.min(Math.max(topClearance, padding), map.getContainer().clientHeight * 0.3)

    map.fitBounds(bounds, {
      padding: { top, right: padding, bottom: padding, left: padding },
      duration,
      essential: false,
    })
  }, [bounds, map, padding, topClearance])

  return null
}
