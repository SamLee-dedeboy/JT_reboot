import { Box, Stack, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { TEAM_NAMES } from '@/content/names'
import { chart, jtSpacing, palette } from '@/theme'
import { TeamIcon } from '@/ui'
import DesignSection from '../parts/DesignSection'
import { SpecimenGroup, UsageTag } from '../parts/Specimen'
import Swatch, { SwatchGrid } from '../parts/Swatch'

const teams = Object.values(TEAM_NAMES).sort((a, b) => a.number.localeCompare(b.number))

// Where each accent is drawn today. Checked by hand against src/ (Nov 2026); update when a
// feature starts or stops using one.
const accents: Array<{
  key: keyof typeof palette.accent
  where: 'public' | 'co-design' | 'internal' | 'none'
  note: string
}> = [
  { key: 'blue', where: 'public', note: 'Modeling schedules, San Joaquin on maps' },
  { key: 'yellow', where: 'public', note: 'Regional summary, explorer map' },
  { key: 'brick', where: 'public', note: 'Score scale, worse side' },
  { key: 'brickText', where: 'public', note: 'Negative score numbers' },
  { key: 'red', where: 'co-design', note: 'Linking view' },
  { key: 'pink', where: 'co-design', note: 'Co-design errors' },
  { key: 'orange', where: 'internal', note: 'Internal tools, site map' },
  { key: 'purple', where: 'internal', note: 'Internal tools, site map' },
  { key: 'indigo', where: 'none', note: 'Only in chart tokens no page draws' },
]

const whereLabel = {
  public: 'Public pages',
  'co-design': 'Co-design only',
  internal: 'Internal only',
  none: 'Not drawn',
} as const

const scoreSteps = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5]
const scoreColor = (score: number) => {
  if (score === 0) return palette.base[300]
  const hue = score > 0 ? chart.voting.above : chart.voting.below
  return alpha(hue, 0.1 + (Math.abs(score) / 5) * 0.9)
}

