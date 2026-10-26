import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { Box, Button, Stack, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import { jtSpacing } from '../../../theme'
import TagChip from '../../../ui/TagChip'
import TeamIcon from '../../../ui/TeamIcon'
import { criterionStories, evaluationTeams } from '../content'
import { teamStyle, type EvaluationTeamId } from '../teamStyle'

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

const teamColor = (teamId: EvaluationTeamId) => teamStyle[teamId].color

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
        {/* Each team stacked: its chip on top, the rationale beneath */}
        <Box sx={{ mt: jtSpacing.component.lg, display: 'grid', gap: jtSpacing.gap.lg }}>
          {evaluationTeams.map((team) => (
            <Stack key={team.id} spacing={jtSpacing.gap.sm} sx={{ alignItems: 'flex-start' }}>
              <TagChip label={team.label} fill={teamColor(team.id)} />
              <Typography variant="body2">{teamRationales[team.id]}</Typography>
            </Stack>
          ))}
        </Box>
      </Box>

      <Stack spacing={jtSpacing.section.sm} sx={{ mt: jtSpacing.section.md }}>
        {evaluationTeams.map((team) => (
          <Box
            component="article"
            id={team.id}
            key={team.id}
            sx={{
              scrollMarginTop: 110,
              pt: jtSpacing.component.md,
              borderTop: 4,
              borderColor: teamColor(team.id),
            }}
          >
            {/* Team title spans both columns so their first headings line up */}
            <Typography
              variant="h3"
              component="h3"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: jtSpacing.gap.sm,
                mb: jtSpacing.component.md,
                color: teamColor(team.id),
              }}
            >
              <TeamIcon team={teamStyle[team.id].icon} size={32} />
              {team.label}
            </Typography>
            {/* Two columns from md up: the criterion on the left, its components on the right */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) minmax(0, 1fr)' },
                gap: { xs: jtSpacing.component.md, md: jtSpacing.section.md },
                alignItems: 'start',
              }}
            >
              <Stack spacing={jtSpacing.component.md}>
                <Stack spacing={jtSpacing.gap.sm} sx={{ alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="navigationLabel" component="h4">
                      What is this criterion?
                    </Typography>
                    <Typography variant="body1" sx={{ mt: jtSpacing.gap.sm, color: 'base.100' }}>
                      {criterionStories[team.id].brief.what}
                    </Typography>
                  </Box>
                </Stack>

                <Stack spacing={jtSpacing.gap.sm}>
                  {team.entityGroups
                    .filter((group) => group.label === visibleEntityGroup[team.id])
                    .map((group) => (
                      <Box key={group.label}>
                        <Typography
                          variant="captionSmall"
                          component="h5"
                          sx={{ color: 'base.100' }}
                        >
                          {group.label}
                        </Typography>
                        <Stack
                          direction="row"
                          useFlexGap
                          spacing={jtSpacing.gap.xs}
                          sx={{ mt: jtSpacing.gap.xs, flexWrap: 'wrap' }}
                        >
                          {group.items.map((entity) => (
                            <TagChip key={entity} label={entity} fill={teamColor(team.id)} />
                          ))}
                        </Stack>
                      </Box>
                    ))}
                </Stack>

                <Box>
                  <Typography variant="navigationLabel" component="h4">
                    Why does it matter?
                  </Typography>
                  <Typography variant="body1" sx={{ mt: jtSpacing.gap.sm, color: 'base.100' }}>
                    {criterionStories[team.id].brief.why}
                  </Typography>
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
              <Box>
                <Typography variant="navigationLabel" component="h4">
                  What are its components?
                </Typography>
                <Stack spacing={0} sx={{ mt: jtSpacing.gap.sm }}>
                  {criterionStories[team.id].components.items.map((component, componentIndex) => (
                    <Box
                      key={component.name}
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
                          sx={{ color: teamColor(team.id) }}
                        >
                          {String(componentIndex + 1).padStart(2, '0')}
                        </Typography>
                        <Typography variant="h4" component="h5">
                          {component.name}
                        </Typography>
                      </Stack>
                      <Typography variant="body1" sx={{ mt: jtSpacing.gap.sm, color: 'base.100' }}>
                        {component.summary}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Box>
          </Box>
        ))}
      </Stack>
    </Box>
  )
}
