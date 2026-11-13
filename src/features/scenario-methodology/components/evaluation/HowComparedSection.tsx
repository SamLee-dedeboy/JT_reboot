import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { Box, Button, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import { jtSpacing } from '@/theme'
import { fullBleedBand } from '@/ui/surfaceStyles'
import { sectionSx } from './evaluationLayout'

/** The hand-off to the ranking views. */
export default function HowComparedSection() {
  return (
    <Box
      component="section"
      id="how-compared"
      aria-labelledby="how-compared-title"
      sx={[{ ...sectionSx, gridRow: { lg: 3 } }, (theme) => fullBleedBand(theme.palette.base[800])]}
    >
      <Typography id="how-compared-title" variant="h2">
        How are scenarios compared?
      </Typography>
      <Typography
        variant="body1"
        sx={{ mt: jtSpacing.gap.md, color: 'base.100', maxWidth: '78ch' }}
      >
        Explore the evaluation scores from two perspectives: compare how one scenario performs
        across all criteria, or compare all scenarios within a single criterion. You can also adjust
        the importance of each criterion to see how different priorities change the overall ranking.
      </Typography>
      <Button
        component={Link}
        to="/scenarios/ranking"
        variant="contained"
        endIcon={<ArrowForwardIcon />}
        sx={{ mt: jtSpacing.component.lg }}
      >
        Explore scenario rankings
      </Button>
    </Box>
  )
}
