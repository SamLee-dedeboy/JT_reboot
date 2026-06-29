import { Box, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import type { ReactNode } from 'react';
import { palette } from '../../../theme/muiTheme';

export interface NotchTabCardProps {
  eyebrow: string;
  number: string;
  title: string;
  lead: ReactNode;
  body?: ReactNode;
  icon?: ReactNode;
}

export default function NotchTabCard({ eyebrow, number, title, lead, body, icon }: NotchTabCardProps) {
  return (
    <Box sx={{ position: 'relative', pt: 2.75 }}>
      <Box
        component="span"
        sx={(theme) => ({
          position: 'absolute',
          top: 0,
          left: theme.jtSpacing.component.lg,
          zIndex: 2,
          bgcolor: 'primary.main',
          color: 'common.black',
          fontFamily: 'var(--font-heading)',
          fontSize: '1.05rem',
          letterSpacing: '0.08em',
          lineHeight: 1,
          px: theme.jtSpacing.component.sm,
          pt: theme.jtSpacing.component.xs,
          pb: theme.jtSpacing.component.sm,
          borderRadius: 'var(--mui-shape-borderRadius) var(--mui-shape-borderRadius) 0 0',
          boxShadow: `0 -${theme.spacing(0.25)} ${theme.spacing(1.25)} ${alpha(theme.palette.common.black, 0.25)}`,
        })}
      >
        {number}
      </Box>
      <Box
        sx={(theme) => ({
          position: 'relative',
          zIndex: 1,
          bgcolor: 'base.700',
          border: '1px solid',
          borderColor: alpha(palette.base[200], 0.2),
          borderTop: '2px solid',
          borderTopColor: 'primary.main',
          borderRadius: 'calc(var(--mui-shape-borderRadius) * 0.5) calc(var(--mui-shape-borderRadius) * 1.5) calc(var(--mui-shape-borderRadius) * 1.5) calc(var(--mui-shape-borderRadius) * 1.5)',
          p: theme.jtSpacing.component.lg,
          boxShadow: `0 ${theme.spacing(2)} ${theme.spacing(4.5)} -${theme.spacing(2)} ${alpha(theme.palette.common.black, 0.55)}`,
        })}
      >
        <Stack spacing={1.2}>
          <Box
            sx={(theme) => ({
              display: 'flex',
              alignItems: 'center',
              gap: theme.jtSpacing.gap.sm,
              color: 'primary.main',
            })}
          >
            {icon && <Box sx={{ display: 'inline-flex', color: 'primary.main', flex: 'none' }}>{icon}</Box>}
            <Typography variant="eyebrow" component="p">
              {eyebrow}
            </Typography>
          </Box>
          <Typography variant="h3" component="h3" sx={{ color: 'primary.main', fontSize: 'clamp(1.35rem, 1rem + 1vw, 1.5rem)' }}>
            {title}
          </Typography>
          <Typography variant="body1" sx={{ color: 'common.white' }}>
            {lead}
          </Typography>
          {body && (
            <Typography variant="body2" sx={{ color: 'base.100' }}>
              {body}
            </Typography>
          )}
        </Stack>
      </Box>
    </Box>
  );
}
