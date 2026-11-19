// The path tree: six scenario lanes on the left branch off top to bottom, and each aligned
// action is one path running right from them, ending in a mark colored by strategy area. A
// path is as long as the action's average score (or, with a scenario pinned, that
// scenario's own score), so the strongest actions reach furthest toward the lead
// organizations' lanes on the right.
import { Box, ButtonBase, Typography, useTheme } from '@mui/material'
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { SCENARIO_NAMES, scenarioName } from '@/content/names'
import { jtSpacing } from '@/theme'
import { focusRing } from '@/ui/focusRing'
import { LEADS, PATH_SECTION, SCORE_MEANING } from '../content'
import { ACTIONS } from '../data/actions'
import type { GovernanceScenarioKey, LeadKey } from '../data/types'
import {
  SCORE_LEVELS,
  averageScore,
  layoutTree,
  topActionIds,
  type TreeMetrics,
} from '../model/pathTree'
import ActionMark from './ActionMark'
import ActionTooltip from './ActionTooltip'
import LeadName from './LeadName'
import LeadTooltip from './LeadTooltip'

/** The zone heads' height: each zone's tint starts under its rule. */
const ZONE_HEAD = 24

const WIDE: TreeMetrics = {
  top: 200,
  rowHeight: 12,
  groupGap: 7,
  segmentGap: 34,
  branchDrop: 14,
  bottom: 8,
  // Only padding: the band's label sits in the branch-label column.
  bandHead: 4,
}
const NARROW: TreeMetrics = {
  top: 140,
  rowHeight: 11,
  groupGap: 6,
  segmentGap: 52,
  branchDrop: 14,
  bottom: 8,
  // Narrow screens have no label column, so the label takes a line in the band.
  bandHead: 18,
}
const TOP_ACTIONS = topActionIds(ACTIONS)

function useElementWidth(initial: number) {
  const [element, setElement] = useState<HTMLElement | null>(null)
  const [width, setWidth] = useState(initial)
  useEffect(() => {
    if (!element) return undefined
    const update = () => setWidth(element.getBoundingClientRect().width)
    update()
    if (typeof ResizeObserver === 'undefined') return undefined
    const observer = new ResizeObserver(update)
    observer.observe(element)
    return () => observer.disconnect()
  }, [element])
  return [setElement, width] as const
}

