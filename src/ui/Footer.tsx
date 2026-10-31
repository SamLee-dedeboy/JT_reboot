// Shared site footer with funding copy, contact link, and wordmark.
import { Box, Container, Link, Typography, useTheme } from '@mui/material'
import { LogoWordmark } from './Logo'

export default function Footer() {
  const theme = useTheme()
  const year = new Date().getFullYear()

  return (
    <Box
      component="footer"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        bgcolor: 'base.900',
        color: 'common.white',
        paddingBlock: { xs: theme.jtSpacing.component.lg, md: theme.jtSpacing.section.sm },
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          sx={{
            maxWidth: theme.jtSpacing.paragraphMaxWidth.default,
            marginInline: 'auto',
            textAlign: 'left',
          }}
        >
          <Box>
            <Typography
              variant="eyebrow"
              component="p"
              sx={{
                marginBottom: theme.jtSpacing.component.sm,
                color: 'primary.main',
              }}
            >
              Project Funding
            </Typography>
            <Box
              component="blockquote"
              sx={{
                margin: 0,
                typography: 'body1',
                fontSize: { xs: '0.95rem', sm: theme.typography.body1.fontSize },
                lineHeight: { xs: 1.55, sm: theme.typography.body1.lineHeight },
              }}
            >
              This project is supported by the University of California's Multicampus Research
              Programs and Initiatives (MRPI), which funds system-wide, cross-campus collaborative
              research of significance to the State of California.
            </Box>
          </Box>

        </Box>

        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'flex-start',
            gap: theme.jtSpacing.gap.sm,
            alignItems: 'center',
            maxWidth: theme.jtSpacing.paragraphMaxWidth.default,
            marginInline: 'auto',
            marginTop: theme.jtSpacing.component.lg,
            color: 'base.200',
            textAlign: 'left',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'flex-start',
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
              justifyContent: 'flex-start',
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
  )
}
