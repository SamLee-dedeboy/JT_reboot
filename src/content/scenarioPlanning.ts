// Everything the Participatory Scenario Planning page says, from the project's ArcGIS Hub
// page of the same name. Layout stays in features/background; change the words here.

const IMAGES = '/images/background'

export const PSP_HERO = {
  /** The title's first line, in the brand green. */
  titleAccent: 'Participatory',
  title: 'Scenario Planning',
  lede: 'Participatory scenario planning (PSP) enables public participants to prioritize and make meaningful contributions to the planning and adaptation strategies we are researching in this project.',
  image: `${IMAGES}/psp-hero.webp`,
}

export const PSP_PROCESS = {
  id: 'process',
  eyebrow: 'The Process',
  title: 'Our Participatory Scenario Planning Process',
  lead: 'Through this process, both participants and researchers collaborate alongside experts in science, engineering, policy, and design, through facilitated forums of discourse (including workshops, exhibitions, events, UC courses, and interviews).',
  body: "These opportunities to discuss the complex water management systems and potential adaptation strategies in the Sacramento-San Joaquin Delta also ensure that all engaged individuals can learn to understand the competing priorities and trade offs associated with different management alternatives. This condition of the PSP process further strengthens the co-design aspects of this work and the project's ability to generate co-learning, shared visioning, trust and capacity building.",
}

/** The two workshop photographs shown edge to edge below the process. */
export const PSP_PHOTOS = [
  {
    image: `${IMAGES}/psp-ej-workshop.webp`,
    alt: 'Participants reading scenario boards on a wall at a Delta workshop',
    caption: 'Environmental Justice Workshop',
    date: 'Dec 2024',
  },
  {
    image: `${IMAGES}/psp-workshop-2025.webp`,
    alt: 'Participants reviewing scenario exhibition panels and evaluation criteria at a public workshop',
    caption: 'Public Workshop #2',
    date: 'Jun 2025',
  },
]

export const PSP_CODESIGN = {
  id: 'codesign',
  eyebrow: 'The Approach',
  title: 'What Is Co-Design?',
  lead: 'Co-design refers to the collaborative process of engaging with an intended audience, end-user, or public recipient in the creative process of visioning and designing the product, plan, or idea itself.',
  body: 'In the planning field, where design outcomes are highly impactful to the larger scheme of society, this translates to collaborating with communities, advocacy groups, neighborhoods, or other public constituents who have significant stake in or are impacted by planning and decision making outcomes.',
  image: `${IMAGES}/psp-codesign.webp`,
  alt: "The Bolster & Fortify scenario board covered in participants' sticky notes on research questions, concerns, benefits and impacts",
}

export const PSP_TIMELINE = {
  id: 'timeline',
  eyebrow: '2023 – 2027',
  title: 'Our Timeline',
  /** The intro, split around its two colored phrases. */
  intro: {
    before:
      'The diagram below captures the full scope of the project approach over the timespan of the four year grant funding window. Milestone activities are contained in ',
    blue: 'blue boxes',
    middle: ' while the ',
    green: 'green boxes',
    after:
      ' represent the participatory scenario planning and public engagement processes, which are integral to the co-design, co-production, and shared learning objectives of this project.',
  },
  diagram: `${IMAGES}/psp-approach-diagram.webp`,
  diagramAlt:
    'Project approach diagram, 2023 to 2027: research and context gathering, public engagement and interviews, then three rounds of scenario refinement and testing, each reviewed at a public workshop, leading to a set of final scenarios and outcomes in shared learning and new knowledge',
}

/** The completed years, oldest first. Labels follow the approach diagram. */
export const PSP_PAST_YEARS = [
  {
    year: '2023',
    label: 'Context Gathering',
    text: 'The Just Transitions research team engaged public participants through interviews, surveys, regional canvassing and fieldwork to generate context for the diverse ways in which people understand the Delta, its drivers of change, and the impacts of salinity. This co-learning effort defined the development of a first round of six adaptation scenarios to compare under future conditions of drought, salinity, and sea-level rise. These scenarios intentionally explored a wide range of approaches and visions for future water management in the Delta.',
  },
  {
    year: '2024',
    label: 'Workshop #1',
    text: 'The preliminary six adaptation scenarios were presented at a public workshop in June 2024. Participants reviewed, assessed, and evaluated the scenarios and provided our team with extensive feedback, which was distilled into a workshop summary report. This feedback directly influenced further refinement of each scenario. Two additional workshops that focused on impacted communities were also conducted in the fall and winter to further define the priorities of vulnerable communities and the values of environmental justice advocates.',
  },
  {
    year: '2025',
    label: 'Workshop #2',
    text: 'Additional public engagement, expert forums, internal team assessments, and another public workshop in June 2025 all further informed the adaptation strategies and research scope. As a result of these interactions, the scenarios are more robust and more aligned to the values and priorities voiced by public participants. This process of co-design included public contributions to the proposed scenario evaluation criteria: participants helped define and prioritize the metrics that will be used to assess and compare the relative performance of each scenario.',
  },
]

/** The present year: the timeline's emphasized step. */
export const PSP_CURRENT_YEAR = {
  id: 'modeling',
  year: '2026',
  badge: 'Now',
  title: 'Modeling & Evaluating Scenarios',
  lead: 'With a basis of six publicly assessed and expert reviewed future scenarios, the project research team endeavors to model and evaluate these adaptations across a range of domains including ecological, recreational, economic, hydrodynamic, climate, and social impacts.',
  body: [
    'This process unfolds across multidisciplinary teams that unite in their efforts to make each scenario a tangible consideration for further public feedback. Ongoing efforts to model the salinity impacts of each scenario are currently underway. All together, the current modeling and evaluation efforts are guided and supported across a range of disciplines and parallel research units, including the statewide COEQWAL initiative.',
    'The Just Transitions research team will generate and share the results of their scenario evaluations through milestone public events in 2026.',
  ],
  link: { label: 'Choose a Future', href: '/scenarios' },
  diagram: `${IMAGES}/psp-subteam-diagram.webp`,
  diagramAlt:
    'Research structure diagram: participatory scenario planning at the centre, linked to the advisory committee, public outreach and social science, data visualization, the COEQWAL project, hydrodynamic and climate modeling, and ecological, economic and recreation modeling',
}
