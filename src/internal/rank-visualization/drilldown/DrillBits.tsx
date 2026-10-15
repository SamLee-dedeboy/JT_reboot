// Shared building blocks for the two drill-down designs (4a, 4b). Both read the
// same tree and the same selection state, so the only difference between them is
// where place and period live — which is the thing under review.
//
// One rule runs through all of it: the blue/orange score palette is reserved for
// −5…+5 criterion scores. A measurement — a percentage, an acreage, a dollar
// figure, the water-age ladder — is drawn in one neutral ink, so descending from a
// score to its evidence is visible as a change of material, not just of number.
import { Box, ButtonBase, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import type { ReactNode } from 'react'
import { cellFill, toPct } from '../data'
import type { Score } from '../data'
import TeamIcon from '../components/TeamIcon'
import { TRACK_HEIGHT } from '../components/layout'
import { useTeams } from '../components/teamPalette'
import {
  DRILL_SCENARIOS,
  EDGE_LABEL,
  PROVENANCE_LABEL,
  SCENARIO_NAME,
  fmtValue,
  resolve,
} from './model'
import type { CriterionNode, EdgeKind, Facet, Provenance, ScenarioKey, Unit } from './model'
import type { TeamKey } from '../data'
import { CONTROL_PANEL_WIDTH, DRILL_ROW_COLUMNS, LADDER_MAX, domainFor } from './scales'
import type { Domain } from './scales'
import { WATER_AGE_MONTHS, WATER_AGE_REGIONS } from './ejWaterAge'

// ---------- controls ----------

/**
 * The subteam's icon in its own colour: the page's single marker for "this belongs
 * to subteam X". It has to appear in every place a subteam is named — sidebar,
 * breadcrumb, state readout and table headers — or the reader cannot tell which
 * parts of the screen are about the same thing.
 */
export function TeamMark({ team, size = 13 }: { team: TeamKey; size?: number }) {
  const teams = useTeams()
  const color = teams.find((entry) => entry.key === team)?.color
  // A span, not a div: the mark also sits inside the state sentence's <p>.
  return (
    <Box component="span" sx={{ color, display: 'inline-flex', flex: 'none' }}>
      <TeamIcon team={team} size={size} />
    </Box>
  )
}

/** A pill in any of the facet rows. Active pills carry the page's primary. */
function Pill({
  active,
  onClick,
  label,
  swatch,
  dim = false,
}: {
  active: boolean
  onClick: () => void
  label: ReactNode
  swatch?: ReactNode
  /** Offered but empty under the current node — still clickable, visibly inert. */
  dim?: boolean
}) {
  return (
    <ButtonBase
      onClick={onClick}
      role="radio"
      aria-checked={active}
      sx={{
        typography: 'controlLabel',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.6,
        px: 1.1,
        py: 0.55,
        borderRadius: 999,
        border: 1,
        borderColor: active ? 'primary.main' : 'border.strong',
        bgcolor: active ? 'primary.main' : 'transparent',
        color: active ? 'common.black' : dim ? 'base.300' : 'base.50',
        whiteSpace: 'nowrap',
        transition: 'background-color 150ms ease, border-color 150ms ease, color 150ms ease',
        '&:hover, &.Mui-focusVisible': { borderColor: 'primary.main' },
      }}
    >
      {swatch}
      {label}
    </ButtonBase>
  )
}

/**
 * One labelled control row, stacked for the sidebar: name and effect on one line,
 * controls under them. `status` says, in words, what this control is doing to the
 * view right now — a row whose control cannot change anything says so instead of
 * looking identical to one that can.
 */
export function FacetRow({
  label,
  status,
  inert = false,
  children,
}: {
  label: string
  /** What this control does to the current view. */
  status?: string
  /** True when the control has no effect here; the row dims. */
  inert?: boolean
  children: ReactNode
}) {
  return (
    <Box
      sx={{
        display: 'grid',
        gap: 0.6,
        opacity: inert ? 0.5 : 1,
        transition: 'opacity 150ms ease',
      }}
    >
      <Box
        sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 1 }}
      >
        <Typography variant="chartColumnHead">{label}</Typography>
        {status && (
          <Typography variant="chartAxis" sx={{ color: 'base.300', textAlign: 'right' }}>
            {status}
          </Typography>
        )}
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 0.6 }}>
        {children}
      </Box>
    </Box>
  )
}

/**
 * The view switcher. Each option is named by what it puts on screen rather than
 * by which dimension is pinned, and the active one explains itself underneath —
 * "Focus: Criterion" told the reader nothing about the table they were about to get.
 */
