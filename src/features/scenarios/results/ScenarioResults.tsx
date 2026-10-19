import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { Box, Button, ButtonBase, Stack, Tab, Tabs, Typography } from '@mui/material'
import { alpha, type Theme, useTheme } from '@mui/material/styles'
import { useState } from 'react'
import { Layer, Marker, Source } from 'react-map-gl/mapbox'
import type { LayerProps } from 'react-map-gl/mapbox'
import { Link } from 'react-router-dom'
import BaseMap from '../../../map/BaseMap'
import { chart, jtSpacing } from '../../../theme'
import { evaluationTeams } from '../content'
import RegionalPlaceMarker from '../../regional-summary/RegionalPlaceMarker'
import { useRegionalPlaces } from '../../regional-summary/regionalSummaryData'

const regionalMapStyle = 'mapbox://styles/justtransition/cmreic454000z01sle8uh6v7n'
const regionalOverview = { longitude: -121.73, latitude: 38.04, zoom: 8.3 }

const teamColor = (theme: Theme, teamId: (typeof evaluationTeams)[number]['id']) => {
  const colors = {
    ecology: chart.voting.team.ecology,
    'environmental-justice': chart.voting.team.environmentalJustice,
    'ecocultural-restoration': theme.palette.dataViz.neutral,
    recreation: chart.voting.team.recreation,
    economy: chart.voting.team.economy,
  } as const
  return colors[teamId]
}

const mapLayerId = (id: string) => id.replace(/[^a-z0-9-]/gi, '-')

function ModelingResults({
  scenarioSlug,
  scenarioTitle,
  outflowVariation,
  explorerHref,
}: {
  scenarioSlug: string
  scenarioTitle: string
  outflowVariation?: 'increase' | 'decrease'
  explorerHref: string
}) {
  const theme = useTheme()
  const regionalScenarioSlug =
    scenarioSlug === 'tiered-outflows' ? 'alternative-delta-outflows' : scenarioSlug
  const scenarioKeyOverride =
    outflowVariation === 'increase'
      ? 'schism_run16_plus30pct_outflow'
      : outflowVariation === 'decrease'
        ? 'schism_run17_minus10pct_outflow'
        : undefined
  const { places, loading, error } = useRegionalPlaces(regionalScenarioSlug, scenarioKeyOverride)
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null)
  const selectedRegion = places.find((place) => place.id === selectedRegionId) ?? places[0] ?? null

  const trendColor = (trend: (typeof places)[number]['trend']) => {
    if (trend === 'saltier') return theme.palette.salinity.pink
    if (trend === 'fresher') return theme.palette.salinity.teal
    if (trend === 'flipping') return theme.palette.accent.yellow
    return theme.palette.base[100]
  }

  return (
    <Box component="section" aria-labelledby="modeling-results-title">
      <Typography id="modeling-results-title" variant="h2">
        Modeling results
      </Typography>
      <Typography
        variant="body1"
        sx={{ mt: jtSpacing.gap.md, color: 'base.100', maxWidth: '78ch' }}
      >
        Regional salinity patterns show where {scenarioTitle} differs from the shared baseline.
        Select a region in the summary or on the map to connect the finding with its geography.
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: 'minmax(300px, .78fr) minmax(0, 1.22fr)' },
          gap: jtSpacing.gap.lg,
          mt: jtSpacing.section.md,
          alignItems: 'stretch',
        }}
      >
        <Box sx={{ borderTop: 3, borderColor: 'primary.main', pt: jtSpacing.component.lg }}>
          <Typography variant="h3" component="h3">
            Salinity regional summary
          </Typography>
          {loading ? (
            <Typography variant="body2" sx={{ mt: jtSpacing.component.lg }}>
              Loading regional findings…
            </Typography>
          ) : error || places.length === 0 ? (
            <Typography variant="body2" sx={{ mt: jtSpacing.component.lg }}>
              Regional salinity results for this scenario are still being prepared.
            </Typography>
          ) : (
            <Stack spacing={0} sx={{ mt: jtSpacing.component.lg }}>
              {places.map((place) => {
                const selected = selectedRegion?.id === place.id
                const color = trendColor(place.trend)
                return (
                  <ButtonBase
                    key={place.id}
                    onClick={() => setSelectedRegionId(place.id)}
                    sx={{
                      width: 1,
                      py: jtSpacing.component.md,
                      borderTop: 1,
                      borderColor: 'border.subtle',
                      justifyContent: 'flex-start',
                      textAlign: 'left',
                    }}
                  >
                    <Stack direction="row" spacing={jtSpacing.gap.md} sx={{ alignItems: 'center' }}>
                      <Box
                        sx={{
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          bgcolor: color,
                          flex: 'none',
                        }}
                      />
                      <Box>
                        <Typography
                          variant="navigationLabel"
                          sx={{ color: selected ? color : 'common.white' }}
                        >
                          {place.name}
                        </Typography>
                        <Typography variant="captionSmall">
                          {place.patterns.length} regional pattern
                          {place.patterns.length === 1 ? '' : 's'} · {place.trend}
                        </Typography>
                      </Box>
                    </Stack>
                  </ButtonBase>
                )
              })}
            </Stack>
          )}
          <Button
            component={Link}
            to={explorerHref}
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            sx={{ mt: jtSpacing.component.lg }}
          >
            Open full modeling explorer
          </Button>
        </Box>

        <Box
          sx={{
            minHeight: { xs: 420, lg: 620 },
            position: 'relative',
            overflow: 'hidden',
            border: 1,
            borderColor: 'base.400',
          }}
        >
          <BaseMap
            mapStyleUrl={regionalMapStyle}
            initialViewState={regionalOverview}
            dragPan
            scrollZoom
            touchZoomRotate
            doubleClickZoom
            keyboard
            attributionControl={false}
          >
            {places.map((place) => {
              if (!place.geometry) return null
              const selected = selectedRegion?.id === place.id
              const color = trendColor(place.trend)
              const feature = {
                type: 'Feature' as const,
                properties: { id: place.id },
                geometry: place.geometry,
              }
              const stableId = mapLayerId(place.id)
              const fillLayer: LayerProps = {
                id: `result-region-fill-${stableId}`,
                type: 'fill',
                paint: { 'fill-color': color, 'fill-opacity': selected ? 0.68 : 0.32 },
              }
              const lineLayer: LayerProps = {
                id: `result-region-line-${stableId}`,
                type: 'line',
                paint: { 'line-color': color, 'line-width': selected ? 4 : 2 },
              }
              return (
                <Source
                  key={place.id}
                  id={`result-region-${stableId}`}
                  type="geojson"
                  data={feature}
                >
                  <Layer {...fillLayer} />
                  <Layer {...lineLayer} />
                </Source>
              )
            })}
            {places.map((place, index) => (
              <Marker
                key={place.id}
                longitude={place.coordinates[0]}
                latitude={place.coordinates[1]}
                anchor="bottom-left"
                offset={[-24, 0]}
              >
                <RegionalPlaceMarker
                  color={trendColor(place.trend)}
                  secondaryColor={
                    place.trend === 'flipping' ? theme.palette.salinity.teal : undefined
                  }
                  index={index}
                  name={place.name}
                  selected={selectedRegion?.id === place.id}
                  onSelect={() => setSelectedRegionId(place.id)}
                />
              </Marker>
            ))}
          </BaseMap>
        </Box>
      </Box>
    </Box>
  )
}

