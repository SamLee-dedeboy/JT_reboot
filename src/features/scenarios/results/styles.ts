/** One color per water year type, in every timeline on the modeling page, lighter for wetter years. */
export const waterYearColor = {
  wet: 'base.400',
  dry: 'base.500',
  critical: 'base.600',
} as const

/** Paints a section band edge to edge while its content stays in the page grid. */
export const fullBleedBand = (color: string) => ({
  backgroundColor: color,
  boxShadow: `0 0 0 100vmax ${color}`,
  clipPath: 'inset(0 -100vmax)',
})
