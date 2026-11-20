import { Box, ButtonBase, Typography } from '@mui/material'
import { lazy, Suspense, useState } from 'react'
import {
  scenarioName,
  scenarioSlug,
  teamName,
  teamShortName,
  type ScenarioKey,
  type TeamKey,
} from '@/content/names'
import { tieredOutflows } from '@/content/scenarios'
import { chart, jtSpacing } from '@/theme'
import { Segmented, TeamIcon } from '@/ui'
import { focusRing } from '@/ui/focusRing'
import { borderedPanelSx } from '@/ui/surfaceStyles'
import { scenarioFindings, type Finding } from './findings'

const FindingsMap = lazy(() => import('./FindingsMap'))

const TEAMS: TeamKey[] = ['ecology', 'environmentalJustice', 'economy', 'recreation', 'ecoCultural']

/** The story map each scenario's findings sit on; the outflow runs have Tiered Outflows'. */
const mapSlug = (scenario: ScenarioKey) =>
  scenario === 'more' ? tieredOutflows.slug : scenarioSlug(scenario)

const scenarioOptions = scenarioFindings.map(({ scenario }) => ({
  value: scenario,
  label: scenarioName(scenario),
}))

/** One team, named in its color beside its icon. */
function TeamLabel({ team }: { team: TeamKey }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: jtSpacing.gap.xs,
        color: chart.voting.team[team],
      }}
    >
      <TeamIcon team={team} size={18} />
      <Typography variant="chipLabel" component="span">
        {teamName(team)}
      </Typography>
    </Box>
  )
}

/** The chosen finding: its place, what the team found there and what was measured. */
function FindingCard({ finding }: { finding: Finding }) {
  return (
    <Box
      aria-live="polite"
      sx={{ ...borderedPanelSx, display: 'flex', flexDirection: 'column', gap: jtSpacing.gap.sm }}
    >
      <TeamLabel team={finding.team} />
      <Box>
        <Typography variant="cardTitle" component="h3">
          {finding.place}
        </Typography>
        <Typography variant="captionSmall" component="p">
          {finding.kind}
        </Typography>
      </Box>
      <Typography variant="body1">{finding.lead}</Typography>
      <Box component="dl" sx={{ m: 0, borderTop: 1, borderColor: 'border.default' }}>
        {finding.measures.map(([measure, value]) => (
          <Box
            key={measure}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: jtSpacing.gap.md,
              py: jtSpacing.gap.xs,
              borderBottom: 1,
              borderColor: 'border.default',
            }}
          >
            <Typography variant="body2" component="dt" sx={{ color: 'base.100' }}>
              {measure}
            </Typography>
            <Typography
              variant="takeawayBodyStrong"
              component="dd"
              sx={{ m: 0, textAlign: 'right' }}
            >
              {value}
            </Typography>
          </Box>
        ))}
      </Box>
      <Typography variant="captionSmall">{finding.source}</Typography>
    </Box>
  )
}

/** Shows or hides one team's pins. */
function TeamToggle({
  team,
  shown,
  onToggle,
}: {
  team: TeamKey
  shown: boolean
  onToggle: () => void
}) {
  return (
    <ButtonBase
      aria-pressed={shown}
      onClick={onToggle}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: jtSpacing.gap.xs,
        minHeight: 44,
        px: jtSpacing.component.sm,
        border: 1,
        borderColor: shown ? chart.voting.team[team] : 'border.strong',
        borderRadius: 999,
        color: shown ? chart.voting.team[team] : 'base.200',
        bgcolor: 'translucent.darkSurface',
        '&:hover': { bgcolor: 'translucent.200' },
        '&.Mui-focusVisible': focusRing,
      }}
    >
      <TeamIcon team={team} size={18} />
      <Typography variant="chipLabel" component="span">
        {teamShortName(team)}
      </Typography>
    </ButtonBase>
  )
}

