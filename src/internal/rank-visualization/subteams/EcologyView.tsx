// Ecology's evidence: where each species could live, and the comparison that
// tests the team's finding.
//
// Their deepest evidence is 8 species × 8 regions × 2 water years, and their own
// summary says the scenarios barely separate. The comparison page cannot show
// that, because it puts scenario on an axis and so implies scenario is what moves
// the numbers. Here the grid and the maps are two views of the same cube, and the
// last panel measures the claim on one axis: for each species, how far the
// scenarios spread against how far the water years do.
//
// Species and life stages are one hierarchy throughout: a species heads a group,
// its stages are the rows. The same grouping orders the tolerances, the grid and
// the dumbbell plot, so the eye learns it once.
import { Box, Typography } from '@mui/material'

import { useState } from 'react'
import { ECOLOGY_NICHE, ECOLOGY_REGIONS, ECOLOGY_SPECIES } from '../drilldown/ecologyNiche'
import type { EcologyRegionKey, EcologySpeciesKey } from '../drilldown/ecologyNiche'
import {
  ECOLOGY_RERUN_DELTA,
  ECOLOGY_RERUN_REGION,
  ECOLOGY_RERUN_SCENARIOS,
} from '../drilldown/ecologyRerun'
import type { RerunScenario } from '../drilldown/ecologyRerun'
import { SCENARIO_NAME } from '../drilldown/model'
import { cellFill } from '../data'
import { SUBTEAM_PROFILES } from './profiles'
import { RegionValues } from './RegionValues'
import {
  Choice,
  ColumnHead,
  DivergingLegend,
  HeatCell,
  Panel,
  ScaleLegend,
  SubteamPage,
  Swatch,
} from './SubteamFrame'
import { MetricCards, SuitabilityDays } from './aids'

const SCENARIOS = ['bau', 'em', 'ngw', 'bf', 'cor'] as const
type NicheScenario = (typeof SCENARIOS)[number]

/** The species the report treats as invasives, for which fewer suitable days reads as the better outcome. */
const INVASIVE = new Set<EcologySpeciesKey>(['largemouthBass', 'overbiteClam', 'egeria'])

const YEARS = [
  { key: '2019' as const, index: 0 as const, label: '2019, a wet year', tag: 'wet' },
  { key: '2020' as const, index: 1 as const, label: '2020, a dry year', tag: 'dry' },
]

/**
 * Shapefile region → the key the niche data stores it under. Five of the eight
 * data regions have an outline; "Suisun Marsh" has an outline and no data key,
 * because the report folds it into Suisun Bay.
 */
const REGION_KEY: Record<string, string> = {
  'Suisun Bay': 'suisunBay',
  Confluence: 'confluence',
  Central: 'centralDelta',
  'South Delta': 'southDelta',
  'North Delta': 'northDelta',
}

type Species = (typeof ECOLOGY_SPECIES)[number]

/** "Longfin smelt, juvenile" is one species with one stage; group the list by species. */
const GROUPS: {
  name: string
  stages: { key: EcologySpeciesKey; stage: string; row: Species }[]
}[] = []
for (const row of ECOLOGY_SPECIES) {
  const [name, stage] = row.label.split(', ')
  let group = GROUPS.find((entry) => entry.name === name)
  if (!group) {
    group = { name, stages: [] }
    GROUPS.push(group)
  }
  group.stages.push({ key: row.key, stage: stage ?? '', row })
}

const cell = (species: EcologySpeciesKey, scenario: NicheScenario, region: EcologyRegionKey) =>
  ECOLOGY_NICHE[species]?.[scenario]?.[region]

const pct = (value: number) => `${Math.round(value * 100)}%`

/** "0.4–10 psu", "< 4 psu", "9–15 °C" → [low, high]. */
function parseRange(text: string): [number, number] {
  const numbers = (text.match(/[\d.]+/g) ?? []).map(Number)
  if (text.trim().startsWith('<')) return [0, numbers[0] ?? 0]
  if (numbers.length === 1) return [numbers[0], numbers[0]]
  return [numbers[0], numbers[1]]
}

const SALINITY_AXIS = { max: 40, ticks: [0, 10, 20, 30, 40], unit: 'psu' }
const TEMPERATURE_AXIS = { max: 30, ticks: [0, 10, 20, 30], unit: '°C' }

