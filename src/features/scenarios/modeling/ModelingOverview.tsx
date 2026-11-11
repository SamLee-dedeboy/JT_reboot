import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined'
import WavesOutlinedIcon from '@mui/icons-material/WavesOutlined'
import { Box, Button, Stack, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { csvParse } from 'd3'
import type { FeatureCollection, Point } from 'geojson'
import { useEffect, useState, type ReactNode } from 'react'
import { Layer, Marker, NavigationControl, Source } from 'react-map-gl/mapbox'
import { Link } from 'react-router-dom'
import BaseMap from '../../../map/BaseMap'
import Camera from '../../../map/scenarios/Camera'
import Layers from '../../../map/scenarios/Layers'
import { getConfig } from '../../../map/scenarios/config'
import { jtSpacing, map, navigation } from '../../../theme'
import PageRail from '../../../ui/PageRail'
import { assetUrl } from '../../../utils/baseUrl'
import { DELTA_START_VIEW, MODELING_CAMERAS } from '../../../map/cameras'
import { SALINITY_MAP_STYLE } from '../../../map/mapStyles'
import { SalinityResultsHeading } from '../../regional-summary/RegionalSalinitySummary'
import ChoiceCards from './ChoiceCards'
import ModeledSalinity from './ModeledSalinity'
import { GateTimeline, ReleaseTimeline } from './OperationSchedules'
import { fullBleedBand, waterYearColor } from '../styles'
import { scenarioName, scenarioSlug } from '../../../content/names'

const overviewNavigation = [
  { id: 'how-modeled', label: 'How are scenarios modeled?' },
  { id: 'shared-baseline', label: 'Three baselines', indent: true },
  { id: 'outflow-variations', label: 'Outflow variations', indent: true },
  { id: 'adaptation-scenarios', label: 'Adaptation scenarios', indent: true },
  { id: 'modeled-salinity', label: 'Where salinity changes' },
  { id: 'next-step', label: 'How scenarios are evaluated' },
] as const

const outflowVariations = [
  { id: 'plus30', group: 'outflow', label: '+30% Delta outflow' },
  { id: 'minus10', group: 'outflow', label: '−10% Delta outflow' },
] as const

const implementationDetails = [
  {
    id: 'eco',
    group: 'landscape',
    slug: scenarioSlug('em'),
    label: scenarioName('em', 'scenarioStory'),
    detailTitle: 'Two areas restored',
    lead: 'The model reshapes the landscape at two places.',
  },
  {
    id: 'ngw',
    group: 'landscape',
    slug: scenarioSlug('ngw'),
    label: scenarioName('ngw', 'scenarioStory'),
    detailTitle: 'Six areas restored',
    lead: 'The model keeps both Eco Machine areas and adds four more.',
  },
  {
    id: 'bolster',
    group: 'landscape',
    slug: scenarioSlug('bf'),
    label: scenarioName('bf', 'scenarioStory'),
    detailTitle: 'When the Franks Tract gates close',
    lead: 'Two operable gates at Franks Tract close three times in the run, limiting saltwater movement along the freshwater corridor.',
  },
  {
    id: 'tunnel',
    group: 'flow',
    slug: scenarioSlug('tunnel'),
    label: scenarioName('tunnel', 'scenarioStory'),
    detailTitle: 'A new route beneath the Delta',
    lead: 'A Tunnel is based on the Bethany Reservoir Alignment of the proposed Delta Conveyance Project.',
  },
  {
    id: 'reserves',
    group: 'flow',
    slug: scenarioSlug('cor'),
    label: scenarioName('cor', 'scenarioStory'),
    detailTitle: 'How Shasta Dam releases change',
    lead: 'Each bar is one month’s release at Shasta Dam, in cubic feet per second (cfs), compared with CalSim Baseline. Shading marks periods of higher flow above the line and lower flow below it.',
  },
] as const

const implementationGroups = [
  {
    id: 'landscape',
    title: 'Changes to landscape, compared with the Baseline',
    options: implementationDetails.filter(({ group }) => group === 'landscape'),
  },
  {
    id: 'flow',
    title: 'Changes to water flow, compared with CalSim Baseline',
    options: implementationDetails.filter(({ group }) => group === 'flow'),
  },
]

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
    baseline: scenarioName('hist'),
    description: 'Current conditions modeled in SCHISM.',
    model: 'SCHISM',
    changes: ['Amount of Delta outflow', 'through changes in exports'],
    group: 'outflow',
    scenarios: '2 outflow variations',
  },
  {
    baseline: 'Baseline',
    description:
      'Current conditions modeled in RMA, including planned restoration at sites such as Little Egbert Tract and Prospect Island.',
    model: 'RMA',
    changes: ['Landscape'],
    group: 'landscape',
    scenarios: '3 adaptation scenarios',
  },
  {
    baseline: 'CalSim Baseline',
    description:
      'Current conditions modeled in RMA on the same landscape as Baseline, driven by CalSim flows.',
    model: 'RMA',
    changes: ['Water flow'],
    group: 'flow',
    scenarios: '2 adaptation scenarios',
  },
] as const

