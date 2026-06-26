// Generic page section wrapper that applies themed vertical rhythm, optional
// background color, and an inner content container.
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

export default function Section({ id, bg, bleed, sx, containerSx, children }: SectionProps) {
  return (
    <Box
      component="section"
      id={id}
      sx={[
        (theme) => ({
          py: { xs: theme.jtSpacing.section.md, md: theme.jtSpacing.section.xl },
          bgcolor: bg,
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {bleed ? (
        children
      ) : (
        <Container
          maxWidth="lg"
          sx={[
            (theme) => ({
              px: { xs: theme.jtSpacing.gap.lg, md: theme.jtSpacing.gap.xl },
            }),
            ...(Array.isArray(containerSx) ? containerSx : [containerSx]),
          ]}
        >
          {children}
        </Container>
      )}
    </Box>
  );
}
