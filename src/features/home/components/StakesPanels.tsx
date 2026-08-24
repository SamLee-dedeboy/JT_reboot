import { useState } from 'react'
import { Box, Button, Typography, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { assetUrl } from '../../../utils/baseUrl'
import ScrollReveal from '../../../ui/animation/ScrollReveal'
import Icon from '../../../ui/Icon'
import { emphasize, splitLeadSentences } from '../../../utils/highlightText'
import { STAKE, DROUGHT, type StakeBlock } from '../content/homeContent'

const stakeBlocks = [STAKE, DROUGHT]

function StakeCard({ block, index }: { block: StakeBlock; index: number }) {
  const theme = useTheme()
  const [open, setOpen] = useState(false)
  const [lead, rest] = splitLeadSentences(block.text, 2)
  const number = String(index + 1).padStart(2, '0')

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
          {number}
        </Typography>
        <Icon name={block.icon} size={20} stroke={theme.palette.primary.main} />
      </Box>
      <Typography variant="h3" component="h3" sx={{ color: 'primary.main', mt: 2 }}>
        {block.tag}
      </Typography>

      <Typography variant="body1" sx={{ color: 'common.white', mt: 1.5 }}>
        {emphasize(lead, block.emphasize)}
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateRows: open ? '1fr' : '0fr',
          transition: 'grid-template-rows 320ms ease',
        }}
      >
        <Box sx={{ overflow: 'hidden' }}>
          <Typography variant="body1" sx={{ color: 'common.white', mt: 1.5 }}>
            {emphasize(rest, block.emphasize)}
          </Typography>
        </Box>
      </Box>

      {rest && (
        <Box
          component="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          sx={{
            mt: theme.jtSpacing.component.sm,
            display: 'inline-flex',
            alignItems: 'center',
            gap: theme.jtSpacing.gap.xs,
            p: 0,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            typography: 'eyebrow',
            color: 'primary.main',
            '&:hover': { opacity: 0.8 },
          }}
        >
          {open ? 'Show less' : 'Read more'}
          <Icon
            name="chevron-down"
            size={16}
            style={{
              transform: open ? 'rotate(180deg)' : 'none',
              transition: 'transform 200ms ease',
            }}
          />
        </Box>
      )}
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
          minHeight: { xs: '34rem', md: '42rem', lg: '48rem' },
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
          bgcolor: 'base.800',
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
              The Context
            </Typography>
            <Typography variant="h2" component="h2" sx={{ mt: 1, color: 'common.white' }}>
              What&rsquo;s at stake
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
                gap: { xs: theme.jtSpacing.gap.lg, md: theme.jtSpacing.section.md },
                mt: theme.jtSpacing.section.sm,
              }}
            >
              {stakeBlocks.map((block, index) => (
                <StakeCard key={block.tag} block={block} index={index} />
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  )
}
