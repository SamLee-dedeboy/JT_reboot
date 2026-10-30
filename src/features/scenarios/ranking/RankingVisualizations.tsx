import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded'
import TuneRoundedIcon from '@mui/icons-material/TuneRounded'
import { Box, Button, ButtonBase, Collapse, Stack, Typography } from '@mui/material'
import type { Breakpoint, Theme } from '@mui/material/styles'
import { motion, useReducedMotion } from 'framer-motion'
import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { jtSpacing, numbering, ranking } from '../../../theme'
import { RANK_LABEL } from './styles'
import TeamIcon from '../../../ui/TeamIcon'
import {
  EQUAL_WEIGHTS,
  TEAMS,
  fmtScore,
  fmtWeight,
  roundScore,
  weightedRanking,
} from '../../../internal/rank-visualization/data'
import type { Scenario, WeightedScenario } from '../../../internal/rank-visualization/data'

const SCORE_MIN = -5
const SCORE_MAX = 5

const scorePosition = (score: number) => `${((score - SCORE_MIN) / (SCORE_MAX - SCORE_MIN)) * 100}%`

/** Every whole point on the track, −5…+5: a gridline and a label each. */
const TICKS = Array.from({ length: SCORE_MAX - SCORE_MIN + 1 }, (_, i) => SCORE_MIN + i)

/** Ordinal ranks (1st, 2nd…), kept apart from the 01/02 numbering used elsewhere on the site. */
const rankLabel = (rank: number) => `${rank}${['th', 'st', 'nd', 'rd'][rank] ?? 'th'}`

/** Rank and score text for a scenario no criterion has scored yet. */
const UNRANKED = '—'
const NOT_SCORED = 'Forthcoming'

const scoreColor = (score: number, theme: Theme) =>
  score > 0
    ? theme.chart.voting.above
    : score < 0
      ? theme.chart.voting.below
      : theme.chart.voting.baseline

const LEGEND = [
  { label: 'Better than today', color: (theme: Theme) => theme.chart.voting.above },
  { label: 'Worse than today', color: (theme: Theme) => theme.chart.voting.below },
]

function Legend() {
  return (
    <Stack direction="row" spacing={jtSpacing.gap.md} sx={{ color: 'base.100', flexWrap: 'wrap' }}>
      {LEGEND.map(({ label, color }) => (
        <Stack key={label} direction="row" spacing={jtSpacing.gap.xs} sx={{ alignItems: 'center' }}>
          <Box
            sx={(theme) => ({
              width: ranking.legend.swatchWidth,
              borderTop: ranking.legend.swatchHeight,
              borderColor: color(theme),
            })}
          />
          <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>
            {label}
          </Typography>
        </Stack>
      ))}
    </Stack>
  )
}

/** Column heads over the ranking rows: small capitals, spaced. */

/** Words beside the number at the ends and at zero; every other point is just its number. */
const SCALE_WORDS: Record<number, string> = {
  [SCORE_MIN]: 'worse',
  0: 'today',
  [SCORE_MAX]: 'better',
}

/**
 * Whole-point labels over the track. The ends sit flush with the track's edges so their
 * words stay inside it; the rest center on their gridlines. ±4 and ±1 sit beside the
 * worded labels (the ends, and zero), so they drop out first when the track narrows,
 * then ±2…3 below that.
 */
function Scale() {
  return (
    <Box
      sx={{
        position: 'relative',
        height: '1.2em',
        typography: 'captionSmall',
        containerType: 'inline-size',
      }}
    >
      {TICKS.map((tick) => {
        const word = SCALE_WORDS[tick]
        const hideBelow =
          Math.abs(tick) === SCORE_MAX - 1 ? 1000 : Math.abs(tick) === 1 ? 640 : word ? null : 450
        return (
          <Typography
            key={tick}
            variant="columnHead"
            sx={{
              position: 'absolute',
              whiteSpace: 'nowrap',
              ...(tick === SCORE_MIN
                ? { left: 0 }
                : tick === SCORE_MAX
                  ? { right: 0 }
                  : { left: scorePosition(tick), transform: 'translateX(-50%)' }),
              ...(hideBelow && { [`@container (max-width: ${hideBelow}px)`]: { display: 'none' } }),
            }}
          >
            {word ? `${fmtScore(tick)} ${word}` : fmtScore(tick)}
          </Typography>
        )
      })}
    </Box>
  )
}

function ScoreBar({ score }: { score: number }) {
  const left = score < 0 ? scorePosition(score) : '50%'
  const right = score < 0 ? '50%' : scorePosition(score)

  return (
    <Box
      sx={{
        position: 'relative',
        height: ranking.trackHeight,
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
            bgcolor: scoreColor(score, theme),
          })}
        />
      )}
    </Box>
  )
}

