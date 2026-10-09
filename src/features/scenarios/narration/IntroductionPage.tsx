import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { Box, Button, Container, Stack, Typography } from '@mui/material'
import { useState, type ReactNode } from 'react'
import { NavigationControl } from 'react-map-gl/mapbox'
import { Link, Navigate, useParams } from 'react-router-dom'
import BaseMap from '../../../map/BaseMap'
import NarrativeMapCamera from '../../../map/layers/scenarios/NarrativeMapCamera'
import NarrativeMapLayers from '../../../map/layers/scenarios/NarrativeMapLayers'
import NarrativeMapLegend from '../../../map/layers/scenarios/NarrativeMapLegend'
import {
  getNarrativeMapConfig,
  getNarrativeMapLegendItem,
} from '../../../map/layers/scenarios/narrativeMapConfig'
import { jtSpacing } from '../../../theme'
import Footer from '../../../ui/Footer'
import Navbar from '../../../ui/Navbar'
import NavRail from '../../../ui/NavRail'
import { assetUrl } from '../../../utils/baseUrl'
import { SCENARIO_EXPLORER_MAP_STYLE } from '../../scenario-explorer/mapConfig'
import StoryTabs from '../StoryTabs'
import { scenarioBySlug } from '../content'
import NarrativeHighlight from './NarrativeHighlight'
import useNarrativeMapState from './useNarrativeMapState'

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

const scenarioSectionNavigationLabels = [
  'Motivation',
  'Adaptation approach',
  'Supporting strategy',
  'Key Takeaway',
] as const

function HighlightedParagraph({ text }: { text: string }) {
  const parts: ReactNode[] = []
  let cursor = 0

  while (cursor < text.length) {
    const nextHighlight = paragraphHighlights
      .map((phrase) => ({ phrase, index: text.indexOf(phrase, cursor) }))
      .filter(({ index }) => index >= 0)
      .sort((a, b) => a.index - b.index)[0]

    if (!nextHighlight) {
      parts.push(text.slice(cursor))
      break
    }

    if (nextHighlight.index > cursor) {
      parts.push(text.slice(cursor, nextHighlight.index))
    }

    parts.push(
      <Box
        component="span"
        key={`${nextHighlight.phrase}-${nextHighlight.index}`}
        sx={{ color: 'secondary.main' }}
      >
        {nextHighlight.phrase}
      </Box>,
    )
    cursor = nextHighlight.index + nextHighlight.phrase.length
  }

  return <>{parts}</>
}

