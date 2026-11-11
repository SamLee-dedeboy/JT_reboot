// Styles shared across the Future Scenarios pages: modeling, evaluation, ranking.
import { jtSpacing } from '../../theme'

/** One color per water year type, in every timeline on the modeling page, lighter for wetter years. */
export const waterYearColor = {
  wet: 'base.400',
  dry: 'base.500',
  critical: 'base.600',
} as const

/** Paints a section band edge to edge while its content stays in the page grid. */
export const fullBleedBand = (color: string) => ({
  backgroundColor: color,
  boxShadow: `0 0 0 100vmax ${color}`,
  clipPath: 'inset(0 -100vmax)',
})

/** A rank or list number (1st, 01…): the brand green, set in from the row's edge. */
export const RANK_LABEL = { color: 'primary.main', pl: jtSpacing.gap.sm } as const

/** A card that makes a choice: filled green once chosen, dark and outlined until then. */
export const choiceCardSx = (active: boolean) => ({
  border: 1,
  borderColor: active ? 'primary.main' : 'border.strong',
  bgcolor: active ? 'primary.main' : 'translucent.darkSurface',
  color: active ? 'common.black' : 'common.white',
  '&:hover, &:focus-visible': active
    ? { outline: 'none' }
    : { bgcolor: 'translucent.primaryGreen', borderColor: 'primary.main', outline: 'none' },
})

/** Bordered panel used for definitions, metric results, and scenario cards. */
export const evaluationCardSx = {
  p: jtSpacing.component.md,
  border: 1,
  borderColor: 'border.subtle',
  borderRadius: 1,
  bgcolor: 'translucent.100',
} as const
