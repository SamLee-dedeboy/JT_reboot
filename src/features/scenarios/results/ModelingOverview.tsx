import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined'
import ThermostatOutlinedIcon from '@mui/icons-material/ThermostatOutlined'
import WaterDropOutlinedIcon from '@mui/icons-material/WaterDropOutlined'
import WavesOutlinedIcon from '@mui/icons-material/WavesOutlined'
import { Box, Button, Stack, Tab, Tabs, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { csvParse } from 'd3'
import type { FeatureCollection, Point } from 'geojson'
import { useEffect, useState, type ReactNode } from 'react'
import { Layer, Marker, NavigationControl, Source } from 'react-map-gl/mapbox'
import { Link } from 'react-router-dom'
import BaseMap from '../../../map/BaseMap'
import Camera from '../../../map/layers/scenarios/Camera'
import Layers from '../../../map/layers/scenarios/Layers'
import Legend from '../../../map/layers/scenarios/Legend'
import { getConfig } from '../../../map/layers/scenarios/config'
import { jtSpacing, ranking } from '../../../theme'
import PageRail from '../../../ui/PageRail'
import { assetUrl } from '../../../utils/baseUrl'
import { SCENARIO_EXPLORER_MAP_STYLE } from '../../scenario-explorer/mapConfig'
import { SalinityResultsHeading } from '../../regional-summary/RegionalSalinitySummary'
import ModeledSalinity from './ModeledSalinity'
import {
  GateScheduleTable,
  GateTimeline,
  ReleasePeriods,
  ReleaseTimeline,
} from './OperationSchedules'
import { fullBleedBand } from './styles'

const overviewNavigation = [
  { id: 'how-modeled', label: 'How are scenarios modeled?' },
  { id: 'shared-baseline', label: 'Two baselines', indent: true },
  { id: 'model-setup', label: 'Where and when', indent: true },
  { id: 'what-is-modeled', label: 'What is modeled', indent: true },
  { id: 'scenario-implementations', label: 'How each future is built', indent: true },
  { id: 'modeled-salinity', label: 'Where salinity changes' },
  { id: 'next-step', label: 'How scenarios are evaluated' },
] as const

const heroParts = [
  {
    href: '#how-modeled',
    label: 'The method',
    description: 'The model, its baselines, and how each of the five futures is built.',
  },
  {
    href: '#modeled-salinity',
    label: 'The results',
    description: 'Pick a future and see which places get saltier or fresher, and when.',
  },
] as const

const implementationGroups = [
  { id: 'landscape', label: 'Changes to landscape' },
  { id: 'flow', label: 'Changes to water flow' },
] as const

const implementationDetails = [
  {
    id: 'eco',
    group: 'landscape',
    slug: 'eco-machine',
    label: 'Eco Machine',
    detailTitle: 'Two areas restored',
    lead: 'The model reshapes the landscape at two places.',
  },
  {
    id: 'ngw',
    group: 'landscape',
    slug: 'new-green-watershed',
    label: 'New Green Watershed',
    detailTitle: 'Six areas restored',
    lead: 'The model keeps both Eco Machine areas and adds four more.',
  },
  {
    id: 'bolster',
    group: 'landscape',
    slug: 'bolster-and-fortify',
    label: 'Bolster and Fortify',
    detailTitle: 'When the Franks Tract gates close',
    lead: 'Two operable gates at Franks Tract close three times in the run, limiting saltwater movement along the freshwater corridor.',
  },
  {
    id: 'tunnel',
    group: 'flow',
    slug: 'a-tunnel',
    label: 'A Tunnel',
    detailTitle: 'Run details',
    lead: 'Forthcoming',
  },
  {
    id: 'reserves',
    group: 'flow',
    slug: 'calling-on-reserves',
    label: 'Calling on Reserves',
    detailTitle: 'How Keswick releases change',
    lead: 'Each bar is one month’s release at Keswick, in cubic feet per second (cfs), compared with CalSim Base.',
  },
] as const

const ecoMachineAreas = [
  {
    name: 'Suisun Marsh',
    body: 'Managed wetlands become tidal wetlands, directing tidal energy toward the marsh.',
  },
  {
    name: 'Franks Tract',
    body: 'Landforms built inside the tract, following the Franks Tract Futures design, mostly block salty water from moving farther into the Delta.',
  },
] as const

const newGreenWatershedAreas = [
  { name: 'Suisun Marsh', inEcoMachine: true },
  { name: 'Franks Tract', inEcoMachine: true },
  { name: 'Dutch Slough', inEcoMachine: false },
  { name: 'Egbert Tract', inEcoMachine: false },
  { name: 'Hastings Tract', inEcoMachine: false },
  { name: 'Northern Cache Slough Complex', inEcoMachine: false },
] as const

const baselineRows = [
  {
    baseline: 'Base',
    description:
      'A near-future “business as usual” condition that includes planned restoration at sites such as Little Egbert Tract and Prospect Island.',
    changes: 'Landscape',
    group: 'landscape',
  },
  {
    baseline: 'CalSim Base',
    description:
      'A run on the same landscape—including planned restoration at sites such as Little Egbert Tract and Prospect Island—driven by CalSim flows.',
    changes: 'Water flow',
    group: 'flow',
  },
] as const

const baselineNotes = [
  {
    title: 'Sea level rise.',
    body: 'Runs were repeated with 2 feet of sea level rise, the only rise modeled, and those runs are compared with the matching baseline that also has 2 feet of sea level rise.',
    Icon: WavesOutlinedIcon,
  },
  {
    title: 'Same locations.',
    body: 'Outputs from every run are sampled at the same stations, so differences can be compared consistently through time and across regions.',
    Icon: PlaceOutlinedIcon,
  },
] as const

// Water age sits last: unlike the other two, it exists only as image snapshots.
const modeledOutputs = [
  {
    title: 'Salinity',
    body: 'Electrical conductivity (EC) shows how salty or fresh the water is and how the salinity boundary moves through the Delta.',
    availability: 'Across space and time',
    Icon: WaterDropOutlinedIcon,
  },
  {
    title: 'Water temperature',
    body: 'Modeled temperature helps identify when and where conditions may support or stress temperature-sensitive species.',
    availability: 'Across space and time',
    Icon: ThermostatOutlinedIcon,
  },
  {
    title: 'Water age',
    body: 'The time since water entered an area helps identify slow-moving conditions that may favor harmful algal blooms.',
    availability: 'Image snapshots only',
    Icon: ImageOutlinedIcon,
  },
] as const

/** The simulation's periods, sized by their length in days. */
const simulationPeriods = [
  { days: 61, label: 'Spin-up', start: 'Aug 2018', tone: 'spinUp' },
  { days: 365, label: 'Wet · WY 2019', start: 'Oct 2018', tone: 'base.400' },
  { days: 366, label: 'Dry · WY 2020', start: 'Oct 2019', tone: 'base.500' },
  { days: 59, label: 'Critical dry', start: 'Oct–Nov 2020', tone: 'base.600' },
] as const

const simulationColumns = simulationPeriods.map(({ days }) => `${days}fr`).join(' ')

const GOLDEN_GATE = { longitude: -122.478, latitude: 37.82 }

/** Frames the Bay and the Delta together, from the Golden Gate to the eastern stations. */
const stationMapBounds: [[number, number], [number, number]] = [
  [-122.62, 37.42],
  [-121.18, 38.82],
]

const sectionSx = {
  scrollMarginTop: 110,
  py: { xs: jtSpacing.section.sm, md: jtSpacing.section.md },
  borderTop: 1,
  borderColor: 'border.default',
}

type OverviewSectionId = (typeof overviewNavigation)[number]['id']
type Implementation = (typeof implementationDetails)[number]
type ImplementationId = Implementation['id']

/** The hero's two parts of this page, in the ranking hero's card style. */
export function OverviewParts() {
  return (
    <Box
      component="nav"
      aria-label="Parts of this page"
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: 'minmax(0, 1fr)', sm: ranking.viewCard.columns },
        gap: jtSpacing.gap.md,
        pt: jtSpacing.gap.sm,
      }}
    >
      {heroParts.map((part, index) => (
        <Box
          component="a"
          key={part.href}
          href={part.href}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: jtSpacing.gap.sm,
            px: jtSpacing.component.lg,
            py: jtSpacing.component.md,
            border: 1,
            borderColor: 'border.strong',
            bgcolor: 'translucent.darkSurface',
            color: 'common.white',
            textDecoration: 'none',
            '&:hover, &:focus-visible': {
              bgcolor: 'translucent.primaryGreen',
              borderColor: 'primary.main',
              outline: 'none',
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: jtSpacing.gap.xs }}>
            <Typography component="span" variant="chartTitle" sx={{ color: 'primary.main' }}>
              {String(index + 1).padStart(2, '0')}
            </Typography>
            <Typography component="span" variant="chartTitle">
              {part.label}
            </Typography>
            <ArrowForwardRoundedIcon fontSize="small" sx={{ ml: 'auto' }} />
          </Box>
          <Typography variant="body2">{part.description}</Typography>
        </Box>
      ))}
    </Box>
  )
}

