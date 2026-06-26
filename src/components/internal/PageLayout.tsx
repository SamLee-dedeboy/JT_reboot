// Shared internal-tool page shell with global navigation, optional title
// header, and consistent content width handling.
import { Box, Container, Typography } from '@mui/material';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';

interface PageLayoutProps {
  title: string;
  children: React.ReactNode;
  fullWidthContent?: boolean;
  hideTitle?: boolean;
}

export default function PageLayout({ title, children, fullWidthContent = false, hideTitle = false }: PageLayoutProps) {
  return (
    <>
      <Navbar />
      <Box component="main" sx={{ minHeight: '100vh', bgcolor: 'brand.base', color: 'common.white' }}>
        {!hideTitle && (
          <Box
            sx={(theme) => ({
              bgcolor: 'brand.base',
              color: 'common.white',
              pt: theme.jtSpacing.section.md,
              pb: theme.jtSpacing.section.xs,
            })}
          >
            <Container>
              <Typography variant="h2" component="h1">{title}</Typography>
            </Container>
          </Box>
        )}

        {fullWidthContent ? (
          <Box sx={(theme) => contentSx(theme)}>{children}</Box>
        ) : (
          <Container sx={(theme) => contentSx(theme)}>{children}</Container>
        )}
      </Box>
      <Footer />
    </>
  );
}

// Shared content styling (replaces the old PageLayout.css descendant rules).
// Spacing/colours come from the MUI theme; classNames like `.card-grid`/`.card`
// remain as structural hooks styled centrally here rather than in a CSS file.
function contentSx(theme: import('@mui/material').Theme) {
  return {
    py: theme.jtSpacing.section.xs,
    '& h2': {
      color: 'secondary.main',
      mt: theme.jtSpacing.section.xs,
      mb: theme.jtSpacing.component.sm,
    },
    '& h2:first-of-type': { mt: 0 },
    '& p': { mb: theme.jtSpacing.component.sm },
    '& a': { color: 'secondary.main', textDecoration: 'underline' },
    '& .card-grid': {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: theme.jtSpacing.gap.sm,
      my: theme.jtSpacing.component.md,
    },
    '& .card': {
      backgroundColor: 'surface',
      borderRadius: 1,
      borderLeft: 4,
      borderColor: 'primary.main',
      boxShadow: 'none',
    },
  } as const;
}
