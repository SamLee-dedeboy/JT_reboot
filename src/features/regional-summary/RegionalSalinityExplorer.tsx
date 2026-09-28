import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CloseIcon from '@mui/icons-material/Close'
import HelpIcon from '@mui/icons-material/Help'
import { Box, Button, IconButton, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import type { Geometry, Position } from 'geojson'
import type { Map as MapboxMap } from 'mapbox-gl'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Layer, Marker, Popup, Source, type LayerProps } from 'react-map-gl/mapbox'
import BaseMap from '../../map/BaseMap'
import { assetUrl } from '../../utils/baseUrl'
import type { ScenarioContent } from '../scenarios/content/scenarioContent'
import RegionalPatternsPage from './RegionalPatternsPage'
import RegionalPlaceMarker from './RegionalPlaceMarker'
import ScenarioStrategyGuide from './ScenarioStrategyGuide'
import {
  excludedRegionalPatternIds,
  getRegionalPlaceContent,
  sortRegionalPlaces,
  type RegionalTextHighlight,
} from './regionalPlaceContent'
import { regionalPatternIds, registerRegionalPolygonPatterns } from './regionalPolygonPatterns'
import { type RegionalPlace, useRegionalPlaces } from './regionalSummaryData'
import { createOfflineBasemapStyle, isOfflineMapEnabled } from '../../map/offlineBasemapStyle'
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

