// Surface styles more than one feature uses: a full-bleed band, a choice card, a bordered panel.
import type { Theme } from '@mui/material/styles'
import { jtSpacing } from '@/theme'

/** Paints a section band edge to edge while its content stays in the page grid. */
export const fullBleedBand = (color: string) => ({
  backgroundColor: color,
  boxShadow: `0 0 0 100vmax ${color}`,
  clipPath: 'inset(0 -100vmax)',
})

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

/**
 * A card raised off the ground: surface fill, a visible edge and a soft shadow. Hover lifts it
 * and turns the edge green; give the media inside it the `raised-card-media` class to zoom it.
 */
export const raisedCardSx = {
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0,
  height: '100%',
  overflow: 'hidden',
  bgcolor: 'surface',
  border: 1,
  borderColor: 'border.default',
  borderRadius: 2,
  boxShadow: (theme: Theme) => `0 12px 28px ${theme.palette.translucent.cardShadow}`,
  transition: 'transform 240ms ease, border-color 240ms ease, box-shadow 240ms ease',
  '& .raised-card-media': { transition: 'transform 480ms cubic-bezier(0.22, 1, 0.36, 1)' },
  '&:hover, &:focus-within': {
    transform: 'translateY(-4px)',
    borderColor: 'translucent.primaryGreen',
    boxShadow: (theme: Theme) => theme.navigation.dropdownShadow,
  },
  '&:hover .raised-card-media': { transform: 'scale(1.04)' },
  '@media (prefers-reduced-motion: reduce)': {
    transition: 'none',
    '&:hover, &:focus-within': { transform: 'none' },
    '&:hover .raised-card-media': { transform: 'none' },
  },
} as const

/** Bordered panel used for definitions, metric results, and scenario cards. */
export const borderedPanelSx = {
  p: jtSpacing.component.md,
  border: 1,
  borderColor: 'border.subtle',
  borderRadius: 1,
  bgcolor: 'translucent.100',
} as const
