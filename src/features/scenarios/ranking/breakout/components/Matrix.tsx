// The table itself: column heads, the score rows, the measures under them, and
// how each cell is drawn (a score tile, a number, or a bar from mid-cell).
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded'
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded'
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { Box, ButtonBase, IconButton, Typography, useTheme } from '@mui/material'
import { motion, useReducedMotion } from 'framer-motion'
import { useState } from 'react'
import type { MouseEvent, ReactNode } from 'react'
import { ranking } from '../../../../../theme'
import { TEAMS, cellFill } from '../../../../../internal/rank-visualization/data'
import { rankAt } from '../../../../../internal/rank-visualization/drilldown/cellValue'
import { ANY, fmtValue } from '../../../../../internal/rank-visualization/drilldown/model'
import type {
  CriterionNode,
  ScenarioKey,
} from '../../../../../internal/rank-visualization/drilldown/model'
import { StageChip } from './controls'
import { ScoreInfo } from './CellCards'
import type { Inspect } from './CellCards'
import {
  PLACEHOLDER,
  capitalise,
  lifeStage,
  lowerIsBetter,
  pointAt,
  scoreText,
  signed,
} from '../model/cells'
import { FADED } from '../model/chartKit'
import { UI, scenarioName } from '../model/labels'
import { isRanked } from '../model/rankingModel'
import { focusRing } from '../styles'
import { DENSEST_TABLE_ROWS, ENTITY_ROW } from '../useBreakout'
import type { Breakout } from '../useBreakout'

/** A Box that Motion can animate: the table's label and cells. */
const MotionBox = motion.create(Box)

/** The table's easing: quick out of the gate, gentle to rest. */
const EASE = [0.2, 0, 0, 1] as const

/**
 * A row label: two lines where rows have room for them, one line in a long table,
 * where a second line would be cut through. Either way it ends in an ellipsis.
 */
const labelLines = (lines: 1 | 2 | 3) =>
  ({
    display: '-webkit-box',
    WebkitLineClamp: lines,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    // A long name breaks into even lines rather than one long and one short.
    textWrap: 'balance',
  }) as const

/**
 * The table, fitted to the card. Ranking scores are the rows; one opens into the
 * entities it is based on, nested beneath it in their own units, each entity's own
 * rank beside its value where it has one. Every row shares the height there is.
 */
/** The gap between two column groups. */
const GROUP_GAP = '16px'