const baselineNotes = [
  {
    title: 'Sea level rise.',
    body: 'RMA runs were repeated with 2 feet of sea level rise, the only rise modeled, and those runs are compared with the matching baseline that also has 2 feet of sea level rise. The SCHISM outflow runs have no sea level rise version.',
    Icon: WavesOutlinedIcon,
  },
  {
    title: 'Same locations within a model.',
    body: 'Each scenario and its baseline are compared at the same stations. RMA and SCHISM use different station sets, shown below.',
    Icon: PlaceOutlinedIcon,
  },
] as const

// Water age sits last: unlike the other two, it exists only as snapshots, and only in RMA.
const modeledOutputs = [
  {
    title: 'Salinity',
    body: 'Electrical conductivity (EC) shows how salty or fresh the water is and how the salinity boundary moves through the Delta.',
  },
  {
    title: 'Water temperature',
    body: 'Modeled temperature helps identify when and where conditions may support or stress temperature-sensitive species.',
  },
  {
    title: 'Water age',
    body: 'The time since water entered an area helps identify slow-moving conditions that may favor harmful algal blooms.',
    availability: 'We only have snapshots of water age, not a full time series.',
    adaptationOnly: true,
  },
] as const

/** Each model's run on its own axis, sized in days from the start of spin-up. */
const simulationTimelines = {
  schism: {
    ariaLabel:
      'SCHISM timeline: spin-up from August 11 to September 30, 2020, then critical water year 2021 and the start of critical water year 2022, ending January 1, 2022.',
    days: 508,
    spinUpLabel: 'Spin-up, Aug 11–Sep 30, 2020',
    // Too narrow to hold its own label, so the last period is named above it.
    endLabel: 'Critical water year 2022',
    periods: [
      { days: 51, tone: 'spinUp' },
      { days: 365, label: 'Critical water year 2021', tone: 'critical' },
      { days: 92, tone: 'critical', divided: true },
    ],
    ticks: [
      { day: 51, label: 'Oct 2020' },
      { day: 416, label: 'Oct 2021' },
      { day: 508, label: 'Jan 2022' },
    ],
  },
  rma: {
    ariaLabel:
      'RMA timeline: spin-up in August and September 2018, wet water year 2019, dry water year 2020, then critical water year 2021 for October and November 2020.',
    days: 853,
    spinUpLabel: 'Spin-up, Aug–Sep 2018',
    endLabel: 'Critical water year 2021, Oct–Nov 2020',
    periods: [
      { days: 61, tone: 'spinUp' },
      { days: 365, label: 'Wet water year 2019', tone: 'wet' },
      { days: 366, label: 'Dry water year 2020', tone: 'dry' },
      { days: 61, tone: 'critical', divided: true },
    ],
    ticks: [
      { day: 61, label: 'Oct 2018' },
      { day: 426, label: 'Oct 2019' },
      { day: 792, label: 'Oct 2020' },
    ],
  },
} as const

const GOLDEN_GATE = { longitude: -122.478, latitude: 37.82 }

type MapLabelData = {
  text: string
  longitude: number
  latitude: number
  side?: 'left' | 'right'
  /** Marks a place added by this scenario, in green. */
  added?: boolean
  /** Leaves out the dot where the map already draws the feature. */
  bare?: boolean
  /** Extra space between the place and its label, in pixels. */
  offset?: number
}

