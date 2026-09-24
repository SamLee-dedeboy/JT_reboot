// Pick whichever of two theme text colours reads better on `background`
// (any CSS colour string). Results are cached per input.
const cache = new Map<string, string>()

function luminance(color: string): number | null {
  const probe = document.createElement('span')
  probe.style.color = color
  probe.style.display = 'none'
  document.body.appendChild(probe)
  const resolved = getComputedStyle(probe).color
  probe.remove()
  const channels = resolved.match(/\d+(\.\d+)?/g)
  if (!channels || channels.length < 3) return null
  const [r, g, b] = channels.slice(0, 3).map(Number)
  const toLinear = (c: number) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  }
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b)
}

export function readableTextOn(background: string, lightText: string, darkText: string): string {
  const key = `${background}|${lightText}|${darkText}`
  const cached = cache.get(key)
  if (cached) return cached
  const L = luminance(background)
  const text = L !== null && L > 0.5 ? darkText : lightText
  cache.set(key, text)
  return text
}
