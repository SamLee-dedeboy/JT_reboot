// The repeating frame of a subteam page.
//
// Six beats, the same every time: the question they asked, what they measured and
// how much of it survives, where they looked, what they found, their verdict, and
// what they left unscored. Only the fourth is bespoke, because the five subteams
// analysed genuinely different kinds of thing and one chart form would flatten
// them. The frame is what keeps five bespoke middles reading as one argument.
import { Box, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import { TEAMS, cellFill, fmtScore } from '../data'
import type { TeamKey } from '../data'
import { TeamMark } from '../drilldown/DrillBits'
import { DRILL_CARD_WIDTH } from '../drilldown/scales'
import { SCENARIO_KEYS, SCENARIO_NAME } from '../drilldown/model'
import type { ScenarioKey } from '../drilldown/model'
import type { SubteamProfile } from './profiles'
import { RegionList, RegionMap } from './RegionMap'

export function SubteamPage({
  profile,
  children,
}: {
  profile: SubteamProfile
  children: ReactNode
}) {
  const team = TEAMS.find((entry) => entry.key === profile.team)
  return (
    <Box sx={{ maxWidth: DRILL_CARD_WIDTH, display: 'grid', gap: 0 }}>
      <Masthead team={profile.team} name={team?.name ?? ''} question={profile.question} />

      <Band>
        <Beat label="What they measured">
          <Headline>{profile.measured}</Headline>
          <Prose>{profile.measuredNote}</Prose>
        </Beat>
        <Beat label="What goes into the score">
          <Headline>{profile.reaches}</Headline>
          <Prose>
            Only this part of what the subteam measured goes into the criterion score. This page
            shows everything else they measured.
          </Prose>
        </Beat>
      </Band>

      <Where profile={profile} />

      <Finding>{profile.finding}</Finding>

      {/* The bespoke middle. */}
      <Box sx={(theme) => ({ py: theme.jtSpacing.section.sm })}>{children}</Box>

      <Verdict profile={profile} />
      <NotScored items={profile.notScored} />
    </Box>
  )
}

function Masthead({ team, name, question }: { team: TeamKey; name: string; question: string }) {
  return (
    <Box sx={(theme) => ({ display: 'grid', gap: 1, pb: theme.jtSpacing.component.md })}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
        <TeamMark team={team} size={18} />
        <Typography variant="h4" component="h2">
          {name}
        </Typography>
      </Box>
      <Typography variant="body2" sx={{ maxWidth: '78ch', color: 'base.100' }}>
        {question}
      </Typography>
    </Box>
  )
}

/** The three facts that make the fan-out visible before any chart. */
function Band({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={(theme) => ({
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
        gap: theme.jtSpacing.gap.lg,
        py: theme.jtSpacing.component.md,
        borderTop: 1,
        borderBottom: 1,
        borderColor: 'border.default',
      })}
    >
      {children}
    </Box>
  )
}

function Beat({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Box sx={{ display: 'grid', gap: 0.75, alignContent: 'start' }}>
      <Typography variant="eyebrow">{label}</Typography>
      {children}
    </Box>
  )
}

function Headline({ children, small }: { children: ReactNode; small?: boolean }) {
  return (
    <Typography variant={small ? 'chartTitle' : 'numberArticle'} component="div">
      {children}
    </Typography>
  )
}

function Prose({ children }: { children: ReactNode }) {
  return (
    <Typography variant="body2" sx={{ color: 'base.300', maxWidth: '44ch' }}>
      {children}
    </Typography>
  )
}

/**
 * The outline, with the other subteams' behind it. This beat earns a row of its
 * own because the boundaries are a finding in themselves: each team drew them on
 * different reasoning, and the differences are visible only when they overlap.
 */
function Where({ profile }: { profile: SubteamProfile }) {
  return (
    <Box
      sx={(theme) => ({
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 420px) minmax(0, 1fr)' },
        gap: theme.jtSpacing.gap.lg,
        py: theme.jtSpacing.component.md,
        borderBottom: 1,
        borderColor: 'border.default',
      })}
    >
      <RegionMap active={profile.team} />
      <Box sx={{ display: 'grid', gap: 0.75, alignContent: 'start' }}>
        <Typography variant="eyebrow">Where they looked</Typography>
        <Typography variant="chartTitle" component="div">
          {profile.places.count}
        </Typography>
        <Typography variant="body2" sx={{ color: 'base.100', maxWidth: '58ch' }}>
          {profile.places.basis}
        </Typography>
        <RegionList active={profile.team} />
      </Box>
    </Box>
  )
}

/** Their one-sentence conclusion, in their terms rather than the ranking's. */
function Finding({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={(theme) => ({
        py: theme.jtSpacing.component.md,
        display: 'grid',
        gap: 0.75,
      })}
    >
      <Typography variant="eyebrow">What they found</Typography>
      <Typography variant="body1" sx={{ maxWidth: '68ch' }}>
        {children}
      </Typography>
    </Box>
  )
}

/**
 * Their scores and the rule behind them. A criterion with no published score says
 * so rather than showing ours, because borrowing our own number here would undo
 * the point of the page.
 */
