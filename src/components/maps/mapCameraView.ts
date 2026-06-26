export interface MapViewState {
  longitude: number;
  latitude: number;
  zoom: number;
  bearing?: number;
  pitch?: number;
}

export const DELTA_MAP_STYLE = 'mapbox://styles/justtransition/cmo0kote1006j01st023g37ga';
export const HERO_MAP_STYLE = 'mapbox://styles/justtransition/cmqa9drzx000p01rh2s259fpn';

export const DELTA_INITIAL_VIEW_STATE: MapViewState = {
  longitude: -121.95,
  latitude: 37.95,
  zoom: 9.5,
};

export const SUISUN_BAY_CENTER = {
  longitude: -122.05,
  latitude: 38.08,
};

export const fillParentStyle = {
  width: '100%',
  height: '100%',
} as const;