/**
 * Suisun Marsh and Franks Tract are drawn as areas, and the Lindsey-Cache Slough area is drawn around
 * three of the additions. The four areas New Green Watershed adds have no mapped boundaries of their
 * own yet, so each is marked at its approximate location.
 */
const ecoMachinePlaces: MapLabelData[] = [
  { text: 'Suisun Marsh', longitude: -121.99, latitude: 38.15 },
  { text: 'Franks Tract', longitude: -121.615, latitude: 38.042 },
]

// Green marks what a scenario adds: these two are new in Eco Machine, and carried over in New Green Watershed.
const ecoMachineLabels = ecoMachinePlaces.map((place) => ({ ...place, added: true }))

const newGreenWatershedLabels: MapLabelData[] = [
  ...ecoMachinePlaces,
  { text: 'Dutch Slough', longitude: -121.675, latitude: 38.005, side: 'right', added: true },
  { text: 'Egbert Tract', longitude: -121.665, latitude: 38.265, added: true },
  { text: 'Hastings Tract', longitude: -121.76, latitude: 38.272, side: 'right', added: true },
  {
    text: 'Northern Cache Slough Complex',
    longitude: -121.72,
    latitude: 38.325,
    side: 'right',
    added: true,
  },
]

const BOLSTER_LABEL_OFFSET = 16

/** The gates sit at the centers of their footprints in bolster-and-fortify/operable-gates.geojson. */
const bolsterLabels: MapLabelData[] = [
  {
    text: 'Operable gate',
    longitude: -121.58435,
    latitude: 38.06291,
    added: true,
    offset: BOLSTER_LABEL_OFFSET,
  },
  {
    text: 'Reconstructed levees',
    longitude: -121.582,
    latitude: 38.047,
    bare: true,
    offset: BOLSTER_LABEL_OFFSET,
  },
  {
    text: 'Operable gate',
    longitude: -121.58494,
    latitude: 38.03057,
    added: true,
    offset: BOLSTER_LABEL_OFFSET,
  },
]

const tunnelLabels: MapLabelData[] = [
  {
    text: 'Northern Delta intakes',
    longitude: -121.535,
    latitude: 38.363,
    side: 'right',
    bare: true,
  },
  { text: 'Tunnel alignment', longitude: -121.42, latitude: 38.117, bare: true },
  { text: 'Bethany pumping facilities', longitude: -121.56, latitude: 37.79, bare: true },
]

/** The same text width as the team methodology pages. */
const textMaxWidth = '100ch'

const sectionSx = {
  scrollMarginTop: 110,
  py: { xs: jtSpacing.section.sm, md: jtSpacing.section.md },
  borderTop: 1,
  borderColor: 'border.default',
}

type OverviewSectionId = (typeof overviewNavigation)[number]['id']
type Implementation = (typeof implementationDetails)[number]
type ImplementationId = Implementation['id']
type Future = (typeof outflowVariations)[number] | Implementation
type StationModel = keyof typeof simulationTimelines

/** A key phrase picked out of running text, in bold primary blue. */
function KeyPhrase({ children }: { children: ReactNode }) {
  return (
    <Box component="strong" sx={{ color: 'secondary.main' }}>
      {children}
    </Box>
  )
}

function SubsectionHeading({
  id,
  title,
  color,
  children,
}: {
  id: string
  title: ReactNode
  color?: string
  children?: ReactNode
}) {
  return (
    <>
      <Typography id={id} variant="h3" component="h3" sx={{ color }}>
        {title}
      </Typography>
      {children && (
        <Typography
          variant="body1"
          sx={{
            mt: jtSpacing.gap.sm,
            color: 'base.100',
            maxWidth: textMaxWidth,
          }}
        >
          {children}
        </Typography>
      )}
    </>
  )
}

