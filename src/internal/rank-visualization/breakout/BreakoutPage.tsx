// A breakout table: one subteam hosts, the public asks, the screen answers.
//
// This is 4C's data model behind a different shell. The host starts on their own
// criterion with every scenario showing, and has four moves: pick scenarios, pick
// a place, pick a period, open a metric into its parts; and three ways to look,
// table, chart or map. Everything is set large for a projector, and every number
// on screen is one the subteam published: a value we inferred shows as a
// placeholder, never as a number. Pinned views and their notes stay on the
// laptop, offline, and export as a Markdown file for the report-out.
import { Box, ButtonBase, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageLayout from '../../PageLayout'
import { TEAMS, cellFill } from '../data'
import type { TeamKey } from '../data'
import { CellDetail } from '../drilldown/CellDetail'
import { valueAt } from '../drilldown/cellValue'
import { ANY, SCENARIO_NAME, fmtValue } from '../drilldown/model'
import type { CriterionNode, ScenarioKey } from '../drilldown/model'
import type { Dim } from '../drilldown/usePivot'
import { RegionValues } from '../subteams/RegionValues'
import { REGION_DATA_KEY, hasRegionMap } from '../subteams/regionKeys'
import { DivergingLegend } from '../subteams/SubteamFrame'
import { Bars, Lines } from './Charts'
import type { Point } from './Charts'
import { useBreakout } from './useBreakout'
import type { Breakout, Pin, View } from './useBreakout'

const TEAM_KEYS = TEAMS.map((team) => team.key)

/**
 * One paragraph from each subteam to open its table with. Left empty until the
 * team writes it; the page shows a placeholder so the gap is visible at rehearsal.
 */
const HOST_INTRO: Partial<Record<TeamKey, string>> = {}

const PLACEHOLDER = 'awaiting subteam'

export default function BreakoutPage() {
  const { team: param } = useParams()
  const team = TEAM_KEYS.includes(param as TeamKey) ? (param as TeamKey) : null
  return (
    <PageLayout title="Breakout table" fullWidthContent hideTitle plainContent>
      {team ? <Table team={team} key={team} /> : <Picker />}
    </PageLayout>
  )
}

function Picker() {
  const navigate = useNavigate()
  return (
    <Box
      sx={(theme) => ({
        px: theme.jtSpacing.page.x,
        py: theme.jtSpacing.section.sm,
        display: 'grid',
        gap: 2,
      })}
    >
      <Typography variant="h3" component="h1">
        Breakout tables
      </Typography>
      <Typography variant="body1" sx={{ color: 'base.100', maxWidth: '60ch' }}>
        Each subteam hosts a table. Open yours on the laptop that drives the screen.
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {TEAMS.map((entry) => (
          <ButtonBase
            key={entry.key}
            onClick={() => navigate(`/pages/breakout/${entry.key}`)}
            sx={{ px: 2.5, py: 1.5, borderRadius: 1.5, border: 1, borderColor: 'border.strong' }}
          >
            <Typography variant="h5">{entry.name}</Typography>
          </ButtonBase>
        ))}
      </Box>
    </Box>
  )
}

function Table({ team }: { team: TeamKey }) {
  const state = useBreakout(team)
  const name = TEAMS.find((entry) => entry.key === team)?.name ?? ''
  const [inspect, setInspect] = useState<Record<Dim, string> | null>(null)
  const canMap = hasRegionMap(team) && state.selectedNodes.some((n) => n.places[0]?.key !== ANY)
  const view: View = state.view === 'map' && !canMap ? 'table' : state.view

  return (
    <Box
      sx={(theme) => ({
        display: 'grid',
        gridTemplateRows: 'auto minmax(0, 1fr) auto',
        minHeight: 'calc(100vh - 64px)',
        px: theme.jtSpacing.page.x,
        pt: theme.jtSpacing.component.lg,
        gap: theme.jtSpacing.gap.md,
      })}
    >
      {/* Masthead: who is hosting, and what is on screen, in one glance from the back row. */}
      <Box sx={{ display: 'grid', gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Typography variant="h3" component="h1" sx={{ color: 'secondary.main' }}>
            {name}
          </Typography>
          <Typography variant="body1" sx={{ color: 'base.100' }}>
            breakout table
          </Typography>
          <TeamSwitch current={team} />
        </Box>
        <Sentence state={state} />
        <HostIntro team={team} />
      </Box>

      <Box
        sx={(theme) => ({
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '320px minmax(0, 1fr)' },
          gap: theme.jtSpacing.gap.lg,
          alignItems: 'start',
          minHeight: 0,
        })}
      >
        <Rail state={state} canMap={canMap} />
        <Box
          sx={(theme) => ({
            p: theme.jtSpacing.component.md,
            borderRadius: 2,
            bgcolor: 'base.700',
            border: 1,
            borderColor: 'border.subtle',
            minWidth: 0,
          })}
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

      <Pins state={state} name={name} />
      <CellDetail coords={inspect} onClose={() => setInspect(null)} />
    </Box>
  )
}

function TeamSwitch({ current }: { current: TeamKey }) {
  const navigate = useNavigate()
  return (
    <Box
      role="tablist"
      aria-label="Switch table"
      sx={{ display: 'flex', gap: 0.5, ml: { md: 'auto' }, flexWrap: 'wrap' }}
    >
      {TEAMS.map((entry) => {
        const on = entry.key === current
        return (
          <ButtonBase
            key={entry.key}
            role="tab"
            aria-selected={on}
            onClick={() => navigate(`/pages/breakout/${entry.key}`)}
            sx={{
              px: 1.25,
              py: 0.6,
              borderRadius: 999,
              border: 1,
              borderColor: on ? 'primary.main' : 'border.default',
              bgcolor: on ? 'translucent.primaryGreen' : 'transparent',
              color: on ? 'common.white' : 'base.100',
            }}
          >
            <Typography variant="body2" sx={{ color: 'inherit' }}>
              {entry.name}
            </Typography>
          </ButtonBase>
        )
      })}
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
    <Box component="span" sx={{ color: 'common.white' }}>
      {text}
    </Box>
  )
  return (
    <Typography variant="bodyLarge" component="p" sx={{ color: 'base.100', maxWidth: '70ch' }}>
      {state.reading === 'change' ? 'Difference from Business as Usual for ' : 'Comparing '}
      {em(n === 6 ? 'all six scenarios' : `${n} scenario${n === 1 ? '' : 's'}`)}
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
  return (
    <Typography
      variant="body1"
      sx={{
        color: intro ? 'base.50' : 'base.300',
        maxWidth: '80ch',
        ...(intro
          ? {}
          : {
              px: 1.5,
              py: 1,
              borderRadius: 1,
              border: 1,
              borderStyle: 'dashed',
              borderColor: 'border.default',
            }),
      }}
    >
      {intro ?? `Opening paragraph for this table: ${PLACEHOLDER}.`}
    </Typography>
  )
}

// ---------- the rail ----------

/**
 * The controls, compact and sticky, scrolling inside the viewport so they never
 * run past the result beside them.
 */
function Rail({ state, canMap }: { state: Breakout; canMap: boolean }) {
  const wide = state.placeFacets.find((f) => /^delta-wide$/i.test(f.label))
  return (
    <Box
      sx={{
        display: 'grid',
        gap: 2,
        alignContent: 'start',
        position: 'sticky',
        top: 72,
        maxHeight: 'calc(100vh - 88px)',
        overflowY: 'auto',
        pr: 0.5,
      }}
    >
      <Group title="View as">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: canMap ? '1fr 1fr 1fr' : '1fr 1fr',
            gap: 0.75,
          }}
        >
          <Toggle
            on={state.view === 'table'}
            onClick={() => state.setView('table')}
            label="Table"
          />
          <Toggle
            on={state.view === 'chart'}
            onClick={() => state.setView('chart')}
            label="Chart"
          />
          {canMap && (
            <Toggle on={state.view === 'map'} onClick={() => state.setView('map')} label="Map" />
          )}
        </Box>
      </Group>

      <Group
        title="Scenarios"
        action={
          state.scenarios.length < 6
            ? { label: 'All six', onClick: state.setAllScenarios }
            : undefined
        }
      >
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0.75 }}>
          {(['ngw', 'em', 'bf', 'cor', 'tunnel', 'bau'] as ScenarioKey[]).map((key) => (
            <Toggle
              key={key}
              on={state.scenarios.includes(key)}
              onClick={() => state.toggleScenario(key)}
              label={SCENARIO_NAME[key]}
            />
          ))}
        </Box>
      </Group>

      <Group title="Show">
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0.75 }}>
          <Toggle
            on={state.reading === 'level'}
            onClick={() => state.setReading('level')}
            label="The values"
          />
          <Toggle
            on={state.reading === 'change'}
            onClick={() => state.setReading('change')}
            label="Difference from today"
          />
        </Box>
      </Group>

      {state.placeFacets.length > 0 && (
        <Group title="Place">
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0.75 }}>
            {!wide && (
              <Toggle
                on={state.place === ANY}
                onClick={() => state.setPlace(ANY)}
                label="All together"
              />
            )}
            {state.placeFacets.map((facet) => (
              <Toggle
                key={facet.key}
                on={state.place === facet.key || (facet === wide && state.place === ANY)}
                onClick={() => state.setPlace(facet.key)}
                label={facet.label}
              />
            ))}
          </Box>
        </Group>
      )}

      {state.periodFacets.length > 0 && (
        <Group title="Period">
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0.75 }}>
            <Toggle
              on={state.period === ANY}
              onClick={() => state.setPeriod(ANY)}
              label="Whole run"
            />
            {state.periodFacets.map((facet) => (
              <Toggle
                key={facet.key}
                on={state.period === facet.key}
                onClick={() => state.setPeriod(facet.key)}
                label={facet.label}
              />
            ))}
          </Box>
        </Group>
      )}

      <Group title="Measures">
        <Box sx={{ display: 'grid', gap: 0.75 }}>
          <Toggle
            on={state.nodes.includes(state.root.id)}
            onClick={() => state.toggleNode(state.root.id)}
            label={`${state.root.label}: the score`}
          />
          {state.metrics.map((metric) => (
            <MetricRow key={metric.id} metric={metric} state={state} />
          ))}
        </Box>
      </Group>
    </Box>
  )
}

