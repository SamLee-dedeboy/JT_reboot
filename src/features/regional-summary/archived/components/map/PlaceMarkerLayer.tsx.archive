import AgricultureIcon from '@mui/icons-material/Agriculture'
import CallMergeIcon from '@mui/icons-material/CallMerge'
import MapIcon from '@mui/icons-material/Map'
import ParkIcon from '@mui/icons-material/Park'
import PlaceIcon from '@mui/icons-material/Place'
import WaterIcon from '@mui/icons-material/Water'
import type { SvgIconComponent } from '@mui/icons-material'
import { Marker } from 'react-map-gl/mapbox'
import { PLACES, type PlaceIconKey } from './placeData'
import PlaceMarker from './place-marker/PlaceMarker'

const PLACE_ICONS: Record<PlaceIconKey, SvgIconComponent> = {
  agriculture: AgricultureIcon,
  confluence: CallMergeIcon,
  map: MapIcon,
  park: ParkIcon,
  place: PlaceIcon,
  water: WaterIcon,
}

function PlaceMarkerLayer() {
  return (
    <>
      {PLACES.map((place) => {
        const Icon = PLACE_ICONS[place.icon]
        const [longitude, latitude] = place.coordinates

        return (
          <Marker
            key={place.id}
            anchor="bottom-left"
            latitude={latitude}
            longitude={longitude}
            offset={[-23, 0]}
          >
            <PlaceMarker
              color={place.color}
              description={place.description}
              icon={Icon}
              placeName={place.name}
              takeaway={place.takeaway}
            />
          </Marker>
        )
      })}
    </>
  )
}

export default PlaceMarkerLayer
