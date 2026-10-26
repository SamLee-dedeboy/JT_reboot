import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded'
import TuneRoundedIcon from '@mui/icons-material/TuneRounded'
import { Box, Button, ButtonBase, Collapse, Slider, Stack, Typography } from '@mui/material'
import type { Theme } from '@mui/material/styles'
import { useMemo, useState } from 'react'
import { jtSpacing } from '../../../theme'
import TeamIcon from '../../../ui/TeamIcon'
import {
  EQUAL_WEIGHTS,
  SCENARIOS,
  TEAMS,
  WEIGHT_PRESETS,
  fmtScore,
  weightedRanking,
} from '../../../internal/rank-visualization/data'

const SCORE_MIN = -5
const SCORE_MAX = 5

const scorePosition = (score: number) => `${((score - SCORE_MIN) / (SCORE_MAX - SCORE_MIN)) * 100}%`

const scoreColor = (score: number, theme: Theme) =>
  score > 0
    ? theme.chart.voting.above
    : score < 0
      ? theme.chart.voting.below
      : theme.chart.voting.baseline

function Legend() {
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={jtSpacing.gap.md}
      sx={{ color: 'base.100' }}
    >
      <Stack direction="row" spacing={jtSpacing.gap.xs} sx={{ alignItems: 'center' }}>
        <Box sx={(theme) => ({ width: 28, borderTop: 6, borderColor: theme.chart.voting.above })} />
        <Typography variant="captionSmall">Reported score</Typography>
      </Stack>
      <Stack direction="row" spacing={jtSpacing.gap.xs} sx={{ alignItems: 'center' }}>
        <Box sx={{ width: 28, borderTop: 2, borderStyle: 'dashed', borderColor: 'base.100' }} />
        <Typography variant="captionSmall">Illustrative value—data not yet available</Typography>
      </Stack>
    </Stack>
  )
}

function Scale() {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', color: 'base.200' }}>
      <Typography variant="captionSmall">−5 worse</Typography>
      <Typography variant="captionSmall">0 baseline</Typography>
      <Typography variant="captionSmall" sx={{ textAlign: 'right' }}>
        +5 better
      </Typography>
    </Box>
  )
}

function ScoreBar({
  score,
  provisional,
  color,
}: {
  score: number
  provisional: boolean
  color?: string
}) {
  const left = score < 0 ? scorePosition(score) : '50%'
  const right = score < 0 ? '50%' : scorePosition(score)

  return (
    <Box
      sx={{
        position: 'relative',
        height: 34,
        borderBottom: 1,
        borderColor: 'border.subtle',
      }}
    >
      {score !== 0 && (
        <Box
          sx={(theme) => ({
            position: 'absolute',
            left,
            width: `calc(${right} - ${left})`,
            top: 9,
            height: 16,
            bgcolor: provisional ? 'transparent' : (color ?? scoreColor(score, theme)),
            border: provisional ? 2 : 0,
            borderStyle: provisional ? 'dashed' : 'solid',
            borderColor: color ?? scoreColor(score, theme),
          })}
        />
      )}
      {score === 0 && color && (
        <Box
          sx={{
            position: 'absolute',
            left: '50%',
            top: 9,
            width: 4,
            height: 16,
            bgcolor: color,
            transform: 'translateX(-2px)',
          }}
        />
      )}
    </Box>
  )
}

function ZeroGuide({ breakpoint, offset }: { breakpoint: 'sm' | 'md'; offset: number }) {
  return (
    <Box
      aria-hidden
      sx={{
        display: { xs: 'none', [breakpoint]: 'block' },
        position: 'absolute',
        zIndex: 0,
        insetBlock: 0,
        left: `calc(50% + ${offset}px)`,
        borderLeft: 2,
        borderColor: 'base.300',
        pointerEvents: 'none',
      }}
    />
  )
}

function TeamBreakdown({ scenario }: { scenario: (typeof SCENARIOS)[number] }) {
  return (
    <Stack spacing={jtSpacing.gap.xs} sx={{ py: jtSpacing.component.md }}>
      {TEAMS.map((team, index) => {
        const score = scenario.scores[index] ?? 0
        const provisional = scenario.provisional[index]

        return (
          <Box
            key={team.key}
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'minmax(130px, 1fr) 72px',
                md: '240px minmax(320px, 1fr) 72px',
              },
              gap: jtSpacing.gap.md,
              alignItems: 'center',
              minHeight: 34,
            }}
          >
            <Stack
              direction="row"
              spacing={jtSpacing.gap.xs}
              sx={{ alignItems: 'center', color: team.color }}
            >
              <TeamIcon team={team.key} size={18} />
              <Typography variant="navigationLabel" sx={{ color: 'inherit' }}>
                {team.name}
              </Typography>
            </Stack>
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <ScoreBar score={score} provisional={provisional} color={team.color} />
            </Box>
            <Typography
              variant={provisional ? 'captionSmall' : 'chartValueLarge'}
              sx={{
                color: provisional ? 'base.200' : team.color,
                textAlign: { md: 'right' },
                whiteSpace: 'nowrap',
              }}
            >
              {provisional ? `Illustrative ${fmtScore(score)}` : fmtScore(score)}
            </Typography>
          </Box>
        )
      })}
    </Stack>
  )
}

