import { Box, Container } from '@mui/material'
import { jtSpacing } from '@/theme'
import { Footer, Navbar, PageHero } from '@/ui'
import ScenarioFindings from './components/takeaways/ScenarioFindings'

/** /scenarios/evaluation/takeaways. Evaluation step: one scenario through all five criteria, on a map of the places they name. */
export default function TakeawaysPage() {
  return (
    <>
      <Navbar />
      <Box component="main" sx={{ bgcolor: 'base.800', color: 'common.white' }}>
        <PageHero
          title="Scenario takeaways"
          summary="Choose a scenario to see what all five criteria found, and where. Each pin is a place a team named, in its color, with what it measured there."
        />
        <Container maxWidth="xl" sx={{ py: jtSpacing.section.md }}>
          <ScenarioFindings />
        </Container>
      </Box>
      <Footer />
    </>
  )
}
