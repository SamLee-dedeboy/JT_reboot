import { Box, Container, Typography, useTheme } from '@mui/material'
import { assetUrl } from '../utils/baseUrl';

export default function Footer() {
  const theme = useTheme();

  return (
    <Box component="footer" sx={{ bgcolor: '#343c40', color: 'common.white', pt: theme.jtSpacing.section.sm, pb: theme.jtSpacing.component.lg }}>
      <Container>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: theme.jtSpacing.gap.lg,
            alignItems: 'center',
            textAlign: { xs: 'center', md: 'left' },
            pb: theme.jtSpacing.section.xs,
            mb: theme.jtSpacing.component.lg,
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Box>
            <Typography variant="h2" component="h2" sx={{ color: 'primary.main', mb: theme.jtSpacing.component.sm }}>Project Funding</Typography>
            <Box
              component="blockquote"
              sx={{ m: 0, pl: theme.jtSpacing.component.md, borderLeft: 4, borderColor: 'primary.main', typography: 'body1', lineHeight: 1.8 }}
            >
              This project is supported by the University of California's Multicampus Research Programs
              and Initiatives (MRPI) grant, which funds system-wide, cross-campus collaborative research
              of significance to the State of California.
            </Box>
          </Box>
          <Box>
            <Box
              component="img"
              src={assetUrl('/images/uc-logo-white.png')}
              alt="University of California"
              sx={{ maxWidth: 250, height: 'auto', mx: { xs: 'auto', md: 0 } }}
            />
          </Box>
        </Box>

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" component="p" sx={{ mb: 0.5 }}>Just Transitions in the Delta</Typography>
          <Typography variant="body2" component="p" sx={{ opacity: 0.5, mb: 0.5 }}>&copy; {new Date().getFullYear()} All rights reserved.</Typography>
          <Box
            component="a"
            href="mailto:just.transitions@ucdavis.edu"
            sx={{ display: 'inline-block', color: 'primary.main', mb: 0.5, transition: 'opacity 0.2s', '&:hover': { opacity: 0.8 } }}
          >
            just.transitions@ucdavis.edu
          </Box>
          <Typography variant="body2" component="p" sx={{ opacity: 0.6 }}>UC Multicampus Research Program Initiative</Typography>
        </Box>
      </Container>
    </Box>
  );
}
