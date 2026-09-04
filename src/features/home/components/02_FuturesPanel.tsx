import { Box, Typography, useTheme } from '@mui/material'
import ScrollReveal from '../../../ui/animation/ScrollReveal'

const futures = [
  {
    title: 'What are scenarios?',
    body: 'Scenarios are models and depictions of possible futures and the pathways through which they could manifest.',
  },
  {
    title: 'What is participatory scenario planning?',
    body: 'Participatory scenario planning is a “bottom up” approach that involves working directly with public contributors to create and evaluate future scenarios for a particular place.',
  },
  {
    title: 'Why participatory scenario planning?',
    body: 'Scenario planning is an approach increasingly used in conservation and climate change adaptation research, especially when uncertainty, vulnerability, and divergent stakeholder interests create conflicting mandates.',
  },
]

export default function FuturesPanel() {
  const theme = useTheme()

  return (
    <Box
      component="section"
      id="foundations"
      data-home-section="panel"
      sx={{
        position: 'relative',
        zIndex: 1,
        minHeight: '100dvh',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        py: { xs: theme.jtSpacing.section.lg, md: theme.jtSpacing.section.xl },
        bgcolor: 'base.500',
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
        <Box sx={{ gridColumn: { lg: 2 }, width: '100%', maxWidth: '80ch' }}>
          <ScrollReveal>
            <Typography variant="eyebrow" component="p">
              The Approach
            </Typography>
            <Typography variant="h2" component="h2" sx={{ mt: 1, color: 'common.white' }}>
              What futures?
            </Typography>
          </ScrollReveal>
          <Box
            sx={{
              display: 'grid',
              gridTemplateRows: 'repeat(3, minmax(0, 1fr))',
              gap: theme.jtSpacing.section.md,
              mt: theme.jtSpacing.section.md,
            }}
          >
            {futures.map((future, index) => (
              <ScrollReveal
                key={future.title}
                component="article"
                delay={index * 0.1}
                sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
              >
                <Typography variant="h3" component="h3" sx={{ color: 'primary.main' }}>
                  {future.title}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: 'common.white', mt: theme.jtSpacing.component.md }}
                >
                  {future.body}
                </Typography>
              </ScrollReveal>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
