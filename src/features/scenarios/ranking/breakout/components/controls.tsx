// The breakout table's controls, in the scenarios pages' vocabulary: the sticky
// numbered tab bar, a filled-primary active state, outlined chips for a set, and
// hairline-ruled rows for a list. Sized for a trackpad in a hurry and a projector.
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CheckIcon from '@mui/icons-material/Check'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Box, ButtonBase, Chip, IconButton, Stack, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { jtSpacing, ranking } from '../../../../../theme'
import TeamIcon from '../../../../../ui/TeamIcon'
import { TEAMS } from '../../../../../internal/rank-visualization/data'
import type { TeamKey } from '../../../../../internal/rank-visualization/data'
import { focusRing, pageX } from '../styles'

/** The team switcher: the evaluation pages' numbered bar, stuck to the top of the screen. */
export function TableTabs({
  current,
  pathname = '/pages/breakout',
  search = '',
  stickyTop = 0,
}: {
  current: TeamKey
  pathname?: string
  /** More of the query to keep across tabs, such as `&set=outflow`. */
  search?: string
  stickyTop?: number | { xs: number; md: number }
}) {
  return (
    <Box
      component="nav"
      aria-label="Breakout tables"
      sx={{
        position: 'sticky',
        top: stickyTop,
        zIndex: 90,
        bgcolor: 'base.700',
        borderTop: 1,
        borderBottom: 1,
        borderColor: 'border.subtle',
        boxShadow: (theme) => theme.navigation.dropdownShadow,
      }}
    >
      <Box
        sx={{
          px: pageX,
          display: 'flex',
          justifyContent: 'center',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        <Stack direction="row" spacing={jtSpacing.gap.xs} sx={{ flex: '0 0 auto' }}>
          {TEAMS.map((team) => {
            const active = team.key === current
            return (
              <Box
                key={team.key}
                component={Link}
                to={{ pathname, search: `?team=${team.key}${search}` }}
                aria-current={active ? 'page' : undefined}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: jtSpacing.gap.xs,
                  px: jtSpacing.component.md,
                  py: jtSpacing.component.sm,
                  borderRadius: 1,
                  textDecoration: 'none',
                  color: active ? 'common.black' : team.color,
                  bgcolor: active ? team.color : 'transparent',
                  '&:hover, &:focus-visible': {
                    bgcolor: active ? team.color : 'translucent.100',
                    outline: 'none',
                  },
                }}
              >
                <TeamIcon team={team.key} size={18} />
                <Typography component="span" variant="button" sx={{ whiteSpace: 'nowrap' }}>
                  {team.name}
                </Typography>
              </Box>
            )
          })}
        </Stack>
      </Box>
    </Box>
  )
}

/** A labelled block in the rail, with an optional text action beside its title. */
export function RailGroup({
  title,
  info,
  action,
  children,
}: {
  title: string
  /** Sits right after the title: an info button, say. */
  info?: ReactNode
  action?: { label: string; onClick: () => void }
  children: ReactNode
}) {
  return (
    <Stack spacing={jtSpacing.gap.sm} component="section" aria-label={title}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        {/* An info button rides in the title's line without making it taller, so the
            controls of groups side by side stay on one level. */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            '& .MuiIconButton-root': { my: -0.5 },
          }}
        >
          <Typography variant="chartTitle" component="h4">
            {title}
          </Typography>
          {info}
        </Box>
        {action && (
          <ButtonBase
            onClick={action.onClick}
            sx={{
              color: 'primary.main',
              borderRadius: 0.5,
              '&:hover': { textDecoration: 'underline' },
              '&.Mui-focusVisible': focusRing,
            }}
          >
            <Typography variant="meta" sx={{ color: 'inherit' }}>
              {action.label}
            </Typography>
          </ButtonBase>
        )}
      </Box>
      {children}
    </Stack>
  )
}

export interface SegmentOption<T extends string> {
  value: T
  label: string
  disabled?: boolean
  /** An icon before the label, for a switch read at a glance. */
  icon?: ReactNode
}

/**
 * One choice from a few: a tray of options where the chosen one is filled with the
 * primary green, like the active tab above it. Wraps into `columns` for long lists.
 */
