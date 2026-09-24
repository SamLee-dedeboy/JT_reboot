// Ported from JT_dashboard/src/lib/Flow/types/Section.ts.
import type { Column, tColumnMetadata } from './Column'
export type Section = {
  title: string
  columns: Column[]
}

export type tSectionMetadata = {
  id: string
  title: string
  columns: tColumnMetadata[]
  hidden: boolean
  revealed: boolean
}
