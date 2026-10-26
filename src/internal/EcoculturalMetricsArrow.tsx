// Prototype: the Eco-cultural Restoration and Indigenous Sovereignty criterion as one
// transition arrow with four equal lanes, one per metric.
//
// The four metrics are equal, interdependent and additive: the more of a metric's
// elements are present, the more it is realized, and the more of every metric, the
// closer the criterion is to being met. Only Metric A (restoration) is measured across
// scenarios, so only its lane responds to the scenario picker. Lanes B–D show what would
// need to happen and stay the same for every scenario. Element order within a lane
// carries no meaning; the arrow reads as accumulation, not as a ranking of elements.
//
// Source: "Eco-cultural Restoration and Indigenous Sovereignty: The Story Behind the
// Criterion" (Social Science Team, Sept 2026) and the team's BDSC 2026 slides.
// Workshop-derived material needs Tribal review before publication outside this site.
import { useState } from 'react'
import { Box, Container, ToggleButton, ToggleButtonGroup, Typography, alpha } from '@mui/material'
import PageLayout from './PageLayout'

type ElementState = 'present' | 'absent' | 'adverse'

interface MeasuredValue {
  state: ElementState
  /** Shown under the element label, e.g. an acreage or a flow change. */
  value: string
}

interface ScenarioMeasurement {
  id: string
  label: string
  group: 'Adaptation scenarios' | 'Tiered outflow scenarios'
  /** The team's single score for the whole criterion (−5 to +5). */
  overallScore: number
  restoration: Record<RestorationElementId, MeasuredValue>
}

type RestorationElementId =
  'tidal' | 'managed' | 'rice' | 'forest' | 'meadow' | 'floodplain' | 'flow'

const RESTORATION_ELEMENTS: { id: RestorationElementId; label: string; region: string }[] = [
  { id: 'tidal', label: 'Tidal wetlands', region: 'In-Delta' },
  { id: 'managed', label: 'Managed wetlands', region: 'In-Delta' },
  { id: 'rice', label: 'Wet-soil agriculture (rice)', region: 'In-Delta' },
  { id: 'forest', label: 'Upland forests', region: 'Upper watershed' },
  { id: 'meadow', label: 'Montane meadows', region: 'Upper watershed' },
  { id: 'floodplain', label: 'Floodplains', region: 'Upper watershed' },
  { id: 'flow', label: 'Adequate flows', region: 'Flow' },
]

const none: MeasuredValue = { state: 'absent', value: '0 acres' }
const noFlowChange: MeasuredValue = { state: 'absent', value: 'No flow change' }
const noRestoration = {
  tidal: none,
  managed: none,
  rice: none,
  forest: none,
  meadow: none,
  floodplain: none,
}

// Acres above the 30,000 EcoRestore acres that every scenario, baseline included,
// carries; those acres do not change any score. New Green Watershed values are the
// minimal-to-maximal range across its sub-scenarios (document Tables 3 and 4).
const SCENARIOS: ScenarioMeasurement[] = [
  {
    id: 'bau',
    label: 'Business As Usual',
    group: 'Adaptation scenarios',
    overallScore: 0,
    restoration: { ...noRestoration, flow: noFlowChange },
  },
  {
    id: 'bolster',
    label: 'Bolster and Fortify',
    group: 'Adaptation scenarios',
    overallScore: 0,
    restoration: { ...noRestoration, flow: noFlowChange },
  },
  {
    id: 'eco-machine',
    label: 'Eco Machine',
    group: 'Adaptation scenarios',
    overallScore: 2,
    restoration: {
      ...noRestoration,
      tidal: { state: 'present', value: '43,100 acres (Suisun Marsh, Franks Tract)' },
      flow: noFlowChange,
    },
  },
  {
    id: 'ngw',
    label: 'New Green Watershed',
    group: 'Adaptation scenarios',
    overallScore: 4,
    restoration: {
      tidal: none,
      managed: { state: 'present', value: '56,286–248,815 acres' },
      rice: { state: 'present', value: '0–189,023 acres' },
      forest: { state: 'present', value: '468,000–7,020,000 acres' },
      meadow: { state: 'present', value: '11,600–347,600 acres' },
      floodplain: { state: 'present', value: '6,400–303,300 acres' },
      flow: noFlowChange,
    },
  },
  {
    id: 'reserves',
    label: 'Calling on Reserves',
    group: 'Adaptation scenarios',
    overallScore: 1,
    restoration: {
      ...noRestoration,
      flow: { state: 'present', value: 'Holds flows upstream for fish' },
    },
  },
  {
    id: 'tunnel',
    label: 'A Tunnel',
    group: 'Adaptation scenarios',
    overallScore: -2,
    restoration: {
      ...noRestoration,
      flow: { state: 'adverse', value: 'Takes more winter flow' },
    },
  },
  {
    id: 'historic',
    label: 'Historic Baseline',
    group: 'Tiered outflow scenarios',
    overallScore: 0,
    restoration: { ...noRestoration, flow: noFlowChange },
  },
  {
    id: 'flow-up',
    label: '30% Outflow Increase',
    group: 'Tiered outflow scenarios',
    overallScore: 3,
    restoration: { ...noRestoration, flow: { state: 'present', value: '+30% Delta outflow' } },
  },
  {
    id: 'flow-down',
    label: '10% Outflow Decrease',
    group: 'Tiered outflow scenarios',
    overallScore: -2,
    restoration: { ...noRestoration, flow: { state: 'adverse', value: '−10% Delta outflow' } },
  },
]

