import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { Box, Button, Container, IconButton, Stack, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import type { ScenarioContent } from '@/content/scenarios'
import { jtSpacing } from '@/theme'
import { assetUrl } from '@/utils/baseUrl'
import { storyGridColumns } from './storyLayout'

/** Where the scenario sits among the five, for stepping between them without the tabs. */
export interface ScenarioSteps {
  previous?: ScenarioContent
  next?: ScenarioContent
  total: number
}

/** One arrow to the scenario before or after; disabled at either end. */
function StepArrow({ to, direction }: { to?: ScenarioContent; direction: 'previous' | 'next' }) {
  const Chevron = direction === 'previous' ? ChevronLeftIcon : ChevronRightIcon
  return (
    <IconButton
      {...(to ? { component: Link, to: `/scenarios/${to.slug}` } : { disabled: true })}
      aria-label={
        to ? `${direction === 'previous' ? 'Previous' : 'Next'} scenario: ${to.title}` : undefined
      }
      sx={{
        width: 44,
        height: 44,
        border: 1,
        borderColor: to ? 'primary.main' : 'border.default',
        color: 'primary.main',
        '&:hover': { bgcolor: 'translucent.primaryGreen' },
      }}
    >
      <Chevron />
    </IconButton>
  )
}

/** The scenario's photo, number, title and plain-language premise. */
export default function StoryHero({
  scenario,
  isTieredOutflows,
  scenarioSteps,
}: {
  scenario: ScenarioContent
  isTieredOutflows: boolean
  /** Below lg, where the scenario tabs give way: its number among the five and arrows. */
  scenarioSteps?: ScenarioSteps
}) {
  return (
    <Box
      id="overview"
      component="header"
      sx={{
        position: 'relative',
        minHeight: { xs: 440, md: 560 },
        display: 'flex',
        alignItems: 'flex-end',
        isolation: 'isolate',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          backgroundImage: (theme) =>
            `linear-gradient(90deg, ${theme.palette.translucent[900]}, ${theme.palette.translucent[600]}), url(${assetUrl(scenario.image)})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: -1,
        },
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          width: '90dvw',
          px: 0,
          py: { xs: jtSpacing.section.md, md: jtSpacing.section.lg },
          display: 'grid',
          gridTemplateColumns: storyGridColumns,
          gap: { xs: jtSpacing.gap.xl, lg: jtSpacing.section.md },
        }}
      >
        <Stack
          spacing={jtSpacing.gap.md}
          sx={{
            gridColumn: { lg: '2 / 4' },
            maxWidth: jtSpacing.paragraphMaxWidth.default,
          }}
        >
          <Button
            component={Link}
            to="/scenarios"
            startIcon={<ArrowBackIcon />}
            sx={{ alignSelf: 'flex-start', color: 'base.100' }}
          >
            All scenarios
          </Button>
          {!isTieredOutflows && !scenarioSteps && (
            <Typography variant="numberArticle">{scenario.number}</Typography>
          )}
          {!isTieredOutflows && scenarioSteps && (
            <Stack
              direction="row"
              sx={{ alignItems: 'center', justifyContent: 'space-between', gap: jtSpacing.gap.sm }}
            >
              <Stack direction="row" spacing={jtSpacing.gap.sm} sx={{ alignItems: 'baseline' }}>
                <Typography variant="numberArticle">{scenario.number}</Typography>
                <Typography variant="meta" component="span" sx={{ color: 'base.100' }}>
                  of {String(scenarioSteps.total).padStart(2, '0')} adaptation scenarios
                </Typography>
              </Stack>
              <Stack direction="row" spacing={jtSpacing.gap.sm}>
                <StepArrow to={scenarioSteps.previous} direction="previous" />
                <StepArrow to={scenarioSteps.next} direction="next" />
              </Stack>
            </Stack>
          )}
          <Typography variant="h1">{scenario.title}</Typography>
          <Typography variant="body1" sx={{ color: 'base.50', maxWidth: '60ch' }}>
            {scenario.summary}
          </Typography>
          {scenario.comparisonNote && (
            <Typography
              variant="meta"
              sx={{
                maxWidth: '64ch',
                color: 'base.50',
                borderLeft: 2,
                borderColor: 'primary.main',
                pl: jtSpacing.component.sm,
              }}
            >
              {scenario.comparisonNote}
            </Typography>
          )}
        </Stack>
      </Container>
    </Box>
  )
}
