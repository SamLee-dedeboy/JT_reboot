// Site wordmark components for navbar/footer usage, backed by logo typography
// and responsive sizing tokens from the MUI theme.
import { Link } from 'react-router-dom'
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material'
import type { TypographyProps } from '@mui/material'
import type { Theme } from '@mui/material/styles'

export type LogoVariant = 'mobile' | 'tablet' | 'desktop'

type LogoWordmarkProps = {
  variant: LogoVariant
  linkToHome?: boolean
  component?: TypographyProps['component']
  sx?: TypographyProps['sx']
}

function useActiveLogoVariant(): LogoVariant {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'))

  if (isMobile) {
    return 'mobile'
  }

  if (isTablet) {
    return 'tablet'
  }

  return 'desktop'
}

function getLogoFontSize(theme: Theme, variant: LogoVariant) {
  if (variant === 'mobile') {
    return theme.logoWordmark.fontSize.mobile
  }

  if (variant === 'tablet') {
    return theme.logoWordmark.fontSize.tablet
  }

  return theme.logoWordmark.fontSize.desktop
}

export function LogoWordmark({
  variant,
  linkToHome = true,
  component = 'span',
  sx,
}: LogoWordmarkProps) {
  const isDesktop = variant === 'desktop'
  const title = 'Just Transitions in the Delta'
  const theme = useTheme()
  const fontSize = getLogoFontSize(theme, variant)

  return (
    <Box
      component={linkToHome ? Link : 'div'}
      to={linkToHome ? '/' : undefined}
      sx={{
        textDecoration: 'none',
        color: 'primary.main',
        minWidth: isDesktop ? theme.logoWordmark.desktopMinWidth : 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        textAlign: 'right',
        lineHeight: theme.logoWordmark.containerLineHeight,
        paddingBlock: theme.jtSpacing.component.xs,
      }}
    >
      <Typography
        variant="logo"
        component={component}
        sx={[
          {
            fontSize,
            whiteSpace: 'nowrap',
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
      >
        {title}
      </Typography>
    </Box>
  )
}

export default function Logo() {
  const variant = useActiveLogoVariant()
  return <LogoWordmark variant={variant} />
}
