import { Box, Stack, type SxProps, type Theme } from '@mui/material'
import { useState, type ReactNode } from 'react'
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

// The scenarios landing's sections: long labels show the sticky rail wrapping.
const landingItems: NavRailItem[] = [
  { id: 'current', label: 'Current operations' },
  { id: 'outflows', label: 'Outflow variations' },
  { id: 'adaptation', label: 'Adaptation scenarios' },
  { id: 'next', label: "What's next?" },
]

// The Background page's steps.
const backgroundItems: NavRailItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'chapter-01', label: 'Two Rivers' },
  { id: 'chapter-02', label: 'The Push and Pull' },
  { id: 'chapter-03', label: 'X2 Distance' },
]

/** A panel behind a rail specimen, in the color the rail sits on in its page. */
function RailStage({
  bgcolor = 'base.800',
  sx,
  children,
}: {
  bgcolor?: string
  sx?: SxProps<Theme>
  children: ReactNode
}) {
  return (
    <Box
      sx={[
        {
          bgcolor,
          border: 1,
          borderColor: 'border.subtle',
          borderRadius: 1,
          px: jtSpacing.component.md,
          pb: jtSpacing.component.md,
          pt: jtSpacing.component.md,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {children}
    </Box>
  )
}

/** The navbar (live at the top of this page), the section rail and the two tab bars. */
export default function NavigationSection() {
  const [activeRailItem, setActiveRailItem] = useState('baselines')
  const [activeLandingItem, setActiveLandingItem] = useState('outflows')
  const [activeBackgroundItem, setActiveBackgroundItem] = useState('chapter-01')

  return (
    <DesignSection
      id="navigation"
      eyebrow="Components"
      title="Navigation"
      intro="The navbar at the top of this page is the live one; open Future Scenarios to see the grouped menu every section follows."
    >
      <Stack spacing={jtSpacing.section.sm}>
        {/* The three NavRail variants. A page picks one; the variant sets the rest. */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
            gap: jtSpacing.section.sm,
            alignItems: 'start',
          }}
        >
          <Specimen
            name="NavRail · page"
            spec="Heading, dot then label, wraps within 220px. Pins under the tab bar from lg up."
            usage={<UsageTag>Article pages</UsageTag>}
          >
            <RailStage>
              <NavRail
                variant="page"
                items={railItems}
                ariaLabel="Page rail specimen"
                activeItemId={activeRailItem}
                onNavigate={setActiveRailItem}
              />
            </RailStage>
          </Specimen>
          <Specimen
            name="NavRail · sticky"
            spec="No heading, white-outlined dots for colored panels, wraps within 220px. Hidden below lg."
            usage={<UsageTag>Home, scenarios landing</UsageTag>}
          >
            <RailStage bgcolor="base.700">
              <NavRail
                variant="sticky"
                items={landingItems}
                ariaLabel="Sticky rail specimen"
                activeItemId={activeLandingItem}
                onNavigate={setActiveLandingItem}
              />
            </RailStage>
          </Specimen>
          <Specimen
            name="NavRail · fixed"
            spec="Label then dot, one line each, on the viewport's right edge. Hidden below lg."
            usage={<UsageTag>Background</UsageTag>}
          >
            {/* A transformed stage is the containing block for position: fixed, so the
                rail sits at this stage's right edge instead of the window's. */}
            <RailStage bgcolor="base.900" sx={{ height: 260, transform: 'translateZ(0)' }}>
              <NavRail
                variant="fixed"
                items={backgroundItems}
                ariaLabel="Fixed rail specimen"
                activeItemId={activeBackgroundItem}
                onNavigate={setActiveBackgroundItem}
              />
            </RailStage>
          </Specimen>
        </Box>
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
      </Stack>
    </DesignSection>
  )
}
