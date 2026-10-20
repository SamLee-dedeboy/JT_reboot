// A breakout table: one subteam hosts, the public asks, the screen answers.
//
// This is 4C's data model behind a different shell. The host starts on their own
// criterion with every scenario showing, and has four moves: pick scenarios, pick
// a place, pick a period, open a metric into its parts; and three ways to look,
// table, chart or map. Everything is set large for a projector, and every number
// on screen is one the subteam published: a value we inferred shows as a
// placeholder, never as a number. Pinned views and their notes stay on the
// laptop, offline, and export as a Markdown file for the report-out. Teams with
// sea-level-rise runs can switch the whole table to them; differences are then
// read against that run's own Business as Usual.
//
// The shell speaks the scenarios pages' design: the numbered sticky tab bar and
// bordered translucent panels, with no site navbar so the table owns the screen.
// The table itself keeps the 4C cell design. Scenarios always sit in one fixed
// order and fade when switched off; ranking scores (−5…+5) are set apart from the
// details beneath them, in the table and the charts alike.
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import DownloadIcon from '@mui/icons-material/Download'
import MapOutlinedIcon from '@mui/icons-material/MapOutlined'
import PushPinIcon from '@mui/icons-material/PushPin'
import TableRowsOutlinedIcon from '@mui/icons-material/TableRowsOutlined'
import {
  Box,
  Button,
  ButtonBase,
  Chip,
  IconButton,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  useTheme,
} from '@mui/material'
import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { evaluationCardSx } from '../../../features/scenarios/evaluation/styles'
import { jtSpacing } from '../../../theme'
import { TEAMS, cellFill } from '../data'
import type { TeamKey } from '../data'
import { CellDetail } from '../drilldown/CellDetail'
import { rankAt, valueAt } from '../drilldown/cellValue'
import type { Coords } from '../drilldown/cellValue'
import { ANY, SCENARIO_NAME, fmtValue, inClimate } from '../drilldown/model'
import type { Climate, CriterionNode, Facet, ScenarioKey } from '../drilldown/model'
import { RegionValues } from '../subteams/RegionValues'
import { REGION_DATA_KEY } from '../subteams/regionKeys'
import { Swatch } from '../subteams/SubteamFrame'
import { DetailMatrix, ScoreGrid } from './Charts'
import { FADED, SCENARIO_SHORT, periodGroups, periodShade } from './chartKit'
import type { Point } from './chartKit'
import { MeasureRow, RailGroup, Segmented, SetChip, StageChip, TableTabs } from './controls'
import type { SegmentOption } from './controls'
import { focusRing } from './styles'
import { BREAKOUT_SCENARIOS, DENSEST_TABLE_ROWS, useBreakout } from './useBreakout'
import type { Breakout, Pin, View } from './useBreakout'

const TEAM_KEYS = TEAMS.map((team) => team.key)

/**
 * One paragraph from each subteam to open its table with. Left empty until the
 * team writes it; the page shows a placeholder so the gap is visible at rehearsal.
 */
const HOST_INTRO: Partial<Record<TeamKey, string>> = {}

const PLACEHOLDER = 'awaiting subteam'

/** A Box that Motion can animate: the table's label and cells. */
const MotionBox = motion.create(Box)

/** The table's easing: quick out of the gate, gentle to rest. */
const EASE = [0.2, 0, 0, 1] as const

/**
 * The pin bar (note, pin, export) is hidden for now so the table fits one screen.
 * Pins already saved stay in localStorage and come back when this is turned on.
 */
const SHOW_PINS = false

export default function BreakoutPage() {
  const { team: param } = useParams()
  const team = TEAM_KEYS.includes(param as TeamKey) ? (param as TeamKey) : null
  return (
    // No site navbar or footer: the table owns the screen it is projected on.
    <Box component="main" sx={{ minHeight: '100dvh', bgcolor: 'base.800', color: 'common.white' }}>
      {team ? <Table team={team} key={team} /> : <Picker />}
    </Box>
  )
}

/** The picker's heading: eyebrow and display title, as the evaluation pages open. */
function PickerHeader() {
  return (
    <Box
      component="header"
      sx={(theme) => ({
        px: theme.jtSpacing.page.x,
        pt: theme.jtSpacing.section.md,
        pb: theme.jtSpacing.section.xs,
      })}
    >
      <Stack spacing={jtSpacing.gap.md} sx={{ maxWidth: '90ch' }}>
        <Typography variant="eyebrow" component="p">
          Breakout tables
        </Typography>
        <Typography variant="h1">Pick a table</Typography>
        <Typography variant="bodyLarge" sx={{ color: 'base.50' }}>
          Each subteam hosts a table. Open yours on the laptop that drives the screen.
        </Typography>
      </Stack>
    </Box>
  )
}

function Picker() {
  return (
    <>
      <PickerHeader />
      {/* One card per table, numbered as the tab bar numbers them. */}
      <Box
        sx={(theme) => ({
          px: theme.jtSpacing.page.x,
          pb: theme.jtSpacing.section.lg,
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(5, 1fr)' },
          gap: jtSpacing.gap.md,
        })}
      >
        {TEAMS.map((entry, index) => (
          <Box
            key={entry.key}
            component={Link}
            to={`/pages/breakout/${entry.key}`}
            sx={{
              ...evaluationCardSx,
              display: 'grid',
              gap: jtSpacing.gap.sm,
              color: 'common.white',
              textDecoration: 'none',
              borderTop: 3,
              borderTopColor: entry.color,
              transition: 'border-color 160ms ease, background-color 160ms ease',
              '&:hover': { bgcolor: 'translucent.200', borderColor: 'primary.main' },
              '&:focus-visible': focusRing,
            }}
          >
            <Typography variant="numberBadge" component="span">
              {String(index + 1).padStart(2, '0')}
            </Typography>
            <Typography variant="cardTitle" component="h2">
              {entry.name}
            </Typography>
            <Typography variant="captionSmall">Open this table</Typography>
          </Box>
        ))}
      </Box>
    </>
  )
}