export default function EcologyView() {
  const [scenario, setScenario] = useState<NicheScenario>('ngw')
  const [view, setView] = useState<'grid' | 'map'>('grid')
  const [gridMode, setGridMode] = useState<'compare' | 'single'>('compare')
  const [reading, setReading] = useState<'level' | 'change'>('level')
  const [gridYear, setGridYear] = useState<'2019' | '2020'>('2019')
  const [mapSpecies, setMapSpecies] = useState<EcologySpeciesKey>(ECOLOGY_SPECIES[0].key)
  const [mapYear, setMapYear] = useState<'2019' | '2020'>('2019')
  const shownYear = YEARS.find((year) => year.key === gridYear) ?? YEARS[0]

  // The claim under test: for one species and region, how much does changing the
  // scenario move the proportion, and how much does changing the water year?
  const spreads = ECOLOGY_SPECIES.map((species) => {
    let byScenario = 0
    let byYear = 0
    for (const region of ECOLOGY_REGIONS) {
      const perScenario = SCENARIOS.map((key) => cell(species.key, key, region.key)).filter(
        (pair): pair is [number, number] => !!pair,
      )
      if (perScenario.length === 0) continue
      for (const index of [0, 1] as const) {
        const values = perScenario.map((pair) => pair[index])
        byScenario = Math.max(byScenario, Math.max(...values) - Math.min(...values))
      }
      for (const pair of perScenario) byYear = Math.max(byYear, Math.abs(pair[0] - pair[1]))
    }
    return { key: species.key, byScenario, byYear }
  })
  const spreadOf = (key: EcologySpeciesKey) => spreads.find((row) => row.key === key)

  // Difference mode: the same cell minus its Business as Usual value, the gap between
  // two percentages. The fill runs on one continuous ramp whose ends are the largest
  // gaps on the grid being shown, and the legend prints those ends.
  const diffOf = (species: EcologySpeciesKey, region: EcologyRegionKey, index: 0 | 1) => {
    const here = cell(species, scenario, region)?.[index]
    const base = cell(species, 'bau', region)?.[index]
    return here === undefined || base === undefined ? undefined : here - base
  }
  const diffMax = Math.max(
    0.01,
    ...ECOLOGY_SPECIES.flatMap((species) =>
      ECOLOGY_REGIONS.flatMap((region) =>
        ([0, 1] as const).map((index) => Math.abs(diffOf(species.key, region.key, index) ?? 0)),
      ),
    ),
  )
  const scenarioOptions = SCENARIOS.filter((key) => reading === 'level' || key !== 'bau')

  const gridColumns = `150px ${gridMode === 'compare' ? '44px ' : ''}repeat(${ECOLOGY_REGIONS.length}, minmax(76px, 1fr))`

  return (
    <SubteamPage
      profile={SUBTEAM_PROFILES.ecology}
      aidWide
      aid={
        <Box sx={{ display: 'grid', gap: 2.5 }}>
          <MetricCards
            metrics={[
              {
                label: 'Species fundamental niches',
                counted: true,
                items: [
                  'Proportion of suitable days',
                  '8 species and life stages, 8 regions, 2 water years',
                  'Not in the score',
                ],
              },
              {
                label: 'Pelagic food webs',
                counted: true,
                items: ['A food-web proxy from restored acres', 'Ranked, and in the score'],
              },
              {
                label: 'Accessible aquatic habitat',
                counted: true,
                items: ['Newly accessible tidal wetland, in acres', 'Ranked, and in the score'],
              },
              {
                label: 'Conceptual models',
                counted: false,
                items: ['How the ecosystem responds, as narrative', 'Not yet built'],
              },
            ]}
          />
          <SuitabilityDays />
        </Box>
      }
      method={
        <Panel
          title="Eight species and life stages, each with a tolerance"
          intro="A region counts as **suitable** for a species on a day when the water’s **salinity and temperature are both inside its range**. Salinity is in **psu**, practical salinity units: fresh water is near 0 and sea water about 35. Two species were followed at two life stages, because a juvenile and an adult tolerate different water."
        >
          <Box sx={{ overflowX: 'auto', overflowY: 'hidden' }}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '200px 1fr 1fr',
                columnGap: 3,
                rowGap: 0.5,
                minWidth: 720,
                alignItems: 'center',
              }}
            >
              <Box />
              <Axis label="Salinity, psu" axis={SALINITY_AXIS} />
              <Axis label="Temperature, °C" axis={TEMPERATURE_AXIS} />
              {GROUPS.map((group) => (
                <Box key={group.name} sx={{ display: 'contents' }}>
                  {group.stages.map((entry, i) => (
                    <Box key={entry.key} sx={{ display: 'contents' }}>
                      <SpeciesHead
                        name={group.name}
                        stage={entry.stage}
                        first={i === 0}
                        invasive={INVASIVE.has(entry.key)}
                      />
                      <RangeBar
                        range={parseRange(entry.row.salinity)}
                        axis={SALINITY_AXIS}
                        text={entry.row.salinity}
                      />
                      <RangeBar
                        range={parseRange(entry.row.temperature)}
                        axis={TEMPERATURE_AXIS}
                        text={entry.row.temperature}
                      />
                    </Box>
                  ))}
                </Box>
              ))}
            </Box>
          </Box>
        </Panel>
      }
    >
      <Panel
        title="Where each species could live"
        intro="One cube of numbers, two ways to read it. Each value is the **proportion of days in the water year** on which a region was suitable for a species, from the Sept report’s tables. The **grid** shows every species and region at once for one scenario; the **maps** show one species across all scenarios, on the five regions that have an outline. Switch to **the difference from Business as Usual** to see what a scenario changes rather than where a species lives anyway. ==None of this enters the criterion score.=="
      >
        <Choice
          label="View as"
          value={view}
          onChange={setView}
          options={[
            { key: 'grid', label: 'grid, all species × all regions' },
            { key: 'map', label: 'maps, one species across scenarios' },
          ]}
        />

        {view === 'grid' ? (
          <Box sx={{ display: 'grid', gap: 1 }}>
            <Choice
              label="Show"
              value={reading}
              onChange={(key) => {
                setReading(key)
                if (key === 'change' && scenario === 'bau') setScenario('ngw')
              }}
              options={[
                { key: 'level', label: 'the value' },
                { key: 'change', label: 'the difference from Business as Usual' },
              ]}
            />
            <Choice
              label="Scenario"
              value={scenario}
              onChange={setScenario}
              options={scenarioOptions.map((key) => ({ key, label: SCENARIO_NAME[key] }))}
            />
            <Choice
              label="Years"
              value={gridMode}
              onChange={setGridMode}
              options={[
                { key: 'compare', label: 'both years in each cell' },
                { key: 'single', label: 'one at a time' },
              ]}
            />
            {gridMode === 'single' && (
              <Choice
                label="Water year"
                value={gridYear}
                onChange={setGridYear}
                options={YEARS.map((year) => ({ key: year.key, label: year.label }))}
              />
            )}

            <Box sx={{ overflowX: 'auto', overflowY: 'hidden', mt: 0.5 }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: gridColumns,
                  columnGap: 0.5,
                  rowGap: 0.75,
                  minWidth: 800,
                  alignItems: 'end',
                }}
              >
                <Typography variant="body2" sx={{ color: 'base.50', alignSelf: 'end' }}>
                  <Box component="strong">{gridMode === 'single' ? shownYear.label : ''}</Box>
                </Typography>
                {gridMode === 'compare' && <Box />}
                {ECOLOGY_REGIONS.map((region) => (
                  <ColumnHead key={region.key}>{region.label}</ColumnHead>
                ))}
                {GROUPS.map((group) =>
                  group.stages.map((entry, i) => (
                    <Box key={entry.key} sx={{ display: 'contents' }}>
                      <SpeciesHead
                        name={group.name}
                        stage={entry.stage}
                        first={i === 0}
                        invasive={INVASIVE.has(entry.key)}
                      />
                      {gridMode === 'compare' && (
                        <Box sx={{ display: 'grid', gap: 0.25 }}>
                          {YEARS.map((year) => (
                            <Typography
                              key={year.key}
                              variant="body2"
                              sx={{
                                color: 'base.100',
                                height: 26,
                                display: 'flex',
                                alignItems: 'center',
                              }}
                            >
                              {year.tag}
                            </Typography>
                          ))}
                        </Box>
                      )}
                      {ECOLOGY_REGIONS.map((region) => {
                        const pair = cell(entry.key, scenario, region.key)
                        const years = gridMode === 'compare' ? YEARS : [shownYear]
                        return (
                          <Box key={region.key} sx={{ display: 'grid', gap: 0.25 }}>
                            {years.map((year) => {
                              if (reading === 'change') {
                                const diff = diffOf(entry.key, region.key, year.index)
                                const pts = diff === undefined ? null : Math.round(diff * 100)
                                return (
                                  <HeatCell
                                    key={year.key}
                                    value={pts}
                                    max={1}
                                    tone="salinity.teal"
                                    fill={
                                      diff === undefined || diff === 0
                                        ? undefined
                                        : cellFill((diff / diffMax) * 5)
                                    }
                                    height={gridMode === 'compare' ? 26 : 30}
                                    text={
                                      pts === null
                                        ? 'no data'
                                        : pts === 0
                                          ? '0'
                                          : `${pts > 0 ? '+' : '−'}${Math.abs(pts)}%`
                                    }
                                    title={`${region.label}, ${year.label}: ${pct(cell(entry.key, 'bau', region.key)?.[year.index] ?? 0)} under Business as Usual, ${pct(pair?.[year.index] ?? 0)} here`}
                                  />
                                )
                              }
                              const value = pair?.[year.index]
                              return (
                                <HeatCell
                                  key={year.key}
                                  value={value ?? null}
                                  max={1}
                                  tone="salinity.teal"
                                  height={gridMode === 'compare' ? 26 : 30}
                                  text={value === undefined ? 'no data' : pct(value)}
                                  title={`${region.label}, ${year.label}`}
                                />
                              )
                            })}
                          </Box>
                        )
                      })}
                    </Box>
                  )),
                )}
              </Box>
            </Box>
            {reading === 'change' ? (
              <DivergingLegend
                label={`Difference from Business as Usual, not a score: the gap between the two percentages, so suitable on 93% of days under Business as Usual and 86% here shows as −7%. Hover a cell for both values${gridMode === 'compare' ? '; each region shows wet 2019 above dry 2020' : ''}.`}
                min={`−${Math.round(diffMax * 100)}%`}
                max={`+${Math.round(diffMax * 100)}%`}
                note="Blue: more suitable days than today; orange: fewer. The ends of the ramp are the largest gaps on this grid. For the three invasives the team reads fewer as the better outcome."
              />
            ) : (
              <ScaleLegend
                tone="salinity.teal"
                label={
                  gridMode === 'compare'
                    ? 'Proportion of suitable days; each region shows wet 2019 above dry 2020'
                    : 'Proportion of suitable days'
                }
                min="0%"
                max="100%"
              />
            )}
          </Box>
        ) : (
          <Box sx={{ display: 'grid', gap: 1 }}>
            <Choice
              label="Species"
              value={mapSpecies}
              onChange={setMapSpecies}
              options={ECOLOGY_SPECIES.map((species) => ({
                key: species.key,
                label: species.label,
              }))}
            />
            <Choice
              label="Water year"
              value={mapYear}
              onChange={setMapYear}
              options={YEARS.map((year) => ({ key: year.key, label: year.label }))}
            />
            <RegionValues
              team="ecology"
              scenarios={[...SCENARIOS]}
              coordsFor={(region, scenario) =>
                REGION_KEY[region]
                  ? {
                      criterion: `eco-niche-${mapSpecies}`,
                      scenario,
                      place: REGION_KEY[region],
                      period: mapYear,
                    }
                  : null
              }
              unitLabel="Proportion of suitable days"
              changeToggle
            />
          </Box>
        )}
      </Panel>

      <RerunPanel />

      <Panel
        title="What moves these numbers more: the scenario, or the water year?"
        intro="For each species, in any one region: **how far apart are the five scenarios** at most, and **how far apart are the two water years** at most? Both are read on the same axis, as a gap between two percentages of the season. ==Where the pink dot sits far to the right of the teal one, the water year moves that species more than any scenario does.=="
      >
        <Dumbbell
          rows={GROUPS}
          valueOf={(key) => {
            const spread = spreadOf(key)
            return [spread?.byScenario ?? 0, spread?.byYear ?? 0]
          }}
        />
      </Panel>
    </SubteamPage>
  )
}

