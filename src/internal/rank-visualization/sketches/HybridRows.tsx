// 2c — tug-of-war rows with the matrix cells tucked under each row; presets instead of sliders.
import { Box, Typography } from '@mui/material'
import { motion } from 'framer-motion'
import SketchCard from '../components/SketchCard'
import { CARD_WIDTH, COLUMN_GAP, LABEL_COLUMN, trackColumns } from '../components/layout'
import TugTrack from '../components/TugTrack'
import PresetButtons from '../components/PresetButtons'
import { DeltaBadge, RowLabel, ScoreCell, TeamKey } from '../components/ChartBits'
import { TEAMS, WEIGHT_PRESETS, fmtScore, toPct, weightOpacity, weightedRanking } from '../data'
import { rerankTransition, useWeights } from './useWeights'

const rowPaddingX = 1.25
const ballotGridSx = {
  display: 'grid',
  gridTemplateColumns: `${LABEL_COLUMN}px minmax(0, 1fr)`,
  columnGap: COLUMN_GAP,
  alignItems: 'center',
} as const
const weightLabel = (weight: number) => `×${weight}`
// Longest weight label any preset can produce (e.g. "×0.5"); each legend cell
// reserves room for it so the card width doesn't shift as weights change.
const widestWeightLabel = WEIGHT_PRESETS.flatMap((p) => p.weights)
  .map(weightLabel)
  .reduce((a, b) => (b.length > a.length ? b : a))

const teamColumnsSx = { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0.4 } as const

export default function HybridRows() {
  const { weights, setWeights } = useWeights()
  const ranked = weightedRanking(weights)

  return (
    <SketchCard id="2c" width={CARD_WIDTH}>
      <PresetButtons weights={weights} onSelect={setWeights} />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {ranked.map((scenario) => (
          <Box
            key={scenario.name}
            component={motion.div}
            layout="position"
            transition={rerankTransition}
            sx={{
              border: 1,
              borderColor: 'border.default',
              borderRadius: 2,
              px: rowPaddingX,
              py: 1,
              bgcolor: 'translucent.200',
            }}
          >
            {/* Summary line: rank, weighted position, weighted score */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: trackColumns(),
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
              />
              <Typography variant="chartValueLarge" sx={{ textAlign: 'right' }}>
                {fmtScore(scenario.wAvg)}
              </Typography>
            </Box>

            {/* The raw ballots behind the score, ghosted by weight */}
            <Box sx={{ ...ballotGridSx, mt: 0.75 }}>
              <Typography variant="chartColumnHead">Ballots</Typography>
              <Box sx={teamColumnsSx}>
                {scenario.scores.map((score, i) => (
                  <ScoreCell
                    key={TEAMS[i].name}
                    score={score}
                    compact
                    opacity={weightOpacity(weights[i])}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Legend sits on the ballot grid: same row inset (1px border + padding),
          label column and 4 team columns, so each key lands under its column */}
      <Box
        sx={(theme) => ({
          ...ballotGridSx,
          mt: 1.25,
          pl: `calc(1px + ${theme.spacing(rowPaddingX)})`,
          pr: `calc(1px + ${theme.spacing(rowPaddingX)})`,
        })}
      >
        <Typography variant="chartColumnHead">Weights</Typography>
        <Box sx={teamColumnsSx}>
          {TEAMS.map((team, i) => (
            <Box
              key={team.name}
              sx={{ display: 'grid', justifyItems: 'center', '& > *': { gridArea: '1 / 1' } }}
            >
              <TeamKey index={i} shape="square" suffix={(j) => weightLabel(weights[j])} />
              {/* Invisible widest-case twin sizes the column to its largest label */}
              <Box aria-hidden sx={{ visibility: 'hidden' }}>
                <TeamKey index={i} shape="square" suffix={() => widestWeightLabel} />
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </SketchCard>
  )
}
