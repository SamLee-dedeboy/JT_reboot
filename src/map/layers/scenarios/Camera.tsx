import { useEffect } from 'react'
import { useMap } from 'react-map-gl/mapbox'
import type { MapBounds } from './config'

export default function Camera({ bounds }: { bounds: MapBounds }) {
  const { current: map } = useMap()

  useEffect(() => {
    if (!map) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const duration = reduceMotion ? 0 : 900

    map.fitBounds(bounds, {
      padding: 16,
      duration,
      essential: false,
    })
  }, [bounds, map])

  return null
}
