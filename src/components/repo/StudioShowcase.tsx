// Repository showcase section for highlighting studio outputs and supporting
// materials.
import { Box, Typography } from '@mui/material';
import ScrollReveal from '../animation/ScrollReveal';
import Eyebrow from '../common/Eyebrow';
import Icon from '../common/Icon';
import { assetUrl } from '../../utils/baseUrl';
import { STUDIOS } from '../../data/studios';

const badgeSx = {
  display: 'inline-flex',
  alignItems: 'center',
  bgcolor: 'rgba(16,22,24,0.78)',
  border: '1px solid rgba(126,217,87,0.35)',
  color: 'primary.main',
  fontFamily: 'var(--font-heading)',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  fontSize: '0.68rem',
  px: '0.7rem',
  py: '0.36rem',
  borderRadius: '999px',
  mb: '1rem',
} as const;

/** Alternating left/right feature rows for the design studios. */
export default function StudioShowcase() {
  return (
    <Box>
      <ScrollReveal sx={{ display: 'flex', alignItems: 'baseline', gap: '1rem', mb: '2.4rem', flexWrap: 'wrap' }}>
        <Typography variant="numberTimeline" component="span">
          2025
        </Typography>
        <Eyebrow sx={{ color: 'secondary.main' }}>Undergraduate Design Studios</Eyebrow>
      </ScrollReveal>

      {STUDIOS.map((s, i) => {
        const flip = i % 2 === 1;
        return (
          <ScrollReveal
            key={s.title + s.place}
            delay={0.04}
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: flip ? '1fr 1.35fr' : '1.35fr 1fr' },
              gap: { xs: '1.6rem', md: '2.6rem' },
              alignItems: 'center',
              py: '2.6rem',
              borderTop: '1px solid rgba(155,162,164,0.16)',
              '&:last-of-type': { borderBottom: '1px solid rgba(155,162,164,0.16)' },
            }}
          >
            <Box
              sx={{
                order: { xs: 0, md: flip ? 2 : 0 },
                borderRadius: 'var(--mui-shape-borderRadius)',
                overflow: 'hidden',
                border: '1px solid rgba(155,162,164,0.2)',
                bgcolor: 'base.700',
              }}
            >
              <Box component="img" src={assetUrl(s.img)} alt={`${s.title} — ${s.place}`} loading="lazy" sx={{ width: '100%', display: 'block' }} />
            </Box>
            <Box>
              <Box sx={badgeSx}>Design Studio</Box>
              <Typography variant="numberGhost" component="div" sx={{ mb: '0.6rem' }}>{s.n}</Typography>
              <Typography sx={{ fontFamily: 'var(--font-heading)', textTransform: 'uppercase', fontSize: 'clamp(1.7rem, 2.6vw, 2.3rem)', letterSpacing: '0.02em', lineHeight: 1.08, color: 'primary.main', mb: '0.9rem' }}>
                {s.title}
              </Typography>
              <Typography sx={{ fontFamily: 'var(--font-body)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.9rem', color: 'secondary.light', mb: '1rem' }}>
                {s.place}
              </Typography>
              <Typography sx={{ fontSize: '1.25rem', lineHeight: 1.6, mb: '1.6rem', maxWidth: '42ch' }}>{s.desc}</Typography>
              <Box
                component="a"
                href="#"
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  fontFamily: 'var(--font-heading)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  fontSize: '0.85rem',
                  px: '1.1rem',
                  py: '0.62rem',
                  borderRadius: '999px',
                  border: '1.5px solid',
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  transition: 'background 180ms ease, color 180ms ease, transform 160ms ease',
                  '& svg': { transition: 'transform 180ms ease' },
                  '&:hover': { bgcolor: 'primary.main', color: 'base.700', transform: 'translateY(-1px)' },
                  '&:hover svg': { transform: 'translateY(2px)' },
                }}
              >
                Download <Icon name="arrow-down" size={16} />
              </Box>
            </Box>
          </ScrollReveal>
        );
      })}
    </Box>
  );
}
