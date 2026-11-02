import type { Map as MapboxMap } from 'mapbox-gl'

export const scenarioPatternIds = {
  dots: 'scenario-pattern-dots',
  diagonal: 'scenario-pattern-diagonal',
  crosshatch: 'scenario-pattern-crosshatch',
  horizontal: 'scenario-pattern-horizontal',
} as const

export type ScenarioPattern = keyof typeof scenarioPatternIds

export const scenarioMarkerIds = {
  square: 'scenario-marker-square',
  squareSelected: 'scenario-marker-square-selected',
} as const

function createPattern(pattern: ScenarioPattern, color: string) {
  const size = 16
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Unable to create scenario map pattern')

  context.strokeStyle = color
  context.fillStyle = color
  context.lineWidth = 1.5

  if (pattern === 'dots') {
    ;[
      [4, 4],
      [12, 12],
    ].forEach(([x, y]) => {
      context.beginPath()
      context.arc(x, y, 1.5, 0, Math.PI * 2)
      context.fill()
    })
  } else if (pattern === 'horizontal') {
    context.beginPath()
    context.moveTo(0, 4)
    context.lineTo(size, 4)
    context.moveTo(0, 12)
    context.lineTo(size, 12)
    context.stroke()
  } else {
    context.beginPath()
    context.moveTo(-4, 4)
    context.lineTo(4, -4)
    context.moveTo(0, 16)
    context.lineTo(16, 0)
    context.moveTo(12, 20)
    context.lineTo(20, 12)
    if (pattern === 'crosshatch') {
      context.moveTo(-4, 12)
      context.lineTo(4, 20)
      context.moveTo(0, 0)
      context.lineTo(16, 16)
      context.moveTo(12, -4)
      context.lineTo(20, 4)
    }
    context.stroke()
  }

  return context.getImageData(0, 0, size, size)
}

function createSquareMarker(fill: string, stroke: string) {
  const size = 36
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Unable to create scenario map marker')

  context.fillStyle = fill
  context.strokeStyle = stroke
  context.lineWidth = 4
  context.fillRect(4, 4, size - 8, size - 8)
  context.strokeRect(4, 4, size - 8, size - 8)

  return context.getImageData(0, 0, size, size)
}

/** Circle layers cannot draw squares, so square point symbols use these images. */
export function registerScenarioMarkers(
  map: MapboxMap,
  { fill, selected, stroke }: { fill: string; selected: string; stroke: string },
) {
  if (!map.hasImage(scenarioMarkerIds.square)) {
    map.addImage(scenarioMarkerIds.square, createSquareMarker(fill, stroke), { pixelRatio: 2 })
  }
  if (!map.hasImage(scenarioMarkerIds.squareSelected)) {
    map.addImage(scenarioMarkerIds.squareSelected, createSquareMarker(selected, stroke), {
      pixelRatio: 2,
    })
  }
}

export function registerScenarioPatterns(map: MapboxMap, color: string) {
  ;(Object.keys(scenarioPatternIds) as ScenarioPattern[]).forEach((pattern) => {
    const id = scenarioPatternIds[pattern]
    if (!map.hasImage(id)) map.addImage(id, createPattern(pattern, color), { pixelRatio: 2 })
  })
}
