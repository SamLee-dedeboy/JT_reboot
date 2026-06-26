// Repository timeline section that groups documents by phase or milestone.
import { Box, Typography } from '@mui/material';
import ScrollReveal from '../animation/ScrollReveal';
import DocCard from './DocCard';
import { DOC_YEARS } from '../../data/docYears';

/**
 * Vertical timeline: green year nodes + blue workshop nodes on a gradient
 * rail, with a responsive doc-card grid beside each workshop.
 */
export default function Timeline() {
  return (
    <Box
      sx={{
        position: 'relative',
        '--tl-pad': '2.6rem',
        '@media (min-width:640px)': { '--tl-pad': '4.5rem' },
        pl: 'var(--tl-pad)',
        '&::before': {
          content: '""',
          position: 'absolute',
          left: '1.05rem',
          top: '0.6rem',
          bottom: '2rem',
          width: '2px',
          background: 'linear-gradient(var(--mui-palette-primary-main), rgba(126,217,87,0.12))',
        },
      }}
    >
      {DOC_YEARS.map((y) => (
        <Box key={y.year} sx={{ position: 'relative', mt: '3.4rem', mb: '1.8rem', '&:first-of-type': { mt: 0 } }}>
          <ScrollReveal
            sx={{
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                left: 'calc(1.05rem - var(--tl-pad) - 7px)',
                top: '0.2em',
                width: 16,
                height: 16,
                borderRadius: '50%',
                bgcolor: 'primary.main',
                boxShadow: '0 0 0 5px var(--mui-palette-brand-base), 0 0 0 7px rgba(126,217,87,0.3)',
              },
            }}
          >
            <Typography variant="numberTimeline" component="div">
              {y.year}
            </Typography>
          </ScrollReveal>

          {y.workshops.map((w) => (
            <Box
              key={w.title + w.date}
              sx={{
                position: 'relative',
                mb: '2.6rem',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  left: 'calc(1.05rem - var(--tl-pad) - 4px)',
                  top: '0.55rem',
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  bgcolor: 'secondary.light',
                  boxShadow: '0 0 0 4px var(--mui-palette-brand-base)',
                },
              }}
            >
              <ScrollReveal sx={{ mb: '1.2rem' }}>
                <Box component="span" sx={{ display: 'inline-block', fontFamily: 'var(--font-heading)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.78rem', color: 'secondary.main', mb: '0.35rem' }}>
                  {w.date}
                </Box>
                <Typography sx={{ fontFamily: 'var(--font-heading)', textTransform: 'uppercase', fontSize: 'clamp(1.3rem, 2vw, 1.7rem)', letterSpacing: '0.02em', lineHeight: 1.1 }}>
                  {w.title}
                </Typography>
                {w.tag && <Typography variant="body2" sx={{ mt: '0.4rem', opacity: 0.7 }}>{w.tag}</Typography>}
              </ScrollReveal>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: w.docs.length === 1 ? 'minmax(0, 460px)' : 'repeat(auto-fill, minmax(270px, 1fr))',
                  gap: '1.4rem',
                }}
              >
                {w.docs.map((d, i) => <DocCard key={d.title + i} doc={d} delay={i * 0.05} />)}
              </Box>
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  );
}
