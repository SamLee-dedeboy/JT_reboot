/** Keyboard focus, shared by every breakout control and clickable cell. */
export const focusRing = {
  outline: 2,
  outlineStyle: 'solid',
  outlineColor: 'primary.main',
  outlineOffset: 2,
} as const

/**
 * The page's side margin. The site's page margin is set for a wide screen; on a
 * laptop the table needs that width more, so it narrows until xl.
 */
export const pageX = { xs: 6, sm: 8, md: 2, xl: 10 } as const

/** Every card this table opens beside the thing clicked: the ranking info, places, a cell. */
export const popoverPaperSx = {
  maxWidth: 400,
  p: 2,
  bgcolor: 'base.700',
  border: 1,
  borderColor: 'border.default',
  borderRadius: 1,
} as const