const average = (scores: (number | null)[]) => {
  const values = scores.filter((score): score is number => score !== null)
  return values.reduce((sum, score) => sum + score, 0) / values.length
}

export function OverallRankingChart() {
  const [expanded, setExpanded] = useState(() => new Set(SCENARIOS.map(({ name }) => name)))
  const allExpanded = expanded.size === SCENARIOS.length
  const ranked = useMemo(
    () =>
      SCENARIOS.map((scenario) => ({
        ...scenario,
        average: average(scenario.scores),
        hasProvisional: scenario.provisional.some(Boolean),
      })).sort((a, b) => b.average - a.average),
    [],
  )

  return (
    <Stack spacing={jtSpacing.component.lg}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={jtSpacing.gap.md}
        sx={{ alignItems: { sm: 'center' }, justifyContent: 'space-between' }}
      >
        <Legend />
        <Button
          variant="outlined"
          size="small"
          onClick={() =>
            setExpanded(allExpanded ? new Set() : new Set(SCENARIOS.map(({ name }) => name)))
          }
        >
          {allExpanded ? 'Collapse all scenarios' : 'Expand all scenarios'}
        </Button>
      </Stack>
      <Box>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '38px minmax(120px, .8fr) 64px',
              md: '46px 240px minmax(320px, 1fr) 72px',
            },
            columnGap: { xs: jtSpacing.gap.xs, md: jtSpacing.gap.md },
            alignItems: 'end',
            pb: jtSpacing.component.sm,
          }}
        >
          <Typography variant="captionSmall">Rank</Typography>
          <Typography variant="captionSmall">Scenario</Typography>
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <Scale />
          </Box>
          <Typography variant="captionSmall" sx={{ textAlign: 'right' }}>
            Score
          </Typography>
        </Box>
        <Box sx={{ position: 'relative' }}>
          <ZeroGuide breakpoint="md" offset={117} />
          {ranked.map((scenario, index) => {
            const open = expanded.has(scenario.name)
            return (
              <Box
                key={scenario.name}
                sx={{ position: 'relative', zIndex: 1, borderTop: 1, borderColor: 'border.subtle' }}
              >
                <ButtonBase
                  onClick={() =>
                    setExpanded((current) => {
                      const next = new Set(current)
                      if (next.has(scenario.name)) next.delete(scenario.name)
                      else next.add(scenario.name)
                      return next
                    })
                  }
                  aria-expanded={open}
                  aria-label={`${open ? 'Hide' : 'Show'} ${scenario.name} team grand scores`}
                  sx={{
                    width: '100%',
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: '38px minmax(120px, .8fr) 64px',
                      md: '46px 240px minmax(320px, 1fr) 72px',
                    },
                    columnGap: { xs: jtSpacing.gap.xs, md: jtSpacing.gap.md },
                    alignItems: 'center',
                    minHeight: 58,
                    textAlign: 'left',
                    '&:hover, &.Mui-focusVisible': { bgcolor: 'translucent.100' },
                  }}
                >
                  <Typography variant="numberArticle">
                    {String(index + 1).padStart(2, '0')}
                  </Typography>
                  <Stack
                    direction="row"
                    sx={{ alignItems: 'center', justifyContent: 'space-between' }}
                  >
                    <Typography variant="navigationLabel">{scenario.name}</Typography>
                    <ExpandMoreRoundedIcon
                      sx={{
                        color: 'base.100',
                        transform: open ? 'rotate(180deg)' : 'none',
                        transition: 'transform 180ms ease',
                      }}
                    />
                  </Stack>
                  <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                    <ScoreBar score={scenario.average} provisional={scenario.hasProvisional} />
                  </Box>
                  <Typography
                    variant="chartValueLarge"
                    sx={(theme) => ({
                      textAlign: 'right',
                      color: scoreColor(scenario.average, theme),
                    })}
                  >
                    {fmtScore(scenario.average)}
                  </Typography>
                </ButtonBase>
                <Collapse in={open} timeout={180}>
                  <Box sx={{ pl: { xs: 0, md: 'calc(46px + 20px)' } }}>
                    <TeamBreakdown scenario={scenario} />
                  </Box>
                </Collapse>
              </Box>
            )
          })}
        </Box>
      </Box>
    </Stack>
  )
}

