import type { ExpressionSpecification } from 'mapbox-gl'
import { Layer, Source } from 'react-map-gl/mapbox'
import { scenarioMapLayersBySlug } from './scenarioLayerConfig'

interface ScenarioMapLayersProps {
  scenarioSlug: string
  selectedHabitatType?: string | null
  visibilityScope?: 'delta' | 'statewide' | 'statewide-ecocultural'
}

export default function ScenarioMapLayers({
  scenarioSlug,
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
        <Source key={source.id} id={source.id} type={source.type} url={source.url}>
          {source.layers.map((layer) => {
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
