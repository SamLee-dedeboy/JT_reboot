// One choice from a few, as a tray of options where the chosen one is filled: the
// ranking table's switches, the modeling page's salinity view, the regional summary.
import { Box, ButtonBase, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import type { ReactNode } from 'react'
import { jtSpacing, ranking } from '@/theme'
import { focusRing } from './focusRing'

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
  /** A color that replaces the green fill: the host team's color, for its own facets. */
  accent?: string
  /** Keep each label on one line: the tray then sizes to its labels. */
  nowrap?: boolean
  /** Many options in a row (places): one-line labels that wrap onto further lines. */
  wrap?: boolean
}) {
  const nowrap = nowrapLabels || wrap
  const fill = accent ?? 'primary.main'
  const hover = accent ? alpha(accent, 0.24) : 'translucent.primaryGreen'
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
