import { Layer, Source } from 'react-map-gl/mapbox'
import { palette } from '../../../../theme/index'
import { NOISE_PATTERN_ID } from './polygonPatterns'

const REGION_DATA_URL = `${import.meta.env.BASE_URL}data/regional-summary/region_of_interest_artwork.geojson`

/** San Pablo Bay, Suisun Bay, and Franks Tract artwork boundaries. */
function RegionOfInterestLayer() {
  return (
    <Source id="regions-of-interest" type="geojson" data={REGION_DATA_URL}>
      <Layer
        id="region-of-interest-base-fill"
        type="fill"
        paint={{
          'fill-color': palette.brand.primaryPink,
          'fill-opacity': 0.14,
        }}
      />
      <Layer
        id="region-of-interest-noise-fill"
        type="fill"
        paint={{
          'fill-pattern': NOISE_PATTERN_ID,
          'fill-opacity': 1,
        }}
      />
      <Layer
        id="region-of-interest-outline"
        type="line"
        paint={{
          'line-color': palette.brand.primaryPink,
          'line-opacity': 0.95,
          'line-width': 1.5,
        }}
      />
    </Source>
  )
}

export default RegionOfInterestLayer