/** One scenario's findings from all five teams: pins on the map, the rest across the Delta. */
export default function ScenarioFindings() {
  const [scenario, setScenario] = useState(scenarioFindings[0].scenario)
  const [selectedId, setSelectedId] = useState<string>()
  const [hidden, setHidden] = useState<TeamKey[]>([])

  const current = scenarioFindings.find((entry) => entry.scenario === scenario)!
  const shown = current.findings.filter((finding) => !hidden.includes(finding.team))
  const selected = shown.find((finding) => finding.id === selectedId) ?? shown[0]

  const toggleTeam = (team: TeamKey) =>
    setHidden((teams) =>
      teams.includes(team) ? teams.filter((key) => key !== team) : [...teams, team],
    )

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: jtSpacing.gap.md,
      }}
    >
      {/* Which scenario, and whose pins. */}
      <Segmented
        label="Scenario"
        value={scenario}
        options={scenarioOptions}
        onChange={(value) => {
          setScenario(value)
          setSelectedId(undefined)
        }}
        wrap
      />
      <Box
        role="group"
        aria-label="Teams on the map"
        sx={{ display: 'flex', flexWrap: 'wrap', gap: jtSpacing.gap.xs }}
      >
        {TEAMS.map((team) => (
          <TeamToggle
            key={team}
            team={team}
            shown={!hidden.includes(team)}
            onToggle={() => toggleTeam(team)}
          />
        ))}
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1fr) minmax(300px, 380px)' },
          gap: jtSpacing.gap.md,
          alignItems: 'start',
        }}
      >
        {/* The map: one pin per place a team named. */}
        <Box
          sx={{
            position: 'relative',
            height: { xs: 420, md: 560, lg: 680 },
            borderRadius: 1,
            overflow: 'hidden',
            bgcolor: 'base.700',
          }}
        >
          <Suspense fallback={null}>
            <FindingsMap
              scenarioSlug={mapSlug(scenario)}
              findings={shown}
              selectedId={selected?.id}
              onSelect={setSelectedId}
            />
          </Suspense>
        </Box>

        {/* The chosen finding, the list of pins, and what holds across the Delta. */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: jtSpacing.gap.md }}>
          {selected ? (
            <FindingCard finding={selected} />
          ) : (
            <Typography variant="body2" sx={{ color: 'base.100' }}>
              No team’s findings in this scenario are on the map. Show another team, or read what
              holds across the Delta below.
            </Typography>
          )}

          {shown.length > 0 && (
            <Box>
              <Typography variant="columnHead" component="h3" sx={{ mb: jtSpacing.gap.xs }}>
                On the map
              </Typography>
              <Box component="ul" sx={{ m: 0, p: 0, listStyle: 'none' }}>
                {shown.map((finding) => (
                  <Box component="li" key={finding.id}>
                    <ButtonBase
                      aria-pressed={finding.id === selected?.id}
                      onClick={() => setSelectedId(finding.id)}
                      sx={{
                        width: '100%',
                        minHeight: 44,
                        justifyContent: 'flex-start',
                        gap: jtSpacing.gap.sm,
                        px: jtSpacing.gap.sm,
                        py: jtSpacing.gap.xs,
                        borderRadius: 1,
                        textAlign: 'left',
                        bgcolor: finding.id === selected?.id ? 'translucent.300' : 'transparent',
                        '&:hover': { bgcolor: 'translucent.200' },
                        '&.Mui-focusVisible': focusRing,
                      }}
                    >
                      <Box
                        aria-hidden
                        sx={{
                          display: 'grid',
                          placeItems: 'center',
                          flex: 'none',
                          width: 28,
                          height: 28,
                          borderRadius: '50%',
                          bgcolor: chart.voting.team[finding.team],
                          color: 'base.900',
                        }}
                      >
                        <TeamIcon team={finding.team} size={16} />
                      </Box>
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="chipLabel" component="span">
                          {finding.place}
                        </Typography>
                        <Typography variant="captionSmall" component="span">
                          {teamName(finding.team)}
                        </Typography>
                      </Box>
                    </ButtonBase>
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          <Box>
            <Typography variant="columnHead" component="h3" sx={{ mb: jtSpacing.gap.xs }}>
              Across the Delta
            </Typography>
            <Box
              component="ul"
              sx={{
                m: 0,
                p: 0,
                listStyle: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: jtSpacing.gap.sm,
              }}
            >
              {current.acrossDelta
                .filter(({ team }) => !hidden.includes(team))
                .map(({ team, text }) => (
                  <Box
                    component="li"
                    key={`${team}-${text}`}
                    sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}
                  >
                    <TeamLabel team={team} />
                    <Typography variant="body2">{text}</Typography>
                  </Box>
                ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