/**
 * The 27 Oct rerun: a new CalSIM baseline, an updated Calling on Reserves, and A
 * Tunnel for the first time. It has its own baseline, so it gets its own grid
 * rather than joining the five scenarios above. Delta-wide is split by water year;
 * each region is one number for 2019 and 2020 together, as the report gives it.
 */
function RerunPanel() {
  const [scenario, setScenario] = useState<RerunScenario>('tunnel')
  const [reading, setReading] = useState<'level' | 'change'>('change')
  const columns = [
    ...YEARS.map((year) => ({
      key: `delta-${year.key}`,
      label: `Delta, ${year.tag} ${year.key}`,
      of: (species: EcologySpeciesKey, at: RerunScenario) =>
        ECOLOGY_RERUN_DELTA[species][at][year.index],
    })),
    ...ECOLOGY_REGIONS.map((region) => ({
      key: region.key,
      label: region.label,
      of: (species: EcologySpeciesKey, at: RerunScenario) =>
        ECOLOGY_RERUN_REGION[species][at][region.key],
    })),
  ]
  const diffOf = (species: EcologySpeciesKey, column: (typeof columns)[number]) =>
    column.of(species, scenario) - column.of(species, 'base')
  const diffMax = Math.max(
    0.01,
    ...ECOLOGY_SPECIES.flatMap((species) =>
      columns.map((column) => Math.abs(diffOf(species.key, column))),
    ),
  )
  const options = ECOLOGY_RERUN_SCENARIOS.filter(
    (option) => reading === 'level' || option.key !== 'base',
  )
  const name = (at: RerunScenario) =>
    ECOLOGY_RERUN_SCENARIOS.find((option) => option.key === at)?.label ?? at

  return (
    <Panel
      title="A Tunnel, and Calling on Reserves again, on a new base"
      intro="On **27 October** the team reran the niche analysis on a **new CalSIM baseline**, with an updated Calling on Reserves and **A Tunnel for the first time**. This run has its own baseline, so read it against **New CalSIM Base**, not against Business as Usual above. Delta-wide is split by water year; **each region is one number for 2019 and 2020 together**, as the report gives it. ==None of this enters the criterion score.=="
    >
      <Choice
        label="Show"
        value={reading}
        onChange={(key) => {
          setReading(key)
          if (key === 'change' && scenario === 'base') setScenario('tunnel')
        }}
        options={[
          { key: 'level', label: 'the value' },
          { key: 'change', label: 'the difference from New CalSIM Base' },
        ]}
      />
      <Choice
        label="Scenario"
        value={scenario}
        onChange={setScenario}
        options={options.map((option) => ({ key: option.key, label: option.label }))}
      />
      <Box sx={{ overflowX: 'auto', overflowY: 'hidden', mt: 0.5 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: `150px repeat(${columns.length}, minmax(80px, 1fr))`,
            columnGap: 0.5,
            rowGap: 0.75,
            minWidth: 960,
            alignItems: 'end',
          }}
        >
          <Box />
          {columns.map((column) => (
            <ColumnHead key={column.key}>{column.label}</ColumnHead>
          ))}
          {GROUPS.map((group) =>
            group.stages.map((entry, i) => (
              <Box key={entry.key} sx={{ display: 'contents' }}>
                <SpeciesHead
                  name={group.name}
                  stage={entry.stage}
                  first={i === 0}
                  invasive={INVASIVE.has(entry.key)}
                />
                {columns.map((column) => {
                  const here = column.of(entry.key, scenario)
                  const base = column.of(entry.key, 'base')
                  if (reading === 'level') {
                    return (
                      <HeatCell
                        key={column.key}
                        value={here}
                        max={1}
                        tone="salinity.teal"
                        text={pct(here)}
                        title={`${column.label}, ${name(scenario)}`}
                      />
                    )
                  }
                  const diff = here - base
                  const pts = Math.round(diff * 100)
                  return (
                    <HeatCell
                      key={column.key}
                      value={pts}
                      max={1}
                      tone="salinity.teal"
                      fill={diff === 0 ? undefined : cellFill((diff / diffMax) * 5)}
                      text={pts === 0 ? '0' : `${pts > 0 ? '+' : '−'}${Math.abs(pts)}%`}
                      title={`${column.label}: ${pct(base)} under New CalSIM Base, ${pct(here)} under ${name(scenario)}`}
                    />
                  )
                })}
              </Box>
            )),
          )}
        </Box>
      </Box>
      {reading === 'change' ? (
        <DivergingLegend
          label="Difference from New CalSIM Base, not a score: the gap between the two percentages. Hover a cell for both values."
          min={`−${Math.round(diffMax * 100)}%`}
          max={`+${Math.round(diffMax * 100)}%`}
          note="Blue: more suitable days than the new base; orange: fewer. The ends of the ramp are the largest gaps on this grid. For the three invasives the team reads fewer as the better outcome."
        />
      ) : (
        <ScaleLegend tone="salinity.teal" label="Proportion of suitable days" min="0%" max="100%" />
      )}
    </Panel>
  )
}

