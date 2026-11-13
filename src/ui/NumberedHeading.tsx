import { Stack, Typography } from '@mui/material'
import { jtSpacing } from '@/theme'

/** A section heading with an optional number above it (evaluation, criterion and watershed pages). */
export default function NumberedHeading({
  number,
  title,
  id,
  accent,
  variant = 'h2',
}: {
  /** Section number shown above the title; omitted on pages that list sections in a rail. */
  number?: string
  title: string
  id: string
  /** Team color for the number. */
  accent?: string
  /** Type style for the title; it stays an h2 element either way. */
  variant?: 'h2' | 'h3'
}) {
  return (
    <Stack spacing={jtSpacing.gap.xs} sx={{ mb: jtSpacing.gap.lg }}>
      {number && (
        <Typography variant="numberArticle" component="p" aria-hidden="true" sx={{ color: accent }}>
          {number}
        </Typography>
      )}
      <Typography variant={variant} component="h2" id={id}>
        {title}
      </Typography>
    </Stack>
  )
}