/** One criterion's score as a dot, on a stem from zero so its direction still reads. */
function ScoreDot({ score, color }: { score: number | null; color: string }) {
  if (score === null) return <Box sx={{ height: ranking.dot.rowHeight }} />
  const from = score < 0 ? scorePosition(score) : '50%'
  const to = score < 0 ? '50%' : scorePosition(score)

  return (
    <Box sx={{ position: 'relative', height: ranking.dot.rowHeight }}>
      <Box
        sx={{
          position: 'absolute',
          left: from,
          width: `calc(${to} - ${from})`,
          top: '50%',
          height: ranking.dot.stemWidth,
          transform: 'translateY(-50%)',
          bgcolor: color,
          opacity: ranking.dot.stemOpacity,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          left: scorePosition(score),
          top: '50%',
          width: ranking.dot.size,
          height: ranking.dot.size,
          borderRadius: '50%',
          bgcolor: color,
          transform: 'translate(-50%, -50%)',
        }}
      />
    </Box>
  )
}

/**
 * Gridlines through a list's score-bar column, one per whole point with zero drawn
 * stronger, on a grid that mirrors the rows so they land on the bars' scale at every width.
 */
function ScaleGuide({
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
      <Box sx={{ gridColumn: column, position: 'relative' }}>
        {TICKS.map((tick) => {
          const line =
            tick === 0
              ? ranking.zeroLine
              : Math.abs(tick) === SCORE_MAX
                ? ranking.gridLine
                : ranking.gridLineMinor
          return (
            <Box
              key={tick}
              sx={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: scorePosition(tick),
                transform: 'translateX(-50%)',
                borderLeft: `${line.width}px ${line.style}`,
                borderColor: line.color,
              }}
            />
          )
        })}
      </Box>
    </Box>
  )
}

