import AppRouter from './AppRouter'
import { ScrollToTop } from '@/ui'

export default function PublicSiteShell() {
  return (
    <>
      <ScrollToTop />
      <AppRouter />
    </>
  )
}