export function WeightedRankingChart() {
  const [weights, setWeights] = useState([...EQUAL_WEIGHTS])
  const ranking = useMemo(() => weightedRanking(weights), [weights])

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', lg: 'minmax(300px, .72fr) minmax(0, 1.28fr)' },
        gap: { xs: jtSpacing.section.md, lg: jtSpacing.section.lg },
        alignItems: 'start',
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateRows: 'auto auto',
          gap: jtSpacing.section.sm,
        }}
      >
        <Box>
          <Stack
            direction="row"
            spacing={jtSpacing.gap.sm}
            sx={{ alignItems: 'center', mb: jtSpacing.component.lg }}
          >
            <TuneRoundedIcon sx={{ color: 'primary.main' }} />
            <Typography variant="h4" component="h3">
              Set your priorities
            </Typography>
          </Stack>
          <Stack spacing={jtSpacing.component.md}>
            {TEAMS.map((team, index) => (
              <Box key={team.key}>
                <Stack
                  direction="row"
                  sx={{ alignItems: 'center', justifyContent: 'space-between' }}
                >
                  <Stack
                    direction="row"
                    spacing={jtSpacing.gap.xs}
                    sx={{ alignItems: 'center', color: team.color }}
                  >
                    <TeamIcon team={team.key} size={18} />
                    <Typography variant="navigationLabel" sx={{ color: 'common.white' }}>
                      {team.name}
                    </Typography>
                  </Stack>
                  <Typography variant="chartValueLarge">×{weights[index]}</Typography>
                </Stack>
                <Slider
                  min={0}
                  max={3}
                  step={0.5}
                  value={weights[index]}
                  onChange={(_, value) =>
                    setWeights((current) =>
                      current.map((weight, i) => (i === index ? (value as number) : weight)),
                    )
                  }
                  aria-label={`${team.name} priority weight`}
                  sx={{ color: team.color }}
                />
              </Box>
            ))}
          </Stack>
        </Box>
        <Box>
          <Typography variant="h4" component="h3" sx={{ mb: jtSpacing.gap.sm }}>
            Starting points
          </Typography>
          <Stack direction="row" useFlexGap spacing={jtSpacing.gap.xs} sx={{ flexWrap: 'wrap' }}>
            {WEIGHT_PRESETS.slice(0, 4).map((preset) => (
              <Button
                key={preset.name}
                size="small"
                variant="outlined"
                onClick={() => setWeights([...preset.weights])}
              >
                {preset.name}
              </Button>
            ))}
          </Stack>
        </Box>
      </Box>

      <Box>
        <Stack
          direction="row"
          sx={{ justifyContent: 'space-between', alignItems: 'end', mb: jtSpacing.component.sm }}
        >
          <Typography variant="h4" component="h3">
            Your ranking
          </Typography>
          <Typography variant="captionSmall">Weighted score</Typography>
        </Stack>
        <Box sx={{ position: 'relative' }}>
          <ZeroGuide breakpoint="sm" offset={116} />
          {ranking.map((scenario, index) => {
            const provisional = scenario.provisional.some(
              (value, teamIndex) => value && weights[teamIndex] > 0,
            )
            return (
              <Box
                key={scenario.name}
                sx={{
                  position: 'relative',
                  zIndex: 1,
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '36px minmax(0, 1fr) 56px',
                    sm: '42px 210px minmax(80px, 1fr) 56px',
                  },
                  gap: jtSpacing.gap.sm,
                  alignItems: 'center',
                  minHeight: 58,
                  borderTop: 1,
                  borderColor: 'border.subtle',
                }}
              >
                <Typography variant="numberArticle">
                  {String(index + 1).padStart(2, '0')}
                </Typography>
                <Typography variant="navigationLabel">{scenario.name}</Typography>
                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                  <ScoreBar score={scenario.wAvg} provisional={provisional} />
                </Box>
                <Typography
                  variant="chartValueLarge"
                  sx={(theme) => ({ textAlign: 'right', color: scoreColor(scenario.wAvg, theme) })}
                >
                  {fmtScore(scenario.wAvg)}
                </Typography>
              </Box>
            )
          })}
        </Box>
        <Box sx={{ mt: jtSpacing.component.md }}>
          <Legend />
        </Box>
      </Box>
    </Box>
  )
}
