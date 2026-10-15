// Ecology's middle: the cube, and the finding that the cube contradicts.
//
// Their deepest evidence is 8 species × 8 regions × 2 water years, and their own
// summary says the scenarios barely separate. The comparison page cannot show
// that, because it puts scenario on an axis and so implies scenario is what moves
// the numbers. Here the two grids sit side by side and the second panel measures
// the claim: for each species, how far the scenarios spread against how far the
// water years do.
import { Box, Typography } from '@mui/material'
import { useState } from 'react'
import { ECOLOGY_NICHE, ECOLOGY_REGIONS, ECOLOGY_SPECIES } from '../drilldown/ecologyNiche'
import type { EcologyRegionKey, EcologySpeciesKey } from '../drilldown/ecologyNiche'
import { SCENARIO_NAME } from '../drilldown/model'
import { SUBTEAM_PROFILES } from './profiles'
import { RegionValues } from './RegionValues'
import { Choice, Panel, SubteamPage } from './SubteamFrame'

const SCENARIOS = ['bau', 'em', 'ngw', 'bf', 'cor'] as const
type NicheScenario = (typeof SCENARIOS)[number]

const YEARS_FACET = [
  { key: '2019' as const, label: '2019 · wet' },
  { key: '2020' as const, label: '2020 · dry' },
]

const YEARS = [
  { key: 'wet' as const, label: '2019 · wet' },
  { key: 'dry' as const, label: '2020 · dry' },
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

const cell = (species: EcologySpeciesKey, scenario: NicheScenario, region: EcologyRegionKey) =>
  ECOLOGY_NICHE[species]?.[scenario]?.[region]

/** Share of suitable days as a block of colour; 0 stays visible as an empty well. */
function Share({ value }: { value: number | undefined }) {
  if (value === undefined) return <Box sx={{ height: 20, bgcolor: 'translucent.50' }} />
  return (
    <Box
      title={`${Math.round(value * 1000) / 10}%`}
      sx={{
        height: 20,
        bgcolor: value === 0 ? 'translucent.100' : 'salinity.teal',
        opacity: value === 0 ? 1 : 0.18 + Math.min(1, value) * 0.82,
      }}
    />
  )
}

export default function EcologyView() {
  const [scenario, setScenario] = useState<NicheScenario>('ngw')
  const [mapSpecies, setMapSpecies] = useState<EcologySpeciesKey>(ECOLOGY_SPECIES[0].key)
  const [mapYear, setMapYear] = useState<'2019' | '2020'>('2019')

  // The claim under test: for one species and region, how much does changing the
  // scenario move the share, and how much does changing the water year?
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
    return { species, byScenario, byYear }
  })
  const widest = Math.max(...spreads.flatMap((row) => [row.byScenario, row.byYear]), 0.01)

  return (
    <SubteamPage profile={SUBTEAM_PROFILES.ecology}>
      <Panel
        title="Where each species can live"
        note="Share of days in the Feb–Jun window when salinity and temperature both sat inside a species' tolerance, by region. The same scenario, in a wet year and a dry one."
      >
        <Choice
          label="Scenario"
          value={scenario}
          onChange={setScenario}
          options={SCENARIOS.map((key) => ({ key, label: SCENARIO_NAME[key] }))}
        />

        <Box
          sx={(theme) => ({
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
            gap: theme.jtSpacing.gap.lg,
            mt: 1.5,
          })}
        >
          {YEARS.map((year, yearIndex) => (
            <Box key={year.key} sx={{ display: 'grid', gap: 0.5, minWidth: 0 }}>
              <Typography variant="chartColumnHead">{year.label}</Typography>
              <Box sx={{ overflowX: 'auto' }}>
                <Box sx={{ display: 'grid', gap: 0.25, minWidth: 420 }}>
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: `140px repeat(${ECOLOGY_REGIONS.length}, 1fr)`,
                      gap: 0.25,
                      alignItems: 'end',
                    }}
                  >
                    <Box />
                    {ECOLOGY_REGIONS.map((region) => (
                      <Typography
                        key={region.key}
                        variant="chartAxis"
                        sx={{
                          color: 'base.300',
                          writingMode: 'vertical-rl',
                          transform: 'rotate(180deg)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {region.label}
                      </Typography>
                    ))}
                  </Box>
                  {ECOLOGY_SPECIES.map((species) => (
                    <Box
                      key={species.key}
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: `140px repeat(${ECOLOGY_REGIONS.length}, 1fr)`,
                        gap: 0.25,
                        alignItems: 'center',
                      }}
                    >
                      <Typography variant="chartAxis" noWrap sx={{ pr: 0.5 }}>
                        {species.label}
                      </Typography>
                      {ECOLOGY_REGIONS.map((region) => (
                        <Share
                          key={region.key}
                          value={cell(species.key, scenario, region.key)?.[yearIndex]}
                        />
                      ))}
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Panel>

      <Panel
        title="The map behind no score"
        note="Share of suitable days for one species, region by region, one map per scenario. Five of the eight regions have an outline; the three bay regions do not yet. The caption under every map is the same, and that is the point: this is the deepest evidence in the project, and it reaches no criterion score."
      >
        <Box sx={{ display: 'grid', gap: 0.75 }}>
          <Choice
            label="Species"
            value={mapSpecies}
            onChange={setMapSpecies}
            options={ECOLOGY_SPECIES.map((species) => ({ key: species.key, label: species.label }))}
          />
          <Choice label="Water year" value={mapYear} onChange={setMapYear} options={YEARS_FACET} />
        </Box>
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
          caption={() => 'no score'}
          unitLabel="share of suitable days"
          changeToggle
        />
      </Panel>

      <Panel
        title="What actually moves these numbers"
        note="For each species, the widest swing any one region shows when the scenario changes, against the widest swing it shows when the water year changes. Their summary says the water year wins, and this is that claim measured."
      >
        <Box sx={{ display: 'grid', gap: 0.75 }}>
          {spreads.map(({ species, byScenario, byYear }) => (
            <Box
              key={species.key}
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '180px 1fr' },
                gap: 1,
                alignItems: 'center',
              }}
            >
              <Typography variant="chartLabel" noWrap>
                {species.label}
              </Typography>
              <Box sx={{ display: 'grid', gap: 0.25 }}>
                <SpreadBar label="scenario" value={byScenario} max={widest} tone="scenario" />
                <SpreadBar label="water year" value={byYear} max={widest} tone="year" />
              </Box>
            </Box>
          ))}
        </Box>
      </Panel>
    </SubteamPage>
  )
}

function SpreadBar({
  label,
  value,
  max,
  tone,
}: {
  label: string
  value: number
  max: number
  tone: 'scenario' | 'year'
}) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '78px 1fr 52px',
        gap: 0.75,
        alignItems: 'center',
      }}
    >
      <Typography variant="chartAxis" sx={{ color: 'base.300' }}>
        {label}
      </Typography>
      <Box sx={{ height: 10, bgcolor: 'translucent.100', borderRadius: 0.5 }}>
        <Box
          sx={{
            height: '100%',
            width: `${Math.max(1, (value / max) * 100)}%`,
            borderRadius: 0.5,
            bgcolor: tone === 'year' ? 'salinity.pink' : 'salinity.teal',
          }}
        />
      </Box>
      <Typography variant="chartAxis" sx={{ textAlign: 'right' }}>
        {`${Math.round(value * 1000) / 10}%`}
      </Typography>
    </Box>
  )
}
