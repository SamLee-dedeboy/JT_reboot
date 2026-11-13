import { Box } from '@mui/material'
import { useState } from 'react'
import TeamTabs from '@/features/scenario-methodology/components/criterion/TeamTabs'
import StoryTabs from '@/features/scenario-narration/components/story/StoryTabs'
import { chart, jtSpacing } from '@/theme'
import { NavRail, TeamIcon, type NavRailItem } from '@/ui'
import DesignSection from '../parts/DesignSection'
import Specimen, { UsageTag } from '../parts/Specimen'

// Both tab bars carry their page's 90dvw Container and sticky strip; fit them to the specimen.
const tabBarFitSx = {
  minWidth: 0,
  overflowX: 'auto',
  '& > *': { position: 'static' },
  '& .MuiContainer-root': { width: '100%', maxWidth: 'none', px: 0 },
} as const

const railItems: NavRailItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'baselines', label: 'Baselines' },
  { id: 'historical', label: 'Historical baseline', indent: true },
  { id: 'calsim', label: 'CalSim baseline', indent: true },
  { id: 'criteria', label: 'Criteria' },
  {
    id: 'ecology',
    label: 'Ecology',
    color: chart.voting.team.ecology,
    icon: <TeamIcon team="ecology" size={14} />,
  },
  {
    id: 'economy',
    label: 'Economy',
    color: chart.voting.team.economy,
    icon: <TeamIcon team="economy" size={14} />,
  },
]

/** The navbar (live at the top of this page), the section rail and the two tab bars. */
export default function NavigationSection() {
  const [activeRailItem, setActiveRailItem] = useState('baselines')

  return (
    <DesignSection
      id="navigation"
      eyebrow="Components"
      title="Navigation"
      intro="The navbar at the top of this page is the live one; open Future Scenarios to see the grouped menu every section follows."
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '280px minmax(0, 1fr)' },
          gap: jtSpacing.section.sm,
          alignItems: 'start',
        }}
      >
        <Specimen
          name="NavRail · page"
          spec="Top items: eyebrow. Nested and criterion items: navigationSubLabel."
          usage={<UsageTag>Every rail page</UsageTag>}
        >
          <NavRail
            variant="page"
            items={railItems}
            ariaLabel="Rail specimen"
            activeItemId={activeRailItem}
            onNavigate={setActiveRailItem}
          />
        </Specimen>
        <Box sx={{ display: 'grid', gap: jtSpacing.section.sm, minWidth: 0 }}>
          <Specimen
            name="StoryTabs"
            spec="numberBadge + button type. Active: green fill, black text. Hover: green tint."
            usage={<UsageTag>scenario-narration</UsageTag>}
          >
            <Box sx={tabBarFitSx}>
              <StoryTabs currentSlug="eco-machine" />
            </Box>
          </Specimen>
          <Specimen
            name="TeamTabs"
            spec="TeamIcon + button type, label in the team color. Active: team fill, black text."
            usage={<UsageTag>scenario-methodology</UsageTag>}
          >
            <Box sx={tabBarFitSx}>
              <TeamTabs
                activeTeamId="ecology"
                hrefFor={(teamId) => `/scenarios/evaluation/${teamId}`}
                sticky={false}
              />
            </Box>
          </Specimen>
        </Box>
      </Box>
    </DesignSection>
  )
}
