import { Box, Stack, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import type { ReactNode } from 'react'

export interface SplitRailCardProps {
  eyebrow: string
  number: string
  title: string
  lead: ReactNode
  body?: ReactNode
  icon?: ReactNode
}

export default function SplitRailCard({
  eyebrow,
  number,
  title,
  lead,
  body,
  icon,
}: SplitRailCardProps) {
  return (
    <Box
      sx={(theme) => ({
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        overflow: 'hidden',
        border: '1px solid',
        borderColor: theme.palette.border.subtle,
        borderRadius: 1.75,
        boxShadow: `0 ${theme.spacing(2.25)} ${theme.spacing(5)} -${theme.spacing(2)} ${alpha(theme.palette.common.black, 0.6)}`,
      })}
    >
      <Stack
        sx={(theme) => ({
          flex: 'none',
          width: { xs: '100%', sm: theme.spacing(14.5) },
          minHeight: { xs: 'auto', sm: theme.spacing(30) },
          flexDirection: { xs: 'row', sm: 'column' },
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: theme.jtSpacing.gap.sm,
          bgcolor: 'base.900',
          color: 'primary.main',
          paddingInline: { xs: theme.jtSpacing.component.md, sm: 0 },
          paddingBlock: theme.jtSpacing.component.md,
          borderRight: { xs: 'none', sm: '1px solid' },
          borderRightColor: { sm: alpha(theme.palette.primary.main, 0.25) },
          borderBottom: { xs: '1px solid', sm: 'none' },
          borderBottomColor: { xs: alpha(theme.palette.primary.main, 0.25) },
        })}
      >
        <Typography component="span" variant="numberTimeline" sx={{ color: 'primary.main' }}>
          {number}
        </Typography>
        {icon && (
          <Box
            sx={{
              display: 'inline-flex',
              width: 40,
              height: 40,
              alignItems: 'center',
              justifyContent: 'center',
              color: 'primary.main',
            }}
          >
            {icon}
          </Box>
        )}
        <Typography
          component="span"
          variant="eyebrow"
          sx={{
            writingMode: { xs: 'horizontal-tb', sm: 'vertical-rl' },
            transform: { xs: 'none', sm: 'rotate(180deg)' },
            color: 'base.300',
            lineHeight: 1,
          }}
        >
          {eyebrow}
        </Typography>
      </Stack>
      <Stack
        spacing={1.2}
        sx={(theme) => ({
          flex: 1,
          minWidth: 0,
          bgcolor: 'base.500',
          padding: theme.jtSpacing.component.lg,
        })}
      >
        <Typography variant="h3" component="h3" sx={{ color: 'common.white' }}>
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
  )
}