export function ViewSwitcher<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { key: T; label: string; outcome: string }[]
  value: T
  onChange: (key: T) => void
}) {
  const current = options.find((option) => option.key === value)
  return (
    <Box sx={{ display: 'grid', gap: 0.75 }}>
      <Typography variant="chartColumnHead">View</Typography>
      <Box sx={{ display: 'grid', gap: 0.5 }}>
        {options.map((option) => (
          <ButtonBase
            key={option.key}
            onClick={() => onChange(option.key)}
            role="radio"
            aria-checked={option.key === value}
            sx={{
              typography: 'controlLabel',
              justifyContent: 'flex-start',
              textAlign: 'left',
              px: 1.1,
              py: 0.7,
              borderRadius: 1,
              border: 1,
              borderColor: option.key === value ? 'primary.main' : 'border.strong',
              bgcolor: option.key === value ? 'primary.main' : 'transparent',
              color: option.key === value ? 'common.black' : 'base.50',
              transition: 'background-color 150ms ease, border-color 150ms ease, color 150ms ease',
              '&:hover, &.Mui-focusVisible': { borderColor: 'primary.main' },
            }}
          >
            {option.label}
          </ButtonBase>
        ))}
      </Box>
      {current && (
        <Typography variant="chartAxis" sx={{ color: 'base.100' }}>
          {current.outcome}
        </Typography>
      )}
    </Box>
  )
}

/**
 * A fragment of the state sentence. Plain text is connective tissue; `value` is a
 * selection the reader made; `pinned` is the dimension being held still, which the
 * grammar already implies and the colour confirms.
 */
export interface Phrase {
  text: string
  kind?: 'value' | 'pinned'
  /** Subteam mark, drawn inside the emphasised run so it reads as part of the term. */
  icon?: ReactNode
}

/**
 * The state readout, as one sentence: "Comparing ALL SIX SCENARIOS on SPECIES
 * FUNDAMENTAL NICHES across DELTA-WIDE in 2019 · WET". Three labelled chips made the
 * reader assemble the meaning themselves, and could not say *how* the dimensions
 * related — a sentence carries the verb, so it states what the table is doing.
 */
export function NowShowing({ parts }: { parts: Phrase[] }) {
  return (
    <Box
      sx={(theme) => ({
        display: 'grid',
        gap: 0.6,
        px: theme.jtSpacing.component.sm,
        py: theme.jtSpacing.component.sm,
        borderRadius: 1.5,
        bgcolor: 'translucent.100',
      })}
    >
      <Typography variant="eyebrow">Now showing</Typography>
      <Typography variant="body2" component="p" sx={{ color: 'base.100', m: 0 }}>
        {parts.map((part, i) => {
          // A fragment that opens with punctuation closes the clause before it, so it
          // must not inherit the word space every other fragment gets.
          const lead = i > 0 && !/^[,.;:)]/.test(part.text) ? ' ' : ''
          if (!part.kind)
            return (
              <Box key={i} component="span">
                {`${lead}${part.text}`}
              </Box>
            )
          return (
            <Box
              key={i}
              component="span"
              sx={{
                typography: 'chartSentenceValue',
                color: part.kind === 'pinned' ? 'primary.main' : 'common.white',
                whiteSpace: part.icon ? 'nowrap' : undefined,
              }}
            >
              {lead}
              {part.icon && (
                <Box component="span" sx={{ mr: 0.5, verticalAlign: '-2px' }}>
                  {part.icon}
                </Box>
              )}
              {part.text}
            </Box>
          )
        })}
      </Typography>
    </Box>
  )
}

export function ScenarioRow({
  value,
  onChange,
  status,
  inert = false,
}: {
  value: ScenarioKey
  onChange: (key: ScenarioKey) => void
  status?: string
  inert?: boolean
}) {
  return (
    <FacetRow label="Scenario" status={status} inert={inert}>
      {DRILL_SCENARIOS.map((scenario) => (
        <Pill
          key={scenario.key}
          active={scenario.key === value}
          onClick={() => onChange(scenario.key)}
          label={scenario.name}
        />
      ))}
    </FacetRow>
  )
}

/**
 * A place or period row. `effective` is the slice the view actually resolved,
 * which is what gets marked selected — so the control can never disagree with
 * the table. There is no "Any": a node either cuts along this axis or it does not.
 */
