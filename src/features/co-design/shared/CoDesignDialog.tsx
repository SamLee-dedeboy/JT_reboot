// Tutorial / welcome dialog used by the dashboard shell and landing page.
import CloseIcon from '@mui/icons-material/Close'
import { Dialog, IconButton } from '@mui/material'
import type { ReactNode } from 'react'

interface CoDesignDialogProps {
  open: boolean
  onClose: () => void
  children: ReactNode
  align?: 'left' | 'center'
  labelledBy?: string
}

export default function CoDesignDialog({
  open,
  onClose,
  children,
  align = 'left',
  labelledBy,
}: CoDesignDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      transitionDuration={200}
      aria-labelledby={labelledBy}
      slotProps={{
        backdrop: { sx: (theme) => ({ bgcolor: theme.coDesign.shell.dialog.backdrop }) },
        paper: {
          sx: (theme) => ({
            position: 'relative',
            width: '90%',
            maxWidth: theme.coDesign.shell.dialog.maxWidth,
            maxHeight: '85vh',
            m: 0,
            px: { xs: 3, sm: 6 },
            py: { xs: 5, sm: 8 },
            display: 'flex',
            flexDirection: 'column',
            gap: 2.5,
            textAlign: align,
            color: 'common.white',
            bgcolor: theme.coDesign.shell.dialog.background,
            border: theme.coDesign.shell.dialog.border,
            borderRadius: theme.coDesign.shell.dialog.radius,
          }),
        },
      }}
    >
      <IconButton
        aria-label="Close"
        onClick={onClose}
        size="small"
        sx={{ position: 'absolute', top: 8, right: 8, color: 'base.100' }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
      {children}
    </Dialog>
  )
}
