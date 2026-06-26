// Full-width mission statement band that anchors the landing page narrative.
import { Box, Typography } from '@mui/material';
import Section from '../common/Section';
import ScrollReveal from '../animation/ScrollReveal';
import Icon from '../common/Icon';
import { MISSION_QUOTE, MISSION_STATEMENT } from '../../data/homeContent';

export default function MissionBand() {
  return (
    <Section id="mission" bg="secondary.dark">
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: { xs: '1.6rem', md: '2.25rem' }, alignItems: 'center' }}>
        <ScrollReveal
          component="blockquote"
          sx={{
            m: 0,
            borderLeft: '4px solid',
            borderColor: 'common.white',
            pl: '1.6rem',
            fontSize: '1.3rem',
            lineHeight: 1.8,
          }}
        >
          {MISSION_QUOTE}
        </ScrollReveal>
        <ScrollReveal delay={0.1} sx={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <Icon name="waves" size={40} stroke="var(--mui-palette-primary-main)" />
          <Typography
            variant="h3"
            component="p"
            sx={{ textTransform: 'none', fontFamily: 'var(--font-heading)', fontWeight: 300, lineHeight: 1.3 }}
          >
            {MISSION_STATEMENT}
          </Typography>
        </ScrollReveal>
      </Box>
    </Section>
  );
}
