import { Box } from '@mui/material';
import type { BoxProps } from '@mui/material';

/**
 * Small Hammersmith One eyebrow label — uppercase, wide tracking, green.
 * Matches the design prototype's `.eyebrow`.
 */
export default function Eyebrow({ sx, children, ...rest }: BoxProps) {
  return (
    <Box
      component="span"
      sx={[
        {
          display: 'block',
          fontFamily: 'var(--font-heading, "Hammersmith One", sans-serif)',
          textTransform: 'uppercase',
          letterSpacing: '0.22em',
          fontSize: '0.85rem',
          color: 'primary.main',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...rest}
    >
      {children}
    </Box>
  );
}