function Table({ team }: { team: TeamKey }) {
  const state = useBreakout(team)
  const name = TEAMS.find((entry) => entry.key === team)?.name ?? ''
  const [inspect, setInspect] = useState<Coords | null>(null)
  const canMap = mapItems(state, team).length > 0
  const view: View = state.view === 'map' && !canMap ? 'table' : state.view

  return (
    // From md up the screen is exactly one viewport tall: tabs, sentence, then the
    // work area. The rail scrolls inside itself; the result is sized to fit.
    <Box
      sx={{
        display: 'grid',
        // One shrinkable column: the tab row scrolls sideways instead of widening the page.
        gridTemplateColumns: 'minmax(0, 1fr)',
        gridTemplateRows: 'auto auto minmax(0, 1fr)',
        height: { md: '100dvh' },
        minHeight: '100dvh',
        overflow: { md: 'hidden' },
        // Today's run on base.800; the sea-level-rise runs ease into base.900.
        bgcolor: state.climate === 'slr' ? 'base.900' : 'base.800',
        transition: 'background-color 600ms ease',
      }}
    >
      <TableTabs current={team} />

      {/* What is on screen, in one glance from the back row, and the host's opening words. */}
      <Stack
        spacing={jtSpacing.gap.sm}
        sx={(theme) => ({ px: theme.jtSpacing.page.x, pt: theme.jtSpacing.component.sm })}
      >
        {/* The tab bar names the table on screen; this names it for screen readers. */}
        <Typography
          variant="h1"
          sx={{
            position: 'absolute',
            width: '1px',
            height: '1px',
            overflow: 'hidden',
            clip: 'rect(0 0 0 0)',
            whiteSpace: 'nowrap',
          }}
        >
          {name} breakout table
        </Typography>
        <Sentence state={state} />
        <HostIntro team={team} />
      </Stack>

      {/* Controls on the left, the answer on the right. */}
      <Box
        sx={(theme) => ({
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '300px minmax(0, 1fr)' },
          gap: theme.jtSpacing.gap.lg,
          alignItems: { xs: 'start', md: 'stretch' },
          minHeight: 0,
          px: theme.jtSpacing.page.x,
          py: theme.jtSpacing.component.md,
        })}
      >
        <Rail state={state} />
        <Box
          sx={{
            ...evaluationCardSx,
            minWidth: 0,
            minHeight: 0,
            display: 'grid',
            // The view switch and legend share one line; the result takes the rest
            // of the height and is drawn to fit it, never scrolling.
            gridTemplateColumns: 'minmax(0, 1fr)',
            gridTemplateRows: 'auto minmax(0, 1fr)',
            gap: jtSpacing.gap.md,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: jtSpacing.gap.md,
              flexWrap: { xs: 'wrap', md: 'nowrap' },
            }}
          >
            {/* The view switch leads the row; the legend for that view follows it. */}
            <ViewSwitch state={state} canMap={canMap} view={view} />
            <LegendBar state={state} view={view} />
          </Box>
          <Box
            role="region"
            aria-label={`Result as a ${view}`}
            sx={{ minHeight: { xs: 480, md: 0 }, overflow: 'hidden' }}
          >
            {view === 'map' ? (
              <Maps state={state} team={team} />
            ) : view === 'chart' ? (
              <Charts state={state} />
            ) : (
              <Matrix state={state} onInspect={setInspect} />
            )}
          </Box>
        </Box>
      </Box>

      {SHOW_PINS && <Pins state={state} name={name} />}
      <CellDetail coords={inspect} onClose={() => setInspect(null)} />
    </Box>
  )
}

/** The data-state sentence, set large: the audience's anchor. */
function Sentence({ state }: { state: Breakout }) {
  const n = state.scenarios.length
  const names = state.selectedNodes.map((node) => node.label)
  const placeLabel =
    state.place === ANY ? null : state.placeFacets.find((f) => f.key === state.place)?.label
  const periodLabel =
    state.period === ANY ? null : state.periodFacets.find((f) => f.key === state.period)?.label
  const em = (text: ReactNode) => (
    <Box component="strong" sx={{ color: 'common.white' }}>
      {text}
    </Box>
  )
  return (
    <Typography variant="bodyLarge" component="p" sx={{ color: 'base.100' }}>
      {state.reading === 'change' ? 'Difference from Business as Usual for ' : 'Comparing '}
      {em(n === 6 ? 'all six scenarios' : `${n} scenario${n === 1 ? '' : 's'}`)}
      {state.climate === 'slr' && (
        <>
          {', '}
          {em('with sea level rise')}
          {', '}
        </>
      )}
      {' on '}
      {em(names.length <= 2 ? names.join(' and ') : `${names.length} measures`)}
      {placeLabel && (
        <>
          {' in '}
          {em(placeLabel)}
        </>
      )}
      {periodLabel && (
        <>
          {', '}
          {em(periodLabel)}
        </>
      )}
    </Typography>
  )
}

function HostIntro({ team }: { team: TeamKey }) {
  const intro = HOST_INTRO[team]
  if (intro)
    return (
      <Typography variant="body1" sx={{ color: 'base.50', maxWidth: '80ch' }}>
        {intro}
      </Typography>
    )
  return (
    <Box
      sx={{
        ...evaluationCardSx,
        p: jtSpacing.component.sm,
        borderStyle: 'dashed',
        borderColor: 'border.default',
        bgcolor: 'transparent',
        maxWidth: '80ch',
      }}
    >
      <Typography variant="caption" sx={{ color: 'base.300' }}>
        Opening paragraph for this table: {PLACEHOLDER}.
      </Typography>
    </Box>
  )
}

// ---------- the rail ----------

