import { jtSpacing } from '../../../theme'

/** Bordered panel used for definitions, metric results, and scenario cards. */
export const evaluationCardSx = {
  p: jtSpacing.component.md,
  border: 1,
  borderColor: 'border.subtle',
  borderRadius: 1,
  bgcolor: 'translucent.100',
} as const
