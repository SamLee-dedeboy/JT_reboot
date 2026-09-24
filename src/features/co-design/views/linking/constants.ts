// Ported from JT_dashboard/src/lib/Linking/constants.ts. The server address is
// gone (data comes from ../../api); the Linking view keeps its own category
// palette, which differs from shared/colors.ts's bubble_color.
import * as d3 from 'd3'

const sub_categories = ['Drivers', 'Strategies', 'Value', 'Governance']
// Categorical colors defined in base.css (--cat-1 ... --cat-4).
// Using CSS var() strings so SVG fills pick up theme values directly.
const category_palette = ['var(--cat-1)', 'var(--cat-2)', 'var(--cat-3)', 'var(--cat-4)']
export const bubble_color = d3.scaleOrdinal(sub_categories, category_palette)
export { contrastTextColor } from '../../shared/colors'
