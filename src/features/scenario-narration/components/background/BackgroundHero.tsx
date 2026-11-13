import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import WavesIcon from '@mui/icons-material/Waves'
import { Box, Button, Container, Stack, Typography, alpha } from '@mui/material'
import { Link } from 'react-router-dom'
import { ScrollReveal } from '@/ui'

const eyebrowSx = {
  typography: 'eyebrow',
  color: 'primary.main',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 1,
} as const

/** Back link, title and one-line primer at the top of the Background page. */
export default function BackgroundHero() {
  return (
    <Box
      component="header"
      sx={{
        bgcolor: 'base.900',
        color: 'common.white',
        borderBottom: 1,
        borderColor: 'border.default',
      }}
    >
      <Container maxWidth="lg" sx={{ py: { xs: 4.5, md: 6 } }}>
        <ScrollReveal>
          <Stack spacing={2.5} sx={{ maxWidth: 840 }}>
            <Button
              component={Link}
              to="/scenarios"
              startIcon={<ArrowBackIcon />}
              sx={{
                alignSelf: 'flex-start',
                color: 'base.100',
                border: 1,
                borderColor: 'border.default',
                bgcolor: (theme) => alpha(theme.palette.base[400], 0.18),
                '&:hover': { color: 'common.white', bgcolor: 'translucent.primaryGreen' },
              }}
            >
              Scenarios
            </Button>
            <Box sx={eyebrowSx}>
              <WavesIcon fontSize="small" />
              Background Context
            </Box>
            <Typography variant="h1" component="h1" sx={{ maxWidth: '17ch' }}>
              Delta salinity basics
            </Typography>
            <Typography variant="body1" sx={{ maxWidth: '62ch', color: 'base.100' }}>
              A short primer for reading the scenario maps: where the rivers meet, why outflow
              matters, and how X2 tracks the balance between freshwater and saltwater.
            </Typography>
          </Stack>
        </ScrollReveal>
      </Container>
    </Box>
  )
}
