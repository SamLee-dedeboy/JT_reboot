// Shared building blocks for the drill-down (4c) and the by-subteam pages.
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
import { DRILL_SCENARIOS, EDGE_LABEL, PROVENANCE_LABEL, fmtValue } from './model'
import type { EdgeKind, Provenance, ScenarioKey, Unit } from './model'
import type { TeamKey } from '../data'
import { CONTROL_PANEL_WIDTH, DRILL_ROW_COLUMNS, LADDER_MAX } from './scales'
import type { Domain } from './scales'

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
