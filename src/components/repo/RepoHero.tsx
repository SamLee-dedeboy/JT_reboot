import { Box, Container, Typography } from '@mui/material';
import type { ReactNode } from 'react';
import Reveal from '../common/Reveal';
import Eyebrow from '../common/Eyebrow';
import RepoTabs, { type RepoTabKey } from './RepoTabs';

interface RepoHeroProps {
  eyebrow: string;
  title: ReactNode;
  lede: string;
  current: RepoTabKey;
  /** Optional meta row rendered under the tab strip (e.g. count · years). */
  meta?: ReactNode;
}

/** Shared chrome across all three repository pages. */
export default function RepoHero({ eyebrow, title, lede, current, meta }: RepoHeroProps) {
  return (
    <Box component="header" id="top" sx={{ pt: '3.4rem' }}>
      <Container maxWidth="lg" sx={{ px: { xs: '1.25rem', md: '2rem' } }}>
        <Reveal>
          <Eyebrow sx={{ mb: '0.9rem' }}>{eyebrow}</Eyebrow>
          <Typography variant="h1" component="h1" sx={{ maxWidth: '22ch', mb: '1.4rem' }}>
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
        <Reveal delay={0.14}>
          <RepoTabs current={current} />
        </Reveal>
        {meta && (
          <Reveal sx={{ display: 'flex', alignItems: 'baseline', gap: '1rem', mt: '2.2rem', color: 'base.200', fontSize: '1rem' }}>
            {meta}
          </Reveal>
        )}
      </Container>
    </Box>
  );
}
