// 4b — place and time as detail inside a view.
//
// The same selection state and the same rows as 4a, with one difference: the facet
// bar carries only scenario and criterion, and where/when appears as a breakdown
// panel under the view once the criterion you are standing in has one. Two focus
// options instead of three, and a shorter bar.
//
// The cost this design makes visible: time stops being comparable. Recreation's
// whole finding is how late in the calendar stress lingers, and EJ scores its
// drinking-water metric three times by season — but those calendars live in
// different panels, so nothing lines them up.
import { Box, Typography } from '@mui/material'
import { useState } from 'react'
import SketchCard from '../components/SketchCard'
import {
  ControlDivider,
  CriterionAxis,
  DrillHead,
  DrillRow,
  ControlPanel,
  DrillLayout,
  FacetRow,
  NothingToBreakDown,
  NothingToCompare,
  NowShowing,
  ScenarioRow,
  TeamMark,
  SliceMatrix,
  ViewNote,
  ViewSwitcher,
  WaterAgeGrid,
} from '../drilldown/DrillBits'
import {
  DRILL_CARD_WIDTH,
  domainFor,
  domainsByUnit,
  labelOf,
  sliceCaption,
  unitHeading,
} from '../drilldown/scales'
import {
  ANY,
  DRILL_SCENARIOS,
  SCENARIO_NAME,
  effectiveSlice,
  fmtValue,
  hasPeriods,
  hasPlaces,
  resolve,
} from '../drilldown/model'
import type { CriterionNode } from '../drilldown/model'
import type { Phrase } from '../drilldown/DrillBits'
import { CRITERION_TREE } from '../drilldown/tree'
import { ALL_CRITERIA, useDrill } from '../drilldown/useDrill'
import type { Drill } from '../drilldown/useDrill'

const VIEW_OPTIONS = [
  {
    key: 'criterion' as const,
    label: 'Compare scenarios',
    outcome:
      'Pin one criterion. Every scenario becomes a row — and if that criterion is broken out by place or period, the panel underneath opens it up.',
  },
  {
    key: 'scenario' as const,
    label: 'Profile one scenario',
    outcome:
      'Pin one scenario. Every criterion beneath where you are becomes a row, so you read one future across its parts.',
  },
]

/** Children of the current node; the five subteams when nothing is selected. */
const childrenOf = (node?: CriterionNode) => (node ? (node.children ?? []) : CRITERION_TREE)

export default function DrillNested() {
  // Place and period are never part of the shared selection here, so the views
  // always read a criterion's headline number and the breakdown sits below.
  const drill = useDrill({ focus: 'criterion', nodeId: 'environmentalJustice' })
  const view = drill.focus === 'slice' ? 'criterion' : drill.focus
  const scenarioUsed = view === 'scenario' || drill.node?.detail === 'waterAge'

  return (
    <SketchCard id="4b" width={DRILL_CARD_WIDTH}>
      <DrillLayout
        controls={
          <ControlPanel>
            <ViewSwitcher options={VIEW_OPTIONS} value={view} onChange={drill.setFocus} />
            <ControlDivider label="Change what you see" />
            <CriterionAxis
              path={drill.path}
              childNodes={childrenOf(drill.node)}
              onPick={drill.setNode}
              rootId={ALL_CRITERIA}
              status={view === 'criterion' ? 'pinned' : undefined}
              deepestLevel={view === 'scenario' ? 'metric' : 'entity'}
              isChildClosed={view === 'scenario' ? (child) => !child.children : undefined}
              closedNote="These are measurements — they are already the rows of this view. Switch to Compare scenarios to stand on one."
            />
            <ScenarioRow
              value={drill.scenario}
              onChange={drill.setScenario}
              status={
                view === 'scenario'
                  ? 'pinned'
                  : drill.node?.detail === 'waterAge'
                    ? 'month grid only'
                    : 'not used in this view'
              }
              inert={!scenarioUsed}
            />
            <FacetRow label="Where & when" inert status="in the panel below">
              <Typography variant="chartAxis" sx={{ color: 'base.100' }}>
                {drill.node && (hasPlaces(drill.node) || hasPeriods(drill.node))
                  ? 'This criterion is broken out — the panel under the table opens it.'
                  : 'This criterion is one number for the whole Delta over the whole run.'}
              </Typography>
            </FacetRow>
          </ControlPanel>
        }
        view={
          <>
            <NowShowing parts={sentenceFor(drill, view)} />
            {view === 'scenario' ? <ProfileView drill={drill} /> : <CompareView drill={drill} />}
            {drill.node && <WithinView node={drill.node} drill={drill} />}
          </>
        }
      />
    </SketchCard>
  )
}

/**
 * The same grammar as 4a, one clause shorter: place and period are not page state
 * here, so the sentence says whether the criterion has a breakdown rather than
 * which slice is selected.
 */
