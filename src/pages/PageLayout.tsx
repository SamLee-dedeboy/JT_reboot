import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface PageLayoutProps {
  title: string;
  children: React.ReactNode;
}

export default function PageLayout({ title, children }: PageLayoutProps) {
  return (
    <>
      <Navbar />
      <main className="page-layout">
        <div className="page-hero">
          <div className="container">
            <h1 className="page-title">{title}</h1>
          </div>
        </div>
        <div className="page-content container">
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}
