import { useEffect, useState } from 'react';
import { Box, Container } from '@mui/material';
import { WHATIF_QUESTIONS } from '../../data/homeContent';
import { highlightKeywords } from '../common/highlightText';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

const questionSx = {
  fontFamily: 'var(--font-heading, "Hammersmith One", sans-serif)',
  fontWeight: 300,
  textTransform: 'none',
  fontSize: 'clamp(1.55rem, 0.9rem + 1.7vw, 2.5rem)',
  lineHeight: 1.3,
  letterSpacing: '0.005em',
  maxWidth: '28ch',
  color: 'common.white',
} as const;

const eyebrowSx = {
  fontFamily: 'var(--font-heading, "Hammersmith One", sans-serif)',
  textTransform: 'uppercase',
  fontSize: 'clamp(1.6rem, 4vw, 2.6rem)',
  letterSpacing: '0.06em',
  color: 'primary.main',
  mb: '1.6rem',
} as const;

/** Water-drop dot icon (matches the design's `drop` glyph). */
function Drop({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="var(--mui-palette-secondary-main, #51a2bd)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 3c3.5 4 6 7 6 10a6 6 0 1 1-12 0c0-3 2.5-6 6-10z" />
    </svg>
  );
}

const interval = 5200;

export default function WhatIfSection() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = prefersReducedMotion();

  useEffect(() => {
    if (reduced || paused) return;
    const id = window.setInterval(
      () => setActive((n) => (n + 1) % WHATIF_QUESTIONS.length),
      interval,
    );
    return () => window.clearInterval(id);
  }, [reduced, paused]);

  // Static, fully-readable fallback for reduced motion.
  if (reduced) {
    return (
      <Box component="section" id="whatif" sx={{ bgcolor: 'base.700', py: { xs: '3.75rem', md: '6rem' } }}>
        <Container maxWidth="lg" sx={{ px: { xs: '1.25rem', md: '2rem' } }}>
          <Box sx={eyebrowSx}>What if?</Box>
          <Box component="ol" sx={{ display: 'flex', flexDirection: 'column', gap: '1.4rem', maxWidth: '60ch', listStyle: 'none', p: 0, m: 0 }}>
            {WHATIF_QUESTIONS.map((q, n) => (
              <Box component="li" key={n} sx={{ position: 'relative', ...questionSx, maxWidth: 'none', pl: '3.4rem' }}>
                <Box component="span" sx={{ position: 'absolute', left: 0, top: '0.15em', fontSize: '1rem', letterSpacing: '0.1em', color: 'primary.main' }}>
                  {String(n + 1).padStart(2, '0')}
                </Box>
                {highlightKeywords(q.text, q.keywords)}
              </Box>
            ))}
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      component="section"
      id="whatif"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      sx={{
        position: 'relative',
        minHeight: '78vh',
        display: 'flex',
        alignItems: 'center',
        bgcolor: 'base.700',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: '1.25rem', md: '2rem' }, width: '100%' }}>
        <Box sx={eyebrowSx}>What if?</Box>

        <Box sx={{ position: 'relative', minHeight: 'clamp(300px, 46vh, 480px)' }} aria-live="polite">
          {WHATIF_QUESTIONS.map((q, n) => (
            <Box
              component="p"
              key={n}
              aria-hidden={n !== active}
              sx={{
                position: 'absolute',
                inset: 0,
                m: 0,
                ...questionSx,
                opacity: n === active ? 1 : 0,
                pointerEvents: n === active ? 'auto' : 'none',
                transition: 'opacity 0.6s ease',
              }}
            >
              {highlightKeywords(q.text, q.keywords)}
            </Box>
          ))}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: '1.6rem', mt: '2rem' }}>
          <Box sx={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
            {WHATIF_QUESTIONS.map((_, n) => (
              <Box
                component="button"
                key={n}
                onClick={() => setActive(n)}
                aria-label={`Question ${n + 1}`}
                sx={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  p: '4px',
                  lineHeight: 0,
                  transformOrigin: 'center bottom',
                  opacity: n === active ? 1 : 0.32,
                  transform: n === active ? 'scale(1.18)' : 'none',
                  transition: 'opacity 220ms ease, transform 220ms ease',
                  '&:hover': { opacity: n === active ? 1 : 0.7 },
                  '& svg': n === active ? { filter: 'drop-shadow(0 0 8px rgba(81,162,189,0.55))' } : undefined,
                }}
              >
                <Drop />
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
