import { Box, Container } from '@mui/material'
import Footer from '../../../ui/Footer'
import Navbar from '../../../ui/Navbar'
import ModelingOverview from './ModelingOverview'
import ResultsHero from './ResultsHero'

export default function Page() {
  return (
    <>
      <Navbar />
      <Box component="main" sx={{ bgcolor: 'base.800', color: 'common.white' }}>
        <ResultsHero
          title="Scenario Modeling"
          summary="See how the hydrodynamic model represents each future, then open the modeled results for the outflow variations and adaptation scenarios."
          image="/images/scenarios/web/cover.webp"
        />

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
      </Box>
      <Footer />
    </>
  )
}
