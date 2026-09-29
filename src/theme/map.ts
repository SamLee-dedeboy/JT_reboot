import { palette } from './palette'

export const map = {
  markers: {
    station: palette.accent.orange,
    selected: palette.accent.yellow,
    comparison: palette.brand.primaryBlue,
    stroke: palette.common.white,
  },
  waterways: {
    sacramento: palette.brand.primaryGreen,
    sanJoaquin: palette.accent.blue,
  },
  boundaries: {
    legalDelta: palette.base[50],
    watershedShade: {
      fill: palette.brand.base,
      outline: '#5a636c',
    },
    watershedRegion: palette.brand.primaryGreen,
    indigenousTerritory: palette.accent.yellow,
  },
  scenarios: {
    layerFadeDurationMs: 500,
    newGreenWatershedSubsidence: {
      elevation0: 'rgba(0,0,0,0)',
      elevationMinus5: 'rgba(96,120,128,0.2)',
      elevationMinus10: 'rgba(96,120,128,0.4)',
      elevationMinus15: 'rgba(96,120,128,0.6)',
      elevationMinus20: 'rgba(96,120,128,0.8)',
      elevationMinus25: '#607880',
    },
    newGreenWatershedHabitats: {
      soil: '#453caf',
      transitional: '#7187e1',
      tidal: '#5862d2',
      riparian: '#dcb038',
      fallback: palette.common.black,
      outline: palette.common.black,
    },
  },
  salinityAnimation: {
    frameIntervalMs: 300,
    fresh: '#7ed2e1',
    oligohalineLow: '#69b6ca',
    oligohalineHigh: '#559ab4',
    mesohaline: '#407e9d',
    polyhaline: '#2c6287',
    euhaline: '#174670',
  },
  labels: {
    text: palette.common.white,
    muted: palette.base[100],
    halo: palette.base[900],
  },
  // Mirrors the Mapbox Studio basemaps so the offline exhibit map matches online.
  offlineBasemap: {
    land: '#333333',
    landuse: 'hsl(0, 2%, 15%)',
    road: 'hsl(0, 0%, 24%)',
    // The scenario explorer's (Artwork) water, used by every offline map.
    water: 'hsl(195, 14%, 44%)',
    roadLabel: 'hsl(0, 0%, 66%)',
    // Label colors step from most to least prominent settlement rank.
    settlementMajorLabel: ['#737373', '#616161', '#3d3d3d'],
    settlementMinorLabel: ['hsl(0, 0%, 66%)', 'hsl(0, 0%, 53%)', 'hsl(0, 0%, 47%)'],
    waterLabel: '#c4c4c4',
    waterwayLabel: 'hsl(0, 0%, 77%)',
    labelHalo: 'hsl(0, 0%, 3%)',
    waterLabelHalo: 'rgba(36, 51, 56, 0.75)',
  },
  background: palette.base[900],
  overlay: palette.translucent[800],
} as const
