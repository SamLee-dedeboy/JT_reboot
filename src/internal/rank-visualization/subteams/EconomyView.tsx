// Economy's evidence: two pathways that cannot share an axis.
//
// Salinity moves the farm economy by tens of thousands of dollars; land conversion
// moves it by hundreds of millions. Four orders of magnitude apart, which is why
// the report scores "whichever effect actually dominates" rather than putting both
// on one percent scale. Drawing them to the same scale is the point: the salinity
// bars are invisible, and that invisibility is the finding.
import { Box, Typography, useTheme } from '@mui/material'
import type { ReactNode } from 'react'
import { valueAt } from '../drilldown/cellValue'
import { ANY, fmtValue } from '../drilldown/model'
import type { ScenarioKey } from '../drilldown/model'
import { SUBTEAM_PROFILES } from './profiles'
import { REGION_DATA_KEY } from './regionKeys'
import { RegionValues } from './RegionValues'
import { ColumnHead, Legend, Panel, RowHead, SubteamPage } from './SubteamFrame'
import { cellFill } from '../data'
import { DifferenceFromToday, MetricCards } from './aids'
import { RegionMap } from './RegionMap'

const BASE = 1_107_300_000

/** The salinity pathway's dry-year (2020) farm revenue change, current climate (v16 workbook). */
const SALINITY = [
  { label: 'A Tunnel, dry year', value: -26_953 },
  { label: 'Bolster & Fortify, dry year', value: -10_167 },
  { label: 'Calling on Reserves, dry year', value: 2_880 },
  { label: 'Eco Machine, dry year', value: 3_534 },
  { label: 'New Green Watershed, dry year', value: 967 },
]

/** The land-use pathway, direct revenue change at each restoration intensity. */
const LAND_USE = [
  { label: 'New Green Watershed, 25/75', value: -212_400_000, score: -3 },
  { label: 'New Green Watershed, 50/50', value: -282_500_000, score: -4 },
  { label: 'New Green Watershed, full managed wetland', value: -504_500_000, score: -5 },
]

const WIDEST = 504_500_000

const ZONE_KEY = REGION_DATA_KEY.economy ?? {}
const ZONE_SCENARIOS: ScenarioKey[] = ['ngw', 'em', 'bf', 'cor', 'tunnel', 'bau']

const economyScore = (scenario: ScenarioKey) => {
  const cell = valueAt({ criterion: 'economy', scenario, place: ANY, period: ANY })
  return cell.value === null ? 'not scored' : fmtValue(cell.value, 'score')
}

const money = (value: number) => {
  const abs = Math.abs(value)
  const sign = value < 0 ? '−' : '+'
  if (abs >= 1_000_000) return `${sign}$${Math.round(abs / 1_000_000)}M`
  return `${sign}$${abs.toLocaleString('en-US')}`
}

