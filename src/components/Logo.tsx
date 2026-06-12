import { Link } from 'react-router-dom';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';

export type LogoVariant = 'mobile' | 'tablet' | 'desktop';

type LogoProps = {
  compressed?: boolean;
};

type LogoWordmarkProps = {
  variant: LogoVariant;
  linkToHome?: boolean;
  compressed?: boolean;
};

const collapseEase = [0.4, 0, 0.2, 1] as const;
const contentMotion = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
  transition: { duration: 0.28, ease: 'easeOut' as const },
};

// Theme variants define the logo text identity; these local values only make
// each navbar state fit its available space.
const logoFit = {
  desktopMinWidth: 360,
  containerLineHeight: 1.05,
  subtitleMarginTop: 0.2,
  titleFontSize: {
    mobile: 'clamp(1.05rem, 4vw, 1.2rem)',
    tablet: 'clamp(1.35rem, 3vw, 1.6rem)',
    tabletCompressed: 'clamp(1.1rem, 2.4vw, 1.25rem)',
    desktop: { md: 'clamp(1.7rem, 2vw, 1.9rem)', lg: 'clamp(1.9rem, 1.8vw, 2.1rem)' },
    desktopCompressed: { md: 'clamp(1.2rem, 1.6vw, 1.35rem)', lg: 'clamp(1.35rem, 1.35vw, 1.5rem)' },
  },
} as const;

function getLogoTitleFontSize(variant: LogoVariant, compressed: boolean) {
  if (variant === 'mobile') {
    return logoFit.titleFontSize.mobile;
  }

  if (variant === 'tablet') {
    return compressed ? logoFit.titleFontSize.tabletCompressed : logoFit.titleFontSize.tablet;
  }

  return compressed ? logoFit.titleFontSize.desktopCompressed : logoFit.titleFontSize.desktop;
}

function LogoTitleText({
  children,
  fontSize,
  noWrap = false,
}: {
  children: string;
  fontSize: ReturnType<typeof getLogoTitleFontSize>;
  noWrap?: boolean;
}) {
  return (
    <Typography
      variant="logo"
      component="span"
      sx={{
        fontSize,
        ...(noWrap ? { whiteSpace: 'nowrap' } : {}),
      }}
    >
      {children}
    </Typography>
  );
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

export function LogoWordmark({ variant, linkToHome = true, compressed = false }: LogoWordmarkProps) {
  const isMobile = variant === 'mobile';
  const isDesktop = variant === 'desktop';
  const compactTitle = 'Just Transitions in the Delta';
  const titleFontSize = getLogoTitleFontSize(variant, compressed);
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
      <motion.div
        layout
        initial={false}
        transition={{ layout: { duration: 0.45, ease: collapseEase } }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', width: '100%' }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isMobile ? (
            <motion.div
              key={compressed ? 'mobile-compressed' : 'mobile-expanded'}
              initial={contentMotion.initial}
              animate={contentMotion.animate}
              exit={contentMotion.exit}
              transition={contentMotion.transition}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}
            >
              <LogoTitleText fontSize={titleFontSize} noWrap>
                {compactTitle}
              </LogoTitleText>
            </motion.div>
          ) : (
            <motion.div
              key={compressed ? 'tablet-desktop-compressed' : 'tablet-desktop-expanded'}
              initial={contentMotion.initial}
              animate={contentMotion.animate}
              exit={contentMotion.exit}
              transition={contentMotion.transition}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}
            >
              {compressed ? (
                <LogoTitleText fontSize={titleFontSize} noWrap>
                  {compactTitle}
                </LogoTitleText>
              ) : (
                <>
                  <LogoTitleText fontSize={titleFontSize}>
                    Just Transitions
                  </LogoTitleText>
                  <LogoTitleText fontSize={titleFontSize}>
                    in the Delta
                  </LogoTitleText>
                </>
              )}
              {isDesktop && !compressed && (
                <Typography
                  variant="logoSubtitle"
                  component="span"
                  sx={{
                    mt: logoFit.subtitleMarginTop,
                  }}
                >
                  Drought, salinity, and sea-level rise
                </Typography>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Box>
  );
}

export function LogoCompressed() {
  const variant = useActiveLogoVariant();
  return <LogoWordmark variant={variant} compressed />;
}

export default function Logo({ compressed = false }: LogoProps) {
  const variant = useActiveLogoVariant();
  return <LogoWordmark variant={variant} compressed={compressed} />;
}
