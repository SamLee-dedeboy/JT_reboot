// 3C — every scenario's rank under each preset lens next to the equal-weight
// rank; pick a lens to compare it with equal weights, and read each
// scenario's best-to-worst range as its robustness.
import { Box, ButtonBase, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { useState } from 'react'
import SketchCard from '../components/SketchCard'
import { CARD_WIDTH, LABEL_COLUMN } from '../components/layout'
import { RowLabel } from '../components/ChartBits'
import { PRESET_RANKS, RANKED } from '../data'

const EQUAL = PRESET_RANKS[0]
const LENSES = PRESET_RANKS.slice(1)
const columns = `${LABEL_COLUMN}px 76px repeat(${LENSES.length}, minmax(116px, 1fr)) 92px`

/** Robustness of a scenario: its best and worst rank across every lens (incl. equal). */
function rankRange(name: string) {
  const ranks = PRESET_RANKS.map((p) => p.ranks[name])
  return { best: Math.min(...ranks), worst: Math.max(...ranks) }
}

const movedCount = (lens: (typeof PRESET_RANKS)[number]) =>
  RANKED.filter((s) => lens.ranks[s.name] !== EQUAL.ranks[s.name]).length

/** Open on the lens that reorders the most scenarios, so the comparison has something to show. */
const DEFAULT_LENS = LENSES.reduce((a, b) => (movedCount(b) > movedCount(a) ? b : a)).name

export default function LensRankGrid() {
  const [selected, setSelected] = useState(DEFAULT_LENS)

  return (
    <SketchCard id="3c" width={CARD_WIDTH}>
      <Box sx={{ display: 'grid', gridTemplateColumns: columns, gap: 0.5, alignItems: 'center' }}>
        {/* Header: equal baseline, one selectable column per lens, range */}
        <Box />
        <Typography variant="chartColumnHead" sx={{ textAlign: 'center', pb: 0.5 }}>
          Equal
        </Typography>
        {LENSES.map((lens) => {
          const active = lens.name === selected
          return (
            <ButtonBase
              key={lens.name}
              onClick={() => setSelected(lens.name)}
              aria-pressed={active}
              sx={{
                typography: 'chartColumnHead',
                mb: 0.5,
                py: 0.6,
                borderRadius: 999,
                border: 1,
                borderColor: active ? 'primary.main' : 'border.strong',
                bgcolor: active ? 'primary.main' : 'transparent',
                color: active ? 'common.black' : 'base.100',
                transition: 'background-color 150ms ease, color 150ms ease',
                '&:hover, &.Mui-focusVisible': { borderColor: 'primary.main' },
              }}
            >
              {lens.name}
            </ButtonBase>
          )
        })}
        <Typography variant="chartColumnHead" sx={{ textAlign: 'center', pb: 0.5 }}>
          Range
        </Typography>

        {RANKED.map((scenario) => {
          const equalRank = EQUAL.ranks[scenario.name]
          const { best, worst } = rankRange(scenario.name)
          return (
            <Box key={scenario.name} sx={{ display: 'contents' }}>
              <RowLabel name={scenario.name} stripe={scenario.color} />
              <Typography
                variant="chartValue"
                sx={(theme) => ({
                  height: 34,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 1,
                  border: 1,
                  borderColor: 'border.strong',
                  bgcolor: theme.chart.voting.well,
                })}
              >
                {equalRank}
              </Typography>
              {LENSES.map((lens) => {
                const rank = lens.ranks[scenario.name]
                const delta = equalRank - rank
                const active = lens.name === selected
                return (
                  <Typography
                    key={lens.name}
                    variant="chartValue"
                    title={`${scenario.name} under ${lens.name}: #${rank}`}
                    sx={(theme) => ({
                      height: 34,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 0.5,
                      borderRadius: 1,
                      border: 1,
                      borderColor: active ? 'primary.main' : 'transparent',
                      bgcolor:
                        delta > 0
                          ? alpha(theme.chart.voting.above, 0.32)
                          : delta < 0
                            ? alpha(theme.chart.voting.below, 0.36)
                            : theme.chart.voting.well,
                      opacity: active ? 1 : 0.55,
                      transition: 'opacity 150ms ease, border-color 150ms ease',
                    })}
                  >
                    {rank}
                    {delta !== 0 && (
                      <Typography
                        variant="chartAxis"
                        component="span"
                        sx={(theme) => ({
                          color: delta > 0 ? theme.chart.voting.above : theme.chart.voting.below,
                        })}
                      >
                        {delta > 0 ? '▲' : '▼'}
                        {Math.abs(delta)}
                      </Typography>
                    )}
                  </Typography>
                )
              })}
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="chartValue" component="div">
                  {best === worst ? `#${best}` : `#${best}–${worst}`}
                </Typography>
                <Typography
                  variant="chartAxis"
                  component="div"
                  sx={{ color: best === worst ? 'common.white' : 'base.300' }}
                >
                  {best === worst ? 'robust' : 'swings'}
                </Typography>
              </Box>
            </Box>
          )
        })}
      </Box>
    </SketchCard>
  )
}