/** Comparison table: each baseline, its model, what its scenarios change, and the scenarios. */
function BaselineTable({ onSelectFuture }: { onSelectFuture: (future: Future) => void }) {
  const headSx = { typography: 'columnHead', pb: jtSpacing.gap.sm, textAlign: 'left' }
  const cellSx = { py: jtSpacing.component.lg, pr: jtSpacing.gap.lg, verticalAlign: 'top' }

  return (
    <Box sx={{ mt: jtSpacing.component.lg, overflowX: 'auto', overflowY: 'hidden' }}>
      <Box
        component="table"
        sx={{ width: '100%', minWidth: 760, borderCollapse: 'collapse', textAlign: 'left' }}
      >
        <thead>
          <tr>
            <Box component="th" scope="col" sx={{ ...headSx, width: '32%' }}>
              Compared with
            </Box>
            <Box component="th" scope="col" sx={{ ...headSx, width: '10%' }}>
              Model
            </Box>
            <Box component="th" scope="col" sx={{ ...headSx, width: '22%' }}>
              Changes
            </Box>
            <Box component="th" scope="col" sx={headSx}>
              Scenarios
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
                  {row.model}
                </Typography>
              </Box>
              <Box component="td" sx={cellSx}>
                {row.changes.map((line) => (
                  <Typography
                    key={line}
                    variant="cardTitle"
                    component="span"
                    sx={{ display: 'block' }}
                  >
                    {line}
                  </Typography>
                ))}
              </Box>
              <Box component="td" sx={{ ...cellSx, pr: 0 }}>
                <Typography
                  variant="columnHead"
                  component="p"
                  sx={{ mb: jtSpacing.gap.xs, color: 'primary.main' }}
                >
                  {row.scenarios}
                </Typography>
                <Stack direction="row" useFlexGap spacing={1} sx={{ flexWrap: 'wrap' }}>
                  {[...outflowVariations, ...implementationDetails]
                    .filter(({ group }) => group === row.group)
                    .map((future) => (
                      <Button
                        key={future.id}
                        variant="outlined"
                        onClick={() => onSelectFuture(future)}
                        sx={{ color: 'common.white', borderColor: 'base.300' }}
                      >
                        {future.label}
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

/** One labeled block within a group of futures. */
function GroupBlock({ id, title, children }: { id?: string; title: string; children: ReactNode }) {
  return (
    <Box id={id} sx={{ minWidth: 0, scrollMarginTop: 110 }}>
      <Typography variant="h4" component="h4" sx={{ mb: jtSpacing.gap.sm }}>
        {title}
      </Typography>
      {children}
    </Box>
  )
}

/** The outputs one model reports. */
function ModeledOutputs({ model }: { model: StationModel }) {
  return (
    <Stack spacing={jtSpacing.gap.sm}>
      {modeledOutputs
        .filter((output) => model === 'rma' || !('adaptationOnly' in output))
        .map((output) => (
          <Box key={output.title}>
            <Typography variant="cardTitle" component="p" sx={{ color: 'primary.main' }}>
              {output.title}
            </Typography>
            <Typography variant="body2">
              {output.body}
              {'availability' in output && ` ${output.availability}`}
            </Typography>
          </Box>
        ))}
    </Stack>
  )
}

/** Where a model samples, beside when it runs and what it reports. */
function ModelOverview({ model, stationNote }: { model: StationModel; stationNote: string }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'minmax(0, 2fr) minmax(0, 3fr)' },
        gap: jtSpacing.gap.xl,
        alignItems: 'start',
        mt: jtSpacing.component.lg,
      }}
    >
      <GroupBlock title="Station locations">
        <Typography variant="body2" sx={{ mb: jtSpacing.gap.sm }}>
          {stationNote}
        </Typography>
        <StationMap model={model} />
      </GroupBlock>
      <Stack spacing={jtSpacing.component.lg} sx={{ minWidth: 0 }}>
        <GroupBlock title="Simulation time">
          <SimulationTimeline model={model} />
        </GroupBlock>
        <GroupBlock title="What is modeled">
          <ModeledOutputs model={model} />
        </GroupBlock>
      </Stack>
    </Box>
  )
}
/** A place named directly on a map, in place of a legend. */
function MapLabel({
  text,
  longitude,
  latitude,
  side = 'left',
  added,
  bare,
  offset = 0,
}: MapLabelData) {
  return (
    <Marker longitude={longitude} latitude={latitude} anchor={side}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: side === 'left' ? 'row' : 'row-reverse',
          alignItems: 'center',
          gap: 0.75,
        }}
      >
        {!bare && (
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              bgcolor: added ? 'primary.main' : 'common.white',
              ...(side === 'left' ? { ml: -0.75 } : { mr: -0.75 }),
            }}
          />
        )}
        <Typography
          variant="meta"
          sx={{
            px: 1,
            py: 0.5,
            bgcolor: 'translucent.800',
            color: 'common.white',
            // Long names wrap on phones, where they would otherwise run off the map.
            display: 'block',
            maxWidth: { xs: 84, md: 'none' },
            whiteSpace: { md: 'nowrap' },
            ...(side === 'left' ? { ml: `${offset}px` } : { mr: `${offset}px` }),
          }}
        >
          {text}
        </Typography>
      </Box>
    </Marker>
  )
}

