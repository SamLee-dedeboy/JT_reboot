import { Box, Button, Typography, useTheme } from '@mui/material'
import { Link } from 'react-router-dom'
import Icon from '../../../ui/Icon'
import ScrollReveal from '../../../ui/animation/ScrollReveal'

export default function WhatIfPanel() {
  const theme = useTheme()

  return (
    <Box
      component="section"
      id="whatif"
      data-home-section="panel"
      sx={{
        position: 'relative',
        zIndex: 1,
        minHeight: '80dvh',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        pt: { xs: theme.jtSpacing.section.md, md: theme.jtSpacing.section.lg },
        pb: { xs: theme.jtSpacing.section.lg, md: theme.jtSpacing.section.xl },
        bgcolor: '#384550',
        color: 'brand.primaryBlue',
      }}
    >
      <Box
        sx={{
          width: '100%',
          pl: 'var(--home-rail-inset)',
          pr: { xs: theme.jtSpacing.gap.lg, md: theme.jtSpacing.section.md },
          position: 'relative',
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '11rem minmax(0, 1fr)' },
            gap: { xs: theme.jtSpacing.gap.lg, lg: theme.jtSpacing.section.md },
            alignItems: 'start',
          }}
        >
          <Box
            sx={{
              gridColumn: { lg: 2 },
              maxWidth: theme.jtSpacing.paragraphMaxWidth.default,
              pt: theme.jtSpacing.component.lg,
            }}
          >
            <ScrollReveal
              sx={{
                mb: theme.jtSpacing.section.sm,
              }}
            >
              <Typography variant="eyebrow" component="p" sx={{ mb: theme.jtSpacing.component.xs }}>
                The Idea
              </Typography>
              <Typography variant="h2" component="h2" sx={{ color: 'common.white' }}>
                What if?
              </Typography>
            </ScrollReveal>

            <ScrollReveal>
              <Typography variant="body1" sx={{ color: 'base.50' }}>
                <Box component="span" sx={{ display: 'block' }}>
                  What if we considered a wide range of future visions for equitable water
                  management in the Delta under a shifting climate of uncertainty?
                </Box>
                <Box component="span" sx={{ display: 'block' }}>
                  What would these scenarios look like?
                </Box>
                <Box component="span" sx={{ display: 'block' }}>
                  How might these water futures compare amongst the many social and ecological
                  factors at play?
                </Box>
              </Typography>

              <Typography
                variant="editorialEmphasis"
                component="p"
                sx={{ mt: theme.jtSpacing.section.sm }}
              >
                More importantly, what if Delta communities and impacted citizens had a role in
                defining these scenarios… before decisions are made?
              </Typography>

              <Typography variant="body1" sx={{ mt: theme.jtSpacing.section.sm, color: 'base.50' }}>
                <Box component="span" sx={{ display: 'block' }}>
                  Better yet, what if communities could prioritize the features and performance of
                  each scenario, assessing them side by side to understand the impacts and benefits
                  of each strategy?
                </Box>
                <Box component="span" sx={{ display: 'block' }}>
                  To be able to clarify risks and negotiate tradeoffs for a future Delta that
                  factors in all interests, especially those underrepresented in decision making.
                </Box>
              </Typography>

              <Typography
                variant="editorialEmphasis"
                component="p"
                sx={{ mt: theme.jtSpacing.section.sm }}
              >
                How might these future scenarios support a framework for a Just Transitions in the
                Sacramento-San Joaquin Delta?
              </Typography>

              <Button
                component={Link}
                to="/scenarios"
                variant="contained"
                endIcon={<Icon name="arrow-right" size={18} />}
                sx={{
                  mt: theme.jtSpacing.component.lg,
                  bgcolor: 'brand.primaryBlue',
                  color: 'base.900',
                }}
              >
                View Future Scenarios
              </Button>
            </ScrollReveal>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
