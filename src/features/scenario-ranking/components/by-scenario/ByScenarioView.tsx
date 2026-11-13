import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import { Box, Button, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { jtSpacing } from '@/theme'
import type { Climate } from '../../model/criteria'
import { Segmented } from '@/ui'
import { SCENARIOS, SLR_SCENARIOS } from '../../model/scenarioScores'
import OverallRankingChart from './OverallRankingChart'
import WeightedRankingChart from './WeightedRankingChart'
import RankingSection from './RankingSection'
import HeadsUp from './HeadsUp'

/** The scenarios ranked on this page: the six adaptation scenarios. */
const scenarioSet = {
  baseline: 'against today’s Delta, where Business as Usual sits at zero.',
  scenarios: SCENARIOS,
}

const CLIMATE_OPTIONS: { value: Climate; label: string }[] = [
  { value: 'current', label: 'Current' },
  { value: 'slr', label: 'Sea level rise' },
]

export default function ByScenarioView() {
  const [climate, setClimate] = useState<Climate>('current')
  const slr = climate === 'slr'

  return (
    <>
      <RankingSection sectionId="start" title="What you’re looking at" background="base.800">
        <Stack
          spacing={jtSpacing.gap.lg}
          sx={{ maxWidth: jtSpacing.paragraphMaxWidth.default, alignItems: 'flex-start' }}
        >
          <Typography variant="body1">
            Every future is scored on five criteria: ecology, recreation, environmental justice,
            economy, and eco-cultural outcomes. Each criterion scores the futures from −5 to +5{' '}
            {scenarioSet.baseline}
          </Typography>
          <Typography variant="body1">
            The ranking below combines those five scores. By default every criterion counts equally;
            further down the page, you can change that balance and watch the order shift.
          </Typography>
          <Typography variant="body2">
            How each criterion’s score was built—the models, metrics, and community input behind
            it—is set out in the methodology.
          </Typography>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={{ xs: jtSpacing.gap.sm, sm: jtSpacing.gap.xl }}
            sx={{ alignItems: { sm: 'center' }, pt: jtSpacing.component.sm }}
          >
            <Button
              component={Link}
              to="/scenarios/evaluation"
              variant="outlined"
              endIcon={<ArrowForwardRoundedIcon />}
            >
              Read the methodology
            </Button>
            <Typography
              component={Link}
              to="/scenarios/ranking/by-criterion"
              variant="body2"
              sx={{ color: 'primary.main', '&:hover': { color: 'common.white' } }}
            >
              Or compare one criterion at a time
            </Typography>
          </Stack>
        </Stack>
      </RankingSection>

      <RankingSection
        sectionId="overall-ranking"
        eyebrow="Equal weights"
        singleLineTitle
        title={
          <>
            The overall ranking
            {slr && (
              <Box component="span" sx={{ color: 'primary.main' }}>
                {' '}
                with sea level rise
              </Box>
            )}
          </>
        }
        introduction="Every criterion counts equally here. Scores above zero beat today’s baseline; scores below zero fall short of it. Open a future to see the five scores behind its rank."
        background="base.700"
      >
        <OverallRankingChart
          scenarios={slr ? SLR_SCENARIOS : scenarioSet.scenarios}
          zeroWord={slr ? 'baseline' : undefined}
          baselineNote={slr ? 'With sea-level rise: the baseline' : undefined}
          heading={
            <Segmented
              label="Sea level"
              value={climate}
              options={CLIMATE_OPTIONS}
              onChange={setClimate}
              dense
              nowrap
            />
          }
        />
      </RankingSection>

      <HeadsUp />

      <RankingSection
        sectionId="weighted-ranking"
        eyebrow="Your priorities"
        title="Change what matters most"
        introduction="There is no single right way to balance Delta outcomes. Adjust the priorities to see which futures rise—and which trade-offs become more visible."
        background="base.700"
      >
        <WeightedRankingChart scenarios={scenarioSet.scenarios} />
      </RankingSection>
    </>
  )
}
