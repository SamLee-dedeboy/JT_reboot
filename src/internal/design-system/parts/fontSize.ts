// Reads a typography variant's font size at a given window width: which argument of its
// clamp() (or which media step) is in force, and the size it comes to in px.

const ROOT_PX = 16

/** A length such as `1.2rem + 3vw`, in px at window width `width`. */
function lengthPx(expression: string, width: number) {
  return expression.split('+').reduce((sum, raw) => {
    const term = raw.trim()
    const value = parseFloat(term)
    if (term.endsWith('rem')) return sum + value * ROOT_PX
    if (term.endsWith('vw')) return sum + (value * width) / 100
    return sum + value
  }, 0)
}

export interface FontSizeReading {
  kind: 'clamp' | 'steps' | 'fixed'
  /** The pieces to show, in order; `active` is the index of the one in force. */
  parts: string[]
  active: number
  px: number
}

type VariantStyle = Record<string, unknown>

/** The font size of one variant at `width`, from its theme definition. */
export function readFontSize(style: VariantStyle, width: number): FontSizeReading | null {
  const base = style.fontSize
  if (typeof base !== 'string') return null

  // Media steps such as `button`: a base size, then max-width overrides in source order.
  const steps = Object.entries(style)
    .filter(([key]) => key.startsWith('@media'))
    .map(([key, value]) => ({
      max: Number(key.match(/max-width:\s*([\d.]+)px/)?.[1] ?? Infinity),
      size: String((value as VariantStyle).fontSize),
    }))
  if (steps.length > 0) {
    let active = 0
    steps.forEach((step, index) => {
      if (width <= step.max) active = index + 1
    })
    const sizes = [base, ...steps.map((step) => step.size)]
    return {
      kind: 'steps',
      parts: [base, ...steps.map((step) => `${step.size} ≤${Math.floor(step.max)}px`)],
      active,
      px: lengthPx(sizes[active], width),
    }
  }

  const clamp = base.match(/^clamp\((.*)\)$/)
  if (!clamp) return { kind: 'fixed', parts: [base], active: 0, px: lengthPx(base, width) }

  const parts = clamp[1].split(',').map((part) => part.trim())
  const [min, preferred, max] = parts.map((part) => lengthPx(part, width))
  const active = preferred < min ? 0 : preferred > max ? 2 : 1
  return { kind: 'clamp', parts, active, px: Math.min(Math.max(preferred, min), max) }
}
