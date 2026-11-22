import { Box, Stack, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import type { Breakpoint, Theme } from '@mui/material/styles'
import { jtSpacing, ranking } from '@/theme'
import { fmtScore, roundScore } from '../../model/teams'
import type { WeightedScenario } from '../../model/teams'
import {
  NOT_SCORED,
  SCORE_MAX,
  SCORE_MIN,
  TICKS,
  TODAY,
  UNRANKED,
  scorePosition,
} from './scoreFormat'

type Responsive<T> = T | Partial<Record<Breakpoint, T>>

const scoreColor = (score: number, theme: Theme) =>
  score > 0
    ? theme.chart.voting.above
    : score < 0
      ? theme.chart.voting.below
      : theme.chart.voting.baseline

const LEGEND = [
  { label: 'Better than', color: (theme: Theme) => theme.chart.voting.above },
  { label: 'Worse than', color: (theme: Theme) => theme.chart.voting.below },
]

/** Better / worse swatches. `stacked` puts them one under the other, for a phone's toolbar. */
export function Legend({ zeroWord = TODAY, stacked }: { zeroWord?: string; stacked?: boolean }) {
  return (
    <Stack
      direction={stacked ? 'column' : 'row'}
      spacing={stacked ? jtSpacing.gap.xs : jtSpacing.gap.md}
      useFlexGap
      sx={{ color: 'base.100', flexWrap: 'wrap' }}
    >
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
            {label} {zeroWord}
          </Typography>
        </Stack>
      ))}
    </Stack>
  )
}

export function ScoreBar({ score }: { score: number }) {
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

/**
 * Where a bar or a dot would be when nothing is scored yet: the word, in the bar's column,
 * so the narrow score column only ever holds a number or a dash.
 */
export function NotScoredNote() {
  return (
    <Typography
      variant="captionSmall"
      component="span"
      sx={{ display: 'block', textAlign: 'center', color: 'base.200' }}
    >
      {NOT_SCORED}
    </Typography>
  )
}

/**
 * Gridlines through a list's score-bar column, one per whole point with zero drawn
 * stronger, on a grid that mirrors the rows so they land on the bars' scale at every width.
 * `inset` is the rows' own inline padding, so the guide's grid starts where theirs does.
 */
export function ScaleGuide({
  columns,
  columnGap,
  column,
  from,
  inset = 0,
}: {
  columns: Partial<Record<Breakpoint, string>>
  columnGap: Responsive<number>
  column: number
  from: Breakpoint
  inset?: Responsive<number>
}) {
  return (
    <Box
      aria-hidden
      sx={{
        display: { xs: 'none', [from]: 'grid' },
        gridTemplateColumns: columns,
        columnGap,
        px: inset,
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

/**
 * A scenario's score; a dash until any criterion has scored it (the bar column says why).
 * `compact` (a phone's narrow row) sets it a size down.
 */
export function ScoreValue({
  scenario,
  compact,
}: {
  scenario: WeightedScenario
  compact?: boolean
}) {
  const variant = compact ? 'chartValueLarge' : 'numberScore'
  if (!scenario.hasScores) {
    return (
      <Typography variant={variant} sx={{ textAlign: 'right', color: 'base.200' }}>
        {UNRANKED}
      </Typography>
    )
  }
  return (
    <Typography
      variant={variant}
      sx={(theme) => ({ textAlign: 'right', color: scoreColor(roundScore(scenario.wAvg), theme) })}
    >
      {fmtScore(scenario.wAvg)}
    </Typography>
  )
}

/**
 * The −5…+5 scale in miniature, before any chart: worse fades in from the left, better from
 * the right, and zero, today's Delta, is the green tick between them.
 */
export function ScaleStrip() {
  const { height, tickOverhang, fillOpacity } = ranking.scaleStrip
  return (
    <Stack spacing={jtSpacing.gap.xs} aria-hidden>
      <Box
        sx={(theme) => ({
          position: 'relative',
          height,
          borderRadius: height / 2,
          background: `linear-gradient(90deg, ${alpha(theme.chart.voting.below, fillOpacity.edge)}, ${alpha(theme.chart.voting.below, fillOpacity.center)} 50%, ${alpha(theme.chart.voting.above, fillOpacity.center)} 50%, ${alpha(theme.chart.voting.above, fillOpacity.edge)})`,
        })}
      >
        <Box
          sx={{
            position: 'absolute',
            left: '50%',
            top: -tickOverhang,
            bottom: -tickOverhang,
            borderLeft: ranking.zeroLine.width,
            borderColor: 'primary.main',
            transform: 'translateX(-50%)',
          }}
        />
      </Box>
      <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
        <Typography variant="captionSmall">{fmtScore(SCORE_MIN)} worse</Typography>
        <Typography variant="captionSmall" sx={{ color: 'primary.main' }}>
          0 = {TODAY}
        </Typography>
        <Typography variant="captionSmall">{fmtScore(SCORE_MAX)} better</Typography>
      </Stack>
    </Stack>
  )
}