function MetricRow({ metric, state }: { metric: CriterionNode; state: Breakout }) {
  const open = state.partsOpen(metric.id)
  const hasParts = !!metric.children?.length
  return (
    <Box sx={{ display: 'grid', gap: 0.5 }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: hasParts ? '1fr auto' : '1fr', gap: 0.5 }}>
        <Toggle
          on={state.nodes.includes(metric.id) || open}
          onClick={() => (open ? state.toggleParts(metric.id) : state.toggleNode(metric.id))}
          label={metric.label}
        />
        {hasParts && (
          <ButtonBase
            onClick={() => state.toggleParts(metric.id)}
            aria-label={
              open ? `Close the parts of ${metric.label}` : `Open the parts of ${metric.label}`
            }
            sx={{
              px: 1.25,
              borderRadius: 1,
              border: 1,
              borderColor: open ? 'primary.main' : 'border.strong',
              color: open ? 'primary.main' : 'base.100',
            }}
          >
            <Typography variant="body1" sx={{ color: 'inherit' }}>
              {open ? '−' : '+'}
            </Typography>
          </ButtonBase>
        )}
      </Box>
      {open && (
        <Box sx={{ display: 'grid', gap: 0.5, pl: 2 }}>
          {metric.children?.map((part) => (
            <Toggle
              key={part.id}
              on={state.nodes.includes(part.id)}
              onClick={() => state.toggleNode(part.id)}
              label={part.label}
              small
            />
          ))}
        </Box>
      )}
    </Box>
  )
}

