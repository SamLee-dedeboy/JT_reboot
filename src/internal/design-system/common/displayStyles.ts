import { jtSpacing } from '../../../theme'
import type { Theme } from '@mui/material/styles'

export const themeSafeGap = { xs: jtSpacing.gap.md, md: jtSpacing.gap.lg }

const themeRadius = (theme: Theme) => `${theme.shape.borderRadius}px`
const specimenRadius = (theme: Theme) =>
  `0 ${theme.shape.borderRadius}px ${theme.shape.borderRadius}px 0`

export const displayGroupSx = {
  display: 'grid',
  gap: themeSafeGap,
  p: { xs: jtSpacing.component.sm, md: jtSpacing.component.md },
  border: 1,
  borderStyle: 'solid',
  borderColor: 'divider',
  borderRadius: themeRadius,
  bgcolor: 'surface',
} as const

export const displayGroupHeaderSx = {
  display: 'grid',
  gap: jtSpacing.gap.xs,
  pb: jtSpacing.component.sm,
  borderBottom: 1,
  borderColor: 'divider',
} as const

export const displayItemSx = {
  display: 'grid',
  gap: jtSpacing.gap.sm,
  bgcolor: 'surfaceStrong',
  border: 1,
  borderStyle: 'solid',
  borderColor: 'divider',
  borderLeftWidth: 4,
  borderLeftColor: 'primary.main',
  borderRadius: specimenRadius,
  p: { xs: jtSpacing.component.sm, md: jtSpacing.component.md },
} as const

export const displayMetaSx = {
  p: jtSpacing.component.sm,
  borderRadius: themeRadius,
  bgcolor: 'base.700',
} as const