function SubsectionHeading({
  id,
  title,
  children,
}: {
  id: string
  title: string
  children?: ReactNode
}) {
  return (
    <>
      <Typography id={id} variant="h3" component="h3">
        {title}
      </Typography>
      {children && (
        <Typography
          variant="body1"
          sx={{
            mt: jtSpacing.gap.sm,
            color: 'base.100',
            maxWidth: jtSpacing.paragraphMaxWidth.default,
          }}
        >
          {children}
        </Typography>
      )}
    </>
  )
}

/** Comparison table: each baseline, what its futures change, and the futures themselves. */
function BaselineTable({ onSelectFuture }: { onSelectFuture: (id: ImplementationId) => void }) {
  const headSx = { typography: 'columnHead', pb: jtSpacing.gap.sm, textAlign: 'left' }
  const cellSx = { py: jtSpacing.component.lg, pr: jtSpacing.gap.lg, verticalAlign: 'top' }

  return (
    <Box sx={{ mt: jtSpacing.component.lg, overflowX: 'auto', overflowY: 'hidden' }}>
      <Box
        component="table"
        sx={{ width: '100%', minWidth: 640, borderCollapse: 'collapse', textAlign: 'left' }}
      >
        <thead>
          <tr>
            <Box component="th" scope="col" sx={{ ...headSx, width: '44%' }}>
              Compared with
            </Box>
            <Box component="th" scope="col" sx={{ ...headSx, width: '18%' }}>
              Changes
            </Box>
            <Box component="th" scope="col" sx={headSx}>
              Futures
            </Box>
          </tr>
        </thead>
        <tbody>
          {baselineRows.map((row) => (
            <Box
              component="tr"
              key={row.baseline}
              sx={{ borderTop: 1, borderColor: 'border.strong' }}
            >
              <Box component="th" scope="row" sx={{ ...cellSx, textAlign: 'left' }}>
                <Typography variant="h4" component="span" sx={{ display: 'block' }}>
                  {row.baseline}
                </Typography>
                <Typography variant="body2" component="span" sx={{ display: 'block', mt: 1 }}>
                  {row.description}
                </Typography>
              </Box>
              <Box component="td" sx={cellSx}>
                <Typography variant="cardTitle" component="span">
                  {row.changes}
                </Typography>
              </Box>
              <Box component="td" sx={{ ...cellSx, pr: 0 }}>
                <Stack direction="row" useFlexGap spacing={1} sx={{ flexWrap: 'wrap' }}>
                  {implementationDetails
                    .filter(({ group }) => group === row.group)
                    .map(({ id, label }) => (
                      <Button
                        key={id}
                        variant="outlined"
                        onClick={() => onSelectFuture(id)}
                        sx={{ color: 'common.white', borderColor: 'base.300' }}
                      >
                        {label}
                      </Button>
                    ))}
                </Stack>
              </Box>
            </Box>
          ))}
        </tbody>
      </Box>
    </Box>
  )
}