function sentenceFor(drill: Drill, view: 'scenario' | 'criterion'): Phrase[] {
  const node = drill.node
  const mark = node ? <TeamMark team={node.team} /> : undefined
  const slice = node ? effectiveSlice(node, ANY, ANY) : undefined
  const headlineSlice =
    node && slice && slice.place !== ANY
      ? labelOf(node.places, slice.place)
      : node && slice && slice.period !== ANY
        ? labelOf(node.periods, slice.period)
        : null

  /** Where & when lives under the table in this design, so the sentence points at it. */
  const tail = (): Phrase[] => {
    if (!node) return []
    if (headlineSlice) return [{ text: 'for' }, { text: headlineSlice, kind: 'value' }]
    if (hasPlaces(node) || hasPeriods(node)) return [{ text: '— broken out in the panel below' }]
    return [{ text: '— one number for the whole Delta over the whole run' }]
  }

  if (view === 'scenario') {
    const value =
      node &&
      (() => {
        const resolved = resolve(node, drill.scenario, slice?.place ?? ANY, slice?.period ?? ANY)
        return resolved.value === null ? null : fmtValue(resolved.value, node.unit)
      })()
    const leaf = node && !node.children
    return [
      { text: leaf ? 'Showing' : 'Breaking' },
      { text: SCENARIO_NAME[drill.scenario], kind: 'pinned' },
      { text: leaf ? 'at' : node ? 'into the parts of' : 'into' },
      node
        ? { text: node.label, kind: 'value', icon: mark }
        : { text: 'all five subteams', kind: 'value' },
      ...(value
        ? [
            { text: leaf ? '—' : node?.unit === 'score' ? ', which scores' : ', which reads' },
            { text: value, kind: 'value' as const },
          ]
        : []),
      ...tail(),
    ]
  }

  return [
    { text: 'Comparing' },
    { text: 'all six scenarios', kind: 'value' },
    { text: 'on' },
    node
      ? { text: node.label, kind: 'pinned', icon: mark }
      : { text: 'each of the five subteams', kind: 'pinned' },
    ...tail(),
  ]
}

/** Focus = scenario: one scenario, the criteria beneath wherever you are. */
function ProfileView({ drill }: { drill: Drill }) {
  const nodes = childrenOf(drill.node)
  // Place and period are never page-level here, so every node shows its headline
  // slice and the panel below opens the rest up.
  const rows = nodes.map((node) => {
    const slice = effectiveSlice(node, ANY, ANY)
    return { node, slice, ...resolve(node, drill.scenario, slice.place, slice.period) }
  })
  const domains = domainsByUnit(rows.map((row) => ({ unit: row.node.unit, value: row.value })))
  const mixedTeams = new Set(rows.map((row) => row.node.team)).size > 1
  // A leaf has no parts, so this view has no rows; say so rather than draw headers
  // over an empty table.
  const parent = drill.path[drill.path.length - 2]

  if (drill.node && rows.length === 0) {
    return (
      <>
        <ViewNote>{drill.node.note}</ViewNote>
        <NothingToBreakDown
          label={drill.node.label}
          onCompare={() => drill.setFocus('criterion')}
          onUp={parent ? () => drill.setNode(parent.id) : undefined}
          upLabel={parent?.label}
        />
      </>
    )
  }

  return (
    <>
      <ViewNote>{drill.node?.note}</ViewNote>
      <DrillHead
        first={drill.node ? 'Inside this' : 'Subteam'}
        units="Value in its own units"
        team={mixedTeams ? undefined : drill.node?.team}
      />
      <Box sx={{ display: 'grid', rowGap: 0.75 }}>
        {rows.map((row) => (
          <DrillRow
            key={row.node.id}
            label={row.node.label}
            edge={row.node.edge}
            value={row.value}
            unit={row.node.unit}
            domain={domains.get(row.node.unit) ?? domainFor(row.node.unit, [row.value])}
            provenance={row.node.provenance}
            gap={row.missing ? 'no number in the report' : undefined}
            onClick={row.node.children ? () => drill.setNode(row.node.id) : undefined}
            slice={sliceCaption(row.node, row.slice)}
            team={mixedTeams ? row.node.team : undefined}
          />
        ))}
      </Box>
    </>
  )
}