/**
 * The species name on the first row of its group, and the stage on every row. A
 * species with one stage puts its name on the row itself, so the cells beside it
 * never sit under an empty line. Everything is the body face: bold for the
 * species, plain for the stage.
 */
function SpeciesHead({
  name,
  stage,
  first,
  invasive,
}: {
  name: string
  stage: string
  first: boolean
  invasive?: boolean
}) {
  const tag = invasive ? (
    <Box component="span" sx={{ color: 'base.200' }}>
      {' '}
      invasive
    </Box>
  ) : null
  if (!stage) {
    return (
      <Typography variant="body2" sx={{ color: 'base.50', alignSelf: 'center' }}>
        <Box component="strong">{name}</Box>
        {tag}
      </Typography>
    )
  }
  return (
    <Box sx={{ display: 'grid', alignContent: 'center' }}>
      {first && (
        <Typography variant="body2" sx={{ color: 'base.50' }}>
          <Box component="strong">{name}</Box>
          {tag}
        </Typography>
      )}
      <Typography variant="body2" sx={{ color: 'base.100', pl: 1.5 }}>
        {stage}
      </Typography>
    </Box>
  )
}

interface AxisSpec {
  max: number
  ticks: number[]
  unit: string
}

/** Tick marks across the top of a range column. */
function Axis({ label, axis }: { label: string; axis: AxisSpec }) {
  return (
    <Box sx={{ display: 'grid', gap: 0.3 }}>
      <ColumnHead>{label}</ColumnHead>
      <Box sx={{ position: 'relative', height: 16 }}>
        {axis.ticks.map((tick) => (
          <Typography
            key={tick}
            variant="body2"
            sx={{
              position: 'absolute',
              left: `${(tick / axis.max) * 100}%`,
              transform:
                tick === 0 ? 'none' : tick === axis.max ? 'translateX(-100%)' : 'translateX(-50%)',
              color: 'base.100',
            }}
          >
            {tick}
          </Typography>
        ))}
      </Box>
    </Box>
  )
}

