import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { Button, Stack, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import { ScrollReveal } from '@/ui'

/** The way on to the scenarios, and where the page's framing comes from. */
export default function BackgroundNext() {
  return (
    <>
      <ScrollReveal>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1.4}
          sx={{ py: 4, alignItems: { xs: 'stretch', sm: 'center' } }}
        >
          <Button
            component={Link}
            to="/scenarios"
            variant="contained"
            color="secondary"
            endIcon={<ArrowForwardIcon />}
            sx={{ color: 'base.900' }}
          >
            Continue to Scenarios
          </Button>
          <Button
            component={Link}
            to="/scenarios"
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            sx={{ color: 'common.white', borderColor: 'base.300' }}
          >
            Back
          </Button>
        </Stack>
      </ScrollReveal>
      <Typography variant="captionProse" component="p" sx={{ color: 'base.100', mt: 1 }}>
        Source framing follows the Adaptation Scenarios StoryMap baseline: current operations,
        salinity intrusion, monitoring and compliance stations, and the X2 salinity index.
      </Typography>
    </>
  )
}
