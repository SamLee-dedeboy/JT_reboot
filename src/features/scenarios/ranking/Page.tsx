import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import { Box, Button, Container, Stack, Typography } from '@mui/material'
import type { Theme } from '@mui/material/styles'
import { Link, Navigate, useParams } from 'react-router-dom'
import { jtSpacing, navigation, ranking } from '../../../theme'
import Footer from '../../../ui/Footer'
import Navbar from '../../../ui/Navbar'
import { assetUrl } from '../../../utils/baseUrl'
import { SCENARIOS } from '../../../internal/rank-visualization/data'
import { BreakoutTable } from './breakout/BreakoutPage'
import { OverallRankingChart, WeightedRankingChart } from './RankingVisualizations'

type RankingView = 'by-scenario' | 'by-criterion'

const views: { id: RankingView; label: string; href: string; description: string }[] = [
  {
    id: 'by-scenario',
    label: 'By scenario',
    href: '/scenarios/ranking',
    description: 'Rank the futures overall, then test how your priorities change the order.',
  },
  {
    id: 'by-criterion',
    label: 'By criterion',
    href: '/scenarios/ranking/by-criterion',
    description:
      'Read the scores for each criterion and the evidence behind them, one criterion at a time.',
  },
]

/** The scenarios ranked on this page: the six adaptation scenarios. */
const scenarioSet = {
  sentence: 'six adaptation scenarios',
  baseline: 'against today’s Delta, where Business as Usual sits at zero.',
  scenarios: SCENARIOS,
}

