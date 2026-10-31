import { Box, Typography, useTheme } from '@mui/material'
import ScrollReveal from '../../../ui/animation/ScrollReveal'
import { assetUrl } from '../../../utils/baseUrl'
import { HomeCta } from './HomeActions'

type ResponsiveValue<T> = T | Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl', T>>

interface HomeImagePanelProps {
  id: string
  ariaLabel: string
  image: string
  backgroundPosition: object
  backgroundSize?: object | string
  text: string
  buttonLabel: string
  /** Route, `#anchor` or external URL; leave it out to show the button as forthcoming. */
  buttonHref?: string
  textWidth?: string
  /** Vertical center of the text block within the image panel. */
  textPositionY?: ResponsiveValue<string | number>
  textShadow?: boolean
}

export default function HomeImagePanel({
  id,
  ariaLabel,
  image,
  backgroundPosition,
  backgroundSize = 'cover',
  text,
  buttonLabel,
  buttonHref,
  textWidth = '75ch',
  textPositionY = '50%',
  textShadow = false,
}: HomeImagePanelProps) {
  const theme = useTheme()

  return (
    <Box
      component="section"
      id={id}
      data-home-section="image"
      aria-label={ariaLabel}
      sx={{
        position: 'relative',
        zIndex: 4,
        height: '110dvh',
        backgroundImage: `linear-gradient(90deg, ${theme.palette.translucent.blackShadow}, transparent 58%), url(${assetUrl(image)})`,
        backgroundSize,
        backgroundPosition,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: textPositionY,
          transform: 'translateY(-50%)',
          width: '100%',
          pl: {
            xs: 'var(--home-rail-inset)',
            lg: `var(--home-rail-inset)`,
          },
          pr: 'var(--home-rail-inset)',
        }}
      >
        <ScrollReveal>
          <Typography
            variant="bodyLarge"
            component="p"
            sx={{
              maxWidth: textWidth,
              color: 'common.white',
              fontStyle: 'italic',
              textShadow: textShadow ? `0 1px 3px ${theme.palette.translucent.textShadow}` : 'none',
            }}
          >
            {text}
          </Typography>
          <Box sx={{ mt: theme.jtSpacing.component.lg }}>
            <HomeCta label={buttonLabel} href={buttonHref} />
          </Box>
        </ScrollReveal>
      </Box>
    </Box>
  )
}
