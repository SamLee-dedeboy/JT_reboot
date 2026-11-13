// The Delta references as a table: title, source, then authors and year. Each row is a link.
import { Box, Typography } from '@mui/material'
import { Icon, ScrollReveal } from '@/ui'
import { focusRing } from '@/ui/focusRing'
import type { Reference } from './data/resources'
import { jtSpacing } from '@/theme'

const COLUMNS = { md: 'minmax(0, 1.3fr) minmax(0, 1fr) minmax(0, 1fr) 2rem' }

export default function ReferenceTable({ references }: { references: Reference[] }) {
  return (
    <Box role="table" aria-label="Delta research references">
      <Box
        role="row"
        sx={{
          display: { xs: 'none', md: 'grid' },
          gridTemplateColumns: COLUMNS,
          gap: jtSpacing.gap.lg,
          pb: jtSpacing.component.sm,
          borderBottom: 1,
          borderColor: 'border.strong',
        }}
      >
        {['Title', 'Source', 'Author, year'].map((head) => (
          <Typography key={head} role="columnheader" variant="chartColumnHead">
            {head}
          </Typography>
        ))}
      </Box>

      {references.map((reference, index) => {
        const external = reference.href?.startsWith('http')
        return (
          <ScrollReveal key={reference.title} delay={index * 0.05}>
            <Box
              role="row"
              component="a"
              href={reference.href ?? '#'}
              {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: 'minmax(0, 1fr) 2rem', md: COLUMNS.md },
                gap: { xs: jtSpacing.gap.xs, md: jtSpacing.gap.lg },
                alignItems: 'start',
                py: jtSpacing.component.md,
                borderBottom: 1,
                borderColor: 'border.default',
                color: 'inherit',
                textDecoration: 'none',
                transition: 'background-color 180ms ease',
                '&:hover': {
                  bgcolor: 'translucent.100',
                  '& .reference-title': { color: 'primary.main' },
                  '& .reference-arrow': { transform: 'translate(3px, -3px)', opacity: 1 },
                },
                '&:focus-visible': focusRing,
                '@media (prefers-reduced-motion: reduce)': {
                  '&, & .reference-title, & .reference-arrow': { transition: 'none' },
                },
              }}
            >
              <Typography
                role="cell"
                className="reference-title"
                variant="cardTitle"
                component="span"
                sx={{ color: 'common.white', transition: 'color 180ms ease' }}
              >
                {reference.title}
              </Typography>
              <Typography
                role="cell"
                variant="body2"
                component="span"
                sx={{ gridColumn: { xs: 1, md: 'auto' }, color: 'primary.main' }}
              >
                {reference.source}
              </Typography>
              <Typography
                role="cell"
                variant="meta"
                component="span"
                sx={{ gridColumn: { xs: 1, md: 'auto' }, color: 'base.200' }}
              >
                {reference.meta}
              </Typography>
              <Box
                aria-hidden
                className="reference-arrow"
                sx={{
                  gridColumn: { xs: 2, md: 'auto' },
                  gridRow: { xs: 1, md: 'auto' },
                  justifySelf: 'end',
                  color: 'primary.main',
                  opacity: 0.7,
                  transition: 'transform 180ms ease, opacity 180ms ease',
                }}
              >
                <Icon name="arrow-up-right" size={18} />
              </Box>
            </Box>
          </ScrollReveal>
        )
      })}
    </Box>
  )
}
