// 4c — tick what you want to compare, from anywhere in the tree.
//
// The whole criterion tree stays on screen. Ticking a node adds it to the table;
// there is no "where you are", so a criterion in one subteam and a criterion in
// another can sit side by side, and moving between them costs a tick rather than
// a walk up to the root and back down. Typing in the filter flattens the tree to
// the matches, which is the direct jump.
//
// Scenarios, places and periods work the same way: one value selected means that
// dimension is fixed, two or more means it is an axis. Nothing decides the shape
// of the table except the selection itself.
//
// The table is also a control. A column header narrows to that scenario and a row
// label to that criterion. A cell does something else: it has no children and no
// axis of its own, so clicking one opens where its number came from and leaves the
// table exactly as it was. Narrowing rearranges, inspecting does not, and the two
// should not share a gesture. Expanding a criterion into its parts is a separate affordance, the
// twisty, because it is a different question. Narrowing holds the axis roles it
// found: the rows stay rows and the columns stay columns even once one of them is
// down to a single value, so the thing you clicked is still where you clicked it
// and the rest animate away around it. Every narrowing is listed above the table
// with its way back. A gesture nobody can reverse is a trapdoor.
import { Box, ButtonBase, InputBase, Typography } from '@mui/material'
import { LayoutGroup, motion } from 'framer-motion'
import { useState } from 'react'
import type { ReactNode } from 'react'
import SketchCard from '../components/SketchCard'
import { cellFill } from '../data'
import {
  ControlPanel,
  DrillHead,
  DrillLayout,
  DrillRow,
  FacetRow,
  NowShowing,
  TeamMark,
  ViewNote,
} from '../drilldown/DrillBits'
import type { Phrase } from '../drilldown/DrillBits'
import {
  DRILL_CARD_WIDTH,
  domainFor,
  domainsByUnit,
  labelOf,
  unitHeading,
} from '../drilldown/scales'
import {
  ANY,
  DRILL_SCENARIOS,
  SCENARIO_NAME,
  TEAM_BY_KEY,
  fmtValue,
  isSigned,
} from '../drilldown/model'
import type { CriterionNode, Facet, ScenarioKey, Unit } from '../drilldown/model'
import { NODE_INDEX } from '../drilldown/tree'
import { CellDetail, Provenance } from '../drilldown/CellDetail'
import { emptyReason, valueAt } from '../drilldown/cellValue'
import { DIM_LABEL, DIM_PLURAL, LEVEL_PLURAL, MAX_AXES, usePivot } from '../drilldown/usePivot'
import type { Dim, Pivot } from '../drilldown/usePivot'

/** Narrowest a data column may get before its header starts colliding. */
const MIN_COL = 108
/** The −5…+5 range cellFill reads, so a measurement can be mapped onto it. */
const SCORE_SPAN = 5
/**
 * Widest it may get. Without a ceiling the last column left after a narrowing
 * stretches across the whole view, so the cell the reader just clicked is three
 * times the size and nowhere near where they clicked it.
 */
const MAX_COL = 150
/** Fixed, so the data columns start at the same x whether there are six or one. */
const LABEL_COL = 170

/**
 * The one motion in this design, and it has a job: when a click narrows the table
 * the survivor travels from where it was clicked to where it lands, so the reader
 * follows it instead of re-reading a table that has silently become a new one.
 *
 * Every mover uses layout="position". Plain `layout` animates size as well, which
 * on a table means scaling: a row whose block loses four siblings gets handed a
 * scale(1, 3.4) and its text stretches with it. Position-only moves the box and
 * leaves what is inside it alone.
 */
const GLIDE = { type: 'spring' as const, stiffness: 420, damping: 38, mass: 0.8 }

export default function PivotTable() {
  const pivot = usePivot()
  return (
    <SketchCard id="4c" width={DRILL_CARD_WIDTH}>
      <DrillLayout
        controls={<Controls pivot={pivot} />}
        view={
          <>
            {/* Everything above the table is height-stable. The sentence rewraps and
                the narrowing bar comes and goes, and either one shifting the grid
                down undoes the continuity the click gestures are built on. */}
            <Box sx={{ display: 'grid', minHeight: 86, alignContent: 'start' }}>
              <NowShowing parts={sentenceFor(pivot)} />
            </Box>
            <Box sx={{ display: 'grid', minHeight: 34, alignContent: 'center' }}>
              <Isolated pivot={pivot} />
            </Box>
            <Result pivot={pivot} />
          </>
        }
      />
    </SketchCard>
  )
}

// ---------- controls ----------

/**
 * What a dimension is doing to the table right now. An axis narrowed to one value
 * is still that axis — saying "fixed" there would contradict the table, which is
 * still showing it as a single row or column.
 */
