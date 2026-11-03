// UI structure of the Future Scenarios pages as built, plus the additions still
// needed to close the visitor workflow. Each section is a block on the page; `to`
// is where that block sends visitors. Section titles come from scenario content
// where it exists, so they follow edits.
import {
  adaptationScenarios,
  evaluationTeams,
  tieredOutflowsScenario,
} from '../../features/scenarios/content'
import { ejMethodologyExample } from './ejExample'

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
      label: 'View Modeling results',
      detail: 'Button',
      to: '/scenarios/modeling',
    },
  ],
  '/scenarios/modeling': [
    { label: 'Hero' },
    {
      label: 'How are scenarios modeled?',
      children: [
        { label: 'Three baselines for Business as Usual' },
        {
          label: 'Outflow variations',
          detail: 'Stations, simulation time, what is modeled, how each future is built',
        },
        {
          label: 'Adaptation scenarios',
          detail: 'Stations, simulation time, what is modeled, how each future is built',
        },
      ],
    },
    {
      label: 'Where does salinity change?',
      detail: 'Pick a future: saltier and fresher places, then the timeline',
      to: '/pages/scenario-explorer',
    },
    {
      label: 'How are scenarios evaluated?',
      children: [
        { label: 'How scenarios are evaluated', to: '/scenarios/evaluation' },
        { label: 'Explore the regional summary', to: '/pages/regional-summary' },
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
      children: [{ label: 'The three families at a glance', to: '/scenarios/evaluation/families' }],
    },
    {
      label: 'How are scenarios compared?',
      children: [{ label: 'Scenario ranking', to: '/scenarios/ranking' }],
    },
  ],
  '/scenarios/evaluation/families': [
    { label: 'Hero', detail: 'The three families at a glance' },
    {
      label: '01 Outflow variations',
      detail: 'Environmental justice finding; others not assessed',
      to: '/scenarios/modeling',
    },
    {
      label: '02 Adaptation scenarios',
      detail: 'Score grid: five scenarios by five criteria',
      to: '/scenarios/ranking',
    },
    {
      label: '03 With two feet of sea-level rise',
      detail: 'Scenarios with +2 ft runs; criteria still reporting',
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
  '/scenarios/ranking': [
    { label: 'Hero', detail: 'Performance and ranking' },
    {
      label: 'View choices',
      detail: 'By scenario · By criterion',
      to: '/scenarios/ranking/by-criterion',
    },
    {
      label: 'What you’re looking at',
      detail: 'How the five criteria are scored · Read the methodology',
      to: '/scenarios/evaluation',
    },
    { label: 'The overall ranking', detail: 'Criteria equally weighted; sorted by rank' },
    { label: 'A note on changing the weights', detail: 'Three points before the weighting tool' },
    { label: 'Change what matters most', detail: 'Priority buttons beside the linked rankings' },
  ],
  '/scenarios/ranking/:view': [
    { label: 'Hero', detail: 'Shared with By scenario: view choices' },
    { label: 'View choices', detail: 'By scenario · By criterion', to: '/scenarios/ranking' },
    { label: 'Criterion tabs', detail: teamList },
    {
      label: 'Team takeaway',
      detail: 'The team’s points · caveats and clarifications beside them',
    },
    { label: 'How the score is built', detail: 'The heading over the controls and table' },
    {
      label: 'Breakout controls',
      detail: 'Conditions · scenarios in two groups · place menu with study area · time period',
    },
    {
      label: 'Breakout table or map',
      detail: 'Scores, then the measures behind each, as numbers or bars',
    },
  ],
  '/pages/rank-visualization': [
    { label: '1 The overall ranking', detail: 'Equal weights' },
    { label: '2 Changing whose voice counts', detail: 'Weights' },
    { label: '3 Does the weighting change the answer?', detail: 'Sensitivity' },
  ],
}

/** Worked examples: one team's live pages filled in with its content. */
export const proposedPages: ProposedPage[] = [ejMethodologyExample]

/** Sections the workflow still needs, appended to the live ones. None at the moment. */
export const proposedSections: Record<string, UISection[]> = {}
