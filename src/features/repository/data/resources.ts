/* References & Resources — content ported verbatim from the design
   handoff (repo-resources-data.jsx). Abstracts/highlights are real
   academic text and preserved exactly. */

export interface Reference {
  title: string
  source: string
  meta: string
  href?: string
}

export const REFERENCES: Reference[] = [
  {
    title: 'Bay Delta Hydrology 101',
    source: "Maven's Notebook: California Water News Central",
    meta: 'Webinar Presentation: Ted Sommer, 2021',
  },
  {
    title: 'Envisioning Futures for the Sacramento-San Joaquin Delta',
    source: 'PPIC Publication',
    meta: 'Ellen Hanak, Jay Lund, William E. Fleenor, et. al, 2007',
  },
  {
    title: 'Drought and the California Delta—A Matter of Extremes',
    source: 'San Francisco Estuary & Watershed Science',
    meta: 'Michael Dettinger, Daniel Cayan, 2014',
  },
  {
    title: 'Comparing Futures for the Sacramento-San Joaquin Delta',
    source: 'PPIC Publication',
    meta: 'Ellen Hanak, Jay Lund, William E. Fleenor, et. al, 2008',
  },
]

export interface Article {
  title: string
  source: string
  meta: string
  kicker: string
  paras: string[]
  list?: string[]
}