function roleOf(pivot: Pivot, dim: Dim): string {
  const index = pivot.axes.indexOf(dim)
  if (index === 0) return 'rows'
  if (index === 1) return 'columns'
  return pivot.selection[dim].length <= 1 ? 'fixed' : 'too many'
}

function Controls({ pivot }: { pivot: Pivot }) {
  const tooMany = pivot.varying.length > MAX_AXES
  return (
    <ControlPanel>
      <CriterionTree pivot={pivot} />

      <FacetRow
        label={DIM_LABEL.scenario}
        status={`${pivot.scenarios.length} of 6 · ${roleOf(pivot, 'scenario')}`}
      >
        {DRILL_SCENARIOS.map((scenario) => (
          <Chip
            key={scenario.key}
            label={scenario.name}
            picked={pivot.scenarios.includes(scenario.key)}
            onClick={() => pivot.toggleScenario(scenario.key)}
          />
        ))}
        <AllOne
          onAll={() => pivot.setAllScenarios(true)}
          onOne={() => pivot.setAllScenarios(false)}
        />
      </FacetRow>

      <SliceDimension
        dim="place"
        facets={pivot.placeFacets}
        picked={pivot.places}
        onToggle={pivot.togglePlace}
        onAll={pivot.setAllPlaces}
        role={roleOf(pivot, 'place')}
      />
      <SliceDimension
        dim="period"
        facets={pivot.periodFacets}
        picked={pivot.periods}
        onToggle={pivot.togglePeriod}
        onAll={pivot.setAllPeriods}
        role={roleOf(pivot, 'period')}
      />

      {!tooMany && pivot.axes.length === 2 && (
        <FacetRow label="Table" status={`${pivot.cells} cells`}>
          <Chip
            label="⇄ swap rows and columns"
            picked={false}
            onClick={() => pivot.setSwapped(!pivot.swapped)}
          />
        </FacetRow>
      )}
    </ControlPanel>
  )
}

/**
 * The one substantial control. Everything comparable is on screen at once, so
 * reaching a criterion never depends on where the reader has been.
 */
function CriterionTree({ pivot }: { pivot: Pivot }) {
  return (
    <FacetRow
      label={DIM_LABEL.criterion}
      status={`${pivot.criteria.length} ticked · ${roleOf(pivot, 'criterion')}`}
    >
      <Box sx={{ display: 'grid', gap: 0.5, width: '100%' }}>
        <InputBase
          value={pivot.filter}
          onChange={(event) => pivot.setFilter(event.target.value)}
          placeholder="Find a criterion…"
          inputProps={{ 'aria-label': 'Find a criterion' }}
          sx={{
            typography: 'controlLabel',
            px: 1,
            py: 0.5,
            borderRadius: 1,
            border: 1,
            borderColor: 'border.default',
            color: 'common.white',
            '&.Mui-focused': { borderColor: 'primary.main' },
          }}
        />
        <Box sx={{ display: 'grid', gap: 0.15 }}>
          {pivot.rows.map(({ node, depth }) => (
            <TreeRow
              key={node.id}
              node={node}
              depth={depth}
              ticked={pivot.criteria.includes(node.id)}
              open={pivot.expanded.includes(node.id)}
              partsOn={
                !!node.children?.length &&
                node.children.every((child) => pivot.criteria.includes(child.id))
              }
              onTick={() => pivot.toggleCriterion(node.id)}
              onExpand={() => pivot.toggleExpanded(node.id)}
              onParts={() => pivot.pickParts(node.id)}
            />
          ))}
        </Box>
        <AllOne
          onAll={() => pivot.setAllCriteria(true)}
          onOne={() => pivot.setAllCriteria(false)}
        />
      </Box>
    </FacetRow>
  )
}

/**
 * One row: a twisty that only opens, a box that only ticks, and — on a parent — a
 * count that swaps the node for its parts, because a total and its components
 * rarely belong in the same table.
 */
