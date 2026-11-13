// Pieces every section of the modeling page uses: its spacing, text width and headings.
import { Box, Typography } from '@mui/material'
import { type ReactNode } from 'react'
import { jtSpacing } from '@/theme'
import { textMaxWidth } from './sectionStyles'

/** A key phrase picked out of running text, in bold primary blue. */
export function KeyPhrase({ children }: { children: ReactNode }) {
  return (
    <Box component="strong" sx={{ color: 'secondary.main' }}>
      {children}
    </Box>
  )
}

export function SubsectionHeading({
  id,
  title,
  color,
  children,
}: {
  id: string
  title: ReactNode
  color?: string
  children?: ReactNode
}) {
  return (
    <>
      <Typography id={id} variant="h3" component="h3" sx={{ color }}>
        {title}
      </Typography>
      {children && (
        <Typography
          variant="body1"
          sx={{
            mt: jtSpacing.gap.sm,
            color: 'base.100',
            maxWidth: textMaxWidth,
          }}
        >
          {children}
        </Typography>
      )}
    </>
  )
}

/** One labeled block within a group of futures. */
export function GroupBlock({
  id,
  title,
  children,
}: {
  id?: string
  title: string
  children: ReactNode
}) {
  return (
    <Box id={id} sx={{ minWidth: 0, scrollMarginTop: 110 }}>
      <Typography variant="h4" component="h4" sx={{ mb: jtSpacing.gap.sm }}>
        {title}
      </Typography>
      {children}
    </Box>
  )
}
