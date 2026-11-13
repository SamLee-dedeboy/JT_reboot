import { Box, Container } from '@mui/material'
import { Footer, Navbar, PageHero } from '@/ui'
import AdaptationFamily from './components/families/AdaptationFamily'
import OutflowFamily from './components/families/OutflowFamily'
import SeaLevelRiseFamily from './components/families/SeaLevelRiseFamily'

/** /scenarios/evaluation/families. Evaluation step: how the criteria judged each family of futures, before any one scenario. */
export default function FamiliesPage() {
  return (
    <>
      <Navbar />
      <Box component="main" sx={{ bgcolor: 'base.800', color: 'common.white' }}>
        <PageHero
          title="The three families at a glance"
          summary="Before looking at one scenario through every criterion, see how the criteria judged each family of futures: the outflow variations, the adaptation scenarios, and the adaptation scenarios with two feet of sea-level rise."
        />
        <Container maxWidth="lg">
          <OutflowFamily />

          <AdaptationFamily />

          <SeaLevelRiseFamily />
        </Container>
      </Box>
      <Footer />
    </>
  )
}
