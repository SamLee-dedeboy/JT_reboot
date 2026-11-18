import { useMediaQuery, useTheme, Box, Typography } from '@mui/material'
import { motion } from 'framer-motion'
import KeyboardDoubleArrowDownRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowDownRounded'
import { HERO } from '@/content/home'
import HeroSalinityMap from '@/map/hero/HeroSalinityMap'
import { navigation, textOverImage } from '@/theme'

const mapContainerStyle = {
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none',
} as const

export default function HeroMap() {
  const theme = useTheme()
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'))
  const [heroLedeLocation, heroLedeConditions] = HERO.lede.split(' amid ')

  return (
    <Box
      component="section"
      id="top"
      sx={{
        position: 'sticky',
        top: navigation.barHeight,
        width: '100%',
        height: navigation.belowBar('100svh'),
        minHeight: { xs: 520, md: 600 },
        overflow: 'hidden',
        zIndex: 10,
      }}
    >
      <Box sx={mapContainerStyle}>
        <HeroSalinityMap />
      </Box>

      <Box
        sx={{
          position: 'absolute',
          left: 'var(--home-rail-inset)',
          // Below md the box keeps the gutter on both sides, so the scroll cue centres on screen.
          right: { xs: 'var(--home-rail-inset)', md: 'auto' },
          top: 'auto',
          // On a phone the text sits low, so the scroll cue lands just above the map's logo.
          bottom: { xs: theme.spacing(5), md: theme.spacing(12) },
          minHeight: 'max-content',
          zIndex: 24,
          pointerEvents: 'auto',
          color: 'common.white',
          // Below md the box spans the inset to the right edge, so the lede wraps; above,
          // it sizes to the one-line lede.
          width: { xs: 'auto', md: 'max-content' },
          // Up to lg the hero text sits on the page gutter, in line with the panels' text.
          pl: { xs: 0, lg: theme.jtSpacing.component.lg },
          boxSizing: 'border-box',
        }}
      >
        <Box
          sx={{
            maxWidth: '76ch',
            mx: { xs: 'auto', sm: 0 },
            paddingTop: { xs: theme.jtSpacing.component.sm, md: theme.jtSpacing.component.md },
          }}
        >
          <Typography
            variant="logoHero"
            component="h1"
            sx={{
              textShadow: textOverImage.title,
              textWrap: 'balance',
            }}
          >
            <Box component="span" sx={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
              {HERO.titleLine1}
            </Box>
            <br />
            {HERO.titleLine2}
          </Typography>
          <Typography
            variant="body1"
            component="p"
            sx={{
              mt: { xs: theme.jtSpacing.component.sm, md: theme.jtSpacing.component.md },
              mb: 0,
              maxWidth: { xs: theme.jtSpacing.paragraphMaxWidth.default, md: 'none' },
              textShadow: textOverImage.body,
              hyphens: 'none',
              overflowWrap: 'normal',
              wordBreak: 'normal',
            }}
          >
            {/* Two set lines from md up; below md one paragraph that wraps naturally. */}
            <Box
              component="span"
              sx={{ display: { xs: 'inline', md: 'block' }, whiteSpace: { md: 'nowrap' } }}
            >
              {heroLedeLocation}{' '}
            </Box>
            <Box component="span" sx={{ display: { xs: 'inline', md: 'block' } }}>
              amid {heroLedeConditions}
            </Box>
          </Typography>
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: [0, 10, 0] }}
            transition={{
              opacity: { duration: 0.8, ease: 'easeOut' },
              y: { duration: 1.6, repeat: Infinity, ease: 'easeInOut' },
            }}
            style={{
              width: '100%',
              margin: '0 auto',
              paddingTop: theme.spacing(theme.jtSpacing.component.lg),
              // Shown at every width; from md up it shifts left to sit under the title's centre.
              display: 'flex',
              justifyContent: 'center',
              transform: isMdUp
                ? `translateX(-${theme.spacing(theme.jtSpacing.section.md)})`
                : undefined,
              pointerEvents: 'none',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: theme.jtSpacing.component.xs,
                color: 'common.white',
                textShadow: textOverImage.body,
              }}
            >
              <KeyboardDoubleArrowDownRoundedIcon sx={{ typography: 'h3' }} />
              <Typography variant="button" component="span">
                Scroll
              </Typography>
            </Box>
          </motion.div>
        </Box>
      </Box>
    </Box>
  )
}
