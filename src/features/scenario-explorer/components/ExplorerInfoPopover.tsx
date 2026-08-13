import type { ReactNode } from 'react'
import { Box, Popover } from '@mui/material'

interface ExplorerInfoPopoverProps {
  anchor: HTMLElement | null
  children: ReactNode
  onClose: () => void
}

export default function ExplorerInfoPopover({
  anchor,
  children,
  onClose,
}: ExplorerInfoPopoverProps) {
  return (
    <Popover
      open={Boolean(anchor)}
      anchorEl={anchor}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
    >
      <Box
        sx={(theme) => ({
          bgcolor: 'base.800',
          boxSizing: 'border-box',
          display: 'grid',
          gap: theme.jtSpacing.gap.sm,
          maxHeight: `min(${theme.spacing(68)}, calc(100vh - ${theme.spacing(4)}))`,
          maxWidth: `calc(100vw - ${theme.spacing(4)})`,
          overflowY: 'auto',
          p: theme.jtSpacing.component.md,
          width: theme.spacing(52),
        })}
      >
        {children}
      </Box>
    </Popover>
  )
}