/**
 * One species' tolerance as a band on the shared axis, labelled with the published
 * range. A wide band carries its label inside; a narrow one is labelled to its right.
 */
function RangeBar({
  range,
  axis,
  text,
}: {
  range: [number, number]
  axis: AxisSpec
  text: string
}) {
  const left = (range[0] / axis.max) * 100
  const width = Math.max(0.5, ((range[1] - range[0]) / axis.max) * 100)
  const inside = width >= 34
  return (
    <Box sx={{ position: 'relative', height: 28 }}>
      <Box
        sx={{
          position: 'absolute',
          inset: '11px 0',
          bgcolor: 'translucent.100',
          borderRadius: 0.3,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: 4,
          bottom: 4,
          left: `${left}%`,
          width: `${width}%`,
          bgcolor: 'salinity.teal',
          borderRadius: 0.4,
        }}
      />
      <Typography
        variant="body2"
        component="span"
        sx={{
          position: 'absolute',
          top: '50%',
          transform: 'translateY(-50%)',
          left: inside ? `calc(${left}% + 8px)` : `calc(${left + width}% + 8px)`,
          color: inside ? 'common.black' : 'base.100',
          whiteSpace: 'nowrap',
        }}
      >
        {text}
      </Typography>
    </Box>
  )
}

const DUMBBELL_MAX = 70
const DUMBBELL_TICKS = [0, 10, 20, 30, 40, 50, 60, 70]

