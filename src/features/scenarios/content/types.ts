export interface ScenarioChapter {
  title: string
  navigationLabel?: string
  paragraphs: string[]
  highlights?: Array<{
    title: string
    summary: string
    paragraphs: string[]
    mapHabitatType?: 'soil' | 'transitional' | 'tidal' | 'riparian'
    exploreHabitat?: 'forest' | 'meadow' | 'floodplain'
    mapSelectionKey?: string
  }>
  endingParagraphs?: string[]
  subsections?: Array<{
    id?: string
    title: string
    paragraphs: string[]
    orderedItems?: string[]
  }>
  highlightsAction?: {
    label: string
    href: string
  }
  primaryAction?: {
    label: string
    href: string
  }
}

export interface ScenarioContent {
  slug: string
  number: string
  title: string
  image: string
  summary: string
  story: ScenarioChapter[]
  mapFeatures: string[]
  comparisonNote?: string
}
