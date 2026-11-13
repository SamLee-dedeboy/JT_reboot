// Every table row by id, for the cell lookups in ./cellValue.ts. The ranking trees
// register their rows here when they are built, so every lookup reads through one index.
import type { CriterionNode } from './criteria'

export const NODE_INDEX = new Map<string, CriterionNode>()

/** Adds a row and everything under it to the index; a later row with the same id wins. */
export function registerNodes(node: CriterionNode) {
  NODE_INDEX.set(node.id, node)
  node.children?.forEach(registerNodes)
}
