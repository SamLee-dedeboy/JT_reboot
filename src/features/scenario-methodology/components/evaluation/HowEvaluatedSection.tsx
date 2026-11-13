import { Box, Typography } from '@mui/material'
import { jtSpacing } from '@/theme'
import { fullBleedBand } from '@/ui/surfaceStyles'
import EvaluationFramework from './EvaluationFramework'
import { sectionSx } from './evaluationLayout'

/** Why five criteria, then a card per criterion: what it measures and who it looks at. */
export default function HowEvaluatedSection() {
  return (
    <Box
      component="section"
      id="how-evaluated"
      aria-labelledby="how-evaluated-title"
      sx={[{ ...sectionSx, gridRow: { lg: 1 } }, (theme) => fullBleedBand(theme.palette.base[700])]}
    >
      <Typography id="how-evaluated-title" variant="h2" sx={{ mb: jtSpacing.gap.md }}>
        How are scenarios evaluated?
      </Typography>
      <Typography
        variant="body1"
        sx={{ mb: jtSpacing.section.md, color: 'base.100', maxWidth: '100ch' }}
      >
        No single model or criterion can adequately assess all that a potential future adaptation
        scenario might mean for the Delta. A change that improves water quality in one place may
        affect habitat, recreation, Tribal relationships, or agricultural livelihoods somewhere
        else. To capture these different values and concerns, all scenarios are evaluated by five
        criteria. Each criterion uses a distinct set of metrics, evidence, and methods, and in
        combination shows how scenarios compare in terms of benefits, drawbacks, and trade-offs.
      </Typography>
      <EvaluationFramework showIntroduction={false} />
    </Box>
  )
}
