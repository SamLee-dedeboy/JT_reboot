import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { Box, Button, Chip, Stack, Typography } from '@mui/material'
import { alpha, type Theme } from '@mui/material/styles'
import { Link } from 'react-router-dom'
import { chart, jtSpacing } from '../../../theme'
import { evaluationTeams } from '../content'

const teamRationales: Record<(typeof evaluationTeams)[number]['id'], string> = {
  ecology:
    'Delta decisions reshape habitat conditions, food webs, and the ability of native and introduced species to persist.',
  'environmental-justice':
    'Water-quality and flood effects are not distributed evenly, so community vulnerability must be considered explicitly.',
  'ecocultural-restoration':
    'A just transition must account for Tribal sovereignty, cultural access, Indigenous knowledge, and reciprocal ecosystem repair.',
  recreation:
    'Changes in water, habitat, and access affect how people fish, boat, hunt, visit, and maintain relationships with the Delta.',
  economy:
    'Scenario choices can alter agricultural production, employment, farm revenue, and connected regional businesses.',
}

const visibleEntityGroup: Record<(typeof evaluationTeams)[number]['id'], string> = {
  ecology: 'Species',
  'environmental-justice': 'People and communities',
  'ecocultural-restoration': 'People and communities',
  recreation: 'People',
  economy: 'Economic sectors',
}

const teamColor = (theme: Theme, teamId: (typeof evaluationTeams)[number]['id']) => {
  const colors = {
    ecology: chart.voting.team.ecology,
    'environmental-justice': chart.voting.team.environmentalJustice,
    'ecocultural-restoration': theme.palette.dataViz.neutral,
    recreation: chart.voting.team.recreation,
    economy: chart.voting.team.economy,
  } as const

  return colors[teamId]
}

