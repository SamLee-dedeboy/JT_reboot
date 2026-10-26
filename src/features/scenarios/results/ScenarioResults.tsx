import { Box, Button, ButtonBase, Stack, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { jtSpacing } from '../../../theme'
import TeamIcon from '../../../ui/TeamIcon'
import RegionalSalinitySummary from '../../regional-summary/RegionalSalinitySummary'
import { evaluationTeams, teamReports, type ScenarioFinding } from '../content'
import { ScoreBadge } from '../evaluation/shared'
import { methodologyPath } from '../evaluation/paths'
import { teamStyle, type EvaluationTeamId } from '../teamStyle'

function ModelingResults({
  scenarioSlug,
  scenarioTitle,
  outflowVariation,
  explorerHref,
}: {
  scenarioSlug: string
  scenarioTitle: string
  outflowVariation?: 'increase' | 'decrease'
  explorerHref: string
}) {
  const regionalScenarioSlug =
    scenarioSlug === 'tiered-outflows' ? 'alternative-delta-outflows' : scenarioSlug
  const scenarioKeyOverride =
    outflowVariation === 'increase'
      ? 'schism_run16_plus30pct_outflow'
      : outflowVariation === 'decrease'
        ? 'schism_run17_minus10pct_outflow'
        : undefined

  return (
    <RegionalSalinitySummary
      key={`${regionalScenarioSlug}-${scenarioKeyOverride ?? 'default'}`}
      scenarioSlug={regionalScenarioSlug}
      scenarioTitle={scenarioTitle}
      scenarioKeyOverride={scenarioKeyOverride}
      explorerHref={explorerHref}
      headingId="modeling-results-title"
    />
  )
}

/** A team's finding for this scenario, when its report has one. */
const findingFor = (teamId: EvaluationTeamId, scenarioSlug: string) =>
  teamReports[teamId]?.findings[scenarioSlug]

function OverallScore({ finding }: { finding: ScenarioFinding | undefined }) {
  if (!finding || finding.overall.score !== null) {
    return <ScoreBadge score={finding?.overall.score ?? null} />
  }
  return (
    <Typography variant="captionSmall" sx={{ color: 'base.200', whiteSpace: 'nowrap' }}>
      Scored by metric
    </Typography>
  )
}

const yearFindingPattern = /^Wet year \(([^)]+)\): (.*?)\. Dry year \(([^)]+)\): (.*)$/

function MetricFinding({ text, teamColor }: { text: string; teamColor: string }) {
  const years = text.match(yearFindingPattern)
  if (!years) {
    return (
      <Typography variant="body2" sx={{ mt: jtSpacing.gap.xs, color: 'base.100' }}>
        {text}
      </Typography>
    )
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
        gap: jtSpacing.gap.sm,
        mt: jtSpacing.gap.sm,
      }}
    >
      {[
        { label: 'Wet year', year: years[1], finding: years[2] },
        { label: 'Dry year', year: years[3], finding: years[4] },
      ].map((period) => (
        <Box
          key={period.label}
          sx={{
            p: jtSpacing.component.md,
            border: 1,
            borderTop: 3,
            borderColor: 'border.subtle',
            borderTopColor: teamColor,
            bgcolor: 'translucent.100',
          }}
        >
          <Stack direction="row" spacing={jtSpacing.gap.xs} sx={{ alignItems: 'baseline' }}>
            <Typography variant="navigationLabel" sx={{ color: teamColor }}>
              {period.label}
            </Typography>
            <Typography variant="captionSmall" sx={{ color: 'base.200' }}>
              {period.year}
            </Typography>
          </Stack>
          <Typography variant="body2" sx={{ mt: jtSpacing.gap.xs, color: 'base.100' }}>
            {period.finding}
          </Typography>
        </Box>
      ))}
    </Box>
  )
}

