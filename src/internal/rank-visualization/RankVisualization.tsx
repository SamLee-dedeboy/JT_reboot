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
  { term: 'Overall', definition: 'the average of the scored ballots' },
  { term: 'Spread', definition: 'highest minus lowest ballot: how much teams disagree' },
]

const STEP_1_TABS: StageTab[] = [
  {
    id: '1a',
    label: 'Ranked scoreboard',
    note: 'Bars grow from the baseline to each overall score on the full −5 to +5 axis. The scale on the left groups scenarios by which side of today they land on. Each scenario unfolds into its five ballots (click a row to fold it); dashed, asterisked ballots are inferred rather than reported: the pip shows that team’s side of today — filled = better, hollow = worse, dash = the same — the dashed line through the ballots is their average (blue above today, orange below). Turn on Spread to shade each scenario’s range from its lowest to its highest ballot, box-plot style.',
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

// Step 4 explores how a reader goes deeper than the one score each subteam gives.
// Both designs read the same criterion tree and the same selection state; the only
// difference is whether place and period are a top-level axis or detail inside a
// view. See ./drilldown/model.ts for the three-dimensional model they share.
const STEP_4_TABS: StageTab[] = [
  {
    id: '4a',
    label: 'Three axes',
    note: 'The controls sit in a sticky sidebar on the left and the table beside them, so a click and its effect are in one screen. Read the sidebar top to bottom. “View” picks the kind of table you get. Over the table, “Now showing” states the whole position as one sentence — verb, what varies, the criterion, then the place and period — with the terms you chose set in caps and the pinned one in green. Under the divider, “You are at” is the path you are standing on (click a crumb to go back up; the trail at the right end shows Subteam › Metric › Measurement), “Drill into” is where you can go next, and the Scenario, Where and When rows each say on their right whether they change this view or not — a greyed row is a control that currently does nothing. All three dimensions are top-level here, so any of the four ways in reaches the same cell and re-anchoring never clears the rest. In the table, Relation says how a child relates to its parent, because drilling down is not always "what is inside this number"; only −5…+5 scores use the blue/orange scale, so a change of units is visible. Three bar states are deliberately distinct: a bar is a value, a white tick on the baseline is a measured zero, and a dashed empty track with “—” is no number at all. Pick "Look at one place & time" to see what every criterion measures at one slice — and how often the answer is nothing.',
    content: <DrillAxes />,
  },
  {
    id: '4b',
    label: 'Detail inside the view',
    note: 'The same sidebar and the same reading order, one row shorter: Where & when is not a control here, it is a breakdown panel under the table with its own local controls, so the row only tells you whether this criterion has one. Two views instead of three. Cheaper to read, and the comparison it gives up is across criteria — EJ scores its drinking water three times by season and Recreation’s whole story is how late in the year stress lingers, but each calendar sits in its own panel with nothing to line them up.',
    content: <DrillNested />,
  },
  {
    id: '4c',
    label: 'Build the comparison',
    note: 'The whole criterion tree stays on screen and you tick what you want to compare. There is no “where you are”, so a criterion in one subteam and a criterion in another can sit in the same table, and moving between them costs a tick instead of a walk up to the root and back down; typing in the filter flattens the tree to the matches, which is the direct jump. A parent row carries three separate things: the twisty opens it, the box ticks it, and “N parts” swaps the node for its children, because a total and its components rarely belong together. Scenarios, places and periods behave the same way — one value picked means fixed, two or more means that dimension becomes an axis, and nothing decides the shape of the table but the selection. Two guards replace a broken table: more than two dimensions varying has no two-dimensional form, and past ~160 cells a grid stops being readable. Columns from different subteams, or in different units, split into separate tables rather than sharing a scale they do not have.',
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
    note: 'Which future ranks best, and how much the weighting decides it',
  },
  {
    key: 'subteam',
    label: 'By subteam',
    note: 'What each criterion measured, and how much of it reaches a score',
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
                intro="Five subteams scored six adaptation scenarios against Business as Usual, each from its own criterion. Counting every subteam equally gives one overall ranking. Scores come from the subteams’ Oct 2026 conference slides, falling back to their Sept 2026 reports. Values marked * are inferred, not the subteam’s own number: Ecology publishes no criterion score, so its column is the mean of its two metric ranks, and Recreation publishes none either, so its column is read off the threshold percentages it does publish. A Tunnel is unscored by Recreation, EJ and Economy — EJ withdrew its numbers for both A Tunnel and Calling on Reserves this round."
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
              <Step
                step={4}
                eyebrow="Depth"
                title="Going deeper than one score"
                intro="Every number the five subteams publish sits at one scenario, one point in the criterion tree (subteam → metric → entity) and, sometimes, one place and period. Both designs below pin one of those and let the others vary, which is what makes the four ways of exploring interchangeable. Each one states its whole position in a Now showing block, then separates the path you are standing on from the places you can go next. They also carry what a uniform drill-down would hide: a child can average into its parent, derive it, duplicate it, sit beside it without ever entering it, or never be scored. Ecology is the case to look at — its richest evidence, 8 species across 8 regions and 2 water years, is ranked per species and still enters no criterion score."
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
