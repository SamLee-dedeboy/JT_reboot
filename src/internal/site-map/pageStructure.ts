// UI structure of the Future Scenarios pages as built, plus the additions still
// needed to close the visitor workflow. Each section is a block on the page; `to`
// is where that block sends visitors. Section titles come from scenario content
// where it exists, so they follow edits.
import {
  adaptationScenarios,
  evaluationTeams,
  outflowResultVariations,
  resultFamilies,
  resultsOverviewSections,
  tieredOutflowsScenario,
} from '../../features/scenarios/content'
import { ejMethodologyExample, ejScenarioExample } from './ejExample'

export interface UISection {
  label: string
  detail?: string
  /** Route (or route pattern) this section links to. */
  to?: string
  /** A section the proposal adds to an existing page. */
  planned?: boolean
  /** Sub-sections, e.g. a metric's location, methods, and results. */
  children?: UISection[]
}

export interface ProposedPage {
  path: string
  label: string
  /** Where this content lives today, if it moves rather than being new. */
  today?: string
  /** Set on a worked example: the template page (route pattern) it fills in. */
  exampleOf?: string
  sections: UISection[]
}

const teamList = evaluationTeams.map((team) => team.label).join(' · ')
const familyList = resultFamilies.map((family) => family.label).join(' · ')
const adaptationList = adaptationScenarios.map((scenario) => scenario.title).join(' · ')

/** Sections of the pages as they are built today. */
export const currentSections: Record<string, UISection[]> = {
  '/scenarios': [
    { label: 'Hero', detail: 'Choose a future' },
    { label: 'Understand Current Operations', detail: 'Baseline: how the Delta runs today' },
    {
      label: 'Explore Outflow Variations',
      detail: tieredOutflowsScenario.title,
      to: '/scenarios/:scenarioSlug',
    },
    {
      label: 'Explore Adaptation Scenarios',
      detail: adaptationList,
      to: '/scenarios/:scenarioSlug',
    },
    {
      label: 'Baseline links',
      children: [
        { label: 'Key parameters', to: '/scenarios/key-parameters' },
        { label: 'Background context', to: '/scenarios/background-context' },
      ],
    },
    {
      label: "What's next?",
      children: [
        { label: '01 Modeling', to: '/scenarios/modeling' },
        { label: '02 Evaluation', to: '/scenarios/evaluation' },
        { label: '03 Scenario ranking', to: '/scenarios/ranking' },
      ],
    },
  ],
  '/scenarios/:scenarioSlug': [
    { label: 'Hero + scenario tabs', detail: 'Back to Choose a Future', to: '/scenarios' },
    {
      label: 'Story chapters',
      detail: 'Adaptation: key benefits, motivation, design approach, then supporting strategy',
    },
    {
      label: 'Explore modeling results and evaluation criteria',
      detail: 'Button',
      to: '/scenarios/:scenarioSlug/results',
    },
  ],
  '/scenarios/modeling': [
    {
      label: 'Hero + result family tabs',
      detail: familyList,
      to: '/scenarios/:scenarioSlug/results',
    },
    {
      label: 'How are scenarios modeled?',
      children: resultsOverviewSections.map((section) => ({
        label: `${section.number} ${section.title}`,
      })),
    },
    {
      label: 'Where does salinity change?',
      detail: 'Pick a future: saltier and fresher places, then the timeline',
      to: '/pages/scenario-explorer',
    },
    {
      label: 'Next: how are scenarios evaluated?',
      children: [
        { label: 'How scenarios are evaluated', to: '/scenarios/evaluation' },
        { label: 'Read more in detail', to: '/pages/regional-summary' },
      ],
    },
  ],
  '/scenarios/evaluation': [
    { label: 'Hero', detail: 'How scenarios are evaluated' },
    {
      label: 'How are scenarios evaluated?',
      detail: 'One block per team: criterion, why it matters, components',
      children: evaluationTeams.map((team) => ({
        label: team.label,
        detail: 'More about how this team evaluated',
        to: '/scenarios/evaluation/:teamId',
      })),
    },
    {
      label: 'Scenario results',
      detail: 'Each scenario across every criterion',
      children: [
        { label: 'The three families at a glance', to: '/scenarios/evaluation/families' },
        { label: 'Outflow variation results', to: '/scenarios/:scenarioSlug/results' },
        { label: 'Adaptation scenario results', to: '/scenarios/:scenarioSlug/results' },
      ],
    },
    {
      label: 'How are scenarios compared?',
      children: [{ label: 'Scenario ranking', to: '/scenarios/ranking' }],
    },
  ],
  '/scenarios/:scenarioSlug/results': [
    { label: 'Hero + result family tabs', detail: familyList, to: '/scenarios/modeling' },
    {
      label: 'Scenario tabs',
      detail: `Adaptation scenarios, or ${outflowResultVariations.map((v) => v.label).join(' / ')}`,
    },
    { label: 'Result summary', detail: 'Sea-level toggle where a +2 ft run exists' },
    {
      label: 'Modeled salinity',
      detail: 'Regional summary map and wet/dry years',
      to: '/pages/scenario-explorer',
    },
    {
      label: 'Evaluation criteria',
      detail: 'One tile per team with its overall score',
      children: [
        { label: 'Selected team', detail: 'Headline, interpretation, metric scores' },
        { label: 'How this team evaluates', to: '/scenarios/evaluation/:teamId' },
      ],
    },
  ],
  '/scenarios/evaluation/families': [
    { label: 'Hero', detail: 'The three families at a glance' },
    {
      label: '01 Outflow variations',
      detail: 'Environmental justice finding; others not assessed',
      to: '/scenarios/:scenarioSlug/results',
    },
    {
      label: '02 Adaptation scenarios',
      detail: 'Score grid: five scenarios by five criteria',
      to: '/scenarios/ranking',
    },
    {
      label: '03 With two feet of sea-level rise',
      detail: 'Scenarios with +2 ft runs; criteria still reporting',
      to: '/scenarios/:scenarioSlug/results',
    },
  ],
  '/scenarios/evaluation/:teamId': [
    {
      label: 'Hero',
      detail: 'Criterion summary · Back to evaluation',
      to: '/scenarios/evaluation',
    },
    { label: 'Team tabs', detail: teamList, to: '/scenarios/evaluation/:teamId' },
    { label: 'What is this criterion?' },
    { label: 'Why does it matter?', detail: 'Key statistic and interview quote' },
    { label: 'Which regions does it cover?', detail: 'Only for teams with mapped regions' },
    { label: 'What are its components?', detail: 'One tab per component' },
    { label: 'How was it constructed?', detail: 'Key numbers, then the steps in order' },
    { label: 'References' },
  ],
  '/scenarios/:scenarioSlug/results/:teamId': [
    { label: 'Hero', detail: 'Breadcrumb · headline verdict', to: '/scenarios/:scenarioSlug' },
    { label: 'Scenario tabs', detail: 'Same team, another future' },
    { label: 'Team tabs', detail: 'Same future, another team' },
    { label: '01 Metric results', detail: 'One card per metric with its score' },
    { label: '02 Where it ranks', detail: 'Overall score against the other futures' },
    { label: '03 What it means for communities', detail: "The team's narrative" },
    {
      label: 'Next steps',
      children: [
        { label: 'Same team, another future', to: '/scenarios/evaluation/:teamId' },
        { label: 'How this team evaluated', to: '/scenarios/evaluation/:teamId' },
        { label: 'Back to the scenario results', to: '/scenarios/:scenarioSlug/results' },
      ],
    },
  ],
  '/scenarios/ranking': [
    { label: 'Hero', detail: 'Performance and ranking' },
    {
      label: 'View tabs',
      detail: 'By scenario · By criterion',
      to: '/scenarios/ranking/by-criterion',
    },
    { label: '01 The overall ranking', detail: 'Criteria equally weighted; sorted by rank' },
    { label: '02 Change what matters most', detail: 'Interactive weighted matrix' },
  ],
  '/scenarios/ranking/:view': [
    { label: 'Hero', detail: 'Performance and ranking' },
    { label: 'View tabs', detail: 'By scenario · By criterion', to: '/scenarios/ranking' },
    { label: 'Criterion tabs', detail: teamList },
    { label: 'Breakout table controls', detail: 'Scenarios · place · period · measures' },
    { label: 'Breakout table or map', detail: 'Published values for the selected criterion' },
  ],
  '/pages/rank-visualization': [
    { label: '1 The overall ranking', detail: 'Equal weights' },
    { label: '2 Changing whose voice counts', detail: 'Weights' },
    { label: '3 Does the weighting change the answer?', detail: 'Sensitivity' },
  ],
}

