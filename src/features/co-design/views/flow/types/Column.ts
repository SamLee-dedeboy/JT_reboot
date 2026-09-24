// Ported from JT_dashboard/src/lib/Flow/types/Column.ts.
import type { tBlock } from './Block'
export type Column = {
  id: string
  title: string
  blocks: tBlock[]
  next_column: string
}

export type tColumnMetadata = {
  id: string
  title: string
  section_id: string
  column_id_prefix: string
  value_process_func: (d: string) => string
  type: string
  hidden: boolean
}