/** The controls, compact, scrolling inside the work area so they never push the page past one screen. */
function Rail({ state }: { state: Breakout }) {
  // A place that stands for everywhere: Delta-wide, or EJ's all 49 points.
  const wide = state.placeFacets.find((f) => /^delta-wide$/i.test(f.label) || f.key === 'all')
  // "Whole run" only where a row on screen has one; otherwise the first period is
  // what the rows show, so it is the one lit.
  const periodValue =
    state.period === ANY && !state.hasWholeRun ? (state.periodFacets[0]?.key ?? ANY) : state.period
  const placeValue = state.place === ANY && wide ? wide.key : state.place
  return (
    <Stack
      component="aside"
      aria-label="Table controls"
      spacing={jtSpacing.gap.lg}
      sx={{
        minHeight: 0,
        overflowY: { md: 'auto' },
        pr: { md: 1 },
        scrollbarWidth: 'thin',
      }}
    >
      {state.slrStatus && (
        <RailGroup title="Sea level">
          <Segmented<Climate>
            label="Sea level"
            tone="secondary"
            value={state.climate}
            onChange={state.setClimate}
            options={[
              { value: 'current', label: 'Current' },
              {
                value: 'slr',
                label: 'Sea level rise',
                disabled: state.slrStatus !== 'loaded',
              },
            ]}
          />
          {state.slrStatus !== 'loaded' && (
            <Typography variant="captionSmall" sx={{ color: 'base.300' }}>
              This team’s sea-level-rise runs are not loaded yet.
            </Typography>
          )}
        </RailGroup>
      )}

      <RailGroup
        title="Scenarios"
        action={
          // Everything that can be on is on: five while the baseline is locked, else six.
          state.scenarios.length < BREAKOUT_SCENARIOS.length - (state.baselineLocked ? 1 : 0)
            ? { label: 'All', onClick: state.setAllScenarios }
            : undefined
        }
      >
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0.75 }}>
          {BREAKOUT_SCENARIOS.map((key) => (
            <SetChip
              key={key}
              label={SCENARIO_NAME[key]}
              on={state.scenarios.includes(key)}
              onClick={() => state.toggleScenario(key)}
              disabled={state.baselineLocked && key === 'bau'}
            />
          ))}
        </Box>
        {state.baselineLocked && (
          <Typography variant="captionSmall" sx={{ color: 'base.200' }}>
            Business as Usual is the baseline every deviation is measured from, so it stays off
            while deviations are shown.
          </Typography>
        )}
      </RailGroup>

      <RailGroup title="SHOW">
        <Segmented
          label="Show"
          value={state.reading}
          onChange={state.setReading}
          options={[
            { value: 'level', label: 'Absolute values' },
            { value: 'change', label: 'Deviation from baseline' },
          ]}
        />
      </RailGroup>

      {state.placeFacets.length > 0 && (
        <RailGroup title="PLACES">
          <Segmented
            label="Place"
            value={placeValue}
            onChange={state.setPlace}
            columns={2}
            options={[
              ...(wide ? [] : [{ value: ANY, label: 'All together' }]),
              ...state.placeFacets.map((facet) => ({ value: facet.key, label: facet.label })),
            ]}
          />
        </RailGroup>
      )}

      {state.periodFacets.length > 0 && (
        <RailGroup title="TIME PERIODS">
          <Segmented
            label="Period"
            value={periodValue}
            onChange={state.setPeriod}
            columns={2}
            options={[
              ...(state.hasWholeRun
                ? [{ value: ANY, label: 'Whole run · Oct 2018 – Dec 2020' }]
                : []),
              ...state.periodFacets.map((facet) => ({ value: facet.key, label: facet.label })),
            ].map((option) => ({ ...option, disabled: state.view === 'chart' }))}
          />
          {state.view === 'chart' && (
            <Typography variant="captionSmall" sx={{ color: 'base.200' }}>
              Charts set every period side by side.
            </Typography>
          )}
        </RailGroup>
      )}

      <RailGroup title="METRICS">
        <Box sx={{ borderBottom: 1, borderColor: 'border.subtle' }}>
          <MeasureRow
            label={`${state.root.label}: the score`}
            on={state.nodes.includes(state.root.id)}
            onToggle={() => state.toggleNode(state.root.id)}
          />
          {state.metrics.map((metric) => (
            <MetricRows key={metric.id} metric={metric} state={state} />
          ))}
        </Box>
      </RailGroup>
    </Stack>
  )
}

/** A row in the rail: tick it to show it; open it to show what it is based on. */
function MetricRows({ metric, state }: { metric: CriterionNode; state: Breakout }) {
  const hasParts = !!metric.children?.length
  return (
    <MeasureRow
      label={metric.label}
      on={state.nodes.includes(metric.id)}
      onToggle={() => state.toggleNode(metric.id)}
      parts={
        hasParts
          ? {
              open: state.expanded.includes(metric.id),
              onToggle: () => {
                if (!state.nodes.includes(metric.id)) state.toggleNode(metric.id)
                state.toggleExpanded(metric.id)
              },
            }
          : undefined
      }
    />
  )
}

/** Table, chart or map: the rail's segmented tray, compact, with an icon apiece, leading the legend row. */
function ViewSwitch({ state, canMap, view }: { state: Breakout; canMap: boolean; view: View }) {
  const views: SegmentOption<View>[] = [
    { value: 'table', label: 'Table', icon: <TableRowsOutlinedIcon fontSize="small" /> },
    { value: 'chart', label: 'Chart', icon: <BarChartOutlinedIcon fontSize="small" /> },
    ...(canMap
      ? [{ value: 'map' as View, label: 'Map', icon: <MapOutlinedIcon fontSize="small" /> }]
      : []),
  ]
  return (
    <Box sx={{ flex: 'none' }}>
      <Segmented<View>
        label="View the result as"
        value={view}
        onChange={state.setView}
        options={views}
        dense
      />
    </Box>
  )
}

// ---------- the result ----------

