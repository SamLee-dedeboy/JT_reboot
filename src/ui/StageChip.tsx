// Small outlined pill for a variant of a row, such as a life stage.
import { Chip } from '@mui/material'

/**
 * A small pill for a variant of a row, such as a life stage. As a picker it is
 * green when on; with `plain` it is an off-white label inside a table row.
 */
export default function StageChip({
  label,
  on = false,
  plain,
}: {
  label: string
  on?: boolean
  plain?: boolean
}) {
  return (
    <Chip
      component="span"
      size="small"
      variant="outlined"
      label={label}
      sx={{
        flex: 'none',
        typography: 'meta',
        color: plain ? 'base.50' : on ? 'common.white' : 'base.200',
        borderColor: plain ? 'base.50' : on ? 'primary.main' : 'border.default',
        bgcolor: !plain && on ? 'translucent.primaryGreen' : 'transparent',
      }}
    />
  )
}