function CriteriaResults({
  scenarioSlug,
  scenarioTitle,
}: {
  scenarioSlug: string
  scenarioTitle: string
}) {
  const [selectedTeamId, setSelectedTeamId] = useState<EvaluationTeamId>(evaluationTeams[0].id)
  const selectedTeam =
    evaluationTeams.find((team) => team.id === selectedTeamId) ?? evaluationTeams[0]
  const style = teamStyle[selectedTeam.id]
  const finding = findingFor(selectedTeam.id, scenarioSlug)

  return (
    <Box component="section" aria-labelledby="criteria-results-title">
      <Typography id="criteria-results-title" variant="h2">
        Evaluation criteria
      </Typography>
      <Typography
        variant="body1"
        sx={{ mt: jtSpacing.gap.md, color: 'base.100', maxWidth: '78ch' }}
      >
        Five teams judged {scenarioTitle} against criteria they designed with Delta communities.
        Scores compare it with Business as Usual: positive is better, negative is worse.
      </Typography>

      {/* Team selector: one tile per team with its overall score */}
      <Box
        role="tablist"
        aria-label="Evaluation teams"
        sx={{
          mt: jtSpacing.section.md,
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(2, minmax(0, 1fr))',
            sm: 'repeat(3, minmax(0, 1fr))',
            lg: 'repeat(5, minmax(0, 1fr))',
          },
          gap: jtSpacing.gap.sm,
        }}
      >
        {evaluationTeams.map((team) => {
          const teamColor = teamStyle[team.id].color
          const selected = team.id === selectedTeam.id
          const teamFinding = findingFor(team.id, scenarioSlug)
          return (
            <ButtonBase
              key={team.id}
              role="tab"
              aria-selected={selected}
              aria-controls="criteria-team-panel"
              onClick={() => setSelectedTeamId(team.id)}
              sx={{
                display: 'grid',
                gridTemplateColumns: 'auto minmax(0, 1fr)',
                alignItems: 'center',
                alignContent: 'start',
                columnGap: jtSpacing.gap.sm,
                rowGap: jtSpacing.gap.sm,
                p: jtSpacing.component.md,
                textAlign: 'left',
                border: 1,
                borderTop: 3,
                borderColor: selected ? teamColor : 'border.subtle',
                borderTopColor: teamColor,
                bgcolor: selected ? alpha(teamColor, 0.12) : 'transparent',
                color: selected ? teamColor : 'common.white',
                transition: 'background-color 160ms ease, border-color 160ms ease',
                '&:hover': { bgcolor: alpha(teamColor, 0.08) },
                '&.Mui-focusVisible': { outline: '2px solid', outlineColor: teamColor },
              }}
            >
              <Box sx={{ color: teamColor }}>
                <TeamIcon team={teamStyle[team.id].icon} size={28} />
              </Box>
              <Typography variant="navigationLabel" sx={{ color: 'inherit' }}>
                {teamStyle[team.id].shortLabel}
              </Typography>
              <Box sx={{ gridColumn: '1 / -1' }}>
                <OverallScore finding={teamFinding} />
              </Box>
            </ButtonBase>
          )
        })}
      </Box>

      {/* Selected team: what it measures and how this scenario scored */}
      <Box
        id="criteria-team-panel"
        role="tabpanel"
        sx={{
          mt: jtSpacing.gap.lg,
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 0.85fr) minmax(0, 1.15fr)' },
          gap: { xs: jtSpacing.gap.lg, lg: jtSpacing.section.md },
          p: { xs: jtSpacing.component.lg, md: jtSpacing.component.xl },
          bgcolor: 'translucent.100',
          borderLeft: 4,
          borderColor: style.color,
        }}
      >
        <Box>
          <Stack
            direction="row"
            spacing={jtSpacing.gap.sm}
            sx={{ alignItems: 'center', color: style.color }}
          >
            <TeamIcon team={style.icon} size={22} />
            <Typography variant="numberArticle" component="p" sx={{ color: style.color }}>
              {selectedTeam.number}
            </Typography>
          </Stack>
          <Typography variant="h3" component="h3" sx={{ mt: jtSpacing.gap.sm }}>
            {finding?.headline ?? selectedTeam.label}
          </Typography>
          {finding ? (
            <>
              <Typography
                variant="eyebrow"
                component="h4"
                sx={{ mt: jtSpacing.component.lg, color: style.color }}
              >
                The team’s interpretation
              </Typography>
              <Typography
                variant="body2"
                sx={{ mt: jtSpacing.gap.xs, color: finding.narrative ? 'base.100' : 'base.200' }}
              >
                {finding.narrative ??
                  `The ${selectedTeam.label} team has not yet written an interpretation of these results.`}
              </Typography>
              <Stack
                direction="row"
                spacing={jtSpacing.gap.sm}
                sx={{ mt: jtSpacing.component.lg, alignItems: 'center' }}
              >
                <OverallScore finding={finding} />
                <Typography variant="meta" sx={{ color: 'base.100' }}>
                  {finding.overall.summary}
                </Typography>
              </Stack>
            </>
          ) : (
            <Typography variant="body2" sx={{ mt: jtSpacing.gap.md, color: 'base.100' }}>
              {selectedTeam.summary}
            </Typography>
          )}
          {finding ? null : (
            <Typography
              variant="meta"
              component="p"
              sx={{ mt: jtSpacing.component.lg, color: 'base.200' }}
            >
              The {selectedTeam.label} team's scores for {scenarioTitle} are still being finalized.
            </Typography>
          )}
          <Button
            component={Link}
            to={methodologyPath(selectedTeam.id)}
            variant="outlined"
            sx={{ mt: jtSpacing.component.lg }}
          >
            How this team evaluates
          </Button>
        </Box>

        <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0 }}>
          {(finding
            ? finding.metrics
            : selectedTeam.metrics.map((metric) => ({
                name: metric.name,
                finding: metric.definition,
                score: null,
              }))
          ).map((metric, index) => (
            <Box
              component="li"
              key={metric.name}
              sx={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr) auto',
                columnGap: jtSpacing.gap.md,
                py: jtSpacing.component.md,
                borderTop: index ? 1 : 0,
                borderColor: 'border.subtle',
              }}
            >
              <Box>
                <Typography variant="cardTitle" component="h4">
                  {metric.name}
                </Typography>
                {finding ? (
                  <MetricFinding text={metric.finding} teamColor={style.color} />
                ) : (
                  <Typography variant="body2" sx={{ mt: jtSpacing.gap.xs, color: 'base.200' }}>
                    {metric.finding}
                  </Typography>
                )}
              </Box>
              <Box sx={{ pt: 0.25 }}>
                {metric.score !== null || !finding ? (
                  <ScoreBadge score={metric.score} />
                ) : (
                  <Typography variant="captionSmall" sx={{ color: 'base.200' }}>
                    Not scored
                  </Typography>
                )}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  )
}

export default function ScenarioResults(props: Parameters<typeof ModelingResults>[0]) {
  return (
    <Stack spacing={jtSpacing.section.xl}>
      <ModelingResults {...props} />
      <CriteriaResults scenarioSlug={props.scenarioSlug} scenarioTitle={props.scenarioTitle} />
    </Stack>
  )
}
