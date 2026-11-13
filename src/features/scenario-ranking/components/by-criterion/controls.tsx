// The breakout table's controls, in the scenarios pages' vocabulary: the sticky
// numbered tab bar, a filled-primary active state, outlined chips for a set, and
// hairline-ruled rows for a list. Sized for a trackpad in a hurry and a projector.
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import { Box, ButtonBase, Chip, Stack, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { jtSpacing, ranking } from '@/theme'
import { TeamIcon } from '@/ui'
import { TEAMS } from '../../model/teams'
import type { TeamKey } from '../../model/teams'
import { focusRing } from '@/ui/focusRing'
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

/** The life-stage pill now lives in the shared UI; re-exported for this page's imports. */
export { StageChip } from '@/ui'
