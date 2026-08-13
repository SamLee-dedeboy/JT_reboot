import { Box, Stack, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import type { ReactNode } from 'react'

export interface AccentPlateCardProps {
  eyebrow: string
  number: string
  title: string
  lead: ReactNode
  body?: ReactNode
}

export default function AccentPlateCard({
  eyebrow,
  number,
  title,
  lead,
  body,
}: AccentPlateCardProps) {
  return (
    <Box
      sx={(theme) => ({
        overflow: 'hidden',
        borderRadius: 1.75,
        boxShadow: `0 ${theme.spacing(2)} ${theme.spacing(5)} ${alpha(theme.palette.common.black, 0.38)}`,
      })}
    >
      <Box
        sx={(theme) => ({
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: theme.jtSpacing.gap.md,
          bgcolor: 'primary.main',
          color: 'common.black',
          paddingInline: theme.jtSpacing.component.lg,
          paddingBlock: theme.jtSpacing.component.md,
        })}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="eyebrow"
            component="p"
            sx={{ color: (theme) => alpha(theme.palette.common.black, 0.62) }}
          >
            {eyebrow}
          </Typography>
          <Typography
            component="h3"
            variant="accentCardTitle"
            sx={{
              marginTop: 0.45,
              color: 'common.black',
            }}
          >
            {title}
          </Typography>
        </Box>
        <Typography
          component="span"
          variant="numberTimeline"
          sx={{
            color: (theme) => alpha(theme.palette.common.black, 0.28),
            flex: 'none',
          }}
        >
          {number}
        </Typography>
      </Box>
      <Stack
        spacing={1.2}
        sx={(theme) => ({
          bgcolor: 'base.700',
          border: '1px solid',
          borderColor: theme.palette.border.subtle,
          borderTop: 'none',
          borderRadius: `0 0 ${Number(theme.shape.borderRadius) * 1.75}px ${Number(theme.shape.borderRadius) * 1.75}px`,
          paddingInline: theme.jtSpacing.component.lg,
          paddingBlock: theme.jtSpacing.component.lg,
        })}
      >
        <Typography variant="body1" sx={{ color: 'common.white' }}>
          {lead}
        </Typography>
        {body && (
          <Typography variant="body2" sx={{ color: 'base.100' }}>
            {body}
          </Typography>
        )}
      </Stack>
    </Box>
  )
}
