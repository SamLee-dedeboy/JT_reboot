/**
 * What an adaptation chapter does in the shared reading order: key benefits first, then
 * motivation and design approach, then any supporting strategy or eco-cultural chapter.
 */
export type ChapterRole = 'keyBenefits' | 'motivation' | 'design' | 'supporting' | 'ecocultural'

export interface ScenarioChapter {
  title: string
  navigationLabel?: string
  /** Set on adaptation chapters; orders them and names their rail entry and anchor. */
  role?: ChapterRole
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
  /** Secondary links at the end of a chapter, e.g. to related scenarios. */
  relatedLinks?: Array<{
    label: string
    href: string
  }>
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
