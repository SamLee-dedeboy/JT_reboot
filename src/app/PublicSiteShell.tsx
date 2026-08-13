import AppRouter from './AppRouter'
import ScrollToTop from '../ui/ScrollToTop'

export default function PublicSiteShell() {
  return (
    <>
      <ScrollToTop />
      <AppRouter />
    </>
  )
}
