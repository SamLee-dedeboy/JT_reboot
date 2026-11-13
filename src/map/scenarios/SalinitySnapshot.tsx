// One frame of the home hero's salinity data, held still, for scenario maps whose config asks
// for it. It sits under the basemap labels, so scenario layers and annotations stay on top.
import { useEffect, useState } from 'react'
import { Layer, Source, useMap } from 'react-map-gl/mapbox'
import { HERO_SALINITY_SOURCE_LAYER, getSalinityPairForFrame } from '../hero/heroSalinityFrames'
import { SALINITY_ACTIVE_OPACITY } from '../hero/heroSalinityAnimation'

export default function SalinitySnapshot({ frame }: { frame: number }) {
  const { current: mapRef } = useMap()
  const mapboxMap = mapRef?.getMap()
  const [styleReady, setStyleReady] = useState(false)
  const [firstLabelLayerId, setFirstLabelLayerId] = useState<string>()

  useEffect(() => {
    if (!mapboxMap) return
    // getStyle throws until the style has parsed. isStyleLoaded is no use here: it stays false
    // while any source is still fetching, which would hold this layer back for seconds.
    const handleStyleChange = () => {
      let layers
      try {
        layers = mapboxMap.getStyle()?.layers
      } catch {
        return
      }
      setFirstLabelLayerId(layers?.find((layer) => layer.type === 'symbol')?.id)
      setStyleReady(true)
      mapboxMap.off('styledata', handleStyleChange)
      mapboxMap.off('idle', handleStyleChange)
    }

    mapboxMap.on('styledata', handleStyleChange)
    mapboxMap.on('idle', handleStyleChange)
    handleStyleChange()
    return () => {
      mapboxMap.off('styledata', handleStyleChange)
      mapboxMap.off('idle', handleStyleChange)
    }
  }, [mapboxMap])

  if (!styleReady) return null

  const pair = getSalinityPairForFrame(frame)

  return (
    <Source id={pair.sourceId} type="vector" url={pair.tilesetUrl}>
      <Layer
        id={pair.layerId}
        beforeId={firstLabelLayerId}
        type="fill"
        source={pair.sourceId}
        source-layer={HERO_SALINITY_SOURCE_LAYER}
        filter={['==', ['get', 'frame'], frame]}
        paint={{
          'fill-color': ['get', 'color'],
          'fill-opacity': SALINITY_ACTIVE_OPACITY,
          'fill-antialias': true,
        }}
      />
    </Source>
  )
}
