import type { ExpressionSpecification } from 'mapbox-gl'
import { Layer, Source } from 'react-map-gl/mapbox'
import type { LayerProps } from 'react-map-gl/mapbox'
import { map } from '../../../theme'
import { isOfflineMapEnabled } from '../../offlineBasemapStyle'
import { layersBySlug, type MapScope } from './config'

interface LayersProps {
  scenarioSlug: string
  showAdaptationLayers?: boolean
  selectedHabitatType?: string | null
  visibilityScope?: MapScope
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
}: LayersProps) {
  const offline = isOfflineMapEnabled()
  const sources = (layersBySlug[scenarioSlug] ?? []).filter((source) => {
    if (offline && source.url?.startsWith('mapbox://') && !source.offlineData) return false
    const sourceScope = source.visibilityScope ?? 'delta'
    if (visibilityScope === 'statewide-ecocultural') {
      return sourceScope === 'statewide-ecocultural'
    }
    return sourceScope === visibilityScope
  })

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

            if (source.activation === 'adaptation' && activeLayer.type === 'fill') {
              const isSelected = selectedHabitatType === source.selectionKey
              const visibleOpacity =
                selectedHabitatType && source.selectableProperty
                  ? ([
                      'case',
                      ['==', ['get', source.selectableProperty], selectedHabitatType],
                      0.95,
                      0.12,
                    ] as ExpressionSpecification)
                  : selectedHabitatType && source.selectionKey
                    ? isSelected
                      ? 0.85
                      : 0.1
                    : (activeLayer.paint?.['fill-opacity'] ?? 1)

              return (
                <Layer
                  {...activeLayer}
                  key={layer.id}
                  paint={{
                    ...activeLayer.paint,
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
                    'line-opacity': showAdaptationLayers ? visibleOpacity : 0,
                    'line-opacity-transition': { duration: map.scenarios.layerFadeDurationMs },
                    'line-width': isSelected ? 4 : 2,
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
                      0.95,
                      0.12,
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
