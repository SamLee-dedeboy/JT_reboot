import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import MapOutlinedIcon from '@mui/icons-material/MapOutlined'
import { Box, Button, Container, Divider, Stack, Typography, useTheme } from '@mui/material'
import { Link, Navigate, useParams } from 'react-router-dom'
import Footer from '../../ui/Footer'
import Navbar from '../../ui/Navbar'
import NavRail from '../../ui/NavRail'
import { assetUrl } from '../../utils/baseUrl'
import { evaluationCriteria, scenarioBySlug, scenarios } from './content/scenarioContent'

export default function ScenarioTemplatePage() {
  const { scenarioSlug = '' } = useParams()
  const scenario = scenarioBySlug[scenarioSlug]
  const theme = useTheme()
  if (!scenario) return <Navigate to="/scenarios" replace />
  const index = scenarios.findIndex((item) => item.slug === scenario.slug)
  const next = scenarios[(index + 1) % scenarios.length]

  return (
    <>
      <Navbar />
      <Box component="main" sx={{ bgcolor: 'base.800', color: 'common.white' }}>
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
              backgroundImage: `linear-gradient(90deg, rgba(16,22,24,.94), rgba(16,22,24,.42)), url(${assetUrl(scenario.image)})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              zIndex: -1,
            },
          }}
        >
          <Container
            maxWidth="xl"
            sx={{ py: { xs: theme.jtSpacing.section.md, md: theme.jtSpacing.section.lg } }}
          >
            <Stack
              spacing={theme.jtSpacing.gap.md}
              sx={{ maxWidth: theme.jtSpacing.paragraphMaxWidth.default }}
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
              <Typography variant="body1" sx={{ color: 'base.50', maxWidth: '58ch' }}>
                {scenario.summary}
              </Typography>
            </Stack>
          </Container>
        </Box>

        <Container
          maxWidth="xl"
          sx={{ py: { xs: theme.jtSpacing.section.lg, md: theme.jtSpacing.section.xl } }}
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                lg: 'minmax(170px, .38fr) minmax(0, 1fr) minmax(0, 1fr)',
              },
              gap: { xs: theme.jtSpacing.gap.xl, lg: theme.jtSpacing.section.md },
              alignItems: 'start',
            }}
          >
            <Stack
              component="aside"
              spacing={theme.jtSpacing.gap.md}
              sx={{ position: { lg: 'sticky' }, top: { lg: 110 } }}
            >
              <Typography variant="h5">Evaluation criteria</Typography>
              <NavRail
                ariaLabel={`${scenario.title} sections`}
                items={evaluationCriteria.map(({ id, label }) => ({ id, label }))}
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
            </Stack>

            <Stack spacing={theme.jtSpacing.section.md}>
              <Box id="key-parameters" sx={{ scrollMarginTop: 110 }}>
                <Typography variant="eyebrow">Scenario inputs</Typography>
                <Typography variant="h3" sx={{ mt: 1, mb: 3 }}>
                  Key parameters
                </Typography>
                <Stack divider={<Divider flexItem />}>
                  {scenario.keyParameters.map((parameter) => (
                    <Box key={parameter.label} sx={{ py: 2.25, display: 'grid', gap: 0.5 }}>
                      <Typography variant="captionSmall">{parameter.label}</Typography>
                      <Typography variant="h5" sx={{ color: 'primary.main' }}>
                        {parameter.value}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
              <Box id="narrative" sx={{ scrollMarginTop: 110 }}>
                <Typography variant="h3" sx={{ mb: 2 }}>
                  Narrative
                </Typography>
                <Stack spacing={2}>
                  {scenario.narrative.map((paragraph) => (
                    <Typography key={paragraph} variant="body2">
                      {paragraph}
                    </Typography>
                  ))}
                </Stack>
              </Box>
            </Stack>

            <Stack id="map-features" spacing={theme.jtSpacing.gap.md} sx={{ scrollMarginTop: 110 }}>
              <Typography variant="eyebrow">Spatial view</Typography>
              <Typography variant="h3">Map features</Typography>
              <Box
                sx={{
                  minHeight: { xs: 360, lg: 620 },
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: 1,
                  border: 1,
                  borderColor: 'base.400',
                  bgcolor: 'base.700',
                  backgroundImage: `linear-gradient(rgba(20,29,31,.38), rgba(20,29,31,.88)), url(${assetUrl(scenario.image)})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <Stack
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    p: { xs: 3, md: 4 },
                    justifyContent: 'flex-end',
                  }}
                  spacing={2}
                >
                  <MapOutlinedIcon color="primary" fontSize="large" />
                  <Typography variant="h4">Interactive map coming next</Typography>
                  <Stack component="ul" spacing={1} sx={{ m: 0, pl: 2.5 }}>
                    {scenario.mapFeatures.map((feature) => (
                      <Typography component="li" variant="body2" key={feature}>
                        {feature}
                      </Typography>
                    ))}
                  </Stack>
                </Stack>
              </Box>
            </Stack>
          </Box>

          <Stack spacing={theme.jtSpacing.section.md} sx={{ mt: theme.jtSpacing.section.xl }}>
            {evaluationCriteria.map((criterion) => (
              <Box
                id={criterion.id}
                key={criterion.id}
                sx={{
                  minHeight: 180,
                  scrollMarginTop: 110,
                  py: theme.jtSpacing.section.md,
                  borderTop: 1,
                  borderColor: 'base.400',
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: '.55fr 1fr' },
                  gap: theme.jtSpacing.gap.lg,
                }}
              >
                <Typography variant="h3">{criterion.label}</Typography>
                <Typography variant="body2">
                  Evaluation content for {scenario.title} will be added here as the scenario
                  analysis is finalized.
                </Typography>
              </Box>
            ))}
            <Button
              component={Link}
              to={`/scenarios/${next.slug}`}
              variant="contained"
              endIcon={<ArrowForwardIcon />}
              sx={{ alignSelf: 'flex-end' }}
            >
              Next: {next.title}
            </Button>
          </Stack>
        </Container>
      </Box>
      <Footer />
    </>
  )
}
