// Recreation's middle: thresholds, and when they are crossed.
//
// Their data is five activities with five different salinity thresholds, measured
// as the share of days over each one. The finding is temporal — every scenario is
// worse in winter than in summer — so season is the axis here, not scenario. The
// second panel runs their own unused formula, which is the clearest way to show
// why the criterion has no score yet.
import { Box, Typography } from '@mui/material'
import { SCENARIO_NAME } from '../drilldown/model'
import type { ScenarioKey } from '../drilldown/model'
import { SUBTEAM_PROFILES } from './profiles'
import { Panel, SubteamPage } from './SubteamFrame'

/** Scenario order used by every Recreation table. A Tunnel is in none of them. */
const SCEN: ScenarioKey[] = ['bau', 'bf', 'em', 'ngw', 'cor']

interface Activity {
  label: string
  threshold: string
  season: string
  /** Share of days over threshold, in SCEN order: whole run, summer, winter. */
  run: number[]
  summer: number[]
  winter: number[]
}

const ACTIVITIES: Activity[] = [
  {
    label: 'Birding',
    threshold: '2,640 µS/cm',
    season: 'Fall migration, spring, winter',
    run: [38, 38, 39, 39.2, 44],
    summer: [40, 40, 40, 41, 48],
    winter: [41, 41, 44, 44, 49],
  },
  {
    label: 'Angling',
    threshold: '9,130 µS/cm',
    season: 'In season May–Sep',
    run: [5.5, 5.5, 7.5, 7.5, 9],
    summer: [5, 5, 8, 8, 8],
    winter: [6, 6, 7, 7, 10],
  },
  {
    label: 'Boating',
    threshold: '1,000 µS/cm, 19 °C',
    season: 'In season May–Sep',
    run: [53.1, 53.1, 53.6, 53.7, 53.1],
    summer: [60.5, 60.5, 61, 61, 62],
    winter: [66, 66, 67.5, 67.5, 65],
  },
  {
    label: 'State park day use',
    threshold: '1,000 µS/cm, 18–31 °C',
    season: 'In season May–Sep',
    run: [57, 57, 58.2, 58.2, 58],
    summer: [60.5, 60.5, 61, 61, 62],
    winter: [66, 66, 67.5, 67.5, 65],
  },
  {
    label: 'Waterfowl hunting',
    threshold: '3,600 µS/cm',
    season: 'Brooding Apr–Jul, hunting Oct–Feb',
    run: [21, 21, 22.3, 22.2, 25],
    summer: [32, 32, 32.7, 32.6, 38],
    winter: [34, 34, 38, 37, 43],
  },
]

/** Their page-391 rule, run on a share expressed in percent. */
const score = (pct: number) => 5 - pct / 10

export default function RecreationView() {
  const means = SCEN.map((_, i) => ({
    run: ACTIVITIES.reduce((sum, a) => sum + score(a.run[i]), 0) / ACTIVITIES.length,
  }))

  return (
    <SubteamPage profile={SUBTEAM_PROFILES.recreation}>
      <Panel
        title="Summer against winter"
        note="Share of days over each activity's threshold. Winter is worse than summer for every activity except boating and day use, where Calling on Reserves is the only scenario that beats today."
      >
        <Box sx={{ display: 'grid', gap: 1.5 }}>
          {ACTIVITIES.map((activity, row) => (
            <Box key={activity.label} sx={{ display: 'grid', gap: 0.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, flexWrap: 'wrap' }}>
                <Typography variant="chartLabel">{activity.label}</Typography>
                <Typography variant="chartAxis" sx={{ color: 'base.300' }}>
                  {activity.threshold} · {activity.season}
                </Typography>
              </Box>
              <Box sx={{ overflowX: 'auto' }}>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: `72px repeat(${SCEN.length}, minmax(96px, 1fr))`,
                    gap: 0.4,
                    minWidth: 560,
                  }}
                >
                  <Box />
                  {SCEN.map((key) => (
                    <Typography key={key} variant="chartAxis" sx={{ color: 'base.300' }} noWrap>
                      {SCENARIO_NAME[key]}
                    </Typography>
                  ))}
                  {(['summer', 'winter'] as const).map((season) => (
                    <SeasonRow key={season} season={season} values={activity[season]} row={row} />
                  ))}
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Panel>

      <Panel
        title="Their own formula, run"
        note="Page 391 defines Score = 5 − 10 × (days over threshold ÷ days in period) and the ranking sections beneath it are empty headings. Applied to the whole run it puts Business as Usual at 1.51 rather than 0, and all five scenarios inside a third of a point of each other."
      >
        <Box sx={{ overflowX: 'auto' }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: `160px repeat(${SCEN.length}, minmax(96px, 1fr))`,
              gap: 0.4,
              minWidth: 640,
            }}
          >
            <Box />
            {SCEN.map((key) => (
              <Typography key={key} variant="chartAxis" sx={{ color: 'base.300' }} noWrap>
                {SCENARIO_NAME[key]}
              </Typography>
            ))}
            {ACTIVITIES.map((activity) => (
              <Row key={activity.label} label={activity.label} values={activity.run.map(score)} />
            ))}
            <Row label="Mean" values={means.map((m) => m.run)} strong />
          </Box>
        </Box>
        <Typography variant="body2" sx={{ color: 'base.300', mt: 1, maxWidth: '78ch' }}>
          Rebase those means on Business as Usual and every scenario rounds to 0. That is the gap
          between having measurements and having a score.
        </Typography>
      </Panel>
    </SubteamPage>
  )
}

function SeasonRow({
  season,
  values,
  row,
}: {
  season: 'summer' | 'winter'
  values: number[]
  row: number
}) {
  const max = 70
  return (
    <>
      <Typography variant="chartAxis" sx={{ color: 'base.300', alignSelf: 'center' }}>
        {season}
      </Typography>
      {values.map((value, i) => (
        <Box
          key={`${season}-${row}-${i}`}
          sx={{
            height: 20,
            display: 'flex',
            alignItems: 'center',
            px: 0.6,
            borderRadius: 0.4,
            bgcolor: season === 'winter' ? 'salinity.pink' : 'salinity.teal',
            opacity: 0.2 + (value / max) * 0.8,
          }}
        >
          <Typography variant="chartAxis" sx={{ color: 'common.white' }}>
            {value}%
          </Typography>
        </Box>
      ))}
    </>
  )
}

function Row({ label, values, strong }: { label: string; values: number[]; strong?: boolean }) {
  return (
    <>
      <Typography variant={strong ? 'chartLabel' : 'chartAxis'} sx={{ alignSelf: 'center' }} noWrap>
        {label}
      </Typography>
      {values.map((value, i) => (
        <Typography
          key={i}
          variant={strong ? 'chartValue' : 'chartAxis'}
          sx={{ alignSelf: 'center', color: strong ? 'common.white' : 'base.100' }}
        >
          {value.toFixed(2)}
        </Typography>
      ))}
    </>
  )
}