export function Matrix({
  state,
  onInspect,
  fit,
}: {
  state: Breakout
  onInspect: (inspect: Inspect) => void
  /** Share one screen's height between the rows (the kiosk); otherwise rows take their own. */
  fit: boolean
}) {
  // The first column of every group after the first gets a gap before it.
  const groupStarts = new Set(state.groups.slice(1).map((group) => group[0]))
  const gap = (scenario: ScenarioKey) =>
    groupStarts.has(scenario) ? <Box key={`gap-${scenario}`} aria-hidden /> : null
  const diff = state.reading === 'change'
  const teamColor = TEAMS.find((t) => t.key === state.root.team)?.color
  const active = state.scenarios
  // In deviation view the baseline is locked off and fades like any scenario
  // switched off; its own text stays plain white (see Cell's `baseline`).
  const lit = (scenario: ScenarioKey) => active.includes(scenario)
  const rows = state.rows.map((row) => {
    const cells = state.columns.map((scenario) => {
      const point = pointAt(state, row.node, scenario, state.period)
      const coords = {
        criterion: row.node.id,
        scenario,
        place: state.place,
        period: state.period,
        climate: state.climate,
      }
      return { ...point, rank: row.depth === 1 ? rankAt(coords) : null }
    })
    return { ...row, cells }
  })
  const anyPlaceholder = rows.some((row) => row.cells.some((c) => c.why === PLACEHOLDER))
  // New Green Watershed shows its 50% wetland level; where a row has all three, its
  // header pill opens the column into 25%, 50% and 100% wetland.
  const [levelsOpen, setLevelsOpen] = useState(false)
  const hasLevels = state.columns.includes(NGW) && rows.some((row) => row.node.ngwLevels)
  const split = levelsOpen && hasLevels
  // Open, the 50% level keeps a full column and 25% and 100% take about half one
  // each, never so little that a value like −$212M is cut off.
  const side = `minmax(${ranking.levelColumnMin}px, 0.6fr)`
  const track = (scenario: ScenarioKey) =>
    split && scenario === NGW ? `${side} minmax(0, 1fr) ${side}` : 'minmax(0, 1fr)'
  const scenarioColumns = state.groups
    .map((group) => group.map(track).join(' '))
    .join(` ${GROUP_GAP} `)
  const span = (scenario: ScenarioKey) => (split && scenario === NGW ? 3 : 1)
  // Scores whose entities are drawn as bars: each column a horizontal bar chart,
  // one axis for the whole block so the columns compare.
  const [barred, setBarred] = useState<string[]>([])
  const toggleBars = (id: string) =>
    setBarred((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  const scoreOf = (index: number) => rows.slice(0, index + 1).findLast((r) => r.depth === 0)?.node
  // A block that mixes units (dollars and jobs) gets one axis per unit.
  const extents = new Map(
    rows
      .filter((row) => row.depth === 0 && barred.includes(row.node.id))
      .flatMap((row) => {
        const entities = rows.filter((r, i) => r.depth === 1 && scoreOf(i) === row.node)
        return [...new Set(entities.map((r) => r.node.unit))].map((unit) => {
          const values = entities
            .filter((r) => r.node.unit === unit)
            .flatMap((r) => r.cells.map((c) => c.value).filter((v): v is number => v !== null))
          // Zero sits mid-cell; the largest difference either way reaches the edge.
          return [`${row.node.id}|${unit}`, Math.max(...values.map(Math.abs), 0)] as const
        })
      }),
  )
  const reduceMotion = useReducedMotion()
  // An opened score's entities arrive one after another, sliding down from it;
  // every item keeps its place animated, so the rows below glide out of the way.
  // The fade for a switched-off scenario rides the same animation.
  let entityIndex = 0
  const order = rows.map((row) => (row.depth === 0 ? (entityIndex = 0) : entityIndex++))
  const motionFor = (depth: 0 | 1, index: number, opacity = 1) =>
    reduceMotion
      ? { initial: false as const, animate: { opacity }, transition: { duration: 0 } }
      : {
          layout: 'position' as const,
          initial: depth === 1 ? { opacity: 0, y: -10 } : (false as const),
          animate: { opacity, y: 0 },
          transition: {
            opacity: { duration: 0.22, delay: depth === 1 ? index * 0.035 : 0 },
            y: { duration: 0.28, ease: EASE, delay: depth === 1 ? index * 0.035 : 0 },
            layout: { duration: 0.28, ease: EASE },
          },
        }
  // Rows share the height as if this table had the densest team's row count; a
  // filler track takes the share of the rows this table does not have. A table
  // longer than that fills the card and its rows shrink instead.
  const weight = rows.reduce((n, row) => n + (row.depth === 1 ? ENTITY_ROW : 1), 0)
  const spare = Math.max(0, Math.round((DENSEST_TABLE_ROWS - weight) * 100) / 100)
  // At that density a row is too short for a two-line label.
  const lines = fit && Math.max(rows.length, DENSEST_TABLE_ROWS) > 9 ? 1 : fit ? 2 : 3
  const template = fit
    ? [
        'auto',
        'auto',
        ...(split ? ['auto'] : []),
        ...rows.map((row) => `minmax(0, ${row.depth === 1 ? ENTITY_ROW : 1}fr)`),
        ...(spare > 0 ? [`minmax(0, ${spare}fr)`] : []),
        'auto',
      ].join(' ')
    : undefined
  // On the site each row takes the height it needs, never less than a touch target.
  const rowMin = (depth: 0 | 1) =>
    fit ? 0 : depth === 1 ? ranking.breakoutRow.entity : ranking.breakoutRow.score
  // On the site a hairline closes the heads and each metric's block.
  const rule = (key: string) =>
    fit ? null : (
      <Box
        key={key}
        aria-hidden
        sx={{ gridColumn: '1 / -1', borderTop: 1, borderColor: 'border.default', my: 1 }}
      />
    )
  const filler = fit && spare > 0

  return (
    <Box
      sx={{
        height: fit ? 1 : 'auto',
        display: 'grid',
        gridTemplateColumns: {
          md: `minmax(0, 2.4fr) ${scenarioColumns}`,
          xl: `minmax(0, 2.2fr) ${scenarioColumns}`,
        },
        gridTemplateRows: template,
        columnGap: 1,
        // Spacing lives inside each row, so a table's gaps do not depend on its row count.
        rowGap: 0,
      }}
    >
      {/* The scenario groups' names over their columns, then the scenarios. */}
      <Box />
      {state.groups.flatMap((group, index) => [
        index > 0 ? <Box key={`gap-label-${index}`} aria-hidden /> : null,
        <Typography
          key={group.join()}
          variant="chartTitle"
          sx={{
            gridColumn: `span ${group.reduce((n, scenario) => n + span(scenario), 0)}`,
            alignSelf: 'end',
            color: 'primary.main',
            pb: 0.5,
            mb: 0.75,
            borderBottom: 1,
            borderColor: 'translucent.primaryGreen',
          }}
        >
          {state.groupLabels?.[index] ?? ''}
        </Typography>,
      ])}
      <Typography variant="chartTitle" sx={{ alignSelf: 'end', color: 'base.200' }}>
        {UI.metric}
      </Typography>
      {state.columns.flatMap((scenario) => [
        gap(scenario),
        <Box
          key={scenario}
          sx={{
            gridColumn: `span ${span(scenario)}`,
            alignSelf: 'end',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            columnGap: 1,
            rowGap: 0.5,
            // Open, New Green Watershed's head and its levels share a pale green ground.
            ...(split && scenario === NGW
              ? { bgcolor: 'translucent.primaryGreenSubtle', px: 1, py: 0.75 }
              : {}),
            opacity: lit(scenario) ? 1 : FADED,
            transition: 'opacity 200ms ease',
          }}
        >
          {/* The level in view sits above the name, so the name lines up with the others. */}
          {scenario === NGW && hasLevels && (
            <LevelsPill open={split} onToggle={() => setLevelsOpen((open) => !open)} />
          )}
          <Typography variant="chartTitle" sx={{ color: 'base.50', flexBasis: '100%' }}>
            {scenarioName(scenario)}
          </Typography>
        </Box>,
      ])}
      {/* With the levels open, their names under New Green Watershed's. */}
      {split && <Box />}
      {split &&
        state.columns.flatMap((scenario) => [
          gap(scenario),
          scenario === NGW ? (
            UI.ngwLevels.map((label, index) => (
              <Typography
                key={`level-${label}`}
                variant="button"
                sx={{
                  // Two-line and one-line labels sit on the same middle line.
                  alignSelf: 'stretch',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  mt: 1,
                  px: 1,
                  py: 0.75,
                  bgcolor: 'translucent.primaryGreenSubtle',
                  borderTop: 2,
                  borderColor: index === NGW_DEFAULT ? 'primary.main' : 'transparent',
                  color: index === NGW_DEFAULT ? 'common.white' : 'base.100',
                }}
              >
                {label}
              </Typography>
            ))
          ) : (
            <Box key={`level-${scenario}`} />
          ),
        ])}
      {rule('heads')}
      {rows.map(({ node, depth, open, cells }, rowIndex) => {
        const ranked = node.unit === 'score'
        const canOpen = depth === 0 && node.level !== 'team' && !!node.children?.length
        const extent =
          depth === 1 ? extents.get(`${scoreOf(rowIndex)?.id}|${node.unit}`) : undefined
        const bars = barred.includes(node.id)
        // A metric described in words: its name, and one line across the scenarios.
        if (depth === 0 && node.level !== 'team' && !isRanked(node) && !node.steps)
          return (
            <Box key={node.id} sx={{ display: 'contents' }}>
              <MotionBox
                {...motionFor(0, order[rowIndex])}
                sx={{
                  minHeight: rowMin(0),
                  display: 'flex',
                  alignItems: 'center',
                  py: 0.375,
                  pl: 3.5,
                }}
              >
                <Typography
                  variant="body2"
                  title={node.label}
                  sx={{ ...labelLines(lines), color: 'base.50' }}
                >
                  {node.label}
                </Typography>
              </MotionBox>
              <MotionBox
                {...motionFor(0, order[rowIndex])}
                sx={{
                  gridColumn: '2 / -1',
                  display: 'flex',
                  alignItems: 'center',
                  minHeight: rowMin(0),
                  px: 1.25,
                  my: 0.375,
                  border: 1,
                  borderColor: 'border.subtle',
                  borderRadius: 0.6,
                }}
              >
                <Typography variant="body2" sx={{ color: 'base.200' }}>
                  {UI.qualitative}
                </Typography>
              </MotionBox>
            </Box>
          )
        return (
          <Box key={node.id} sx={{ display: 'contents' }}>
            {depth === 0 && rowIndex > 0 && rule(`rule-${node.id}`)}
            {/* A ranking score with its opener; an entity carries its unit. */}
            <MotionBox
              {...motionFor(depth, order[rowIndex])}
              sx={{
                minHeight: rowMin(depth),
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                py: depth === 1 ? 0.25 : 0.375,
                // Entities sit well in from their score, under its label.
                pl: depth === 1 ? { md: 3.5, xl: 5 } : 0,
              }}
            >
              {depth === 0 && node.level !== 'team' && (
                <IconButton
                  size="small"
                  disabled={!canOpen}
                  onClick={() => state.toggleExpanded(node.id)}
                  aria-expanded={canOpen ? !!open : undefined}
                  aria-label={
                    canOpen
                      ? `${open ? 'Close' : 'Open'} what ${node.label} is based on`
                      : undefined
                  }
                  sx={{
                    p: 0.25,
                    color: open ? 'primary.main' : 'base.100',
                    visibility: canOpen ? 'visible' : 'hidden',
                  }}
                >
                  {/* One chevron that turns, rather than two icons that swap. */}
                  <motion.span
                    animate={{ rotate: open ? 90 : 0 }}
                    transition={{ duration: reduceMotion ? 0 : 0.2, ease: EASE }}
                    style={{ display: 'inline-flex' }}
                  >
                    <ChevronRightIcon fontSize="small" />
                  </motion.span>
                </IconButton>
              )}
              <Box sx={{ minWidth: 0 }}>
                {depth === 0 && ranked ? (
                  <>
                    <Box
                      sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        columnGap: 1,
                        rowGap: 0.5,
                        minWidth: 0,
                      }}
                    >
                      <Typography
                        variant="chartTitle"
                        component="p"
                        title={node.label}
                        sx={{
                          ...labelLines(lines),
                          color: node.level === 'team' ? teamColor : undefined,
                        }}
                      >
                        {node.level === 'team' ? UI.teamScore(node.label) : node.label}
                      </Typography>
                      {node.steps && <QualitativeTag />}
                      {/* How the score is built, on demand; in the name's line, so it
                          stays beside a name that wraps. */}
                      {depth === 0 && <ScoreInfo node={node} />}
                    </Box>
                    {node.level === 'team' && (
                      <Typography variant="captionSmall" component="p">
                        {UI.criterionScore}
                      </Typography>
                    )}
                  </>
                ) : (
                  <>
                    <Box
                      sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        columnGap: 1,
                        rowGap: 0.5,
                        minWidth: 0,
                      }}
                    >
                      <Typography
                        variant="body2"
                        title={node.label}
                        sx={{ ...labelLines(lines), color: 'base.50' }}
                      >
                        {lifeStage(node.label).name}
                      </Typography>
                      {lifeStage(node.label).stage && (
                        <StageChip label={capitalise(lifeStage(node.label).stage!)} plain />
                      )}
                      {node.steps && <QualitativeTag />}
                      {/* How the score is built, on demand; in the name's line, so it
                          stays beside a name that wraps. */}
                      {depth === 0 && <ScoreInfo node={node} />}
                    </Box>
                  </>
                )}
              </Box>
              {/* An open score can draw its entities as bars, column by column. */}
              {/* Conditions have no numbers to draw as bars. */}
              {open && !node.steps && (
                <IconButton
                  size="small"
                  onClick={() => toggleBars(node.id)}
                  aria-pressed={bars}
                  aria-label={`${bars ? 'Show values' : 'Show bars'} for what ${node.label} is based on`}
                  title={bars ? UI.showValues : UI.showAsBars}
                  sx={{
                    p: 0.25,
                    ml: 'auto',
                    flex: 'none',
                    color: bars ? 'primary.main' : 'base.100',
                    bgcolor: bars ? 'translucent.primaryGreen' : 'transparent',
                  }}
                >
                  <BarChartOutlinedIcon fontSize="small" sx={{ transform: 'rotate(90deg)' }} />
                </IconButton>
              )}
            </MotionBox>
            {cells.flatMap((cell) => [
              gap(cell.scenario),
              node.steps || node.metBy ? (
                <MotionBox
                  key={cell.scenario}
                  {...motionFor(depth, order[rowIndex], lit(cell.scenario) ? 1 : FADED)}
                  sx={{
                    minHeight: rowMin(depth),
                    display: 'grid',
                    py: depth === 1 ? 0 : 0.375,
                    gridColumn: `span ${span(cell.scenario)}`,
                  }}
                >
                  <QualitativeCell
                    node={node}
                    parent={depth === 1 ? scoreOf(rowIndex) : undefined}
                    scenario={cell.scenario}
                    depth={depth}
                  />
                </MotionBox>
              ) : split && cell.scenario === NGW ? (
                <LevelCells
                  key={cell.scenario}
                  node={node}
                  depth={depth}
                  minHeight={rowMin(depth)}
                  motion={motionFor(depth, order[rowIndex], lit(cell.scenario) ? 1 : FADED)}
                  score={ranked}
                  signedText={diff}
                  fallback={cell}
                  whole={state.place === ANY}
                />
              ) : (
                <MotionBox
                  key={cell.scenario}
                  {...motionFor(depth, order[rowIndex], lit(cell.scenario) ? 1 : FADED)}
                  sx={{ minHeight: rowMin(depth), display: 'grid', py: depth === 1 ? 0 : 0.375 }}
                >
                  <Cell
                    bar={extent}
                    value={cell.value}
                    why={cell.why}
                    rank={cell.rank}
                    unit={node.unit}
                    score={ranked}
                    lowerBetter={lowerIsBetter(node.id)}
                    baseline={diff && cell.scenario === state.baseline}
                    signedText={diff}
                    onClick={
                      cell.raw !== null
                        ? (event) =>
                            onInspect({
                              anchor: event.currentTarget,
                              node,
                              point: cell,
                              diff,
                              outflowSet: state.setId === 'outflow',
                              coords: {
                                criterion: node.id,
                                scenario: cell.scenario,
                                place: state.place,
                                period: state.period,
                                climate: state.climate,
                              },
                            })
                        : undefined
                    }
                  />
                </MotionBox>
              ),
            ])}
          </Box>
        )
      })}
      {filler && <Box aria-hidden sx={{ gridColumn: '1 / -1' }} />}
      {/* The kiosk's how-to line; wraps on a narrow screen rather than being cut off. */}
      {fit && (
        <Typography variant="body2" sx={{ gridColumn: '1 / -1', color: 'base.200', pt: 0.5 }}>
          {UI.footnote}
          {anyPlaceholder && UI.footnotePlaceholder}
          {state.climate === 'slr' && UI.footnoteSeaLevelRise}
        </Typography>
      )}
    </Box>
  )
}

