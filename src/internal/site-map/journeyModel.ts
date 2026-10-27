// The Future Scenarios user workflow: from the home page, through one future's
// story and results, into one evaluation team's methodology and its results for
// that future, and on to the overall ranking. Steps come from scenario content,
// the evaluation teams, and their reports; whether each step exists and how a
// visitor moves on is checked against the scanned routes and links in
// `virtual:site-map`.
import type { SiteMapLink, SiteMapRoute } from 'virtual:site-map'
import {
  adaptationScenarios,
  criterionRegions,
  criterionStories,
  evaluationTeams,
  outflowResultVariations,
  slrScenarioSlugs,
  teamReports,
  tieredOutflowsScenario,
  storyInReadingOrder,
} from '../../features/scenarios/content'
import { methodologyPath, teamResultsPath } from '../../features/scenarios/evaluation/paths'
import { matchRoute } from './siteMapModel'

export type JourneyScenario = (typeof journeyScenarios)[number]
export type JourneyTeam = (typeof evaluationTeams)[number]

export const journeyScenarios = [...adaptationScenarios, tieredOutflowsScenario]

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
  /** A part of the page the workflow needs that is not built yet. */
  planned?: boolean
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

/** The team's methodology page, as TeamMethodologyPage renders it for this team. */
function methodologyOutline(team: JourneyTeam): OutlineItem[] {
  const story = criterionStories[team.id]
  const regions = criterionRegions[team.id]
  return [
    { title: 'What is this criterion?', detail: story.brief.what },
    {
      title: 'Why does it matter?',
      detail: story.why.stats?.map((stat) => `${stat.value} ${stat.label}`).join(' · '),
    },
    ...(regions
      ? [
          {
            title: 'Which regions does it cover?',
            detail: regions.regions.map((region) => region.name).join(' · '),
          },
        ]
      : []),
    {
      title: 'What are its components?',
      detail: 'One tab per component',
      children: story.components.items.map((item) => ({ title: item.name })),
    },
    {
      title: 'How was it constructed?',
      children: story.construction.steps.map((step) => ({ title: step.title })),
    },
    {
      title: 'Scenario comparisons',
      detail: 'One card per future, each opening this team’s results for it',
      focus: true,
      planned: true,
    },
    { title: 'References' },
  ]
}

