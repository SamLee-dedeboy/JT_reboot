import { palette } from '../../theme/index'
import type { RangeMode } from './types'

export const chartTransition = { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const }

export const formatNumber = (value: number | null | undefined, digits = 2) =>
  value == null
    ? '—'
    : (Math.abs(value) < 0.5 * 10 ** -digits ? 0 : value).toLocaleString(undefined, {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
      })

export const formatDate = (value: string) =>
  new Date(`${value}T12:00:00`).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

export const quantile = (values: number[], fraction: number): number | null => {
  if (!values.length) return null
  const sorted = [...values].sort((a, b) => a - b)
  const position = (sorted.length - 1) * fraction
  const lower = Math.floor(position)
  const upper = Math.ceil(position)
  const weight = position - lower
  return sorted[lower] * (1 - weight) + sorted[upper] * weight
}

const sortedQuantile = (sorted: number[], fraction: number): number | null => {
  if (!sorted.length) return null
  const position = (sorted.length - 1) * fraction
  const lower = Math.floor(position)
  const upper = Math.ceil(position)
  const weight = position - lower
  return sorted[lower] * (1 - weight) + sorted[upper] * weight
}

const mean = (values: number[]) => values.reduce((sum, value) => sum + value, 0) / values.length

/** One date's stations under the chosen spread: its range, and the average of what falls inside. */
export const summarizeSpread = (values: number[], rangeMode: RangeMode) => {
  if (!values.length) return { average: null, low: null, high: null }
  const sorted = [...values].sort((a, b) => a - b)
  if (rangeMode === 'minmax')
    return { average: mean(values), low: sorted[0], high: sorted[sorted.length - 1] }
  const [lowFraction, highFraction] = rangeMode === 'p90' ? [0.05, 0.95] : [0.25, 0.75]
  const low = sortedQuantile(sorted, lowFraction)!
  const high = sortedQuantile(sorted, highFraction)!
  const inside = sorted.filter((value) => value >= low && value <= high)
  return { average: mean(inside.length ? inside : sorted), low, high }
}

const rgbChannels = (hex: string) =>
  [1, 3, 5].map((offset) => Number.parseInt(hex.slice(offset, offset + 2), 16))

export const valueColor = (value: number | null, extent: number) => {
  if (value == null) return palette.base[300]
  const amount = Math.min(1, Math.abs(value) / (extent || 1))
  if (Math.abs(value) < extent * 0.015) return palette.base[200]
  const target = rgbChannels(value > 0 ? palette.salinity.pink : palette.salinity.teal)
  const base = rgbChannels(palette.base[200])
  const weight = 0.3 + amount * 0.7
  return `rgb(${base.map((channel, index) => Math.round(channel + (target[index] - channel) * weight)).join(',')})`
}
