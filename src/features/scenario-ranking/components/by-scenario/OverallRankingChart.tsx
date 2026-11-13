import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded'
import { Box, Button, ButtonBase, Collapse, Stack, Typography } from '@mui/material'
import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { jtSpacing, numbering, ranking } from '@/theme'
import { RANK_LABEL } from '../../styles'
import { TeamIcon } from '@/ui'
import { EQUAL_WEIGHTS, TEAMS, fmtScore, BASELINES, weightedRanking } from '../../model/teams'
import type { Scenario } from '../../model/teams'
import { UNRANKED, rankLabel } from './scoreFormat'
import { NOT_SCORED, SCORE_MAX, SCORE_MIN, TICKS, TODAY, scorePosition } from './scoreFormat'
import { Legend, ScaleGuide, ScoreBar, ScoreValue } from './ScoreScale'

/** Words beside the number at the ends and at zero; every other point is just its number. */
const SCALE_WORDS: Record<number, string> = {
  [SCORE_MIN]: 'worse',
  [SCORE_MAX]: 'better',
}

/**
 * Whole-point labels over the track. The ends sit flush with the track's edges so their
 * words stay inside it; the rest center on their gridlines. ±4 and ±1 sit beside the
 * worded labels (the ends, and zero), so they drop out first when the track narrows,
 * then ±2…3 below that.
 */
function Scale({ zeroWord = TODAY }: { zeroWord?: string }) {
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
        const word = tick === 0 ? zeroWord : SCALE_WORDS[tick]
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

const OVERALL_GAP = { xs: jtSpacing.gap.xs, md: jtSpacing.gap.md }

/** The run every other scenario is scored against: 0 on every criterion. */

/** Beside the baseline's zero line: which side is better and which worse than today. */
function BaselineSides({ zeroWord }: { zeroWord: string }) {
  const side = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'common.white',
  } as const
  return (
    <Box sx={{ position: 'relative', height: ranking.trackHeight }}>
      <Typography variant="captionSmall" sx={{ ...side, right: 'calc(50% + 10px)' }}>
        Above: better than {zeroWord}
      </Typography>
      <Typography variant="captionSmall" sx={{ ...side, left: 'calc(50% + 10px)' }}>
        Below: worse than {zeroWord}
      </Typography>
    </Box>
  )
}

/**
 * Equal-weight ranking of one scenario set. Rows are keyed by scenario name, so what is
 * open carries over when the set swaps for another run of the same scenarios.
 * `heading` opens the toolbar, ahead of the legend and the expand button. `zeroWord` and
 * `baselineNote` say what a score of zero is read against.
 */
export default function OverallRankingChart({
  scenarios,
  heading,
  zeroWord = TODAY,
  baselineNote = 'Today’s Delta: the baseline',
}: {
  scenarios: Scenario[]
  heading?: ReactNode
  zeroWord?: string
  baselineNote?: string
}) {
  const expandableScenarios = useMemo(
    () => scenarios.filter(({ name }) => !BASELINES.has(name)),
    [scenarios],
  )
  const [expanded, setExpanded] = useState(() => new Set<string>())
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
          <Legend zeroWord={zeroWord} />
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
            <Scale zeroWord={zeroWord} />
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
                          {baselineNote}
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
                    {baseline ? (
                      <BaselineSides zeroWord={zeroWord} />
                    ) : (
                      <ScoreBar score={scenario.wAvg} />
                    )}
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
