import { Link } from 'react-router-dom';
import { Box } from '@mui/material';

export type RepoTabKey = 'docs' | 'learning' | 'resources';

const REPO_TABS: { n: string; label: string; to: string; key: RepoTabKey }[] = [
  { n: '01', label: 'Project Documentation', to: '/pages/project-documentation', key: 'docs' },
  { n: '02', label: 'Service Learning', to: '/pages/service-learning', key: 'learning' },
  { n: '03', label: 'References & Resources', to: '/pages/resources', key: 'resources' },
];

/** Sub-tab strip linking the three repository pages. */
export default function RepoTabs({ current }: { current: RepoTabKey }) {
  return (
    <Box
      component="nav"
      aria-label="Repository sections"
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.5rem',
        mt: '2.6rem',
        borderBottom: '1px solid rgba(155,162,164,0.18)',
      }}
    >
      {REPO_TABS.map((tb) => {
        const on = tb.key === current;
        return (
          <Box
            key={tb.key}
            component={Link}
            to={tb.to}
            aria-current={on ? 'page' : undefined}
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.55rem',
              fontFamily: 'var(--font-heading)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              fontSize: '0.95rem',
              color: on ? 'primary.main' : 'rgba(242,240,239,0.6)',
              px: '1.15rem',
              py: '0.85rem',
              borderBottom: '2px solid',
              borderColor: on ? 'primary.main' : 'transparent',
              transition: 'color 180ms ease, border-color 180ms ease',
              '&:hover': { color: on ? 'primary.main' : 'common.white' },
            }}
          >
            <Box component="span" sx={{ fontSize: '0.72rem', letterSpacing: '0.1em', color: on ? 'primary.main' : 'base.200' }}>
              {tb.n}
            </Box>
            {tb.label}
          </Box>
        );
      })}
    </Box>
  );
}
