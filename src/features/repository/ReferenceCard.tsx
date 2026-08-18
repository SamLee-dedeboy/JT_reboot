// Flat editorial entry for research citations and supporting resources.
import { Box, Typography } from '@mui/material'
import Icon from '../../ui/Icon'
import type { Reference } from './data/resources'
import { jtSpacing } from '../../theme'

export default function ReferenceCard({ r }: { r: Reference }) {
  return (
    <Box
      component="a"
      href={r.href ?? '#'}
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1.2fr 1fr 0.8fr' },
        gap: { xs: jtSpacing.gap.xs, md: jtSpacing.gap.lg },
        height: '100%',
        borderTop: 1,
        borderColor: 'border.default',
        borderRadius: 0,
        py: jtSpacing.component.md,
        transition: 'border-color 180ms ease',
        '&:hover, &:focus-visible': {
          borderColor: 'primary.main',
          outline: 'none',
          '& .reference-title': { color: 'primary.main' },
        },
      }}
    >
      <Typography
        className="reference-title"
        variant="cardTitle"
        component="h3"
        sx={{ color: 'common.white', transition: 'color 180ms ease' }}
      >
        {r.title}
      </Typography>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: jtSpacing.gap.xs,
          color: 'primary.main',
          typography: 'navigationLabel',
        }}
      >
        <Box component="span" sx={{ flex: 'none', opacity: 0.8 }}>
          <Icon name="arrow-up-right" size={15} />
        </Box>
        {r.source}
      </Box>

      <Typography variant="meta" sx={{ color: 'base.200' }}>
        {r.meta}
      </Typography>
    </Box>
  )
}
