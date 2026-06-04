import { Box } from '@mui/material';
import type { ReactNode } from 'react';

interface PlaceholderProps {
  label: string;
  /** CSS aspect-ratio, e.g. "16 / 10". Ignored if minHeight is set. */
  ratio?: string;
  minHeight?: string | number;
  radius?: number | string;
  children?: ReactNode;
}

/**
 * Diagonal-striped placeholder box with a pill label — used wherever a
 * real photo/map isn't available yet. Ported from the design prototype's
 * `.ph` primitive.
 */
export default function Placeholder({
  label,
  ratio = '16 / 10',
  minHeight,
  radius,
  children,
}: PlaceholderProps) {
  return (
    <Box
      sx={{
        position: 'relative',
        borderRadius: radius ?? 'var(--mui-shape-borderRadius, 12px)',
        overflow: 'hidden',
        bgcolor: 'base.700',
        backgroundImage:
          'repeating-linear-gradient(-45deg, rgba(255,255,255,0.035) 0px, rgba(255,255,255,0.035) 2px, transparent 2px, transparent 11px)',
        border: '1px solid rgba(155,162,164,0.18)',
        display: 'grid',
        placeItems: 'center',
        aspectRatio: minHeight ? undefined : ratio,
        minHeight,
      }}
    >
      {children}
      <Box
        component="span"
        sx={{
          fontFamily: '"Nunito Sans", monospace',
          fontSize: '0.8rem',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'base.200',
          bgcolor: 'rgba(16, 22, 24, 0.55)',
          px: 1.4,
          py: 0.7,
          borderRadius: '999px',
          border: '1px solid rgba(155,162,164,0.2)',
        }}
      >
        {label}
      </Box>
    </Box>
  );
}