/** What a cell shows: a published number, or the reason there is none. */
function read(
  node: CriterionNode,
  scenario: ScenarioKey,
  place: string,
  period: string,
  climate: Climate,
) {
  const cell = valueAt({ criterion: node.id, scenario, place, period, climate })
  // A row scored per species or per activity has no number of its own: its
  // entities carry the ranks, and the row says so.
  if (cell.value === null && node.entityNoun && Object.keys(node.values).length === 0)
    return { value: null as number | null, why: `per ${node.entityNoun}` }
  if (cell.value === null) {
    // Under sea level rise a scenario with no run at all is a different gap from a
    // number never scored: Calling on Reserves and A Tunnel were not run with it.
    // Ecology's SLR regions exist only for both years together, so a single year
    // there is a slice the run does not split, not a missing score.
    // A measure with no SLR result at all is a gap in the measure, not the scenario.
    const series = cell.node?.values[scenario]
    const anySlr = Object.keys(cell.node?.values ?? {}).length > 0
    const why =
      climate !== 'slr'
        ? series === undefined && Object.keys(cell.node?.values ?? {}).length > 0
          ? 'not run'
          : 'not scored'
        : !series
          ? anySlr
            ? 'not run with SLR'
            : 'no SLR result'
          : Object.keys(series).some((key) => key.startsWith(`${place}|`))
            ? 'both years only'
            : 'not scored'
    return { value: null as number | null, why }
  }
  if (cell.inferred) return { value: null as number | null, why: PLACEHOLDER }
  return { value: cell.value, why: '' }
}

/** A measure's unit, said once: the Show switch and the sentence say when it is a difference. */
function unitWord(node: CriterionNode): string {
  return node.unit === 'score'
    ? 'score, −5 to +5'
    : node.unit === 'share'
      ? 'proportion of days'
      : node.unit
}

/** Ranking scores sit on the −5…+5 scale; everything else is a detail beneath them. */
const isScore = (node: CriterionNode) => node.unit === 'score'

/** The selected measures in two groups, ranking scores first, each keeping its order. */
function splitRows(nodes: CriterionNode[]) {
  return { scores: nodes.filter(isScore), details: nodes.filter((node) => !isScore(node)) }
}

/** A difference in the row's own unit, with an explicit sign. */
function signed(value: number, unit: CriterionNode['unit']): string {
  const text = fmtValue(Math.abs(value), unit).replace(/^[+\-−]\s*/, '')
  return value === 0 ? '0' : `${value > 0 ? '+' : '−'}${text}`
}

/** One value as the Show switch asks for it: as published, or less Business as Usual. */
function pointAt(
  state: Breakout,
  node: CriterionNode,
  scenario: ScenarioKey,
  period: string,
): Point {
  const here = read(node, scenario, state.place, period, state.climate)
  if (state.reading !== 'change' || here.value === null) return { scenario, period, ...here }
  const base = read(node, 'bau', state.place, period, state.climate)
  if (base.value === null) return { scenario, period, value: null, why: 'no baseline' }
  return { scenario, period, value: here.value - base.value, why: '' }
}

/** A heading across the result that says which kind of row follows, with an optional note. */
function SectionLabel({ children, aside }: { children: ReactNode; aside?: string }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        columnGap: jtSpacing.gap.md,
        rowGap: 0.25,
        pb: 0.5,
        borderBottom: 1,
        borderColor: 'border.subtle',
      }}
    >
      <Typography variant="chartTitle" component="h3" sx={{ color: 'base.100' }} noWrap>
        {children}
      </Typography>
      {aside && (
        <Typography variant="captionSmall" sx={{ color: 'base.200', minWidth: 0 }}>
          {aside}
        </Typography>
      )}
    </Box>
  )
}

/** The key to the short scenario codes on the chart axes. */
const CODE_KEY = BREAKOUT_SCENARIOS.map(
  (key) => `${SCENARIO_SHORT[key]} ${SCENARIO_NAME[key]}`,
).join(' · ')

const RANKING_HEADING = 'Ranking scores · −5 to +5'

/**
 * A row label: two lines where rows have room for them, one line in a long table,
 * where a second line would be cut through. Either way it ends in an ellipsis.
 */
const labelLines = (lines: 1 | 2) =>
  ({
    display: '-webkit-box',
    WebkitLineClamp: lines,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  }) as const

/**
 * The legend for whichever view is open, after the view switch. A difference is
 * drawn in the same colours as a value, so one key serves both readings.
 */
function LegendBar({ state, view }: { state: Breakout; view: View }) {
  const theme = useTheme()
  const diff = state.reading === 'change'
  const { scores, details } = splitRows(state.selectedNodes)
  const shared = view === 'chart' ? chartModel(state).shared : null
  const item = (key: string, label: string, body: ReactNode) => (
    <Box
      key={key}
      sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flex: 'none', whiteSpace: 'nowrap' }}
    >
      {label && (
        <Typography variant="chartLabel" sx={{ color: 'base.100' }}>
          {label}
        </Typography>
      )}
      {body}
    </Box>
  )
  const caption = (text: string) => <Typography variant="captionSmall">{text}</Typography>
  const steps = [-5, -3, -1, 0, 1, 3, 5]
  const largest = `${diff ? 'largest change' : 'largest'} ${view === 'map' ? 'on map' : 'in row'}`
  return (
    <Box
      sx={{
        flex: '1 1 auto',
        minWidth: 0,
        display: 'flex',
        flexWrap: { xs: 'wrap', md: 'nowrap' },
        overflow: 'hidden',
        alignItems: 'center',
        columnGap: 2.5,
        rowGap: 0.75,
      }}
    >
      {scores.length > 0 &&
        view !== 'chart' &&
        item(
          'scores',
          'Scores',
          <>
            {caption('−5')}
            {steps.map((step) => (
              <Swatch key={step} tone={cellFill(step)} />
            ))}
            {caption('+5')}
          </>,
        )}
      {details.length > 0 &&
        view !== 'chart' &&
        item(
          'details',
          'Details',
          <>
            {caption('0')}
            {[0.2, 0.4, 0.6, 0.8, 1].map((step) => (
              <Swatch
                key={step}
                tone={theme.palette.salinity.teal}
                opacity={0.12 + step * (view === 'map' ? 0.88 : 0.5)}
              />
            ))}
            {caption(largest)}
          </>,
        )}
      {shared &&
        item(
          'bars',
          'Bars',
          <>
            {shared.map((group, i) => (
              <Box key={group.key} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Swatch tone={periodShade(theme, i)} />
                {caption(group.label)}
              </Box>
            ))}
          </>,
        )}
      {item(
        'empty',
        '',
        <>
          <Swatch dashed />
          {caption('no value')}
        </>,
      )}
      {state.scenarios.length < BREAKOUT_SCENARIOS.length &&
        item(
          'faded',
          '',
          <>
            <Box component="span" sx={{ opacity: FADED }}>
              <Swatch tone={theme.palette.base[50]} />
            </Box>
            {caption('scenario switched off')}
          </>,
        )}
    </Box>
  )
}

