import { Typography } from '@mui/material';
import type { TypographyProps } from '@mui/material';

/**
 * Small section label backed by the MUI `eyebrow` typography variant.
 */
export default function Eyebrow({ sx, children, ...rest }: TypographyProps) {
  return (
    <Typography
      variant="eyebrow"
      component="span"
      sx={[
        {
          display: 'block',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...rest}
    >
      {children}
    </Typography>
  );
}
