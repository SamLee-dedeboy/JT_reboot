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
import PivotTable from './sketches/PivotTable'
import OverallRanking from './sketches/OverallRanking'
import ScoreShift from './sketches/ScoreShift'
import WeightedMatrix from './sketches/WeightedMatrix'
import WeightedTugOfWar from './sketches/WeightedTugOfWar'
import SubteamPages from './subteams/SubteamPages'

const CONCEPTS = [
  { term: 'Ballot', definition: 'one subteam’s score for a scenario, −5 to +5' },
  { term: 'Baseline', definition: 'Business as Usual, today’s path, fixed at 0' },
  { term: 'Overall', definition: 'the mean of the scored ballots' },
  { term: 'Range', definition: 'highest ballot minus lowest ballot: variation among subteams' },
]

const STEP_1_TABS: StageTab[] = [
  {
    id: '1a',
    label: 'Ranked scoreboard',
    note: 'Each bar runs from the baseline to the overall score on the −5 to +5 axis. Click a scenario to show its five ballots; a dashed ballot with an asterisk was inferred. The dashed line is the mean of the ballots, blue above the baseline and orange below. Turn on Range to shade the interval from the lowest ballot to the highest.',
    content: <OverallRanking />,
  },
]

// 2C (Hybrid, ./sketches/HybridRows) is hidden for now; re-add its tab here to restore it.
const STEP_2_TABS: StageTab[] = [
  {
    id: '2a',
    label: 'Weighted matrix',
    note: 'Drag a slider to change a team’s weight. Its column widens to match, and the rows sort again by weighted score. A team at 0 fades out, but its ballots remain in the record. Switch Weights to Presets to choose a lens instead of setting each team.',
    content: <WeightedMatrix />,
  },
  {
    id: '2b',
    label: 'Tug-of-war',
    note: 'Use the chips to set the weights; dot size shows each team’s relative weight, while the white bar shows the weighted score. The rows rank again, and ▲▼ marks movement from equal weights. Switch Weights to Presets to choose a lens instead of setting each team.',
    content: <WeightedTugOfWar />,
  },
]

// 3C (Rank across lenses, ./sketches/LensRankGrid) is hidden for now; re-add its tab here to restore it.
const STEP_3_TABS: StageTab[] = [
  {
    id: '3a',
    label: 'Before / after',
    note: 'The left side shows the equal-weight order, and the right side shows the order under the chosen lens. Flat lines indicate unchanged rankings; sloped lines indicate where weighting changes the order.',
    content: <BeforeAfter />,
  },
  {
    id: '3b',
    label: 'Score shift',
    note: 'The hollow dot shows the equal-weight score, and the white bar shows the weighted score; the line between them shows the magnitude and direction of the difference.',
    content: <ScoreShift />,
  },
]

// Step 4 explores how a reader goes deeper than the one score each subteam gives.
// Two earlier designs (4a three axes, 4b detail inside the view) were retired in
// Oct 2026 in favour of the pivot. See ./drilldown/model.ts for the
// three-dimensional model it reads.
const STEP_4_TABS: StageTab[] = [
  {
    id: '4c',
    label: 'Build the comparison',
    note: 'Tick criteria anywhere in the tree, or type to find one. On a parent row the arrow opens it, the box ticks it and “N parts” swaps it for its children. For scenarios and periods, one value holds that dimension fixed and two or more make it an axis. Places compare within one subteam only, because each subteam drew its own boundaries; where that subteam has outlines, several places are drawn as one map per scenario instead of a table. Different subteams or units get separate tables.',
    content: <PivotTable />,
  },
]

/** Height (px) of the step badge row, so both text columns start on the same line. */
const STEP_BADGE_ROW = 26

/**
 * Which way round the page is read.
 *
 * By scenario puts the six futures first and asks which wins, which is the question
 * the project exists to answer, and which forces every criterion into one
 * commensurable number. By subteam puts the five criteria first and asks what each
 * one looked at, which needs no commensurability and so can show the evidence the
 * other mode has to drop. Neither replaces the other.
 */
type Mode = 'scenario' | 'subteam'

// The subteam pages keep hue for values, so the team palette is always neutral there.
const NEUTRAL = TEAM_PALETTES.find((p) => p.key === 'neutral') ?? TEAM_PALETTES[0]

