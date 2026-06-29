import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TuneIcon from '@mui/icons-material/Tune';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import ScrollReveal from '../animation/ScrollReveal';
import Footer from '../common/Footer';
import Navbar from '../common/Navbar';

export default function ScenariosKeyParametersPage() {
  return (
    <>
      <Navbar />
      <Box component="main" sx={{ minHeight: '70vh', bgcolor: 'base.800', color: 'common.white' }}>
        <Container maxWidth="lg" sx={{ py: { xs: 7, md: 10 } }}>
          <ScrollReveal>
            <Stack spacing={2.5} sx={{ maxWidth: 780 }}>
              <Button
                component={Link}
                to="/scenarios"
                startIcon={<ArrowBackIcon />}
                sx={{
                  alignSelf: 'flex-start',
                  color: 'base.100',
                  border: '1px solid rgba(155,162,164,0.24)',
                  bgcolor: 'rgba(81,93,97,0.18)',
                  '&:hover': { color: 'common.white', bgcolor: 'rgba(126,217,87,0.18)' },
                }}
              >
                Scenarios
              </Button>
              <Box
                sx={{
                  typography: 'eyebrow',
                  color: 'primary.main',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <TuneIcon fontSize="small" />
                Baseline
              </Box>
              <Typography variant="h1" component="h1" sx={{ maxWidth: '15ch' }}>
                Key parameters
              </Typography>
              <Typography variant="body1" sx={{ maxWidth: '58ch', color: 'base.100' }}>
                Placeholder page for the baseline scenario parameters. This will hold the modeling assumptions, boundary conditions, and comparison inputs for the baseline scenario.
              </Typography>
            </Stack>
          </ScrollReveal>
        </Container>
      </Box>
      <Footer />
    </>
  );
}