/** One model's output stations, on a map framed from the Golden Gate boundary to the Delta. */
function StationMap({ model }: { model: StationModel }) {
  const theme = useTheme()
  const [stations, setStations] = useState<FeatureCollection<Point> | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller
    const request: Promise<FeatureCollection<Point>> =
      model === 'rma'
        ? fetch(assetUrl('/data/salinity/scenario-explorer/all_386_unique_stations.csv'), {
            signal,
          })
            .then((response) => response.text())
            .then((text) => ({
              type: 'FeatureCollection',
              features: csvParse(text).map((row) => ({
                type: 'Feature',
                properties: {},
                geometry: {
                  type: 'Point',
                  coordinates: [Number(row.longitude), Number(row.latitude)],
                },
              })),
            }))
        : fetch(assetUrl('/data/geospatial-assets/shared/schism-modeled-stations-405.geojson'), {
            signal,
          }).then((response) => response.json() as Promise<FeatureCollection<Point>>)
    request.then(setStations).catch((reason: unknown) => {
      if (reason instanceof DOMException && reason.name === 'AbortError') return
      setStations(null)
    })
    return () => controller.abort()
  }, [model])

  return (
    <Box
      role="img"
      aria-label={
        model === 'rma'
          ? 'Map of the San Francisco Bay and Delta showing the 386 RMA stations and the Golden Gate salinity boundary.'
          : 'Map of the San Francisco Bay and Delta showing the SCHISM stations, a different set from the RMA stations.'
      }
      sx={{
        position: 'relative',
        height: 400,
        overflow: 'hidden',
        border: 1,
        borderColor: 'border.default',
        bgcolor: 'base.900',
        '& .mapboxgl-ctrl-bottom-left': { display: 'none' },
      }}
    >
      <BaseMap
        mapStyleUrl={SALINITY_MAP_STYLE}
        initialViewState={DELTA_START_VIEW}
        interactive={false}
        attributionControl={false}
      >
        <Camera bounds={MODELING_CAMERAS.stationMap} />
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
        {model === 'rma' && (
          <MapLabel {...GOLDEN_GATE} text="Golden Gate salinity boundary" added />
        )}
      </BaseMap>
    </Box>
  )
}

/** One model's simulation period on its own time axis, labeled by water year type. */
function SimulationTimeline({ model }: { model: StationModel }) {
  const { ariaLabel, days, spinUpLabel, endLabel, periods, ticks } = simulationTimelines[model]

  return (
    <>
      <Box sx={{ overflowX: 'auto', overflowY: 'hidden' }}>
        <Box
          role="img"
          aria-label={ariaLabel}
          sx={{
            minWidth: 360,
            // Room for a last axis label centered on the end of the axis.
            pr: 4,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: jtSpacing.gap.sm,
              mb: 0.5,
            }}
          >
            <Typography variant="meta" sx={{ color: 'base.100' }}>
              {spinUpLabel}
            </Typography>
            <Typography variant="meta" sx={{ color: 'base.100' }}>
              {endLabel}
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: periods.map((period) => `minmax(0, ${period.days}fr)`).join(' '),
              minHeight: 58,
            }}
          >
            {periods.map((period, index) => (
              <SimulationPeriod key={index} period={period} />
            ))}
          </Box>
          <Box
            aria-hidden="true"
            sx={{
              position: 'relative',
              mt: 1,
              height: (theme) => theme.spacing(4),
              borderTop: 1,
              borderColor: 'base.100',
            }}
          >
            {ticks.map(({ day, label }) => (
              <Stack
                key={label}
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: `${(day / days) * 100}%`,
                  transform: 'translateX(-50%)',
                  alignItems: 'center',
                }}
              >
                <Box sx={{ width: '1px', height: 6, bgcolor: 'base.100' }} />
                <Typography variant="meta" sx={{ color: 'base.100', whiteSpace: 'nowrap' }}>
                  {label}
                </Typography>
              </Stack>
            ))}
          </Box>
        </Box>
      </Box>
    </>
  )
}