interface Metric {
  letter: string
  title: string
  definition: string
  assessment: string
  measured: boolean
  elements: string[]
  /** An element the team's findings single out; marked, not reordered. */
  highlight?: { element: string; note: string }
}

// Definitions are verbatim from the criterion document.
const METRICS: Metric[] = [
  {
    letter: 'A',
    title: 'Restoration of Native Ecosystems and Ecosystem Functions',
    definition:
      'Recovering, protecting, and enhancing the web of species and ecosystems that are native to the Delta and culturally significant. This includes habitat creation, landscape restoration (ecological and cultural), protection against invasive species, and improving environmental flows to benefit ecosystems and species.',
    assessment: 'Change in the number of restored acres in each scenario',
    measured: true,
    elements: RESTORATION_ELEMENTS.map((element) => element.label),
  },
  {
    letter: 'B',
    title:
      'Increased Access to Landscapes for Stewardship, Subsistence, Ceremony, and Cultural Practices',
    definition:
      'Includes potential efforts to return land to Tribes or co-manage land with Tribes and Tribal governments.',
    assessment: 'Lists the kinds of agreements that can facilitate increased access to land',
    measured: false,
    elements: [
      'Memorandum of Understanding (MOU) / Memorandum of Agreement (MOA)',
      'Conservation easement (CE)',
      'Cultural conservation easement (CCE)',
      'Land trust partnership',
      'Tribal ownership',
    ],
    highlight: {
      element: 'Tribal ownership',
      note: 'Most preferred by Tribal representatives',
    },
  },
  {
    letter: 'C',
    title:
      'Implementation and Application of Indigenous Science and Traditional Ecological Knowledge',
    definition:
      'Incorporating TEK in the form of best practices into Western management, stewardship, and land-use decisions in partnership and/or consultation with Tribal representatives and TEK practitioners.',
    assessment: 'Avenues by which TEK applications can be facilitated',
    measured: false,
    elements: [
      'Ensured privacy',
      'Unrestricted access',
      'Site selection accessible to Elders',
      'Collaboration with Tribal stewardship groups',
    ],
  },
  {
    letter: 'D',
    title: 'Recognition and Application of Indigenous Sovereignty, Tribal Governance, and Rights',
    definition:
      'Advancing the inherent right of Indigenous peoples to govern themselves, their lands, and resources, and to maintain their cultures and Traditional ways of life.',
    assessment:
      'Instances and mechanisms of recognition and application of Indigenous sovereignty, Tribal governance, and rights',
    measured: false,
    elements: [
      'Tribal beneficial/cultural uses of water',
      'Recognition of Tribal water rights',
      'Indigenous representation in planning processes',
      'An inter-Tribal Council for the Delta',
      'Funding for Tribal Stewardship and Indigenous Science Groups',
      'Data sovereignty',
      'Education',
      'Food sovereignty',
    ],
  },
]

