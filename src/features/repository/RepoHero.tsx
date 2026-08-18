// Hero/header block for repository pages, including eyebrow, title, summary,
// and optional metadata content.
import { Box, Container, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import ScrollReveal from '../../ui/animation/ScrollReveal'
import { jtSpacing } from '../../theme'

interface RepoHeroProps {
  title: ReactNode
  lede: string
  /** Optional meta row rendered under the page lede (e.g. count / years). */
  meta?: ReactNode
}

/** Shared chrome across all three repository pages. */
export default function RepoHero({ title, lede, meta }: RepoHeroProps) {
  return (
    <Box
      component="header"
      id="top"
      sx={{ pt: { xs: jtSpacing.component.lg, md: jtSpacing.section.sm } }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: jtSpacing.gap.lg, md: jtSpacing.gap.xl } }}>
        <ScrollReveal>
          <Typography
            variant="h1"
            component="h1"
            sx={{
              maxWidth: '24ch',
              mb: jtSpacing.component.md,
            }}
          >
            {title}
          </Typography>
        </ScrollReveal>
        <ScrollReveal delay={0.08}>
          <Typography
            variant="body1"
            component="p"
            sx={{
              maxWidth: '70ch',
              color: 'base.100',
            }}
          >
            {lede}
          </Typography>
        </ScrollReveal>
        {meta && (
          <ScrollReveal
            delay={0.14}
            sx={{
              display: 'flex',
              alignItems: 'baseline',
              gap: jtSpacing.gap.md,
              mt: jtSpacing.section.sm,
              color: 'base.200',
              typography: 'meta',
            }}
          >
            {meta}
          </ScrollReveal>
        )}
      </Container>
    </Box>
  )
}
