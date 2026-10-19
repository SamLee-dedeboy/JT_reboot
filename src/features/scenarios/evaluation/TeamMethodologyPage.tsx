// One evaluation team's methodology: what the criterion is, why it matters,
// how it was built, its metrics, how scenarios rank, and a card per scenario
// leading to the team's results for that future.
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import {
  Box,
  Button,
  Chip,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  Typography,
  Container,
} from '@mui/material'
import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { jtSpacing } from '../../../theme'
import Footer from '../../../ui/Footer'
import Navbar from '../../../ui/Navbar'
import { teamReports, type TeamReport } from '../content'
import { findTeam, methodologyPath, type EvaluationTeam } from './paths'
import { evaluatedScenarios } from './scenarioOrder'
import { evaluationCardSx } from './styles'
import { EvaluationHero, ScoreBadge, SectionHeading, TeamTabs } from './shared'

export default function TeamMethodologyPage() {
  const { teamId } = useParams()
  const team = findTeam(teamId)
  if (!team) return <Navigate to="/scenarios/results#evaluation-framework" replace />
  const report = teamReports[team.id]

  return (
    <>
      <Navbar />
      <Box component="main" sx={{ bgcolor: 'base.800', color: 'common.white' }}>
        <EvaluationHero
          image="/images/scenarios/cover.jpg"
          crumbs={[
            { label: 'Modeling & Evaluation', to: '/scenarios/results' },
            { label: 'Evaluation teams', to: '/scenarios/results#evaluation-framework' },
          ]}
          eyebrow={`Evaluation criterion ${team.number}`}
          title={team.label}
          summary={team.summary}
        >
          {report?.status === 'draft' && (
            <Typography variant="captionSmall" sx={{ color: 'base.200' }}>
              Draft findings · {report.source}
            </Typography>
          )}
        </EvaluationHero>
        <TeamTabs activeTeamId={team.id} hrefFor={methodologyPath} />

        <Container
          maxWidth="lg"
          sx={{ py: { xs: jtSpacing.section.lg, md: jtSpacing.section.xl } }}
        >
          <Stack spacing={jtSpacing.section.xl}>
            {report ? (
              <>
                <CriterionSection report={report} />
                <WhySection report={report} />
                <ConstructionSection report={report} />
                <MetricsSection team={team} report={report} />
                <RankingSection team={team} report={report} />
              </>
            ) : (
              <SummarySection team={team} />
            )}
            <ComparisonsSection team={team} report={report} number={report ? '06' : '02'} />
            {report && (
              <Box component="section" aria-labelledby="references-title">
                <SectionHeading number="07" title="References" id="references-title" />
                <Typography variant="body2" sx={{ color: 'base.100', maxWidth: '78ch' }}>
                  {report.source}
                </Typography>
              </Box>
            )}
          </Stack>
        </Container>
      </Box>
      <Footer />
    </>
  )
}

function CriterionSection({ report }: { report: TeamReport }) {
  return (
    <Box component="section" aria-labelledby="criterion-title">
      <SectionHeading number="01" title="What is the criterion?" id="criterion-title" />
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          gap: jtSpacing.gap.md,
        }}
      >
        {report.definitions.map((definition) => (
          <Stack key={definition.term} spacing={jtSpacing.gap.sm} sx={evaluationCardSx}>
            <Typography variant="cardTitle" component="h3">
              {definition.term}
            </Typography>
            <Typography variant="cardBody" sx={{ color: 'base.50' }}>
              {definition.text}
            </Typography>
            <Typography variant="captionSmall" sx={{ color: 'base.200' }}>
              {definition.source}
            </Typography>
          </Stack>
        ))}
      </Box>
      <Stack spacing={jtSpacing.gap.md} sx={{ mt: jtSpacing.section.md, maxWidth: '78ch' }}>
        <Typography variant="h3" component="h3">
          Vulnerability classifications
        </Typography>
        <Typography variant="body1" sx={{ color: 'base.100' }}>
          {report.classifications.intro}
        </Typography>
        <ChipRow items={report.classifications.levels} color="primary" />
        <Typography variant="navigationLabel" component="h4">
          Indicators
        </Typography>
        <ChipRow items={report.classifications.indicators} />
      </Stack>
    </Box>
  )
}

