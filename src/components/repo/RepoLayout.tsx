import type { ReactNode } from 'react';
import Navbar from '../Navbar';
import RepoHero from './RepoHero';
import RepoFooter from './RepoFooter';
import type { RepoTabKey } from './RepoTabs';

interface RepoLayoutProps {
  eyebrow: string;
  title: ReactNode;
  lede: string;
  current: RepoTabKey;
  meta?: ReactNode;
  children: ReactNode;
}

/** Page wrapper for the repository pages: Navbar + RepoHero + content + RepoFooter. */
export default function RepoLayout({ eyebrow, title, lede, current, meta, children }: RepoLayoutProps) {
  return (
    <>
      <Navbar />
      <RepoHero eyebrow={eyebrow} title={title} lede={lede} current={current} meta={meta} />
      <main>{children}</main>
      <RepoFooter />
    </>
  );
}
