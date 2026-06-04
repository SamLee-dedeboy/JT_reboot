import { Link } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import Section from '../common/Section';
import SectionHead from '../common/SectionHead';
import Reveal from '../common/Reveal';
import { assetUrl } from '../../utils/baseUrl';
import { APPROACH_QUOTE, APPROACH_MODES } from '../../data/homeContent';

export default function OurApproachSection() {
  return (
    <Section id="approach" bg="base.600">
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '7fr 5fr' },
          gap: { xs: '1.6rem', md: '2.25rem' },
          alignItems: 'center',
        }}
      >
        <Box>
          <SectionHead eyebrow="Methodology" title="Our Approach" />
          <Reveal
            delay={0.06}
            component="blockquote"
            sx={{
              m: 0,
              mt: '0.5rem',
              borderLeft: '4px solid',
              borderColor: 'primary.main',
              pl: '1.6rem',
              typography: 'body1',
              lineHeight: 1.8,
            }}
          >
            {APPROACH_QUOTE}
          </Reveal>
          <Reveal delay={0.12} sx={{ display: 'flex', flexWrap: 'wrap', gap: '0.7rem', mt: '1.8rem' }}>
            {APPROACH_MODES.map((m) => (
              <Box
                key={m}
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  whiteSpace: 'nowrap',
                  px: '1rem',
                  py: '0.5rem',
                  borderRadius: '999px',
                  border: '1px solid',
                  borderColor: 'base.300',
                  bgcolor: 'surface',
                  fontSize: '0.98rem',
                  lineHeight: 1,
                  transition: 'border-color 180ms ease, transform 180ms ease',
                  '&:hover': { borderColor: 'primary.main', transform: 'translateY(-1px)' },
                }}
              >
                <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: 'primary.main', flex: 'none' }} />
                {m}
              </Box>
            ))}
          </Reveal>
          <Reveal delay={0.18} sx={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', mt: '2.2rem' }}>
            <Button component={Link} to="/pages/project-documentation" variant="contained" color="primary">
              Project Documentation &amp; Reports
            </Button>
            <Button component={Link} to="/pages/scenario-planning" variant="outlined" color="primary">
              Participatory Scenario Planning
            </Button>
          </Reveal>
        </Box>
        <Reveal delay={0.1} sx={{ maxWidth: { xs: 440, md: 'none' }, mx: { xs: 'auto', md: 0 } }}>
          <Box
            component="img"
            src={assetUrl('/images/delta-aerial.jpg')}
            alt="Participatory process in the Sacramento–San Joaquin Delta"
            sx={{
              width: '100%',
              aspectRatio: '4 / 5',
              objectFit: 'cover',
              borderRadius: 'var(--mui-shape-borderRadius)',
              border: '1px solid rgba(155,162,164,0.2)',
              display: 'block',
            }}
          />
        </Reveal>
      </Box>
    </Section>
  );
}