const heroSx = {
  position: 'relative',
  isolation: 'isolate',
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    zIndex: -1,
    backgroundImage: (theme: Theme) =>
      `linear-gradient(90deg, ${theme.palette.translucent[900]} 0%, ${theme.palette.translucent[700]} 52%, ${theme.palette.translucent[300]} 100%), url(${assetUrl('/images/scenarios/web/cover.webp')})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
}

/** One left edge for the hero and every section on the By scenario view. */
const railSx = {
  width: jtSpacing.layout.data.width,
  maxWidth: jtSpacing.layout.data.maxWidth,
  px: 0,
}

/**
 * One page, one hero: "Choose how to compare" in the hero picks the view, and only the
 * content beneath it changes.
 */
export default function Page() {
  const { view } = useParams()
  const activeView: RankingView = view === 'by-criterion' ? view : 'by-scenario'

  if (view && view !== 'by-criterion') {
    return <Navigate to="/scenarios/ranking" replace />
  }

  return (
    <>
      <Navbar />
      <Box component="main" sx={{ bgcolor: 'base.800', color: 'common.white' }}>
        <RankingHero activeView={activeView} />
        {activeView === 'by-criterion' ? <BreakoutTable embedded /> : <ByScenario />}
      </Box>
      <Footer />
    </>
  )
}

function ByScenario() {
  return (
    <>
      <RankingSection sectionId="start" title="What you’re looking at" background="base.800">
        <Stack
          spacing={jtSpacing.gap.lg}
          sx={{ maxWidth: jtSpacing.paragraphMaxWidth.default, alignItems: 'flex-start' }}
        >
          <Typography variant="body1">
            Every future is scored on five criteria: ecology, recreation, environmental justice,
            economy, and eco-cultural outcomes. Each criterion scores the futures from −5 to +5{' '}
            {scenarioSet.baseline}
          </Typography>
          <Typography variant="body1">
            The ranking below combines those five scores. By default every criterion counts equally;
            further down the page, you can change that balance and watch the order shift.
          </Typography>
          <Typography variant="body2">
            How each criterion’s score was built—the models, metrics, and community input behind
            it—is set out in the methodology.
          </Typography>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={{ xs: jtSpacing.gap.sm, sm: jtSpacing.gap.xl }}
            sx={{ alignItems: { sm: 'center' }, pt: jtSpacing.component.sm }}
          >
            <Button
              component={Link}
              to="/scenarios/evaluation"
              variant="outlined"
              endIcon={<ArrowForwardRoundedIcon />}
            >
              Read the methodology
            </Button>
            <Typography
              component={Link}
              to="/scenarios/ranking/by-criterion"
              variant="meta"
              sx={{ color: 'primary.main', '&:hover': { color: 'common.white' } }}
            >
              Or compare one criterion at a time
            </Typography>
          </Stack>
        </Stack>
      </RankingSection>

      <RankingSection
        sectionId="overall-ranking"
        eyebrow="Equal weights"
        title="The overall ranking"
        introduction="Every criterion counts equally here. Scores above zero beat today’s baseline; scores below zero fall short of it. Open a future to see the five scores behind its rank."
        background="base.700"
      >
        <OverallRankingChart
          scenarios={scenarioSet.scenarios}
          heading={<SetSentence set={scenarioSet.sentence} weights="equal weights" />}
        />
      </RankingSection>

      <HeadsUp />

      <RankingSection
        sectionId="weighted-ranking"
        eyebrow="Your priorities"
        title="Change what matters most"
        introduction="There is no single right way to balance Delta outcomes. Adjust the priorities to see which futures rise—and which trade-offs become more visible."
        background="base.700"
      >
        <Stack spacing={jtSpacing.component.lg}>
          <SetSentence set={scenarioSet.sentence} />
          <WeightedRankingChart scenarios={scenarioSet.scenarios} />
        </Stack>
      </RankingSection>
    </>
  )
}

function RankingHero({ activeView }: { activeView: RankingView }) {
  return (
    <Box
      component="header"
      sx={{
        ...heroSx,
        pt: { xs: jtSpacing.section.lg, md: jtSpacing.section.xl },
        pb: jtSpacing.section.lg,
      }}
    >
      <Container maxWidth={false} sx={railSx}>
        <Stack spacing={jtSpacing.section.sm}>
          <Stack spacing={jtSpacing.gap.lg} sx={{ maxWidth: '78ch' }}>
            <Typography variant="h1">Scenario Ranking</Typography>
            <Typography variant="bodyLarge" sx={{ color: 'base.100' }}>
              How do the futures compare across criteria? Rank them overall and test your own
              priorities, or examine the evidence behind each criterion.
            </Typography>
          </Stack>

          {/* How to compare: the two views of this page. */}
          <Stack component="nav" aria-label="Ranking views" spacing={jtSpacing.gap.sm}>
            <Typography variant="captionSmall">Choose how to compare</Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: 'minmax(0, 1fr)', sm: ranking.viewCard.columns },
                gap: jtSpacing.gap.md,
              }}
            >
              {views.map((view, index) => (
                <ViewCard key={view.id} view={view} index={index} active={view.id === activeView} />
              ))}
            </Box>
          </Stack>
        </Stack>
      </Container>
    </Box>
  )
}

function ViewCard({
  view,
  index,
  active,
}: {
  view: (typeof views)[number]
  index: number
  active: boolean
}) {
  const Icon = active ? CheckRoundedIcon : ArrowForwardRoundedIcon
  return (
    <Box
      component={Link}
      to={view.href}
      aria-current={active ? 'page' : undefined}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: jtSpacing.gap.sm,
        px: jtSpacing.component.lg,
        py: jtSpacing.component.md,
        border: 1,
        borderColor: active ? 'primary.main' : 'border.strong',
        bgcolor: active ? 'primary.main' : 'translucent.darkSurface',
        color: active ? 'common.black' : 'common.white',
        '&:hover, &:focus-visible': active
          ? { outline: 'none' }
          : { bgcolor: 'translucent.primaryGreen', borderColor: 'primary.main', outline: 'none' },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: jtSpacing.gap.xs }}>
        <Typography
          component="span"
          variant="numberBadge"
          sx={{ color: active ? 'common.black' : 'primary.main' }}
        >
          {String(index + 1).padStart(2, '0')}
        </Typography>
        <Typography component="span" variant="button">
          {view.label}
        </Typography>
        <Icon fontSize="small" sx={{ ml: 'auto' }} />
      </Box>
      <Typography variant="meta" sx={{ color: active ? 'common.black' : 'base.100' }}>
        {view.description}
      </Typography>
    </Box>
  )
}

/** "Ranking SIX ADAPTATION SCENARIOS with EQUAL WEIGHTS": what the chart below shows. */
function SetSentence({ set, weights }: { set: string; weights?: string }) {
  const value = { typography: 'chartSentenceValue', color: 'common.white' }
  return (
    <Typography variant="body2">
      Ranking{' '}
      <Box component="span" sx={value}>
        {set}
      </Box>
      {weights && (
        <>
          {' '}
          with{' '}
          <Box component="span" sx={value}>
            {weights}
          </Box>
        </>
      )}
    </Typography>
  )
}

const headsUpPoints = [
  {
    title: 'Weights express values',
    body: 'Raising a criterion says it matters more to you. The criterion scores themselves stay exactly as reported.',
  },
  {
    title: 'Zero means today, not neutral',
    body: 'Every score is measured against Business as Usual. A future at zero performs like today’s Delta; it isn’t a middle ground.',
  },
  {
    title: 'Close scores are near ties',
    body: 'Futures a few tenths apart can swap places with a small change in weight. Treat neighboring ranks as close calls, not clear wins.',
  },
]

function HeadsUp() {
  return (
    <Box
      component="section"
      aria-labelledby="heads-up"
      sx={{ bgcolor: 'base.800', borderBottom: 1, borderColor: 'border.default' }}
    >
      <Container
        maxWidth={false}
        sx={{ ...railSx, py: { xs: jtSpacing.section.lg, md: jtSpacing.section.xl } }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'minmax(0, 5fr) minmax(0, 7fr)' },
            gap: { xs: jtSpacing.section.sm, md: jtSpacing.section.lg },
            alignItems: 'start',
          }}
        >
          <Stack spacing={jtSpacing.gap.lg} sx={{ alignItems: 'flex-start' }}>
            <Typography variant="eyebrow">Before you reweigh</Typography>
            <Typography id="heads-up" variant="h2">
              A note on changing the weights
            </Typography>
            <Typography variant="body1" sx={{ color: 'base.100' }}>
              Next, you decide which outcomes matter most. Weights change the order, never the
              evidence. Keep three things in mind as you explore.
            </Typography>
            <Typography
              component="a"
              href="#weighted-ranking"
              variant="meta"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: jtSpacing.gap.xs,
                color: 'primary.main',
                '&:hover': { color: 'common.white' },
              }}
            >
              Skip to your priorities
              <ArrowDownwardRoundedIcon fontSize="small" />
            </Typography>
          </Stack>
          <Box component="ol" sx={{ listStyle: 'none', m: 0, p: 0 }}>
            {headsUpPoints.map((point, index) => (
              <Box
                component="li"
                key={point.title}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: ranking.headsUp.columns,
                  gap: jtSpacing.gap.md,
                  py: jtSpacing.component.lg,
                  borderTop: 1,
                  borderBottom: index === headsUpPoints.length - 1 ? 1 : 0,
                  borderColor: 'border.default',
                }}
              >
                <Typography variant="numberArticle">
                  {String(index + 1).padStart(2, '0')}
                </Typography>
                <Stack spacing={jtSpacing.gap.xs}>
                  <Typography variant="cardTitle" component="h3">
                    {point.title}
                  </Typography>
                  <Typography variant="cardBody" sx={{ color: 'base.100' }}>
                    {point.body}
                  </Typography>
                </Stack>
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

function RankingSection({
  sectionId,
  eyebrow,
  title,
  introduction,
  background,
  children,
}: {
  sectionId: string
  eyebrow?: string
  title: string
  introduction?: string
  background: 'base.700' | 'base.800'
  children: React.ReactNode
}) {
  return (
    <Box
      component="section"
      id={sectionId}
      aria-labelledby={`${sectionId}-title`}
      sx={{
        bgcolor: background,
        borderBottom: 1,
        borderColor: 'border.default',
        scrollMarginTop: navigation.barHeight,
      }}
    >
      <Container
        maxWidth={false}
        sx={{ ...railSx, py: { xs: jtSpacing.section.lg, md: jtSpacing.section.xl } }}
      >
        <Stack spacing={{ xs: jtSpacing.section.sm, md: jtSpacing.section.md }}>
          <Stack spacing={jtSpacing.gap.lg} sx={{ maxWidth: jtSpacing.layout.reading.width }}>
            {eyebrow && <Typography variant="eyebrow">{eyebrow}</Typography>}
            <Typography id={`${sectionId}-title`} variant="h2">
              {title}
            </Typography>
            {introduction && (
              <Typography
                variant="body1"
                sx={{ color: 'base.100', maxWidth: jtSpacing.paragraphMaxWidth.default }}
              >
                {introduction}
              </Typography>
            )}
          </Stack>
          <Box sx={{ minWidth: 0 }}>{children}</Box>
        </Stack>
      </Container>
    </Box>
  )
}