export function SliceRow({
  label,
  facets,
  effective,
  onChange,
  supported,
}: {
  label: string
  facets: Facet[]
  effective: string
  onChange: (key: string) => void
  supported: boolean
}) {
  if (!supported || facets.length === 0) {
    return (
      <FacetRow label={label} inert status="this criterion has one value">
        <Typography variant="controlLabel" sx={{ color: 'base.300' }}>
          Not broken out here
        </Typography>
      </FacetRow>
    )
  }
  return (
    <FacetRow label={label} status={`${facets.length} available`}>
      {facets.map((facet) => (
        <Pill
          key={facet.key}
          active={facet.key === effective}
          onClick={() => onChange(facet.key)}
          label={facet.label}
        />
      ))}
    </FacetRow>
  )
}

const LEVEL_LABEL: Record<CriterionNode['level'], string> = {
  team: 'Subteam',
  metric: 'Metric',
  entity: 'Measurement',
}

const LEVEL_ORDER: CriterionNode['level'][] = ['team', 'metric', 'entity']

/**
 * How deep you are, and whether there is anywhere further to go. It shows only the
 * levels this view lets you *stand on*: the profile view can never rest on a
 * measurement, so drawing a Measurement segment there would advertise a step the
 * view refuses to take. It sits with the navigation rather than over the table, so
 * cause and effect are adjacent — the ladder ends, the list below it greys out.
 */
export function DepthLadder({
  level,
  deepest = 'entity',
  childCount,
  openableCount,
}: {
  level?: CriterionNode['level']
  /** Deepest level this view can stand on. */
  deepest?: CriterionNode['level']
  /** Children the tree holds here. */
  childCount: number
  /** Children this view can open; fewer than childCount where the view stops short. */
  openableCount: number
}) {
  // Normally the ladder stops at `deepest`. If the reader is already deeper — they
  // switched views while standing on a measurement — show where they actually are.
  const limit = Math.max(LEVEL_ORDER.indexOf(deepest), level ? LEVEL_ORDER.indexOf(level) : -1)
  const steps = LEVEL_ORDER.slice(0, limit + 1)
  const reached = level ? steps.indexOf(level) : -1
  const status =
    childCount === 0
      ? 'bottom of the tree'
      : openableCount === 0
        ? `${childCount} below, shown as rows`
        : reached < 0
          ? `${openableCount} subteams`
          : `${openableCount} ${openableCount === 1 ? 'way' : 'ways'} deeper`

  return (
    <FacetRow label="Depth" status={status}>
      <Box sx={{ display: 'grid', gap: 0.5, width: '100%' }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: `repeat(${steps.length}, 1fr)`,
            columnGap: 0.5,
          }}
        >
          {steps.map((step, i) => (
            <Box
              key={step}
              sx={(theme) => ({
                height: 4,
                borderRadius: 999,
                bgcolor:
                  i === reached
                    ? theme.palette.primary.main
                    : i < reached
                      ? theme.palette.base[300]
                      : theme.chart.voting.drill.measureTrack,
              })}
            />
          ))}
        </Box>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: `repeat(${steps.length}, 1fr)`,
            columnGap: 0.5,
          }}
        >
          {steps.map((step, i) => (
            <Typography
              key={step}
              variant="chartAxis"
              sx={{ color: i === reached ? 'primary.main' : i < reached ? 'base.100' : 'base.400' }}
            >
              {LEVEL_LABEL[step]}
            </Typography>
          ))}
        </Box>
      </Box>
    </FacetRow>
  )
}

/**
 * The criterion axis, split into the two things the old single row conflated:
 * **Up** is the path you are standing on, as plain crumbs you can click to
 * re-anchor; **Into** is where you can go next. Separating them is the whole
 * point — a reader could not tell state from navigation when both were pills.
 */
