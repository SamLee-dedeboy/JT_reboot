// Ported from JT_dashboard/src/lib/MentalModel/constants.ts. The backend
// address is gone (see ../../api.ts) and the unused `categories` list dropped.

export type CodebookEntry = {
  parent: string
  name: string
  definition: string
  type: string
}

// Codebook `type` values that split the model into its two halves.
export const DRIVER_TYPE = 'impacts salinity'
export const IMPACT_TYPE = 'impacted by salinity'

// Node fills from theme.coDesign.mentalModel.node.
export type NodeColors = { driver: string; impact: string; other: string }

// Map a node's codebook type to its fill. Shared by the renderer (circle fill)
// and the tooltip (header fill) so both stay in sync.
export function colorForNode(nodeType: string | undefined, colors: NodeColors): string {
  if (nodeType === DRIVER_TYPE) return colors.driver
  if (nodeType === IMPACT_TYPE) return colors.impact
  return colors.other
}
