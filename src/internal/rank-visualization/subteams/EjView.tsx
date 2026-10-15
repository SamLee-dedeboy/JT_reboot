// EJ's middle: the funnel, and the null result the score erases.
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
import type { ScenarioKey } from '../drilldown/model'
import { SUBTEAM_PROFILES } from './profiles'
import { RegionValues } from './RegionValues'
import { Choice, Panel, SubteamPage } from './SubteamFrame'

const SCEN: ScenarioKey[] = ['bau', 'bf', 'em', 'ngw', 'cor', 'tunnel']

/** Share of the run over 1,050 µS/cm, by vulnerability class, in SCEN order. */
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
  { n: '3', label: 'vulnerability classes', note: 'moderate 10, high 36, highest 3' },
  { n: '3', label: 'metric scores', note: 'drinking water, flood risk, water age' },
  { n: '1', label: 'criterion score', note: 'the mean of the three, rounded' },
]

export default function EjView() {
  const [period, setPeriod] = useState<'run' | 'wet' | 'dry'>('run')
  // The drinking-water metric score for this period: what the row of maps became.
  const score = (scenario: ScenarioKey) => {
    const cell = valueAt({ criterion: 'ej-drinking', scenario, place: ANY, period })
    return cell.value === null ? 'pending' : fmtValue(cell.value, 'score')
  }
  return (
    <SubteamPage profile={SUBTEAM_PROFILES.environmentalJustice}>
      <Panel
        title="From 39,659 readings to one number"
        note="Each step is a real reduction the subteam makes, and each is defensible. Laid end to end they are also the reason a single criterion score carries so little of what was actually measured."
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(4, 1fr)' },
            gap: 1,
          }}
        >
          {FUNNEL.map((step, i) => (
            <Box
              key={step.label}
              sx={{
                display: 'grid',
                gap: 0.3,
                alignContent: 'start',
                p: 1.25,
                borderRadius: 1,
                bgcolor: 'translucent.100',
                opacity: 1 - i * 0.12,
              }}
            >
              <Typography variant="numberArticle" component="div">
                {step.n}
              </Typography>
              <Typography variant="chartLabel">{step.label}</Typography>
              <Typography variant="chartAxis" sx={{ color: 'base.300' }}>
                {step.note}
              </Typography>
            </Box>
          ))}
        </Box>
      </Panel>

      <Panel
        title="The map behind the score"
        note="Share of the run over 1,050 µS/cm in each vulnerability class, one map per scenario. The score under each map is one point per percentage point against Business as Usual, so the change reading and the caption are the same quantity: this is the tightest link between a map and a rank anywhere on the page. Click a class to see where its number came from."
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
          unitLabel="share of run over threshold"
          changeToggle
        />
      </Panel>

      <Panel
        title="Who carries the exceedance"
        note="Share of the run above the 1,050 µS/cm drinking-water threshold, by vulnerability class. The highest-vulnerability zone reads zero under every scenario and in both seasons, which is a finding rather than missing data."
      >
        <Box sx={{ overflowX: 'auto' }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: `180px repeat(${SCEN.length}, minmax(84px, 1fr))`,
              gap: 0.4,
              minWidth: 720,
            }}
          >
            <Box />
            {SCEN.map((key) => (
              <Typography key={key} variant="chartAxis" sx={{ color: 'base.300' }} noWrap>
                {SCENARIO_NAME[key]}
              </Typography>
            ))}

            {CLASSES.map((row) => (
              <ClassRow key={row.label} {...row} />
            ))}

            <Typography variant="chartLabel" sx={{ alignSelf: 'center' }}>
              All 49 points
            </Typography>
            {ALL_POINTS.map((value, i) => (
              <Typography key={i} variant="chartValue" sx={{ alignSelf: 'center' }}>
                {value}%
              </Typography>
            ))}
          </Box>
        </Box>
      </Panel>
    </SubteamPage>
  )
}

function ClassRow({ label, points, run }: { label: string; points: number; run: number[] }) {
  const silent = run.every((value) => value === 0)
  return (
    <>
      <Box sx={{ alignSelf: 'center' }}>
        <Typography variant="chartLabel">{label}</Typography>
        <Typography variant="chartAxis" sx={{ display: 'block', color: 'base.300' }}>
          {points} points
        </Typography>
      </Box>
      {run.map((value, i) => (
        <Box
          key={i}
          sx={{
            height: 26,
            display: 'flex',
            alignItems: 'center',
            px: 0.6,
            borderRadius: 0.4,
            border: silent ? 1 : 0,
            borderStyle: 'dashed',
            borderColor: 'border.default',
            bgcolor: silent ? 'transparent' : 'salinity.pink',
            opacity: silent ? 1 : 0.2 + (value / 14) * 0.8,
          }}
        >
          <Typography variant="chartAxis" sx={{ color: silent ? 'base.300' : 'common.white' }}>
            {value}%
          </Typography>
        </Box>
      ))}
    </>
  )
}
