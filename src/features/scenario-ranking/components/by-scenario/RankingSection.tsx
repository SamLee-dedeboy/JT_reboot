import { Box, Container, Stack, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import { jtSpacing, navigation } from '@/theme'
import { railSx } from '../rankingLayout'

export default function RankingSection({
  sectionId,
  eyebrow,
  title,
  introduction,
  background,
  singleLineTitle = false,
  children,
}: {
  sectionId: string
  eyebrow?: string
  title: ReactNode
  introduction?: string
  background: 'base.700' | 'base.800'
  singleLineTitle?: boolean
  children: ReactNode
}) {
  return (
    <Box
      component="section"
      id={sectionId}
      aria-labelledby={`${sectionId}-title`}
      sx={{
        bgcolor: background,
        borderBottom: 1,
        borderColor: 'border.default',
        scrollMarginTop: navigation.barHeight,
      }}
    >
      <Container
        maxWidth={false}
        sx={{ ...railSx, py: { xs: jtSpacing.section.lg, md: jtSpacing.section.xl } }}
      >
        <Stack spacing={{ xs: jtSpacing.section.sm, md: jtSpacing.section.md }}>
          <Stack
            spacing={jtSpacing.gap.lg}
            sx={{ maxWidth: singleLineTitle ? 'none' : jtSpacing.layout.reading.width }}
          >
            {eyebrow && <Typography variant="eyebrow">{eyebrow}</Typography>}
            <Typography
              id={`${sectionId}-title`}
              variant="h2"
              sx={{ whiteSpace: { md: singleLineTitle ? 'nowrap' : 'normal' } }}
            >
              {title}
            </Typography>
            {introduction && (
              <Typography
                variant="body1"
                sx={{ color: 'base.100', maxWidth: jtSpacing.paragraphMaxWidth.default }}
              >
                {introduction}
              </Typography>
            )}
          </Stack>
          <Box sx={{ minWidth: 0 }}>{children}</Box>
        </Stack>
      </Container>
    </Box>
  )
}
