// The breakout table's controls, in the scenarios pages' vocabulary: the sticky
// numbered tab bar, a filled-primary active state, outlined chips for a set, and
// hairline-ruled rows for a list. Sized for a trackpad in a hurry and a projector.
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import {
  Box,
  ButtonBase,
  Chip,
  Menu,
  MenuItem,
  Stack,
  Typography,
  useMediaQuery,
} from '@mui/material'
import type { Theme } from '@mui/material/styles'
import { useId, useState } from 'react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { jtSpacing, ranking } from '@/theme'
import { TeamIcon } from '@/ui'
import { TEAMS } from '../../model/teams'
import type { TeamKey } from '../../model/teams'
import { focusRing } from '@/ui/focusRing'
import { UI } from '../../tableText'
import { pageX } from './styles'

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
  const mdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'))
  const href = (team: TeamKey) => ({ pathname, search: `?team=${team}${search}` })
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
      {mdUp ? (
        // All six at once, in equal tabs: a long name takes two lines rather than
        // pushing a criterion off the edge, where nobody would know to scroll for it.
        <Box
          sx={{
            px: pageX,
            display: 'grid',
            gridTemplateColumns: `repeat(${TEAMS.length}, minmax(0, 1fr))`,
            gap: jtSpacing.gap.xs,
          }}
        >
          {TEAMS.map((team) => {
            const active = team.key === current
            return (
              <Box
                key={team.key}
                component={Link}
                to={href(team.key)}
                aria-current={active ? 'page' : undefined}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: jtSpacing.gap.xs,
                  px: jtSpacing.component.sm,
                  py: jtSpacing.component.sm,
                  borderRadius: 1,
                  textAlign: 'center',
                  textDecoration: 'none',
                  color: active ? 'common.black' : team.color,
                  bgcolor: active ? team.color : 'transparent',
                  '&:hover, &:focus-visible': {
                    bgcolor: active ? team.color : 'translucent.100',
                    outline: 'none',
                  },
                }}
              >
                <Box sx={{ flex: 'none', display: 'inline-flex' }}>
                  <TeamIcon team={team.key} size={18} />
                </Box>
                <Typography component="span" variant="chartTitle">
                  {team.name}
                </Typography>
              </Box>
            )
          })}
        </Box>
      ) : (
        <CriterionPicker current={current} href={href} />
      )}
    </Box>
  )
}

/**
 * Below md, the six criteria as one picker: which one is on screen, that it is one of
 * six, and a menu of all of them. A row of tabs that scrolls sideways hides the rest.
 */
function CriterionPicker({
  current,
  href,
}: {
  current: TeamKey
  href: (team: TeamKey) => { pathname: string; search: string }
}) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)
  const team = TEAMS.find((entry) => entry.key === current) ?? TEAMS[0]
  const menuId = useId()
  return (
    <Box sx={{ px: pageX, py: jtSpacing.component.sm }}>
      <ButtonBase
        onClick={(event) => setAnchor(event.currentTarget)}
        aria-haspopup="menu"
        aria-expanded={anchor ? true : undefined}
        aria-controls={anchor ? menuId : undefined}
        sx={{
          width: 1,
          minHeight: ranking.breakoutRow.score,
          display: 'flex',
          alignItems: 'center',
          gap: jtSpacing.gap.sm,
          px: jtSpacing.component.sm,
          textAlign: 'left',
          bgcolor: 'base.800',
          border: 1,
          borderColor: team.color,
          borderRadius: 1,
          '&.Mui-focusVisible': focusRing,
        }}
      >
        <Box sx={{ flex: 'none', display: 'inline-flex', color: team.color }}>
          <TeamIcon team={team.key} size={18} />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="chartTitle" component="span" sx={{ color: team.color }}>
            {team.name}
          </Typography>
        </Box>
        <Typography variant="body2" component="span" sx={{ color: 'common.white' }}>
          {UI.changeCriterion}
        </Typography>
        <ExpandMoreRoundedIcon
          sx={{
            color: 'common.white',
            transform: anchor ? 'rotate(180deg)' : 'none',
            transition: 'transform 150ms ease',
          }}
        />
      </ButtonBase>
      <Menu
        id={menuId}
        anchorEl={anchor}
        open={!!anchor}
        onClose={() => setAnchor(null)}
        slotProps={{
          paper: {
            sx: (theme) => ({
              width: anchor?.offsetWidth,
              bgcolor: 'base.700',
              border: 1,
              borderColor: 'border.default',
              mt: theme.jtSpacing.gap.xs,
            }),
          },
        }}
      >
        {TEAMS.map((entry) => {
          const active = entry.key === current
          return (
            <MenuItem
              key={entry.key}
              component={Link}
              to={href(entry.key)}
              selected={active}
              aria-current={active ? 'page' : undefined}
              onClick={() => setAnchor(null)}
              sx={{ minHeight: ranking.breakoutRow.score, gap: jtSpacing.gap.sm }}
            >
              <Box sx={{ flex: 'none', display: 'inline-flex', color: entry.color }}>
                <TeamIcon team={entry.key} size={18} />
              </Box>
              <Typography variant="body2" component="span" sx={{ flex: 1, color: 'common.white' }}>
                {entry.name}
              </Typography>
              {active && <CheckRoundedIcon fontSize="small" sx={{ color: 'primary.main' }} />}
            </MenuItem>
          )
        })}
      </Menu>
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

/** The life-stage pill now lives in the shared UI; re-exported for this page's imports. */
export { StageChip } from '@/ui'
