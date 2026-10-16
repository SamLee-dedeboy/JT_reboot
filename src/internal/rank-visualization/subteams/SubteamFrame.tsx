// The repeating frame of a subteam page.
//
// The beats run in the order a reader needs them: the question they asked, where
// they looked, what they measured (which introduces the unit the charts use), how
// they measured it, the evidence itself, what they found, how that becomes a
// −5…+5 score, and what they left unscored. Only the evidence is bespoke, because
// the five subteams analysed genuinely different kinds of thing and one chart form
// would flatten them.
//
// Visually the beats are chapters: each sits on its own panel, a sticky rail lists
// them and tracks the reader's place, and figures sit on a darker inset inside the
// chapter so chart and prose never share a surface.
import { Box, ButtonBase, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { TEAMS, cellFill, fmtScore } from '../data'
import { valueAt } from '../drilldown/cellValue'
import { ANY, cellProvenance, fmtValue } from '../drilldown/model'
import type { TeamKey } from '../data'
import { TeamMark } from '../drilldown/DrillBits'
import { DRILL_CARD_WIDTH } from '../drilldown/scales'
import { SCENARIO_KEYS, SCENARIO_NAME } from '../drilldown/model'
import type { ScenarioKey } from '../drilldown/model'
import type { SubteamProfile } from './profiles'
import { RegionMap } from './RegionMap'
import { rich } from './rich'
import { RegionStrip } from './aids'

type ChapterId = 'where' | 'measured' | 'method' | 'evidence' | 'found' | 'score' | 'unscored'

const CHAPTER_LABEL: Record<ChapterId, string> = {
  where: 'Where they looked',
  measured: 'What they measured',
  method: 'How they measured it',
  evidence: 'The evidence',
  found: 'What they found',
  score: 'How this becomes a score',
  unscored: 'What is not scored',
}

/** Clears the sticky navbar when a rail item scrolls a chapter into view. */
const SCROLL_MARGIN = 88

export function SubteamPage({
  profile,
  aid,
  aidWide,
  method,
  children,
}: {
  profile: SubteamProfile
  /** A small drawing of the measurement's size or shape, beside the text. */
  aid?: ReactNode
  /** The aid needs the chapter's full width; it goes below the text instead of beside it. */
  aidWide?: boolean
  /** How the measurement was made: limits, classes, the reduction steps. */
  method?: ReactNode
  children: ReactNode
}) {
  const team = TEAMS.find((entry) => entry.key === profile.team)
  const hasMethod = !!method
  const chapters = useMemo<ChapterId[]>(
    () =>
      (
        ['where', 'measured', 'method', 'evidence', 'found', 'score', 'unscored'] as ChapterId[]
      ).filter((id) => id !== 'method' || hasMethod),
    [hasMethod],
  )
  const active = useActiveChapter(chapters)

  return (
    <Box sx={{ maxWidth: DRILL_CARD_WIDTH, display: 'grid', gap: 0 }}>
      <Masthead team={profile.team} name={team?.name ?? ''} question={profile.question} />

      <Box
        sx={(theme) => ({
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '220px minmax(0, 1fr)' },
          gap: theme.jtSpacing.gap.lg,
          alignItems: 'start',
        })}
      >
        <Rail chapters={chapters} active={active} />

        <Box sx={(theme) => ({ display: 'grid', gap: theme.jtSpacing.gap.md, minWidth: 0 })}>
          <Chapter id="where">
            <Box
              sx={(theme) => ({
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 400px) minmax(0, 1fr)' },
                gap: theme.jtSpacing.gap.lg,
                alignItems: 'start',
              })}
            >
              <Figure>
                <RegionMap active={profile.team} />
              </Figure>
              <Box sx={{ display: 'grid', gap: 1.25, alignContent: 'start' }}>
                <Lead>{profile.places.count}</Lead>
                <Prose>{profile.places.basis}</Prose>
                {profile.places.regions && (
                  <RegionStrip
                    regions={profile.places.regions}
                    order={profile.places.order ?? ''}
                  />
                )}
                <Prose>
                  The **solid outline** is this subteam’s geography. The **dashed outlines** behind
                  it belong to the other subteams, which drew their own.
                </Prose>
              </Box>
            </Box>
          </Chapter>

          <Chapter id="measured">
            <Box
              sx={(theme) => ({
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  md: aidWide ? '1fr' : 'minmax(0, 1fr) minmax(0, 400px)',
                },
                gap: theme.jtSpacing.gap.lg,
                alignItems: 'start',
              })}
            >
              <Box sx={{ display: 'grid', gap: 1.25 }}>
                <Lead>{profile.measured}</Lead>
                <Prose>{profile.measuredNote}</Prose>
              </Box>
              {aid && <Figure>{aid}</Figure>}
            </Box>
          </Chapter>

          {method && <Chapter id="method">{method}</Chapter>}

          <Chapter id="evidence">{children}</Chapter>

          <Chapter id="found">
            <Typography variant="body1" sx={{ maxWidth: '68ch', color: 'base.50' }}>
              {rich(profile.finding)}
            </Typography>
            {profile.findings && (
              <Box
                sx={(theme) => ({
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
                  columnGap: theme.jtSpacing.gap.lg,
                  rowGap: theme.jtSpacing.gap.md,
                  mt: 1,
                })}
              >
                {profile.findings.map((item) => (
                  <Box key={item.label} sx={{ display: 'grid', gap: 0.75, alignContent: 'start' }}>
                    <SubHead>{item.label}</SubHead>
                    <Prose>{item.text}</Prose>
                  </Box>
                ))}
              </Box>
            )}
          </Chapter>

          <Score profile={profile} />
          <NotScored items={profile.notScored} />
        </Box>
      </Box>
    </Box>
  )
}

