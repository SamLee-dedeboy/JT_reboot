import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { Box, Button, Container, Stack, Typography, alpha, useTheme } from '@mui/material'
import { LANDING_HERO, LANDING_PANELS } from '@/content/landing'
import { navigation } from '@/theme'
import { ScrollReveal } from '@/ui'
import { assetUrl } from '@/utils/baseUrl'

/** The first three panels, as buttons that jump to them. */
const scenarioSectionLinks = LANDING_PANELS.slice(0, 3).map((panel) => ({
  label: panel.title,
  href: `#${panel.id}`,
}))

/** Full-screen cover photo with the page title and links down to the scenario panels. */
export default function LandingHero() {
  const theme = useTheme()

  return (
    <Box
      component="header"
      sx={{
        position: 'relative',
        height: navigation.belowBar('100dvh'),
        display: 'flex',
        // Below md the words run the full width, so they sit low over a fade from the bottom.
        alignItems: { xs: 'flex-end', md: 'center' },
        pb: { xs: theme.jtSpacing.section.md, md: 0 },
        isolation: 'isolate',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          backgroundImage: {
            xs: `linear-gradient(180deg, ${alpha(theme.palette.base[900], 0.3)} 0%, ${alpha(theme.palette.base[900], 0.78)} 38%, ${alpha(theme.palette.base[900], 0.94)} 62%), url(${assetUrl('/images/scenarios/web/cover.webp')})`,
            md: `linear-gradient(90deg, ${alpha(theme.palette.base[900], 0.94)} 0%, ${alpha(theme.palette.base[900], 0.78)} 44%, ${alpha(theme.palette.base[900], 0.32)} 100%), url(${assetUrl('/images/scenarios/web/cover.webp')})`,
          },
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: -1,
        },
      }}
    >
      {/* The site's page inset below lg, where the default gutter left the words near the edge. */}
      <Container
        maxWidth="lg"
        sx={{ px: { ...theme.jtSpacing.page.x, lg: theme.jtSpacing.gap.lg } }}
      >
        <ScrollReveal>
          <Stack
            spacing={theme.jtSpacing.gap.lg}
            sx={{ maxWidth: theme.jtSpacing.paragraphMaxWidth.default }}
          >
            <Typography variant="h1" component="h1" sx={{ maxWidth: '15ch' }}>
              {LANDING_HERO.title}
            </Typography>
            <Typography variant="bodyLarge" sx={{ maxWidth: '58ch', color: 'base.100' }}>
              {LANDING_HERO.body}
            </Typography>
            <Stack
              direction="row"
              useFlexGap
              spacing={theme.jtSpacing.gap.sm}
              sx={{ flexWrap: 'wrap' }}
            >
              {scenarioSectionLinks.map((link, index) => (
                <Button
                  key={link.href}
                  variant={index === 2 ? 'contained' : 'outlined'}
                  color="primary"
                  component="a"
                  href={link.href}
                  endIcon={index === 2 ? <ArrowForwardIcon /> : undefined}
                  sx={index === 2 ? undefined : { color: 'common.white', borderColor: 'base.300' }}
                >
                  {link.label}
                </Button>
              ))}
            </Stack>
          </Stack>
        </ScrollReveal>
      </Container>
    </Box>
  )
}
