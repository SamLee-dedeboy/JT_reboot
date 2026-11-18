// The scenarios landing below lg: the four panels as ordinary stacked sections that scroll
// like the rest of the page, under a sticky strip of section tabs (from sm; phones just scroll). It stands in for the
// desktop's pinned cross-fade and its rail, which need a wide screen and a long scroll.
// Each section fills at least the screen below the tabs, and opens with its photo, which
// takes whatever height the words leave.
import { Box, Stack, Typography, useTheme } from '@mui/material'
import type { ReactNode } from 'react'
import {
  ADAPTATION_CARDS,
  CURRENT_OPERATIONS_LINKS,
  LANDING_PANELS,
  LANDING_SECTION_PHOTOS,
  OUTFLOW_VARIATIONS,
} from '@/content/landing'
import { navigation } from '@/theme'
import { ActionButton, ScrollReveal, SectionTabs } from '@/ui'
import { assetUrl } from '@/utils/baseUrl'
import AdaptationCarousel from './AdaptationCarousel'
import WhatsNextPanel from './WhatsNextPanel'

const [currentPanel, outflowPanel, adaptationPanel, nextPanel] = LANDING_PANELS
const sectionTabs = LANDING_PANELS.map((panel) => ({ id: panel.id, label: panel.railLabel }))
const outflowVariations = OUTFLOW_VARIATIONS.filter((variation) => variation.key !== 'current')

const { belowSectionTabs } = navigation

/**
 * One landing section: at least the screen below the navbar and the section tabs, and its
 * anchor lands just below them.
 */
function LandingSection({
  id,
  bgcolor,
  label,
  children,
}: {
  id: string
  bgcolor: string
  label?: string
  children: ReactNode
}) {
  return (
    <Box
      component="section"
      id={id}
      aria-labelledby={label ? undefined : `${id}-title`}
      aria-label={label}
      sx={{
        bgcolor,
        scrollMarginTop: belowSectionTabs,
        display: 'flex',
        flexDirection: 'column',
        minHeight: {
          xs: `calc(100dvh - ${belowSectionTabs.xs}px)`,
          sm: `calc(100dvh - ${belowSectionTabs.sm}px)`,
          md: `calc(100dvh - ${belowSectionTabs.md}px)`,
        },
      }}
    >
      {children}
    </Box>
  )
}

/** A section's opening photo: it grows into the height the section's words leave free. */
function SectionPhoto({
  image,
  minHeight,
  position = 'center',
}: {
  image: string
  minHeight: string
  position?: string
}) {
  return (
    <Box
      aria-hidden="true"
      sx={{
        flex: '1 0 auto',
        minHeight,
        backgroundImage: `url(${assetUrl(image)})`,
        backgroundSize: 'cover',
        backgroundPosition: position,
      }}
    />
  )
}

/** A section's title and lead, at the section's inset. */
function SectionIntro({ id, title, body }: { id: string; title: string; body: string }) {
  const theme = useTheme()
  return (
    <Stack spacing={theme.jtSpacing.gap.md} sx={{ maxWidth: '58ch' }}>
      <Typography id={`${id}-title`} variant="h2" component="h2">
        {title}
      </Typography>
      <Typography variant="body1" sx={{ color: 'common.white' }}>
        {body}
      </Typography>
    </Stack>
  )
}

export default function MobileScenarioPanels() {
  const theme = useTheme()
  // The page inset, so the words line up with the hero above.
  const inset = theme.jtSpacing.page.x
  const sectionPadding = {
    px: inset,
    py: { xs: theme.jtSpacing.section.md, md: theme.jtSpacing.section.lg },
  }

  return (
    <>
      <SectionTabs items={sectionTabs} ariaLabel="Scenario landing sections" />

      {/* Current operations: its photo, then the panel's words and links. */}
      <LandingSection id={currentPanel.id} bgcolor={currentPanel.bgcolor}>
        {/* The baseline's photo gets the most room: its words are short. */}
        <SectionPhoto
          image={LANDING_SECTION_PHOTOS[currentPanel.id]}
          minHeight="16rem"
          position="center 70%"
        />
        <ScrollReveal sx={sectionPadding}>
          <SectionIntro id={currentPanel.id} title={currentPanel.title} body={currentPanel.body} />
          <Stack
            spacing={theme.jtSpacing.gap.sm}
            sx={{ alignItems: 'flex-start', mt: theme.jtSpacing.component.lg }}
          >
            {CURRENT_OPERATIONS_LINKS.map((link, index) => (
              <ActionButton
                key={link.label}
                {...link}
                variant={index === 0 ? 'contained' : 'outlined'}
              />
            ))}
          </Stack>
        </ScrollReveal>
      </LandingSection>

      {/* Outflow variations: the saltier and the fresher Delta, then the way in. */}
      <LandingSection id={outflowPanel.id} bgcolor={outflowPanel.bgcolor}>
        <SectionPhoto image={LANDING_SECTION_PHOTOS[outflowPanel.id]} minHeight="14rem" />
        <ScrollReveal sx={sectionPadding}>
          <SectionIntro id={outflowPanel.id} title={outflowPanel.title} body={outflowPanel.body} />
          <Stack
            component="ol"
            spacing={theme.jtSpacing.gap.lg}
            sx={{ listStyle: 'none', m: 0, p: 0, mt: theme.jtSpacing.section.sm }}
          >
            {outflowVariations.map((variation, index) => (
              <Stack
                key={variation.key}
                component="li"
                spacing={theme.jtSpacing.gap.xs}
                sx={{
                  pt: theme.jtSpacing.component.md,
                  borderTop: 1,
                  borderColor: 'border.subtle',
                }}
              >
                <Typography variant="numberArticle" component="span">
                  {String(index + 1).padStart(2, '0')}
                </Typography>
                {variation.eyebrow && (
                  <Typography variant="eyebrow" component="p" sx={{ color: 'primary.main' }}>
                    {variation.eyebrow}
                  </Typography>
                )}
                <Typography variant="h3" component="h3">
                  {variation.title}
                </Typography>
                <Typography variant="body1" sx={{ color: 'base.100', maxWidth: '48ch' }}>
                  {variation.body}
                </Typography>
              </Stack>
            ))}
          </Stack>
          <Box sx={{ mt: theme.jtSpacing.section.sm }}>
            <ActionButton label="Explore" href="/scenarios/tiered-outflows" />
          </Box>
        </ScrollReveal>
      </LandingSection>

      {/* Adaptation scenarios: the five pathways as a swipe strip. */}
      <LandingSection id={adaptationPanel.id} bgcolor={adaptationPanel.bgcolor}>
        <Box sx={{ ...sectionPadding, pb: theme.jtSpacing.section.sm }}>
          <SectionIntro
            id={adaptationPanel.id}
            title={adaptationPanel.title}
            body={adaptationPanel.body}
          />
        </Box>
        {/* The cards take the height the intro leaves: more photo on a tall screen. */}
        <Box
          sx={{
            flex: '1 0 auto',
            display: 'flex',
            flexDirection: 'column',
            pb: { xs: theme.jtSpacing.section.md, md: theme.jtSpacing.section.lg },
          }}
        >
          <AdaptationCarousel items={ADAPTATION_CARDS} />
        </Box>
      </LandingSection>

      {/* What's next: a photo, then its own panel, as on the desktop. */}
      <LandingSection id={nextPanel.id} bgcolor={nextPanel.bgcolor} label={nextPanel.title}>
        <SectionPhoto image={LANDING_SECTION_PHOTOS[nextPanel.id]} minHeight="14rem" />
        <WhatsNextPanel />
      </LandingSection>
    </>
  )
}
