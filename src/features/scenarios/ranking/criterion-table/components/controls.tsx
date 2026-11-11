// The breakout table's controls, in the scenarios pages' vocabulary: the sticky
// numbered tab bar, a filled-primary active state, outlined chips for a set, and
// hairline-ruled rows for a list. Sized for a trackpad in a hurry and a projector.
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CheckIcon from '@mui/icons-material/Check'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Box, ButtonBase, Chip, IconButton, Stack, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { jtSpacing, ranking } from '../../../../../theme'
import TeamIcon from '../../../../../ui/TeamIcon'
import { TEAMS } from '../../model/teams'
import type { TeamKey } from '../../model/teams'
import { focusRing } from '../../../../../ui/focusRing'
import { pageX } from '../styles'

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
      aria-label="Criterion tables"
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
                <Typography component="span" variant="chartTitle" sx={{ whiteSpace: 'nowrap' }}>
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
            <Typography variant="body2" sx={{ color: 'inherit' }}>
              {action.label}
            </Typography>
          </ButtonBase>
        )}
      </Box>
      {children}
    </Stack>
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
            typography: 'body2',
          }}
        >
          {on && <CheckIcon fontSize="inherit" />}
        </Box>
        <Typography
          variant="body2"
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
