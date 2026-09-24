export type PlaceIconKey = 'agriculture' | 'confluence' | 'map' | 'park' | 'place' | 'water'

export interface PlaceOfInterest {
  id: string
  name: string
  coordinates: [longitude: number, latitude: number]
  icon: PlaceIconKey
  color?: string
  description: string
  takeaway: string
}

const LOREM_WHY =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
const LOREM_TAKEAWAY =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'

/**
 * Editable map content. Add markers here. Region polygons are maintained in
 * RMA/data/region_of_interest_artwork.geojson. Icon names are resolved in
 * PlaceMarkerLayer.tsx.
 */
export const PLACES: PlaceOfInterest[] = [
  {
    id: 'central-delta',
    name: 'Central Delta',
    coordinates: [-121.65, 38.015],
    icon: 'water',
    description: LOREM_WHY,
    takeaway: LOREM_TAKEAWAY,
  },
  {
    id: 'confluence-zone',
    name: 'Confluence Zone',
    coordinates: [-121.89, 38.075],
    icon: 'confluence',
    description: LOREM_WHY,
    takeaway: LOREM_TAKEAWAY,
  },
  {
    id: 'montezuma-slough',
    name: 'Montezuma Slough',
    coordinates: [-122.0585761, 38.1307509],
    icon: 'water',
    description: LOREM_WHY,
    takeaway: LOREM_TAKEAWAY,
  },
  {
    id: 'san-pablo-bay',
    name: 'San Pablo Bay',
    coordinates: [-122.4, 38.04],
    icon: 'map',
    description: LOREM_WHY,
    takeaway: LOREM_TAKEAWAY,
  },
  {
    id: 'suisun-bay',
    name: 'Suisun Bay',
    coordinates: [-122.02, 38.08],
    icon: 'map',
    description: LOREM_WHY,
    takeaway: LOREM_TAKEAWAY,
  },
  {
    id: 'franks-tract',
    name: 'Franks Tract',
    coordinates: [-121.603692, 38.044411],
    icon: 'water',
    description: LOREM_WHY,
    takeaway: LOREM_TAKEAWAY,
  },
]
