import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import { Box, Container, Stack, Typography } from '@mui/material'
import type { Theme } from '@mui/material/styles'
import { Link } from 'react-router-dom'
import { jtSpacing, ranking } from '@/theme'
import { assetUrl } from '@/utils/baseUrl'
import { choiceCardSx } from '@/ui/surfaceStyles'
import { railSx } from './rankingLayout'

export type RankingView = 'by-scenario' | 'by-criterion'

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

export default function RankingHero({ activeView }: { activeView: RankingView }) {
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
        ...choiceCardSx(active),
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: jtSpacing.gap.xs }}>
        <Typography
          component="span"
          variant="chartTitle"
          sx={{ color: active ? 'common.black' : 'primary.main' }}
        >
          {String(index + 1).padStart(2, '0')}
        </Typography>
        <Typography component="span" variant="chartTitle">
          {view.label}
        </Typography>
        <Icon fontSize="small" sx={{ ml: 'auto' }} />
      </Box>
      <Typography variant="body2" sx={{ color: active ? 'common.black' : 'base.100' }}>
        {view.description}
      </Typography>
    </Box>
  )
}
