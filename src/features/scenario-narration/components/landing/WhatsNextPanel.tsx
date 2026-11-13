import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { Box, Button, Stack, Typography, useTheme } from '@mui/material'
import { Link } from 'react-router-dom'
import { NEXT_STEPS } from '@/content/landing'

export default function WhatsNextPanel() {
  const theme = useTheme()

  return (
    <Box sx={{ width: 1, height: 1, overflowY: 'auto' }}>
      <Box
        sx={{
          width: { xs: '90%', lg: '70dvw' },
          mx: 'auto',
          py: { xs: theme.jtSpacing.section.lg, md: theme.jtSpacing.section.xl },
        }}
      >
        <Typography variant="h1" component="h2">
          What's next?
        </Typography>
        <Typography
          variant="bodyLarge"
          sx={{
            mt: theme.jtSpacing.component.lg,
            maxWidth: '100ch',
            color: 'common.white',
          }}
        >
          <Box component="span" sx={{ color: 'primary.main' }}>
            Dive deeper into the scenarios
          </Box>{' '}
          {'—'} see how each future is modeled, review how the criteria evaluate them, and compare
          the scenarios from diverse perspectives through visualizations.
        </Typography>

        <Box
          sx={{
            mt: theme.jtSpacing.section.lg,
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr)',
            rowGap: theme.jtSpacing.section.md,
            width: 1,
          }}
        >
          {NEXT_STEPS.map((item) => (
            <Box
              key={item.number}
              component="article"
              sx={{
                pt: theme.jtSpacing.component.md,
                borderTop: 1,
                borderColor: 'border.subtle',
                display: 'grid',
                gridTemplateColumns: 'auto minmax(0, 1fr)',
                columnGap: theme.jtSpacing.gap.md,
                rowGap: theme.jtSpacing.gap.sm,
                alignItems: 'start',
              }}
            >
              <Typography variant="numberBadge" component="p" sx={{ gridColumn: 1 }}>
                {item.number}
              </Typography>
              <Stack spacing={theme.jtSpacing.gap.sm} sx={{ gridColumn: 2 }}>
                <Typography variant="h4" component="h3">
                  {item.title}
                </Typography>
                <Typography variant="body2" sx={{ maxWidth: '80ch' }}>
                  {item.body}
                </Typography>
                <Button
                  component={Link}
                  to={item.href}
                  variant="contained"
                  endIcon={<ArrowForwardIcon />}
                  sx={{ alignSelf: 'flex-start' }}
                >
                  {item.label}
                </Button>
              </Stack>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  )
}
