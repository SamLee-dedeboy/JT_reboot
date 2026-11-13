import { Box, Container } from '@mui/material'
import { jtSpacing, navigation } from '@/theme'
import { Footer, Navbar, PageHero, PageRail, TeamIcon } from '@/ui'
import { criteria } from '@/content/criteria'
import { teamStyle } from '@/ui/teamStyle'
import HowComparedSection from './components/evaluation/HowComparedSection'
import HowEvaluatedSection from './components/evaluation/HowEvaluatedSection'
import TakeawaysSection from './components/evaluation/TakeawaysSection'
import useActiveSection from './components/evaluation/useActiveSection'

const sectionNavigation = [
  { id: 'how-evaluated', label: 'Comparative Scenario Evaluation' },
  ...criteria.map((team) => ({
    id: team.id,
    label: teamStyle[team.id].shortLabel,
    indent: true as const,
    color: teamStyle[team.id].color,
    icon: <TeamIcon team={teamStyle[team.id].icon} size={18} />,
  })),
  { id: 'scenario-results', label: 'Scenario takeaways' },
  { id: 'how-compared', label: 'How are scenarios compared?' },
] as const

type SectionId = (typeof sectionNavigation)[number]['id']
const sectionIds = sectionNavigation.map(({ id }) => id)

/** /scenarios/evaluation: how the five criteria evaluate the scenarios, and where to compare them. */
export default function EvaluationPage() {
  const [activeSection, setActiveSection] = useActiveSection(sectionIds, 'how-evaluated')

  return (
    <>
      <Navbar />
      <Box component="main" sx={{ bgcolor: 'base.800', color: 'common.white' }}>
        <PageHero
          title="Comparative Scenario Evaluation"
          summary="Five criteria examine the ecological, eco-cultural, community, recreational, and economic effects of every future scenario. Explore what each criterion measures, then compare results across scenarios."
        />

        <Container maxWidth={false} sx={{ width: '90dvw', px: 0, py: 0 }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', lg: `${navigation.railColumn} minmax(0, 1fr)` },
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
              sx={{ gridRow: { lg: '1 / span 3' } }}
            />

            <HowEvaluatedSection />

            <TakeawaysSection />

            <HowComparedSection />
          </Box>
        </Container>
      </Box>
      <Footer />
    </>
  )
}
