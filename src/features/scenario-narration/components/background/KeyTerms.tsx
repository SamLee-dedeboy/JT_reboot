import { Box, Typography, alpha } from '@mui/material'
import { baselineKeyTerms } from '@/content/background'
import { ScrollReveal } from '@/ui'

/** The glossary under the chapters. */
export default function KeyTerms() {
  return (
    <ScrollReveal>
      <Box component="section" id="key-terms" sx={{ scrollMarginTop: 104, py: { xs: 4, md: 5 } }}>
        <Typography variant="eyebrow" component="p" sx={{ color: 'secondary.light', mb: 2 }}>
          Key Terms
        </Typography>
        <Box sx={{ borderTop: '2px solid', borderColor: 'primary.main' }}>
          {baselineKeyTerms.map(([term, definition]) => (
            <Box
              key={term}
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '170px minmax(0, 1fr)' },
                gap: { xs: 0.6, sm: 2.5 },
                py: 2,
                borderBottom: 1,
                borderColor: (theme) => alpha(theme.palette.base[200], 0.18),
              }}
            >
              <Typography variant="h5" component="h3" sx={{ color: 'common.white' }}>
                {term}
              </Typography>
              <Typography variant="body2" sx={{ color: 'base.100' }}>
                {definition}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </ScrollReveal>
  )
}
