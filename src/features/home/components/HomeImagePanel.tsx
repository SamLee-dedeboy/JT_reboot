// The full-bleed photo panels between the home page's narrative panels. From md up the text
// sits over the photo; below md the photo comes first and the text follows on dark ground,
// since a phone-width crop leaves the long italic text no room beside the subject.
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material'
import { ActionButton, ScrollReveal } from '@/ui'
import { assetUrl } from '@/utils/baseUrl'
import { textOverImage } from '@/theme'
import type { HOME_PHOTOS } from '@/content/home'
import PanelSlant from './PanelSlant'

type ResponsiveValue<T> = T | Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl', T>>
type HomePhoto = (typeof HOME_PHOTOS)[keyof typeof HOME_PHOTOS]

interface HomeImagePanelProps {
  /** The photo, its text and its button, from src/content/home.ts. */
  photo: HomePhoto
  backgroundPosition: object
  backgroundSize?: object | string
  textWidth?: string
  /** Vertical center of the text block within the image panel. */
  textPositionY?: ResponsiveValue<string | number>
}

/** The panel's words and its button; the same in both layouts. */
function PanelText({
  photo,
  textWidth,
  overImage = false,
}: Pick<HomeImagePanelProps, 'photo' | 'textWidth'> & {
  /** Set over the photo (md up), so it needs a shadow to read on bright patches. */
  overImage?: boolean
}) {
  const theme = useTheme()
  return (
    <ScrollReveal>
      <Typography
        variant="photoPanelText"
        component="p"
        sx={{
          maxWidth: textWidth,
          color: 'common.white',
          textShadow: overImage ? textOverImage.body : 'none',
        }}
      >
        {photo.text}
      </Typography>
      <Box sx={{ mt: theme.jtSpacing.component.lg }}>
        <ActionButton {...photo.link} />
      </Box>
    </ScrollReveal>
  )
}

function DesktopImagePanel({
  photo,
  backgroundPosition,
  backgroundSize = 'cover',
  textWidth = '75ch',
  textPositionY = '50%',
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
        <PanelText photo={photo} textWidth={textWidth} overImage />
      </Box>
    </Box>
  )
}

function MobileImagePanel({
  photo,
  backgroundPosition,
  textWidth = '75ch',
}: Pick<HomeImagePanelProps, 'photo' | 'backgroundPosition' | 'textWidth'>) {
  const theme = useTheme()

  return (
    <Box
      component="section"
      id={photo.id}
      aria-label={photo.link.label}
      sx={{ position: 'relative', zIndex: 4, bgcolor: 'base.900' }}
    >
      {/* The photo, cropped by the panel's own small-screen position. */}
      <Box
        aria-hidden="true"
        sx={{
          height: '60svh',
          minHeight: 320,
          backgroundImage: `url(${assetUrl(photo.image)})`,
          backgroundSize: 'cover',
          backgroundPosition,
        }}
      />
      {/* The caption cuts into the photo on a slant, like every panel edge on the page. */}
      <PanelSlant color="base.900" attachment="before" tilt="up-right" />
      <Box
        sx={{
          pl: 'var(--home-rail-inset)',
          pr: 'var(--home-rail-inset)',
          pt: theme.jtSpacing.section.sm,
          pb: theme.jtSpacing.section.lg,
        }}
      >
        <PanelText photo={photo} textWidth={textWidth} />
      </Box>
    </Box>
  )
}

export default function HomeImagePanel(props: HomeImagePanelProps) {
  const theme = useTheme()
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'), { noSsr: true })

  return isMdUp ? <DesktopImagePanel {...props} /> : <MobileImagePanel {...props} />
}
