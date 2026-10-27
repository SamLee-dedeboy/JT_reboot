// One evaluation team's results for one future: a headline verdict, each
// metric against baseline, where the future ranks, and the team's narrative.
// Visitors can switch scenario (same team) or team (same scenario).
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { Box, Button, Container, Stack, Typography } from '@mui/material'
import { Link, Navigate, useParams } from 'react-router-dom'
import { jtSpacing } from '../../../theme'
import Footer from '../../../ui/Footer'
import Navbar from '../../../ui/Navbar'
import StoryTabs from '../StoryTabs'
import { adaptationScenarios, scenarioBySlug, teamReports } from '../content'
import { findTeam, isEvaluatedScenario, teamResultsPath } from './paths'
import { evaluationCardSx } from './styles'
import { EvaluationHero, ScoreBadge, SectionHeading, TeamTabs } from './shared'

export default function TeamScenarioPage() {
  const { scenarioSlug, teamId } = useParams()
  const team = findTeam(teamId)
  const scenario = scenarioSlug ? scenarioBySlug[scenarioSlug] : undefined
  if (!team || !scenario || !isEvaluatedScenario(scenarioSlug)) {
    return (
      <Navigate
        to={scenario ? `/scenarios/${scenario.slug}/results` : '/scenarios/evaluation'}
        replace
      />
    )
  }

  const report = teamReports[team.id]
  const finding = report?.findings[scenario.slug]
  const isAdaptation = adaptationScenarios.some((item) => item.slug === scenario.slug)
  const resultsPath = `/scenarios/${scenario.slug}/results`

  // The team's published scores, or what each metric will measure while results are pending.
  const metricCards = finding
    ? finding.metrics.map((metric) => ({
        ...metric,
        measurement: team.metrics.find((item) => item.name === metric.name)?.measurement,
      }))
    : team.metrics.map((metric) => ({
        name: metric.name,
        finding: 'Results in preparation.',
        score: null,
        measurement: metric.measurement,
      }))

  // Adaptation scenarios that have an overall score, best first, for "Where it ranks".
  const ranked = isAdaptation
    ? adaptationScenarios
        .map((item) => ({ scenario: item, finding: report?.findings[item.slug] }))
        .filter((item) => item.finding && item.finding.overall.score !== null)
        .sort((a, b) => (b.finding!.overall.score ?? -99) - (a.finding!.overall.score ?? -99))
    : []

  return (
    <>
      <Navbar />
      <Box component="main" sx={{ bgcolor: 'base.800', color: 'common.white' }}>
        <EvaluationHero
          image={scenario.image}
          crumbs={[
            { label: 'Choose a Future', to: '/scenarios' },
            { label: scenario.title, to: `/scenarios/${scenario.slug}` },
            { label: 'Results', to: resultsPath },
          ]}
          eyebrow={`${scenario.title} · Criterion ${team.number}`}
          title={team.label}
          summary={
            finding?.headline ?? `${team.label} results for ${scenario.title} are in preparation.`
          }
        >
          {report && finding && (
            <Typography variant="captionSmall" sx={{ color: 'base.200' }}>
              {report.status === 'draft' ? 'Draft findings · ' : 'Source · '}
              {report.source}
            </Typography>
          )}
        </EvaluationHero>
        {isAdaptation && (
          <StoryTabs currentSlug={scenario.slug} destination="results" teamId={team.id} />
        )}
        <TeamTabs
          activeTeamId={team.id}
          hrefFor={(id) => teamResultsPath(scenario.slug, id)}
          sticky={!isAdaptation}
        />

        <Container
          maxWidth="lg"
          sx={{ py: { xs: jtSpacing.section.lg, md: jtSpacing.section.xl } }}
        >
          <Stack spacing={jtSpacing.section.xl}>
            {/* Metric results */}
            <Box component="section" aria-labelledby="metric-results-title">
              <SectionHeading number="01" title="Metric results" id="metric-results-title" />
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    md: `repeat(${Math.min(metricCards.length, 3)}, 1fr)`,
                  },
                  gap: jtSpacing.gap.md,
                }}
              >
                {metricCards.map((metric) => (
                  <Stack key={metric.name} spacing={jtSpacing.gap.sm} sx={evaluationCardSx}>
                    <Stack
                      direction="row"
                      sx={{ justifyContent: 'space-between', alignItems: 'center', gap: 1 }}
                    >
                      <Typography variant="cardTitle" component="h3">
                        {metric.name}
                      </Typography>
                      {metric.score !== null || !finding ? (
                        <ScoreBadge score={metric.score} />
                      ) : (
                        <Typography variant="captionSmall" sx={{ color: 'base.200' }}>
                          Not scored
                        </Typography>
                      )}
                    </Stack>
                    <Typography variant="cardBody" sx={{ color: 'base.50' }}>
                      {metric.finding}
                    </Typography>
                    {metric.measurement && (
                      <Typography variant="captionSmall" sx={{ color: 'base.200' }}>
                        {metric.measurement}
                      </Typography>
                    )}
                  </Stack>
                ))}
              </Box>
            </Box>

            {/* Where it ranks */}
            {finding && (
              <Box component="section" aria-labelledby="rank-title">
                <SectionHeading number="02" title="Where it ranks" id="rank-title" />
                <Stack direction="row" spacing={jtSpacing.gap.md} sx={{ alignItems: 'center' }}>
                  {finding.overall.score !== null && <ScoreBadge score={finding.overall.score} />}
                  <Typography variant="bodyLarge">{finding.overall.summary}</Typography>
                </Stack>
                {finding.overall.score !== null && ranked.length > 0 && (
                  <Stack
                    component="ol"
                    spacing={jtSpacing.gap.xs}
                    sx={{ m: 0, mt: jtSpacing.gap.lg, p: 0, listStyle: 'none', maxWidth: 560 }}
                  >
                    {ranked.map(({ scenario: item, finding: itemFinding }) => {
                      const current = item.slug === scenario.slug
                      return (
                        <Box
                          component="li"
                          key={item.slug}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: jtSpacing.gap.sm,
                            px: jtSpacing.component.sm,
                            py: jtSpacing.component.xs,
                            borderRadius: 1,
                            border: 1,
                            borderColor: current ? 'primary.main' : 'border.subtle',
                          }}
                        >
                          <ScoreBadge score={itemFinding!.overall.score} />
                          <Typography
                            component={Link}
                            to={`/scenarios/${item.slug}/results/${team.id}`}
                            variant="body2"
                            aria-current={current ? 'page' : undefined}
                            sx={{ color: current ? 'primary.main' : 'common.white' }}
                          >
                            {item.title}
                          </Typography>
                        </Box>
                      )
                    })}
                  </Stack>
                )}
              </Box>
            )}

            {/* The team's narrative */}
            {finding?.narrative && (
              <Box component="section" aria-labelledby="narrative-title">
                <SectionHeading
                  number="03"
                  title="What it means for communities"
                  id="narrative-title"
                />
                <Typography variant="bodyLarge" sx={{ color: 'base.50', maxWidth: '70ch' }}>
                  {finding.narrative}
                </Typography>
              </Box>
            )}

            {/* Next steps */}
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={jtSpacing.gap.sm}
              useFlexGap
              sx={{ flexWrap: 'wrap' }}
            >
              <Button
                component={Link}
                to={`/scenarios/evaluation/${team.id}#scenario-comparisons`}
                variant="contained"
                endIcon={<ArrowForwardIcon />}
              >
                Compare this criterion across scenarios
              </Button>
              <Button
                component={Link}
                to={`/scenarios/evaluation/${team.id}`}
                variant="outlined"
                sx={{ color: 'common.white', borderColor: 'base.300' }}
              >
                How this criterion was evaluated
              </Button>
              <Button
                component={Link}
                to={`${resultsPath}#evaluation-framework`}
                variant="outlined"
                sx={{ color: 'common.white', borderColor: 'base.300' }}
              >
                Back to {scenario.title} results
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>
      <Footer />
    </>
  )
}
