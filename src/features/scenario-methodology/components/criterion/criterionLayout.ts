// The rail and the layout every section of a criterion page shares.
import { jtSpacing } from '@/theme'
import { type CriterionStory } from '@/content/criteria'

/** Sections listed in the page rail; ids match the section elements below. */
export const pageSections = [
  { id: 'what', label: 'What is this criterion?' },
  { id: 'why', label: 'Why does it matter?' },
  { id: 'regions', label: 'Which regions does it cover?' },
  { id: 'components', label: 'What are its components?' },
  { id: 'construction', label: 'How was it constructed?' },
  { id: 'references', label: 'References' },
]

/** Clears the sticky navbar and team tabs when a section is scrolled to. */
export const sectionSx = { scrollMarginTop: 150 } as const

/** Standalone prose, at the same measure as the evaluation overview's intro. */
export const methodologyTextColumnSx = { maxWidth: '100ch' } as const

/** The Why and Regions sections share one grid: text on the left, its visual on the right. */
export const criterionSplitSx = {
  display: 'grid',
  gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'minmax(0, 5fr) minmax(0, 7fr)' },
  columnGap: jtSpacing.section.md,
  rowGap: jtSpacing.gap.lg,
  alignItems: 'start',
} as const

export interface SectionProps {
  story: CriterionStory
  accent: string
}