/** A score as text with an explicit sign: "+2", "−1", "0". */
const scoreText = (value: number) => (value > 0 ? `+${value}` : value < 0 ? `−${-value}` : '0')

/**
 * The table, fitted to the card. Ranking scores are the rows; one opens into the
 * entities it is based on, nested beneath it in their own units, each entity's own
 * rank beside its value where it has one. Every row shares the height there is.
 */
function Matrix({ state, onInspect }: { state: Breakout; onInspect: (coords: Coords) => void }) {
  const diff = state.reading === 'change'
  const active = state.scenarios
  const rows = state.rows.map((row) => {
    const cells = BREAKOUT_SCENARIOS.map((scenario) => {
      const point = pointAt(state, row.node, scenario, state.period)
      const coords = {
        criterion: row.node.id,
        scenario,
        place: state.place,
        period: state.period,
        climate: state.climate,
      }
      // A row scored per entity summarises its entities' ranks in the cell.
      const entityRanks =
        point.value === null && row.node.entityNoun
          ? (row.node.children ?? [])
              .map((child) => rankAt({ ...coords, criterion: child.id }))
              .filter((rank): rank is number => rank !== null)
          : []
      const summary =
        entityRanks.length > 0
          ? Math.min(...entityRanks) === Math.max(...entityRanks)
            ? `all ${scoreText(entityRanks[0])}`
            : `${scoreText(Math.min(...entityRanks))} to ${scoreText(Math.max(...entityRanks))}`
          : undefined
      return { ...point, rank: row.depth === 1 ? rankAt(coords) : null, summary }
    })
    const max = Math.max(0.000001, ...cells.map((c) => Math.abs(c.value ?? 0)))
    return { ...row, cells, max }
  })
  const anyPlaceholder = rows.some((row) => row.cells.some((c) => c.why === PLACEHOLDER))
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
  const spare = Math.max(0, DENSEST_TABLE_ROWS - rows.length)
  // At that density a row is too short for a two-line label.
  const lines = Math.max(rows.length, DENSEST_TABLE_ROWS) > 9 ? 1 : 2
  const template = [
    'auto',
    'auto',
    ...rows.map(() => 'minmax(0, 1fr)'),
    ...(spare > 0 ? [`minmax(0, ${spare}fr)`] : []),
    'auto',
  ].join(' ')

  return (
    <Box
      sx={{
        height: 1,
        display: 'grid',
        gridTemplateColumns: `minmax(0, 2.2fr) repeat(${BREAKOUT_SCENARIOS.length}, minmax(0, 1fr))`,
        gridTemplateRows: template,
        columnGap: 1,
        // Spacing lives inside each row, so a table's gaps do not depend on its row count.
        rowGap: 0,
      }}
    >
      <Box />
      {BREAKOUT_SCENARIOS.map((scenario) => (
        <Typography
          key={scenario}
          variant="chartTitle"
          sx={{
            alignSelf: 'end',
            opacity: active.includes(scenario) ? 1 : FADED,
            transition: 'opacity 200ms ease',
          }}
        >
          {SCENARIO_NAME[scenario]}
        </Typography>
      ))}
      <Box sx={{ gridColumn: '1 / -1', pt: 0.75, pb: 0.375 }}>
        <SectionLabel>{RANKING_HEADING}</SectionLabel>
      </Box>
      {rows.map(({ node, depth, open, cells, max }, rowIndex) => {
        const ranked = node.unit === 'score'
        const canOpen = depth === 0 && node.level !== 'team' && !!node.children?.length
        return (
          <Box key={node.id} sx={{ display: 'contents' }}>
            {/* A ranking score in the heading face, with its opener; an entity carries its unit. */}
            <MotionBox
              {...motionFor(depth, order[rowIndex])}
              sx={{
                minHeight: 0,
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                py: 0.375,
                pl: depth === 1 ? 3.5 : 0,
              }}
            >
              {depth === 0 && (
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
                  <Typography
                    variant="chartTitle"
                    component="p"
                    title={node.label}
                    sx={labelLines(lines)}
                  >
                    {node.level === 'team' ? `${node.label}: the score` : node.label}
                  </Typography>
                ) : (
                  <>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
                      <Typography
                        variant="body1"
                        title={node.label}
                        sx={{ ...labelLines(lines), color: depth === 1 ? 'base.50' : 'base.100' }}
                      >
                        {lifeStage(node.label).name}
                      </Typography>
                      {lifeStage(node.label).stage && (
                        <StageChip label={capitalise(lifeStage(node.label).stage!)} plain />
                      )}
                    </Box>
                    {lines === 2 && (
                      <Typography variant="body2" component="p" sx={{ color: 'base.300' }} noWrap>
                        {unitWord(node)}
                      </Typography>
                    )}
                  </>
                )}
              </Box>
            </MotionBox>
            {cells.map((cell) => (
              <MotionBox
                key={cell.scenario}
                {...motionFor(depth, order[rowIndex], active.includes(cell.scenario) ? 1 : FADED)}
                sx={{ minHeight: 0, display: 'grid', py: 0.375 }}
              >
                <Cell
                  value={cell.value}
                  why={cell.why}
                  summary={cell.summary}
                  rank={cell.rank}
                  unit={node.unit}
                  score={ranked}
                  strength={cell.value === null ? 0 : Math.abs(cell.value) / max}
                  signedText={diff}
                  onClick={
                    cell.value !== null && !diff
                      ? () =>
                          onInspect({
                            criterion: node.id,
                            scenario: cell.scenario,
                            place: state.place,
                            period: state.period,
                            climate: state.climate,
                          })
                      : undefined
                  }
                />
              </MotionBox>
            ))}
          </Box>
        )
      })}
      {spare > 0 && <Box aria-hidden sx={{ gridColumn: '1 / -1' }} />}
      <Typography
        variant="captionSmall"
        noWrap
        sx={{ gridColumn: '1 / -1', color: 'base.200', pt: 0.5 }}
      >
        Open a score to see what it is based on. Click a number for its source.
        {anyPlaceholder && ` “${PLACEHOLDER}” marks a number the team has not published yet.`}
        {state.climate === 'slr' &&
          ' These are the sea-level-rise runs, compared with their own Business as Usual.'}
      </Typography>
    </Box>
  )
}

