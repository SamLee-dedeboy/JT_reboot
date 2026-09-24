// 2a — column width IS the weight; sliders live in the header.
import { Box, Slider, Typography } from '@mui/material'
import { motion } from 'framer-motion'
import { useState } from 'react'
import SketchCard from '../components/SketchCard'
import PresetButtons from '../components/PresetButtons'
import WeightModeToggle from '../components/WeightModeToggle'
import type { WeightMode } from '../components/WeightModeToggle'
import { useTeams } from '../components/teamPalette'
import { CARD_WIDTH, LABEL_COLUMN, VALUE_COLUMN } from '../components/layout'
import { RowLabel, ScoreCell, SpreadCell, TotalCell } from '../components/ChartBits'
import { WEIGHT_MAX, WEIGHT_STEP, weightOpacity, weightedRanking } from '../data'
import { rerankTransition, useWeights } from './useWeights'

const columnWidth = (weight: number) => 44 + weight * 36
/** Constant width of the Spread column (px). */
const SPREAD_COLUMN = 240

export default function WeightedMatrix() {
  const teams = useTeams()
  const { weights, setWeight, setWeights } = useWeights()
  const [mode, setMode] = useState<WeightMode>('custom')
  // Column widths follow the committed weights, not the live ones: resizing a
  // column mid-drag would stretch the slider track out from under the cursor.
  const [columnWeights, setColumnWeights] = useState(weights)
  const ranked = weightedRanking(weights)
  // Spread keeps a constant width; a trailing flexible column absorbs leftover card width
  // so widening team columns (higher weights) never squeezes the spread bar.
  const columns = `${LABEL_COLUMN}px ${columnWeights.map((w) => `${columnWidth(w)}px`).join(' ')} ${SPREAD_COLUMN}px ${VALUE_COLUMN}px minmax(0, 1fr)`

  return (
    <SketchCard id="2a" width={CARD_WIDTH}>
      <WeightModeToggle value={mode} onChange={setMode} />
      {mode === 'presets' && (
        <PresetButtons
          weights={weights}
          onSelect={(preset) => {
            setWeights(preset)
            setColumnWeights(preset)
          }}
        />
      )}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: columns,
          gap: 0.5,
          alignItems: 'center',
          transition: 'grid-template-columns 200ms ease',
        }}
      >
        {/* Header: team name, its slider (Custom mode only) and current weight */}
        <Typography variant="chartColumnHead" sx={{ alignSelf: 'end', pb: 1 }}>
          Weight →
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
                onChangeCommitted={(_, value) =>
                  setColumnWeights((current) =>
                    current.map((w, j) => (j === i ? (value as number) : w)),
                  )
                }
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
          Spread
        </Typography>
        <Typography variant="chartColumnHead" sx={{ alignSelf: 'end', textAlign: 'center', pb: 1 }}>
          Wtd.
        </Typography>

        {/* Rows sorted by weighted score (subgrid keeps the shared columns while
            each row animates to its new position); cells ghost out as weight drops */}
        {ranked.map((scenario) => (
          <Box
            key={scenario.name}
            component={motion.div}
            layout="position"
            transition={rerankTransition}
            sx={{
              gridColumn: '1 / -1',
              display: 'grid',
              gridTemplateColumns: 'subgrid',
              alignItems: 'center',
            }}
          >
            <RowLabel name={scenario.name} />
            {scenario.scores.map((score, i) => (
              <ScoreCell key={teams[i].name} score={score} opacity={weightOpacity(weights[i])} />
            ))}
            <SpreadCell spanLeft={scenario.spanLeft} spanWidth={scenario.spanWidth} />
            <TotalCell value={scenario.wAvg} />
          </Box>
        ))}
      </Box>
    </SketchCard>
  )
}