// Arrow height in spacing units; its lower half overlaps the lanes, as on the spectrum page.
const ARROW_HEIGHT = 7

function formatScore(score: number) {
  return score > 0 ? `+${score}` : score < 0 ? `−${Math.abs(score)}` : '0'
}

// One element of a lane. Measured elements are solid; described ones are dashed.
function ElementChip({
  label,
  measured,
  detail,
  note,
}: {
  label: string
  measured?: MeasuredValue
  detail?: string
  note?: string
}) {
  const state = measured?.state
  return (
    <Box
      sx={(theme) => ({
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 0.5,
        minHeight: theme.spacing(8),
        px: 1.5,
        py: 1,
        border: 1,
        borderStyle: measured ? 'solid' : 'dashed',
        borderColor:
          state === 'present'
            ? 'brand.primaryGreen'
            : state === 'adverse'
              ? 'accent.orange'
              : 'border.strong',
        bgcolor:
          state === 'present'
            ? alpha(theme.palette.brand.primaryGreen, 0.16)
            : state === 'adverse'
              ? 'translucent.orange'
              : 'transparent',
        color: state === 'absent' ? 'base.200' : 'common.white',
      })}
    >
      {detail && (
        <Typography variant="chartColumnHead" component="span">
          {detail}
        </Typography>
      )}
      <Typography variant="meta" component="span">
        {label}
      </Typography>
      {measured && (
        <Typography
          variant="controlLabel"
          component="span"
          sx={{
            color:
              state === 'present'
                ? 'brand.primaryGreen'
                : state === 'adverse'
                  ? 'accent.orange'
                  : 'base.200',
          }}
        >
          {measured.value}
        </Typography>
      )}
      {note && (
        <Typography variant="controlLabel" component="span" sx={{ color: 'accent.purple' }}>
          {note}
        </Typography>
      )}
    </Box>
  )
}

function MetricLane({
  metric,
  scenario,
  laneIndex,
}: {
  metric: Metric
  scenario: ScenarioMeasurement
  laneIndex: number
}) {
  const present = metric.measured
    ? RESTORATION_ELEMENTS.filter((element) => scenario.restoration[element.id].state === 'present')
        .length
    : null

  return (
    <Box
      component="section"
      aria-label={`Metric ${metric.letter}: ${metric.title}`}
      sx={(theme) => ({
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '16rem minmax(0, 1fr)' },
        gap: theme.jtSpacing.gap.md,
        alignItems: 'center',
        p: theme.jtSpacing.component.md,
        pt:
          laneIndex === 0
            ? `calc(${theme.spacing(theme.jtSpacing.component.md)} + ${theme.spacing(ARROW_HEIGHT / 2)})`
            : theme.jtSpacing.component.md,
        bgcolor: 'base.700',
        borderTop: laneIndex === 0 ? 0 : 1,
        borderColor: 'border.default',
      })}
    >
      {/* Lane head: which metric, and whether this lane responds to the scenario. */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography variant="numberArticle" component="p" sx={{ color: 'brand.primaryGreen' }}>
          Metric {metric.letter}
        </Typography>
        <Typography variant="h5" component="h3">
          {metric.title}
        </Typography>
        <Typography variant="controlLabel" component="p" sx={{ color: 'base.100' }}>
          {metric.measured
            ? `${present} of ${RESTORATION_ELEMENTS.length} elements present in ${scenario.label}`
            : 'Not measured across scenarios: what would need to happen'}
        </Typography>
      </Box>

      <Box
        sx={(theme) => ({
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(10.5rem, 1fr))',
          gap: theme.jtSpacing.gap.sm,
        })}
      >
        {metric.measured
          ? RESTORATION_ELEMENTS.map((element) => (
              <ElementChip
                key={element.id}
                label={element.label}
                detail={element.region}
                measured={scenario.restoration[element.id]}
              />
            ))
          : metric.elements.map((element) => (
              <ElementChip
                key={element}
                label={element}
                note={metric.highlight?.element === element ? metric.highlight.note : undefined}
              />
            ))}
      </Box>
    </Box>
  )
}

