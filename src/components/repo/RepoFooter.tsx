import { Box, Container, Typography } from '@mui/material';
import Icon from '../common/Icon';

/** Minimal centered footer for the repository pages. */
export default function RepoFooter() {
  return (
    <Box
      component="footer"
      sx={{ bgcolor: 'footerBg', pt: '3.4rem', pb: '2.6rem', mt: { xs: '3.75rem', md: '6rem' }, textAlign: 'center' }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: '1.25rem', md: '2rem' } }}>
        <Typography variant="h3" component="p" sx={{ color: 'primary.main', mb: '0.9rem', letterSpacing: '0.03em' }}>
          Just Transitions in the Delta
        </Typography>
        <Typography sx={{ opacity: 0.5, fontSize: '1.05rem', mb: '0.4rem' }}>
          &copy; {new Date().getFullYear()} All rights reserved.
        </Typography>
        <Box
          component="a"
          href="mailto:just.transitions@ucdavis.edu"
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: 'primary.main',
            mb: '0.4rem',
            transition: 'opacity 0.2s',
            '&:hover': { opacity: 0.8 },
          }}
        >
          <Icon name="mail" size={18} /> just.transitions@ucdavis.edu
        </Box>
        <Typography sx={{ opacity: 0.6, fontSize: '1.05rem' }}>
          University of California Multicampus Research Program Initiative
        </Typography>
      </Container>
    </Box>
  );
}
