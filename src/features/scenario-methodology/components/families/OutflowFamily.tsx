import { Box, Typography } from '@mui/material'
import { criterionById } from '@/content/criteria'
import { tieredOutflows } from '@/content/scenarios'
import { jtSpacing } from '@/theme'
import { teamStyle } from '@/ui/teamStyle'
import FamilySection from './FamilySection'

/** The outflow variations: so far only environmental justice has evaluated them. */
export default function OutflowFamily() {
  const outflowFinding = criterionById['environmental-justice'].report.findings['tiered-outflows']

  return (
    <FamilySection
      id="outflow-variations"
      number="01"
      title="Outflow variations"
      summary={`${tieredOutflows.title} change how much fresh water leaves the Delta. So far only the environmental justice criterion has evaluated them.`}
      background={800}
      actions={[{ label: 'View Modeling results', href: '/scenarios/modeling' }]}
    >
      {outflowFinding && (
        <Box
          sx={{
            pl: jtSpacing.component.md,
            borderLeft: 3,
            borderColor: teamStyle['environmental-justice'].color,
          }}
        >
          <Typography variant="h4" component="h3">
            {outflowFinding.headline}
          </Typography>
          <Typography variant="body2" sx={{ mt: jtSpacing.gap.sm, color: 'base.100' }}>
            {outflowFinding.overall.summary}
          </Typography>
          {outflowFinding.narrative && (
            <Typography variant="body2" sx={{ mt: jtSpacing.gap.sm, color: 'base.100' }}>
              {outflowFinding.narrative}
            </Typography>
          )}
        </Box>
      )}
    </FamilySection>
  )
}