/**
 * One cell. A score takes the −5…+5 palette at its value, whether that value is the
 * score or its difference from Business as Usual; an entity's value is teal by its
 * size against the row's largest, with its own rank as a badge where it has one. A
 * row scored per entity shows the range of its entities' ranks instead.
 */
function Cell({
  value,
  why,
  summary,
  rank,
  unit,
  score,
  strength,
  signedText,
  onClick,
}: {
  value: number | null
  why: string
  summary?: string
  rank?: number | null
  unit: CriterionNode['unit']
  score: boolean
  strength: number
  signedText: boolean
  onClick?: () => void
}) {
  const empty = value === null
  const fill = empty || !score ? undefined : cellFill(value)
  // A detail at zero (no acres, no change) is background, so it recedes.
  const quiet = !empty && !score && value === 0
  return (
    <ButtonBase
      disabled={!onClick}
      onClick={onClick}
      sx={{
        position: 'relative',
        justifyContent: 'space-between',
        gap: 0.5,
        height: 1,
        minHeight: 0,
        px: 1.25,
        borderRadius: 0.6,
        border: empty && !summary ? 1 : 0,
        borderStyle: 'dashed',
        borderColor: 'border.default',
        bgcolor: fill ?? (summary || quiet ? 'translucent.100' : 'transparent'),
        color: (empty && !summary) || quiet ? 'base.300' : fill ? 'common.white' : 'base.50',
        overflow: 'hidden',
        '&.Mui-focusVisible': focusRing,
      }}
    >
      {!empty && !fill && !quiet && (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            bgcolor: 'salinity.teal',
            opacity: 0.12 + strength * 0.5,
          }}
        />
      )}
      <Typography
        variant={score && !empty ? 'chartValueLarge' : 'body2'}
        noWrap
        sx={{ position: 'relative', color: 'inherit' }}
      >
        {empty
          ? (summary ?? why)
          : signedText && unit !== 'score'
            ? signed(value, unit)
            : fmtValue(value, unit)}
      </Typography>
      {rank !== null && rank !== undefined && (
        <Box
          component="span"
          title={`Rank ${scoreText(rank)}`}
          sx={{
            position: 'relative',
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
      )}
    </ButtonBase>
  )
}

/** A measure's title over its map: a ranking score in the heading face, a detail with its unit. */
function MeasureHeading({ node }: { node: CriterionNode }) {
  if (isScore(node))
    return (
      <Typography variant="chartTitle" component="h3" noWrap>
        {node.level === 'team' ? `${node.label}: the score` : node.label}
      </Typography>
    )
  return (
    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: jtSpacing.gap.sm, minWidth: 0 }}>
      <Typography variant="body1" component="h3" sx={{ color: 'common.white' }} noWrap>
        {node.label}
      </Typography>
      <Typography variant="body2" sx={{ color: 'base.300' }} noWrap>
        {unitWord(node)}
      </Typography>
    </Box>
  )
}

/** Every chart's periods and points, and the periods the legend can show for all of them. */
function chartModel(state: Breakout) {
  const build = (node: CriterionNode) => {
    // A chart sets every period side by side, whichever one the rail has picked.
    const groups = periodGroups(node, ANY, (key) =>
      BREAKOUT_SCENARIOS.some(
        (scenario) => read(node, scenario, state.place, key, state.climate).value !== null,
      ),
    )
    const points = BREAKOUT_SCENARIOS.flatMap((scenario) =>
      groups.map((group) => pointAt(state, node, scenario, group.key)),
    )
    return { node, groups, points }
  }
  // Scores with a number of their own get a chart each; a row scored per entity
  // has none, so its open entities speak for it in the matrix below.
  const scores = state.rows.filter(
    (row) => row.depth === 0 && isScore(row.node) && Object.keys(row.node.values).length > 0,
  )
  const details = state.rows.filter((row) => row.depth === 1 || !isScore(row.node))
  const scoreCharts = scores.map((row) => build(row.node))
  const detailRows = details.map((row) => build(row.node))
  const grouped = [...scoreCharts, ...detailRows].filter((m) => m.groups.length > 1)
  const labels = (groups: Facet[]) => groups.map((g) => g.label).join('|')
  // One key in the legend when every grouped chart splits the same way; else each its own.
  const shared =
    grouped.length > 0 && grouped.every((m) => labels(m.groups) === labels(grouped[0].groups))
      ? grouped[0].groups
      : null
  return { scoreCharts, detailRows, shared }
}

