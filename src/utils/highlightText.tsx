import type { ReactNode } from 'react'

/**
 * Split `text` around each verbatim phrase in `phrases` and pass every match to `mark`, so
 * the caller decides how a highlight looks (with a theme color, not one fixed here).
 */
export function highlightPhrases(
  text: string,
  phrases: readonly string[],
  mark: (phrase: string, key: number) => ReactNode,
): ReactNode[] {
  const found = phrases.filter((phrase) => phrase && text.includes(phrase))
  if (found.length === 0) return [text]
  const escaped = found.map((phrase) => phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  return text
    .split(new RegExp(`(${escaped.join('|')})`))
    .filter(Boolean)
    .map((part, index) => (found.includes(part) ? mark(part, index) : part))
}

/** Highlight a single verbatim substring within `text`. */
export function emphasize(text: string, phrase?: string): ReactNode {
  if (!phrase || !text.includes(phrase)) return text
  const idx = text.indexOf(phrase)
  return (
    <>
      {text.slice(0, idx)}
      <span style={{ color: '#51a2bd' }}>{phrase}</span>
      {text.slice(idx + phrase.length)}
    </>
  )
}