function Masthead({ team, name, question }: { team: TeamKey; name: string; question: string }) {
  return (
    <Box sx={(theme) => ({ display: 'grid', gap: 1.5, pb: theme.jtSpacing.section.xs })}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
        <TeamMark team={team} size={26} />
        <Typography
          variant="h3"
          component="div"
          role="heading"
          aria-level={2}
          sx={{ color: 'secondary.main' }}
        >
          {name}
        </Typography>
      </Box>
      <Typography variant="bodyLarge" sx={{ maxWidth: '62ch', color: 'base.50' }}>
        {rich(question)}
      </Typography>
    </Box>
  )
}

/** Which chapter is in view, for the rail. The page remounts per team, so no reset is needed. */
function useActiveChapter(chapters: ChapterId[]): ChapterId {
  const [active, setActive] = useState<ChapterId>(chapters[0])
  useEffect(() => {
    const seen = new Map<ChapterId, number>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          seen.set(entry.target.id as ChapterId, entry.isIntersecting ? entry.intersectionRatio : 0)
        }
        // The first chapter in page order that is visible wins, so reading down
        // the page moves the marker down the rail in step.
        const first = chapters.find((id) => (seen.get(id) ?? 0) > 0)
        if (first) setActive(first)
      },
      { rootMargin: `-${SCROLL_MARGIN}px 0px -55% 0px`, threshold: [0, 0.1] },
    )
    for (const id of chapters) {
      const node = document.getElementById(id)
      if (node) observer.observe(node)
    }
    return () => observer.disconnect()
  }, [chapters])
  return active
}

