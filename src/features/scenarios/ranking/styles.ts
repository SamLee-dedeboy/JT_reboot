// Styles the ranking page and its charts share.
import { jtSpacing } from '../../../theme'

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
