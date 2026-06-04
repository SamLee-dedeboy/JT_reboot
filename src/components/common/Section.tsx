import { Box, Container } from '@mui/material';
import type { ReactNode } from 'react';
import type { SxProps, Theme } from '@mui/material';

interface SectionProps {
  id?: string;
  /** Background color token (theme palette path) or CSS color. */
  bg?: string;
  /** Render children full-bleed without the inner Container. */
  bleed?: boolean;
  /** Extra sx for the outer <section>. */
  sx?: SxProps<Theme>;
  /** Extra sx for the inner Container. */
  containerSx?: SxProps<Theme>;
  children: ReactNode;
}

/**
 * Page section with the design's vertical rhythm (~6rem block padding)
 * and a 1200px content container (2rem inline gutter).
 */
export default function Section({ id, bg, bleed, sx, containerSx, children }: SectionProps) {
  return (
    <Box
      component="section"
      id={id}
      sx={[
        { py: { xs: '3.75rem', md: '6rem' }, bgcolor: bg },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {bleed ? (
        children
      ) : (
        <Container maxWidth="lg" sx={[{ px: { xs: '1.25rem', md: '2rem' } }, ...(Array.isArray(containerSx) ? containerSx : [containerSx])]}>
          {children}
        </Container>
      )}
    </Box>
  );
}
