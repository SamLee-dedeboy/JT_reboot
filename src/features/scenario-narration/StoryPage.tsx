import { Box, Container, Stack } from '@mui/material'
import { useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { scenarioBySlug, storyInReadingOrder } from '@/content/scenarios'
import { jtSpacing } from '@/theme'
import { Footer, Navbar, PageRail } from '@/ui'
import StoryChapter from './components/story/StoryChapter'
import StoryClosing from './components/story/StoryClosing'
import StoryHero from './components/story/StoryHero'
import { storyGridColumns } from './components/story/storyLayout'
import StoryMap from './components/story/StoryMap'
import StoryTabs from './components/story/StoryTabs'

/** /scenarios/:scenarioSlug: the scenario's story beside its map. */
export default function StoryPage() {
  const { scenarioSlug = '' } = useParams()
  const scenario = scenarioBySlug[scenarioSlug]
  const isTieredOutflows = scenarioSlug === 'tiered-outflows'
  const boldPrimaryBlue = scenarioSlug === 'new-green-watershed'
  const [selectedHabitatType, setSelectedHabitatType] = useState<string | null>(null)

  if (!scenario) return <Navigate to="/scenarios" replace />
  const chapters = storyInReadingOrder(scenario)

  return (
    <>
      <Navbar />
      <Box component="main" sx={{ bgcolor: 'base.800', color: 'common.white' }}>
        <StoryHero scenario={scenario} isTieredOutflows={isTieredOutflows} />
        {!isTieredOutflows && <StoryTabs currentSlug={scenario.slug} />}

        <Container
          maxWidth={false}
          sx={{
            width: '90dvw',
            px: 0,
            py: { xs: jtSpacing.section.lg, md: jtSpacing.section.xl },
          }}
        >
          <Box
            sx={{
              // Flex on small screens: a sticky grid item could not leave its own grid row.
              display: { xs: 'flex', lg: 'grid' },
              flexDirection: 'column',
              gridTemplateColumns: storyGridColumns,
              gap: { xs: jtSpacing.gap.xl, lg: jtSpacing.section.md },
              alignItems: { xs: 'stretch', lg: 'start' },
            }}
          >
            <PageRail
              ariaLabel={`${scenario.title} sections`}
              items={chapters.map(({ anchor, label }) => ({ id: anchor, label }))}
            />
            <Stack spacing={jtSpacing.section.lg}>
              {chapters.map(({ chapter, anchor }) => (
                <StoryChapter
                  key={chapter.title}
                  chapter={chapter}
                  anchor={anchor}
                  scenarioSlug={scenario.slug}
                  isTieredOutflows={isTieredOutflows}
                  boldPrimaryBlue={boldPrimaryBlue}
                  selectedHabitatType={selectedHabitatType}
                  onSelectHabitat={setSelectedHabitatType}
                />
              ))}
            </Stack>
            <StoryMap scenario={scenario} selectedHabitatType={selectedHabitatType} />
          </Box>

          <StoryClosing scenario={scenario} boldPrimaryBlue={boldPrimaryBlue} />
        </Container>
      </Box>
      <Footer />
    </>
  )
}
