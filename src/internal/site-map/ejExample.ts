// Worked example of the evaluation pages for the Environmental Justice &
// Vulnerable Communities team. Sections are read from the same report content
// the live pages render (`teamReports`), so the site map follows that content.
import {
  adaptationScenarios,
  evaluationTeams,
  teamReports,
  tieredOutflowsScenario,
} from '../../features/scenarios/content'
import type { ProposedPage, UISection } from './pageStructure'

const team = evaluationTeams.find((item) => item.id === 'environmental-justice')!
const report = teamReports[team.id]!
const shortName = team.label.split(' & ')[0]
const exampleSlug = 'eco-machine'
const methodologyPath = `/scenarios/evaluation/${team.id}`
const scenarioPath = `/scenarios/${exampleSlug}/results/${team.id}`
const finding = report.findings[exampleSlug]
const evaluated = [...adaptationScenarios, tieredOutflowsScenario]

const formatScore = (score: number | null) =>
  score === null ? 'pending' : score > 0 ? `+${score}` : `${score}`

const metricTabs: UISection[] = report.metrics.map((metric) => ({
  label: `Tab: ${metric.name}`,
  children: [
    { label: 'Location of measurement', detail: metric.location },
    { label: 'Methods', detail: metric.methods.join(' ') },
    {
      label: 'Results',
      children: metric.results.map((result) => ({ label: result.title, detail: result.body })),
    },
  ],
}))

export const ejMethodologyExample: ProposedPage = {
  path: methodologyPath,
  label: `Example: ${shortName}`,
  exampleOf: '/scenarios/evaluation/:teamId',
  sections: [
    { label: 'Hero', detail: `Criterion ${team.number} · ${team.summary}` },
    { label: 'Team tabs', detail: 'Switch criterion', to: '/scenarios/evaluation/:teamId' },
    {
      label: '01 What is the criterion?',
      children: [
        ...report.definitions.map((definition) => ({
          label: definition.term,
          detail: definition.source,
        })),
        {
          label: 'Vulnerability classifications',
          detail: `${report.classifications.levels.join(' · ')} · ${report.classifications.indicators.length} indicators`,
        },
      ],
    },
    {
      label: '02 Why does this criterion matter?',
      children: [
        { label: report.whyItMatters.stat.value, detail: report.whyItMatters.stat.label },
        { label: 'Interview quotes', detail: `${report.whyItMatters.quotes.length} quotes` },
      ],
    },
    {
      label: '03 How was this criterion constructed?',
      children: [
        { label: 'Engagement timeline', detail: `${report.construction.timeline.length} steps` },
        {
          label: 'Community priorities',
          detail: report.construction.priorities.map((item) => item.priority).join(' · '),
        },
      ],
    },
    { label: '04 What are the metrics?', detail: 'One tab per metric', children: metricTabs },
    {
      label: '05 How do the scenarios compare?',
      detail: 'Score table; rows open team × scenario',
      to: '/scenarios/:scenarioSlug/results/:teamId',
    },
    {
      label: '06 Results for each future',
      detail: 'One card per future',
      children: evaluated.map((scenario) => ({
        label: scenario.title,
        detail: report.findings[scenario.slug]?.headline,
        to: scenario.slug === exampleSlug ? scenarioPath : undefined,
      })),
    },
    { label: '07 References', detail: report.source },
  ],
}

export const ejScenarioExample: ProposedPage = {
  path: scenarioPath,
  label: `Example: ${shortName} × Eco Machine`,
  exampleOf: '/scenarios/:scenarioSlug/results/:teamId',
  sections: [
    { label: 'Hero', detail: `Breadcrumb · ${finding.headline}` },
    { label: 'Scenario tabs', detail: 'Same team, another future' },
    { label: 'Team tabs', detail: 'Same future, another team' },
    {
      label: '01 Metric results',
      children: finding.metrics.map((metric) => ({
        label: `${metric.name} (${formatScore(metric.score)})`,
        detail: metric.finding,
      })),
    },
    {
      label: '02 Where it ranks',
      detail: `${formatScore(finding.overall.score)} · ${finding.overall.summary}`,
    },
    { label: '03 What it means for communities', detail: finding.narrative },
    { label: 'Same team, another future', to: methodologyPath },
    { label: 'Back to Eco Machine results', to: '/scenarios/:scenarioSlug/results' },
  ],
}
