import { jtSpacing } from '@/theme'

/** Each section of the evaluation page sits in the grid's second column, below the sticky navbar. */
export const sectionSx = {
  gridColumn: { lg: 2 },
  scrollMarginTop: 110,
  p: { xs: jtSpacing.component.lg, md: jtSpacing.component.xl },
} as const
