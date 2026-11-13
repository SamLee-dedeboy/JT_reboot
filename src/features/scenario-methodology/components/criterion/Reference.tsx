import { Box } from '@mui/material'
import { alpha } from '@mui/material/styles'

/** A citation with any URLs in it made into links. */
export default function Reference({ text, accent }: { text: string; accent: string }) {
  return text.split(/(https?:\/\/\S+)/).map((part, index) =>
    index % 2 ? (
      <Box
        component="a"
        key={part}
        href={part.replace(/[.,]$/, '')}
        target="_blank"
        rel="noopener noreferrer"
        sx={{ color: accent, textDecorationColor: alpha(accent, 0.5) }}
      >
        {part}
      </Box>
    ) : (
      part
    ),
  )
}