export function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
  columns = options.length,
  dense,
  tone = 'primary',
  accent,
  nowrap: nowrapLabels,
  wrap,
}: {
  label: string
  value: T
  options: SegmentOption<T>[]
  onChange: (value: T) => void
  columns?: number
  /** A shorter tray, for a switch that sits in a header row. */
  dense?: boolean
  /** The chosen option's fill: the page's green, or the brand blue for the sea level. */
  tone?: 'primary' | 'secondary'
  /** A color that replaces the tone's fill: the host team's color, for its own facets. */
  accent?: string
  /** Keep each label on one line: the tray then sizes to its labels. */
  nowrap?: boolean
  /** Many options in a row (places): one-line labels that wrap onto further lines. */
  wrap?: boolean
}) {
  const nowrap = nowrapLabels || wrap
  const fill = accent ?? `${tone}.main`
  const hover = accent
    ? alpha(accent, 0.24)
    : tone === 'secondary'
      ? 'translucent.primaryBlue'
      : 'translucent.primaryGreen'
  return (
    <Box
      role="radiogroup"
      aria-label={label}
      sx={{
        display: wrap ? 'flex' : 'grid',
        flexWrap: wrap ? 'wrap' : undefined,
        gridTemplateColumns: nowrap
          ? `repeat(${columns}, auto)`
          : `repeat(${columns}, minmax(0, 1fr))`,
        width: nowrap ? 'fit-content' : undefined,
        gap: ranking.breakoutControl.inset,
        p: ranking.breakoutControl.inset,
        border: 1,
        borderColor: 'border.strong',
        borderRadius: ranking.setToggle.radius,
        bgcolor: 'transparent',
      }}
    >
      {options.map((option) => {
        const on = option.value === value
        return (
          <ButtonBase
            key={option.value}
            role="radio"
            aria-checked={on}
            disabled={option.disabled}
            onClick={() => onChange(option.value)}
            sx={{
              justifyContent: 'center',
              textAlign: 'center',
              gap: 0.75,
              minHeight: dense ? 34 : ranking.breakoutControl.minHeight,
              px: dense ? 2 : jtSpacing.component.sm,
              py: dense ? 0.5 : 0.75,
              borderRadius: ranking.setToggle.radius,
              color: on ? 'common.black' : 'common.white',
              bgcolor: on ? fill : 'transparent',
              transition: 'background-color 160ms ease, color 160ms ease',
              '&:hover': { bgcolor: on ? fill : hover },
              '&.Mui-focusVisible': focusRing,
              '&.Mui-disabled': {
                color: 'base.300',
                outline: 1,
                outlineStyle: 'dashed',
                outlineColor: 'border.default',
                outlineOffset: -1,
              },
            }}
          >
            {option.icon}
            <Typography
              variant="body2"
              component="span"
              sx={{ color: 'inherit', whiteSpace: nowrap ? 'nowrap' : undefined }}
            >
              {option.label}
            </Typography>
          </ButtonBase>
        )
      })}
    </Box>
  )
}

/** One member of a set: the scenarios on screen. */
export function SetChip({
  label,
  on,
  onClick,
  disabled,
}: {
  label: string
  on: boolean
  onClick: () => void
  /** Held off by the reading, not by the host: shown dashed and not clickable. */
  disabled?: boolean
}) {
  return (
    <Chip
      label={label}
      onClick={onClick}
      aria-pressed={on}
      disabled={disabled}
      variant="outlined"
      icon={on ? <CheckCircleIcon /> : <RadioButtonUncheckedIcon />}
      sx={{
        justifyContent: 'flex-start',
        height: 'auto',
        minHeight: ranking.breakoutControl.minHeight,
        py: 0,
        pl: 0.75,
        borderRadius: ranking.setToggle.radius,
        typography: 'body2',
        '& .MuiChip-icon': { color: on ? 'primary.main' : 'base.300' },
        color: on ? 'common.white' : 'base.200',
        borderColor: on ? 'primary.main' : 'border.default',
        bgcolor: on ? 'translucent.primaryGreen' : 'transparent',
        '& .MuiChip-label': { whiteSpace: 'normal' },
        '&&:hover': { bgcolor: on ? 'translucent.primaryGreen' : 'translucent.100' },
        '&.Mui-focusVisible': { ...focusRing, bgcolor: 'translucent.primaryGreen' },
        '&.Mui-disabled': { opacity: 1, borderStyle: 'dashed', color: 'base.300' },
      }}
    />
  )
}

/** A measure in the list: a checkbox row, with a disclosure for its parts. */
export function MeasureRow({
  label,
  on,
  onToggle,
  parts,
  nested,
}: {
  label: string
  on: boolean
  onToggle: () => void
  parts?: { open: boolean; onToggle: () => void }
  nested?: boolean
}) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: parts ? 'minmax(0, 1fr) auto' : 'minmax(0, 1fr)',
        alignItems: 'center',
        borderTop: 1,
        borderColor: 'border.subtle',
      }}
    >
      <ButtonBase
        role="checkbox"
        aria-checked={on}
        onClick={onToggle}
        sx={{
          justifyContent: 'flex-start',
          textAlign: 'left',
          gap: jtSpacing.gap.sm,
          py: nested ? 0.75 : 1.1,
          pl: nested ? jtSpacing.component.md : 0,
          pr: 1,
          borderRadius: 0.5,
          '&:hover .measure-box': { borderColor: 'primary.main' },
          '&.Mui-focusVisible': focusRing,
        }}
      >
        <Box
          className="measure-box"
          sx={{
            width: 18,
            height: 18,
            flex: 'none',
            display: 'grid',
            placeItems: 'center',
            borderRadius: 0.5,
            border: 1.5,
            borderColor: on ? 'primary.main' : 'border.strong',
            bgcolor: on ? 'primary.main' : 'transparent',
            color: 'common.black',
            // The tick takes its size from a text variant, not a literal.
            typography: 'meta',
          }}
        >
          {on && <CheckIcon fontSize="inherit" />}
        </Box>
        <Typography
          variant={nested ? 'meta' : 'body2'}
          component="span"
          sx={{ color: on ? 'common.white' : 'base.100' }}
        >
          {label}
        </Typography>
      </ButtonBase>
      {parts && (
        <IconButton
          size="small"
          onClick={parts.onToggle}
          aria-expanded={parts.open}
          aria-label={parts.open ? `Close the parts of ${label}` : `Open the parts of ${label}`}
          sx={{ color: parts.open ? 'primary.main' : 'base.100' }}
        >
          {parts.open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      )}
    </Box>
  )
}

/** The life-stage pill now lives in the shared UI; re-exported for this page's imports. */
export { default as StageChip } from '../../../../../ui/StageChip'
