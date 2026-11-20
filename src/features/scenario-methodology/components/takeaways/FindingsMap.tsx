import { Box, ButtonBase, Typography } from '@mui/material'
import type { FeatureCollection, LineString } from 'geojson'
import { Layer, Marker, NavigationControl, Source } from 'react-map-gl/mapbox'
import { teamName } from '@/content/names'
import BaseMap from '@/map/BaseMap'
import { EVALUATION_TAKEAWAYS_BOUNDS, EVALUATION_TAKEAWAYS_PADDING } from '@/map/cameras'
import { SALINITY_MAP_STYLE } from '@/map/mapStyles'
import Camera from '@/map/scenarios/Camera'
import Layers from '@/map/scenarios/Layers'
import Legend from '@/map/scenarios/Legend'
import SalinitySnapshot from '@/map/scenarios/SalinitySnapshot'
import { getConfig, layersBySlug } from '@/map/scenarios/config'
import { chart } from '@/theme'
import { TeamIcon } from '@/ui'
import { focusRing } from '@/ui/focusRing'
import type { Finding } from './findings'

const PIN_SIZE = 34
const ICON_SIZE = 20
/** Room above the Delta for the scenario's legend, as on its story map. */
const LEGEND_CLEARANCE = 96

/** The dashed line from where a shift starts to where it ends, in the team's color. */
function shiftLines(findings: Finding[]): FeatureCollection<LineString, { color: string }> {
  return {
    type: 'FeatureCollection',
    features: findings
      .filter((finding) => finding.shift && finding.pins.length > 1)
      .map((finding) => ({
        type: 'Feature',
        properties: { color: chart.voting.team[finding.team] },
        geometry: { type: 'LineString', coordinates: finding.pins },
      })),
  }
}

/**
 * The scenario's story map (its style, its own features and their legend), framed on the
 * whole Delta, with each finding's pins on top: always the team's icon, in the team's color.
 */
export default function FindingsMap({
  scenarioSlug,
  findings,
  selectedId,
  onSelect,
}: {
  scenarioSlug: string
  findings: Finding[]
  selectedId: string | undefined
  onSelect: (id: string) => void
}) {
  const config = getConfig(scenarioSlug)
  const hasLegend = (layersBySlug[scenarioSlug] ?? []).some((source) => source.legend)
  const selected = findings.find((finding) => finding.id === selectedId)

  return (
    <Box
      sx={{
        position: 'relative',
        height: 1,
        '& .mapboxgl-ctrl-bottom-left': { display: 'none' },
      }}
    >
      {/* One map per scenario: its style and patterns load fresh with it. */}
      <BaseMap
        key={scenarioSlug}
        initialViewState={config.initialViewState}
        mapStyleUrl={config.mapStyleUrl ?? SALINITY_MAP_STYLE}
        maxBounds={config.maxBounds}
        dragRotate={false}
        scrollZoom={false}
        touchPitch={false}
      >
        <Camera
          bounds={EVALUATION_TAKEAWAYS_BOUNDS}
          topClearance={hasLegend ? LEGEND_CLEARANCE : EVALUATION_TAKEAWAYS_PADDING}
          padding={EVALUATION_TAKEAWAYS_PADDING}
        />
        {config.salinitySnapshotFrame != null && (
          <SalinitySnapshot frame={config.salinitySnapshotFrame} />
        )}
        <Layers scenarioSlug={scenarioSlug} showAdaptationLayers />

        <Source id="takeaway-shifts" type="geojson" data={shiftLines(findings)}>
          <Layer
            id="takeaway-shift-lines"
            type="line"
            layout={{ 'line-cap': 'round' }}
            paint={{
              'line-color': ['get', 'color'],
              'line-width': 2.5,
              'line-dasharray': [2, 2],
            }}
          />
        </Source>

        {/* Every place a finding names: the team's icon on its color. */}
        {findings.flatMap((finding) =>
          finding.pins.map(([longitude, latitude], index) => {
            const isSelected = finding.id === selectedId
            return (
              <Marker
                key={`${finding.id}-${index}`}
                longitude={longitude}
                latitude={latitude}
                style={{ zIndex: isSelected ? 2 : 1 }}
              >
                <ButtonBase
                  aria-label={`${teamName(finding.team)}: ${finding.place}`}
                  aria-pressed={isSelected}
                  onClick={() => onSelect(finding.id)}
                  sx={{
                    width: PIN_SIZE,
                    height: PIN_SIZE,
                    borderRadius: '50%',
                    bgcolor: chart.voting.team[finding.team],
                    color: 'base.900',
                    border: 2,
                    borderColor: 'base.900',
                    boxShadow: (theme) =>
                      isSelected
                        ? `0 0 0 3px ${theme.palette.common.white}`
                        : `0 2px 6px ${theme.palette.translucent.cardShadow}`,
                    transition: 'transform 160ms ease',
                    '&:hover': { transform: 'scale(1.1)' },
                    '&.Mui-focusVisible': focusRing,
                    '@media (prefers-reduced-motion: reduce)': {
                      transition: 'none',
                      '&:hover': { transform: 'none' },
                    },
                  }}
                >
                  <TeamIcon team={finding.team} size={ICON_SIZE} />
                </ButtonBase>
              </Marker>
            )
          }),
        )}

        {/* The chosen finding's name beside its first pin. */}
        {selected && (
          <Marker
            longitude={selected.pins[0][0]}
            latitude={selected.pins[0][1]}
            anchor="left"
            offset={[PIN_SIZE / 2 + 8, 0]}
            style={{ zIndex: 3, pointerEvents: 'none' }}
          >
            <Box aria-hidden sx={{ px: 1, py: 0.5, bgcolor: 'common.white', borderRadius: 0.5 }}>
              <Typography
                variant="captionSmall"
                component="span"
                sx={{ display: 'block', color: 'base.900', whiteSpace: 'nowrap' }}
              >
                {selected.place}
              </Typography>
            </Box>
          </Marker>
        )}

        <NavigationControl position="bottom-right" showCompass={false} />
      </BaseMap>

      <Legend scenarioSlug={scenarioSlug} />
    </Box>
  )
}
