/** Paints a section band edge to edge while its content stays in the page grid. */
export const fullBleedBand = (color: string) => ({
  backgroundColor: color,
  boxShadow: `0 0 0 100vmax ${color}`,
  clipPath: 'inset(0 -100vmax)',
})
