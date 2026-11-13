import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import { Box, ButtonBase, Typography } from '@mui/material'
import { jtSpacing } from '@/theme'
import { focusRing } from '@/ui/focusRing'
import { choiceCardSx } from '@/ui/surfaceStyles'

export interface ChoiceGroup {
  id: string
  title: string
  options: readonly { id: string; label: string }[]
}

const columns = (count: number) => `repeat(${count}, minmax(0, 1fr))`

/**
 * One choice among labeled groups, on the same cards as the ranking page's "Choose how to
 * compare". The groups stack with their cards on one grid, then share a row where all fit.
 */
export default function ChoiceCards({
  groups,
  value,
  onChange,
}: {
  groups: readonly ChoiceGroup[]
  value: string
  onChange: (id: string) => void
}) {
  const widest = Math.max(...groups.map(({ options }) => options.length))

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: 'minmax(0, 1fr)',
          xl: groups.map(({ options }) => `${options.length}fr`).join(' '),
        },
        gap: jtSpacing.gap.md,
      }}
    >
      {groups.map(({ id, title, options }) => (
        <Box key={id} role="group" aria-labelledby={`choice-group-${id}`} sx={{ minWidth: 0 }}>
          <Typography
            id={`choice-group-${id}`}
            variant="columnHead"
            component="p"
            sx={{ mb: jtSpacing.gap.xs }}
          >
            {title}
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: columns(2),
                sm: columns(3),
                md: columns(widest),
                xl: columns(options.length),
              },
              gap: jtSpacing.gap.xs,
            }}
          >
            {options.map((option) => {
              const active = option.id === value
              return (
                <ButtonBase
                  key={option.id}
                  aria-pressed={active}
                  onClick={() => onChange(option.id)}
                  sx={{
                    ...choiceCardSx(active),
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: jtSpacing.gap.xs,
                    p: jtSpacing.component.sm,
                    textAlign: 'left',
                    '&.Mui-focusVisible': focusRing,
                  }}
                >
                  <Typography component="span" variant="chartTitle" sx={{ minWidth: 0 }}>
                    {option.label}
                  </Typography>
                  {/* Always laid out, so a label does not rewrap when its card is chosen. */}
                  <CheckRoundedIcon
                    fontSize="small"
                    sx={{ visibility: active ? 'visible' : 'hidden' }}
                  />
                </ButtonBase>
              )
            })}
          </Box>
        </Box>
      ))}
    </Box>
  )
}