function Group({
  title,
  action,
  children,
}: {
  title: string
  action?: { label: string; onClick: () => void }
  children: ReactNode
}) {
  return (
    <Box sx={{ display: 'grid', gap: 0.75 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <Typography variant="h5" component="h2">
          {title}
        </Typography>
        {action && (
          <ButtonBase onClick={action.onClick} sx={{ color: 'primary.main' }}>
            <Typography variant="body2" sx={{ color: 'inherit' }}>
              {action.label}
            </Typography>
          </ButtonBase>
        )}
      </Box>
      {children}
    </Box>
  )
}

/** A toggle sized for a trackpad in a hurry. */
function Toggle({
  on,
  onClick,
  label,
  small,
}: {
  on: boolean
  onClick: () => void
  label: string
  small?: boolean
}) {
  return (
    <ButtonBase
      onClick={onClick}
      aria-pressed={on}
      sx={{
        justifyContent: 'start',
        textAlign: 'left',
        px: 1.25,
        py: small ? 0.5 : 0.8,
        borderRadius: 1,
        border: 1,
        borderColor: on ? 'primary.main' : 'border.default',
        bgcolor: on ? 'translucent.primaryGreen' : 'transparent',
        color: on ? 'common.white' : 'base.100',
        '&:hover, &.Mui-focusVisible': { borderColor: 'primary.main' },
      }}
    >
      <Typography variant="body2" sx={{ color: 'inherit' }}>
        {label}
      </Typography>
    </ButtonBase>
  )
}

// ---------- the result ----------

/** What a cell shows: a published number, or the reason there is none. */
function read(node: CriterionNode, scenario: ScenarioKey, place: string, period: string) {
  const cell = valueAt({ criterion: node.id, scenario, place, period })
  if (cell.value === null) return { value: null as number | null, why: 'not scored' }
  if (cell.inferred) return { value: null as number | null, why: PLACEHOLDER }
  return { value: cell.value, why: '' }
}

function unitWord(node: CriterionNode, diff: boolean): string {
  const base =
    node.unit === 'score'
      ? 'score, −5 to +5'
      : node.unit === 'share'
        ? 'proportion of days'
        : node.unit
  return diff ? `${base}, difference from Business as Usual` : base
}

/** A difference in the row's own unit, with an explicit sign. */
function signed(value: number, unit: CriterionNode['unit']): string {
  const text = fmtValue(Math.abs(value), unit).replace(/^[+\-−]\s*/, '')
  return value === 0 ? '0' : `${value > 0 ? '+' : '−'}${text}`
}

function Matrix({
  state,
  onInspect,
}: {
  state: Breakout
  onInspect: (coords: Record<Dim, string>) => void
}) {
  const rows = state.selectedNodes
  const columns = `minmax(220px, 1.4fr) repeat(${state.scenarios.length}, minmax(120px, 1fr))`
  const diff = state.reading === 'change'
  // Difference mode needs Business as Usual; it is read even when not on screen.
  const rowData = rows.map((node) => {
    const base = diff ? read(node, 'bau', state.place, state.period) : null
    const cells = state.scenarios.map((scenario) => {
      const here = read(node, scenario, state.place, state.period)
      if (!diff || here.value === null) return { ...here, scenario }
      if (base === null || base.value === null)
        return { value: null as number | null, why: 'no baseline', scenario }
      return { value: here.value - base.value, why: '', scenario }
    })
    const max = Math.max(0.000001, ...cells.map((c) => Math.abs(c.value ?? 0)))
    return { node, cells, max }
  })
  const anyPlaceholder = rowData.some((row) => row.cells.some((c) => c.why === PLACEHOLDER))
  const anyDiff = diff && rowData.some((row) => row.cells.some((c) => c.value !== null))

  return (
    <Box sx={{ display: 'grid', gap: 2 }}>
      <Box sx={{ overflowX: 'auto', overflowY: 'hidden' }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: columns,
            columnGap: 1,
            rowGap: 1,
            alignItems: 'center',
            minWidth: 560,
          }}
        >
          <Box />
          {state.scenarios.map((scenario) => (
            <Typography key={scenario} variant="body1" sx={{ color: 'base.50', alignSelf: 'end' }}>
              <Box component="strong">{SCENARIO_NAME[scenario]}</Box>
            </Typography>
          ))}
          {rowData.map(({ node, cells, max }) => (
            <Box key={node.id} sx={{ display: 'contents' }}>
              <Box sx={{ display: 'grid', gap: 0.2, pl: node.level === 'entity' ? 2 : 0 }}>
                <Typography variant="body1" sx={{ color: 'base.50' }}>
                  {node.level === 'team' ? (
                    <Box component="strong">{node.label}: the score</Box>
                  ) : (
                    node.label
                  )}
                </Typography>
                <Typography variant="body2" sx={{ color: 'base.300' }}>
                  {unitWord(node, diff)}
                </Typography>
              </Box>
              {cells.map((cell) => (
                <Cell
                  key={cell.scenario}
                  value={cell.value}
                  why={cell.why}
                  unit={node.unit}
                  score={node.unit === 'score' && !diff}
                  strength={cell.value === null ? 0 : Math.abs(cell.value) / max}
                  diverging={diff}
                  better={node.betterHigher}
                  onClick={
                    cell.value !== null && !diff
                      ? () =>
                          onInspect({
                            criterion: node.id,
                            scenario: cell.scenario,
                            place: state.place,
                            period: state.period,
                          })
                      : undefined
                  }
                />
              ))}
            </Box>
          ))}
        </Box>
      </Box>
      <Box sx={{ display: 'grid', gap: 0.75 }}>
        {anyDiff && (
          <DivergingLegend
            label="Colour shows the direction and, within a row, the relative size of the difference from Business as Usual."
            min="largest fall in the row"
            max="largest rise in the row"
          />
        )}
        <Typography variant="body2" sx={{ color: 'base.100' }}>
          Scores (−5 to +5) are blue above Business as Usual and orange below. Other rows are shaded
          relative to their own largest value. Click a number to see where it comes from.
          {anyPlaceholder && ` “${PLACEHOLDER}” marks a number the team has not published yet.`}
        </Typography>
      </Box>
    </Box>
  )
}

function Cell({
  value,
  why,
  unit,
  score,
  strength,
  diverging,
  better,
  onClick,
}: {
  value: number | null
  why: string
  unit: CriterionNode['unit']
  score: boolean
  strength: number
  diverging: boolean
  better: boolean
  onClick?: () => void
}) {
  const empty = value === null
  const fill = empty
    ? undefined
    : score
      ? cellFill(value)
      : diverging
        ? cellFill((better ? 1 : -1) * Math.sign(value) * strength * 5)
        : undefined
  return (
    <ButtonBase
      disabled={!onClick}
      onClick={onClick}
      sx={{
        position: 'relative',
        justifyContent: 'start',
        height: 56,
        px: 1.5,
        borderRadius: 0.6,
        border: empty ? 1 : 0,
        borderStyle: 'dashed',
        borderColor: 'border.default',
        bgcolor: fill ?? 'transparent',
        color: empty ? 'base.300' : fill ? 'common.white' : 'base.50',
        overflow: 'hidden',
      }}
    >
      {!empty && !fill && (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            bgcolor: 'salinity.teal',
            opacity: 0.12 + strength * 0.5,
          }}
        />
      )}
      <Typography variant="body1" sx={{ position: 'relative', color: 'inherit' }}>
        {empty ? why : diverging && unit !== 'score' ? signed(value, unit) : fmtValue(value, unit)}
      </Typography>
    </ButtonBase>
  )
}

