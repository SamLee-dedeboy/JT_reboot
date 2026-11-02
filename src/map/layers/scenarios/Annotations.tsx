import { Typography } from '@mui/material'
import { Marker } from 'react-map-gl/mapbox'
import type { MapAnnotations } from './config'

export default function Annotations({ labels }: MapAnnotations) {
  return (
    <>
      {/* Names the features directly on the map, in place of a legend. */}
      {labels.map(({ text, coordinates: [longitude, latitude], anchor, solid }) => (
        <Marker key={text} longitude={longitude} latitude={latitude} anchor={anchor}>
          <Typography
            variant="captionSmall"
            component="span"
            sx={{
              display: 'block',
              px: 1,
              py: 0.5,
              color: solid ? 'base.900' : 'common.white',
              bgcolor: solid ? 'common.white' : 'translucent.800',
              whiteSpace: 'nowrap',
            }}
          >
            {text}
          </Typography>
        </Marker>
      ))}
    </>
  )
}
