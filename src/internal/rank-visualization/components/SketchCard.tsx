import { Box } from '@mui/material'
import type { ReactNode } from 'react'

interface SketchCardProps {
  id: string
  /** Minimum (design) width in px, capped at the available width; grows to fit content. */
  width: number
  children: ReactNode
}

/**
 * Chart-only card for one design. All explanatory copy lives in the step's
 * text column, so the card carries nothing but the visualization.
 */
export default function SketchCard({ id, width, children }: SketchCardProps) {
  return (
    <Box
      id={id}
      sx={(theme) => ({
        // Grow to fit content (e.g. 2A's weight-sized columns) rather than scroll,
        // but never demand more than the page has on narrower screens.
        width: 'fit-content',
        minWidth: `min(${width}px, 100%)`,
        p: theme.jtSpacing.component.md,
        bgcolor: 'base.700',
        border: 1,
        borderStyle: 'dashed',
        borderColor: 'border.strong',
        borderRadius: 2,
      })}
    >
      {children}
    </Box>
  )
}