/** One chart per measure: lines across periods where the measure has them, bars otherwise. */
function Charts({ state }: { state: Breakout }) {
  const diff = state.reading === 'change'
  const pointAt = (node: CriterionNode, scenario: ScenarioKey, period: string): Point => {
    const here = read(node, scenario, state.place, period)
    if (!diff || here.value === null) return { scenario, period, ...here }
    const base = read(node, 'bau', state.place, period)
    if (base.value === null) return { scenario, period, value: null, why: 'no baseline' }
    return { scenario, period, value: here.value - base.value, why: '' }
  }
  return (
    <Box sx={{ display: 'grid', gap: 3 }}>
      {state.selectedNodes.map((node) => {
        const periods = node.periods.filter((f) => f.key !== ANY)
        const lines = periods.length >= 2 && state.period === ANY
        const points = lines
          ? state.scenarios.flatMap((s) => periods.map((f) => pointAt(node, s, f.key)))
          : state.scenarios.map((s) => pointAt(node, s, state.period))
        return (
          <Box key={node.id} sx={{ display: 'grid', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, flexWrap: 'wrap' }}>
              <Typography variant="body1" sx={{ color: 'base.50' }}>
                <Box component="strong">
                  {node.level === 'team' ? `${node.label}: the score` : node.label}
                </Box>
              </Typography>
              <Typography variant="body2" sx={{ color: 'base.300' }}>
                {unitWord(node, diff)}
                {lines ? ', by period' : ''}
              </Typography>
            </Box>
            {lines ? (
              <Lines node={node} periods={periods} points={points} />
            ) : (
              <Bars node={node} points={points} diff={diff} />
            )}
          </Box>
        )
      })}
    </Box>
  )
}

