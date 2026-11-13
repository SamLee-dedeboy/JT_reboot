// Filled label chip: a solid accent fill with dark text, used for team and entity tags.
import { Chip } from '@mui/material'
import type { ChipProps } from '@mui/material'
import { jtSpacing } from '@/theme'

/**
 * Non-navigation tag filled with `fill` (a team or accent color) and labeled in common.black.
 */
export default function TagChip({ fill, sx, ...rest }: ChipProps & { fill: string }) {
  return (
    <Chip
      sx={[
        {
          height: 'auto',
          color: 'base.700',
          bgcolor: fill,
          '& .MuiChip-label': {
            typography: 'chipLabel',
            color: 'inherit',
            py: jtSpacing.component.xs / 2,
            whiteSpace: 'normal',
            userSelect: 'none',
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...rest}
    />
  )
}
