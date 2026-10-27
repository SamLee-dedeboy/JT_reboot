// Criterion copy can mark key words with **double asterisks**; they render bold in
// the criterion's color. Edited in editorial/criteria-copy.json like any other text.
import { Box } from '@mui/material'
import type { ReactNode } from 'react'

export function withEmphasis(text: string, color: string): ReactNode {
  const parts = text.split(/\*\*(.+?)\*\*/g)
  if (parts.length === 1) return text
  // split with one capture group alternates plain text and marked words
  return parts.map((part, index) =>
    index % 2 ? (
      <Box key={index} component="strong" sx={{ color }}>
        {part}
      </Box>
    ) : (
      part
    ),
  )
}
