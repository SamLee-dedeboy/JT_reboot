import { Box, Button, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';
import Icon from '../Icon';

export interface SideGlowCardProps {
  number: string;
  title: string;
  label: string;
  body: ReactNode;
  accent?: 'primary' | 'secondary';
  actionLabel?: string;
  actionIcon?: ReactNode;
}

export default function SideGlowCard({ number, title, label, body, accent = 'secondary', actionLabel = 'Explore', actionIcon }: SideGlowCardProps) {
  const isPrimary = accent === 'primary';

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: 280,
        p: { xs: 2.4, md: 3 },
        border: '2px solid',
        borderColor: isPrimary ? 'translucent.primaryGreen' : 'rgba(81,162,189,0.68)',
        borderRadius: 0,
        bgcolor: 'rgba(20,29,31,0.74)',
        overflow: 'hidden',
        backdropFilter: 'blur(14px)',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: '0 auto 0 0',
          width: 5,
          bgcolor: isPrimary ? 'primary.main' : 'secondary.main',
          boxShadow: isPrimary ? '0 0 24px var(--mui-palette-translucent-primaryGreen)' : '0 0 24px rgba(81,162,189,0.8)',
        },
      }}
    >
      <Stack spacing={2} sx={{ height: '100%' }}>
        <Typography variant="numberGhost" component="p">
          {number}
        </Typography>
        <Typography variant="h4" component="h3">
          {title}
        </Typography>
        <Typography variant="eyebrow" component="p" sx={{ color: isPrimary ? 'primary.main' : 'secondary.main' }}>
          {label}
        </Typography>
        <Typography variant="body2" sx={{ color: 'base.100', flex: 1 }}>
          {body}
        </Typography>
        <Button
          endIcon={actionIcon ?? <Icon name="arrow-up-right" size={15} />}
          sx={{
            alignSelf: 'flex-start',
            color: 'common.white',
            border: 1,
            borderColor: 'base.300',
            bgcolor: 'transparent',
            '&:hover': {
              borderColor: isPrimary ? 'primary.main' : 'secondary.main',
              bgcolor: isPrimary ? 'translucent.primaryGreen' : 'rgba(81,162,189,0.1)',
            },
          }}
        >
          {actionLabel}
        </Button>
      </Stack>
    </Box>
  );
}
