import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { Box, Button, Stack, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import { jtSpacing } from '@/theme'
import { fullBleedBand } from '@/ui/surfaceStyles'
import { textMaxWidth } from './sectionStyles'

/** Hand-off to the next step in the workflow: how the modeled futures are evaluated. */
export default function NextStepSection() {
  return (
    <Box
      component="section"
      id="next-step"
      aria-labelledby="next-step-title"
      sx={[
        {
          gridColumn: { lg: 2 },
          gridRow: { lg: 3 },
          minWidth: 0,
          scrollMarginTop: 110,
          py: { xs: jtSpacing.section.sm, md: jtSpacing.section.md },
        },
        (theme) => fullBleedBand(theme.palette.base[900]),
      ]}
    >
      <Typography id="next-step-title" variant="h2">
        How are scenarios evaluated?
      </Typography>
      <Typography
        variant="body1"
        sx={{ mt: jtSpacing.gap.md, color: 'base.100', maxWidth: textMaxWidth }}
      >
        Salinity results show where and when the water changes, not what those changes mean. The
        same shift can play out differently for ecology, recreation, environmental justice, the
        economy, and eco-cultural values, so each future still has to be evaluated from all five
        perspectives.
      </Typography>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={jtSpacing.gap.sm}
        sx={{ mt: jtSpacing.component.lg, alignItems: { xs: 'stretch', sm: 'center' } }}
      >
        <Button
          component={Link}
          to="/scenarios/evaluation"
          variant="contained"
          endIcon={<ArrowForwardIcon />}
        >
          How scenarios are evaluated
        </Button>
      </Stack>
    </Box>
  )
}
