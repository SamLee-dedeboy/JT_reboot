import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import MapOutlinedIcon from '@mui/icons-material/MapOutlined'
import { Box, Button, IconButton, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useReducedMotion } from 'framer-motion'
import type { Map as MapboxMap } from 'mapbox-gl'
import { Fragment, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Layer, Source } from 'react-map-gl/mapbox'
import BaseMap from '../../map/BaseMap'
import { createOfflineBasemapStyle, isOfflineMapEnabled } from '../../map/offlineBasemapStyle'
import { jtSpacing } from '../../theme'
import { assetUrl } from '../../utils/baseUrl'
import RegionalStackedTimeline from './RegionalStackedTimeline'
import { RegionalPlaceLayers, RegionalPlacePreview } from './RegionalSalinityMapParts'
import {
  filterPlacesByReleaseView,
  panRegionalPreviewIntoView,
  regionalInteractiveLayerIds,
  regionalMapStyleUrl,
  regionalOverview,
  regionalOverviewMaxZoom,
  regionalPreviewPopupSx,
  regionalReleaseViewOptions,
  registerRegionalMapPatterns,
  scenarioOverviewBounds,
  useCuratedRegionalPlaces,
  type RegionalReleaseView,
} from './regionalSalinityMap'
import { scenarioStrategies } from './scenarioStrategies'
import type { RegionalPlace } from './regionalSummaryData'
import { regionalMapScales } from './regionalSummaryStyles'

interface RegionalSalinitySummaryProps {
  /** Regional-summary scenario slug, e.g. `alternative-delta-outflows` for tiered outflows. */
  scenarioSlug: string
  scenarioTitle: string
  scenarioKeyOverride?: string
  explorerHref: string
  headingId: string
}

const strategyCameras: Record<
  string,
  Array<{ longitude: number; latitude: number; zoom: number }>
> = {
  'eco-machine': [
    { longitude: -122.04, latitude: 38.16, zoom: 10.6 },
    { longitude: -121.61, latitude: 38.04, zoom: 11.4 },
  ],
  'new-green-watershed': [
    { longitude: -121.72, latitude: 38.03, zoom: 9.8 },
    { longitude: -121.9, latitude: 38.12, zoom: 9.3 },
    { longitude: -121.78, latitude: 38.3, zoom: 8.5 },
  ],
  'calling-on-reserves': [
    { longitude: -122.42, latitude: 40.72, zoom: 8.2 },
    { longitude: -121.93, latitude: 38.13, zoom: 8.8 },
  ],
  'bolster-and-fortify': [
    { longitude: -121.61, latitude: 38.04, zoom: 11.5 },
    { longitude: -121.59, latitude: 38.0, zoom: 11.1 },
    { longitude: -121.55, latitude: 37.9, zoom: 10.3 },
  ],
  'a-tunnel': [
    { longitude: -121.53, latitude: 38.36, zoom: 10.3 },
    { longitude: -121.62, latitude: 37.85, zoom: 9.2 },
  ],
}

const shastaReservoirPoint = {
  type: 'FeatureCollection' as const,
  features: [
    {
      type: 'Feature' as const,
      properties: { name: 'Shasta Reservoir' },
      geometry: { type: 'Point' as const, coordinates: [-122.42, 40.72] },
    },
  ],
}

