// Data helpers shared by the Sunburst gallery and grid, ported from the
// duplicated script blocks of JT_dashboard/src/lib/Sunburst/Sunburst.svelte,
// SunburstGrid.svelte and SunburstChart.svelte.
import * as d3 from 'd3'

export interface SunburstData {
  name: string
  value?: number
  children?: SunburstData[]
}

export interface SunburstDataWithTitle {
  data: SunburstData
  title: string
  filename: string
}

// Color palette (shared across all charts for consistent category colors)
export const colorPalette = [
  '#637CEF',
  '#E3008C',
  '#2AA0A4',
  '#9373C0',
  '#13A10E',
  '#3A96DD',
  '#CA5010',
  '#57811B',
  '#B146C2',
  '#AE8C00',
]

// Helper function to generate titles from filenames. `includeAll` covers the
// extra "all" case that only the gallery (Sunburst.svelte) had.
export function generateTitle(filename: string, includeAll = false): string {
  // Remove "sunburst_" prefix and ".json" suffix
  const title = filename.replace('sunburst_', '').replace('.json', '')

  if (title === 'age_18_35') return 'Ages 18-35'
  if (title === 'age_36_64') return 'Ages 36-64'
  if (title === 'age_65_plus') return 'Ages 65+'
  if (title === 'years_0_10_experience') return 'Years 0-10 Engagement'
  if (title === 'years_11_30_experience') return 'Years 11-30 Engagement'
  if (title === 'years_31_plus_experience') return 'Years 31+ Engagement'
  if (title === 'Resident') return 'Resident'
  if (title === 'Non Resident') return 'Non Resident'
  if (title === 'team') return 'Team'
  if (title === 'interviewees') return 'Interviewees'
  if (includeAll && title === 'all') return 'All MMs'

  // Fallback: capitalize and replace underscores with spaces
  return title.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
}

// Assigns (and memoises in `colorMap`) a color per `${name}_${depth}`: top-level
// categories take the next palette color, deeper levels a brighter shade of
// their parent's color.
export function getConsistentColor(
  colorMap: Map<string, string>,
  palette: string[],
  name: string,
  depth = 0,
  parentColor: string | null = null,
): string {
  const key = `${name}_${depth}`

  if (!colorMap.has(key)) {
    if (depth === 1 || !parentColor) {
      const colorIndex =
        Array.from(colorMap.keys()).filter((k) => k.endsWith('_1')).length % palette.length
      colorMap.set(key, palette[colorIndex])
    } else {
      const baseColor = d3.color(parentColor)
      if (baseColor) {
        const variations = [baseColor.brighter(0.8)]
        const siblingIndex = Array.from(colorMap.keys()).filter(
          (k) =>
            k.includes(`_${depth}`) &&
            colorMap.get(k)?.toString().includes(baseColor.formatHex().substring(1, 3)),
        ).length
        const selectedVariation = variations[siblingIndex % variations.length]
        colorMap.set(key, selectedVariation.toString())
      }
    }
  }
  return colorMap.get(key) || palette[0]
}

// Sort the top-level children of a sunburst alphabetically by name so the
// same category always sits in the same angular position across every chart.
export function sortTopLevelAlphabetically(data: SunburstData): SunburstData {
  if (!data.children) return data
  return {
    ...data,
    children: [...data.children].sort((a, b) => a.name.localeCompare(b.name)),
  }
}

function collectCategoryNames(
  colorMap: Map<string, string>,
  node: SunburstData,
  depth = 0,
  parentColor: string | null = null,
) {
  if (node.name) {
    const color = getConsistentColor(colorMap, colorPalette, node.name, depth, parentColor)
    if (node.children) {
      node.children.forEach((child) => collectCategoryNames(colorMap, child, depth + 1, color))
    }
  }
}

// Rebuild the shared color map so the same category keeps the same color
// across every chart. Replaces the Svelte `globalColorMap.clear()` + refill.
export function buildGlobalColorMap(datasets: SunburstData[]): Map<string, string> {
  const colorMap = new Map<string, string>()
  datasets.forEach((data) => collectCategoryNames(colorMap, data))
  return colorMap
}
