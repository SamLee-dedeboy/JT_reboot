// Ported from JT_dashboard/src/lib/Flow/types/Server.ts. tFutureManagement now
// describes the key BlockAggregator actually reads ("important salinity
// management strategies", an array), which the original type misnamed.
import type { tMessage } from './Transcript'

export type tDataset = {
  background: tBackgroundChunk[]
  drivers_of_change: tDriversOfChangeChunk[]
  future_management: tFutureManagementChunk[]
  decision_making: tDecisionMakingChunk[]
  metadata: tMetadata
  participant_data: { [key: string]: tParticipantData }
  category_dict: { [key: string]: string[] }
  similarities: { [key: string]: { [key: string]: number } }
}

export type tTranscriptChunk = {
  id: string
  conversation: tMessage[]
  embedding: number[]
}
export type tBackgroundChunk = tTranscriptChunk & { summary: tBackground }
export type tDriversOfChangeChunk = tTranscriptChunk & tDriversOfChange
export type tFutureManagementChunk = tTranscriptChunk & tFutureManagement
export type tDecisionMakingChunk = tTranscriptChunk & tDecisionMaking

export type tBackground = {
  id: string
  age: number
  categories: string[]
  living_place: string
  'relationship to the delta': string
  summary: string
}

export type tDriversOfChange = {
  summary: {
    id: string
    factors: tFactor[]
    summary: string
  }
}

export type tFutureManagement = {
  summary: {
    id: string
    'important salinity management strategies': {
      strategy: string
      category: string
    }[]
    summary: string
  }
}
export type tDecisionMaking = {
  summary: {
    id: string
    'Is the process fair': string
    Reason: string
    'Who is represented': tGroup[]
    'Who is not represented': tGroup[]
    'What other people to connect with': tGroup[]
    'comments on the decision-making in the Delta': string
    summary: string
  }
}

export type tMetadata = {
  participant_categories: string[]
  factor_categories: string[]
  strategy_categories: string[]
  represented_categories: string[]
  not_represented_categories: string[]
  others_to_include_categories: string[]
  [key: string]: string[]
}
export type tParticipantData = {
  id: string
  deid: number
  pid: string
  conversations: {
    background: tMessage[]
    drivers_of_change: tMessage[]
    future_management: tMessage[]
    decision_making: tMessage[]
  }
  summaries: {
    background: string
    drivers_of_change: string
    future_management: string
    decision_making: string
  }
  categories: string[]
  factors: string[]
  strategies: string
  fairness: string
  represented_groups: string[]
  not_represented_groups: string[]
  others_to_include: string[]
}
export type tFactor = {
  factor_name: string
  category: string
  reason: string
}

export type tGroup = {
  group: string
  category: string
}
