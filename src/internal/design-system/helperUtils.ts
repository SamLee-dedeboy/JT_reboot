export type TypographyToken = {
  fontSize?: string | number
  fontWeight?: string | number
  lineHeight?: string | number
  fontFamily?: string
}

function splitTopLevelCommas(value: string) {
  const parts: string[] = []
  let depth = 0
  let start = 0

  for (let index = 0; index < value.length; index += 1) {
    const char = value[index]

    if (char === '(') {
      depth += 1
    } else if (char === ')') {
      depth -= 1
    } else if (char === ',' && depth === 0) {
      parts.push(value.slice(start, index).trim())
      start = index + 1
    }
  }

  parts.push(value.slice(start).trim())
  return parts
}

function evaluateLengthExpression(
  expression: string,
  rootFontSizePx: number,
  viewportWidthPx: number,
) {
  const compact = expression.replace(/\s+/g, '')
  const tokens = compact.match(/[+-]?[^+-]+/g)

  if (!tokens) {
    return null
  }

  let total = 0

  for (const token of tokens) {
    const sign = token.startsWith('-') ? -1 : 1
    const rawValue = token.replace(/^[-+]/, '')
    const numericValue = Number.parseFloat(rawValue)

    if (Number.isNaN(numericValue)) {
      return null
    }

    if (rawValue.endsWith('px')) {
      total += sign * numericValue
    } else if (rawValue.endsWith('rem')) {
      total += sign * numericValue * rootFontSizePx
    } else if (rawValue.endsWith('vw')) {
      total += sign * numericValue * viewportWidthPx * 0.01
    } else {
      return null
    }
  }

  return total
}

function formatLengthExpression(expression: string) {
  return expression.replace(/\s+/g, ' ').trim()
}

export function describeTypographyFontSize(
  fontSize: TypographyToken['fontSize'],
  rootFontSizePx: number,
  viewportWidthPx: number,
) {
  if (typeof fontSize === 'number') {
    return {
      resolved: `${fontSize}px`,
      branch: 'fixed' as const,
      picked: `${fontSize}px`,
    }
  }

  if (typeof fontSize !== 'string') {
    return {
      resolved: 'inherit',
      branch: 'fixed' as const,
      picked: 'inherit',
    }
  }

  const trimmed = fontSize.trim()

  if (!trimmed.startsWith('clamp(') || !trimmed.endsWith(')')) {
    return {
      resolved: trimmed,
      branch: 'fixed' as const,
      picked: trimmed,
    }
  }

  const inner = trimmed.slice(6, -1)
  const [minExpression, preferredExpression, maxExpression] = splitTopLevelCommas(inner)

  if (!minExpression || !preferredExpression || !maxExpression) {
    return {
      resolved: trimmed,
      branch: 'fixed' as const,
      picked: trimmed,
    }
  }

  const minPx = evaluateLengthExpression(minExpression, rootFontSizePx, viewportWidthPx)
  const preferredPx = evaluateLengthExpression(preferredExpression, rootFontSizePx, viewportWidthPx)
  const maxPx = evaluateLengthExpression(maxExpression, rootFontSizePx, viewportWidthPx)

  if (minPx === null || preferredPx === null || maxPx === null) {
    return {
      resolved: trimmed,
      branch: 'fixed' as const,
      picked: trimmed,
    }
  }

  const resolvedPx = Math.min(Math.max(preferredPx, minPx), maxPx)
  let branch: 'min' | 'preferred' | 'max' = 'preferred'
  let picked = formatLengthExpression(preferredExpression)

  if (resolvedPx === minPx) {
    branch = 'min'
    picked = formatLengthExpression(minExpression)
  } else if (resolvedPx === maxPx) {
    branch = 'max'
    picked = formatLengthExpression(maxExpression)
  }

  return {
    resolved: `${resolvedPx.toFixed(2)}px`,
    branch,
    picked,
  }
}