export function CriterionAxis({
  path,
  childNodes,
  onPick,
  rootId,
  rootLabel = 'All five subteams',
  status,
  deepestLevel,
  isChildClosed,
  closedNote,
}: {
  path: CriterionNode[]
  childNodes: CriterionNode[]
  onPick: (id: string) => void
  rootId: string
  rootLabel?: string
  /** What the criterion axis is doing to the current view; defaults to its depth. */
  status?: string
  /** Deepest level this view can stand on; the depth ladder stops there. */
  deepestLevel?: CriterionNode['level']
  /** True for a child this view cannot open — it is offered greyed, not clickable. */
  isChildClosed?: (node: CriterionNode) => boolean
  /** One line under the list saying why those options are closed. */
  closedNote?: string
}) {
  const closed = (node: CriterionNode) => isChildClosed?.(node) ?? false
  const allClosed = childNodes.length > 0 && childNodes.every(closed)
  const current = path[path.length - 1]
  const icon = (node: CriterionNode) =>
    node.level === 'team' ? <TeamMark team={node.team} /> : undefined

  return (
    <>
      <FacetRow
        label="You are at"
        status={
          status ??
          (path.length === 0 ? 'the top' : `${path.length} level${path.length > 1 ? 's' : ''} down`)
        }
      >
        <Crumb label={rootLabel} onClick={() => onPick(rootId)} active={path.length === 0} />
        {path.map((node, i) => (
          <Box key={node.id} sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.6 }}>
            <Typography variant="chartAxis" sx={{ color: 'base.300' }}>
              ›
            </Typography>
            <Crumb
              label={node.label}
              swatch={icon(node)}
              onClick={() => onPick(node.id)}
              active={i === path.length - 1}
            />
          </Box>
        ))}
      </FacetRow>

      <DepthLadder
        level={current?.level}
        deepest={deepestLevel}
        childCount={childNodes.length}
        openableCount={childNodes.filter((child) => !closed(child)).length}
      />

      <FacetRow
        label="Drill into"
        inert={childNodes.length === 0 || allClosed}
        status={
          childNodes.length === 0
            ? 'nothing deeper'
            : allClosed
              ? 'nothing to open here'
              : `${childNodes.length} ${childNodes.length === 1 ? 'option' : 'options'}`
        }
      >
        {childNodes.length === 0 ? (
          <Typography variant="controlLabel" sx={{ color: 'base.300' }}>
            This measurement is at the bottom of the tree
          </Typography>
        ) : allClosed ? (
          // A column of greyed rows nobody can click is worse than the dead end it
          // replaced; one sentence says the same thing and gives the sidebar back.
          <Typography variant="chartAxis" sx={{ color: 'base.300' }}>
            {closedNote}
          </Typography>
        ) : (
          <Box sx={{ display: 'grid', gap: 0.4, width: '100%' }}>
            {childNodes.map((child) => (
              <DrillOption
                key={child.id}
                label={child.label}
                swatch={icon(child)}
                onClick={() => onPick(child.id)}
                closed={closed(child)}
              />
            ))}
          </Box>
        )}
      </FacetRow>
    </>
  )
}

/** One row of the drill-into menu: full width, so long criterion names stay readable. */
function DrillOption({
  label,
  swatch,
  onClick,
  closed = false,
}: {
  label: string
  swatch?: ReactNode
  onClick: () => void
  /** This view has nothing behind the option, so it is shown but not clickable. */
  closed?: boolean
}) {
  return (
    <ButtonBase
      onClick={onClick}
      disabled={closed}
      sx={{
        typography: 'controlLabel',
        display: 'flex',
        alignItems: 'center',
        gap: 0.75,
        width: '100%',
        px: 1,
        py: 0.6,
        borderRadius: 1,
        border: 1,
        borderColor: 'border.default',
        color: 'base.50',
        textAlign: 'left',
        transition: 'background-color 150ms ease, border-color 150ms ease, color 150ms ease',
        '&:hover, &.Mui-focusVisible': {
          bgcolor: 'translucent.100',
          borderColor: 'primary.main',
          color: 'common.white',
        },
        '&.Mui-disabled': { opacity: 0.4, color: 'base.300' },
      }}
    >
      {swatch}
      <Box component="span" sx={{ flex: 1 }}>
        {label}
      </Box>
      <Box component="span" sx={{ color: 'base.300' }}>
        {closed ? '·' : '›'}
      </Box>
    </ButtonBase>
  )
}

/** A crumb on the path: text, not a pill, so state never looks like a choice. */
function Crumb({
  label,
  swatch,
  onClick,
  active,
}: {
  label: string
  swatch?: ReactNode
  onClick: () => void
  active: boolean
}) {
  return (
    <ButtonBase
      onClick={onClick}
      aria-current={active ? 'true' : undefined}
      sx={{
        typography: 'chartLabel',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.6,
        px: 0.75,
        py: 0.4,
        borderRadius: 1,
        color: active ? 'common.white' : 'base.100',
        borderBottom: 2,
        borderColor: active ? 'primary.main' : 'transparent',
        transition: 'color 150ms ease, border-color 150ms ease',
        '&:hover, &.Mui-focusVisible': { color: 'common.white', borderColor: 'border.strong' },
      }}
    >
      {swatch}
      {label}
    </ButtonBase>
  )
}

/**
 * The profile view's dead end. A measurement has no parts, so "break this scenario
 * into its parts" has nothing to show — which rendered as column headers over an
 * empty table. Say why, and offer the two moves that do have something behind them.
 */
