import { useState } from 'react'
import { Box, Typography } from '@mui/material'
import { motion } from 'framer-motion'
import MapboxMap from 'react-map-gl/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'
import { MAPBOX_TOKEN, MAP_STYLE, REFERENCE_BOUNDS } from './mapConfig'
import MapLoader from './MapLoader'
import ComparisonMarkerLayer from './ComparisonMarkerLayer'
//import PlaceMarkerLayer from './PlaceMarkerLayer'
import StationLayer from './StationLayer'
import { registerPolygonPatterns } from './polygonPatterns'
import './map.css'
import type { ComparisonFilter, RegionalScenario, SelectedRegionTimeline } from '../../types'

interface ArtworkMapProps {
  showStations: boolean
  scenario: RegionalScenario
  comparisonFilter: ComparisonFilter
  focusedReportId: string | null
  onSelectedRegionChange: (region: SelectedRegionTimeline | null) => void
}

function ArtworkMap({
  showStations,
  scenario,
  comparisonFilter,
  focusedReportId,
  onSelectedRegionChange,
}: ArtworkMapProps) {
  const [mapLoaded, setMapLoaded] = useState(false)
  const [highlightedSubarea, setHighlightedSubarea] = useState<string | null>(null)

  return (
    <motion.div
      className="map-shell"
      data-tour="regional-map"
      initial={{ opacity: 0, scale: 0.985 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <MapboxMap
        mapboxAccessToken={MAPBOX_TOKEN}
        initialViewState={{
          bounds: REFERENCE_BOUNDS,
          fitBoundsOptions: {
            padding: 0,
          },
        }}
        mapStyle={MAP_STYLE}
        onLoad={(event) => {
          registerPolygonPatterns(event.target)
          setMapLoaded(true)
        }}
        reuseMaps
        dragPan
        scrollZoom
        touchZoomRotate
        doubleClickZoom
        keyboard
      >
        {/*patternsReady && <RegionOfInterestLayer />*/}
        {showStations && <StationLayer highlightedSubarea={highlightedSubarea} />}
        {/*mapLoaded && <PlaceMarkerLayer /> */}
        {mapLoaded && (
          <ComparisonMarkerLayer
            scenario={scenario}
            filter={comparisonFilter}
            focusedReportId={focusedReportId}
            onHoveredPlaceChange={setHighlightedSubarea}
            onSelectedRegionChange={onSelectedRegionChange}
          />
        )}
      </MapboxMap>
      <Box
        aria-label="Map marker legend"
        role="group"
        sx={(theme) => ({
          bgcolor: 'base.800',
          border: 1,
          borderColor: 'divider',
          borderRadius: 1,
          display: 'grid',
          gap: theme.jtSpacing.gap.xs,
          p: theme.jtSpacing.component.sm,
          position: 'absolute',
          right: theme.jtSpacing.component.md,
          top: theme.jtSpacing.component.md,
          zIndex: 5,
        })}
      >
        <Typography variant="captionSmall" sx={{ color: 'base.50', fontWeight: 700 }}>
          Report markers
        </Typography>
        <Box
          sx={(theme) => ({
            alignItems: 'center',
            display: 'grid',
            gap: theme.jtSpacing.gap.xs,
            gridTemplateColumns: 'auto 1fr',
          })}
        >
          <Box
            aria-hidden
            sx={{
              bgcolor: 'base.800',
              border: 2,
              borderColor: 'brand.primaryGreen',
              borderRadius: '50%',
              height: 18,
              width: 18,
            }}
          />
          <Typography variant="captionSmall" sx={{ color: 'base.100' }}>
            Qualifying reports
          </Typography>
          <Box
            aria-hidden
            sx={{
              bgcolor: 'brand.primaryGreen',
              border: 2,
              borderColor: 'brand.primaryGreen',
              borderRadius: '50%',
              height: 18,
              width: 18,
            }}
          />
          <Typography variant="captionSmall" sx={{ color: 'base.100' }}>
            Includes strongest signal
          </Typography>
        </Box>
      </Box>
      <MapLoader isLoaded={mapLoaded} onExitComplete={() => undefined} />
    </motion.div>
  )
}

export default ArtworkMap
