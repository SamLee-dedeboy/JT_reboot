import { Box, Typography } from '@mui/material'
import { Marker } from 'react-map-gl/mapbox'

export type MapLabelData = {
  text: string
  longitude: number
  latitude: number
  side?: 'left' | 'right'
  /** Marks a place added by this scenario, in green. */
  added?: boolean
  /** Leaves out the dot where the map already draws the feature. */
  bare?: boolean
  /** Extra space between the place and its label, in pixels. */
  offset?: number
}

/** A place named directly on a map, in place of a legend. */
export default function MapLabel({
  text,
  longitude,
  latitude,
  side = 'left',
  added,
  bare,
  offset = 0,
}: MapLabelData) {
  return (
    <Marker longitude={longitude} latitude={latitude} anchor={side}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: side === 'left' ? 'row' : 'row-reverse',
          alignItems: 'center',
          gap: 0.75,
        }}
      >
        {!bare && (
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              bgcolor: added ? 'primary.main' : 'common.white',
              ...(side === 'left' ? { ml: -0.75 } : { mr: -0.75 }),
            }}
          />
        )}
        <Typography
          variant="meta"
          sx={{
            px: 1,
            py: 0.5,
            bgcolor: 'translucent.800',
            color: 'common.white',
            // Long names wrap on phones, where they would otherwise run off the map.
            display: 'block',
            maxWidth: { xs: 84, md: 'none' },
            whiteSpace: { md: 'nowrap' },
            ...(side === 'left' ? { ml: `${offset}px` } : { mr: `${offset}px` }),
          }}
        >
          {text}
        </Typography>
      </Box>
    </Marker>
  )
}
