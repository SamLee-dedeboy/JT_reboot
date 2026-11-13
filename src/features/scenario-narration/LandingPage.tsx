import { Box } from '@mui/material'
import { ADAPTATION_CARDS, LANDING_PANELS } from '@/content/landing'
import { Footer, Navbar } from '@/ui'
import { assetUrl } from '@/utils/baseUrl'
import LandingHero from './components/landing/LandingHero'
import ScenarioPanels from './components/landing/ScenarioPanels'
import usePreloadImages from './components/landing/usePreloadImages'

/** Photos the sticky panels show further down the page, fetched once the hero has painted. */
const panelImages = [
  assetUrl(LANDING_PANELS[0].image),
  assetUrl('/images/scenarios/web/outflow.webp'),
  ...ADAPTATION_CARDS.map((item) => item.image),
]

/** /scenarios: the cover, then one sticky panel per way into the scenarios. */
export default function LandingPage() {
  usePreloadImages(panelImages)

  return (
    <>
      <Navbar />
      <Box component="main" sx={{ bgcolor: 'base.800', color: 'common.white', overflowX: 'clip' }}>
        <LandingHero />
        <ScenarioPanels />
      </Box>
      <Footer />
    </>
  )
}
