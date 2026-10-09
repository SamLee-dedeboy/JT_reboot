import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import {
  Box,
  Button,
  Container,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material'
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom'
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
import EvaluationFramework from './EvaluationFramework'
import { FamilyNavigation, OutflowTabs, type ResultFamily } from './Navigation'
import Overview from './Overview'

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

  const family: ResultFamily = isOverview ? 'overview' : isOutflow ? 'outflow' : 'adaptation'
  const variationId = searchParams.get('variation') ?? outflowResultVariations[0].id
  const variation =
    outflowResultVariations.find((item) => item.id === variationId) ?? outflowResultVariations[0]
  const seaLevelRise = isAdaptation && searchParams.get('seaLevelRise') === 'true'
  const slrAvailable =
    isAdaptation && slrScenarioSlugs.includes(scenarioSlug as (typeof slrScenarioSlugs)[number])
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
    : `/pages/scenario-explorer/internal?scenario=${explorerScenarioKeys[scenarioSlug ?? '']}${seaLevelRise ? '&seaLevelRise=true' : ''}`

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
              <FamilyNavigation activeFamily={family} />
            </Stack>
          </Container>
        </Box>

        {isOutflow && <OutflowTabs activeVariation={variation.id} />}
        {isAdaptation && scenarioSlug && (
          <StoryTabs currentSlug={scenarioSlug} destination="results" />
        )}

        <Container
          maxWidth="lg"
          sx={{ py: { xs: jtSpacing.section.lg, md: jtSpacing.section.xl } }}
        >
          {isOverview ? (
            <Overview />
          ) : (
            <Stack spacing={jtSpacing.section.xl}>
              <Box component="section" aria-labelledby="scenario-result-title">
                <Stack spacing={jtSpacing.gap.md} sx={{ alignItems: 'flex-start' }}>
                  <Typography id="scenario-result-title" variant="h2">
                    {resultTitle}
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'base.100', maxWidth: '78ch' }}>
                    {resultSummary}
                  </Typography>

                  {isAdaptation && (
                    <Stack spacing={jtSpacing.gap.sm} sx={{ alignItems: 'flex-start' }}>
                      <Typography variant="navigationLabel" component="p">
                        Sea-level condition
                      </Typography>
                      {slrAvailable ? (
                        <ToggleButtonGroup
                          exclusive
                          value={seaLevelRise ? 'slr' : 'present'}
                          aria-label="Sea-level condition"
                        >
                          <ToggleButton
                            component={Link}
                            to={`/scenarios/${scenarioSlug}/results`}
                            value="present"
                          >
                            Present-day conditions
                          </ToggleButton>
                          <ToggleButton
                            component={Link}
                            to={`/scenarios/${scenarioSlug}/results?seaLevelRise=true`}
                            value="slr"
                          >
                            +2 ft sea-level rise
                          </ToggleButton>
                        </ToggleButtonGroup>
                      ) : (
                        <Typography variant="body2" sx={{ color: 'base.200' }}>
                          Two-foot sea-level-rise results are not currently available for this
                          scenario.
                        </Typography>
                      )}
                    </Stack>
                  )}

                  <Button
                    component={Link}
                    to={explorerHref}
                    variant="contained"
                    endIcon={<ArrowForwardIcon />}
                  >
                    Open modeling explorer
                  </Button>
                </Stack>
              </Box>

              <EvaluationFramework />
            </Stack>
          )}
        </Container>
      </Box>
      <Footer />
    </>
  )
}