function StrategyAssetLayers({
  scenarioSlug,
  activeSteps,
  color,
  outlineColor,
}: {
  scenarioSlug: string
  activeSteps: ReadonlySet<number>
  color: string
  outlineColor: string
}) {
  const area = (id: string, path: string, index: number) =>
    activeSteps.has(index) ? (
      <Source key={id} id={id} type="geojson" data={assetUrl(path)}>
        <Layer
          id={`${id}-fill`}
          type="fill"
          paint={{ 'fill-color': color, 'fill-opacity': 0.72 }}
        />
        <Layer
          id={`${id}-line`}
          type="line"
          paint={{ 'line-color': color, 'line-opacity': 1, 'line-width': 4 }}
        />
      </Source>
    ) : null
  const line = (id: string, path: string, index: number) =>
    activeSteps.has(index) ? (
      <Source key={id} id={id} type="geojson" data={assetUrl(path)}>
        <Layer
          id={`${id}-line`}
          type="line"
          paint={{ 'line-blur': 1, 'line-color': color, 'line-opacity': 1, 'line-width': 7 }}
        />
      </Source>
    ) : null

  if (scenarioSlug === 'eco-machine') {
    return (
      <Source
        id="summary-eco-strategy-regions"
        type="geojson"
        data={assetUrl('/data/regional-summary/region-of-interest.geojson')}
      >
        {activeSteps.has(0) ? (
          <Layer
            id="summary-eco-strategy-fill-0"
            type="fill"
            filter={['==', ['get', 'region_id'], 'suisun_marsh']}
            paint={{ 'fill-color': color, 'fill-opacity': 0.72 }}
          />
        ) : null}
        {activeSteps.has(0) ? (
          <Layer
            id="summary-eco-strategy-line-0"
            type="line"
            filter={['==', ['get', 'region_id'], 'suisun_marsh']}
            paint={{ 'line-color': color, 'line-opacity': 1, 'line-width': 4 }}
          />
        ) : null}
        {activeSteps.has(1) ? (
          <Layer
            id="summary-eco-strategy-fill-1"
            type="fill"
            filter={['==', ['get', 'region_id'], 'franks_tract']}
            paint={{ 'fill-color': color, 'fill-opacity': 0.72 }}
          />
        ) : null}
        {activeSteps.has(1) ? (
          <Layer
            id="summary-eco-strategy-line-1"
            type="line"
            filter={['==', ['get', 'region_id'], 'franks_tract']}
            paint={{ 'line-color': color, 'line-opacity': 1, 'line-width': 4 }}
          />
        ) : null}
      </Source>
    )
  }

  if (scenarioSlug === 'new-green-watershed') {
    return (
      <>
        {activeSteps.has(0) || activeSteps.has(1) ? (
          <Source
            id="summary-ngw-strategy-habitats"
            type="geojson"
            data={assetUrl('/data/regional-summary/gis/ngw-habitats.geojson')}
          >
            {activeSteps.has(0) ? (
              <Layer
                id="summary-ngw-strategy-fill-0"
                type="fill"
                filter={['==', ['get', 'type'], 'soil']}
                paint={{ 'fill-color': color, 'fill-opacity': 0.72 }}
              />
            ) : null}
            {activeSteps.has(0) ? (
              <Layer
                id="summary-ngw-strategy-line-0"
                type="line"
                filter={['==', ['get', 'type'], 'soil']}
                paint={{ 'line-color': color, 'line-opacity': 1, 'line-width': 3 }}
              />
            ) : null}
            {activeSteps.has(1) ? (
              <Layer
                id="summary-ngw-strategy-fill-1"
                type="fill"
                filter={['has', 'type']}
                paint={{ 'fill-color': color, 'fill-opacity': 0.42 }}
              />
            ) : null}
            {activeSteps.has(1) ? (
              <Layer
                id="summary-ngw-strategy-line-1"
                type="line"
                filter={['has', 'type']}
                paint={{ 'line-color': color, 'line-opacity': 1, 'line-width': 3 }}
              />
            ) : null}
          </Source>
        ) : null}
        {line(
          'summary-ngw-strategy-watersheds',
          '/data/regional-summary/gis/watershed-region.geojson',
          2,
        )}
      </>
    )
  }

  if (scenarioSlug === 'calling-on-reserves') {
    return (
      <>
        {activeSteps.has(0) ? (
          <Source id="summary-cor-shasta" type="geojson" data={shastaReservoirPoint}>
            <Layer
              id="summary-cor-shasta-point"
              type="circle"
              paint={{
                'circle-color': color,
                'circle-radius': 10,
                'circle-stroke-color': outlineColor,
                'circle-stroke-width': 3,
              }}
            />
          </Source>
        ) : null}
        {line(
          'summary-cor-sacramento-mainstem',
          '/data/regional-summary/gis/sacramento-river-mainstem.geojson',
          1,
        )}
      </>
    )
  }

  if (scenarioSlug === 'bolster-and-fortify') {
    return (
      <>
        {area(
          'summary-bf-operable-gates',
          '/data/regional-summary/gis/bf-franks-tract-operable-gates.geojson',
          0,
        )}
        {area(
          'summary-bf-levee-repair',
          '/data/regional-summary/gis/bf-franks-tract-levee-repair.geojson',
          1,
        )}
        {line(
          'summary-bf-freshwater-pathway',
          '/data/regional-summary/gis/bf-through-delta-freshwater-pathway.geojson',
          2,
        )}
      </>
    )
  }

  if (scenarioSlug === 'a-tunnel') {
    return (
      <>
        {area('summary-tunnel-intakes', '/data/regional-summary/gis/delta-tunnel-sites.geojson', 0)}
        {line('summary-tunnel-route', '/data/regional-summary/gis/delta-tunnel.geojson', 1)}
      </>
    )
  }

  return null
}

