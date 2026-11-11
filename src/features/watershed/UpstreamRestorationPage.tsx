// New Green Watershed's upstream restoration: what it restores, how the per-acre benefits
// were estimated, the nine scenarios, and how water, carbon and land cover would change.
// Laid out like a criterion's methodology page.
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import {
  Box,
  Button,
  Container,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  Typography,
  useTheme,
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import ScenarioPageHero from '../scenarios/ScenarioPageHero'
import { SectionHeading } from '../scenarios/evaluation/evaluationComponents'
import { evaluationCardSx } from '../scenarios/styles'
import { jtSpacing } from '../../theme'
import Footer from '../../ui/Footer'
import Navbar from '../../ui/Navbar'
import PageRail from '../../ui/PageRail'
import ChangeRangeChart, { RestorationLevelLegend } from './ChangeRangeChart'
import {
  changesIntro,
  estimationIntro,
  estimationSteps,
  hero,
  involve,
  landCoverTakeaways,
  landscapeMethods,
  outcomeGroups,
  scenarioReadingExample,
  scenariosIntro,
  sources,
  uncertainties,
} from './content'
import { HABITAT_META } from './habitats'
import LandCoverChart from './LandCoverChart'
import { outcomeUnits, outcomes } from './outcomes'
import ScenarioMatrix from './ScenarioMatrix'
import type { Landscape } from './types'

/** Sections listed in the page rail; ids match the section elements below. */
const pageSections = [
  { id: 'involve', label: 'What does upstream restoration involve?' },
  { id: 'scenarios', label: 'What are the nine watershed restoration sub-scenarios?' },
  { id: 'changes', label: 'How would the watershed change?' },
  { id: 'estimated', label: 'How were the benefits estimated?' },
  { id: 'uncertain', label: 'What remains uncertain?' },
  { id: 'sources', label: 'Sources' },
]

/** Clears the sticky navbar when a section is scrolled to. */
const sectionSx = { scrollMarginTop: 150 } as const

export default function UpstreamRestorationPage() {
  const accent = useTheme().palette.primary.main
  const [landscape, setLandscape] = useState<Landscape>('forests')

  return (
    <>
      <Navbar />
      <Box component="main" sx={{ bgcolor: 'base.800', color: 'common.white' }}>
        <ScenarioPageHero
          image="/images/scenarios/web/new-green-watershed.webp"
          eyebrow={hero.eyebrow}
          title={hero.title}
          titleColor="common.white"
          summary={hero.summary}
          summaryVariant="body1"
          accent={accent}
        >
          <Box>
            <Button
              component={Link}
              to="/scenarios/new-green-watershed"
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              sx={{
                color: accent,
                borderColor: accent,
                '&:hover': { borderColor: accent, bgcolor: alpha(accent, 0.12) },
              }}
            >
              Back to New Green Watershed
            </Button>
          </Box>
        </ScenarioPageHero>

        {/* Hybrid-width frame: readable prose and wide chart sections share one page. */}
        <Container
          maxWidth={false}
          sx={{
            width: jtSpacing.layout.hybrid.width,
            px: 0,
            pb: jtSpacing.section.xl,
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              lg: '240px minmax(0, 1fr) minmax(360px, .92fr)',
            },
            gap: { xs: jtSpacing.gap.xl, lg: jtSpacing.section.md },
            alignItems: 'start',
          }}
        >
          <PageRail
            items={pageSections}
            ariaLabel="Upstream restoration sections"
            sx={{ pt: { xs: jtSpacing.component.lg, md: jtSpacing.component.xl } }}
          />

          <Stack
            spacing={jtSpacing.section.xl}
            sx={{
              minWidth: 0,
              gridColumn: { lg: '2 / -1' },
              p: { xs: jtSpacing.component.lg, md: jtSpacing.component.xl },
            }}
          >
            <InvolveSection accent={accent} />
            <Box
              component="section"
              id="scenarios"
              aria-labelledby="scenarios-title"
              sx={sectionSx}
            >
              <SectionHeading
                variant="h3"
                title="What are the nine watershed restoration sub-scenarios?"
                id="scenarios-title"
                accent={accent}
              />
              <Typography variant="body1" sx={{ color: 'base.100' }}>
                <HabitatInlineText text={scenariosIntro} />
              </Typography>
              <Box
                sx={{
                  ...evaluationCardSx,
                  mt: jtSpacing.gap.lg,
                  borderLeft: 3,
                  borderLeftColor: accent,
                }}
              >
                <Typography variant="h5" component="h3">
                  {scenarioReadingExample.title}
                </Typography>
                <Stack spacing={jtSpacing.gap.xs} sx={{ mt: jtSpacing.gap.xs }}>
                  {scenarioReadingExample.paragraphs.map((paragraph) => (
                    <Typography key={paragraph} variant="body2" sx={{ color: 'base.100' }}>
                      {paragraph}
                    </Typography>
                  ))}
                </Stack>
              </Box>
              <Box sx={{ mt: jtSpacing.gap.lg }}>
                <ScenarioMatrix />
              </Box>
            </Box>
            <ChangesSection accent={accent} />
            <EstimatedSection
              accent={accent}
              landscape={landscape}
              onLandscapeChange={setLandscape}
            />
            <UncertainSection accent={accent} />
            <Box component="section" id="sources" aria-labelledby="sources-title" sx={sectionSx}>
              <SectionHeading variant="h3" title="Sources" id="sources-title" accent={accent} />
              <Box component="ol" sx={{ m: 0, p: 0, listStyle: 'none' }}>
                {sources.map((source, index) => (
                  <Typography
                    key={source}
                    component="li"
                    variant="body2"
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: '2.5em minmax(0, 1fr)',
                      color: 'base.100',
                      py: jtSpacing.component.xs,
                      borderTop: 1,
                      borderColor: 'border.subtle',
                    }}
                  >
                    <Typography component="span" variant="numberBadge" sx={{ color: accent }}>
                      {index + 1}.
                    </Typography>
                    <span>{source}</span>
                  </Typography>
                ))}
              </Box>
            </Box>
          </Stack>
        </Container>
      </Box>
      <Footer />
    </>
  )
}