function TreeRow({
  node,
  depth,
  ticked,
  open,
  partsOn,
  onTick,
  onExpand,
  onParts,
}: {
  node: CriterionNode
  depth: number
  ticked: boolean
  open: boolean
  partsOn: boolean
  onTick: () => void
  onExpand: () => void
  onParts: () => void
}) {
  const parts = node.children?.length ?? 0
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25, pl: depth * 1.5 }}>
      {parts > 0 ? (
        <ButtonBase
          onClick={onExpand}
          aria-label={`${open ? 'Collapse' : 'Expand'} ${node.label}`}
          sx={{
            typography: 'chartAxis',
            flex: 'none',
            width: 16,
            height: 22,
            borderRadius: 0.5,
            color: 'base.300',
            '&:hover, &.Mui-focusVisible': { color: 'common.white' },
          }}
        >
          {open ? '▾' : '▸'}
        </ButtonBase>
      ) : (
        <Box sx={{ flex: 'none', width: 16 }} />
      )}

      <ButtonBase
        onClick={onTick}
        aria-pressed={ticked}
        sx={{
          typography: 'controlLabel',
          flex: 1,
          minWidth: 0,
          justifyContent: 'flex-start',
          gap: 0.6,
          px: 0.5,
          py: 0.4,
          borderRadius: 0.5,
          textAlign: 'left',
          color: ticked ? 'common.white' : 'base.300',
          '&:hover, &.Mui-focusVisible': { bgcolor: 'translucent.100' },
        }}
      >
        <Box
          component="span"
          sx={{
            flex: 'none',
            width: 11,
            height: 11,
            borderRadius: 0.4,
            border: 1,
            borderColor: ticked ? 'primary.main' : 'border.strong',
            bgcolor: ticked ? 'primary.main' : 'transparent',
          }}
        />
        {node.level === 'team' && <TeamMark team={node.team} size={12} />}
        <Box component="span" sx={{ flex: 1, minWidth: 0 }}>
          {node.label}
        </Box>
      </ButtonBase>

      {parts > 0 && (
        <ButtonBase
          onClick={onParts}
          aria-pressed={partsOn}
          aria-label={`Compare the ${parts} parts of ${node.label}`}
          sx={{
            typography: 'chartAxis',
            flex: 'none',
            px: 0.6,
            py: 0.3,
            borderRadius: 999,
            border: 1,
            borderColor: partsOn ? 'primary.main' : 'transparent',
            color: partsOn ? 'primary.main' : 'base.300',
            '&:hover, &.Mui-focusVisible': { borderColor: 'primary.main', color: 'common.white' },
          }}
        >
          {parts} parts
        </ButtonBase>
      )}
    </Box>
  )
}

function SliceDimension({
  dim,
  facets,
  picked,
  onToggle,
  onAll,
  role,
}: {
  dim: Dim
  facets: Facet[]
  picked: string[]
  onToggle: (key: string) => void
  onAll: (all: boolean) => void
  role: string
}) {
  if (facets.length === 0) {
    return (
      <FacetRow label={DIM_LABEL[dim]} inert status="not broken out">
        <Typography variant="chartAxis" sx={{ color: 'base.300' }}>
          The selected criteria do not use this breakdown.
        </Typography>
      </FacetRow>
    )
  }
  return (
    <FacetRow label={DIM_LABEL[dim]} status={`${picked.length || 1} of ${facets.length} · ${role}`}>
      {facets.map((facet) => (
        <Chip
          key={facet.key}
          label={facet.label}
          picked={picked.includes(facet.key)}
          onClick={() => onToggle(facet.key)}
        />
      ))}
      <AllOne onAll={() => onAll(true)} onOne={() => onAll(false)} />
    </FacetRow>
  )
}

function Chip({ label, picked, onClick }: { label: string; picked: boolean; onClick: () => void }) {
  return (
    <ButtonBase
      onClick={onClick}
      aria-pressed={picked}
      sx={{
        typography: 'controlLabel',
        px: 1.1,
        py: 0.55,
        borderRadius: 999,
        border: 1,
        borderColor: picked ? 'primary.main' : 'border.strong',
        bgcolor: picked ? 'primary.main' : 'transparent',
        color: picked ? 'common.black' : 'base.50',
        whiteSpace: 'nowrap',
        transition: 'background-color 150ms ease, border-color 150ms ease, color 150ms ease',
        '&:hover, &.Mui-focusVisible': { borderColor: 'primary.main' },
      }}
    >
      {label}
    </ButtonBase>
  )
}

function AllOne({ onAll, onOne }: { onAll: () => void; onOne: () => void }) {
  return (
    <Box sx={{ display: 'inline-flex', gap: 0.5 }}>
      <Mini label="all" onClick={onAll} />
      <Mini label="one" onClick={onOne} />
    </Box>
  )
}

function Mini({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <ButtonBase
      onClick={onClick}
      sx={{
        typography: 'chartAxis',
        px: 0.75,
        py: 0.4,
        borderRadius: 999,
        color: 'base.300',
        border: 1,
        borderColor: 'border.default',
        '&:hover, &.Mui-focusVisible': { color: 'common.white', borderColor: 'primary.main' },
      }}
    >
      {label}
    </ButtonBase>
  )
}

/**
 * Every narrowing a click in the table made, with the way back. Without this the
 * gesture is a trapdoor: the table shows one column and nothing says why, or how
 * to get the other five back.
 */
