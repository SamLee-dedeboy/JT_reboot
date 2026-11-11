import { Box, Typography, useTheme } from '@mui/material'
import ScrollReveal from '../../../ui/animation/ScrollReveal'
import { assetUrl } from '../../../utils/baseUrl'
import type { HOME_PHOTOS } from '../../../content/home'
import { ActionButton } from '../../../ui/ActionLink'

type ResponsiveValue<T> = T | Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl', T>>

interface HomeImagePanelProps {
  /** The photo, its text and its button, from src/content/home.ts. */
  photo: (typeof HOME_PHOTOS)[keyof typeof HOME_PHOTOS]
  backgroundPosition: object
  backgroundSize?: object | string
  textWidth?: string
  /** Vertical center of the text block within the image panel. */
  textPositionY?: ResponsiveValue<string | number>
  textShadow?: boolean
}

export default function HomeImagePanel({
  photo,
  backgroundPosition,
  backgroundSize = 'cover',
  textWidth = '75ch',
  textPositionY = '50%',
  textShadow = false,
}: HomeImagePanelProps) {
  const theme = useTheme()

  return (
    <Box
      component="section"
      id={photo.id}
      aria-label={photo.link.label}
      sx={{
        position: 'relative',
        zIndex: 4,
        height: '110dvh',
        backgroundImage: `linear-gradient(90deg, ${theme.palette.translucent.blackShadow}, transparent 58%), url(${assetUrl(photo.image)})`,
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
          pl: 'var(--home-rail-inset)',
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
            {photo.text}
          </Typography>
          <Box sx={{ mt: theme.jtSpacing.component.lg }}>
            <ActionButton {...photo.link} />
          </Box>
        </ScrollReveal>
      </Box>
    </Box>
  )
}
