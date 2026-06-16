import { Box, Typography } from '@mui/material';
import Section from '../common/Section';
import SectionHead from '../common/SectionHead';
import Reveal from '../common/Reveal';
import Icon from '../common/Icon';
import { FOUNDATIONS } from '../../data/homeContent';
import { splitLead } from '../../utils/highlightText';

export default function Foundations() {
  return (
    <Section id="foundations">
      <SectionHead eyebrow="Foundations" title="The Idea Behind the Work" />
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: { xs: '1.6rem', md: '2.25rem' },
        }}
      >
        {FOUNDATIONS.map((f, n) => {
          const [lead, rest] = splitLead(f.text);
          return (
            <Reveal
              key={f.n}
              delay={n * 0.08}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                bgcolor: 'surface',
                border: '1px solid rgba(155,162,164,0.18)',
                borderRadius: 'var(--mui-shape-borderRadius)',
                p: '1.9rem',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: '1.2rem' }}>
                <Typography variant="numberGhost" component="span">
                  {f.n}
                </Typography>
                <Icon name={f.icon} size={28} stroke="var(--mui-palette-primary-main)" />
              </Box>
              <Typography variant="h3" component="h3" sx={{ mb: '1rem', color: 'primary.main' }}>
                {f.title}
              </Typography>
              <Typography sx={{ fontSize: '1.3rem', lineHeight: 1.55, mb: '0.9rem' }}>{lead}</Typography>
              <Typography variant="body2">{rest}</Typography>
            </Reveal>
          );
        })}
      </Box>
    </Section>
  );
}