type SimulationPeriodData = (typeof simulationTimelines)[StationModel]['periods'][number]

function SimulationPeriod({ period }: { period: SimulationPeriodData }) {
  if (period.tone === 'spinUp') {
    return (
      <Box
        sx={(theme) => ({
          backgroundImage: `repeating-linear-gradient(135deg, ${theme.palette.translucent[400]} 0 5px, transparent 5px 10px)`,
        })}
      />
    )
  }
  return (
    <Box
      sx={[
        {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 0.5,
          textAlign: 'center',
          bgcolor: waterYearColor[period.tone],
        },
        'divided' in period && { borderLeft: 2, borderColor: 'base.800' },
      ]}
    >
      {'label' in period && (
        <Typography variant="meta" sx={{ color: 'common.white' }}>
          {period.label}
        </Typography>
      )}
    </Box>
  )
}

function ScenarioMap({ implementation }: { implementation: Implementation }) {
  const { id, slug, label } = implementation
  // New Green Watershed builds on Eco Machine's two areas, then marks the four it adds.
  const layerSlug = id === 'ngw' ? 'eco-machine' : slug
  const mapConfig = getConfig(slug)
  const labels = {
    eco: ecoMachineLabels,
    ngw: newGreenWatershedLabels,
    bolster: bolsterLabels,
    tunnel: tunnelLabels,
  }[id as string]
  const bounds =
    id === 'eco' || id === 'ngw'
      ? MODELING_CAMERAS.restoredAreas
      : id === 'bolster'
        ? MODELING_CAMERAS.bolsterGates
        : mapConfig.bounds.delta

  return (
    <Box
      aria-label={`Interactive map for ${label}`}
      sx={{
        height: id === 'bolster' ? 340 : { xs: 420, lg: 480 },
        position: 'relative',
        overflow: 'hidden',
        border: 1,
        borderColor: 'border.default',
        bgcolor: 'base.700',
        '& .mapboxgl-ctrl-bottom-left': { display: 'none' },
      }}
    >
      <BaseMap
        key={slug}
        initialViewState={mapConfig.initialViewState}
        mapStyleUrl={SALINITY_MAP_STYLE}
        interactive={mapConfig.interactive}
        dragPan={mapConfig.interactive}
        dragRotate={false}
        scrollZoom={mapConfig.interactive}
        touchZoomRotate={mapConfig.interactive}
        maxBounds={mapConfig.maxBounds}
      >
        {bounds && (
          <Camera
            bounds={bounds}
            padding={id === 'bolster' ? MODELING_CAMERAS.bolsterGatesPadding : undefined}
          />
        )}
        <Layers
          scenarioSlug={layerSlug}
          showAdaptationLayers
          visibilityScope="delta"
          hiddenSelectionKeys={
            id === 'bolster' ? ['freshwater-corridor', 'operable-gates'] : undefined
          }
        />
        {id === 'ngw' && (
          <Source
            id="ngw-lindsey-cache-slough"
            type="geojson"
            data={assetUrl('/data/geospatial-assets/subteams/lindsey-cache-slough.geojson')}
          >
            <Layer
              id="ngw-lindsey-cache-slough-fill"
              type="fill"
              paint={{
                'fill-color': map.scenarios.cartography.mutedFeature,
                'fill-opacity': 0.42,
              }}
            />
            <Layer
              id="ngw-lindsey-cache-slough-line"
              type="line"
              paint={{
                'line-color': map.scenarios.cartography.feature,
                'line-opacity': 0.95,
                'line-width': 2,
              }}
            />
          </Source>
        )}
        {labels?.map((place) => (
          <MapLabel key={`${place.text}-${place.latitude}`} {...place} />
        ))}
        {mapConfig.showNavigationControl && (
          <NavigationControl position="top-right" showCompass={false} />
        )}
      </BaseMap>
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
        Planned restoration at Little Egbert Tract and Prospect Island is part of the Baseline, so
        it is not counted as a change here.
      </Typography>
    </Box>
  )
}