/**
 * Ranking scores first, packed side by side for the overview; then the details as
 * rows of small bars under the same six columns. The two share the card's height
 * in proportion to how much each has to show.
 */
function Charts({ state }: { state: Breakout }) {
  const { scoreCharts, detailRows, shared } = chartModel(state)
  const scoreWeight = scoreCharts.length > 0 ? 2 + Math.ceil(scoreCharts.length / 3) * 2 : 0
  const detailWeight = detailRows.length > 0 ? 2 + detailRows.length : 0
  const template = [
    ...(scoreWeight ? ['auto', `minmax(0, ${scoreWeight}fr)`] : []),
    ...(detailWeight ? ['auto', `minmax(0, ${detailWeight}fr)`] : []),
  ].join(' ')
  return (
    <Box sx={{ height: 1, display: 'grid', gridTemplateRows: template, rowGap: 1 }}>
      {scoreCharts.length > 0 && <SectionLabel aside={CODE_KEY}>{RANKING_HEADING}</SectionLabel>}
      {scoreCharts.length > 0 && (
        <ScoreGrid charts={scoreCharts} active={state.scenarios} showKeys={!shared} />
      )}
      {detailRows.length > 0 && <SectionLabel>Details</SectionLabel>}
      {detailRows.length > 0 && (
        <DetailMatrix
          rows={detailRows.map((row) => ({ ...row, unitLabel: unitWord(row.node) }))}
          active={state.scenarios}
          diff={state.reading === 'change'}
          showKeys={!shared}
        />
      )}
    </Box>
  )
}

/** One row of six maps per measure, every row sharing the card's height. */
/** "Longfin smelt, juvenile" → the species and its life stage; other labels pass through. */
function lifeStage(label: string): { name: string; stage?: string } {
  const match = /^(.*), (juvenile|adult)$/i.exec(label)
  return match ? { name: match[1], stage: match[2].toLowerCase() } : { name: label }
}

const capitalise = (text: string) => text.charAt(0).toUpperCase() + text.slice(1)

/**
 * Outline name → place key, per team. The shared keys, plus EJ: on this page its
 * places are the three vulnerability classes, which are exactly its outlines.
 */
const MAP_REGION_KEY: Partial<Record<TeamKey, Record<string, string>>> = {
  ...REGION_DATA_KEY,
  environmentalJustice: { Moderate: 'moderate', High: 'high', Highest: 'highest' },
}

/**
 * Every measure the map can draw, with the score it sits under. A score held only
 * per entity has nothing of its own to map, so its entities stand in for it, open
 * or closed.
 */
function mapItems(state: Breakout, team: TeamKey) {
  if (!MAP_REGION_KEY[team]) return []
  const mapped = (node: CriterionNode) =>
    node.places[0]?.key !== ANY &&
    Object.keys(inClimate(node, state.climate).values).some((key) => !key.startsWith(`${ANY}|`))
  const entityOnly = (node?: CriterionNode) =>
    !!node?.entityNoun && Object.keys(node.values).length === 0
  const rows = state.rows
  return rows.flatMap((row, index) => {
    const node = row.node
    if (row.depth === 1) {
      // An open part of a score with numbers of its own; an entity-only score's
      // entities are already in, from the score's own row.
      const parent = rows.slice(0, index).findLast((r) => r.depth === 0)?.node
      return !entityOnly(parent) && mapped(node) ? [{ node, parent }] : []
    }
    if (entityOnly(node))
      return (node.children ?? []).filter(mapped).map((child) => ({ node: child, parent: node }))
    return mapped(node) ? [{ node, parent: undefined as CriterionNode | undefined }] : []
  })
}

function Maps({ state, team }: { state: Breakout; team: TeamKey }) {
  const keys = MAP_REGION_KEY[team] ?? {}
  const items = mapItems(state, team)
  // A species' life stages share one tab and are picked by chip.
  // Grouped under their score too: salinity and temperature share activity names.
  const groups = items.reduce<{ key: string; name: string; items: typeof items }[]>((out, item) => {
    const { name } = lifeStage(item.node.label)
    const key = `${item.parent?.id ?? ''}|${name}`
    const group = out.find((g) => g.key === key)
    if (group) group.items.push(item)
    else out.push({ key, name, items: [item] })
    return out
  }, [])
  // Tabs from more than one score say which score each belongs to.
  const manyScores = new Set(items.map((item) => item.parent?.id)).size > 1
  const [picked, setPicked] = useState<string | null>(null)
  const active = items.find((item) => item.node.id === picked) ?? items[0]
  const dimmed = BREAKOUT_SCENARIOS.filter((scenario) => !state.scenarios.includes(scenario))
  if (!active) return null
  const { node } = active
  const groupIndex = groups.findIndex((g) => g.items.includes(active))
  const stage = lifeStage(node.label).stage
  /** Open another species on the life stage already showing, where it has one. */
  const openGroup = (index: number) => {
    const next = groups[index].items
    setPicked((next.find((i) => lifeStage(i.node.label).stage === stage) ?? next[0]).node.id)
  }
  // One measure's six maps at a time; the rest wait behind their tabs.
  return (
    <Box
      sx={{
        height: 1,
        display: 'grid',
        gridTemplateRows: items.length > 1 ? 'auto auto minmax(0, 1fr)' : 'auto minmax(0, 1fr)',
        rowGap: 1,
        // Room for the outlines of the maps.
        pb: 0.75,
      }}
    >
      {groups.length > 1 && (
        <Tabs
          value={groupIndex}
          onChange={(_, next: number) => openGroup(next)}
          variant="scrollable"
          allowScrollButtonsMobile
          aria-label="Mapped measures"
        >
          {groups.map((g, index) => (
            <Tab
              key={g.key}
              id={`map-tab-${index}`}
              aria-controls="map-panel"
              label={
                <Box
                  component="span"
                  sx={{ display: 'flex', alignItems: 'center', gap: jtSpacing.gap.xs }}
                >
                  {manyScores && g.items[0].parent
                    ? `${g.items[0].parent.label}: ${g.name}`
                    : g.name}
                  {/* A species' life stages ride in its tab; a stage opens that tab on it. */}
                  {lifeStage(g.items[0].node.label).stage &&
                    g.items.map((item) => (
                      <Box
                        key={item.node.id}
                        component="span"
                        onClick={(event) => {
                          event.stopPropagation()
                          setPicked(item.node.id)
                        }}
                        sx={{ display: 'inline-flex', cursor: 'pointer' }}
                      >
                        <StageChip
                          label={capitalise(lifeStage(item.node.label).stage ?? item.node.label)}
                          on={item === active}
                        />
                      </Box>
                    ))}
                </Box>
              }
            />
          ))}
        </Tabs>
      )}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: jtSpacing.gap.sm, minWidth: 0 }}>
        {active.parent && (
          <Typography variant="chartTitle" component="p" noWrap sx={{ flex: 'none' }}>
            {active.parent.label}
          </Typography>
        )}
        <MeasureHeading node={node} />
      </Box>
      <Box
        id="map-panel"
        role={groups.length > 1 ? 'tabpanel' : undefined}
        aria-labelledby={groups.length > 1 ? `map-tab-${groupIndex}` : undefined}
        sx={{ minHeight: 0, display: 'grid' }}
      >
        <RegionValues
          key={node.id}
          team={team}
          scenarios={BREAKOUT_SCENARIOS}
          dimmed={dimmed}
          reading={state.reading}
          sameStyleForChange
          hideLegend
          fit
          coordsFor={(region, scenario) =>
            keys[region]
              ? {
                  criterion: node.id,
                  scenario,
                  place: keys[region],
                  period: state.period,
                  climate: state.climate,
                }
              : null
          }
          unitLabel={unitWord(node)}
          hideInferred
          showValues
        />
      </Box>
    </Box>
  )
}