function Rail({ chapters, active }: { chapters: ChapterId[]; active: ChapterId }) {
  return (
    <Box
      component="nav"
      aria-label="Sections"
      sx={{
        display: { xs: 'none', lg: 'grid' },
        gap: 0.25,
        position: 'sticky',
        top: SCROLL_MARGIN,
        alignContent: 'start',
      }}
    >
      {chapters.map((id) => {
        const on = id === active
        return (
          <ButtonBase
            key={id}
            onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })}
            aria-current={on ? 'location' : undefined}
            sx={{
              justifyContent: 'start',
              textAlign: 'left',
              px: 1.25,
              py: 0.9,
              borderRadius: 1,
              borderLeft: 2,
              borderColor: on ? 'primary.main' : 'transparent',
              bgcolor: on ? 'translucent.100' : 'transparent',
              '&:hover, &.Mui-focusVisible': { bgcolor: 'translucent.100' },
            }}
          >
            <Typography variant="body2" sx={{ color: on ? 'base.50' : 'base.100' }}>
              {CHAPTER_LABEL[id]}
            </Typography>
          </ButtonBase>
        )
      })}
    </Box>
  )
}

/** One beat of the spine, on its own panel, with the rail's label as its title. */
function Chapter({ id, children }: { id: ChapterId; children: ReactNode }) {
  return (
    <Box
      component="section"
      id={id}
      aria-labelledby={`${id}-title`}
      sx={(theme) => ({
        display: 'grid',
        gap: theme.jtSpacing.gap.sm,
        p: { xs: theme.jtSpacing.component.md, md: theme.jtSpacing.component.lg },
        borderRadius: 2,
        bgcolor: 'base.700',
        border: 1,
        borderColor: 'border.subtle',
        scrollMarginTop: SCROLL_MARGIN,
      })}
    >
      <Typography id={`${id}-title`} variant="chartTitle" component="h3">
        {CHAPTER_LABEL[id]}
      </Typography>
      {children}
    </Box>
  )
}

/** A heading inside a chapter, ruled off from its text. */
function SubHead({ children }: { children: ReactNode }) {
  return (
    <Typography
      variant="body1"
      component="h4"
      sx={{ color: 'base.50', pb: 0.5, borderBottom: 1, borderColor: 'border.default' }}
    >
      <Box component="strong">{children}</Box>
    </Typography>
  )
}

/** The one line a chapter leads with. */
function Lead({ children }: { children: ReactNode }) {
  return (
    <Typography variant="cardTitle" component="div" sx={{ color: 'base.50' }}>
      {rich(children)}
    </Typography>
  )
}

function Prose({ children }: { children: ReactNode }) {
  return (
    <Typography variant="body2" sx={{ color: 'base.100', maxWidth: '72ch' }}>
      {rich(children)}
    </Typography>
  )
}

/** A darker inset for anything drawn, so figures never share a surface with prose. */
export function Figure({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={(theme) => ({
        p: theme.jtSpacing.component.sm,
        borderRadius: 1.5,
        bgcolor: 'base.800',
        minWidth: 0,
      })}
    >
      {children}
    </Box>
  )
}

/**
 * Their scores and the rule behind them. The −5…+5 scale is defined here, on its
 * first use. A criterion with no published score says so rather than showing
 * ours, because borrowing our own number here would undo the point of the page.
 */
function Score({ profile }: { profile: SubteamProfile }) {
  return (
    <Chapter id="score">
      <Prose>
        Every subteam ends with ==one score per scenario== on the same scale, from **−5 to +5**.
        Business as Usual is the baseline at **0**; above 0 a scenario does better than today on
        this criterion, below 0 worse.
      </Prose>

      <Figure>
        <Scoreboard board={profile.scoreboard} />
      </Figure>

      <Box
        sx={(theme) => ({
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
          gap: theme.jtSpacing.gap.lg,
          mt: 0.5,
        })}
      >
        <Box sx={{ display: 'grid', gap: 0.75, alignContent: 'start' }}>
          <SubHead>What goes in: {profile.reaches}</SubHead>
          <Prose>{profile.reachesNote}</Prose>
        </Box>
        {profile.rule && (
          <Box sx={{ display: 'grid', gap: 0.75, alignContent: 'start' }}>
            <SubHead>Their rule</SubHead>
            <Prose>{`${profile.rule} (${profile.ruleWhere})`}</Prose>
          </Box>
        )}
      </Box>
    </Chapter>
  )
}

