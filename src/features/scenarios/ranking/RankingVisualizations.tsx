import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded'
import TuneRoundedIcon from '@mui/icons-material/TuneRounded'
import { Box, Button, ButtonBase, Collapse, Slider, Stack, Typography } from '@mui/material'
import type { Breakpoint, Theme } from '@mui/material/styles'
import { motion, useReducedMotion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { jtSpacing, numbering, ranking } from '../../../theme'
import TeamIcon from '../../../ui/TeamIcon'
import {
  EQUAL_WEIGHTS,
  RANKED,
  SCENARIOS,
  TEAMS,
  fmtScore,
  weightedRanking,
} from '../../../internal/rank-visualization/data'
import type { WeightedScenario } from '../../../internal/rank-visualization/data'

const SCORE_MIN = -5
const SCORE_MAX = 5

const scorePosition = (score: number) => `${((score - SCORE_MIN) / (SCORE_MAX - SCORE_MIN)) * 100}%`

/** Ordinal ranks (1st, 2nd…), kept apart from the 01/02 numbering used elsewhere on the site. */
const rankLabel = (rank: number) => `${rank}${['th', 'st', 'nd', 'rd'][rank] ?? 'th'}`

const scoreColor = (score: number, theme: Theme) =>
  score > 0
    ? theme.chart.voting.above
    : score < 0
      ? theme.chart.voting.below
      : theme.chart.voting.baseline

function Legend() {
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={jtSpacing.gap.md}
      sx={{ color: 'base.100' }}
    >
      <Stack direction="row" spacing={jtSpacing.gap.xs} sx={{ alignItems: 'center' }}>
        <Box
          sx={(theme) => ({
            width: ranking.legend.swatchWidth,
            borderTop: ranking.legend.swatchHeight,
            borderColor: theme.chart.voting.above,
          })}
        />
        <Typography variant="captionSmall">Reported score</Typography>
      </Stack>
      <Stack direction="row" spacing={jtSpacing.gap.xs} sx={{ alignItems: 'center' }}>
        <Box
          sx={{
            width: ranking.legend.swatchWidth,
            borderTop: ranking.bar.outlineWidth,
            borderStyle: 'dashed',
            borderColor: 'base.100',
          }}
        />
        <Typography variant="captionSmall">Illustrative value—data not yet available</Typography>
      </Stack>
    </Stack>
  )
}

function Scale() {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', color: 'base.200' }}>
      <Typography variant="captionSmall">−5 worse</Typography>
      <Typography variant="captionSmall">0 baseline</Typography>
      <Typography variant="captionSmall" sx={{ textAlign: 'right' }}>
        +5 better
      </Typography>
    </Box>
  )
}

function ScoreBar({
  score,
  provisional,
  color,
}: {
  score: number
  provisional: boolean
  color?: string
}) {
  const left = score < 0 ? scorePosition(score) : '50%'
  const right = score < 0 ? '50%' : scorePosition(score)

  return (
    <Box
      sx={{
        position: 'relative',
        height: ranking.trackHeight,
        borderBottom: 1,
        borderColor: 'border.subtle',
      }}
    >
      {score !== 0 && (
        <Box
          sx={(theme) => ({
            position: 'absolute',
            left,
            width: `calc(${right} - ${left})`,
            top: '50%',
            height: ranking.bar.height,
            transform: 'translateY(-50%)',
            bgcolor: provisional ? 'transparent' : (color ?? scoreColor(score, theme)),
            border: provisional ? ranking.bar.outlineWidth : 0,
            borderStyle: provisional ? 'dashed' : 'solid',
            borderColor: color ?? scoreColor(score, theme),
          })}
        />
      )}
      {score === 0 && color && (
        <Box
          sx={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: ranking.bar.zeroMarkWidth,
            height: ranking.bar.height,
            bgcolor: color,
            transform: 'translate(-50%, -50%)',
          }}
        />
      )}
    </Box>
  )
}

/**
 * Zero line through a list's score-bar column, drawn on a grid that mirrors the rows so it
 * lands on the bars' center at every width.
 */
function ZeroGuide({
  columns,
  columnGap,
  column,
  from,
}: {
  columns: Partial<Record<Breakpoint, string>>
  columnGap: number | Partial<Record<Breakpoint, number>>
  column: number
  from: Breakpoint
}) {
  return (
    <Box
      aria-hidden
      sx={{
        display: { xs: 'none', [from]: 'grid' },
        gridTemplateColumns: columns,
        columnGap,
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
      }}
    >
      <Box
        sx={{
          gridColumn: column,
          justifySelf: 'center',
          borderLeft: ranking.zeroLine.width,
          borderColor: ranking.zeroLine.color,
        }}
      />
    </Box>
  )
}

