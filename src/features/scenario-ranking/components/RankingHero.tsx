import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import { Box, Container, Stack, Typography, useMediaQuery } from '@mui/material'
import type { Theme } from '@mui/material/styles'
import { focusRing } from '@/ui/focusRing'
import { Link } from 'react-router-dom'
import { jtSpacing, ranking } from '@/theme'
import { assetUrl } from '@/utils/baseUrl'
import { choiceCardSx } from '@/ui/surfaceStyles'
import { railSx } from './rankingLayout'

export type RankingView = 'by-scenario' | 'by-criterion'

const views: {
  id: RankingView
  label: string
  href: string
  description: string
  /** The card's line from sm to md, where two cards share a row. */
  shortDescription: string
}[] = [
  {
    id: 'by-scenario',
    label: 'By scenario',
    href: '/scenarios/ranking',
    description: 'Rank the futures overall, then test how your priorities change the order.',
    shortDescription: 'Rank the futures overall, then test your priorities.',
  },
  {
    id: 'by-criterion',
    label: 'By criterion',
    href: '/scenarios/ranking/by-criterion',
    description:
      'Read the scores for each criterion and the evidence behind them, one criterion at a time.',
    shortDescription: 'Read each criterion’s scores and the evidence behind them.',
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
  const smUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'))
  const mdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'))
  const active = views.find((view) => view.id === activeView) ?? views[0]
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
            {smUp ? (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: ranking.viewCard.columns,
                  gap: jtSpacing.gap.md,
                }}
              >
                {views.map((view, index) => (
                  <ViewCard
                    key={view.id}
                    view={view}
                    index={index}
                    active={view.id === activeView}
                    short={!mdUp}
                  />
                ))}
              </Box>
            ) : (
              // A phone: the two views as one switch, and only the open view's line under it.
              <>
                <ViewSwitch activeView={activeView} />
                <Typography variant="body2">{active.description}</Typography>
              </>
            )}
          </Stack>
        </Stack>
      </Container>
    </Box>
  )
}

/** The two views as a two-option switch: each half a link, the open one filled. */
function ViewSwitch({ activeView }: { activeView: RankingView }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        gap: ranking.breakoutControl.inset,
        p: ranking.breakoutControl.inset,
        border: 1,
        borderColor: 'border.strong',
        borderRadius: ranking.setToggle.radius,
        bgcolor: 'translucent.darkSurface',
      }}
    >
      {views.map((view, index) => {
        const active = view.id === activeView
        return (
          <Box
            key={view.id}
            component={Link}
            to={view.href}
            aria-current={active ? 'page' : undefined}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: jtSpacing.gap.xs,
              minHeight: ranking.controlHeight,
              px: jtSpacing.component.sm,
              borderRadius: ranking.setToggle.radius,
              textDecoration: 'none',
              color: active ? 'common.black' : 'common.white',
              bgcolor: active ? 'primary.main' : 'transparent',
              '&:hover': { bgcolor: active ? 'primary.main' : 'translucent.primaryGreen' },
              '&:focus-visible': focusRing,
            }}
          >
            <Typography
              component="span"
              variant="chipLabel"
              sx={{ color: active ? 'inherit' : 'primary.main' }}
            >
              {String(index + 1).padStart(2, '0')}
            </Typography>
            <Typography component="span" variant="chipLabel" sx={{ whiteSpace: 'nowrap' }}>
              {view.label}
            </Typography>
          </Box>
        )
      })}
    </Box>
  )
}

function ViewCard({
  view,
  index,
  active,
  short,
}: {
  view: (typeof views)[number]
  index: number
  active: boolean
  short: boolean
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
        px: { sm: jtSpacing.component.md, md: jtSpacing.component.lg },
        py: { sm: jtSpacing.component.sm, md: jtSpacing.component.md },
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
        {short ? view.shortDescription : view.description}
      </Typography>
    </Box>
  )
}
