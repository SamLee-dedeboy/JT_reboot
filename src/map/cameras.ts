// Every camera position the public site's maps use, grouped by page. Change a view here;
// the pages only decide when to move to it. Framings worked out from the data (fitting a
// scenario's places or a region's stations) stay with their pages, but their zoom limits
// live here.
import type { ScenariosBackgroundMapStep } from './background/ScenariosBackgroundLayers'

export interface MapViewState {
  longitude: number
  latitude: number
  zoom: number
  bearing?: number
  pitch?: number
}

/** [[west, south], [east, north]] */
export type MapBounds = [[number, number], [number, number]]

/* ---------------------------------------------------------------------------------- */
/* Shared views: used by more than one page                                           */
/* ---------------------------------------------------------------------------------- */

/** Where a map starts when it fits its bounds at once, so the start is never seen. */
export const DELTA_START_VIEW: MapViewState = { longitude: -121.73, latitude: 38.04, zoom: 8.75 }

/** The Bay and the Delta together, from the Golden Gate to the eastern stations. */
export const BAY_DELTA_BOUNDS: MapBounds = [
  [-122.62, 37.31],
  [-121.2, 38.69],
]

/** Close on Franks Tract, where Bolster & Fortify's gates and levees are. */
export const FRANKS_TRACT_BOUNDS: MapBounds = [
  [-121.61, 38.01],
  [-121.56, 38.08],
]

/** All of New Green Watershed's restored areas, Eco Machine's two among them. */
export const RESTORED_AREAS_BOUNDS: MapBounds = [
  [-122.32, 37.72],
  [-121.27, 38.6],
]

/* ---------------------------------------------------------------------------------- */
/* Home hero and screensaver                                                          */
/* ---------------------------------------------------------------------------------- */

/** Suisun Bay, centered behind the home page title. */
export const HERO_CENTER = { longitude: -122.05, latitude: 38.08 }

/** The hero zoom at each MUI breakpoint. */
export const HERO_ZOOM_BY_BREAKPOINT = {
  xs: 9.15,
  sm: 9.45,
  md: 9.75,
  lg: 10,
  xl: 10.25,
} as const

/* ---------------------------------------------------------------------------------- */
/* Background page (/scenarios/background-context)                                     */
/* ---------------------------------------------------------------------------------- */

/** One tilted view per step of the page; the map opens on the overview. */
export const BACKGROUND_CAMERA_BY_STEP: Record<
  ScenariosBackgroundMapStep,
  Required<MapViewState>
> = {
  overview: { longitude: -121.82, latitude: 38.06, zoom: 8.75, pitch: 18, bearing: -8 },
  rivers: { longitude: -121.78, latitude: 38.11, zoom: 9.15, pitch: 22, bearing: -12 },
  flow: { longitude: -121.71, latitude: 37.94, zoom: 9.45, pitch: 24, bearing: -10 },
  x2: { longitude: -121.99, latitude: 38.04, zoom: 9.72, pitch: 20, bearing: -8 },
}

/* ---------------------------------------------------------------------------------- */
/* Scenario story maps (StoryPage), used by scenarios/config.ts                 */
/* ---------------------------------------------------------------------------------- */

/** How far a reader can pan: California. */
export const STORY_MAX_BOUNDS: MapBounds = [
  [-124.6, 32.4],
  [-114, 42.1],
]

/** Each adaptation scenario opens on a view with all of its features in it. */
export const STORY_BOUNDS = {
  /** The default: the whole Delta. */
  delta: [
    [-122.25, 37.55],
    [-121.25, 38.65],
  ],
  /** Tiered Outflows. */
  bayDelta: BAY_DELTA_BOUNDS,
  ecoMachine: [
    [-122.18, 38.0],
    [-121.52, 38.28],
  ],
  newGreenWatershed: RESTORED_AREAS_BOUNDS,
  /** New Green Watershed's statewide steps. */
  watershedOverview: [
    [-123.6, 33.4],
    [-119.1, 42.1],
  ],
  bolster: [
    [-121.64, 37.82],
    [-121.5, 38.1],
  ],
  /** Bolster & Fortify, when a reader picks the gates or the levees: close on Franks Tract. */
  bolsterSelection: FRANKS_TRACT_BOUNDS,
  tunnel: [
    [-121.72, 37.72],
    [-121.31, 38.44],
  ],
  callingOnReserves: [
    [-122.85, 37.95],
    [-121.1, 41.4],
  ],
} satisfies Record<string, MapBounds>

/* ---------------------------------------------------------------------------------- */
/* Modeling overview (/scenarios/modeling)                                             */
/* ---------------------------------------------------------------------------------- */

export const MODELING_CAMERAS = {
  stationMap: BAY_DELTA_BOUNDS,
  /** Eco Machine and New Green Watershed share one view, so the two maps compare. */
  restoredAreas: RESTORED_AREAS_BOUNDS,
  bolsterGates: FRANKS_TRACT_BOUNDS,
  /**
   * The Bolster map is a short strip: this much side padding keeps Franks Tract from
   * filling it edge to edge.
   */
  bolsterGatesPadding: 48,
}

/* ---------------------------------------------------------------------------------- */
/* Scenario Explorer (/explore)                                                        */
/* ---------------------------------------------------------------------------------- */

/** The explorer map's opening frame. */
export const EXPLORER_BOUNDS: MapBounds = [
  [-122.82, 37.8],
  [-121.1, 38.36],
]

/* ---------------------------------------------------------------------------------- */
/* Regional summary: the results page and the kiosk explorer                           */
/* ---------------------------------------------------------------------------------- */

/** The start before the scenario's places load and the map fits them. */
export const REGIONAL_OVERVIEW: MapViewState = { longitude: -121.96, latitude: 38.06, zoom: 9.5 }

/** The closest a fit to a scenario's places may zoom. */
export const REGIONAL_OVERVIEW_MAX_ZOOM = 11.5

/** The view for each step of a scenario's strategy guide, by scenario slug. */
export const REGIONAL_STRATEGY_CAMERAS: Record<string, MapViewState[]> = {
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

/** Kiosk explorer: a scenario's opening view, where fitting its places would frame it badly. */
export const REGIONAL_WELCOME_BOUNDS: Record<string, MapBounds> = {
  'bolster-and-fortify': [
    [-122.67, 37.95],
    [-121.18, 38.05],
  ],
}

/** Kiosk explorer, Bolster & Fortify: where each step of the strategy guide flies. */
export const REGIONAL_BOLSTER_BOUNDS = {
  /** Steps one and two (gates, levees): both footprints on Franks Tract. */
  franksTract: [
    [-121.591647, 38.029868],
    [-121.581838, 38.063663],
  ],
  /** Step three: the freshwater pathway south to Clifton Court. */
  freshwaterPathway: [
    [-121.584181, 37.851688],
    [-121.555849, 38.07381],
  ],
} satisfies Record<string, MapBounds>

/** The small map on a region's pattern page, before it fits the region's stations. */
export const REGIONAL_PATTERN_ZOOM = {
  /** Freshwater regions cover more ground, so they start wider. */
  freshwater: 9.7,
  place: 11.2,
  /** The fit to the stations: no closer than this… */
  fitMaxZoom: 12,
  /** …then steps out this far, for context… */
  fitZoomOut: 0.8,
  /** …but never wider than this. */
  minZoom: 7.5,
}
