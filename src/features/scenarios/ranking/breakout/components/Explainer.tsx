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
import { popoverPaperSx, popoverWidth } from '../styles'

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
              maxWidth: popoverWidth(wide ? ranking.explainer.wide : ranking.explainer.width),
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

/** Plain text: **team-colour emphasis** and ++primary-green scenario names++. */
export function Prose({
  text,
  team,
  variant = 'body2',
}: {
  text: string
  team: TeamKey
  variant?: 'body1' | 'body2'
}) {
  const color = TEAMS.find((t) => t.key === team)?.color
  return (
    <Typography variant={variant} sx={{ color: 'base.50' }}>
      {text.split(/(\*\*.*?\*\*|\+\+.*?\+\+)/g).map((part, index) =>
        part.startsWith('**') && part.endsWith('**') ? (
          <Box key={index} component="strong" sx={{ color }}>
            {part.slice(2, -2)}
          </Box>
        ) : part.startsWith('++') && part.endsWith('++') ? (
          <Box key={index} component="span" sx={{ color: 'primary.main' }}>
            {part.slice(2, -2)}
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

const signed = (n: number) => (n > 0 ? `+${n}` : n < 0 ? `−${-n}` : '0')

/**
 * The −5…+5 scale for a score set one point per `step` against Business as Usual:
 * each swatch over the difference that earns it. `axis` names that difference for
 * screen readers; the sentence after the scale says it on screen. Where more of the measure is worse,
 * the scale runs from +5 points' more at −5 to 5 points' fewer at +5. A score set by
 * uneven bands names each swatch's band in `bands` instead, with `ends` saying which
 * way each side of the scale runs. `scores` shortens the scale for a score that only
 * rises from Business as Usual.
 */
export function ScoreScale({
  step = '',
  axis,
  lowerBetter,
  bands,
  ends,
  scores = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5],
}: {
  step?: string
  axis: string
  lowerBetter?: boolean
  bands?: string[]
  ends?: string[]
  scores?: number[]
}) {
  const tick = (score: number) => {
    const difference = lowerBetter ? -score : score
    const edge = Math.abs(score) === 5 ? (difference > 0 ? '≥' : '≤') : ''
    return `${edge}${signed(difference)}${step}`
  }
  const row = {
    display: 'grid',
    gridTemplateColumns: `repeat(${scores.length}, minmax(0, 1fr))`,
    gap: '2px',
  }
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
        {scores.map((score, index) => (
          <Typography
            key={score}
            variant="captionSmall"
            sx={{ textAlign: 'center', color: 'base.200', whiteSpace: bands ? 'normal' : 'nowrap' }}
          >
            {bands?.[index] ?? tick(score)}
          </Typography>
        ))}
      </Box>
      {ends && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
          {ends.map((end) => (
            <Typography key={end} variant="captionSmall" sx={{ color: 'base.200' }}>
              {end}
            </Typography>
          ))}
        </Box>
      )}
    </Stack>
  )
}

/** Where results land on the scale: each one's score, beside the amount that earns it. */
export function ScoreRows({
  heading,
  rows,
}: {
  heading: string
  rows: [string, string, number][]
}) {
  return (
    <Box sx={{ pt: 1 }}>
      <Typography variant="captionSmall" component="h5" sx={{ color: 'base.200' }}>
        {heading}
      </Typography>
      {rows.map(([label, amount, score], index) => (
        <Box
          key={label}
          sx={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) auto 36px',
            alignItems: 'center',
            columnGap: 2,
            py: 0.5,
            borderTop: index ? 1 : 0,
            borderColor: 'border.subtle',
          }}
        >
          <Typography variant="body2" sx={{ color: 'base.50' }}>
            {label}
          </Typography>
          <Typography variant="body2" sx={{ color: 'base.100' }}>
            {amount}
          </Typography>
          <Typography
            variant="captionSmall"
            sx={{ py: 0.25, textAlign: 'center', bgcolor: cellFill(score), color: 'common.white' }}
          >
            {signed(score)}
          </Typography>
        </Box>
      ))}
    </Box>
  )
}
