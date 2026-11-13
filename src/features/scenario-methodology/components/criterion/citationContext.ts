// What CitedText needs from its page: the criterion's color and its numbered
// References list. Kept apart from citations.tsx so that file exports components only.
import { createContext } from 'react'

export interface CitationSettings {
  accent: string
  references: string[]
}

export const CitationContext = createContext<CitationSettings>({
  accent: 'currentColor',
  references: [],
})

/** Anchor id of the reference at this (0-based) index in the References list. */
export const referenceId = (index: number) => `ref-${index + 1}`
