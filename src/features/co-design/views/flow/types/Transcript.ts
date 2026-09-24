// Ported from JT_dashboard/src/lib/Flow/types/Transcript.ts.
export type tMessage = {
  speaker: string
  role: string
  content: string
}
export type tChunk = {
  id: string
  chunk_title: string
  title: string
  summary: string
  conversations: tMessage[]
}
