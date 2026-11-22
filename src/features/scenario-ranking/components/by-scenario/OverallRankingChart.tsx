import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded'
import { Box, Button, ButtonBase, Collapse, Stack, Typography, useMediaQuery } from '@mui/material'
import type { Theme } from '@mui/material/styles'
import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { jtSpacing, ranking } from '@/theme'
import { TeamIcon } from '@/ui'
import { EQUAL_WEIGHTS, TEAMS, fmtScore, BASELINES, weightedRanking } from '../../model/teams'
import type { Scenario } from '../../model/teams'
import { UNRANKED, rankLabel } from './scoreFormat'
import { SCORE_MAX, SCORE_MIN, TICKS, TODAY, scorePosition } from './scoreFormat'
import { Legend, NotScoredNote, ScaleGuide, ScoreBar, ScoreValue } from './ScoreScale'

/** Words beside the number at the ends and at zero; every other point is just its number. */
const SCALE_WORDS: Record<number, string> = {
  [SCORE_MIN]: 'worse',
  [SCORE_MAX]: 'better',
}

/** Below this track width the end and zero labels drop their words and keep their numbers. */
const SCALE_WORDS_MIN_WIDTH = 200

/** Between the columns, and the rows' own inline padding off their shaded edges. */
const OVERALL_GAP = { xs: jtSpacing.gap.xs, sm: jtSpacing.gap.sm, md: jtSpacing.gap.md }
const ROW_INSET = {
  xs: jtSpacing.component.xs,
  sm: jtSpacing.component.sm,
  md: jtSpacing.component.md,
}

/** Every row of the chart (head, scenario, criterion) on the same tracks. */
const rowGridSx = {
  display: 'grid',
  gridTemplateColumns: ranking.columns.overall,
  columnGap: OVERALL_GAP,
  alignItems: 'center',
  px: ROW_INSET,
} as const

/** The rows carry their own inset, so the rank sits flush with it. */
const RANK_SX = { color: 'primary.main' } as const