function Maps({ state, team }: { state: Breakout; team: TeamKey }) {
  const keys = REGION_DATA_KEY[team] ?? {}
  const rows = state.selectedNodes.filter((node) => node.places[0]?.key !== ANY)
  return (
    <Box sx={{ display: 'grid', gap: 3 }}>
      {rows.map((node) => (
        <Box key={node.id} sx={{ display: 'grid', gap: 1 }}>
          <Typography variant="body1" sx={{ color: 'base.50' }}>
            <Box component="strong">{node.label}</Box>
          </Typography>
          <RegionValues
            team={team}
            scenarios={state.scenarios}
            coordsFor={(region, scenario) =>
              keys[region]
                ? { criterion: node.id, scenario, place: keys[region], period: state.period }
                : null
            }
            unitLabel={unitWord(node, false)}
            hideInferred
          />
        </Box>
      ))}
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
      sx={(theme) => ({
        display: 'grid',
        gap: 1,
        py: theme.jtSpacing.component.md,
        borderTop: 1,
        borderColor: 'border.default',
      })}
    >
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
        <Box
          component="input"
          value={note}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNote(e.target.value)}
          placeholder="What the table said about this view"
          aria-label="Note for the pinned view"
          sx={{
            typography: 'body1',
            flex: '1 1 320px',
            px: 1.5,
            py: 1,
            borderRadius: 1,
            border: 1,
            borderColor: 'border.default',
            bgcolor: 'base.800',
            color: 'base.50',
          }}
        />
        <Action
          onClick={() => {
            state.pin(note)
            setNote('')
          }}
          primary
          label="Pin this view"
        />
        {state.pins.length > 0 && (
          <Action onClick={exportNotes} label={`Export ${state.pins.length} pinned`} />
        )}
        {state.pins.length > 0 && <Action onClick={state.clearPins} label="Clear" />}
      </Box>
      {state.pins.length > 0 && (
        <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
          {state.pins.map((p, i) => (
            <Box
              key={p.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                pl: 1.25,
                pr: 0.5,
                py: 0.5,
                borderRadius: 999,
                border: 1,
                borderColor: 'border.strong',
              }}
            >
              <ButtonBase onClick={() => state.restore(p)}>
                <Typography variant="body2" sx={{ color: 'base.50' }}>
                  {i + 1}. {p.note || summarise(p, state)}
                </Typography>
              </ButtonBase>
              <ButtonBase
                onClick={() => state.unpin(p.id)}
                aria-label="Remove pin"
                sx={{ px: 0.75, color: 'base.300' }}
              >
                ×
              </ButtonBase>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  )
}

function Action({
  onClick,
  label,
  primary,
}: {
  onClick: () => void
  label: string
  primary?: boolean
}) {
  return (
    <ButtonBase
      onClick={onClick}
      sx={{
        px: 2,
        py: 1,
        borderRadius: 999,
        border: 1,
        borderColor: primary ? 'primary.main' : 'border.strong',
        bgcolor: primary ? 'primary.main' : 'transparent',
        color: primary ? 'common.black' : 'base.50',
      }}
    >
      <Typography variant="body1" sx={{ color: 'inherit' }}>
        {label}
      </Typography>
    </ButtonBase>
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
  return `${p.scenarios.length} scenarios on ${p.nodes.length} measure${p.nodes.length === 1 ? '' : 's'}${place}${period}`
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
      const r = read(node, s, p.place, p.period)
      return r.value === null ? r.why : fmtValue(r.value, node.unit)
    })
    lines.push(`| ${node.label} | ${cells.join(' | ')} |`)
  }
  lines.push('')
  return lines
}
