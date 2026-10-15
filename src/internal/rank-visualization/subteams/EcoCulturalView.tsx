// Eco-cultural's middle: one quantity, and three things that are not quantities.
//
// This is the criterion that most resists the shape of the other four. Only metric
// A produces acres; B, C and D are described because the subteam judged them not
// measurable across scenarios, and that judgement is the finding rather than a gap
// to be filled. So the ladder is drawn as a ladder and the conditions are drawn as
// conditions, with no number implied for either.
//
// Two constraints hold here and are not stylistic: specific cultural-practice sites
// are deliberately not mapped, and workshop-derived material needs Tribal review
// before it is published anywhere.
import { Box, Typography } from '@mui/material'
import { SUBTEAM_PROFILES } from './profiles'
import { Panel, SubteamPage } from './SubteamFrame'

/** Restored acres under New Green Watershed's 50/50 case, as published. */
const IN_DELTA = [
  { label: 'Managed wetlands', acres: 102_982 },
  { label: 'Wet-soil agriculture (rice)', acres: 145_833 },
]

/** The upland figures are ranges; the low end is the minimal-restoration case. */
const UPLAND = [
  { label: 'Managed wetland', low: 48_213, high: 207_004 },
  { label: 'Meadow', low: 11_586, high: 347_591 },
  { label: 'Floodplain', low: 6_360, high: 303_372 },
]

/** Most preferred at the top. The order is the finding. */
const ACCESS_LADDER = [
  {
    label: 'Tribal ownership',
    note: 'Returns full ownership, stewardship and decision-making. Tribal representatives ranked it highest at the third Tribal workshop.',
  },
  {
    label: 'Land trust partnership',
    note: 'A trust purchases or temporarily holds land while a Tribe builds capacity or secures funding.',
  },
  {
    label: 'Conservation easement',
    note: 'Legally binding development restrictions for ecological protection.',
  },
  {
    label: 'Cultural conservation easement',
    note: 'The same instrument written for cultural protection, with perpetual access even if the land is sold.',
  },
  {
    label: 'Memorandum of understanding',
    note: 'A formal agreement with a private landowner or State entity, and the weakest of the five.',
  },
]

const TEK_CONDITIONS = [
  {
    label: 'Ensured privacy and safety',
    note: 'Free from outside observation, including photography. Partners should not ask why or for what purpose a stewardship activity is carried out.',
  },
  {
    label: 'Unrestricted access',
    note: 'The agreements above provide access without requiring case-by-case approval.',
  },
  {
    label: 'Site selection choice',
    note: 'Reachable by Elders and by people with restricted mobility.',
  },
]

const SOVEREIGNTY = [
  'Tribal beneficial and cultural uses of water',
  'Recognition of Tribal water rights',
  'Indigenous representation in planning processes',
  'An inter-Tribal council for the Delta',
  'Funding for Tribal stewardship and Indigenous science groups',
  'Data sovereignty under CARE',
]

