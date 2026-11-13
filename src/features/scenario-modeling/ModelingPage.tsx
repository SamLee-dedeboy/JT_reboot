import { Box, Container } from '@mui/material'
import { useState } from 'react'
import {
  overviewNavigation,
  type Future,
  type ImplementationId,
  type OverviewSectionId,
} from '@/content/modeling'
import { jtSpacing, navigation } from '@/theme'
import { Footer, Navbar, PageHero, PageRail } from '@/ui'
import AdaptationScenariosSection from './components/AdaptationScenariosSection'
import BaselinesSection from './components/BaselinesSection'
import HowModeledSection from './components/HowModeledSection'
import ModeledSalinitySection from './components/ModeledSalinitySection'
import NextStepSection from './components/NextStepSection'
import OutflowVariationsSection from './components/OutflowVariationsSection'
import useActiveSection from './components/useActiveSection'

/** /scenarios/modeling: how each future is modeled, what the model shows, and what comes next. */
export default function ModelingPage() {
  const [selectedImplementationId, setSelectedImplementationId] = useState<ImplementationId>('eco')
  const [activeSection, setActiveSection] = useActiveSection()

  const showFuture = (future: Future) => {
    if (future.group !== 'outflow') setSelectedImplementationId(future.id)
    const target = future.group === 'outflow' ? 'outflow-variations' : 'scenario-implementations'
    document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <Navbar />
      <Box component="main" sx={{ bgcolor: 'base.800', color: 'common.white' }}>
        <PageHero
          title="Scenario Modeling"
          summary="See how the hydrodynamic model represents each future, then open the modeled results for the outflow variations and adaptation scenarios."
          image="/images/scenarios/web/cover.webp"
        />

        <Container maxWidth={false} sx={{ width: '90dvw', px: 0, py: 0 }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'minmax(0, 1fr)',
                lg: `${navigation.railColumn} minmax(0, 1fr)`,
              },
              columnGap: { lg: jtSpacing.section.md },
              alignItems: 'start',
            }}
          >
            <PageRail
              items={[...overviewNavigation]}
              ariaLabel="Modeling page sections"
              activeItemId={activeSection}
              onNavigate={(id) => setActiveSection(id as OverviewSectionId)}
              sx={{ gridColumn: { lg: 1 }, gridRow: { lg: '1 / span 3' } }}
            />

            {/* The method: what the model is, then one distinct block per question. */}
            <Box component="div" sx={{ gridColumn: { lg: 2 }, gridRow: { lg: 1 }, minWidth: 0 }}>
              <HowModeledSection />
              <BaselinesSection onSelectFuture={showFuture} />
              <OutflowVariationsSection />
              <AdaptationScenariosSection
                selectedImplementationId={selectedImplementationId}
                onSelectImplementation={setSelectedImplementationId}
              />
            </Box>
            <ModeledSalinitySection />
            <NextStepSection />
          </Box>
        </Container>
      </Box>
      <Footer />
    </>
  )
}
