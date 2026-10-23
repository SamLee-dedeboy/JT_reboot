// Small shared building blocks for the rank-visualization sketches.
import { Box, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import { cellFill, fmtScore } from '../data'
import type { Score } from '../data'
import { useTeams } from './teamPalette'
import TeamIcon from './TeamIcon'

/** Diverging score cell (matrix sketches). `opacity` ghosts down-weighted teams. */
export function ScoreCell({
  score,
  opacity = 1,
  compact = false,
  provisional = false,
  title,
}: {
  score: Score
  opacity?: number
  compact?: boolean
  /** Stand-in value: outlined and asterisked so it never reads as reported. */
  provisional?: boolean
  title?: string
}) {
  return (
    <Typography
      variant="chartValue"
      title={title}
      sx={{
        height: compact ? 18 : 34,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 1,
        bgcolor: score === null ? 'transparent' : cellFill(score),
        border: score === null || provisional ? 1 : 0,
        borderStyle: 'dashed',
        borderColor: provisional ? 'base.200' : 'border.default',
        color: score === null ? 'base.300' : undefined,
        opacity,
        transition: 'opacity 200ms ease',
      }}
    >
      {score === null ? '—' : `${fmtScore(score)}${provisional ? '*' : ''}`}
    </Typography>
  )
}

/** Outlined box for a scenario's total / overall value at the end of a matrix row. */
export function TotalCell({ value }: { value: number }) {
  return (
    <Typography
      variant="chartValueLarge"
      sx={{
        height: 34,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 1,
        border: 1,
        borderColor: 'border.strong',
      }}
    >
      {fmtScore(value)}
    </Typography>
  )
}

/** Scenario (or team) name with an optional leading rank / color stripe and trailing slot. */
export function RowLabel({
  name,
  rank,
  stripe,
  trailing,
}: {
  name: string
  rank?: number
  stripe?: string
  trailing?: ReactNode
}) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.9, pr: 0.75 }}>
      {stripe && (
        <Box sx={{ flex: 'none', width: 3, height: 26, borderRadius: 1, bgcolor: stripe }} />
      )}
      {rank !== undefined && <RankNumber rank={rank} />}
      <Typography variant="chartLabel" sx={{ flex: 1 }}>
        {name}
      </Typography>
      {trailing}
    </Box>
  )
}

export function RankNumber({ rank, muted = false }: { rank: number; muted?: boolean }) {
  return (
    <Typography
      variant="chartValue"
      sx={{ flex: 'none', width: 16, color: muted ? 'base.100' : 'common.white' }}
    >
      {rank}
    </Typography>
  )
}

/** Rank movement vs. the equal-weight order: ▲ moved up, ▼ moved down. */
export function DeltaBadge({ delta }: { delta: number }) {
  if (delta === 0) return null
  return (
    <Typography
      variant="chartAxis"
      sx={(theme) => ({
        whiteSpace: 'nowrap',
        color: delta > 0 ? theme.chart.voting.above : theme.chart.voting.below,
      })}
    >
      {delta > 0 ? '▲' : '▼'}
      {Math.abs(delta)}
    </Typography>
  )
}

/** One team's legend entry: icon + name (+ optional suffix such as its weight). */
export function TeamKey({ index, suffix }: { index: number; suffix?: (index: number) => string }) {
  const team = useTeams()[index]
  return (
    <LegendItem swatch={<TeamIcon team={team.key} size={14} />} color={team.color}>
      {team.name}
      {suffix ? ` ${suffix(index)}` : ''}
    </LegendItem>
  )
}

function LegendItem({
  swatch,
  color,
  children,
}: {
  swatch: ReactNode
  /** Tints the swatch/icon; the text stays in its own ink. */
  color?: string
  children: ReactNode
}) {
  return (
    <Typography
      variant="controlLabel"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.75,
        whiteSpace: 'nowrap',
        color: 'base.100',
        '& > :first-of-type': { color },
      }}
    >
      {swatch}
      {children}
    </Typography>
  )
}

/**
 * −5 … 0 … +5 scale labels above a track column. Equal outer columns keep the
 * middle label centered exactly on zero, whatever the outer labels' lengths.
 */
export function ScaleLabels({ labels }: { labels: [string, string, string] }) {
  const [low, mid, high] = labels
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', columnGap: 1 }}>
      <Typography variant="chartAxis">{low}</Typography>
      <Typography variant="chartAxis" sx={{ textAlign: 'center' }}>
        {mid}
      </Typography>
      <Typography variant="chartAxis" sx={{ textAlign: 'right' }}>
        {high}
      </Typography>
    </Box>
  )
}

/** One team's ballot as a pip: filled = above today, hollow = below, dash = same as today. */
export function BallotPip({
  color,
  score,
  size = 12,
  title,
}: {
  color: string
  score: Score
  size?: number
  title?: string
}) {
  // Not scored yet: hold the slot, draw nothing.
  if (score === null) {
    return <Box component="span" title={title} sx={{ width: size, height: size }} />
  }
  if (score === 0) {
    return (
      <Box
        component="span"
        title={title}
        sx={(theme) => ({ width: size, height: 2, bgcolor: theme.chart.voting.zeroLine })}
      />
    )
  }
  return (
    <Box
      component="span"
      title={title}
      sx={{
        width: size,
        height: size,
        borderRadius: '50%',
        border: 2,
        borderColor: color,
        bgcolor: score > 0 ? color : 'transparent',
      }}
    />
  )
}