/** Every model output station, on a map framed from the Golden Gate boundary to the Delta. */
function StationMap() {
  const theme = useTheme()
  const [stations, setStations] = useState<FeatureCollection<Point> | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    fetch(assetUrl('/data/salinity/scenario-explorer/all_386_unique_stations.csv'), {
      signal: controller.signal,
    })
      .then((response) => response.text())
      .then((text) =>
        setStations({
          type: 'FeatureCollection',
          features: csvParse(text).map((row) => ({
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Point',
              coordinates: [Number(row.longitude), Number(row.latitude)],
            },
          })),
        }),
      )
      .catch((reason: unknown) => {
        if (reason instanceof DOMException && reason.name === 'AbortError') return
        setStations(null)
      })
    return () => controller.abort()
  }, [])

  return (
    <Box
      role="img"
      aria-label="Map of the San Francisco Bay and Delta showing the 386 model stations and the Golden Gate salinity boundary."
      sx={{
        position: 'relative',
        height: { xs: 420, md: 560 },
        overflow: 'hidden',
        border: 1,
        borderColor: 'border.default',
        bgcolor: 'base.900',
        '& .mapboxgl-ctrl-bottom-left': { display: 'none' },
      }}
    >
      <BaseMap
        mapStyleUrl={SCENARIO_EXPLORER_MAP_STYLE}
        initialViewState={{ longitude: -121.9, latitude: 38.1, zoom: 8.4 }}
        interactive={false}
        attributionControl={false}
      >
        <Camera bounds={stationMapBounds} />
        {stations && (
          <Source id="modeling-stations" type="geojson" data={stations}>
            <Layer
              id="modeling-stations-points"
              type="circle"
              paint={{
                'circle-radius': 2.5,
                'circle-color': theme.palette.common.white,
                'circle-opacity': 0.85,
              }}
            />
          </Source>
        )}
        <Marker {...GOLDEN_GATE} anchor="left">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                bgcolor: 'primary.main',
                ml: -0.75,
              }}
            />
            <Typography
              variant="meta"
              sx={{
                px: 1,
                py: 0.5,
                bgcolor: 'translucent.800',
                color: 'common.white',
                whiteSpace: 'nowrap',
              }}
            >
              Golden Gate salinity boundary
            </Typography>
          </Box>
        </Marker>
      </BaseMap>
    </Box>
  )
}

