// 4a — place and time as a first-class axis.
//
// Three dimensions sit side by side in the facet bar: scenario, criterion path,
// and where/when. Focus says which one is pinned; the other two vary. Because all
// three are top-level and independent, the user can arrive at the same cell from
// any of the four intents and re-anchor without losing the rest of the selection.
//
// The cost this design makes visible: the slice axis is mostly empty. Only two
// branches in the whole tree are broken out by place, and the five subteams use
// five geographies that do not line up, so "pick a place" is not yet a question
// the data can answer across criteria.
import { Box, Typography } from '@mui/material'
import { useMemo } from 'react'
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
  SliceRow,
  ViewNote,
  ViewSwitcher,
} from '../drilldown/DrillBits'
import { WaterAgeGrid } from '../drilldown/DrillBits'
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
  resolve,
} from '../drilldown/model'
import type { CriterionNode } from '../drilldown/model'
import type { Phrase } from '../drilldown/DrillBits'
import { CRITERION_TREE, nodesAtLevel } from '../drilldown/tree'
import { ALL_CRITERIA, sliceSupport, useDrill } from '../drilldown/useDrill'
import type { Drill } from '../drilldown/useDrill'

const VIEW_OPTIONS = [
  {
    key: 'criterion' as const,
    label: 'Compare scenarios',
    outcome:
      'Pin one criterion. Every scenario becomes a row, so you read one measurement across all six futures.',
  },
  {
    key: 'scenario' as const,
    label: 'Profile one scenario',
    outcome:
      'Pin one scenario. Every criterion beneath where you are becomes a row, so you read one future across its parts.',
  },
  {
    key: 'slice' as const,
    label: 'Look at one place & time',
    outcome:
      'Pin a place and a period. Everything any subteam measures there is listed, whichever criterion it belongs to.',
  },
]

/** Children of the current node; the five subteams when nothing is selected. */
const childrenOf = (node?: CriterionNode) => (node ? (node.children ?? []) : CRITERION_TREE)

export default function DrillAxes() {
  const drill = useDrill()
  const support = sliceSupport(drill)
  const places = drill.node?.places.filter((place) => place.key !== ANY) ?? []
  const periods = drill.node?.periods.filter((period) => period.key !== ANY) ?? []
  const slice = drill.node ? effectiveSlice(drill.node, drill.place, drill.period) : undefined

  // The scenario pills only matter when a scenario is pinned, or when the node
  // carries a grid that shows one scenario at a time. Saying so beats greying
  // out a control with no explanation.
  const scenarioUsed = drill.focus === 'scenario' || drill.node?.detail === 'waterAge'
  const scenarioStatus =
    drill.focus === 'scenario'
      ? 'pinned'
      : drill.node?.detail === 'waterAge'
        ? 'month grid only'
        : 'not used in this view'

  return (
    <SketchCard id="4a" width={DRILL_CARD_WIDTH}>
      <DrillLayout
        controls={
          <ControlPanel>
            <ViewSwitcher options={VIEW_OPTIONS} value={drill.focus} onChange={drill.setFocus} />
            <ControlDivider label="Change what you see" />
            <CriterionAxis
              path={drill.path}
              childNodes={childrenOf(drill.node)}
              onPick={drill.setNode}
              rootId={ALL_CRITERIA}
              status={
                drill.focus === 'slice'
                  ? 'sets which places are on offer'
                  : drill.focus === 'criterion'
                    ? 'pinned'
                    : undefined
              }
              // Profiling a scenario means opening a criterion into its parts, so a
              // measurement is a dead end — close it off rather than let the reader
              // land on an empty table.
              deepestLevel={drill.focus === 'scenario' ? 'metric' : 'entity'}
              isChildClosed={drill.focus === 'scenario' ? (child) => !child.children : undefined}
              closedNote="These are measurements — they are already the rows of this view. Switch to Compare scenarios to stand on one."
            />
            <ScenarioRow
              value={drill.scenario}
              onChange={drill.setScenario}
              status={scenarioStatus}
              inert={!scenarioUsed}
            />
            {drill.node ? (
              <>
                <SliceRow
                  label="Where"
                  facets={places}
                  effective={slice?.place ?? ANY}
                  onChange={drill.setPlace}
                  supported={support.place}
                />
                <SliceRow
                  label="When"
                  facets={periods}
                  effective={slice?.period ?? ANY}
                  onChange={drill.setPeriod}
                  supported={support.period}
                />
              </>
            ) : (
              <WhereAtTheTop />
            )}
          </ControlPanel>
        }
        view={
          <>
            <NowShowing parts={sentenceFor(drill, slice)} />
            {drill.focus === 'scenario' && <ProfileView drill={drill} />}
            {drill.focus === 'criterion' && <CompareView drill={drill} />}
            {drill.focus === 'slice' && (
              <SliceView drill={drill} place={slice?.place ?? ANY} period={slice?.period ?? ANY} />
            )}
          </>
        }
      />
    </SketchCard>
  )
}

