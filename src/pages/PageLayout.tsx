import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface PageLayoutProps {
  title: string;
  children: React.ReactNode;
  fullWidthContent?: boolean;
}

export default function PageLayout({ title, children, fullWidthContent = false }: PageLayoutProps) {
  const contentClassName = fullWidthContent ? 'page-content page-content-full' : 'page-content container';

  return (
    <>
      <Navbar />
      <main className="page-layout">
        <div className="page-hero">
          <div className="container">
            <h1 className="page-title">{title}</h1>
          </div>
        </div>
        <div className={contentClassName}>
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}
