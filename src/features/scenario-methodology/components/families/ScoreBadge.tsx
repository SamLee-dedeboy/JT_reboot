import { Box, Typography } from '@mui/material'

/** Baseline-relative score: blue when better than baseline, orange when worse. */
export default function ScoreBadge({ score }: { score: number | null }) {
  const label =
    score === null ? 'Pending' : score > 0 ? `+${score}` : score < 0 ? `−${-score}` : '0'
  return (
    <Box
      component="span"
      sx={(theme) => ({
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 44,
        px: 1,
        py: 0.5,
        borderRadius: 1,
        border: 1,
        borderStyle: score === null ? 'dashed' : 'solid',
        borderColor:
          score === null || score === 0
            ? 'border.strong'
            : score > 0
              ? theme.chart.voting.above
              : theme.chart.voting.below,
        color:
          score === null || score === 0
            ? 'base.100'
            : score > 0
              ? theme.chart.voting.above
              : theme.chart.voting.below,
      })}
    >
      <Typography component="span" variant={score === null ? 'captionSmall' : 'chartValue'}>
        {label}
      </Typography>
    </Box>
  )
}
