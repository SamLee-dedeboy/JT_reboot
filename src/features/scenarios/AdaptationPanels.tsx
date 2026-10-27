import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { Box, Button, Stack, Typography, useTheme } from '@mui/material'
import { useReducedMotion } from 'framer-motion'
import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { navigation } from '../../theme'

interface AdaptationPanelItem {
  title: string
  image: string
  eyebrow?: string
  body?: string
  href: string
}

interface AdaptationPanelsProps {
  items: AdaptationPanelItem[]
  header: ReactNode
  actionLabel?: string
}

export default function AdaptationPanels({
  items,
  header,
  actionLabel = 'Explore',
}: AdaptationPanelsProps) {
  const theme = useTheme()
  const reduceMotion = useReducedMotion()
  const [selectedPanel, setSelectedPanel] = useState(0)

  return (
    <Box
      sx={{
        position: 'relative',
        width: 1,
        height: 1,
        minHeight: navigation.belowBar('100svh'),
        overflow: { xs: 'auto', md: 'hidden' },
        bgcolor: 'base.900',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          zIndex: 2,
          top: {
            xs: theme.spacing(theme.jtSpacing.scenario.panelHeaderInset.xs),
            md: theme.spacing(theme.jtSpacing.scenario.panelHeaderInset.md),
          },
          left: {
            xs: theme.spacing(theme.jtSpacing.scenario.panelHeaderInset.xs),
            md: theme.spacing(theme.jtSpacing.scenario.panelHeaderInset.md),
          },
          right: {
            xs: theme.spacing(theme.jtSpacing.scenario.panelHeaderInset.xs),
            md: theme.spacing(theme.jtSpacing.scenario.panelHeaderInset.md),
          },
          pointerEvents: 'none',
        }}
      >
        {header}
      </Box>

      <Box
        component="ul"
        sx={{
          m: 0,
          p: 0,
          width: 1,
          minHeight: 1,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          listStyle: 'none',
        }}
      >
        {items.map((item, index) => {
          const isSelected = selectedPanel === index

          return (
            <Box
              component="li"
              key={item.title}
              onMouseEnter={() => setSelectedPanel(index)}
              onFocusCapture={() => setSelectedPanel(index)}
              sx={{
                position: 'relative',
                minWidth: 0,
                minHeight: {
                  xs: isSelected ? '36rem' : '15rem',
                  md: navigation.belowBar('100svh').md,
                },
                flex: {
                  xs: '0 0 auto',
                  md: isSelected ? '2.7 1 0' : '0.65 1 0',
                },
                display: 'flex',
                alignItems: 'flex-end',
                isolation: 'isolate',
                borderLeft: {
                  xs: 0,
                  md: index === 0 ? 0 : `2px solid ${theme.palette.primary.main}`,
                },
                borderTop: {
                  xs: index === 0 ? 0 : `2px solid ${theme.palette.primary.main}`,
                  md: 0,
                },
                overflow: 'hidden',
                transition: reduceMotion
                  ? 'none'
                  : 'flex 520ms cubic-bezier(0.22, 1, 0.36, 1), min-height 520ms cubic-bezier(0.22, 1, 0.36, 1)',
                '&:focus-within': {
                  boxShadow: `inset 0 0 0 3px ${theme.palette.primary.main}`,
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  inset: 0,
                  zIndex: -1,
                  background: isSelected
                    ? `linear-gradient(180deg, ${theme.palette.translucent[700]} 0%, ${theme.palette.translucent[50]} 42%, ${theme.palette.translucent[300]} 57%, ${theme.palette.translucent[700]} 72%, ${theme.palette.translucent[800]} 100%)`
                    : `linear-gradient(180deg, ${theme.palette.translucent[300]} 0%, ${theme.palette.translucent[500]} 44%, ${theme.palette.translucent[800]} 74%, ${theme.palette.translucent[800]} 100%)`,
                  transition: reduceMotion ? 'none' : 'background 240ms ease',
                },
              }}
            >
              <Box
                component="img"
                src={item.image}
                alt=""
                decoding="async"
                sx={{
                  position: 'absolute',
                  inset: 0,
                  zIndex: -2,
                  width: 1,
                  height: 1,
                  objectFit: 'cover',
                  opacity: isSelected ? 0.88 : 0.62,
                  transform: isSelected ? 'scale(1.035)' : 'scale(1)',
                  transition: reduceMotion
                    ? 'none'
                    : 'transform 700ms cubic-bezier(0.22, 1, 0.36, 1), opacity 240ms ease',
                }}
              />

              <Stack
                spacing={theme.jtSpacing.gap.xs}
                sx={{
                  width: 1,
                  minWidth: 0,
                  px: {
                    xs: theme.jtSpacing.scenario.panelContentInline.xs,
                    md: theme.jtSpacing.scenario.panelContentInline.md,
                  },
                  pb: {
                    xs: theme.jtSpacing.scenario.panelContentBottom.xs,
                    md: theme.jtSpacing.scenario.panelContentBottom.md,
                  },
                }}
              >
                <Typography variant="numberArticle" component="p" sx={{ color: 'primary.main' }}>
                  {item.eyebrow ?? String(index + 1).padStart(2, '0')}
                </Typography>
                <Typography
                  variant="h3"
                  component="h3"
                  sx={{
                    color: 'common.white',
                    maxWidth: isSelected ? '18ch' : '10ch',
                    textWrap: 'balance',
                  }}
                >
                  {item.title}
                </Typography>
                {isSelected && item.body && (
                  <Typography
                    variant="bodyLarge"
                    component="p"
                    sx={{ maxWidth: '52ch', color: 'common.white', textWrap: 'pretty' }}
                  >
                    {item.body}
                  </Typography>
                )}
                {isSelected && (
                  <Box sx={{ pt: theme.jtSpacing.component.sm }}>
                    <Button
                      component={Link}
                      to={item.href}
                      variant="contained"
                      endIcon={<ArrowForwardIcon />}
                    >
                      {actionLabel}
                    </Button>
                  </Box>
                )}
              </Stack>
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}
