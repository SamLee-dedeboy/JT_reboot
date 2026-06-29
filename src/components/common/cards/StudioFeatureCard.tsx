import { Box, Typography } from '@mui/material';
import type { ReactNode } from 'react';
import Icon from '../Icon';
import { assetUrl } from '../../../utils/baseUrl';

export interface StudioFeatureCardProps {
  badge: string;
  number: string;
  title: string;
  body: ReactNode;
  image: string;
  imageAlt: string;
  place?: string;
  flip?: boolean;
  actionLabel?: string;
  actionHref?: string;
}

export default function StudioFeatureCard({ badge, number, title, body, image, imageAlt, place, flip = false, actionLabel, actionHref = '#' }: StudioFeatureCardProps) {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: flip ? '1fr 1.35fr' : '1.35fr 1fr', sm: '1fr 1.2fr' }, gap: { xs: '1.3rem', md: '2.6rem' }, alignItems: 'center', py: { xs: '1.3rem', md: '2.6rem' }, borderTop: '1px solid rgba(155,162,164,0.16)', borderBottom: '1px solid rgba(155,162,164,0.16)' }}>
      <Box sx={{ order: { xs: 0, md: flip ? 2 : 0 }, borderRadius: 'var(--mui-shape-borderRadius)', overflow: 'hidden', border: '1px solid rgba(155,162,164,0.2)', bgcolor: 'base.700' }}>
        <Box component="img" src={assetUrl(image)} alt={imageAlt} loading="lazy" sx={{ width: '100%', display: 'block' }} />
      </Box>
      <Box>
        <Box sx={{ display: 'inline-flex', alignItems: 'center', bgcolor: 'base.800', border: 1, borderColor: 'translucent.primaryGreen', color: 'primary.main', typography: 'eyebrow', fontSize: '0.68rem', px: '0.7rem', py: '0.36rem', borderRadius: '999px', mb: '1rem' }}>
          {badge}
        </Box>
        <Typography variant="numberGhost" component="div" sx={{ mb: '0.6rem' }}>
          {number}
        </Typography>
        <Typography variant="h3" component="h3" sx={{ color: 'primary.main', mb: '0.7rem' }}>
          {title}
        </Typography>
        {place && (
          <Typography sx={{ fontFamily: 'var(--font-body)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.9rem', color: 'secondary.light', mb: '1rem' }}>
            {place}
          </Typography>
        )}
        <Typography sx={{ fontSize: place ? '1.25rem' : undefined, lineHeight: place ? 1.6 : undefined, mb: actionLabel ? '1.6rem' : 0, maxWidth: place ? '42ch' : undefined, color: 'base.100' }}>
          {body}
        </Typography>
        {actionLabel && (
          <Box
            component="a"
            href={actionHref}
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
            {actionLabel}
            <Icon name="arrow-down" size={16} />
          </Box>
        )}
      </Box>
    </Box>
  );
}
