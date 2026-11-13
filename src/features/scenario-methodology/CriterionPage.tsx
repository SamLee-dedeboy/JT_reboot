// One evaluation team's criterion, condensed from its "Story Behind the
// Criterion" report into a technical summary: what it is, why it matters, how
// it was built, and how each component is measured. Scenario results live on
// the per-scenario team pages.
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { Box, Button, Container, Stack } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { Link, Navigate, useParams } from 'react-router-dom'
import { jtSpacing, navigation } from '@/theme'
import { Footer, Navbar, PageHero, PageRail, TeamIcon } from '@/ui'
import { criterionById } from '@/content/criteria'
import { teamStyle } from '@/ui/teamStyle'
import { findTeam, methodologyPath } from '@/content/routes'
import { CitationContext } from './components/criterion/citationContext'
import TeamTabs from './components/criterion/TeamTabs'
import { pageSections } from './components/criterion/criterionLayout'
import WhatSection from './components/criterion/WhatSection'
import WhySection from './components/criterion/WhySection'
import RegionsSection from './components/criterion/RegionsSection'
import ComponentsSection from './components/criterion/ComponentsSection'
import ConstructionSection from './components/criterion/ConstructionSection'
import ReferencesSection from './components/criterion/ReferencesSection'

export default function CriterionPage() {
  const { teamId } = useParams()
  const team = findTeam(teamId)
  if (!team) return <Navigate to="/scenarios/evaluation" replace />
  const story = criterionById[team.id].story
  const { color, icon } = teamStyle[team.id]
  const regions = criterionById[team.id].regions
  const sections = regions ? pageSections : pageSections.filter((s) => s.id !== 'regions')

  return (
    <>
      <Navbar />
      <Box component="main" sx={{ bgcolor: 'base.800', color: 'common.white' }}>
        <PageHero
          image="/images/scenarios/web/cover.webp"
          title={team.label}
          summary={story.brief.what}
          summaryVariant="body1"
          accent={color}
          icon={<TeamIcon team={icon} size={56} />}
        >
          <Box>
            <Button
              component={Link}
              to={`/scenarios/evaluation#${team.id}`}
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              sx={{
                color,
                borderColor: color,
                '&:hover': { borderColor: color, bgcolor: alpha(color, 0.12) },
              }}
            >
              Back to evaluation
            </Button>
          </Box>
        </PageHero>
        <TeamTabs activeTeamId={team.id} hrefFor={methodologyPath} />

        {/* Same frame and rail as the evaluation overview, so the two pages' text lines up. */}
        <Container
          maxWidth={false}
          sx={{
            width: '90dvw',
            px: 0,
            pb: jtSpacing.section.xl,
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: `${navigation.railColumn} minmax(0, 1fr)` },
            gap: { xs: jtSpacing.gap.xl, lg: jtSpacing.section.md },
            alignItems: 'start',
          }}
        >
          {/* Section rail: beside the content from lg up, above it on smaller screens */}
          <PageRail items={sections} ariaLabel={`${team.label} sections`} />

          <CitationContext.Provider
            value={{ accent: color, references: criterionById[team.id].references }}
          >
            <Stack
              spacing={jtSpacing.section.xl}
              sx={{
                minWidth: 0,
                gridColumn: { lg: 2 },
                p: { xs: jtSpacing.component.lg, md: jtSpacing.component.xl },
                '& > *': { maxWidth: jtSpacing.layout.data.maxWidth },
                // The what, why and regions overview runs together; dividers start after it
                '& > #components, & > #construction, & > #references': {
                  pt: jtSpacing.section.md,
                  borderTop: 2,
                  borderColor: alpha(color, 0.5),
                },
              }}
            >
              <WhatSection story={story} accent={color} />
              <WhySection story={story} accent={color} />
              {regions && <RegionsSection regions={regions} accent={color} />}
              {/* Keyed by criterion so switching criteria resets the open component tab */}
              <ComponentsSection key={team.id} story={story} accent={color} />
              <ConstructionSection story={story} accent={color} />
              <ReferencesSection references={criterionById[team.id].references} accent={color} />
            </Stack>
          </CitationContext.Provider>
        </Container>
      </Box>
      <Footer />
    </>
  )
}
