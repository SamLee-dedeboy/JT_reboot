// Shared pieces of the evaluation pages: the image hero with breadcrumbs, the
// team switcher, and the score badge used for baseline-relative team scores.
import { Box, Breadcrumbs, Container, Stack, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { jtSpacing, navigation } from '../../../theme'
import TeamIcon from '../../../ui/TeamIcon'
import { assetUrl } from '../../../utils/baseUrl'
import { evaluationTeams } from '../content'
import { teamStyle } from '../teamStyle'

export function EvaluationHero({
  image,
  crumbs,
  eyebrow,
  title,
  summary,
  accent,
  icon,
  summaryVariant = 'bodyLarge',
  children,
}: {
  image: string
  crumbs?: Array<{ label: string; to: string }>
  eyebrow?: string
  title: string
  summary: string
  /** Team color for the eyebrow and title; defaults to the theme's own colors. */
  accent?: string
  /** Shown before the title, e.g. the team icon. */
  icon?: ReactNode
  /** Type style for the summary; the methodology pages keep body copy at body1. */
  summaryVariant?: 'bodyLarge' | 'body1'
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
          {crumbs && (
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
          )}
          {eyebrow && (
            <Typography variant="eyebrow" component="p" sx={{ color: accent }}>
              {eyebrow}
            </Typography>
          )}
          <Typography
            variant="h1"
            sx={{ display: 'flex', alignItems: 'center', gap: jtSpacing.gap.md, color: accent }}
          >
            {icon}
            {title}
          </Typography>
          <Typography variant={summaryVariant} sx={{ color: 'base.50' }}>
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
      aria-label="Evaluation criteria"
      sx={{
        position: sticky ? 'sticky' : 'static',
        top: navigation.barHeight,
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
            const { color, icon } = teamStyle[team.id]
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
                  color: active ? 'common.black' : color,
                  bgcolor: active ? color : 'transparent',
                  '&:hover, &:focus-visible': {
                    bgcolor: active ? color : alpha(color, 0.16),
                    outline: 'none',
                  },
                }}
              >
                <TeamIcon team={icon} size={18} />
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
  accent,
  variant = 'h2',
}: {
  /** Section number shown above the title; omitted on pages that list sections in a rail. */
  number?: string
  title: string
  id: string
  /** Team color for the number. */
  accent?: string
  /** Type style for the title; it stays an h2 element either way. */
  variant?: 'h2' | 'h3'
}) {
  return (
    <Stack spacing={jtSpacing.gap.xs} sx={{ mb: jtSpacing.gap.lg }}>
      {number && (
        <Typography variant="numberArticle" component="p" aria-hidden="true" sx={{ color: accent }}>
          {number}
        </Typography>
      )}
      <Typography variant={variant} component="h2" id={id}>
        {title}
      </Typography>
    </Stack>
  )
}
