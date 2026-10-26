import type { Theme } from '@mui/material/styles'
import type { Geometry, Position } from 'geojson'
import type { Map as MapboxMap } from 'mapbox-gl'
import { useMemo } from 'react'
import {
  excludedRegionalPatternIds,
  getRegionalPlaceContent,
  sortRegionalPlaces,
} from './regionalPlaceContent'
import { registerRegionalPolygonPatterns } from './regionalPolygonPatterns'
import { type RegionalPlace, useRegionalPlaces } from './regionalSummaryData'
import {
  regionalMapScales,
  regionalSummarySizing,
  type RegionalMapScale,
} from './regionalSummaryStyles'

/*
 * Map pieces shared by the kiosk explorer (RegionalSalinityExplorer) and the
 * scenario results page (RegionalSalinitySummary), so both draw regions the same way.
 */

export const regionalMapStyleUrl = 'mapbox://styles/justtransition/cmreic454000z01sle8uh6v7n'
export const regionalOverview = { longitude: -121.96, latitude: 38.06, zoom: 9.5 }
export const regionalOverviewMaxZoom = 11.5

export type RegionalReleaseView = 'all' | 'before' | 'during-after'
export type Bounds = [[number, number], [number, number]]

export const regionalTrendLabel = {
  saltier: 'Generally saltier',
  fresher: 'Generally fresher',
  flipping: 'Flips between saltier and fresher',
  unclear: 'Direction still under review',
} as const

export function regionalMapLayerId(regionId: string) {
  return regionId.replace(/[^a-zA-Z0-9_-]/g, '-')
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

export function scenarioOverviewBounds(places: RegionalPlace[]): Bounds | null {
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

function placeWithPatterns(place: RegionalPlace, patterns: RegionalPlace['patterns']) {
  const directions = new Set(
    patterns.flatMap((pattern) => (pattern.direction ? [pattern.direction] : [])),
  )
  const [onlyDirection] = directions
  return {
    ...place,
    patterns,
    trend: directions.size > 1 ? ('flipping' as const) : (onlyDirection ?? place.trend),
  }
}

/** Curated, ordered places with excluded patterns removed and trends recomputed. */
export function useCuratedRegionalPlaces(scenarioSlug: string, scenarioKeyOverride?: string) {
  const {
    places: sourcePlaces,
    loading,
    error,
  } = useRegionalPlaces(scenarioSlug, scenarioKeyOverride)
  const places = useMemo(
    () =>
      sortRegionalPlaces(
        scenarioSlug,
        sourcePlaces.map((place) => ({
          ...placeWithPatterns(
            place,
            place.patterns.filter((pattern) => !excludedRegionalPatternIds.has(pattern.id)),
          ),
          name: getRegionalPlaceContent(scenarioSlug, place).displayName,
        })),
      ),
    [scenarioSlug, sourcePlaces],
  )
  return { places, loading, error }
}

/** Calling on Reserves map filter: keep only patterns in the chosen release window. */
export function filterPlacesByReleaseView(
  places: RegionalPlace[],
  releaseView: RegionalReleaseView,
) {
  if (releaseView === 'all') return places
  return places
    .map((place) =>
      placeWithPatterns(
        place,
        place.patterns.filter((pattern) => {
          const timing = pattern.reviewNote.toLowerCase()
          return releaseView === 'before'
            ? timing.includes('before') || timing.includes('between potential releases')
            : timing.includes('during') || timing.includes('after')
        }),
      ),
    )
    .filter((place) => place.patterns.length > 0)
}

export const regionalReleaseViewOptions: Array<[RegionalReleaseView, string]> = [
  ['all', 'View all'],
  ['before', 'Before release'],
  ['during-after', 'During and after release'],
]

const monthYear = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})
const monthOnly = new Intl.DateTimeFormat('en-US', { month: 'long', timeZone: 'UTC' })

export function regionalTimingSummary(place: RegionalPlace) {
  const directedPatterns = place.patterns.filter(
    (pattern) => pattern.direction && pattern.startDate && pattern.endDate,
  )
  const relevantPatterns =
    place.trend === 'flipping'
      ? directedPatterns
      : directedPatterns.filter((pattern) => pattern.direction === place.trend)

  if (relevantPatterns.length === 0)
    return `${regionalTrendLabel[place.trend]} across the modeled period.`

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
    return `${regionalTrendLabel[place.trend]} throughout the entire simulation period.`
  }
  if (isDryYear2019) {
    return `${regionalTrendLabel[place.trend]} during dry year (2019).`
  }
  return `${regionalTrendLabel[place.trend]} during ${range}${season}.`
}

/** Flipping places use pink plus a teal secondary color, never yellow. */
export function regionalTrendColor(theme: Theme, trend: RegionalPlace['trend']) {
  if (trend === 'saltier' || trend === 'flipping') return theme.palette.salinity.pink
  if (trend === 'fresher') return theme.palette.salinity.teal
  return theme.palette.base[100]
}

export function registerRegionalMapPatterns(map: MapboxMap, theme: Theme) {
  registerRegionalPolygonPatterns(map, {
    saltier: theme.palette.salinity.pink,
    fresher: theme.palette.salinity.teal,
    flipping: theme.palette.accent.yellow,
    unclear: theme.palette.base[100],
  })
}

export function regionalInteractiveLayerIds(places: RegionalPlace[], patternsReady: boolean) {
  return places.flatMap((place) => [
    `regional-fill-${regionalMapLayerId(place.id)}`,
    ...(patternsReady ? [`regional-pattern-${regionalMapLayerId(place.id)}`] : []),
  ])
}

/** Pans only as far as needed to keep the open place card inside the map. */
export function panRegionalPreviewIntoView(map: MapboxMap, reduceMotion: boolean | null) {
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
}

/** Styles for the Mapbox popup wrapper; apply to an ancestor of the map. */
export function regionalPreviewPopupSx(scale: RegionalMapScale) {
  const sizing = regionalMapScales[scale]
  return {
    '& .regional-summary-preview-popup': {
      zIndex: 6,
    },
    '& .regional-summary-preview-popup .mapboxgl-popup-content': {
      width: 'max-content',
      minWidth: sizing.previewWidth,
      maxWidth: 'calc(100vw - 48px)',
      minHeight: sizing.previewMinHeight,
      p: 0,
      border: 1,
      borderColor: 'base.500',
      borderRadius: sizing.previewRadius,
      bgcolor: 'base.800',
      boxShadow: 'none',
      backdropFilter: 'blur(14px)',
    },
    '& .regional-summary-preview-popup .mapboxgl-popup-tip': {
      display: 'none',
    },
  }
}
