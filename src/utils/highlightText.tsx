import type { ReactNode } from 'react'
import Hl from '../ui/Highlight'

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/** Wrap any of `keywords` found in `text` in a green highlight. */
export function highlightKeywords(text: string, keywords: string[]): ReactNode {
  if (!keywords?.length) return text
  const re = new RegExp(`(${keywords.map(escapeRe).join('|')})`, 'g')
  return text.split(re).map((part, i) => (keywords.includes(part) ? <Hl key={i}>{part}</Hl> : part))
}

/** Highlight a single verbatim substring within `text`. */
export function emphasize(text: string, phrase?: string): ReactNode {
  if (!phrase || !text.includes(phrase)) return text
  const idx = text.indexOf(phrase)
  return (
    <>
      {text.slice(0, idx)}
      <Hl>{phrase}</Hl>
      {text.slice(idx + phrase.length)}
    </>
  )
}

/** Split off the first sentence as an emphasized lead. */
export function splitLead(text: string): [string, string] {
  const m = text.match(/^(.*?[.?!])\s+(.*)$/s)
  return m ? [m[1], m[2]] : [text, '../ui/Highlight']
}
