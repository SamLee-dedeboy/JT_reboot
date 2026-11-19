// The card over a lead organization's count: its name, how many of the highlighted
// scenario's actions it leads, and a dot bar per alignment score (one dot per action,
// colored by strategy area).
import { Box, Stack, Typography, useTheme } from '@mui/material'
import type { ReactNode } from 'react'
import { scenarioName } from '@/content/names'
import { jtSpacing } from '@/theme'
import { PATH_SECTION, SCORE_MEANING, STRATEGY_AREA_NAMES } from '../content'
import type { GovernanceAction, GovernanceScenarioKey } from '../data/types'
import { SCORE_LEVELS } from '../model/pathTree'

/** Highest score first. */
const LEVELS = [...SCORE_LEVELS].reverse()

export default function LeadTooltip({
  name,
  actions,
  scenario,
  left,
  top,
  width,
  above,
}: {
  name: ReactNode
  /** The scenario's actions (score above 0) the organization leads. */
  actions: GovernanceAction[]
  scenario: GovernanceScenarioKey
  left: number
  top: number
  width: number
  /** Opens upward from `top`. */
  above: boolean
}) {
  const theme = useTheme()
  const tokens = theme.chart.governance
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
      <Stack spacing={jtSpacing.gap.xs}>
        <Typography variant="chipLabel" component="p" sx={{ color: 'common.white' }}>
          {name}
        </Typography>
        <Typography variant="captionSmall" component="p">
          {PATH_SECTION.leadCard.leads(actions.length, scenarioName(scenario))}
        </Typography>
        {actions.length > 0 && (
          <>
            <Typography
              variant="captionSmall"
              component="p"
              sx={{
                color: 'base.200',
                pt: jtSpacing.component.xs,
                borderTop: 1,
                borderColor: 'border.subtle',
              }}
            >
              {PATH_SECTION.leadCard.byScore}
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 8.5rem) minmax(0, 1fr) auto',
                columnGap: jtSpacing.gap.sm,
                rowGap: jtSpacing.component.xs / 2,
                alignItems: 'center',
              }}
            >
              {LEVELS.map((level) => {
                const atLevel = actions.filter((action) => action.scores[scenario] === level)
                const color = atLevel.length ? 'common.white' : 'base.300'
                return [
                  <Typography
                    key={`${level}-v`}
                    variant="captionSmall"
                    title={level.toFixed(2)}
                    sx={{ color }}
                  >
                    {SCORE_MEANING[level]}
                  </Typography>,
                  <Box
                    key={`${level}-d`}
                    aria-label={`${atLevel.length} at ${level.toFixed(2)}: ${SCORE_MEANING[level]}`}
                    sx={{ display: 'flex', flexWrap: 'wrap', gap: '3px', minHeight: 8 }}
                  >
                    {atLevel.map((action) => (
                      <Box
                        key={action.id}
                        title={`${action.id} · ${STRATEGY_AREA_NAMES[action.area]}`}
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: tokens.area[action.area],
                        }}
                      />
                    ))}
                  </Box>,
                  <Typography
                    key={`${level}-n`}
                    variant="captionSmall"
                    sx={{ color, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}
                  >
                    {atLevel.length}
                  </Typography>,
                ]
              })}
            </Box>
          </>
        )}
      </Stack>
    </Box>
  )
}
