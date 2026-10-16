// Recreation's evidence: the limits, when they are crossed, and the formula the
// team wrote but never ran.
//
// Their data is five activities with five different salinity limits, measured as
// the proportion of days over each one. The finding is seasonal: every scenario is
// worse in winter than in summer, so season is the axis here, not scenario. The
// last panel runs their own unused formula, which is the clearest way to show why
// the criterion has no score yet.
import { Box, Typography } from '@mui/material'
import { useState } from 'react'
import { cellFill } from '../data'
import { SCENARIO_NAME } from '../drilldown/model'
import type { ScenarioKey } from '../drilldown/model'
import { SUBTEAM_PROFILES } from './profiles'
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

/** Scenario order used by every Recreation table. A Tunnel is in none of them. */
const SCEN: ScenarioKey[] = ['bau', 'bf', 'em', 'ngw', 'cor']

interface Activity {
  label: string
  salinity: string
  temperature: string
  season: string
  /** Proportion of days over the limit, in SCEN order: whole run, summer, winter. */
  run: number[]
  summer: number[]
  winter: number[]
}

const ACTIVITIES: Activity[] = [
  {
    label: 'Birding',
    salinity: '2,640 µS/cm',
    temperature: 'none',
    season: 'Fall migration, spring, winter',
    run: [38, 38, 39, 39.2, 44],
    summer: [40, 40, 40, 41, 48],
    winter: [41, 41, 44, 44, 49],
  },
  {
    label: 'Angling',
    salinity: '9,130 µS/cm',
    temperature: 'none',
    season: 'In season May–Sep',
    run: [5.5, 5.5, 7.5, 7.5, 9],
    summer: [5, 5, 8, 8, 8],
    winter: [6, 6, 7, 7, 10],
  },
  {
    label: 'Boating',
    salinity: '1,000 µS/cm',
    temperature: '19 °C',
    season: 'In season May–Sep',
    run: [53.1, 53.1, 53.6, 53.7, 53.1],
    summer: [60.5, 60.5, 61, 61, 62],
    winter: [66, 66, 67.5, 67.5, 65],
  },
  {
    label: 'State park day use',
    salinity: '1,000 µS/cm',
    temperature: '18–31 °C',
    season: 'In season May–Sep',
    run: [57, 57, 58.2, 58.2, 58],
    summer: [60.5, 60.5, 61, 61, 62],
    winter: [66, 66, 67.5, 67.5, 65],
  },
  {
    label: 'Waterfowl hunting',
    salinity: '3,600 µS/cm',
    temperature: 'none',
    season: 'Brooding Apr–Jul, hunting Oct–Feb',
    run: [21, 21, 22.3, 22.2, 25],
    summer: [32, 32, 32.7, 32.6, 38],
    winter: [34, 34, 38, 37, 43],
  },
]

/** Their page-391 rule, run on a proportion expressed in percent. */
const score = (pct: number) => 5 - pct / 10

const SEASONS = [
  { key: 'summer' as const, label: 'Summer', tone: 'salinity.teal' },
  { key: 'winter' as const, label: 'Winter', tone: 'salinity.teal' },
]

