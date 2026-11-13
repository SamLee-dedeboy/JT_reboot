import { Box, Stack, Typography } from '@mui/material'
import { jtSpacing } from '@/theme'
import { ActionButton, NumberedHeading } from '@/ui'
import { CitedText } from './citations'
import { type SectionProps, methodologyTextColumnSx, sectionSx } from './criterionLayout'

export default function WhatSection({ story, accent }: SectionProps) {
  return (
    <Box
      component="section"
      id="what"
      aria-labelledby="criterion-title"
      sx={{
        ...sectionSx,
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr)',
      }}
    >
      <Box sx={{ gridColumn: 1 }}>
        <NumberedHeading
          variant="h3"
          title="What is this criterion?"
          id="criterion-title"
          accent={accent}
        />
      </Box>
      <Stack spacing={jtSpacing.gap.md} sx={{ gridColumn: 1, minWidth: 0 }}>
        {story.what.map((paragraph) => (
          <Typography
            key={paragraph}
            variant="body1"
            sx={{ ...methodologyTextColumnSx, color: 'base.100' }}
          >
            <CitedText text={paragraph} />
          </Typography>
        ))}
      </Stack>
      <ActionButton
        label="Read full documentation"
        variant="outlined"
        sx={{ gridColumn: 1, justifySelf: 'start', mt: jtSpacing.component.lg }}
      />
    </Box>
  )
}
