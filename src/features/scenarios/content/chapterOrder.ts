import type { ChapterRole, ScenarioChapter, ScenarioContent } from './types'

/** Shared reading order for adaptation scenarios: the outcome first, then how it is built. */
const roleOrder: ChapterRole[] = [
  'keyBenefits',
  'motivation',
  'design',
  'supporting',
  'ecocultural',
]

/** Rail labels and section anchors per role; map scroll triggers key off these anchors. */
export const chapterRoles: Record<ChapterRole, { label: string; anchor: string }> = {
  keyBenefits: { label: 'Key benefits', anchor: 'key-benefits' },
  motivation: { label: 'Motivation', anchor: 'motivation' },
  design: { label: 'Design approach', anchor: 'design-approach' },
  supporting: { label: 'Supporting strategy', anchor: 'supporting-strategy' },
  ecocultural: { label: 'Eco-cultural', anchor: 'eco-cultural' },
}

export interface OrderedChapter {
  chapter: ScenarioChapter
  /** Section id: the role's anchor, or `chapter-N` for chapters without a role. */
  anchor: string
  /** Rail label: the role's label, or the chapter's own navigation label or title. */
  label: string
}

/** A scenario's chapters in reading order, with the anchor and rail label for each. */
export function storyInReadingOrder(scenario: ScenarioContent): OrderedChapter[] {
  const withPosition = scenario.story.map((chapter, index) => ({ chapter, index }))
  const ordered = scenario.story.some((chapter) => chapter.role)
    ? [...withPosition].sort(
        (a, b) =>
          roleOrder.indexOf(a.chapter.role ?? 'ecocultural') -
            roleOrder.indexOf(b.chapter.role ?? 'ecocultural') || a.index - b.index,
      )
    : withPosition
  return ordered.map(({ chapter, index }) => ({
    chapter,
    anchor: chapter.role ? chapterRoles[chapter.role].anchor : `chapter-${index + 1}`,
    label: chapter.role
      ? chapterRoles[chapter.role].label
      : (chapter.navigationLabel ?? chapter.title),
  }))
}