export default function RecreationView() {
  const [reading, setReading] = useState<'level' | 'change'>('level')
  // Difference mode: each scenario's proportion minus Business as Usual's, for the
  // same activity and season. More days over the limit is the worse outcome, so the
  // ramp runs orange for a rise and blue for a fall, with its ends at the largest
  // gaps on the grid.
  const diffOf = (activity: Activity, season: 'summer' | 'winter', i: number) =>
    activity[season][i] - activity[season][0]
  const diffMax = Math.max(
    0.01,
    ...ACTIVITIES.flatMap((activity) =>
      (['summer', 'winter'] as const).flatMap((season) =>
        SCEN.map((_, i) => Math.abs(diffOf(activity, season, i))),
      ),
    ),
  )
  const shownScenarios = reading === 'change' ? SCEN.filter((key) => key !== 'bau') : SCEN
  const means = SCEN.map(
    (_, i) => ACTIVITIES.reduce((sum, a) => sum + score(a.run[i]), 0) / ACTIVITIES.length,
  )
  const scenarioColumns = `180px repeat(${shownScenarios.length}, minmax(110px, 1fr))`
  const allColumns = `180px repeat(${SCEN.length}, minmax(110px, 1fr))`

  return (
    <SubteamPage
      profile={SUBTEAM_PROFILES.recreation}
      aidWide
      aid={
        <Box sx={{ display: 'grid', gap: 2.5 }}>
          <MetricCards
            metrics={[
              {
                label: 'Overall use',
                counted: true,
                items: [
                  'Proportion of days over each activity’s limit, whole run',
                  'Not yet scored',
                ],
              },
              {
                label: 'Seasonal use',
                counted: true,
                items: ['The same, for summer and for winter', 'Not yet scored'],
              },
              {
                label: 'Restoration',
                counted: true,
                items: ['Accessible acres against the CVJV 2020 deficits', 'Not yet scored'],
              },
              {
                label: 'Recreation economy',
                counted: true,
                items: ['Visitor-sector earnings by water-year type', 'Not yet scored'],
              },
            ]}
          />
          <LimitDays />
        </Box>
      }
    >
      <Panel
        title="Days over the limit, summer and winter"
        intro="Each cell is the **proportion of days in that season** on which the water was over the activity’s limit, so a ==higher number means more days lost==. Read down a column to compare seasons, across a row to compare scenarios. Switch to the **difference from Business as Usual** to see what a scenario changes rather than how hard a season is anyway."
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
              gridTemplateColumns: scenarioColumns,
              columnGap: 0.4,
              rowGap: 0.4,
              minWidth: 740,
              alignItems: 'center',
            }}
          >
            <Box />
            {shownScenarios.map((key) => (
              <ColumnHead key={key}>{SCENARIO_NAME[key]}</ColumnHead>
            ))}
            {ACTIVITIES.map((activity) => (
              <Box key={activity.label} sx={{ display: 'contents' }}>
                <Typography
                  variant="body2"
                  sx={{ color: 'base.50', gridColumn: '1 / -1', pt: 1.5 }}
                >
                  <Box component="strong">{activity.label}</Box>
                </Typography>
                {SEASONS.map((season) => (
                  <Box key={season.key} sx={{ display: 'contents' }}>
                    <RowHead>{season.label}</RowHead>
                    {SCEN.map((key, i) => {
                      if (reading === 'change') {
                        if (key === 'bau') return null
                        const diff = diffOf(activity, season.key, i)
                        const pts = Math.round(diff * 10) / 10
                        return (
                          <HeatCell
                            key={`${season.key}-${i}`}
                            value={pts}
                            max={1}
                            tone={season.tone}
                            fill={pts === 0 ? undefined : cellFill((-diff / diffMax) * 5)}
                            text={signedPct(pts)}
                            title={`${activity.label}, ${season.label}: ${activity[season.key][0]}% under Business as Usual, ${activity[season.key][i]}% here`}
                          />
                        )
                      }
                      const value = activity[season.key][i]
                      return (
                        <HeatCell
                          key={`${season.key}-${i}`}
                          value={value}
                          max={70}
                          tone={season.tone}
                          text={`${value}%`}
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
            label="Difference from Business as Usual, not a score: the gap between the two percentages. Hover a cell for both values."
            min={`−${Math.round(diffMax * 10) / 10}%`}
            max={`+${Math.round(diffMax * 10) / 10}%`}
            note="Orange: more days over the limit than today, the worse outcome; blue: fewer. The ends of the ramp are the largest gaps on this grid."
          />
        ) : (
          <ScaleLegend tone="salinity.teal" label="Days over the limit" min="0%" max="70%" />
        )}
      </Panel>

      <Panel
        title="Their formula, applied"
        intro="Page 391 of the Sept report defines a score for each activity: **5 − 10 × (days over the limit ÷ days in the period)**. The team never applied it. This table does, on the whole run, and averages the five activities. Business as Usual comes out at **1.51 rather than 0**, and the five scenarios sit **within a third of a point** of each other, so once they are rebased on Business as Usual ==every one rounds to 0==."
      >
        <Box sx={{ overflowX: 'auto', overflowY: 'hidden' }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: allColumns,
              columnGap: 0.4,
              rowGap: 0.75,
              minWidth: 740,
              alignItems: 'center',
            }}
          >
            <Box />
            {SCEN.map((key) => (
              <ColumnHead key={key}>{SCENARIO_NAME[key]}</ColumnHead>
            ))}
            {ACTIVITIES.map((activity) => (
              <Box key={activity.label} sx={{ display: 'contents' }}>
                <RowHead>{activity.label}</RowHead>
                {activity.run.map((value, i) => (
                  <Cell key={i}>{score(value).toFixed(2)}</Cell>
                ))}
              </Box>
            ))}
            <Typography variant="body2" sx={{ color: 'base.50' }}>
              <Box component="strong">Mean of the five</Box>
            </Typography>
            {means.map((value, i) => (
              <Typography key={i} variant="body2" sx={{ color: 'base.50' }}>
                <Box component="strong">{value.toFixed(2)}</Box>
              </Typography>
            ))}
          </Box>
        </Box>
      </Panel>
    </SubteamPage>
  )
}

function Cell({ children }: { children: React.ReactNode }) {
  return (
    <Typography variant="body2" sx={{ color: 'base.100' }}>
      {children}
    </Typography>
  )
}