/** Focus = criterion: one criterion node, every scenario against it. */
function CompareView({ drill }: { drill: Drill }) {
  const node = drill.node
  if (!node) {
    return (
      <>
        <ViewNote>
          Pick a subteam to compare the scenarios on it. Without a criterion in hand there is
          nothing to break down, so this design shows no detail panel here.
        </ViewNote>
        <DrillHead first="Subteam" units="Overall score, −5…+5" />
        <Box sx={{ display: 'grid', rowGap: 0.75 }}>
          {CRITERION_TREE.map((team) => {
            const { value, missing } = resolve(team, drill.scenario, ANY, ANY)
            return (
              <DrillRow
                key={team.id}
                label={team.label}
                team={team.team}
                value={value}
                unit="score"
                domain={domainFor('score', [-5, 5])}
                provenance={team.provenance}
                gap={missing ? 'not scored' : undefined}
                onClick={() => drill.setNode(team.id)}
              />
            )
          })}
        </Box>
      </>
    )
  }

  const slice = effectiveSlice(node, ANY, ANY)
  const rows = DRILL_SCENARIOS.map((scenario) => ({
    scenario,
    ...resolve(node, scenario.key, slice.place, slice.period),
  }))
  const domain = domainFor(
    node.unit,
    rows.map((row) => row.value),
  )
  // Every row empty is a structural fact, not missing data: say which kind.
  const nothingToCompare = rows.every((row) => row.value === null)

  if (nothingToCompare) {
    return (
      <>
        <ViewNote>{node.note}</ViewNote>
        <NothingToCompare
          label={node.label}
          childCount={node.children?.length ?? 0}
          onDrill={node.children?.[0] ? () => drill.setNode(node.children![0].id) : undefined}
        />
      </>
    )
  }

  return (
    <>
      <ViewNote>
        {sliceCaption(node, slice) ? `${sliceCaption(node, slice)}. ` : ''}
        {node.note}
      </ViewNote>
      <DrillHead first="Scenario" units={unitHeading(node.unit)} team={node.team} />
      <Box sx={{ display: 'grid', rowGap: 0.75 }}>
        {rows.map((row) => (
          <DrillRow
            key={row.scenario.key}
            label={row.scenario.name}
            value={row.value}
            unit={node.unit}
            domain={domain}
            provenance={node.provenance}
            gap={row.missing ? 'not in this analysis' : undefined}
          />
        ))}
      </Box>
    </>
  )
}

/**
 * The breakdown panel: everything 4a puts in the facet bar lives here instead,
 * scoped to one criterion. Its own controls are local state, so moving to another
 * criterion starts its calendar over — the trade-off this design is testing.
 */
function WithinView({ node, drill }: { node: CriterionNode; drill: Drill }) {
  const places = node.places.filter((place) => place.key !== ANY)
  const periods = node.periods.filter((period) => period.key !== ANY)
  const [place, setPlace] = useState(places[0]?.key ?? ANY)

  if (!hasPlaces(node) && !hasPeriods(node)) {
    return (
      <Panel title="Where and when">
        <Typography variant="body2" sx={{ color: 'base.100' }}>
          This criterion is not broken out by place or period — it is one number for the whole Delta
          over the whole run.
        </Typography>
      </Panel>
    )
  }

  if (node.detail === 'waterAge') {
    return (
      <Panel
        title="Where and when"
        note="The grid already spends both of its axes on region and month, so it holds one scenario. Switch scenarios in the sidebar."
      >
        <WaterAgeGrid node={node} scenario={drill.scenario} />
      </Panel>
    )
  }

  // Periods are the more telling axis where a node has both, so they take the columns.
  const axisIsPeriod = periods.length > 0
  return (
    <Panel
      title="Where and when"
      note={
        axisIsPeriod && places.length > 0
          ? 'Columns are periods; pick the place to hold fixed. Both controls belong to this panel only.'
          : undefined
      }
    >
      {axisIsPeriod && places.length > 0 && (
        <Box sx={{ mb: 1.5 }}>
          <FacetRow label="Place">
            {places.map((option) => (
              <PlacePill
                key={option.key}
                label={option.label}
                active={option.key === place}
                onClick={() => setPlace(option.key)}
              />
            ))}
          </FacetRow>
        </Box>
      )}
      <SliceMatrix
        node={node}
        axis={axisIsPeriod ? periods : places}
        otherKey={axisIsPeriod ? place : ANY}
        axisIsPeriod={axisIsPeriod}
      />
    </Panel>
  )
}

/** Panel-local place chooser, deliberately not the page-level control 4a uses. */
function PlacePill({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <Typography
      component="button"
      variant="controlLabel"
      onClick={onClick}
      aria-pressed={active}
      sx={{
        px: 1.1,
        py: 0.55,
        borderRadius: 999,
        border: 1,
        borderColor: active ? 'primary.main' : 'border.strong',
        bgcolor: active ? 'primary.main' : 'transparent',
        color: active ? 'common.black' : 'base.50',
        cursor: 'pointer',
        transition: 'background-color 150ms ease, border-color 150ms ease, color 150ms ease',
        '&:hover, &:focus-visible': { borderColor: 'primary.main' },
      }}
    >
      {label}
    </Typography>
  )
}

function Panel({
  title,
  note,
  children,
}: {
  title: string
  note?: string
  children: React.ReactNode
}) {
  return (
    <Box
      sx={(theme) => ({
        mt: theme.jtSpacing.component.md,
        pt: theme.jtSpacing.component.md,
        borderTop: 1,
        borderColor: 'border.default',
      })}
    >
      <Typography variant="eyebrow" component="div" sx={{ mb: note ? 0.5 : 1.5 }}>
        {title}
      </Typography>
      {note && (
        <Typography variant="body2" sx={{ display: 'block', mb: 1.5, color: 'base.100' }}>
          {note}
        </Typography>
      )}
      {children}
    </Box>
  )
}