function InvolveSection({ accent }: { accent: string }) {
  return (
    <Box component="section" id="involve" aria-labelledby="involve-title" sx={sectionSx}>
      <SectionHeading
        variant="h3"
        title="What does upstream restoration involve?"
        id="involve-title"
        accent={accent}
      />
      <Stack spacing={jtSpacing.gap.md}>
        {involve.map((paragraph) => (
          <Typography key={paragraph} variant="body1" sx={{ color: 'base.100' }}>
            <HabitatInlineText text={paragraph} />
          </Typography>
        ))}
      </Stack>
    </Box>
  )
}

const habitatTermPattern = /(montane forests|wet meadows|floodplains|forests|meadows)/gi

function HabitatInlineText({ text }: { text: string }) {
  return text.split(habitatTermPattern).map((part, index) => {
    const normalized = part.toLowerCase()
    const landscape = normalized.includes('forest')
      ? 'forests'
      : normalized.includes('meadow')
        ? 'meadows'
        : normalized.includes('floodplain')
          ? 'floodplains'
          : null

    return landscape ? (
      <Box
        component="span"
        key={`${part}-${index}`}
        sx={{ color: HABITAT_META[landscape].baseColor }}
      >
        {part}
      </Box>
    ) : (
      part
    )
  })
}

function EstimatedSection({
  accent,
  landscape,
  onLandscapeChange,
}: {
  accent: string
  landscape: Landscape
  onLandscapeChange: (landscape: Landscape) => void
}) {
  const method = landscapeMethods.find((item) => item.id === landscape) ?? landscapeMethods[0]
  const color = HABITAT_META[landscape].baseColor

  return (
    <Box component="section" id="estimated" aria-labelledby="estimated-title" sx={sectionSx}>
      <SectionHeading
        variant="h3"
        title="How were the benefits estimated?"
        id="estimated-title"
        accent={accent}
      />
      <Typography variant="body1" sx={{ color: 'base.50' }}>
        {estimationIntro}
      </Typography>

      {/* Steps in order along a rail; each node carries the step number */}
      <Box component="ol" sx={{ m: 0, p: 0, mt: jtSpacing.section.sm, listStyle: 'none' }}>
        {estimationSteps.map((step, index) => (
          <Box
            component="li"
            key={step.title}
            sx={{
              position: 'relative',
              display: 'grid',
              gridTemplateColumns: '40px minmax(0, 1fr)',
              columnGap: { xs: jtSpacing.gap.md, md: jtSpacing.gap.lg },
              pb: index === estimationSteps.length - 1 ? 0 : jtSpacing.component.lg,
              '&::before':
                index === estimationSteps.length - 1
                  ? undefined
                  : {
                      content: '""',
                      position: 'absolute',
                      left: 19,
                      top: 40,
                      bottom: 0,
                      borderLeft: 2,
                      borderColor: alpha(accent, 0.35),
                    },
            }}
          >
            <Box
              aria-hidden="true"
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                border: 2,
                borderColor: accent,
                display: 'grid',
                placeItems: 'center',
                bgcolor: 'base.800',
              }}
            >
              <Typography variant="numberBadge" component="span" sx={{ color: accent }}>
                {String(index + 1).padStart(2, '0')}
              </Typography>
            </Box>
            <Stack spacing={jtSpacing.gap.xs} sx={{ pt: 0.75 }}>
              <Typography variant="h4" component="h3">
                {step.title}
              </Typography>
              <Typography variant="body1" sx={{ color: 'base.100' }}>
                {step.body}
              </Typography>
            </Stack>
          </Box>
        ))}
      </Box>

      {/* Per-acre metrics for each landscape */}
      <Tabs
        value={landscape}
        onChange={(_, next: Landscape) => onLandscapeChange(next)}
        variant="scrollable"
        allowScrollButtonsMobile
        aria-label="Landscapes"
        sx={{
          mt: jtSpacing.section.sm,
          borderBottom: 1,
          borderColor: 'border.subtle',
          '& .MuiTabs-indicator': { bgcolor: color },
          '& .MuiTab-root.Mui-selected': { color },
        }}
      >
        {landscapeMethods.map((item, index) => (
          <Tab
            key={item.id}
            value={item.id}
            id={`landscape-${item.id}-tab`}
            aria-controls="landscape-panel"
            label={`${String(index + 1).padStart(2, '0')} ${item.label}`}
          />
        ))}
      </Tabs>

      <Box
        role="tabpanel"
        id="landscape-panel"
        aria-labelledby={`landscape-${landscape}-tab`}
        sx={{ pt: jtSpacing.section.sm }}
      >
        <Typography variant="body1" sx={{ color: 'base.50' }}>
          {method.summary}
        </Typography>

        <Box
          sx={{
            mt: jtSpacing.gap.lg,
            // Stacked: the content column is too narrow for the table beside the card
            display: 'grid',
            gap: jtSpacing.gap.lg,
          }}
        >
          <Box
            component="dl"
            sx={{ ...evaluationCardSx, m: 0, borderTop: 3, borderTopColor: color }}
          >
            {method.spec.map((row, index) => (
              <Box
                key={row.label}
                sx={{
                  py: jtSpacing.component.sm,
                  borderTop: index ? 1 : 0,
                  borderColor: 'border.subtle',
                }}
              >
                <Typography component="dt" variant="navigationSubLabel" sx={{ color: 'base.200' }}>
                  {row.label}
                </Typography>
                <Typography component="dd" variant="body2" sx={{ m: 0, mt: 0.5, color: 'base.50' }}>
                  {row.value}
                </Typography>
              </Box>
            ))}
          </Box>

          <Box component="figure" sx={{ m: 0 }}>
            <Typography
              component="figcaption"
              variant="navigationSubLabel"
              sx={{ color, mb: jtSpacing.gap.sm }}
            >
              Per-acre metrics
            </Typography>
            <Box
              sx={{ overflowX: 'auto', border: 1, borderColor: 'border.subtle', borderRadius: 1 }}
            >
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: alpha(color, 0.1) }}>
                    {['Benefit', 'Range', 'Average'].map((column) => (
                      <TableCell
                        key={column}
                        sx={{
                          typography: 'chartTitle',
                          color: 'base.50',
                          whiteSpace: 'nowrap',
                          borderBottom: 2,
                          borderBottomColor: color,
                        }}
                      >
                        {column}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {method.metrics.map((row) => (
                    <TableRow
                      key={row.benefit}
                      sx={{
                        '&:nth-of-type(even)': { bgcolor: 'translucent.100' },
                        '&:last-of-type td': { borderBottom: 0 },
                      }}
                    >
                      {[row.benefit, row.range, row.average ?? '—'].map((cell, index) => (
                        <TableCell
                          key={`${row.benefit}-${index}`}
                          sx={{
                            typography: 'body2',
                            color: index ? 'base.100' : 'common.white',
                            verticalAlign: 'top',
                            borderColor: 'border.subtle',
                          }}
                        >
                          {cell}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
            {method.metricNote && (
              <Typography
                component="p"
                variant="captionSmall"
                sx={{ color: 'base.200', mt: jtSpacing.gap.sm }}
              >
                {method.metricNote}
              </Typography>
            )}
          </Box>
        </Box>

        {method.caveat && (
          <Box
            sx={{
              mt: jtSpacing.gap.lg,
              p: jtSpacing.component.md,
              borderLeft: 3,
              borderColor: color,
              bgcolor: alpha(color, 0.06),
            }}
          >
            <Typography variant="navigationSubLabel" component="h3" sx={{ color }}>
              Caveat
            </Typography>
            <Typography variant="body2" sx={{ color: 'base.100', mt: jtSpacing.gap.xs }}>
              {method.caveat}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  )
}

/** A chart group's title and takeaways beside its chart, stacked below md. */
function OutcomeBlock({
  title,
  takeaways,
  accent,
  children,
}: {
  title: string
  takeaways: string[]
  accent: string
  children: ReactNode
}) {
  return (
    <Box sx={{ pt: jtSpacing.section.sm, borderTop: 1, borderColor: 'border.subtle' }}>
      <Typography variant="h4" component="h3">
        {title}
      </Typography>
      <Box
        component="ul"
        sx={{ m: 0, mt: jtSpacing.gap.sm, mb: jtSpacing.gap.lg, pl: jtSpacing.component.md }}
      >
        {takeaways.map((takeaway) => (
          <Typography
            key={takeaway}
            component="li"
            variant="body1"
            sx={{ display: 'list-item', color: 'base.100', '&::marker': { color: accent } }}
          >
            {takeaway}
          </Typography>
        ))}
      </Box>
      {children}
    </Box>
  )
}

function ChangesSection({ accent }: { accent: string }) {
  return (
    <Box component="section" id="changes" aria-labelledby="changes-title" sx={sectionSx}>
      <SectionHeading
        variant="h3"
        title="How would the watershed change?"
        id="changes-title"
        accent={accent}
      />
      <Typography variant="body1" sx={{ color: 'base.100', mb: jtSpacing.section.sm }}>
        {changesIntro}
      </Typography>
      <Box sx={{ mb: jtSpacing.section.sm }}>
        <RestorationLevelLegend />
      </Box>
      <Stack spacing={jtSpacing.section.sm}>
        {outcomeGroups.map((group) => (
          <OutcomeBlock
            key={group.id}
            title={group.title}
            takeaways={group.takeaways}
            accent={accent}
          >
            <Stack spacing={jtSpacing.section.sm}>
              {group.metrics.map(({ metric, label }) => (
                <ChangeRangeChart
                  key={metric}
                  title={label}
                  unit={outcomeUnits[metric]}
                  records={outcomes.filter((record) => record.metric === metric)}
                />
              ))}
            </Stack>
          </OutcomeBlock>
        ))}
        <OutcomeBlock title="Land cover" takeaways={landCoverTakeaways} accent={accent}>
          <LandCoverChart outcomes={outcomes} />
        </OutcomeBlock>
      </Stack>
    </Box>
  )
}

function UncertainSection({ accent }: { accent: string }) {
  return (
    <Box component="section" id="uncertain" aria-labelledby="uncertain-title" sx={sectionSx}>
      <SectionHeading
        variant="h3"
        title="What remains uncertain?"
        id="uncertain-title"
        accent={accent}
      />
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
          gap: jtSpacing.gap.lg,
        }}
      >
        {uncertainties.map((item) => (
          <Stack
            key={item.title}
            spacing={jtSpacing.gap.xs}
            sx={{ ...evaluationCardSx, borderTop: 3, borderTopColor: accent }}
          >
            <Typography variant="h5" component="h3">
              {item.title}
            </Typography>
            <Typography variant="body2" sx={{ color: 'base.100' }}>
              {item.body}
            </Typography>
          </Stack>
        ))}
      </Box>
    </Box>
  )
}
