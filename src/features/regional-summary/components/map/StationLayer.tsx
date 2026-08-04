import { Layer, Source } from 'react-map-gl/mapbox'
import { palette } from '../../../../theme/muiTheme'

const STATION_DATA_URL = `${import.meta.env.BASE_URL}data/regional-summary/rma-stations.geojson`

interface StationLayerProps {
  highlightedSubarea: string | null
}

function StationLayer({ highlightedSubarea }: StationLayerProps) {
  return (
    <Source id="rma-stations" type="geojson" data={STATION_DATA_URL}>
      <Layer
        id="rma-station-points"
        type="circle"
        paint={{
          'circle-color': palette.base[200],
          'circle-opacity': 0.88,
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 5, 1.75, 9, 4.5, 13, 7],
          'circle-stroke-color': palette.base[700],
          'circle-stroke-opacity': 0.72,
          'circle-stroke-width': 0.5,
        }}
      />
      <Layer
        id="rma-station-points-highlighted"
        type="circle"
        filter={['==', ['get', 'geographicSubarea'], highlightedSubarea ?? '']}
        paint={{
          'circle-color': palette.brand.primaryGreen,
          'circle-opacity': 1,
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 5, 4, 9, 7, 13, 10],
          'circle-stroke-color': palette.base[900],
          'circle-stroke-opacity': 1,
          'circle-stroke-width': 1.5,
        }}
      />
      <Layer
        id="rma-station-indices"
        type="symbol"
        minzoom={7}
        layout={{
          'text-anchor': 'left',
          'text-field': ['get', 'stationNumber'],
          'text-offset': [0.75, 0],
          'text-optional': true,
          'text-size': 14.4,
        }}
        paint={{
          'text-color': [
            'case',
            ['==', ['get', 'geographicSubarea'], highlightedSubarea ?? ''],
            palette.brand.primaryGreen,
            palette.base[100],
          ],
          'text-halo-color': [
            'case',
            ['==', ['get', 'geographicSubarea'], highlightedSubarea ?? ''],
            palette.base[900],
            palette.base[900],
          ],
          'text-halo-width': [
            'case',
            ['==', ['get', 'geographicSubarea'], highlightedSubarea ?? ''],
            2,
            1.5,
          ],
          'text-opacity': 0.95,
        }}
      />
    </Source>
  )
}

export default StationLayer
