// Landing-page methodology section with approach copy, CTAs, and supporting
// scenario-planning highlights.
import { Link } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import type { ReactNode } from 'react';
import Section from '../common/Section';
import SectionHead from '../common/SectionHead';
import ScrollReveal from '../animation/ScrollReveal';
import Hl from '../common/Highlight';
import { assetUrl } from '../../utils/baseUrl';
import { APPROACH_QUOTE, APPROACH_MODES } from '../../data/homeContent';

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const blueHighlight = 'rgba(81,162,189,0.38)';

function highlightApproachModes(text: string): ReactNode {
  const re = new RegExp(`(${APPROACH_MODES.map(escapeRe).join('|')})`, 'g');

  return text.split(re).map((part, index) =>
    APPROACH_MODES.includes(part) ? (
      <Hl key={index} color={blueHighlight}>{part}</Hl>
    ) : (
      part
    ),
  );
}

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
          <ScrollReveal
            delay={0.06}
            component="blockquote"
            sx={{
              m: 0,
              mt: '0.5rem',
              typography: 'body1',
              lineHeight: 1.8,
            }}
          >
            {highlightApproachModes(APPROACH_QUOTE)}
          </ScrollReveal>
          <ScrollReveal delay={0.12} sx={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', mt: '2.2rem' }}>
            <Button component={Link} to="/pages/project-documentation" variant="contained" color="primary">
              Project Documentation &amp; Reports
            </Button>
          </ScrollReveal>
        </Box>
        <ScrollReveal delay={0.1} sx={{ maxWidth: { xs: 440, md: 'none' }, mx: { xs: 'auto', md: 0 } }}>
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
        </ScrollReveal>
      </Box>
    </Section>
  );
}
