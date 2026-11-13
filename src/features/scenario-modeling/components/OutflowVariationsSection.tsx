import { Box, Typography } from '@mui/material'
import { scenarioName } from '@/content/names'
import { jtSpacing } from '@/theme'
import ModelOverview from './ModelOverview'
import { GroupBlock, KeyPhrase, SubsectionHeading } from './sectionParts'
import { sectionSx, textMaxWidth } from './sectionStyles'

/** The two outflow variations: the SCHISM model, its stations and how the runs are built. */
export default function OutflowVariationsSection() {
  return (
    <Box
      component="section"
      id="outflow-variations"
      aria-labelledby="outflow-variations-title"
      sx={sectionSx}
    >
      <SubsectionHeading id="outflow-variations-title" title="Outflow variations">
        2 variations, modeled in SCHISM, compared with <KeyPhrase>{scenarioName('hist')}</KeyPhrase>
        .
      </SubsectionHeading>
      <ModelOverview
        model="schism"
        stationNote="SCHISM output is sampled at 405 stations, which are a different set from RMA’s."
      />
      <Box sx={{ mt: jtSpacing.component.lg }}>
        <GroupBlock title="How each future is built">
          <Typography variant="body1" sx={{ color: 'base.50', maxWidth: textMaxWidth }}>
            <KeyPhrase>
              These runs apply a statistical change to the amount of Delta outflow through changes
              in exports.
            </KeyPhrase>{' '}
            A 30% increase generally pushes saltwater farther toward the ocean, potentially reducing
            salinity in the Delta. A 10% decrease allows saltwater to move farther inland,
            potentially intensifying existing challenges for Delta communities, ecosystems, and
            water users.
          </Typography>
        </GroupBlock>
      </Box>
    </Box>
  )
}