function Isolated({ pivot }: { pivot: Pivot }) {
  if (pivot.isolated.length === 0) return null
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 0.75 }}>
      <Typography variant="chartAxis" sx={{ color: 'base.300' }}>
        Narrowed by clicking
      </Typography>
      {pivot.isolated.map((dim) => (
        <ButtonBase
          key={dim}
          onClick={() => pivot.restore(dim)}
          sx={{
            typography: 'chartAxis',
            display: 'inline-flex',
            gap: 0.5,
            px: 0.9,
            py: 0.4,
            borderRadius: 999,
            border: 1,
            borderColor: 'border.strong',
            color: 'base.50',
            '&:hover, &.Mui-focusVisible': { borderColor: 'primary.main', color: 'common.white' },
          }}
        >
          <Box component="span">{labelFor(pivot, dim, pivot.selection[dim][0])} only</Box>
          <Box component="span" sx={{ color: 'primary.main' }}>
            {`show all ${pivot.stashedCount(dim)}`}
          </Box>
        </ButtonBase>
      ))}
    </Box>
  )
}

/** The twisty on a table row: expand a criterion into its parts, beneath itself. */
function Twisty({
  open,
  onToggle,
  label,
}: {
  open: boolean
  onToggle?: () => void
  label: string
}) {
  if (!onToggle) return <Box sx={{ flex: 'none', width: 16 }} />
  return (
    <ButtonBase
      onClick={onToggle}
      aria-expanded={open}
      aria-label={`${open ? 'Collapse' : 'Expand'} ${label}`}
      sx={{
        typography: 'chartAxis',
        flex: 'none',
        width: 16,
        height: 22,
        borderRadius: 0.5,
        color: 'base.300',
        '&:hover, &.Mui-focusVisible': { color: 'common.white' },
      }}
    >
      {open ? '▾' : '▸'}
    </ButtonBase>
  )
}

/** Click-to-isolate, wrapped so the hit target reads as one. */
function Pick({
  onClick,
  title,
  align = 'left',
  children,
}: {
  onClick: () => void
  title: string
  align?: 'left' | 'center'
  children: ReactNode
}) {
  return (
    <ButtonBase
      onClick={onClick}
      title={title}
      sx={{
        display: 'block',
        width: '100%',
        minWidth: 0,
        textAlign: align,
        borderRadius: 0.5,
        px: 0.4,
        mx: -0.4,
        '&:hover, &.Mui-focusVisible': { bgcolor: 'translucent.100' },
      }}
    >
      {children}
    </ButtonBase>
  )
}

// ---------- the result ----------

function labelFor(pivot: Pivot, dim: Dim, key: string): string {
  if (dim === 'scenario') return SCENARIO_NAME[key as ScenarioKey]
  if (dim === 'criterion') return NODE_INDEX.get(key)?.label ?? key
  if (dim === 'place') return labelOf(pivot.placeFacets, key)
  return labelOf(pivot.periodFacets, key)
}

/**
 * Why a row holds numbers for only some of the scenarios on screen.
 *
 * A row that is empty everywhere already explains itself. A row that is empty in
 * five of six columns did not, and it reads as missing data — which is how three
 * dashes next to Economy's −4 came to look like a broken aggregate. They are not
 * parts of that score at all: they are settings of New Green Watershed, and no
 * other scenario has one.
 */
function coverageNote(node: CriterionNode | undefined, colDim: Dim, colKeys: string[]) {
  if (!node || colDim !== 'scenario' || colKeys.length < 2) return undefined
  const held = colKeys.filter((key) => node.values[key as ScenarioKey])
  if (held.length === 0 || held.length === colKeys.length) return undefined
  const names = held.map((key) => SCENARIO_NAME[key as ScenarioKey])
  if (node.edge === 'refines') return `a setting of ${names.join(' and ')}, not a part`
  return names.length <= 2
    ? `${names.join(' and ')} only`
    : `${held.length} of ${colKeys.length} scenarios`
}

/**
 * No ceiling on the number of cells. A big table is the reader's call to make —
 * the count sits in the Table row of the control panel if they want to judge it —
 * and refusing to draw one only hides the answer they asked for behind a wall of
 * text. The two-axis limit below stays, because three varying dimensions have no
 * two-dimensional form at all; too many cells merely needs scrolling.
 */
function Result({ pivot }: { pivot: Pivot }) {
  if (pivot.varying.length > MAX_AXES) return <TooManyAxes pivot={pivot} />
  if (pivot.axes.length === 2) return <Matrix pivot={pivot} />
  return <Listing pivot={pivot} />
}

/** Three dimensions varying has no honest two-dimensional form; offer the way out. */
function TooManyAxes({ pivot }: { pivot: Pivot }) {
  return (
    <Box
      sx={(theme) => ({
        display: 'grid',
        gap: 1.5,
        justifyItems: 'start',
        p: theme.jtSpacing.component.md,
        borderRadius: 2,
        border: 1,
        borderStyle: 'dashed',
        borderColor: 'border.default',
      })}
    >
      <Typography variant="body2" sx={{ maxWidth: '62ch' }}>
        {pivot.varying.length} things vary:{' '}
        {pivot.varying.map((dim) => DIM_LABEL[dim].toLowerCase()).join(', ')}. Because a table has
        two axes, narrow one of these to a single choice.
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
        {pivot.varying.map((dim) => (
          <Chip
            key={dim}
            label={`Narrow ${DIM_LABEL[dim].toLowerCase()}`}
            picked={false}
            onClick={() => pivot.collapseDim(dim)}
          />
        ))}
      </Box>
    </Box>
  )
}

