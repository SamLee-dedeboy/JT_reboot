import { Box, Stack, Typography, useMediaQuery } from '@mui/material'
import { alpha, type Theme } from '@mui/material/styles'
import { NumberedHeading, RegionLabel } from '@/ui'
import { REGION_SHAPES, REGION_TEAM_VIEWBOX, WATERWAY_PATH } from '@/content/deltaRegions'
import { jtSpacing } from '@/theme'
import { type CriterionRegions } from '@/content/criteria'
import { CitedText } from './citations'
import { criterionSplitSx, sectionSx } from './criterionLayout'

/** The team's own regions, drawn over the Delta's channels, beside what each one is. */
export default function RegionsSection({
  regions,
  accent,
}: {
  regions: CriterionRegions
  accent: string
}) {
  const shapes = REGION_SHAPES.filter((shape) => shape.team === regions.mapTeam)
  const teamViewBox = REGION_TEAM_VIEWBOX[regions.mapTeam]
  const compactMap = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  // Ecology's outlines span the widest area. From md up, every team's map shares its
  // scale, so the Delta is the same size on each page; on a phone each fills the width.
  const widestMap = REGION_TEAM_VIEWBOX.ecology.width
  const labelSize = compactMap ? teamViewBox.width / 26 : widestMap / 45
  return (
    <Box component="section" id="regions" aria-labelledby="regions-title" sx={sectionSx}>
      <NumberedHeading
        variant="h3"
        title="Which regions does this criterion cover?"
        id="regions-title"
        accent={accent}
      />
      <Box sx={criterionSplitSx}>
        <Stack spacing={jtSpacing.gap.md} sx={{ minWidth: 0 }}>
          <Typography variant="body1" sx={{ color: 'base.100' }}>
            <CitedText text={regions.intro} />
          </Typography>
          <Box component="dl" sx={{ m: 0, borderTop: 1, borderColor: 'border.subtle' }}>
            {regions.regions.map((region) => (
              <Box
                key={region.name}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'auto minmax(0, 1fr)',
                  columnGap: jtSpacing.gap.md,
                  alignItems: 'baseline',
                  py: jtSpacing.component.xs,
                  borderBottom: 1,
                  borderColor: 'border.subtle',
                }}
              >
                <Typography component="dt" variant="body2" sx={{ color: 'common.white' }}>
                  {region.name}
                </Typography>
                <Typography
                  component="dd"
                  variant="body2"
                  sx={{ m: 0, color: 'base.200', textAlign: 'right' }}
                >
                  <CitedText text={region.note ?? ''} />
                </Typography>
              </Box>
            ))}
          </Box>
          {regions.mapNote && (
            <Typography variant="caption" sx={{ color: 'base.200' }}>
              <CitedText text={regions.mapNote} />
            </Typography>
          )}
        </Stack>
        <Box
          component="svg"
          viewBox={`${teamViewBox.x} ${teamViewBox.y} ${teamViewBox.width} ${teamViewBox.height}`}
          role="img"
          aria-label={`Map of the Delta showing ${shapes.map((shape) => shape.name).join(', ')}`}
          sx={{
            width: '100%',
            maxWidth: { md: `${(teamViewBox.width / widestMap) * 100}%` },
            height: 'auto',
            display: 'block',
            justifySelf: 'center',
          }}
        >
          <path d={WATERWAY_PATH} fill="currentColor" opacity={0.12} />
          {shapes.map((shape) => (
            <path
              key={shape.name}
              d={shape.d}
              fill={alpha(accent, 0.18)}
              stroke={accent}
              strokeWidth={3}
              strokeLinejoin="round"
            />
          ))}
          {shapes.map((shape) => (
            <RegionLabel key={`label-${shape.name}`} shape={shape} size={labelSize} />
          ))}
        </Box>
      </Box>
    </Box>
  )
}
