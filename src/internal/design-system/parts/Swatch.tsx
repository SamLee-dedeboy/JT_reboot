import { Box, Stack, Typography } from '@mui/material'
import type { ReactNode } from 'react'

const monoSx = {
  fontFamily: 'ui-monospace, Consolas, monospace',
  overflowWrap: 'anywhere',
} as const

/** A color chip with its name and token. */
export default function Swatch({
  color,
  name,
  token,
  outlined = false,
  children,
}: {
  color: string
  name: ReactNode
  token: string
  /** Draws an edge, for colors close to the page ground. */
  outlined?: boolean
  /** Extra lines under the token, such as where the color is used. */
  children?: ReactNode
}) {
  return (
    <Stack spacing={0.75} sx={{ minWidth: 0 }}>
      <Box
        sx={{
          height: 88,
          borderRadius: '6px',
          bgcolor: color,
          border: outlined ? 1 : 0,
          borderColor: 'border.strong',
        }}
      />
      <Typography variant="tableValueStrong" component="p">
        {name}
      </Typography>
      <Typography variant="captionSmall" component="p" sx={{ color: 'base.200', ...monoSx }}>
        {token}
      </Typography>
      {children}
    </Stack>
  )
}

/** Swatches in a responsive grid. */
export function SwatchGrid({ min = 150, children }: { min?: number; children: ReactNode }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fill, minmax(${min}px, 1fr))`,
        gap: 2,
      }}
    >
      {children}
    </Box>
  )
}
