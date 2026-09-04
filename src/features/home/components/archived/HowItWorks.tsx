// Landing-page process section that explains how the project moves from
// community input through scenario planning and modeled outcomes.
import { Box, Button, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import Section from '../../../../ui/Section'
import SectionHead from '../../../../ui/SectionHead'
import ScrollReveal from '../../../../ui/animation/ScrollReveal'
import Icon from '../../../../ui/Icon'
import { assetUrl } from '../../../../utils/baseUrl'
import { WORKS_LEDE, WORKS_STEPS, WORKS_OUTRO } from '../../content/homeContent'

export default function HowItWorks() {
  return (
    <Section id="works" bg="base.600">
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '5fr 7fr' },
          gap: { xs: '1.6rem', md: '2.25rem' },
          alignItems: 'center',
        }}
      >
        <ScrollReveal
          delay={0.08}
          sx={{ maxWidth: { xs: 460, md: 'none' }, mx: { xs: 'auto', md: 0 } }}
        >
          <Box
            component="img"
            src={assetUrl('/images/workshop-session.jpg')}
            alt="Community workshop session"
            sx={{
              width: '100%',
              aspectRatio: '5 / 4',
              objectFit: 'cover',
              borderRadius: 'var(--mui-shape-borderRadius)',
              border: '1px solid rgba(155,162,164,0.2)',
              display: 'block',
            }}
          />
        </ScrollReveal>
        <Box>
          <SectionHead eyebrow="The Project" title="How Our Project Works" />
          <ScrollReveal delay={0.06}>
            <Typography variant="body1" sx={{ mb: '1.6rem' }}>
              {WORKS_LEDE}
            </Typography>
          </ScrollReveal>
          <ScrollReveal delay={0.12} sx={{ mb: '2rem' }}>
            <Typography variant="body2" sx={{ mb: '0.9rem' }}>
              Through&hellip;
            </Typography>
            <Box
              component="ul"
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: '0.9rem 1.4rem',
                listStyle: 'none',
                p: 0,
                m: 0,
                mb: '1rem',
              }}
            >
              {WORKS_STEPS.map((s, n) => (
                <Box
                  component="li"
                  key={n}
                  sx={{
                    position: 'relative',
                    pl: '2.6rem',
                    fontSize: '1.08rem',
                    lineHeight: 1.4,
                    alignSelf: 'start',
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      typography: 'numberBadge',
                      border: (theme) => theme.numbering.badge.border,
                      borderRadius: (theme) => theme.numbering.badge.radius,
                      width: (theme) => theme.numbering.badge.size,
                      height: (theme) => theme.numbering.badge.size,
                      display: 'grid',
                      placeItems: 'center',
                    }}
                  >
                    {String(n + 1).padStart(2, '0')}
                  </Box>
                  {s}
                </Box>
              ))}
            </Box>
            <Typography variant="body2">{WORKS_OUTRO}</Typography>
          </ScrollReveal>
          <ScrollReveal delay={0.18} sx={{ mt: '0.5rem' }}>
            <Button
              component={Link}
              to="/scenarios"
              variant="contained"
              color="primary"
              endIcon={<Icon name="arrow-right" size={18} />}
            >
              View Adaptation Scenarios
            </Button>
          </ScrollReveal>
        </Box>
      </Box>
    </Section>
  )
}