/** Worked examples: one team's live pages filled in with its content. */
export const proposedPages: ProposedPage[] = [ejMethodologyExample, ejScenarioExample]

const planned = (sections: UISection[]) =>
  sections.map((section) => ({ ...section, planned: true }))

/**
 * Sections the workflow still needs, appended to the live ones. Each closes a
 * gap in the journey: today the team × scenario page is only reachable from
 * itself, and nothing leads from a team's results on to the overall ranking.
 */
export const proposedSections: Record<string, UISection[]> = {
  '/scenarios/:scenarioSlug/results': [
    ...currentSections['/scenarios/:scenarioSlug/results'],
    ...planned([
      {
        label: 'Results for this team',
        detail: 'Selected team panel: open its full results for this future',
        to: '/scenarios/:scenarioSlug/results/:teamId',
      },
    ]),
  ],
  '/scenarios/evaluation/:teamId': [
    ...currentSections['/scenarios/evaluation/:teamId'].slice(0, -1),
    ...planned([
      {
        label: 'Scenario comparisons',
        detail:
          'One card per future; the team × scenario page already links to #scenario-comparisons',
        to: '/scenarios/:scenarioSlug/results/:teamId',
      },
    ]),
    ...currentSections['/scenarios/evaluation/:teamId'].slice(-1),
  ],
  '/scenarios/:scenarioSlug/results/:teamId': [
    ...currentSections['/scenarios/:scenarioSlug/results/:teamId'],
    ...planned([
      { label: 'Compare every future', detail: 'From “Where it ranks”', to: '/scenarios/ranking' },
    ]),
  ],
}
