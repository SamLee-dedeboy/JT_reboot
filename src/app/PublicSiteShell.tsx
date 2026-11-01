import AppRouter from './AppRouter'
import Screensaver from './Screensaver'
import ScrollToTop from '../ui/ScrollToTop'

export default function PublicSiteShell() {
  return (
    <>
      <ScrollToTop />
      <AppRouter />
      <Screensaver />
    </>
  )
}
