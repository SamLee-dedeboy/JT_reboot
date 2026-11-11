// Everything the home page says: the hero, the four narrative panels, the photo panels
// between them, and the rail that jumps between the panels. Layout and image cropping
// stay in features/home; change the words here.

/** A link the page shows as a button. Leave `href` out to show it as forthcoming. */
export interface HomeLink {
  label: string
  /** An in-app route, an in-page `#anchor` or an external `https://` URL. */
  href?: string
}

export const HERO = {
  titleLine1: 'Just Transitions',
  titleLine2: 'in the Delta',
  lede: 'Envisioning equitable futures for water management in the Sacramento–San Joaquin Delta amid drought, salinity, and sea-level rise.',
}

/**
 * The four narrative panels, top to bottom. `id` is the panel's anchor and what the rail
 * scrolls to; `railLabel` is its name on the rail.
 */
export const HOME_SECTIONS = {
  whatIf: { id: 'whatif', railLabel: 'What If?', eyebrow: 'The Idea', title: 'What if?' },
  futures: {
    id: 'foundations',
    railLabel: 'What Futures?',
    eyebrow: 'The Approach',
    title: 'What FUTURES?',
  },
  stakes: {
    id: 'stakes',
    railLabel: "What's at Stake?",
    eyebrow: 'The Context',
    title: 'What’s at stake?',
  },
  works: {
    id: 'works',
    railLabel: 'How It Works?',
    eyebrow: 'The Project',
    title: 'How it works?',
  },
} as const

export type HomeSection = (typeof HOME_SECTIONS)[keyof typeof HOME_SECTIONS]

/** The rail beside the panels, in page order. */
export const HOME_RAIL_ITEMS = Object.values(HOME_SECTIONS).map(({ id, railLabel }) => ({
  id,
  label: railLabel,
}))

/**
 * The "What if?" panel, as it reads: groups of questions (each question on its own line),
 * and the italic emphasis lines between them.
 */
export const WHAT_IF: {
  blocks: Array<{ kind: 'questions'; lines: string[] } | { kind: 'emphasis'; text: string }>
  cta: HomeLink
} = {
  blocks: [
    {
      kind: 'questions',
      lines: [
        'What if we considered a wide range of future visions for equitable water management in the Delta under a shifting climate of uncertainty?',
        'What would these scenarios look like?',
        'How might these futures compare across the many social and ecological factors at play?',
      ],
    },
    {
      kind: 'emphasis',
      text: 'More importantly, what if Delta communities and impacted citizens had a role in defining these scenarios… before decisions are made?',
    },
    {
      kind: 'questions',
      lines: [
        'Better yet, what if communities could prioritize the features and performance of each scenario, assessing them side by side to understand the impacts and benefits of each strategy?',
        'To be able to clarify risks and negotiate tradeoffs for a future Delta that factors in all interests, especially those underrepresented in decision making.',
      ],
    },
    {
      kind: 'emphasis',
      text: 'How might these future scenarios support a framework for a Just Transitions in the Sacramento-San Joaquin Delta?',
    },
  ],
  cta: { label: 'View Future Scenarios', href: '/scenarios' },
}

/** The full-bleed photo panels between the narrative panels, top to bottom. */
export const HOME_PHOTOS = {
  justTransition: {
    id: 'futures-photo',
    image: 'images/community-fishing.jpg',
    text: 'The term Just Transition is used in the domains of climate, energy, and environmental justice and refers to efforts to reduce inequity in society. This project seeks to advance such efforts by democratizing science and decision making in the Delta through a participatory scenario planning process.',
    link: { label: 'What is a just transition?' },
  },
  scenarioPlanning: {
    id: 'stakes-photo',
    image: 'images/exhibit.jpg',
    text: 'By envisioning diverse ways in which climate, governance, and ecosystems might co-evolve, scenario-based planning offers tools to reflect on current actions and goals, and in turn, fosters shared learning and socio-technical innovation.',
    link: {
      label: 'Participatory Scenario Planning',
      href: 'https://delta-just-transitions-ucdavis.hub.arcgis.com/pages/scenario-planning',
    },
  },
  deltaInTransition: {
    id: 'works-photo',
    image: 'images/tulare-basin.jpg',
    text: 'Salinity management in the Delta during drought has historically been done on an emergency basis. However, with future droughts and sea-level rise more likely, long-range planning that creatively visions new futures for salinity management while holistically considering the tradeoffs associated with those futures is needed.',
    link: { label: 'A Delta in Transition' },
  },
} satisfies Record<string, { id: string; image: string; text: string; link: HomeLink }>

