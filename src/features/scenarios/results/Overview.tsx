import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined'
import { Box, Button, Stack, Tab, Tabs, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { NavigationControl } from 'react-map-gl/mapbox'
import { Link } from 'react-router-dom'
import BaseMap from '../../../map/BaseMap'
import Camera from '../../../map/layers/scenarios/Camera'
import Layers from '../../../map/layers/scenarios/Layers'
import Legend from '../../../map/layers/scenarios/Legend'
import { getConfig } from '../../../map/layers/scenarios/config'
import { jtSpacing } from '../../../theme'
import NavRail from '../../../ui/NavRail'
import TeamIcon from '../../../ui/TeamIcon'
import { SCENARIO_EXPLORER_MAP_STYLE } from '../../scenario-explorer/mapConfig'
import { evaluationTeams } from '../content'
import EvaluationFramework from './EvaluationFramework'
import { teamStyle } from '../teamStyle'

const overviewNavigation = [
  { id: 'how-modeled', label: 'How are scenarios modeled?' },
  { id: 'how-evaluated', label: 'How are scenarios evaluated?' },
  ...evaluationTeams.map((team) => ({
    id: team.id,
    label: teamStyle[team.id].shortLabel,
    indent: true as const,
    color: teamStyle[team.id].color,
    icon: <TeamIcon team={teamStyle[team.id].icon} size={18} />,
  })),
  { id: 'how-compared', label: 'How are scenarios compared?' },
] as const

const implementationDetails = [
  {
    id: 'eco',
    slug: 'eco-machine',
    label: 'Eco Machine',
    title: 'Eco Machine',
    description:
      'A restoration scenario focused on Suisun Marsh and Franks Tract Futures. Large restored areas are represented as connections to marsh sloughs, changing how tidal energy moves into the Delta.',
    mechanism:
      'The added marsh area absorbs tidal energy. Franks Tract is also reconfigured to reduce tidal pumping of salinity through the tract and toward the south Delta export facilities.',
    assets: [
      'Suisun Marsh restoration footprint',
      'Franks Tract Futures geometry',
      'Focused bottom-elevation surface',
    ],
  },
  {
    id: 'ngw',
    slug: 'new-green-watershed',
    label: 'New Green Watershed',
    title: 'New Green Watershed',
    description:
      'An expanded restoration scenario that includes Suisun Marsh, Franks Tract Futures, Dutch Slough, Egbert Tract, Hastings Tract, and the northern Cache Slough Complex.',
    mechanism:
      'The larger restoration network tests how several connected changes redistribute tidal exchange and whether their combined effects extend farther across the Delta.',
    assets: [
      'All Eco Machine restoration footprints',
      'Dutch Slough, Egbert, and Hastings tracts',
      'Northern Cache Slough Complex extent',
    ],
  },
  {
    id: 'bolster',
    slug: 'bolster-and-fortify',
    label: 'Bolster and Fortify',
    title: 'Bolster and Fortify',
    description:
      'A Franks Tract operations scenario that builds up the eastern levee, blocks selected channels, and operates gates in response to salinity conditions.',
    mechanism:
      'Blocking the east side disrupts the tidal pump, reducing salinity transport toward the export facilities while potentially retaining saltier water inside Franks Tract. Gates close when Jersey Point EC exceeds 700 µS/cm.',
    assets: [
      'Franks Tract levee and channel-block geometry',
      'Operable gate locations and status',
      'Gate-operation timeline for 2018–2020',
    ],
  },
] as const

const modeledOutputs = [
  {
    title: 'Salinity',
    body: 'Electrical conductivity (EC) shows how salty or fresh the water is and how the salinity boundary moves through the Delta.',
  },
  {
    title: 'Water age',
    body: 'The time since water entered an area helps identify slow-moving conditions that may favor harmful algal blooms.',
  },
  {
    title: 'Water temperature',
    body: 'Modeled temperature helps identify when and where conditions may support or stress temperature-sensitive species.',
  },
] as const

type OverviewSectionId = (typeof overviewNavigation)[number]['id']
type Implementation = (typeof implementationDetails)[number]

const fullBleedBand = (color: string) => ({
  backgroundColor: color,
  boxShadow: `0 0 0 100vmax ${color}`,
  clipPath: 'inset(0 -100vmax)',
})

function AssetList({ title, assets }: { title: string; assets: readonly string[] }) {
  return (
    <Stack spacing={jtSpacing.gap.sm} sx={{ mt: jtSpacing.component.lg }}>
      <Typography variant="navigationLabel" component="h4">
        {title}
      </Typography>
      {assets.map((asset) => (
        <Stack key={asset} direction="row" spacing={jtSpacing.gap.sm} sx={{ alignItems: 'center' }}>
          <LayersOutlinedIcon sx={{ color: 'primary.main' }} fontSize="small" />
          <Typography variant="body2">{asset}</Typography>
        </Stack>
      ))}
    </Stack>
  )
}

function ScenarioMap({ implementation }: { implementation: Implementation }) {
  const mapConfig = getConfig(implementation.slug)
  const bounds = mapConfig.bounds.delta

  return (
    <Box
      aria-label={`Interactive map for ${implementation.title}`}
      sx={{
        height: { xs: 420, lg: 'calc(100dvh - 110px)' },
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 1,
        border: 1,
        borderColor: 'base.400',
        bgcolor: 'base.700',
        '& .mapboxgl-ctrl-bottom-left': { display: 'none' },
      }}
    >
      <BaseMap
        key={implementation.slug}
        initialViewState={mapConfig.initialViewState}
        mapStyleUrl={SCENARIO_EXPLORER_MAP_STYLE}
        interactive={mapConfig.interactive}
        dragPan={mapConfig.interactive}
        dragRotate={false}
        scrollZoom={mapConfig.interactive}
        touchZoomRotate={mapConfig.interactive}
        maxBounds={mapConfig.maxBounds}
      >
        {bounds && <Camera bounds={bounds} />}
        <Layers scenarioSlug={implementation.slug} showAdaptationLayers visibilityScope="delta" />
        {mapConfig.showNavigationControl && (
          <NavigationControl position="bottom-right" showCompass={false} />
        )}
      </BaseMap>
      <Legend
        scenarioSlug={implementation.slug}
        visibilityScope="delta"
        visible
        selectedHabitatType={null}
      />
    </Box>
  )
}

export default function Overview() {
  const [selectedImplementationId, setSelectedImplementationId] = useState('eco')
  const [activeSection, setActiveSection] = useState<OverviewSectionId>('how-modeled')
  const selectedImplementation =
    implementationDetails.find(({ id }) => id === selectedImplementationId) ??
    implementationDetails[0]

  useEffect(() => {
    const elements = overviewNavigation
      .map(({ id }) => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element))
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter(({ isIntersecting }) => isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActiveSection(visible.target.id as OverviewSectionId)
      },
      { rootMargin: '-28% 0px -58% 0px', threshold: [0, 0.2, 0.5] },
    )
    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          lg: 'minmax(180px, .3fr) minmax(0, 1fr) minmax(360px, .92fr)',
        },
        gap: { xs: jtSpacing.gap.xl, lg: 0 },
        columnGap: { lg: jtSpacing.section.md },
        alignItems: 'start',
      }}
    >
      <Box
        component="aside"
        sx={{
          gridRow: { lg: '1 / span 3' },
          position: { lg: 'sticky' },
          top: { lg: 148 },
          zIndex: 3,
          pt: { xs: jtSpacing.component.lg, md: jtSpacing.component.xl },
        }}
      >
        <Typography
          variant="eyebrow"
          sx={{ display: 'block', color: 'base.200', mb: jtSpacing.component.md }}
        >
          On this page
        </Typography>
        <NavRail
          items={[...overviewNavigation]}
          ariaLabel="Results overview sections"
          activeItemId={activeSection}
          onNavigate={(id) => setActiveSection(id as OverviewSectionId)}
          sx={{
            position: 'relative',
            inset: 'auto',
            transform: 'none',
            zIndex: 1,
            display: 'flex !important',
            alignItems: 'flex-start',
            '& button': { justifyContent: 'flex-start', flexDirection: 'row-reverse' },
            '& .rail-label': { whiteSpace: 'normal', textAlign: 'left' },
          }}
        />
      </Box>

      <Stack spacing={0} sx={{ display: { lg: 'contents' } }}>
        <Box
          component="section"
          id="how-modeled"
          aria-labelledby="how-modeled-title"
          sx={[
            {
              gridColumn: { lg: 2 },
              gridRow: { lg: 1 },
              scrollMarginTop: 110,
              p: { xs: jtSpacing.component.lg, md: jtSpacing.component.xl },
            },
            (theme) => fullBleedBand(theme.palette.base[600]),
          ]}
        >
          <Typography id="how-modeled-title" variant="h2">
            How are scenarios modeled?
          </Typography>
          <Typography variant="body1" sx={{ mt: jtSpacing.gap.md, color: 'base.100' }}>
            We used the two-dimensional RMA Bay-Delta hydrodynamic and water-quality model to test
            how four Delta geometries change salinity, water age, and water temperature.
          </Typography>
          <Box
            sx={{
              mt: jtSpacing.section.md,
              p: jtSpacing.component.lg,
              border: 1,
              borderColor: 'border.default',
              bgcolor: 'translucent.100',
            }}
          >
            <Typography variant="h4" component="h3">
              A shared baseline for comparison
            </Typography>
            <Typography variant="body1" sx={{ mt: jtSpacing.gap.sm, color: 'base.100' }}>
              The Base run represents a near-future “business as usual” condition, including planned
              restoration at sites such as Little Egbert Tract and Prospect Island. Every future is
              compared with this same reference—not treated as a fourth choice visitors need to
              select. Outputs from every run are sampled at the same monitoring locations so
              differences can be compared consistently through time and across regions.
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: jtSpacing.gap.md,
              mt: jtSpacing.section.md,
            }}
          >
            <Box
              component="section"
              aria-labelledby="spatial-boundary-title"
              sx={{ p: jtSpacing.component.lg, borderTop: 3, borderColor: 'primary.main' }}
            >
              <Typography id="spatial-boundary-title" variant="h4" component="h3">
                Spatial boundary
              </Typography>
              <Typography variant="body1" sx={{ mt: jtSpacing.gap.sm, color: 'base.100' }}>
                The model covers the San Francisco Bay–Sacramento–San Joaquin Delta system. Salinity
                enters through the ocean boundary and is tracked through channels, restored areas,
                and monitoring locations as electrical conductivity (EC).
              </Typography>
            </Box>
            <Box
              component="section"
              aria-labelledby="simulation-time-title"
              sx={{ p: jtSpacing.component.lg, borderTop: 3, borderColor: 'primary.main' }}
            >
              <Typography id="simulation-time-title" variant="h4" component="h3">
                Simulation time
              </Typography>
              <Typography variant="body1" sx={{ mt: jtSpacing.gap.sm, color: 'base.100' }}>
                The simulation runs from October 2018 through November 2020, capturing contrasting
                hydrologic conditions: water year 2019 was wet, while water year 2020 was dry.
              </Typography>
            </Box>
          </Box>
          <Box sx={{ mt: jtSpacing.section.md }}>
            <Typography variant="h3" component="h3">
              What is modeled
            </Typography>
            <Typography variant="body1" sx={{ mt: jtSpacing.gap.sm, color: 'base.100' }}>
              Each scenario run produces the same set of physical water-quality outputs, allowing
              differences to be traced across both space and time.
            </Typography>
            <Stack spacing={0} sx={{ mt: jtSpacing.component.lg }}>
              {modeledOutputs.map((output) => (
                <Box
                  component="article"
                  key={output.title}
                  sx={{ py: jtSpacing.component.lg, borderTop: 1, borderColor: 'border.default' }}
                >
                  <Typography variant="h4" component="h4">
                    {output.title}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: jtSpacing.gap.sm }}>
                    {output.body}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>
          <Box sx={{ mt: jtSpacing.section.md, borderBottom: 1, borderColor: 'border.default' }}>
            <Tabs
              value={selectedImplementationId}
              onChange={(_, value: string) => setSelectedImplementationId(value)}
              aria-label="Scenario implementation details"
              variant="fullWidth"
            >
              {implementationDetails.map(({ id, label, title }) => (
                <Tab key={id} value={id} label={label} aria-label={title} />
              ))}
            </Tabs>
          </Box>
          <Box sx={{ pt: jtSpacing.component.lg }}>
            <Typography variant="h3" component="h3">
              {selectedImplementation.title}
            </Typography>
            <Typography variant="body1" sx={{ mt: jtSpacing.gap.md, color: 'base.100' }}>
              {selectedImplementation.description}
            </Typography>
            <Box
              sx={{
                mt: jtSpacing.component.lg,
                pl: jtSpacing.component.md,
                borderLeft: 3,
                borderColor: 'primary.main',
              }}
            >
              <Typography variant="navigationLabel" component="h4">
                Mechanism at work
              </Typography>
              <Typography variant="body2" sx={{ mt: jtSpacing.gap.sm }}>
                {selectedImplementation.mechanism}
              </Typography>
            </Box>
            <AssetList title="Map assets to add" assets={selectedImplementation.assets} />
          </Box>
        </Box>

        <Box
          component="section"
          id="how-evaluated"
          aria-labelledby="how-evaluated-title"
          sx={[
            {
              // Spans the content and map columns, matching the methodology pages' width
              gridColumn: { lg: '2 / -1' },
              gridRow: { lg: 2 },
              scrollMarginTop: 110,
              p: { xs: jtSpacing.component.lg, md: jtSpacing.component.xl },
            },
            (theme) => fullBleedBand(theme.palette.base[700]),
          ]}
        >
          <Typography id="how-evaluated-title" variant="h2" sx={{ mb: jtSpacing.gap.md }}>
            How are scenarios evaluated?
          </Typography>
          <Typography variant="body1" sx={{ mb: jtSpacing.section.md, color: 'base.100' }}>
            Multidisciplinary teams evaluate every future from complementary ecological, cultural,
            community, recreational, and economic perspectives. Together, they show how each
            scenario creates different benefits, burdens, and trade-offs across the Delta.
          </Typography>
          <Box sx={{ mt: jtSpacing.section.md }}>
            <EvaluationFramework showIntroduction={false} />
          </Box>
        </Box>

        <Box
          component="section"
          id="how-compared"
          aria-labelledby="how-compared-title"
          sx={[
            {
              // Spans the content and map columns, matching the methodology pages' width
              gridColumn: { lg: '2 / -1' },
              gridRow: { lg: 3 },
              scrollMarginTop: 110,
              p: { xs: jtSpacing.component.lg, md: jtSpacing.component.xl },
            },
            (theme) => fullBleedBand(theme.palette.base[800]),
          ]}
        >
          <Typography id="how-compared-title" variant="h2">
            How are scenarios compared?
          </Typography>
          {/* Two columns from md up: how scores work on the left, where to start on the right */}
          <Box
            sx={{
              mt: jtSpacing.gap.md,
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) minmax(0, 1fr)' },
              gap: { xs: jtSpacing.section.md, md: jtSpacing.section.md },
              alignItems: 'start',
            }}
          >
            <Box>
              <Typography variant="h3" component="h3">
                How scores work
              </Typography>
              <Typography variant="body1" sx={{ mt: jtSpacing.gap.sm, color: 'base.100' }}>
                Each team places every scenario on a −5 to +5 scale, with the shared baseline fixed
                at 0. A score reflects how far a team’s metrics deviate from baseline and in which
                direction. Each team defines the intervals used to translate those metric
                differences into scores for its area of expertise.
              </Typography>
              <Button
                component={Link}
                to="/scenarios/ranking"
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                sx={{ mt: jtSpacing.component.lg }}
              >
                Open ranking visualization
              </Button>
            </Box>
            <Box>
              <Typography variant="h3" component="h3">
                Explore results before ranking
              </Typography>
              <Typography variant="body1" sx={{ mt: jtSpacing.gap.sm, color: 'base.100' }}>
                Move through the outflow variations and adaptation scenarios to review their modeled
                results before comparing their team scores and overall ranking.
              </Typography>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={jtSpacing.gap.sm}
                sx={{ mt: jtSpacing.component.lg, alignItems: { xs: 'stretch', sm: 'center' } }}
              >
                <Button component={Link} to="/scenarios/tiered-outflows/results" variant="outlined">
                  View outflow variations
                </Button>
                <Button component={Link} to="/scenarios/eco-machine/results" variant="contained">
                  View adaptation scenarios
                </Button>
              </Stack>
            </Box>
          </Box>
        </Box>
      </Stack>

      <Box
        sx={{
          gridColumn: { lg: 3 },
          gridRow: { lg: 1 },
          alignSelf: { lg: 'stretch' },
        }}
      >
        <Box sx={{ position: { lg: 'sticky' }, top: { lg: 110 }, zIndex: 3 }}>
          <ScenarioMap implementation={selectedImplementation} />
        </Box>
      </Box>
    </Box>
  )
}
