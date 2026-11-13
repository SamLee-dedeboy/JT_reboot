import type { CSSProperties } from 'react'
import type { chart } from './chart'
import type { coDesign } from './coDesign'
import type { map } from './map'
import type { palette } from './palette'
import type { jtSpacing } from './spacing'
import type {
  explorerControl,
  highlighter,
  logoWordmark,
  navigation,
  numbering,
  ranking,
} from './theme'

declare module '@mui/material/styles' {
  interface TypographyVariants {
    bodyLarge: CSSProperties
    captionSmall: CSSProperties
    placeholderNote: CSSProperties
    columnHead: CSSProperties
    eyebrow: CSSProperties
    logo: CSSProperties
    logoHero: CSSProperties
    editorialEmphasis: CSSProperties
    cardTitle: CSSProperties
    cardBody: CSSProperties
    meta: CSSProperties
    controlLabel: CSSProperties
    controlValue: CSSProperties
    navigationLabel: CSSProperties
    navigationSubLabel: CSSProperties
    navigationShortcut: CSSProperties
    captionProse: CSSProperties
    controlValueSelected: CSSProperties
    chipLabel: CSSProperties
    chipQualifier: CSSProperties
    factDate: CSSProperties
    citationMark: CSSProperties
    statNumberCompact: CSSProperties
    statInline: CSSProperties
    chapterTitle: CSSProperties
    displayNumber: CSSProperties
    statNumber: CSSProperties
    accentCardTitle: CSSProperties
    scenarioPanelTitle: CSSProperties
    footerLogo: CSSProperties
    chartTitle: CSSProperties
    chartUnit: CSSProperties
    cardHeading: CSSProperties
    chartLabel: CSSProperties
    chartSentenceValue: CSSProperties
    tableValueStrong: CSSProperties
    sentenceValueLarge: CSSProperties
    chartAxis: CSSProperties
    chartValue: CSSProperties
    chartValueLarge: CSSProperties
    statValue: CSSProperties
    numberGhost: CSSProperties
    numberArticle: CSSProperties
    numberRank: CSSProperties
    numberScore: CSSProperties
    takeawayScenario: CSSProperties
    takeawayLead: CSSProperties
    takeawayBody: CSSProperties
    takeawayBodyStrong: CSSProperties
    takeawayLabel: CSSProperties
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
    teams: typeof palette.teams
    visualization: typeof palette.visualization
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
    teams?: typeof palette.teams
    visualization?: typeof palette.visualization
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
    ranking: typeof ranking
    explorerControl: typeof explorerControl
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
    ranking?: typeof ranking
    explorerControl?: typeof explorerControl
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    bodyLarge: true
    captionSmall: true
    placeholderNote: true
    columnHead: true
    eyebrow: true
    logo: true
    logoHero: true
    editorialEmphasis: true
    cardTitle: true
    cardBody: true
    meta: true
    controlLabel: true
    controlValue: true
    navigationLabel: true
    navigationSubLabel: true
    navigationShortcut: true
    captionProse: true
    controlValueSelected: true
    chipLabel: true
    chipQualifier: true
    factDate: true
    citationMark: true
    statNumberCompact: true
    statInline: true
    chapterTitle: true
    displayNumber: true
    statNumber: true
    accentCardTitle: true
    scenarioPanelTitle: true
    footerLogo: true
    chartTitle: true
    chartUnit: true
    cardHeading: true
    chartLabel: true
    chartSentenceValue: true
    tableValueStrong: true
    sentenceValueLarge: true
    chartAxis: true
    chartValue: true
    chartValueLarge: true
    statValue: true
    numberGhost: true
    numberArticle: true
    numberRank: true
    numberScore: true
    takeawayScenario: true
    takeawayLead: true
    takeawayBody: true
    takeawayBodyStrong: true
    takeawayLabel: true
    numberTimeline: true
    numberBadge: true
  }
}

export {}