/** Nothing varying, or one dimension down the rows. */
function Listing({ pivot }: { pivot: Pivot }) {
  const dim = pivot.axes[0]
  const fixed = (d: Dim) => pivot.selection[d][0]
  const coordsFor = (key?: string): Record<Dim, string> => ({
    scenario: dim === 'scenario' && key ? key : fixed('scenario'),
    criterion: dim === 'criterion' && key ? key : fixed('criterion'),
    place: dim === 'place' && key ? key : fixed('place'),
    period: dim === 'period' && key ? key : fixed('period'),
  })

  if (!dim) {
    const cell = valueAt(coordsFor())
    return (
      <>
        <Box sx={{ display: 'grid', gap: 0.5, justifyItems: 'start' }}>
          <Typography variant="numberArticle" component="div">
            {cell.value === null ? '—' : fmtValue(cell.value, cell.unit)}
          </Typography>
          <Typography variant="chartAxis" sx={{ color: 'base.300' }}>
            {cell.value === null
              ? emptyReason('criterion', coordsFor().criterion)
              : unitHeading(cell.unit)}
          </Typography>
        </Box>
        <Box sx={{ mt: 2 }}>
          <Provenance node={cell.node} />
        </Box>
        <ViewNote below>{cell.node?.note}</ViewNote>
      </>
    )
  }

  const rows = pivot.selection[dim].map((key) => ({ key, ...valueAt(coordsFor(key)) }))
  const domains = domainsByUnit(rows.map((row) => ({ unit: row.unit, value: row.value })))
  const note = pivot.selectedNodes.length === 1 ? pivot.selectedNodes[0].note : undefined
  const teams = dim === 'criterion' ? [...new Set(rows.map((row) => row.node?.team))] : []
  const grouped =
    dim === 'criterion' &&
    teams.length > 1 &&
    rows.some((row) => row.node?.level !== 'team') &&
    !rows.some((row) => row.node?.level === 'team')

  const body = (subset: typeof rows) =>
    subset.map((row) => (
      <DrillRow
        key={row.key}
        label={labelFor(pivot, dim, row.key)}
        value={row.value}
        unit={row.unit}
        domain={domains.get(row.unit) ?? domainFor(row.unit, [row.value])}
        provenance={row.node?.provenance ?? 'reported'}
        gap={row.value === null ? emptyReason(dim, row.key) : undefined}
        edge={grouped ? row.node?.edge : undefined}
        team={dim === 'criterion' && !grouped ? row.node?.team : undefined}
        indent={dim === 'criterion' ? pivot.tickedDepth(row.key) : 0}
        onClick={() => pivot.isolate(dim, row.key)}
        expand={
          dim === 'criterion'
            ? {
                open: pivot.partsOpen(row.key),
                onToggle: row.node?.children?.length ? () => pivot.toggleParts(row.key) : undefined,
                label: labelFor(pivot, dim, row.key),
              }
            : undefined
        }
      />
    ))

  return (
    <>
      {grouped ? (
        <Box sx={(theme) => ({ display: 'grid', rowGap: theme.jtSpacing.component.sm })}>
          {teams.map((team) => (
            <Box key={team}>
              <DrillHead
                first={TEAM_BY_KEY[team!]?.name ?? ''}
                units="Value in its own units"
                team={team}
                gutter
              />
              <Box sx={{ display: 'grid', rowGap: 0.75 }}>
                {body(rows.filter((row) => row.node?.team === team))}
              </Box>
            </Box>
          ))}
        </Box>
      ) : (
        <>
          <DrillHead
            first={DIM_LABEL[dim]}
            units={
              dim === 'criterion' ? 'Value in its own units' : unitHeading(rows[0]?.unit ?? 'score')
            }
            team={dim === 'criterion' ? undefined : pivot.selectedNodes[0]?.team}
            gutter={dim === 'criterion'}
          />
          <Box sx={{ display: 'grid', rowGap: 0.75 }}>{body(rows)}</Box>
        </>
      )}
      <ViewNote below>{note}</ViewNote>
    </>
  )
}

/**
 * Two dimensions. Columns from different subteams, or in different units, cannot
 * share one grid honestly, so the split is by subteam and then by unit.
 */