/** Palette tokens, grouped by job. Every value is read from src/theme. */
export default function ColorSection() {
  return (
    <DesignSection
      id="color"
      eyebrow="Foundations"
      title="Color"
      intro="One dark ground, one green for action, one blue for “better”, a hue per criterion, and a pair of its own for salinity."
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
          gap: jtSpacing.section.sm,
        }}
      >
        <SpecimenGroup
          title="Brand"
          note="Green is actions and the current place. Blue is the “better than today” side of every score."
        >
          <SwatchGrid min={120}>
            <Swatch color={palette.brand.base} name="Ground" token="brand.base" outlined />
            <Swatch
              color={palette.brand.primaryGreen}
              name="Green"
              token="primary · brand.primaryGreen"
            />
            <Swatch
              color={palette.brand.primaryBlue}
              name="Blue"
              token="secondary · brand.primaryBlue"
            />
          </SwatchGrid>
        </SpecimenGroup>
        <SpecimenGroup
          title="Salinity"
          note="Salinity owns this pair. Anything else that needs this pink uses salinity.pink."
        >
          <SwatchGrid min={120}>
            <Swatch color={palette.salinity.teal} name="Fresher" token="salinity.teal" />
            <Swatch color={palette.salinity.pink} name="Saltier" token="salinity.pink" />
          </SwatchGrid>
        </SpecimenGroup>
        <SpecimenGroup
          title="Text and lines"
          note="base.300 and darker never carry text on the ground: they fall below 4.5:1."
        >
          <SwatchGrid min={120}>
            <Swatch color={palette.common.white} name="Ink" token="common.white" />
            <Swatch color={palette.base[100]} name="Quiet ink" token="base.100" />
            <Swatch color={palette.base[200]} name="Meta ink" token="base.200" />
            <Stack spacing={0.75}>
              <Stack
                spacing={1.75}
                sx={{
                  height: 88,
                  justifyContent: 'center',
                  px: 1.5,
                  borderRadius: '6px',
                  bgcolor: 'brand.base',
                }}
              >
                {(['subtle', 'default', 'strong'] as const).map((key) => (
                  <Box key={key} sx={{ height: '1px', bgcolor: palette.border[key] }} />
                ))}
              </Stack>
              <Typography variant="tableValueStrong">Borders</Typography>
              <Typography variant="captionSmall" sx={{ color: 'base.200' }}>
                border.subtle · default · strong
              </Typography>
            </Stack>
          </SwatchGrid>
        </SpecimenGroup>
        <SpecimenGroup
          title="Floor · Fluid · Cap"
          note="A three-state set (low, in range, high), all from existing tokens."
        >
          <SwatchGrid min={120}>
            <Swatch color={palette.accent.blue} name="Floor" token="accent.blue" />
            <Swatch color={palette.brand.primaryGreen} name="Fluid" token="brand.primaryGreen" />
            <Swatch color={palette.teams.ecology} name="Cap" token="teams.ecology" />
          </SwatchGrid>
        </SpecimenGroup>
      </Box>

      <SpecimenGroup title="Neutral ramp · base">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(64px, 1fr))',
            borderRadius: '6px',
            overflow: 'hidden',
            border: 1,
            borderColor: 'border.default',
          }}
        >
          {([50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const).map((step) => (
            <Box
              key={step}
              sx={{
                height: 80,
                p: 1.25,
                bgcolor: palette.base[step],
                color: step <= 200 ? 'common.black' : 'common.white',
                typography: 'chartLabel',
              }}
            >
              {step}
            </Box>
          ))}
        </Box>
      </SpecimenGroup>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '3fr 2fr' },
          gap: jtSpacing.section.sm,
        }}
      >
        <SpecimenGroup
          title="Criteria · one hue per evaluation team"
          note="Data-only hues, always paired with the team's icon and name."
        >
          <SwatchGrid min={120}>
            {teams.map((team) => (
              <Swatch
                key={team.key}
                color={chart.voting.team[team.key]}
                name={
                  <Box
                    component="span"
                    sx={{ display: 'inline-flex', gap: 1, alignItems: 'center' }}
                  >
                    <Box
                      component="span"
                      sx={{ color: chart.voting.team[team.key], display: 'inline-flex' }}
                    >
                      <TeamIcon team={team.key} size={18} />
                    </Box>
                    {team.number} {team.shortName}
                  </Box>
                }
                token={`teams.${team.key === 'environmentalJustice' ? 'envJustice' : team.key}`}
              />
            ))}
          </SwatchGrid>
        </SpecimenGroup>
        <SpecimenGroup
          title="Score scale · −5 to +5"
          note="Hue by sign, strength by size: chart.voting.above (brand blue) and below (accent.brick); numbers on the ground use brickText."
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(11, minmax(0, 1fr))',
              gap: '3px',
              height: 88,
            }}
          >
            {scoreSteps.map((score) => (
              <Box key={score} sx={{ bgcolor: scoreColor(score) }} />
            ))}
          </Box>
          <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
            <Typography variant="tableValueStrong" sx={{ color: chart.voting.belowText }}>
              −5 Worse
            </Typography>
            <Typography variant="tableValueStrong" sx={{ color: 'base.100' }}>
              No change
            </Typography>
            <Typography variant="tableValueStrong" sx={{ color: chart.voting.above }}>
              +5 Better
            </Typography>
          </Stack>
        </SpecimenGroup>
      </Box>

      <SpecimenGroup
        title="Accents · by where they are used"
        note="The ranking model also carries per-scenario colors that no current view paints."
      >
        <SwatchGrid min={130}>
          {accents.map(({ key, where, note }) => (
            <Swatch key={key} color={palette.accent[key]} name={key} token={`accent.${key}`}>
              <Box>
                <UsageTag used={where === 'public'}>{whereLabel[where]}</UsageTag>
              </Box>
              <Typography variant="captionSmall" sx={{ color: 'base.200' }}>
                {note}
              </Typography>
            </Swatch>
          ))}
        </SwatchGrid>
      </SpecimenGroup>

      <SpecimenGroup title="Surfaces">
        <SwatchGrid min={130}>
          <Swatch color={palette.surface} name="Surface" token="surface" />
          <Swatch color={palette.surfaceStrong} name="Surface strong" token="surfaceStrong" />
          <Swatch color={palette.base[800]} name="Menu panel" token="base.800" />
          <Swatch color={palette.footerBg} name="Footer" token="footerBg" />
          <Swatch
            color={palette.translucent.primaryGreen}
            name="Green tint"
            token="translucent.primaryGreen"
          />
        </SwatchGrid>
      </SpecimenGroup>
    </DesignSection>
  )
}
