// Economy's middle: two pathways that cannot share an axis.
//
// Salinity moves the farm economy by tens of thousands of dollars; land conversion
// moves it by hundreds of millions. Four orders of magnitude apart, which is why
// the report scores "whichever effect actually dominates" rather than putting both
// on one percent scale. Drawing them to the same scale is the point: the salinity
// bars are invisible, and that invisibility is the finding.
import { Box, Typography } from '@mui/material'
import { SUBTEAM_PROFILES } from './profiles'
import { Panel, SubteamPage } from './SubteamFrame'

const BASE = 1_107_300_000

/** Everything either source states for the salinity pathway, in dollars per year. */
const SALINITY = [
  { label: 'Bolster & Fortify, dry year', value: -34_000 },
  { label: 'Calling on Reserves, dry year', value: -1_000 },
  { label: 'Calling on Reserves, wet year', value: 4_000 },
  { label: 'New Green Watershed, wet year', value: 468_000 },
]

/** The land-use pathway, direct revenue change at each restoration intensity. */
const LAND_USE = [
  { label: 'New Green Watershed, 25/75', value: -212_400_000, score: -3 },
  { label: 'New Green Watershed, 50/50', value: -282_500_000, score: -4 },
  { label: 'New Green Watershed, full MW', value: -504_500_000, score: -5 },
]

const WIDEST = 504_500_000

const money = (value: number) => {
  const abs = Math.abs(value)
  const sign = value < 0 ? '−' : '+'
  if (abs >= 1_000_000) return `${sign}$${Math.round(abs / 1_000_000)}M`
  return `${sign}$${abs.toLocaleString('en-US')}`
}

export default function EconomyView() {
  return (
    <SubteamPage profile={SUBTEAM_PROFILES.economy}>
      <Panel
        title="Both pathways, drawn to the same scale"
        note="Change in annual farm revenue against a $1.107B base. Every bar uses the same axis, which is the only way to see the thing the criterion turns on."
      >
        <Box sx={{ display: 'grid', gap: 1.5 }}>
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
        <Typography variant="body2" sx={{ color: 'base.300', mt: 1.25, maxWidth: '78ch' }}>
          The largest salinity effect anywhere is {money(-34_000)} in a dry year, which is 0.003% of
          the base and about one eight-thousandth of the 50/50 restoration effect beneath it. This
          is why the report scores each scenario on whichever effect dominates rather than forcing
          both onto one percent scale.
        </Typography>
      </Panel>

      <Panel
        title="What the restoration intensities cost"
        note="The three New Green Watershed levels are sub-scenarios rather than parts of the criterion, so they carry their own scores. These are the only Economy figures that map to a score by magnitude."
      >
        <Box sx={{ display: 'grid', gap: 0.5 }}>
          {LAND_USE.map((row) => (
            <Box
              key={row.label}
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '240px 110px 1fr' },
                gap: 1,
                alignItems: 'center',
              }}
            >
              <Typography variant="chartLabel">{row.label}</Typography>
              <Typography variant="chartValue">{money(row.value)}</Typography>
              <Typography variant="chartAxis" sx={{ color: 'base.300' }}>
                {`${Math.round((Math.abs(row.value) / BASE) * 1000) / 10}% of the base · scores ${row.score}`}
              </Typography>
            </Box>
          ))}
        </Box>
      </Panel>
    </SubteamPage>
  )
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Box sx={{ display: 'grid', gap: 0.5 }}>
      <Typography variant="chartColumnHead">{title}</Typography>
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
        gridTemplateColumns: { xs: '1fr', sm: '240px 1fr 92px' },
        gap: 1,
        alignItems: 'center',
      }}
    >
      <Typography variant="chartAxis" noWrap>
        {label}
      </Typography>
      <Box sx={{ height: 14, bgcolor: 'translucent.100', borderRadius: 0.4 }}>
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
      <Typography variant="chartAxis" sx={{ textAlign: 'right' }}>
        {money(value)}
      </Typography>
    </Box>
  )
}
