// A breakout table: one subteam hosts, the public asks, the screen answers.
//
// This is 4C's data model behind a different shell. The host starts on their own
// criterion with every scenario showing, and has four moves: pick scenarios, pick
// a place, pick a period, open a metric into its parts; and two ways to look,
// table or map. Everything is set large for a projector, and every number
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
// details beneath them.
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import DownloadIcon from '@mui/icons-material/Download'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import MapOutlinedIcon from '@mui/icons-material/MapOutlined'
import PushPinIcon from '@mui/icons-material/PushPin'
import TableRowsOutlinedIcon from '@mui/icons-material/TableRowsOutlined'
import {
  Box,
  Button,
  ButtonBase,
  Chip,
  IconButton,
  Popover,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material'
import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { evaluationCardSx } from '../../../features/scenarios/evaluation/styles'
import { jtSpacing, navigation } from '../../../theme'
import { TEAMS, cellFill } from '../data'
import type { TeamKey } from '../data'
import { CellDetail } from '../drilldown/CellDetail'
import { rankAt, valueAt } from '../drilldown/cellValue'
import type { Coords } from '../drilldown/cellValue'
import { ANY, SCENARIO_NAME, fmtValue, inClimate } from '../drilldown/model'
import type { Climate, CriterionNode, ScenarioKey } from '../drilldown/model'
import { RegionValues } from '../subteams/RegionValues'
import type { MapScale } from '../subteams/RegionValues'
import { REGION_DATA_KEY } from '../subteams/regionKeys'
import { Swatch } from '../subteams/SubteamFrame'
import { FADED, relaxedExtent } from './chartKit'
import type { Point } from './chartKit'
import { MeasureRow, RailGroup, Segmented, SetChip, StageChip, TableTabs } from './controls'
import type { SegmentOption } from './controls'
import { RANKING_DEFINITIONS, UI } from './labels'
import { focusRing, pageX } from './styles'
import { useElementSize } from './useElementSize'
import { BREAKOUT_SCENARIOS, DENSEST_TABLE_ROWS, ENTITY_ROW, useBreakout } from './useBreakout'
import type { Breakout, Pin, View } from './useBreakout'

const TEAM_KEYS = TEAMS.map((team) => team.key)

/**
 * One paragraph from each subteam to open its table with. Left empty until the
 * team writes it; the page shows a placeholder so the gap is visible at rehearsal.
 */
const HOST_INTRO: Partial<Record<TeamKey, string>> = {}

const PLACEHOLDER = UI.awaiting

/** A Box that Motion can animate: the table's label and cells. */
const MotionBox = motion.create(Box)

/** The table's easing: quick out of the gate, gentle to rest. */
const EASE = [0.2, 0, 0, 1] as const

/**
 * The pin bar (note, pin, export) is hidden for now so the table fits one screen.
 * Pins already saved stay in localStorage and come back when this is turned on.
 */
const SHOW_PINS = false

/** The one breakout page: every team's table behind the tab bar, the team in `?team=`. */
export default function BreakoutPage() {
  return <BreakoutTable />
}

export function BreakoutTable({ embedded = false }: { embedded?: boolean }) {
  const [params] = useSearchParams()
  const param = params.get('team')
  const team = TEAM_KEYS.includes(param as TeamKey) ? (param as TeamKey) : TEAM_KEYS[0]
  return (
    <Box
      component={embedded ? 'section' : 'main'}
      aria-label={embedded ? 'Performance by criterion' : undefined}
      sx={{ minHeight: embedded ? 0 : '100dvh', bgcolor: 'base.800', color: 'common.white' }}
    >
      <Table team={team} key={team} embedded={embedded} />
    </Box>
  )
}

function Table({ team, embedded }: { team: TeamKey; embedded: boolean }) {
  const state = useBreakout(team)
  const name = TEAMS.find((entry) => entry.key === team)?.name ?? ''
  const [inspect, setInspect] = useState<Coords | null>(null)
  const canMap = mapItems(state, team).length > 0
  // The map's colour ends, heard from the map so the one legend can give them.
  const [mapScale, setMapScale] = useState<MapScale | null>(null)
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
        height: { md: embedded ? 'calc(100dvh - 58px)' : '100dvh' },
        minHeight: embedded ? { xs: 'auto', md: 'calc(100dvh - 58px)' } : '100dvh',
        overflow: { md: embedded ? 'visible' : 'hidden' },
        // Today's run on base.800; the sea-level-rise runs ease into base.900.
        bgcolor: state.climate === 'slr' ? 'base.900' : 'base.800',
        transition: 'background-color 600ms ease',
      }}
    >
      <TableTabs
        current={team}
        pathname={embedded ? '/scenarios/ranking/by-criterion' : '/pages/breakout'}
        stickyTop={embedded ? navigation.barHeight : 0}
      />

      {/* What is on screen, in one glance from the back row, and the host's opening words. */}
      <Stack
        spacing={jtSpacing.gap.sm}
        sx={(theme) => ({ px: pageX, pt: theme.jtSpacing.component.sm })}
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
          gridTemplateColumns: {
            xs: '1fr',
            md: '240px minmax(0, 1fr)',
            xl: '300px minmax(0, 1fr)',
          },
          gap: theme.jtSpacing.gap.lg,
          alignItems: { xs: 'start', md: 'stretch' },
          minHeight: 0,
          px: pageX,
          py: theme.jtSpacing.component.md,
        })}
      >
        <Rail state={state} places={!NO_PLACES.includes(team)} />
        <Box
          sx={{
            ...evaluationCardSx,
            // Tighter on a laptop, where the table needs the width.
            p: { md: 1.5, xl: 2.5 },
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
            {/* The view switch leads the row, where there is a map to switch to; the
                legend for that view follows it. */}
            {canMap && <ViewSwitch state={state} view={view} />}
            <LegendBar state={state} view={view} mapScale={mapScale} />
          </Box>
          <Box
            role="region"
            aria-label={`Result as a ${view}`}
            sx={{ minHeight: { xs: 480, md: 0 }, overflow: 'hidden' }}
          >
            {view === 'map' ? (
              <Maps state={state} team={team} onScale={setMapScale} />
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
      {state.reading === 'change' ? UI.comparingChange : UI.comparing}
      {em(n === 6 ? UI.allScenarios : `${n} scenario${n === 1 ? '' : 's'}`)}
      {state.climate === 'slr' && (
        <>
          {', '}
          {em(UI.withSeaLevelRise)}
          {', '}
        </>
      )}
      {' on '}
      {em(names.length <= 2 ? names.join(' and ') : `${names.length} metrics`)}
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
        {UI.openingPlaceholder}
      </Typography>
    </Box>
  )
}

// ---------- the rail ----------

/** The controls, compact, scrolling inside the work area so they never push the page past one screen. */
/**
 * Teams whose rail offers no place to pick: Eco-cultural's In-Delta / upper
 * watershed split is a note on restored acres, not a place to filter the table by.
 */
const NO_PLACES: TeamKey[] = ['ecoCultural']

function Rail({ state, places }: { state: Breakout; places: boolean }) {
  // A place that stands for everywhere: Delta-wide, or EJ's all 49 points.
  const wide = state.placeFacets.find((f) => /^delta-wide$/i.test(f.label) || f.key === 'all')
  // "Whole run" only where a row on screen has one; otherwise the first period is
  // what the rows show, so it is the one lit.
  const periodValue =
    state.period === ANY && !state.hasWholeRun ? (state.periodFacets[0]?.key ?? ANY) : state.period
  const placeValue = state.place === ANY && wide ? wide.key : state.place
  // Places and periods are the team's own cuts of the data, so they wear its color.
  const teamColor = TEAMS.find((t) => t.key === state.root.team)?.color
  return (
    <Stack
      component="aside"
      aria-label="Table controls"
      spacing={jtSpacing.gap.lg}
      sx={{
        minHeight: 0,
        overflowY: { md: 'auto' },
        // It scrolls when it is longer than the screen, without a bar beside it.
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      {state.slrStatus && (
        <RailGroup title={UI.seaLevel}>
          <Segmented<Climate>
            label={UI.seaLevel}
            tone="secondary"
            value={state.climate}
            onChange={state.setClimate}
            options={[
              { value: 'current', label: UI.current },
              {
                value: 'slr',
                label: UI.seaLevelRise,
                disabled: state.slrStatus !== 'loaded',
              },
            ]}
          />
          {state.slrStatus !== 'loaded' && (
            <Typography variant="captionSmall" sx={{ color: 'base.300' }}>
              {UI.seaLevelNotLoaded}
            </Typography>
          )}
        </RailGroup>
      )}

      <RailGroup
        title={UI.scenarios}
        action={
          // Everything that can be on is on: five while the baseline is locked, else six.
          state.scenarios.length < BREAKOUT_SCENARIOS.length - (state.baselineLocked ? 1 : 0)
            ? { label: UI.allOn, onClick: state.setAllScenarios }
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
            {UI.baselineLocked}
          </Typography>
        )}
      </RailGroup>

      <RailGroup title={UI.show}>
        <Segmented
          label={UI.show}
          value={state.reading}
          onChange={state.setReading}
          options={[
            { value: 'level', label: UI.absoluteValues },
            { value: 'change', label: UI.deviation },
          ]}
        />
      </RailGroup>

      {places && state.placeFacets.length > 0 && (
        <RailGroup title={UI.places}>
          <Segmented
            label="Place"
            accent={teamColor}
            value={placeValue}
            onChange={state.setPlace}
            columns={2}
            options={[
              ...(wide ? [] : [{ value: ANY, label: UI.allPlaces }]),
              ...state.placeFacets.map((facet) => ({ value: facet.key, label: facet.label })),
            ]}
          />
        </RailGroup>
      )}

      {state.periodFacets.length > 0 && (
        <RailGroup title={UI.timePeriods}>
          <Segmented
            label="Period"
            accent={teamColor}
            value={periodValue}
            onChange={state.setPeriod}
            columns={2}
            options={[
              ...(state.hasWholeRun ? [{ value: ANY, label: UI.wholeRun }] : []),
              ...state.periodFacets.map((facet) => ({ value: facet.key, label: facet.label })),
            ]}
          />
        </RailGroup>
      )}

      <RailGroup title={UI.metrics}>
        <Box sx={{ borderBottom: 1, borderColor: 'border.subtle' }}>
          <MeasureRow
            label={UI.teamScore(state.root.label)}
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

/** Table or map: the rail's segmented tray, compact, with an icon apiece, leading the legend row. */
function ViewSwitch({ state, view }: { state: Breakout; view: View }) {
  const views: SegmentOption<View>[] = [
    { value: 'table', label: UI.table, icon: <TableRowsOutlinedIcon fontSize="small" /> },
    { value: 'map', label: UI.map, icon: <MapOutlinedIcon fontSize="small" /> },
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
  // When every entity is a version of one scenario, the other columns are that, not pending.
  if (cell.value === null && node.entityNoun && Object.keys(node.values).length === 0) {
    const versionOnly = (node.children ?? []).every(
      (child) => child.edge === 'refines' && child.values[scenario] === undefined,
    )
    return {
      value: null as number | null,
      why: versionOnly ? UI.versionOnly : UI.perEntity(node.entityNoun),
    }
  }
  if (node.notApplicable?.includes(scenario) || node.notApplicableAt?.[scenario]?.includes(place))
    return { value: null as number | null, why: UI.notApplicable }
  if (cell.value === null) {
    // Under sea level rise a scenario with no run at all is a different gap from a
    // number never scored: Calling on Reserves and A Tunnel were not run with it.
    // Ecology's SLR regions exist only for both years together, so a single year
    // there is a slice the run does not split, not a missing score.
    // A measure with no SLR result at all is a gap in the measure, not the scenario.
    const series = cell.node?.values[scenario]
    const anySlr = Object.keys(cell.node?.values ?? {}).length > 0
    // A version of one scenario (New Green Watershed's restoration levels) has no
    // value under the others by design, not because a run is missing.
    const versionOnly = node.edge === 'refines' && series === undefined
    const why = versionOnly
      ? UI.versionOnly
      : climate !== 'slr'
        ? series === undefined && Object.keys(cell.node?.values ?? {}).length > 0
          ? UI.notRun
          : UI.notScored
        : !series
          ? anySlr
            ? UI.notRunWithSlr
            : UI.noSlrResult
          : Object.keys(series).some((key) => key.startsWith(`${place}|`))
            ? UI.bothYearsOnly
            : UI.notScored
    return { value: null as number | null, why }
  }
  if (cell.inferred) return { value: null as number | null, why: PLACEHOLDER }
  return { value: cell.value, why: '' }
}

/** A measure's unit, said once: the Show switch and the sentence say when it is a difference. */
function unitWord(node: CriterionNode): string {
  switch (node.unit) {
    case 'score':
      return 'score, −5 to +5'
    case 'share':
      // EJ counts water-quality readings; everyone else counts days.
      return /^readings/i.test(node.label) ? 'share of readings' : 'proportion of days'
    case 'usd':
    case 'dollars':
      return 'dollars'
    case 'ladder':
      return 'change in water age'
    default:
      return node.unit
  }
}

/** Ranking scores sit on the −5…+5 scale; everything else is a detail beneath them. */
const isScore = (node: CriterionNode) => node.unit === 'score'

/** The selected measures in two groups, ranking scores first, each keeping its order. */
function splitRows(nodes: CriterionNode[]) {
  return { scores: nodes.filter(isScore), details: nodes.filter((node) => !isScore(node)) }
}

/**
 * A difference in the row's own unit, with an explicit sign. A difference that
 * rounds to nothing reads as the unit's plain zero ("0%"), never "+0%" or "−0%".
 */
function signed(value: number, unit: CriterionNode['unit']): string {
  const strip = (text: string) => text.replace(/^[+\-−]\s*/, '')
  const zero = strip(fmtValue(0, unit))
  const text = strip(fmtValue(Math.abs(value), unit))
  return text === zero ? zero : `${value > 0 ? '+' : '−'}${text}`
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

const RANKING_HEADING = UI.rankingHeading

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
function LegendBar({
  state,
  view,
  mapScale,
}: {
  state: Breakout
  view: View
  mapScale: MapScale | null
}) {
  const theme = useTheme()
  const { scores, details } = splitRows(state.selectedNodes)
  const item = (key: string, label: string, body: ReactNode) => (
    <Box
      key={key}
      sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flex: 'none', whiteSpace: 'nowrap' }}
    >
      {label && (
        <Typography variant="caption" sx={{ color: 'base.100' }}>
          {label}
        </Typography>
      )}
      {body}
    </Box>
  )
  const caption = (text: string) => <Typography variant="caption">{text}</Typography>
  const steps = [-5, -3, -1, 0, 1, 3, 5]
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
      {view === 'map' &&
        mapScale &&
        item(
          'map',
          '',
          <>
            {caption(mapScale.worse)}
            {steps.map((step) => (
              <Swatch key={step} tone={cellFill(step)} />
            ))}
            {caption(mapScale.better)}
            <Typography variant="caption" sx={{ color: 'base.200' }}>
              {mapScale.note}
            </Typography>
          </>,
        )}
      {scores.length > 0 &&
        view !== 'map' &&
        item(
          'scores',
          UI.legendScores,
          <>
            {caption('−5')}
            {steps.map((step) => (
              <Swatch key={step} tone={cellFill(step)} />
            ))}
            {caption('+5')}
          </>,
        )}
      {details.length > 0 &&
        view !== 'map' &&
        item(
          'details',
          UI.legendDetails,
          <>
            <Typography variant="caption" sx={{ color: 'primary.main' }}>
              {UI.bestInRow}
            </Typography>
          </>,
        )}
      {item(
        'empty',
        '',
        <>
          <Swatch dashed />
          {caption(UI.noValue)}
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
            {caption(UI.switchedOff)}
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
  // In deviation view Business as Usual is locked off and fades like any scenario
  // switched off; its own text stays plain white (see Cell's `baseline`).
  const lit = (scenario: ScenarioKey) => active.includes(scenario)
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
    // The row's best value, named in green, as it reads on screen: two values that
    // both print "6%" are both the best. Best is the highest, or the lowest where
    // less is better (days over a threshold, an invasive species, saltier water).
    // A row that reads the same throughout has none.
    const unit = row.node.unit
    const shown = (v: number) => (diff && unit !== 'score' ? signed(v, unit) : fmtValue(v, unit))
    const held = cells
      .filter((c) => !(diff && c.scenario === 'bau'))
      .map((c) => c.value)
      .filter((v): v is number => v !== null)
    const best = row.node.betterHigher ? Math.max(...held) : Math.min(...held)
    const highest = new Set(held.map(shown)).size > 1 ? shown(best) : null
    return { ...row, cells, shown, highest }
  })
  const anyPlaceholder = rows.some((row) => row.cells.some((c) => c.why === PLACEHOLDER))
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
          const ceiling = unit === 'share' && !diff ? 1 : undefined
          return [`${row.node.id}|${unit}`, relaxedExtent(values, ceiling)] as const
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
  const lines = Math.max(rows.length, DENSEST_TABLE_ROWS) > 9 ? 1 : 2
  const template = [
    'auto',
    'auto',
    ...rows.map((row) => `minmax(0, ${row.depth === 1 ? ENTITY_ROW : 1}fr)`),
    ...(spare > 0 ? [`minmax(0, ${spare}fr)`] : []),
    'auto',
  ].join(' ')

  return (
    <Box
      sx={{
        height: 1,
        display: 'grid',
        gridTemplateColumns: {
          md: `minmax(0, 2.4fr) repeat(${BREAKOUT_SCENARIOS.length}, minmax(0, 1fr))`,
          xl: `minmax(0, 2.2fr) repeat(${BREAKOUT_SCENARIOS.length}, minmax(0, 1fr))`,
        },
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
            opacity: lit(scenario) ? 1 : FADED,
            transition: 'opacity 200ms ease',
          }}
        >
          {SCENARIO_NAME[scenario]}
        </Typography>
      ))}
      <Box sx={{ gridColumn: '1 / -1', pt: 0.75, pb: 0.375 }}>
        <SectionLabel>{RANKING_HEADING}</SectionLabel>
      </Box>
      {rows.map(({ node, depth, open, cells, shown, highest }, rowIndex) => {
        const ranked = node.unit === 'score'
        const canOpen = depth === 0 && node.level !== 'team' && !!node.children?.length
        const extent =
          depth === 1 ? extents.get(`${scoreOf(rowIndex)?.id}|${node.unit}`) : undefined
        const bars = barred.includes(node.id)
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
                py: depth === 1 ? 0.25 : 0.375,
                // Entities sit well in from their score, under its label.
                pl: depth === 1 ? { md: 5, xl: 10 } : 0,
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
                  <Typography
                    variant="chartTitle"
                    component="p"
                    title={node.label}
                    sx={labelLines(lines)}
                  >
                    {node.level === 'team' ? UI.teamScore(node.label) : node.label}
                  </Typography>
                ) : (
                  <>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
                      <Typography
                        variant="body1"
                        title={node.label}
                        sx={{
                          ...labelLines(lines),
                          typography: { md: 'body2', xl: 'body1' },
                          color: depth === 1 ? 'base.50' : 'base.100',
                        }}
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
              {/* What the score is based on and how it is ranked, on demand. */}
              {depth === 0 && RANKING_DEFINITIONS[node.id] && <RankingInfo node={node} />}
              {/* An open score can draw its entities as bars, column by column. */}
              {open && (
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
            {cells.map((cell) => (
              <MotionBox
                key={cell.scenario}
                {...motionFor(depth, order[rowIndex], lit(cell.scenario) ? 1 : FADED)}
                sx={{ minHeight: 0, display: 'grid', py: depth === 1 ? 0.25 : 0.375 }}
              >
                <Cell
                  bar={extent}
                  value={cell.value}
                  why={cell.why}
                  summary={cell.summary}
                  rank={cell.rank}
                  unit={node.unit}
                  score={ranked}
                  top={
                    !ranked &&
                    cell.value !== null &&
                    !(diff && cell.scenario === 'bau') &&
                    shown(cell.value) === highest
                  }
                  baseline={diff && cell.scenario === 'bau'}
                  columnOff={!lit(cell.scenario)}
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
      {/* Wraps on a narrow screen rather than being cut off. */}
      <Typography variant="caption" sx={{ gridColumn: '1 / -1', color: 'base.200', pt: 0.5 }}>
        {UI.footnote}
        {anyPlaceholder && UI.footnotePlaceholder}
        {state.climate === 'slr' && UI.footnoteSeaLevelRise}
      </Typography>
    </Box>
  )
}

/**
 * The info button beside a ranking score, and the card it opens: what the score is
 * based on and how the team turns that into −5…+5, from labels.ts.
 */
function RankingInfo({ node }: { node: CriterionNode }) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)
  const definition = RANKING_DEFINITIONS[node.id]
  const title = node.level === 'team' ? UI.teamScore(node.label) : node.label
  return (
    <>
      <IconButton
        size="small"
        onClick={(event) => setAnchor(event.currentTarget)}
        aria-label={UI.aboutScore(title)}
        aria-haspopup="dialog"
        aria-expanded={!!anchor}
        sx={{ p: 0.25, flex: 'none', color: anchor ? 'primary.main' : 'base.200' }}
      >
        <InfoOutlinedIcon fontSize="small" />
      </IconButton>
      <Popover
        open={!!anchor}
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{
          paper: {
            role: 'dialog',
            'aria-label': UI.aboutScore(title),
            sx: {
              maxWidth: 400,
              p: 2,
              bgcolor: 'base.700',
              border: 1,
              borderColor: 'border.default',
              borderRadius: 1,
            },
          },
        }}
      >
        <Stack spacing={jtSpacing.gap.sm}>
          <Typography variant="chartTitle" component="h3">
            {title}
          </Typography>
          <Box>
            <Typography variant="caption" component="p" sx={{ color: 'base.200' }}>
              {UI.basedOn}
            </Typography>
            <Typography variant="body2" sx={{ color: 'base.50' }}>
              {definition.basedOn}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" component="p" sx={{ color: 'base.200' }}>
              {UI.howScored}
            </Typography>
            <Typography variant="body2" sx={{ color: 'base.50' }}>
              {definition.rule}
            </Typography>
          </Box>
          {definition.note && (
            <Typography variant="caption" component="p" sx={{ color: 'base.200' }}>
              {definition.note}
            </Typography>
          )}
        </Stack>
      </Popover>
    </>
  )
}

/**
 * One cell. A score takes the −5…+5 palette at its value, whether that value is the
 * score or its difference from Business as Usual. A detail is plain text, green where
 * it is the row's best, or a bar on its block's axis when the block is drawn as
 * bars; its own rank rides beside it as a badge. A row scored per entity shows the
 * range of its entities' ranks instead.
 */
function Cell({
  bar,
  value,
  why,
  summary,
  rank,
  unit,
  score,
  top,
  baseline,
  columnOff,
  signedText,
  onClick,
}: {
  /** Draw the value as a bar on this axis instead of as text. */
  bar?: { lo: number; hi: number }
  value: number | null
  why: string
  summary?: string
  rank?: number | null
  unit: CriterionNode['unit']
  score: boolean
  /** The row's best value: named in green. */
  top?: boolean
  /** Business as Usual in deviation view: plain white, neither dimmed nor green. */
  baseline?: boolean
  /** The cell's scenario is switched off, so its column is already faded. */
  columnOff?: boolean
  signedText: boolean
  onClick?: () => void
}) {
  const empty = value === null
  // Both mark a number that will never exist, so both recede the same way.
  const versionOnly = empty && (why === UI.versionOnly || why === UI.notApplicable)
  const fill = empty || !score ? undefined : cellFill(value)
  // A detail at zero (no acres, no change) is background, so it recedes.
  const quiet = !empty && !score && value === 0
  const text = empty
    ? (summary ?? why)
    : signedText && unit !== 'score'
      ? signed(value, unit)
      : fmtValue(value, unit)
  const badge = rank !== null && rank !== undefined && (
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
  )

  if (bar && !empty) {
    // The bar runs in the room the rank badge leaves.
    const reach = Math.min(1, Math.max(0, (value - bar.lo) / (bar.hi - bar.lo)))
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
        <BarTrack reach={reach} text={text} quiet={quiet} />
        {badge}
      </ButtonBase>
    )
  }

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
        px: { md: 0.75, xl: 1.25 },
        borderRadius: 0.6,
        // A row that belongs to one scenario is grayed out under the others exactly
        // as a switched-off scenario is: an ordinary cell at the same fade, once.
        border: empty && !summary && !versionOnly ? 1 : 0,
        opacity: versionOnly && !columnOff ? FADED : 1,
        borderStyle: 'dashed',
        borderColor: 'border.default',
        bgcolor: fill ?? (summary || !empty || versionOnly ? 'translucent.100' : 'transparent'),
        color:
          // The best value is green even at zero: no added water age is the best there is.
          baseline && !empty
            ? 'base.50'
            : top
              ? 'primary.main'
              : versionOnly
                ? 'base.50'
                : (empty && !summary) || quiet
                  ? 'base.300'
                  : fill
                    ? 'common.white'
                    : 'base.50',
        overflow: 'hidden',
        '&.Mui-focusVisible': focusRing,
      }}
    >
      <Typography
        variant={score && !empty ? 'chartValueLarge' : 'body2'}
        noWrap
        sx={{ position: 'relative', color: 'inherit' }}
      >
        {text}
      </Typography>
      {badge}
    </ButtonBase>
  )
}

/**
 * A bar and its number. The number goes just past the bar's end where it fits
 * there, inside the bar's end where it fits there instead, and otherwise as a
 * dark pill at the cell's roomier edge, so it never runs out of the cell.
 */
function BarTrack({ reach, text, quiet }: { reach: number; text: string; quiet: boolean }) {
  const { ref: trackRef, width: trackWidth } = useElementSize<HTMLDivElement>()
  const { ref: labelRef, width: labelWidth } = useElementSize<HTMLSpanElement>()
  const roomPast = (1 - reach) * trackWidth
  const roomIn = reach * trackWidth
  // The measured width is the text alone; its padding adds 0.5 spacing each side.
  const need = labelWidth + 8
  const place: 'past' | 'inside' | 'pill' =
    need <= roomPast ? 'past' : need <= roomIn ? 'inside' : 'pill'
  return (
    <Box
      ref={trackRef}
      sx={{ position: 'relative', flex: '1 1 auto', alignSelf: 'stretch', minWidth: 0 }}
    >
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          left: 0,
          top: '14%',
          bottom: '14%',
          width: `${reach * 100}%`,
          bgcolor: 'base.100',
          borderRadius: 0.4,
          transition: 'width 300ms ease',
        }}
      />
      <Typography
        ref={labelRef}
        component="span"
        variant="body2"
        noWrap
        sx={{
          position: 'absolute',
          top: '50%',
          transform: 'translateY(-50%)',
          px: 0.5,
          // Past the bar's end, or inside it; where neither has room, a dark pill pinned
          // to the roomier edge, readable over the bar or beside it.
          ...(place === 'past'
            ? { left: `${reach * 100}%`, color: quiet ? 'base.300' : 'base.50' }
            : place === 'inside'
              ? { right: `${(1 - reach) * 100}%`, color: 'base.900' }
              : {
                  ...(roomIn > roomPast ? { left: 0 } : { right: 0 }),
                  maxWidth: '100%',
                  bgcolor: 'base.900',
                  borderRadius: 0.5,
                  color: 'base.50',
                }),
        }}
      >
        {text}
      </Typography>
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

/** One measure the map can draw, under the ranking score it belongs to. */
interface MapItem {
  node: CriterionNode
  score: CriterionNode
}

/**
 * Every measure the map can draw, whatever is open in the table: each ranking
 * score on screen with numbers by place, and each of its entities that has them.
 */
/** Teams whose map shows only the measures under a score, not the score's own map. */
const MAP_ENTITIES_ONLY: TeamKey[] = ['environmentalJustice']

function mapItems(state: Breakout, team: TeamKey): MapItem[] {
  if (!MAP_REGION_KEY[team]) return []
  const ownMap = !MAP_ENTITIES_ONLY.includes(team)
  const mapped = (node: CriterionNode) =>
    node.places[0]?.key !== ANY &&
    Object.keys(inClimate(node, state.climate).values).some((key) => !key.startsWith(`${ANY}|`))
  return state.rows
    .filter((row) => row.depth === 0 && row.node.level !== 'team')
    .flatMap(({ node }) => [
      ...(ownMap && mapped(node) ? [{ node, score: node }] : []),
      ...(node.children ?? []).filter(mapped).map((child) => ({ node: child, score: node })),
    ])
}

/** Teams whose map picks a score first, then a measure under it, in two rows of tabs. */
const NESTED_MAP_TABS: TeamKey[] = ['recreation', 'economy']

/**
 * Mapped measures as tabs, life stages together. Nested, a score's own tab sits
 * among its entities as "The score"; flat, every measure of the team is one row
 * and a score's tab carries its name.
 */
function entityTabs(items: MapItem[], score: CriterionNode | null) {
  return items
    .filter((item) => score === null || item.score === score)
    .reduce<{ name: string; items: MapItem[] }[]>((out, item) => {
      const own = item.node === item.score
      const name = own
        ? score
          ? UI.mapScoreTab
          : item.node.label
        : lifeStage(item.node.label).name
      const tab = out.find((t) => t.name === name)
      if (tab) tab.items.push(item)
      else out.push({ name, items: [item] })
      return out
    }, [])
}

/**
 * One measure's six maps at a time, picked by tabs: for Recreation and Economy a
 * row for the ranking score, then one for the measure under it; for the others one
 * row of every measure (a species with its life stages as chips).
 */
function Maps({
  state,
  team,
  onScale,
}: {
  state: Breakout
  team: TeamKey
  onScale: (scale: MapScale | null) => void
}) {
  const keys = MAP_REGION_KEY[team] ?? {}
  const items = mapItems(state, team)
  const scores = [...new Set(items.map((item) => item.score))]
  const [picked, setPicked] = useState<string | null>(null)
  const active = items.find((item) => item.node.id === picked) ?? items[0]
  const dimmed = BREAKOUT_SCENARIOS.filter((scenario) => !state.scenarios.includes(scenario))
  useEffect(() => {
    if (!active) onScale(null)
  }, [active, onScale])
  if (!active) return null
  const { node } = active
  const nested = NESTED_MAP_TABS.includes(team)
  const scoreIndex = scores.indexOf(active.score)
  const tabs = entityTabs(items, nested ? active.score : null)
  const tabIndex = tabs.findIndex((t) => t.items.includes(active))
  const stage = lifeStage(node.label).stage
  /** Open a tab on the life stage already showing, where it has one. */
  const openTab = (tab: { items: MapItem[] }) =>
    setPicked(
      (tab.items.find((i) => lifeStage(i.node.label).stage === stage) ?? tab.items[0]).node.id,
    )
  /** Open another score on the same measure (Birding to Birding), where it has one. */
  const openScore = (index: number) => {
    const next = entityTabs(items, scores[index])
    openTab(next.find((t) => t.name === tabs[tabIndex].name) ?? next[0])
  }
  // The score tray shows for the nested teams; the measure tray always shows, so
  // the map is always named, except where it would only repeat the score; the
  // life-stage tray shows for a species with stages.
  const measureTray = !nested || tabs.length > 1 || active.node !== active.score
  const stages = lifeStage(tabs[tabIndex].items[0].node.label).stage ? tabs[tabIndex].items : []
  return (
    <Box
      sx={{
        height: 1,
        display: 'grid',
        gridTemplateRows: 'auto minmax(0, 1fr)',
        rowGap: 2,
        // Room for the outlines of the maps.
        pb: 0.75,
      }}
    >
      {/* What is mapped: one row of trays, in the rail's segmented style. */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 1.5,
          minWidth: 0,
        }}
      >
        {nested && (
          <Box sx={{ flex: '0 1 auto', minWidth: 0 }}>
            <Segmented
              label={UI.mapScorePicker}
              value={String(scoreIndex)}
              onChange={(next) => openScore(Number(next))}
              options={scores.map((score, index) => ({ value: String(index), label: score.label }))}
              dense
            />
          </Box>
        )}
        {measureTray && (
          <Box sx={{ flex: '0 1 auto', minWidth: 0 }}>
            <Segmented
              label={UI.mapMeasurePicker}
              value={String(tabIndex)}
              onChange={(next) => openTab(tabs[Number(next)])}
              options={tabs.map((tab, index) => ({ value: String(index), label: tab.name }))}
              dense
            />
          </Box>
        )}
        {stages.length > 0 && (
          <Box sx={{ flex: 'none' }}>
            <Segmented
              label={UI.lifeStagePicker}
              value={active.node.id}
              onChange={setPicked}
              options={stages.map((item) => ({
                value: item.node.id,
                label: capitalise(lifeStage(item.node.label).stage ?? item.node.label),
              }))}
              dense
            />
          </Box>
        )}
      </Box>
      <Box id="map-panel" sx={{ minHeight: 0, display: 'grid' }}>
        <RegionValues
          key={node.id}
          team={team}
          scenarios={BREAKOUT_SCENARIOS}
          dimmed={dimmed}
          reading={state.reading}
          sameStyleForChange
          scoreScale
          // A share is scored one point per percentage point against Business as Usual.
          scorePerPoint={node.unit === 'share' ? 0.01 : undefined}
          onScale={onScale}
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
        px: pageX,
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
  const how = p.view === 'map' ? ' (on the map)' : ''
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
