import AppRouter from './AppRouter'
import Screensaver from './Screensaver'
import { ScrollToTop } from '@/ui'

export default function PublicSiteShell() {
  return (
    <>
      <ScrollToTop />
      <AppRouter />
      <Screensaver />
    </>
  )
}
