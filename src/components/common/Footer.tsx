// Shared site footer with funding copy, UC branding, contact link, and wordmark.
import { Box, Container, Link, Typography, useTheme } from '@mui/material';
import { assetUrl } from '../../utils/baseUrl';
import { LogoWordmark } from './Logo';

export default function Footer() {
  const theme = useTheme();
  const year = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        bgcolor: 'base.900',
        color: 'common.white',
        py: { xs: theme.jtSpacing.section.sm, md: theme.jtSpacing.section.md },
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'minmax(0, 1fr) minmax(88px, 27vw)',
              sm: 'minmax(0, 1fr) minmax(150px, 250px)',
              md: 'minmax(0, 1fr) auto',
            },
            gap: { xs: theme.jtSpacing.gap.sm, md: theme.jtSpacing.section.sm },
            alignItems: 'center',
          }}
        >
          <Box>
            <Typography
              variant="eyebrow"
              component="p"
              sx={{
                mb: theme.jtSpacing.component.sm,
                color: 'primary.main',
              }}
            >
              Project Funding
            </Typography>
            <Box
              component="blockquote"
              sx={{
                m: 0,
                maxWidth: theme.jtSpacing.paragraphMaxWidth.default,
                pl: { xs: theme.jtSpacing.component.sm, md: theme.jtSpacing.component.md },
                borderLeft: '3px solid',
                borderColor: 'primary.main',
                typography: 'body1',
                fontSize: { xs: '0.95rem', sm: theme.typography.body1.fontSize },
                lineHeight: { xs: 1.55, sm: theme.typography.body1.lineHeight },
              }}
            >
              This project is supported by the University of California's Multicampus Research Programs
              and Initiatives (MRPI), which funds system-wide, cross-campus collaborative research of
              significance to the State of California.
            </Box>
          </Box>

          <Box
            sx={{
              justifySelf: 'end',
              alignSelf: 'center',
              width: { xs: '100%', md: 270 },
              maxWidth: '100%',
            }}
          >
            <Box
              component="img"
              src={assetUrl('/images/uc-logo-white.png')}
              alt="University of California"
              sx={{
                display: 'block',
                width: '100%',
                height: 'auto',
              }}
            />
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: { xs: 'flex-start', md: 'space-between' },
            gap: theme.jtSpacing.gap.sm,
            alignItems: { xs: 'flex-start', md: 'center' },
            mt: { xs: theme.jtSpacing.component.lg, md: theme.jtSpacing.section.sm },
            pt: theme.jtSpacing.component.md,
            borderTop: '1px solid',
            borderColor: 'surface',
            color: 'base.200',
            textAlign: 'left',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: { xs: theme.jtSpacing.gap.xs, sm: theme.jtSpacing.gap.sm },
              alignItems: 'center',
            }}
          >
            <LogoWordmark
              variant="mobile"
              linkToHome={false}
              component="p"
              sx={{
                fontSize: theme.logoWordmark.footerFontSize,
                textAlign: 'left',
              }}
            />
            <Typography variant="body2" component="p" sx={{ color: 'inherit' }}>
              &copy; {year} All rights reserved.
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: { xs: theme.jtSpacing.gap.xs, sm: theme.jtSpacing.gap.sm },
              alignItems: 'center',
            }}
          >
            <Link
              href="mailto:just.transitions@ucdavis.edu"
              color="primary.main"
              underline="hover"
              sx={{
                typography: 'body2',
                transition: 'color 180ms ease, opacity 180ms ease',
                '&:hover': {
                  color: 'primary.light',
                },
              }}
            >
              just.transitions@ucdavis.edu
            </Link>
            <Typography variant="body2" component="p" sx={{ color: 'inherit' }}>
              UC Multicampus Research Program Initiative
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