/**
 * The metric ranks the team published and the criterion score they become, one
 * column per scenario. A value we worked out rather than read from the team
 * carries an asterisk, and an unscored metric shows a dash, so the row of
 * criterion scores can be traced back to exactly what the team wrote.
 */
function Scoreboard({ board }: { board: SubteamProfile['scoreboard'] }) {
  const rows = [
    ...board.metrics.map((metric) => ({ ...metric, criterion: false })),
    { label: 'Criterion score', id: board.criterion, criterion: true },
  ]
  // A metric the team published as a measurement rather than a rank (acres, say)
  // shows its value in the team's unit on a neutral cell: it is not on the −5…+5
  // scale and must not borrow the score colours.
  const read = (id: string, scenario: ScenarioKey) => {
    const cell = valueAt({ criterion: id, scenario, place: ANY, period: ANY })
    const provenance = cell.node ? cellProvenance(cell.node, scenario, cell.value) : 'unscored'
    const unit = cell.unit ?? 'score'
    return { value: cell.value, ours: provenance === 'inferred', unit, isScore: unit === 'score' }
  }
  let anyOurs = false
  let anyMeasurement = false
  return (
    <Box sx={{ display: 'grid', gap: 1 }}>
      <Box sx={{ overflowX: 'auto', overflowY: 'hidden' }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: `170px repeat(${SCENARIO_KEYS.length}, minmax(78px, 1fr))`,
            columnGap: 0.5,
            rowGap: 0.5,
            minWidth: 640,
            alignItems: 'center',
          }}
        >
          <Box />
          {SCENARIO_KEYS.map((key) => (
            <ColumnHead key={key}>{SCENARIO_NAME[key]}</ColumnHead>
          ))}
          {rows.map((row) => (
            <Box key={row.id} sx={{ display: 'contents' }}>
              <Typography
                variant="body2"
                sx={{
                  color: 'base.50',
                  alignSelf: 'center',
                  pt: row.criterion ? 0.75 : 0,
                }}
              >
                {row.criterion ? <Box component="strong">{row.label}</Box> : row.label}
              </Typography>
              {SCENARIO_KEYS.map((key) => {
                const { value, ours, unit, isScore } = read(row.id, key)
                if (ours && isScore) anyOurs = true
                if (!isScore && value !== null) anyMeasurement = true
                const empty = value === null
                return (
                  <Box
                    key={key}
                    sx={(theme) => ({
                      height: row.criterion ? 40 : 32,
                      mt: row.criterion ? 0.75 : 0,
                      display: 'flex',
                      alignItems: 'center',
                      px: 1,
                      borderRadius: 0.4,
                      border: empty ? 1 : 0,
                      borderStyle: 'dashed',
                      borderColor: 'border.default',
                      bgcolor: empty
                        ? 'transparent'
                        : isScore
                          ? cellFill(value)
                          : 'translucent.200',
                      color: empty ? 'base.200' : isScore ? theme.palette.common.white : 'base.50',
                    })}
                  >
                    <Typography
                      variant={row.criterion ? 'chartValueLarge' : 'body2'}
                      sx={{ color: 'inherit' }}
                    >
                      {empty
                        ? '—'
                        : isScore
                          ? `${fmtScore(value)}${ours ? '*' : ''}`
                          : fmtValue(value, unit)}
                    </Typography>
                  </Box>
                )
              })}
            </Box>
          ))}
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: 1.5 }}>
        <Typography variant="body2" sx={{ color: 'base.100' }}>
          Blue is better than today, orange worse. A dash is a metric the team did not score.
          {anyMeasurement &&
            ' A grey cell is a measurement the team published in its own unit without ranking it.'}
        </Typography>
        {anyOurs && (
          <Typography variant="body2" sx={{ color: 'base.100' }}>
            * our value, worked out from what the team published, not a score the team gave.
          </Typography>
        )}
      </Box>
    </Box>
  )
}

