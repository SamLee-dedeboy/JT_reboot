import type { ExpressionSpecification } from 'mapbox-gl'
import { Layer, Source } from 'react-map-gl/mapbox'
import { map } from '../../theme'
import { scenarioMapLayersBySlug } from './scenarioLayerConfig'

interface ScenarioMapLayersProps {
  scenarioSlug: string
  showAdaptationLayers?: boolean
  selectedHabitatType?: string | null
  visibilityScope?: 'delta' | 'statewide' | 'statewide-ecocultural'
}

export default function ScenarioMapLayers({
  scenarioSlug,
  showAdaptationLayers = false,
  selectedHabitatType,
  visibilityScope = 'delta',
}: ScenarioMapLayersProps) {
  const sources = (scenarioMapLayersBySlug[scenarioSlug] ?? []).filter((source) => {
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
          type={source.type}
          {...(source.url == null ? {} : { url: source.url })}
          {...(source.data == null ? {} : { data: source.data })}
          {...(source.tileSize == null ? {} : { tileSize: source.tileSize })}
        >
          {source.layers.map((layer) => {
            if (source.activation === 'adaptation' && layer.type === 'fill') {
              const visibleOpacity =
                selectedHabitatType && source.selectableProperty
                  ? ([
                      'case',
                      ['==', ['get', source.selectableProperty], selectedHabitatType],
                      0.95,
                      0.12,
                    ] as ExpressionSpecification)
                  : (layer.paint?.['fill-opacity'] ?? 1)

              return (
                <Layer
                  {...layer}
                  key={layer.id}
                  paint={{
                    ...layer.paint,
                    'fill-opacity': showAdaptationLayers ? visibleOpacity : 0,
                    'fill-opacity-transition': { duration: map.scenarios.layerFadeDurationMs },
                  }}
                />
              )
            }

            if (source.activation === 'adaptation' && layer.type === 'line') {
              const isSelected = selectedHabitatType === source.selectionKey
              const visibleOpacity = selectedHabitatType
                ? isSelected
                  ? 1
                  : 0.15
                : (layer.paint?.['line-opacity'] ?? 1)
              return (
                <Layer
                  {...layer}
                  key={layer.id}
                  paint={{
                    ...layer.paint,
                    'line-opacity': showAdaptationLayers ? visibleOpacity : 0,
                    'line-opacity-transition': { duration: map.scenarios.layerFadeDurationMs },
                    'line-width': isSelected ? 4 : 2,
                  }}
                />
              )
            }

            if (selectedHabitatType && source.selectableProperty && layer.type === 'fill') {
              return (
                <Layer
                  {...layer}
                  key={layer.id}
                  paint={{
                    ...layer.paint,
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

            if (selectedHabitatType && source.selectionKey && layer.type === 'line') {
              const isSelected = selectedHabitatType === source.selectionKey
              return (
                <Layer
                  {...layer}
                  key={layer.id}
                  paint={{
                    ...layer.paint,
                    'line-opacity': isSelected ? 1 : 0.15,
                    'line-width': isSelected ? 4 : 2,
                  }}
                />
              )
            }

            return <Layer key={layer.id} {...layer} />
          })}
        </Source>
      ))}
    </>
  )
}
