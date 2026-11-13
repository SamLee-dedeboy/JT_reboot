// Style objects shared by the explorer's controls; the components live in controls.tsx.
import type { SxProps, Theme } from '@mui/material/styles'
import { explorerControl, navigation } from '@/theme'
import { focusRing } from '@/ui/focusRing'

/**
 * The dropdown list every explorer select opens: the site's menu panel (base.800, rounded,
 * shadowed) a little below the field, its rows inset so each one has its own rounded hover.
 */
export const selectMenuProps = {
  slotProps: {
    paper: {
      sx: {
        bgcolor: navigation.menuPanelBackground,
        backgroundImage: 'none',
        border: 1,
        borderColor: 'border.default',
        borderRadius: navigation.panelRadius,
        boxShadow: navigation.dropdownShadow,
        mt: 0.5,
      },
    },
    list: {
      sx: { display: 'flex', flexDirection: 'column', gap: 0.25, p: 0.75 },
    },
  },
} as const

/**
 * One option in an explorer dropdown: white on the panel, whatever role the field has. The chosen
 * option is bold with a green check at the end, not a filled row; hover is a light green tint.
 */
export const menuItemSx = {
  typography: 'controlValue',
  color: 'common.white',
  minHeight: 40,
  px: 1.5,
  py: 1,
  borderRadius: 0.5,
  display: 'flex',
  justifyContent: 'space-between',
  gap: 1.5,
  transition: 'background-color 160ms ease',
  '&&:hover': { bgcolor: 'translucent.primaryGreenSubtle' },
  '&.Mui-focusVisible': { ...focusRing, bgcolor: 'translucent.primaryGreenSubtle' },
  '&&.Mui-selected, &&.Mui-selected:hover, &&.Mui-selected.Mui-focusVisible': {
    bgcolor: 'transparent',
    typography: 'controlValueSelected',
  },
  '&&.Mui-selected:hover': { bgcolor: 'translucent.primaryGreenSubtle' },
  // The check: an L of two borders turned 45°.
  '&.Mui-selected::after': {
    content: '""',
    flex: 'none',
    width: 6,
    height: 11,
    mr: 0.5,
    mb: 0.5,
    borderRight: 2.5,
    borderBottom: 2.5,
    borderColor: 'primary.main',
    transform: 'rotate(45deg)',
  },
  '&.Mui-disabled': { opacity: 0.38 },
} as const

/** A group head inside a dropdown (Baseline, Adaptation scenarios). */
export const menuGroupHeadSx = {
  typography: 'navigationSubLabel',
  color: 'base.200',
  bgcolor: 'transparent',
  px: 1.5,
  pt: 1.25,
  pb: 0.5,
} as const

/** A group head after the first: a rule above it separates the groups. */
export const menuGroupHeadDividedSx = {
  ...menuGroupHeadSx,
  borderTop: 1,
  borderColor: 'border.default',
  mt: 0.75,
  pt: 1.75,
} as const

/** A select's field while its list is open: a 1 px green edge (MUI turns the chevron over). */
export const selectOpenSx = {
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main', borderWidth: 1 },
} as const

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
