import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { Box, Button, Stack, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { jtSpacing } from '@/theme'
import { fullBleedBand } from '@/ui/surfaceStyles'

export default function FamilySection({
  id,
  number,
  title,
  summary,
  background,
  children,
  actions,
}: {
  id: string
  number: string
  title: string
  summary: string
  /** Base palette step for the section band. */
  background: 700 | 800
  children: ReactNode
  actions: { label: string; href: string }[]
}) {
  return (
    <Box
      component="section"
      id={id}
      aria-labelledby={`${id}-title`}
      sx={[
        { py: { xs: jtSpacing.section.md, md: jtSpacing.section.lg } },
        (theme) => fullBleedBand(theme.palette.base[background]),
      ]}
    >
      <Stack direction="row" spacing={jtSpacing.gap.sm} sx={{ alignItems: 'baseline' }}>
        <Typography variant="numberArticle" component="span">
          {number}
        </Typography>
        <Typography id={`${id}-title`} variant="h2">
          {title}
        </Typography>
      </Stack>
      <Typography
        variant="body1"
        sx={{
          mt: jtSpacing.gap.md,
          mb: jtSpacing.component.lg,
          color: 'base.100',
          maxWidth: '78ch',
        }}
      >
        {summary}
      </Typography>
      {children}
      {actions.length > 0 && (
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          useFlexGap
          spacing={jtSpacing.gap.sm}
          sx={{ mt: jtSpacing.component.lg, flexWrap: 'wrap' }}
        >
          {actions.map((action, index) => (
            <Button
              key={action.href}
              component={Link}
              to={action.href}
              variant={index === 0 ? 'contained' : 'outlined'}
              endIcon={index === 0 ? <ArrowForwardIcon /> : undefined}
            >
              {action.label}
            </Button>
          ))}
        </Stack>
      )}
    </Box>
  )
}