/**
 * Two dots per row on one axis, joined by a line: the gap between them is the
 * finding. Rows keep the species → stage grouping of the other charts.
 */
function Dumbbell({
  rows,
  valueOf,
}: {
  rows: typeof GROUPS
  valueOf: (key: EcologySpeciesKey) => [number, number]
}) {
  const x = (value: number) => `${(Math.min(value, 1) * 100 * 100) / DUMBBELL_MAX}%`
  return (
    <Box sx={{ display: 'grid', gap: 1 }}>
      <Box sx={{ overflowX: 'auto', overflowY: 'hidden' }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '200px 1fr',
            columnGap: 2,
            rowGap: 0.25,
            minWidth: 640,
            alignItems: 'center',
          }}
        >
          <Box />
          <Box sx={{ position: 'relative', height: 18, mx: 4 }}>
            {DUMBBELL_TICKS.map((tick) => (
              <Typography
                key={tick}
                variant="body2"
                sx={{
                  position: 'absolute',
                  left: `${(tick / DUMBBELL_MAX) * 100}%`,
                  transform:
                    tick === 0
                      ? 'none'
                      : tick === DUMBBELL_MAX
                        ? 'translateX(-100%)'
                        : 'translateX(-50%)',
                  color: 'base.100',
                  whiteSpace: 'nowrap',
                }}
              >
                {tick === DUMBBELL_MAX ? `${tick}%` : tick}
              </Typography>
            ))}
          </Box>
          {rows.map((group) =>
            group.stages.map((entry, i) => {
              const [byScenario, byYear] = valueOf(entry.key)
              const lo = Math.min(byScenario, byYear)
              const hi = Math.max(byScenario, byYear)
              return (
                <Box key={entry.key} sx={{ display: 'contents' }}>
                  <SpeciesHead name={group.name} stage={entry.stage} first={i === 0} />
                  <Box sx={{ position: 'relative', height: 28, mx: 4 }}>
                    {DUMBBELL_TICKS.map((tick) => (
                      <Box
                        key={tick}
                        sx={{
                          position: 'absolute',
                          top: 0,
                          bottom: 0,
                          left: `${(tick / DUMBBELL_MAX) * 100}%`,
                          borderLeft: 1,
                          borderColor: 'border.default',
                        }}
                      />
                    ))}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 13,
                        height: 2,
                        left: x(lo),
                        width: `calc(${x(hi)} - ${x(lo)})`,
                        bgcolor: 'base.300',
                      }}
                    />
                    {byScenario === byYear ? (
                      <>
                        <SplitDot value={byYear} x={x} />
                        <DotLabel value={byYear} side="right" x={x} />
                      </>
                    ) : (
                      <>
                        <Dot value={byScenario} tone="salinity.teal" x={x} />
                        <Dot value={byYear} tone="salinity.pink" x={x} />
                        <DotLabel value={lo} side="left" x={x} />
                        <DotLabel value={hi} side="right" x={x} />
                      </>
                    )}
                  </Box>
                </Box>
              )
            }),
          )}
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: 1.5 }}>
        <Typography variant="body2" sx={{ color: 'base.50' }}>
          <Swatch tone="salinity.teal" /> Largest difference between scenarios
        </Typography>
        <Typography variant="body2" sx={{ color: 'base.50' }}>
          <Swatch tone="salinity.pink" /> Largest difference between water years
        </Typography>
        <Typography variant="body2" sx={{ color: 'base.100' }}>
          Each is a gap between two percentages of the season, in any one region. A two-colour dot
          means the two are equal; the number sits beside its dot.
        </Typography>
      </Box>
    </Box>
  )
}

