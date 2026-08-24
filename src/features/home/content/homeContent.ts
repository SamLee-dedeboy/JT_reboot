/* Homepage copy — ported verbatim from the design handoff
   (hero.jsx, whatif.jsx, sections.jsx, closing.jsx). */

import type { IconName } from '../../../ui/Icon'

export const HERO = {
  eyebrow: 'University of California · Participatory Scenario Planning',
  titleLine1: 'Just Transitions',
  titleLine2: 'in the Delta',
  lede: 'Envisioning equitable futures for water management in the Sacramento–San Joaquin Delta amid drought, salinity, and sea-level rise.',
}

export interface WhatIfQuestion {
  text: string
  keywords: string[]
}

export const WHATIF_QUESTIONS: WhatIfQuestion[] = [
  {
    text: 'What if we considered a wide range of future scenarios for equitable water management in the Delta, under a shifting climate of uncertainty?',
    keywords: ['future scenarios', 'equitable water management', 'uncertainty'],
  },
  { text: 'What would these scenarios look like?', keywords: ['scenarios'] },
  {
    text: 'How might these scenarios compare amongst the many social and ecological factors at play?',
    keywords: ['social and ecological factors'],
  },
  {
    text: 'What potential benefits and tradeoffs would need to be considered in each of these futures?',
    keywords: ['benefits and tradeoffs'],
  },
  {
    text: 'How might these adaptation scenarios support a framework for Just Transitions in the Delta?',
    keywords: ['Just Transitions in the Delta'],
  },
]

export interface Foundation {
  n: string
  icon: IconName
  title: string
  text: string
}

export const FOUNDATIONS: Foundation[] = [
  {
    n: '01',
    icon: 'compass',
    title: 'What Are Scenarios?',
    text: 'Scenarios are models and depictions of possible futures and the pathways through which they could manifest. Participatory scenario planning is a "bottom up" approach that involves working directly with public contributors to create and evaluate future scenarios for a particular place.',
  },
  {
    n: '02',
    icon: 'users',
    title: 'Why Participatory Scenario Planning?',
    text: 'Scenario planning is an approach increasingly used in conservation and climate change adaptation research, especially when uncertainty, vulnerability, and divergent stakeholder interests create conflicting mandates. By envisioning diverse ways in which climate, governance and ecosystems might co-evolve, scenario-based planning offers tools to reflect on current actions and goals, and in turn, fosters shared learning and socio-technical innovation.',
  },
]

export const APPROACH_QUOTE =
  'Our approach to this participatory scenario planning process is built in a variety of ways, including public workshops, interviews, surveys, partnerships, exhibitions, and field work in the Sacramento-San Joaquin Delta.'

export const APPROACH_MODES = [
  'public workshops',
  'interviews',
  'surveys',
  'partnerships',
  'exhibitions',
  'field work',
]

export interface StakeBlock {
  tag: string
  icon: IconName
  text: string
  emphasize: string
}

export const STAKE: StakeBlock = {
  tag: 'The Bay-Delta Region',
  icon: 'layers',
  text: "The Bay-Delta region holds immense economic, ecological, and cultural significance, yet research and long-term planning have historically lagged behind its challenges. Fragmented governance and competing demands have often resulted in short-term responses with significant and potentially inequitable tradeoffs. In addition, the lack of estuary-scale approaches for envisioning alternative futures and evaluating tradeoffs through inclusive public engagement has seen limited progress. Furthermore, the complex science-governance nexus of this area has often been fraught with conflict due to fragmented governance and competing demands on the region's natural resources. As a consequence, responses to climate management in the Delta have often been short-term 'bandaid' solutions with significant and possibly inequitable tradeoffs, leaving long-term solutions unclear.",
  emphasize:
    "responses to climate management in the Delta have often been short-term 'bandaid' solutions with significant and possibly inequitable tradeoffs",
}

export const DROUGHT: StakeBlock = {
  tag: 'Drought, Salinity & Sea-Level Rise',
  icon: 'drop',
  text: 'During extreme drought years, nearly as much reservoir water may be needed to keep salinity from entering the Delta as is available for in-Delta use and exports. As drought and sea-level rise intensify, managing this balance creates increasingly difficult tradeoffs. These managed water releases for salinity control are intended to protect both in-Delta uses as well as this major source of exports to central and southern California. If ocean tides were to push salinity into the southern Delta—which would be accelerated by sea-level rise—the recovery of freshwater exports would take months to years. As drought stretches into multiple years and reservoir water supplies become more limited, controlling salinity becomes problematic, typically involving reduced exports, temporary relaxation of salinity standards in some parts of the Delta, and the construction of emergency barriers that redirect tidal energy away from the southern Delta. While effective at decreasing the amount of water needed to maintain salinity in the southern Delta, each of these actions has tradeoffs for different groups of people and ecosystems.',
  emphasize:
    'the amount of water required to be released from reservoirs to keep salinity from entering the Delta is nearly the same amount that is available for water use in the Delta and exported to southern California',
}

export const MISSION_QUOTE =
  'Salinity management in the Delta during drought has historically been done on an emergency basis. However, with future droughts and sea-level rise more likely, long-range planning that creatively visions new futures for salinity management while holistically considering the tradeoffs associated with those futures is needed.'

export const MISSION_STATEMENT =
  'The Just Transitions in the Delta project aims to address this need.'

export const WORKS_LEDE =
  'Our project aims to raise awareness of the tradeoffs involved in managing the Sacramento-San Joaquin Delta amid future droughts and rising sea levels.'

export const WORKS_STEPS = [
  'collaborative design of future scenarios',
  'community dialogue',
  'advanced modeling and visualization',
  'co-learning that emphasizes underrepresented voices',
]

export const WORKS_OUTRO = "…we build shared understanding of what's possible and what's at stake."
