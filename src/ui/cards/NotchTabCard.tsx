import { Box, Stack, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import type { ReactNode } from 'react'

export interface NotchTabCardProps {
  eyebrow: string
  number: string
  title: string
  lead: ReactNode
  body?: ReactNode
  icon?: ReactNode
}

export default function NotchTabCard({
  eyebrow,
  number,
  title,
  lead,
  body,
  icon,
}: NotchTabCardProps) {
  return (
    <Box sx={{ position: 'relative', paddingTop: 2.75 }}>
      <Box
        component="span"
        sx={(theme) => ({
          position: 'absolute',
          top: 0,
          left: theme.jtSpacing.component.lg,
          zIndex: 2,
          bgcolor: 'primary.main',
          color: 'common.black',
          typography: 'numberBadge',
          letterSpacing: '0.08em',
          lineHeight: 1,
          paddingInline: theme.jtSpacing.component.sm,
          paddingTop: theme.jtSpacing.component.xs,
          paddingBottom: theme.jtSpacing.component.sm,
          borderRadius: `${theme.shape.borderRadius}px ${theme.shape.borderRadius}px 0 0`,
          boxShadow: `0 -${theme.spacing(0.25)} ${theme.spacing(1.25)} ${alpha(theme.palette.common.black, 0.25)}`,
        })}
      >
        {number}
      </Box>
      <Box
        sx={(theme) => ({
          position: 'relative',
          zIndex: 1,
          bgcolor: 'base.700',
          border: '1px solid',
          borderColor: theme.palette.border.default,
          borderTop: '2px solid',
          borderTopColor: 'primary.main',
          borderRadius: `${Number(theme.shape.borderRadius) * 0.5}px ${Number(theme.shape.borderRadius) * 1.5}px ${Number(theme.shape.borderRadius) * 1.5}px ${Number(theme.shape.borderRadius) * 1.5}px`,
          padding: theme.jtSpacing.component.lg,
          boxShadow: `0 ${theme.spacing(2)} ${theme.spacing(4.5)} -${theme.spacing(2)} ${alpha(theme.palette.common.black, 0.55)}`,
        })}
      >
        <Stack spacing={1.2}>
          <Box
            sx={(theme) => ({
              display: 'flex',
              alignItems: 'center',
              gap: theme.jtSpacing.gap.sm,
              color: 'primary.main',
            })}
          >
            {icon && (
              <Box sx={{ display: 'inline-flex', color: 'primary.main', flex: 'none' }}>{icon}</Box>
            )}
            <Typography variant="eyebrow" component="p">
              {eyebrow}
            </Typography>
          </Box>
          <Typography variant="h3" component="h3" sx={{ color: 'primary.main' }}>
            {title}
          </Typography>
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
    </Box>
  )
}
