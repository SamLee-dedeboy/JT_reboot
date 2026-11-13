import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { Button, Stack, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import type { ScenarioContent } from '@/content/scenarios'
import { jtSpacing } from '@/theme'
import HighlightedParagraph from './HighlightedParagraph'

/** The closing paragraph and the way on to the modeling results. */
export default function StoryClosing({
  scenario,
  boldPrimaryBlue,
}: {
  scenario: ScenarioContent
  boldPrimaryBlue: boolean
}) {
  return (
    <Stack sx={{ mt: jtSpacing.section.xl, alignItems: 'center' }}>
      {scenario.closingParagraph && (
        <Typography variant="body1" sx={{ mb: jtSpacing.component.lg, color: 'base.100' }}>
          <HighlightedParagraph
            text={scenario.closingParagraph}
            boldPrimaryBlue={boldPrimaryBlue}
          />
        </Typography>
      )}
      <Button
        component={Link}
        to="/scenarios/modeling"
        variant="contained"
        endIcon={<ArrowForwardIcon />}
      >
        View Modeling results
      </Button>
    </Stack>
  )
}
