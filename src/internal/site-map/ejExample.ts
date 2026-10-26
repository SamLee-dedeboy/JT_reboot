// Worked example of the evaluation pages for the Environmental Justice &
// Vulnerable Communities team. Sections are read from the same content the live
// pages render (`criterionStories`, `criterionRegions`, `teamReports`), so the
// site map follows it.
import {
  criterionRegions,
  criterionStories,
  evaluationTeams,
  teamReports,
} from '../../features/scenarios/content'
import type { ProposedPage } from './pageStructure'

const team = evaluationTeams.find((item) => item.id === 'environmental-justice')!
const report = teamReports[team.id]!
const story = criterionStories[team.id]
const regions = criterionRegions[team.id]
const shortName = team.label.split(' & ')[0]
const exampleSlug = 'eco-machine'
const methodologyPath = `/scenarios/evaluation/${team.id}`
const scenarioPath = `/scenarios/${exampleSlug}/results/${team.id}`
const finding = report.findings[exampleSlug]

const formatScore = (score: number | null) =>
  score === null ? 'pending' : score > 0 ? `+${score}` : `${score}`

export const ejMethodologyExample: ProposedPage = {
  path: methodologyPath,
  label: `Example: ${shortName}`,
  exampleOf: '/scenarios/evaluation/:teamId',
  sections: [
    { label: 'Hero', detail: `Criterion ${team.number} · ${story.brief.what}` },
    { label: 'Team tabs', detail: 'Switch criterion', to: '/scenarios/evaluation/:teamId' },
    { label: 'What is this criterion?', detail: `${story.what.length} paragraphs` },
    {
      label: 'Why does it matter?',
      children: [
        ...(story.why.stat ? [{ label: story.why.stat.value, detail: story.why.stat.label }] : []),
        ...(story.why.quote ? [{ label: 'Interview quote', detail: story.why.quote }] : []),
      ],
    },
    {
      label: 'How was it constructed?',
      children: story.construction.steps.map((step) => ({ label: step.title, detail: step.body })),
    },
    ...(regions
      ? [
          {
            label: 'Which regions does it cover?',
            children: regions.regions.map((region) => ({
              label: region.name,
              detail: region.note,
            })),
          },
        ]
      : []),
    {
      label: 'What are its components?',
      children: story.components.items.map((item) => ({ label: item.name, detail: item.summary })),
    },
    { label: 'References', detail: story.source },
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
    { label: 'How this team evaluated', to: methodologyPath },
    { label: 'Back to Eco Machine results', to: '/scenarios/:scenarioSlug/results' },
  ],
}
