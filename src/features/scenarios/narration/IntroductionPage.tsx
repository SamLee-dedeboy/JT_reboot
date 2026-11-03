import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { Box, Button, Container, Stack, Typography } from '@mui/material'
import { useState, type ReactNode } from 'react'
import { NavigationControl } from 'react-map-gl/mapbox'
import { Link, Navigate, useParams } from 'react-router-dom'
import BaseMap from '../../../map/BaseMap'
import Annotations from '../../../map/layers/scenarios/Annotations'
import Camera from '../../../map/layers/scenarios/Camera'
import Layers from '../../../map/layers/scenarios/Layers'
import Legend from '../../../map/layers/scenarios/Legend'
import SalinitySnapshot from '../../../map/layers/scenarios/SalinitySnapshot'
import { getConfig, getLegendItem } from '../../../map/layers/scenarios/config'
import { jtSpacing } from '../../../theme'
import Footer from '../../../ui/Footer'
import Navbar from '../../../ui/Navbar'
import PageRail from '../../../ui/PageRail'
import { assetUrl } from '../../../utils/baseUrl'
import { SCENARIO_EXPLORER_MAP_STYLE } from '../../scenario-explorer/mapConfig'
import StoryTabs from '../StoryTabs'
import { scenarioBySlug, storyInReadingOrder } from '../content'
import Highlight from './Highlight'
import ScenarioChip, { chipWidth } from './ScenarioChip'
import useMapState from './useMapState'

const scenarioDetailGridColumns = {
  xs: '1fr',
  lg: 'minmax(180px, .3fr) minmax(0, 1fr) minmax(320px, .9fr)',
} as const

const paragraphHighlights = [
  'the land to sink',
  'If a levee fails, water can rapidly flood the deeply subsided island.',
  'water salinity intrudes',
  'restoring watersheds',
  'multi-benefit',
  'within the Delta',
  'its much larger watershed',
] as const

const primaryBlueBoldHighlights = [
  'Eco Machine adds tens of thousands of acres of tidal wetland in Suisun Marsh and Franks Tract',
  'New Green Watershed delivers the largest gains of any scenario for the Delta’s ecosystem',
  'Those benefits depend on converting farmland.',
  "The shape of the Delta's landscapes and waterways",
  'tidal wetlands within the Delta',
  'Eco Machine explores restoration on Suisun Marsh and Franks Tract',
  'tidal energy',
  'this large open-water area is a primary source of salinity intrusion',
  'Transitional areas vary from subtidal to supratidal elevations.',
  'more room to move',
  'New Green Watershed does not envision one land use covering the entire Delta.',
  'a moderate cut in flood risk',
  'drinking-water conditions for vulnerable communities hold steady',
  'little changes for habitat, species, recreation, or eco-cultural values',
  'water in Franks Tract at times grows much older',
  'targeted infrastructure improvements',
  'During drought, these gates could limit saltwater movement',
  'These improvements could reduce the risk of levee failure and help maintain a reliable connection',
  'existing reservoirs are operated',
  'whether more flexible releases can keep the long-term reliability that reservoirs provide',
  'the timing and amount',
  'a specific reservoir as an example',
  'some Sacramento River water would be diverted into an underground tunnel',
  'A roughly 45-mile underground tunnel would transport diverted water south',
] as const

const primaryBlueHighlights = [
  'By building a set of landforms within the Tract, salty water would be mostly blocked from entering further into the Delta.',
] as const

const tieredOutflowsEmphasis = [
  'Sacramento',
  'San Joaquin Rivers',
  'pushes saltwater',
  'farther toward the ocean',
  'through reductions in exports',
  'Changing how much water flows through the Delta involves difficult trade-offs between competing water needs.',
  'seasonal timing',
  'critical factor for outcomes. Two of our other project scenarios',
] as const

const tieredOutflowsAccents = ['A Tunnel', 'Calling on Reserves'] as const

