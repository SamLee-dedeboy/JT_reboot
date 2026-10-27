import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { Box, Button, Container, Stack, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { jtSpacing } from '../../../theme'
import Footer from '../../../ui/Footer'
import Navbar from '../../../ui/Navbar'
import TeamIcon from '../../../ui/TeamIcon'
import {
  adaptationScenarios,
  evaluationTeams,
  scenarioBySlug,
  slrScenarioSlugs,
  teamReports,
  tieredOutflowsScenario,
} from '../content'
import { ScoreBadge } from '../evaluation/shared'
import { teamStyle } from '../teamStyle'
import ResultsHero from './ResultsHero'
import { fullBleedBand } from './styles'

const criteriaColumns = `minmax(160px, 1.2fr) repeat(${evaluationTeams.length}, minmax(88px, 1fr))`

/** One criterion's verdict on one future: its score, or why there is no single score. */
function CriterionCell({ teamId, scenarioSlug }: { teamId: string; scenarioSlug: string }) {
  const finding = teamReports[teamId]?.findings[scenarioSlug]
  if (!finding) {
    return (
      <Typography variant="captionSmall" sx={{ color: 'base.300' }}>
        Not assessed
      </Typography>
    )
  }
  if (finding.overall.score === null) {
    return (
      <Typography variant="captionSmall" sx={{ color: 'base.200' }} title={finding.overall.summary}>
        No single score
      </Typography>
    )
  }
  return <ScoreBadge score={finding.overall.score} />
}

/** Futures down the side, the five criteria across the top. */
function CriteriaGrid({ rows }: { rows: { slug: string; label: string }[] }) {
  return (
    <Box sx={{ overflowX: 'auto' }}>
      <Box role="table" sx={{ display: 'grid', gridTemplateColumns: criteriaColumns }}>
        <Box role="row" sx={{ display: 'contents' }}>
          <Typography role="columnheader" variant="captionSmall" sx={{ color: 'base.200' }}>
            Future
          </Typography>
          {evaluationTeams.map((team) => (
            <Stack
              key={team.id}
              role="columnheader"
              direction="row"
              spacing={jtSpacing.gap.xs}
              sx={{ alignItems: 'center', color: teamStyle[team.id].color, pb: jtSpacing.gap.sm }}
            >
              <TeamIcon team={teamStyle[team.id].icon} size={18} />
              <Typography variant="navigationSubLabel" sx={{ color: 'inherit' }}>
                {teamStyle[team.id].shortLabel}
              </Typography>
            </Stack>
          ))}
        </Box>
        {rows.map((row) => (
          <Box role="row" key={row.slug} sx={{ display: 'contents' }}>
            <Typography
              role="rowheader"
              variant="navigationLabel"
              sx={{ py: jtSpacing.component.sm, borderTop: 1, borderColor: 'border.subtle' }}
            >
              {row.label}
            </Typography>
            {evaluationTeams.map((team) => (
              <Box
                role="cell"
                key={team.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  py: jtSpacing.component.sm,
                  borderTop: 1,
                  borderColor: 'border.subtle',
                }}
              >
                <CriterionCell teamId={team.id} scenarioSlug={row.slug} />
              </Box>
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  )
}

function FamilySection({
  id,
  number,
  title,
  summary,
  background,
  children,
  actions,
}: {
  id: string
  number: string
  title: string
  summary: string
  /** Base palette step for the section band. */
  background: 700 | 800
  children: ReactNode
  actions: { label: string; href: string }[]
}) {
  return (
    <Box
      component="section"
      id={id}
      aria-labelledby={`${id}-title`}
      sx={[
        { py: { xs: jtSpacing.section.md, md: jtSpacing.section.lg } },
        (theme) => fullBleedBand(theme.palette.base[background]),
      ]}
    >
      <Stack direction="row" spacing={jtSpacing.gap.sm} sx={{ alignItems: 'baseline' }}>
        <Typography variant="numberArticle" component="span">
          {number}
        </Typography>
        <Typography id={`${id}-title`} variant="h2">
          {title}
        </Typography>
      </Stack>
      <Typography
        variant="body1"
        sx={{
          mt: jtSpacing.gap.md,
          mb: jtSpacing.component.lg,
          color: 'base.100',
          maxWidth: '78ch',
        }}
      >
        {summary}
      </Typography>
      {children}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        useFlexGap
        spacing={jtSpacing.gap.sm}
        sx={{ mt: jtSpacing.component.lg, flexWrap: 'wrap' }}
      >
        {actions.map((action, index) => (
          <Button
            key={action.href}
            component={Link}
            to={action.href}
            variant={index === 0 ? 'contained' : 'outlined'}
            endIcon={index === 0 ? <ArrowForwardIcon /> : undefined}
          >
            {action.label}
          </Button>
        ))}
      </Stack>
    </Box>
  )
}

/** Evaluation step: how the criteria judged each family of futures, before any one scenario. */
export default function FamiliesPage() {
  const outflowFinding = teamReports['environmental-justice']?.findings['tiered-outflows']
  const economySource = teamReports.economy?.source

  return (
    <>
      <Navbar />
      <Box component="main" sx={{ bgcolor: 'base.800', color: 'common.white' }}>
        <ResultsHero
          title="The three families at a glance"
          summary="Before looking at one scenario through every criterion, see how the criteria judged each family of futures: the outflow variations, the adaptation scenarios, and the adaptation scenarios with two feet of sea-level rise."
        />
        <Container maxWidth="lg">
          <FamilySection
            id="outflow-variations"
            number="01"
            title="Outflow variations"
            summary={`${tieredOutflowsScenario.title} change how much fresh water leaves the Delta. So far only the environmental justice criterion has evaluated them.`}
            background={800}
            actions={[
              { label: 'Outflow variation results', href: '/scenarios/tiered-outflows/results' },
            ]}
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

          <FamilySection
            id="adaptation-scenarios"
            number="02"
            title="Adaptation scenarios"
            summary="Every criterion evaluated the five adaptation scenarios. Scores compare each one with Business as Usual: positive is better, negative is worse."
            background={700}
            actions={[
              { label: 'Compare in the ranking', href: '/scenarios/ranking' },
              { label: 'Adaptation scenario results', href: '/scenarios/eco-machine/results' },
            ]}
          >
            <CriteriaGrid
              rows={adaptationScenarios.map((scenario) => ({
                slug: scenario.slug,
                label: scenario.title,
              }))}
            />
          </FamilySection>

          <FamilySection
            id="sea-level-rise"
            number="03"
            title="With two feet of sea-level rise"
            summary={`These adaptation scenarios were also modeled with two feet of sea-level rise: ${slrScenarioSlugs
              .map((slug) => scenarioBySlug[slug]?.title)
              .filter(Boolean)
              .join(', ')}. Most criteria are still reporting their sea-level-rise results.`}
            background={800}
            actions={[
              {
                label: 'Sea-level rise results',
                href: '/scenarios/eco-machine/results?seaLevelRise=true',
              },
            ]}
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
        </Container>
      </Box>
      <Footer />
    </>
  )
}
