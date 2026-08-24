import { Box, Button, Typography, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { assetUrl } from '../../../utils/baseUrl'
import ScrollReveal from '../../../ui/animation/ScrollReveal'

const workSteps = [
  {
    number: '01',
    text: 'Public collaborations to prioritize values and design future scenarios',
    label: 'Co-Design Dashboard',
  },
  {
    number: '02',
    text: 'Speculative planning strategies that compare a broad range of adaptations',
    label: 'Scenario Adaptations',
  },
  {
    number: '03',
    text: 'Community engagement, dialogue, co-learning, and responsive research',
    label: 'Co-Learning',
  },
  {
    number: '04',
    text: 'Advanced model simulations and geo spatial-temporal data visualizations',
    label: 'Modeling & Evaluation',
  },
]

function WorkStep({ step, index }: { step: (typeof workSteps)[number]; index: number }) {
  const theme = useTheme()

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.45, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
    >
      <Typography variant="numberBadge" component="p" sx={{ mb: theme.jtSpacing.component.xs }}>
        {step.number}
      </Typography>
      <Typography variant="body2" sx={{ color: 'common.white', mb: theme.jtSpacing.component.sm }}>
        {step.text}
      </Typography>
      <Button variant="contained" sx={{ width: '100%' }}>
        {step.label}
      </Button>
    </Box>
  )
}

export default function WorksPanels() {
  const theme = useTheme()

  return (
    <>
      <Box
        component="section"
        id="works-photo"
        aria-label="A delta in transition"
        sx={{
          position: 'relative',
          zIndex: 35,
          // Bleed past the matching clipped edge to prevent subpixel seams.
          mt: { md: '-2rem', lg: 'calc(-2rem - 1px)' },
          minHeight: { xs: '34rem', md: '42rem', lg: '48rem' },
          display: 'flex',
          alignItems: 'center',
          backgroundImage: `linear-gradient(90deg, ${theme.palette.translucent.blackShadow}, transparent 58%), url(${assetUrl('images/tulare-basin.jpg')})`,
          backgroundSize: 'cover',
          backgroundPosition: { xs: '62% center', md: 'center 42%', lg: 'center bottom 10%' },
          clipPath: { md: 'polygon(0 0, 100% 0, 100% 100%, 0 calc(100% - 2rem))' },
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: '0 0 auto',
            height: { md: '2.5rem' },
            bgcolor: 'base.800',
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 0)',
            zIndex: 1,
          },
        }}
      >
        <Box
          sx={{
            width: '100%',
            position: 'relative',
            zIndex: 2,
            pl: {
              xs: 'var(--home-rail-inset)',
              lg: `calc(var(--home-rail-inset) + 11rem + ${theme.spacing(theme.jtSpacing.section.md)})`,
            },
            pr: 'var(--home-rail-inset)',
          }}
        >
          <ScrollReveal>
            <Typography
              variant="body1"
              component="p"
              sx={{
                maxWidth: '30rem',
                color: 'common.white',
                fontStyle: 'italic',
                textShadow: `0 1px 3px rgba(0, 0, 0, 0.85), 0 2px 16px ${theme.palette.translucent.textShadow}`,
              }}
            >
              Salinity management in the Delta during drought has historically been done on an
              emergency basis. However, with future droughts and sea-level rise more likely,
              long-range planning that creatively visions new futures for salinity management while
              holistically considering the tradeoffs associated with those futures is needed.
            </Typography>
            <Button
              href="#works"
              variant="contained"
              sx={{ mt: theme.jtSpacing.component.lg, minWidth: { xs: '100%', sm: '18rem' } }}
            >
              A Delta in Transition
            </Button>
          </ScrollReveal>
        </Box>
      </Box>

      <Box
        component="section"
        id="works"
        sx={{
          position: 'relative',
          zIndex: 36,
          // Bleed past the matching clipped edge to prevent subpixel seams.
          mt: { md: '-2rem', lg: 'calc(-2rem - 1px)' },
          pt: { xs: theme.jtSpacing.section.lg, md: theme.jtSpacing.section.xl },
          pb: theme.jtSpacing.section.xl,
          bgcolor: 'base.900',
          color: 'common.white',
          clipPath: { md: 'polygon(0 0, 100% 2rem, 100% 100%, 0 100%)' },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 'var(--home-rail-inset)',
            width: 2,
            bgcolor: 'common.white',
            zIndex: 1,
          },
        }}
      >
        <Box
          sx={{
            pl: 'var(--home-rail-inset)',
            pr: { xs: theme.jtSpacing.gap.lg, md: theme.jtSpacing.section.md },
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '11rem minmax(0, 1fr)' },
            gap: { xs: theme.jtSpacing.gap.lg, lg: theme.jtSpacing.section.md },
            alignItems: 'start',
          }}
        >
          <Box sx={{ gridColumn: { lg: 2 }, width: '100%', maxWidth: '72rem' }}>
            <Typography variant="eyebrow" component="p">
              The Project
            </Typography>
            <Typography variant="h2" component="h2" sx={{ mt: 1, color: 'common.white' }}>
              How it works?
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mt: theme.jtSpacing.component.md,
                color: 'common.white',
                maxWidth: theme.jtSpacing.paragraphMaxWidth.default,
              }}
            >
              Just Transitions in the Delta addresses future uncertainty and aims to raise awareness
              of the tradeoffs involved in managing the Sacramento-San Joaquin Delta amid future
              droughts and rising sea levels.
            </Typography>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'max-content repeat(2, minmax(0, 1fr))' },
                gap: { xs: theme.jtSpacing.gap.lg, md: theme.jtSpacing.section.md },
                mt: theme.jtSpacing.section.sm,
                alignItems: 'start',
              }}
            >
              <Typography
                variant="editorialEmphasis"
                component="p"
                sx={{ fontStyle: 'italic', color: 'common.white', whiteSpace: 'nowrap' }}
              >
                We deliver this through
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: theme.jtSpacing.section.sm,
                }}
              >
                <WorkStep step={workSteps[0]} index={0} />
                <WorkStep step={workSteps[2]} index={1} />
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: theme.jtSpacing.section.sm,
                }}
              >
                <WorkStep step={workSteps[1]} index={2} />
                <WorkStep step={workSteps[3]} index={3} />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  )
}
