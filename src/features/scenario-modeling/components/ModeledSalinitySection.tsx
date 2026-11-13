import { Typography } from '@mui/material'
import { Box } from '@mui/material'
import { jtSpacing } from '@/theme'
import { fullBleedBand } from '@/ui/surfaceStyles'
import { SalinityResultsHeading } from '../../../features/regional-summary/RegionalSalinitySummary'
import ModeledSalinity from './ModeledSalinity'
import { textMaxWidth } from './sectionStyles'

/** What the model shows: the simplified salinity view for any modeled future. */
export default function ModeledSalinitySection() {
  return (
    <Box
      component="section"
      id="modeled-salinity"
      aria-labelledby="modeled-salinity-title"
      sx={[
        {
          gridColumn: { lg: 2 },
          gridRow: { lg: 2 },
          minWidth: 0,
          scrollMarginTop: 110,
          py: { xs: jtSpacing.section.sm, md: jtSpacing.section.md },
        },
        (theme) => fullBleedBand(theme.palette.base[700]),
      ]}
    >
      <SalinityResultsHeading id="modeled-salinity-title" />
      <Typography
        variant="body1"
        sx={{
          mt: jtSpacing.gap.md,
          mb: jtSpacing.section.sm,
          color: 'base.100',
          maxWidth: textMaxWidth,
        }}
      >
        Pick an outflow variation or adaptation scenario to see which places get saltier or fresher
        than its baseline, and in which seasons and water years.
      </Typography>
      <ModeledSalinity showHeading={false} headingId="modeled-salinity-title" />
    </Box>
  )
}
