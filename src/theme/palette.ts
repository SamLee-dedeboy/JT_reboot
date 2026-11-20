export const palette = {
  brand: {
    base: '#253439',
    primaryBlue: '#51a2bd',
    primaryGreen: '#7ed957',
    // The home "What if?" panel: a deep, muted teal, dark enough that brand blue text on it
    // passes AA (4.6:1). It sits near base.500 in lightness and stands apart by hue.
    deepTeal: '#15333b',
  },
  common: { white: '#f2f0ef', black: '#1a1a1a' },
  accent: {
    blue: '#79e1e4',
    red: '#e03214',
    orange: '#f77c3b',
    // The score scale's "worse": a brick red, deeper and cooler than Recreation's
    // orange so a team and a score never share a hue; the lighter one is for text.
    brick: '#d6453d',
    brickText: '#f0665d',
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
    primaryGreenSubtle: 'rgba(126,217,87,0.08)',
    primaryBlueStrong: 'rgba(81,162,189,0.68)',
    primaryBlueGlow: 'rgba(81,162,189,0.80)',
    accentBlueBalanced: 'rgba(121,225,228,0.32)',
    accentBlueVibrant: 'rgba(121,225,228,0.52)',
    primaryPink: 'rgba(251,1,105,0.18)',
    orange: 'rgba(247,124,59,0.18)',
    orangeSubtle: 'rgba(247,124,59,0.10)',
    brickSubtle: 'rgba(214,69,61,0.10)',
    textShadow: 'rgba(16,22,24,0.6)',
    textShadowStrong: 'rgba(16,22,24,0.85)',
    blackShadow: 'rgba(0,0,0,0.18)',
    darkSurface: 'rgba(20,29,31,0.74)',
    cardShadow: 'rgba(16,22,24,0.45)',
  },
  border: {
    subtle: 'rgba(155,162,164,0.16)',
    default: 'rgba(155,162,164,0.24)',
    strong: 'rgba(155,162,164,0.40)',
  },
  // Team identity hues. Chosen outside the heavily used
  // brand green / blue-teal-cyan / magenta families and away from the score pair
  // (brand blue = good, brick red = unacceptable); >= ΔE 15 (OKLab) from those
  // site colors and mutually distinct incl. protan/deutan simulation.
  teams: {
    // Best-separated set found (teams >= ΔE 24 apart,
    // >= ΔE 19.7 under protan/deutan, >= ΔE 15.8 from the score blue/orange).
    envJustice: '#f0a8e8',
    // Moved from coral #ff7f5c to the old score orange (29 Oct 2026) when the score
    // scale took brick red; the separations above are not re-measured for it.
    // #f77c3b
    recreation: '#f87c4c',
    economy: '#7f86ff',
    // Fifth team (eco-cultural). Clear of the others to normal vision (>= ΔE 15);
    // ΔE ~7 from cobalt/score-blue under protan-deutan, which the per-team icons
    // and always-present labels cover as secondary encoding.
    ecoCultural: '#ffe6b0',
    ecology: '#ffb347',
    // Sixth team (water quality, draft criterion). A mint kept apart from the score
    // blue by hue; its separations from the set above are not yet measured.
    waterQuality: '#86d9a8',
  },
  // Governance page. The four Delta Adapts strategy areas (flood risk, ecosystems,
  // agriculture, water supply reliability) and the lead organizations' rose. On the
  // menu-panel ground (base.800), all five are >= ΔE 18 apart to normal vision and
  // >= 3:1 in contrast. The worst pair under CVD simulation is agriculture vs.
  // ecosystems at ΔE 8.0 (protan); the rose keeps >= ΔE 10.4 from every area. Water
  // supply and the rose sit lighter than the dark chart band (OKLCH L ~0.77). Charts
  // that use these colors always pair them with a labeled legend or the area's name, and
  // lead marks are squares on their own lanes.
  governance: {
    flood: '#5b6cf0',
    ecosystem: '#4fb06f',
    agriculture: '#d8bf42',
    waterSupply: '#79e1e4',
    lead: '#ff7f5c',
    leadLane: '#ff7f5c61',
  },
  // Upstream watershed restoration (NGW): one hue per landscape, each with the light
  // and middle steps of its minimal-to-maximum restoration ramp, and the red for losses.
  habitat: {
    forest: '#4fb06f',
    forestMid: '#7fc694',
    forestLight: '#b7d6bd',
    meadow: '#d8bf42',
    meadowMid: '#e3cf66',
    meadowLight: '#eee59a',
    floodplain: '#62b6d9',
    floodplainMid: '#86c5df',
    floodplainLight: '#b9ddec',
    // Floodplain marsh and riparian in the land-cover chart; the same blue as
    // brand.primaryBlue.
    marsh: '#51a2bd',
    loss: '#b9685e',
  },
  visualization: {
    // Single light neutral for monochrome chart series (9.9:1 on the card surface).
    neutral: '#c9cecf',
  },
  surface: 'rgba(81,93,97,0.30)',
  surfaceStrong: '#39474b',
  footerBg: '#343c40',
} as const
