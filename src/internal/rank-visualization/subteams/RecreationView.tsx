// Recreation's evidence: the limits, how often each is crossed, and the scores the
// team now reads from those crossings.
//
// Since 18 Oct 2026 the subteam scores every activity itself, by region and by
// season, on its own scale: one point per percentage point of days over the limit
// against Business as Usual. So the page shows the chain in order: the days, the
// score each row of days became, the same scores on the map, and the temperature
// side that barely moves. Season is a choice on every panel, because the finding is
// seasonal: wet seasons cross the limits more often than dry ones.
import { Box, Typography } from '@mui/material'
import { useState } from 'react'
import { cellFill } from '../data'
import { valueAt } from '../drilldown/cellValue'
import { ANY, SCENARIO_NAME, fmtValue } from '../drilldown/model'
import type { ScenarioKey } from '../drilldown/model'
import {
  REC_SALINITY_DAYS,
  REC_SALINITY_SCORES,
  REC_TEMPERATURE_SCORES,
} from '../drilldown/recreationThresholds'
import type {
  RecActivityKey,
  RecPeriodKey,
  RecRegionKey,
  RecTable,
} from '../drilldown/recreationThresholds'
import { SUBTEAM_PROFILES } from './profiles'
import { REGION_DATA_KEY } from './regionKeys'
import { RegionValues } from './RegionValues'
import {
  Choice,
  ColumnHead,
  DivergingLegend,
  HeatCell,
  Panel,
  RowHead,
  ScaleLegend,
  SubteamPage,
} from './SubteamFrame'
import { LimitDays, MetricCards } from './aids'
import { signedPct } from './rich'

/** Scenario order for every salinity table; A Tunnel is measured now. */
const SCEN: ScenarioKey[] = ['bau', 'bf', 'em', 'ngw', 'cor', 'tunnel']
/** Temperature has four runs so far; Calling on Reserves and A Tunnel are pending. */
const TEMP_SCEN: ScenarioKey[] = ['bau', 'bf', 'em', 'ngw']

interface Activity {
  key: RecActivityKey
  label: string
  limit: string
}

const SALINITY: Activity[] = [
  { key: 'dayUseBoating', label: 'Day use and boating', limit: '1,000 µS/cm' },
  { key: 'birding', label: 'Birding', limit: '2,640 µS/cm' },
  { key: 'waterfowl', label: 'Waterfowl hunting', limit: '3,600 µS/cm' },
  { key: 'angling', label: 'Angling', limit: '9,130 µS/cm' },
]

const TEMPERATURE: Activity[] = [
  { key: 'dayUseBoating', label: 'Day use and boating', limit: '19 °C' },
  { key: 'birding', label: 'Birding', limit: '20 °C' },
  { key: 'waterfowl', label: 'Waterfowl hunting', limit: '23 °C' },
  { key: 'angling', label: 'Angling', limit: '18.42 °C' },
  { key: 'dayUseCold', label: 'Day use, cold water', limit: 'below 18 °C' },
]

const REGIONS: { key: RecRegionKey; label: string }[] = [
  { key: 'delta', label: 'Delta-wide' },
  { key: 'suisun', label: 'Suisun Marsh' },
  { key: 'centralDelta', label: 'Central Delta' },
  { key: 'northDelta', label: 'North Delta' },
  { key: 'southDelta', label: 'South Delta' },
]

const PERIODS: { key: RecPeriodKey; label: string }[] = [
  { key: 'run', label: 'Whole run' },
  { key: 'wet', label: 'Wet season' },
  { key: 'dry', label: 'Dry season' },
]

const at = (
  table: RecTable<number | null>,
  activity: RecActivityKey,
  scenario: ScenarioKey,
  region: RecRegionKey,
  period: RecPeriodKey,
): number | null => table[activity]?.[scenario]?.[region]?.[period] ?? null

const pct = (value: number) => `${Math.round(value * 1000) / 10}%`

/** The criterion score beneath each map: the Delta-wide, whole-run mean of the four. */
const criterionScore = (scenario: ScenarioKey) => {
  const cell = valueAt({ criterion: 'recreation', scenario, place: ANY, period: ANY })
  return cell.value === null ? 'not scored' : fmtValue(cell.value, 'score')
}

