// The nine scenarios as a three-by-three grid: a row per restoration level, a column per
// prioritized landscape, each cell drawn as a ScenarioGlyph.
import { Box, Typography } from '@mui/material'
import type { SxProps, Theme } from '@mui/material/styles'
import { jtSpacing } from '../../theme'
import { restorableAcres, treatmentShares } from './outcomes'
import {
  HABITAT_META,
  LANDSCAPES,
  LEVEL_LABELS,
  PRIORITIES,
  RESTORATION_LEVELS,
  landscapeOf,
} from './habitats'
import ScenarioGlyph, { type ScenarioSegment } from './ScenarioGlyph'
import type { Landscape, PriorityLandscape, RestorationLevel } from './types'

const RESTORABLE: Record<Landscape, number> = {
  forests: restorableAcres.forests,
  meadows: restorableAcres.meadows,
  floodplains: restorableAcres.floodplainOpportunity,
}

function segmentsFor(level: RestorationLevel, priority: PriorityLandscape) {
  const shares = treatmentShares[level][priority]
  return Object.fromEntries(
    LANDSCAPES.map((landscape): [Landscape, ScenarioSegment] => [
      landscape,
      {
        landscape,
        acres: shares[landscape] * RESTORABLE[landscape],
        percent: shares[landscape] * 100,
      },
    ]),
  ) as Record<Landscape, ScenarioSegment>
}

function shareSpan(level: RestorationLevel, landscape: Landscape) {
  const values = PRIORITIES.map((priority) =>
    Math.round(treatmentShares[level][priority][landscape] * 100),
  )
  const low = Math.min(...values)
  const high = Math.max(...values)
  return low === high ? `${low}%` : `${low}–${high}%`
}

const columnsSx = {
  display: 'grid',
  gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'repeat(3, minmax(0, 1fr))' },
  columnGap: jtSpacing.gap.xl,
  rowGap: jtSpacing.gap.lg,
} as const

/** From md up, a rule centred in the gap separates the three priorities. */
const cellSx = (index: number): SxProps<Theme> => ({
  position: 'relative',
  minWidth: 0,
  '&::before': index
    ? {
        content: '""',
        display: { xs: 'none', md: 'block' },
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: (theme: Theme) => `calc(${theme.spacing(jtSpacing.gap.xl)} / -2)`,
        borderLeft: 1,
        borderColor: 'border.subtle',
      }
    : {},
})

export default function ScenarioMatrix() {
  return (
    <Box>
      {/* Column heads, shown once from md up; below md each cell names its priority */}
      <Box
        aria-hidden
        sx={{ ...columnsSx, display: { xs: 'none', md: 'grid' }, pb: jtSpacing.gap.sm }}
      >
        {PRIORITIES.map((priority) => {
          const meta = HABITAT_META[landscapeOf(priority)]
          return (
            <Typography
              key={priority}
              variant="eyebrow"
              component="p"
              sx={{ color: meta.baseColor }}
            >
              Prioritize {meta.label}
            </Typography>
          )
        })}
      </Box>

      {RESTORATION_LEVELS.map((level, levelIndex) => (
        <Box
          key={level}
          component="section"
          aria-labelledby={`scenario-level-${level}`}
          sx={{ py: jtSpacing.gap.lg, borderTop: 1, borderColor: 'border.subtle' }}
        >
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: jtSpacing.gap.sm }}>
            <Typography variant="numberBadge" component="span" sx={{ color: 'primary.main' }}>
              {String(levelIndex + 1).padStart(2, '0')}
            </Typography>
            <Typography variant="h4" component="h3" id={`scenario-level-${level}`}>
              {LEVEL_LABELS[level]} restoration
            </Typography>
          </Box>
          <Typography
            variant="body2"
            sx={{ color: 'base.200', mt: jtSpacing.gap.xs, mb: jtSpacing.gap.lg }}
          >
            Treats {shareSpan(level, 'forests')} of forest, {shareSpan(level, 'meadows')} of meadow
            and {shareSpan(level, 'floodplains')} of floodplain acres, depending on which landscape
            comes first.
          </Typography>

          <Box sx={columnsSx}>
            {PRIORITIES.map((priority, index) => {
              const meta = HABITAT_META[landscapeOf(priority)]
              const segments = segmentsFor(level, priority)
              const percent = (landscape: Landscape) => Math.round(segments[landscape].percent)
              return (
                <Box key={priority} sx={cellSx(index)}>
                  <Typography
                    variant="eyebrow"
                    component="h4"
                    sx={{
                      display: { md: 'none' },
                      color: meta.baseColor,
                      mb: jtSpacing.gap.xs,
                    }}
                  >
                    Prioritize {meta.label}
                  </Typography>
                  <ScenarioGlyph
                    segments={segments}
                    label={`${LEVEL_LABELS[level]} restoration prioritizing ${meta.label.toLowerCase()}: forests ${percent('forests')}%, meadows ${percent('meadows')}% and floodplains ${100 + percent('floodplains')}% of today's restorable area`}
                  />
                </Box>
              )
            })}
          </Box>
        </Box>
      ))}
    </Box>
  )
}
