import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import HelpIcon from '@mui/icons-material/Help'
import { Box, Button, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import type { Geometry, Position } from 'geojson'
import type { Map as MapboxMap } from 'mapbox-gl'
import { useCallback, useMemo, useRef, useState } from 'react'
import { Layer, Marker, Source, type LayerProps } from 'react-map-gl/mapbox'
import BaseMap from '../../map/BaseMap'
import { assetUrl } from '../../utils/baseUrl'
import type { ScenarioContent } from '../scenarios/content/scenarioContent'
import RegionalPatternsPage from './RegionalPatternsPage'
import RegionalPlaceMarker from './RegionalPlaceMarker'
import ScenarioStrategyGuide from './ScenarioStrategyGuide'
import { regionalPatternIds, registerRegionalPolygonPatterns } from './regionalPolygonPatterns'
import { type RegionalPlace, useRegionalPlaces } from './regionalSummaryData'
import {
  regionalSummaryControlStyles,
  regionalSummarySizing,
  regionalSummaryTypography,
} from './regionalSummaryStyles'

interface RegionalSalinityExplorerProps {
  scenario: ScenarioContent
  onBack: () => void
}

const trendLabel = {
  saltier: 'Generally saltier',
  fresher: 'Generally fresher',
  flipping: 'Flips between saltier and fresher',
  unclear: 'Direction still under review',
} as const

const regionalOverview = { longitude: -121.96, latitude: 38.06, zoom: 9.5 }

type Bounds = [[number, number], [number, number]]

// Leaves room for pins and labels, which extend up and to the right of each point.
const overviewPadding = { top: 120, right: 260, bottom: 120, left: 120 }
const overviewMaxZoom = 11.5

const strategyWelcomeBounds: Record<string, Bounds> = {
  'bolster-and-fortify': [
    [-122.67, 37.95],
    [-121.18, 38.05],
  ],
}

function collectPositions(geometry: Geometry, positions: Position[]) {
  if (geometry.type === 'GeometryCollection') {
    geometry.geometries.forEach((part) => collectPositions(part, positions))
    return
  }
  const walk = (value: unknown): void => {
    if (!Array.isArray(value)) return
    if (typeof value[0] === 'number') positions.push(value as Position)
    else value.forEach(walk)
  }
  walk(geometry.coordinates)
}

function scenarioOverviewBounds(places: RegionalPlace[]): Bounds | null {
  const positions: Position[] = []
  places.forEach((place) => {
    positions.push(place.coordinates)
    if (place.geometry) collectPositions(place.geometry, positions)
  })
  if (positions.length === 0) return null
  const longitudes = positions.map(([longitude]) => longitude)
  const latitudes = positions.map(([, latitude]) => latitude)
  return [
    [Math.min(...longitudes), Math.min(...latitudes)],
    [Math.max(...longitudes), Math.max(...latitudes)],
  ]
}

interface BolsterStrategyLayer {
  bounds: [[number, number], [number, number]]
  path: string
  type: 'area' | 'line'
}

const bolsterStrategyLayers: BolsterStrategyLayer[] = [
  {
    path: '/data/regional-summary/gis/bf-franks-tract-operable-gates.geojson',
    type: 'area',
    bounds: [
      [-121.585826, 38.029868],
      [-121.583398, 38.063663],
    ],
  },
  {
    path: '/data/regional-summary/gis/bf-franks-tract-levee-repair.geojson',
    type: 'area',
    bounds: [
      [-121.591647, 38.031175],
      [-121.581838, 38.063425],
    ],
  },
  {
    path: '/data/regional-summary/gis/bf-through-delta-freshwater-pathway.geojson',
    type: 'line',
    bounds: [
      [-121.584181, 37.851688],
      [-121.555849, 38.07381],
    ],
  },
]

const bolsterFranksTractBounds: [[number, number], [number, number]] = [
  [-121.591647, 38.029868],
  [-121.581838, 38.063663],
]

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

const monthYear = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})
const monthOnly = new Intl.DateTimeFormat('en-US', { month: 'long', timeZone: 'UTC' })

