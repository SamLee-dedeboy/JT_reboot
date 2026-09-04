import { Box, Button, Typography, useTheme } from '@mui/material'
import ScrollReveal from '../../../ui/animation/ScrollReveal'

const workSteps = [
  [
    '01',
    'Public collaborations to prioritize values and design future scenarios',
    'Co-Design Dashboard',
  ],
  [
    '02',
    'Speculative planning strategies that compare a broad range of adaptations',
    'Scenario Adaptations',
  ],
  ['03', 'Community engagement, dialogue, co-learning, and responsive research', 'Co-Learning'],
  [
    '04',
    'Advanced model simulations and geo spatial-temporal data visualizations',
    'Modeling & Evaluation',
  ],
] as const

export default function WorksPanel() {
  const theme = useTheme()

  return (
    <Box
      component="section"
      id="works"
      data-home-section="panel"
      sx={{
        position: 'relative',
        zIndex: 1,
        minHeight: '100dvh',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        py: { xs: theme.jtSpacing.section.lg, md: theme.jtSpacing.section.xl },
        bgcolor: 'base.900',
        color: 'common.white',
      }}
    >
      <Box
        sx={{
          width: '100%',
          pl: 'var(--home-rail-inset)',
          pr: { xs: theme.jtSpacing.gap.lg, md: theme.jtSpacing.section.md },
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '11rem minmax(0, 1fr)' },
          gap: { xs: theme.jtSpacing.gap.lg, lg: theme.jtSpacing.section.md },
        }}
      >
        <Box sx={{ gridColumn: { lg: 2 }, width: '100%', maxWidth: '76ch' }}>
          <ScrollReveal>
            <Typography variant="eyebrow" component="p">
              The Project
            </Typography>
            <Typography variant="h2" component="h2" sx={{ mt: 1, color: 'common.white' }}>
              How it works
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mt: theme.jtSpacing.component.lg,
                color: 'common.white',
                maxWidth: theme.jtSpacing.paragraphMaxWidth.default,
              }}
            >
              Just Transitions in the Delta addresses future uncertainty and aims to raise awareness
              of the tradeoffs involved in managing the Sacramento-San Joaquin Delta amid future
              droughts and rising sea levels.
            </Typography>
            <Typography
              variant="editorialEmphasis"
              component="p"
              sx={{ mt: theme.jtSpacing.section.md, fontStyle: 'italic', color: 'common.white' }}
            >
              We deliver this through
            </Typography>
          </ScrollReveal>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              maxWidth: 'max-content',
              gap: theme.jtSpacing.section.md,
              mt: theme.jtSpacing.section.md,
            }}
          >
            {workSteps.map(([number, text, label], index) => (
              <ScrollReveal
                key={number}
                component="article"
                delay={index * 0.06}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 9fr)',
                  gridTemplateRows: 'auto auto',
                  columnGap: theme.jtSpacing.gap.md,
                  rowGap: theme.jtSpacing.gap.sm,
                  alignItems: 'start',
                }}
              >
                <Typography variant="numberBadge" component="p" sx={{ gridColumn: 1, gridRow: 1 }}>
                  {number}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ gridColumn: 2, gridRow: 1, color: 'common.white' }}
                >
                  {text}
                </Typography>
                <Button
                  variant="contained"
                  sx={{ gridColumn: 2, gridRow: 2, width: 'max-content' }}
                >
                  {label}
                </Button>
              </ScrollReveal>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