function HighlightedParagraph({
  text,
  tieredOutflows = false,
  boldPrimaryBlue = false,
}: {
  text: string
  tieredOutflows?: boolean
  boldPrimaryBlue?: boolean
}) {
  const parts: ReactNode[] = []
  let cursor = 0
  const contextualPrimaryBlueBoldHighlights = text.startsWith(
    'Calling on Reserves changes how existing reservoirs are operated',
  )
    ? ['Calling on Reserves']
    : []

  while (cursor < text.length) {
    const nextHighlight = [
      ...contextualPrimaryBlueBoldHighlights.map((phrase) => ({
        phrase,
        treatment: 'primaryBlueBold' as const,
      })),
      ...primaryBlueBoldHighlights.map((phrase) => ({
        phrase,
        treatment: 'primaryBlueBold' as const,
      })),
      ...primaryBlueHighlights.map((phrase) => ({
        phrase,
        treatment: 'primaryBlue' as const,
      })),
      ...paragraphHighlights.map((phrase) => ({
        phrase,
        treatment: boldPrimaryBlue ? ('primaryBlueBold' as const) : ('secondary' as const),
      })),
      ...(tieredOutflows
        ? tieredOutflowsEmphasis.map((phrase) => ({ phrase, treatment: 'emphasis' as const }))
        : []),
      ...(tieredOutflows
        ? tieredOutflowsAccents.map((phrase) => ({ phrase, treatment: 'accent' as const }))
        : []),
    ]
      .map((highlight) => ({
        ...highlight,
        index: text.indexOf(highlight.phrase, cursor),
      }))
      .filter(({ index }) => index >= 0)
      .sort((a, b) => a.index - b.index)[0]

    if (!nextHighlight) {
      parts.push(text.slice(cursor))
      break
    }

    if (nextHighlight.index > cursor) {
      parts.push(text.slice(cursor, nextHighlight.index))
    }

    if (nextHighlight.treatment === 'emphasis' || nextHighlight.treatment === 'primaryBlueBold') {
      parts.push(
        <Box
          component="strong"
          key={`${nextHighlight.phrase}-${nextHighlight.index}`}
          sx={{ color: 'secondary.main' }}
        >
          {nextHighlight.phrase}
        </Box>,
      )
    } else {
      parts.push(
        <Box
          component="span"
          key={`${nextHighlight.phrase}-${nextHighlight.index}`}
          sx={{
            color: nextHighlight.treatment === 'accent' ? 'primary.main' : 'secondary.main',
          }}
        >
          {nextHighlight.phrase}
        </Box>,
      )
    }
    cursor = nextHighlight.index + nextHighlight.phrase.length
  }

  return <>{parts}</>
}

const renderNarrationText = (text: string) => <HighlightedParagraph text={text} />
const renderBoldNarrationText = (text: string) => (
  <HighlightedParagraph text={text} boldPrimaryBlue />
)

