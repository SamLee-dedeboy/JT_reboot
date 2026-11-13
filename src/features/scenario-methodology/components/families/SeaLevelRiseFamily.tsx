import { Box, Typography } from '@mui/material'
import { criterionById } from '@/content/criteria'
import { scenarioBySlug, slrScenarioSlugs } from '@/content/scenarios'
import { jtSpacing } from '@/theme'
import { teamStyle } from '@/ui/teamStyle'
import FamilySection from './FamilySection'

/** The adaptation scenarios again with two feet of sea-level rise, as the criteria report them. */
export default function SeaLevelRiseFamily() {
  const economySource = criterionById.economy.report.source

  return (
    <FamilySection
      id="sea-level-rise"
      number="03"
      title="With two feet of sea-level rise"
      summary={`These adaptation scenarios were also modeled with two feet of sea-level rise: ${slrScenarioSlugs
        .map((slug) => scenarioBySlug[slug]?.title)
        .filter(Boolean)
        .join(', ')}. Most criteria are still reporting their sea-level-rise results.`}
      background={800}
      actions={[]}
    >
      {economySource && (
        <Box
          sx={{
            pl: jtSpacing.component.md,
            borderLeft: 3,
            borderColor: teamStyle.economy.color,
          }}
        >
          <Typography
            variant="navigationLabel"
            component="h3"
            sx={{ color: teamStyle.economy.color }}
          >
            Economy
          </Typography>
          <Typography variant="body2" sx={{ mt: jtSpacing.gap.sm, color: 'base.100' }}>
            {economySource}
          </Typography>
        </Box>
      )}
    </FamilySection>
  )
}