/** The simulation period as one bar, with the point where results begin marked. */
function SimulationBar() {
  return (
    <Box sx={{ mt: jtSpacing.component.lg, overflowX: 'auto', overflowY: 'hidden' }}>
      <Box sx={{ minWidth: 640 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: simulationColumns }}>
          <Typography
            variant="columnHead"
            sx={{
              gridColumn: 2,
              pl: 1,
              pb: 1,
              color: 'primary.main',
              borderLeft: 2,
              borderColor: 'primary.main',
            }}
          >
            Results start
          </Typography>
        </Box>
        <Box
          role="img"
          aria-label="Simulation timeline: spin-up in August and September 2018, wet water year 2019, dry water year 2020, then critical dry October to November 2020."
          sx={{ display: 'grid', gridTemplateColumns: simulationColumns, minHeight: 58 }}
        >
          {simulationPeriods.map((period) => (
            <Box
              key={period.label}
              sx={[
                {
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  px: 0.5,
                  textAlign: 'center',
                },
                period.tone === 'spinUp'
                  ? (theme) => ({
                      backgroundImage: `repeating-linear-gradient(135deg, ${theme.palette.translucent[400]} 0 5px, transparent 5px 10px)`,
                    })
                  : { bgcolor: period.tone },
              ]}
            >
              <Typography
                variant={period.days > 100 ? 'cardTitle' : 'meta'}
                sx={{ color: 'common.white' }}
              >
                {period.label}
              </Typography>
            </Box>
          ))}
        </Box>
        <Box
          aria-hidden="true"
          sx={{ display: 'grid', gridTemplateColumns: simulationColumns, mt: 0.75 }}
        >
          {simulationPeriods.map((period, index) => (
            <Typography
              key={period.start}
              variant="meta"
              sx={{
                color: 'base.100',
                whiteSpace: 'nowrap',
                justifySelf: index === simulationPeriods.length - 1 ? 'end' : 'start',
              }}
            >
              {period.start}
            </Typography>
          ))}
        </Box>
      </Box>
    </Box>
  )
}

