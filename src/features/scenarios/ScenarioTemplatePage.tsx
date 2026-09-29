import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { Box, Button, Container, Stack, Typography } from '@mui/material'
import { useEffect, useState, type ReactNode } from 'react'
import { NavigationControl } from 'react-map-gl/mapbox'
import { Link, Navigate, useParams } from 'react-router-dom'
import BaseMap from '../../map/BaseMap'
import ScenarioMapCamera from '../../map/layers/ScenarioMapCamera'
import ScenarioMapLegend from '../../map/layers/ScenarioMapLegend'
import ScenarioMapLayers from '../../map/layers/ScenarioMapLayers'
import Footer from '../../ui/Footer'
import Navbar from '../../ui/Navbar'
import NavRail from '../../ui/NavRail'
import { jtSpacing, map } from '../../theme'
import { assetUrl } from '../../utils/baseUrl'
import { SCENARIO_EXPLORER_MAP_STYLE } from '../scenario-explorer/mapConfig'
import { scenarioBySlug } from './content/scenarioContent'
import ScenarioNarrativeHighlight from './ScenarioNarrativeHighlight'
import ScenarioTabs from './ScenarioTabs'

const scenarioDetailGridColumns = {
  xs: '1fr',
  lg: 'minmax(180px, .3fr) minmax(0, 1fr) minmax(320px, .9fr)',
} as const

const scenarioMapViewState = {
  longitude: -121.73,
  latitude: 38.04,
  zoom: 8.75,
} as const

const californiaMapBounds = [
  [-124.6, 32.4],
  [-114, 42.1],
] as [[number, number], [number, number]]

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
        sx={{ color: 'primary.main' }}
      >
        {nextHighlight.phrase}
      </Box>,
    )
    cursor = nextHighlight.index + nextHighlight.phrase.length
  }

  return <>{parts}</>
}

export default function ScenarioTemplatePage() {
  const { scenarioSlug = '' } = useParams()
  const scenario = scenarioBySlug[scenarioSlug]
  const isNewGreenWatershed = scenarioSlug === 'new-green-watershed'
  const [selectedHabitatType, setSelectedHabitatType] = useState<string | null>(null)
  const [showAdaptationLayers, setShowAdaptationLayers] = useState(false)
  const [showStatewideMap, setShowStatewideMap] = useState(false)
  const [showEcoculturalLayers, setShowEcoculturalLayers] = useState(false)
  const effectiveShowAdaptationLayers = isNewGreenWatershed && showAdaptationLayers
  const effectiveShowStatewideMap = isNewGreenWatershed && showStatewideMap
  const effectiveShowEcoculturalLayers = isNewGreenWatershed && showEcoculturalLayers

  useEffect(() => {
    if (!isNewGreenWatershed) return

    const adaptationSection = document.getElementById('chapter-2')
    const supportingStrategySection = document.getElementById('chapter-3')
    if (!adaptationSection || !supportingStrategySection) return

    let animationFrame = 0
    let statewideTransitionTimer: number | undefined
    const updateCameraMode = () => {
      cancelAnimationFrame(animationFrame)
      animationFrame = requestAnimationFrame(() => {
        const readingThreshold = window.innerHeight * 0.25
        const hasReachedAdaptation =
          adaptationSection.getBoundingClientRect().top <= readingThreshold
        const hasReachedSupportingStrategy =
          supportingStrategySection.getBoundingClientRect().top <= readingThreshold

        if (hasReachedSupportingStrategy) {
          setShowAdaptationLayers(false)
          if (statewideTransitionTimer == null) {
            statewideTransitionTimer = window.setTimeout(() => {
              setShowStatewideMap(true)
            }, map.scenarios.layerFadeDurationMs)
          }
        } else {
          if (statewideTransitionTimer != null) {
            window.clearTimeout(statewideTransitionTimer)
            statewideTransitionTimer = undefined
          }
          setShowStatewideMap(false)
          setShowAdaptationLayers(hasReachedAdaptation)
        }
      })
    }

    updateCameraMode()
    window.addEventListener('scroll', updateCameraMode, { passive: true })
    window.addEventListener('resize', updateCameraMode)

    return () => {
      cancelAnimationFrame(animationFrame)
      if (statewideTransitionTimer != null) window.clearTimeout(statewideTransitionTimer)
      window.removeEventListener('scroll', updateCameraMode)
      window.removeEventListener('resize', updateCameraMode)
    }
  }, [isNewGreenWatershed])

  useEffect(() => {
    if (!isNewGreenWatershed) return

    const ecoculturalSection = document.getElementById('ecocultural-stewardship')
    if (!ecoculturalSection) return

    let animationFrame = 0
    const updateEcoculturalLayers = () => {
      cancelAnimationFrame(animationFrame)
      animationFrame = requestAnimationFrame(() => {
        const readingThreshold = window.innerHeight * 0.25
        setShowEcoculturalLayers(ecoculturalSection.getBoundingClientRect().top <= readingThreshold)
      })
    }

    updateEcoculturalLayers()
    window.addEventListener('scroll', updateEcoculturalLayers, { passive: true })
    window.addEventListener('resize', updateEcoculturalLayers)

    return () => {
      cancelAnimationFrame(animationFrame)
      window.removeEventListener('scroll', updateEcoculturalLayers)
      window.removeEventListener('resize', updateEcoculturalLayers)
    }
  }, [isNewGreenWatershed])

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
              <Typography variant="numberArticle">{scenario.number}</Typography>
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

        <ScenarioTabs currentSlug={scenario.slug} />

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
                items={scenario.story.map((_, chapterIndex) => ({
                  id: `chapter-${chapterIndex + 1}`,
                  label:
                    scenarioSectionNavigationLabels[chapterIndex] ?? `Section ${chapterIndex + 1}`,
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
                          const accentColor = highlight.mapHabitatType
                            ? map.scenarios.newGreenWatershedHabitats[highlight.mapHabitatType]
                            : map.boundaries.watershedRegion

                          return (
                            <ScenarioNarrativeHighlight
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
                  initialViewState={scenarioMapViewState}
                  mapStyleUrl={SCENARIO_EXPLORER_MAP_STYLE}
                  interactive={scenario.slug === 'new-green-watershed'}
                  dragPan={scenario.slug === 'new-green-watershed'}
                  dragRotate={false}
                  scrollZoom={scenario.slug === 'new-green-watershed'}
                  touchZoomRotate={scenario.slug === 'new-green-watershed'}
                  maxBounds={californiaMapBounds}
                >
                  <ScenarioMapCamera statewide={effectiveShowStatewideMap} />
                  <ScenarioMapLayers
                    scenarioSlug={scenario.slug}
                    showAdaptationLayers={effectiveShowAdaptationLayers}
                    selectedHabitatType={selectedHabitatType}
                    visibilityScope={
                      effectiveShowStatewideMap
                        ? effectiveShowEcoculturalLayers
                          ? 'statewide-ecocultural'
                          : 'statewide'
                        : 'delta'
                    }
                  />
                  {scenario.slug === 'new-green-watershed' && (
                    <NavigationControl position="bottom-right" showCompass={false} />
                  )}
                </BaseMap>
                {!effectiveShowStatewideMap && (
                  <ScenarioMapLegend
                    scenarioSlug={scenario.slug}
                    visible={effectiveShowAdaptationLayers}
                    selectedHabitatType={selectedHabitatType}
                  />
                )}
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