function TeamBreakdown({ scenario }: { scenario: Scenario }) {
  return (
    <Stack sx={{ py: jtSpacing.component.sm }}>
      {TEAMS.map((team, index) => {
        const score = scenario.scores[index]

        return (
          <Box
            key={team.key}
            sx={{
              display: 'grid',
              gridTemplateColumns: ranking.columns.team,
              gap: jtSpacing.gap.md,
              alignItems: 'center',
              minHeight: ranking.dot.rowHeight,
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
              <ScoreDot score={score} color={team.color} />
            </Box>
            <Typography
              variant={score === null ? 'captionSmall' : 'chartValueLarge'}
              sx={{
                color: score === null ? 'base.200' : team.color,
                textAlign: { md: 'right' },
                whiteSpace: 'nowrap',
              }}
            >
              {score === null ? NOT_SCORED : fmtScore(score)}
            </Typography>
          </Box>
        )
      })}
    </Stack>
  )
}

function ScoreValue({ scenario }: { scenario: WeightedScenario }) {
  if (!scenario.hasScores) {
    return (
      <Typography variant="captionSmall" sx={{ textAlign: 'right', color: 'base.200' }}>
        {NOT_SCORED}
      </Typography>
    )
  }
  return (
    <Typography
      variant="numberScore"
      sx={(theme) => ({ textAlign: 'right', color: scoreColor(roundScore(scenario.wAvg), theme) })}
    >
      {fmtScore(scenario.wAvg)}
    </Typography>
  )
}

const OVERALL_GAP = { xs: jtSpacing.gap.xs, md: jtSpacing.gap.md }

/** The run every other scenario is scored against: 0 on every criterion. */
const BASELINES = new Set(['Business as Usual', 'Historic Baseline'])

/** Beside the baseline's zero line: which side is better and which worse than today. */
function BaselineSides() {
  const side = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'common.white',
  } as const
  return (
    <Box sx={{ position: 'relative', height: ranking.trackHeight }}>
      <Typography variant="captionSmall" sx={{ ...side, right: 'calc(50% + 10px)' }}>
        Above: better than today
      </Typography>
      <Typography variant="captionSmall" sx={{ ...side, left: 'calc(50% + 10px)' }}>
        Below: worse than today
      </Typography>
    </Box>
  )
}

/**
 * Equal-weight ranking of one scenario set; remount it (`key`) when the set changes.
 * `heading` opens the toolbar, ahead of the legend and the expand button.
 */
export function OverallRankingChart({
  scenarios,
  heading,
}: {
  scenarios: Scenario[]
  heading?: ReactNode
}) {
  const expandableScenarios = useMemo(
    () => scenarios.filter(({ name }) => !BASELINES.has(name)),
    [scenarios],
  )
  const [expanded, setExpanded] = useState(
    () => new Set(scenarios.filter(({ name }) => !BASELINES.has(name)).map(({ name }) => name)),
  )
  const allExpanded = expanded.size === expandableScenarios.length
  const ranked = useMemo(() => weightedRanking(EQUAL_WEIGHTS, scenarios), [scenarios])

  return (
    <Stack spacing={jtSpacing.component.lg}>
      <Stack
        direction={{ xs: 'column', lg: 'row' }}
        spacing={jtSpacing.gap.md}
        sx={{ alignItems: { lg: 'center' }, justifyContent: 'space-between' }}
      >
        {heading}
        <Stack
          direction="row"
          spacing={jtSpacing.gap.lg}
          useFlexGap
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            ml: { lg: heading ? 0 : 'auto' },
          }}
        >
          <Legend />
          <Button
            variant="outlined"
            onClick={() =>
              setExpanded(
                allExpanded ? new Set() : new Set(expandableScenarios.map(({ name }) => name)),
              )
            }
          >
            {allExpanded ? 'Collapse all' : 'Expand all'}
          </Button>
        </Stack>
      </Stack>
      <Box>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: ranking.columns.overall,
            columnGap: OVERALL_GAP,
            alignItems: 'end',
            pt: jtSpacing.component.md,
            pb: jtSpacing.component.sm,
            borderTop: 1,
            borderColor: 'border.subtle',
          }}
        >
          <Typography variant="columnHead">Rank</Typography>
          <Typography variant="columnHead">Scenario</Typography>
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <Scale />
          </Box>
          <Typography variant="columnHead" sx={{ textAlign: 'right' }}>
            Score
          </Typography>
        </Box>
        <Box sx={{ position: 'relative' }}>
          {/* The guide follows the scenario rows' columns, not the indented team rows. */}
          <ScaleGuide
            columns={ranking.columns.overall}
            columnGap={OVERALL_GAP}
            column={3}
            from="md"
          />
          {ranked.map((scenario, index) => {
            // The baseline is a band the others are read against; the rest alternate
            // a faint ground so each scenario's block reads as one.
            const baseline = BASELINES.has(scenario.name)
            const open = !baseline && expanded.has(scenario.name)
            const shade = ranked
              .slice(0, index)
              .filter((other) => !BASELINES.has(other.name)).length
            return (
              <Box
                key={scenario.name}
                sx={{
                  position: 'relative',
                  ...(baseline
                    ? {
                        borderTop: 2,
                        borderBottom: 2,
                        borderColor: 'primary.main',
                        bgcolor: 'translucent.primaryGreenSubtle',
                        zIndex: 1,
                      }
                    : {
                        borderTop: 1,
                        borderColor: 'border.default',
                        bgcolor: shade % 2 === 0 ? 'translucent.50' : 'transparent',
                      }),
                }}
              >
                <ButtonBase
                  component={baseline ? 'div' : 'button'}
                  onClick={
                    baseline
                      ? undefined
                      : () =>
                          setExpanded((current) => {
                            const next = new Set(current)
                            if (next.has(scenario.name)) next.delete(scenario.name)
                            else next.add(scenario.name)
                            return next
                          })
                  }
                  aria-expanded={baseline ? undefined : open}
                  aria-label={
                    baseline
                      ? undefined
                      : `${open ? 'Hide' : 'Show'} ${scenario.name} criterion scores`
                  }
                  sx={{
                    width: '100%',
                    display: 'grid',
                    gridTemplateColumns: ranking.columns.overall,
                    columnGap: OVERALL_GAP,
                    alignItems: 'center',
                    minHeight: ranking.overallRowHeight,
                    py: baseline ? jtSpacing.component.xs : 0,
                    textAlign: 'left',
                    ...(!baseline && {
                      '&:hover, &.Mui-focusVisible': { bgcolor: 'translucent.100' },
                    }),
                  }}
                >
                  <Typography variant="chartValueLarge" sx={RANK_LABEL}>
                    {scenario.hasScores ? rankLabel(index + 1) : UNRANKED}
                  </Typography>
                  <Stack
                    direction="row"
                    sx={{ alignItems: 'center', justifyContent: 'space-between' }}
                  >
                    <Box>
                      <Typography variant="navigationLabel" sx={{ whiteSpace: 'nowrap' }}>
                        {scenario.name}
                      </Typography>
                      {baseline && (
                        <Typography
                          variant="captionSmall"
                          component="p"
                          sx={{ color: 'primary.main' }}
                        >
                          Today’s Delta: the baseline
                        </Typography>
                      )}
                    </Box>
                    {!baseline && (
                      <ExpandMoreRoundedIcon
                        sx={{
                          color: 'base.100',
                          transform: open ? 'rotate(180deg)' : 'none',
                          transition: `transform ${ranking.motion.expandMs}ms ease`,
                        }}
                      />
                    )}
                  </Stack>
                  <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                    {baseline ? <BaselineSides /> : <ScoreBar score={scenario.wAvg} />}
                  </Box>
                  <ScoreValue scenario={scenario} />
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
export function WeightedRankingChart({ scenarios: set }: { scenarios: Scenario[] }) {
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