/**
 * The work that produces no number. On the comparison page this is a row of
 * dashes; here it is the part of the criterion its own team chose not to reduce.
 */
function NotScored({ items }: { items: SubteamProfile['notScored'] }) {
  return (
    <Chapter id="unscored">
      {items.length === 0 ? (
        <Prose>
          **Nothing.** Every metric in this criterion produces a value, and each measurement feeds
          the score from start to finish. This is the only criterion of the five where that happens.
        </Prose>
      ) : (
        <Box
          sx={(theme) => ({
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
            columnGap: theme.jtSpacing.gap.lg,
            rowGap: theme.jtSpacing.gap.md,
          })}
        >
          {items.map((item) => (
            <Box key={item.label} sx={{ display: 'grid', gap: 0.75, alignContent: 'start' }}>
              <SubHead>{item.label}</SubHead>
              <Prose>{item.why}</Prose>
            </Box>
          ))}
        </Box>
      )}
    </Chapter>
  )
}

// ---------- pieces the bespoke middles share ----------

/** A titled block inside a chapter: a sentence-case title, an intro, then the figure. */
export function Panel({
  title,
  intro,
  children,
}: {
  title: string
  intro?: string
  children: ReactNode
}) {
  return (
    <Box sx={(theme) => ({ display: 'grid', gap: 1.25, mb: theme.jtSpacing.component.md })}>
      <Typography variant="cardTitle" component="h4" sx={{ color: 'base.50' }}>
        {title}
      </Typography>
      {intro && <Prose>{intro}</Prose>}
      <Figure>
        <Box sx={{ display: 'grid', gap: 1.25 }}>{children}</Box>
      </Figure>
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
    <Box
      role="radiogroup"
      aria-label={label}
      sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0.5 }}
    >
      <Typography variant="body2" sx={{ color: 'base.100', mr: 0.5 }}>
        {label}
      </Typography>
      {options.map((option) => (
        <Box
          key={option.key}
          component="button"
          type="button"
          role="radio"
          onClick={() => onChange(option.key)}
          aria-checked={option.key === value}
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
            '&:focus-visible': { outline: 2, outlineColor: 'primary.main', outlineOffset: 2 },
          }}
        >
          {option.label}
        </Box>
      ))}
    </Box>
  )
}

/** A swatch set inline with its label, on the text's own baseline. */
export function Swatch({
  tone,
  opacity = 1,
  dashed,
}: {
  tone?: string
  opacity?: number
  dashed?: boolean
}) {
  return (
    <Box
      component="span"
      sx={{
        display: 'inline-block',
        width: 14,
        height: 14,
        borderRadius: 0.3,
        verticalAlign: '-2px',
        bgcolor: dashed ? 'transparent' : tone,
        opacity,
        border: dashed ? 1 : 0,
        borderStyle: 'dashed',
        borderColor: 'border.default',
      }}
    />
  )
}

/** One legend per chart with categorical colour: a swatch and what it means. */
export function Legend({
  items,
  note,
}: {
  items: { swatch: string; label: string }[]
  note?: string
}) {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: 1.5 }}>
      {items.map((item) => (
        <Typography key={item.label} variant="body2" sx={{ color: 'base.50' }}>
          <Swatch tone={item.swatch} /> {item.label}
        </Typography>
      ))}
      {note && (
        <Typography variant="body2" sx={{ color: 'base.100' }}>
          {note}
        </Typography>
      )}
    </Box>
  )
}

const SCALE_STEPS = [0.2, 0.4, 0.6, 0.8, 1]

/**
 * The legend for a heat grid: the same five tints the cells use, from faint to
 * full, with the values at each end, and the dashed cell that means zero.
 */
