import { Box, Button, Typography, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { assetUrl } from '../../../utils/baseUrl'
import ScrollReveal from '../../../ui/animation/ScrollReveal'
import Icon from '../../../ui/Icon'

const futures = [
  {
    number: '01',
    title: 'What are scenarios?',
    body: 'Scenarios are models and depictions of possible futures and the pathways through which they could manifest.',
    detailTitle: 'What is participatory scenario planning?',
    detail:
      'Participatory scenario planning is a “bottom up” approach that involves working directly with public contributors to create and evaluate future scenarios for a particular place.',
  },
  {
    number: '02',
    title: 'Why participatory scenario planning?',
    body: 'Scenario planning is an approach increasingly used in conservation and climate change adaptation research, especially when uncertainty, vulnerability, and divergent stakeholder interests create conflicting mandates.',
    detail:
      'It gives communities space to compare possible futures, surface tradeoffs, and shape the questions that guide planning.',
  },
]

function FutureCard({ future, index }: { future: (typeof futures)[number]; index: number }) {
  const theme = useTheme()

  return (
    <Box
      component={motion.article}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      sx={{
        bgcolor: 'base.600',
        border: '1px solid',
        borderColor: 'border.default',
        p: { xs: theme.jtSpacing.component.lg, md: theme.jtSpacing.section.sm },
        minHeight: '100%',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="numberBadge" sx={{ color: 'base.100' }}>
          {future.number}
        </Typography>
        {index === 0 && <Icon name="compass" size={20} stroke={theme.palette.primary.main} />}
        {index === 1 && <Icon name="users" size={20} stroke={theme.palette.primary.main} />}
      </Box>
      <Typography variant="h3" component="h3" sx={{ color: 'primary.main', mt: 2 }}>
        {future.title}
      </Typography>
      <Typography variant="body1" sx={{ color: 'common.white', mt: 1.5 }}>
        {future.body}
      </Typography>
      {future.detailTitle && (
        <Typography variant="h3" component="h3" sx={{ color: 'primary.main', mt: 2.5 }}>
          {future.detailTitle}
        </Typography>
      )}
      <Typography
        variant="body1"
        sx={{ color: 'common.white', mt: future.detailTitle ? 1.5 : 2.5 }}
      >
        {future.detail}
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
          minHeight: { xs: '34rem', md: '42rem', lg: '48rem' },
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
          bgcolor: 'base.500',
          color: 'common.white',
          clipPath: { md: 'polygon(0 0, 100% 2rem, 100% 100%, 0 calc(100% - 2rem))' },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 'var(--home-rail-inset)',
            width: 2,
            bgcolor: 'common.white',
            zIndex: 1,
          },
        }}
      >
        <Box
          sx={{
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
                gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
                gap: { xs: theme.jtSpacing.gap.lg, md: theme.jtSpacing.section.md },
                mt: theme.jtSpacing.section.sm,
              }}
            >
              {futures.map((future, index) => (
                <FutureCard key={future.number} future={future} index={index} />
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  )
}
