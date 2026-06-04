import { Box } from '@mui/material';
import type { ReactNode } from 'react';

/** Green underline-style inline highlight (the design's `.hl`). */
export default function Hl({ children }: { children: ReactNode }) {
  return (
    <Box
      component="mark"
      sx={{
        background:
          'linear-gradient(transparent 62%, rgba(126,217,87,0.28) 62%)',
        color: 'common.white',
        px: '0.1em',
        borderRadius: '2px',
      }}
    >
      {children}
    </Box>
  );
}