/** The value beside its dot, on the outer side so the two never collide. */
function DotLabel({
  value,
  side,
  x,
}: {
  value: number
  side: 'left' | 'right'
  x: (value: number) => string
}) {
  return (
    <Typography
      variant="body2"
      component="span"
      sx={{
        position: 'absolute',
        top: '50%',
        transform: side === 'left' ? 'translate(-100%, -50%)' : 'translateY(-50%)',
        left: side === 'left' ? `calc(${x(value)} - 12px)` : `calc(${x(value)} + 12px)`,
        color: 'base.50',
        whiteSpace: 'nowrap',
      }}
    >
      {Math.round(value * 100)}
    </Typography>
  )
}

/** Both differences are equal: one dot, half teal and half pink, so neither hides the other. */
function SplitDot({ value, x }: { value: number; x: (value: number) => string }) {
  return (
    <Box
      sx={(theme) => ({
        position: 'absolute',
        top: 8,
        width: 12,
        height: 12,
        borderRadius: '50%',
        left: `calc(${x(value)} - 6px)`,
        background: `linear-gradient(90deg, ${theme.palette.salinity.teal} 50%, ${theme.palette.salinity.pink} 50%)`,
        border: 2,
        borderColor: 'base.900',
      })}
    />
  )
}

function Dot({ value, tone, x }: { value: number; tone: string; x: (value: number) => string }) {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 8,
        width: 12,
        height: 12,
        borderRadius: '50%',
        left: `calc(${x(value)} - 6px)`,
        bgcolor: tone,
        border: 2,
        borderColor: 'base.900',
      }}
    />
  )
}