function Verdict({ profile }: { profile: SubteamProfile }) {
  return (
    <Box
      sx={(theme) => ({
        display: 'grid',
        gap: 1,
        py: theme.jtSpacing.component.md,
        borderTop: 1,
        borderColor: 'border.default',
      })}
    >
      <Typography variant="eyebrow">How they rank the scenarios</Typography>

      {profile.verdict ? (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {SCENARIO_KEYS.map((key) => (
            <ScoreChip key={key} scenario={key} value={profile.verdict?.[key] ?? null} />
          ))}
        </Box>
      ) : (
        <Typography variant="body2" sx={{ maxWidth: '68ch' }}>
          This team does not publish a score at any level, so the comparison page uses a value we
          inferred for this criterion.
        </Typography>
      )}

      {profile.rule && (
        <Box sx={{ display: 'grid', gap: 0.3, maxWidth: '72ch', mt: 0.5 }}>
          <Typography variant="chartAxis" sx={{ color: 'base.300' }}>
            Their rule · {profile.ruleWhere}
          </Typography>
          <Typography variant="body2" sx={{ color: 'base.100' }}>
            {profile.rule}
          </Typography>
        </Box>
      )}
    </Box>
  )
}

function ScoreChip({ scenario, value }: { scenario: ScenarioKey; value: number | null }) {
  return (
    <Box
      sx={(theme) => ({
        display: 'grid',
        gap: 0.3,
        justifyItems: 'center',
        minWidth: 112,
        px: 1,
        py: 0.75,
        borderRadius: 1,
        border: value === null ? 1 : 0,
        borderStyle: 'dashed',
        borderColor: 'border.default',
        bgcolor: value === null ? 'transparent' : cellFill(value),
        color: value === null ? 'base.300' : theme.palette.common.white,
      })}
    >
      <Typography variant="chartValue">{value === null ? 'pending' : fmtScore(value)}</Typography>
      <Typography variant="chartAxis" sx={{ textAlign: 'center' }}>
        {SCENARIO_NAME[scenario]}
      </Typography>
    </Box>
  )
}

/**
 * The work that produces no number. On the comparison page this is a row of
 * dashes; here it is the part of the criterion its own team chose not to reduce.
 */
function NotScored({ items }: { items: SubteamProfile['notScored'] }) {
  if (items.length === 0) {
    return (
      <Box
        sx={(theme) => ({
          py: theme.jtSpacing.component.md,
          borderTop: 1,
          borderColor: 'border.default',
        })}
      >
        <Typography variant="eyebrow" sx={{ display: 'block', mb: 0.75 }}>
          What is not scored
        </Typography>
        <Typography variant="body2" sx={{ maxWidth: '68ch' }}>
          Nothing. Every metric in this criterion produces a value. Each measurement feeds into the
          score from start to finish; this is the only criterion of the five where that happens.
        </Typography>
      </Box>
    )
  }
  return (
    <Box
      sx={(theme) => ({
        display: 'grid',
        gap: 1.25,
        py: theme.jtSpacing.component.md,
        borderTop: 1,
        borderColor: 'border.default',
      })}
    >
      <Typography variant="eyebrow">What is not scored</Typography>
      {items.map((item) => (
        <Box key={item.label} sx={{ display: 'grid', gap: 0.3, maxWidth: '72ch' }}>
          <Typography variant="chartLabel">{item.label}</Typography>
          <Typography variant="body2" sx={{ color: 'base.100' }}>
            {item.why}
          </Typography>
        </Box>
      ))}
    </Box>
  )
}

// ---------- pieces the bespoke middles share ----------

/** A titled block inside a bespoke middle, so the five stay visually related. */
export function Panel({
  title,
  note,
  children,
}: {
  title: string
  note?: string
  children: ReactNode
}) {
  return (
    <Box sx={{ display: 'grid', gap: 1, mb: 3 }}>
      <Typography variant="chartTitle" component="h3">
        {title}
      </Typography>
      {note && (
        <Typography variant="body2" sx={{ color: 'base.300', maxWidth: '78ch' }}>
          {note}
        </Typography>
      )}
      {children}
    </Box>
  )
}

/** A row of choices; the subteam pages all need one or two of these. */
export function Choice<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: { key: T; label: string }[]
  value: T
  onChange: (key: T) => void
  label: string
}) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0.5 }}>
      <Typography variant="chartAxis" sx={{ color: 'base.300', mr: 0.5 }}>
        {label}
      </Typography>
      {options.map((option) => (
        <Box
          key={option.key}
          component="button"
          type="button"
          onClick={() => onChange(option.key)}
          aria-pressed={option.key === value}
          sx={{
            typography: 'controlLabel',
            px: 1.1,
            py: 0.5,
            borderRadius: 999,
            cursor: 'pointer',
            border: 1,
            borderColor: option.key === value ? 'primary.main' : 'border.strong',
            bgcolor: option.key === value ? 'primary.main' : 'transparent',
            color: option.key === value ? 'common.black' : 'base.50',
          }}
        >
          {option.label}
        </Box>
      ))}
    </Box>
  )
}