/**
 * The whole state as one sentence. Every view and every combination of selections
 * goes through here, so the reader learns one grammar instead of three layouts:
 *   verb + what varies + "on" the criterion + "across" the place + "in" the period.
 * Terms the reader chose are emphasised; the pinned one carries the accent.
 */
function sentenceFor(drill: Drill, slice?: { place: string; period: string }): Phrase[] {
  const node = drill.node
  const mark = node ? <TeamMark team={node.team} /> : undefined
  const where = slice && slice.place !== ANY && node ? labelOf(node.places, slice.place) : null
  const when = slice && slice.period !== ANY && node ? labelOf(node.periods, slice.period) : null

  /** The trailing "across PLACE in PERIOD", omitted entirely when neither applies. */
  const sliceTail = (): Phrase[] => {
    const tail: Phrase[] = []
    if (where) tail.push({ text: 'across' }, { text: where, kind: 'value' })
    if (when) tail.push({ text: 'in' }, { text: when, kind: 'value' })
    if (!where && !when && node) tail.push({ text: '— not broken out by place or period' })
    return tail
  }

  if (drill.focus === 'slice') {
    const at: Phrase[] = []
    if (where) at.push({ text: 'at' }, { text: where, kind: 'pinned' })
    if (when) at.push({ text: 'in' }, { text: when, kind: 'pinned' })
    if (at.length === 0) {
      return [{ text: 'Pick a place or a period on the left to look at one slice.' }]
    }
    return [
      { text: 'Showing' },
      { text: 'everything measured', kind: 'value' },
      ...at,
      { text: ', across' },
      { text: 'all six scenarios', kind: 'value' },
    ]
  }

  if (drill.focus === 'scenario') {
    const value =
      node &&
      (() => {
        const resolved = resolve(node, drill.scenario, slice?.place ?? ANY, slice?.period ?? ANY)
        return resolved.value === null ? null : fmtValue(resolved.value, node.unit)
      })()
    // A leaf has no parts, so the verb changes: you are reading it, not breaking it up.
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
      ...sliceTail(),
    ]
  }

  return [
    { text: 'Comparing' },
    { text: 'all six scenarios', kind: 'value' },
    { text: 'on' },
    node
      ? { text: node.label, kind: 'pinned', icon: mark }
      : { text: 'each of the five subteams', kind: 'pinned' },
    ...sliceTail(),
  ]
}

/**
 * At the top of the criterion axis there is no shared geography to offer: the five
 * subteams between them use nineteen regions on four different partitions. Saying
 * so is more useful than a control that cannot resolve anything.
 */
function WhereAtTheTop() {
  return (
    <FacetRow label="Where & when" inert status="pick a subteam first">
      <Typography variant="chartAxis" sx={{ color: 'base.100' }}>
        Ecology uses 8 estuarine regions, EJ 5, Recreation 4 and eco-cultural 2, and the partitions
        do not line up — so place becomes available once you choose a subteam, not before.
      </Typography>
    </FacetRow>
  )
}

/** Focus = scenario: one scenario, the criteria beneath wherever you are. */
function ProfileView({ drill }: { drill: Drill }) {
  const nodes = childrenOf(drill.node)
  // Each child resolves the slice on its own terms; most ignore it entirely.
  const rows = nodes.map((node) => {
    const slice = effectiveSlice(node, drill.place, drill.period)
    return { node, slice, ...resolve(node, drill.scenario, slice.place, slice.period) }
  })
  const domains = domainsByUnit(rows.map((row) => ({ unit: row.node.unit, value: row.value })))
  // Only mark rows where the block mixes subteams; repeating one icon down a column
  // of siblings is noise, not a signal.
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
      {drill.node?.detail === 'waterAge' && (
        <Box sx={(theme) => ({ mt: theme.jtSpacing.component.md })}>
          <WaterAgeGrid node={drill.node} scenario={drill.scenario} />
        </Box>
      )}
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
          Pick a subteam, a metric or an entity on the criterion axis to compare the scenarios on
          it. Everything below is the overall score each subteam gives each scenario.
        </ViewNote>
        <TeamOverview drill={drill} />
      </>
    )
  }
  const slice = effectiveSlice(node, drill.place, drill.period)
  const rows = DRILL_SCENARIOS.map((scenario) => ({
    scenario,
    ...resolve(node, scenario.key, slice.place, slice.period),
  }))
  const domain = domainFor(
    node.unit,
    rows.map((row) => row.value),
  )
  const inexact = rows.some((row) => !row.missing && row.matched !== 'exact')
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
      <ViewNote>{node.note}</ViewNote>
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
      {(inexact || slice.defaulted) && (
        <Typography variant="chartAxis" sx={{ display: 'block', mt: 1.5, color: 'base.300' }}>
          {slice.defaulted
            ? 'This criterion only exists per place or period, so the view fell back to its first one. Pick above to move it.'
            : 'This criterion does not resolve the whole slice; the values above fall back to what it does break out.'}
        </Typography>
      )}
      {node.detail === 'waterAge' && (
        <Box sx={(theme) => ({ mt: theme.jtSpacing.component.md })}>
          <WaterAgeGrid node={node} scenario={drill.scenario} />
        </Box>
      )}
    </>
  )
}

