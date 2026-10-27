import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { Box, Button, Container, Stack, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { jtSpacing } from '../../../theme'
import Footer from '../../../ui/Footer'
import Navbar from '../../../ui/Navbar'
import PageRail from '../../../ui/PageRail'
import TeamIcon from '../../../ui/TeamIcon'
import { evaluationTeams, resultFamilies } from '../content'
import { teamStyle } from '../teamStyle'
import EvaluationFramework from './EvaluationFramework'
import ResultsHero from './ResultsHero'
import { fullBleedBand } from './styles'

const sectionNavigation = [
  { id: 'how-evaluated', label: 'How are scenarios evaluated?' },
  ...evaluationTeams.map((team) => ({
    id: team.id,
    label: teamStyle[team.id].shortLabel,
    indent: true as const,
    color: teamStyle[team.id].color,
    icon: <TeamIcon team={teamStyle[team.id].icon} size={18} />,
  })),
  { id: 'scenario-results', label: 'Scenario results' },
  { id: 'how-compared', label: 'How are scenarios compared?' },
] as const

type SectionId = (typeof sectionNavigation)[number]['id']

/** Result families a visitor can open, each showing every criterion's view of one scenario. */
const scenarioFamilies = resultFamilies.filter((family) => family.id !== 'overview')

const sectionSx = {
  gridColumn: { lg: 2 },
  scrollMarginTop: 110,
  p: { xs: jtSpacing.component.lg, md: jtSpacing.component.xl },
} as const

function useActiveSection() {
  const [activeSection, setActiveSection] = useState<SectionId>('how-evaluated')

  useEffect(() => {
    const elements = sectionNavigation
      .map(({ id }) => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element))
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter(({ isIntersecting }) => isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActiveSection(visible.target.id as SectionId)
      },
      { rootMargin: '-28% 0px -58% 0px', threshold: [0, 0.2, 0.5] },
    )
    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  return [activeSection, setActiveSection] as const
}

export default function EvaluationPage() {
  const [activeSection, setActiveSection] = useActiveSection()

  return (
    <>
      <Navbar />
      <Box component="main" sx={{ bgcolor: 'base.800', color: 'common.white' }}>
        <ResultsHero
          title="How scenarios are evaluated"
          summary="Five criteria examine the ecological, cultural, community, recreational, and economic effects of every future. Explore what each criterion measures, then compare results across scenarios."
        />

        <Container maxWidth={false} sx={{ width: '90dvw', px: 0, py: 0 }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', lg: 'minmax(180px, .3fr) minmax(0, 1.92fr)' },
              gap: { xs: jtSpacing.gap.xl, lg: 0 },
              columnGap: { lg: jtSpacing.section.md },
              alignItems: 'start',
            }}
          >
            {/* Claude structure: the five criteria sit under the evaluation step they belong to. */}
            <PageRail
              items={[...sectionNavigation]}
              ariaLabel="Evaluation sections"
              activeItemId={activeSection}
              onNavigate={(id) => setActiveSection(id as SectionId)}
              sx={{
                gridRow: { lg: '1 / span 3' },
                pt: { xs: jtSpacing.component.lg, md: jtSpacing.component.xl },
              }}
            />

            <Box
              component="section"
              id="how-evaluated"
              aria-labelledby="how-evaluated-title"
              sx={[
                { ...sectionSx, gridRow: { lg: 1 } },
                (theme) => fullBleedBand(theme.palette.base[700]),
              ]}
            >
              <Typography id="how-evaluated-title" variant="h2" sx={{ mb: jtSpacing.gap.md }}>
                How are scenarios evaluated?
              </Typography>
              {/* GPT draft: public introduction; Claude's page composition remains unchanged. */}
              <Typography variant="body1" sx={{ mb: jtSpacing.section.md, color: 'base.100' }}>
                No single model can describe everything a future might mean for the Delta. A change
                that improves water quality in one place may affect habitat, community safety,
                recreation, Tribal relationships, or agricultural livelihoods somewhere else.
              </Typography>
              <Typography variant="body1" sx={{ mb: jtSpacing.section.md, color: 'base.100' }}>
                Each criterion uses its own metrics, evidence, and methods. Together, the criteria
                show where scenarios create benefits, introduce costs, or involve trade-offs that
                cannot be represented by a single measure.
              </Typography>
              <EvaluationFramework showIntroduction={false} />
            </Box>

            <Box
              component="section"
              id="scenario-results"
              aria-labelledby="scenario-results-title"
              sx={[
                { ...sectionSx, gridRow: { lg: 2 } },
                (theme) => fullBleedBand(theme.palette.base[600]),
              ]}
            >
              <Typography id="scenario-results-title" variant="h2">
                Scenario results
              </Typography>
              <Typography
                variant="body1"
                sx={{ mt: jtSpacing.gap.md, color: 'base.100', maxWidth: '78ch' }}
              >
                Pick a scenario to see its modeled results alongside findings from every evaluation
                criterion.
              </Typography>
              {/* The families overview comes first: how each family fared before any one scenario. */}
              <Button
                component={Link}
                to="/scenarios/evaluation/families"
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                sx={{ mt: jtSpacing.component.lg }}
              >
                The three families at a glance
              </Button>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                useFlexGap
                spacing={jtSpacing.gap.sm}
                sx={{
                  mt: jtSpacing.component.lg,
                  flexWrap: 'wrap',
                  alignItems: { xs: 'stretch', sm: 'center' },
                }}
              >
                {scenarioFamilies.map((family) => (
                  <Button key={family.id} component={Link} to={family.href} variant="outlined">
                    {family.label}
                  </Button>
                ))}
              </Stack>
            </Box>

            <Box
              component="section"
              id="how-compared"
              aria-labelledby="how-compared-title"
              sx={[
                { ...sectionSx, gridRow: { lg: 3 } },
                (theme) => fullBleedBand(theme.palette.base[800]),
              ]}
            >
              <Typography id="how-compared-title" variant="h2">
                How are scenarios compared?
              </Typography>
              <Typography
                variant="body1"
                sx={{ mt: jtSpacing.gap.md, color: 'base.100', maxWidth: '78ch' }}
              >
                Each criterion places every scenario on a −5 to +5 scale, with the shared baseline
                fixed at 0. A score shows the direction and size of change from baseline. Each
                criterion defines how its underlying metrics and qualitative evidence translate into
                that common scale.
              </Typography>
              <Button
                component={Link}
                to="/scenarios/ranking"
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                sx={{ mt: jtSpacing.component.lg }}
              >
                Open ranking visualization
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
      <Footer />
    </>
  )
}
