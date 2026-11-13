import { Box, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import type { ReactNode } from 'react'
import { jtSpacing } from '@/theme'
import Diamond from './Diamond'

/** A tinted box of caveats, each with a diamond in the accent color. */
export default function CaveatsPanel({
  title = 'Caveats and Clarifications',
  accent,
  caveats,
}: {
  title?: string
  accent: string
  caveats: { key: string; content: ReactNode }[]
}) {
  return (
    <Box sx={{ p: jtSpacing.component.md, bgcolor: alpha(accent, 0.06) }}>
      <Typography variant="navigationSubLabel" component="h3" sx={{ color: accent }}>
        {title}
      </Typography>
      <Box component="ul" sx={{ m: 0, mt: jtSpacing.gap.sm, p: 0, listStyle: 'none' }}>
        {caveats.map(({ key, content }, index) => (
          <Box
            component="li"
            key={key}
            sx={{
              display: 'grid',
              gridTemplateColumns: '8px minmax(0, 1fr)',
              columnGap: jtSpacing.gap.sm,
              mt: index ? jtSpacing.gap.sm : 0,
            }}
          >
            <Diamond accent={accent} />
            <Typography variant="body2" sx={{ color: 'base.50' }}>
              {content}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
