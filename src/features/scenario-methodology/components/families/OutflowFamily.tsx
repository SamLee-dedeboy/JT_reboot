import { Box, Stack, Typography } from '@mui/material'
import { criteria } from '@/content/criteria'
import { tieredOutflows } from '@/content/scenarios'
import { jtSpacing } from '@/theme'
import { teamStyle } from '@/ui/teamStyle'
import FamilySection from './FamilySection'

/** "a", "a and b", "a, b and c". */
const listOf = (items: string[]) =>
  items.length > 1 ? `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}` : items[0]

/** The outflow variations, with each criterion that has evaluated them so far. */
export default function OutflowFamily() {
  const evaluated = criteria.flatMap((team) => {
    const finding = team.report.findings['tiered-outflows']
    return finding ? [{ id: team.id, finding }] : []
  })
  const names = evaluated.map(({ id }) => teamStyle[id].shortLabel.toLowerCase())
  const who =
    names.length > 0
      ? ` So far the ${listOf(names)} ${names.length > 1 ? 'criteria have' : 'criterion has'} evaluated them.`
      : ''

  return (
    <FamilySection
      id="outflow-variations"
      number="01"
      title="Outflow variations"
      summary={`${tieredOutflows.title} change how much fresh water leaves the Delta.${who}`}
      background={800}
      actions={[{ label: 'View Modeling results', href: '/scenarios/modeling' }]}
    >
      <Stack spacing={jtSpacing.component.lg}>
        {evaluated.map(({ id, finding }) => (
          <Box
            key={id}
            sx={{ pl: jtSpacing.component.md, borderLeft: 3, borderColor: teamStyle[id].color }}
          >
            <Typography variant="h4" component="h3">
              {finding.headline}
            </Typography>
            <Typography variant="body2" sx={{ mt: jtSpacing.gap.sm, color: 'base.100' }}>
              {finding.overall.summary}
            </Typography>
            {finding.narrative && (
              <Typography variant="body2" sx={{ mt: jtSpacing.gap.sm, color: 'base.100' }}>
                {finding.narrative}
              </Typography>
            )}
          </Box>
        ))}
      </Stack>
    </FamilySection>
  )
}
