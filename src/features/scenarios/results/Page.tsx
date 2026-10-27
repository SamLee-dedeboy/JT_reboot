import { Box, Container, Stack, Typography } from '@mui/material'
import { Navigate, useParams, useSearchParams } from 'react-router-dom'
import { jtSpacing } from '../../../theme'
import Footer from '../../../ui/Footer'
import Navbar from '../../../ui/Navbar'
import StoryTabs from '../StoryTabs'
import {
  adaptationScenarios,
  outflowResultVariations,
  scenarioBySlug,
  slrScenarioSlugs,
  tieredOutflowsScenario,
} from '../content'
import { FamilyNavigation, OutflowTabs, type ResultFamily } from './Navigation'
import { explorerHref as explorerLink } from './explorerLinks'
import ModelingOverview from './ModelingOverview'
import ResultsHero from './ResultsHero'
import ScenarioResults from './ScenarioResults'

export default function Page() {
  const { scenarioSlug } = useParams()
  const [searchParams] = useSearchParams()
  const isOverview = !scenarioSlug
  const isOutflow = scenarioSlug === tieredOutflowsScenario.slug
  const scenario = scenarioSlug ? scenarioBySlug[scenarioSlug] : undefined
  const isAdaptation = adaptationScenarios.some((item) => item.slug === scenarioSlug)

  if (!isOverview && (!scenario || (!isOutflow && !isAdaptation))) {
    return <Navigate to="/scenarios/modeling" replace />
  }

  const variationId = searchParams.get('variation') ?? outflowResultVariations[0].id
  const variation =
    outflowResultVariations.find((item) => item.id === variationId) ?? outflowResultVariations[0]
  const slrAvailable =
    isAdaptation && slrScenarioSlugs.includes(scenarioSlug as (typeof slrScenarioSlugs)[number])
  const seaLevelRise = slrAvailable && searchParams.get('seaLevelRise') === 'true'
  const family: ResultFamily = isOverview
    ? 'overview'
    : isOutflow
      ? 'outflow'
      : seaLevelRise
        ? 'adaptation-slr'
        : 'adaptation'
  const heroImage = isOverview
    ? '/images/scenarios/web/cover.webp'
    : isOutflow
      ? tieredOutflowsScenario.image
      : scenario?.image
  const resultTitle = isOutflow ? variation.title : scenario?.title
  const resultSummary = isOutflow
    ? variation.summary
    : `Review how ${scenario?.title} changes modeled outcomes relative to baseline operations.`
  const explorerHref = explorerLink(
    isOutflow
      ? { outflowExplorerKey: variation.explorerKey }
      : { scenarioSlug: scenarioSlug ?? '' },
  )

  return (
    <>
      <Navbar />
      <Box component="main" sx={{ bgcolor: 'base.800', color: 'common.white' }}>
        <ResultsHero
          title={
            isOverview ? 'How scenarios are modeled' : 'Modeling results and evaluation criteria'
          }
          summary={
            isOverview
              ? 'See how the hydrodynamic model represents each future, then open the modeled results for the outflow variations and adaptation scenarios.'
              : 'Review modeled outcomes and the shared criteria used to compare each Delta future against baseline operations.'
          }
          image={heroImage}
        >
          <FamilyNavigation
            activeFamily={family}
            scenarioSlug={isAdaptation ? scenarioSlug : undefined}
            slrAvailable={slrAvailable}
          />
        </ResultsHero>

        {isOutflow && <OutflowTabs activeVariation={variation.id} />}
        {isAdaptation && scenarioSlug && (
          <StoryTabs
            currentSlug={scenarioSlug}
            destination="results"
            search={seaLevelRise ? '?seaLevelRise=true' : undefined}
            availableSlugs={seaLevelRise ? slrScenarioSlugs : undefined}
          />
        )}

        {isOverview ? (
          <Container
            maxWidth={false}
            sx={{
              width: '90dvw',
              px: 0,
              py: 0,
            }}
          >
            <ModelingOverview />
          </Container>
        ) : (
          <Container
            maxWidth="lg"
            sx={{ py: { xs: jtSpacing.section.lg, md: jtSpacing.section.xl } }}
          >
            <Stack spacing={jtSpacing.section.lg}>
              <Box component="section" aria-labelledby="scenario-result-title">
                <Typography id="scenario-result-title" variant="h2">
                  {resultTitle}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ mt: jtSpacing.gap.md, color: 'base.100', maxWidth: '78ch' }}
                >
                  {resultSummary}
                </Typography>
              </Box>
              <ScenarioResults
                scenarioSlug={scenarioSlug ?? ''}
                scenarioTitle={resultTitle ?? ''}
                outflowVariation={isOutflow ? variation.id : undefined}
                explorerHref={explorerHref}
              />
            </Stack>
          </Container>
        )}
      </Box>
      <Footer />
    </>
  )
}