function ScenarioMap({ implementation }: { implementation: Implementation }) {
  const mapConfig = getConfig(implementation.slug)
  const bounds = mapConfig.bounds.delta
  // Calling on Reserves' river and dam sit upstream of the Delta, in the statewide layers.
  const visibilityScope = implementation.id === 'reserves' ? 'statewide' : 'delta'

  return (
    <Box
      aria-label={`Interactive map for ${implementation.label}`}
      sx={{
        height: { xs: 420, lg: 620 },
        position: 'relative',
        overflow: 'hidden',
        border: 1,
        borderColor: 'border.default',
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
        <Layers
          scenarioSlug={implementation.slug}
          showAdaptationLayers
          visibilityScope={visibilityScope}
        />
        {mapConfig.showNavigationControl && (
          <NavigationControl position="bottom-right" showCompass={false} />
        )}
      </BaseMap>
      <Legend
        scenarioSlug={implementation.slug}
        visibilityScope={visibilityScope}
        visible
        selectedHabitatType={null}
      />
    </Box>
  )
}

/** Restoration already counted in the baselines, so it is not a change in either future. */
function BaselineRestorationNote() {
  return (
    <Box sx={{ mt: jtSpacing.component.lg }}>
      <Typography variant="columnHead" component="p">
        Already in the baseline
      </Typography>
      <Typography variant="body2" sx={{ mt: jtSpacing.gap.xs }}>
        Planned restoration at Little Egbert Tract and Prospect Island is part of Base, so it is not
        counted as a change here.
      </Typography>
    </Box>
  )
}

function EcoMachineAreas() {
  return (
    <>
      <Box sx={{ mt: jtSpacing.component.md, borderTop: 1, borderColor: 'border.strong' }}>
        {ecoMachineAreas.map(({ name, body }) => (
          <Box
            component="article"
            key={name}
            sx={{ py: jtSpacing.gap.md, borderBottom: 1, borderColor: 'border.default' }}
          >
            <Typography variant="cardTitle" component="h5">
              {name}
            </Typography>
            <Typography variant="body2" sx={{ mt: jtSpacing.gap.xs }}>
              {body}
            </Typography>
          </Box>
        ))}
      </Box>
      <BaselineRestorationNote />
    </>
  )
}

function NewGreenWatershedAreas() {
  const headSx = { typography: 'columnHead', pb: jtSpacing.gap.sm, textAlign: 'center' }
  const cellSx = { py: jtSpacing.gap.sm, textAlign: 'center', typography: 'body2' }

  return (
    <>
      <Box
        component="table"
        sx={{ width: '100%', mt: jtSpacing.component.md, borderCollapse: 'collapse' }}
      >
        <thead>
          <tr>
            <Box component="th" scope="col" sx={{ ...headSx, textAlign: 'left' }}>
              Restored area
            </Box>
            <Box component="th" scope="col" sx={{ ...headSx, width: '20%' }}>
              Eco Machine
            </Box>
            <Box component="th" scope="col" sx={{ ...headSx, width: '20%' }}>
              New Green Watershed
            </Box>
          </tr>
        </thead>
        <tbody>
          {newGreenWatershedAreas.map(({ name, inEcoMachine }) => (
            <Box component="tr" key={name} sx={{ borderTop: 1, borderColor: 'border.default' }}>
              <Box
                component="th"
                scope="row"
                sx={{ py: jtSpacing.gap.sm, pr: jtSpacing.gap.sm, textAlign: 'left' }}
              >
                <Typography variant="cardTitle" component="span">
                  {name}
                </Typography>
              </Box>
              <Box
                component="td"
                sx={{ ...cellSx, color: inEcoMachine ? 'common.white' : 'base.200' }}
              >
                {inEcoMachine ? 'Yes' : 'No'}
              </Box>
              <Box
                component="td"
                sx={{ ...cellSx, color: inEcoMachine ? 'common.white' : 'primary.main' }}
              >
                {inEcoMachine ? 'Yes' : 'Added'}
              </Box>
            </Box>
          ))}
        </tbody>
      </Box>
      <BaselineRestorationNote />
    </>
  )
}

/** What each future changes: its restored areas or operating schedule, and its map. */
function ImplementationPanel({ implementation }: { implementation: Implementation }) {
  const { id, detailTitle, lead } = implementation
  const hasTimeline = id === 'bolster' || id === 'reserves'

  const heading = (
    <>
      <Typography variant="h4" component="h4">
        {detailTitle}
      </Typography>
      <Typography
        variant="body1"
        sx={{
          mt: jtSpacing.gap.sm,
          color: 'base.50',
          maxWidth: jtSpacing.paragraphMaxWidth.default,
        }}
      >
        {lead}
      </Typography>
    </>
  )

  return (
    <Box sx={{ mt: jtSpacing.component.lg }}>
      {hasTimeline && (
        <Box sx={{ mb: jtSpacing.component.lg }}>
          {heading}
          <Box sx={{ mt: jtSpacing.component.md }}>
            {id === 'bolster' ? <GateTimeline /> : <ReleaseTimeline />}
          </Box>
        </Box>
      )}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'minmax(0, 1fr)', lg: 'repeat(2, minmax(0, 1fr))' },
          gap: jtSpacing.gap.xl,
          alignItems: 'start',
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          {!hasTimeline && heading}
          {id === 'eco' && <EcoMachineAreas />}
          {id === 'ngw' && <NewGreenWatershedAreas />}
          {id === 'bolster' && <GateScheduleTable />}
          {id === 'reserves' && <ReleasePeriods />}
        </Box>
        <ScenarioMap implementation={implementation} />
      </Box>
    </Box>
  )
}

export default function ModelingOverview() {
  const [selectedImplementationId, setSelectedImplementationId] = useState<ImplementationId>('eco')
  const [activeSection, setActiveSection] = useState<OverviewSectionId>('how-modeled')
  const selectedImplementation =
    implementationDetails.find(({ id }) => id === selectedImplementationId) ??
    implementationDetails[0]

  const showFuture = (id: ImplementationId) => {
    setSelectedImplementationId(id)
    document.getElementById('scenario-implementations')?.scrollIntoView({ behavior: 'smooth' })
  }

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
        gridTemplateColumns: { xs: 'minmax(0, 1fr)', lg: 'minmax(180px, 220px) minmax(0, 1fr)' },
        columnGap: { lg: jtSpacing.section.md },
        alignItems: 'start',
      }}
    >
      <PageRail
        items={[...overviewNavigation]}
        ariaLabel="Modeling page sections"
        activeItemId={activeSection}
        onNavigate={(id) => setActiveSection(id as OverviewSectionId)}
        sx={{
          gridColumn: { lg: 1 },
          gridRow: { lg: '1 / span 3' },
          pt: { xs: jtSpacing.component.lg, md: jtSpacing.section.md },
        }}
      />

      {/* The method: what the model is, then one distinct block per question. */}
      <Box component="div" sx={{ gridColumn: { lg: 2 }, gridRow: { lg: 1 }, minWidth: 0 }}>
        <Box
          component="section"
          id="how-modeled"
          aria-labelledby="how-modeled-title"
          sx={{ scrollMarginTop: 110, py: { xs: jtSpacing.section.sm, md: jtSpacing.section.md } }}
        >
          <Typography id="how-modeled-title" variant="h2">
            How are scenarios modeled?
          </Typography>
          <Typography
            variant="bodyLarge"
            component="p"
            sx={{ mt: jtSpacing.gap.lg, maxWidth: '62ch', color: 'base.50' }}
          >
            We used the two-dimensional RMA Bay-Delta hydrodynamic and water-quality model to test
            five futures: three that change the Delta’s landscape and two that change the water
            flowing into it. Every run tracks salinity, water temperature, and water age, and runs
            were also repeated with 2 feet of sea level rise.
          </Typography>
        </Box>

        <Box
          component="section"
          id="shared-baseline"
          aria-labelledby="shared-baseline-title"
          sx={sectionSx}
        >
          <SubsectionHeading id="shared-baseline-title" title="Two baselines for comparison">
            Each future is read only against its own baseline, so the difference reflects the one
            thing that future changes.
          </SubsectionHeading>
          <BaselineTable onSelectFuture={showFuture} />
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'repeat(2, minmax(0, 1fr))' },
              gap: jtSpacing.gap.xl,
              pt: jtSpacing.component.lg,
              borderTop: 1,
              borderColor: 'border.strong',
            }}
          >
            {baselineNotes.map(({ title, body, Icon }) => (
              <Stack key={title} direction="row" spacing={jtSpacing.gap.sm}>
                <Icon sx={{ color: 'base.200' }} />
                <Typography variant="body2">
                  <Box component="strong" sx={{ color: 'common.white' }}>
                    {title}
                  </Box>{' '}
                  {body}
                </Typography>
              </Stack>
            ))}
          </Box>
        </Box>

        <Box
          component="section"
          id="model-setup"
          aria-labelledby="model-setup-title"
          sx={sectionSx}
        >
          <SubsectionHeading id="model-setup-title" title="Where and when" />
          <Box
            sx={{
              mt: jtSpacing.component.lg,
              display: 'grid',
              gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'minmax(0, 5fr) minmax(0, 4fr)' },
              gap: jtSpacing.gap.xl,
              alignItems: 'start',
            }}
          >
            <StationMap />
            <Stack spacing={jtSpacing.gap.xl}>
              <Box>
                <Typography variant="h4" component="h4">
                  Spatial boundary
                </Typography>
                <Typography variant="body2" sx={{ mt: jtSpacing.gap.sm }}>
                  The model covers the San Francisco Bay–Sacramento–San Joaquin Delta system. Its
                  salinity boundary is at the Golden Gate, where ocean salinity enters the model.
                  From there, salinity is tracked through channels, restored areas, and stations as
                  electrical conductivity (EC).
                </Typography>
              </Box>
              <Box>
                <Typography variant="h4" component="h4">
                  Stations
                </Typography>
                <Typography variant="body2" sx={{ mt: jtSpacing.gap.sm }}>
                  Model output is sampled at 386 stations spread across the Bay and the Delta.
                </Typography>
              </Box>
            </Stack>
          </Box>
          <Box sx={{ mt: jtSpacing.section.sm }}>
            <Typography variant="h4" component="h4">
              Simulation time
            </Typography>
            <Typography
              variant="body2"
              sx={{ mt: jtSpacing.gap.sm, maxWidth: jtSpacing.paragraphMaxWidth.default }}
            >
              The simulation runs from August 2018 through November 2020. August and September 2018
              are spin-up, letting the model settle, so results start in October 2018. That span
              covers contrasting hydrologic conditions: water year 2019 was wet, while water year
              2020 was dry.
            </Typography>
            <SimulationBar />
          </Box>
        </Box>

        <Box
          component="section"
          id="what-is-modeled"
          aria-labelledby="what-is-modeled-title"
          sx={sectionSx}
        >
          <SubsectionHeading id="what-is-modeled-title" title="What is modeled">
            Each scenario run produces three water-quality outputs. Salinity and water temperature
            can be traced across both space and time; water age is available as image snapshots.
          </SubsectionHeading>
          <Box
            sx={{
              mt: jtSpacing.component.lg,
              display: 'grid',
              gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'repeat(3, minmax(0, 1fr))' },
              gap: jtSpacing.gap.md,
            }}
          >
            {modeledOutputs.map(({ title, body, availability, Icon }) => (
              <Stack
                component="article"
                key={title}
                spacing={jtSpacing.gap.sm}
                sx={{
                  p: jtSpacing.component.lg,
                  bgcolor: 'translucent.50',
                  border: 1,
                  borderColor: 'border.default',
                }}
              >
                <Icon sx={{ color: 'common.white' }} fontSize="large" />
                <Typography variant="h4" component="h4">
                  {title}
                </Typography>
                <Typography variant="body2">{body}</Typography>
                <Typography
                  variant="columnHead"
                  sx={{ mt: 'auto !important', pt: jtSpacing.gap.sm, color: 'base.200' }}
                >
                  {availability}
                </Typography>
              </Stack>
            ))}
          </Box>
        </Box>

        <Box
          component="section"
          id="scenario-implementations"
          aria-labelledby="scenario-implementations-title"
          sx={sectionSx}
        >
          <SubsectionHeading id="scenario-implementations-title" title="How each future is built" />
          <Box
            sx={{
              mt: jtSpacing.component.lg,
              display: 'grid',
              gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: '3fr 2fr' },
              columnGap: jtSpacing.gap.xl,
              rowGap: jtSpacing.gap.md,
              borderBottom: 1,
              borderColor: 'border.default',
            }}
          >
            {implementationGroups.map((group) => {
              const futures = implementationDetails.filter((future) => future.group === group.id)
              return (
                <Box key={group.id} sx={{ minWidth: 0 }}>
                  <Typography variant="columnHead" component="p">
                    {group.label}
                  </Typography>
                  <Tabs
                    value={
                      selectedImplementation.group === group.id ? selectedImplementationId : false
                    }
                    onChange={(_, value: ImplementationId) => setSelectedImplementationId(value)}
                    aria-label={group.label}
                    variant="scrollable"
                    scrollButtons={false}
                  >
                    {futures.map(({ id, label }) => (
                      <Tab key={id} value={id} label={label} />
                    ))}
                  </Tabs>
                </Box>
              )
            })}
          </Box>
          <ImplementationPanel implementation={selectedImplementation} />
        </Box>
      </Box>

      {/* What the model shows: the simplified salinity view for any modeled future. */}
      <Box
        component="section"
        id="modeled-salinity"
        aria-labelledby="modeled-salinity-title"
        sx={[
          {
            gridColumn: { lg: 2 },
            gridRow: { lg: 2 },
            minWidth: 0,
            scrollMarginTop: 110,
            py: { xs: jtSpacing.section.sm, md: jtSpacing.section.md },
          },
          (theme) => fullBleedBand(theme.palette.base[700]),
        ]}
      >
        <SalinityResultsHeading id="modeled-salinity-title" />
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
        <ModeledSalinity showHeading={false} headingId="modeled-salinity-title" />
      </Box>

      {/* Hand-off to the next step in the workflow: how the modeled futures are evaluated. */}
      <Box
        component="section"
        id="next-step"
        aria-labelledby="next-step-title"
        sx={[
          {
            gridColumn: { lg: 2 },
            gridRow: { lg: 3 },
            minWidth: 0,
            scrollMarginTop: 110,
            py: { xs: jtSpacing.section.sm, md: jtSpacing.section.md },
          },
          (theme) => fullBleedBand(theme.palette.base[900]),
        ]}
      >
        <Typography id="next-step-title" variant="h2">
          How are scenarios evaluated?
        </Typography>
        <Typography
          variant="body1"
          sx={{ mt: jtSpacing.gap.md, color: 'base.100', maxWidth: '78ch' }}
        >
          Salinity results show where and when the water changes, not what those changes mean. The
          same shift can play out differently for ecology, recreation, environmental justice, the
          economy, and eco-cultural values, so each future still has to be evaluated from all five
          perspectives.
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
        </Stack>
      </Box>
    </Box>
  )
}