export function NothingToBreakDown({
  label,
  onCompare,
  onUp,
  upLabel,
}: {
  label: string
  onCompare: () => void
  onUp?: () => void
  upLabel?: string
}) {
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
        <Box component="span" sx={{ color: 'common.white' }}>
          {label}
        </Box>{' '}
        is a measurement at the bottom of the tree and has no parts, so this view has no rows; its
        value appears in the sentence above.
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
        <Pill active={false} onClick={onCompare} label="Compare it across all six scenarios" />
        {onUp && upLabel && <Pill active={false} onClick={onUp} label={`Back up to ${upLabel}`} />}
      </Box>
    </Box>
  )
}

/**
 * The compare view's dead end. A metric that was never scored, or whose numbers
 * live in its children, renders six identically empty rows — a table that looks
 * like missing data when it is really a structural fact. Say which it is.
 */
export function NothingToCompare({
  label,
  childCount,
  onDrill,
}: {
  label: string
  /** Measurements inside this node, if the numbers live one level down. */
  childCount: number
  onDrill?: () => void
}) {
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
        <Box component="span" sx={{ color: 'common.white' }}>
          {label}
        </Box>{' '}
        {childCount > 0
          ? `has no value at this level; the ${childCount} measurements inside it have values instead.`
          : 'appears in the reports but was never scored, so there is no value to compare across scenarios.'}
      </Typography>
      {childCount > 0 && onDrill && (
        <Pill active={false} onClick={onDrill} label="Open the first measurement" />
      )}
    </Box>
  )
}

/** Divider inside the control panel, separating the readout from the controls. */
export function ControlDivider({ label }: { label: string }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mt: 0.5 }}>
      <Typography variant="chartColumnHead" sx={{ color: 'base.300' }}>
        {label}
      </Typography>
      <Box sx={{ flex: 1, height: '1px', bgcolor: 'border.default' }} />
    </Box>
  )
}

/**
 * Two columns: controls on the left, the view on the right. Keeping them side by
 * side is the point — a control and the table it changes are in one screen, so a
 * click's effect is visible without scrolling. Below `md` it stacks.
 */
export function DrillLayout({ controls, view }: { controls: ReactNode; view: ReactNode }) {
  return (
    <Box
      sx={(theme) => ({
        display: 'grid',
        gridTemplateColumns: {
          xs: 'minmax(0, 1fr)',
          md: `${CONTROL_PANEL_WIDTH}px minmax(0, 1fr)`,
        },
        columnGap: theme.jtSpacing.gap.md,
        rowGap: theme.jtSpacing.component.md,
        alignItems: 'start',
      })}
    >
      {controls}
      <Box sx={{ minWidth: 0 }}>{view}</Box>
    </Box>
  )
}

/**
 * The control sidebar. Sticky, and capped to the viewport with its own scroll, so
 * a deep node's long option lists never push the table out of view.
 */
export function ControlPanel({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={(theme) => ({
        display: 'grid',
        gap: theme.jtSpacing.component.sm,
        p: theme.jtSpacing.component.sm,
        borderRadius: 2,
        border: 1,
        borderColor: 'border.default',
        bgcolor: theme.chart.voting.well,
        position: { md: 'sticky' },
        top: { md: theme.spacing(2) },
        maxHeight: { md: `calc(100vh - ${theme.spacing(4)})` },
        overflowY: { md: 'auto' },
      })}
    >
      {children}
    </Box>
  )
}

// ---------- value rendering ----------

/**
 * One value as a bar. Scores (and only scores) use the diverging blue/orange
 * scale; every measurement is neutral ink so the change of units is visible.
 */
