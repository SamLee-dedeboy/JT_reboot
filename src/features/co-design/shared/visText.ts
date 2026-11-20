// Sizes for text drawn inside the co-design visualizations (SVG labels in bubbles,
// rings and callouts), read from the site's typography scale instead of being set
// per chart. Values are screen pixels; a chart whose viewBox is scaled converts
// them to its own units.
import type { Theme } from '@mui/material/styles'

const ROOT_PX = 16

// A variant's font size in px. A fluid clamp() resolves to its minimum, so a
// label is never set below the size the variant guarantees.
function toPx(size: unknown): number {
  if (typeof size === 'number') return size
  const value = String(size).trim()
  const clamp = value.match(/^clamp\(\s*([\d.]+)rem/)
  if (clamp) return parseFloat(clamp[1]) * ROOT_PX
  if (value.endsWith('rem')) return parseFloat(value) * ROOT_PX
  return parseFloat(value)
}

export interface VisTextSizes {
  /** Smallest label (controlLabel). A label that cannot fit its shape at this
   * size is left off; the shape's tooltip still names it. */
  min: number
  /** An ordinary in-shape label (cardBody). */
  label: number
  /** The largest label, for the biggest shapes (cardTitle). */
  max: number
  /** The center "Salinity" label (chartValueLarge). */
  center: number
}

export function visTextSizes(theme: Theme): VisTextSizes {
  const t = theme.typography
  return {
    min: toPx(t.controlLabel.fontSize),
    label: toPx(t.cardBody.fontSize),
    max: toPx(t.cardTitle.fontSize),
    center: toPx(t.chartValueLarge.fontSize),
  }
}