export function ScaleLegend({
  tone,
  label,
  min,
  max,
  zero,
}: {
  tone: string
  label: string
  min: string
  max: string
  /** What a dashed cell means, where the grid has them. */
  zero?: string
}) {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: 1.5 }}>
      <Typography variant="body2" sx={{ color: 'base.50' }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ color: 'base.100' }}>
        {min}{' '}
        {SCALE_STEPS.map((step) => (
          <Swatch key={step} tone={tone} opacity={0.18 + step * 0.82} />
        ))}{' '}
        {max}
      </Typography>
      {zero && (
        <Typography variant="body2" sx={{ color: 'base.100' }}>
          <Swatch dashed /> {zero}
        </Typography>
      )}
    </Box>
  )
}

/**
 * A continuous legend for a diverging fill: the same ramp the cells use, from the
 * deepest orange through neutral to the deepest blue, labelled at both ends and at
 * zero with the values those colours stand for.
 */
export function DivergingLegend({
  label,
  min,
  max,
  note,
}: {
  label: string
  min: string
  max: string
  note?: string
}) {
  const stops = [-5, -2.5, 0, 2.5, 5].map((step) => cellFill(step))
  return (
    <Box sx={{ display: 'grid', gap: 0.5 }}>
      <Typography variant="body2" sx={{ color: 'base.50' }}>
        {label}
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'auto minmax(160px, 320px) auto',
          gap: 1,
          alignItems: 'center',
        }}
      >
        <Typography variant="body2" sx={{ color: 'base.100' }}>
          {min}
        </Typography>
        <Box sx={{ display: 'grid', gap: 0.25 }}>
          <Box
            sx={{
              height: 12,
              borderRadius: 0.4,
              background: `linear-gradient(90deg, ${stops.join(', ')})`,
            }}
          />
          <Typography variant="body2" sx={{ color: 'base.100', textAlign: 'center' }}>
            0
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ color: 'base.100' }}>
          {max}
        </Typography>
      </Box>
      {note && (
        <Typography variant="body2" sx={{ color: 'base.100' }}>
          {note}
        </Typography>
      )}
    </Box>
  )
}

/** A column heading inside a grid: the body face, bold, so charts use one font. */
export function ColumnHead({ children }: { children: ReactNode }) {
  return (
    <Typography variant="body2" sx={{ color: 'base.100', alignSelf: 'end' }}>
      <Box component="strong">{children}</Box>
    </Typography>
  )
}

/** A row heading inside a grid. */
export function RowHead({ children }: { children: ReactNode }) {
  return (
    <Typography variant="body2" sx={{ color: 'base.50', alignSelf: 'center' }}>
      {children}
    </Typography>
  )
}

/**
 * A heat cell that prints its value. The tint sits on its own layer so the text
 * stays fully opaque; a measured zero keeps the frame as a dashed outline.
 */
export function HeatCell({
  value,
  max,
  tone,
  text,
  title,
  height = 30,
  fill,
}: {
  value: number | null
  max: number
  tone: string
  text: string
  title?: string
  height?: number
  /** A ready-made colour (a diverging fill) instead of the tone at a strength. */
  fill?: string
}) {
  const strength = value === null ? 0 : Math.min(1, Math.abs(value) / max)
  const missing = value === null
  const zero = value === 0
  return (
    <Box
      title={title}
      sx={{
        position: 'relative',
        height,
        display: 'flex',
        alignItems: 'center',
        px: 0.75,
        borderRadius: 0.4,
        border: missing ? 1 : 0,
        borderStyle: 'dashed',
        borderColor: 'border.default',
        bgcolor: zero ? 'translucent.50' : 'transparent',
        overflow: 'hidden',
      }}
    >
      {!missing && !zero && (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            bgcolor: fill ?? tone,
            opacity: fill ? 1 : 0.18 + strength * 0.82,
          }}
        />
      )}
      <Typography
        variant="body2"
        sx={{ position: 'relative', color: missing || zero ? 'base.200' : 'common.white' }}
      >
        {text}
      </Typography>
    </Box>
  )
}
