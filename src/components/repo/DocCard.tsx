// Document/resource card that displays file metadata, summary text, and a
// download or external-link affordance.
import { Box, Typography } from '@mui/material';
import ScrollReveal from '../animation/ScrollReveal';
import Icon from '../common/Icon';
import { assetUrl } from '../../utils/baseUrl';
import type { DocAction, DocItem } from '../../data/docYears';

function ActionLink({ a }: { a: DocAction }) {
  const ghost = a.kind !== 'dl';
  return (
    <Box
      component="a"
      href={a.href ?? '#'}
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
        borderColor: ghost ? 'rgba(155,162,164,0.4)' : 'primary.main',
        color: ghost ? 'secondary.light' : 'primary.main',
        transition: 'background 180ms ease, color 180ms ease, transform 160ms ease',
        '& svg': { transition: 'transform 180ms ease' },
        '&:hover': ghost
          ? { bgcolor: 'rgba(81,162,189,0.15)', color: 'common.white' }
          : { bgcolor: 'primary.main', color: 'base.700', transform: 'translateY(-1px)' },
        '&:hover svg': { transform: 'translateX(2px)' },
      }}
    >
      {a.label}
      {a.kind === 'dl' && <Icon name="arrow-down" size={15} />}
      {a.kind === 'view' && <Icon name="arrow-up-right" size={15} />}
    </Box>
  );
}

export default function DocCard({ doc, delay = 0 }: { doc: DocItem; delay?: number }) {
  return (
    <ScrollReveal
      delay={delay}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'surface',
        border: '1px solid rgba(155,162,164,0.16)',
        borderRadius: 'var(--mui-shape-borderRadius)',
        overflow: 'hidden',
        transition: 'transform 200ms ease, border-color 200ms ease, box-shadow 200ms ease',
        '&:hover': {
          transform: 'translateY(-3px)',
          borderColor: 'translucent.primaryGreen',
          boxShadow: '0 16px 40px rgba(16,22,24,0.45)',
        },
        '&:hover .doc-cover-img': { transform: 'scale(1.04)' },
      }}
    >
      <Box sx={{ position: 'relative', aspectRatio: '16 / 10', bgcolor: 'base.700', overflow: 'hidden' }}>
        {doc.green ? (
          <Box sx={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', bgcolor: 'primary.main', p: '1.4rem' }}>
            <Box component="span" sx={{ fontFamily: 'var(--font-heading)', textTransform: 'uppercase', letterSpacing: '0.04em', fontSize: '1.35rem', lineHeight: 1.1, color: 'base.700', textAlign: 'center' }}>
              {doc.title}
            </Box>
          </Box>
        ) : (
          <Box
            className="doc-cover-img"
            component="img"
            src={assetUrl(doc.img!)}
            alt={doc.title}
            loading="lazy"
            sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 400ms cubic-bezier(0.22,1,0.36,1)' }}
          />
        )}
        <Box
          sx={{
            position: 'absolute',
            left: '0.9rem',
            top: '0.9rem',
            display: 'inline-flex',
            alignItems: 'center',
            bgcolor: 'rgba(16,22,24,0.78)',
            border: 1,
            borderColor: 'translucent.primaryGreen',
            color: 'primary.main',
            fontFamily: 'var(--font-heading)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            fontSize: '0.68rem',
            px: '0.7rem',
            py: '0.36rem',
            borderRadius: '999px',
            backdropFilter: 'blur(2px)',
          }}
        >
          {doc.badge}
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.7rem', p: '1.4rem 1.4rem 1.5rem', flex: 1 }}>
        <Typography
          variant="h4"
          component="h4"
          sx={{ fontFamily: 'var(--font-body)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em', fontSize: '1.18rem', color: 'secondary.light', lineHeight: 1.15 }}
        >
          {doc.title}
        </Typography>
        <Typography sx={{ fontSize: '1.02rem', lineHeight: 1.5, color: 'base.100' }}>{doc.desc}</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', mt: 'auto', pt: '0.4rem' }}>
          {doc.actions.map((a, i) => <ActionLink key={i} a={a} />)}
        </Box>
      </Box>
    </ScrollReveal>
  );
}