export function ValueBar({
  value,
  domain,
  centered,
}: {
  value: Score
  domain: Domain
  /** Signed values grow from the middle; magnitudes grow from the left. */
  centered: boolean
}) {
  const isScore = domain.unit === 'score'
  const span =
    domain.unit === 'share'
      ? (value ?? 0) * 100
      : domain.unit === 'ladder'
        ? (Math.abs(value ?? 0) / LADDER_MAX) * 50
        : isScore
          ? Math.abs(toPct(value ?? 0) - 50)
          : (Math.abs(value ?? 0) / domain.max) * (centered ? 50 : 100)

  // Three states that must never look alike: no number at all (dashed, empty),
  // a measured zero (a mark on the baseline), and a value (a bar). A zero draws
  // no bar by definition, so without the mark it is indistinguishable from a gap.
  const missing = value === null
  const zero = value === 0

  return (
    <Box
      sx={(theme) => ({
        position: 'relative',
        height: TRACK_HEIGHT,
        borderRadius: 1,
        bgcolor: missing ? 'transparent' : theme.chart.voting.drill.measureTrack,
        border: missing ? 1 : 0,
        borderStyle: 'dashed',
        borderColor: 'border.default',
        overflow: 'hidden',
      })}
    >
      {centered && !missing && (
        <Box
          sx={(theme) => ({
            position: 'absolute',
            left: '50%',
            top: 0,
            bottom: 0,
            borderLeft: `1px dashed ${theme.chart.voting.zeroLine}`,
          })}
        />
      )}
      {zero && (
        <Box
          sx={(theme) => ({
            position: 'absolute',
            top: 5,
            bottom: 5,
            width: '3px',
            borderRadius: 0.5,
            bgcolor: theme.chart.voting.overall,
            ...(centered ? { left: 'calc(50% - 1.5px)' } : { left: 0 }),
          })}
        />
      )}
      {!missing && !zero && (
        <Box
          sx={(theme) => ({
            position: 'absolute',
            top: 5,
            bottom: 5,
            borderRadius: 0.5,
            bgcolor: isScore ? cellFill(value) : theme.chart.voting.drill.measure,
            opacity: isScore ? 1 : 0.85,
            ...(centered
              ? value >= 0
                ? { left: '50%', width: `${span}%` }
                : { right: '50%', width: `${span}%` }
              : { left: 0, width: `${Math.min(100, span)}%` }),
          })}
        />
      )}
    </Box>
  )
}

export function EdgeBadge({ edge }: { edge?: EdgeKind }) {
  // Always occupies its grid cell, so a row without a relation stays in column.
  if (!edge) return <Box />
  return (
    <Typography
      variant="chartAxis"
      sx={(theme) => ({
        justifySelf: 'start',
        px: 0.75,
        py: 0.25,
        borderRadius: 999,
        border: 1,
        borderColor: alpha(theme.chart.voting.drill.edge[edge], 0.5),
        color: theme.chart.voting.drill.edge[edge],
        whiteSpace: 'nowrap',
      })}
    >
      {EDGE_LABEL[edge]}
    </Typography>
  )
}

export function ProvenanceChip({
  provenance,
  absent = false,
}: {
  provenance: Provenance
  /** No number in this cell: the node's provenance describes nothing, so say so. */
  absent?: boolean
}) {
  const label = absent && provenance !== 'unscored' ? 'pending' : PROVENANCE_LABEL[provenance]
  return (
    <Typography
      variant="chartAxis"
      sx={{
        textAlign: 'right',
        color: !absent && provenance === 'reported' ? 'base.100' : 'base.300',
        fontStyle: provenance === 'inferred' ? 'italic' : undefined,
      }}
    >
      {label}
    </Typography>
  )
}

interface DrillRowProps {
  label: ReactNode
  edge?: EdgeKind
  value: Score
  unit: Unit
  domain: Domain
  provenance: Provenance
  /** Why there is no number here, shown instead of a bar. */
  gap?: string
  onClick?: () => void
  /** Nesting depth; a ticked child sits under its ticked parent. */
  indent?: number
  /** Which slice this row's value actually came from, when it is not the one asked for. */
  slice?: string
  /** Set when this row names a subteam, or sits in a block that mixes subteams. */
  team?: TeamKey
  /**
   * Reserves a leading twisty. Present with no `onToggle` it renders as a spacer,
   * so a block where only some rows can expand still lines its labels up.
   */
  expand?: { open: boolean; onToggle?: () => void; label?: string }
}

