// Writes the ◆ and ◇ glyphs the Scenario Explorer's D-1641 markers use offline.
// Proxima Nova has no glyphs in this range and the online stack comes from Mapbox,
// so the shapes are drawn here as signed distance fields, which keeps the marker
// layer's text color and halo working. Mapbox glyph metrics assume a 24px em.
//
//   node scripts/build-offline-marker-glyphs.mjs
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const FONT = 'Proxima Nova Semibold'
const RANGE = '9472-9727'
const OUTPUT = join(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  'public',
  'fonts',
  FONT,
  `${RANGE}.pbf`,
)

const EM = 24
const BUFFER = 3
const SDF_RADIUS = 8
const SDF_CUTOFF = 0.25
const HALF_SIZE = 6
const OUTLINE_HALF_WIDTH = 0.7
// Mapbox places a line's baseline at -17, so this top centers the glyph on its anchor.
const TOP = HALF_SIZE - 17

const diamondDistance = (x, y) => (Math.abs(x) + Math.abs(y) - HALF_SIZE) / Math.SQRT2
const GLYPHS = [
  { id: 0x25c6, distance: diamondDistance },
  { id: 0x25c7, distance: (x, y) => Math.abs(diamondDistance(x, y)) - OUTLINE_HALF_WIDTH },
]

function bitmap(distance) {
  const size = HALF_SIZE * 2 + BUFFER * 2
  const pixels = new Uint8Array(size * size)
  for (let row = 0; row < size; row++) {
    for (let column = 0; column < size; column++) {
      const value = distance(column + 0.5 - size / 2, row + 0.5 - size / 2)
      const encoded = 255 - 255 * (value / SDF_RADIUS + SDF_CUTOFF)
      pixels[row * size + column] = Math.max(0, Math.min(255, Math.round(encoded)))
    }
  }
  return pixels
}

function varint(value) {
  const bytes = []
  while (value > 127) {
    bytes.push((value & 127) | 128)
    value >>>= 7
  }
  bytes.push(value)
  return bytes
}
const uintField = (field, value) => [...varint(field << 3), ...varint(value)]
const sintField = (field, value) => uintField(field, value < 0 ? -value * 2 - 1 : value * 2)
const bytesField = (field, bytes) => [
  ...varint((field << 3) | 2),
  ...varint(bytes.length),
  ...bytes,
]
const stringField = (field, text) => bytesField(field, [...Buffer.from(text)])

const glyphs = GLYPHS.flatMap(({ id, distance }) =>
  bytesField(3, [
    ...uintField(1, id),
    ...bytesField(2, [...bitmap(distance)]),
    ...uintField(3, HALF_SIZE * 2),
    ...uintField(4, HALF_SIZE * 2),
    ...sintField(5, (EM - HALF_SIZE * 2) / 2),
    ...sintField(6, TOP),
    ...uintField(7, EM),
  ]),
)
const fontstack = bytesField(1, [...stringField(1, FONT), ...stringField(2, RANGE), ...glyphs])

mkdirSync(dirname(OUTPUT), { recursive: true })
writeFileSync(OUTPUT, Uint8Array.from(fontstack))
console.log(`Wrote ${OUTPUT} (${fontstack.length} bytes)`)
