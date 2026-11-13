import { Box, Stack, Typography } from '@mui/material'
import type { Breakpoint, Theme } from '@mui/material/styles'
import { jtSpacing, ranking } from '@/theme'
import { fmtScore, roundScore } from '../../model/teams'
import type { WeightedScenario } from '../../model/teams'
import { NOT_SCORED, SCORE_MAX, TICKS, TODAY, scorePosition } from './scoreFormat'

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

export function Legend({ zeroWord = TODAY }: { zeroWord?: string }) {
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
            {label} {zeroWord}
          </Typography>
        </Stack>
      ))}
    </Stack>
  )
}

/** Column heads over the ranking rows: small capitals, spaced. */

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
 * Gridlines through a list's score-bar column, one per whole point with zero drawn
 * stronger, on a grid that mirrors the rows so they land on the bars' scale at every width.
 */
export function ScaleGuide({
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

export function ScoreValue({ scenario }: { scenario: WeightedScenario }) {
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
