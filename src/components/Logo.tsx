import { Link } from 'react-router-dom';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';

export type LogoVariant = 'mobile' | 'tablet' | 'desktop';

type LogoWordmarkProps = {
  variant: LogoVariant;
  linkToHome?: boolean;
};

// Theme variants define the wordmark identity; these local values only tune
// the single-line logo so it fits the available navbar width.
const logoFit = {
  desktopMinWidth: 360,
  containerLineHeight: 1.05,
  fontSize: {
    mobile: 'clamp(1.05rem, 4vw, 1.2rem)',
    tablet: 'clamp(1.1rem, 2.4vw, 1.25rem)',
    desktop: { md: 'clamp(1.2rem, 1.6vw, 1.35rem)', lg: 'clamp(1.35rem, 1.35vw, 1.5rem)' },
  },
} as const;

function getLogoFontSize(variant: LogoVariant) {
  if (variant === 'mobile') {
    return logoFit.fontSize.mobile;
  }

  if (variant === 'tablet') {
    return logoFit.fontSize.tablet;
  }

  return logoFit.fontSize.desktop;
}

function useActiveLogoVariant(): LogoVariant {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  if (isMobile) {
    return 'mobile';
  }

  if (isTablet) {
    return 'tablet';
  }

  return 'desktop';
}

export function LogoWordmark({ variant, linkToHome = true }: LogoWordmarkProps) {
  const isDesktop = variant === 'desktop';
  const title = 'Just Transitions in the Delta';
  const fontSize = getLogoFontSize(variant);
  const theme = useTheme();

  return (
    <Box
      component={linkToHome ? Link : 'div'}
      to={linkToHome ? '/' : undefined}
      sx={{
        textDecoration: 'none',
        color: 'primary.main',
        minWidth: isDesktop ? logoFit.desktopMinWidth : 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        textAlign: 'right',
        lineHeight: logoFit.containerLineHeight,
        py: theme.jtSpacing.component.xs,
      }}
    >
      <Typography
        variant="logo"
        component="span"
        sx={{
          fontSize,
          whiteSpace: 'nowrap',
        }}
      >
        {title}
      </Typography>
    </Box>
  );
}

export default function Logo() {
  const variant = useActiveLogoVariant();
  return <LogoWordmark variant={variant} />;
}