/** The five overall scores, as the entry point for criterion-driven drilling. */
function TeamOverview({ drill }: { drill: Drill }) {
  const rows = CRITERION_TREE.flatMap((team) =>
    DRILL_SCENARIOS.map((scenario) => ({
      team,
      scenario,
      ...resolve(team, scenario.key, ANY, ANY),
    })),
  )
  const domain = domainFor(
    'score',
    rows.map((row) => row.value),
  )
  return (
    <Box sx={(theme) => ({ display: 'grid', rowGap: theme.jtSpacing.component.sm })}>
      {CRITERION_TREE.map((team) => (
        <Box key={team.id}>
          <DrillHead first={team.label} units="Overall score, −5…+5" team={team.team} />
          <Box sx={{ display: 'grid', rowGap: 0.75 }}>
            {DRILL_SCENARIOS.map((scenario) => {
              const { value, missing } = resolve(team, scenario.key, ANY, ANY)
              return (
                <DrillRow
                  key={scenario.key}
                  label={scenario.name}
                  value={value}
                  unit="score"
                  domain={domain}
                  provenance={team.provenance}
                  gap={missing ? 'not scored' : undefined}
                  onClick={() => drill.setNode(team.id)}
                />
              )
            })}
          </Box>
        </Box>
      ))}
    </Box>
  )
}

/**
 * Focus = where & when: everything in the tree that resolves the selected slice
 * exactly. When the answer is nothing, that is the finding — place and period are
 * axes almost no criterion is cut along.
 */
function SliceView({ drill, place, period }: { drill: Drill; place: string; period: string }) {
  const matches = useMemo(() => {
    if (place === ANY && period === ANY) return []
    const candidates = [...nodesAtLevel('metric'), ...nodesAtLevel('entity')]
    return candidates.filter((node) =>
      DRILL_SCENARIOS.some(
        (scenario) => resolve(node, scenario.key, place, period).matched === 'exact',
      ),
    )
  }, [place, period])

  // Facet labels belong to whichever node defines them, so read them off the first
  // node that resolves this slice, or the one the user is standing in.
  const naming = drill.node ?? matches[0]
  const sliceLabel = [
    place === ANY || !naming ? null : labelOf(naming.places, place),
    period === ANY || !naming ? null : labelOf(naming.periods, period),
  ]
    .filter(Boolean)
    .join(' · ')

  if (matches.length === 0) {
    return (
      <ViewNote>
        {sliceLabel
          ? 'No criterion in the tree is broken out along this slice. Only Ecology’s species niches (region × water year) and EJ’s water age (region × month) are cut by place at all, and they use different regions.'
          : 'Choose a subteam first — the places on offer belong to whichever criterion you are standing in.'}
      </ViewNote>
    )
  }

  const domains = domainsByUnit(
    matches.flatMap((node) =>
      DRILL_SCENARIOS.map((scenario) => ({
        unit: node.unit,
        value: resolve(node, scenario.key, place, period).value,
      })),
    ),
  )

  return (
    <>
      <ViewNote>
        {`${sliceLabel}: ${matches.length} measurement${matches.length === 1 ? '' : 's'}. `}
        Everything the five subteams measure at exactly this place and period, whichever criterion
        it belongs to. This is the view the other design cannot produce.
      </ViewNote>
      <Box sx={(theme) => ({ display: 'grid', rowGap: theme.jtSpacing.component.sm })}>
        {matches.map((node) => (
          <Box key={node.id}>
            <DrillHead first={node.label} units={unitHeading(node.unit)} team={node.team} />
            <Box sx={{ display: 'grid', rowGap: 0.75 }}>
              {DRILL_SCENARIOS.map((scenario) => {
                const { value, missing } = resolve(node, scenario.key, place, period)
                return (
                  <DrillRow
                    key={scenario.key}
                    label={scenario.name}
                    value={value}
                    unit={node.unit}
                    domain={domains.get(node.unit) ?? domainFor(node.unit, [value])}
                    provenance={node.provenance}
                    gap={missing ? 'not in this analysis' : undefined}
                    onClick={() => drill.setNode(node.id)}
                  />
                )
              })}
            </Box>
          </Box>
        ))}
      </Box>
    </>
  )
}