/** The "How it works?" panel's lead, before its steps. */
export const WORKS_INTRO = {
  lead: 'Just Transitions in the Delta addresses future uncertainty and aims to raise awareness of the tradeoffs involved in managing the Sacramento-San Joaquin Delta amid future droughts and rising sea levels.',
  stepsLead: 'We deliver this through',
}

/** The "What futures?" panel: three questions and answers. */
export const FUTURES = [
  {
    title: 'What are scenarios?',
    body: 'Scenarios are models and depictions of possible futures and the pathways through which they could manifest.',
  },
  {
    title: 'What is participatory scenario planning?',
    body: 'Participatory scenario planning is an inclusive, “bottom up” approach that involves working directly with public contributors (particularly those who might be affected by planning outcomes) to create and evaluate future scenarios for a particular place.',
  },
  {
    title: 'Why participatory scenario planning?',
    body: 'Scenario planning is increasingly used in conservation and climate change adaptation research, especially when uncertainty, vulnerability, and divergent stakeholder interests create conflicting mandates.',
  },
]

/** The "What's at stake?" panel: each section's lead, the phrase it emphasizes, and the text behind "Read more". */
export const STAKE_SECTIONS = [
  {
    title: 'The Bay-Delta Region',
    emphasize:
      "responses to climate management in the Delta have often been short-term 'bandaid' solutions with significant and possibly inequitable tradeoffs",
    introduction: [
      'The Bay-Delta region holds immense economic, ecological, and cultural significance, yet research and long-term planning have historically lagged behind its challenges.',
      'Fragmented governance and competing demands have often resulted in short-term responses with significant and potentially inequitable tradeoffs.',
      'The Delta specifically...',
    ],
    details: [
      'Estuary-scale approaches for envisioning alternative futures and evaluating tradeoffs through inclusive public engagement have seen limited progress.',
      "The region's complex relationship between science and governance has often been fraught with conflict because many groups depend on the same natural resources in different ways.",
      "As a consequence, responses to climate management in the Delta have often been short-term 'bandaid' solutions with significant and possibly inequitable tradeoffs, leaving long-term solutions unclear.",
    ],
  },
  {
    title: 'Drought, Salinity & Sea-Level Rise',
    emphasize:
      'nearly as much reservoir water may be needed to keep salinity from entering the Delta as is available for in-Delta use and exports',
    introduction: [
      'During extreme drought years, nearly as much reservoir water may be needed to keep salinity from entering the Delta as is available for in-Delta use and exports.',
      'As drought and sea-level rise intensify, managing this balance creates increasingly difficult tradeoffs.',
    ],
    details: [
      'Water releases for salinity control protect in-Delta uses as well as exports to central and southern California. If ocean tides push salinity into the southern Delta, recovering freshwater exports could take months or years.',
      'During multi-year droughts, limited reservoir supplies can lead to reduced exports, temporarily relaxed salinity standards, and emergency barriers that redirect tidal energy.',
      'These responses can reduce the water needed to control salinity, but each creates different consequences for communities and ecosystems.',
    ],
  },
]

export interface WorkStep {
  title: string
  text: string
  links: HomeLink[]
}

/** The "How it works" ladder, top to bottom. */
export const WORK_STEPS: WorkStep[] = [
  {
    title: 'Scenario Co-Design',
    text: 'Interviews and workshops surfaced public values and concerns about Delta salinity, which guided how each future scenario was designed.',
    links: [{ label: 'Explore the co-design dashboard', href: '/pages/co-design-dashboard' }],
  },
  {
    title: 'Scenario Adaptations',
    text: 'Starting from current operations, outflow variations and five adaptation pathways show what different Delta futures ask of communities, ecosystems, and water systems.',
    links: [{ label: 'Choose a future', href: '/scenarios' }],
  },
  {
    title: 'Scenario Modeling & Evaluation',
    text: 'We model salinity, water temperature, and water age in adaptation scenarios, with and without sea level rise. Five criteria then examine what each future means for ecology, recreation, environmental justice, the economy, and eco-cultural outcomes.',
    links: [
      { label: 'Salinity modeling', href: '/scenarios/modeling' },
      { label: 'Evaluation criteria', href: '/scenarios/evaluation' },
    ],
  },
  {
    title: 'Scenario Ranking',
    text: 'Compare how the futures perform across five criteria. Rank them with equal weight, test how different priorities change the order, or trace each score back to its underlying evidence.',
    links: [{ label: 'Rank the futures', href: '/scenarios/ranking' }],
  },
  {
    title: 'Governance & Co-Learning',
    text: 'Shared learning across community knowledge, research, and practice helps reveal what a just transition asks of planning in the Delta.',
    links: [{ label: 'How to act' }, { label: 'Read the reflections' }],
  },
]
