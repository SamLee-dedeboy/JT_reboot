import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { Box, IconButton, Stack, Typography, useTheme } from '@mui/material'
import { useState } from 'react'
import { assetUrl } from '../../../utils/baseUrl'

interface RankingScenario {
  title: string
  image: string
  slug: string
}

interface ScenarioRankingOverviewProps {
  scenarios: readonly RankingScenario[]
}

const criteria = [
  'Salinity',
  'Ecology',
  'Community',
  'Economy',
  'Recreation',
  'Tribal priorities',
] as const

const criterionColors = [
  'brand.primaryBlue',
  'accent.blue',
  'salinity.teal',
  'primary.main',
  'brand.primaryBlue',
  'accent.blue',
] as const

export default function ScenarioRankingOverview({ scenarios }: ScenarioRankingOverviewProps) {
  const theme = useTheme()
  const [selectedIndex, setSelectedIndex] = useState(0)
  const selectedScenario = scenarios[selectedIndex]
  const selectRelativeScenario = (offset: number) => {
    setSelectedIndex((current) => (current + offset + scenarios.length) % scenarios.length)
  }

  return (
    <Stack spacing={theme.jtSpacing.component.sm}>
      <Box
        sx={{
          py: { xs: theme.jtSpacing.component.sm, md: theme.jtSpacing.component.md },
        }}
      >
        <Box
          sx={{
            width: '100%',
            display: 'grid',
            gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'minmax(0, 640px) 180px' },
            gridTemplateRows: 'auto auto auto',
            justifyContent: 'start',
            columnGap: theme.jtSpacing.gap.md,
            rowGap: theme.jtSpacing.gap.sm,
          }}
        >
          <Box
            sx={{
              gridColumn: 1,
            }}
          >
            <Stack spacing={theme.jtSpacing.gap.xs}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: theme.jtSpacing.gap.sm }}>
                <Typography variant="eyebrow" component="p" sx={{ flex: 1, color: 'primary.main' }}>
                  Ranking summary
                </Typography>
                <IconButton
                  aria-label="Previous scenario"
                  onClick={() => selectRelativeScenario(-1)}
                  size="small"
                  sx={{ bgcolor: 'base.900', color: 'common.white' }}
                >
                  <ChevronLeftIcon />
                </IconButton>
                <IconButton
                  aria-label="Next scenario"
                  onClick={() => selectRelativeScenario(1)}
                  size="small"
                  sx={{ bgcolor: 'base.900', color: 'common.white' }}
                >
                  <ChevronRightIcon />
                </IconButton>
              </Box>
              <Typography variant="h3" component="h3">
                {selectedScenario?.title}
              </Typography>
              <Typography variant="body2" sx={{ color: 'base.100', maxWidth: '52ch' }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Scenario findings and
                ranking details will appear here when the evaluation is complete.
              </Typography>
            </Stack>
          </Box>

          <Box
            aria-label="Illustrative adaptation scenario ranking matrix"
            sx={{
              gridColumn: 1,
              gridRow: 2,
              display: 'grid',
              gridTemplateColumns: `repeat(${scenarios.length}, minmax(0, 1fr))`,
              gap: theme.jtSpacing.gap.xs,
              mt: theme.jtSpacing.component.lg,
            }}
          >
            {criteria.flatMap((criterion, criterionIndex) =>
              scenarios.map((scenario, scenarioIndex) => {
                return (
                  <Box
                    component="button"
                    type="button"
                    key={`${criterion}-${scenario.slug}`}
                    aria-label={`${scenario.title}, ${criterion}: score pending`}
                    onClick={() => setSelectedIndex(scenarioIndex)}
                    sx={{
                      appearance: 'none',
                      width: '100%',
                      aspectRatio: '1 / 1',
                      border: 0,
                      bgcolor: criterionColors[criterionIndex],
                      opacity: 0.68 + ((scenarioIndex + criterionIndex) % 3) * 0.1,
                      cursor: 'pointer',
                      transition: theme.transitions.create(['opacity', 'transform'], {
                        duration: theme.transitions.duration.short,
                      }),
                      '&:hover, &:focus-visible': {
                        opacity: 1,
                        transform: 'scale(0.94)',
                        outline: 'none',
                      },
                    }}
                  />
                )
              }),
            )}
          </Box>

          <Box
            sx={{
              gridColumn: { xs: 1, md: 2 },
              gridRow: { xs: 4, md: 2 },
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(3, 1fr)', md: '1fr' },
              gridTemplateRows: { md: `repeat(${criteria.length}, minmax(0, 1fr))` },
              gap: theme.jtSpacing.gap.xs,
              mt: theme.jtSpacing.component.lg,
            }}
          >
            {criteria.map((criterion, index) => (
              <Box
                key={criterion}
                sx={{ display: 'flex', alignItems: 'center', gap: theme.jtSpacing.gap.sm }}
              >
                <Typography variant="h4" component="span" sx={{ color: 'primary.main' }}>
                  {String.fromCharCode(65 + index)}
                </Typography>
                <Typography variant="captionSmall" component="span">
                  {criterion}
                </Typography>
              </Box>
            ))}
          </Box>

          <Box
            role="list"
            aria-label="Adaptation scenarios"
            sx={{
              gridColumn: 1,
              gridRow: 3,
              display: 'grid',
              gridTemplateColumns: `repeat(${scenarios.length}, minmax(0, 1fr))`,
              gap: theme.jtSpacing.gap.xs,
            }}
          >
            {scenarios.map((scenario, scenarioIndex) => {
              const selected = scenarioIndex === selectedIndex
              return (
                <Box
                  component="button"
                  type="button"
                  role="listitem"
                  key={scenario.slug}
                  aria-pressed={selected}
                  onClick={() => setSelectedIndex(scenarioIndex)}
                  sx={{
                    position: 'relative',
                    aspectRatio: '1 / 1',
                    appearance: 'none',
                    border: 0,
                    borderRadius: '0 0 50% 50%',
                    bgcolor: 'base.900',
                    color: 'common.white',
                    p: 0,
                    cursor: 'pointer',
                    overflow: 'hidden',
                    opacity: selected ? 1 : 0.42,
                    filter: selected ? 'none' : 'grayscale(0.65)',
                    transform: selected ? 'translateY(-8px)' : 'translateY(0)',
                    transition: theme.transitions.create(['opacity', 'filter', 'transform'], {
                      duration: theme.transitions.duration.short,
                    }),
                    '&:hover, &:focus-visible': {
                      opacity: 1,
                      filter: 'none',
                      transform: 'translateY(-4px)',
                      outline: 'none',
                    },
                  }}
                >
                  <Box
                    component="img"
                    src={assetUrl(scenario.image)}
                    alt=""
                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      bgcolor: selected ? 'translucent.500' : 'translucent.800',
                      display: 'flex',
                      alignItems: 'flex-start',
                      p: theme.jtSpacing.component.xs,
                    }}
                  >
                    <Typography
                      variant="captionSmall"
                      component={selected ? 'strong' : 'span'}
                      sx={{ color: 'common.white' }}
                    >
                      {scenario.title}
                    </Typography>
                  </Box>
                </Box>
              )
            })}
          </Box>
        </Box>
      </Box>
      <Typography variant="captionSmall" sx={{ color: 'base.200' }}>
        Concept preview: colors and rank are illustrative placeholders. No scenario scores have been
        assigned.
      </Typography>
    </Stack>
  )
}
