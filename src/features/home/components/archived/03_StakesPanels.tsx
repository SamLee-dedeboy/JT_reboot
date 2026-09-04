import { useState } from 'react'
import { Box, Button, Typography, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { assetUrl } from '../../../../utils/baseUrl'
import ScrollReveal from '../../../../ui/animation/ScrollReveal'
import { emphasize } from '../../../../utils/highlightText'

const stakeSections = [
  {
    title: 'The Bay-Delta Region',
    emphasize:
      "responses to climate management in the Delta have often been short-term 'bandaid' solutions with significant and possibly inequitable tradeoffs",
    introduction: [
      'The Bay-Delta region holds immense economic, ecological, and cultural significance, yet research and long-term planning have historically lagged behind its challenges.',
      'Fragmented governance and competing demands have often resulted in short-term responses with significant and potentially inequitable tradeoffs.',
    ],
    details: [
      'Estuary-scale approaches for envisioning alternative futures and evaluating tradeoffs through inclusive public engagement have seen limited progress.',
      "The region's complex relationship between science and governance has often been fraught with conflict because many groups depend on the same natural resources in different ways.",
      "As a consequence, responses to climate management in the Delta have often been short-term 'bandaid' solutions with significant and possibly inequitable tradeoffs, leaving long-term solutions unclear.",
    ],
  },
  {
    title: 'Drought, Salinity & Sea-Level Rise',
    emphasize:
      'nearly as much reservoir water may be needed to keep salinity from entering the Delta as is available for in-Delta use and exports',
    introduction: [
      'During extreme drought years, nearly as much reservoir water may be needed to keep salinity from entering the Delta as is available for in-Delta use and exports.',
      'As drought and sea-level rise intensify, managing this balance creates increasingly difficult tradeoffs.',
    ],
    details: [
      'Water releases for salinity control protect in-Delta uses as well as exports to central and southern California. If ocean tides push salinity into the southern Delta, recovering freshwater exports could take months or years.',
      'During multi-year droughts, limited reservoir supplies can lead to reduced exports, temporarily relaxed salinity standards, and emergency barriers that redirect tidal energy.',
      'These responses can reduce the water needed to control salinity, but each creates different consequences for communities and ecosystems.',
    ],
  },
]

function StakeSection({
  section,
  index,
}: {
  section: (typeof stakeSections)[number]
  index: number
}) {
  const theme = useTheme()
  const [expanded, setExpanded] = useState(false)

  return (
    <Box
      component={motion.article}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <Typography variant="h3" component="h3" sx={{ color: 'primary.main' }}>
        {section.title}
      </Typography>
      {section.introduction.map((paragraph) => (
        <Typography key={paragraph} variant="body1" sx={{ color: 'common.white', mt: 1.5 }}>
          {emphasize(paragraph, section.emphasize)}
        </Typography>
      ))}
      <Box
        sx={{
          display: 'grid',
          gridTemplateRows: expanded ? '1fr' : '0fr',
          transition: 'grid-template-rows 320ms ease',
        }}
      >
        <Box sx={{ overflow: 'hidden' }}>
          {section.details.map((paragraph) => (
            <Typography key={paragraph} variant="body1" sx={{ color: 'common.white', mt: 1.5 }}>
              {emphasize(paragraph, section.emphasize)}
            </Typography>
          ))}
        </Box>
      </Box>
      <Button
        variant="text"
        onClick={() => setExpanded((current) => !current)}
        aria-expanded={expanded}
        sx={{ alignSelf: 'flex-start', mt: theme.jtSpacing.component.sm, px: 0 }}
      >
        {expanded ? 'Show less' : 'Read more'}
      </Button>
    </Box>
  )
}

export default function StakesPanels() {
  const theme = useTheme()

  return (
    <>
      <Box
        component="section"
        id="stakes-photo"
        aria-label="Participatory scenario planning"
        sx={{
          position: 'relative',
          zIndex: 33,
          // Bleed past the matching clipped edge to prevent subpixel seams.
          mt: { md: '-2rem', lg: 'calc(-2rem - 1px)' },
          height: '100dvh',
          display: 'flex',
          alignItems: 'center',
          backgroundImage: `linear-gradient(90deg, ${theme.palette.translucent.blackShadow}, transparent 58%), url(${assetUrl('images/exhibit.jpg')})`,
          backgroundSize: 'cover',
          backgroundPosition: { xs: '62% center', md: 'center 38%', lg: 'center 35%' },
          clipPath: { md: 'polygon(0 0, 100% 0, 100% 100%, 0 calc(100% - 2rem))' },
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: '0 0 auto',
            height: { md: '2.5rem' },
            bgcolor: 'base.500',
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 0)',
            zIndex: 1,
          },
        }}
      >
        <Box
          sx={{
            width: '100%',
            position: 'relative',
            zIndex: 2,
            pl: {
              xs: 'var(--home-rail-inset)',
              lg: `calc(var(--home-rail-inset) + 11rem + ${theme.spacing(theme.jtSpacing.section.md)})`,
            },
            pr: 'var(--home-rail-inset)',
          }}
        >
          <ScrollReveal>
            <Typography
              variant="body1"
              component="p"
              sx={{
                maxWidth: '34rem',
                color: 'common.white',
                fontStyle: 'italic',
                textShadow: `0 1px 3px rgba(0, 0, 0, 0.85), 0 2px 16px ${theme.palette.translucent.textShadow}`,
              }}
            >
              By envisioning diverse ways in which climate, governance, and ecosystems might
              co-evolve, scenario-based planning offers tools to reflect on current actions and
              goals, and in turn, fosters shared learning and socio-technical innovation.
            </Typography>
            <Button
              href="#stakes"
              variant="contained"
              sx={{ mt: theme.jtSpacing.component.lg, minWidth: { xs: '100%', sm: '18rem' } }}
            >
              Participatory Scenario Planning
            </Button>
          </ScrollReveal>
        </Box>
      </Box>

      <Box
        component="section"
        id="stakes"
        sx={{
          position: 'relative',
          zIndex: 34,
          // Bleed past the matching clipped edge to prevent subpixel seams.
          mt: { md: '-2rem', lg: 'calc(-2rem - 1px)' },
          pt: { xs: theme.jtSpacing.section.lg, md: theme.jtSpacing.section.xl },
          pb: theme.jtSpacing.section.xl,
          minHeight: '100dvh',
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          bgcolor: 'base.800',
          color: 'common.white',
          clipPath: { md: 'polygon(0 0, 100% 2rem, 100% 100%, 0 calc(100% - 2rem))' },
        }}
      >
        <Box
          sx={{
            width: '100%',
            pl: 'var(--home-rail-inset)',
            pr: { xs: theme.jtSpacing.gap.lg, md: theme.jtSpacing.section.md },
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '11rem minmax(0, 1fr)' },
            gap: { xs: theme.jtSpacing.gap.lg, lg: theme.jtSpacing.section.md },
            alignItems: 'start',
          }}
        >
          <Box sx={{ gridColumn: { lg: 2 }, width: '100%', maxWidth: '72rem' }}>
            <Typography variant="eyebrow" component="p">
              The Context
            </Typography>
            <Typography variant="h2" component="h2" sx={{ mt: 1, color: 'common.white' }}>
              What&rsquo;s at stake
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr)',
                gap: theme.jtSpacing.section.md,
                mt: theme.jtSpacing.section.sm,
              }}
            >
              {stakeSections.map((section, index) => (
                <StakeSection key={section.title} section={section} index={index} />
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  )
}
