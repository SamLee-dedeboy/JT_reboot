import { Box, Container, Typography } from '@mui/material';
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
      <Box component="main" className="page-layout">
        <Box className="page-hero">
          <Container>
            <Typography variant="h1" component="h1" className="page-title">{title}</Typography>
          </Container>
        </Box>
        <Box className={contentClassName}>
          {children}
        </Box>
      </Box>
      <Footer />
    </>
  );
}
