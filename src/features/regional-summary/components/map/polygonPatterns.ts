import type { Map as MapboxMap } from 'mapbox-gl'
import { palette } from '../../../../theme/muiTheme'

export const STRIPE_PATTERN_ID = 'primary-pink-stripes'
export const DOT_PATTERN_ID = 'primary-pink-dots'
export const NOISE_PATTERN_ID = 'primary-pink-noise'

function createPattern(
  size: number,
  draw: (context: CanvasRenderingContext2D, size: number) => void,
) {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size

  const context = canvas.getContext('2d')
  if (!context) throw new Error('Unable to create polygon pattern canvas')

  draw(context, size)
  return context.getImageData(0, 0, size, size)
}

function createStripePattern() {
  return createPattern(32, (context, size) => {
    context.fillStyle = palette.brand.primaryPink

    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        if ((x + y) % 16 < 2) context.fillRect(x, y, 1, 1)
      }
    }
  })
}

function createDotPattern() {
  return createPattern(16, (context, size) => {
    context.fillStyle = palette.brand.primaryPink

    for (let y = 4; y < size; y += 8) {
      for (let x = 4; x < size; x += 8) {
        context.beginPath()
        context.arc(x, y, 1.25, 0, Math.PI * 2)
        context.fill()
      }
    }
  })
}

function createNoisePattern() {
  return createPattern(32, (context, size) => {
    let seed = 0x00fb0169

    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        seed ^= seed << 13
        seed ^= seed >>> 17
        seed ^= seed << 5

        if ((seed >>> 0) % 5 === 0) {
          const alpha = 0.18 + ((seed >>> 8) % 40) / 100
          context.fillStyle = `rgba(251, 1, 105, ${alpha})`
          context.fillRect(x, y, 1, 1)
        }
      }
    }
  })
}

export function registerPolygonPatterns(map: MapboxMap) {
  const patterns = [
    { id: STRIPE_PATTERN_ID, image: createStripePattern(), pixelRatio: 2 },
    { id: DOT_PATTERN_ID, image: createDotPattern(), pixelRatio: 1 },
    { id: NOISE_PATTERN_ID, image: createNoisePattern(), pixelRatio: 1 },
  ] as const

  patterns.forEach(({ id, image, pixelRatio }) => {
    if (!map.hasImage(id)) map.addImage(id, image, { pixelRatio })
  })
}