export default function IntroductionPage() {
  const { scenarioSlug = '' } = useParams()
  const scenario = scenarioBySlug[scenarioSlug]
  const isTieredOutflows = scenarioSlug === 'tiered-outflows'
  const [selectedHabitatType, setSelectedHabitatType] = useState<string | null>(null)
  const narrativeMapConfig = getNarrativeMapConfig(scenarioSlug)
  const narrativeMapState = useNarrativeMapState(narrativeMapConfig)
  const cameraBounds =
    narrativeMapConfig.bounds[narrativeMapState.scope] ?? narrativeMapConfig.bounds.delta

  if (!scenario) return <Navigate to="/scenarios" replace />

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
              display: 'grid',
              gridTemplateColumns: scenarioDetailGridColumns,
              gap: { xs: jtSpacing.gap.xl, lg: jtSpacing.section.md },
              alignItems: 'start',
            }}
          >
            <Box component="aside" sx={{ position: { lg: 'sticky' }, top: { lg: 148 } }}>
              <Typography
                variant="eyebrow"
                sx={{ display: 'block', color: 'base.200', mb: jtSpacing.component.md }}
              >
                On this page
              </Typography>
              <NavRail
                ariaLabel={`${scenario.title} sections`}
                items={scenario.story.map((chapter, chapterIndex) => ({
                  id: `chapter-${chapterIndex + 1}`,
                  label:
                    chapter.navigationLabel ??
                    (isTieredOutflows
                      ? chapter.title
                      : (scenarioSectionNavigationLabels[chapterIndex] ??
                        `Section ${chapterIndex + 1}`)),
                }))}
                sx={{
                  position: 'relative',
                  inset: 'auto',
                  transform: 'none',
                  zIndex: 1,
                  display: 'flex !important',
                  alignItems: 'flex-start',
                  '& button': { justifyContent: 'flex-start', flexDirection: 'row-reverse' },
                }}
              />
            </Box>

            {/* Carries the reader through one continuous scenario narrative. */}
            <Stack spacing={jtSpacing.section.lg}>
              {scenario.story.map((chapter, chapterIndex) => (
                <Box
                  component="section"
                  id={`chapter-${chapterIndex + 1}`}
                  key={chapter.title}
                  sx={{
                    scrollMarginTop: (theme) => theme.spacing(jtSpacing.section.lg),
                    pt: jtSpacing.section.md,
                    borderTop: 1,
                    borderColor: 'border.subtle',
                  }}
                >
                  <Typography variant="h3" component="h3">
                    {chapter.title}
                  </Typography>
                  <Stack spacing={jtSpacing.gap.md} sx={{ mt: jtSpacing.component.lg }}>
                    {chapter.paragraphs.map((paragraph) => (
                      <Typography variant="body1" key={paragraph} sx={{ color: 'base.100' }}>
                        <HighlightedParagraph text={paragraph} />
                      </Typography>
                    ))}
                    {chapter.highlights && (
                      <Box
                        component="aside"
                        aria-label={`${chapter.title} interactive map layers`}
                        sx={{
                          mt: jtSpacing.component.md,
                          p: { xs: jtSpacing.component.xs, md: jtSpacing.component.sm },
                          border: 1,
                          borderColor: 'base.300',
                          borderRadius: 1,
                          bgcolor: 'translucent.100',
                          '& > * + *': {
                            borderTop: 1,
                            borderColor: 'border.default',
                          },
                        }}
                      >
                        {chapter.highlights.map((highlight) => {
                          const habitatType = highlight.mapHabitatType ?? highlight.exploreHabitat
                          const accentColor =
                            (habitatType
                              ? getNarrativeMapLegendItem(scenario.slug, habitatType)?.color
                              : undefined) ?? narrativeMapConfig.highlightFallbackColor

                          return (
                            <NarrativeHighlight
                              key={highlight.title}
                              title={highlight.title}
                              summary={highlight.summary}
                              paragraphs={highlight.paragraphs}
                              accentColor={accentColor}
                              selected={selectedHabitatType === habitatType}
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
                              <HighlightedParagraph text={paragraph} />
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
                        <HighlightedParagraph text={paragraph} />
                      </Typography>
                    ))}
                    {chapter.primaryAction && (
                      <Button
                        component={Link}
                        to={chapter.primaryAction.href}
                        variant="contained"
                        endIcon={<ArrowForwardIcon />}
                        sx={{ alignSelf: 'flex-start', mt: jtSpacing.component.lg }}
                      >
                        {chapter.primaryAction.label}
                      </Button>
                    )}
                  </Stack>
                </Box>
              ))}
            </Stack>

            {/* Preserves the map inspection area beside the scenario narrative. */}
            <Box
              id="map-features"
              sx={{
                position: { lg: 'sticky' },
                top: { lg: 110 },
                scrollMarginTop: 110,
              }}
            >
              <Box
                aria-label={`Interactive map for ${scenario.title}`}
                sx={{
                  height: { xs: 360, lg: 'calc(100dvh - 110px)' },
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
                  initialViewState={narrativeMapConfig.initialViewState}
                  mapStyleUrl={SCENARIO_EXPLORER_MAP_STYLE}
                  interactive={narrativeMapConfig.interactive}
                  dragPan={narrativeMapConfig.interactive}
                  dragRotate={false}
                  scrollZoom={narrativeMapConfig.interactive}
                  touchZoomRotate={narrativeMapConfig.interactive}
                  maxBounds={narrativeMapConfig.maxBounds}
                >
                  {cameraBounds && <NarrativeMapCamera bounds={cameraBounds} />}
                  <NarrativeMapLayers
                    scenarioSlug={scenario.slug}
                    showAdaptationLayers={narrativeMapState.showAdaptationLayers}
                    selectedHabitatType={selectedHabitatType}
                    visibilityScope={narrativeMapState.scope}
                  />
                  {narrativeMapConfig.showNavigationControl && (
                    <NavigationControl position="bottom-right" showCompass={false} />
                  )}
                </BaseMap>
                <NarrativeMapLegend
                  scenarioSlug={scenario.slug}
                  visibilityScope={narrativeMapState.scope}
                  visible={
                    narrativeMapConfig.legendActivation !== 'adaptation' ||
                    narrativeMapState.showAdaptationLayers
                  }
                  selectedHabitatType={selectedHabitatType}
                />
              </Box>
            </Box>
          </Box>

          <Stack sx={{ mt: jtSpacing.section.xl, alignItems: 'center' }}>
            <Button
              component={Link}
              to={`/scenarios/${scenario.slug}/results`}
              variant="contained"
              endIcon={<ArrowForwardIcon />}
            >
              Explore modeling results and evaluation criteria
            </Button>
          </Stack>
        </Container>
      </Box>
      <Footer />
    </>
  )
}
