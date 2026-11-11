// Shared pieces of the evaluation pages: the image hero with breadcrumbs, the
// team switcher, and the score badge used for baseline-relative team scores.
import { Box, Container, Stack, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { jtSpacing, navigation } from '../../../theme'
import TeamIcon from '../../../ui/TeamIcon'
import { evaluationTeams } from '../content'
import { teamStyle } from '../teamStyle'

export function Diamond({ accent }: { accent: string }) {
  return (
    <Box
      aria-hidden="true"
      sx={{ width: 6, height: 6, mt: 0.875, bgcolor: accent, transform: 'rotate(45deg)' }}
    />
  )
}

/** A tinted box of caveats, each with a diamond in the accent color. */
export function CaveatsPanel({
  title = 'Caveats and Clarifications',
  accent,
  caveats,
}: {
  title?: string
  accent: string
  caveats: { key: string; content: ReactNode }[]
}) {
  return (
    <Box sx={{ p: jtSpacing.component.md, bgcolor: alpha(accent, 0.06) }}>
      <Typography variant="navigationSubLabel" component="h3" sx={{ color: accent }}>
        {title}
      </Typography>
      <Box component="ul" sx={{ m: 0, mt: jtSpacing.gap.sm, p: 0, listStyle: 'none' }}>
        {caveats.map(({ key, content }, index) => (
          <Box
            component="li"
            key={key}
            sx={{
              display: 'grid',
              gridTemplateColumns: '8px minmax(0, 1fr)',
              columnGap: jtSpacing.gap.sm,
              mt: index ? jtSpacing.gap.sm : 0,
            }}
          >
            <Diamond accent={accent} />
            <Typography variant="body2" sx={{ color: 'base.50' }}>
              {content}
            </Typography>
          </Box>
        ))}
      </Box>
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
