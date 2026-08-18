import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import WaterDropIcon from '@mui/icons-material/WaterDrop'
import { Box, Button, Stack, Typography, useTheme } from '@mui/material'
import { Link } from 'react-router-dom'
import { assetUrl } from '../../utils/baseUrl'

const variations = [
  {
    key: 'current',
    eyebrow: 'Current operations',
    title: 'Business as Usual',
    body: 'Begin with this starting point before changing Delta outflow assumptions.',
    gridArea: 'current',
  },
  {
    key: 'saltier',
    eyebrow: 'A saltier Delta',
    title: 'Less Delta outflow',
    body: 'Explore a more constrained river outflow in the Delta, 10% decrease from current operations.',
    gridArea: 'saltier',
  },
  {
    key: 'fresher',
    eyebrow: 'A fresher Delta',
    title: 'More Delta outflow',
    body: 'Explore a stronger river outflow in the Delta, 30% increase from current operations.',
    gridArea: 'fresher',
  },
] as const

const sectionLabelSx = {
  color: 'primary.main',
  '& .MuiSvgIcon-root': {
    fontSize: 'inherit',
    verticalAlign: 'middle',
    mr: 1,
  },
} as const

export default function OutflowVariationGrid() {
  const theme = useTheme()

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: { xs: 980, md: 'calc(100svh - 76px)' },
        isolation: 'isolate',
        overflow: 'hidden',
        backgroundImage: `url(${assetUrl('/images/scenarios/outflow.jpg')})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          zIndex: -1,
          bgcolor: 'translucent.600',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          background: `linear-gradient(180deg, ${theme.palette.translucent[50]}, ${theme.palette.translucent[600]} 58%, ${theme.palette.translucent[900]})`,
          pointerEvents: 'none',
        },
      }}
    >
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
            md: 'auto',
          },
          maxWidth: { xs: 620, md: 760 },
          pointerEvents: 'none',
        }}
      >
        <Stack spacing={1.2}>
          <Typography component="p" variant="eyebrow" sx={sectionLabelSx}>
            <WaterDropIcon />
            Outflow Variations
          </Typography>
          <Typography id="outflow-panels-title" variant="h2" component="h2">
            Probable water futures
          </Typography>
          <Typography variant="body2" sx={{ color: 'base.100', maxWidth: '58ch' }}>
            Begin with current operations, then compare how less or more Delta outflow could create
            a saltier or fresher Delta.
          </Typography>
        </Stack>
      </Box>

      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          display: 'grid',
          gridTemplateAreas: {
            xs: '"current" "saltier" "fresher"',
            md: '"current current" "saltier fresher"',
          },
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gridTemplateRows: { xs: '1.35fr 1fr 1fr', md: '1fr 1fr' },
        }}
      >
        {variations.map((variation) => (
          <Box
            component="article"
            key={variation.key}
            tabIndex={0}
            sx={{
              gridArea: variation.gridArea,
              position: 'relative',
              minWidth: 0,
              border: 1,
              borderColor: 'primary.main',
              outline: 'none',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                inset: 0,
                bgcolor: 'transparent',
                transition: theme.transitions.create('background-color', {
                  duration: theme.transitions.duration.short,
                }),
              },
              '&:hover::before, &:focus-visible::before': {
                bgcolor: 'translucent.primaryGreen',
              },
              '&:focus-visible': {
                boxShadow: `inset 0 0 0 3px ${theme.palette.primary.main}`,
              },
            }}
          >
            <Stack
              spacing={theme.jtSpacing.gap.xs}
              sx={{
                position: 'absolute',
                zIndex: 1,
                left: {
                  xs: theme.spacing(theme.jtSpacing.scenario.panelHeaderInset.xs),
                  md: theme.spacing(theme.jtSpacing.scenario.panelHeaderInset.md),
                },
                right: {
                  xs: theme.spacing(theme.jtSpacing.scenario.panelHeaderInset.xs),
                  md: theme.spacing(theme.jtSpacing.scenario.panelHeaderInset.md),
                },
                bottom: {
                  xs: theme.spacing(theme.jtSpacing.scenario.panelContentBottom.xs),
                  md: theme.spacing(theme.jtSpacing.scenario.panelContentBottom.md),
                },
                alignItems: 'flex-start',
                textAlign: 'left',
              }}
            >
              <Typography variant="eyebrow" component="p" sx={{ color: 'primary.main' }}>
                {variation.eyebrow}
              </Typography>
              <Typography variant="h3" component="h3" sx={{ maxWidth: '20ch' }}>
                {variation.title}
              </Typography>
              <Typography
                variant="body2"
                component="p"
                sx={{ maxWidth: '70ch', color: 'base.100' }}
              >
                {variation.body}
              </Typography>
              <Box sx={{ pt: theme.jtSpacing.component.md }}>
                <Button
                  component={Link}
                  to="/scenarios"
                  variant="outlined"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    color: 'common.white',
                    borderColor: 'primary.main',
                    bgcolor: 'transparent',
                    '&:hover': {
                      borderColor: 'primary.main',
                      bgcolor: 'translucent.primaryGreen',
                    },
                  }}
                >
                  Enter
                </Button>
              </Box>
            </Stack>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
