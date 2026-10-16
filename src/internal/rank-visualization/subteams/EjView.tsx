// EJ's evidence: the funnel, who carries the exceedance, and the maps behind the
// score.
//
// This is the only criterion whose chain holds from measurement to score, so the
// honest shape is the collapse itself: 39,659 daily readings, three vulnerability
// classes, three numbers, one score. The class panel carries their finding, which
// is a negative one and therefore invisible on a ranking: the most vulnerable
// communities never cross the threshold at all.
import { Box, Typography } from '@mui/material'
import { useState } from 'react'
import { valueAt } from '../drilldown/cellValue'
import { ANY, SCENARIO_NAME, fmtValue } from '../drilldown/model'
import { cellFill } from '../data'
import type { ScenarioKey } from '../drilldown/model'
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
} from './SubteamFrame'
import { ClassBar, Funnel, MetricCards, ThresholdDays } from './aids'
import { signedPct } from './rich'

const SCEN: ScenarioKey[] = ['bau', 'bf', 'em', 'ngw', 'cor', 'tunnel']

/** Proportion of the run over 1,050 µS/cm, by vulnerability class, in SCEN order. */
const CLASSES = [
  { label: 'Moderate', points: 10, run: [6, 5, 4, 4, 11, 13] },
  { label: 'High', points: 36, run: [10, 10, 8, 8, 11, 13] },
  { label: 'Highest', points: 3, run: [0, 0, 0, 0, 0, 0] },
]

const ALL_POINTS = [9, 9, 7, 7, 11, 12]

/** Shapefile class name → the entity node that holds its exceedance figures. */
const CLASS_NODE: Record<string, string> = {
  Moderate: 'ej-drinking-moderate',
  High: 'ej-drinking-high',
  Highest: 'ej-drinking-highest',
}

const PERIODS = [
  { key: 'run' as const, label: 'Whole run' },
  { key: 'wet' as const, label: 'Wet season' },
  { key: 'dry' as const, label: 'Dry season' },
]

const FUNNEL = [
  { n: '39,659', label: 'daily measurements', note: '49 points × 793 days' },
  { n: '3', label: 'vulnerability classes', note: 'moderate 10, high 36, highest 3 points' },
  { n: '3', label: 'metric scores', note: 'drinking water, flood risk, water age' },
  { n: '1', label: 'criterion score', note: 'the mean of the three, rounded' },
]

