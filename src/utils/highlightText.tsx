import type { ReactNode } from 'react'

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
