import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { Box, Button, Stack, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import { jtSpacing } from '../../../theme'
import { resultsOverviewSections } from '../content'
import EvaluationFramework from './EvaluationFramework'

export default function Overview() {
  return (
    <Stack spacing={jtSpacing.section.xl}>
      <Box
        component="section"
        id="modeling-methodology"
        aria-labelledby="modeling-methodology-title"
      >
        <Typography id="modeling-methodology-title" variant="h2">
          How the results are modeled
        </Typography>
        <Typography
          variant="body1"
          sx={{ mt: jtSpacing.gap.md, color: 'base.100', maxWidth: '78ch' }}
        >
          The results compare each future with baseline operations. These technical details explain
          what changes between runs and how to interpret the modeled differences.
        </Typography>
        <Box sx={{ mt: jtSpacing.section.md }}>
          {resultsOverviewSections.map((section) => (
            <Box
              key={section.number}
              component="article"
              sx={{
                display: 'grid',
                gridTemplateColumns: 'auto minmax(0, 1fr)',
                gap: jtSpacing.gap.md,
                py: jtSpacing.section.sm,
                borderTop: 1,
                borderColor: 'border.subtle',
              }}
            >
              <Typography variant="numberArticle" component="p">
                {section.number}
              </Typography>
              <Stack spacing={jtSpacing.gap.sm} sx={{ maxWidth: '78ch' }}>
                <Typography variant="h3" component="h3">
                  {section.title}
                </Typography>
                <Typography variant="body1" sx={{ color: 'base.100' }}>
                  {section.body}
                </Typography>
              </Stack>
            </Box>
          ))}
        </Box>
      </Box>

      <EvaluationFramework />

      <Box
        component="section"
        sx={{ py: jtSpacing.section.lg, borderTop: 1, borderColor: 'border.subtle' }}
      >
        <Stack spacing={jtSpacing.gap.md} sx={{ alignItems: 'flex-start', maxWidth: '78ch' }}>
          <Typography variant="h2">Compare scenario performance</Typography>
          <Typography variant="body1" sx={{ color: 'base.100' }}>
            After reviewing the modeling results and evaluation framework, use the ranking
            visualization to explore how different priorities and weighting choices change which
            futures rise to the top.
          </Typography>
          <Button
            component={Link}
            to="/pages/rank-visualization"
            variant="contained"
            endIcon={<ArrowForwardIcon />}
          >
            Open ranking visualization
          </Button>
        </Stack>
      </Box>
    </Stack>
  )
}