function Matrix({ pivot }: { pivot: Pivot }) {
  // Which cell the reader asked about. Null is the normal state; opening one
  // changes nothing about the table behind it.
  const [inspect, setInspect] = useState<Record<Dim, string> | null>(null)
  const [rowDim, colDim] = pivot.axes
  const colKeys = pivot.selection[colDim]
  const rowKeys = pivot.selection[rowDim]
  const unitOf = (key: string) =>
    colDim === 'criterion'
      ? (NODE_INDEX.get(key)?.unit ?? 'score')
      : (pivot.selectedNodes[0]?.unit ?? 'score')

  const fixed = (d: Dim) => pivot.selection[d][0]
  const hasValues = (colKey: string) =>
    rowKeys.some((rowKey) => {
      const base: Record<Dim, string> = {
        scenario: fixed('scenario'),
        criterion: fixed('criterion'),
        place: fixed('place'),
        period: fixed('period'),
      }
      base[rowDim] = rowKey
      base[colDim] = colKey
      return valueAt(base).value !== null
    })

  const byUnit = (keys: string[]) => {
    const out: { unit: Unit; keys: string[] }[] = []
    for (const key of keys) {
      const unit = unitOf(key)
      const group = out.find((entry) => entry.unit === unit)
      if (group) group.keys.push(key)
      else out.push({ unit, keys: [key] })
    }
    return out
  }

  const prune = pivot.isolated.length === 0
  // Say what the asterisk means, and only where one is actually on screen.
  const anyInferred = colKeys.some((colKey) =>
    pivot.selection[rowDim].some((rowKey) => {
      const base: Record<Dim, string> = {
        scenario: fixed('scenario'),
        criterion: fixed('criterion'),
        place: fixed('place'),
        period: fixed('period'),
      }
      base[rowDim] = rowKey
      base[colDim] = colKey
      return valueAt(base).inferred
    }),
  )
  const teams =
    colDim === 'criterion' ? [...new Set(colKeys.map((key) => NODE_INDEX.get(key)?.team))] : []
  const splitByTeam = colDim === 'criterion' && teams.length > 1
  const sections = splitByTeam
    ? teams.map((team) => ({
        team,
        keys: colKeys.filter((key) => NODE_INDEX.get(key)?.team === team),
      }))
    : [{ team: undefined, keys: colKeys }]

  return (
    <>
      <LayoutGroup>
        <Box sx={(theme) => ({ display: 'grid', rowGap: theme.jtSpacing.component.md })}>
          {sections.map((section, i) => {
            // Columns with nothing in them are normally moved into prose rather than
            // drawn as a grid of dashes. Not while the reader is narrowing, though:
            // clicking one row must not make columns disappear from under it. Holding
            // the frame still is the whole point of the gesture.
            const live = prune ? section.keys.filter(hasValues) : section.keys
            const dead = prune ? section.keys.filter((key) => !hasValues(key)) : []
            const groups = byUnit(live)
            return (
              <Box key={section.team ?? i} sx={{ display: 'grid', gap: 1 }}>
                {section.team && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                    <TeamMark team={section.team} />
                    <Typography variant="chartTitle" component="div">
                      {TEAM_BY_KEY[section.team]?.name ?? ''}
                    </Typography>
                  </Box>
                )}
                {groups.map((group) => (
                  <MatrixBlock
                    key={group.unit}
                    pivot={pivot}
                    rowDim={rowDim}
                    colDim={colDim}
                    colKeys={group.keys}
                    unit={group.unit}
                    showUnit={groups.length > 1}
                    onInspect={setInspect}
                  />
                ))}
                {dead.length > 0 && (
                  <Typography variant="body2" sx={{ maxWidth: '68ch' }}>
                    {groups.length > 0
                      ? 'Also selected, but with nothing to compare: '
                      : 'Nothing to compare here: '}
                    {dead
                      .map((key) => `${labelFor(pivot, colDim, key)} (${emptyReason(colDim, key)})`)
                      .join('; ')}
                    .
                  </Typography>
                )}
              </Box>
            )
          })}
        </Box>
      </LayoutGroup>
      {anyInferred && (
        <Typography variant="chartAxis" sx={{ display: 'block', mt: 1, color: 'base.300' }}>
          * calculated here, not by the subteam
        </Typography>
      )}
      {/* Under the table, not over it. A note only exists once the reader has
          narrowed to a single criterion, so putting it above means every such
          click shoves the grid down by the height of a paragraph — the table
          lurches at exactly the moment the reader is trying to follow a value. */}
      <ViewNote below>
        {pivot.selectedNodes.length === 1 ? pivot.selectedNodes[0].note : undefined}
      </ViewNote>
      <CellDetail coords={inspect} onClose={() => setInspect(null)} />
    </>
  )
}