export const ARTICLES: Article[] = [
  {
    title: '2023 California Delta Residents Survey',
    source: 'OPENICPSR: Inter-university Consortium for Political and Social Research',
    meta: 'Jess Rudnick, Kenji Tomari, Kristin Dobbin, et. al, 2023',
    kicker: 'Highlights',
    paras: [
      "The development of the 2023 Delta Residents Survey is one of multiple recent efforts supported by the Delta Stewardship Council's Social Science Integration Team and the Bay-Delta Social Science Community of Practice to begin better understanding and incorporating the human dimensions of the Delta into decision making. The Delta Residents Survey (DRS) was designed by a team of social science researchers working closely with Delta Stewardship Council staff, other partner state and local agencies, and community partners.",
      'The DRS had four substantive research aims:',
    ],
    list: [
      'Characterize residents’ sense of place;',
      'Assess well-being of a diverse and evolving population living in the region;',
      'Understand residents’ experiences and perceptions of environmental and climate changes across the estuary;',
      'Evaluate residents’ civic engagement and perceptions of governance in the region.',
    ],
  },
  {
    title: 'Park, Fish, Salt and Marshes: Participatory Mapping and Design in a Watery Uncommons',
    source: 'Land — Parks and Protected Areas: Mobilizing Knowledge for Effective Decision-Making',
    meta: 'Brett Milligan, Alejo Kraus-Polk, Yawed Huang, 2020',
    kicker: 'Abstract',
    paras: [
      'The Franks Tract State Recreation Area (Franks Tract) is an example of a complex contemporary park mired in ecological and socio-political contestation of what it is and should be. Located in the Sacramento-San Joaquin Delta, it is a central hub in California’s immense and contentious water infrastructure; an accidental shallow lake on subsided land due to unrepaired levee breaks; a novel ecosystem full of ‘invasive’ species; a world-class bass fishing area; and a water transportation corridor. Franks Tract is an example of an uncommons: a place where multiple realities (or ontologies) exist, negotiate and co-create one another. As a case study, this article focuses on a planning effort to simultaneously improve water quality, recreation and ecology in Franks Tract through a state-led project. The article examines the iterative application of participatory mapping and web-based public surveys within a broader, mixed method co-design process involving state agencies, local residents, regional stakeholders, consultant experts and publics. We focus on what was learned in this process by all involved, and what might be transferable in the methods. We conclude that reciprocal iterative change among stakeholders and designers was demonstrated across the surveys, based on shifts in stakeholder preferences as achieved through iterative revision of design concepts that better addressed a broad range of stakeholder values and concerns. Within this reconciliation, the uncommons was retained, rather than suppressed.',
    ],
  },
  {
    title: 'Tracking Where Water Goes in a Changing Sacramento-San Joaquin Delta',
    source: 'PPIC Publication',
    meta: 'Greg Gartrell, Jeffrey Mount, Ellen Hanak, 2022',
    kicker: 'Highlights',
    paras: [
      'The Sacramento–San Joaquin Delta and its watershed supply water to cities and farms across much of California; they also support commercial and recreational fisheries and provide vital habitat for many endangered native fishes and other aquatic species.',
      'During dry periods, most of the outflow from the Delta into San Francisco Bay is required to keep the Delta fresh enough for agricultural and urban uses, while during wet periods, most outflow is runoff that is too great to be captured and used.',
      'The climate in the watershed is changing: the past two decades have seen record warmth, making droughts more intense, with higher evaporation and declining snowpack. Water use upstream of the Delta appears to be rising, resulting in less inflow to the Delta.',
      'To address declining ecosystem health, regulations have also been changing, leading to higher outflows and lower water exports to other regions. These changes have not stopped the decline in native species.',
      'To better cope with more intense droughts, management of the Delta and its watershed would benefit from a suite of improvements in water use tracking and oversight, updates in water flow and quality regulations, and cost-effective investments to store more water in wet years.',
    ],
  },
  {
    title: 'Preparing Scientists, Policy-Makers, and Managers for a Fast-Forward Future',
    source: 'San Francisco Estuary & Watershed Science',
    meta: 'Richard Norgaard, John Wiens, Stephen Brandt, et. al, 2021',
    kicker: 'Abstract',
    paras: [
      'Ecosystems in the Sacramento–San Joaquin Delta are changing rapidly, as are ecosystems around the world. Extreme events are becoming more frequent and thresholds are likely to be crossed more often, creating greater uncertainty about future conditions. The accelerating speed of change means that ecological systems may not remain stable long enough for scientists to understand them, much less use their research findings to inform policy and management. Faced with these challenges, those involved in science, policy, and management must adapt and change and anticipate what the ecosystems may be like in the future. We highlight several ways of looking ahead—scenario analyses, horizon scanning, expert elicitation, and dynamic planning—and suggest that recent advances in distributional ecology, disturbance ecology, resilience thinking, and our increased understanding of coupled human–natural systems may provide fresh ways of thinking about more rapid change in the future. To accelerate forward-looking science, policy, and management in the Delta, we propose that the State of California create a Delta Science Visioning Process to fully and openly assess the challenges of more rapid change to science, policy, and management and propose appropriate solutions, through legislation, if needed.',
    ],
  },
  {
    title:
      'Ecological Effects of Climate-Driven Salinity Variation in the San Francisco Estuary: Can We Anticipate and Manage the Coming Changes?',
    source: 'San Francisco Estuary & Watershed Science',
    meta: 'Cameron Ghalambor, Edward Gross, Edwin Grosholtz, et. al, 2021',
    kicker: 'Abstract',
    paras: [
      'Climate change-driven sea level rise and altered precipitation regimes are predicted to alter patterns of salt intrusion within the San Francisco Estuary. A central question is: Can we use existing knowledge and future projections to predict and manage the anticipated ecological impacts? This was the subject of a 2018 symposium entitled ‘‘Ecological and Physiological Impacts of Salinization of Aquatic Systems from Human Activities.’’ The symposium brought together an inter-disciplinary group of scientists and researchers, resource managers, and policy-makers. Here, we summarize and review the presentations and discussions that arose during the symposium. From a historical perspective, salt intrusion has changed substantially over the past 10,000 years as a result of changing climate patterns, with additional shifts from recent anthropogenic effects. Current salinity patterns in the San Francisco Estuary are driven by a suite of hydrodynamic processes within the given contexts of water management and geography. Based on climate projections for the coming century, significant changes are expected in the processes that determine the spatial and temporal patterns of salinity. Given that native species—including fishes such as the Delta Smelt and Sacramento Splittail—track favorable habitats, exhibit physiological acclimation, and can adaptively evolve, we present a framework for assessing their vulnerability to altered salinity in the San Francisco Estuary. We then present a range of regulatory and structural management tools that are available to control patterns of salinity within the San Francisco Estuary. Finally, we identify major research priorities that can help fill critical gaps in our knowledge about future salinity patterns and the consequences of climate change and sea level rise. These research projects will be most effective with strong linkages and communication between scientists and researchers, resource managers, and policy-makers.',
    ],
  },
  {
    title:
      'Challenges Facing the Sacramento-San Joaquin Delta: Complex, Chaotic, or Simply Cantankerous?',
    source: 'Delta Science Program',
    meta: 'Samuel Luoma, Clifford Dahm, Michael Healey, et.al, 2015',
    kicker: 'Summary',
    paras: [
      'The following paper calls for Delta management to become more nimble and better coordinated. The situation requires bold, timely, and well-considered actions, taken incrementally (in stages) where possible, with the understanding that any management action typically leads to new complexities that must also be managed. With water scarcity has come the awareness that problems are less amenable to traditional engineering solutions, and that attempts at dramatic, simple solutions may intensify the risk of unexpected, if not catastrophic, consequences. Simultaneous attention to a portfolio that includes actions like addressing overuse and mis-use of water, and improving ground water management and storage, should accompany any necessary water infrastructure adjustments. Renewed emphasis on reducing known stressors, restoring native ecosystems, learning from our actions, and managing collaboratively and adaptively is essential if native species are to be retained. Comprehensive modeling that takes account of the many dimensions of the Delta problem should provide a foundation for determining the best approaches to implementing restoration and water management initiatives and forecasting the degree to which they will be effective.',
    ],
  },
  {
    title:
      'Drought and the Sacramento-San Joaquin Delta, 2012-2016: Environmental Review and Lessons',
    source: 'San Francisco Estuary & Watershed Science',
    meta: 'John Durand, Fabian Bombardelli, William E. Fleenor, et al, 2020',
    kicker: 'Abstract',
    paras: [
      'This paper reviews environmental management and the use of science in the Sacramento–San Joaquin Delta during California’s 2012–2016 drought. The review is based on available reports and data, and guided by discussions with 27 agency staff, stake-holders, and researchers. Key management actions for the drought are discussed relative to four major drought water management priorities stated by water managers: support public health and safety, control saltwater intrusion, preserve cold water in Shasta Reservoir, and maintain minimum protections for endangered species. Despite some success in streamlining communication through interagency task forces, conflicting management mandates sometimes led to confusion about priorities and actions during the drought (i.e., water delivery, the environment, etc.). This report highlights several lessons and offers suggestions to improve management for future droughts. Recommendations include use of pre-drought warnings, timely drought declarations, improved transparency and useful documentation, better scientific preparation, development of a Delta drought management plan (including preparing for salinity barriers), and improved water accounting. Finally, better environmental outcomes occur when resources are applied to improving habitat and bolstering populations of native species during inter-drought periods, well before stressful conditions occur.',
    ],
  },
  {
    title:
      'Effects of Drought and the Emergency Drought Barrier on the Ecosystem of the California Delta',
    source: 'San Francisco Estuary & Watershed Science',
    meta: 'Wim Kimmerer, Frances Wilkerson, Bryan Downing, et al., 2019',
    kicker: 'Abstract',
    paras: [
      'In 2015, the fourth year of the recent drought, the California Department of Water Resources installed a rock barrier across False River west of Franks Tract to limit salt intrusion into the Delta at minimal cost in freshwater. This Barrier blocked flow in False River, greatly reducing landward salt transport by decreasing tidal dispersion in Franks Tract. We investigated some ecological consequences of the Barrier, examining its effects on water circulation and exchange, on distributions of submerged aquatic vegetation (SAV) and bivalves, and on phytoplankton and zooplankton. The Barrier allowed SAV to spread to areas of Franks Tract that previously had been clear. The distributions of bivalves (Potamocorbula and Corbicula) responded to the changes in salinity at time–scales of months for newly settled individuals, to 1 or more years for adults, but the Barrier’s effect was confounded with that of the drought. Nutrients, phytoplankton biomass, and a Microcystis abundance index showed little response to the Barrier. Transport of copepods—determined using output from a particle-tracking model—indicated some intermediate-scale reduction with the Barrier in place, but monitoring data did not show a larger-scale response in abundance. These studies were conducted separately and synthesized after the fact, and relied on reference conditions that were not always suitable for identifying the Barrier’s effects. If barriers are considered in the future, we recommend a modest program of investigation to replicate study elements, and to ensure suitable reference conditions are available to allow barrier effects to be distinguished unambiguously from other sources of variability.',
    ],
  },
]
