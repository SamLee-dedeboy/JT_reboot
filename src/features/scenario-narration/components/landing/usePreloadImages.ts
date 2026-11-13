import { useEffect } from 'react'

/** Warms the browser cache in idle time so each panel's photo is ready when it is reached. */
export default function usePreloadImages(urls: string[]) {
  useEffect(() => {
    const load = () =>
      urls.forEach((url) => {
        const image = new Image()
        image.decoding = 'async'
        image.src = url
      })
    // Safari has no requestIdleCallback; a short timeout keeps the hero first there too.
    if (typeof window.requestIdleCallback === 'function') {
      // The timeout guarantees the load even when animation keeps the page from going idle.
      const handle = window.requestIdleCallback(load, { timeout: 1500 })
      return () => window.cancelIdleCallback(handle)
    }
    const handle = window.setTimeout(load, 200)
    return () => window.clearTimeout(handle)
  }, [urls])
}
