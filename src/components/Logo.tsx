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
  const theme = useTheme();

  return (
    <Box
      component={linkToHome ? Link : 'div'}
      to={linkToHome ? '/' : undefined}
      sx={{
        textDecoration: 'none',
        color: 'primary.main',
        minWidth: isDesktop ? 360 : 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        textAlign: 'right',
        lineHeight: 1.05,
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
              <Typography
                variant="h4"
                component="span"
                sx={{
                  color: 'primary.main',
                  textTransform: 'uppercase',
                  fontSize: '1.2rem',
                  lineHeight: 1,
                }}
              >
                {compressed ? 'Just Transitions' : 'Just Transitions in the Delta'}
              </Typography>
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
              <Typography
                variant="h4"
                component="span"
                sx={{
                  color: 'primary.main',
                  textTransform: 'uppercase',
                  fontSize: isDesktop ? { md: '1.9rem', lg: '2.1rem' } : '1.6rem',
                  lineHeight: 1,
                }}
              >
                Just Transitions
              </Typography>
              {!compressed && (
                <Typography
                  variant="h4"
                  component="span"
                  sx={{
                    color: 'primary.main',
                    textTransform: 'uppercase',
                    fontSize: isDesktop ? { md: '1.9rem', lg: '2.1rem' } : '1.6rem',
                    lineHeight: 1,
                  }}
                >
                  in the Delta
                </Typography>
              )}
              {isDesktop && !compressed && (
                <Typography
                  variant="caption"
                  component="span"
                  sx={{
                    color: 'primary.main',
                    letterSpacing: '0.02em',
                    textTransform: 'none',
                    fontSize: { md: '1.2rem' },
                    lineHeight: 1.2,
                    mt: 0.2,
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
