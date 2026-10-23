// 2a — the weighted matrix and the before/after bump chart, one set of weights.
//
// The matrix rows are already the "after": they sort by weighted score. So the
// equal-weight order sits to their left, and a line joins each scenario's equal
// rank to the row it now occupies. Flat lines mean the weighting changed nothing;
// a sloped one is the weighting deciding. Dragging a slider re-sorts the rows and
// redraws the lines in the same gesture, because they are the same state.
//
// Team columns are a fixed width. An earlier version widened a column with its
// weight, which stretched the slider track out from under the cursor and moved
// every cell to the right of it; the ×weight under each name says the same thing
// without moving anything.
import { Box, Slider, Typography } from '@mui/material'
import { motion } from 'framer-motion'
import { useState } from 'react'
import SketchCard from '../components/SketchCard'
import PresetButtons from '../components/PresetButtons'
import WeightModeToggle from '../components/WeightModeToggle'
import type { WeightMode } from '../components/WeightModeToggle'
import { useTeams } from '../components/teamPalette'
import { CARD_WIDTH, LABEL_COLUMN, VALUE_COLUMN } from '../components/layout'
import { RankNumber, RowLabel, ScoreCell, TotalCell } from '../components/ChartBits'
import { RANKED, WEIGHT_MAX, WEIGHT_STEP, weightOpacity, weightedRanking } from '../data'
import { rerankTransition, useWeights } from './useWeights'

/** Every scenario row, matrix and list alike, so the bump lines land on the rows. */
const ROW = 40
/** Fixed width of one team's score column (px). */
const TEAM_COLUMN = 64
/** The equal-weight list on the left. */
const EQUAL_COLUMN = 200
/** The bump lines between the two orders. */
const BUMP_WIDTH = 120

const rowY = (index: number) => ROW / 2 + index * ROW

export default function WeightedBeforeAfter() {
  const teams = useTeams()
  const { weights, setWeight, setWeights } = useWeights()
  const [mode, setMode] = useState<WeightMode>('custom')
  const ranked = weightedRanking(weights)
  const columns = `${EQUAL_COLUMN}px ${BUMP_WIDTH}px ${LABEL_COLUMN}px repeat(${teams.length}, ${TEAM_COLUMN}px) ${VALUE_COLUMN}px`

  // One line per scenario: from its equal-weight slot to the row it holds now.
  const bump = RANKED.map((scenario, i) => {
    const now = ranked.findIndex((s) => s.name === scenario.name)
    return {
      name: scenario.name,
      color: scenario.color,
      d: `M0,${rowY(i)} L${BUMP_WIDTH * 0.3},${rowY(i)} L${BUMP_WIDTH * 0.7},${rowY(now)} L${BUMP_WIDTH},${rowY(now)}`,
      moved: now !== i,
    }
  })

  return (
    <SketchCard id="2a" width={CARD_WIDTH}>
      <WeightModeToggle value={mode} onChange={setMode} />
      {mode === 'presets' && <PresetButtons weights={weights} onSelect={setWeights} />}

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: columns,
          gridTemplateRows: `auto repeat(${RANKED.length}, ${ROW}px)`,
          columnGap: 0.5,
          alignItems: 'center',
        }}
      >
        {/* Header row */}
        <Typography variant="chartColumnHead" sx={{ alignSelf: 'end', pb: 1 }}>
          Equal weights
        </Typography>
        <Box />
        <Typography
          variant="chartColumnHead"
          sx={{ alignSelf: 'end', pb: 1, color: 'primary.main' }}
        >
          Current weights
        </Typography>
        {teams.map((team, i) => (
          <Box key={team.name} sx={{ textAlign: 'center', pb: 0.5, minWidth: 0 }}>
            <Typography variant="chartLabel" component="div" noWrap sx={{ color: team.color }}>
              {team.name}
            </Typography>
            {mode === 'custom' && (
              <Slider
                size="small"
                min={0}
                max={WEIGHT_MAX}
                step={WEIGHT_STEP}
                value={weights[i]}
                onChange={(_, value) => setWeight(i, value as number)}
                aria-label={`${team.name} weight`}
                sx={{ color: team.color, width: 'calc(100% - 12px)', py: 1 }}
              />
            )}
            <Typography variant="chartValue" component="div" sx={{ color: 'base.100' }}>
              ×{weights[i]}
            </Typography>
          </Box>
        ))}
        <Typography variant="chartColumnHead" sx={{ alignSelf: 'end', textAlign: 'center', pb: 1 }}>
          Wtd.
        </Typography>

        {/* Left: the equal-weight order, fixed. */}
        <Box
          sx={{
            gridColumn: 1,
            gridRow: `2 / span ${RANKED.length}`,
            alignSelf: 'stretch',
            display: 'grid',
            gridTemplateRows: `repeat(${RANKED.length}, ${ROW}px)`,
          }}
        >
          {RANKED.map((scenario) => (
            <Box
              key={scenario.name}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.9,
                pr: 1,
                borderRight: 3,
                borderRightColor: scenario.color,
              }}
            >
              <RankNumber rank={scenario.rank} muted />
              <Typography variant="chartLabel" sx={{ color: 'base.100' }}>
                {scenario.name}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Middle: the lines. */}
        <Box
          component="svg"
          viewBox={`0 0 ${BUMP_WIDTH} ${ROW * RANKED.length}`}
          width={BUMP_WIDTH}
          height={ROW * RANKED.length}
          sx={{
            gridColumn: 2,
            gridRow: `2 / span ${RANKED.length}`,
            display: 'block',
            overflow: 'visible',
          }}
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
        </Box>

        {/* Right: the matrix, rows in weighted order; each row glides to its new slot. */}
        {ranked.map((scenario) => (
          <Box
            key={scenario.name}
            component={motion.div}
            layout="position"
            transition={rerankTransition}
            sx={{
              gridColumn: '3 / -1',
              display: 'grid',
              gridTemplateColumns: 'subgrid',
              alignItems: 'center',
              height: ROW,
            }}
          >
            <RowLabel name={scenario.name} rank={scenario.rank} stripe={scenario.color} />
            {scenario.scores.map((score, i) => (
              <ScoreCell
                key={teams[i].name}
                score={score}
                provisional={scenario.provisional[i]}
                opacity={weightOpacity(weights[i])}
              />
            ))}
            <TotalCell value={scenario.wAvg} />
          </Box>
        ))}
      </Box>
    </SketchCard>
  )
}
