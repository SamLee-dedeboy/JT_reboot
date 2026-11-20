// TEMPORARY: shows the active breakpoint and viewport width while breakpoints are being reviewed.
import { Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useEffect, useState } from 'react'

const tierOf = (width: number, md: number, xxl: number) =>
  width < md ? 'Phone' : width < xxl ? 'Laptop / tablet' : 'Desktop'

export default function BreakpointChip() {
  const theme = useTheme()
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight })

  useEffect(() => {
    const update = () => setSize({ w: window.innerWidth, h: window.innerHeight })
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const { values, keys } = theme.breakpoints
  const key = [...keys].reverse().find((k) => size.w >= values[k]) ?? 'xs'
  const tier = tierOf(size.w, values.md, values.xxl)

  return (
    <Box
      aria-hidden
      sx={{
        position: 'fixed',
        left: 12,
        bottom: 12,
        zIndex: 99999,
        pointerEvents: 'none',
        px: 1.5,
        py: 0.75,
        borderRadius: 999,
        bgcolor: 'rgba(0,0,0,0.78)',
        color: '#fff',
        border: '1px solid rgba(255,255,255,0.35)',
        font: '600 13px/1.2 ui-monospace, Consolas, monospace',
        whiteSpace: 'nowrap',
      }}
    >
      {key} · {tier} · {size.w}×{size.h} · dpr {window.devicePixelRatio}
    </Box>
  )
}