export default function EcoCulturalView() {
  const inDeltaTotal = IN_DELTA.reduce((sum, row) => sum + row.acres, 0)
  const uplandLow = UPLAND.reduce((sum, row) => sum + row.low, 0)
  const uplandHigh = UPLAND.reduce((sum, row) => sum + row.high, 0)

  return (
    <SubteamPage profile={SUBTEAM_PROFILES.ecoCultural}>
      <Panel
        title="Metric A, the one that is counted"
        note="This shows restored acres under the New Green Watershed 50/50 case. The in-Delta values are published as totals, while the upland values are ranges, so a single upland value reflects a chosen sub-scenario rather than one measurement."
      >
        <Box
          sx={(theme) => ({
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: theme.jtSpacing.gap.lg,
          })}
        >
          <Box sx={{ display: 'grid', gap: 0.5, alignContent: 'start' }}>
            <Typography variant="chartColumnHead">
              In-Delta · {inDeltaTotal.toLocaleString('en-US')} ac
            </Typography>
            {IN_DELTA.map((row) => (
              <Box key={row.label} sx={{ display: 'grid', gap: 0.3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                  <Typography variant="chartAxis">{row.label}</Typography>
                  <Typography variant="chartValue">
                    {row.acres.toLocaleString('en-US')} ac
                  </Typography>
                </Box>
                <Box sx={{ height: 8, bgcolor: 'translucent.100', borderRadius: 0.4 }}>
                  <Box
                    sx={{
                      height: '100%',
                      width: `${(row.acres / inDeltaTotal) * 100}%`,
                      bgcolor: 'salinity.teal',
                      borderRadius: 0.4,
                    }}
                  />
                </Box>
              </Box>
            ))}
          </Box>

          <Box sx={{ display: 'grid', gap: 0.5, alignContent: 'start' }}>
            <Typography variant="chartColumnHead">
              Upper watershed · {uplandLow.toLocaleString('en-US')} to{' '}
              {uplandHigh.toLocaleString('en-US')} ac
            </Typography>
            {UPLAND.map((row) => (
              <Box key={row.label} sx={{ display: 'grid', gap: 0.3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                  <Typography variant="chartAxis">{row.label}</Typography>
                  <Typography variant="chartAxis" sx={{ color: 'base.300' }}>
                    {row.low.toLocaleString('en-US')} to {row.high.toLocaleString('en-US')}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    position: 'relative',
                    height: 8,
                    bgcolor: 'translucent.100',
                    borderRadius: 0.4,
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      left: `${(row.low / uplandHigh) * 100}%`,
                      width: `${((row.high - row.low) / uplandHigh) * 100}%`,
                      height: '100%',
                      bgcolor: 'salinity.teal',
                      opacity: 0.45,
                      borderRadius: 0.4,
                    }}
                  />
                </Box>
              </Box>
            ))}
            <Typography variant="chartAxis" sx={{ color: 'base.300', mt: 0.3 }}>
              Nine upland sub-scenarios sit inside those ranges. The comparison page shows the low
              end, which is the minimal-restoration case.
            </Typography>
          </Box>
        </Box>
      </Panel>

      <Panel
        title="Metric B, access to landscapes"
        note="The subteam ranked these options from strongest to weakest. It also identified which agreements remain in force when the land changes owners."
      >
        <Box sx={{ display: 'grid', gap: 0.5 }}>
          {ACCESS_LADDER.map((rung, i) => (
            <Box
              key={rung.label}
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '28px 240px 1fr' },
                gap: 1,
                alignItems: 'baseline',
                py: 0.6,
                borderTop: i === 0 ? 0 : 1,
                borderColor: 'border.default',
              }}
            >
              <Typography variant="chartValue" sx={{ color: 'base.300' }}>
                {i + 1}
              </Typography>
              <Typography variant="chartLabel">{rung.label}</Typography>
              <Typography variant="body2" sx={{ color: 'base.100' }}>
                {rung.note}
              </Typography>
            </Box>
          ))}
        </Box>
      </Panel>

      <Panel
        title="Metrics C and D, conditions and mechanisms"
        note="These metrics describe conditions that make the work possible, not outcomes. No scenario receives a score for them. Material from workshops needs Tribal review before publication. Specific cultural-practice sites are deliberately not mapped."
      >
        <Box
          sx={(theme) => ({
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: theme.jtSpacing.gap.lg,
          })}
        >
          <Box sx={{ display: 'grid', gap: 0.75, alignContent: 'start' }}>
            <Typography variant="chartColumnHead">Indigenous science and TEK</Typography>
            {TEK_CONDITIONS.map((item) => (
              <Box key={item.label} sx={{ display: 'grid', gap: 0.2 }}>
                <Typography variant="chartLabel">{item.label}</Typography>
                <Typography variant="body2" sx={{ color: 'base.100' }}>
                  {item.note}
                </Typography>
              </Box>
            ))}
          </Box>
          <Box sx={{ display: 'grid', gap: 0.4, alignContent: 'start' }}>
            <Typography variant="chartColumnHead">Sovereignty and governance</Typography>
            {SOVEREIGNTY.map((item) => (
              <Typography key={item} variant="body2" sx={{ color: 'base.100' }}>
                {item}
              </Typography>
            ))}
          </Box>
        </Box>
      </Panel>
    </SubteamPage>
  )
}