function SummaryTable() {
  return (
    <Box component="section" aria-labelledby="ecocultural-summary-heading">
      <Typography variant="eyebrow">Components of this criterion</Typography>
      <Typography id="ecocultural-summary-heading" variant="h3" component="h2" sx={{ mt: 1.5 }}>
        Four metrics, equally weighted
      </Typography>
      <Typography
        variant="body2"
        sx={(theme) => ({ maxWidth: theme.jtSpacing.paragraphMaxWidth.default, mt: 2 })}
      >
        The metrics are interdependent and additive; none is ranked above another. Only restoration
        can be measured across the scenarios.
      </Typography>

      <Box
        role="table"
        sx={(theme) => ({
          mt: 3,
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: 'minmax(12rem, 1.1fr) minmax(0, 1.6fr) minmax(0, 1.4fr) minmax(9rem, 0.8fr)',
          },
          border: 1,
          borderColor: 'border.default',
          '& > [role=row]': {
            display: 'grid',
            gridColumn: '1 / -1',
            gridTemplateColumns: 'subgrid',
            gap: { xs: 1, md: theme.jtSpacing.gap.md },
            p: theme.jtSpacing.component.sm,
            borderTop: 1,
            borderColor: 'border.default',
          },
          '& > [role=row]:first-of-type': { borderTop: 0, bgcolor: 'base.700' },
        })}
      >
        <Box role="row" sx={{ display: { xs: 'none !important', md: 'grid' } }}>
          {['Metric', 'Definition', 'Elements', 'Assessment'].map((heading) => (
            <Typography key={heading} role="columnheader" variant="chartColumnHead">
              {heading}
            </Typography>
          ))}
        </Box>
        {METRICS.map((metric) => (
          <Box role="row" key={metric.letter}>
            <Box role="rowheader">
              <Typography
                variant="numberArticle"
                component="p"
                sx={{ color: 'brand.primaryGreen' }}
              >
                Metric {metric.letter}
              </Typography>
              <Typography variant="cardTitle" component="p" sx={{ mt: 1 }}>
                {metric.title}
              </Typography>
            </Box>
            <Typography role="cell" variant="meta" sx={{ color: 'base.50' }}>
              {metric.definition}
            </Typography>
            <Box role="cell" component="ul" sx={{ m: 0, pl: 2.5, color: 'base.50' }}>
              {metric.elements.map((element) => (
                <Typography key={element} component="li" variant="meta">
                  {element}
                </Typography>
              ))}
            </Box>
            <Box role="cell" sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography
                variant="chartLabel"
                component="p"
                sx={{ color: metric.measured ? 'brand.primaryGreen' : 'base.100' }}
              >
                {metric.measured ? 'Measured' : 'Described'}
              </Typography>
              <Typography variant="meta" component="p" sx={{ color: 'base.50' }}>
                {metric.assessment}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

function ScenarioPicker({ value, onChange }: { value: string; onChange: (id: string) => void }) {
  const groups = ['Adaptation scenarios', 'Tiered outflow scenarios'] as const
  return (
    <Box sx={(theme) => ({ display: 'flex', flexWrap: 'wrap', gap: theme.jtSpacing.gap.lg })}>
      {groups.map((group) => (
        <Box key={group}>
          <Typography variant="chartColumnHead" component="p" sx={{ mb: 1 }}>
            {group}
          </Typography>
          <ToggleButtonGroup
            exclusive
            size="small"
            value={value}
            onChange={(_, next: string | null) => next && onChange(next)}
            aria-label={group}
            sx={{
              flexWrap: 'wrap',
              '& .MuiToggleButton-root': {
                typography: 'controlLabel',
                color: 'base.100',
                borderColor: 'border.strong',
              },
              '& .MuiToggleButton-root.Mui-selected': {
                color: 'common.black',
                bgcolor: 'brand.primaryGreen',
              },
              '& .MuiToggleButton-root.Mui-selected:hover': { bgcolor: 'brand.primaryGreen' },
            }}
          >
            {SCENARIOS.filter((scenario) => scenario.group === group).map((scenario) => (
              <ToggleButton key={scenario.id} value={scenario.id}>
                {scenario.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>
      ))}
    </Box>
  )
}

export default function EcoculturalMetricsArrow() {
  const [scenarioId, setScenarioId] = useState('ngw')
  const scenario = SCENARIOS.find((item) => item.id === scenarioId) ?? SCENARIOS[0]

  return (
    <PageLayout title="Eco-cultural Metrics" fullWidthContent hideTitle plainContent>
      {/* Frame the criterion and how to read the arrow. */}
      <Box
        component="header"
        sx={(theme) => ({
          py: theme.jtSpacing.section.lg,
          borderBottom: 1,
          borderColor: 'border.default',
        })}
      >
        <Container>
          <Typography variant="eyebrow">Evaluation criterion · prototype</Typography>
          <Typography variant="h1" component="h1" sx={{ maxWidth: '22ch', mt: 2 }}>
            Eco-cultural restoration and Indigenous sovereignty
          </Typography>
          <Typography
            variant="bodyLarge"
            sx={(theme) => ({ maxWidth: theme.jtSpacing.paragraphMaxWidth.default, mt: 3 })}
          >
            The more elements of each metric are present, the more that metric is realized. The more
            of every metric, the closer the criterion is to being met.
          </Typography>
        </Container>
      </Box>

      <Container sx={(theme) => ({ py: theme.jtSpacing.section.md })}>
        <SummaryTable />
      </Container>

      {/* The arrow: four equal lanes; only restoration responds to the scenario. */}
      <Container sx={(theme) => ({ pb: theme.jtSpacing.section.lg })}>
        <Typography variant="eyebrow">Toward the criterion</Typography>
        <Typography variant="h3" component="h2" sx={{ mt: 1.5 }}>
          What each scenario delivers, and what it would take
        </Typography>
        <Typography
          variant="body2"
          sx={(theme) => ({ maxWidth: theme.jtSpacing.paragraphMaxWidth.default, mt: 2, mb: 3 })}
        >
          Solid elements are measured for the selected scenario. Dashed elements are not measured
          across scenarios; they describe what would need to happen and are the same for every
          scenario. Element order within a lane carries no meaning.
        </Typography>

        <ScenarioPicker value={scenarioId} onChange={setScenarioId} />

        <Box
          sx={(theme) => ({
            mt: 3,
            display: 'flex',
            alignItems: 'baseline',
            flexWrap: 'wrap',
            gap: theme.jtSpacing.gap.sm,
          })}
        >
          <Typography variant="chartValueLarge" component="p" sx={{ color: 'brand.primaryGreen' }}>
            {formatScore(scenario.overallScore)}
          </Typography>
          <Typography variant="meta" component="p" sx={{ color: 'base.100' }}>
            The team’s overall score for {scenario.label}, given to the criterion as a whole rather
            than to each metric
            {scenario.id === 'ngw'
              ? '. It assumes more Tribal involvement in the Delta, politically and culturally, than the other scenarios.'
              : '.'}
          </Typography>
        </Box>

        <Box
          role="figure"
          aria-label="Four metric lanes along a single transition arrow"
          sx={{ mt: 3 }}
        >
          {/* Shared arrow over the lanes, matching the stewardship spectrum. */}
          <Box
            sx={(theme) => ({
              position: 'relative',
              zIndex: 1,
              display: 'flex',
              alignItems: 'center',
              height: theme.spacing(ARROW_HEIGHT),
              mb: theme.spacing(-ARROW_HEIGHT / 2),
              pl: theme.jtSpacing.component.md,
              pr: 8,
              bgcolor: 'brand.primaryGreen',
              color: 'common.black',
              clipPath: `polygon(0 0, calc(100% - ${theme.spacing(5)}) 0, 100% 50%, calc(100% - ${theme.spacing(5)}) 100%, 0 100%)`,
            })}
          >
            <Typography variant="h4" component="p">
              More elements present, criterion closer to met
            </Typography>
          </Box>

          {METRICS.map((metric, laneIndex) => (
            <MetricLane
              key={metric.letter}
              metric={metric}
              scenario={scenario}
              laneIndex={laneIndex}
            />
          ))}
        </Box>

        <Typography variant="captionSmall" component="p" sx={{ mt: 2 }}>
          Every scenario, including Business As Usual, carries 30,000 EcoRestore acres; they are not
          counted here because they do not change any score. New Green Watershed shows the
          minimal-to-maximal range across its sub-scenarios.
        </Typography>
      </Container>
    </PageLayout>
  )
}