/**
 * Whole-point labels over the track. The ends sit flush with the track's edges so their
 * words stay inside it; the rest center on their gridlines. ±4 and ±1 sit beside the
 * worded labels (the ends, and zero), so they drop out first when the track narrows,
 * then ±2…3 below that, and on a phone's narrow track the words go too.
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
              ...(tick === 0 && { color: 'primary.main' }),
              ...(tick === SCORE_MIN
                ? { left: 0 }
                : tick === SCORE_MAX
                  ? { right: 0 }
                  : { left: scorePosition(tick), transform: 'translateX(-50%)' }),
              ...(hideBelow && { [`@container (max-width: ${hideBelow}px)`]: { display: 'none' } }),
            }}
          >
            {fmtScore(tick)}
            {word && (
              <Box
                component="span"
                sx={{
                  [`@container (max-width: ${SCALE_WORDS_MIN_WIDTH}px)`]: { display: 'none' },
                }}
              >
                {` ${word}`}
              </Box>
            )}
          </Typography>
        )
      })}
    </Box>
  )
}

/** One criterion's score as a dot, on a stem from zero so its direction still reads. */
function ScoreDot({ score, color }: { score: number; color: string }) {
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
 * An opened scenario's six criteria, on the scenario rows' own tracks. On a phone a name
 * takes the empty rank column too, so the longest names still fit beside their icon.
 */
function TeamBreakdown({ scenario }: { scenario: Scenario }) {
  return (
    <Box sx={{ py: jtSpacing.component.xs, borderTop: 1, borderColor: 'border.subtle' }}>
      {TEAMS.map((team, index) => {
        const score = scenario.scores[index]

        return (
          <Box key={team.key} sx={{ ...rowGridSx, minHeight: ranking.breakdownRowHeight }}>
            <Stack
              direction="row"
              spacing={jtSpacing.gap.xs}
              sx={{
                gridColumn: { xs: '1 / 3', sm: 2 },
                pl: { xs: jtSpacing.gap.sm, sm: 0 },
                alignItems: 'flex-start',
                color: team.color,
              }}
            >
              <TeamIcon team={team.key} size={ranking.teamIconSize} />
              <Typography variant="chipLabel" sx={{ color: 'inherit' }}>
                {team.name}
              </Typography>
            </Stack>
            {score === null ? <NotScoredNote /> : <ScoreDot score={score} color={team.color} />}
            <Typography
              variant="chartValueLarge"
              sx={{
                color: score === null ? 'base.200' : team.color,
                textAlign: 'right',
                whiteSpace: 'nowrap',
              }}
            >
              {score === null ? UNRANKED : fmtScore(score)}
            </Typography>
          </Box>
        )
      })}
    </Box>
  )
}

/** Beside the baseline's zero line: which side is better and which worse than it. */
function BaselineSides({ zeroWord, short }: { zeroWord: string; short: boolean }) {
  const side = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'common.white',
    whiteSpace: 'nowrap',
  } as const
  return (
    <Box sx={{ position: 'relative', height: ranking.trackHeight }}>
      <Typography variant="captionSmall" sx={{ ...side, right: 'calc(50% + 10px)' }}>
        {short ? 'Better ↑' : `Above: better than ${zeroWord}`}
      </Typography>
      <Typography variant="captionSmall" sx={{ ...side, left: 'calc(50% + 10px)' }}>
        {short ? '↓ Worse' : `Below: worse than ${zeroWord}`}
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
  const smUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'))
  const mdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'))
  const expandableScenarios = useMemo(
    () => scenarios.filter(({ name }) => !BASELINES.has(name)),
    [scenarios],
  )
  const [expanded, setExpanded] = useState(() => new Set<string>())
  const allExpanded = expanded.size === expandableScenarios.length
  const ranked = useMemo(() => weightedRanking(EQUAL_WEIGHTS, scenarios), [scenarios])

  return (
    <Stack spacing={jtSpacing.component.lg}>
      {/* Toolbar: the sea-level switch, then the legend and Expand all (one row from md). */}
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={jtSpacing.gap.md}
        sx={{ alignItems: { md: 'center' }, justifyContent: 'space-between' }}
      >
        {heading}
        <Stack
          direction="row"
          spacing={jtSpacing.gap.lg}
          useFlexGap
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: { sm: 'wrap' },
            ml: { md: heading ? 0 : 'auto' },
          }}
        >
          <Legend zeroWord={zeroWord} stacked={!smUp} />
          <Button
            variant="outlined"
            sx={{ flex: 'none' }}
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
            ...rowGridSx,
            alignItems: 'end',
            pt: jtSpacing.component.md,
            pb: jtSpacing.component.sm,
            borderTop: 1,
            borderColor: 'border.subtle',
          }}
        >
          <Typography variant="columnHead">{smUp ? 'Rank' : '#'}</Typography>
          <Typography variant="columnHead">Scenario</Typography>
          <Scale zeroWord={zeroWord} />
          {/* On a phone the score column is too narrow for its head; the numbers speak. */}
          <Typography variant="columnHead" sx={{ textAlign: 'right' }}>
            {smUp ? 'Score' : ''}
          </Typography>
        </Box>
        <Box sx={{ position: 'relative' }}>
          <ScaleGuide
            columns={ranking.columns.overall}
            columnGap={OVERALL_GAP}
            column={3}
            from="xs"
            inset={ROW_INSET}
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
                    ...rowGridSx,
                    width: '100%',
                    minHeight: ranking.overallRowHeight,
                    py: baseline ? jtSpacing.component.xs : 0,
                    textAlign: 'left',
                    ...(!baseline && {
                      '&:hover, &.Mui-focusVisible': { bgcolor: 'translucent.100' },
                    }),
                  }}
                >
                  <Typography variant={smUp ? 'chartValueLarge' : 'chartValue'} sx={RANK_SX}>
                    {scenario.hasScores ? rankLabel(index + 1) : UNRANKED}
                  </Typography>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      variant={smUp ? 'navigationLabel' : 'chipLabel'}
                      component="span"
                      sx={{ display: 'block' }}
                    >
                      {scenario.name}
                    </Typography>
                    {baseline && smUp && (
                      <Typography
                        variant="captionSmall"
                        component="span"
                        sx={{ display: 'block', color: 'primary.main' }}
                      >
                        {baselineNote}
                      </Typography>
                    )}
                  </Box>
                  {baseline ? (
                    smUp ? (
                      <BaselineSides zeroWord={zeroWord} short={!mdUp} />
                    ) : (
                      <Box />
                    )
                  ) : scenario.hasScores ? (
                    <ScoreBar score={scenario.wAvg} />
                  ) : (
                    <NotScoredNote />
                  )}
                  <ScoreValue scenario={scenario} compact={!smUp} />
                  {baseline ? (
                    <Box />
                  ) : (
                    <ExpandMoreRoundedIcon
                      sx={{
                        width: '100%',
                        color: 'base.100',
                        transform: open ? 'rotate(180deg)' : 'none',
                        transition: `transform ${ranking.motion.expandMs}ms ease`,
                      }}
                    />
                  )}
                  {/* A phone's bar column is too narrow for the note: it gets its own line. */}
                  {baseline && !smUp && (
                    <Typography
                      variant="captionSmall"
                      component="span"
                      sx={{ gridColumn: '2 / -1', color: 'primary.main' }}
                    >
                      {baselineNote}
                    </Typography>
                  )}
                </ButtonBase>
                <Collapse in={open} timeout={ranking.motion.expandMs}>
                  <TeamBreakdown scenario={scenario} />
                </Collapse>
              </Box>
            )
          })}
        </Box>
      </Box>
    </Stack>
  )
}
