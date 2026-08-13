// Hero/header block for repository pages, including eyebrow, title, summary,
// and optional metadata content.
import { Box, Container, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import ScrollReveal from '../../ui/animation/ScrollReveal'

interface RepoHeroProps {
  title: ReactNode
  lede: string
  /** Optional meta row rendered under the page lede (e.g. count / years). */
  meta?: ReactNode
}

/** Shared chrome across all three repository pages. */
export default function RepoHero({ title, lede, meta }: RepoHeroProps) {
  return (
    <Box component="header" id="top" sx={{ pt: { xs: '2.6rem', md: '3.4rem' } }}>
      <Container maxWidth="lg" sx={{ px: { xs: '1.5rem', md: '2rem' } }}>
        <ScrollReveal>
          <Typography
            variant="h1"
            component="h1"
            sx={{
              maxWidth: '24ch',
              mb: '1.4rem',
            }}
          >
            {title}
          </Typography>
        </ScrollReveal>
        <ScrollReveal delay={0.08}>
          <Typography
            component="p"
            sx={{
              maxWidth: '60ch',
              fontSize: '1.3rem',
              lineHeight: 1.7,
              color: 'base.100',
              borderLeft: '3px solid',
              borderColor: 'primary.main',
              pl: '1.5rem',
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
              gap: '1rem',
              mt: '2.2rem',
              color: 'base.200',
              fontSize: '1rem',
            }}
          >
            {meta}
          </ScrollReveal>
        )}
      </Container>
    </Box>
  )
}
