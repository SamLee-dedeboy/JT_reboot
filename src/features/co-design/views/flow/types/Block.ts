// Ported from JT_dashboard/src/lib/Flow/types/Block.ts.
export type tBlock = {
  id: string
  column_id: string
  title: string
  participants: string[]
  content?: tGroupOfPeopleBlockContent
}

export type tGroupOfPeopleBlockContent = [string, string][]
export type tDecisionMakingBlockContent = {
  [key: string]: { participant: string; name: string }[]
}
