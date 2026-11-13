import { Box, Typography } from '@mui/material'
import { jtSpacing } from '@/theme'
import { textMaxWidth } from './sectionStyles'

/** The page's opening: which models test which futures. */
export default function HowModeledSection() {
  return (
    <Box
      component="section"
      id="how-modeled"
      aria-labelledby="how-modeled-title"
      sx={{ scrollMarginTop: 110, py: { xs: jtSpacing.section.sm, md: jtSpacing.section.md } }}
    >
      <Typography id="how-modeled-title" variant="h2">
        How are scenarios modeled?
      </Typography>
      <Typography
        variant="body1"
        component="p"
        sx={{ mt: jtSpacing.gap.lg, maxWidth: textMaxWidth, color: 'base.50' }}
      >
        We tested 2 outflow variations and 5 adaptation scenarios, using two hydrodynamic models.
        SCHISM tests the outflow variations, which change the amount of Delta outflow. The
        two-dimensional RMA Bay-Delta model tests the adaptation scenarios: three change the Delta’s
        landscape and two change the water flowing into it. Each is compared with a baseline from
        the same model.
      </Typography>
    </Box>
  )
}