/** One row in either design: the same anatomy whatever is pinned. */
export function DrillRow({
  label,
  edge,
  value,
  unit,
  domain,
  provenance,
  gap,
  onClick,
  indent = 0,
  slice,
  team,
  expand,
}: DrillRowProps) {
  const centered = unit !== 'share' && unit !== 'acres'
  const row = (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: DRILL_ROW_COLUMNS,
        columnGap: 1.5,
        alignItems: 'center',
        width: '100%',
        pl: indent * 2,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.6, minWidth: 0 }}>
        {team && (
          <Box sx={{ alignSelf: 'center' }}>
            <TeamMark team={team} size={13} />
          </Box>
        )}
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="chartLabel" sx={{ display: 'block', textAlign: 'left' }}>
            {label}
          </Typography>
          {slice && (
            <Typography variant="chartAxis" sx={{ display: 'block', color: 'base.300' }}>
              {slice}
            </Typography>
          )}
        </Box>
      </Box>
      <EdgeBadge edge={edge} />
      {gap ? (
        <Typography variant="chartAxis" sx={{ color: 'base.300' }}>
          {gap}
        </Typography>
      ) : (
        <ValueBar value={value} domain={domain} centered={centered} />
      )}
      <Typography
        variant="chartValue"
        sx={{ textAlign: 'right', color: value === null ? 'base.300' : 'common.white' }}
      >
        {value === null ? '—' : fmtValue(value, unit)}
      </Typography>
      <ProvenanceChip provenance={provenance} absent={value === null} />
    </Box>
  )
  const body = onClick ? (
    <ButtonBase
      onClick={onClick}
      sx={{
        display: 'block',
        width: '100%',
        textAlign: 'left',
        borderRadius: 1,
        px: 0.5,
        mx: -0.5,
        '&:hover, &.Mui-focusVisible': { bgcolor: 'translucent.100' },
      }}
    >
      {row}
    </ButtonBase>
  ) : (
    row
  )
  // The twisty sits outside the row's own button: a button inside a button is not
  // valid markup, and expanding is a different act from choosing the row.
  if (!expand) return body
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
      {expand.onToggle ? (
        <ButtonBase
          onClick={expand.onToggle}
          aria-expanded={expand.open}
          aria-label={`${expand.open ? 'Collapse' : 'Expand'} ${expand.label ?? 'this row'}`}
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
          {expand.open ? '▾' : '▸'}
        </ButtonBase>
      ) : (
        <Box sx={{ flex: 'none', width: 16 }} />
      )}
      <Box sx={{ flex: 1, minWidth: 0 }}>{body}</Box>
    </Box>
  )
}

/** Column heads for a block of DrillRows. */
export function DrillHead({
  first,
  units,
  team,
  gutter,
}: {
  first: string
  units: string
  /** Set when every row in this block belongs to one subteam. */
  team?: TeamKey
  /** Matches the twisty slot on the rows below, so the columns still line up. */
  gutter?: boolean
}) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: DRILL_ROW_COLUMNS,
        columnGap: 1.5,
        alignItems: 'end',
        pb: 0.75,
        mb: 0.75,
        ml: gutter ? '18px' : 0,
        borderBottom: 1,
        borderColor: 'border.default',
      }}
    >
      <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.6, minWidth: 0 }}>
        {team && <TeamMark team={team} size={12} />}
        <Typography variant="chartColumnHead" noWrap>
          {first}
        </Typography>
      </Box>
      <Typography variant="chartColumnHead">Relation</Typography>
      <Typography variant="chartColumnHead">{units}</Typography>
      <Typography variant="chartColumnHead" sx={{ textAlign: 'right' }}>
        Value
      </Typography>
      <Typography variant="chartColumnHead" sx={{ textAlign: 'right' }}>
        Source
      </Typography>
    </Box>
  )
}

/**
 * What the current node is, in prose, above its table. The headline moved into
 * NowShowing inside the control panel, so this carries only the explanation.
 */
export function ViewNote({ children, below }: { children?: ReactNode; below?: boolean }) {
  if (!children) return null
  return (
    <Typography
      variant="body2"
      sx={{
        display: 'block',
        ...(below ? { mt: 2 } : { mb: 2 }),
        maxWidth: '78ch',
        color: 'base.100',
      }}
    >
      {children}
    </Typography>
  )
}

/**
 * Water age by region and month: a tiny diverging bar per cell, up from the
 * midline where water gets younger, down where it gets older. Empty cells are
 * months the report does not cover, not months with no change.
 */
