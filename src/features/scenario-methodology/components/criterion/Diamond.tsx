import { Box } from '@mui/material'

export default function Diamond({ accent }: { accent: string }) {
  return (
    <Box
      aria-hidden="true"
      sx={{ width: 6, height: 6, mt: 0.875, bgcolor: accent, transform: 'rotate(45deg)' }}
    />
  )
}
