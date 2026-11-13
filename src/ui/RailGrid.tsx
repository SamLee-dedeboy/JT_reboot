// The layout beside a section rail: from lg up, the site's rail column (one width on every
// page, `navigation.railColumn`) and then the content; below lg, the content alone.
import { Box } from '@mui/material'
import type { SxProps, Theme } from '@mui/material'
import type { ReactNode } from 'react'
import { navigation } from '@/theme'

export default function RailGrid({
  rail,
  children,
  sx,
}: {
  /** Shown in the rail column from lg up; it stretches the column's full height, so a sticky rail inside it pins. */
  rail?: ReactNode
  children?: ReactNode
  /** Padding and the like for the grid itself. */
  sx?: SxProps<Theme>
}) {
  return (
    <Box
      sx={[
        (theme) => ({
          display: 'grid',
          gridTemplateColumns: {
            xs: 'minmax(0, 1fr)',
            lg: `${navigation.railColumn} minmax(0, 1fr)`,
          },
          columnGap: theme.jtSpacing.section.md,
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {rail && <Box sx={{ display: { xs: 'none', lg: 'block' }, gridColumn: 1 }}>{rail}</Box>}
      {children && <Box sx={{ gridColumn: { lg: 2 }, minWidth: 0 }}>{children}</Box>}
    </Box>
  )
}
