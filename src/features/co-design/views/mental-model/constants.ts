// Ported from JT_dashboard/src/lib/MentalModel/constants.ts. The backend
// address is gone (see ../../api.ts) and the unused `categories` list dropped.

export type CodebookEntry = {
  parent: string
  name: string
  definition: string
  type: string
}

// Map each node_type to a categorical color from app.css. Shared by the
// renderer (circle fill) and the tooltip (header fill) so both stay in sync.
export const nodeTypeColor: Record<string, string> = {
  'impacts salinity': 'var(--cat-1)',
  'impacted by salinity': 'var(--cat-6)',
}
// Contrasting text color paired with each node-type background. Kept here so
// labels/tooltips/legend chips stay in sync with the renderer's fills.
export const nodeTypeTextColor: Record<string, string> = {
  'impacts salinity': 'black',
  'impacted by salinity': 'white',
}
const defaultNodeColor = 'var(--cat-3)'
const defaultNodeTextColor = 'white'
export function colorForNode(nodeType: string | undefined): string {
  return (nodeType && nodeTypeColor[nodeType]) || defaultNodeColor
}
export function textColorForNode(nodeType: string | undefined): string {
  return (nodeType && nodeTypeTextColor[nodeType]) || defaultNodeTextColor
}
