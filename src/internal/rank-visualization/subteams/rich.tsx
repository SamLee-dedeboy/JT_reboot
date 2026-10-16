// Inline highlights for the subteam pages' prose.
import { Box } from '@mui/material'
import type { ReactNode } from 'react'

/**
 * Prose with highlights. A string may mark a phrase with **double asterisks** for a
 * bright <strong> (a term, a number) or ==double equals== for the one phrase in
 * the paragraph to take away, set in the site's green. Two levels, no more, so
 * the eye can skim a page by its green and read a paragraph by its white.
 */
export function rich(text: ReactNode): ReactNode {
  if (typeof text !== 'string') return text
  return text.split(/(\*\*[^*]+\*\*|==[^=]+==)/g).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <Box key={i} component="strong" sx={{ color: 'common.white' }}>
          {part.slice(2, -2)}
        </Box>
      )
    }
    if (part.startsWith('==') && part.endsWith('==')) {
      return (
        <Box key={i} component="strong" sx={{ color: 'primary.main' }}>
          {part.slice(2, -2)}
        </Box>
      )
    }
    return part
  })
}

/** A difference between two percentages, as a cell prints it: +4%, −7%, or 0. */
export function signedPct(points: number): string {
  if (points === 0) return '0'
  return `${points > 0 ? '+' : '−'}${Math.abs(points)}%`
}
