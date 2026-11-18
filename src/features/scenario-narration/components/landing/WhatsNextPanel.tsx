import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { Box, Button, Stack, Typography, useTheme } from '@mui/material'
import { Link } from 'react-router-dom'
import { NEXT_STEPS } from '@/content/landing'

/**
 * Its title, lead and steps use the same type as the other landing sections (h2 and body1;
 * numberArticle, h3 and body1 per step). From lg up this sits in a pinned, viewport-high panel. At lg only (laptops), the steps go
 * side by side so the panel fits a laptop's height without scrolling inside itself.
 */
export default function WhatsNextPanel() {
  const theme = useTheme()
  const lgOnly = theme.breakpoints.only('lg')

  return (
    <Box
      sx={{
        width: 1,
        height: 1,
        overflowY: 'auto',
        [lgOnly]: { display: 'flex', alignItems: 'center' },
      }}
    >
      <Box
        sx={{
          // Below lg the words line up with the other sections' page inset.
          width: { lg: '70dvw' },
          mx: { lg: 'auto' },
          px: { ...theme.jtSpacing.page.x, lg: 0 },
          py: { xs: theme.jtSpacing.section.lg, md: theme.jtSpacing.section.xl },
          [lgOnly]: { width: '88%', py: theme.spacing(theme.jtSpacing.section.md) },
        }}
      >
        <Typography variant="h2" component="h2">
          What's next?
        </Typography>
        <Typography
          variant="body1"
          sx={{
            mt: theme.jtSpacing.gap.md,
            maxWidth: '58ch',
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
            [lgOnly]: {
              mt: theme.spacing(theme.jtSpacing.section.md),
              gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
              columnGap: theme.spacing(theme.jtSpacing.gap.xl),
            },
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
                // Number above the title; the button pinned to the bottom of each column.
                [lgOnly]: {
                  gridTemplateColumns: 'minmax(0, 1fr)',
                  gridTemplateRows: 'auto 1fr',
                  alignItems: 'stretch',
                },
              }}
            >
              <Typography variant="numberArticle" component="p">
                {item.number}
              </Typography>
              <Stack spacing={theme.jtSpacing.gap.sm}>
                <Typography variant="h3" component="h3">
                  {item.title}
                </Typography>
                <Typography variant="body1" sx={{ maxWidth: '48ch', color: 'base.100' }}>
                  {item.body}
                </Typography>
                <Button
                  component={Link}
                  to={item.href}
                  variant="contained"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    alignSelf: 'flex-start',
                    [lgOnly]: { whiteSpace: 'nowrap', mt: 'auto !important' },
                  }}
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
