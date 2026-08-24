import { Box, Button, Typography, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Icon from '../../../ui/Icon'
import ScrollReveal from '../../../ui/animation/ScrollReveal'

export default function WhatIfSectionEditorial() {
  const theme = useTheme()

  return (
    <Box
      component="section"
      id="whatif"
      sx={{
        position: 'relative',
        zIndex: 30,
        pt: { xs: theme.jtSpacing.section.md, md: theme.jtSpacing.section.lg },
        pb: { xs: theme.jtSpacing.section.lg, md: theme.jtSpacing.section.xl },
        color: 'base.900',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: { xs: 0, md: '3.5rem' },
          bottom: 0,
          left: 'var(--home-rail-inset)',
          width: 2,
          bgcolor: 'common.white',
          zIndex: 2,
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          inset: 0,
          bgcolor: 'secondary.main',
          clipPath: { md: 'polygon(0 3.5rem, 100% 0, 100% 100%, 0 100%)' },
          zIndex: 0,
        },
      }}
    >
      <Box
        sx={{
          pl: 'var(--home-rail-inset)',
          pr: { xs: theme.jtSpacing.gap.lg, md: theme.jtSpacing.section.md },
          position: 'relative',
          zIndex: 1,
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
            <Box
              component={motion.div}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.35 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              sx={{
                position: { xs: 'static', md: 'absolute' },
                left: {
                  md: 'var(--home-rail-inset)',
                  lg: `calc(var(--home-rail-inset) + 11rem + ${theme.spacing(theme.jtSpacing.section.md)})`,
                },
                bottom: { md: 'calc(100% + 2rem)' },
                zIndex: 3,
              }}
            >
              <Typography variant="eyebrow" component="p" sx={{ mb: theme.jtSpacing.component.xs }}>
                The Idea
              </Typography>
              <Typography
                variant="h2"
                component="h2"
                sx={{ color: 'common.white', mb: { xs: theme.jtSpacing.component.md, md: 0 } }}
              >
                What if?
              </Typography>
            </Box>

            <ScrollReveal>
              <Typography variant="body1" sx={{ color: 'base.900' }}>
                What if we considered a wide range of future visions for equitable water management
                in the Delta under a shifting climate of uncertainty? What would these scenarios
                look like? How might these water futures compare amongst the many social and
                ecological factors at play?
              </Typography>

              <Typography
                variant="editorialEmphasis"
                component="p"
                sx={{ mt: theme.jtSpacing.component.lg }}
              >
                More importantly, what if Delta communities and impacted citizens had a role in
                defining these scenarios… before decisions are made?
              </Typography>

              <Typography
                variant="body1"
                sx={{ mt: theme.jtSpacing.component.lg, color: 'base.900' }}
              >
                Better yet, what if communities could prioritize the features and performance of
                each scenario, assessing them side by side to understand the impacts and benefits of
                each strategy? To be able to clarify risks and negotiate tradeoffs for a future
                Delta that factors in all interests, especially those underrepresented in decision
                making.
              </Typography>

              <Typography
                variant="editorialEmphasis"
                component="p"
                sx={{ mt: theme.jtSpacing.component.lg }}
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
                  bgcolor: 'base.900',
                  color: 'common.white',
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
