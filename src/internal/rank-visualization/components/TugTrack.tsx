import { Box } from '@mui/material'
import { MARKER_HEIGHT, TRACK_HEIGHT } from './layout'

export interface TrackDot {
  color: string
  /** Position along the track, % of the −5…+5 scale. */
  pos: number
  size?: number
  opacity?: number
}

interface TugTrackProps {
  spanLeft: number
  spanWidth: number
  avgPos: number
  dots?: TrackDot[]
  height?: number
  /** Height of the overall-score bar in px. */
  markerHeight?: number
}

const slide = '200ms ease'

/**
 * One scenario on the shared −5…+5 line: a spread span, one dot per team, and a
 * thin bar for the overall score. Positions are percentages of the track width.
 */
export default function TugTrack({
  spanLeft,
  spanWidth,
  avgPos,
  dots = [],
  height = TRACK_HEIGHT,
  markerHeight = MARKER_HEIGHT,
}: TugTrackProps) {
  return (
    <Box sx={{ position: 'relative', height, '& > *': { position: 'absolute' } }}>
      {/* Axis line and dashed zero/baseline marker */}
      <Box
        sx={(theme) => ({
          left: 0,
          right: 0,
          top: 'calc(50% - 1px)',
          height: 2,
          bgcolor: theme.chart.voting.track,
        })}
      />
      <Box
        sx={(theme) => ({
          left: '50%',
          top: 2,
          bottom: 2,
          borderLeft: `1px dashed ${theme.chart.voting.spread}`,
          opacity: 0.6,
        })}
      />
      {/* Spread: widest gap between any two teams */}
      <Box
        sx={(theme) => ({
          top: 'calc(50% - 4px)',
          height: 8,
          borderRadius: 1,
          bgcolor: theme.chart.voting.spreadSoft,
          left: `${spanLeft}%`,
          width: `${spanWidth}%`,
        })}
      />
      {dots.map((dot, i) => {
        const size = dot.size ?? 12
        return (
          <Box
            key={i}
            sx={{
              top: '50%',
              left: `${dot.pos}%`,
              width: size,
              height: size,
              borderRadius: '50%',
              border: 2,
              borderColor: 'base.700',
              bgcolor: dot.color,
              opacity: dot.opacity ?? 1,
              transform: 'translate(-50%, -50%)',
              transition: `all ${slide}`,
            }}
          />
        )
      })}
      {/* Overall score: thin bar, outlined so it reads over team dots */}
      <Box
        sx={(theme) => ({
          top: '50%',
          left: `${avgPos}%`,
          width: 4,
          height: markerHeight,
          borderRadius: 0.5,
          bgcolor: theme.chart.voting.overall,
          boxShadow: `0 0 0 1.5px ${theme.palette.base[700]}`,
          transform: 'translate(-50%, -50%)',
          transition: `left ${slide}`,
        })}
      />
    </Box>
  )
}
