// Round "about this section" toggle shared by the dashboard shell and views.
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { IconButton } from '@mui/material'
import type { SxProps, Theme } from '@mui/material/styles'

interface InfoButtonProps {
  onClick: () => void
  label?: string
  className?: string
  sx?: SxProps<Theme>
}

export default function InfoButton({
  onClick,
  label = 'Toggle info panel',
  className,
  sx,
}: InfoButtonProps) {
  return (
    <IconButton
      aria-label={label}
      className={className}
      onClick={onClick}
      sx={[
        (theme) => ({
          width: theme.coDesign.shell.infoButton.size,
          height: theme.coDesign.shell.infoButton.size,
          flexShrink: 0,
          p: 0,
          color: 'common.white',
          bgcolor: theme.coDesign.shell.infoButton.background,
          border: theme.coDesign.shell.infoButton.border,
          boxShadow: theme.coDesign.shell.infoButton.shadow,
          '&:hover': { bgcolor: 'translucent.primaryBlue' },
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <InfoOutlinedIcon fontSize="small" />
    </IconButton>
  )
}