function joinNames(names: string[]) {
  if (names.length <= 1) return names.join('')
  if (names.length === 2) return `${names[0]} and ${names[1]}`
  return `${names.slice(0, -1).join(', ')}, and ${names.at(-1)}`
}

function Saltier() {
  return (
    <Box component="strong" sx={{ color: 'salinity.pink' }}>
      saltier
    </Box>
  )
}

function Fresher() {
  return (
    <Box component="strong" sx={{ color: 'salinity.teal' }}>
      fresher
    </Box>
  )
}

/** One sentence condensing the regional takeaways: which places get saltier, fresher, or flip. */
function FindingSummary({
  scenarioTitle,
  places,
}: {
  scenarioTitle: string
  places: RegionalPlace[]
}) {
  const named = (trend: RegionalPlace['trend']) =>
    joinNames(places.filter((place) => place.trend === trend).map((place) => place.name))
  const clauses: ReactNode[] = []
  if (named('saltier'))
    clauses.push(
      <>
        makes {named('saltier')} <Saltier />
      </>,
    )
  if (named('fresher'))
    clauses.push(
      <>
        keeps {named('fresher')} <Fresher />
      </>,
    )
  if (named('flipping'))
    clauses.push(
      <>
        shifts {named('flipping')} between <Saltier /> and <Fresher /> periods
      </>,
    )
  const separator = (index: number) => {
    if (index === 0) return null
    if (index < clauses.length - 1) return ', '
    return clauses.length > 2 ? ', and ' : ' and '
  }

  return (
    <Typography variant="body1" sx={{ color: 'base.100', maxWidth: '78ch' }}>
      Compared with Business as Usual, {scenarioTitle}{' '}
      {clauses.map((clause, index) => (
        <Fragment key={index}>
          {separator(index)}
          {clause}
        </Fragment>
      ))}
      . These changes arrive in particular seasons and water years rather than all year round, as
      the timeline below shows.
    </Typography>
  )
}

/**
 * The scenario results page's salinity section: a written summary, the scenario's
 * strategies, a static version of the kiosk's regional map, and every region's events
 * stacked on one simulation timeline.
 */
