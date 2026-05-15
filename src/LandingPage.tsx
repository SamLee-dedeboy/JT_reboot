import { Link } from 'react-router-dom'
import { Box, Button, Container, useTheme } from '@mui/material'
import Navbar from './components/Navbar'
import HeroMap from './components/maps/HeroMap.tsx'
import Footer from './components/Footer'
import TextColumns from './components/TextColumns'
import OurApproach from './components/OurApproach'
import InfoSection from './components/InfoSection'
import { assetUrl } from './utils/baseUrl'

function LandingPage() {
  const theme = useTheme()

  return (
    <>
      <Navbar />
      <main className="landing-main">
        <HeroMap />
        <Box sx={{ bgcolor: '#222f34', py: { xs: theme.jtSpacing.component.sm, md: theme.jtSpacing.component.md } }}>
          <Container>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button component={Link} to="/pages/adaptation-scenarios" variant="contained" color="primary">
                View Adaptation Scenarios
              </Button>
            </Box>
          </Container>
        </Box>

        <TextColumns columns={[
          {
            title: 'What Are Scenarios?',
            text: 'Scenarios are models and depictions of possible futures and the pathways through which they could manifest. Participatory scenario planning is a "bottom up" approach that involves working directly with public contributors to create and evaluate future scenarios for a particular place.',
          },
          {
            title: 'Why Participatory Scenario Planning?',
            text: 'Scenario planning is an approach increasingly used in conservation and climate change adaptation research, especially when uncertainty, vulnerability, and divergent stakeholder interests create conflicting mandates. By envisioning diverse ways in which climate, governance and ecosystems might co-evolve, scenario-based planning offers tools to reflect on current actions and goals, and in turn, fosters shared learning and socio-technical innovation.',
          },
        ]} />

        <OurApproach />

        <TextColumns columns={[
          {
            title: "What's at Stake?",
            text: "The Bay-Delta region holds immense economic, ecological, and cultural significance, yet funding for research in this area has historically lagged behind other large-scale waterbodies. In addition, the lack of estuary-scale approaches for envisioning alternative futures and evaluating tradeoffs through inclusive public engagement has seen limited progress. Furthermore, the complex science-governance nexus of this area has often been fraught with conflict due to fragmented governance and competing demands on the region's natural resources. As a consequence, responses to climate management in the Delta have often been short-term 'bandaid' solutions with significant and possibly inequitable tradeoffs, leaving long-term solutions unclear.",
          },
          {
            title: 'Drought, Salinity & Sea-Level Rise',
            text: 'During extreme drought years, the amount of water required to be released from reservoirs to keep salinity from entering the Delta is nearly the same amount that is available for water use in the Delta and exported to southern California. These managed water releases for salinity control are intended to protect both in-Delta uses as well as this major source of exports to central and southern California. If ocean tides were to push salinity into the southern Delta—which would be accelerated by sea-level rise—the recovery of freshwater exports would take months to years. As drought stretches into multiple years and reservoir water supplies become more limited, controlling salinity becomes problematic, typically involving reduced exports, temporary relaxation of salinity standards in some parts of the Delta, and the construction of emergency barriers that redirect tidal energy away from the southern Delta. While effective at decreasing the amount of water needed to maintain salinity in the southern Delta, each of these actions has tradeoffs for different groups of people and ecosystems.',
          },
        ]} />

        <Box component="section" sx={{ bgcolor: 'secondary.dark', color: 'common.white', py: { xs: theme.jtSpacing.component.md, md: theme.jtSpacing.section.lg } }}>
          <Container>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: theme.jtSpacing.gap.lg, alignItems: 'center' }}>
              <Box sx={{ flex: 1 }}>
                <Box component="blockquote" sx={{ m: 0, pl: theme.jtSpacing.component.md, borderLeft: 4, borderColor: 'primary.main', typography: 'body1', lineHeight: 1.8 }}>
                  Salinity management in the Delta during drought has historically been done on an emergency basis.
                  However, with future droughts and sea-level rise more likely, long-range planning that creatively
                  visions new futures for salinity management while holistically considering the tradeoffs associated
                  with those futures is needed.
                </Box>
              </Box>
              <Box sx={{ flex: 1, textAlign: 'center' }}>
                <Box sx={{ typography: { xs: 'h4', md: 'h3' }, color: 'common.white' }}>
                  The Just Transitions in the Delta project aims to address this need.
                </Box>
              </Box>
            </Box>
          </Container>
        </Box>

        <InfoSection
          title="How Our Project Works"
          text="Our project aims to raise awareness of the tradeoffs involved in managing the Sacramento-San Joaquin Delta amid future droughts and rising sea levels. Through collaborative design of future scenarios, community dialogue, advanced modeling and visualization, and co-learning that emphasizes underrepresented voices, we build shared understanding of what's possible and what's at stake."
          imagePosition="right"
          imageSrc={assetUrl('/images/workshop-session.jpg')}
          imageAlt="Community workshop session"
        >
          <Box sx={{ mt: theme.jtSpacing.component.md }}>
            <Button component={Link} to="/pages/adaptation-scenarios" variant="contained" color="primary">
              View Adaptation Scenarios
            </Button>
          </Box>
        </InfoSection>

        <Footer />
      </main>
    </>
  )
}

export default LandingPage
