// The one card every info button opens: a heading in the team's colour, then
// labelled sections. TIME PERIOD, PLACE, a criterion score and a metric all use it;
// what goes in each is in labels.ts.
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { Box, IconButton, Popover, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import type { ReactNode } from 'react'
import { jtSpacing, ranking } from '../../../../../theme'
import { TEAMS, cellFill } from '../../../../../internal/rank-visualization/data'
import type { TeamKey } from '../../../../../internal/rank-visualization/data'
import { popoverPaperSx } from '../styles'

/** An info button in the team's colour, and the explainer card it opens. */
export function Explainer({
  team,
  title,
  wide,
  children,
}: {
  team: TeamKey
  title: string
  /** For a card led by a map. */
  wide?: boolean
  children: ReactNode
}) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)
  const color = TEAMS.find((t) => t.key === team)?.color
  return (
    <>
      <IconButton
        size="small"
        onClick={(event) => setAnchor(event.currentTarget)}
        aria-label={title}
        aria-haspopup="dialog"
        aria-expanded={!!anchor}
        sx={{ p: 0.25, flex: 'none', color }}
      >
        <InfoOutlinedIcon fontSize="small" />
      </IconButton>
      <Popover
        open={!!anchor}
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{
          paper: {
            role: 'dialog',
            'aria-label': title,
            sx: {
              ...popoverPaperSx,
              maxWidth: wide ? ranking.explainer.wide : ranking.explainer.width,
            },
          },
        }}
      >
        <Stack spacing={jtSpacing.gap.sm}>
          <Typography variant="chartTitle" component="h3" sx={{ color }}>
            {title}
          </Typography>
          {children}
        </Stack>
      </Popover>
    </>
  )
}

/** One labelled part of an explainer. */
export function Section({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Stack spacing={0.5}>
      <Typography variant="captionSmall" component="h4" sx={{ color: 'base.200' }}>
        {label}
      </Typography>
      {children}
    </Stack>
  )
}

/** Plain text, with the parts between ** ** in the team's colour. */
export function Prose({ text, team }: { text: string; team: TeamKey }) {
  const color = TEAMS.find((t) => t.key === team)?.color
  return (
    <Typography variant="body2" sx={{ color: 'base.50' }}>
      {text.split('**').map((part, index) =>
        index % 2 ? (
          <Box key={index} component="strong" sx={{ color }}>
            {part}
          </Box>
        ) : (
          part
        ),
      )}
    </Typography>
  )
}

/** Rows of a label and its detail: thresholds, month ranges. */
export function Pairs({ rows }: { rows: [string, string][] }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) auto',
        columnGap: 2,
        rowGap: 0.5,
      }}
    >
      {rows.flatMap(([label, detail]) => [
        <Typography key={`${label}-label`} variant="body2" sx={{ color: 'base.50' }}>
          {label}
        </Typography>,
        <Typography
          key={`${label}-detail`}
          variant="body2"
          sx={{ color: 'base.100', textAlign: 'right' }}
        >
          {detail}
        </Typography>,
      ])}
    </Box>
  )
}

/**
 * The −5…+5 scale for a score set one point per `step` against Business as Usual:
 * each swatch over the difference that earns it. `axis` names that difference for
 * screen readers; the sentence after the scale says it on screen. Where more of the measure is worse,
 * the scale runs from +5 points' more at −5 to 5 points' fewer at +5.
 */
export function ScoreScale({
  step,
  axis,
  lowerBetter,
}: {
  step: string
  axis: string
  lowerBetter?: boolean
}) {
  const scores = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5]
  const signed = (n: number) => (n > 0 ? `+${n}` : n < 0 ? `−${-n}` : '0')
  const tick = (score: number) => {
    const difference = lowerBetter ? -score : score
    const edge = Math.abs(score) === 5 ? (difference > 0 ? '≥' : '≤') : ''
    return `${edge}${signed(difference)}${step}`
  }
  const row = { display: 'grid', gridTemplateColumns: 'repeat(11, minmax(0, 1fr))', gap: '2px' }
  return (
    <Stack spacing={0.75} role="img" aria-label={axis}>
      <Box sx={row}>
        {scores.map((score) => (
          <Typography
            key={score}
            variant="captionSmall"
            sx={{ py: 0.5, textAlign: 'center', bgcolor: cellFill(score), color: 'common.white' }}
          >
            {signed(score)}
          </Typography>
        ))}
      </Box>
      <Box sx={row}>
        {scores.map((score) => (
          <Typography
            key={score}
            variant="captionSmall"
            sx={{ textAlign: 'center', color: 'base.200', whiteSpace: 'nowrap' }}
          >
            {tick(score)}
          </Typography>
        ))}
      </Box>
    </Stack>
  )
}
