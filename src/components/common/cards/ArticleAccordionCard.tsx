import { Box, Typography } from '@mui/material';
import type { ReactNode } from 'react';
import Icon from '../Icon';

export interface ArticleAccordionCardProps {
  number: string;
  title: string;
  source: string;
  meta: string;
  kicker?: string;
  children: ReactNode;
}

export default function ArticleAccordionCard({ number, title, source, meta, kicker = 'Abstract', children }: ArticleAccordionCardProps) {
  return (
    <Box sx={{ bgcolor: 'surface', border: 1, borderColor: 'translucent.primaryGreen', borderRadius: 'var(--mui-shape-borderRadius)', overflow: 'hidden' }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'auto 1fr', sm: 'auto 1fr auto' }, gap: { xs: '0.8rem', sm: '1.2rem' }, alignItems: 'center', p: { xs: '1.2rem', sm: '1.5rem 1.7rem' } }}>
        <Typography variant="numberArticle" component="span">
          {number}
        </Typography>
        <Box>
          <Typography sx={{ fontSize: '1.3rem', fontWeight: 700, lineHeight: 1.3, color: 'common.white', mb: '0.4rem' }}>{title}</Typography>
          <Typography sx={{ fontSize: '0.98rem', color: 'base.200' }}>
            <Box component="span" sx={{ color: 'primary.main', fontWeight: 600 }}>
              {source}
            </Box>{' '}
            {meta}
          </Typography>
        </Box>
        <Box sx={{ display: { xs: 'none', sm: 'grid' }, placeItems: 'center', width: '2.4rem', height: '2.4rem', borderRadius: '50%', border: 1.5, borderColor: 'translucent.primaryGreen', color: 'primary.main', bgcolor: 'translucent.primaryGreen' }}>
          <Icon name="plus" size={18} />
        </Box>
      </Box>
      <Box sx={{ p: { xs: '0 1.2rem 1.8rem', sm: '0 1.7rem 1.8rem calc(1.7rem + 2.4rem + 1.2rem)' }, borderTop: '1px solid rgba(155,162,164,0.12)' }}>
        <Typography sx={{ fontFamily: 'var(--font-heading)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.78rem', color: 'secondary.main', pt: '1.3rem', mb: '0.9rem' }}>
          {kicker}
        </Typography>
        <Typography sx={{ fontSize: '1.08rem', lineHeight: 1.7, color: 'base.100' }}>{children}</Typography>
      </Box>
    </Box>
  );
}
