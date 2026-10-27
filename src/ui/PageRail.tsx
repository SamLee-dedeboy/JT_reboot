import { Box, Typography } from '@mui/material'
import type { SxProps, Theme } from '@mui/material'
import { jtSpacing, navigation } from '../theme'
import NavRail, { type NavRailItem } from './NavRail'

/**
 * The "On this page" rail beside an article: a sticky eyebrow and the `page` NavRail.
 * Place it in the page grid's rail column; `sx` sets its grid placement and padding.
 */
export default function PageRail({
  items,
  ariaLabel,
  activeItemId,
  onNavigate,
  sx,
}: {
  items: NavRailItem[]
  ariaLabel: string
  activeItemId?: string
  onNavigate?: (id: string) => void
  sx?: SxProps<Theme>
}) {
  return (
    <Box
      component="aside"
      sx={[
        { position: { lg: 'sticky' }, top: { lg: navigation.pageRailTop }, zIndex: 3 },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Typography
        variant="eyebrow"
        sx={{ display: 'block', color: 'base.200', mb: jtSpacing.component.md }}
      >
        On this page
      </Typography>
      <NavRail
        variant="page"
        items={items}
        ariaLabel={ariaLabel}
        activeItemId={activeItemId}
        onNavigate={onNavigate}
      />
    </Box>
  )
}