const MODES: { key: Mode; label: string; note: string }[] = [
  {
    key: 'scenario',
    label: 'By scenario',
    note: 'Which future ranks highest, and the degree to which the weights affect the result',
  },
  {
    key: 'subteam',
    label: 'By subteam',
    note: 'What each criterion measured, and what goes into the score',
  },
]

export default function RankVisualization() {
  const [paletteKey, setPaletteKey] = useState<TeamPaletteKey>('color')
  const [mode, setMode] = useState<Mode>('scenario')
  const palette = TEAM_PALETTES.find((p) => p.key === paletteKey) ?? TEAM_PALETTES[0]

  return (
    <PageLayout title="Rank Visualization" fullWidthContent hideTitle>
      <MotionConfig reducedMotion="user">
        <TeamPaletteContext.Provider value={mode === 'subteam' ? NEUTRAL.colors : palette.colors}>
          <Box sx={(theme) => ({ px: theme.jtSpacing.page.x, pt: theme.jtSpacing.section.sm })}>
            <Typography variant="h2" component="h1">
              Rank Visualization
            </Typography>
            <ModePicker value={mode} onChange={setMode} />
            {mode === 'scenario' && (
              <TeamPalettePicker value={paletteKey} onChange={setPaletteKey} />
            )}
          </Box>

          {mode === 'subteam' ? (
            <SubteamPages />
          ) : (
            <>
              <Step
                step={1}
                eyebrow="Equal weights"
                title="The overall ranking"
                intro="Five subteams scored six adaptation scenarios against Business as Usual, each on its own criterion. With equal weights, their scores give one overall ranking. Scores come from the Oct 2026 conference slides, or the Sept 2026 reports where the slides have none; an asterisk marks a value we inferred rather than one the subteam reported."
                extra={<StepOneKey />}
                tabs={STEP_1_TABS}
              />
              <Step
                step={2}
                eyebrow="Weights"
                title="Changing whose voice counts"
                intro="Give a team more or less weight and watch the overall scores and ranking change. The range remains constant because it describes the ballots, not the weights."
                tabs={STEP_2_TABS}
              />
              <Step
                step={3}
                eyebrow="Sensitivity"
                title="Does the weighting change the answer?"
                intro="Compare your weights with the equal-weight ranking from step 1. Some scenarios retain their rank; when a scenario’s rank changes, the choice of weights affects the answer."
                tabs={STEP_3_TABS}
              />
              <Step
                step={4}
                eyebrow="Depth"
                title="Going deeper than one score"
                intro="Every published value belongs to one scenario and one position in the criterion tree: subteam → metric → measurement. Some also belong to one place and period. Choose what varies and the table takes that shape. A child does not always enter its parent’s score: Ecology ranks 8 species across 8 regions and 2 water years, but those ranks never reach the criterion score."
                tabs={STEP_4_TABS}
              />
            </>
          )}
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
/**
 * The page's primary switch, so it sits above the steps rather than inside one.
 * Each mode carries a line saying what it answers, because the two are different
 * questions rather than two views of the same one.
 */
function ModePicker({ value, onChange }: { value: Mode; onChange: (key: Mode) => void }) {
  return (
    <Box
      role="radiogroup"
      aria-label="How to read this page"
      sx={(theme) => ({
        display: 'flex',
        flexWrap: 'wrap',
        gap: theme.jtSpacing.gap.xs,
        mt: theme.jtSpacing.component.md,
      })}
    >
      {MODES.map((option) => {
        const active = option.key === value
        return (
          <ButtonBase
            key={option.key}
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option.key)}
            sx={(theme) => ({
              display: 'grid',
              gap: 0.2,
              justifyItems: 'start',
              textAlign: 'left',
              px: 1.5,
              py: 1,
              borderRadius: 1.5,
              border: 1,
              borderColor: active ? 'primary.main' : 'border.strong',
              bgcolor: active ? theme.chart.voting.well : 'transparent',
              transition: 'border-color 150ms ease, background-color 150ms ease',
              '&:hover, &.Mui-focusVisible': { borderColor: 'primary.main' },
            })}
          >
            <Typography variant="chartTitle" sx={{ color: active ? 'common.white' : 'base.100' }}>
              {option.label}
            </Typography>
            <Typography variant="chartAxis" sx={{ color: 'base.300' }}>
              {option.note}
            </Typography>
          </ButtonBase>
        )
      })}
    </Box>
  )
}

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
