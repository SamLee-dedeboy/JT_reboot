import { useRef, type ReactNode } from 'react'
import { Box } from '@mui/material'
import type { Map as MapboxMap } from 'mapbox-gl'
import Map, { type MapMouseEvent, type MapProps, type MapRef } from 'react-map-gl/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'
import { DELTA_MAP_STYLE, fillParentStyle, type MapViewState } from './mapCameraView'

type BaseMapProps = Omit<
  MapProps,
  | 'children'
  | 'initialViewState'
  | 'mapboxAccessToken'
  | 'mapStyle'
  | 'onLoad'
  | 'onStyleData'
  | 'style'
> & {
  children?: ReactNode
  initialViewState?: MapViewState
  mapStyle?: MapProps['mapStyle']
  mapStyleUrl?: string
  onMapReady?: (map: MapboxMap) => void
  onMapStyleData?: (map: MapboxMap) => void
  style?: MapProps['style']
}

const tokenFallbackSx = {
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'common.white',
  typography: 'body2',
} as const

export type { MapMouseEvent }

export default function BaseMap({
  children,
  initialViewState,
  mapStyle,
  mapStyleUrl = DELTA_MAP_STYLE,
  onMapReady,
  onMapStyleData,
  style = fillParentStyle,
  ...mapProps
}: BaseMapProps) {
  const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN
  const mapRef = useRef<MapRef | null>(null)
  const resolvedMapStyle = mapStyle ?? mapStyleUrl
  const usesRemoteMapboxStyle =
    typeof resolvedMapStyle === 'string' && resolvedMapStyle.startsWith('mapbox://')

  if (usesRemoteMapboxStyle && !mapboxToken) {
    return <Box sx={tokenFallbackSx}>Add VITE_MAPBOX_TOKEN to render the map.</Box>
  }

  return (
    <Map
      {...mapProps}
      ref={mapRef}
      initialViewState={initialViewState}
      mapStyle={resolvedMapStyle}
      mapboxAccessToken={mapboxToken || undefined}
      style={style}
      onLoad={(event) => onMapReady?.(event.target as MapboxMap)}
      onStyleData={() => {
        const map = mapRef.current?.getMap()
        if (map) onMapStyleData?.(map)
      }}
    >
      {children}
    </Map>
  )
}