export default function EjView() {
  const [period, setPeriod] = useState<'run' | 'wet' | 'dry'>('run')
  const [reading, setReading] = useState<'level' | 'change'>('level')
  // Difference mode: each scenario's proportion minus Business as Usual's for the
  // same class. More days over the threshold is the worse outcome, so a rise is
  // orange and a fall blue, on a ramp whose ends are the largest gaps shown.
  const rows = [...CLASSES, { label: 'All 49 points', points: 49, run: ALL_POINTS }]
  const diffMax = Math.max(
    0.01,
    ...rows.flatMap((row) => row.run.map((value) => Math.abs(value - row.run[0]))),
  )
  const shownScenarios = reading === 'change' ? SCEN.filter((key) => key !== 'bau') : SCEN
  // The drinking-water metric score for this period: what the row of maps became.
  const score = (scenario: ScenarioKey) => {
    const cell = valueAt({ criterion: 'ej-drinking', scenario, place: ANY, period })
    return cell.value === null ? 'not scored' : fmtValue(cell.value, 'score')
  }
  const columns = `220px repeat(${shownScenarios.length}, minmax(88px, 1fr))`

  return (
    <SubteamPage
      profile={SUBTEAM_PROFILES.environmentalJustice}
      aidWide
      aid={
        <Box sx={{ display: 'grid', gap: 2.5 }}>
          <MetricCards
            metrics={[
              {
                label: 'Salinity impacts to drinking water',
                counted: true,
                items: [
                  'Proportion of days over 1,050 µS/cm',
                  'By vulnerability class, for the run and each season',
                  'Scored',
                ],
              },
              {
                label: 'Flood risk',
                counted: false,
                items: ['Expected change in flood risk, none to significant', 'Scored'],
              },
              {
                label: 'Water age and temperature',
                counted: false,
                items: ['Change in water age where water reaches 19 °C', 'Scored'],
              },
            ]}
          />
          <ThresholdDays />
          <ClassBar
            heading="49 intake points, by the vulnerability of the community each serves"
            groups={CLASSES.map((row) => ({ label: row.label.toLowerCase(), count: row.points }))}
            caption="The class is set by 14 socioeconomic indicators; the evidence below is read per class."
          />
        </Box>
      }
      method={
        <Panel
          title="From 39,659 readings to one score"
          intro="Each step reduces the data in a way the subteam can defend. By the last step **one criterion score** holds very little of what was measured, which is why the evidence below shows the steps in between."
        >
          <Funnel steps={FUNNEL} />
        </Panel>
      }
    >
      <Panel
        title="Who is over the drinking-water threshold, and how often"
        intro="Each cell is the **proportion of the whole run** on which a class’s intake points were over 1,050 µS/cm. The **highest-vulnerability class is at zero** under every scenario: these are ==measured zeros==, not missing data. The bottom row pools all 49 points. Switch to the **difference from Business as Usual** to see what a scenario changes."
      >
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
              gridTemplateColumns: columns,
              gap: 0.4,
              minWidth: 760,
              alignItems: 'center',
            }}
          >
            <Box />
            {shownScenarios.map((key) => (
              <ColumnHead key={key}>{SCENARIO_NAME[key]}</ColumnHead>
            ))}
            {rows.map((row, r) => {
              const pooled = r === CLASSES.length
              return (
                <Box key={row.label} sx={{ display: 'contents' }}>
                  <Typography variant="body2" sx={{ color: 'base.50', alignSelf: 'center' }}>
                    {pooled ? (
                      <Box component="strong">{row.label}</Box>
                    ) : (
                      `${row.label} (${row.points} points)`
                    )}
                  </Typography>
                  {SCEN.map((key, i) => {
                    if (reading === 'change') {
                      if (key === 'bau') return null
                      const diff = row.run[i] - row.run[0]
                      return (
                        <HeatCell
                          key={key}
                          value={diff}
                          max={1}
                          tone="salinity.teal"
                          fill={diff === 0 ? undefined : cellFill((-diff / diffMax) * 5)}
                          text={signedPct(diff)}
                          title={`${row.label}: ${row.run[0]}% under Business as Usual, ${row.run[i]}% here`}
                        />
                      )
                    }
                    return (
                      <HeatCell
                        key={key}
                        value={row.run[i]}
                        max={14}
                        tone="salinity.teal"
                        text={`${row.run[i]}%`}
                      />
                    )
                  })}
                </Box>
              )
            })}
          </Box>
        </Box>
        {reading === 'change' ? (
          <DivergingLegend
            label="Difference from Business as Usual, not a score: the gap between the two percentages. Hover a cell for both values."
            min={`−${diffMax}%`}
            max={`+${diffMax}%`}
            note="Orange: more days over the threshold than today, the worse outcome; blue: fewer. The ends of the ramp are the largest gaps on this grid."
          />
        ) : (
          <ScaleLegend
            tone="salinity.teal"
            label="Days over 1,050 µS/cm"
            min="0%"
            max="14%"
            zero="measured zero"
          />
        )}
      </Panel>

      <Panel
        title="The same numbers on the map, and the score they became"
        intro="The three shapes are the **three vulnerability classes**. Each map colours them by the proportion over the threshold under one scenario, and the number beneath is the **drinking-water metric score** that row of values became: ==one point for each percentage point== of difference from Business as Usual. No other map on this page connects so directly to a score."
      >
        <Choice label="Period" value={period} onChange={setPeriod} options={PERIODS} />
        <RegionValues
          team="environmentalJustice"
          scenarios={SCEN}
          coordsFor={(region, scenario) =>
            CLASS_NODE[region]
              ? { criterion: CLASS_NODE[region], scenario, place: ANY, period }
              : null
          }
          caption={score}
          unitLabel="Proportion of days over the threshold"
          changeToggle
        />
      </Panel>
    </SubteamPage>
  )
}