export default function IntroductionPage() {
  const { scenarioSlug = '' } = useParams()
  const scenario = scenarioBySlug[scenarioSlug]
  const isTieredOutflows = scenarioSlug === 'tiered-outflows'
  const boldPrimaryBlue = scenarioSlug === 'new-green-watershed'
  const [selectedHabitatType, setSelectedHabitatType] = useState<string | null>(null)
  const mapConfig = getConfig(scenarioSlug)
  const mapState = useMapState(mapConfig)
  const showAdaptationLayers =
    mapConfig.legendActivation === 'always' ||
    mapState.showAdaptationLayers ||
    selectedHabitatType != null
  const cameraBounds =
    (selectedHabitatType ? mapConfig.selectionBounds?.[selectedHabitatType] : undefined) ??
    mapConfig.bounds[mapState.scope] ??
    mapConfig.bounds.delta

  if (!scenario) return <Navigate to="/scenarios" replace />
  const chapters = storyInReadingOrder(scenario)

  return (
    <>
      <Navbar />
      <Box component="main" sx={{ bgcolor: 'base.800', color: 'common.white' }}>
        {/* Establishes the scenario identity and the plain-language premise. */}
        <Box
          id="overview"
          component="header"
          sx={{
            position: 'relative',
            minHeight: { xs: 440, md: 560 },
            display: 'flex',
            alignItems: 'flex-end',
            isolation: 'isolate',
            '&::before': {
              content: '""',
              position: 'absolute',
              inset: 0,
              backgroundImage: (theme) =>
                `linear-gradient(90deg, ${theme.palette.translucent[900]}, ${theme.palette.translucent[600]}), url(${assetUrl(scenario.image)})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              zIndex: -1,
            },
          }}
        >
          <Container
            maxWidth={false}
            sx={{
              width: '90dvw',
              px: 0,
              py: { xs: jtSpacing.section.md, md: jtSpacing.section.lg },
              display: 'grid',
              gridTemplateColumns: scenarioDetailGridColumns,
              gap: { xs: jtSpacing.gap.xl, lg: jtSpacing.section.md },
            }}
          >
            <Stack
              spacing={jtSpacing.gap.md}
              sx={{
                gridColumn: { lg: '2 / 4' },
                maxWidth: jtSpacing.paragraphMaxWidth.default,
              }}
            >
              <Button
                component={Link}
                to="/scenarios"
                startIcon={<ArrowBackIcon />}
                sx={{ alignSelf: 'flex-start', color: 'base.100' }}
              >
                All scenarios
              </Button>
              {!isTieredOutflows && (
                <Typography variant="numberArticle">{scenario.number}</Typography>
              )}
              <Typography variant="h1">{scenario.title}</Typography>
              <Typography variant="body1" sx={{ color: 'base.50', maxWidth: '60ch' }}>
                {scenario.summary}
              </Typography>
              {scenario.comparisonNote && (
                <Typography
                  variant="meta"
                  sx={{
                    maxWidth: '64ch',
                    color: 'base.50',
                    borderLeft: 2,
                    borderColor: 'primary.main',
                    pl: jtSpacing.component.sm,
                  }}
                >
                  {scenario.comparisonNote}
                </Typography>
              )}
            </Stack>
          </Container>
        </Box>

        {!isTieredOutflows && <StoryTabs currentSlug={scenario.slug} />}

        {/* Keeps section navigation visible while the narrative is inspected. */}
        <Container
          maxWidth={false}
          sx={{
            width: '90dvw',
            px: 0,
            py: { xs: jtSpacing.section.lg, md: jtSpacing.section.xl },
          }}
        >
          <Box
            sx={{
              // Flex on small screens: a sticky grid item could not leave its own grid row.
              display: { xs: 'flex', lg: 'grid' },
              flexDirection: 'column',
              gridTemplateColumns: scenarioDetailGridColumns,
              gap: { xs: jtSpacing.gap.xl, lg: jtSpacing.section.md },
              alignItems: { xs: 'stretch', lg: 'start' },
            }}
          >
            <PageRail
              ariaLabel={`${scenario.title} sections`}
              items={chapters.map(({ anchor, label }) => ({ id: anchor, label }))}
            />

            {/* Carries the reader through one continuous scenario narrative. */}
            <Stack spacing={jtSpacing.section.lg}>
              {chapters.map(({ chapter, anchor }) => (
                <Box
                  component="section"
                  id={anchor}
                  key={chapter.title}
                  sx={{
                    scrollMarginTop: (theme) => theme.spacing(jtSpacing.section.lg),
                    pt: jtSpacing.section.md,
                    borderTop: 1,
                    borderColor: 'border.subtle',
                    ...(chapter.chip && {
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', sm: `${chipWidth}px minmax(0, 1fr)` },
                      columnGap: jtSpacing.component.md,
                      rowGap: jtSpacing.component.xs,
                    }),
                  }}
                >
                  {chapter.chip && (
                    <Box sx={{ gridRow: { sm: '1 / 3' }, justifySelf: 'start' }}>
                      <ScenarioChip>{chapter.chip}</ScenarioChip>
                    </Box>
                  )}
                  <Typography variant={chapter.chip ? 'h4' : 'h3'} component="h3">
                    {chapter.title}
                  </Typography>
                  <Stack
                    spacing={jtSpacing.gap.md}
                    sx={{
                      mt: jtSpacing.component.lg,
                      minWidth: 0,
                      ...(chapter.chip && { gridColumn: { sm: 2 } }),
                    }}
                  >
                    {chapter.paragraphs.map((paragraph) => (
                      <Typography variant="body1" key={paragraph} sx={{ color: 'base.100' }}>
                        <HighlightedParagraph
                          text={paragraph}
                          tieredOutflows={isTieredOutflows}
                          boldPrimaryBlue={boldPrimaryBlue}
                        />
                      </Typography>
                    ))}
                    {chapter.mapKey && (
                      <Box
                        aria-label={`${chapter.title} map key`}
                        role="group"
                        sx={{ mt: jtSpacing.component.md }}
                      >
                        {chapter.mapKey.map((selectionKey) => {
                          const symbol = getLegendItem(scenario.slug, selectionKey)
                          return (
                            symbol && (
                              <Highlight key={selectionKey} title={symbol.label} symbol={symbol} />
                            )
                          )
                        })}
                      </Box>
                    )}
                    {chapter.highlights && (
                      <Box
                        component="aside"
                        aria-label={`${chapter.title} interactive map layers`}
                        sx={{ mt: jtSpacing.component.md }}
                      >
                        {chapter.highlights.map((highlight) => {
                          const habitatType = highlight.mapSelectionKey ?? highlight.mapHabitatType
                          const symbol = habitatType
                            ? getLegendItem(scenario.slug, habitatType)
                            : undefined

                          return (
                            <Highlight
                              key={highlight.title}
                              title={highlight.title}
                              summary={highlight.summary}
                              paragraphs={highlight.paragraphs}
                              renderText={
                                boldPrimaryBlue ? renderBoldNarrationText : renderNarrationText
                              }
                              symbol={symbol}
                              selected={symbol != null && selectedHabitatType === habitatType}
                              dimmed={
                                symbol != null &&
                                selectedHabitatType != null &&
                                selectedHabitatType !== habitatType
                              }
                              onSelect={
                                habitatType
                                  ? () =>
                                      setSelectedHabitatType((current) =>
                                        current === habitatType ? null : habitatType,
                                      )
                                  : undefined
                              }
                            />
                          )
                        })}
                      </Box>
                    )}
                    {chapter.highlightsAction && (
                      <Button
                        component={Link}
                        to={chapter.highlightsAction.href}
                        variant="contained"
                        endIcon={<ArrowForwardIcon />}
                        sx={{ alignSelf: 'flex-start', mt: jtSpacing.component.lg }}
                      >
                        {chapter.highlightsAction.label}
                      </Button>
                    )}
                    {chapter.subsections?.map((subsection) => (
                      <Box
                        id={subsection.id}
                        key={subsection.title}
                        sx={{ pt: jtSpacing.component.lg }}
                      >
                        <Typography variant="h4" component="h4">
                          {subsection.title}
                        </Typography>
                        <Stack spacing={jtSpacing.gap.md} sx={{ mt: jtSpacing.component.md }}>
                          {subsection.paragraphs.map((paragraph) => (
                            <Typography variant="body1" key={paragraph} sx={{ color: 'base.100' }}>
                              <HighlightedParagraph
                                text={paragraph}
                                tieredOutflows={isTieredOutflows}
                                boldPrimaryBlue={boldPrimaryBlue}
                              />
                            </Typography>
                          ))}
                          {subsection.orderedItems && (
                            <Box
                              component="ol"
                              sx={{
                                m: 0,
                                pl: jtSpacing.component.xl,
                                color: 'base.100',
                              }}
                            >
                              {subsection.orderedItems.map((item) => (
                                <Typography
                                  component="li"
                                  variant="body1"
                                  key={item}
                                  sx={{ pl: jtSpacing.gap.sm }}
                                >
                                  {item}
                                </Typography>
                              ))}
                            </Box>
                          )}
                        </Stack>
                      </Box>
                    ))}
                    {chapter.endingParagraphs?.map((paragraph) => (
                      <Typography variant="body1" key={paragraph} sx={{ color: 'base.100' }}>
                        <HighlightedParagraph
                          text={paragraph}
                          tieredOutflows={isTieredOutflows}
                          boldPrimaryBlue={boldPrimaryBlue}
                        />
                      </Typography>
                    ))}
                    {chapter.primaryAction && (
                      <Button
                        component={Link}
                        to={chapter.primaryAction.href}
                        variant="outlined"
                        endIcon={<ArrowForwardIcon />}
                        sx={{ alignSelf: 'flex-start', mt: jtSpacing.component.lg }}
                      >
                        {chapter.primaryAction.label}
                      </Button>
                    )}
                    {chapter.relatedLinks && (
                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        useFlexGap
                        spacing={jtSpacing.gap.sm}
                        sx={{ flexWrap: 'wrap', mt: jtSpacing.component.md }}
                      >
                        {chapter.relatedLinks.map((link) => (
                          <Button
                            key={link.href}
                            component={Link}
                            to={link.href}
                            variant="outlined"
                            endIcon={<ArrowForwardIcon />}
                          >
                            {link.label}
                          </Button>
                        ))}
                      </Stack>
                    )}
                  </Stack>
                </Box>
              ))}
            </Stack>

            {/* Preserves the map inspection area beside the scenario narrative. */}
            <Box
              id="map-features"
              sx={{
                position: { xs: mapConfig.interactive ? 'sticky' : 'static', lg: 'sticky' },
                top: 110,
                // On small screens the map stays above the rows that control it.
                order: { xs: mapConfig.interactive ? -1 : 0, lg: 0 },
                zIndex: { xs: 1, lg: 'auto' },
                scrollMarginTop: 110,
              }}
            >
              <Box
                aria-label={`Interactive map for ${scenario.title}`}
                sx={{
                  height: { xs: mapConfig.interactive ? 300 : 360, lg: 'calc(100dvh - 110px)' },
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
                  initialViewState={mapConfig.initialViewState}
                  mapStyleUrl={mapConfig.mapStyleUrl ?? SCENARIO_EXPLORER_MAP_STYLE}
                  interactive={mapConfig.interactive}
                  dragPan={mapConfig.interactive}
                  dragRotate={false}
                  scrollZoom={mapConfig.interactive}
                  touchZoomRotate={mapConfig.interactive}
                  maxBounds={mapConfig.maxBounds}
                >
                  {cameraBounds && (
                    <Camera bounds={cameraBounds} topClearance={mapConfig.legendClearance} />
                  )}
                  {mapConfig.salinitySnapshotFrame != null && (
                    <SalinitySnapshot frame={mapConfig.salinitySnapshotFrame} />
                  )}
                  <Layers
                    scenarioSlug={scenario.slug}
                    showAdaptationLayers={showAdaptationLayers}
                    selectedHabitatType={selectedHabitatType}
                    visibilityScope={mapState.scope}
                  />
                  {mapConfig.annotations && <Annotations {...mapConfig.annotations} />}
                  {mapConfig.showNavigationControl && (
                    <NavigationControl position="bottom-right" showCompass={false} />
                  )}
                </BaseMap>
                <Legend
                  scenarioSlug={scenario.slug}
                  visibilityScope={mapState.scope}
                  visible={showAdaptationLayers}
                  selectedHabitatType={selectedHabitatType}
                />
              </Box>
            </Box>
          </Box>

          <Stack sx={{ mt: jtSpacing.section.xl, alignItems: 'center' }}>
            {scenario.closingParagraph && (
              <Typography variant="body1" sx={{ mb: jtSpacing.component.lg, color: 'base.100' }}>
                <HighlightedParagraph
                  text={scenario.closingParagraph}
                  boldPrimaryBlue={boldPrimaryBlue}
                />
              </Typography>
            )}
            <Button
              component={Link}
              to="/scenarios/modeling"
              variant="contained"
              endIcon={<ArrowForwardIcon />}
            >
              View Modeling results
            </Button>
          </Stack>
        </Container>
      </Box>
      <Footer />
    </>
  )
}
