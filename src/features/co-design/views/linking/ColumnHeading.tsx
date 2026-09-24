// Heading above each of the view's three columns (scenario, descriptions, graph).
import { Typography } from '@mui/material'
import type { SxProps, Theme } from '@mui/material/styles'
import type { ReactNode } from 'react'

export default function ColumnHeading({
  children,
  sx,
}: {
  children: ReactNode
  sx?: SxProps<Theme>
}) {
  return (
    <Typography
      variant="chartTitle"
      component="h2"
      sx={[{ m: 0, color: 'common.white' }, ...(Array.isArray(sx) ? sx : [sx])]}
    >
      {children}
    </Typography>
  )
}
