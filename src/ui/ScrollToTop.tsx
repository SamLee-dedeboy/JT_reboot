import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToTop() {
  const { pathname, hash } = useLocation()

  // A new page opens at the top with no visible scroll: 'instant' overrides the global
  // `scroll-behavior: smooth` (which 'auto' would inherit), and the layout effect runs
  // before the new page paints.
  useLayoutEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    }
  }, [pathname, hash])

  return null
}
