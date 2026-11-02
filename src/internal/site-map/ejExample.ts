// Worked example of the evaluation pages for the Environmental Justice &
// Vulnerable Communities team. Sections are read from the same content the live
// pages render (`criterionStories`, `criterionRegions`), so the site map follows it.
import {
  criterionRegions,
  criterionStories,
  evaluationTeams,
} from '../../features/scenarios/content'
import type { ProposedPage } from './pageStructure'

const team = evaluationTeams.find((item) => item.id === 'environmental-justice')!
const story = criterionStories[team.id]
const regions = criterionRegions[team.id]
const shortName = team.label.split(' & ')[0]
const methodologyPath = `/scenarios/evaluation/${team.id}`

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
        ...(story.why.stats ?? []).map((stat) => ({ label: stat.value, detail: stat.label })),
        ...(story.why.quote ? [{ label: 'Interview quote', detail: story.why.quote }] : []),
      ],
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
    {
      label: 'How was it constructed?',
      children: story.construction.steps.map((step) => ({ label: step.title, detail: step.body })),
    },
    { label: 'References', detail: story.source },
  ],
}
