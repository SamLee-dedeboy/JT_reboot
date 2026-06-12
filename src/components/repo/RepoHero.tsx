import { Box, Container, Typography } from '@mui/material';
import type { ReactNode } from 'react';
import Reveal from '../common/Reveal';

interface RepoHeroProps {
  title: ReactNode;
  lede: string;
  /** Optional meta row rendered under the page lede (e.g. count / years). */
  meta?: ReactNode;
}

/** Shared chrome across all three repository pages. */
export default function RepoHero({ title, lede, meta }: RepoHeroProps) {
  return (
    <Box component="header" id="top" sx={{ pt: { xs: '2.6rem', md: '3.4rem' } }}>
      <Container maxWidth="lg" sx={{ px: { xs: '1.25rem', md: '2rem' } }}>
        <Reveal>
          <Typography
            variant="h1"
            component="h1"
            sx={{
              maxWidth: '24ch',
              mb: '1.4rem',
            }}
          >
            {title}
          </Typography>
        </Reveal>
        <Reveal delay={0.08}>
          <Typography
            component="p"
            sx={{
              maxWidth: '60ch',
              fontSize: '1.3rem',
              lineHeight: 1.7,
              color: 'rgba(242,240,239,0.9)',
              borderLeft: '3px solid',
              borderColor: 'primary.main',
              pl: '1.5rem',
            }}
          >
            {lede}
          </Typography>
        </Reveal>
        {meta && (
          <Reveal delay={0.14} sx={{ display: 'flex', alignItems: 'baseline', gap: '1rem', mt: '2.2rem', color: 'base.200', fontSize: '1rem' }}>
            {meta}
          </Reveal>
        )}
      </Container>
    </Box>
  );
}
