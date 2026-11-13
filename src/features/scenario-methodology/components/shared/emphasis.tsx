// Criterion copy can mark key words with **double asterisks**; they render bold in
// the criterion's color. It can also link text as [label](url). Edited in
// editorial/criteria-copy.json like any other text.
import { Box } from '@mui/material'
import { alpha } from '@mui/material/styles'
import type { ReactNode } from 'react'

const LINK = /^\[(.+?)\]\((.+?)\)$/

export function withEmphasis(text: string, color: string): ReactNode {
  const parts = text.split(/(\*\*.+?\*\*|\[.+?\]\(.+?\))/g)
  if (parts.length === 1) return text
  // split with one capture group alternates plain text and marked words
  return parts.map((part, index) => {
    if (index % 2 === 0) return part
    const link = LINK.exec(part)
    if (!link)
      return (
        <Box key={index} component="strong" sx={{ color }}>
          {part.slice(2, -2)}
        </Box>
      )
    return (
      <Box
        key={index}
        component="a"
        href={link[2]}
        target="_blank"
        rel="noopener noreferrer"
        sx={{ color, textDecoration: 'underline', textDecorationColor: alpha(color, 0.5) }}
      >
        {link[1]}
      </Box>
    )
  })
}