function mapLayerId(regionId: string) {
  return regionId.replace(/[^a-zA-Z0-9_-]/g, '-')
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
  const isOutflowScenario = scenario.slug === 'alternative-delta-outflows'
  const isCallingOnReserves = scenario.slug === 'calling-on-reserves'
  const [outflowVariant, setOutflowVariant] = useState<'plus30' | 'minus10'>('plus30')
  const [releaseView, setReleaseView] = useState<'all' | 'before' | 'during-after'>('all')
  const outflowScenarioKey =
    outflowVariant === 'plus30'
      ? 'schism_run16_plus30pct_outflow'
      : 'schism_run17_minus10pct_outflow'
  const { places: sourcePlaces } = useRegionalPlaces(
    scenario.slug,
    isOutflowScenario ? outflowScenarioKey : undefined,
  )
  const activeScenario = useMemo(
    () =>
      isOutflowScenario
        ? {
            ...scenario,
            title:
              outflowVariant === 'plus30' ? 'Increasing Delta Outflow' : 'Decreasing Delta Outflow',
          }
        : scenario,
    [isOutflowScenario, outflowVariant, scenario],
  )
  const places = useMemo(
    () =>
      sortRegionalPlaces(
        scenario.slug,
        sourcePlaces.map((place) => {
          const patterns = place.patterns.filter(
            (pattern) => !excludedRegionalPatternIds.has(pattern.id),
          )
          const directions = new Set(
            patterns.flatMap((pattern) => (pattern.direction ? [pattern.direction] : [])),
          )
          const [onlyDirection] = directions

          return {
            ...place,
            patterns,
            trend: directions.size > 1 ? ('flipping' as const) : (onlyDirection ?? place.trend),
            name: getRegionalPlaceContent(scenario.slug, place).displayName,
          }
        }),
      ),
    [scenario.slug, sourcePlaces],
  )
  const mapPlaces = useMemo(() => {
    if (!isCallingOnReserves || releaseView === 'all') return places

    return places
      .map((place) => {
        const patterns = place.patterns.filter((pattern) => {
          const timing = pattern.reviewNote.toLowerCase()
          return releaseView === 'before'
            ? timing.includes('before') || timing.includes('between potential releases')
            : timing.includes('during') || timing.includes('after')
        })
        const directions = new Set(
          patterns.flatMap((pattern) => (pattern.direction ? [pattern.direction] : [])),
        )
        const [onlyDirection] = directions
        return {
          ...place,
          patterns,
          trend: directions.size > 1 ? ('flipping' as const) : (onlyDirection ?? place.trend),
        }
      })
      .filter((place) => place.patterns.length > 0)
  }, [isCallingOnReserves, places, releaseView])
  const [selectedRegion, setSelectedRegion] = useState<RegionalPlace | null>(null)
  const [patternsOpen, setPatternsOpen] = useState(false)
  const [patternsReady, setPatternsReady] = useState(false)
  const [strategyGuideOpen, setStrategyGuideOpen] = useState(true)
  const [strategyGuideStarted, setStrategyGuideStarted] = useState(false)
  const [strategyGuideStep, setStrategyGuideStep] = useState(0)
  const [mapCursor, setMapCursor] = useState<'grab' | 'pointer'>('grab')
  const mapRef = useRef<MapboxMap | null>(null)
  const offlineMapStyle = useMemo(
    () => (isOfflineMapEnabled() ? createOfflineBasemapStyle() : undefined),
    [],
  )

  useEffect(() => {
    const map = mapRef.current
    if (!map || !selectedRegion || strategyGuideOpen || patternsOpen) return

    let secondFrame = 0
    const firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => {
        const mapContainer = map.getContainer()
        const preview = mapContainer.querySelector<HTMLElement>('.regional-summary-preview-popup')
        if (!preview) return

        const mapBounds = mapContainer.getBoundingClientRect()
        const previewBounds = preview.getBoundingClientRect()
        const inset = Math.min(
          regionalSummarySizing.previewViewportInsetMax,
          Math.max(
            regionalSummarySizing.previewViewportInsetMin,
            mapBounds.width * regionalSummarySizing.previewViewportInsetRatio,
          ),
        )
        const safeLeft = mapBounds.left + inset
        const safeRight = mapBounds.right - inset
        const safeTop = mapBounds.top + inset
        const safeBottom = mapBounds.bottom - inset
        let visualShiftX = 0
        let visualShiftY = 0

        if (previewBounds.left < safeLeft) visualShiftX = safeLeft - previewBounds.left
        if (previewBounds.right > safeRight) visualShiftX = safeRight - previewBounds.right
        if (previewBounds.top < safeTop) visualShiftY = safeTop - previewBounds.top
        if (previewBounds.bottom > safeBottom) visualShiftY = safeBottom - previewBounds.bottom

        if (visualShiftX || visualShiftY) {
          map.panBy([-visualShiftX, -visualShiftY], {
            duration: reduceMotion ? 0 : 520,
            essential: false,
          })
        }
      })
    })

    return () => {
      window.cancelAnimationFrame(firstFrame)
      window.cancelAnimationFrame(secondFrame)
    }
  }, [patternsOpen, reduceMotion, selectedRegion, strategyGuideOpen])

  const regionalInteractiveLayerIds = useMemo(
    () =>
      mapPlaces.flatMap((place) => [
        `regional-fill-${mapLayerId(place.id)}`,
        ...(patternsReady ? [`regional-pattern-${mapLayerId(place.id)}`] : []),
      ]),
    [mapPlaces, patternsReady],
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

  const closeStrategyGuide = useCallback(() => {
    setStrategyGuideOpen(false)
    setStrategyGuideStarted(false)
    moveToOverview(reduceMotion ? 0 : 900)
  }, [moveToOverview, reduceMotion])

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

  const showStrategyWelcome = useCallback(() => {
    setStrategyGuideStarted(false)
    moveToStrategyWelcome(reduceMotion ? 0 : 900)
  }, [moveToStrategyWelcome, reduceMotion])

  const openStrategyGuide = useCallback(() => {
    setSelectedRegion(null)
    setStrategyGuideOpen(true)
    showStrategyWelcome()
  }, [showStrategyWelcome])

  useEffect(() => {
    if (!isOutflowScenario || !mapRef.current || places.length === 0) return
    if (strategyGuideOpen) moveToStrategyWelcome(reduceMotion ? 0 : 700)
    else moveToOverview(reduceMotion ? 0 : 700)
  }, [
    isOutflowScenario,
    moveToOverview,
    moveToStrategyWelcome,
    outflowVariant,
    places.length,
    reduceMotion,
    strategyGuideOpen,
  ])

  const trendColor = (trend: RegionalPlace['trend']) => {
    if (trend === 'saltier') return theme.palette.salinity.pink
    if (trend === 'fresher') return theme.palette.salinity.teal
    if (trend === 'flipping') return theme.palette.salinity.pink
    return theme.palette.base[100]
  }

  const editorialColor = (highlight?: RegionalTextHighlight) => {
    if (highlight === 'saltier') return theme.palette.salinity.pink
    if (highlight === 'fresher') return theme.palette.salinity.teal
    if (highlight === 'primary') return theme.palette.primary.main
    if (highlight === 'white') return theme.palette.common.white
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
            scenario={activeScenario}
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
                  {activeScenario.title}
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
                '& .regional-summary-preview-popup': {
                  zIndex: 6,
                },
                '& .regional-summary-preview-popup .mapboxgl-popup-content': {
                  width: 'max-content',
                  minWidth: regionalSummarySizing.previewWidth,
                  maxWidth: 'calc(100vw - 48px)',
                  minHeight: regionalSummarySizing.previewMinHeight,
                  p: 0,
                  border: 1,
                  borderColor: 'base.500',
                  borderRadius: 'clamp(18px, 1.2vw, 36px)',
                  bgcolor: 'base.800',
                  boxShadow: 'none',
                  backdropFilter: 'blur(14px)',
                },
                '& .regional-summary-preview-popup .mapboxgl-popup-tip': {
                  display: 'none',
                },
              }}
            >
              {isOutflowScenario || isCallingOnReserves ? (
                <Box
                  sx={{
                    position: 'absolute',
                    inset: '0 0 auto 0',
                    zIndex: 7,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: regionalSummarySizing.compactTouchTarget,
                    bgcolor: 'base.900',
                    borderBottom: 1,
                    borderColor: 'base.500',
                  }}
                >
                  <ToggleButtonGroup
                    exclusive
                    value={isOutflowScenario ? outflowVariant : releaseView}
                    onChange={(_, value: string | null) => {
                      if (!value) return
                      if (isOutflowScenario) {
                        if (value === outflowVariant) return
                        setOutflowVariant(value as 'plus30' | 'minus10')
                      } else {
                        if (value === releaseView) return
                        setReleaseView(value as 'all' | 'before' | 'during-after')
                      }
                      setSelectedRegion(null)
                      setPatternsOpen(false)
                    }}
                    aria-label={
                      isOutflowScenario
                        ? 'Delta outflow comparison'
                        : 'Calling on Reserves release timing'
                    }
                  >
                    {(isOutflowScenario
                      ? [
                          ['plus30', '+30% Delta outflow'],
                          ['minus10', '−10% Delta outflow'],
                        ]
                      : [
                          ['all', 'View all'],
                          ['before', 'Before release'],
                          ['during-after', 'During and after release'],
                        ]
                    ).map(([value, label]) => (
                      <ToggleButton
                        key={value}
                        value={value}
                        sx={{
                          ...regionalSummaryTypography.action,
                          minHeight: regionalSummarySizing.compactTouchTarget,
                          px: 2.5,
                          color: 'base.100',
                          borderColor: 'base.500',
                          borderTop: 0,
                          borderBottom: 0,
                          '&.Mui-selected': {
                            color: 'base.900',
                            bgcolor: 'primary.main',
                            '&:hover': { bgcolor: 'primary.main' },
                          },
                        }}
                      >
                        {label}
                      </ToggleButton>
                    ))}
                  </ToggleButtonGroup>
                </Box>
              ) : null}
              <BaseMap
                mapStyle={offlineMapStyle}
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
                {mapPlaces.map((region) => {
                  if (!region.geometry) return null
                  const selected = selectedRegion?.id === region.id
                  const color = trendColor(region.trend)
                  const polygonColor = region.trend === 'flipping' ? theme.palette.base[900] : color
                  const feature = {
                    type: 'Feature' as const,
                    properties: { id: region.id, trend: region.trend },
                    geometry: region.geometry,
                  }
                  const stableId = mapLayerId(region.id)
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
                      'line-opacity': 0, //selected ? 1 : 0.82,
                      //'line-dasharray': [2, 2],
                      //...(approximate ? { 'line-dasharray': [2, 2] } : {}),
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
                {mapPlaces.map((region, index) => {
                  const selected = selectedRegion?.id === region.id
                  const detailRegion =
                    places.find((candidate) => candidate.id === region.id) ?? region
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
                        onSelect={() => setSelectedRegion(detailRegion)}
                      />
                    </Marker>
                  )
                })}
                {selectedRegion ? (
                  <Popup
                    key={`${selectedRegion.id}-${getRegionalPlaceContent(scenario.slug, selectedRegion).cardSide}`}
                    longitude={selectedRegion.coordinates[0]}
                    latitude={selectedRegion.coordinates[1]}
                    anchor={
                      getRegionalPlaceContent(scenario.slug, selectedRegion).cardSide === 'left'
                        ? 'right'
                        : 'left'
                    }
                    offset={regionalSummarySizing.previewMarkerOffset}
                    closeButton={false}
                    closeOnClick={false}
                    focusAfterOpen={false}
                    maxWidth="none"
                    className="regional-summary-preview-popup"
                  >
                    <Box
                      aria-live="polite"
                      sx={{
                        p: regionalSummarySizing.previewPadding,
                        display: 'grid',
                        gap: regionalSummarySizing.previewGap,
                      }}
                    >
                      <Box
                        sx={{
                          display: 'grid',
                          gridTemplateColumns: 'minmax(0, 1fr) auto',
                          alignItems: 'center',
                          gap: 2,
                        }}
                      >
                        <Typography
                          component="h2"
                          sx={{
                            ...regionalSummaryTypography.regionTitle,
                            pl: regionalSummarySizing.previewPadding,
                            whiteSpace: 'nowrap',
                            color:
                              selectedRegion.trend === 'saltier'
                                ? 'salinity.pink'
                                : 'salinity.teal',
                          }}
                        >
                          {selectedRegion.name}
                        </Typography>
                        <IconButton
                          aria-label="Close regional pattern summary"
                          onClick={() => setSelectedRegion(null)}
                          sx={{
                            width: regionalSummarySizing.compactTouchTarget,
                            height: regionalSummarySizing.compactTouchTarget,
                            color:
                              selectedRegion.trend === 'saltier'
                                ? 'salinity.pink'
                                : 'salinity.teal',
                            '& .MuiSvgIcon-root': {
                              fontSize: regionalSummarySizing.controlIconSize,
                            },
                          }}
                        >
                          <CloseIcon />
                        </IconButton>
                      </Box>

                      <Box
                        sx={{
                          width: regionalSummarySizing.previewWidth,
                          px: regionalSummarySizing.previewPadding,
                          boxSizing: 'border-box',
                        }}
                      >
                        <Typography
                          sx={{
                            ...regionalSummaryTypography.scenarioNumber,
                            color: 'common.white',
                          }}
                        >
                          Why this place
                        </Typography>
                        <Typography
                          sx={{
                            ...regionalSummaryTypography.instruction,
                            color: 'base.100',
                            mt: 1.5,
                          }}
                        >
                          {getRegionalPlaceContent(scenario.slug, selectedRegion).whyThisPlace}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          width: regionalSummarySizing.previewWidth,
                          p: regionalSummarySizing.previewPadding,
                          boxSizing: 'border-box',
                          border: 2,
                          borderColor:
                            selectedRegion.trend === 'saltier' ? 'salinity.pink' : 'salinity.teal',
                          borderRadius: 'clamp(12px, 0.8vw, 24px)',
                        }}
                      >
                        <Typography
                          sx={{
                            ...regionalSummaryTypography.scenarioNumber,
                            color: 'common.white',
                          }}
                        >
                          Key takeaway
                        </Typography>
                        <Typography
                          sx={{
                            ...regionalSummaryTypography.instruction,
                            color: 'base.100',
                            mt: 1.5,
                          }}
                        >
                          {getRegionalPlaceContent(scenario.slug, selectedRegion).keyTakeaway?.map(
                            (segment, index) => (
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
                            ),
                          ) ?? (
                            <Box
                              component="span"
                              sx={{
                                color: trendColor(selectedRegion.trend),
                                fontWeight: 800,
                              }}
                            >
                              {regionalTimingSummary(selectedRegion)}
                            </Box>
                          )}
                        </Typography>
                      </Box>
                      <Button
                        endIcon={<ArrowForwardIcon />}
                        onClick={() => setPatternsOpen(true)}
                        sx={{
                          ...regionalSummaryControlStyles.primaryTouchButton,
                          width: '100%',
                          justifySelf: 'start',
                        }}
                      >
                        View Salinity Pattern Timeline
                      </Button>
                    </Box>
                  </Popup>
                ) : null}
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
                {scenario.slug === 'eco-machine' && strategyGuideOpen && strategyGuideStarted ? (
                  <Source
                    id="eco-strategy-regions"
                    type="geojson"
                    data={assetUrl('/data/regional-summary/region-of-interest.geojson')}
                  >
                    <Layer
                      id="eco-strategy-fill"
                      type="fill"
                      filter={[
                        '==',
                        ['get', 'region_id'],
                        strategyGuideStep === 0 ? 'suisun_marsh' : 'franks_tract',
                      ]}
                      paint={{
                        'fill-color': theme.palette.primary.main,
                        'fill-opacity': 0.78,
                      }}
                    />
                    <Layer
                      id="eco-strategy-line"
                      type="line"
                      filter={[
                        '==',
                        ['get', 'region_id'],
                        strategyGuideStep === 0 ? 'suisun_marsh' : 'franks_tract',
                      ]}
                      paint={{
                        'line-blur': 1.5,
                        'line-color': theme.palette.primary.main,
                        'line-opacity': 1,
                        'line-width': 4,
                      }}
                    />
                  </Source>
                ) : null}
                {scenario.slug === 'calling-on-reserves' &&
                strategyGuideOpen &&
                strategyGuideStarted &&
                strategyGuideStep === 1 ? (
                  <Source
                    id="cor-strategy-sacramento-mainstem"
                    type="geojson"
                    data={assetUrl('/data/regional-summary/gis/sacramento-river-mainstem.geojson')}
                  >
                    <Layer
                      id="cor-strategy-sacramento-mainstem-line"
                      type="line"
                      paint={{
                        'line-blur': 1.5,
                        'line-color': theme.palette.primary.main,
                        'line-opacity': 1,
                        'line-width': 8,
                      }}
                    />
                  </Source>
                ) : null}
                {scenario.slug === 'new-green-watershed' &&
                strategyGuideOpen &&
                strategyGuideStarted &&
                strategyGuideStep < 2 ? (
                  <Source
                    id="ngw-strategy-habitats"
                    type="geojson"
                    data={assetUrl('/data/regional-summary/gis/ngw-habitats.geojson')}
                  >
                    <Layer
                      id="ngw-strategy-habitat-fill"
                      type="fill"
                      filter={
                        strategyGuideStep === 0 ? ['==', ['get', 'type'], 'soil'] : ['has', 'type']
                      }
                      paint={{
                        'fill-color': theme.palette.primary.main,
                        'fill-opacity': 0.68,
                      }}
                    />
                    <Layer
                      id="ngw-strategy-habitat-line"
                      type="line"
                      filter={
                        strategyGuideStep === 0 ? ['==', ['get', 'type'], 'soil'] : ['has', 'type']
                      }
                      paint={{
                        'line-color': theme.palette.primary.main,
                        'line-opacity': 1,
                        'line-width': 3,
                      }}
                    />
                  </Source>
                ) : null}
                {scenario.slug === 'new-green-watershed' &&
                strategyGuideOpen &&
                strategyGuideStarted &&
                strategyGuideStep === 2 ? (
                  <>
                    <Source
                      id="ngw-strategy-watersheds"
                      type="geojson"
                      data={assetUrl('/data/regional-summary/gis/watershed-region.geojson')}
                    >
                      <Layer
                        id="ngw-strategy-watershed-line"
                        type="line"
                        paint={{
                          'line-color': theme.palette.primary.main,
                          'line-opacity': 1,
                          'line-width': 3,
                        }}
                      />
                    </Source>
                    <Source
                      id="ngw-strategy-watershed-labels"
                      type="geojson"
                      data={assetUrl('/data/regional-summary/gis/watershed-region-labels.geojson')}
                    >
                      <Layer
                        id="ngw-strategy-watershed-label"
                        type="symbol"
                        layout={{
                          'text-field': ['get', 'name'],
                          'text-font': ['Proxima Nova Semibold'],
                          'text-size': 18,
                          'text-allow-overlap': true,
                          'text-ignore-placement': true,
                        }}
                        paint={{
                          'text-color': theme.palette.primary.main,
                          'text-halo-color': theme.palette.base[900],
                          'text-halo-width': 2,
                        }}
                      />
                    </Source>
                  </>
                ) : null}
                {scenario.slug === 'a-tunnel' && strategyGuideOpen && strategyGuideStarted ? (
                  <>
                    <Source
                      id="tunnel-strategy-sites"
                      type="geojson"
                      data={assetUrl('/data/regional-summary/gis/delta-tunnel-sites.geojson')}
                    >
                      {strategyGuideStep === 0 ? (
                        <Layer
                          id="tunnel-strategy-site-fill"
                          type="fill"
                          paint={{
                            'fill-color': theme.palette.primary.main,
                            'fill-opacity': 0.82,
                          }}
                        />
                      ) : null}
                      <Layer
                        id="tunnel-strategy-site-line"
                        type="line"
                        paint={{
                          'line-color': theme.palette.primary.main,
                          'line-opacity': strategyGuideStep === 0 ? 1 : 0.7,
                          'line-width': strategyGuideStep === 0 ? 4 : 2,
                        }}
                      />
                    </Source>
                    {strategyGuideStep === 1 ? (
                      <Source
                        id="tunnel-strategy-route"
                        type="geojson"
                        data={assetUrl('/data/regional-summary/gis/delta-tunnel.geojson')}
                      >
                        <Layer
                          id="tunnel-strategy-route-line"
                          type="line"
                          paint={{
                            'line-blur': 1.5,
                            'line-color': theme.palette.primary.main,
                            'line-opacity': 1,
                            'line-width': 8,
                          }}
                        />
                      </Source>
                    ) : null}
                  </>
                ) : null}
              </BaseMap>

              {strategyGuideOpen ? (
                <ScenarioStrategyGuide
                  scenario={activeScenario}
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