function TeamBreakdown({ scenario }: { scenario: (typeof SCENARIOS)[number] }) {
  return (
    <Stack spacing={jtSpacing.gap.xs} sx={{ py: jtSpacing.component.md }}>
      {TEAMS.map((team, index) => {
        const score = scenario.scores[index] ?? 0
        const provisional = scenario.provisional[index]

        return (
          <Box
            key={team.key}
            sx={{
              display: 'grid',
              gridTemplateColumns: ranking.columns.team,
              gap: jtSpacing.gap.md,
              alignItems: 'center',
              minHeight: ranking.trackHeight,
            }}
          >
            <Stack
              direction="row"
              spacing={jtSpacing.gap.xs}
              sx={{ alignItems: 'center', color: team.color }}
            >
              <TeamIcon team={team.key} size={ranking.teamIconSize} />
              <Typography variant="navigationLabel" sx={{ color: 'inherit' }}>
                {team.name}
              </Typography>
            </Stack>
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <ScoreBar score={score} provisional={provisional} color={team.color} />
            </Box>
            <Typography
              variant={provisional ? 'captionSmall' : 'chartValueLarge'}
              sx={{
                color: provisional ? 'base.200' : team.color,
                textAlign: { md: 'right' },
                whiteSpace: 'nowrap',
              }}
            >
              {provisional ? `Illustrative ${fmtScore(score)}` : fmtScore(score)}
            </Typography>
          </Box>
        )
      })}
    </Stack>
  )
}

const average = (scores: (number | null)[]) => {
  const values = scores.filter((score): score is number => score !== null)
  return values.reduce((sum, score) => sum + score, 0) / values.length
}

const OVERALL_GAP = { xs: jtSpacing.gap.xs, md: jtSpacing.gap.md }

export function OverallRankingChart() {
  const [expanded, setExpanded] = useState(() => new Set(SCENARIOS.map(({ name }) => name)))
  const allExpanded = expanded.size === SCENARIOS.length
  const ranked = useMemo(
    () =>
      SCENARIOS.map((scenario) => ({
        ...scenario,
        average: average(scenario.scores),
        hasProvisional: scenario.provisional.some(Boolean),
      })).sort((a, b) => b.average - a.average),
    [],
  )

  return (
    <Stack spacing={jtSpacing.component.lg}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={jtSpacing.gap.md}
        sx={{ alignItems: { sm: 'center' }, justifyContent: 'space-between' }}
      >
        <Legend />
        <Button
          variant="outlined"
          size="small"
          onClick={() =>
            setExpanded(allExpanded ? new Set() : new Set(SCENARIOS.map(({ name }) => name)))
          }
        >
          {allExpanded ? 'Collapse all scenarios' : 'Expand all scenarios'}
        </Button>
      </Stack>
      <Box>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: ranking.columns.overall,
            columnGap: OVERALL_GAP,
            alignItems: 'end',
            pb: jtSpacing.component.sm,
          }}
        >
          <Typography variant="captionSmall">Rank</Typography>
          <Typography variant="captionSmall">Scenario</Typography>
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <Scale />
          </Box>
          <Typography variant="captionSmall" sx={{ textAlign: 'right' }}>
            Score
          </Typography>
        </Box>
        <Box sx={{ position: 'relative' }}>
          {/* The guide follows the scenario rows' columns, not the indented team rows. */}
          <ZeroGuide
            columns={ranking.columns.overall}
            columnGap={OVERALL_GAP}
            column={3}
            from="md"
          />
          {ranked.map((scenario, index) => {
            const open = expanded.has(scenario.name)
            return (
              <Box
                key={scenario.name}
                sx={{ position: 'relative', borderTop: 1, borderColor: 'border.subtle' }}
              >
                <ButtonBase
                  onClick={() =>
                    setExpanded((current) => {
                      const next = new Set(current)
                      if (next.has(scenario.name)) next.delete(scenario.name)
                      else next.add(scenario.name)
                      return next
                    })
                  }
                  aria-expanded={open}
                  aria-label={`${open ? 'Hide' : 'Show'} ${scenario.name} criterion scores`}
                  sx={{
                    width: '100%',
                    display: 'grid',
                    gridTemplateColumns: ranking.columns.overall,
                    columnGap: OVERALL_GAP,
                    alignItems: 'center',
                    minHeight: ranking.rowHeight,
                    textAlign: 'left',
                    '&:hover, &.Mui-focusVisible': { bgcolor: 'translucent.100' },
                  }}
                >
                  <Typography variant="numberRank">{rankLabel(index + 1)}</Typography>
                  <Stack
                    direction="row"
                    sx={{ alignItems: 'center', justifyContent: 'space-between' }}
                  >
                    <Typography variant="navigationLabel">{scenario.name}</Typography>
                    <ExpandMoreRoundedIcon
                      sx={{
                        color: 'base.100',
                        transform: open ? 'rotate(180deg)' : 'none',
                        transition: `transform ${ranking.motion.expandMs}ms ease`,
                      }}
                    />
                  </Stack>
                  <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                    <ScoreBar score={scenario.average} provisional={scenario.hasProvisional} />
                  </Box>
                  <Typography
                    variant="chartValueLarge"
                    sx={(theme) => ({
                      textAlign: 'right',
                      color: scoreColor(scenario.average, theme),
                    })}
                  >
                    {fmtScore(scenario.average)}
                  </Typography>
                </ButtonBase>
                <Collapse in={open} timeout={ranking.motion.expandMs}>
                  {/* Team rows start under the scenario name, past the rank column. */}
                  <Box
                    sx={(theme) => ({
                      pl: {
                        xs: 0,
                        md: `calc(${numbering.rank.width.sm} + ${theme.spacing(jtSpacing.gap.md)})`,
                      },
                    })}
                  >
                    <TeamBreakdown scenario={scenario} />
                  </Box>
                </Collapse>
              </Box>
            )
          })}
        </Box>
      </Box>
    </Stack>
  )
}

