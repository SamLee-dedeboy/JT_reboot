// The card beside a hovered or tapped action in the path tree: its strategy area, its
// text, who leads it, and a column per alignment score (low to high) with the scenarios that
// gave it stacked along it (the highlighted one in green).
import { Box, Stack, Typography, useTheme } from '@mui/material'
import { Fragment } from 'react'
import { scenarioName } from '@/content/names'
import { jtSpacing } from '@/theme'
import { LEADS, PATH_SECTION, SCORE_MEANING, STRATEGY_AREA_NAMES } from '../content'
import type { GovernanceScenarioKey } from '../data/types'
import { BRANCH_ORDER, SCORE_LEVELS, averageScore, type TreeRow } from '../model/pathTree'

const clip = (text: string, max: number) =>
  text.length > max ? `${text.slice(0, max).replace(/\s+\S*$/, '')}…` : text

export default function ActionTooltip({
  row,
  pinned,
  isTop,
  left,
  top,
  width,
  above,
}: {
  row: TreeRow
  pinned: GovernanceScenarioKey | null
  /** One of the team's overall top actions. */
  isTop: boolean
  left: number
  top: number
  width: number
  /** Opens upward from `top` when the action sits near the bottom of the tree. */
  above: boolean
}) {
  const theme = useTheme()
  const tokens = theme.chart.governance
  const { action } = row
  const shared = row.members.length
  const tags = [
    isTop ? PATH_SECTION.shapes.top : null,
    shared === 1 ? PATH_SECTION.shapes.exclusive : null,
  ].filter((tag): tag is string => Boolean(tag))
  const leads = action.leads.map((key) => LEADS.find((entry) => entry.key === key))
  const unscored = BRANCH_ORDER.filter((key) => action.scores[key] === 0)

  return (
    <Box
      role="status"
      aria-live="polite"
      sx={{
        position: 'absolute',
        left,
        top,
        width,
        transform: above ? 'translateY(-100%)' : undefined,
        zIndex: 2,
        pointerEvents: 'none',
        p: jtSpacing.component.md,
        bgcolor: theme.chart.tooltip.background,
        border: 1,
        borderColor: theme.chart.tooltip.border,
        borderRadius: 2,
        boxShadow: 8,
      }}
    >
      <Stack spacing={jtSpacing.gap.sm}>
        {/* Strategy area, then its tags. */}
        <Stack direction="row" spacing={jtSpacing.gap.xs} sx={{ alignItems: 'center' }}>
          <Box
            aria-hidden
            sx={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              flex: 'none',
              bgcolor: tokens.area[action.area],
            }}
          />
          <Typography variant="captionSmall" component="span" sx={{ color: 'common.white' }}>
            {STRATEGY_AREA_NAMES[action.area]}
          </Typography>
          <Box sx={{ flex: 1 }} />
          {tags.map((tag) => (
            <Typography
              key={tag}
              variant="captionSmall"
              component="span"
              sx={{
                color: 'primary.main',
                border: 1,
                borderColor: 'primary.main',
                borderRadius: 99,
                px: jtSpacing.component.xs,
                whiteSpace: 'nowrap',
              }}
            >
              {tag}
            </Typography>
          ))}
        </Stack>

        <Typography variant="captionProse" component="p" sx={{ color: 'common.white' }}>
          {clip(action.text, 260)}
        </Typography>

        <Typography variant="captionSmall" component="p">
          {PATH_SECTION.actionCard.ledBy}{' '}
          {leads.map((entry, index) => (
            <Fragment key={action.leads[index]}>
              {index > 0 && ', '}
              <Box
                component="span"
                title={entry?.lane}
                sx={{ color: entry?.abbr ? tokens.lead : 'common.white' }}
              >
                {entry?.abbr ?? entry?.short ?? action.leads[index]}
              </Box>
            </Fragment>
          ))}{' '}
          {action.partners > 0 && PATH_SECTION.actionCard.partners(action.partners)}
        </Typography>

        {/* A column per score, low to high as the paths run; the scenarios that gave it
          stacked on it, its name under the baseline. */}
        <Box
          sx={{
            display: 'grid',
            // Scores the scenarios gave get more room than the empty ones.
            gridTemplateColumns: SCORE_LEVELS.map((level) =>
              BRANCH_ORDER.some((key) => action.scores[key] === level)
                ? 'minmax(min-content, 1.8fr)'
                : 'minmax(min-content, 1fr)',
            ).join(' '),
            columnGap: jtSpacing.gap.sm,
            pt: jtSpacing.component.sm,
            borderTop: 1,
            borderColor: 'border.subtle',
          }}
        >
          {SCORE_LEVELS.map((level) => {
            const here = BRANCH_ORDER.filter((key) => action.scores[key] === level)
            return (
              <Stack
                key={level}
                aria-label={`${SCORE_MEANING[level]}: ${here.map((key) => scenarioName(key)).join(', ') || 'none'}`}
                sx={{ justifyContent: 'flex-end', gap: jtSpacing.component.xs / 4 }}
              >
                {here.map((key) => {
                  const on = pinned === key
                  return (
                    <Typography
                      key={key}
                      variant="captionSmall"
                      component="span"
                      sx={{
                        px: jtSpacing.component.xs / 2,
                        py: jtSpacing.component.xs / 4,
                        borderRadius: 1,
                        bgcolor: tokens.band,
                        border: 1,
                        borderColor: on ? 'primary.main' : 'transparent',
                        color: on ? 'primary.main' : 'common.white',
                      }}
                    >
                      {scenarioName(key)}
                    </Typography>
                  )
                })}
              </Stack>
            )
          })}
          {SCORE_LEVELS.map((level) => {
            const filled = BRANCH_ORDER.some((key) => action.scores[key] === level)
            return (
              <Typography
                key={`${level}-label`}
                variant="captionSmall"
                component="span"
                title={level.toFixed(2)}
                sx={{
                  mt: jtSpacing.component.xs / 2,
                  pt: jtSpacing.component.xs / 2,
                  borderTop: 1,
                  borderColor: filled ? 'base.200' : 'border.subtle',
                  color: filled ? 'base.100' : 'base.300',
                }}
              >
                {SCORE_MEANING[level]}
              </Typography>
            )
          })}
        </Box>

        <Typography variant="captionSmall" component="p" sx={{ color: 'base.200' }}>
          {PATH_SECTION.actionCard.average(averageScore(action).toFixed(2), shared)}
          {unscored.length > 0 &&
            ` · ${PATH_SECTION.actionCard.notConsidered} ${unscored.map((key) => scenarioName(key)).join(', ')}`}
        </Typography>
      </Stack>
    </Box>
  )
}
