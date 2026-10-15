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
import DrillAxes from './sketches/DrillAxes'
import DrillNested from './sketches/DrillNested'
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
    note: 'Each bar starts at the Business as Usual baseline and ends at the overall score on the full −5 to +5 axis; the scale on the left groups scenarios by their position relative to that baseline. Click a scenario row to show or hide its five ballots. A dashed ballot with an asterisk was inferred rather than reported, and its pip shows the team’s difference from baseline: filled is above, hollow is below, and a dash is equal. The dashed line across the ballots shows their mean, in blue above the baseline and orange below it. Turn on Range to shade the interval from the lowest to the highest ballot, like a box plot.',
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
// Both designs read the same criterion tree and the same selection state; the only
// difference is whether place and period are a top-level axis or detail inside a
// view. See ./drilldown/model.ts for the three-dimensional model they share.
const STEP_4_TABS: StageTab[] = [
  {
    id: '4a',
    label: 'Three axes',
    note: 'The controls stay in a sidebar beside the table, so you can see each click take effect; read the sidebar from top to bottom. “View” chooses the table, while “Now showing” describes the current view in one sentence: what the table does, what changes, the criterion, the place, and the period. Your choices appear in caps, and the fixed choice is green. Below the divider, “You are at” shows your current path; click a crumb to move up, and use the trail at the right to follow Subteam › Metric › Measurement. “Drill into” lists the next choices. The Scenario, Where, and When rows indicate whether they affect the current view; grey rows do not. All three dimensions are top-level controls, so each of the four routes can reach the same cell without clearing the other choices when the fixed dimension changes. In the table, Relation indicates how a child connects to its parent, although drilling down does not always reveal what is included in a value. Only −5…+5 scores use the blue and orange scale, making changes in units visible. Bars have three states: a bar is a value, a white tick at the baseline is a measured zero, and a dashed empty track with “—” means there is no value. Choose "Look at one place & time" to compare what every criterion measures in one slice, including how often no result is available.',
    content: <DrillAxes />,
  },
  {
    id: '4b',
    label: 'Detail inside the view',
    note: 'The sidebar follows the same order with one fewer row: Where & when is a panel below the table with its own local controls, while the sidebar row only indicates whether the criterion includes that breakdown. This design offers two views instead of three and is easier to read, but it cannot compare criteria by place and time. EJ scores its drinking water three times by season, while Recreation focuses on how late in the year stress continues; each calendar stays in its own panel, so they cannot be aligned.',
    content: <DrillNested />,
  },
  {
    id: '4c',
    label: 'Build the comparison',
    note: 'The criterion tree stays on screen; tick the items you want to compare. There is no “where you are” path, so criteria from different subteams can appear in the same table, and moving between them takes one tick instead of a trip to the root and back. Type in the filter to show only matches and jump directly to them. Each parent row has three controls: the arrow opens it, the box selects it, and “N parts” replaces it with its children, because a total and its parts rarely belong in the same comparison. Scenarios, places, and periods work the same way: pick one value to hold that dimension fixed, or pick two or more to make it an axis. Your selection alone sets the table’s shape, subject to one limit: more than two changing dimensions cannot fit in a two-dimensional table. Columns from different subteams or with different units appear in separate tables because they cannot share a scale.',
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
        <TeamPaletteContext.Provider value={palette.colors}>
          <Box sx={(theme) => ({ px: theme.jtSpacing.page.x, pt: theme.jtSpacing.section.sm })}>
            <Typography variant="h2" component="h1">
              Rank Visualization
            </Typography>
            <TeamPalettePicker value={paletteKey} onChange={setPaletteKey} />
            <ModePicker value={mode} onChange={setMode} />
          </Box>

          {mode === 'subteam' ? (
            <SubteamPages />
          ) : (
            <>
              <Step
                step={1}
                eyebrow="Equal weights"
                title="The overall ranking"
                intro="Five subteams scored six adaptation scenarios relative to the Business as Usual baseline, each using its own criterion. If every subteam counts equally, their scores produce one overall ranking. The scores come from the subteams’ Oct 2026 conference slides or, when needed, their Sept 2026 reports; an asterisk marks an inferred value rather than one reported by the subteam. Ecology reports no criterion score, so its column uses the mean of its two metric ranks, while Recreation reports no score and its column is estimated from its published threshold percentages. Recreation, EJ and Economy did not score A Tunnel, and EJ withdrew its values for both A Tunnel and Calling on Reserves in this round."
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
                intro="Every value published by the five subteams belongs to one scenario and one position in the criterion tree: subteam → metric → entity; some also belong to one place and period. Both designs below hold one of those dimensions fixed and let the others change, making the four ways of exploring interchangeable. A Now showing block describes the current view, while the controls separate your current path from the places you can go next and reveal relationships that a standard drill-down would hide. A child can contribute to its parent’s mean, be used to derive or duplicate it, sit beside it without entering it, or never be scored. Ecology gives the clearest example: its richest evidence covers 8 species across 8 regions and 2 water years, and the team ranks each species, but those ranks never enter a criterion score."
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
