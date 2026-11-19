import { Box } from '@mui/material'
import { Footer, Navbar, PageHero } from '@/ui'
import ActionPathSection from './components/ActionPathSection'
import { GOVERNANCE_HERO } from './content'

/** /pages/governance: which Adaptation Plan actions each scenario relies on, and which they share. */
export default function GovernancePage() {
  return (
    <>
      <Navbar />
      <Box component="main" sx={{ bgcolor: 'base.800', color: 'common.white' }}>
        <PageHero
          title={GOVERNANCE_HERO.title}
          summary={GOVERNANCE_HERO.summary.map((run) =>
            typeof run === 'string' ? run : <em key={run.em}>{run.em}</em>,
          )}
        />
        <ActionPathSection />
      </Box>
      <Footer />
    </>
  )
}
