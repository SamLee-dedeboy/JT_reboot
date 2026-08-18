import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { Box, Button, Container, Stack, Typography } from '@mui/material'
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom'
import Footer from '../../ui/Footer'
import Navbar from '../../ui/Navbar'
import { jtSpacing } from '../../theme'
import { assetUrl } from '../../utils/baseUrl'
import { evaluationCriteria, evaluationMetrics, scenarioBySlug } from './content/scenarioContent'
import ScenarioTabs from './ScenarioTabs'

const explorerScenarioKeys: Record<string, string> = {
  'business-as-usual': 'bau',
  'eco-machine': 'ecomachine',
  'new-green-watershed': 'newgreen',
  'bolster-and-fortify': 'bolster',
  'calling-on-reserves': 'reserve',
  'a-tunnel': 'tunnel',
}

function EvaluationMetricPanel({ criterionId }: { criterionId: keyof typeof evaluationMetrics }) {
  const metric = evaluationMetrics[criterionId]

  return (
    <Box
      aria-label={metric.heading}
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, minmax(0, 220px))' },
        gap: { xs: jtSpacing.gap.sm, sm: jtSpacing.gap.lg },
      }}
    >
      {metric.items.map((item, itemIndex) => (
        <Stack
          key={item}
          direction="row"
          spacing={jtSpacing.gap.md}
          sx={{ alignItems: 'baseline', minWidth: 0 }}
        >
          <Typography variant="numberBadge" component="span" aria-hidden="true">
            {String(itemIndex + 1).padStart(2, '0')}
          </Typography>
          <Typography variant="navigationLabel" component="span">
            {item}
          </Typography>
        </Stack>
      ))}
    </Box>
  )
}

export default function ScenarioResultsPage() {
  const { scenarioSlug = '' } = useParams()
  const [searchParams] = useSearchParams()
  const scenario = scenarioBySlug[scenarioSlug]
  if (!scenario) return <Navigate to="/scenarios" replace />

  const explorerKey = explorerScenarioKeys[scenario.slug]
  const seaLevelRise = searchParams.get('seaLevelRise') === 'true'

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
                `linear-gradient(90deg, ${theme.palette.translucent[900]}, ${theme.palette.translucent[700]}), url(${assetUrl(scenario.image)})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            },
          }}
        >
          <Container maxWidth="lg">
            <Stack spacing={jtSpacing.gap.md} sx={{ maxWidth: '70ch' }}>
              <Button
                component={Link}
                to={`/scenarios/${scenario.slug}`}
                startIcon={<ArrowBackIcon />}
                sx={{ alignSelf: 'flex-start', color: 'base.100' }}
              >
                Back to scenario story
              </Button>
              <Typography variant="eyebrow" sx={{ color: 'primary.main' }}>
                {scenario.title}
              </Typography>
              <Typography variant="h1">Modeling results and evaluation criteria</Typography>
              <Typography variant="body1" sx={{ color: 'base.50' }}>
                Review modeled outcomes and the shared criteria used to compare this adaptation
                scenario with other Delta futures.
              </Typography>
            </Stack>
          </Container>
        </Box>

        <ScenarioTabs currentSlug={scenario.slug} destination="results" />

        <Container
          maxWidth="lg"
          sx={{ py: { xs: jtSpacing.section.lg, md: jtSpacing.section.xl } }}
        >
          <Stack spacing={jtSpacing.section.xl}>
            <Box component="section" aria-labelledby="modeling-results-title">
              <Stack spacing={jtSpacing.gap.md} sx={{ alignItems: 'flex-start' }}>
                <Typography variant="eyebrow" sx={{ color: 'primary.main' }}>
                  Modeling results
                </Typography>
                <Typography id="modeling-results-title" variant="h2">
                  Explore modeled outcomes for {scenario.title}
                </Typography>
                <Typography variant="body1" sx={{ color: 'base.100', maxWidth: '70ch' }}>
                  Open the interactive explorer to inspect modeled salinity patterns through time
                  and across monitoring locations.
                </Typography>
                <Button
                  component={Link}
                  to={`/pages/scenario-explorer/internal?scenario=${explorerKey}${seaLevelRise ? '&seaLevelRise=true' : ''}`}
                  variant="contained"
                  endIcon={<ArrowForwardIcon />}
                >
                  Open modeling explorer
                </Button>
              </Stack>
            </Box>

            <Box component="section" aria-labelledby="evaluation-criteria-title">
              <Typography variant="eyebrow" sx={{ color: 'primary.main' }}>
                Evaluation framework
              </Typography>
              <Typography id="evaluation-criteria-title" variant="h2" sx={{ mt: jtSpacing.gap.sm }}>
                Evaluation criteria
              </Typography>
              <Stack spacing={0} sx={{ mt: jtSpacing.section.md }}>
                {evaluationCriteria.map((criterion) => (
                  <Box
                    id={criterion.id}
                    key={criterion.id}
                    sx={{
                      scrollMarginTop: 110,
                      py: jtSpacing.section.sm,
                      borderTop: 1,
                      borderColor: 'border.subtle',
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', md: 'minmax(180px, .3fr) 1fr' },
                      gap: { xs: jtSpacing.gap.lg, md: jtSpacing.section.md },
                      alignItems: 'baseline',
                    }}
                  >
                    <Typography variant="h4" component="h3">
                      {criterion.label}
                    </Typography>
                    <EvaluationMetricPanel criterionId={criterion.id} />
                  </Box>
                ))}
              </Stack>
            </Box>
          </Stack>
        </Container>
      </Box>
      <Footer />
    </>
  )
}
