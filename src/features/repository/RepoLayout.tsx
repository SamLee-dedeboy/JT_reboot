// Shared repository-page shell that wraps content with the global navbar and
// footer.
import type { ReactNode } from 'react'
import Navbar from '../../ui/Navbar'
import Footer from '../../ui/Footer'
import RepoHero from './RepoHero'
import RepoTabs, { type RepoTabKey } from './RepoTabs'

interface RepoLayoutProps {
  title: ReactNode
  lede: string
  current: RepoTabKey
  meta?: ReactNode
  children: ReactNode
}

/** Page wrapper for the repository pages: Navbar + RepoHero + content + shared Footer. */
export default function RepoLayout({ title, lede, current, meta, children }: RepoLayoutProps) {
  return (
    <>
      <Navbar />
      <RepoTabs current={current} />
      <RepoHero title={title} lede={lede} meta={meta} />
      <main>{children}</main>
      <Footer />
    </>
  )
}