function MatrixBlock({
  pivot,
  rowDim,
  colDim,
  colKeys,
  unit,
  showUnit,
  onInspect,
}: {
  pivot: Pivot
  rowDim: Dim
  colDim: Dim
  colKeys: string[]
  unit: Unit
  showUnit: boolean
  onInspect: (coords: Record<Dim, string>) => void
}) {
  const rowKeys = pivot.selection[rowDim]
  const fixed = (d: Dim) => pivot.selection[d][0]
  const coords = (rowKey: string, colKey: string): Record<Dim, string> => {
    const base: Record<Dim, string> = {
      scenario: fixed('scenario'),
      criterion: fixed('criterion'),
      place: fixed('place'),
      period: fixed('period'),
    }
    base[rowDim] = rowKey
    base[colDim] = colKey
    return base
  }

  // Rows may still mix units, so every cell is scaled against its own kind.
  const cells = rowKeys.flatMap((r) => colKeys.map((c) => valueAt(coords(r, c))))
  const domains = domainsByUnit(cells.map((cell) => ({ unit: cell.unit, value: cell.value })))
  const columns = `${LABEL_COL}px repeat(${colKeys.length}, minmax(${MIN_COL}px, ${MAX_COL}px))`
  const minWidth = LABEL_COL + colKeys.length * MIN_COL
  const rowEmpty = (rowKey: string) =>
    colKeys.every((colKey) => valueAt(coords(rowKey, colKey)).value === null)
  const coverage = (rowKey: string) =>
    rowDim === 'criterion' ? coverageNote(NODE_INDEX.get(rowKey), colDim, colKeys) : undefined

  return (
    <Box sx={{ display: 'grid', gap: 0.5 }}>
      {showUnit && (
        <Typography variant="chartColumnHead" component="div" sx={{ color: 'base.300' }}>
          Unit: {unitHeading(unit).toLowerCase()}
        </Typography>
      )}
      {/* Past a handful of columns the grid scrolls sideways rather than squeezing
          every column until the headers collide. */}
      <Box sx={{ overflowX: 'auto', pb: 0.5 }}>
        <Box sx={{ display: 'grid', gap: 0.5, minWidth, justifyItems: 'stretch' }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: columns,
              columnGap: 0.5,
              alignItems: 'end',
              justifyContent: 'start',
            }}
          >
            <Typography variant="chartColumnHead">{DIM_LABEL[rowDim]}</Typography>
            {colKeys.map((colKey) => (
              <Box key={colKey} component={motion.div} layout="position" transition={GLIDE}>
                <Pick
                  align="center"
                  onClick={() => pivot.isolate(colDim, colKey)}
                  title={`Show only ${labelFor(pivot, colDim, colKey)}`}
                >
                  <Typography variant="chartColumnHead" component="span" sx={{ display: 'block' }}>
                    {labelFor(pivot, colDim, colKey)}
                  </Typography>
                </Pick>
              </Box>
            ))}
          </Box>
          {rowKeys.map((rowKey) => {
            const depth = rowDim === 'criterion' ? pivot.tickedDepth(rowKey) : 0
            return (
              <Box
                key={rowKey}
                component={motion.div}
                layout="position"
                transition={GLIDE}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: columns,
                  columnGap: 0.5,
                  alignItems: 'center',
                  justifyContent: 'start',
                }}
              >
                <Box
                  sx={{
                    minWidth: 0,
                    pl: depth * 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.25,
                  }}
                >
                  {rowDim === 'criterion' && (
                    <Twisty
                      open={pivot.partsOpen(rowKey)}
                      onToggle={
                        NODE_INDEX.get(rowKey)?.children?.length
                          ? () => pivot.toggleParts(rowKey)
                          : undefined
                      }
                      label={labelFor(pivot, rowDim, rowKey)}
                    />
                  )}
                  <Pick
                    onClick={() => pivot.isolate(rowDim, rowKey)}
                    title={`Show only ${labelFor(pivot, rowDim, rowKey)}`}
                  >
                    <Typography variant="chartLabel" component="span" sx={{ display: 'block' }}>
                      {labelFor(pivot, rowDim, rowKey)}
                    </Typography>
                    {(rowEmpty(rowKey) || coverage(rowKey)) && (
                      <Typography
                        variant="chartAxis"
                        component="span"
                        sx={{ display: 'block', color: 'base.300' }}
                      >
                        {rowEmpty(rowKey) ? emptyReason(rowDim, rowKey) : coverage(rowKey)}
                      </Typography>
                    )}
                  </Pick>
                </Box>
                {colKeys.map((colKey) => {
                  const cell = valueAt(coords(rowKey, colKey))
                  return (
                    <HeatCell
                      key={colKey}
                      layoutId={`${rowKey}|${colKey}`}
                      value={cell.value}
                      unit={cell.unit}
                      max={(domains.get(cell.unit) ?? domainFor(cell.unit, [cell.value])).max}
                      inset={depth}
                      node={cell.node}
                      inferred={cell.inferred}
                      onClick={() => onInspect(coords(rowKey, colKey))}
                      title={`Show the source for ${labelFor(pivot, rowDim, rowKey)} under ${labelFor(
                        pivot,
                        colDim,
                        colKey,
                      )}`}
                    />
                  )
                })}
              </Box>
            )
          })}
        </Box>
      </Box>
    </Box>
  )
}

