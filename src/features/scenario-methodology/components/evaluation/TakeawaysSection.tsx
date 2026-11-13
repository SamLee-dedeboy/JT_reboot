import { Box, Typography } from '@mui/material'
import { jtSpacing } from '@/theme'
import { ActionButton } from '@/ui'
import { fullBleedBand } from '@/ui/surfaceStyles'
import { sectionSx } from './evaluationLayout'

/** The way into one scenario's takeaways across all five criteria. */
export default function TakeawaysSection() {
  return (
    <Box
      component="section"
      id="scenario-results"
      aria-labelledby="scenario-results-title"
      sx={[{ ...sectionSx, gridRow: { lg: 2 } }, (theme) => fullBleedBand(theme.palette.base[600])]}
    >
      <Typography id="scenario-results-title" variant="h2">
        Scenario takeaways
      </Typography>
      <Typography
        variant="body1"
        sx={{ mt: jtSpacing.gap.md, color: 'base.100', maxWidth: '78ch' }}
      >
        Choose a scenario to see key takeaways from all five evaluation criteria in one place.
      </Typography>
      <ActionButton label="Explore scenario takeaways" sx={{ mt: jtSpacing.component.lg }} />
    </Box>
  )
}