function CriteriaResults({ scenarioTitle }: { scenarioTitle: string }) {
  const [selectedTeamId, setSelectedTeamId] = useState(evaluationTeams[0].id)
  const selectedTeam =
    evaluationTeams.find((team) => team.id === selectedTeamId) ?? evaluationTeams[0]

  return (
    <Box component="section" aria-labelledby="criteria-results-title">
      <Typography id="criteria-results-title" variant="h2">
        Criteria
      </Typography>
      <Box sx={{ mt: jtSpacing.section.md, borderBottom: 1, borderColor: 'border.default' }}>
        <Tabs
          value={selectedTeamId}
          onChange={(_, value: string) => setSelectedTeamId(value as typeof selectedTeamId)}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="Evaluation team results"
          sx={(theme) => ({
            '& .MuiTabs-indicator': { bgcolor: teamColor(theme, selectedTeam.id) },
          })}
        >
          {evaluationTeams.map((team) => (
            <Tab
              key={team.id}
              value={team.id}
              label={team.label}
              sx={(theme) => ({
                color: alpha(teamColor(theme, team.id), 0.72),
                '&.Mui-selected': { color: teamColor(theme, team.id) },
              })}
            />
          ))}
        </Tabs>
      </Box>
      <Box sx={{ pt: jtSpacing.component.xl }}>
        <Typography variant="h3" component="h3">
          {selectedTeam.label}
        </Typography>
        <Stack spacing={jtSpacing.gap.md} sx={{ mt: jtSpacing.component.lg }}>
          {selectedTeam.metrics.map((metric) => (
            <Box
              key={metric.name}
              sx={{
                p: jtSpacing.component.lg,
                border: 1,
                borderColor: 'border.default',
                bgcolor: 'translucent.100',
              }}
            >
              <Typography variant="h4" component="h4">
                {metric.name}
              </Typography>
              <Typography variant="body2" sx={{ mt: jtSpacing.gap.sm }}>
                Results for {scenarioTitle} will appear here.
              </Typography>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  )
}

export default function ScenarioResults(props: Parameters<typeof ModelingResults>[0]) {
  return (
    <Stack spacing={jtSpacing.section.xl}>
      <ModelingResults {...props} />
      <CriteriaResults scenarioTitle={props.scenarioTitle} />
    </Stack>
  )
}
