import TuneRoundedIcon from '@mui/icons-material/TuneRounded'
import { Box, ButtonBase, Stack, Typography } from '@mui/material'
import { motion, useReducedMotion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { jtSpacing, ranking } from '@/theme'
import { RANK_LABEL } from '../../styles'
import { TeamIcon } from '@/ui'
import { EQUAL_WEIGHTS, TEAMS, fmtWeight, weightedRanking } from '../../model/teams'
import type { Scenario, WeightedScenario } from '../../model/teams'
import { UNRANKED, rankLabel } from './scoreFormat'
import { Legend, ScaleGuide, ScoreBar, ScoreValue } from './ScoreScale'

/** The only priority levels a visitor can pick, one button each. */
const PRIORITY_STEPS = [0.5, 1, 2, 3]

const RERANK_TRANSITION = { duration: ranking.motion.rerankSeconds, ease: 'easeOut' } as const

const rowCenter = (index: number) => ranking.rowHeight / 2 + index * ranking.rowHeight

function PriorityControls({
  weights,
  onChange,
}: {
  weights: number[]
  onChange: (teamIndex: number, weight: number) => void
}) {
  return (
    <Box>
      <Stack
        direction="row"
        spacing={jtSpacing.gap.sm}
        sx={{
          minHeight: ranking.controlHeight,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Stack direction="row" spacing={jtSpacing.gap.sm} sx={{ alignItems: 'center' }}>
          <TuneRoundedIcon sx={{ color: 'primary.main' }} />
          <Typography variant="h4" component="h3" sx={{ whiteSpace: 'nowrap' }}>
            Set your priorities
          </Typography>
        </Stack>
      </Stack>
      <Box sx={{ minHeight: ranking.weightedSubheadHeight, display: 'flex', alignItems: 'center' }}>
        <Typography variant="captionSmall" component="p">
          ×½ halves a criterion’s influence; ×3 triples it.
        </Typography>
      </Box>
      {/* One line per criterion: name, then a button per priority level. */}
      <Stack>
        {TEAMS.map((team, index) => (
          <Box
            key={team.key}
            role="group"
            aria-label={`${team.name} priority`}
            sx={{
              display: 'grid',
              gap: jtSpacing.gap.xs,
              py: jtSpacing.component.sm,
              borderTop: 1,
              borderColor: 'border.subtle',
            }}
          >
            <Stack
              direction="row"
              spacing={jtSpacing.gap.xs}
              sx={{ alignItems: 'center', color: team.color }}
            >
              <TeamIcon team={team.key} size={ranking.teamIconSize} />
              <Typography variant="navigationLabel" noWrap sx={{ color: 'common.white' }}>
                {team.name}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={jtSpacing.gap.xs} sx={{ width: '100%' }}>
              {PRIORITY_STEPS.map((step) => {
                const active = weights[index] === step
                return (
                  <ButtonBase
                    key={step}
                    aria-pressed={active}
                    onClick={() => onChange(index, step)}
                    sx={{
                      typography: 'chartValueLarge',
                      minWidth: ranking.priorityButton.minWidth,
                      height: ranking.priorityButton.height,
                      px: jtSpacing.component.xs,
                      flex: 1,
                      borderRadius: ranking.priorityButton.radius,
                      border: 1,
                      borderColor: active ? team.color : 'border.default',
                      bgcolor: active ? team.color : 'transparent',
                      color: active ? 'common.black' : 'base.100',
                      '&:hover, &.Mui-focusVisible': {
                        borderColor: team.color,
                        color: active ? 'common.black' : 'common.white',
                      },
                    }}
                  >
                    ×{fmtWeight(step)}
                  </ButtonBase>
                )
              })}
            </Stack>
          </Box>
        ))}
      </Stack>
    </Box>
  )
}

function CurrentRanking({ scenarios }: { scenarios: WeightedScenario[] }) {
  const reduceMotion = useReducedMotion()

  return (
    <Box sx={{ position: 'relative' }}>
      <ScaleGuide
        columns={{ sm: ranking.columns.current.sm }}
        columnGap={jtSpacing.gap.sm}
        column={3}
        from="sm"
      />
      {scenarios.map((scenario, index) => (
        <Box
          key={scenario.name}
          component={motion.div}
          layout="position"
          transition={reduceMotion ? { duration: 0 } : RERANK_TRANSITION}
          sx={{
            position: 'relative',
            display: 'grid',
            gridTemplateColumns: ranking.columns.current,
            gap: jtSpacing.gap.sm,
            alignItems: 'center',
            height: ranking.rowHeight,
            borderTop: 1,
            borderColor: 'border.subtle',
          }}
        >
          <Typography variant="chartValueLarge" sx={RANK_LABEL}>
            {scenario.hasScores ? rankLabel(index + 1) : UNRANKED}
          </Typography>
          <Typography variant="navigationLabel" sx={{ whiteSpace: 'nowrap' }}>
            {scenario.name}
          </Typography>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <ScoreBar score={scenario.wAvg} />
          </Box>
          <ScoreValue scenario={scenario} />
        </Box>
      ))}
    </Box>
  )
}

function RankingLinks({
  scenarios,
  equal,
}: {
  scenarios: WeightedScenario[]
  equal: WeightedScenario[]
}) {
  const reduceMotion = useReducedMotion()
  const { width, bend, strokeWidth, opacity, color } = ranking.links
  const height = ranking.rowHeight * equal.length

  return (
    <Box
      component="svg"
      aria-hidden
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      sx={{ display: 'block', overflow: 'visible', color }}
    >
      {scenarios.map((scenario, now) => {
        const before = equal.findIndex(({ name }) => name === scenario.name)
        const moved = before !== now
        return (
          <motion.path
            key={scenario.name}
            fill="none"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeLinecap="round"
            initial={false}
            animate={{
              d: `M0,${rowCenter(now)} L${width * bend[0]},${rowCenter(now)} L${width * bend[1]},${rowCenter(before)} L${width},${rowCenter(before)}`,
              strokeWidth: moved ? strokeWidth.moved : strokeWidth.resting,
              opacity: moved ? opacity.moved : opacity.resting,
            }}
            transition={reduceMotion ? { duration: 0 } : RERANK_TRANSITION}
          />
        )
      })}
    </Box>
  )
}

function EqualRanking({ equal }: { equal: WeightedScenario[] }) {
  return (
    <Box>
      {equal.map((scenario) => (
        <Box
          key={scenario.name}
          sx={{
            display: 'grid',
            gridTemplateColumns: ranking.columns.equal,
            gap: jtSpacing.gap.sm,
            alignItems: 'center',
            height: ranking.rowHeight,
            borderTop: 1,
            borderColor: 'border.subtle',
          }}
        >
          <Typography variant="chartValueLarge" sx={{ color: 'base.200' }}>
            {scenario.hasScores ? rankLabel(scenario.rank) : UNRANKED}
          </Typography>
          <Typography variant="navigationLabel" sx={{ color: 'base.100', whiteSpace: 'nowrap' }}>
            {scenario.name}
          </Typography>
        </Box>
      ))}
    </Box>
  )
}

/** Priorities beside the reweighted ranking of one scenario set. */
export default function WeightedRankingChart({ scenarios: set }: { scenarios: Scenario[] }) {
  const [weights, setWeights] = useState([...EQUAL_WEIGHTS])
  const scenarios = useMemo(() => weightedRanking(weights, set), [weights, set])
  const equal = useMemo(() => weightedRanking(EQUAL_WEIGHTS, set), [set])
  const setWeight = (teamIndex: number, weight: number) =>
    setWeights((current) => current.map((value, i) => (i === teamIndex ? weight : value)))

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: ranking.columns.layout,
        gap: { xs: jtSpacing.section.md, lg: jtSpacing.section.lg },
        alignItems: 'start',
      }}
    >
      <PriorityControls weights={weights} onChange={setWeight} />

      {/* Current ranking, linked row by row to the equal-weight ranking. */}
      <Box>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: ranking.columns.linked,
            columnGap: jtSpacing.gap.sm,
            alignItems: 'end',
          }}
        >
          <Stack
            direction="row"
            sx={{
              minHeight: ranking.controlHeight,
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="h4" component="h3">
              Your ranking
            </Typography>
            <Typography variant="captionSmall">Weighted score</Typography>
          </Stack>
          <Box sx={{ display: { xs: 'none', md: 'block' } }} />
          <Typography
            variant="h4"
            component="h3"
            sx={{
              display: { xs: 'none', md: 'flex' },
              minHeight: ranking.controlHeight,
              alignItems: 'center',
              color: 'base.100',
            }}
          >
            Equal weights
          </Typography>

          <Box
            sx={{
              minHeight: ranking.weightedSubheadHeight,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Legend />
          </Box>
          <Box sx={{ display: { xs: 'none', md: 'block' } }} />
          <Box sx={{ display: { xs: 'none', md: 'block' } }} />

          <CurrentRanking scenarios={scenarios} />
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <RankingLinks scenarios={scenarios} equal={equal} />
          </Box>
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <EqualRanking equal={equal} />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
