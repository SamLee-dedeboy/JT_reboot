// The Future Scenarios user journey: from choosing a future down to one
// evaluation team's results for one scenario. Steps come from scenario content
// and the evaluation teams; whether each step exists and how a visitor moves
// on is checked against the scanned routes and links in `virtual:site-map`.
import type { SiteMapLink, SiteMapRoute } from 'virtual:site-map'
import {
  adaptationScenarios,
  evaluationTeams,
  outflowResultVariations,
  slrScenarioSlugs,
  tieredOutflowsScenario,
} from '../../features/scenarios/content'
import { matchRoute } from './siteMapModel'

export type JourneyScenario = (typeof journeyScenarios)[number]
export type JourneyTeam = (typeof evaluationTeams)[number]

export const journeyScenarios = [...adaptationScenarios, tieredOutflowsScenario]

/** Routes these planned pages would use once built. Adding them to AppRouter marks them live. */
export const proposedRoutes = {
  modeling: '/scenarios/modeling',
  evaluation: '/scenarios/evaluation',
  ranking: '/scenarios/ranking',
  methodology: (teamId: string) => `/scenarios/evaluation/${teamId}`,
  teamResults: (slug: string, teamId: string) => `/scenarios/${slug}/results/${teamId}`,
}

export type StepStatus = 'live' | 'section' | 'planned'

export interface JourneyBranch {
  label: string
  to: string
  note?: string
}

export interface OutlineItem {
  title: string
  detail?: string
  children?: OutlineItem[]
  /** Highlights the part of the outline this journey lands on. */
  focus?: boolean
}

export interface JourneyStep {
  id: string
  title: string
  question: string
  route: string
  status: StepStatus
  sees: string[]
  branches: JourneyBranch[]
  outline?: OutlineItem[]
  /** Evaluation teams, for the step that offers the choice. */
  teamChoice?: boolean
}

export interface JourneyTransition {
  action: string
  kind: 'link' | 'scroll' | 'missing'
  evidence: SiteMapLink[]
  suggestion?: string
}

