// Shared repository-page shell: navbar, the three-page tabs, the hero, the page body (beside
// an "On this page" rail when the page has sections) and the footer.
import type { ReactNode } from 'react'
import { Container } from '@mui/material'
import { Footer, Navbar, PageRail, RailGrid, type NavRailItem } from '@/ui'
import { jtSpacing } from '@/theme'
import RepoHero from './RepoHero'
import RepoTabs, { type RepoTabKey } from './RepoTabs'

interface RepoLayoutProps {
  title: ReactNode
  lede: string
  current: RepoTabKey
  /** A photograph behind the hero. */
  heroImage?: string
  /** The page's sections, listed in the "On this page" rail. */
  rail?: NavRailItem[]
  children: ReactNode
}

export default function RepoLayout({
  title,
  lede,
  current,
  heroImage,
  rail,
  children,
}: RepoLayoutProps) {
  return (
    <>
      <Navbar />
      <RepoTabs current={current} />
      <RepoHero title={title} lede={lede} image={heroImage} />
      <Container
        component="main"
        maxWidth={false}
        sx={{ width: '90dvw', px: 0, pb: { xs: jtSpacing.section.md, md: jtSpacing.section.xl } }}
      >
        {rail ? (
          <RailGrid rail={<PageRail items={rail} ariaLabel="Page sections" />}>{children}</RailGrid>
        ) : (
          children
        )}
      </Container>
      <Footer />
    </>
  )
}
