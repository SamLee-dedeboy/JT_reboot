/** Prefix a path with the Vite base URL so assets resolve on GitHub Pages. */
export function assetUrl(path: string): string {
  const base = import.meta.env.BASE_URL
  // path starts with "/" — strip it so we don't get double slashes
  return base + path.replace(/^\//, '')
}
