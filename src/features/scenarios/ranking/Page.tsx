import { Box, Container, Stack, Typography } from '@mui/material'
import { Link, Navigate, useParams } from 'react-router-dom'
import { jtSpacing, navigation } from '../../../theme'
import Footer from '../../../ui/Footer'
import Navbar from '../../../ui/Navbar'
import { assetUrl } from '../../../utils/baseUrl'
import { BreakoutTable } from '../../../internal/rank-visualization/breakout/BreakoutPage'
import { OverallRankingChart, WeightedRankingChart } from './RankingVisualizations'

type RankingView = 'by-scenario' | 'by-criterion'

const views: { id: RankingView; label: string; href: string }[] = [
  { id: 'by-scenario', label: 'By scenario', href: '/scenarios/ranking' },
  { id: 'by-criterion', label: 'By criterion', href: '/scenarios/ranking/by-criterion' },
]

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
        <Box
          component="header"
          sx={{
            position: 'relative',
            isolation: 'isolate',
            py: { xs: jtSpacing.section.lg, md: jtSpacing.section.xl },
            '&::before': {
              content: '""',
              position: 'absolute',
              inset: 0,
              zIndex: -1,
              backgroundImage: (theme) =>
                `linear-gradient(90deg, ${theme.palette.translucent[900]} 0%, ${theme.palette.translucent[700]} 52%, ${theme.palette.translucent[300]} 100%), url(${assetUrl('/images/scenarios/web/cover.webp')})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            },
          }}
        >
          <Container maxWidth="lg">
            <Stack spacing={jtSpacing.gap.lg} sx={{ maxWidth: '78ch' }}>
              <Typography variant="h1">Performance and ranking</Typography>
              <Typography variant="bodyLarge" sx={{ color: 'base.50' }}>
                Compare how the scenarios perform overall, test how different priorities change
                their ranking, or examine the evidence behind each evaluation criterion.
              </Typography>
            </Stack>
          </Container>
        </Box>

        <RankingTabs activeView={activeView} sticky={activeView === 'by-scenario'} />

        {activeView === 'by-criterion' ? <BreakoutTable embedded /> : <ByScenario />}
      </Box>
      <Footer />
    </>
  )
}

function RankingTabs({ activeView, sticky }: { activeView: RankingView; sticky: boolean }) {
  return (
    <Box
      component="nav"
      aria-label="Performance and ranking views"
      sx={{
        position: sticky ? 'sticky' : 'relative',
        top: sticky ? navigation.barHeight : 'auto',
        zIndex: 90,
        bgcolor: 'base.700',
        borderTop: 1,
        borderBottom: 1,
        borderColor: 'border.subtle',
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          width: jtSpacing.layout.hybrid.width,
          px: 0,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', width: 'max-content' }}>
          {views.map((view, index) => {
            const active = view.id === activeView
            return (
              <Box
                key={view.id}
                component={Link}
                to={view.href}
                aria-current={active ? 'page' : undefined}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'auto minmax(0, 1fr)',
                  alignItems: 'center',
                  gap: jtSpacing.gap.xs,
                  px: jtSpacing.component.md,
                  py: jtSpacing.component.sm,
                  color: active ? 'common.black' : 'common.white',
                  bgcolor: active ? 'primary.main' : 'transparent',
                  '&:hover, &:focus-visible': {
                    bgcolor: active ? 'primary.main' : 'translucent.primaryGreen',
                    outline: 'none',
                  },
                }}
              >
                <Typography
                  component="span"
                  variant="numberBadge"
                  sx={{ color: active ? 'common.black' : 'primary.main' }}
                >
                  {String(index + 1).padStart(2, '0')}
                </Typography>
                <Typography component="span" variant="button" sx={{ whiteSpace: 'nowrap' }}>
                  {view.label}
                </Typography>
              </Box>
            )
          })}
        </Box>
      </Container>
    </Box>
  )
}

function ByScenario() {
  return (
    <Box>
      <RankingSection
        sectionId="overall-ranking"
        title="The overall ranking"
        introduction="See how the six futures compare when ecology, recreation, environmental justice, economy, and eco-cultural outcomes count equally. Scores above zero perform better than today’s baseline; scores below zero perform worse."
        background="base.700"
      >
        <OverallRankingChart />
      </RankingSection>
      <RankingSection
        sectionId="weighted-ranking"
        title="Change what matters most"
        introduction="There is no single right way to balance Delta outcomes. Adjust the priorities to see which futures rise—and which trade-offs become more visible."
        background="base.800"
      >
        <WeightedRankingChart />
      </RankingSection>
    </Box>
  )
}

function RankingSection({
  sectionId,
  title,
  introduction,
  background,
  children,
}: {
  sectionId: string
  title: string
  introduction: string
  background: 'base.700' | 'base.800'
  children: React.ReactNode
}) {
  return (
    <Box
      component="section"
      aria-labelledby={sectionId}
      sx={{ bgcolor: background, borderBottom: 1, borderColor: 'border.default' }}
    >
      <Container
        maxWidth={false}
        sx={{
          width: jtSpacing.layout.data.width,
          maxWidth: jtSpacing.layout.data.maxWidth,
          px: 0,
          py: { xs: jtSpacing.section.lg, md: jtSpacing.section.xl },
        }}
      >
        <Stack spacing={{ xs: jtSpacing.section.sm, md: jtSpacing.section.md }}>
          <Stack spacing={jtSpacing.gap.sm} sx={{ maxWidth: jtSpacing.layout.reading.width }}>
            <Typography id={sectionId} variant="h2">
              {title}
            </Typography>
            <Typography variant="body1" sx={{ color: 'base.100', maxWidth: '70ch' }}>
              {introduction}
            </Typography>
          </Stack>
          <Box sx={{ minWidth: 0 }}>{children}</Box>
        </Stack>
      </Container>
    </Box>
  )
}
