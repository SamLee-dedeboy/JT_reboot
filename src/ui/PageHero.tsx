// The image-backed header of the modeling, evaluation, criterion and watershed pages:
// optional breadcrumbs and eyebrow, the title (with an optional icon), and a summary.
import { Box, Breadcrumbs, Container, Stack, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { jtSpacing } from '@/theme'
import { assetUrl } from '@/utils/baseUrl'

export default function PageHero({
  image = '/images/scenarios/web/cover.webp',
  crumbs,
  eyebrow,
  title,
  summary,
  accent,
  titleColor,
  icon,
  summaryVariant = 'bodyLarge',
  children,
}: {
  image?: string
  crumbs?: Array<{ label: string; to: string }>
  eyebrow?: string
  title: string
  summary: string
  /** Team color for the eyebrow and title; defaults to the theme's own colors. */
  accent?: string
  /** Optional title color when it should differ from the eyebrow accent. */
  titleColor?: string
  /** Shown before the title, e.g. the team icon. */
  icon?: ReactNode
  /** Type style for the summary; the methodology pages keep body copy at body1. */
  summaryVariant?: 'bodyLarge' | 'body1'
  children?: ReactNode
}) {
  return (
    <Box
      component="header"
      sx={{
        position: 'relative',
        isolation: 'isolate',
        py: { xs: jtSpacing.section.lg, md: jtSpacing.section.xl },
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          zIndex: -1,
          backgroundImage: (theme) =>
            `linear-gradient(90deg, ${theme.palette.translucent[900]} 0%, ${theme.palette.translucent[700]} 52%, ${theme.palette.translucent[300]} 100%), url(${assetUrl(image)})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        },
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={jtSpacing.gap.lg} sx={{ maxWidth: '78ch' }}>
          {crumbs && (
            <Breadcrumbs aria-label="Breadcrumb" sx={{ color: 'base.200' }}>
              {crumbs.map((crumb) => (
                <Typography
                  key={crumb.to}
                  component={Link}
                  to={crumb.to}
                  variant="meta"
                  sx={{
                    color: 'base.100',
                    textDecoration: 'none',
                    '&:hover, &:focus-visible': { color: 'primary.main' },
                  }}
                >
                  {crumb.label}
                </Typography>
              ))}
            </Breadcrumbs>
          )}
          {eyebrow && (
            <Typography variant="eyebrow" component="p" sx={{ color: accent }}>
              {eyebrow}
            </Typography>
          )}
          <Typography
            variant="h1"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: jtSpacing.gap.md,
              color: titleColor ?? accent,
            }}
          >
            {icon}
            {title}
          </Typography>
          <Typography variant={summaryVariant} sx={{ color: 'base.50', whiteSpace: 'pre-line' }}>
            {summary}
          </Typography>
          {children}
        </Stack>
      </Container>
    </Box>
  )
}