function WhySection({ report }: { report: TeamReport }) {
  const { stat, points, quotes } = report.whyItMatters
  return (
    <Box component="section" aria-labelledby="why-title">
      <SectionHeading number="02" title="Why does this criterion matter?" id="why-title" />
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'minmax(0, .8fr) minmax(0, 1fr)' },
          gap: { xs: jtSpacing.gap.lg, md: jtSpacing.section.md },
          alignItems: 'start',
        }}
      >
        <Stack spacing={jtSpacing.gap.sm}>
          <Typography variant="displayNumber" component="p" sx={{ color: 'primary.main' }}>
            {stat.value}
          </Typography>
          <Typography variant="bodyLarge">{stat.label}</Typography>
        </Stack>
        <Stack spacing={jtSpacing.gap.md}>
          {points.map((point) => (
            <Typography key={point} variant="body1" sx={{ color: 'base.100' }}>
              {point}
            </Typography>
          ))}
          {quotes.map((quote) => (
            <Box
              key={quote}
              component="blockquote"
              sx={{ m: 0, pl: jtSpacing.component.md, borderLeft: 3, borderColor: 'primary.main' }}
            >
              <Typography variant="body1" sx={{ color: 'base.50' }}>
                “{quote}”
              </Typography>
              <Typography variant="captionSmall" sx={{ color: 'base.200' }}>
                Project interviewee
              </Typography>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  )
}

function ConstructionSection({ report }: { report: TeamReport }) {
  const { background, timeline, alignment, priorities } = report.construction
  return (
    <Box component="section" aria-labelledby="construction-title">
      <SectionHeading
        number="03"
        title="How was this criterion constructed?"
        id="construction-title"
      />
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
          gap: { xs: jtSpacing.gap.lg, md: jtSpacing.section.md },
        }}
      >
        <Stack spacing={jtSpacing.gap.md}>
          <Typography variant="body1" sx={{ color: 'base.100' }}>
            {background}
          </Typography>
          <Box component="ol" sx={{ m: 0, pl: jtSpacing.component.md }}>
            {timeline.map((step) => (
              <Typography key={step} component="li" variant="body2" sx={{ mb: 0.75 }}>
                {step}
              </Typography>
            ))}
          </Box>
        </Stack>
        <Stack spacing={jtSpacing.gap.md}>
          <Typography variant="body1" sx={{ color: 'base.100' }}>
            {alignment}
          </Typography>
          <Table size="small" aria-label="Community priorities and how they were addressed">
            <TableHead>
              <TableRow>
                <TableCell>Community priority</TableCell>
                <TableCell>How it is addressed</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {priorities.map((row) => (
                <TableRow key={row.priority}>
                  <TableCell>{row.priority}</TableCell>
                  <TableCell sx={{ color: 'base.100' }}>{row.outcome}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Stack>
      </Box>
    </Box>
  )
}

function MetricsSection({ team, report }: { team: EvaluationTeam; report: TeamReport }) {
  const [active, setActive] = useState(0)
  const metric = team.metrics[active]
  const detail = report.metrics.find((item) => item.name === metric.name)

  return (
    <Box component="section" aria-labelledby="metrics-title">
      <SectionHeading number="04" title="What are the metrics?" id="metrics-title" />
      <Tabs
        value={active}
        onChange={(_, next: number) => setActive(next)}
        variant="scrollable"
        allowScrollButtonsMobile
        aria-label="Metrics"
      >
        {team.metrics.map((item, index) => (
          <Tab key={item.name} label={item.name} id={`metric-tab-${index}`} />
        ))}
      </Tabs>
      <Box
        role="tabpanel"
        aria-labelledby={`metric-tab-${active}`}
        sx={{
          pt: jtSpacing.section.sm,
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'minmax(0, .9fr) minmax(0, 1.1fr)' },
          gap: { xs: jtSpacing.gap.lg, md: jtSpacing.section.md },
        }}
      >
        <Stack spacing={jtSpacing.gap.md}>
          <Typography variant="body1" sx={{ color: 'base.50' }}>
            {metric.definition}
          </Typography>
          <LabeledText label="Measurement" text={metric.measurement} />
          {detail && <LabeledText label="Location of measurement" text={detail.location} />}
          {detail && (
            <Box>
              <Typography variant="navigationLabel" component="h4" sx={{ mb: 1 }}>
                Methods
              </Typography>
              <Box component="ul" sx={{ m: 0, pl: jtSpacing.component.md }}>
                {detail.methods.map((method) => (
                  <Typography key={method} component="li" variant="body2" sx={{ mb: 0.75 }}>
                    {method}
                  </Typography>
                ))}
              </Box>
            </Box>
          )}
        </Stack>
        <Stack spacing={jtSpacing.gap.md}>
          <Typography variant="navigationLabel" component="h4">
            Results
          </Typography>
          {detail?.results.map((result) => (
            <Box key={result.title} sx={evaluationCardSx}>
              <Typography variant="cardTitle" component="h5">
                {result.title}
              </Typography>
              <Typography variant="cardBody" sx={{ color: 'base.100', mt: 1 }}>
                {result.body}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  )
}

function RankingSection({ team, report }: { team: EvaluationTeam; report: TeamReport }) {
  return (
    <Box component="section" aria-labelledby="ranking-title">
      <SectionHeading number="05" title="How do the scenarios compare?" id="ranking-title" />
      <Typography variant="body1" sx={{ color: 'base.100', maxWidth: '78ch' }}>
        {report.scoring}
      </Typography>
      <Box sx={{ overflowX: 'auto', mt: jtSpacing.gap.lg }}>
        <Table size="small" aria-label={`${team.label} scores by scenario`}>
          <TableHead>
            <TableRow>
              <TableCell>Scenario</TableCell>
              {team.metrics.map((metric) => (
                <TableCell key={metric.name} align="center">
                  {metric.name}
                </TableCell>
              ))}
              <TableCell align="center">Overall</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {evaluatedScenarios.map((scenario) => {
              const finding = report.findings[scenario.slug]
              if (!finding) return null
              return (
                <TableRow key={scenario.slug} hover>
                  <TableCell>
                    <Typography
                      component={Link}
                      to={`/scenarios/${scenario.slug}/results/${team.id}`}
                      variant="body2"
                      sx={{
                        color: 'common.white',
                        '&:hover, &:focus-visible': { color: 'primary.main' },
                      }}
                    >
                      {scenario.title}
                    </Typography>
                  </TableCell>
                  {team.metrics.map((metric) => (
                    <TableCell key={metric.name} align="center">
                      <ScoreBadge
                        score={
                          finding.metrics.find((item) => item.name === metric.name)?.score ?? null
                        }
                      />
                    </TableCell>
                  ))}
                  <TableCell align="center">
                    <ScoreBadge score={finding.overall.score} />
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Box>
      <Box component="ul" sx={{ mt: jtSpacing.gap.lg, pl: jtSpacing.component.md }}>
        {report.rankingSummary.map((line) => (
          <Typography key={line} component="li" variant="body2" sx={{ mb: 0.75 }}>
            {line}
          </Typography>
        ))}
      </Box>
      <Button
        component={Link}
        to="/pages/rank-visualization"
        variant="outlined"
        endIcon={<ArrowForwardIcon />}
        sx={{ mt: jtSpacing.gap.md, color: 'common.white', borderColor: 'base.300' }}
      >
        Compare all teams
      </Button>
    </Box>
  )
}

function SummarySection({ team }: { team: EvaluationTeam }) {
  return (
    <Box component="section" aria-labelledby="criterion-title">
      <SectionHeading number="01" title="The criterion" id="criterion-title" />
      <Typography variant="body1" sx={{ color: 'base.100', maxWidth: '78ch' }}>
        The full methodology for this team is in preparation. Its metrics are below.
      </Typography>
      <Stack spacing={jtSpacing.gap.md} sx={{ mt: jtSpacing.gap.lg }}>
        {team.metrics.map((metric) => (
          <Box key={metric.name} sx={evaluationCardSx}>
            <Typography variant="cardTitle" component="h3">
              {metric.name}
            </Typography>
            <Typography variant="cardBody" sx={{ color: 'base.100', mt: 1 }}>
              {metric.definition}
            </Typography>
            <LabeledText label="Measurement" text={metric.measurement} />
          </Box>
        ))}
      </Stack>
    </Box>
  )
}

function ComparisonsSection({
  team,
  report,
  number,
}: {
  team: EvaluationTeam
  report: TeamReport | undefined
  number: string
}) {
  return (
    <Box
      component="section"
      id="scenario-comparisons"
      aria-labelledby="comparisons-title"
      sx={{ scrollMarginTop: 140 }}
    >
      <SectionHeading number={number} title="Results for each future" id="comparisons-title" />
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
          gap: jtSpacing.gap.md,
        }}
      >
        {evaluatedScenarios.map((scenario) => {
          const finding = report?.findings[scenario.slug]
          return (
            <Stack
              key={scenario.slug}
              component={Link}
              to={`/scenarios/${scenario.slug}/results/${team.id}`}
              spacing={jtSpacing.gap.sm}
              sx={{
                ...evaluationCardSx,
                color: 'common.white',
                textDecoration: 'none',
                transition: 'border-color 180ms ease, transform 180ms ease',
                '&:hover, &:focus-visible': {
                  borderColor: 'primary.main',
                  transform: 'translateY(-2px)',
                  outline: 'none',
                },
              }}
            >
              <Stack
                direction="row"
                sx={{ justifyContent: 'space-between', alignItems: 'center', gap: 1 }}
              >
                <Typography variant="cardTitle" component="h3">
                  {scenario.title}
                </Typography>
                {finding && <ScoreBadge score={finding.overall.score} />}
              </Stack>
              <Typography variant="cardBody" sx={{ color: 'base.100' }}>
                {finding?.headline ?? 'Results in preparation.'}
              </Typography>
              <Typography variant="button" sx={{ color: 'primary.main' }}>
                See results →
              </Typography>
            </Stack>
          )
        })}
      </Box>
    </Box>
  )
}

function ChipRow({ items, color }: { items: string[]; color?: 'primary' }) {
  return (
    <Stack direction="row" useFlexGap spacing={jtSpacing.gap.xs} sx={{ flexWrap: 'wrap' }}>
      {items.map((item) => (
        <Chip key={item} label={item} variant="outlined" color={color} />
      ))}
    </Stack>
  )
}

function LabeledText({ label, text }: { label: string; text: string }) {
  return (
    <Typography variant="body2" sx={{ color: 'base.200', mt: 1 }}>
      <Box component="span" sx={{ color: 'primary.main' }}>
        {label}:{' '}
      </Box>
      {text}
    </Typography>
  )
}
