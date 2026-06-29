import { Box, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';
import Icon from '../Icon';
import { assetUrl } from '../../../utils/baseUrl';

export interface ResourceReportAction {
  label: string;
  kind: 'download' | 'view';
  href?: string;
}

export interface ResourceReportCardProps {
  badge: string;
  title: string;
  image?: string;
  description: ReactNode;
  actions?: ResourceReportAction[];
}

function ActionLink({ action }: { action: ResourceReportAction }) {
  const ghost = action.kind !== 'download';

  return (
    <Box
      component="a"
      href={action.href ?? '#'}
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
      {action.label}
      {action.kind === 'download' ? <Icon name="arrow-down" size={15} /> : <Icon name="arrow-up-right" size={15} />}
    </Box>
  );
}

export default function ResourceReportCard({ badge, title, image, description, actions = [] }: ResourceReportCardProps) {
  return (
    <Box
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
        '&:hover .report-cover-img': { transform: 'scale(1.04)' },
      }}
    >
      <Box sx={{ position: 'relative', aspectRatio: '16 / 10', bgcolor: 'base.700', overflow: 'hidden' }}>
        {image ? (
          <Box
            className="report-cover-img"
            component="img"
            src={assetUrl(image)}
            alt={title}
            loading="lazy"
            sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 400ms cubic-bezier(0.22,1,0.36,1)' }}
          />
        ) : (
          <Box sx={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', bgcolor: 'primary.main', p: '1.4rem' }}>
            <Typography variant="h4" component="span" sx={{ color: 'base.700', textAlign: 'center' }}>
              {title}
            </Typography>
          </Box>
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
            typography: 'eyebrow',
            fontSize: '0.68rem',
            px: '0.7rem',
            py: '0.36rem',
            borderRadius: '999px',
            backdropFilter: 'blur(2px)',
          }}
        >
          {badge}
        </Box>
      </Box>
      <Stack spacing={1.2} sx={{ p: '1.4rem 1.4rem 1.5rem', flex: 1 }}>
        <Typography
          variant="h4"
          component="h3"
          sx={{ fontFamily: 'var(--font-body)', fontWeight: 700, letterSpacing: '0.03em', fontSize: '1.18rem', color: 'secondary.light', lineHeight: 1.15 }}
        >
          {title}
        </Typography>
        <Typography sx={{ fontSize: '1.02rem', lineHeight: 1.5, color: 'base.100' }}>{description}</Typography>
        {actions.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', mt: 'auto', pt: '0.4rem' }}>
            {actions.map((action) => (
              <ActionLink key={`${action.kind}-${action.label}`} action={action} />
            ))}
          </Box>
        )}
      </Stack>
    </Box>
  );
}
