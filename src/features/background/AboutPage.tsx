// The About us page (Background menu, "The Project"): a photo hero, what the project does,
// and who we are: the team (bios, then the names whose bios are forthcoming).
// Funding is in the site footer. Words live in src/content/about.ts.
import { Box, Container, Typography } from '@mui/material'
import { Footer, Navbar, ScrollReveal, SectionHead } from '@/ui'
import { jtSpacing } from '@/theme'
import { assetUrl } from '@/utils/baseUrl'
import { ABOUT_HERO, ABOUT_PROJECT, TEAM } from '@/content/about'

/** The page's content column, matching the Participatory Scenario Planning page. */
const contentWidth = { width: '90dvw', px: 0 } as const
const sectionPy = { xs: jtSpacing.section.lg, md: jtSpacing.section.xl } as const

function Hero() {
  return (
    <Box
      component="header"
      id="top"
      sx={(theme) => ({
        minHeight: '64dvh',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'flex-end',
        pt: jtSpacing.section.xl,
        pb: { xs: jtSpacing.section.md, md: jtSpacing.section.lg },
        backgroundImage: {
          xs: `linear-gradient(0deg, ${theme.palette.translucent[900]} 0%, ${theme.palette.translucent[700]} 55%, transparent 100%), url(${assetUrl(ABOUT_HERO.image)})`,
          md: `linear-gradient(90deg, ${theme.palette.translucent[900]} 0%, ${theme.palette.translucent[700]} 38%, transparent 72%), url(${assetUrl(ABOUT_HERO.image)})`,
        },
        backgroundSize: 'cover',
        backgroundPosition: 'center 40%',
      })}
    >
      <Container maxWidth={false} sx={contentWidth}>
        <ScrollReveal>
          <Typography variant="h1" component="h1">
            {ABOUT_HERO.title}
          </Typography>
        </ScrollReveal>
        <ScrollReveal delay={0.08}>
          <Typography
            variant="bodyLarge"
            component="p"
            sx={{ maxWidth: '58ch', mt: jtSpacing.component.lg, color: 'base.50' }}
          >
            {ABOUT_HERO.lede}
          </Typography>
        </ScrollReveal>
      </Container>
    </Box>
  )
}

/** What the project does. */
function Project() {
  return (
    <Box component="section" id={ABOUT_PROJECT.id} sx={{ bgcolor: 'base.600', py: sectionPy }}>
      <Container maxWidth={false} sx={contentWidth}>
        <Box sx={{ maxWidth: '70ch' }}>
          <SectionHead
            eyebrow={ABOUT_PROJECT.eyebrow}
            title={ABOUT_PROJECT.title}
            sx={{ mb: jtSpacing.section.sm }}
          />
          <ScrollReveal delay={0.08}>
            <Typography variant="body1" component="p" sx={{ color: 'common.white' }}>
              {ABOUT_PROJECT.lead}
            </Typography>
            <Typography
              variant="body1"
              component="p"
              sx={{ mt: jtSpacing.component.lg, color: 'base.100' }}
            >
              {ABOUT_PROJECT.body}
            </Typography>
          </ScrollReveal>
        </Box>
      </Container>
    </Box>
  )
}

function Team() {
  return (
    <Box component="section" id={TEAM.id} sx={{ bgcolor: 'base.700', py: sectionPy }}>
      <Container maxWidth={false} sx={contentWidth}>
        <Box sx={{ maxWidth: '70ch' }}>
          <SectionHead
            eyebrow={TEAM.eyebrow}
            title={TEAM.title}
            sx={{ mb: jtSpacing.section.sm }}
          />
          <ScrollReveal delay={0.08}>
            <Typography variant="body1" component="p" sx={{ color: 'common.white' }}>
              {TEAM.lead}
            </Typography>
          </ScrollReveal>
        </Box>
        <TeamMembers />
      </Container>
    </Box>
  )
}

/** A rule above each entry in the people lists. */
const ruledItem = { listStyle: 'none', borderTop: 1, borderColor: 'border.default' } as const

/** The bios, then everyone whose bio isn't in yet, by name: no empty slots to fill. */
function TeamMembers() {
  const withBio = TEAM.members.filter((member) => member.bio)
  const pending = TEAM.members.filter((member) => !member.bio)
  return (
    <>
      <Box
        component="ul"
        sx={{
          m: 0,
          mt: { xs: jtSpacing.section.md, md: jtSpacing.section.lg },
          p: 0,
          display: 'grid',
          gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'repeat(2, minmax(0, 1fr))' },
          columnGap: jtSpacing.section.md,
          rowGap: jtSpacing.component.xl,
        }}
      >
        {withBio.map((member, index) => (
          <ScrollReveal
            key={member.name}
            component="li"
            delay={(index % 2) * 0.06}
            sx={{ ...ruledItem, pt: jtSpacing.component.lg }}
          >
            <Typography variant="body1" component="p" sx={{ color: 'base.100' }}>
              <Typography variant="body1Strong" component="span" sx={{ color: 'common.white' }}>
                {member.name}
              </Typography>
              {member.bio}
            </Typography>
          </ScrollReveal>
        ))}
      </Box>
      {pending.length > 0 && (
        <ScrollReveal sx={{ mt: jtSpacing.section.md }}>
          <Typography variant="h4" component="h3" sx={{ color: 'common.white' }}>
            {TEAM.pendingTitle}
          </Typography>
          <Typography
            variant="captionProse"
            component="p"
            sx={{ mt: jtSpacing.component.sm, color: 'base.200' }}
          >
            {TEAM.pendingNote}
          </Typography>
          <Box
            component="ul"
            sx={{
              m: 0,
              mt: jtSpacing.component.lg,
              p: 0,
              display: 'grid',
              gridTemplateColumns: {
                xs: 'minmax(0, 1fr)',
                sm: 'repeat(2, minmax(0, 1fr))',
                lg: 'repeat(3, minmax(0, 1fr))',
              },
              columnGap: jtSpacing.section.md,
            }}
          >
            {pending.map((member) => (
              <Typography
                key={member.name}
                variant="body1Strong"
                component="li"
                sx={{ ...ruledItem, py: jtSpacing.component.md, color: 'common.white' }}
              >
                {member.name}
              </Typography>
            ))}
          </Box>
        </ScrollReveal>
      )}
    </>
  )
}

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <Box component="main" sx={{ color: 'common.white' }}>
        <Hero />
        <Project />
        <Team />
      </Box>
      <Footer />
    </>
  )
}
