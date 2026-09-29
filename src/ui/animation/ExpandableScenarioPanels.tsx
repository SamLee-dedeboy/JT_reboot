import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { Box, Button, Typography, alpha, useTheme } from '@mui/material'
import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion'
import { useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import type { TypographyProps } from '@mui/material/Typography'

export interface ExpandableScenarioPanelItem {
  title: string
  image: string
  eyebrow?: string
  body?: string
  href?: string
}

interface ExpandableScenarioPanelsProps {
  items: ExpandableScenarioPanelItem[]
  actionLabel?: string
  header?: ReactNode
  sharedImage?: boolean
  collapseOnScroll?: boolean
  bodyVariant?: TypographyProps['variant']
  comparisonContent?: (
    selectedPanel: number | null,
    onSelectPanel: (index: number | null) => void,
    active: boolean,
    seaLevelRise: boolean,
  ) => ReactNode
}

export default function ExpandableScenarioPanels({
  items,
  actionLabel = 'Enter',
  header,
  sharedImage = false,
  collapseOnScroll = false,
  bodyVariant = 'body2',
  comparisonContent,
}: ExpandableScenarioPanelsProps) {
  const theme = useTheme()
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isComparisonActive, setIsComparisonActive] = useState(false)
  const [isSeaLevelRiseActive, setIsSeaLevelRiseActive] = useState(false)
  const [selectedPanel, setSelectedPanel] = useState<number | null>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })
  const collapsedHeight = useTransform(scrollYProgress, [0, 0.3, 1], ['100dvh', '20dvh', '20dvh'])
  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    setIsCollapsed(progress >= 0.29)
    setIsSeaLevelRiseActive(progress >= 0.68)
  })
  useMotionValueEvent(collapsedHeight, 'change', (height) => {
    setIsComparisonActive(Number.parseFloat(height) <= 20.05)
  })
  const storyBackground = useTransform(
    scrollYProgress,
    [0, 0.64, 0.72, 1],
    [
      theme.palette.base[500],
      theme.palette.base[500],
      theme.palette.base[900],
      theme.palette.base[900],
    ],
  )
  const panelHeight = collapseOnScroll
    ? '100dvh'
    : { xs: 'calc(100svh - 72px)', md: 'calc(100svh - 76px)' }

  return (
    <Box
      ref={sectionRef}
      sx={{
        position: 'relative',
        width: '100%',
        height: collapseOnScroll ? '300dvh' : '100%',
        flex: '1 1 auto',
        minHeight: collapseOnScroll ? 0 : panelHeight,
        bgcolor: collapseOnScroll ? 'base.800' : 'base.900',
      }}
    >
      {collapseOnScroll && (
        <>
          <Box
            id="scenario-inspection"
            component="section"
            aria-labelledby="scenario-inspection-title"
            sx={{
              position: 'absolute',
              inset: '0 0 auto',
              height: '100dvh',
              pointerEvents: 'none',
            }}
          >
            <Typography
              id="scenario-inspection-title"
              sx={{
                position: 'absolute',
                width: 1,
                height: 1,
                padding: 0,
                margin: -1,
                overflow: 'hidden',
                clip: 'rect(0 0 0 0)',
                whiteSpace: 'nowrap',
                border: 0,
              }}
            >
              Scenario inspection
            </Typography>
          </Box>
          <Box
            id="scenario-comparison"
            component="section"
            aria-labelledby="scenario-comparison-title"
            sx={{
              position: 'absolute',
              inset: '100dvh 0 auto',
              height: '100dvh',
              pointerEvents: 'none',
              scrollMarginTop: { xs: '72px', md: '76px' },
            }}
          >
            <Typography
              id="scenario-comparison-title"
              sx={{
                position: 'absolute',
                width: 1,
                height: 1,
                padding: 0,
                margin: -1,
                overflow: 'hidden',
                clip: 'rect(0 0 0 0)',
                whiteSpace: 'nowrap',
                border: 0,
              }}
            >
              Scenario comparison
            </Typography>
          </Box>
          <Box
            id="scenario-comparison-sea-level-rise"
            component="section"
            aria-labelledby="scenario-comparison-slr-title"
            sx={{
              position: 'absolute',
              inset: '200dvh 0 auto',
              height: '100dvh',
              pointerEvents: 'none',
              scrollMarginTop: { xs: '72px', md: '76px' },
            }}
          >
            <Typography
              id="scenario-comparison-slr-title"
              sx={{
                position: 'absolute',
                width: 1,
                height: 1,
                padding: 0,
                margin: -1,
                overflow: 'hidden',
                clip: 'rect(0 0 0 0)',
                whiteSpace: 'nowrap',
                border: 0,
              }}
            >
              Scenario comparison with sea level rise
            </Typography>
          </Box>
        </>
      )}

      {collapseOnScroll && header && (
        <Box
          sx={{
            position: 'absolute',
            zIndex: 4,
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
      )}

      <Box
        sx={{
          position: collapseOnScroll ? 'sticky' : 'relative',
          top: 0,
          height: panelHeight,
          bgcolor: collapseOnScroll ? 'transparent' : 'base.800',
          overflow: 'hidden',
        }}
      >
        {collapseOnScroll && (
          <motion.div
            aria-hidden="true"
            style={{ position: 'absolute', inset: 0, zIndex: 0, backgroundColor: storyBackground }}
          />
        )}
        {!collapseOnScroll && header && (
          <motion.div>
            <Box
              sx={{
                position: 'absolute',
                zIndex: 3,
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
          </motion.div>
        )}

        <motion.div
          style={{
            position: 'relative',
            zIndex: 1,
            containerType: collapseOnScroll ? 'size' : undefined,
            height: collapseOnScroll ? collapsedHeight : '100%',
            overflow: 'hidden',
          }}
        >
          <Box
            component="ul"
            sx={{
              margin: 0,
              padding: 0,
              height: '100%',
              width: '100%',
              display: 'flex',
              flexDirection: collapseOnScroll ? 'row' : { xs: 'column', md: 'row' },
              listStyle: 'none',
            }}
          >
            {items.map((item, index) => (
              <Box
                component="li"
                key={item.title}
                tabIndex={0}
                aria-current={isCollapsed && selectedPanel === index ? 'true' : undefined}
                data-selected={selectedPanel === index ? 'true' : undefined}
                onMouseEnter={() => setSelectedPanel(index)}
                onMouseLeave={() => setSelectedPanel(null)}
                onFocus={() => setSelectedPanel(index)}
                onBlur={() => setSelectedPanel(null)}
                sx={{
                  position: 'relative',
                  flex: { xs: '1 1 15rem', md: '1 1 0' },
                  minWidth: 0,
                  height: collapseOnScroll ? '100%' : 'auto',
                  minHeight: collapseOnScroll ? 0 : { xs: '15rem', md: 'calc(100svh - 76px)' },
                  isolation: 'isolate',
                  overflow: 'hidden',
                  borderColor: 'translucent.primaryGreen',
                  transition: 'flex 520ms cubic-bezier(0.22, 1, 0.36, 1), filter 240ms ease',
                  outline: 'none',
                  cursor: 'pointer',
                  ...(!isCollapsed && {
                    '&[data-selected="true"]': {
                      flex: { xs: '1.6 1 18rem', md: '2.45 1 0' },
                      '& .expandable-panel-image': {
                        transform: 'scale(1.05)',
                        opacity: 0.9,
                      },
                      '& .expandable-panel-body, & .expandable-panel-action': {
                        opacity: 1,
                        transform: 'translateY(0)',
                      },
                      '&::after': {
                        opacity: 0,
                      },
                    },
                  }),
                  ...(isCollapsed && {
                    cursor: 'pointer',
                    '&:hover, &:focus-visible': {
                      filter: 'brightness(1.2)',
                      '&::before': {
                        borderColor: 'primary.main',
                        boxShadow: `inset 0 0 0 2px ${alpha(theme.palette.primary.main, 0.28)}, inset 0 0 34px ${alpha(theme.palette.primary.main, 0.2)}`,
                      },
                    },
                    '&[data-selected="true"]': {
                      filter: 'brightness(1.15)',
                      '&::before': {
                        borderColor: 'primary.main',
                        boxShadow: `inset 0 0 0 3px ${alpha(theme.palette.primary.main, 0.42)}, inset 0 0 42px ${alpha(theme.palette.primary.main, 0.24)}`,
                      },
                      '&::after': {
                        opacity: 0.38,
                        background:
                          'linear-gradient(180deg, rgba(126,217,87,0.12), rgba(16,22,24,0.32))',
                      },
                    },
                  }),
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    inset: 0,
                    zIndex: -1,
                    border: 2,
                    borderColor: 'primary.main',
                    opacity: 0.75,
                    boxShadow: `inset 0 0 34px ${alpha(theme.palette.primary.main, 0.12)}`,
                    pointerEvents: 'none',
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    inset: 0,
                    zIndex: -1,
                    opacity: 0.75,
                    background:
                      'linear-gradient(180deg, rgba(16,22,24,0.42) 0%, rgba(16,22,24,0.3) 42%, rgba(16,22,24,0.5) 100%)',
                    transition: 'opacity 260ms ease',
                    pointerEvents: 'none',
                  },
                }}
              >
                {sharedImage ? (
                  <Box
                    className="expandable-panel-image"
                    role="img"
                    aria-label=""
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      zIndex: -3,
                      opacity: 0.76,
                      transform: 'scale(1)',
                      transformOrigin: 'center',
                      backgroundImage: `url(${item.image})`,
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: { xs: 'cover', md: `${items.length * 100}% 100%` },
                      backgroundPosition: {
                        xs: 'center',
                        md: `${items.length === 1 ? 50 : (index / (items.length - 1)) * 100}% center`,
                      },
                      transition:
                        'transform 700ms cubic-bezier(0.22, 1, 0.36, 1), opacity 240ms ease',
                    }}
                  />
                ) : (
                  <Box
                    component="img"
                    className="expandable-panel-image"
                    src={item.image}
                    alt=""
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      zIndex: -3,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      opacity: 0.76,
                      transform: 'scale(1)',
                      transition:
                        'transform 700ms cubic-bezier(0.22, 1, 0.36, 1), opacity 240ms ease',
                    }}
                  />
                )}
                <motion.div>
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      zIndex: -2,
                      background:
                        'linear-gradient(180deg, rgba(16,22,24,0.78) 0%, rgba(16,22,24,0.22) 20%, rgba(16,22,24,0) 38%, rgba(16,22,24,0) 62%, rgba(16,22,24,0.24) 80%, rgba(16,22,24,0.9) 100%)',
                    }}
                  />

                  <Box
                    sx={{
                      position: 'absolute',
                      left: {
                        xs: theme.spacing(theme.jtSpacing.scenario.panelContentInline.xs),
                        md: theme.spacing(theme.jtSpacing.scenario.panelContentInline.md),
                      },
                      right: {
                        xs: theme.spacing(theme.jtSpacing.scenario.panelContentInline.xs),
                        md: theme.spacing(theme.jtSpacing.scenario.panelContentInline.md),
                      },
                      bottom: {
                        xs: theme.spacing(theme.jtSpacing.scenario.panelContentBottom.xs),
                        md: theme.spacing(theme.jtSpacing.scenario.panelContentBottom.md),
                      },
                      minHeight: { xs: 'auto', md: 300 },
                      display: 'grid',
                      gridTemplateRows: {
                        xs: 'auto',
                        md: '1rem 5.6rem 7.6rem 3.6rem',
                      },
                      alignContent: 'end',
                      justifyItems: 'start',
                      gap: { xs: 1.15, md: 1.1 },
                      textAlign: 'left',
                      '@container (max-height: 20dvh)': {
                        top: 0,
                        bottom: 0,
                        minHeight: 0,
                        display: 'flex',
                        alignItems: 'center',
                        paddingBlock: 1,
                        gap: 0,
                        '& .expandable-panel-eyebrow, & .expandable-panel-body, & .expandable-panel-action':
                          {
                            display: 'none',
                          },
                        '& .expandable-panel-title': {
                          minHeight: 0,
                          maxWidth: '14ch',
                          typography: 'scenarioPanelTitle',
                        },
                      },
                    }}
                  >
                    <Typography
                      className="expandable-panel-eyebrow"
                      variant="numberArticle"
                      component="p"
                      sx={{ color: 'primary.main', alignSelf: 'start' }}
                    >
                      {item.eyebrow ?? String(index + 1).padStart(2, '0')}
                    </Typography>
                    <Typography
                      variant="h3"
                      component="h3"
                      className="expandable-panel-title"
                      sx={{
                        maxWidth: '12ch',
                        color: 'common.white',
                        minHeight: { xs: 'auto', md: '5.4rem' },
                        display: { xs: 'block', md: 'flex' },
                        alignItems: { md: 'flex-start' },
                      }}
                    >
                      {item.title}
                    </Typography>
                    {item.body && (
                      <Typography
                        className="expandable-panel-body"
                        variant={bodyVariant}
                        sx={{
                          maxWidth: '36ch',
                          color: 'base.100',
                          maxHeight: { xs: 'none', md: '7.6rem' },
                          overflow: 'hidden',
                          opacity: 1,
                          transform: 'translateY(0)',
                          transition: 'opacity 220ms ease, transform 220ms ease',
                          alignSelf: 'start',
                          justifySelf: 'start',
                        }}
                      >
                        {item.body}
                      </Typography>
                    )}
                    {item.href && (
                      <Button
                        className="expandable-panel-action"
                        component={Link}
                        to={item.href}
                        variant="outlined"
                        endIcon={<ArrowForwardIcon />}
                        sx={{
                          justifySelf: 'start',
                          alignSelf: 'end',
                          color: 'common.white',
                          borderColor: 'primary.main',
                          bgcolor: 'transparent',
                          opacity: 1,
                          transform: 'translateY(0)',
                          transition:
                            'opacity 220ms ease, transform 220ms ease, border-color 180ms ease, background-color 180ms ease',
                          '&:hover': {
                            borderColor: 'primary.main',
                            bgcolor: 'translucent.primaryGreen',
                          },
                        }}
                      >
                        {actionLabel}
                      </Button>
                    )}
                  </Box>
                </motion.div>
              </Box>
            ))}
          </Box>
        </motion.div>

        {collapseOnScroll && comparisonContent && (
          <motion.div
            style={{
              position: 'absolute',
              zIndex: 2,
              top: '20dvh',
              right: 0,
              bottom: 0,
              left: 0,
              pointerEvents: isComparisonActive ? 'auto' : 'none',
            }}
            initial={false}
            animate={{ opacity: isComparisonActive ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {comparisonContent(
              selectedPanel,
              setSelectedPanel,
              isComparisonActive,
              isSeaLevelRiseActive,
            )}
          </motion.div>
        )}
      </Box>
    </Box>
  )
}
