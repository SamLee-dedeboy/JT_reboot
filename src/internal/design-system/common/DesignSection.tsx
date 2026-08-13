import { Box, Typography, type SxProps, type Theme } from '@mui/material'
import type { ReactNode, RefObject } from 'react'
import Eyebrow from '../../../ui/Eyebrow'
import { jtSpacing } from '../../../theme/index'

type DesignSectionProps = {
  id: string
  title: string
  eyebrow?: string
  explanation?: ReactNode
  children: ReactNode
  sectionRef?: RefObject<HTMLDivElement | null>
  guideSx?: SxProps<Theme>
  metrics?: ReactNode
}

export default function DesignSection({
  id,
  title,
  eyebrow,
  explanation,
  children,
  sectionRef,
  guideSx,
  metrics,
}: DesignSectionProps) {
  return (
    <Box
      id={id}
      component="section"
      ref={sectionRef}
      sx={{
        scrollMarginTop: '7rem',
        py: jtSpacing.section.sm,
        px: jtSpacing.component.md,
        borderTop: 1,
        borderColor: 'divider',
        ...(guideSx ?? {}),
      }}
    >
      {metrics}
      {eyebrow && <Eyebrow sx={{ mb: 1 }}>{eyebrow}</Eyebrow>}
      <Typography variant="h2" component="h2" gutterBottom>
        {title}
      </Typography>
      {explanation && (
        <Box
          sx={{
            maxWidth: '72ch',
            mb: jtSpacing.component.md,
            color: 'common.white',
            display: 'grid',
            gap: jtSpacing.gap.xs,
          }}
        >
          {explanation}
        </Box>
      )}
      {children}
    </Box>
  )
}
