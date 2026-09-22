export const palette = {
  brand: {
    base: '#253439',
    primaryBlue: '#51a2bd',
    primaryGreen: '#7ed957',
    primaryPink: '#fb0169',
  },
  common: { white: '#f2f0ef', black: '#1a1a1a' },
  accent: {
    blue: '#79e1e4',
    red: '#e03214',
    orange: '#f77c3b',
    yellow: '#f2c820',
    purple: '#b280ff',
    pink: '#ff677d',
    indigo: '#5b6cf0',
  },
  salinity: { pink: '#fb0169', teal: '#77d6d7' },
  base: {
    50: '#e9ebeb',
    100: '#bbc0c2',
    200: '#9ba2a4',
    300: '#6d777a',
    400: '#515d61',
    500: '#253439',
    600: '#222f34',
    700: '#1a2528',
    800: '#141d1f',
    900: '#101618',
  },
  translucent: {
    50: 'rgba(242,240,239,0.04)',
    100: 'rgba(242,240,239,0.08)',
    200: 'rgba(187,192,194,0.12)',
    300: 'rgba(155,162,164,0.16)',
    400: 'rgba(155,162,164,0.22)',
    500: 'rgba(81,93,97,0.30)',
    600: 'rgba(37,52,57,0.55)',
    700: 'rgba(20,29,31,0.76)',
    800: 'rgba(16,22,24,0.82)',
    900: 'rgba(16,22,24,0.96)',
    primaryGreen: 'rgba(126,217,87,0.18)',
    primaryBlue: 'rgba(81,162,189,0.15)',
    primaryBlueSubtle: 'rgba(81,162,189,0.10)',
    primaryBlueStrong: 'rgba(81,162,189,0.68)',
    primaryBlueGlow: 'rgba(81,162,189,0.80)',
    accentBlueBalanced: 'rgba(121,225,228,0.32)',
    accentBlueVibrant: 'rgba(121,225,228,0.52)',
    primaryPink: 'rgba(251,1,105,0.18)',
    orange: 'rgba(247,124,59,0.18)',
    textShadow: 'rgba(16,22,24,0.6)',
    blackShadow: 'rgba(0,0,0,0.18)',
    darkSurface: 'rgba(20,29,31,0.74)',
    cardShadow: 'rgba(16,22,24,0.45)',
  },
  border: {
    subtle: 'rgba(155,162,164,0.16)',
    default: 'rgba(155,162,164,0.24)',
    strong: 'rgba(155,162,164,0.40)',
  },
  // Data-only hues for team identity in charts. Chosen outside the heavily used
  // brand green / blue-teal-cyan / magenta families and away from the score pair
  // (brand blue = good, accent orange = unacceptable); >= ΔE 15 (OKLab) from those
  // site colors and mutually distinct incl. protan/deutan simulation.
  dataViz: {
    // Team palette ("Color"): best-separated set found (teams >= ΔE 24 apart,
    // >= ΔE 19.7 under protan/deutan, >= ΔE 15.8 from the score blue/orange).
    gold: '#efbd24',
    orchid: '#f69efe',
    clay: '#ae6259',
    cobalt: '#586de3',
    // Single light neutral for every team (9.9:1 on the card surface)
    neutral: '#c9cecf',
  },
  surface: 'rgba(81,93,97,0.30)',
  surfaceStrong: '#39474b',
  footerBg: '#343c40',
} as const

export type JtPalette = typeof palette
