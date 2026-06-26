// Repository navigation tabs for switching between documentation/resource
// sections.
import { Link } from 'react-router-dom';
import { Box, Container, Typography } from '@mui/material';

export type RepoTabKey = 'docs' | 'learning' | 'resources';

const REPO_TABS: { n: string; label: string; shortLabel: string; to: string; key: RepoTabKey }[] = [
  { n: '01', label: 'Project Documentation', shortLabel: 'Documentation', to: '/pages/project-documentation', key: 'docs' },
  { n: '02', label: 'Service Learning', shortLabel: 'Learning', to: '/pages/service-learning', key: 'learning' },
  { n: '03', label: 'References & Resources', shortLabel: 'References', to: '/pages/resources', key: 'resources' },
];

/** Top-level switcher linking the three repository pages. */
export default function RepoTabs({ current }: { current: RepoTabKey }) {
  return (
    <Box
      component="nav"
      aria-label="Repository sections"
      sx={{
        position: 'sticky',
        top: { xs: 72, md: 76 },
        zIndex: 90,
        bgcolor: 'rgba(34,47,52,0.96)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid rgba(155,162,164,0.16)',
        borderBottom: '1px solid rgba(155,162,164,0.2)',
        boxShadow: '0 12px 28px rgba(0,0,0,0.18)',
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          px: { xs: '1rem', md: '2rem' },
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'auto minmax(0, 1fr)' },
          alignItems: 'center',
          gap: { xs: 0.75, md: 2 },
          py: { xs: 0.75, md: 0 },
        }}
      >
        <Typography
          variant="eyebrow"
          component="p"
          sx={{
            display: { xs: 'none', md: 'block' },
            pr: 2,
            color: 'base.100',
            whiteSpace: 'nowrap',
          }}
        >
          Repository
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(3, max-content)', sm: 'repeat(3, minmax(0, 1fr))' },
            gap: { xs: 0.75, md: 1 },
            overflowX: 'auto',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
          }}
        >
          {REPO_TABS.map((tab) => {
            const active = tab.key === current;
            return (
              <Box
                key={tab.key}
                component={Link}
                to={tab.to}
                aria-current={active ? 'page' : undefined}
                sx={{
                  position: 'relative',
                  display: 'grid',
                  gridTemplateColumns: { xs: 'auto', sm: 'auto minmax(0, 1fr)' },
                  alignItems: 'center',
                  gap: { xs: 0.35, sm: 0.75 },
                  minWidth: { xs: 132, sm: 0 },
                  px: { xs: 1.25, md: 1.6 },
                  py: { xs: 1, md: 1.15 },
                  borderRadius: 'var(--mui-shape-borderRadius)',
                  color: active ? 'common.black' : 'common.white',
                  bgcolor: active ? 'primary.main' : 'transparent',
                  border: '1px solid',
                  borderColor: active ? 'primary.main' : 'transparent',
                  transition: 'background-color 180ms ease, border-color 180ms ease, color 180ms ease',
                  '&:hover, &:focus-visible': {
                    bgcolor: active ? 'primary.main' : 'rgba(126,217,87,0.08)',
                    borderColor: active ? 'primary.main' : 'rgba(126,217,87,0.32)',
                    outline: 'none',
                  },
                }}
              >
                <Typography
                  component="span"
                  sx={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.72rem',
                    letterSpacing: '0.1em',
                    lineHeight: 1,
                    color: active ? 'common.black' : 'primary.main',
                  }}
                >
                  {tab.n}
                </Typography>
                <Typography
                  component="span"
                  sx={{
                    fontFamily: 'var(--font-heading)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    fontSize: { xs: '0.8rem', sm: '0.9rem' },
                    lineHeight: 1.15,
                    whiteSpace: 'nowrap',
                  }}
                >
                  <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                    {tab.label}
                  </Box>
                  <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
                    {tab.shortLabel}
                  </Box>
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Container>
    </Box>
  );
}
