// Shared pieces of the evaluation pages: the image hero with breadcrumbs, the
// team switcher, and the score badge used for baseline-relative team scores.
import { Box, Breadcrumbs, Container, Stack, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { jtSpacing } from '../../../theme'
import { assetUrl } from '../../../utils/baseUrl'
import { evaluationTeams } from '../content'

export function EvaluationHero({
  image,
  crumbs,
  eyebrow,
  title,
  summary,
  children,
}: {
  image: string
  crumbs: Array<{ label: string; to: string }>
  eyebrow: string
  title: string
  summary: string
  children?: ReactNode
}) {
  return (
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
            `linear-gradient(90deg, ${theme.palette.translucent[900]} 0%, ${theme.palette.translucent[700]} 52%, ${theme.palette.translucent[300]} 100%), url(${assetUrl(image)})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        },
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={jtSpacing.gap.lg} sx={{ maxWidth: '78ch' }}>
          <Breadcrumbs aria-label="Breadcrumb" sx={{ color: 'base.200' }}>
            {crumbs.map((crumb) => (
              <Typography
                key={crumb.to}
                component={Link}
                to={crumb.to}
                variant="meta"
                sx={{
                  color: 'base.100',
                  textDecoration: 'none',
                  '&:hover, &:focus-visible': { color: 'primary.main' },
                }}
              >
                {crumb.label}
              </Typography>
            ))}
          </Breadcrumbs>
          <Typography variant="eyebrow" component="p">
            {eyebrow}
          </Typography>
          <Typography variant="h1">{title}</Typography>
          <Typography variant="bodyLarge" sx={{ color: 'base.50' }}>
            {summary}
          </Typography>
          {children}
        </Stack>
      </Container>
    </Box>
  )
}

/** Team switcher; `hrefFor` decides whether it stays on methodology or on one scenario. */
export function TeamTabs({
  activeTeamId,
  hrefFor,
  sticky = true,
}: {
  activeTeamId: string
  hrefFor: (teamId: string) => string
  sticky?: boolean
}) {
  return (
    <Box
      component="nav"
      aria-label="Evaluation teams"
      sx={{
        position: sticky ? 'sticky' : 'static',
        top: { xs: 72, md: 76 },
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
          width: '90dvw',
          px: 0,
          display: 'flex',
          justifyContent: { xs: 'flex-start', lg: 'center' },
          overflowX: 'auto',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        <Stack direction="row" spacing={jtSpacing.gap.xs} sx={{ flex: '0 0 auto' }}>
          {evaluationTeams.map((team) => {
            const active = team.id === activeTeamId
            return (
              <Box
                key={team.id}
                component={Link}
                to={hrefFor(team.id)}
                aria-current={active ? 'page' : undefined}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: jtSpacing.gap.xs,
                  px: jtSpacing.component.sm,
                  py: jtSpacing.component.sm,
                  borderRadius: 1,
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
                  {team.number}
                </Typography>
                <Typography component="span" variant="button" sx={{ whiteSpace: 'nowrap' }}>
                  {team.label}
                </Typography>
              </Box>
            )
          })}
        </Stack>
      </Container>
    </Box>
  )
}

/** Baseline-relative score: blue when better than baseline, orange when worse. */
export function ScoreBadge({ score }: { score: number | null }) {
  const label =
    score === null ? 'Pending' : score > 0 ? `+${score}` : score < 0 ? `−${-score}` : '0'
  return (
    <Box
      component="span"
      sx={(theme) => ({
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 44,
        px: 1,
        py: 0.5,
        borderRadius: 1,
        border: 1,
        borderStyle: score === null ? 'dashed' : 'solid',
        borderColor:
          score === null || score === 0
            ? 'border.strong'
            : score > 0
              ? theme.chart.voting.above
              : theme.chart.voting.below,
        color:
          score === null || score === 0
            ? 'base.100'
            : score > 0
              ? theme.chart.voting.above
              : theme.chart.voting.below,
      })}
    >
      <Typography component="span" variant={score === null ? 'captionSmall' : 'chartValue'}>
        {label}
      </Typography>
    </Box>
  )
}

/** Numbered section heading shared by the evaluation pages. */
export function SectionHeading({
  number,
  title,
  id,
}: {
  number: string
  title: string
  id: string
}) {
  return (
    <Stack spacing={jtSpacing.gap.xs} sx={{ mb: jtSpacing.gap.lg }}>
      <Typography variant="numberArticle" component="p" aria-hidden="true">
        {number}
      </Typography>
      <Typography variant="h2" id={id}>
        {title}
      </Typography>
    </Stack>
  )
}