/** New Green Watershed's column key, and which of its three levels is the default. */
const NGW: ScenarioKey = 'ngw'
const NGW_DEFAULT = 1

/**
 * The small pill after New Green Watershed's name: it says the default level and
 * opens the column into all three.
 */
function LevelsPill({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  return (
    <ButtonBase
      onClick={onToggle}
      aria-expanded={open}
      aria-label={open ? UI.ngwLevelsHide : UI.ngwLevelsShow}
      title={UI.ngwDefault}
      sx={{
        typography: 'captionSmall',
        gap: 0.25,
        height: ranking.levelsPill.height,
        pl: 1,
        pr: 0.5,
        border: 1,
        borderColor: 'primary.main',
        borderRadius: ranking.setToggle.radius,
        color: 'primary.main',
        bgcolor: open ? 'translucent.primaryGreen' : 'transparent',
        whiteSpace: 'nowrap',
        '&:hover': { bgcolor: 'translucent.primaryGreen' },
        '&.Mui-focusVisible': focusRing,
      }}
    >
      {open ? UI.ngwLevelsOpen : UI.ngwLevelsClosed}
      <ChevronRightIcon
        fontSize="inherit"
        sx={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 160ms ease' }}
      />
    </ButtonBase>
  )
}

/**
 * New Green Watershed's cells with its levels open: three values where the team
 * reports three, one wide value with a note where all three are the same, and the
 * 50% value alone where the row has no levels at all.
 */
function LevelCells({
  node,
  depth,
  minHeight,
  motion: motionProps,
  score,
  signedText,
  fallback,
  whole,
}: {
  node: CriterionNode
  depth: 0 | 1
  minHeight: number
  motion: object
  score: boolean
  signedText: boolean
  /** The column's own cell, for a row with no levels. */
  fallback: { value: number | null; why: string }
  /** Every place together: the only slice the levels are reported for. */
  whole: boolean
}) {
  const box = (key: string, columns: number, children: ReactNode) => (
    <MotionBox
      key={key}
      {...motionProps}
      sx={{
        minHeight,
        display: 'grid',
        py: depth === 1 ? 0 : 0.375,
        gridColumn: `span ${columns}`,
      }}
    >
      {children}
    </MotionBox>
  )
  const cell = (value: number | null, note?: string, why: string = UI.forthcoming) => (
    <Cell
      value={value}
      why={value === null ? why : ''}
      unit={node.unit}
      score={score}
      lowerBetter={lowerIsBetter(node.id)}
      signedText={signedText}
      note={note}
    />
  )
  // Levels are reported Delta-wide only; at one place, the row shows its own value.
  const levels = whole ? node.ngwLevels : undefined
  if (node.levelsSame || (node.ngwLevels && !levels))
    return box(
      'levels',
      3,
      cell(
        fallback.value ?? null,
        fallback.value === null ? undefined : UI.sameAtAllLevels,
        fallback.why,
      ),
    )
  // Levels hold the runs' own values; as differences they move by what the 50% cell
  // does (its baseline), so a level beside Business as Usual reads as its change too.
  const shift = levels?.[1] != null && fallback.value !== null ? fallback.value - levels[1] : 0
  // No value at 25% or 100%: the cell stays empty, but a measure keeps its hairline.
  const blank = (
    <Box
      aria-hidden
      sx={{ height: 1, borderBottom: score ? 0 : 1, borderColor: 'border.subtle' }}
    />
  )
  if (!levels)
    return (
      <>
        {box('level-0', 1, blank)}
        {box('level-1', 1, cell(fallback.value ?? null))}
        {box('level-2', 1, blank)}
      </>
    )
  const shown = levels.map((value) => (value === null ? null : value + shift))
  if (shown.every((value) => value === shown[0]))
    return box('levels', 3, cell(shown[0], UI.sameAtAllLevels))
  return <>{shown.map((value, index) => box(`level-${index}`, 1, cell(value)))}</>
}

/** The small outlined tag after a qualitative row's name. */
function QualitativeTag() {
  return (
    <Typography
      component="span"
      variant="captionSmall"
      sx={{
        flex: 'none',
        px: 1,
        border: 1,
        borderColor: 'border.strong',
        borderRadius: ranking.setToggle.radius,
        color: 'base.200',
        whiteSpace: 'nowrap',
      }}
    >
      {UI.qualitativeTag}
    </Typography>
  )
}

/**
 * A qualitative cell. A row in steps shows one arrow per step, up in the better-than-
 * today blue or down in orange, or "No change"; a condition under it shows a check
 * where the scenario puts it in place and a dash where it does not. A scenario the
 * team has not assessed reads as forthcoming.
 */
function QualitativeCell({
  node,
  parent,
  scenario,
  depth,
}: {
  node: CriterionNode
  /** For a condition: the qualitative row it sits under. */
  parent?: CriterionNode
  scenario: ScenarioKey
  depth: 0 | 1
}) {
  const line = depth === 1 ? { borderBottom: 1, borderColor: 'border.subtle' } : {}
  const text = (words: string, boxed = false) => (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: { md: 0.75, xl: 1.25 },
        ...(boxed ? { border: 1, borderColor: 'border.default', borderRadius: 0.6 } : line),
      }}
    >
      <Typography variant="body2" sx={{ color: 'base.300' }}>
        {words}
      </Typography>
    </Box>
  )

  if (node.metBy) {
    if (parent?.steps?.[scenario] === undefined) return text(UI.forthcoming)
    const met = node.metBy.includes(scenario)
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', ...line }}>
        {met ? (
          <CheckCircleRoundedIcon
            role="img"
            aria-label={UI.inPlace}
            fontSize="small"
            sx={{ color: 'base.200' }}
          />
        ) : (
          <Typography variant="body2" aria-label={UI.notInPlace} sx={{ color: 'base.300' }}>
            —
          </Typography>
        )}
      </Box>
    )
  }

  // Where the scored row above it does not apply (no restoration in the outflow
  // run), neither does its qualitative row.
  if (node.notApplicable?.includes(scenario)) return text(UI.notApplicable)
  const steps = node.steps?.[scenario]
  if (steps === undefined) return text(UI.forthcoming, depth === 0)
  if (steps === 0) return text(UI.noChange)
  const Arrow = steps > 0 ? ArrowUpwardRoundedIcon : ArrowDownwardRoundedIcon
  return (
    <Box
      role="img"
      aria-label={UI.stepsAria(steps)}
      sx={(theme) => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: { md: 0.75, xl: 1.25 },
        borderRadius: 0.6,
        bgcolor: steps > 0 ? 'translucent.primaryBlueSubtle' : 'translucent.brickSubtle',
        color: steps > 0 ? theme.chart.voting.above : theme.chart.voting.belowText,
      })}
    >
      {Array.from({ length: Math.abs(steps) }, (_, index) => (
        <Arrow key={index} fontSize="small" sx={{ mx: -0.25 }} />
      ))}
    </Box>
  )
}

