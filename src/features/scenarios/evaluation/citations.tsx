// In-text citations ("(Mosley, 2015)") break up the criterion prose. They render as
// superscript numbers in the criterion's color instead, each linking to its entry
// in the page's numbered References list.
import { Box, Tooltip } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { useContext, type ReactNode } from 'react'
import { CitationContext, referenceId } from './citationContext'
import { withEmphasis } from './emphasis'

const YEAR = String.raw`(?:19|20)\d{2}[a-z]?`
/** One source: "Author, 2015" or "Author, 2012, 2021". */
const SOURCE = new RegExp(String.raw`^(.+?),\s*(${YEAR}(?:\s*,\s*${YEAR})*)$`)
/** A parenthetical and the space before it; kept only if every part is a source. */
const PARENTHETICAL = /\s*\(([^()]+)\)/g

interface Citation {
  /** Indexes into the References list, ascending. */
  indexes: number[]
  /** Sources the References list lacks; these stay as text. */
  missing: string[]
}

/** The sources a parenthetical cites, or null when it is not a citation. */
function parseCitation(inner: string, references: string[]): Citation | null {
  const indexes = new Set<number>()
  const missing: string[] = []
  for (const part of inner.split(';')) {
    const match = SOURCE.exec(part.trim())
    if (!match) return null
    // Same lead author, same year: "Hanak et al., 2011" → "Hanak, Ellen, … (2011)."
    const lead = match[1].replace(/\s+(et al\.|and|&)(\s.*)?$/, '').trim()
    for (const year of match[2].split(',').map((y) => y.trim())) {
      const index = references.findIndex(
        (reference) => reference.startsWith(lead) && reference.includes(`(${year}`),
      )
      if (index < 0) missing.push(`${match[1].trim()}, ${year}`)
      else indexes.add(index)
    }
  }
  return { indexes: [...indexes].sort((a, b) => a - b), missing }
}

/** Criterion prose with **emphasis** and its citations as numbered links. */
export function CitedText({ text }: { text: string }) {
  const { accent, references } = useContext(CitationContext)
  const nodes: ReactNode[] = []
  let last = 0
  for (const match of text.matchAll(PARENTHETICAL)) {
    const citation = parseCitation(match[1], references)
    if (!citation) continue
    const { indexes, missing } = citation
    nodes.push(withEmphasis(text.slice(last, match.index), accent))
    if (missing.length) nodes.push(` (${missing.join('; ')})`)
    if (indexes.length)
      nodes.push(
        <Box
          component="sup"
          key={match.index}
          sx={{ fontSize: '0.7em', lineHeight: 0, ml: '0.15em', whiteSpace: 'nowrap' }}
        >
          {indexes.map((index, i) => (
            <span key={index}>
              {i > 0 && ','}
              <Tooltip title={references[index]} arrow>
                <Box
                  component="a"
                  href={`#${referenceId(index)}`}
                  aria-label={`Reference ${index + 1}`}
                  sx={{
                    color: accent,
                    fontWeight: 600,
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline', bgcolor: alpha(accent, 0.12) },
                  }}
                >
                  {index + 1}
                </Box>
              </Tooltip>
            </span>
          ))}
        </Box>,
      )
    last = match.index + match[0].length
  }
  if (!nodes.length) return withEmphasis(text, accent)
  nodes.push(withEmphasis(text.slice(last), accent))
  return nodes
}
