// Small outlined pill for a variant of a row, such as a life stage.
import { Chip } from '@mui/material'

/**
 * A small pill for a variant of a row, such as a life stage. As a picker it is
 * green when on; with `plain` it is a quiet tag inside a table row, never brighter
 * than the label it qualifies.
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
        typography: plain ? 'controlLabel' : 'meta',
        color: plain ? 'base.200' : on ? 'common.white' : 'base.200',
        borderColor: plain ? 'border.strong' : on ? 'primary.main' : 'border.default',
        bgcolor: !plain && on ? 'translucent.primaryGreen' : 'transparent',
      }}
    />
  )
}
