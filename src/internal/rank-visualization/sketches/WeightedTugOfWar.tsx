// 2b — dot size IS the weight; stepper chips per team.
import { Box, ButtonBase, Typography } from '@mui/material'
import { motion } from 'framer-motion'
import { useState } from 'react'
import SketchCard from '../components/SketchCard'
import PresetButtons from '../components/PresetButtons'
import WeightModeToggle from '../components/WeightModeToggle'
import type { WeightMode } from '../components/WeightModeToggle'
import { useTeams } from '../components/teamPalette'
import { CARD_WIDTH, COLUMN_GAP, ROW_GAP, trackColumns } from '../components/layout'
import TugTrack from '../components/TugTrack'
import { DeltaBadge, RowLabel, ScaleLabels } from '../components/ChartBits'
import { WEIGHT_CHIPS, fmtScore, fmtWeight, toPct, weightDotSize, weightedRanking } from '../data'
import { rerankTransition, useWeights } from './useWeights'

const rowColumns = trackColumns()

export default function WeightedTugOfWar() {
  const teams = useTeams()
  const { weights, setWeight, setWeights } = useWeights()
  const [mode, setMode] = useState<WeightMode>('custom')
  const weightSum = weights.reduce((a, b) => a + b, 0) || 1
  const ranked = weightedRanking(weights)

  return (
    <SketchCard id="2b" width={CARD_WIDTH}>
      <WeightModeToggle value={mode} onChange={setMode} />
      {mode === 'presets' && <PresetButtons weights={weights} onSelect={setWeights} />}
      {/* Per-team weight: dot size + share, with chips in Custom mode */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, mb: 2 }}>
        {teams.map((team, i) => (
          <Box
            key={team.name}
            sx={(theme) => ({
              border: 1,
              borderColor: 'border.default',
              borderRadius: 2,
              p: 1,
              bgcolor: theme.chart.voting.well,
            })}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.75, minHeight: 22 }}>
              <Box
                sx={{
                  flex: 'none',
                  borderRadius: '50%',
                  bgcolor: team.color,
                  width: weightDotSize(weights[i]),
                  height: weightDotSize(weights[i]),
                  transition: 'all 200ms ease',
                }}
              />
              <Typography variant="chartLabel" noWrap>
                {team.name}
              </Typography>
              <Typography variant="chartAxis" sx={{ ml: 'auto' }}>
                {Math.round((weights[i] / weightSum) * 100)}%
              </Typography>
            </Box>
            {mode === 'custom' && (
              <Box sx={{ display: 'flex', gap: 0.4 }}>
                {WEIGHT_CHIPS.map((value) => {
                  const active = weights[i] === value
                  return (
                    <ButtonBase
                      key={value}
                      onClick={() => setWeight(i, value)}
                      aria-pressed={active}
                      aria-label={`Set ${team.name} weight to ${value}`}
                      sx={{
                        typography: 'chartValue',
                        flex: 1,
                        height: 22,
                        borderRadius: 999,
                        border: 1,
                        borderColor: active ? team.color : 'border.strong',
                        bgcolor: active ? team.color : 'transparent',
                        color: active ? 'common.black' : 'base.100',
                        transition: 'background-color 150ms ease, color 150ms ease',
                        '&:hover, &.Mui-focusVisible': { borderColor: team.color },
                      }}
                    >
                      {fmtWeight(value)}
                    </ButtonBase>
                  )
                })}
              </Box>
            )}
          </Box>
        ))}
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: rowColumns,
          columnGap: COLUMN_GAP,
          mb: ROW_GAP,
        }}
      >
        <Box />
        <ScaleLabels labels={['−5', '0 · baseline', '+5']} />
        <Typography variant="chartColumnHead" sx={{ textAlign: 'right' }}>
          Weighted
        </Typography>
      </Box>

      {/* Ranked rows slide into their new order when weights change */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: ROW_GAP }}>
        {ranked.map((scenario) => (
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
            <TugTrack
              spanLeft={scenario.spanLeft}
              spanWidth={scenario.spanWidth}
              avgPos={toPct(scenario.wAvg)}
              dots={scenario.scores.map((score, i) => ({
                color: teams[i].color,
                pos: toPct(score),
                size: weightDotSize(weights[i]),
                opacity: weights[i] === 0 ? 0.25 : 1,
              }))}
            />
            <Typography variant="chartValueLarge" sx={{ textAlign: 'right' }}>
              {fmtScore(scenario.wAvg)}
            </Typography>
          </Box>
        ))}
      </Box>
    </SketchCard>
  )
}