export default function EconomyView() {
  const theme = useTheme()
  return (
    <SubteamPage
      profile={SUBTEAM_PROFILES.economy}
      aidWide
      aid={
        <Box sx={{ display: 'grid', gap: 2.5 }}>
          <MetricCards
            metrics={[
              {
                label: 'Gross revenue',
                counted: true,
                items: [
                  'Dollar sales from Delta farms in a year',
                  'Difference from Business as Usual',
                ],
              },
              {
                label: 'Jobs',
                counted: true,
                items: [
                  'Farm jobs plus the jobs they support',
                  'Difference from Business as Usual',
                ],
              },
              {
                label: 'Value added',
                counted: true,
                items: [
                  'Wages, business income and taxes, roughly farm GDP',
                  'Difference from Business as Usual',
                ],
              },
            ]}
          />
          <DifferenceFromToday map={<RegionMap active="economy" labels={false} />} />
        </Box>
      }
    >
      <Panel
        title="Two ways a scenario changes farm revenue, drawn to one scale"
        intro="Saltier irrigation water lowers crop yields: the **salinity pathway**. Restoring farmland to wetland takes it out of production: the **land-use pathway**. Each bar is the **change in annual gross farm revenue** from today’s $1.107 billion, and every bar uses the same axis. The salinity bars are ==too small to see==, which is the point: the largest salinity effect anywhere is A Tunnel’s **−$27,000** in a dry year, 0.002% of the base and about **one ten-thousandth** of the 50/50 restoration effect."
      >
        <Box sx={{ display: 'grid', gap: 2 }}>
          <Group title="Salinity pathway">
            {SALINITY.map((row) => (
              <Bar key={row.label} {...row} />
            ))}
          </Group>
          <Group title="Land-use pathway">
            {LAND_USE.map((row) => (
              <Bar key={row.label} {...row} />
            ))}
          </Group>
        </Box>
        <Legend
          items={[
            { swatch: theme.chart.voting.below, label: 'Revenue falls' },
            { swatch: theme.chart.voting.above, label: 'Revenue rises' },
          ]}
          note="A bar too thin to see is drawn as a hairline."
        />
      </Panel>

      <Panel
        title="How much restoration, and what it costs in revenue"
        intro="New Green Watershed was run at **three restoration intensities**, from the lightest (25/75) to the heaviest (full managed wetland). Each is a sub-scenario with **its own score**, and these are the ==only Economy values whose size directly sets a score==."
      >
        <Box sx={{ overflowX: 'auto', overflowY: 'hidden' }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '300px 1fr 1fr 1fr',
              columnGap: 2,
              rowGap: 0.75,
              minWidth: 640,
              alignItems: 'center',
            }}
          >
            <ColumnHead>Intensity</ColumnHead>
            <ColumnHead>Revenue change</ColumnHead>
            <ColumnHead>Share of today’s revenue</ColumnHead>
            <ColumnHead>Score</ColumnHead>
            {LAND_USE.map((row) => (
              <Box key={row.label} sx={{ display: 'contents' }}>
                <RowHead>{row.label}</RowHead>
                <Typography variant="body2" sx={{ color: 'base.50' }}>
                  <Box component="strong">{money(row.value)}</Box>
                </Typography>
                <Typography variant="body2" sx={{ color: 'base.100' }}>
                  {`${Math.round((Math.abs(row.value) / BASE) * 1000) / 10}%`}
                </Typography>
                <Box
                  sx={(theme) => ({
                    justifySelf: 'start',
                    px: 1,
                    py: 0.5,
                    borderRadius: 0.4,
                    bgcolor: cellFill(row.score),
                    color: theme.palette.common.white,
                  })}
                >
                  <Typography variant="body2" sx={{ color: 'inherit' }}>
                    <Box component="strong">{fmtValue(row.score, 'score')}</Box>
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Panel>

      <Panel
        title="The salinity pathway on the map, dry year"
        intro="Each map colours the three outlined zones by the **change in value added** from Business as Usual in 2020, for the **salinity pathway only**; West Delta has no outline yet. The score beneath each map is the criterion score, and ==it does not come from this map==: Economy scores each scenario on its dominant effect, and for New Green Watershed that is land conversion. Three of the sixteen zone values could not be verified from the slide image."
      >
        <RegionValues
          team="economy"
          scenarios={ZONE_SCENARIOS}
          coordsFor={(region, scenario) =>
            ZONE_KEY[region]
              ? { criterion: 'econ-value-zones', scenario, place: ZONE_KEY[region], period: ANY }
              : null
          }
          caption={economyScore}
          unitLabel="Change in value added from Business as Usual"
        />
      </Panel>
    </SubteamPage>
  )
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Box sx={{ display: 'grid', gap: 0.6 }}>
      <Typography variant="body2" sx={{ color: 'base.50' }}>
        <Box component="strong">{title}</Box>
      </Typography>
      {children}
    </Box>
  )
}

function Bar({ label, value }: { label: string; value: number }) {
  const width = (Math.abs(value) / WIDEST) * 100
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '300px 1fr 100px' },
        gap: 1,
        alignItems: 'center',
      }}
    >
      <RowHead>{label}</RowHead>
      <Box sx={{ height: 16, bgcolor: 'translucent.100', borderRadius: 0.4 }}>
        <Box
          sx={(theme) => ({
            height: '100%',
            // A hairline where the effect is real but too small to draw honestly.
            width: `max(2px, ${width}%)`,
            borderRadius: 0.4,
            bgcolor: value < 0 ? theme.chart.voting.below : theme.chart.voting.above,
          })}
        />
      </Box>
      <Typography variant="body2" sx={{ color: 'base.50', textAlign: 'right' }}>
        {money(value)}
      </Typography>
    </Box>
  )
}
