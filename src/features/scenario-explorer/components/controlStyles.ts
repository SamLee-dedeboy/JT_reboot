// Style objects shared by the explorer's controls; the components live in controls.tsx.
import type { SxProps, Theme } from '@mui/material/styles'
import { explorerControl } from '../../../theme'
import { focusRing } from '../../../ui/focusRing'

/** The dropdown list every explorer select opens. */
export const selectMenuProps = {
  slotProps: {
    paper: {
      sx: { bgcolor: 'base.700', border: 1, borderColor: 'border.strong' },
    },
  },
} as const

export const menuItemSx = (color: 'brand.primaryBlue' | 'brand.primaryGreen' | 'common.white') =>
  ({
    typography: 'controlValue',
    color,
    '&.Mui-selected': { bgcolor: 'translucent.100', color },
    '&&:hover, &&.Mui-selected:hover': {
      bgcolor: 'translucent.primaryGreen',
      color: 'text.primary',
    },
  }) as const

/** An icon button's glyph, at the controls' small size. */
export const smallIconSx = {
  '& .MuiSvgIcon-root': { height: explorerControl.iconSize, width: explorerControl.iconSize },
} as const

/** One choice from a few, for a `ToggleButtonGroup`: the chosen option filled with the green. */
export const segmentedSx: SxProps<Theme> = {
  border: 1,
  borderColor: 'border.strong',
  borderRadius: explorerControl.pillRadius,
  display: 'inline-flex',
  gap: explorerControl.inset,
  height: explorerControl.height,
  maxWidth: '100%',
  p: explorerControl.inset,
  width: { xs: '100%', sm: 'fit-content' },
  '&& .MuiToggleButton-root': {
    typography: 'controlValue',
    border: 0,
    borderRadius: explorerControl.pillRadius,
    color: 'common.white',
    flex: '1 1 auto',
    m: 0,
    px: 1.25,
    py: 0,
    transition: 'background-color 160ms ease, color 160ms ease',
    whiteSpace: 'nowrap',
    '&:hover': { bgcolor: 'translucent.primaryGreen' },
    '&.Mui-focusVisible': focusRing,
    '&.Mui-selected, &.Mui-selected:hover': { bgcolor: 'primary.main', color: 'common.black' },
  },
}

/** A scenario that can be shown or hidden; the selected scenario stays on, in green. */
export const overlayChipSx = (primary: boolean, compact: boolean): SxProps<Theme> => ({
  '&&': {
    typography: 'controlValue',
    border: 1,
    borderColor: 'border.default',
    borderRadius: explorerControl.pillRadius,
    color: 'base.200',
    gap: 0.25,
    height: compact ? explorerControl.chipHeight : explorerControl.height,
    pl: 0.75,
    pr: 1,
    ...(compact && { justifyContent: 'flex-start', width: '100%' }),
    py: 0,
    transition: 'background-color 160ms ease, border-color 160ms ease',
    whiteSpace: 'nowrap',
    ...smallIconSx,
    '&:hover': { bgcolor: 'translucent.100' },
    '&.Mui-focusVisible': focusRing,
    '&.Mui-selected, &.Mui-selected:hover': primary
      ? { bgcolor: 'translucent.primaryGreen', borderColor: 'primary.main', color: 'primary.main' }
      : { bgcolor: 'translucent.100', borderColor: 'border.strong', color: 'common.white' },
    '&.Mui-disabled': { borderStyle: 'dashed', color: 'base.300' },
  },
})
