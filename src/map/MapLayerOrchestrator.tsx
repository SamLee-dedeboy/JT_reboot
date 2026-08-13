import { useEffect, type ReactNode } from 'react'
import type { Map as MapboxMap } from 'mapbox-gl'
import DeltaStationPointsLayer from './layers/DeltaStationPointsLayer'

interface LayerCycleConfig {
  layerIds: string[]
  crossfadeMs?: number
  cycleMs?: number
  enabled?: boolean
}

interface MapLayerOrchestratorProps {
  children?: ReactNode
  highlightedStationIndex?: number | null
  layerCycle?: LayerCycleConfig
  map?: MapboxMap | null
  unacceptableOver75?: number[]
  goodOver75?: number[]
  showDeltaStations?: boolean
}

const opacityPropsByLayerType: Record<string, string> = {
  fill: 'fill-opacity',
  line: 'line-opacity',
  circle: 'circle-opacity',
  symbol: 'icon-opacity',
  raster: 'raster-opacity',
  heatmap: 'heatmap-opacity',
  'fill-extrusion': 'fill-extrusion-opacity',
}

const transitionPropsByLayerType: Record<string, string> = {
  fill: 'fill-opacity-transition',
  line: 'line-opacity-transition',
  circle: 'circle-opacity-transition',
  symbol: 'icon-opacity-transition',
  raster: 'raster-opacity-transition',
  heatmap: 'heatmap-opacity-transition',
  'fill-extrusion': 'fill-extrusion-opacity-transition',
}

function setLayerOpacity(map: MapboxMap, layerId: string, opacity: number, duration: number) {
  const layer = map.getLayer(layerId) as { type?: string } | undefined
  if (!layer) return false

  const layerType = layer.type ?? ''
  const opacityProperty = opacityPropsByLayerType[layerType]
  const transitionProperty = transitionPropsByLayerType[layerType]

  if (!opacityProperty || !transitionProperty) return false

  map.setLayoutProperty(layerId, 'visibility', 'visible')
  map.setPaintProperty(
    layerId,
    transitionProperty as Parameters<MapboxMap['setPaintProperty']>[1],
    { duration, delay: 0 } as Parameters<MapboxMap['setPaintProperty']>[2],
  )
  map.setPaintProperty(
    layerId,
    opacityProperty as Parameters<MapboxMap['setPaintProperty']>[1],
    opacity as Parameters<MapboxMap['setPaintProperty']>[2],
  )

  return true
}

function useLayerCycle(map: MapboxMap | null | undefined, layerCycle?: LayerCycleConfig) {
  const layerIdsKey = layerCycle?.layerIds.join('|') ?? ''
  const enabled = layerCycle?.enabled ?? true
  const crossfadeMs = layerCycle?.crossfadeMs ?? 1400
  const cycleMs = layerCycle?.cycleMs ?? 2800

  useEffect(() => {
    if (!map || !layerCycle || !enabled || layerCycle.layerIds.length === 0) return

    let idx = 0
    let intervalId: number | undefined
    let frameId: number | undefined

    const getExistingLayerIds = () => {
      return layerCycle.layerIds.filter((id) => !!map.getLayer(id))
    }

    const start = () => {
      if (intervalId) return

      const idsThatExist = getExistingLayerIds()
      if (idsThatExist.length === 0) {
        frameId = window.requestAnimationFrame(start)
        return
      }

      idsThatExist.forEach((id, layerIdx) => {
        setLayerOpacity(map, id, layerIdx === 0 ? 1 : 0, 0)
      })

      intervalId = window.setInterval(() => {
        idx = (idx + 1) % idsThatExist.length
        idsThatExist.forEach((id, layerIdx) => {
          setLayerOpacity(map, id, layerIdx === idx ? 1 : 0, crossfadeMs)
        })
      }, cycleMs)
    }

    map.on('styledata', start)
    start()

    return () => {
      if (intervalId) {
        window.clearInterval(intervalId)
      }
      if (frameId) {
        window.cancelAnimationFrame(frameId)
      }
      map.off('styledata', start)
    }
  }, [crossfadeMs, cycleMs, enabled, layerCycle, layerIdsKey, map])
}

export default function MapLayerOrchestrator({
  children,
  highlightedStationIndex = null,
  layerCycle,
  map,
  unacceptableOver75 = [],
  goodOver75 = [],
  showDeltaStations = true,
}: MapLayerOrchestratorProps) {
  useLayerCycle(map, layerCycle)

  return (
    <>
      {showDeltaStations && (
        <DeltaStationPointsLayer
          highlightedStationIndex={highlightedStationIndex}
          unacceptableOver75={unacceptableOver75}
          goodOver75={goodOver75}
        />
      )}
      {children}
    </>
  )
}
