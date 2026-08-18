import { useEffect } from 'react'
import { useMap } from 'react-map-gl/mapbox'

const deltaBounds: [[number, number], [number, number]] = [
  [-122.25, 37.55],
  [-121.25, 38.65],
]

const watershedOverviewBounds: [[number, number], [number, number]] = [
  [-123.6, 33.4],
  [-119.1, 42.1],
]

export default function ScenarioMapCamera({ statewide }: { statewide: boolean }) {
  const { current: map } = useMap()

  useEffect(() => {
    if (!map) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const duration = reduceMotion ? 0 : 900

    map.fitBounds(statewide ? watershedOverviewBounds : deltaBounds, {
      padding: 16,
      duration,
      essential: false,
    })
  }, [map, statewide])

  return null
}
