import { Box, Button, Typography, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { assetUrl } from '../../../../utils/baseUrl'
import ScrollReveal from '../../../../ui/animation/ScrollReveal'

const futures = [
  {
    title: 'What are scenarios?',
    body: 'Scenarios are models and depictions of possible futures and the pathways through which they could manifest.',
  },
  {
    title: 'What is participatory scenario planning?',
    body: 'Participatory scenario planning is a “bottom up” approach that involves working directly with public contributors to create and evaluate future scenarios for a particular place.',
  },
  {
    title: 'Why participatory scenario planning?',
    body: 'Scenario planning is an approach increasingly used in conservation and climate change adaptation research, especially when uncertainty, vulnerability, and divergent stakeholder interests create conflicting mandates.',
  },
]

function FutureRow({ future, index }: { future: (typeof futures)[number]; index: number }) {
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
        minHeight: 0,
      }}
    >
      <Typography variant="h3" component="h3" sx={{ color: 'primary.main' }}>
        {future.title}
      </Typography>
      <Typography variant="body1" sx={{ color: 'common.white', mt: 1.5 }}>
        {future.body}
      </Typography>
    </Box>
  )
}

export default function FuturesPanels() {
  const theme = useTheme()

  return (
    <>
      <Box
        component="section"
        id="futures-photo"
        aria-label="What is a just transition?"
        sx={{
          position: 'relative',
          zIndex: 31,
          mt: { md: '-1px' },
          height: '100dvh',
          display: 'flex',
          alignItems: 'center',
          backgroundImage: `linear-gradient(90deg, ${theme.palette.translucent.blackShadow}, transparent 58%), url(${assetUrl('images/community-fishing.jpg')})`,
          backgroundSize: { xs: 'cover', md: 'cover', lg: '130% auto' },
          backgroundPosition: { xs: '62% center', md: 'center 57%', lg: '0% 35%' },
          clipPath: { md: 'polygon(0 0, 100% 0, 100% 100%, 0 calc(100% - 2rem))' },
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: '0 0 auto',
            height: { md: '2.5rem' },
            bgcolor: 'secondary.main',
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
              The term Just Transition is used in the domains of climate, energy, and environmental
              justice and refers to efforts to reduce inequity in society. This project seeks to
              advance such efforts by democratizing science and decision making in the Delta through
              a participatory scenario planning process.
            </Typography>
            <Button
              href="#foundations"
              variant="contained"
              sx={{ mt: theme.jtSpacing.component.lg, minWidth: { xs: '100%', sm: '18rem' } }}
            >
              What is a just transition?
            </Button>
          </ScrollReveal>
        </Box>
      </Box>

      <Box
        component="section"
        id="foundations"
        sx={{
          position: 'relative',
          zIndex: 32,
          // Bleed past the matching clipped edge to prevent subpixel seams.
          mt: { md: '-2rem', lg: 'calc(-2rem - 1px)' },
          pt: { xs: theme.jtSpacing.section.lg, md: theme.jtSpacing.section.xl },
          pb: theme.jtSpacing.section.xl,
          minHeight: '100dvh',
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          bgcolor: 'base.500',
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
              The Approach
            </Typography>
            <Typography variant="h2" component="h2" sx={{ mt: 1, color: 'common.white' }}>
              What futures?
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr)',
                gridTemplateRows: 'repeat(3, minmax(0, 1fr))',
                gap: theme.jtSpacing.section.sm,
                mt: theme.jtSpacing.section.sm,
              }}
            >
              {futures.map((future, index) => (
                <FutureRow key={future.title} future={future} index={index} />
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  )
}
