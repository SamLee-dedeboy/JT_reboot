// Internal page: scenario ranking told as a three-step narrative —
// equal weights (the ranking and its concepts), weights (the user takes
// control), sensitivity (selected weights vs. equal weights). All copy for a
// step lives in one text block; the charts below carry only data labels.
// Each design keeps its own weights. Scores are illustrative; see ./data.ts.
import { Box, ButtonBase, Typography } from '@mui/material'
import { MotionConfig } from 'framer-motion'
import { useState } from 'react'
import type { ReactNode } from 'react'
import PageLayout from '../PageLayout'
import { TeamKey } from './components/ChartBits'
import { TEAM_PALETTES, TeamPaletteContext } from './components/teamPalette'
import type { TeamPaletteKey } from './components/teamPalette'
import { CARD_WIDTH } from './components/layout'
import { StagePanels, StageTabBar } from './components/StageTabs'
import type { StageTab } from './components/StageTabs'
import { TEAMS } from './data'
import BeforeAfter from './sketches/BeforeAfter'
import OverallRanking from './sketches/OverallRanking'
import ScoreShift from './sketches/ScoreShift'
import WeightedMatrix from './sketches/WeightedMatrix'
import WeightedTugOfWar from './sketches/WeightedTugOfWar'

const CONCEPTS = [
  { term: 'Ballot', definition: 'one team’s score for a scenario, −5 to +5' },
  { term: 'Baseline', definition: 'Business as Usual, today’s path, fixed at 0' },
  { term: 'Overall', definition: 'the average of the four ballots' },
  { term: 'Spread', definition: 'highest minus lowest ballot: how much teams disagree' },
]

const STEP_1_TABS: StageTab[] = [
  {
    id: '1a',
    label: 'Ranked scoreboard',
    note: 'Bars grow from the baseline to each overall score on the full −5 to +5 axis. The scale on the left groups scenarios by which side of today they land on. Each scenario unfolds into its four ballots (click a row to fold it): the pip shows that team’s side of today — filled = better, hollow = worse, dash = the same — the dashed line through the ballots is their average (blue above today, orange below). Turn on Spread to shade each scenario’s range from its lowest to its highest ballot, box-plot style.',
    content: <OverallRanking />,
  },
]

// 2C (Hybrid, ./sketches/HybridRows) is hidden for now; re-add its tab here to restore it.
const STEP_2_TABS: StageTab[] = [
  {
    id: '2a',
    label: 'Weighted matrix',
    note: 'Drag a slider to change a team’s weight; its column widens to match. Rows re-sort by the weighted score. A team at 0 fades out but its ballots stay on record. Switch Weights to Presets to pick a lens instead of setting each team.',
    content: <WeightedMatrix />,
  },
  {
    id: '2b',
    label: 'Tug-of-war',
    note: 'Set weights with the chips; dot size shows each team’s pull. The white bar is the weighted score; rows re-rank and ▲▼ marks movement from equal weights. Switch Weights to Presets to pick a lens instead of setting each team.',
    content: <WeightedTugOfWar />,
  },
]

// 3C (Rank across lenses, ./sketches/LensRankGrid) is hidden for now; re-add its tab here to restore it.
const STEP_3_TABS: StageTab[] = [
  {
    id: '3a',
    label: 'Before / after',
    note: 'Left: the equal-weight order. Right: the order under the chosen lens. Flat lines are robust; sloped lines are where the weighting decides.',
    content: <BeforeAfter />,
  },
  {
    id: '3b',
    label: 'Score shift',
    note: 'The hollow dot is the equal-weight score and the white bar the weighted one; the connector shows how far and which way each score moves.',
    content: <ScoreShift />,
  },
]

/** Height (px) of the step badge row, so both text columns start on the same line. */
const STEP_BADGE_ROW = 26

export default function RankVisualization() {
  const [paletteKey, setPaletteKey] = useState<TeamPaletteKey>('color')
  const palette = TEAM_PALETTES.find((p) => p.key === paletteKey) ?? TEAM_PALETTES[0]

  return (
    <PageLayout title="Rank Visualization" fullWidthContent hideTitle>
      <MotionConfig reducedMotion="user">
        <TeamPaletteContext.Provider value={palette.colors}>
          <Box sx={(theme) => ({ px: theme.jtSpacing.page.x, pt: theme.jtSpacing.section.sm })}>
            <Typography variant="h2" component="h1">
              Rank Visualization
            </Typography>
            <TeamPalettePicker value={paletteKey} onChange={setPaletteKey} />
          </Box>

          <Step
            step={1}
            eyebrow="Equal weights"
            title="The overall ranking"
            intro="Four teams scored six adaptation scenarios against Business as Usual. Counting every team equally gives one overall ranking."
            extra={<StepOneKey />}
            tabs={STEP_1_TABS}
          />
          <Step
            step={2}
            eyebrow="Weights"
            title="Changing whose voice counts"
            intro="Give a team more or less weight and watch the overall scores and the ranking respond. Spread never moves: it describes the ballots, not the weighting."
            tabs={STEP_2_TABS}
          />
          <Step
            step={3}
            eyebrow="Sensitivity"
            title="Does the weighting change the answer?"
            intro="Compare a weighting with the equal-weight ranking from step 1. Scenarios that hold their place are robust; the ones that move are where the choice of weights decides."
            tabs={STEP_3_TABS}
          />
        </TeamPaletteContext.Provider>
      </MotionConfig>
    </PageLayout>
  )
}

interface StepProps {
  step: number
  eyebrow: string
  title: string
  intro: string
  extra?: ReactNode
  tabs: StageTab[]
}

