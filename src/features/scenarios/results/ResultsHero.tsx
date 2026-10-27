import { Box, Container, Stack, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import { jtSpacing } from '../../../theme'
import { assetUrl } from '../../../utils/baseUrl'

/** Image-backed page header shared by the modeling, evaluation, and scenario results pages. */
export default function ResultsHero({
  title,
  summary,
  image = '/images/scenarios/web/cover.webp',
  children,
}: {
  title: string
  summary: string
  image?: string
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
          <Typography variant="h1">{title}</Typography>
          <Typography variant="bodyLarge" sx={{ color: 'base.50' }}>
            {summary}
          </Typography>
          {children}
        </Stack>
      </Container>
    </Box>
  )
}
