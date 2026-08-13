import { Box, Stack, Typography } from '@mui/material'
import type { ReactNode } from 'react'

export interface SimpleCardProps {
  number: string
  title: string
  body?: ReactNode
  lead?: ReactNode
  icon?: ReactNode
}

export default function SimpleCard({ number, title, body, lead, icon }: SimpleCardProps) {
  return (
    <Box
      sx={(theme) => ({
        height: '100%',
        bgcolor: 'surface',
        border: '1px solid',
        borderColor: 'border.subtle',
        borderRadius: 1,
        padding: theme.jtSpacing.component.lg,
      })}
    >
      <Stack spacing={2}>
        <Box
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}
        >
          <Typography variant="numberGhost" component="span">
            {number}
          </Typography>
          {icon && (
            <Box sx={{ display: 'inline-flex', color: 'primary.main', flex: 'none' }}>{icon}</Box>
          )}
        </Box>
        <Typography variant="h3" component="h3" sx={{ color: 'primary.main' }}>
          {title}
        </Typography>
        {lead && (
          <Typography variant="body1" sx={{ lineHeight: 1.55, color: 'common.white' }}>
            {lead}
          </Typography>
        )}
        {body && (
          <Typography variant="body2" sx={{ color: 'base.100' }}>
            {body}
          </Typography>
        )}
      </Stack>
    </Box>
  )
}
