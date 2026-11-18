import { Box, Container, Stack, useMediaQuery, useTheme } from '@mui/material'
import { useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { scenarioBySlug, storyInReadingOrder, storyScenarios } from '@/content/scenarios'
import { jtSpacing, navigation } from '@/theme'
import { Footer, Navbar, NavRail } from '@/ui'
import MobileStoryNav from './components/story/MobileStoryNav'
import NextScenarioCard from './components/story/NextScenarioCard'
import StoryChapter from './components/story/StoryChapter'
import StoryClosing from './components/story/StoryClosing'
import StoryHero from './components/story/StoryHero'
import { storyGridColumns } from './components/story/storyLayout'
import StoryMap from './components/story/StoryMap'
import StoryTabs from './components/story/StoryTabs'

/**
 * /scenarios/:scenarioSlug: the scenario's story beside its map. From lg up a rail, the
 * scenario tabs and a sticky map column frame the text; below lg the text runs alone and a
 * bottom dock (MobileStoryNav) carries the chapters, the map and the way between scenarios.
 */
export default function StoryPage() {
  const theme = useTheme()
  const isLgUp = useMediaQuery(theme.breakpoints.up('lg'), { noSsr: true })
  const { scenarioSlug = '' } = useParams()
  const scenario = scenarioBySlug[scenarioSlug]
  const isTieredOutflows = scenarioSlug === 'tiered-outflows'
  const boldPrimaryBlue = scenarioSlug === 'new-green-watershed'
  const [selectedHabitatType, setSelectedHabitatType] = useState<string | null>(null)

  if (!scenario) return <Navigate to="/scenarios" replace />
  const chapters = storyInReadingOrder(scenario)
  const storyIndex = storyScenarios.findIndex((story) => story.slug === scenario.slug)
  const scenarioSteps =
    storyIndex === -1
      ? undefined
      : {
          previous: storyScenarios[storyIndex - 1],
          next: storyScenarios[storyIndex + 1],
          total: storyScenarios.length,
        }

  return (
    <>
      <Navbar />
      <Box component="main" sx={{ bgcolor: 'base.800', color: 'common.white' }}>
        <StoryHero
          scenario={scenario}
          isTieredOutflows={isTieredOutflows}
          scenarioSteps={isLgUp ? undefined : scenarioSteps}
        />
        {isLgUp && !isTieredOutflows && <StoryTabs currentSlug={scenario.slug} />}

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
              display: { xs: 'block', lg: 'grid' },
              gridTemplateColumns: storyGridColumns,
              gap: jtSpacing.section.md,
              alignItems: 'start',
            }}
          >
            {isLgUp && (
              <NavRail
                variant="page"
                ariaLabel={`${scenario.title} sections`}
                items={chapters.map(({ anchor, label }) => ({ id: anchor, label }))}
              />
            )}
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
            {isLgUp && <StoryMap scenario={scenario} selectedHabitatType={selectedHabitatType} />}
          </Box>

          <StoryClosing scenario={scenario} boldPrimaryBlue={boldPrimaryBlue} />
          {!isLgUp && scenarioSteps && <NextScenarioCard next={scenarioSteps.next} />}
        </Container>
      </Box>
      <Footer />

      {/* Below lg: the bottom dock, and room under the footer so it never covers it. */}
      {!isLgUp && (
        <>
          <MobileStoryNav
            scenario={scenario}
            chapters={chapters}
            selectedHabitatType={selectedHabitatType}
            onSelectHabitat={setSelectedHabitatType}
            isTieredOutflows={isTieredOutflows}
          />
          <Box
            aria-hidden="true"
            sx={{ height: navigation.bottomDock.clearance, bgcolor: 'base.900' }}
          />
        </>
      )}
    </>
  )
}
