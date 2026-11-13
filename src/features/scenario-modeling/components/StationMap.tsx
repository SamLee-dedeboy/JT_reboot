import { Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { csvParse } from 'd3'
import type { FeatureCollection, Point } from 'geojson'
import { useEffect, useState } from 'react'
import { Layer, Source } from 'react-map-gl/mapbox'
import BaseMap from '@/map/BaseMap'
import Camera from '@/map/scenarios/Camera'
import { assetUrl } from '@/utils/baseUrl'
import { DELTA_START_VIEW, MODELING_CAMERAS } from '@/map/cameras'
import { SALINITY_MAP_STYLE } from '@/map/mapStyles'
import { type StationModel } from '@/content/modeling'
import MapLabel from './MapLabel'

const GOLDEN_GATE = { longitude: -122.478, latitude: 37.82 }

/** One model's output stations, on a map framed from the Golden Gate boundary to the Delta. */
export default function StationMap({ model }: { model: StationModel }) {
  const theme = useTheme()
  const [stations, setStations] = useState<FeatureCollection<Point> | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller
    const request: Promise<FeatureCollection<Point>> =
      model === 'rma'
        ? fetch(assetUrl('/data/salinity/scenario-explorer/all_386_unique_stations.csv'), {
            signal,
          })
            .then((response) => response.text())
            .then((text) => ({
              type: 'FeatureCollection',
              features: csvParse(text).map((row) => ({
                type: 'Feature',
                properties: {},
                geometry: {
                  type: 'Point',
                  coordinates: [Number(row.longitude), Number(row.latitude)],
                },
              })),
            }))
        : fetch(assetUrl('/data/geospatial-assets/shared/schism-modeled-stations-405.geojson'), {
            signal,
          }).then((response) => response.json() as Promise<FeatureCollection<Point>>)
    request.then(setStations).catch((reason: unknown) => {
      if (reason instanceof DOMException && reason.name === 'AbortError') return
      setStations(null)
    })
    return () => controller.abort()
  }, [model])

  return (
    <Box
      role="img"
      aria-label={
        model === 'rma'
          ? 'Map of the San Francisco Bay and Delta showing the 386 RMA stations and the Golden Gate salinity boundary.'
          : 'Map of the San Francisco Bay and Delta showing the SCHISM stations, a different set from the RMA stations.'
      }
      sx={{
        position: 'relative',
        height: 400,
        overflow: 'hidden',
        border: 1,
        borderColor: 'border.default',
        bgcolor: 'base.900',
        '& .mapboxgl-ctrl-bottom-left': { display: 'none' },
      }}
    >
      <BaseMap
        mapStyleUrl={SALINITY_MAP_STYLE}
        initialViewState={DELTA_START_VIEW}
        interactive={false}
        attributionControl={false}
      >
        <Camera bounds={MODELING_CAMERAS.stationMap} />
        {stations && (
          <Source id="modeling-stations" type="geojson" data={stations}>
            <Layer
              id="modeling-stations-points"
              type="circle"
              paint={{
                'circle-radius': 2.5,
                'circle-color': theme.palette.common.white,
                'circle-opacity': 0.85,
              }}
            />
          </Source>
        )}
        {model === 'rma' && (
          <MapLabel {...GOLDEN_GATE} text="Golden Gate salinity boundary" added />
        )}
      </BaseMap>
    </Box>
  )
}