export default function ActionPathTree({
  pinned,
  onPin,
  lead,
  onLead,
}: {
  pinned: GovernanceScenarioKey | null
  onPin: (key: GovernanceScenarioKey | null) => void
  /** A highlighted lead organization: its actions stay bright, with leaders to its lane. */
  lead: LeadKey | null
  onLead: (key: LeadKey | null) => void
}) {
  const theme = useTheme()
  const tokens = theme.chart.governance
  const [setHost, width] = useElementWidth(960)
  const narrow = width < theme.breakpoints.values.sm
  // The lead names run upright over their lanes; the tree starts low enough to fit the
  // tallest, measured once fonts have loaded.
  const leadLabels = useRef<HTMLElement[]>([])
  const [leadRoom, setLeadRoom] = useState(0)
  useLayoutEffect(() => {
    const measure = () =>
      setLeadRoom(
        Math.max(0, ...leadLabels.current.map((el) => el?.getBoundingClientRect().height ?? 0)),
      )
    measure()
    let live = true
    document.fonts?.ready.then(() => live && measure())
    return () => {
      live = false
    }
  }, [narrow, width])
  const base = narrow ? NARROW : WIDE
  const top = narrow ? base.top : Math.max(base.top, Math.ceil(leadRoom) + 30 + ZONE_HEAD + 8)
  const metrics = useMemo(() => ({ ...base, top }), [base, top])
  const layout = useMemo(
    () => layoutTree(ACTIONS, pinned ? (action) => action.scores[pinned] : averageScore, metrics),
    [pinned, metrics],
  )
  const [hoveredLead, setHoveredLead] = useState<LeadKey | null>(null)
  // The "Exclusive" label's width, so a band starts just before it.
  const [exclusiveWidth, setExclusiveWidth] = useState(64)
  const measureExclusive = (el: HTMLElement | null) => {
    if (!el) return
    const next = Math.ceil(el.getBoundingClientRect().width)
    if (next && next !== exclusiveWidth) setExclusiveWidth(next)
  }

  const [hovered, setHovered] = useState<string | null>(null)
  const [selected, setSelected] = useState<string | null>(null)
  useEffect(() => {
    const close = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') setSelected(null)
    }
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [])

  // Geometry, left to right: the branch labels (in the gaps between segments, when narrow),
  // the scenario lanes, the paths from 0 up to 1.00, and the lead lanes (left out when
  // narrow; the lead control above stands in).
  const showLeads = !narrow
  // Wide enough for the upright names over the lanes.
  const laneGap = narrow ? 19 : 22
  const labelWidth = narrow ? 12 : 168
  // Lane 0 branches first, so it runs outermost.
  const laneX = (lane: number) => labelWidth + 18 + lane * laneGap
  const labelEnd = laneX(0) - 18
  const xZero = laneX(5) + 18
  // Without lead lanes, 1.00 sits just far enough in for its centered label.
  const leadSpace = showLeads ? 28 + (LEADS.length - 1) * laneGap + 14 : 18
  const plotWidth = Math.max(110, Math.min(640, width - xZero - leadSpace))
  const x1 = xZero + plotWidth
  const xOf = (value: number) => xZero + value * plotWidth
  const leadX = (index: number) => x1 + 28 + index * laneGap
  const height = layout.height
  const headY = metrics.top - 18
  // With room, each score level carries its meaning; otherwise the key above says it.
  const labelBlock = 120
  const spelled = plotWidth * 0.25 >= labelBlock
  // Unspelled, the centered 0.25 sits a tier higher, clear of 0.20 just left of it. Spelled,
  // 1.00 sits a tier higher, clear of 0.75's meaning.
  const raise = (level: number) => (spelled ? (level === 1 ? 38 : 0) : level === 0.25 ? 22 : 0)
  const tierBottom = (level: number) => headY - 4 - raise(level)
  // The axis title's bottom: clear of the tallest of the low score levels under it (with
  // its meaning, a value over two lines; without, 0.25's raised value).
  const axisTitleY = spelled ? tierBottom(0.2) - 60 : tierBottom(0.25) - 24
  // Spelled, 0.20's and 1.00's meanings sit left of their lines: 0.20's in the room down to
  // 0, 1.00's clear of the lead names.
  const labelWidthAt = (level: number) =>
    level === 0.2 ? Math.min(labelBlock, 0.2 * plotWidth - 10) : labelBlock
  // A one-scenario band's rows are bracketed just left of its own lane; its label sits left
  // of the bracket, joined by a short tick, and the band reaches just far enough left to
  // hold it. (The lanes to its left have already ended by then.)
  const bracketX = (lane: number) => laneX(lane) - 7
  const bandLabelRight = (lane: number) => bracketX(lane) - 12
  const bandLeft = (lane: number) =>
    narrow ? laneX(0) - 8 : bandLabelRight(lane) - exclusiveWidth - 10
  const leadIndex = (key: LeadKey) => LEADS.findIndex((entry) => entry.key === key)

  const activeId = hovered ?? selected
  const active = layout.rows.find((row) => row.action.id === activeId)
  const tooltipWidth = Math.min(560, width)
  const toggle = (id: string) => setSelected((current) => (current === id ? null : id))
  const onRowKey = (event: KeyboardEvent, id: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      toggle(id)
    }
  }
  const pinnedLane = pinned ? layout.lanes.findIndex((lane) => lane.key === pinned) : -1
  /** The actions a scenario considers that an organization leads. */
  const ledIn = (scenario: GovernanceScenarioKey, key: LeadKey) =>
    ACTIONS.filter((action) => action.scores[scenario] > 0 && action.leads.includes(key))
  const leadCardWidth = Math.min(420, width)

  // The tree's two highlighted zones: the scenario lanes and the lead lanes (the scores
  // between them carry the axis title). Narrow, the scenario head would not fit over the
  // lanes, and there are no lead lanes.
  const zones = [
    ...(narrow
      ? []
      : [
          {
            key: 'scenarios',
            label: PATH_SECTION.zones.scenarios,
            left: laneX(0) - 10,
            right: laneX(layout.lanes.length - 1) + 10,
            color: theme.palette.primary.main,
          },
        ]),
    ...(showLeads
      ? [
          {
            key: 'leads',
            label: PATH_SECTION.zones.leads,
            left: leadX(0) - 10,
            right: leadX(LEADS.length - 1) + 10,
            color: tokens.lead,
          },
        ]
      : []),
  ]

  return (
    <>
      {/* Without room on the axis, the score meanings sit above the tree instead. */}
      {!spelled && (
        <Box
          component="dl"
          sx={{
            display: 'grid',
            gridTemplateColumns: 'auto minmax(0, 1fr)',
            columnGap: jtSpacing.gap.sm,
            rowGap: jtSpacing.component.xs / 2,
            m: 0,
            mb: jtSpacing.gap.md,
          }}
        >
          {SCORE_LEVELS.map((level) => [
            <Typography
              key={`${level}-v`}
              variant="chipLabel"
              component="dt"
              sx={{ color: 'common.white', fontVariantNumeric: 'tabular-nums' }}
            >
              {level.toFixed(2)}
            </Typography>,
            <Typography
              key={`${level}-m`}
              variant="captionSmall"
              component="dd"
              sx={{ m: 0, color: 'base.100' }}
            >
              {SCORE_MEANING[level]}
            </Typography>,
          ])}
        </Box>
      )}
      <Box ref={setHost} sx={{ position: 'relative', width: '100%' }}>
        {/* Axis title: what a path's length means right now, just over the score levels. */}
        <Typography
          variant="columnHead"
          component="span"
          sx={{
            position: 'absolute',
            left: xZero,
            top: axisTitleY,
            transform: 'translateY(-100%)',
            color: 'primary.main',
          }}
        >
          {pinned ? PATH_SECTION.axisScenario(scenarioName(pinned)) : PATH_SECTION.axisAverage} →
        </Typography>

        {/* The zones' heads, each over a rule the width of its zone. */}
        {zones.map((zone) => (
          <Typography
            key={zone.key}
            variant="columnHead"
            component="span"
            sx={{
              position: 'absolute',
              left: zone.left,
              top: 0,
              width: zone.right - zone.left,
              pb: jtSpacing.component.xs / 2,
              borderBottom: 2,
              borderColor: zone.color,
              color: zone.color,
              whiteSpace: 'nowrap',
            }}
          >
            {zone.label}
          </Typography>
        ))}

        {/* Score levels, set level: the value, then (with room) what it means. */}
        {SCORE_LEVELS.map((level) => {
          const before = spelled && (level === 0.2 || level === 1)
          return (
            <Box
              key={level}
              sx={{
                position: 'absolute',
                left: spelled ? xOf(level) + (before ? -5 : 5) : xOf(level),
                top: tierBottom(level),
                transform: before
                  ? 'translate(-100%, -100%)'
                  : spelled
                    ? 'translateY(-100%)'
                    : 'translate(-50%, -100%)',
                width: spelled ? labelWidthAt(level) : undefined,
                textAlign: before ? 'right' : undefined,
                whiteSpace: spelled ? undefined : 'nowrap',
              }}
            >
              <Typography
                variant="chipLabel"
                component="p"
                sx={{ color: 'common.white', fontVariantNumeric: 'tabular-nums' }}
              >
                {level.toFixed(2)}
              </Typography>
              {spelled && (
                <Typography variant="captionSmall" component="p" sx={{ color: 'base.100' }}>
                  {SCORE_MEANING[level]}
                </Typography>
              )}
            </Box>
          )
        })}

        {/* Lead organizations set upright over their lanes; each toggles the lead highlight. */}
        {showLeads &&
          LEADS.map((entry, index) => {
            const on = lead === entry.key
            return (
              <ButtonBase
                key={entry.key}
                ref={(el: HTMLButtonElement | null) => {
                  if (el) leadLabels.current[index] = el
                }}
                aria-pressed={on}
                aria-label={`Highlight actions led by ${entry.name}`}
                title={entry.name}
                onClick={() => onLead(on ? null : entry.key)}
                sx={{
                  position: 'absolute',
                  left: leadX(index),
                  top: headY - 6,
                  writingMode: 'vertical-rl',
                  transform: 'translate(-50%, -100%) rotate(180deg)',
                  whiteSpace: 'nowrap',
                  borderRadius: 1,
                  color: on ? 'common.white' : 'base.100',
                  '&:hover': { color: 'common.white' },
                  '&.Mui-focusVisible': focusRing,
                }}
              >
                <Typography variant="captionSmall" component="span" sx={{ color: 'inherit' }}>
                  <LeadName abbr={entry.abbr} name={entry.lane} />
                </Typography>
              </ButtonBase>
            )
          })}

        {/* Scenario names set upright over the top of their lanes, read bottom to top. */}
        {layout.lanes.map((lane, index) => {
          const on = pinned === lane.key
          return (
            <ButtonBase
              key={lane.key}
              aria-pressed={on}
              aria-label={`Highlight ${scenarioName(lane.key)}`}
              onClick={() => onPin(on ? null : lane.key)}
              sx={{
                position: 'absolute',
                left: laneX(index),
                top: headY - 6,
                writingMode: 'vertical-rl',
                transform: 'translate(-50%, -100%) rotate(180deg)',
                whiteSpace: 'nowrap',
                borderRadius: 1,
                color: on ? 'primary.main' : 'base.100',
                '&:hover': { color: 'primary.main' },
                '&.Mui-focusVisible': focusRing,
              }}
            >
              <Typography variant="captionSmall" component="span" sx={{ color: 'inherit' }}>
                {narrow ? SCENARIO_NAMES[lane.key].code : scenarioName(lane.key)}
              </Typography>
            </ButtonBase>
          )
        })}

        <Box
          component="svg"
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          role="group"
          aria-label="Adaptation Plan actions by the scenarios that share them and the organizations that lead them"
          onClick={(event) => {
            if (event.target === event.currentTarget) setSelected(null)
          }}
          sx={{
            display: 'block',
            overflow: 'visible',
            '& .row': { cursor: 'pointer', outline: 'none' },
            '& .row:focus-visible .end': { stroke: theme.palette.primary.main, strokeWidth: 2.5 },
          }}
        >
          {zones.map((zone) => (
            <rect
              key={zone.key}
              x={zone.left}
              y={ZONE_HEAD}
              width={zone.right - zone.left}
              height={headY - ZONE_HEAD}
              rx={4}
              fill={tokens.zone}
            />
          ))}

          {[0, ...SCORE_LEVELS].map((level) => (
            <line
              key={level}
              x1={xOf(level)}
              x2={xOf(level)}
              y1={level === 0 ? headY : tierBottom(level) - (spelled ? 44 : 18)}
              y2={height - metrics.bottom}
              stroke={tokens.grid}
            />
          ))}

          {/* Shaded bands behind the actions only one scenario considers, across the lanes
            and the scores. */}
          {layout.bands.map((band) => {
            const left = bandLeft(band.lane)
            const bx = bracketX(band.lane)
            const mid = (band.top + band.bottom) / 2
            return (
              <g key={band.key} opacity={pinned && pinned !== band.key ? tokens.dimmed : 1}>
                <rect
                  x={left}
                  y={band.top}
                  width={x1 + 8 - left}
                  height={band.bottom - band.top}
                  rx={4}
                  fill={tokens.band}
                />
                {!narrow && (
                  <g
                    fill="none"
                    stroke={theme.palette.primary.main}
                    strokeWidth={1.2}
                    strokeLinecap="round"
                  >
                    <path d={`M${bx + 3},${band.top + 3} H${bx} V${band.bottom - 3} H${bx + 3}`} />
                    <line x1={bandLabelRight(band.lane) + 4} x2={bx} y1={mid} y2={mid} />
                  </g>
                )}
              </g>
            )
          })}

          {showLeads &&
            LEADS.map((entry, index) => {
              const on = lead === entry.key
              return (
                <line
                  key={entry.key}
                  x1={leadX(index)}
                  x2={leadX(index)}
                  y1={headY}
                  y2={height - metrics.bottom}
                  stroke={on ? tokens.lead : tokens.leadLane}
                  strokeWidth={on ? 2.5 : 1.5}
                />
              )
            })}

          {/* Scenario lanes: each runs down from the top and curves out to its label where it
            branches off. */}
          {layout.lanes.map((lane, index) => {
            const x = laneX(index)
            const on = pinned === lane.key
            return (
              <g key={lane.key}>
                <path
                  d={`M${x} ${headY} V${lane.branchY - 12} Q${x} ${lane.branchY} ${x - 12} ${lane.branchY} H${labelEnd}`}
                  fill="none"
                  stroke={on ? tokens.laneActive : tokens.lane}
                  strokeWidth={on ? 2.5 : 1.5}
                />
                <circle
                  cx={labelEnd - 4}
                  cy={lane.branchY}
                  r={3.5}
                  fill={tokens.terminalFill}
                  stroke={tokens.terminal}
                  strokeWidth={1.5}
                />
              </g>
            )
          })}

          {/* One path per action, running right from the first lane that considers it. */}
          {layout.rows.map((row) => {
            const { action } = row
            const start = laneX(row.lane)
            const end = xOf(row.value)
            const reach = Math.max(end, xZero)
            const isActive = action.id === activeId
            const unscored = pinned !== null && action.scores[pinned] === 0
            const out = unscored || (lead !== null && !action.leads.includes(lead))
            // Every row has a faint leader back to its lead (the highlighted one, or the nearest
            // of its leads); it brightens for the active action and the highlighted lead.
            // A dimmed action drops its lead square and leader, so the lead lanes show only
            // what is highlighted.
            const leaderFrom = showLeads
              ? leadX(
                  lead && action.leads.includes(lead)
                    ? leadIndex(lead)
                    : Math.min(...action.leads.map(leadIndex)),
                )
              : null
            const leaderOn = isActive || (lead !== null && !out)
            return (
              <g
                key={action.id}
                className="row"
                tabIndex={0}
                role="button"
                aria-pressed={selected === action.id}
                aria-label={`${action.id}, score ${row.value.toFixed(2)}`}
                opacity={out ? tokens.dimmed : 1}
                onMouseEnter={() => setHovered(action.id)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(action.id)}
                onBlur={() => setHovered(null)}
                onClick={() => toggle(action.id)}
                onKeyDown={(event) => onRowKey(event, action.id)}
              >
                <rect
                  x={start - 4}
                  y={row.y - metrics.rowHeight / 2}
                  width={reach - start + 10}
                  height={metrics.rowHeight}
                  fill="transparent"
                />
                {/* A dotted leader ties the action to its lead. */}
                {leaderFrom !== null && !out && (
                  <line
                    x1={reach + 7}
                    x2={leaderFrom}
                    y1={row.y}
                    y2={row.y}
                    stroke={leaderOn ? tokens.leadLane : tokens.grid}
                    strokeWidth={1}
                    strokeDasharray="1 3"
                  />
                )}
                {showLeads &&
                  !out &&
                  action.leads.map((key) => (
                    <rect
                      key={key}
                      x={leadX(leadIndex(key)) - 2.5}
                      y={row.y - 2.5}
                      width={5}
                      height={5}
                      fill={tokens.lead}
                    />
                  ))}
                <line
                  x1={start}
                  x2={reach}
                  y1={row.y}
                  y2={row.y}
                  stroke={isActive ? tokens.pathActive : tokens.path}
                  strokeWidth={isActive ? 2 : 1.2}
                />
                {/* The pinned lane's own dots are redundant: every bright row is on it. */}
                {row.members
                  .filter((lane) => lane !== pinnedLane)
                  .map((lane) => (
                    <circle key={lane} cx={laneX(lane)} cy={row.y} r={2.3} fill={tokens.member} />
                  ))}
                {!unscored && (
                  <ActionMark
                    className="end"
                    cx={end}
                    cy={row.y}
                    r={narrow ? 4 : 4.5}
                    color={tokens.area[action.area]}
                    top={TOP_ACTIONS.has(action.id)}
                    outline={isActive ? tokens.pathActive : undefined}
                  />
                )}
              </g>
            )
          })}
        </Box>

        {/* Each band's label: "Exclusive" in primary green, inside the band and pointing at its
          bracket (on narrow screens, on its own line at the top). */}
        {layout.bands.map((band, index) => (
          <Typography
            key={band.key}
            ref={index === 0 ? measureExclusive : undefined}
            variant="captionSmall"
            component="span"
            title={PATH_SECTION.shapes.band(scenarioName(band.key))}
            sx={{
              position: 'absolute',
              top: narrow ? band.top + metrics.bandHead / 2 : (band.top + band.bottom) / 2,
              transform: 'translateY(-50%)',
              ...(narrow ? { left: xZero + 4 } : { right: width - bandLabelRight(band.lane) }),
              whiteSpace: 'nowrap',
              color: 'primary.main',
              opacity: pinned && pinned !== band.key ? tokens.dimmed : 1,
            }}
          >
            {PATH_SECTION.shapes.exclusive}
          </Typography>
        ))}

        {/* Branch labels double as the scenario pin. */}
        {layout.lanes.map((lane) => {
          const on = pinned === lane.key
          return (
            <ButtonBase
              key={lane.key}
              aria-pressed={on}
              onClick={() => onPin(on ? null : lane.key)}
              sx={{
                position: 'absolute',
                top: lane.branchY,
                transform: 'translateY(-50%)',
                ...(narrow
                  ? {
                      left: xZero,
                      flexDirection: 'row',
                      gap: jtSpacing.gap.xs,
                      alignItems: 'baseline',
                    }
                  : {
                      right: width - (labelEnd - 12),
                      whiteSpace: 'nowrap',
                      flexDirection: 'column',
                      alignItems: 'flex-end',
                      textAlign: 'right',
                    }),
                display: 'flex',
                borderRadius: 1,
                color: on ? 'primary.main' : 'common.white',
                '&:hover': { color: 'primary.main' },
                '&.Mui-focusVisible': focusRing,
              }}
            >
              <Typography variant="chipLabel" component="span" sx={{ color: 'inherit' }}>
                {narrow ? SCENARIO_NAMES[lane.key].code : scenarioName(lane.key)}
              </Typography>
              <Typography variant="captionSmall" component="span">
                {lane.count} actions
              </Typography>
            </ButtonBase>
          )
        })}

        {/* With a scenario highlighted, each lead lane counts the scenario's actions it leads,
          on the scenario's branch row. Hovering a count opens its card; a click highlights the
          lead. */}
        {showLeads &&
          pinned &&
          pinnedLane >= 0 &&
          LEADS.map((entry, index) => {
            const count = ledIn(pinned, entry.key).length
            const on = count > 0 && (lead === null || lead === entry.key)
            const selectedLead = lead === entry.key
            return (
              <ButtonBase
                key={entry.key}
                aria-pressed={selectedLead}
                aria-label={PATH_SECTION.leadCount(entry.name, count, scenarioName(pinned))}
                onClick={() => onLead(selectedLead ? null : entry.key)}
                onMouseEnter={() => setHoveredLead(entry.key)}
                onMouseLeave={() => setHoveredLead(null)}
                onFocus={() => setHoveredLead(entry.key)}
                onBlur={() => setHoveredLead(null)}
                sx={{
                  position: 'absolute',
                  left: leadX(index),
                  top: layout.lanes[pinnedLane].branchY,
                  transform: 'translate(-50%, -50%)',
                  minWidth: 20,
                  height: 26,
                  px: 0.25,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 1,
                  border: 1,
                  borderColor: on ? tokens.lead : tokens.leadLane,
                  bgcolor: hoveredLead === entry.key ? tokens.leadLane : tokens.terminalFill,
                  '&.Mui-focusVisible': focusRing,
                }}
              >
                <Typography
                  variant="captionSmall"
                  component="span"
                  sx={{
                    display: 'block',
                    color: on ? 'common.white' : 'base.300',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {count}
                </Typography>
              </ButtonBase>
            )
          })}

        {showLeads &&
          pinned &&
          pinnedLane >= 0 &&
          hoveredLead &&
          (() => {
            const index = leadIndex(hoveredLead)
            const entry = LEADS[index]
            const y = layout.lanes[pinnedLane].branchY
            const above = y > height - 280
            return (
              <LeadTooltip
                name={<LeadName abbr={entry.abbr} name={entry.name} />}
                actions={ledIn(pinned, entry.key)}
                scenario={pinned}
                width={leadCardWidth}
                left={Math.max(
                  0,
                  Math.min(leadX(index) - leadCardWidth / 2, width - leadCardWidth),
                )}
                top={above ? y - 16 : y + 16}
                above={above}
              />
            )
          })()}

        {active && (
          <ActionTooltip
            row={active}
            pinned={pinned}
            isTop={TOP_ACTIONS.has(active.action.id)}
            width={tooltipWidth}
            left={Math.min(
              Math.max(0, Math.max(xOf(active.value), xZero) - tooltipWidth / 2),
              width - tooltipWidth,
            )}
            top={active.y > height - 360 ? active.y - 14 : active.y + 14}
            above={active.y > height - 360}
          />
        )}
      </Box>
    </>
  )
}
