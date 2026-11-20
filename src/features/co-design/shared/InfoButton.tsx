// Round "about this panel" toggle used inside the dashboard's views.
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { IconButton } from '@mui/material'
import type { SxProps, Theme } from '@mui/material/styles'

interface InfoButtonProps {
  onClick: () => void
  label?: string
  sx?: SxProps<Theme>
}

export default function InfoButton({ onClick, label = 'Toggle info panel', sx }: InfoButtonProps) {
  return (
    <IconButton
      aria-label={label}
      onClick={onClick}
      sx={[
        (theme) => ({
          width: theme.coDesign.shell.infoButton.size,
          height: theme.coDesign.shell.infoButton.size,
          flexShrink: 0,
          p: 0,
          color: 'common.white',
          border: theme.coDesign.shell.infoButton.border,
          transition: 'background-color 180ms ease, border-color 180ms ease, color 180ms ease',
          '&:hover, &.Mui-focusVisible': {
            color: 'primary.main',
            bgcolor: theme.coDesign.shell.infoButton.hoverBackground,
            borderColor: theme.coDesign.shell.infoButton.hoverBorder,
          },
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <InfoOutlinedIcon fontSize="small" />
    </IconButton>
  )
}
