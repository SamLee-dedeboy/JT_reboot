import { Box, Stack, Typography } from '@mui/material'
import { jtSpacing, ranking } from '@/theme'
import { TEAMS } from '../../model/teams'
import { ScaleStrip } from './ScoreScale'

/**
 * The six criteria as a ruled key, each beside the swatch the charts below draw it in, then
 * the −5…+5 scale in miniature. Two columns on a phone, three from sm; from md it is a
 * bordered panel in the column beside the intro.
 */
export default function CriteriaKey() {
  return (
    <Stack
      component="aside"
      aria-label="The six criteria"
      spacing={jtSpacing.component.md}
      sx={{
        gridArea: 'key',
        p: { md: jtSpacing.component.md },
        border: { md: 1 },
        borderColor: { md: 'border.default' },
        borderRadius: { md: 2 },
        bgcolor: { md: 'translucent.50' },
      }}
    >
      <Typography variant="columnHead">Six criteria</Typography>
      <Box
        component="ul"
        sx={{
          listStyle: 'none',
          m: 0,
          p: 0,
          display: 'grid',
          gridTemplateColumns: ranking.criteriaKey.columns,
          columnGap: jtSpacing.gap.md,
          borderTop: 1,
          borderColor: 'border.default',
        }}
      >
        {TEAMS.map((team) => (
          <Box
            component="li"
            key={team.key}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: jtSpacing.gap.sm,
              py: jtSpacing.component.sm,
              borderBottom: 1,
              borderColor: 'border.subtle',
            }}
          >
            <Box
              aria-hidden
              sx={{
                flex: 'none',
                width: ranking.legend.swatchWidth,
                borderTop: ranking.legend.swatchHeight,
                borderColor: team.color,
              }}
            />
            <Typography variant="chipLabel" component="span">
              {team.name}
            </Typography>
          </Box>
        ))}
      </Box>
      <ScaleStrip />
    </Stack>
  )
}
