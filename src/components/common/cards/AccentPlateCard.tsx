import { Box, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import type { ReactNode } from 'react';
import { palette } from '../../../theme/muiTheme';

export interface AccentPlateCardProps {
  eyebrow: string;
  number: string;
  title: string;
  lead: ReactNode;
  body?: ReactNode;
}

export default function AccentPlateCard({ eyebrow, number, title, lead, body }: AccentPlateCardProps) {
  return (
    <Box
      sx={(theme) => ({
        overflow: 'hidden',
        borderRadius: 'calc(var(--mui-shape-borderRadius) * 1.75)',
        boxShadow: `0 ${theme.spacing(2)} ${theme.spacing(5)} ${alpha(theme.palette.common.black, 0.38)}`,
      })}
    >
      <Box
        sx={(theme) => ({
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: theme.jtSpacing.gap.md,
          bgcolor: 'primary.main',
          color: 'common.black',
          px: theme.jtSpacing.component.lg,
          py: theme.jtSpacing.component.md,
        })}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="eyebrow" component="p" sx={{ color: (theme) => alpha(theme.palette.common.black, 0.62) }}>
            {eyebrow}
          </Typography>
          <Typography
            component="h3"
            sx={{
              mt: 0.45,
              color: 'common.black',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: 0,
              fontSize: 'clamp(1.15rem, 0.95rem + 0.65vw, 1.35rem)',
              lineHeight: 1.05,
            }}
          >
            {title}
          </Typography>
        </Box>
        <Typography
          component="span"
          sx={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2rem, 1.5rem + 1vw, 2.4rem)',
            lineHeight: 1,
            color: (theme) => alpha(theme.palette.common.black, 0.28),
            flex: 'none',
          }}
        >
          {number}
        </Typography>
      </Box>
      <Stack
        spacing={1.2}
        sx={(theme) => ({
          bgcolor: 'base.700',
          border: '1px solid',
          borderColor: alpha(palette.base[200], 0.16),
          borderTop: 'none',
          borderRadius: '0 0 calc(var(--mui-shape-borderRadius) * 1.75) calc(var(--mui-shape-borderRadius) * 1.75)',
          px: theme.jtSpacing.component.lg,
          py: theme.jtSpacing.component.lg,
        })}
      >
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
  );
}
