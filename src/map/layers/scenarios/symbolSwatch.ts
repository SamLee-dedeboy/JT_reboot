import { map } from '../../../theme'
import type { LegendItem } from './config'

const patternImage = {
  dots: 'radial-gradient(currentColor 1.2px, transparent 1.6px)',
  diagonal: 'repeating-linear-gradient(45deg, transparent 0 4px, currentColor 4px 5px)',
  crosshatch:
    'repeating-linear-gradient(45deg, transparent 0 4px, currentColor 4px 5px), repeating-linear-gradient(-45deg, transparent 0 4px, currentColor 4px 5px)',
  horizontal: 'repeating-linear-gradient(0deg, transparent 0 3px, currentColor 3px 4px)',
} as const

/** Draws a legend item's map symbol as a background, for the legend and the narrative's chips. */
export function symbolSwatchSx(item: LegendItem, selected: boolean) {
  const { feature, highlight, mutedFeature, pattern } = map.scenarios.cartography
  const ink = item.color ?? (selected ? highlight : feature)
  const mark = { color: ink, backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }

  if (item.pattern) {
    return {
      color: pattern,
      bgcolor: selected ? highlight : mutedFeature,
      backgroundImage: patternImage[item.pattern],
      backgroundSize: item.pattern === 'dots' ? '8px 8px' : undefined,
    }
  }
  if (item.kind === 'line') {
    return {
      ...mark,
      backgroundImage: item.dashed
        ? 'repeating-linear-gradient(90deg, currentColor 0 6px, transparent 6px 10px)'
        : 'linear-gradient(currentColor, currentColor)',
      backgroundSize: '70% 3px',
    }
  }
  if (item.kind === 'band') {
    return {
      ...mark,
      backgroundImage: 'linear-gradient(currentColor, currentColor)',
      backgroundSize: '70% 8px',
    }
  }
  if (item.kind === 'square') {
    return {
      ...mark,
      backgroundImage: 'linear-gradient(currentColor, currentColor)',
      backgroundSize: '11px 11px',
    }
  }
  return {
    ...mark,
    backgroundImage: 'radial-gradient(circle, currentColor 5px, transparent 5.5px)',
  }
}
