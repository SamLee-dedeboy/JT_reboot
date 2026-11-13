import { Box, Stack, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import { jtSpacing } from '@/theme'

/** Where a piece is used: a feature name, or "Not used yet". */
export function UsageTag({ children, used = true }: { children: ReactNode; used?: boolean }) {
  return (
    <Box
      component="span"
      sx={{
        typography: 'chartLabel',
        flex: 'none',
        px: 1,
        py: 0.25,
        borderRadius: 999,
        border: 1,
        borderColor: used ? 'primary.main' : 'border.strong',
        color: used ? 'primary.main' : 'base.100',
      }}
    >
      {children}
    </Box>
  )
}

/** A live component with its name, the tokens it is built from, and where it is used. */
export default function Specimen({
  name,
  spec,
  usage,
  children,
}: {
  name: string
  spec?: ReactNode
  usage?: ReactNode
  children: ReactNode
}) {
  return (
    <Stack spacing={jtSpacing.gap.sm} sx={{ minWidth: 0 }}>
      <Box sx={{ minWidth: 0 }}>{children}</Box>
      <Stack
        direction="row"
        spacing={jtSpacing.gap.sm}
        sx={{ alignItems: 'baseline', justifyContent: 'space-between' }}
      >
        <Stack spacing={0.25} sx={{ minWidth: 0 }}>
          <Typography variant="tableValueStrong" component="p">
            {name}
          </Typography>
          {spec && (
            <Typography variant="captionSmall" component="p" sx={{ color: 'base.200' }}>
              {spec}
            </Typography>
          )}
        </Stack>
        {usage}
      </Stack>
    </Stack>
  )
}

/** A titled run of specimens or swatches inside a section. */
export function SpecimenGroup({
  title,
  note,
  children,
}: {
  title: string
  note?: ReactNode
  children: ReactNode
}) {
  return (
    <Stack spacing={jtSpacing.gap.md}>
      <Typography variant="eyebrow" component="h3" sx={{ color: 'base.100' }}>
        {title}
      </Typography>
      {children}
      {note && (
        <Typography variant="body2" sx={{ maxWidth: jtSpacing.paragraphMaxWidth.default }}>
          {note}
        </Typography>
      )}
    </Stack>
  )
}
