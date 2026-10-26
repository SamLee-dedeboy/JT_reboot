import { Box, Container, Stack, Typography } from '@mui/material'
import { Navigate, useParams, useSearchParams } from 'react-router-dom'
import { jtSpacing } from '../../../theme'
import Footer from '../../../ui/Footer'
import Navbar from '../../../ui/Navbar'
import { assetUrl } from '../../../utils/baseUrl'
import StoryTabs from '../StoryTabs'
import {
  adaptationScenarios,
  outflowResultVariations,
  scenarioBySlug,
  slrScenarioSlugs,
  tieredOutflowsScenario,
} from '../content'
import { FamilyNavigation, OutflowTabs, type ResultFamily } from './Navigation'
import Overview from './Overview'
import ScenarioResults from './ScenarioResults'

const explorerScenarioKeys: Record<string, string> = {
  'eco-machine': 'ecomachine',
  'new-green-watershed': 'newgreen',
  'bolster-and-fortify': 'bolster',
  'calling-on-reserves': 'reserve',
  'a-tunnel': 'tunnel',
}

export default function Page() {
  const { scenarioSlug } = useParams()
  const [searchParams] = useSearchParams()
  const isOverview = !scenarioSlug
  const isOutflow = scenarioSlug === tieredOutflowsScenario.slug
  const scenario = scenarioSlug ? scenarioBySlug[scenarioSlug] : undefined
  const isAdaptation = adaptationScenarios.some((item) => item.slug === scenarioSlug)

  if (!isOverview && (!scenario || (!isOutflow && !isAdaptation))) {
    return <Navigate to="/scenarios/results" replace />
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
    ? '/images/scenarios/cover.jpg'
    : isOutflow
      ? tieredOutflowsScenario.image
      : scenario?.image
  const resultTitle = isOutflow ? variation.title : scenario?.title
  const resultSummary = isOutflow
    ? variation.summary
    : `Review how ${scenario?.title} changes modeled outcomes relative to baseline operations.`
  const explorerHref = isOutflow
    ? `/pages/scenario-explorer?mode=tiered-outflows&scenario=${variation.explorerKey}`
    : `/pages/scenario-explorer?scenario=${explorerScenarioKeys[scenarioSlug ?? '']}`

  return (
    <>
      <Navbar />
      <Box component="main" sx={{ bgcolor: 'base.800', color: 'common.white' }}>
        <Box
          component="header"
          sx={{
            position: 'relative',
            isolation: 'isolate',
            py: { xs: jtSpacing.section.lg, md: jtSpacing.section.xl },
            '&::before': {
              content: '""',
              position: 'absolute',
              inset: 0,
              zIndex: -1,
              backgroundImage: (theme) =>
                `linear-gradient(90deg, ${theme.palette.translucent[900]} 0%, ${theme.palette.translucent[700]} 52%, ${theme.palette.translucent[300]} 100%), url(${assetUrl(heroImage ?? '/images/scenarios/cover.jpg')})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            },
          }}
        >
          <Container maxWidth="lg">
            <Stack spacing={jtSpacing.gap.lg} sx={{ maxWidth: '78ch' }}>
              <Typography variant="h1">Modeling results and evaluation criteria</Typography>
              <Typography variant="bodyLarge" sx={{ color: 'base.50' }}>
                Review modeled outcomes and the shared criteria used to compare each Delta future
                against baseline operations.
              </Typography>
              <FamilyNavigation
                activeFamily={family}
                scenarioSlug={isAdaptation ? scenarioSlug : undefined}
                slrAvailable={slrAvailable}
              />
            </Stack>
          </Container>
        </Box>

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
            <Overview />
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
