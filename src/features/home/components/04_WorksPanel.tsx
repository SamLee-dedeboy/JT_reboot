import { alpha, Box, Typography, useTheme } from '@mui/material'
import ScrollReveal from '../../../ui/animation/ScrollReveal'
import { HomeTextLink, type HomeActionTarget } from './HomeActions'

interface WorkStep {
  title: string
  text: string
  links: HomeActionTarget[]
}

const workSteps: WorkStep[] = [
  {
    title: 'Scenario Co-Design',
    text: 'Interviews and workshops surfaced public values and concerns about Delta salinity, which guided how each future scenario was designed.',
    links: [{ label: 'Explore the co-design dashboard', href: '/pages/co-design-dashboard' }],
  },
  {
    title: 'Scenario Adaptations',
    text: 'Starting from current operations, outflow variations and five adaptation pathways show what different Delta futures ask of communities, ecosystems, and water systems.',
    links: [{ label: 'Choose a future', href: '/scenarios' }],
  },
  {
    title: 'Scenario Modeling & Evaluation',
    text: 'We model salinity, water temperature, and water age in adaptation scenarios, with and without sea level rise. Five criteria then examine what each future means for ecology, recreation, environmental justice, the economy, and eco-cultural outcomes.',
    links: [
      { label: 'Salinity modeling', href: '/scenarios/modeling' },
      { label: 'Evaluation criteria', href: '/scenarios/evaluation' },
    ],
  },
  {
    title: 'Scenario Ranking',
    text: 'Compare how the futures perform across five criteria. Rank them with equal weight, test how different priorities change the order, or trace each score back to its underlying evidence.',
    links: [{ label: 'Rank the futures', href: '/scenarios/ranking' }],
  },
  {
    title: 'Governance & Co-Learning',
    text: 'Shared learning across community knowledge, research, and practice helps reveal what a just transition asks of planning in the Delta.',
    links: [{ label: 'How to act' }, { label: 'Read the reflections' }],
  },
]

// Ladder geometry (px): every step marker sits on one vertical line, like soundings on a depth line.
const MARKER_SIZE = 44
const LADDER_INSET = 72

export default function WorksPanel() {
  const theme = useTheme()
  const blue = theme.palette.brand.primaryBlue
  // Markers fade with each step so the list reads from shallow to deep.
  const depthTone = (index: number) => alpha(blue, 1 - (index / workSteps.length) * 0.7)

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
          gridTemplateColumns: {
            xs: '1fr',
            lg: 'var(--home-panel-rail-column) minmax(0, 1fr)',
          },
          gap: { xs: theme.jtSpacing.gap.lg, lg: theme.jtSpacing.section.md },
        }}
      >
        <Box sx={{ gridColumn: { lg: 2 }, width: '100%', maxWidth: '76ch' }}>
          <ScrollReveal>
            <Typography variant="eyebrow" component="p">
              The Project
            </Typography>
            <Typography variant="h2" component="h2" sx={{ mt: 1, color: 'common.white' }}>
              How it works?
            </Typography>
            <Typography
              variant="bodyLarge"
              sx={{
                mt: theme.jtSpacing.component.lg,
                color: 'base.100',
                maxWidth: theme.jtSpacing.paragraphMaxWidth.default,
              }}
            >
              Just Transitions in the Delta addresses future uncertainty and aims to raise awareness
              of the tradeoffs involved in managing the Sacramento-San Joaquin Delta amid future
              droughts and rising sea levels.
            </Typography>
          </ScrollReveal>
          <ScrollReveal sx={{ mt: theme.jtSpacing.section.md }}>
            <Typography
              variant="editorialEmphasis"
              component="p"
              sx={{ fontStyle: 'italic', color: 'common.white' }}
            >
              We deliver this through
            </Typography>
          </ScrollReveal>
          <Box
            component="ol"
            sx={{
              listStyle: 'none',
              m: 0,
              mt: theme.jtSpacing.gap.lg,
              p: 0,
              pl: `${LADDER_INSET}px`,
              display: 'flex',
              flexDirection: 'column',
              gap: theme.jtSpacing.section.sm,
            }}
          >
            {workSteps.map((step, index) => (
              <ScrollReveal
                key={step.title}
                component="li"
                delay={index * 0.06}
                sx={{
                  position: 'relative',
                  // Each step draws the line down to the next marker, so it ends at the last one.
                  '&:not(:last-of-type)::after': {
                    content: '""',
                    position: 'absolute',
                    left: MARKER_SIZE / 2 - 1 - LADDER_INSET,
                    top: MARKER_SIZE,
                    height: `calc(100% - ${MARKER_SIZE}px + ${theme.spacing(theme.jtSpacing.section.sm)})`,
                    width: 2,
                    background: `linear-gradient(180deg, ${depthTone(index)}, ${depthTone(index + 1)})`,
                  },
                }}
              >
                <Box
                  aria-hidden="true"
                  sx={{
                    position: 'absolute',
                    left: -LADDER_INSET,
                    top: 0,
                    width: MARKER_SIZE,
                    height: MARKER_SIZE,
                    boxSizing: 'border-box',
                    borderRadius: '50%',
                    border: 2,
                    borderColor: depthTone(index),
                    bgcolor: 'base.900',
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  <Typography variant="numberBadge" component="span" sx={{ color: 'common.white' }}>
                    {String(index + 1).padStart(2, '0')}
                  </Typography>
                </Box>
                <Typography
                  variant="editorialEmphasis"
                  component="h3"
                  sx={{ pt: 1, color: 'common.white' }}
                >
                  {step.title}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    mt: theme.jtSpacing.gap.xs,
                    color: 'base.100',
                    maxWidth: theme.jtSpacing.paragraphMaxWidth.default,
                  }}
                >
                  {step.text}
                </Typography>
                <Box
                  sx={{
                    mt: theme.jtSpacing.gap.xs,
                    display: 'flex',
                    flexWrap: 'wrap',
                    columnGap: theme.jtSpacing.gap.lg,
                  }}
                >
                  {step.links.map((link) => (
                    <HomeTextLink key={link.label} {...link} />
                  ))}
                </Box>
              </ScrollReveal>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
