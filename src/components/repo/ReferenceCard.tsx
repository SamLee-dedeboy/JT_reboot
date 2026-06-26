// Compact reference card for research citations and supporting resources.
import { Box } from '@mui/material';
import Icon from '../common/Icon';
import type { Reference } from '../../data/resources';

/** Reference literature card — blue left accent, hover lifts and turns green. */
export default function ReferenceCard({ r }: { r: Reference }) {
  return (
    <Box
      component="a"
      href={r.href ?? '#'}
      sx={{
        display: 'block',
        bgcolor: 'surface',
        border: '1px solid rgba(155,162,164,0.16)',
        borderLeft: '3px solid',
        borderLeftColor: 'secondary.main',
        borderRadius: '10px',
        p: '1.5rem 1.6rem',
        transition: 'transform 180ms ease, border-color 180ms ease, background 180ms ease',
        '&:hover': { transform: 'translateY(-2px)', borderLeftColor: 'primary.main', bgcolor: 'surfaceStrong' },
      }}
    >
      <Box sx={{ fontSize: '1.2rem', fontWeight: 700, lineHeight: 1.3, color: 'common.white', mb: '0.7rem' }}>{r.title}</Box>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem', color: 'primary.main', fontSize: '0.98rem', fontWeight: 600, mb: '0.4rem' }}>
        <Box component="span" sx={{ mt: '0.18em', flex: 'none', opacity: 0.8 }}><Icon name="arrow-up-right" size={15} /></Box>
        {r.source}
      </Box>
      <Box sx={{ fontSize: '0.95rem', color: 'base.200' }}>{r.meta}</Box>
    </Box>
  );
}