export default function RegionalSalinitySummary({
  scenarioSlug,
  scenarioTitle,
  scenarioKeyOverride,
  explorerHref,
  headingId,
}: RegionalSalinitySummaryProps) {
  const theme = useTheme()
  const reduceMotion = useReducedMotion()
  const isCallingOnReserves = scenarioSlug === 'calling-on-reserves'
  const strategies = scenarioStrategies[scenarioSlug] ?? []
  const { places, loading, error } = useCuratedRegionalPlaces(scenarioSlug, scenarioKeyOverride)
  const [releaseView, setReleaseView] = useState<RegionalReleaseView>('all')
  const mapPlaces = useMemo(
    () => (isCallingOnReserves ? filterPlacesByReleaseView(places, releaseView) : places),
    [isCallingOnReserves, places, releaseView],
  )
  const [previewPlaceId, setPreviewPlaceId] = useState<string | null>(null)
  const [focusedPlaceId, setFocusedPlaceId] = useState<string | null>(null)
  const [activeStrategySteps, setActiveStrategySteps] = useState<Set<number>>(() => new Set())
  const previewPlace = places.find((place) => place.id === previewPlaceId) ?? null
  const [patternsReady, setPatternsReady] = useState(false)
  const [mapCursor, setMapCursor] = useState<'default' | 'pointer'>('default')
  const mapRef = useRef<MapboxMap | null>(null)
  const offlineMapStyle = useMemo(
    () => (isOfflineMapEnabled() ? createOfflineBasemapStyle() : undefined),
    [],
  )
  const overviewBounds = useMemo(() => scenarioOverviewBounds(places), [places])
  const interactiveLayerIds = useMemo(
    () => regionalInteractiveLayerIds(mapPlaces, patternsReady),
    [mapPlaces, patternsReady],
  )

  const moveToOverview = useCallback(
    (duration: number) => {
      const map = mapRef.current
      if (!map || !overviewBounds) return
      map.fitBounds(overviewBounds, {
        padding: regionalMapScales.web.overviewPadding,
        maxZoom: regionalOverviewMaxZoom,
        duration,
        essential: false,
      })
    },
    [overviewBounds],
  )

  // Places load after the map, and change with the outflow variation.
  useEffect(() => {
    moveToOverview(reduceMotion ? 0 : 700)
  }, [moveToOverview, reduceMotion])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !previewPlace) return
    return panRegionalPreviewIntoView(map, reduceMotion)
  }, [previewPlace, reduceMotion])

  const selectOnMap = (placeId: string) => {
    setPreviewPlaceId(placeId)
    setFocusedPlaceId(placeId)
  }

  const focusFromTimeline = (placeId: string) => {
    setFocusedPlaceId(placeId)
    if (previewPlaceId && previewPlaceId !== placeId) setPreviewPlaceId(null)
  }

  const toggleStrategyStep = (stepIndex: number) => {
    const willActivate = !activeStrategySteps.has(stepIndex)
    setActiveStrategySteps((current) => {
      const next = new Set(current)
      if (willActivate) next.add(stepIndex)
      else next.delete(stepIndex)
      return next
    })

    const map = mapRef.current
    const camera = strategyCameras[scenarioSlug]?.[stepIndex]
    if (willActivate && map && camera) {
      map.flyTo({
        center: [camera.longitude, camera.latitude],
        zoom: camera.zoom,
        duration: reduceMotion ? 0 : 900,
        essential: false,
      })
    } else if (!willActivate && activeStrategySteps.size === 1) {
      moveToOverview(reduceMotion ? 0 : 700)
    }
  }

  const ready = !loading && !error && places.length > 0

  return (
    <Box component="section" aria-labelledby={headingId}>
      <Typography id={headingId} variant="h2">
        Where does salinity get{' '}
        <Box component="span" sx={{ color: 'salinity.pink' }}>
          saltier
        </Box>{' '}
        and{' '}
        <Box component="span" sx={{ color: 'salinity.teal' }}>
          fresher
        </Box>
        ?
      </Typography>

      {/* Written summary */}
      <Box
        sx={{
          mt: jtSpacing.gap.md,
        }}
      >
        {loading ? (
          <Typography variant="body1" sx={{ color: 'base.100' }}>
            Loading regional findings…
          </Typography>
        ) : ready ? (
          <FindingSummary scenarioTitle={scenarioTitle} places={places} />
        ) : (
          <Typography variant="body1" sx={{ color: 'base.100' }}>
            Regional salinity results for this scenario are still being prepared.
          </Typography>
        )}
      </Box>

      {ready ? (
        <>
          {/* Strategies recap beside the regional map */}
          <Box
            sx={{
              mt: jtSpacing.section.md,
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                lg: strategies.length ? 'minmax(260px, 0.42fr) minmax(0, 1fr)' : '1fr',
              },
              gap: jtSpacing.gap.lg,
              alignItems: 'start',
            }}
          >
            {strategies.length ? (
              <Box sx={{ borderTop: 3, borderColor: 'primary.main', pt: jtSpacing.component.md }}>
                <Typography variant="eyebrow" component="h3" sx={{ color: 'primary.main' }}>
                  Strategies in this scenario
                </Typography>
                <Box component="ol" sx={{ listStyle: 'none', m: 0, p: 0, mt: jtSpacing.gap.sm }}>
                  {strategies.map((strategy, index) => (
                    <Box
                      component="li"
                      key={strategy.title}
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: 'auto minmax(0, 1fr)',
                        columnGap: jtSpacing.gap.md,
                        py: jtSpacing.component.md,
                        borderTop: index ? 1 : 0,
                        borderColor: 'border.subtle',
                      }}
                    >
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography variant="chartValueLarge" sx={{ color: 'primary.main' }}>
                          {String(index + 1).padStart(2, '0')}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => toggleStrategyStep(index)}
                          aria-label={`${activeStrategySteps.has(index) ? 'Hide' : 'Show'} ${strategy.title} on map`}
                          aria-pressed={activeStrategySteps.has(index)}
                          sx={{
                            mt: jtSpacing.gap.xs,
                            color: activeStrategySteps.has(index) ? 'base.900' : 'primary.main',
                            bgcolor: activeStrategySteps.has(index)
                              ? 'primary.main'
                              : 'transparent',
                            border: 1,
                            borderColor: 'primary.main',
                            '&:hover': {
                              bgcolor: activeStrategySteps.has(index)
                                ? 'primary.light'
                                : 'translucent.100',
                            },
                          }}
                        >
                          <MapOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Box>
                      <Box>
                        <Typography variant="cardTitle" component="h4">
                          {strategy.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ mt: jtSpacing.gap.sm, color: 'base.100' }}
                        >
                          {strategy.description}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            ) : null}

            <Box>
              {isCallingOnReserves ? (
                <ToggleButtonGroup
                  exclusive
                  size="small"
                  value={releaseView}
                  onChange={(_, value: RegionalReleaseView | null) => {
                    if (!value || value === releaseView) return
                    setReleaseView(value)
                    setPreviewPlaceId(null)
                  }}
                  aria-label="Calling on Reserves release timing"
                  sx={{ mb: jtSpacing.gap.md }}
                >
                  {regionalReleaseViewOptions.map(([value, label]) => (
                    <ToggleButton key={value} value={value}>
                      {label}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              ) : null}
              <Box
                sx={{
                  position: 'relative',
                  height: { xs: 420, md: 560 },
                  overflow: 'hidden',
                  border: 1,
                  borderColor: 'base.500',
                  ...regionalPreviewPopupSx('web'),
                }}
              >
                {/* Static map: regions and pins are selectable, but the camera stays put */}
                <BaseMap
                  mapStyle={offlineMapStyle}
                  mapStyleUrl={regionalMapStyleUrl}
                  initialViewState={regionalOverview}
                  dragPan={false}
                  dragRotate={false}
                  scrollZoom={false}
                  boxZoom={false}
                  touchZoomRotate={false}
                  touchPitch={false}
                  doubleClickZoom={false}
                  keyboard={false}
                  attributionControl={false}
                  cursor={mapCursor}
                  interactiveLayerIds={interactiveLayerIds}
                  onMouseMove={(event) =>
                    setMapCursor(event.features?.length ? 'pointer' : 'default')
                  }
                  onMouseLeave={() => setMapCursor('default')}
                  onClick={(event) => {
                    const regionId = event.features?.find((feature) => feature.properties?.id)
                      ?.properties?.id
                    if (typeof regionId === 'string') selectOnMap(regionId)
                  }}
                  onMapReady={(map) => {
                    mapRef.current = map
                    registerRegionalMapPatterns(map, theme)
                    setPatternsReady(true)
                    moveToOverview(0)
                  }}
                >
                  <RegionalPlaceLayers
                    places={mapPlaces}
                    selectedPlaceId={previewPlaceId ?? focusedPlaceId}
                    patternsReady={patternsReady}
                    scale="web"
                    onSelectPlace={(place) => selectOnMap(place.id)}
                  />
                  <StrategyAssetLayers
                    scenarioSlug={scenarioSlug}
                    activeSteps={activeStrategySteps}
                    color={theme.palette.primary.main}
                    outlineColor={theme.palette.common.white}
                  />
                  {previewPlace ? (
                    <RegionalPlacePreview
                      scenarioSlug={scenarioSlug}
                      place={previewPlace}
                      scale="web"
                      onClose={() => setPreviewPlaceId(null)}
                    />
                  ) : null}
                </BaseMap>
              </Box>
            </Box>
          </Box>

          {/* Every region's events on one simulation timeline */}
          <Box sx={{ mt: jtSpacing.section.md }}>
            <Typography variant="h3" component="h3" sx={{ mb: jtSpacing.component.md }}>
              Salinity pattern timeline
            </Typography>
            <RegionalStackedTimeline
              scenarioSlug={scenarioSlug}
              scenarioTitle={scenarioTitle}
              places={places}
              focusedPlaceId={focusedPlaceId}
              onFocusPlace={focusFromTimeline}
            />
            <Box
              sx={{
                mt: jtSpacing.component.xl,
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'flex-start', sm: 'center' },
                gap: jtSpacing.gap.md,
              }}
            >
              <Typography variant="body1" sx={{ color: 'base.100' }}>
                Want to explore salinity patterns in more detail?
              </Typography>
              <Button
                component={Link}
                to={explorerHref}
                variant="outlined"
                endIcon={<ArrowForwardIcon />}
              >
                Open the public modeling explorer
              </Button>
            </Box>
          </Box>
        </>
      ) : null}
    </Box>
  )
}
