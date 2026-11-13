import { Box, Container, useTheme } from '@mui/material'
import { baselineBackgroundChapters } from '@/content/background'
import { Footer, Navbar, NavRail } from '@/ui'
import BackgroundChapters from './components/background/BackgroundChapters'
import BackgroundHero from './components/background/BackgroundHero'
import BackgroundNext from './components/background/BackgroundNext'
import KeyTerms from './components/background/KeyTerms'

const navRailItems = [
  { id: 'overview', label: 'Overview' },
  ...baselineBackgroundChapters.map((chapter) => ({
    id: `section-${chapter.id}`,
    label: chapter.kicker,
  })),
  { id: 'key-terms', label: 'Key Terms' },
]

/** /scenarios/background-context: a primer on Delta salinity before the scenarios. */
export default function BackgroundPage() {
  const theme = useTheme()

  return (
    <>
      <Navbar />
      <NavRail items={navRailItems} ariaLabel="Background context sections" />
      <Box component="main" sx={{ bgcolor: 'base.800', color: 'common.white' }}>
        <BackgroundHero />
        <Container maxWidth={false} disableGutters sx={{ position: 'relative' }}>
          <BackgroundChapters />
          <Container
            maxWidth="lg"
            sx={{ py: { xs: theme.jtSpacing.section.md, md: theme.jtSpacing.section.lg } }}
          >
            <KeyTerms />
            <BackgroundNext />
          </Container>
        </Container>
      </Box>
      <Footer />
    </>
  )
}
