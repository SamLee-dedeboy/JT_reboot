// 3B — each scenario's score moving from equal weights (hollow dot) to the
// selected weights (bar); the connector shows how far and which way it shifts.
import { Box, Typography } from '@mui/material'
import { motion } from 'framer-motion'
import SketchCard from '../components/SketchCard'
import {
  CARD_WIDTH,
  COLUMN_GAP,
  MARKER_HEIGHT,
  ROW_GAP,
  TRACK_HEIGHT,
  trackColumns,
} from '../components/layout'
import PresetButtons from '../components/PresetButtons'
import { DeltaBadge, RowLabel, ScaleLabels } from '../components/ChartBits'
import { fmtScore, toPct, weightedRanking } from '../data'
import { rerankTransition, useWeights } from './useWeights'

/** Wider value column: it shows both scores ("equal → weighted"). */
const rowColumns = trackColumns(104)
const slide = '200ms ease'

function HollowDot() {
  return (
    <Box
      component="span"
      sx={{
        width: 12,
        height: 12,
        borderRadius: '50%',
        border: 2,
        borderColor: 'base.100',
        bgcolor: 'base.700',
      }}
    />
  )
}

function WeightedBar({ height = MARKER_HEIGHT }: { height?: number }) {
  return (
    <Box
      component="span"
      sx={(theme) => ({
        width: 4,
        height,
        borderRadius: 0.5,
        bgcolor: theme.chart.voting.overall,
        boxShadow: `0 0 0 1.5px ${theme.palette.base[700]}`,
      })}
    />
  )
}

export default function ScoreShift() {
  const { weights, setWeights } = useWeights()
  const ranked = weightedRanking(weights)

  return (
    <SketchCard id="3b" width={CARD_WIDTH}>
      <PresetButtons weights={weights} onSelect={setWeights} />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: rowColumns,
          columnGap: COLUMN_GAP,
          mb: ROW_GAP,
        }}
      >
        <Box />
        <ScaleLabels labels={['−5', '0 · Business as Usual', '+5']} />
        <Typography variant="chartColumnHead" sx={{ textAlign: 'right' }}>
          Equal → weighted
        </Typography>
      </Box>

      {/* Rows ranked by the weighted score; they slide when the order changes */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: ROW_GAP }}>
        {ranked.map((scenario) => {
          const from = toPct(scenario.avg)
          const to = toPct(scenario.wAvg)
          const shift = scenario.wAvg - scenario.avg
          return (
            <Box
              key={scenario.name}
              component={motion.div}
              layout="position"
              transition={rerankTransition}
              sx={{
                display: 'grid',
                gridTemplateColumns: rowColumns,
                columnGap: COLUMN_GAP,
                alignItems: 'center',
              }}
            >
              <RowLabel
                name={scenario.name}
                rank={scenario.rank}
                trailing={<DeltaBadge delta={scenario.delta} />}
              />

              <Box
                sx={{
                  position: 'relative',
                  height: TRACK_HEIGHT,
                  '& > *': { position: 'absolute', transform: 'translate(-50%, -50%)', top: '50%' },
                }}
              >
                <Box
                  sx={(theme) => ({
                    left: '50%',
                    height: '100%',
                    borderLeft: `1px dashed ${theme.chart.voting.zeroLine}`,
                  })}
                />
                {/* Connector from the equal-weight score to the weighted score */}
                <Box
                  sx={(theme) => ({
                    left: `${(from + to) / 2}%`,
                    width: `${Math.abs(to - from)}%`,
                    height: 3,
                    borderRadius: 1,
                    bgcolor: shift >= 0 ? theme.chart.voting.above : theme.chart.voting.below,
                    transition: `left ${slide}, width ${slide}`,
                  })}
                />
                <Box sx={{ left: `${from}%`, display: 'flex' }}>
                  <HollowDot />
                </Box>
                <Box sx={{ left: `${to}%`, display: 'flex', transition: `left ${slide}` }}>
                  <WeightedBar />
                </Box>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'baseline',
                  justifyContent: 'flex-end',
                  gap: 0.75,
                }}
              >
                <Typography variant="chartValue" sx={{ color: 'base.100' }}>
                  {fmtScore(scenario.avg)}
                </Typography>
                <Typography variant="chartAxis">→</Typography>
                <Typography variant="chartValueLarge">{fmtScore(scenario.wAvg)}</Typography>
              </Box>
            </Box>
          )
        })}
      </Box>
    </SketchCard>
  )
}