function regionalTimingSummary(place: RegionalPlace) {
  const directedPatterns = place.patterns.filter(
    (pattern) => pattern.direction && pattern.startDate && pattern.endDate,
  )
  const relevantPatterns =
    place.trend === 'flipping'
      ? directedPatterns
      : directedPatterns.filter((pattern) => pattern.direction === place.trend)

  if (relevantPatterns.length === 0) return `${trendLabel[place.trend]} across the modeled period.`

  const starts = relevantPatterns.map((pattern) => new Date(`${pattern.startDate}T00:00:00Z`))
  const ends = relevantPatterns.map((pattern) => new Date(`${pattern.endDate}T00:00:00Z`))
  const start = new Date(Math.min(...starts.map((date) => date.getTime())))
  const end = new Date(Math.max(...ends.map((date) => date.getTime())))
  const sameYear = start.getUTCFullYear() === end.getUTCFullYear()
  const isEntireSimulationPeriod =
    start.getUTCFullYear() === 2018 &&
    start.getUTCMonth() === 9 &&
    end.getUTCFullYear() === 2020 &&
    end.getUTCMonth() === 8
  const isDryYear2019 =
    start.getUTCFullYear() === 2018 &&
    start.getUTCMonth() === 9 &&
    end.getUTCFullYear() === 2019 &&
    end.getUTCMonth() === 8
  const range = sameYear
    ? `${monthOnly.format(start)}–${monthYear.format(end)}`
    : `${monthYear.format(start)}–${monthYear.format(end)}`
  const wetSeason =
    [9, 10, 11, 0, 1, 2].includes(start.getUTCMonth()) &&
    [9, 10, 11, 0, 1, 2].includes(end.getUTCMonth())
  const season = wetSeason ? ' (wet season)' : ''

  if (place.trend === 'flipping') {
    if (isEntireSimulationPeriod) {
      return 'Shifts between saltier and fresher periods throughout the entire simulation period.'
    }
    if (isDryYear2019) {
      return 'Shifts between saltier and fresher periods during dry year (2019).'
    }
    return `Shifts between saltier and fresher periods during ${range}${season}.`
  }

  if (isEntireSimulationPeriod) {
    return `${trendLabel[place.trend]} throughout the entire simulation period.`
  }
  if (isDryYear2019) {
    return `${trendLabel[place.trend]} during dry year (2019).`
  }
  return `${trendLabel[place.trend]} during ${range}${season}.`
}

