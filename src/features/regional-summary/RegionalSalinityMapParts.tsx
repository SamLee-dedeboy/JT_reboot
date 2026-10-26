import CloseIcon from '@mui/icons-material/Close'
import { Box, IconButton, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import type { ReactNode } from 'react'
import { Layer, Marker, Popup, Source, type LayerProps } from 'react-map-gl/mapbox'
import RegionalPlaceMarker from './RegionalPlaceMarker'
import { getRegionalPlaceContent, type RegionalTextHighlight } from './regionalPlaceContent'
import { regionalPatternIds } from './regionalPolygonPatterns'
import {
  regionalMapLayerId,
  regionalTimingSummary,
  regionalTrendColor,
} from './regionalSalinityMap'
import type { RegionalPlace } from './regionalSummaryData'
import { regionalMapScales, type RegionalMapScale } from './regionalSummaryStyles'

/* Map components shared by the kiosk explorer and the scenario results page. */

/** Region polygons (wash, noise or stripe texture, outline) and their pins. */
export function RegionalPlaceLayers({
  places,
  selectedPlaceId,
  patternsReady,
  scale,
  onSelectPlace,
}: {
  places: RegionalPlace[]
  selectedPlaceId: string | null
  patternsReady: boolean
  scale: RegionalMapScale
  onSelectPlace: (place: RegionalPlace) => void
}) {
  const theme = useTheme()
  return (
    <>
      {places.map((region) => {
        if (!region.geometry) return null
        const selected = selectedPlaceId === region.id
        const color = regionalTrendColor(theme, region.trend)
        const polygonColor = region.trend === 'flipping' ? theme.palette.base[900] : color
        const feature = {
          type: 'Feature' as const,
          properties: { id: region.id, trend: region.trend },
          geometry: region.geometry,
        }
        const stableId = regionalMapLayerId(region.id)
        const fillLayer: LayerProps = {
          id: `regional-fill-${stableId}`,
          type: 'fill',
          paint: {
            'fill-color': polygonColor,
            'fill-opacity': selected ? 0.7 : 0.4,
          },
        }
        const patternLayer: LayerProps = {
          id: `regional-pattern-${stableId}`,
          type: 'fill',
          paint: {
            'fill-pattern': regionalPatternIds[region.trend],
            'fill-opacity': selected ? 1 : 0.76,
          },
        }
        const lineLayer: LayerProps = {
          id: `regional-line-${stableId}`,
          type: 'line',
          paint: {
            'line-color': color,
            'line-width': selected ? 4 : 2,
            'line-opacity': 0,
          },
        }
        return (
          <Source
            key={`geometry-${region.id}`}
            id={`regional-source-${stableId}`}
            type="geojson"
            data={feature}
          >
            <Layer {...fillLayer} />
            {patternsReady ? <Layer {...patternLayer} /> : null}
            {region.trend !== 'flipping' ? <Layer {...lineLayer} /> : null}
          </Source>
        )
      })}
      {places.map((region, index) => (
        <Marker
          key={region.id}
          longitude={region.coordinates[0]}
          latitude={region.coordinates[1]}
          anchor="bottom-left"
          offset={regionalMapScales[scale].markerOffset}
        >
          <RegionalPlaceMarker
            color={regionalTrendColor(theme, region.trend)}
            secondaryColor={region.trend === 'flipping' ? theme.palette.salinity.teal : undefined}
            index={index}
            name={region.name}
            selected={selectedPlaceId === region.id}
            onSelect={() => onSelectPlace(region)}
            scale={scale}
          />
        </Marker>
      ))}
    </>
  )
}

/** Selected-place card: region title, Why this place, and Key takeaway beside the pin. */
export function RegionalPlacePreview({
  scenarioSlug,
  place,
  scale,
  onClose,
  action,
}: {
  scenarioSlug: string
  place: RegionalPlace
  scale: RegionalMapScale
  onClose: () => void
  action?: ReactNode
}) {
  const theme = useTheme()
  const sizing = regionalMapScales[scale]
  const content = getRegionalPlaceContent(scenarioSlug, place)
  const accent = place.trend === 'saltier' ? 'salinity.pink' : 'salinity.teal'

  const editorialColor = (highlight?: RegionalTextHighlight) => {
    if (highlight === 'saltier') return theme.palette.salinity.pink
    if (highlight === 'fresher') return theme.palette.salinity.teal
    if (highlight === 'primary') return theme.palette.primary.main
    if (highlight === 'white') return theme.palette.common.white
    return theme.palette.base[100]
  }

  return (
    <Popup
      key={`${place.id}-${content.cardSide}`}
      longitude={place.coordinates[0]}
      latitude={place.coordinates[1]}
      anchor={content.cardSide === 'left' ? 'right' : 'left'}
      offset={sizing.previewMarkerOffset}
      closeButton={false}
      closeOnClick={false}
      focusAfterOpen={false}
      maxWidth="none"
      className="regional-summary-preview-popup"
    >
      <Box
        aria-live="polite"
        sx={{
          p: sizing.previewPadding,
          display: 'grid',
          gap: sizing.previewGap,
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) auto',
            alignItems: 'center',
            gap: scale === 'web' ? 1 : 2,
          }}
        >
          <Typography
            component={scale === 'web' ? 'h4' : 'h2'}
            sx={{
              ...sizing.previewTitle,
              pl: sizing.previewPadding,
              whiteSpace: 'nowrap',
              color: accent,
            }}
          >
            {place.name}
          </Typography>
          <IconButton
            aria-label="Close regional pattern summary"
            onClick={onClose}
            sx={{
              width: sizing.compactTouchTarget,
              height: sizing.compactTouchTarget,
              color: accent,
              '& .MuiSvgIcon-root': {
                fontSize: sizing.controlIconSize,
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Box
          sx={{
            width: sizing.previewWidth,
            px: sizing.previewPadding,
            boxSizing: 'border-box',
          }}
        >
          <Typography sx={{ ...sizing.previewEyebrow, color: 'common.white' }}>
            Why this place
          </Typography>
          <Typography sx={{ ...sizing.previewBody, color: 'base.100', mt: sizing.previewBodyGap }}>
            {content.whyThisPlace}
          </Typography>
        </Box>

        <Box
          sx={{
            width: sizing.previewWidth,
            p: sizing.previewPadding,
            boxSizing: 'border-box',
            border: 2,
            borderColor: accent,
            borderRadius: sizing.previewFrameRadius,
          }}
        >
          <Typography sx={{ ...sizing.previewEyebrow, color: 'common.white' }}>
            Key takeaway
          </Typography>
          <Typography sx={{ ...sizing.previewBody, color: 'base.100', mt: sizing.previewBodyGap }}>
            {content.keyTakeaway?.map((segment, index) => (
              <Box
                component="span"
                key={`${segment.text}-${index}`}
                sx={{
                  color: editorialColor(segment.highlight),
                  fontWeight: segment.strong ? 800 : 400,
                }}
              >
                {segment.text}
              </Box>
            )) ?? (
              <Box
                component="span"
                sx={{ color: regionalTrendColor(theme, place.trend), fontWeight: 800 }}
              >
                {regionalTimingSummary(place)}
              </Box>
            )}
          </Typography>
        </Box>
        {action}
      </Box>
    </Popup>
  )
}
