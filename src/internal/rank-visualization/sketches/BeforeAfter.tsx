// 3A (formerly 2D) — equal-weight ranking vs. current weights; what the decision would flip.
import { Box, Typography } from '@mui/material'
import { motion } from 'framer-motion'
import SketchCard from '../components/SketchCard'
import { CARD_WIDTH, LABEL_COLUMN } from '../components/layout'
import PresetButtons from '../components/PresetButtons'
import { RankNumber } from '../components/ChartBits'
import { RANKED, fmtScore, weightedRanking } from '../data'
import { rerankTransition, useWeights } from './useWeights'

const ROW = 36
const BUMP_WIDTH = 180
const rowY = (index: number) => ROW / 2 + index * ROW

const slotSx = { height: ROW, display: 'flex', alignItems: 'center', gap: 0.9 } as const

export default function BeforeAfter() {
  const { weights, setWeights } = useWeights()
  const ranked = weightedRanking(weights)
  const bump = RANKED.map((scenario, i) => {
    const right = ranked.findIndex((s) => s.name === scenario.name)
    const yl = rowY(i)
    const yr = rowY(right)
    return {
      name: scenario.name,
      color: scenario.color,
      d: `M0,${yl} L70,${yl} L110,${yr} L${BUMP_WIDTH},${yr}`,
      moved: right !== i,
    }
  })

  return (
    <SketchCard id="3a" width={CARD_WIDTH}>
      <PresetButtons weights={weights} onSelect={setWeights} />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: `minmax(${LABEL_COLUMN}px, 1fr) ${BUMP_WIDTH}px minmax(${LABEL_COLUMN}px, 1fr)`,
          columnGap: 1,
          alignItems: 'start',
        }}
      >
        <Typography variant="chartColumnHead" sx={{ pb: 0.75 }}>
          Equal weights
        </Typography>
        <Box />
        <Typography
          variant="chartColumnHead"
          sx={{ pb: 0.75, textAlign: 'right', color: 'primary.main' }}
        >
          Current weights
        </Typography>

        {/* Left: equal-weight order */}
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          {RANKED.map((scenario) => (
            <Box
              key={scenario.name}
              sx={{ ...slotSx, pr: 1, borderRight: 3, borderRightColor: scenario.color }}
            >
              <RankNumber rank={scenario.rank} muted />
              <Typography variant="chartLabel">{scenario.name}</Typography>
            </Box>
          ))}
        </Box>

        {/* Middle: bump lines; flat = stable, sloped = the weighting decides */}
        <svg
          viewBox={`0 0 ${BUMP_WIDTH} ${ROW * RANKED.length}`}
          width={BUMP_WIDTH}
          height={ROW * RANKED.length}
          style={{ display: 'block', overflow: 'visible' }}
        >
          {bump.map((line) => (
            <motion.path
              key={line.name}
              fill="none"
              stroke={line.color}
              strokeLinejoin="round"
              strokeLinecap="round"
              initial={false}
              animate={{
                d: line.d,
                strokeWidth: line.moved ? 3 : 1.5,
                opacity: line.moved ? 1 : 0.35,
              }}
              transition={rerankTransition}
            />
          ))}
        </svg>

        {/* Right: order under the current weights */}
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          {ranked.map((scenario) => (
            <Box
              key={scenario.name}
              component={motion.div}
              layout="position"
              transition={rerankTransition}
              sx={{ ...slotSx, pl: 1, borderLeft: 3, borderLeftColor: scenario.color }}
            >
              <RankNumber rank={scenario.rank} />
              <Typography variant="chartLabel" sx={{ flex: 1 }}>
                {scenario.name}
              </Typography>
              <Typography variant="chartValue" sx={{ color: 'base.100' }}>
                {fmtScore(scenario.wAvg)}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </SketchCard>
  )
}