/** On a scenario's results page, each team section also links to that team's results for it. */
export default function EvaluationFramework({
  scenario,
  showIntroduction = true,
}: {
  scenario?: { slug: string; title: string }
  showIntroduction?: boolean
}) {
  return (
    <Box
      component="section"
      id="evaluation-framework"
      aria-labelledby={showIntroduction ? 'evaluation-criteria-title' : undefined}
    >
      {showIntroduction && (
        <>
          <Typography variant="h2" id="evaluation-criteria-title">
            Evaluation teams and criteria
          </Typography>
          <Typography
            variant="body1"
            sx={{ mt: jtSpacing.gap.md, color: 'base.100', maxWidth: '78ch' }}
          >
            Multidisciplinary teams evaluate every future from complementary ecological, cultural,
            community, recreational, and economic perspectives. Together, their work makes the
            trade-offs between scenarios visible without reducing every value to the same measure.
          </Typography>
        </>
      )}

      <Box sx={{ mt: showIntroduction ? jtSpacing.section.lg : 0 }}>
        <Typography variant="h3" component="h3">
          Why these teams
        </Typography>
        <Stack spacing={jtSpacing.gap.md} sx={{ mt: jtSpacing.component.lg }}>
          {evaluationTeams.map((team) => (
            <Stack
              key={team.id}
              direction={{ xs: 'column', sm: 'row' }}
              spacing={jtSpacing.gap.md}
              sx={{ alignItems: { xs: 'flex-start', sm: 'center' } }}
            >
              <Chip
                label={team.label}
                sx={(theme) => ({
                  flex: 'none',
                  height: 'auto',
                  color: 'common.white',
                  borderColor: teamColor(theme, team.id),
                  bgcolor: alpha(teamColor(theme, team.id), 0.22),
                  '& .MuiChip-label': {
                    typography: 'captionSmall',
                    py: jtSpacing.component.xs / 2,
                    whiteSpace: 'normal',
                  },
                })}
                variant="outlined"
              />
              <Typography variant="body2">{teamRationales[team.id]}</Typography>
            </Stack>
          ))}
        </Stack>
      </Box>

      <Stack spacing={jtSpacing.section.sm} sx={{ mt: jtSpacing.section.md }}>
        {evaluationTeams.map((team) => (
          <Box
            component="article"
            id={team.id}
            key={team.id}
            sx={(theme) => ({
              scrollMarginTop: 110,
              pt: jtSpacing.component.md,
              borderTop: 4,
              borderColor: teamColor(theme, team.id),
            })}
          >
            <Stack spacing={jtSpacing.component.md}>
              <Stack spacing={jtSpacing.gap.sm} sx={{ alignItems: 'flex-start' }}>
                <Typography variant="h3" component="h3">
                  {team.label}
                </Typography>
                <Box>
                  <Typography variant="navigationLabel" component="h4">
                    Overall goal
                  </Typography>
                  <Typography variant="body1" sx={{ mt: jtSpacing.gap.sm, color: 'base.100' }}>
                    {team.summary}
                  </Typography>
                </Box>
              </Stack>

              <Stack spacing={jtSpacing.gap.sm}>
                {team.entityGroups
                  .filter((group) => group.label === visibleEntityGroup[team.id])
                  .map((group) => (
                    <Box key={group.label}>
                      <Typography variant="captionSmall" component="h5" sx={{ color: 'base.100' }}>
                        {group.label}
                      </Typography>
                      <Stack
                        direction="row"
                        useFlexGap
                        spacing={jtSpacing.gap.xs}
                        sx={{ mt: jtSpacing.gap.xs, flexWrap: 'wrap' }}
                      >
                        {group.items.map((entity) => (
                          <Chip
                            key={entity}
                            label={entity}
                            variant="outlined"
                            sx={(theme) => ({
                              height: 'auto',
                              color: 'common.white',
                              borderColor: teamColor(theme, team.id),
                              bgcolor: alpha(teamColor(theme, team.id), 0.18),
                              '& .MuiChip-label': {
                                typography: 'captionSmall',
                                py: jtSpacing.component.xs / 2,
                                whiteSpace: 'normal',
                              },
                            })}
                          />
                        ))}
                      </Stack>
                    </Box>
                  ))}
              </Stack>

              <Box>
                <Typography variant="navigationLabel" component="h4">
                  Metrics
                </Typography>
                <Stack spacing={0} sx={{ mt: jtSpacing.gap.sm }}>
                  {team.metrics.map((metric, metricIndex) => (
                    <Box
                      key={metric.name}
                      sx={{
                        py: jtSpacing.component.md,
                        borderTop: 1,
                        borderColor: 'border.subtle',
                      }}
                    >
                      <Stack
                        direction="row"
                        spacing={jtSpacing.gap.sm}
                        sx={{ alignItems: 'baseline' }}
                      >
                        <Typography
                          variant="numberBadge"
                          component="span"
                          aria-hidden="true"
                          sx={(theme) => ({ color: teamColor(theme, team.id) })}
                        >
                          {String(metricIndex + 1).padStart(2, '0')}
                        </Typography>
                        <Typography variant="h4" component="h5">
                          {metric.name}
                        </Typography>
                      </Stack>
                      <Typography variant="body1" sx={{ mt: jtSpacing.gap.sm, color: 'base.100' }}>
                        {metric.definition}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>

              <Stack
                direction="row"
                useFlexGap
                spacing={jtSpacing.gap.sm}
                sx={{ flexWrap: 'wrap' }}
              >
                <Button
                  component={Link}
                  to={`/scenarios/evaluation/${team.id}`}
                  variant="outlined"
                  endIcon={<ArrowForwardIcon />}
                >
                  More about how this team evaluated
                </Button>
                {scenario && (
                  <Button
                    component={Link}
                    to={`/scenarios/${scenario.slug}/results/${team.id}`}
                    variant="outlined"
                    sx={{ color: 'common.white', borderColor: 'base.300' }}
                  >
                    Results for {scenario.title}
                  </Button>
                )}
              </Stack>
            </Stack>
          </Box>
        ))}
      </Stack>
    </Box>
  )
}