/**
 * One cell. A score takes the −5…+5 palette at its value, whether that value is the
 * score or its difference from Business as Usual. A detail is plain text, or a bar
 * on its block's axis when the block is drawn as bars. As a difference, the number and bar are
 * blue where it is better and orange where it is worse. Its own rank rides beside it
 * as a badge. A row scored per entity shows the
 * range of its entities' ranks instead.
 */
function Cell({
  bar,
  value,
  why,
  rank,
  lowerBetter,
  unit,
  score,
  baseline,
  signedText,
  note,
  onClick,
}: {
  /** Draw the value as a bar from mid-cell, this far reaching the edge, instead of as text. */
  bar?: number
  value: number | null
  why: string
  rank?: number | null
  /** Less is better for this measure, so a fall reads blue and a rise orange. */
  lowerBetter?: boolean
  unit: CriterionNode['unit']
  score: boolean
  /** Business as Usual in deviation view: plain white, never blue or orange. */
  baseline?: boolean
  signedText: boolean
  /** A short note at the cell's right end, as "Same at all three levels". */
  note?: string
  onClick?: (event: MouseEvent<HTMLElement>) => void
}) {
  const empty = value === null
  // Both mark a number that will never exist, so both recede the same way.
  const versionOnly = empty && (why === UI.versionOnly || why === UI.notApplicable)
  const fill = empty || !score ? undefined : cellFill(value)
  const text = empty
    ? why
    : signedText && unit !== 'score'
      ? signed(value, unit)
      : fmtValue(value, unit)
  // A detail that reads as zero (no acres, no change, a −0.001% that prints 0%) is
  // background, so it recedes.
  const quiet =
    !empty && !score && (value === 0 || text === signed(0, unit) || text === fmtValue(0, unit))
  const theme = useTheme()
  // A difference that moves reads blue where it is better, red where it is worse:
  // `tone` for its number, `barTone` for its bar.
  const better = value !== null && value > 0 !== !!lowerBetter
  const moves = signedText && !score && !empty && !quiet && !baseline
  const tone = moves
    ? better
      ? theme.chart.voting.above
      : theme.chart.voting.belowText
    : undefined
  const barTone = moves ? (better ? theme.chart.voting.above : theme.chart.voting.below) : undefined
  const badge = rank !== null && rank !== undefined && (
    <Box
      component="span"
      title={`Rank ${scoreText(rank)}`}
      sx={{
        position: 'absolute',
        right: { md: 6, xl: 10 },
        flex: 'none',
        px: 0.75,
        borderRadius: 0.5,
        bgcolor: cellFill(rank),
        color: 'common.white',
      }}
    >
      <Typography variant="chartValue" component="span" sx={{ color: 'inherit' }}>
        {scoreText(rank)}
      </Typography>
    </Box>
  )

  if (bar !== undefined && !empty) {
    // The bar runs in the room the rank badge leaves; −1…+1 of the half-cell.
    const reach = bar > 0 ? Math.max(-1, Math.min(1, value / bar)) : 0
    return (
      <ButtonBase
        disabled={!onClick}
        onClick={onClick}
        sx={{
          justifyContent: 'flex-start',
          gap: 0.75,
          height: 1,
          minHeight: 0,
          borderRadius: 0.6,
          '&.Mui-focusVisible': focusRing,
        }}
      >
        <BarTrack reach={reach} text={text} quiet={quiet} tone={tone} barTone={barTone} />
      </ButtonBase>
    )
  }

  return (
    <ButtonBase
      disabled={!onClick}
      onClick={onClick}
      sx={{
        position: 'relative',
        // The value sits in the middle of its cell; a badge or note keeps the right edge.
        justifyContent: 'center',
        gap: 0.5,
        height: 1,
        minHeight: 0,
        px: { md: 0.75, xl: 1.25 },
        borderRadius: score ? 0.6 : 0,
        // A score still to come is an empty box; a measure is plain text on a hairline;
        // N/A is plain, quiet text.
        border: score && empty && !versionOnly ? 1 : 0,
        borderBottom: score ? undefined : 1,
        borderColor: score ? 'border.default' : 'border.subtle',
        bgcolor: fill ?? 'transparent',
        color:
          baseline && !empty
            ? 'base.50'
            : tone
              ? tone
              : versionOnly
                ? 'base.300'
                : empty || quiet
                  ? 'base.300'
                  : fill
                    ? 'common.white'
                    : 'base.50',
        overflow: 'hidden',
        '&.Mui-focusVisible': focusRing,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, minWidth: 0 }}>
        <Typography
          variant={score && !empty ? 'chartValueLarge' : 'body2'}
          noWrap
          sx={{ position: 'relative', color: 'inherit' }}
        >
          {text}
        </Typography>
      </Box>
      {note ? (
        <Typography
          variant="captionSmall"
          noWrap
          sx={{ position: 'absolute', right: { md: 6, xl: 10 }, color: 'inherit', opacity: 0.85 }}
        >
          {note}
        </Typography>
      ) : (
        badge
      )}
    </ButtonBase>
  )
}

