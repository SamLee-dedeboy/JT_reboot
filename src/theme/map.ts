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
    newGreenWatershedHabitats: {
      soil: '#453caf',
      transitional: '#7187e1',
      tidal: '#5862d2',
      riparian: '#dcb038',
      fallback: palette.common.black,
      outline: palette.common.black,
    },
  },
  labels: {
    text: palette.common.white,
    muted: palette.base[100],
    halo: palette.base[900],
  },
  background: palette.base[900],
  overlay: palette.translucent[800],
} as const
