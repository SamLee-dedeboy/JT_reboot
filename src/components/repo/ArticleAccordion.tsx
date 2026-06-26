// Expandable article list for repository/resource pages, with one open
// publication summary at a time.
import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import ScrollReveal from '../animation/ScrollReveal';
import Icon from '../common/Icon';
import { ARTICLES, type Article } from '../../data/resources';

function AbstractBody({ a }: { a: Article }) {
  return (
    <>
      <Box sx={{ fontFamily: 'var(--font-heading)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.78rem', color: 'secondary.main', pt: '1.3rem', mb: '0.9rem' }}>
        {a.kicker}
      </Box>
      {a.paras.map((p, i) => (
        <Typography key={i} sx={{ fontSize: '1.08rem', lineHeight: 1.7, color: 'rgba(242,240,239,0.85)', mb: '0.9rem', '&:last-of-type': { mb: 0 } }}>
          {p}
        </Typography>
      ))}
      {a.list && (
        <Box component="ol" sx={{ pl: '1.4rem', mt: '0.4rem', mb: '0.9rem' }}>
          {a.list.map((li, i) => (
            <Box component="li" key={i} sx={{ fontSize: '1.08rem', lineHeight: 1.6, color: 'rgba(242,240,239,0.85)', mb: '0.4rem' }}>{li}</Box>
          ))}
        </Box>
      )}
    </>
  );
}

function AccordionItem({ a, n, open, onToggle }: { a: Article; n: number; open: boolean; onToggle: () => void }) {
  return (
    <Box
      sx={{
        bgcolor: 'surface',
        border: '1px solid',
        borderColor: open ? 'rgba(126,217,87,0.4)' : 'rgba(155,162,164,0.16)',
        borderRadius: 'var(--mui-shape-borderRadius)',
        overflow: 'hidden',
        transition: 'border-color 200ms ease',
      }}
    >
      <Box
        component="button"
        onClick={onToggle}
        aria-expanded={open}
        sx={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: { xs: 'auto 1fr', sm: 'auto 1fr auto' },
          gap: { xs: '0.8rem', sm: '1.2rem' },
          alignItems: 'center',
          textAlign: 'left',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          p: { xs: '1.2rem', sm: '1.5rem 1.7rem' },
          color: 'common.white',
        }}
      >
        <Typography variant="numberArticle" component="span" sx={{ width: (theme) => theme.numbering.article.width }}>
          {String(n).padStart(2, '0')}
        </Typography>
        <Box sx={{ minWidth: 0 }}>
          <Box sx={{ fontSize: '1.3rem', fontWeight: 700, lineHeight: 1.3, color: 'common.white', mb: '0.4rem' }}>{a.title}</Box>
          <Box sx={{ fontSize: '0.98rem', color: 'base.200', display: 'flex', flexWrap: 'wrap', gap: '0.5rem 0.9rem' }}>
            <Box component="span" sx={{ color: 'primary.main', fontWeight: 600 }}>{a.source}</Box>
            <Box component="span">{a.meta}</Box>
          </Box>
        </Box>
        <Box
          sx={{
            display: { xs: 'none', sm: 'grid' },
            placeItems: 'center',
            flex: 'none',
            width: '2.4rem',
            height: '2.4rem',
            borderRadius: '50%',
            border: '1.5px solid rgba(126,217,87,0.4)',
            color: 'primary.main',
            transition: 'transform 240ms ease, background 200ms ease',
            transform: open ? 'rotate(45deg)' : 'none',
            bgcolor: open ? 'rgba(126,217,87,0.12)' : 'transparent',
          }}
        >
          <Icon name="plus" size={18} />
        </Box>
      </Box>
      <Box sx={{ display: 'grid', gridTemplateRows: open ? '1fr' : '0fr', transition: 'grid-template-rows 320ms cubic-bezier(0.4,0,0.2,1)' }}>
        <Box sx={{ overflow: 'hidden' }}>
          <Box
            sx={{
              p: { xs: '0 1.2rem 1.8rem', sm: '0 1.7rem 1.8rem calc(1.7rem + 2.4rem + 1.2rem)' },
              borderTop: '1px solid rgba(155,162,164,0.12)',
              mt: '-1px',
            }}
          >
            <AbstractBody a={a} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

/** Research-articles reading list: accordion, one open at a time. */
export default function ArticleAccordion() {
  const [open, setOpen] = useState(0);
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {ARTICLES.map((a, i) => (
        <ScrollReveal key={a.title} delay={Math.min(i, 4) * 0.04}>
          <AccordionItem a={a} n={i + 1} open={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />
        </ScrollReveal>
      ))}
    </Box>
  );
}
