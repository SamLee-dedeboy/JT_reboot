import { Box, Stack, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import { jtSpacing } from '@/theme'
import { SectionHead } from '@/ui'

/** One section of the design system page: eyebrow, title, a short intro, then its specimens. */
export default function DesignSection({
  id,
  eyebrow,
  title,
  intro,
  children,
}: {
  id: string
  eyebrow: string
  title: string
  intro?: ReactNode
  children: ReactNode
}) {
  return (
    <Box
      component="section"
      id={id}
      sx={{
        scrollMarginTop: 110,
        py: jtSpacing.section.md,
        borderTop: 1,
        borderColor: 'border.subtle',
        '&:first-of-type': { borderTop: 0, pt: 0 },
      }}
    >
      <SectionHead eyebrow={eyebrow} title={title} />
      {intro && (
        <Typography
          variant="body1"
          sx={{
            color: 'base.100',
            maxWidth: jtSpacing.paragraphMaxWidth.default,
            mb: jtSpacing.gap.xl,
          }}
        >
          {intro}
        </Typography>
      )}
      <Stack spacing={jtSpacing.section.sm}>{children}</Stack>
    </Box>
  )
}
