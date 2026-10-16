// Eco-cultural's evidence: one quantity, and three things that are not quantities.
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
import { Legend, Panel, RowHead, SubteamPage } from './SubteamFrame'
import { AcreStrip, MetricCards } from './aids'

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

const acres = (value: number) => `${value.toLocaleString('en-US')} ac`

export default function EcoCulturalView() {
  const inDeltaTotal = IN_DELTA.reduce((sum, row) => sum + row.acres, 0)
  const uplandLow = UPLAND.reduce((sum, row) => sum + row.low, 0)
  const uplandHigh = UPLAND.reduce((sum, row) => sum + row.high, 0)

  return (
    <SubteamPage
      profile={SUBTEAM_PROFILES.ecoCultural}
      aidWide
      aid={
        <Box sx={{ display: 'grid', gap: 2.5 }}>
          <MetricCards
            metrics={[
              {
                label: 'A. Restored habitat',
                counted: true,
                items: [
                  'In the Delta: managed wetland, wet-soil agriculture (rice), tidal wetland',
                  'In the upper watershed: managed wetland, meadow, floodplain',
                ],
              },
              {
                label: 'B. Access to landscapes',
                counted: false,
              },
              {
                label: 'C. Indigenous science and TEK',
                counted: false,
              },
              {
                label: 'D. Sovereignty and governance',
                counted: false,
              },
            ]}
          />
          <AcreStrip
            types={[
              {
                group: 'In the Delta',
                names: 'managed wetland, wet-soil agriculture (rice), tidal wetland',
              },
              { group: 'In the upper watershed', names: 'managed wetland, meadow, floodplain' },
            ]}
          />
        </Box>
      }
    >
      <Panel
        title="Restored habitat, the one metric with a number"
        intro="**Acres restored** under New Green Watershed’s 50/50 case. The in-Delta figures are **totals**. The upland figures are **ranges**, because nine upland sub-scenarios sit inside them; a single upland value would reflect a chosen sub-scenario rather than one measurement. The comparison page uses the **low end**, the minimal-restoration case."
      >
        <Box
          sx={(theme) => ({
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: theme.jtSpacing.gap.lg,
          })}
        >
          <Box sx={{ display: 'grid', gap: 0.75, alignContent: 'start' }}>
            <Typography variant="body2" sx={{ color: 'base.50' }}>
              <Box component="strong">In-Delta, {acres(inDeltaTotal)} in total</Box>
            </Typography>
            {IN_DELTA.map((row) => (
              <Box key={row.label} sx={{ display: 'grid', gap: 0.4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                  <RowHead>{row.label}</RowHead>
                  <Typography variant="body2" sx={{ color: 'base.50' }}>
                    <Box component="strong">{acres(row.acres)}</Box>
                  </Typography>
                </Box>
                <Box sx={{ height: 10, bgcolor: 'translucent.100', borderRadius: 0.4 }}>
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

          <Box sx={{ display: 'grid', gap: 0.75, alignContent: 'start' }}>
            <Typography variant="body2" sx={{ color: 'base.50' }}>
              <Box component="strong">
                Upper watershed, {acres(uplandLow)} to {acres(uplandHigh)} in total
              </Box>
            </Typography>
            {UPLAND.map((row) => (
              <Box key={row.label} sx={{ display: 'grid', gap: 0.4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                  <RowHead>{row.label}</RowHead>
                  <Typography variant="body2" sx={{ color: 'base.50' }}>
                    {row.low.toLocaleString('en-US')} to {acres(row.high)}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    position: 'relative',
                    height: 10,
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
          </Box>
        </Box>
        <Legend
          items={[{ swatch: 'salinity.teal', label: 'Acres restored' }]}
          note="A solid bar is a published total; a paler band is the range between the lightest and heaviest sub-scenario."
        />
      </Panel>

      <Panel
        title="Access to landscapes, from strongest to weakest"
        intro="The team’s second metric is ==not a quantity but a ranking== of the agreements that give a Tribe access to land. It also identified which of them **remain in force when the land changes owners**."
      >
        <Box sx={{ display: 'grid', gap: 0.5 }}>
          {ACCESS_LADDER.map((rung, i) => (
            <Box
              key={rung.label}
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '32px 260px 1fr' },
                gap: 1,
                alignItems: 'baseline',
                py: 0.75,
                borderTop: i === 0 ? 0 : 1,
                borderColor: 'border.default',
              }}
            >
              <Typography variant="body2" sx={{ color: 'base.100' }}>
                <Box component="strong">{i + 1}</Box>
              </Typography>
              <Typography variant="body2" sx={{ color: 'base.50' }}>
                <Box component="strong">{rung.label}</Box>
              </Typography>
              <Typography variant="body2" sx={{ color: 'base.100' }}>
                {rung.note}
              </Typography>
            </Box>
          ))}
        </Box>
      </Panel>

      <Panel
        title="What Indigenous science needs, and what sovereignty looks like"
        intro="The third and fourth metrics describe **conditions that make the work possible, not outcomes**, so ==no scenario receives a score== for them. Material from workshops needs Tribal review before publication, and specific cultural-practice sites are deliberately not mapped."
      >
        <Box
          sx={(theme) => ({
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: theme.jtSpacing.gap.lg,
          })}
        >
          <Box sx={{ display: 'grid', gap: 1, alignContent: 'start' }}>
            <Typography variant="body2" sx={{ color: 'base.50' }}>
              <Box component="strong">Conditions for Indigenous science and TEK</Box>
            </Typography>
            {TEK_CONDITIONS.map((item) => (
              <Box key={item.label} sx={{ display: 'grid', gap: 0.2 }}>
                <Typography variant="body2" sx={{ color: 'base.50' }}>
                  {item.label}
                </Typography>
                <Typography variant="body2" sx={{ color: 'base.100' }}>
                  {item.note}
                </Typography>
              </Box>
            ))}
          </Box>
          <Box sx={{ display: 'grid', gap: 0.5, alignContent: 'start' }}>
            <Typography variant="body2" sx={{ color: 'base.50' }}>
              <Box component="strong">Sovereignty and governance</Box>
            </Typography>
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
