import type { LngLatBoundsLike } from 'mapbox-gl'

export const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN
export const MAP_STYLE = 'mapbox://styles/justtransition/cmreic454000z01sle8uh6v7n'

// Geographic extent shown in the supplied Bay–Delta reference image.
// Mapbox calculates the appropriate center and zoom for the current viewport.
export const REFERENCE_BOUNDS: LngLatBoundsLike = [
  [-122.82, 37.8],
  [-121.1, 38.36],
]