export function WaterAgeGrid({ node, scenario }: { node: CriterionNode; scenario: ScenarioKey }) {
  const series = node.values[scenario]
  return (
    <Box sx={{ display: 'grid', gap: 0.5 }}>
      {/* The grid spends both axes on region and month, so it can only hold one
          scenario. It names that scenario itself, because the view around it is
          usually showing all six. */}
      <Typography variant="chartColumnHead" sx={{ mb: 0.5 }}>
        {SCENARIO_NAME[scenario]} · one scenario at a time
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: `180px repeat(${WATER_AGE_MONTHS.length}, minmax(0, 1fr))`,
          columnGap: 0.5,
        }}
      >
        <Box />
        {WATER_AGE_MONTHS.map((month) => (
          <Typography key={month.key} variant="chartAxis" sx={{ textAlign: 'center' }}>
            {month.label}
          </Typography>
        ))}
      </Box>
      {WATER_AGE_REGIONS.map((region) => (
        <Box
          key={region.key}
          sx={{
            display: 'grid',
            gridTemplateColumns: `180px repeat(${WATER_AGE_MONTHS.length}, minmax(0, 1fr))`,
            columnGap: 0.5,
            alignItems: 'center',
          }}
        >
          <Typography variant="chartLabel">{region.label}</Typography>
          {WATER_AGE_MONTHS.map((month) => {
            const value = series?.[`${region.key}|${month.key}`]
            const missing = value === undefined
            return (
              <Box
                key={month.key}
                title={
                  missing
                    ? `${region.label}, ${month.label}: not covered`
                    : `${region.label}, ${month.label}: ${fmtValue(value ?? 0, 'ladder')}`
                }
                sx={(theme) => ({
                  position: 'relative',
                  height: 34,
                  borderRadius: 0.5,
                  bgcolor: missing ? 'transparent' : theme.chart.voting.drill.measureTrack,
                  border: missing ? 1 : 0,
                  borderStyle: 'dotted',
                  borderColor: 'border.default',
                })}
              >
                {!missing && value !== null && value !== 0 && (
                  <Box
                    sx={(theme) => ({
                      position: 'absolute',
                      left: 3,
                      right: 3,
                      bgcolor: theme.chart.voting.drill.measure,
                      opacity: 0.9,
                      ...(value > 0
                        ? { bottom: '50%', height: `${(value / LADDER_MAX) * 46}%` }
                        : { top: '50%', height: `${(Math.abs(value) / LADDER_MAX) * 46}%` }),
                    })}
                  />
                )}
                {!missing && (
                  <Box
                    sx={(theme) => ({
                      position: 'absolute',
                      left: 2,
                      right: 2,
                      top: '50%',
                      borderTop: `1px solid ${theme.chart.voting.zeroLine}`,
                    })}
                  />
                )}
              </Box>
            )
          })}
        </Box>
      ))}
      <Typography variant="chartAxis" sx={{ mt: 0.5, color: 'base.100' }}>
        Bars above the midline mean younger water, while bars below mean older water and a higher
        risk of harmful algal blooms; dotted cells are not covered by the report.
      </Typography>
    </Box>
  )
}

/**
 * Rows = scenarios, columns = one slice axis of the node. Used by 4b as the
 * within-view breakdown, where place and period are not top-level controls.
 */
export function SliceMatrix({
  node,
  axis,
  otherKey,
  axisIsPeriod,
}: {
  node: CriterionNode
  axis: Facet[]
  /** The fixed key on the other slice axis. */
  otherKey: string
  axisIsPeriod: boolean
}) {
  const values: Score[] = []
  for (const scenario of DRILL_SCENARIOS) {
    for (const facet of axis) {
      const { value } = resolve(
        node,
        scenario.key,
        axisIsPeriod ? otherKey : facet.key,
        axisIsPeriod ? facet.key : otherKey,
      )
      values.push(value)
    }
  }
  const domain = domainFor(node.unit, values)
  const columns = `180px repeat(${axis.length}, minmax(0, 1fr))`

  return (
    <Box sx={{ display: 'grid', gap: 0.5 }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: columns, columnGap: 0.75 }}>
        <Box />
        {axis.map((facet) => (
          <Typography key={facet.key} variant="chartAxis" sx={{ textAlign: 'center' }}>
            {facet.label}
          </Typography>
        ))}
      </Box>
      {DRILL_SCENARIOS.map((scenario) => (
        <Box
          key={scenario.key}
          sx={{
            display: 'grid',
            gridTemplateColumns: columns,
            columnGap: 0.75,
            alignItems: 'center',
          }}
        >
          <Typography variant="chartLabel">{scenario.name}</Typography>
          {axis.map((facet) => {
            const { value } = resolve(
              node,
              scenario.key,
              axisIsPeriod ? otherKey : facet.key,
              axisIsPeriod ? facet.key : otherKey,
            )
            return (
              <Box key={facet.key} sx={{ display: 'grid', gap: 0.4 }}>
                <ValueBar
                  value={value}
                  domain={domain}
                  centered={node.unit !== 'share' && node.unit !== 'acres'}
                />
                <Typography
                  variant="chartAxis"
                  sx={{ textAlign: 'center', color: value === null ? 'base.300' : 'base.50' }}
                >
                  {value === null ? '—' : fmtValue(value, node.unit)}
                </Typography>
              </Box>
            )
          })}
        </Box>
      ))}
    </Box>
  )
}