/**
 * One narrative step. Its text block holds every word of copy — step framing
 * on the left, design tabs and the active design's reading note on the right —
 * and the chart sits below with nothing but data labels.
 */
function Step({ step, eyebrow, title, intro, extra, tabs }: StepProps) {
  const [active, setActive] = useState(tabs[0].id)
  const activeTab = tabs.find((tab) => tab.id === active) ?? tabs[0]
  // With a single design there is nothing to switch between, so skip the tab bar.
  const single = tabs.length === 1

  return (
    <Box
      component="section"
      aria-labelledby={`step-${step}-title`}
      sx={(theme) => ({
        px: theme.jtSpacing.page.x,
        py: theme.jtSpacing.section.sm,
        borderBottom: 1,
        borderColor: 'border.default',
      })}
    >
      {/* Text block: the only place this step has prose */}
      <Box
        sx={(theme) => ({
          display: 'grid',
          gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'minmax(0, 1fr) minmax(0, 1fr)' },
          columnGap: theme.jtSpacing.gap.xl,
          rowGap: theme.jtSpacing.gap.md,
          maxWidth: CARD_WIDTH,
          mb: theme.jtSpacing.component.lg,
        })}
      >
        <Box>
          <Box
            sx={(theme) => ({
              display: 'flex',
              alignItems: 'center',
              gap: theme.jtSpacing.gap.sm,
              minHeight: STEP_BADGE_ROW,
              mb: 1,
            })}
          >
            <Typography
              variant="numberBadge"
              sx={{
                px: 1,
                py: 0.5,
                borderRadius: 1,
                bgcolor: 'primary.main',
                color: 'common.black',
              }}
            >
              Step {step}
            </Typography>
            <Typography variant="eyebrow">{eyebrow}</Typography>
          </Box>
          <Typography variant="h4" component="div" id={`step-${step}-title`} sx={{ mb: 1 }}>
            {title}
          </Typography>
          <Typography variant="body2" component="div">
            {intro}
          </Typography>
          {extra}
        </Box>

        {/* How to read the design(s); top-aligned with the step heading */}
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', minHeight: STEP_BADGE_ROW, mb: 1 }}>
            <Typography variant="eyebrow">
              How to read {activeTab.id} · {activeTab.label}
            </Typography>
          </Box>
          <Typography variant="body2" component="div">
            {activeTab.note}
          </Typography>
        </Box>
      </Box>

      {single ? (
        activeTab.content
      ) : (
        <>
          {/* Design tabs sit directly on the chart they switch */}
          <Box sx={(theme) => ({ mb: theme.jtSpacing.component.sm })}>
            <StageTabBar
              label={`Step ${step} designs`}
              tabs={tabs}
              active={active}
              onChange={setActive}
            />
          </Box>
          <StagePanels tabs={tabs} active={active} />
        </>
      )}
    </Box>
  )
}

/** Step 1 also introduces the vocabulary and team colors used by every later design. */
function StepOneKey() {
  return (
    <Box sx={(theme) => ({ mt: theme.jtSpacing.gap.md, display: 'grid', gap: 1.5 })}>
      <Box
        component="dl"
        sx={{ m: 0, display: 'grid', gridTemplateColumns: 'auto 1fr', columnGap: 1.5, rowGap: 0.5 }}
      >
        {CONCEPTS.map((concept) => (
          <Box key={concept.term} sx={{ display: 'contents' }}>
            <Typography
              variant="chartLabel"
              component="dt"
              sx={{ color: 'primary.main', pt: 0.25 }}
            >
              {concept.term}
            </Typography>
            <Typography variant="controlLabel" component="dd" sx={{ m: 0, color: 'base.100' }}>
              {concept.definition}
            </Typography>
          </Box>
        ))}
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', columnGap: 2, rowGap: 0.75 }}>
        {TEAMS.map((team, i) => (
          <TeamKey key={team.name} index={i} />
        ))}
      </Box>
    </Box>
  )
}

/** Switches the team palette for every design on the page; score colors stay fixed. */
function TeamPalettePicker({
  value,
  onChange,
}: {
  value: TeamPaletteKey
  onChange: (key: TeamPaletteKey) => void
}) {
  return (
    <Box
      role="radiogroup"
      aria-label="Team colors"
      sx={(theme) => ({
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: theme.jtSpacing.gap.xs,
        mt: theme.jtSpacing.component.sm,
      })}
    >
      <Typography variant="chartColumnHead" sx={{ mr: 0.5 }}>
        Team colors
      </Typography>
      {TEAM_PALETTES.map((option) => {
        const active = option.key === value
        return (
          <ButtonBase
            key={option.key}
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option.key)}
            sx={(theme) => ({
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              px: 1.25,
              py: 0.75,
              borderRadius: 999,
              border: 1,
              borderColor: active ? 'primary.main' : 'border.strong',
              bgcolor: active ? theme.chart.voting.well : 'transparent',
              transition: 'border-color 150ms ease, background-color 150ms ease',
              '&:hover, &.Mui-focusVisible': { borderColor: 'primary.main' },
            })}
          >
            <Box component="span" sx={{ display: 'inline-flex', gap: 0.4 }}>
              {option.colors.map((color, i) => (
                <Box
                  key={i}
                  component="span"
                  sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: color }}
                />
              ))}
            </Box>
            <Typography variant="chartLabel" sx={{ color: active ? 'common.white' : 'base.100' }}>
              {option.label}
            </Typography>
          </ButtonBase>
        )
      })}
    </Box>
  )
}