const isOutflow = (scenario: JourneyScenario) => scenario.slug === tieredOutflowsScenario.slug
const pathOf = (target: string) => target.split(/[?#]/)[0]

/** Whether AppRouter declares this exact route pattern (parameter names ignored). */
export function routeDeclared(pattern: string, routes: SiteMapRoute[]) {
  const normalize = (path: string) => path.replace(/:\w+/g, ':')
  return routes.some((route) => normalize(route.path) === normalize(pattern))
}

export function routeExists(target: string, routes: SiteMapRoute[]) {
  return matchRoute(target, routes) !== null
}

// Links from one route to a target: hard-coded links to exactly that target, or
// links built at runtime (e.g. `/scenarios/${slug}/results`) that fit its route.
export function linksBetween(
  fromPath: string,
  target: string,
  routes: SiteMapRoute[],
  links: SiteMapLink[],
) {
  const fromRoute = matchRoute(fromPath, routes)?.path
  const toRoute = matchRoute(target, routes)?.path
  if (!fromRoute || !toRoute) return []
  const outgoing = links.filter((link) => link.from === fromRoute)
  return outgoing.filter((link) =>
    link.dynamic
      ? matchRoute(link.to, routes)?.path === toRoute
      : pathOf(link.to) === pathOf(target),
  )
}

/**
 * How a team's methodology page is organised, following the structure of the
 * Environmental Justice criterion report ("The Story Behind the Criterion").
 * The selected team's metrics fill the metric sections.
 */
function methodologyOutline(team: JourneyTeam): OutlineItem[] {
  return [
    {
      title: 'What is the criterion?',
      detail: 'Definitions and the classifications the team uses',
    },
    {
      title: 'Why does this criterion matter?',
      detail: 'What participants and interviewees said about it',
    },
    { title: 'How was this criterion constructed?', detail: 'Background and alignment' },
    {
      title: 'What are the components of this criterion?',
      detail: 'Final metrics, each with its own methods and results',
      children: team.metrics.map((metric) => ({
        title: `Metric: ${metric.name}`,
        detail: metric.measurement,
        children: [
          { title: 'Location of measurement' },
          { title: 'Methods' },
          { title: 'Results', detail: 'Tiered outflow analysis and adaptation scenario analysis' },
        ],
      })),
    },
    {
      title: 'Comparative scenario performance ranking',
      detail: 'Per metric, then overall',
    },
    {
      title: 'Scenario comparisons',
      detail: 'One section per future; this is where a visitor goes deeper on one scenario',
      focus: true,
    },
    { title: 'References and appendix', detail: 'Stakeholder priorities the criterion draws on' },
  ]
}

function teamResultsOutline(team: JourneyTeam, scenario: JourneyScenario): OutlineItem[] {
  const runs = isOutflow(scenario)
    ? outflowResultVariations.map((variation) => variation.label)
    : ['Total run', 'Seasonality: wet vs. dry']
  return [
    ...team.metrics.map((metric) => ({
      title: metric.name,
      detail: `${scenario.title} compared with baseline`,
      children: runs.map((run) => ({ title: run })),
    })),
    {
      title: `Where ${scenario.title} ranks`,
      detail: isOutflow(scenario)
        ? 'Against the other outflow variation'
        : 'Against the other adaptation scenarios, per metric and overall',
    },
    {
      title: `${scenario.title} in context`,
      detail: `The team's narrative comparison for this scenario`,
      focus: true,
    },
  ]
}

export function buildJourney(
  scenario: JourneyScenario,
  team: JourneyTeam,
  routes: SiteMapRoute[],
  links: SiteMapLink[],
) {
  const outflow = isOutflow(scenario)
  const scenarioPath = `/scenarios/${scenario.slug}`
  const resultsPath = `${scenarioPath}/results`
  const methodologyPath = proposedRoutes.methodology(team.id)
  const teamResultsPath = proposedRoutes.teamResults(scenario.slug, team.id)
  const methodologyLive = routeDeclared(proposedRoutes.methodology(':team'), routes)
  const teamResultsLive = routeDeclared(proposedRoutes.teamResults(':slug', ':team'), routes)
  const slrAvailable = (slrScenarioSlugs as readonly string[]).includes(scenario.slug)

  const steps: JourneyStep[] = [
    {
      id: 'choose',
      title: 'Choose a future',
      question: 'What futures could the Delta face?',
      route: '/scenarios',
      status: 'live',
      sees: journeyScenarios.map((item) => item.title),
      branches: [
        { label: 'Background context', to: '/scenarios/background-context' },
        { label: 'Key parameters', to: '/scenarios/key-parameters' },
        { label: 'Results overview', to: '/scenarios/results' },
      ],
    },
    {
      id: 'scenario',
      title: scenario.title,
      question: 'What would this future change, and where?',
      route: scenarioPath,
      status: routeExists(scenarioPath, routes) ? 'live' : 'planned',
      sees: scenario.story.map((chapter) => chapter.title),
      branches: [{ label: 'Other scenarios', to: '/scenarios', note: 'Scenario tabs' }],
    },
    {
      id: 'results',
      title: 'Modeling results',
      question: 'How does modeled salinity differ from baseline?',
      route: resultsPath,
      status: routeExists(resultsPath, routes) ? 'live' : 'planned',
      sees: outflow
        ? outflowResultVariations.map((variation) => `Tab: ${variation.label}`)
        : [
            `Result summary for ${scenario.title}`,
            slrAvailable
              ? 'Sea-level toggle: present day or +2 ft'
              : 'Present-day conditions only (no +2 ft run yet)',
            'Open modeling explorer',
          ],
      branches: [
        ...(slrAvailable
          ? [{ label: '+2 ft sea-level rise', to: `${resultsPath}?seaLevelRise=true` }]
          : []),
        {
          label: 'Modeling explorer',
          to: outflow ? '/pages/scenario-explorer' : '/pages/scenario-explorer/internal',
        },
      ],
    },
    {
      id: 'criteria',
      title: 'Evaluation criteria',
      question: 'Who judged this future, and by what measures?',
      route: `${resultsPath}#evaluation-framework`,
      status: 'section',
      sees: [`${team.label}: ${team.summary}`],
      teamChoice: true,
      branches: [{ label: 'Performance & ranking', to: '/pages/rank-visualization' }],
    },
    {
      id: 'methodology',
      title: `${team.label} methodology`,
      question: 'How did this team build its criterion?',
      route: methodologyPath,
      status: methodologyLive ? 'live' : 'planned',
      sees: [],
      outline: methodologyOutline(team),
      branches: [],
    },
    {
      id: 'team-results',
      title: `${team.label} results for ${scenario.title}`,
      question: 'How does this future perform on this criterion?',
      route: teamResultsPath,
      status: teamResultsLive ? 'live' : 'planned',
      sees: [],
      outline: teamResultsOutline(team, scenario),
      branches: [
        { label: 'Overall performance & ranking', to: '/pages/rank-visualization' },
        { label: 'Same team, another scenario', to: methodologyPath, note: 'Scenario comparisons' },
      ],
    },
  ]

  const linkTransition = (
    from: string,
    to: string,
    action: string,
    suggestion: string,
  ): JourneyTransition => {
    const evidence = linksBetween(from, to, routes, links)
    return evidence.length > 0
      ? { action, kind: 'link', evidence }
      : { action, kind: 'missing', evidence, suggestion }
  }

  const transitions: JourneyTransition[] = [
    linkTransition(
      '/scenarios',
      scenarioPath,
      `Select the ${scenario.title} card`,
      `Link the ${scenario.title} card on the landing page to ${scenarioPath}.`,
    ),
    linkTransition(
      scenarioPath,
      resultsPath,
      'Continue to the modeling results',
      `Add a results link at the end of the ${scenario.title} story.`,
    ),
    {
      action: 'Scroll to “Evaluation teams and criteria” on the same page',
      kind: 'scroll',
      evidence: [],
    },
    methodologyLive
      ? linkTransition(
          resultsPath,
          methodologyPath,
          `Open the ${team.label} methodology`,
          'Link each team card in EvaluationFramework to its methodology page.',
        )
      : {
          action: `Open the ${team.label} methodology`,
          kind: 'missing',
          evidence: [],
          suggestion: `Build ${methodologyPath} and link each team card in EvaluationFramework to it.`,
        },
    teamResultsLive && methodologyLive
      ? linkTransition(
          methodologyPath,
          teamResultsPath,
          `Pick ${scenario.title} under “Scenario comparisons”`,
          `Link each scenario comparison to ${teamResultsPath}.`,
        )
      : {
          action: `Pick ${scenario.title} under “Scenario comparisons”`,
          kind: 'missing',
          evidence: [],
          suggestion: `Build ${proposedRoutes.teamResults(':scenarioSlug', ':teamId')} and link each scenario comparison to it. The modeling results page could link here too.`,
        },
  ]

  return { steps, transitions }
}