/** The only priority levels a visitor can pick; the slider steps through them evenly. */
const PRIORITY_STEPS = [0.5, 1, 2, 3]
const PRIORITY_MARKS = PRIORITY_STEPS.map((_, index) => ({ value: index }))
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
        sx={{ alignItems: 'center', mb: jtSpacing.component.sm }}
      >
        <TuneRoundedIcon sx={{ color: 'primary.main' }} />
        <Typography variant="h4" component="h3" sx={{ whiteSpace: 'nowrap' }}>
          Set your priorities
        </Typography>
      </Stack>
      {/* One line per team: name, stepped slider, current weight. */}
      <Stack>
        {TEAMS.map((team, index) => (
          <Box
            key={team.key}
            sx={{
              display: 'grid',
              gridTemplateColumns: ranking.columns.control,
              gap: jtSpacing.gap.sm,
              alignItems: 'center',
              minHeight: ranking.controlHeight,
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
            <Slider
              size="small"
              min={0}
              max={PRIORITY_STEPS.length - 1}
              step={1}
              marks={PRIORITY_MARKS}
              scale={(step) => PRIORITY_STEPS[step]}
              value={PRIORITY_STEPS.indexOf(weights[index])}
              onChange={(_, step) => onChange(index, PRIORITY_STEPS[step as number])}
              getAriaValueText={(weight) => `×${weight}`}
              aria-label={`${team.name} priority weight`}
              sx={{ color: team.color }}
            />
            <Typography variant="chartValueLarge" sx={{ textAlign: 'right' }}>
              ×{weights[index]}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Box>
  )
}

function CurrentRanking({
  scenarios,
  weights,
}: {
  scenarios: WeightedScenario[]
  weights: number[]
}) {
  const reduceMotion = useReducedMotion()

  return (
    <Box sx={{ position: 'relative' }}>
      <ZeroGuide
        columns={{ sm: ranking.columns.current.sm }}
        columnGap={jtSpacing.gap.sm}
        column={3}
        from="sm"
      />
      {scenarios.map((scenario, index) => {
        const provisional = scenario.provisional.some(
          (value, teamIndex) => value && weights[teamIndex] > 0,
        )
        return (
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
            <Typography variant="numberRank">{rankLabel(index + 1)}</Typography>
            <Typography variant="navigationLabel">{scenario.name}</Typography>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <ScoreBar score={scenario.wAvg} provisional={provisional} />
            </Box>
            <Typography
              variant="chartValueLarge"
              sx={(theme) => ({ textAlign: 'right', color: scoreColor(scenario.wAvg, theme) })}
            >
              {fmtScore(scenario.wAvg)}
            </Typography>
          </Box>
        )
      })}
    </Box>
  )
}

function RankingLinks({ scenarios }: { scenarios: WeightedScenario[] }) {
  const reduceMotion = useReducedMotion()
  const { width, bend, strokeWidth, opacity, color } = ranking.links
  const height = ranking.rowHeight * RANKED.length

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
        const before = RANKED.findIndex(({ name }) => name === scenario.name)
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

function EqualRanking() {
  return (
    <Box>
      {RANKED.map((scenario) => (
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
          <Typography variant="numberRank" sx={{ color: 'base.200' }}>
            {rankLabel(scenario.rank)}
          </Typography>
          <Typography variant="navigationLabel" sx={{ color: 'base.100' }}>
            {scenario.name}
          </Typography>
        </Box>
      ))}
    </Box>
  )
}

export function WeightedRankingChart() {
  const [weights, setWeights] = useState([...EQUAL_WEIGHTS])
  const scenarios = useMemo(() => weightedRanking(weights), [weights])
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
            sx={{ justifyContent: 'space-between', alignItems: 'end', mb: jtSpacing.component.sm }}
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
              display: { xs: 'none', md: 'block' },
              mb: jtSpacing.component.sm,
              color: 'base.100',
            }}
          >
            Equal weights
          </Typography>

          <CurrentRanking scenarios={scenarios} weights={weights} />
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <RankingLinks scenarios={scenarios} />
          </Box>
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <EqualRanking />
          </Box>
        </Box>
        <Box sx={{ mt: jtSpacing.component.md }}>
          <Legend />
        </Box>
      </Box>
    </Box>
  )
}
