import { Box, Container } from '@mui/material'
import { jtSpacing, navigation } from '@/theme'
import { Footer, Navbar, PageHero, PageRail, type NavRailItem } from '@/ui'
import useActiveSection from './parts/useActiveSection'
import CardsSection from './sections/CardsSection'
import ColorSection from './sections/ColorSection'
import ControlsSection from './sections/ControlsSection'
import HeadingsSection from './sections/HeadingsSection'
import NavigationSection from './sections/NavigationSection'
import SpaceSection from './sections/SpaceSection'
import TypeSection from './sections/TypeSection'

const sections = [
  { id: 'color', label: 'Color' },
  { id: 'type', label: 'Type' },
  { id: 'space', label: 'Space' },
  { id: 'navigation', label: 'Navigation' },
  { id: 'controls', label: 'Controls' },
  { id: 'headings', label: 'Headings' },
  { id: 'cards', label: 'Cards' },
] as const satisfies readonly NavRailItem[]

type SectionId = (typeof sections)[number]['id']
const sectionIds = sections.map(({ id }) => id)

/**
 * /design-system: the site's tokens and shared components as the public features use them.
 * Everything on it is the real thing: theme values are read from src/theme and every
 * specimen is the component itself.
 */
export default function DesignSystem() {
  const [activeSection, setActiveSection] = useActiveSection<SectionId>(sectionIds, 'color')

  return (
    <>
      <Navbar />
      <Box component="main" sx={{ bgcolor: 'base.800', color: 'common.white' }}>
        <PageHero
          eyebrow="Internal"
          title="Design system"
          summary="The colors, type, spacing and components the public pages are built from, read straight from src/theme and src/ui."
          summaryVariant="body1"
        />
        <Container maxWidth={false} sx={{ width: '90dvw', px: 0, pb: jtSpacing.section.lg }}>
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
              items={[...sections]}
              ariaLabel="Design system sections"
              activeItemId={activeSection}
              onNavigate={(id) => setActiveSection(id as SectionId)}
            />
            <Box sx={{ minWidth: 0 }}>
              <ColorSection />
              <TypeSection />
              <SpaceSection />
              <NavigationSection />
              <ControlsSection />
              <HeadingsSection />
              <CardsSection />
            </Box>
          </Box>
        </Container>
      </Box>
      <Footer />
    </>
  )
}
