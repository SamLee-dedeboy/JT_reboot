import type { CSSProperties } from 'react'
import type { chart } from './chart'
import type { coDesign } from './coDesign'
import type { map } from './map'
import type { palette } from './palette'
import type { jtSpacing } from './spacing'
import type { highlighter, logoWordmark, navigation, numbering } from './theme'

declare module '@mui/material/styles' {
  interface TypographyVariants {
    captionSmall: CSSProperties
    eyebrow: CSSProperties
    logo: CSSProperties
    logoHero: CSSProperties
    editorialEmphasis: CSSProperties
    cardTitle: CSSProperties
    cardBody: CSSProperties
    meta: CSSProperties
    controlLabel: CSSProperties
    navigationLabel: CSSProperties
    displayNumber: CSSProperties
    accentCardTitle: CSSProperties
    scenarioPanelTitle: CSSProperties
    footerLogo: CSSProperties
    chartTitle: CSSProperties
    chartLabel: CSSProperties
    chartColumnHead: CSSProperties
    chartAxis: CSSProperties
    chartValue: CSSProperties
    chartValueLarge: CSSProperties
    numberGhost: CSSProperties
    numberArticle: CSSProperties
    numberTimeline: CSSProperties
    numberBadge: CSSProperties
  }
  type TypographyVariantsOptions = Partial<TypographyVariants>
  interface Palette {
    accent: typeof palette.accent
    base: typeof palette.base
    brand: typeof palette.brand
    salinity: typeof palette.salinity
    translucent: typeof palette.translucent
    border: typeof palette.border
    dataViz: typeof palette.dataViz
    surface: string
    surfaceStrong: string
    footerBg: string
  }
  interface PaletteOptions {
    accent?: typeof palette.accent
    base?: typeof palette.base
    brand?: typeof palette.brand
    salinity?: typeof palette.salinity
    translucent?: typeof palette.translucent
    border?: typeof palette.border
    dataViz?: typeof palette.dataViz
    surface?: string
    surfaceStrong?: string
    footerBg?: string
  }
  interface Theme {
    jtSpacing: typeof jtSpacing
    numbering: typeof numbering
    highlighter: typeof highlighter
    navigation: typeof navigation
    logoWordmark: typeof logoWordmark
    map: typeof map
    chart: typeof chart
    coDesign: typeof coDesign
  }
  interface ThemeOptions {
    jtSpacing?: typeof jtSpacing
    numbering?: typeof numbering
    highlighter?: typeof highlighter
    navigation?: typeof navigation
    logoWordmark?: typeof logoWordmark
    map?: typeof map
    chart?: typeof chart
    coDesign?: typeof coDesign
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    captionSmall: true
    eyebrow: true
    logo: true
    logoHero: true
    editorialEmphasis: true
    cardTitle: true
    cardBody: true
    meta: true
    controlLabel: true
    navigationLabel: true
    displayNumber: true
    accentCardTitle: true
    scenarioPanelTitle: true
    footerLogo: true
    chartTitle: true
    chartLabel: true
    chartColumnHead: true
    chartAxis: true
    chartValue: true
    chartValueLarge: true
    numberGhost: true
    numberArticle: true
    numberTimeline: true
    numberBadge: true
  }
}

export {}