/**
 * A bar from the cell's middle, where zero sits: right for more, left for less. The
 * number sits on the other side of zero, so it never runs into its own bar.
 */
function BarTrack({
  reach,
  text,
  quiet,
  tone,
  barTone,
}: {
  reach: number
  text: string
  quiet: boolean
  /** Blue or orange, as the cell's text. */
  tone?: string
  /** The bar's own blue or red, the number's darker twin. */
  barTone?: string
}) {
  return (
    <Box sx={{ position: 'relative', flex: '1 1 auto', alignSelf: 'stretch', minWidth: 0 }}>
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          left: '50%',
          top: '10%',
          bottom: '10%',
          borderLeft: ranking.zeroLine.width,
          borderColor: ranking.zeroLine.color,
        }}
      />
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          top: '22%',
          bottom: '22%',
          ...(reach >= 0 ? { left: '50%' } : { right: '50%' }),
          width: `${Math.abs(reach) * 50}%`,
          bgcolor: barTone ?? 'base.100',
          opacity: ranking.barOpacity,
          borderRadius: 0.4,
          transition: 'width 300ms ease',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: 0.75,
          maxWidth: '50%',
          ...(reach > 0 ? { right: '50%', pr: 0.75 } : { left: '50%', pl: 0.75 }),
        }}
      >
        <Typography
          component="span"
          variant="body2"
          noWrap
          sx={{ color: tone ?? (quiet ? 'base.300' : 'base.50') }}
        >
          {text}
        </Typography>
      </Box>
    </Box>
  )
}
