// The header of each repository page: its title and lede on a dark band, or over a shaded
// photograph when the page has one.
import { Box, Container, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import { ScrollReveal } from '@/ui'
import { jtSpacing } from '@/theme'
import { assetUrl } from '@/utils/baseUrl'

interface RepoHeroProps {
  title: ReactNode
  lede: string
  /** A photograph behind the title, shaded so the text stays readable. */
  image?: string
}

/** Shared chrome across all three repository pages. */
export default function RepoHero({ title, lede, image }: RepoHeroProps) {
  return (
    <Box
      component="header"
      id="top"
      sx={{
        position: 'relative',
        isolation: 'isolate',
        overflow: 'hidden',
        bgcolor: 'base.700',
        borderBottom: 1,
        borderColor: 'border.subtle',
        pt: { xs: jtSpacing.section.md, md: image ? jtSpacing.section.xl : jtSpacing.section.lg },
        pb: { xs: jtSpacing.section.sm, md: jtSpacing.section.md },
        ...(image && {
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            zIndex: -1,
            backgroundImage: (theme) =>
              `linear-gradient(90deg, ${theme.palette.translucent[900]} 0%, ${theme.palette.translucent[700]} 55%, ${theme.palette.translucent[600]} 100%), url(${assetUrl(image)})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          },
        }),
      }}
    >
      <Container maxWidth={false} sx={{ width: '90dvw', px: 0 }}>
        <ScrollReveal>
          <Typography variant="h1" component="h1" sx={{ maxWidth: '24ch' }}>
            {title}
          </Typography>
        </ScrollReveal>
        <ScrollReveal delay={0.08}>
          <Typography
            variant="body1"
            component="p"
            sx={{
              maxWidth: '62ch',
              mt: jtSpacing.component.md,
              color: image ? 'base.50' : 'base.100',
            }}
          >
            {lede}
          </Typography>
        </ScrollReveal>
      </Container>
    </Box>
  )
}