// ---------- pins ----------

function Pins({ state, name }: { state: Breakout; name: string }) {
  const [note, setNote] = useState('')
  const exportNotes = () => {
    const lines = [`# ${name} table`, '', ...state.pins.flatMap((p) => pinToMarkdown(p, state))]
    const blob = new Blob([lines.join('\n')], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${name.toLowerCase().replace(/\W+/g, '-')}-table-notes.md`
    a.click()
    URL.revokeObjectURL(url)
  }
  return (
    <Box
      component="section"
      aria-label="Pinned views"
      sx={(theme) => ({
        px: theme.jtSpacing.page.x,
        py: theme.jtSpacing.section.xs,
        bgcolor: 'base.700',
        borderTop: 1,
        borderColor: 'border.subtle',
      })}
    >
      <Stack spacing={jtSpacing.gap.md}>
        {/* Write a note, pin the view; export the lot for the report-out. */}
        <Box
          sx={{ display: 'flex', gap: jtSpacing.gap.sm, flexWrap: 'wrap', alignItems: 'center' }}
        >
          <TextField
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="What the table said about this view"
            label="Note for the pinned view"
            size="small"
            sx={{ flex: '1 1 320px' }}
          />
          <Button
            variant="contained"
            startIcon={<PushPinIcon />}
            onClick={() => {
              state.pin(note)
              setNote('')
            }}
          >
            Pin this view
          </Button>
          {state.pins.length > 0 && (
            <Button variant="outlined" startIcon={<DownloadIcon />} onClick={exportNotes}>
              Export {state.pins.length} pinned
            </Button>
          )}
          {state.pins.length > 0 && (
            <Button variant="text" onClick={state.clearPins}>
              Clear
            </Button>
          )}
        </Box>
        {state.pins.length > 0 && (
          <Box sx={{ display: 'flex', gap: jtSpacing.gap.xs, flexWrap: 'wrap' }}>
            {state.pins.map((p, i) => (
              <Chip
                key={p.id}
                variant="outlined"
                label={`${i + 1}. ${p.note || summarise(p, state)}`}
                onClick={() => state.restore(p)}
                onDelete={() => state.unpin(p.id)}
                sx={{ typography: 'meta', borderColor: 'border.strong', maxWidth: '100%' }}
              />
            ))}
          </Box>
        )}
      </Stack>
    </Box>
  )
}

function summarise(p: Pin, state: Breakout): string {
  const place =
    p.place === ANY
      ? ''
      : ` in ${state.placeFacets.find((f) => f.key === p.place)?.label ?? p.place}`
  const period =
    p.period === ANY
      ? ''
      : `, ${state.periodFacets.find((f) => f.key === p.period)?.label ?? p.period}`
  const climate = p.climate === 'slr' ? ', with sea level rise' : ''
  return `${p.scenarios.length} scenarios on ${p.nodes.length} measure${p.nodes.length === 1 ? '' : 's'}${place}${period}${climate}`
}

function pinToMarkdown(p: Pin, state: Breakout): string[] {
  const how = p.view === 'map' ? ' (on the map)' : p.view === 'chart' ? ' (as a chart)' : ''
  const head = `## ${summarise(p, state)}${how}`
  const lines = [head, '', p.note ? `> ${p.note}` : '', '']
  const header = ['measure', ...p.scenarios.map((s) => SCENARIO_NAME[s])]
  lines.push(`| ${header.join(' | ')} |`, `| ${header.map(() => '---').join(' | ')} |`)
  for (const id of p.nodes) {
    const node =
      state.selectedNodes.find((n) => n.id === id) ?? state.metrics.find((n) => n.id === id)
    if (!node) continue
    const cells = p.scenarios.map((s) => {
      const r = read(node, s, p.place, p.period, p.climate ?? 'current')
      return r.value === null ? r.why : fmtValue(r.value, node.unit)
    })
    lines.push(`| ${node.label} | ${cells.join(' | ')} |`)
  }
  lines.push('')
  return lines
}
