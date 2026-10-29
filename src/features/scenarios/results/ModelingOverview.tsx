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
import PageRail from '../../../ui/PageRail'
import { SCENARIO_EXPLORER_MAP_STYLE } from '../../scenario-explorer/mapConfig'
import ModeledSalinity from './ModeledSalinity'
import { fullBleedBand } from './styles'

const overviewNavigation = [
  { id: 'how-modeled', label: 'How are scenarios modeled?' },
  { id: 'shared-baseline', label: 'Two baselines', indent: true },
  { id: 'model-setup', label: 'Space and time', indent: true },
  { id: 'what-is-modeled', label: 'What is modeled', indent: true },
  { id: 'scenario-implementations', label: 'How each future is built', indent: true },
  { id: 'modeled-salinity', label: 'Where salinity changes' },
  { id: 'next-step', label: 'Next: evaluation' },
] as const

const implementationDetails = [
  {
    id: 'eco',
    slug: 'eco-machine',
    label: 'Eco Machine',
    title: 'Eco Machine',
    basis: 'Changes the geometry · runs with Base flows · compared with Base',
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
    basis: 'Changes the geometry · runs with Base flows · compared with Base',
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
    basis: 'Changes the geometry · runs with Base flows · compared with Base',
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
  {
    id: 'tunnel',
    slug: 'a-tunnel',
    label: 'A Tunnel',
    title: 'A Tunnel',
    basis: 'Changes the flows · runs on Base geometry · compared with CalSim Base',
    description:
      'A flow scenario based on the Bethany Reservoir Alignment of the proposed Delta Conveyance Project. The Delta’s geometry stays as in Base; what changes is the flow entering it, as some Sacramento River water is diverted at new intakes in the northern Delta.',
    mechanism:
      'Water taken at the northern intakes travels beneath the Delta instead of through its channels, so less Sacramento River water moves through parts of the Delta. That changes net Delta outflow, and with it how far salinity reaches into the Delta.',
    assets: [
      'Northern Delta intake locations',
      'Tunnel alignment to Bethany Reservoir',
      'Modeled net Delta outflow, CalSim Base and A Tunnel',
    ],
  },
  {
    id: 'reserves',
    slug: 'calling-on-reserves',
    label: 'Calling on Reserves',
    title: 'Calling on Reserves',
    basis: 'Changes the flows · runs on Base geometry · compared with CalSim Base',
    description:
      'A flow scenario that changes how Shasta Reservoir is operated, aiming to raise its year-to-year carryover storage by 20% by reducing Central Valley Project allocations and timing releases to benefit fish. The Delta’s geometry stays as in Base.',
    mechanism:
      'Higher storage can mean larger or more frequent flood releases in wet winters, adding Delta inflow, while reduced allocations can lower export pumping. Together these shift salinity in different parts of the Delta.',
    assets: [
      'Modeled net Delta outflow, CalSim Base and Calling on Reserves',
      'Shasta Reservoir, upstream of the model area',
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

const monitoringStations = [
  'Clifton Court',
  'Tracy Pumping Plant',
  'San Joaquin River at Jersey Point',
  'Sacramento River at Emmaton',
  'Montezuma Slough near Beldons Landing',
  'Lindsey Slough at the Big Ditch',
] as const

type OverviewSectionId = (typeof overviewNavigation)[number]['id']
type Implementation = (typeof implementationDetails)[number]

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

export default function ModelingOverview() {
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
      <PageRail
        items={[...overviewNavigation]}
        ariaLabel="Results overview sections"
        activeItemId={activeSection}
        onNavigate={(id) => setActiveSection(id as OverviewSectionId)}
        sx={{
          gridRow: { lg: '1 / span 3' },
          pt: { xs: jtSpacing.component.lg, md: jtSpacing.component.xl },
        }}
      />

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
            five futures: three that change the shape of the Delta and two that change the flows
            entering it. Every run tracks salinity, water temperature, and water age, with and
            without sea level rise.
          </Typography>
          <Box
            id="shared-baseline"
            sx={{
              scrollMarginTop: 110,
              mt: jtSpacing.section.md,
              p: jtSpacing.component.lg,
              border: 1,
              borderColor: 'border.default',
              bgcolor: 'translucent.100',
            }}
          >
            <Typography variant="h4" component="h3">
              Two baselines for comparison
            </Typography>
            <Typography variant="body1" sx={{ mt: jtSpacing.gap.sm, color: 'base.100' }}>
              The three geometry futures (Eco Machine, New Green Watershed, and Bolster and Fortify)
              keep the Base run’s flows and change only the shape of the Delta. They are compared
              with Base, a near-future “business as usual” condition that includes planned
              restoration at sites such as Little Egbert Tract and Prospect Island.
            </Typography>
            <Typography variant="body1" sx={{ mt: jtSpacing.gap.sm, color: 'base.100' }}>
              The two flow futures (A Tunnel and Calling on Reserves) keep the Base geometry and
              change the flows entering the Delta. They are compared with CalSim Base, a run on the
              same geometry driven by CalSim flows. Each future is read only against its own
              baseline, so the difference reflects the one thing that future changes.
            </Typography>
            <Typography variant="body1" sx={{ mt: jtSpacing.gap.sm, color: 'base.100' }}>
              Every run was repeated with sea level rise, and those runs are compared with the
              matching baseline that also has sea level rise. Outputs from every run are sampled at
              the same monitoring locations, so differences can be compared consistently through
              time and across regions.
            </Typography>
          </Box>
          <Box
            id="model-setup"
            sx={{
              scrollMarginTop: 110,
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
                The simulation runs from August 2018 through November 2020. August and September
                2018 are spin-up, letting the model settle, so results start in October 2018. That
                span covers contrasting hydrologic conditions: water year 2019 was wet, while water
                year 2020 was dry.
              </Typography>
            </Box>
            <Box
              component="section"
              aria-labelledby="monitoring-stations-title"
              sx={{
                gridColumn: { md: '1 / -1' },
                p: jtSpacing.component.lg,
                borderTop: 3,
                borderColor: 'primary.main',
              }}
            >
              <Typography id="monitoring-stations-title" variant="h4" component="h3">
                Monitoring stations
              </Typography>
              <Typography variant="body1" sx={{ mt: jtSpacing.gap.sm, color: 'base.100' }}>
                Model output is sampled at six stations spread across the Delta, from the south
                Delta export facilities to Suisun Marsh in the west and the Cache Slough Complex in
                the north.
              </Typography>
              <Box
                component="ul"
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                  columnGap: jtSpacing.gap.md,
                  rowGap: jtSpacing.gap.xs,
                  mt: jtSpacing.gap.md,
                  mb: 0,
                  pl: jtSpacing.component.md,
                  color: 'base.100',
                }}
              >
                {monitoringStations.map((station) => (
                  <Typography component="li" variant="body2" key={station}>
                    {station}
                  </Typography>
                ))}
              </Box>
            </Box>
          </Box>
          <Box id="what-is-modeled" sx={{ mt: jtSpacing.section.md, scrollMarginTop: 110 }}>
            <Typography variant="h3" component="h3">
              What is modeled
            </Typography>
            <Typography variant="body1" sx={{ mt: jtSpacing.gap.sm, color: 'base.100' }}>
              Each scenario run produces the same three water-quality outputs, allowing differences
              to be traced across both space and time.
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
          <Box
            id="scenario-implementations"
            sx={{
              mt: jtSpacing.section.md,
              scrollMarginTop: 110,
              borderBottom: 1,
              borderColor: 'border.default',
            }}
          >
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
            <Typography variant="body2" sx={{ mt: jtSpacing.gap.xs, color: 'primary.main' }}>
              {selectedImplementation.basis}
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

        {/* What the model shows: the simplified salinity view for any modeled future. */}
        <Box
          component="section"
          id="modeled-salinity"
          aria-labelledby="modeled-salinity-title"
          sx={[
            {
              gridColumn: { lg: '2 / -1' },
              gridRow: { lg: 2 },
              scrollMarginTop: 110,
              p: { xs: jtSpacing.component.lg, md: jtSpacing.component.xl },
            },
            (theme) => fullBleedBand(theme.palette.base[700]),
          ]}
        >
          <Typography id="modeled-salinity-title" variant="h2">
            Where does salinity change?
          </Typography>
          <Typography
            variant="body1"
            sx={{
              mt: jtSpacing.gap.md,
              mb: jtSpacing.section.sm,
              color: 'base.100',
              maxWidth: '78ch',
            }}
          >
            Pick an outflow variation or adaptation scenario to see which places get saltier or
            fresher than Business as Usual, and in which seasons and water years.
          </Typography>
          <ModeledSalinity />
        </Box>

        {/* Hand-off to the next step in the workflow: how the modeled futures are evaluated. */}
        <Box
          component="section"
          id="next-step"
          aria-labelledby="next-step-title"
          sx={[
            {
              gridColumn: { lg: '2 / -1' },
              gridRow: { lg: 3 },
              scrollMarginTop: 110,
              p: { xs: jtSpacing.component.lg, md: jtSpacing.component.xl },
            },
            (theme) => fullBleedBand(theme.palette.base[800]),
          ]}
        >
          <Typography id="next-step-title" variant="h2">
            Next: how are scenarios evaluated?
          </Typography>
          <Typography
            variant="body1"
            sx={{ mt: jtSpacing.gap.md, color: 'base.100', maxWidth: '78ch' }}
          >
            Modeled salinity, water age, and temperature feed five evaluation criteria. Explore the
            results in detail, or learn how each criterion evaluates the scenarios.
          </Typography>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={jtSpacing.gap.sm}
            sx={{ mt: jtSpacing.component.lg, alignItems: { xs: 'stretch', sm: 'center' } }}
          >
            <Button
              component={Link}
              to="/scenarios/evaluation"
              variant="contained"
              endIcon={<ArrowForwardIcon />}
            >
              How scenarios are evaluated
            </Button>
            <Button component={Link} to="/pages/regional-summary" variant="outlined">
              Read more in detail
            </Button>
          </Stack>
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
