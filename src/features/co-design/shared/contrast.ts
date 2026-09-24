// Pick whichever of two theme text colours has the higher WCAG contrast
// ratio against `background` (any CSS colour string). Cached per input.
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

const contrast = (a: number, b: number) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)

export function readableTextOn(background: string, lightText: string, darkText: string): string {
  const key = `${background}|${lightText}|${darkText}`
  const cached = cache.get(key)
  if (cached) return cached
  const bg = luminance(background)
  const light = luminance(lightText)
  const dark = luminance(darkText)
  const text =
    bg !== null && light !== null && dark !== null && contrast(bg, dark) > contrast(bg, light)
      ? darkText
      : lightText
  cache.set(key, text)
  return text
}
