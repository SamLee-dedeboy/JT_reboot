import type { ExpressionSpecification } from 'mapbox-gl'
import { useEffect, useState } from 'react'
import { Layer, Source } from 'react-map-gl/mapbox'
import { useMap } from 'react-map-gl/mapbox'
import type { LayerProps } from 'react-map-gl/mapbox'
import { map } from '../../../theme'
import { isOfflineMapEnabled } from '../../offlineBasemapStyle'
import { layersBySlug, type MapScope } from './config'
import { registerScenarioMarkers, registerScenarioPatterns, scenarioMarkerIds } from './patterns'

interface LayersProps {
  scenarioSlug: string
  showAdaptationLayers?: boolean
  selectedHabitatType?: string | null
  visibilityScope?: MapScope
  /** Leaves out these assets, for a map that draws only part of a scenario. */
  hiddenSelectionKeys?: string[]
}

function withoutSourceLayer(layer: LayerProps): LayerProps {
  const localLayer = { ...layer }
  delete localLayer['source-layer']
  return localLayer
}

export default function Layers({
  scenarioSlug,
  showAdaptationLayers = false,
  selectedHabitatType,
  visibilityScope = 'delta',
  hiddenSelectionKeys,
}: LayersProps) {
  const { current: mapRef } = useMap()
  const [patternsReady, setPatternsReady] = useState(false)
  const offline = isOfflineMapEnabled()
  const sources = (layersBySlug[scenarioSlug] ?? []).filter((source) => {
    if (offline && source.url?.startsWith('mapbox://') && !source.offlineData) return false
    if (source.selectionKey && hiddenSelectionKeys?.includes(source.selectionKey)) return false
    const sourceScope = source.visibilityScope ?? 'delta'
    if (visibilityScope === 'statewide-ecocultural') {
      return sourceScope === 'statewide-ecocultural'
    }
    return sourceScope === visibilityScope
  })

  useEffect(() => {
    if (!mapRef) return
    const mapboxMap = mapRef.getMap()
    const register = () => {
      registerScenarioPatterns(mapboxMap, map.scenarios.cartography.pattern)
      registerScenarioMarkers(mapboxMap, {
        fill: map.scenarios.cartography.feature,
        selected: map.scenarios.cartography.highlight,
        stroke: map.markers.stroke,
      })
      setPatternsReady(true)
    }

    if (mapboxMap.isStyleLoaded()) register()
    else mapboxMap.once('load', register)
    return () => {
      mapboxMap.off('load', register)
    }
  }, [mapRef])

  return (
    <>
      {sources.map((source) => (
        <Source
          key={source.id}
          id={source.id}
          type={offline && source.offlineData ? 'geojson' : source.type}
          {...(offline && source.offlineData
            ? { data: source.offlineData }
            : {
                ...(source.url == null ? {} : { url: source.url }),
                ...(source.data == null ? {} : { data: source.data }),
                ...(source.tileSize == null ? {} : { tileSize: source.tileSize }),
              })}
        >
          {source.layers.map((layer) => {
            const activeLayer = offline && source.offlineData ? withoutSourceLayer(layer) : layer
            const isPatternLayer =
              activeLayer.type === 'fill' && activeLayer.paint?.['fill-pattern'] != null

            const isMarkerLayer =
              source.activation === 'adaptation' && activeLayer.type === 'symbol'

            if ((isPatternLayer || isMarkerLayer) && !patternsReady) return null

            if (source.activation === 'adaptation' && activeLayer.type === 'fill') {
              const isSelected = selectedHabitatType === source.selectionKey
              const visibleOpacity =
                selectedHabitatType && source.selectableProperty
                  ? ([
                      'case',
                      ['==', ['get', source.selectableProperty], selectedHabitatType],
                      isPatternLayer ? 0.95 : 0.68,
                      isPatternLayer ? 0.16 : 0.1,
                    ] as ExpressionSpecification)
                  : selectedHabitatType && source.selectionKey
                    ? isSelected
                      ? isPatternLayer
                        ? 0.95
                        : 0.68
                      : isPatternLayer
                        ? 0.16
                        : 0.1
                    : (activeLayer.paint?.['fill-opacity'] ?? 1)

              return (
                <Layer
                  {...activeLayer}
                  key={layer.id}
                  paint={{
                    ...activeLayer.paint,
                    ...(!isPatternLayer && {
                      'fill-color':
                        selectedHabitatType && source.selectableProperty
                          ? ([
                              'case',
                              ['==', ['get', source.selectableProperty], selectedHabitatType],
                              map.scenarios.cartography.highlight,
                              map.scenarios.cartography.mutedFeature,
                            ] as ExpressionSpecification)
                          : isSelected
                            ? map.scenarios.cartography.highlight
                            : (activeLayer.paint?.['fill-color'] ??
                              map.scenarios.cartography.mutedFeature),
                    }),
                    'fill-opacity': showAdaptationLayers ? visibleOpacity : 0,
                    'fill-opacity-transition': { duration: map.scenarios.layerFadeDurationMs },
                  }}
                />
              )
            }

            if (source.activation === 'adaptation' && activeLayer.type === 'line') {
              const isSelected = selectedHabitatType === source.selectionKey
              const visibleOpacity = selectedHabitatType
                ? isSelected
                  ? 1
                  : 0.15
                : (activeLayer.paint?.['line-opacity'] ?? 1)
              return (
                <Layer
                  {...activeLayer}
                  key={layer.id}
                  paint={{
                    ...activeLayer.paint,
                    'line-color': isSelected
                      ? map.scenarios.cartography.highlight
                      : (activeLayer.paint?.['line-color'] ?? map.scenarios.cartography.feature),
                    'line-opacity': showAdaptationLayers ? visibleOpacity : 0,
                    'line-opacity-transition': { duration: map.scenarios.layerFadeDurationMs },
                    'line-width': source.preserveLineWidthOnSelection
                      ? (activeLayer.paint?.['line-width'] ?? 2)
                      : isSelected
                        ? 4
                        : (activeLayer.paint?.['line-width'] ?? 2),
                  }}
                />
              )
            }

            if (source.activation === 'adaptation' && activeLayer.type === 'circle') {
              const isSelected = selectedHabitatType === source.selectionKey
              const opacity = !showAdaptationLayers
                ? 0
                : selectedHabitatType && !isSelected
                  ? 0.3
                  : 1
              return (
                <Layer
                  {...activeLayer}
                  key={layer.id}
                  paint={{
                    ...activeLayer.paint,
                    'circle-color': isSelected
                      ? map.scenarios.cartography.highlight
                      : (activeLayer.paint?.['circle-color'] ?? map.scenarios.cartography.feature),
                    'circle-opacity': opacity,
                    'circle-stroke-opacity': opacity,
                    'circle-opacity-transition': { duration: map.scenarios.layerFadeDurationMs },
                    'circle-stroke-opacity-transition': {
                      duration: map.scenarios.layerFadeDurationMs,
                    },
                  }}
                />
              )
            }

            if (isMarkerLayer) {
              const isSelected = selectedHabitatType === source.selectionKey
              return (
                <Layer
                  {...activeLayer}
                  key={layer.id}
                  layout={{
                    ...activeLayer.layout,
                    'icon-image': isSelected
                      ? scenarioMarkerIds.squareSelected
                      : scenarioMarkerIds.square,
                  }}
                  paint={{
                    ...activeLayer.paint,
                    'icon-opacity': !showAdaptationLayers
                      ? 0
                      : selectedHabitatType && !isSelected
                        ? 0.3
                        : 1,
                    'icon-opacity-transition': { duration: map.scenarios.layerFadeDurationMs },
                  }}
                />
              )
            }

            if (selectedHabitatType && source.selectableProperty && activeLayer.type === 'fill') {
              return (
                <Layer
                  {...activeLayer}
                  key={layer.id}
                  paint={{
                    ...activeLayer.paint,
                    'fill-opacity': [
                      'case',
                      ['==', ['get', source.selectableProperty], selectedHabitatType],
                      isPatternLayer ? 0.95 : 0.68,
                      isPatternLayer ? 0.16 : 0.1,
                    ] as ExpressionSpecification,
                  }}
                />
              )
            }

            if (selectedHabitatType && source.selectionKey && activeLayer.type === 'line') {
              const isSelected = selectedHabitatType === source.selectionKey
              return (
                <Layer
                  {...activeLayer}
                  key={layer.id}
                  paint={{
                    ...activeLayer.paint,
                    'line-opacity': isSelected ? 1 : 0.15,
                    'line-width': isSelected ? 4 : 2,
                  }}
                />
              )
            }

            return <Layer key={layer.id} {...activeLayer} />
          })}
        </Source>
      ))}
    </>
  )
}
