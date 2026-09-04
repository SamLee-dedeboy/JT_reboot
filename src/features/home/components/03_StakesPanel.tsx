import { useState } from 'react'
import { Box, Button, Typography, useTheme } from '@mui/material'
import { emphasize } from '../../../utils/highlightText'
import ScrollReveal from '../../../ui/animation/ScrollReveal'

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
    <ScrollReveal component="article" delay={index * 0.1}>
      <Typography variant="h3" component="h3" sx={{ color: 'primary.main' }}>
        {section.title}
      </Typography>
      {section.introduction.map((paragraph) => (
        <Typography
          key={paragraph}
          variant="body1"
          sx={{ color: 'common.white', mt: theme.jtSpacing.component.md }}
        >
          {emphasize(paragraph, section.emphasize)}
        </Typography>
      ))}
      <Box
        sx={{
          display: 'grid',
          paddingTop: theme.jtSpacing.component.lg,
          paddingBottom: theme.jtSpacing.component.md,
          gridTemplateRows: expanded ? '1fr' : '0fr',
          transition: 'grid-template-rows 320ms ease',
        }}
      >
        <Box sx={{ overflow: 'hidden' }}>
          {section.details.map((paragraph) => (
            <Typography
              key={paragraph}
              variant="body1"
              sx={{ color: 'base.100', mt: theme.jtSpacing.component.sm }}
            >
              {emphasize(paragraph, section.emphasize)}
            </Typography>
          ))}
        </Box>
      </Box>
      <Button
        variant="text"
        onClick={() => setExpanded((current) => !current)}
        aria-expanded={expanded}
        sx={{
          alignSelf: 'flex-start',
          mt: theme.jtSpacing.component.sm,
          px: theme.jtSpacing.component.md,
        }}
      >
        {expanded ? 'Show less' : 'Read more'}
      </Button>
    </ScrollReveal>
  )
}

export default function StakesPanel() {
  const theme = useTheme()

  return (
    <Box
      component="section"
      id="stakes"
      data-home-section="panel"
      sx={{
        position: 'relative',
        zIndex: 1,
        minHeight: '100dvh',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        py: { xs: theme.jtSpacing.section.lg, md: theme.jtSpacing.section.xl },
        bgcolor: 'base.800',
        color: 'common.white',
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
        }}
      >
        <Box sx={{ gridColumn: { lg: 2 }, width: '100%', maxWidth: '76ch' }}>
          <ScrollReveal>
            <Typography variant="eyebrow" component="p">
              The Context
            </Typography>
            <Typography variant="h2" component="h2" sx={{ mt: 1, color: 'common.white' }}>
              What&rsquo;s at stake
            </Typography>
          </ScrollReveal>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr)',
              gap: theme.jtSpacing.section.lg,
              mt: theme.jtSpacing.section.md,
            }}
          >
            {stakeSections.map((section, index) => (
              <StakeSection key={section.title} section={section} index={index} />
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
