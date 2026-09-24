import type { Map as MapboxMap } from 'mapbox-gl'

export const regionalPatternIds = {
  saltier: 'regional-saltier-noise',
  fresher: 'regional-fresher-noise',
  flipping: 'regional-flipping-noise',
  unclear: 'regional-unclear-noise',
} as const

function createNoisePattern(color: string, seedValue: number) {
  const size = 32
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Unable to create regional polygon pattern')

  let seed = seedValue
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      seed ^= seed << 13
      seed ^= seed >>> 17
      seed ^= seed << 5
      if ((seed >>> 0) % 5 === 0) {
        context.globalAlpha = 0.2 + ((seed >>> 8) % 38) / 100
        context.fillStyle = color
        context.fillRect(x, y, 1, 1)
      }
    }
  }

  return context.getImageData(0, 0, size, size)
}

function createFlippingStripePattern(saltierColor: string, fresherColor: string) {
  const size = 32
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Unable to create regional polygon pattern')

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      context.fillStyle = (x + y) % 16 < 8 ? saltierColor : fresherColor
      context.fillRect(x, y, 1, 1)
    }
  }

  return context.getImageData(0, 0, size, size)
}

export function registerRegionalPolygonPatterns(
  map: MapboxMap,
  colors: Record<keyof typeof regionalPatternIds, string>,
) {
  const patterns = [
    ['saltier', 0x00fb0169],
    ['fresher', 0x0077d6d7],
    ['flipping', 0x00f2c820],
    ['unclear', 0x009ba2a4],
  ] as const

  patterns.forEach(([trend, seed]) => {
    const id = regionalPatternIds[trend]
    if (map.hasImage(id)) return

    const flipping = trend === 'flipping'
    map.addImage(
      id,
      flipping
        ? createFlippingStripePattern(colors.saltier, colors.fresher)
        : createNoisePattern(colors[trend], seed),
      { pixelRatio: flipping ? 2 : 1 },
    )
  })
}
