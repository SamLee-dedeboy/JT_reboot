import { Box } from '@mui/material';
import type { ReactNode } from 'react';

export type HighlightStyleVariant = 'underline' | 'wash' | 'pill';

/** Semantic inline highlight, with style variants for design-system exploration. */
export default function Hl({
  children,
  color = 'rgba(126,217,87,0.28)',
  styleVariant = 'underline',
}: {
  children: ReactNode;
  color?: string;
  styleVariant?: HighlightStyleVariant;
}) {
  const styleByVariant = {
    underline: {
      background: `linear-gradient(transparent 62%, ${color} 62%)`,
      px: '0.1em',
      borderRadius: '2px',
    },
    wash: {
      background: color,
      px: '0.16em',
      borderRadius: '4px',
    },
    pill: {
      background: color,
      px: '0.38em',
      py: '0.03em',
      borderRadius: '999px',
    },
  } as const;

  return (
    <Box
      component="mark"
      sx={{
        color: 'common.white',
        ...styleByVariant[styleVariant],
      }}
    >
      {children}
    </Box>
  );
}