/**
 * A cell: score keeps the blue/orange scale, a measurement stays neutral.
 *
 * `inset` narrows a nested row's cells against its parent's, pulled in from the
 * left so their right edges stay flush — the indent then reads as one ragged
 * left edge down the column instead of two drifting ones.
 */
function HeatCell({
  value,
  unit,
  max,
  inset = 0,
  onClick,
  title,
  layoutId,
  node,
  inferred,
}: {
  value: number | null
  unit: Unit
  max: number
  inset?: number
  onClick?: () => void
  title?: string
  /** Ties this cell to the same cell before the click, so it glides rather than cuts. */
  layoutId?: string
  node?: CriterionNode
  /** Marks the value with the page's asterisk: our number, not the subteam's. */
  inferred?: boolean
}) {
  const span = unit === 'share' ? 1 : max || 1
  const strength = value === null ? 0 : Math.min(1, Math.abs(value) / span)
  /**
   * A measurement that is a change against Business as Usual gets the score's own
   * blue/orange scale, because it carries the same thing a score does: a direction
   * away from today. Its magnitude is read against the other cells of its unit, so
   * the shade works within the block rather than pretending to be a −5…+5 score.
   *
   * The sign is the outcome's, not the number's. Water age counts days added and
   * more days is worse, so that node is betterHigher: false and a positive reading
   * lands on the same side of the scale as a negative score.
   */
  const signed = !!node && isSigned(node)
  const direction = node?.betterHigher === false ? -1 : 1
  const fill =
    value === null
      ? undefined
      : unit === 'score'
        ? cellFill(value)
        : cellFill(direction * Math.sign(value) * strength * SCORE_SPAN)
  // The motion lives on a wrapper rather than on the button itself: swapping
  // ButtonBase's own element for a motion one makes MUI warn on every cell.
  return (
    <Box
      component={motion.div}
      layout="position"
      layoutId={layoutId}
      transition={GLIDE}
      sx={{ minWidth: 0, ml: Math.min(inset, 3) * 1.5 }}
    >
      <ButtonBase
        onClick={onClick}
        disabled={!onClick}
        title={title}
        sx={(theme) => ({
          typography: 'chartValue',
          width: '100%',
          height: 34,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 0.5,
          border: value === null ? 1 : 0,
          borderStyle: 'dashed',
          borderColor: 'border.default',
          bgcolor:
            value === null ? 'transparent' : signed ? fill : theme.chart.voting.drill.measureTrack,
          color: value === null ? 'base.300' : 'common.white',
          opacity: value === null ? 1 : 0.35 + strength * 0.65,
          transition: 'outline-color 150ms ease',
          outline: '1px solid transparent',
          outlineOffset: -1,
          '&.Mui-disabled': { color: value === null ? 'base.300' : 'common.white' },
          '&:hover, &.Mui-focusVisible': { outlineColor: theme.palette.primary.main },
        })}
      >
        {value === null ? '—' : `${fmtValue(value, unit)}${inferred ? '*' : ''}`}
      </ButtonBase>
    </Box>
  )
}

// ---------- the sentence ----------

function pluralFor(pivot: Pivot, dim: Dim): string {
  if (dim !== 'criterion') return DIM_PLURAL[dim]
  const levels = new Set(pivot.selectedNodes.map((entry) => entry.level))
  return levels.size === 1 ? LEVEL_PLURAL[[...levels][0]] : DIM_PLURAL.criterion
}

function sentenceFor(pivot: Pivot): Phrase[] {
  const term = (dim: Dim): Phrase[] => {
    const keys = pivot.selection[dim]
    if (keys.length === 0 || keys[0] === ANY) return []
    if (keys.length === 1) return [{ text: labelFor(pivot, dim, keys[0]), kind: 'value' }]
    if (keys.length === 2)
      return [
        { text: labelFor(pivot, dim, keys[0]), kind: 'pinned' },
        { text: 'and' },
        { text: labelFor(pivot, dim, keys[1]), kind: 'pinned' },
      ]
    return [{ text: `all ${keys.length} ${pluralFor(pivot, dim)}`, kind: 'pinned' }]
  }
  const place = term('place')
  const period = term('period')
  return [
    { text: pivot.varying.length === 0 ? 'Showing' : 'Comparing' },
    ...term('criterion'),
    { text: 'under' },
    ...term('scenario'),
    ...(place.length ? [{ text: 'across' }, ...place] : []),
    ...(period.length ? [{ text: 'in' }, ...period] : []),
  ]
}