/** The team × scenario page, filled in from the team's report where it has one. */
function teamResultsOutline(team: JourneyTeam, scenario: JourneyScenario): OutlineItem[] {
  const finding = teamReports[team.id]?.findings[scenario.slug]
  return [
    {
      title: 'Metric results',
      detail: finding ? undefined : 'Scores for this future are still being finalized',
      children: finding?.metrics.map((metric) => ({
        title: metric.name,
        detail: metric.score === null ? 'Not scored' : `Score ${metric.score}`,
      })),
    },
    {
      title: 'Where it ranks',
      detail: finding?.overall.summary,
      focus: true,
    },
    {
      title: 'What it means for communities',
      detail: finding?.narrative ? undefined : 'No team narrative yet',
    },
    {
      title: 'Compare every future',
      detail: 'A link from “Where it ranks” to the overall ranking',
      planned: true,
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
  const teamMethodologyPath = methodologyPath(team.id)
  const teamScenarioPath = teamResultsPath(scenario.slug, team.id)
  const slrAvailable = (slrScenarioSlugs as readonly string[]).includes(scenario.slug)
  const finding = teamReports[team.id]?.findings[scenario.slug]
  const status = (path: string): StepStatus => (routeExists(path, routes) ? 'live' : 'planned')

  const steps: JourneyStep[] = [
    {
      id: 'home',
      title: 'Home',
      question: 'What is this project, and what could the Delta’s future look like?',
      route: '/',
      status: status('/'),
      sees: ['Map hero', 'What if… editorial panel', 'Futures panels'],
      branches: [{ label: 'Co-Design Dashboard', to: '/pages/co-design-dashboard' }],
    },
    {
      id: 'choose',
      title: 'Choose a future',
      question: 'What futures could the Delta face?',
      route: '/scenarios',
      status: status('/scenarios'),
      sees: [
        'Understand Current Operations',
        `Explore Outflow Variations: ${tieredOutflowsScenario.title}`,
        `Explore Adaptation Scenarios: ${adaptationScenarios.map((item) => item.title).join(', ')}`,
        "What's next? Modeling, evaluation, ranking",
      ],
      branches: [
        { label: 'Key parameters', to: '/scenarios/key-parameters' },
        { label: 'Background context', to: '/scenarios/background-context' },
        { label: 'Modeling', to: '/scenarios/modeling' },
        { label: 'Evaluation', to: '/scenarios/evaluation' },
        { label: 'Performance & ranking', to: '/scenarios/ranking' },
      ],
    },
    {
      id: 'scenario',
      title: scenario.title,
      question: 'What would this future change, and where?',
      route: scenarioPath,
      status: status(scenarioPath),
      sees: storyInReadingOrder(scenario).map(({ chapter }) => chapter.title),
      branches: [{ label: 'Other scenarios', to: '/scenarios', note: 'Scenario tabs' }],
    },
    {
      id: 'results',
      title: 'Modeling results',
      question: 'How does modeled salinity differ from baseline?',
      route: resultsPath,
      status: status(resultsPath),
      sees: outflow
        ? [
            ...outflowResultVariations.map((variation) => `Tab: ${variation.label}`),
            'Regional salinity summary',
          ]
        : [
            `Result summary for ${scenario.title}`,
            slrAvailable
              ? 'Sea-level toggle: present day or +2 ft'
              : 'Present-day conditions only (no +2 ft run yet)',
            'Regional salinity summary with wet and dry years',
          ],
      branches: [
        { label: 'Modeling overview', to: '/scenarios/modeling', note: 'Family tabs' },
        ...(slrAvailable
          ? [{ label: '+2 ft sea-level rise', to: `${resultsPath}?seaLevelRise=true` }]
          : []),
        { label: 'Scenario explorer', to: '/pages/scenario-explorer' },
      ],
    },
    {
      id: 'criteria',
      title: 'Evaluation criteria',
      question: 'Who judged this future, and how did it score?',
      route: `${resultsPath}#criteria-results-title`,
      status: 'section',
      sees: [
        'One tile per team with its overall score',
        finding
          ? `${team.label}: ${finding.headline}`
          : `${team.label}: scores still being finalized`,
      ],
      teamChoice: true,
      branches: [
        {
          label: 'How are scenarios evaluated?',
          to: '/scenarios/evaluation',
          note: 'Evaluation overview',
        },
      ],
    },
    {
      id: 'methodology',
      title: `${team.label} methodology`,
      question: 'How did this team build its criterion?',
      route: teamMethodologyPath,
      status: status(teamMethodologyPath),
      sees: [],
      outline: methodologyOutline(team),
      branches: [
        { label: 'Other criteria', to: teamMethodologyPath, note: 'Team tabs' },
        { label: 'Evaluation overview', to: '/scenarios/evaluation', note: 'Back to evaluation' },
      ],
    },
    {
      id: 'team-results',
      title: `${team.label} results for ${scenario.title}`,
      question: 'How does this future perform on this criterion?',
      route: teamScenarioPath,
      status: status(teamScenarioPath),
      sees: finding ? [finding.headline] : [],
      outline: teamResultsOutline(team, scenario),
      branches: [
        { label: 'Same team, another future', to: teamScenarioPath, note: 'Scenario tabs' },
        { label: 'Same future, another team', to: teamScenarioPath, note: 'Team tabs' },
        { label: `Back to ${scenario.title} results`, to: resultsPath },
      ],
    },
    {
      id: 'ranking',
      title: 'Performance & ranking',
      question: 'Which future performs best overall, and does that depend on what matters most?',
      route: '/scenarios/ranking',
      status: status('/scenarios/ranking'),
      sees: ['01 The overall ranking', '02 Change what matters most'],
      branches: [{ label: 'By criterion', to: '/scenarios/ranking/by-criterion' }],
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
      '/',
      '/scenarios',
      'Explore the futures',
      'Link the home narrative to the scenario gallery.',
    ),
    linkTransition(
      '/scenarios',
      scenarioPath,
      `Select the ${scenario.title} card`,
      `Link the ${scenario.title} card on the landing page to ${scenarioPath}.`,
    ),
    linkTransition(
      scenarioPath,
      resultsPath,
      'Explore modeling results and evaluation criteria',
      `Add a results link at the end of the ${scenario.title} story.`,
    ),
    {
      action: 'Scroll to “Evaluation criteria” and pick a team tile',
      kind: 'scroll',
      evidence: [],
    },
    linkTransition(
      resultsPath,
      teamMethodologyPath,
      'How this team evaluates',
      'Link the selected team panel in ScenarioResults to its methodology page.',
    ),
    linkTransition(
      teamMethodologyPath,
      teamScenarioPath,
      `Pick ${scenario.title} under “Scenario comparisons”`,
      `Add a “Scenario comparisons” section (id scenario-comparisons) to the methodology page with one card per future linking to ${teamResultsPath(':scenarioSlug', ':teamId')}. The team × scenario page already links back to that anchor, and the results page’s team panel could link here directly.`,
    ),
    linkTransition(
      teamScenarioPath,
      '/scenarios/ranking',
      'Compare every future',
      'Link “Where it ranks” on the team × scenario page to /scenarios/ranking.',
    ),
  ]

  return { steps, transitions }
}
