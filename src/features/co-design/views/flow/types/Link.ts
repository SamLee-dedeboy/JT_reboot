// Ported from JT_dashboard/src/lib/Flow/types/Link.ts.
import type { Path } from 'd3'

export type tLink = {
  source: string
  target: string
  source_column: string
  target_column: string
  value: number
  combination: string
  participants: string[]
}

export type tPathData = {
  id: string
  participants: string[]
  class: string // flow or center
  source: string
  target: string
  source_column: string
  target_column: string
  path: Path
}
