// UI structure of the Future Scenarios results pages, today and as proposed.
// Each section is a block on the page; `to` is where that block sends visitors.
// Section titles come from scenario content where it exists, so they follow edits.
import {
  evaluationTeams,
  outflowResultVariations,
  resultsOverviewSections,
} from '../../features/scenarios/content'
import type { DropdownItem } from '../../ui/navigation'
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
const modelingSections: UISection[] = resultsOverviewSections.map((section) => ({
  label: `${section.number} ${section.title}`,
}))

/** Sections of the pages as they are built today. */
export const currentSections: Record<string, UISection[]> = {
  '/scenarios/results': [
    { label: 'Hero', detail: 'Modeling results and evaluation criteria' },
    {
      label: 'Result family tabs',
      detail: 'Overview · Outflow Variations · Adaptation Scenarios',
      to: '/scenarios/:scenarioSlug/results',
    },
    {
      label: 'How the results are modeled',
      detail: modelingSections.map((s) => s.label).join(' · '),
    },
    { label: 'Evaluation teams and criteria', detail: teamList },
    { label: 'Compare scenario performance', detail: 'Button', to: '/pages/rank-visualization' },
  ],
  '/scenarios/:scenarioSlug/results': [
    { label: 'Hero + result family tabs', to: '/scenarios/results' },
    {
      label: 'Scenario tabs',
      detail: `Adaptation scenarios, or ${outflowResultVariations.map((v) => v.label).join(' / ')}`,
    },
    { label: 'Result summary', detail: 'Sea-level toggle where a +2 ft run exists' },
    {
      label: 'Evaluation teams and criteria',
      detail: 'Each team card: results for this future · how this team evaluated',
      to: '/scenarios/:scenarioSlug/results/:teamId',
    },
  ],
  '/pages/rank-visualization': [
    { label: '1 The overall ranking', detail: 'Equal weights' },
    { label: '2 Changing whose voice counts', detail: 'Weights' },
    { label: '3 Does the weighting change the answer?', detail: 'Sensitivity' },
  ],
}

/** The proposed Future Scenarios menu. */
export const proposedScenarioMenu: DropdownItem[] = [
  { label: 'Choose a Future', href: '/scenarios' },
  { label: 'How we modeled', href: '/scenarios/modeling' },
  { label: 'How we evaluated', href: '/scenarios/evaluation' },
  { label: 'Compare & rank', href: '/scenarios/ranking' },
]

/** Pages the proposal adds or moves. Declaring one in AppRouter turns it into a live node. */
export const proposedPages: ProposedPage[] = [
  {
    path: '/scenarios/modeling',
    label: 'How we modeled',
    today: '/scenarios/results (overview)',
    sections: [
      { label: 'Hero', detail: 'How the futures were modeled' },
      ...modelingSections,
      { label: 'Models and runs', detail: 'Hydrodynamic models, baseline and scenario runs' },
      {
        label: 'Results by scenario',
        detail: 'One card per future',
        to: '/scenarios/:scenarioSlug/results',
      },
    ],
  },
  {
    path: '/scenarios/evaluation',
    label: 'How we evaluated',
    today: '/scenarios/results#evaluation-framework',
    sections: [
      { label: 'Hero', detail: 'Five teams evaluate every future' },
      { label: 'Team cards', detail: teamList, to: '/scenarios/evaluation/:teamId' },
      { label: 'Criteria at a glance', detail: 'Teams × metrics and entities of interest' },
      { label: 'How the criteria combine', to: '/scenarios/ranking' },
    ],
  },
  {
    path: '/scenarios/evaluation/:teamId',
    label: 'Team methodology',
    // Template; the Environmental Justice example below fills it in.
    sections: [
      { label: 'Hero', detail: 'Criterion number, team name, summary' },
      { label: 'Team tabs', detail: 'Switch criterion' },
      { label: '01 What is the criterion?', detail: 'Definitions and classifications' },
      { label: '02 Why does this criterion matter?', detail: 'What participants said' },
      { label: '03 How was this criterion constructed?', detail: 'Engagement and alignment' },
      {
        label: '04 What are the metrics?',
        detail: 'One tab per metric: location, methods, results',
      },
      {
        label: '05 How do the scenarios compare?',
        detail: 'Score table per metric and overall',
        to: '/scenarios/:scenarioSlug/results/:teamId',
      },
      {
        label: '06 Results for each future',
        detail: 'One card per future',
        to: '/scenarios/:scenarioSlug/results/:teamId',
      },
      { label: '07 References' },
    ],
  },
  {
    path: '/scenarios/:scenarioSlug/results/:teamId',
    label: 'Team × scenario',
    sections: [
      { label: 'Hero', detail: 'Breadcrumb · headline verdict' },
      { label: 'Scenario tabs', detail: 'Same team, another future' },
      { label: 'Team tabs', detail: 'Same future, another team' },
      { label: '01 Metric results', detail: 'One card per metric with its score' },
      { label: '02 Where it ranks', detail: 'Overall score against the other futures' },
      { label: '03 What it means for communities', detail: "The team's narrative" },
      { label: 'Same team, another future', to: '/scenarios/evaluation/:teamId' },
    ],
  },
  ejMethodologyExample,
  ejScenarioExample,
  {
    path: '/scenarios/ranking',
    label: 'Compare & rank',
    today: '/pages/rank-visualization',
    sections: [
      {
        label: '1 Overall ranking',
        detail: 'Rows open a scenario',
        to: '/scenarios/:scenarioSlug/results',
      },
      {
        label: '2 Ranking by team',
        detail: 'Cells open team × scenario',
        to: '/scenarios/:scenarioSlug/results/:teamId',
      },
      { label: '3 Whose voice counts', detail: 'Adjustable weights' },
      { label: 'Does weighting change the answer?' },
    ],
  },
]

/** Existing pages whose sections change under the proposal. */
export const proposedSections: Record<string, UISection[]> = {
  '/scenarios/:scenarioSlug/results': (
    [
      { label: 'Hero + scenario tabs' },
      { label: 'Modeled salinity', detail: 'Summary and sea-level toggle' },
      { label: 'How was this modeled?', to: '/scenarios/modeling' },
      {
        label: 'How each team judged this future',
        detail: 'Five team cards',
        to: '/scenarios/:scenarioSlug/results/:teamId',
      },
    ] as UISection[]
  ).map((section) => ({ ...section, planned: true })),
}

/** Routes the proposal replaces; they leave the map while the proposal is shown. */
export const replacedPaths = ['/scenarios/results', '/pages/rank-visualization']