export default function RegionalSalinityExplorer({
  scenario,
  onBack,
}: RegionalSalinityExplorerProps) {
  const theme = useTheme()
  const reduceMotion = useReducedMotion()
  const { places } = useRegionalPlaces(scenario.slug)
  const [selectedRegion, setSelectedRegion] = useState<RegionalPlace | null>(null)
  const [patternsOpen, setPatternsOpen] = useState(false)
  const [patternsReady, setPatternsReady] = useState(false)
  const [strategyGuideOpen, setStrategyGuideOpen] = useState(true)
  const [strategyGuideStarted, setStrategyGuideStarted] = useState(false)
  const [strategyGuideStep, setStrategyGuideStep] = useState(0)
  const [mapCursor, setMapCursor] = useState<'grab' | 'pointer'>('grab')
  const mapRef = useRef<MapboxMap | null>(null)

  const regionalInteractiveLayerIds = useMemo(
    () =>
      places.flatMap((_, index) => [
        `regional-fill-${index}`,
        ...(patternsReady ? [`regional-pattern-${index}`] : []),
      ]),
    [patternsReady, places],
  )

  const moveToStrategy = useCallback(
    (stepIndex: number) => {
      setStrategyGuideStarted(true)
      setStrategyGuideStep(stepIndex)
      const bolsterLayer =
        scenario.slug === 'bolster-and-fortify' ? bolsterStrategyLayers[stepIndex] : undefined
      if (bolsterLayer && mapRef.current) {
        mapRef.current.fitBounds(stepIndex < 2 ? bolsterFranksTractBounds : bolsterLayer.bounds, {
          padding: 150,
          duration: reduceMotion ? 0 : 1100,
          essential: false,
        })
        return
      }
      const camera = strategyCameras[scenario.slug]?.[stepIndex]
      if (!camera || !mapRef.current) return
      mapRef.current.flyTo({
        center: [camera.longitude, camera.latitude],
        zoom: camera.zoom,
        duration: reduceMotion ? 0 : 1100,
        essential: false,
      })
    },
    [reduceMotion, scenario.slug],
  )

  const overviewBounds = useMemo(() => scenarioOverviewBounds(places), [places])

  const moveToOverview = useCallback(
    (duration: number) => {
      const map = mapRef.current
      if (!map) return
      if (overviewBounds) {
        map.fitBounds(overviewBounds, {
          padding: overviewPadding,
          maxZoom: overviewMaxZoom,
          duration,
          essential: false,
        })
        return
      }
      map.flyTo({
        center: [regionalOverview.longitude, regionalOverview.latitude],
        zoom: regionalOverview.zoom,
        duration,
        essential: false,
      })
    },
    [overviewBounds],
  )

  const moveToStrategyWelcome = useCallback(
    (duration: number) => {
      const map = mapRef.current
      if (!map) return
      const explicitBounds = strategyWelcomeBounds[scenario.slug]
      if (explicitBounds) {
        map.fitBounds(explicitBounds, {
          padding: 36,
          duration,
          essential: false,
        })
        return
      }
      if (overviewBounds) {
        const [[west, south], [east, north]] = overviewBounds
        const longitudeSpan = Math.max(east - west, 0.08)
        map.fitBounds(
          [
            [west - longitudeSpan * 0.42, south],
            [east, north],
          ],
          {
            padding: 72,
            maxZoom: overviewMaxZoom,
            duration,
            essential: false,
          },
        )
        return
      }
      map.flyTo({
        center: [regionalOverview.longitude - 0.2, regionalOverview.latitude],
        zoom: regionalOverview.zoom,
        duration,
        essential: false,
      })
    },
    [overviewBounds, scenario.slug],
  )

  const closeStrategyGuide = useCallback(() => {
    setStrategyGuideOpen(false)
    setStrategyGuideStarted(false)
    moveToOverview(reduceMotion ? 0 : 900)
  }, [moveToOverview, reduceMotion])

  const showStrategyWelcome = useCallback(() => {
    setStrategyGuideStarted(false)
    moveToStrategyWelcome(reduceMotion ? 0 : 900)
  }, [moveToStrategyWelcome, reduceMotion])

  const openStrategyGuide = useCallback(() => {
    setStrategyGuideOpen(true)
    showStrategyWelcome()
  }, [showStrategyWelcome])

  const trendColor = (trend: RegionalPlace['trend']) => {
    if (trend === 'saltier') return theme.palette.salinity.pink
    if (trend === 'fresher') return theme.palette.salinity.teal
    if (trend === 'flipping') return theme.palette.salinity.pink
    return theme.palette.base[100]
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      {patternsOpen && selectedRegion ? (
        <motion.div
          key="regional-pattern-timeline"
          initial={reduceMotion ? { opacity: 0 } : { clipPath: 'inset(0 0 0 100%)' }}
          animate={{ clipPath: 'inset(0 0% 0 0)', opacity: 1 }}
          exit={reduceMotion ? { opacity: 0 } : { clipPath: 'inset(0 100% 0 0)' }}
          transition={{ duration: reduceMotion ? 0 : 0.58, ease: [0.76, 0, 0.24, 1] }}
          style={{
            height: '100dvh',
            overflow: 'hidden',
            backgroundColor: theme.palette.base[900],
          }}
        >
          <RegionalPatternsPage
            scenario={scenario}
            place={selectedRegion}
            places={places}
            onPlaceChange={setSelectedRegion}
            onBack={() => setPatternsOpen(false)}
          />
        </motion.div>
      ) : (
        <motion.div
          key="regional-map"
          initial={reduceMotion ? { opacity: 0 } : { clipPath: 'inset(0 0 0 100%)' }}
          animate={{ clipPath: 'inset(0 0% 0 0)', opacity: 1 }}
          exit={reduceMotion ? { opacity: 0 } : { clipPath: 'inset(0 100% 0 0)' }}
          transition={{ duration: reduceMotion ? 0 : 0.58, ease: [0.76, 0, 0.24, 1] }}
          style={{
            height: '100dvh',
            overflow: 'hidden',
            backgroundColor: theme.palette.base[900],
          }}
        >
          <Box
            component="section"
            aria-label={`${scenario.title} regional salinity exploration`}
            sx={{
              height: '100dvh',
              overflow: 'hidden',
              bgcolor: 'base.900',
              color: 'common.white',
            }}
          >
            <Box
              component="header"
              sx={{
                height: regionalSummarySizing.headerHeight,
                px: regionalSummarySizing.pageInset,
                display: 'grid',
                gridTemplateColumns: 'auto minmax(0, 1fr) auto',
                alignItems: 'center',
                gap: regionalSummarySizing.sectionGap,
                borderBottom: 1,
                borderColor: 'translucent.primaryGreen',
              }}
            >
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={onBack}
                sx={{
                  ...regionalSummaryControlStyles.primaryTouchButton,
                  color: 'common.white',
                  borderColor: 'primary.main',
                }}
              >
                Back to Scenarios
              </Button>
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  component="p"
                  sx={{
                    ...regionalSummaryTypography.scenarioNumber,
                    color: 'primary.main',
                    mb: 0.75,
                  }}
                >
                  {scenario.title}
                </Typography>
                <Typography
                  component="h1"
                  sx={{
                    ...regionalSummaryTypography.mapQuestion,
                    whiteSpace: { md: 'nowrap' },
                  }}
                >
                  Where does salinity get{' '}
                  <Box component="span" sx={{ color: 'salinity.pink' }}>
                    saltier
                  </Box>{' '}
                  or{' '}
                  <Box component="span" sx={{ color: 'salinity.teal' }}>
                    fresher
                  </Box>
                  ?
                </Typography>
                <Typography
                  sx={{
                    ...regionalSummaryTypography.instruction,
                    color: 'base.100',
                    mt: 0.6,
                  }}
                >
                  <Box component="span" sx={{ color: 'brand.primaryGreen', fontWeight: 700 }}>
                    Tap
                  </Box>{' '}
                  a highlighted region to preview its most important patterns.{' '}
                  <Box component="span" sx={{ color: 'brand.primaryGreen', fontWeight: 700 }}>
                    Drag
                  </Box>{' '}
                  to move the map.{' '}
                  <Box component="span" sx={{ color: 'brand.primaryGreen', fontWeight: 700 }}>
                    Pinch
                  </Box>{' '}
                  to zoom in on the map.
                </Typography>
              </Box>
              <Button
                variant="outlined"
                startIcon={<HelpIcon />}
                onClick={openStrategyGuide}
                sx={{
                  ...regionalSummaryControlStyles.primaryTouchButton,
                  color: 'common.white',
                  borderColor: 'primary.main',
                  whiteSpace: 'nowrap',
                }}
              >
                Scenario guide
              </Button>
            </Box>

            <Box
              sx={{
                position: 'relative',
                height: regionalSummarySizing.contentHeight,
                overflow: 'hidden',
              }}
            >
              <BaseMap
                mapStyleUrl="mapbox://styles/justtransition/cmreic454000z01sle8uh6v7n"
                initialViewState={regionalOverview}
                dragPan
                scrollZoom
                touchZoomRotate
                doubleClickZoom
                keyboard
                attributionControl={false}
                cursor={mapCursor}
                interactiveLayerIds={regionalInteractiveLayerIds}
                onMouseMove={(event) => setMapCursor(event.features?.length ? 'pointer' : 'grab')}
                onMouseLeave={() => setMapCursor('grab')}
                onClick={(event) => {
                  const regionId = event.features?.find((feature) => feature.properties?.id)
                    ?.properties?.id
                  const region = places.find((candidate) => candidate.id === regionId)
                  if (region) setSelectedRegion(region)
                }}
                onMapReady={(map) => {
                  mapRef.current = map
                  registerRegionalPolygonPatterns(map, {
                    saltier: theme.palette.salinity.pink,
                    fresher: theme.palette.salinity.teal,
                    flipping: theme.palette.accent.yellow,
                    unclear: theme.palette.base[100],
                  })
                  setPatternsReady(true)
                  if (strategyGuideOpen && !strategyGuideStarted) moveToStrategyWelcome(0)
                  else moveToOverview(0)
                }}
              >
                {places.map((region, index) => {
                  if (!region.geometry) return null
                  const selected = selectedRegion?.id === region.id
                  const color = trendColor(region.trend)
                  const polygonColor = region.trend === 'flipping' ? theme.palette.base[900] : color
                  const feature = {
                    type: 'Feature' as const,
                    properties: { id: region.id, trend: region.trend },
                    geometry: region.geometry,
                  }
                  const fillLayer: LayerProps = {
                    id: `regional-fill-${index}`,
                    type: 'fill',
                    paint: {
                      'fill-color': polygonColor,
                      'fill-opacity': selected ? 0.5 : 0.25,
                    },
                  }
                  const patternLayer: LayerProps = {
                    id: `regional-pattern-${index}`,
                    type: 'fill',
                    paint: {
                      'fill-pattern': regionalPatternIds[region.trend],
                      'fill-opacity': selected ? 1 : 0.76,
                    },
                  }
                  const lineLayer: LayerProps = {
                    id: `regional-line-${index}`,
                    type: 'line',
                    paint: {
                      'line-color': color,
                      'line-width': selected ? 4 : 2,
                      'line-opacity': selected ? 1 : 0.82,
                      //'line-dasharray': [2, 2],
                      //...(approximate ? { 'line-dasharray': [2, 2] } : {}),
                    },
                  }
                  return (
                    <Source
                      key={`geometry-${region.id}`}
                      id={`regional-source-${index}`}
                      type="geojson"
                      data={feature}
                    >
                      <Layer {...fillLayer} />
                      {patternsReady ? <Layer {...patternLayer} /> : null}
                      {region.trend !== 'flipping' ? <Layer {...lineLayer} /> : null}
                    </Source>
                  )
                })}
                {places.map((region, index) => {
                  const selected = selectedRegion?.id === region.id
                  return (
                    <Marker
                      key={region.id}
                      longitude={region.coordinates[0]}
                      latitude={region.coordinates[1]}
                      anchor="bottom-left"
                      offset={[-24, 0]}
                    >
                      <RegionalPlaceMarker
                        color={trendColor(region.trend)}
                        secondaryColor={
                          region.trend === 'flipping' ? theme.palette.salinity.teal : undefined
                        }
                        index={index}
                        name={region.name}
                        selected={selected}
                        onSelect={() => setSelectedRegion(region)}
                      />
                    </Marker>
                  )
                })}
                {scenario.slug === 'bolster-and-fortify' &&
                strategyGuideOpen &&
                strategyGuideStarted
                  ? (strategyGuideStep < 2
                      ? bolsterStrategyLayers.slice(0, 2).map((layer, layerIndex) => ({
                          layer,
                          layerIndex,
                        }))
                      : [{ layer: bolsterStrategyLayers[2], layerIndex: 2 }]
                    ).map(({ layer, layerIndex }) => {
                      const active = layerIndex === strategyGuideStep
                      return (
                        <Source
                          key={`bolster-strategy-${layerIndex}`}
                          id={`bolster-strategy-${layerIndex}`}
                          type="geojson"
                          data={assetUrl(layer.path)}
                        >
                          {layer.type === 'area' && active ? (
                            <Layer
                              id={`bolster-strategy-fill-${layerIndex}`}
                              type="fill"
                              paint={{
                                'fill-color': theme.palette.primary.main,
                                'fill-opacity': 0.8,
                              }}
                            />
                          ) : null}
                          <Layer
                            id={`bolster-strategy-line-${layerIndex}`}
                            type="line"
                            paint={{
                              'line-blur': active ? 1.5 : 0,
                              'line-color': theme.palette.primary.main,
                              'line-opacity': active ? 1 : 0.72,
                              'line-width': layer.type === 'line' ? 8 : active ? 4 : 3,
                            }}
                          />
                        </Source>
                      )
                    })
                  : null}
              </BaseMap>

              {selectedRegion ? (
                <Box
                  aria-live="polite"
                  sx={(theme) => ({
                    position: 'absolute',
                    left: { xs: 12, md: 24 },
                    bottom: { xs: 12, md: 24 },
                    width: { xs: 'calc(100% - 24px)', sm: regionalSummarySizing.previewWidth },
                    minHeight: regionalSummarySizing.previewMinHeight,
                    p: regionalSummarySizing.surfacePadding,
                    border: 0,
                    borderRadius: 1,
                    bgcolor: alpha(theme.palette.base[800], 0.97),
                    boxShadow: `0 24px 64px ${alpha(theme.palette.common.black, 0.62)}`,
                    backdropFilter: 'blur(14px)',
                  })}
                >
                  <Typography component="h2" sx={regionalSummaryTypography.regionTitle}>
                    {selectedRegion.name}
                  </Typography>
                  <Typography
                    sx={{ ...regionalSummaryTypography.instruction, color: 'base.100', mt: 1 }}
                  >
                    <Box
                      component="span"
                      sx={{ color: trendColor(selectedRegion.trend), fontWeight: 800 }}
                    >
                      {scenario.slug === 'bolster-and-fortify' &&
                      /franks tract/i.test(selectedRegion.name)
                        ? trendLabel[selectedRegion.trend]
                        : regionalTimingSummary(selectedRegion)}
                    </Box>
                    {scenario.slug === 'bolster-and-fortify' &&
                    /franks tract/i.test(selectedRegion.name)
                      ? ' because the gates are closed during this period.'
                      : null}
                  </Typography>
                  <Button
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => setPatternsOpen(true)}
                    sx={{ ...regionalSummaryControlStyles.primaryTouchButton, mt: 2 }}
                  >
                    View regional patterns
                  </Button>
                </Box>
              ) : null}
              {strategyGuideOpen ? (
                <ScenarioStrategyGuide
                  scenario={scenario}
                  onClose={closeStrategyGuide}
                  onWelcome={showStrategyWelcome}
                  onStepChange={moveToStrategy}
                />
              ) : null}
            </Box>
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