export default function RecreationView() {
  const [region, setRegion] = useState<RecRegionKey>('delta')
  const [period, setPeriod] = useState<RecPeriodKey>('run')
  const [reading, setReading] = useState<'level' | 'change'>('level')
  const [mapActivity, setMapActivity] = useState<RecActivityKey>('angling')

  // Difference mode: a scenario's proportion minus Business as Usual's, in
  // percentage points. More days over the limit is the worse outcome, so the ramp
  // runs orange for a rise and blue for a fall, with its ends at the largest gaps
  // on the grid.
  const diffOf = (activity: RecActivityKey, scenario: ScenarioKey, p: RecPeriodKey) => {
    const here = at(REC_SALINITY_DAYS, activity, scenario, region, p)
    const base = at(REC_SALINITY_DAYS, activity, 'bau', region, p)
    return here === null || base === null ? null : (here - base) * 100
  }
  const diffMax = Math.max(
    0.1,
    ...SALINITY.flatMap((activity) =>
      PERIODS.flatMap((p) =>
        SCEN.map((scenario) => Math.abs(diffOf(activity.key, scenario, p.key) ?? 0)),
      ),
    ),
  )
  const levelMax = Math.max(
    0.01,
    ...SALINITY.flatMap((activity) =>
      PERIODS.flatMap((p) =>
        SCEN.map((scenario) => at(REC_SALINITY_DAYS, activity.key, scenario, region, p.key) ?? 0),
      ),
    ),
  )
  const shownScenarios = reading === 'change' ? SCEN.filter((key) => key !== 'bau') : SCEN
  const dayColumns = `180px repeat(${shownScenarios.length}, minmax(104px, 1fr))`
  const scoreColumns = `180px repeat(${SCEN.length}, minmax(104px, 1fr))`
  const tempColumns = `180px repeat(${TEMP_SCEN.length}, minmax(104px, 1fr))`
  const regionLabel = REGIONS.find((entry) => entry.key === region)?.label ?? ''
  const periodLabel = PERIODS.find((entry) => entry.key === period)?.label ?? ''
  const mapKeys = REGION_DATA_KEY.recreation ?? {}

  return (
    <SubteamPage
      profile={SUBTEAM_PROFILES.recreation}
      aidWide
      aid={
        <Box sx={{ display: 'grid', gap: 2.5 }}>
          <MetricCards
            metrics={[
              {
                label: 'Salinity thresholds',
                counted: true,
                items: [
                  'A −5…+5 score per activity, region and season',
                  'The criterion is the mean of the four activities',
                ],
              },
              {
                label: 'Temperature thresholds',
                counted: true,
                items: [
                  'The same, for four scenarios so far',
                  '0 Delta-wide everywhere; kept beside the score',
                ],
              },
              {
                label: 'Restoration',
                counted: true,
                items: ['Accessible acres against the CVJV 2020 deficits', 'Not scored'],
              },
              {
                label: 'Recreation economy',
                counted: false,
                items: ['Visitor-sector earnings by water-year type', 'Not scored'],
              },
            ]}
          />
          <LimitDays />
        </Box>
      }
    >
      <Panel
        title="Days over the salinity limit"
        intro="Each cell is the **proportion of days** on which the water was over the activity’s limit, so a ==higher number means more days lost==. Pick a region; every activity then shows its whole run, wet seasons and dry seasons. Switch to the **difference from Business as Usual** to see what a scenario changes rather than how salty a region is anyway. Exceedance is concentrated in Suisun Marsh and the Central Delta; the North and South Delta sit at 0% for every activity."
      >
        <Choice label="Region" value={region} onChange={setRegion} options={REGIONS} />
        <Choice
          label="Show"
          value={reading}
          onChange={setReading}
          options={[
            { key: 'level', label: 'the value' },
            { key: 'change', label: 'the difference from Business as Usual' },
          ]}
        />
        <Box sx={{ overflowX: 'auto', overflowY: 'hidden' }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: dayColumns,
              columnGap: 0.4,
              rowGap: 0.4,
              minWidth: 820,
              alignItems: 'center',
            }}
          >
            <Box />
            {shownScenarios.map((key) => (
              <ColumnHead key={key}>{SCENARIO_NAME[key]}</ColumnHead>
            ))}
            {SALINITY.map((activity) => (
              <Box key={activity.key} sx={{ display: 'contents' }}>
                <Typography
                  variant="body2"
                  sx={{ color: 'base.50', gridColumn: '1 / -1', pt: 1.5 }}
                >
                  <Box component="strong">{activity.label}</Box>
                  <Box component="span" sx={{ color: 'base.100' }}>
                    {` · ${activity.limit}`}
                  </Box>
                </Typography>
                {PERIODS.map((p) => (
                  <Box key={p.key} sx={{ display: 'contents' }}>
                    <RowHead>{p.label}</RowHead>
                    {shownScenarios.map((scenario) => {
                      const value = at(REC_SALINITY_DAYS, activity.key, scenario, region, p.key)
                      if (reading === 'change') {
                        const diff = diffOf(activity.key, scenario, p.key)
                        const pts = diff === null ? null : Math.round(diff * 10) / 10
                        return (
                          <HeatCell
                            key={scenario}
                            value={pts}
                            max={1}
                            tone="salinity.teal"
                            fill={
                              pts === null || pts === 0
                                ? undefined
                                : cellFill((-(diff ?? 0) / diffMax) * 5)
                            }
                            text={pts === null ? '—' : signedPct(pts)}
                            title={`${activity.label}, ${p.label}, ${regionLabel}: ${pct(at(REC_SALINITY_DAYS, activity.key, 'bau', region, p.key) ?? 0)} under Business as Usual, ${value === null ? 'no run' : pct(value)} here`}
                          />
                        )
                      }
                      return (
                        <HeatCell
                          key={scenario}
                          value={value}
                          max={levelMax}
                          tone="salinity.teal"
                          text={value === null ? '—' : pct(value)}
                        />
                      )
                    })}
                  </Box>
                ))}
              </Box>
            ))}
          </Box>
        </Box>
        {reading === 'change' ? (
          <DivergingLegend
            label="Difference from Business as Usual, not a score: the gap between the two proportions, in percentage points. Hover a cell for both values."
            min={`−${Math.round(diffMax * 10) / 10}%`}
            max={`+${Math.round(diffMax * 10) / 10}%`}
            note="Orange: more days over the limit than today, the worse outcome; blue: fewer. The ends of the ramp are the largest gaps on this grid."
          />
        ) : (
          <ScaleLegend
            tone="salinity.teal"
            label={`Days over the limit, ${regionLabel}`}
            min="0%"
            max={pct(levelMax)}
          />
        )}
      </Panel>

      <Panel
        title="The scores they read from those days"
        intro="The team’s own rule, from its 18 Oct 2026 workbooks: ==one point per percentage point== of days over the limit against Business as Usual, **±5 at five points or more**, scored separately for every activity, region and season. The last row is the **mean of the four activities**, which we calculate; its Delta-wide, whole-run value is the criterion score on the comparison page, because the team publishes no criterion score of its own."
      >
        <Choice label="Region" value={region} onChange={setRegion} options={REGIONS} />
        <Choice label="Period" value={period} onChange={setPeriod} options={PERIODS} />
        <Box sx={{ overflowX: 'auto', overflowY: 'hidden' }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: scoreColumns,
              columnGap: 0.4,
              rowGap: 0.4,
              minWidth: 820,
              alignItems: 'center',
            }}
          >
            <Box />
            {SCEN.map((key) => (
              <ColumnHead key={key}>{SCENARIO_NAME[key]}</ColumnHead>
            ))}
            {SALINITY.map((activity) => (
              <Box key={activity.key} sx={{ display: 'contents' }}>
                <RowHead>{activity.label}</RowHead>
                {SCEN.map((scenario) => {
                  const score = at(REC_SALINITY_SCORES, activity.key, scenario, region, period)
                  return (
                    <HeatCell
                      key={scenario}
                      value={score}
                      max={5}
                      tone="salinity.teal"
                      fill={score === null || score === 0 ? undefined : cellFill(score)}
                      text={score === null ? '—' : fmtValue(score, 'score')}
                      title={`${activity.label}, ${periodLabel}, ${regionLabel}: ${pct(at(REC_SALINITY_DAYS, activity.key, scenario, region, period) ?? 0)} of days over the limit`}
                    />
                  )
                })}
              </Box>
            ))}
            <Typography variant="body2" sx={{ color: 'base.50', pt: 0.75 }}>
              <Box component="strong">Mean of the four</Box>
            </Typography>
            {SCEN.map((scenario) => {
              const cell = valueAt({ criterion: 'rec-salinity', scenario, place: region, period })
              return (
                <Typography key={scenario} variant="body2" sx={{ color: 'base.50', pt: 0.75 }}>
                  <Box component="strong">
                    {cell.value === null ? '—' : fmtValue(cell.value, 'score')}
                  </Box>
                </Typography>
              )
            })}
          </Box>
        </Box>
        <DivergingLegend
          label="Score, −5…+5, against Business as Usual at 0. Hover a cell for the proportion of days it was read from."
          min="−5"
          max="+5"
          note="Orange: more days over the limit than today; blue: fewer. A plain cell is 0, no change."
        />
      </Panel>

      <Panel
        title="The same scores on the map"
        intro="One map per scenario, the four regions coloured by the chosen activity’s score for the chosen period. The number beneath each map is the **criterion score** on the comparison page: the Delta-wide, whole-run mean of the four activities. Suisun Marsh carries nearly all of the colour; the North and South Delta stay at 0 for every activity and every scenario."
      >
        <Choice
          label="Activity"
          value={mapActivity}
          onChange={setMapActivity}
          options={SALINITY.map((activity) => ({ key: activity.key, label: activity.label }))}
        />
        <Choice label="Period" value={period} onChange={setPeriod} options={PERIODS} />
        <RegionValues
          team="recreation"
          scenarios={SCEN}
          coordsFor={(name, scenario) =>
            mapKeys[name]
              ? {
                  criterion: `rec-salinity-${mapActivity}`,
                  scenario,
                  place: mapKeys[name],
                  period,
                }
              : null
          }
          caption={criterionScore}
          unitLabel="Score, −5…+5"
        />
      </Panel>

      <Panel
        title="Temperature limits barely move"
        intro="The same construction against each activity’s **temperature** limit, for the four scenarios run so far; Calling on Reserves and A Tunnel are pending. Dry seasons drive the crossings, and cold water matters only for day use, in wet seasons. Every Delta-wide score is 0, and ==Suisun Marsh is the only region that moves==, by a point either way, so this metric sits beside the criterion score rather than in it."
      >
        <Choice label="Region" value={region} onChange={setRegion} options={REGIONS} />
        <Choice label="Period" value={period} onChange={setPeriod} options={PERIODS} />
        <Box sx={{ overflowX: 'auto', overflowY: 'hidden' }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: tempColumns,
              columnGap: 0.4,
              rowGap: 0.4,
              minWidth: 620,
              alignItems: 'center',
            }}
          >
            <Box />
            {TEMP_SCEN.map((key) => (
              <ColumnHead key={key}>{SCENARIO_NAME[key]}</ColumnHead>
            ))}
            {TEMPERATURE.map((activity) => (
              <Box key={activity.key} sx={{ display: 'contents' }}>
                <RowHead>{`${activity.label} · ${activity.limit}`}</RowHead>
                {TEMP_SCEN.map((scenario) => {
                  const score = at(REC_TEMPERATURE_SCORES, activity.key, scenario, region, period)
                  return (
                    <HeatCell
                      key={scenario}
                      value={score}
                      max={5}
                      tone="salinity.teal"
                      fill={score === null || score === 0 ? undefined : cellFill(score)}
                      text={score === null ? '—' : fmtValue(score, 'score')}
                    />
                  )
                })}
              </Box>
            ))}
          </Box>
        </Box>
      </Panel>
    </SubteamPage>
  )
}