function NamedList({ items }: { items: readonly { name: string; body: string }[] }) {
  return (
    <Box sx={{ mt: jtSpacing.component.md, borderTop: 1, borderColor: 'border.strong' }}>
      {items.map(({ name, body }) => (
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

/** What each scenario changes: its restored areas or operating schedule, and its map. */
function ImplementationPanel({ implementation }: { implementation: Implementation }) {
  const { id, detailTitle, lead } = implementation

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
          maxWidth: textMaxWidth,
        }}
      >
        {lead}
      </Typography>
    </>
  )

  if (id === 'reserves') {
    return (
      <Box sx={{ mt: jtSpacing.component.lg }}>
        {heading}
        <Box sx={{ mt: jtSpacing.component.md }}>
          <ReleaseTimeline />
        </Box>
      </Box>
    )
  }

  if (id === 'bolster') {
    return (
      <Box sx={{ mt: jtSpacing.component.lg }}>
        {heading}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'minmax(0, 1fr)', lg: 'minmax(0, 3fr) minmax(0, 2fr)' },
            gap: jtSpacing.gap.xl,
            alignItems: 'center',
            mt: jtSpacing.component.md,
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <GateTimeline />
          </Box>
          <ScenarioMap implementation={implementation} />
        </Box>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: 'minmax(0, 1fr)', lg: 'repeat(2, minmax(0, 1fr))' },
        gap: jtSpacing.gap.xl,
        alignItems: id === 'tunnel' ? 'stretch' : 'start',
        mt: jtSpacing.component.lg,
      }}
    >
      <Box sx={{ minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {heading}
        {id === 'eco' && (
          <>
            <NamedList items={ecoMachineAreas} />
            <BaselineRestorationNote />
          </>
        )}
        {id === 'ngw' && <NewGreenWatershedAreas />}
        {id === 'tunnel' && (
          <Box
            sx={{
              flex: 1,
              minHeight: 200,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mt: jtSpacing.component.md,
              p: jtSpacing.component.md,
              border: '1px dashed',
              borderColor: 'base.100',
              borderRadius: 1,
              textAlign: 'center',
            }}
          >
            <Typography variant="placeholderNote">Simulation details forthcoming</Typography>
          </Box>
        )}
      </Box>
      <ScenarioMap implementation={implementation} />
    </Box>
  )
}

export default function ModelingOverview() {
  const [selectedImplementationId, setSelectedImplementationId] = useState<ImplementationId>('eco')
  const [activeSection, setActiveSection] = useState<OverviewSectionId>('how-modeled')
  const selectedImplementation =
    implementationDetails.find(({ id }) => id === selectedImplementationId) ??
    implementationDetails[0]

  const showFuture = (future: Future) => {
    if (future.group !== 'outflow') setSelectedImplementationId(future.id)
    const target = future.group === 'outflow' ? 'outflow-variations' : 'scenario-implementations'
    document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' })
  }

  // The active section is the last one to have reached the reading line, in either scroll direction.
  useEffect(() => {
    const update = () => {
      const readingLine = window.innerHeight * 0.3
      let current: OverviewSectionId = overviewNavigation[0].id
      for (const { id } of overviewNavigation) {
        const top = document.getElementById(id)?.getBoundingClientRect().top
        if (top !== undefined && top <= readingLine) current = id
      }
      setActiveSection(current)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: 'minmax(0, 1fr)',
          lg: `${navigation.railColumn} minmax(0, 1fr)`,
        },
        columnGap: { lg: jtSpacing.section.md },
        alignItems: 'start',
      }}
    >
      <PageRail
        items={[...overviewNavigation]}
        ariaLabel="Modeling page sections"
        activeItemId={activeSection}
        onNavigate={(id) => setActiveSection(id as OverviewSectionId)}
        sx={{ gridColumn: { lg: 1 }, gridRow: { lg: '1 / span 3' } }}
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
            variant="body1"
            component="p"
            sx={{ mt: jtSpacing.gap.lg, maxWidth: textMaxWidth, color: 'base.50' }}
          >
            We tested 2 outflow variations and 5 adaptation scenarios, using two hydrodynamic
            models. SCHISM tests the outflow variations, which change the amount of Delta outflow.
            The two-dimensional RMA Bay-Delta model tests the adaptation scenarios: three change the
            Delta’s landscape and two change the water flowing into it. Each is compared with a
            baseline from the same model.
          </Typography>
        </Box>

        <Box
          component="section"
          id="shared-baseline"
          aria-labelledby="shared-baseline-title"
          sx={sectionSx}
        >
          <SubsectionHeading
            id="shared-baseline-title"
            title={
              <>
                Three baselines for{' '}
                <Box component="span" sx={{ color: 'primary.main' }}>
                  Business as Usual
                </Box>
              </>
            }
          >
            <KeyPhrase>All three baselines represent the same thing: current conditions</KeyPhrase>,
            with no outflow variation or adaptation scenario applied. Only the modeling differs.
            Each scenario is read against the baseline modeled the same way, so{' '}
            <KeyPhrase>the difference reflects the one thing that scenario changes</KeyPhrase>.
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
          id="outflow-variations"
          aria-labelledby="outflow-variations-title"
          sx={sectionSx}
        >
          <SubsectionHeading id="outflow-variations-title" title="Outflow variations">
            2 variations, modeled in SCHISM, compared with{' '}
            <KeyPhrase>{scenarioName('hist')}</KeyPhrase>.
          </SubsectionHeading>
          <ModelOverview
            model="schism"
            stationNote="SCHISM output is sampled at 405 stations, which are a different set from RMA’s."
          />
          <Box sx={{ mt: jtSpacing.component.lg }}>
            <GroupBlock title="How each future is built">
              <Typography variant="body1" sx={{ color: 'base.50', maxWidth: textMaxWidth }}>
                <KeyPhrase>
                  These runs apply a statistical change to the amount of Delta outflow through
                  changes in exports.
                </KeyPhrase>{' '}
                A 30% increase generally pushes saltwater farther toward the ocean, potentially
                reducing salinity in the Delta. A 10% decrease allows saltwater to move farther
                inland, potentially intensifying existing challenges for Delta communities,
                ecosystems, and water users.
              </Typography>
            </GroupBlock>
          </Box>
        </Box>

        <Box
          component="section"
          id="adaptation-scenarios"
          aria-labelledby="adaptation-scenarios-title"
          sx={{ ...sectionSx, borderTop: 3, borderColor: 'primary.main' }}
        >
          <SubsectionHeading
            id="adaptation-scenarios-title"
            title="Adaptation scenarios"
            color="primary.main"
          >
            5 scenarios, modeled in RMA, compared with the <KeyPhrase>Baseline</KeyPhrase> or{' '}
            <KeyPhrase>CalSim Baseline</KeyPhrase>.
          </SubsectionHeading>
          <ModelOverview
            model="rma"
            stationNote="RMA output is sampled at 386 stations spread across the Bay and the Delta. Its salinity boundary is at the Golden Gate, where ocean salinity enters the model."
          />
          <Box sx={{ mt: jtSpacing.component.lg }}>
            <GroupBlock id="scenario-implementations" title="How each future is built">
              <ChoiceCards
                groups={implementationGroups}
                value={selectedImplementationId}
                onChange={(id) => setSelectedImplementationId(id as ImplementationId)}
              />
              <ImplementationPanel implementation={selectedImplementation} />
            </GroupBlock>
          </Box>
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
            maxWidth: textMaxWidth,
          }}
        >
          Pick an outflow variation or adaptation scenario to see which places get saltier or
          fresher than its baseline, and in which seasons and water years.
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
          sx={{ mt: jtSpacing.gap.md, color: 'base.100', maxWidth: textMaxWidth }}
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
