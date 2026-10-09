import { Box, Chip, Stack, Typography } from '@mui/material'
import { jtSpacing } from '../../../theme'
import { evaluationTeams } from '../content'

export default function EvaluationFramework() {
  return (
    <Box component="section" id="evaluation-framework" aria-labelledby="evaluation-criteria-title">
      <Typography variant="h2" id="evaluation-criteria-title">
        Evaluation teams and criteria
      </Typography>
      <Typography
        variant="body1"
        sx={{ mt: jtSpacing.gap.md, color: 'base.100', maxWidth: '82ch' }}
      >
        Five subteams evaluate every future through a distinct area of expertise. Each team defines
        its own metrics and identifies the people, species, systems, activities, or places most
        relevant to those measures.
      </Typography>

      <Stack spacing={jtSpacing.section.lg} sx={{ mt: jtSpacing.section.lg }}>
        {evaluationTeams.map((team) => (
          <Box
            component="article"
            id={team.id}
            key={team.id}
            sx={{
              scrollMarginTop: 110,
              pt: jtSpacing.section.md,
              borderTop: 1,
              borderColor: 'border.subtle',
            }}
          >
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'minmax(220px, .42fr) 1fr' },
                gap: { xs: jtSpacing.gap.lg, md: jtSpacing.section.lg },
              }}
            >
              <Stack spacing={jtSpacing.gap.md} sx={{ alignItems: 'flex-start' }}>
                <Typography variant="numberArticle" component="p">
                  {team.number}
                </Typography>
                <Typography variant="h3" component="h3">
                  {team.label}
                </Typography>
                <Typography variant="body1" sx={{ color: 'base.100' }}>
                  {team.summary}
                </Typography>
                <Stack spacing={jtSpacing.gap.md} sx={{ width: 1 }}>
                  <Typography variant="navigationLabel" component="h4">
                    Entities of interest
                  </Typography>
                  {team.entityGroups.map((group) => (
                    <Box key={group.label}>
                      <Typography variant="captionSmall" component="h5" sx={{ color: 'base.200' }}>
                        {group.label}
                      </Typography>
                      <Stack
                        direction="row"
                        useFlexGap
                        spacing={jtSpacing.gap.xs}
                        sx={{ mt: jtSpacing.gap.xs, flexWrap: 'wrap' }}
                      >
                        {group.items.map((entity) => (
                          <Chip key={entity} label={entity} variant="outlined" />
                        ))}
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              </Stack>

              <Stack spacing={0}>
                {team.metrics.map((metric, metricIndex) => (
                  <Box
                    key={metric.name}
                    sx={{
                      py: jtSpacing.component.lg,
                      borderTop: 1,
                      borderColor: 'border.subtle',
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', lg: 'minmax(180px, .36fr) 1fr' },
                      gap: { xs: jtSpacing.gap.sm, lg: jtSpacing.gap.lg },
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={jtSpacing.gap.sm}
                      sx={{ alignItems: 'baseline' }}
                    >
                      <Typography variant="numberBadge" component="span" aria-hidden="true">
                        {String(metricIndex + 1).padStart(2, '0')}
                      </Typography>
                      <Typography variant="h4" component="h4">
                        {metric.name}
                      </Typography>
                    </Stack>
                    <Stack spacing={jtSpacing.gap.sm}>
                      <Typography variant="body1" sx={{ color: 'base.100' }}>
                        {metric.definition}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'base.200' }}>
                        <Box component="span" sx={{ color: 'primary.main' }}>
                          Measurement:{' '}
                        </Box>
                        {metric.measurement}
                      </Typography>
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </Box>
          </Box>
        ))}
      </Stack>
    </Box>
  )
}
