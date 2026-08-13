// Harvests station longitude/latitude from the Mapbox vector tileset.
//
// Station coordinates live only in the tileset geometry, which loads lazily
// per-tile. We listen for the map 'idle' event (fires once tiles are loaded
// and rendered), query the source features, and cache lng/lat by station
// index. The cache is permanent once populated, so panning never loses points.

import { useEffect, useRef, useState } from 'react'
import type { Map as MapboxMap } from 'mapbox-gl'
import {
  DELTA_STATION_POINTS_SOURCE_ID,
  DELTA_STATION_POINTS_SOURCE_LAYER,
  WATER_QUALITY_STATION_INDICES,
} from '../layers/deltaStationConstants'

export interface StationCoords {
  ready: boolean
  /** Station index -> [lng, lat]. */
  lngLatByIndex: Map<number, [number, number]>
}

export function useStationCoords(map: MapboxMap | null): StationCoords {
  const [coords, setCoords] = useState<StationCoords>({
    ready: false,
    lngLatByIndex: new Map(),
  })
  const cacheRef = useRef<Map<number, [number, number]>>(new Map())

  useEffect(() => {
    if (!map) return

    const needed = new Set(WATER_QUALITY_STATION_INDICES)

    const harvest = () => {
      let features
      try {
        features = map.querySourceFeatures(DELTA_STATION_POINTS_SOURCE_ID, {
          sourceLayer: DELTA_STATION_POINTS_SOURCE_LAYER,
        })
      } catch {
        return
      }

      let added = false
      for (const feature of features) {
        const index = Number(feature.properties?.index_)
        if (!Number.isFinite(index) || !needed.has(index)) continue
        if (cacheRef.current.has(index)) continue
        if (feature.geometry?.type !== 'Point') continue

        const [lng, lat] = feature.geometry.coordinates as [number, number]
        cacheRef.current.set(index, [lng, lat])
        added = true
      }

      if (added) {
        setCoords({
          ready: true,
          lngLatByIndex: new Map(cacheRef.current),
        })
      }

      // Stop listening once every needed station has been found.
      if (cacheRef.current.size >= needed.size) {
        map.off('idle', harvest)
      }
    }

    map.on('idle', harvest)
    harvest()

    return () => {
      map.off('idle', harvest)
    }
  }, [map])

  return coords
}
