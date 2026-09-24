// Ported from JT_dashboard/src/lib/Flow/components/sections/ColumnHeader.svelte.
// Only rendered for multi-column sections (none in the current store). The
// icon and hide toggle were commented out in the original.
import { Typography } from '@mui/material'

export default function ColumnHeader({ title }: { title: string }) {
  return (
    <Typography
      variant="cardBody"
      component="span"
      sx={(theme) => ({
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        mb: 0.5,
        px: 0.5,
        pointerEvents: 'auto',
        userSelect: 'none',
        whiteSpace: 'nowrap',
        textAlign: 'center',
        color: theme.coDesign.flow.columnHeader.text,
        borderRadius: theme.coDesign.flow.columnHeader.radius,
        boxShadow: theme.coDesign.flow.columnHeader.shadow,
      })}
    >
      {title}
    </Typography>
  )
}
