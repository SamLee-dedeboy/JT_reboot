// Small shared building blocks for the rank-visualization sketches.
import { Box, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import { cellFill, fmtScore } from '../data'
import { useTeams } from './teamPalette'

/** Diverging score cell (matrix sketches). `opacity` ghosts down-weighted teams. */
export function ScoreCell({
  score,
  opacity = 1,
  compact = false,
  title,
}: {
  score: number
  opacity?: number
  compact?: boolean
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
        bgcolor: cellFill(score),
        opacity,
        transition: 'opacity 200ms ease',
      }}
    >
      {fmtScore(score)}
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

/** Matrix-cell version of the spread: widest gap between any two teams on −5…+5. */
export function SpreadCell({ spanLeft, spanWidth }: { spanLeft: number; spanWidth: number }) {
  return (
    <Box
      sx={(theme) => ({
        position: 'relative',
        height: 34,
        borderRadius: 1,
        bgcolor: theme.chart.voting.well,
      })}
    >
      <Box
        sx={(theme) => ({
          position: 'absolute',
          left: '50%',
          top: 0,
          bottom: 0,
          borderLeft: `1px dashed ${theme.chart.voting.zeroLine}`,
        })}
      />
      <Box
        sx={(theme) => ({
          position: 'absolute',
          top: 13,
          height: 8,
          borderRadius: 1,
          bgcolor: theme.chart.voting.spread,
          left: `${spanLeft}%`,
          width: `${spanWidth}%`,
        })}
      />
    </Box>
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

/** One team's legend entry: swatch + name (+ optional suffix such as its weight). */
export function TeamKey({
  index,
  shape = 'dot',
  suffix,
}: {
  index: number
  shape?: 'dot' | 'square'
  suffix?: (index: number) => string
}) {
  const team = useTeams()[index]
  return (
    <LegendItem swatch={<Swatch color={team.color} shape={shape} />}>
      {team.name}
      {suffix ? ` ${suffix(index)}` : ''}
    </LegendItem>
  )
}

function LegendItem({ swatch, children }: { swatch: ReactNode; children: ReactNode }) {
  return (
    <Typography
      variant="controlLabel"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.75,
        whiteSpace: 'nowrap',
        color: 'base.100',
      }}
    >
      {swatch}
      {children}
    </Typography>
  )
}

function Swatch({ color, shape = 'dot' }: { color: string; shape?: 'dot' | 'square' }) {
  return (
    <Box
      component="span"
      sx={{
        flex: 'none',
        width: 9,
        height: 9,
        borderRadius: shape === 'dot' ? '50%' : 0.5,
        bgcolor: color,
      }}
    />
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
  score: number
  size?: number
  title?: string
}) {
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
