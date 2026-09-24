// Ported from JT_dashboard/src/lib/Linking/constants.ts. The server address is
// gone (data comes from ../../api); category colours come from the theme
// (theme.coDesign.linking.category).
import * as d3 from 'd3'

export const CODE_CATEGORIES = ['Drivers', 'Strategies', 'Value', 'Governance'] as const
export type CodeCategory = (typeof CODE_CATEGORIES)[number]

// Ordinal scale from a code's top-level category to its colour.
export function categoryColorScale(colors: Record<CodeCategory, string>) {
  return d3.scaleOrdinal<string, string>(
    CODE_CATEGORIES,
    CODE_CATEGORIES.map((category) => colors[category]),
  )
}
