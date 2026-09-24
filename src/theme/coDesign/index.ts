// Semantic tokens for the co-design dashboard, grouped by view so each view's
// visual decisions stay together. Exposed as theme.coDesign.
import { flow } from './flow'
import { linking } from './linking'
import { mentalModel } from './mentalModel'
import { shell } from './shell'
import { sunburst } from './sunburst'

export const coDesign = { shell, flow, linking, mentalModel, sunburst } as const
