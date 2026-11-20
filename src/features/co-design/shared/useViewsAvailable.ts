// The dashboard's views are full-height tools laid out for a laptop-sized screen, so they are
// offered from lg up. Below that the dashboard shows only its timeline, and nothing opens a view.
import { useMediaQuery, useTheme } from '@mui/material'

export function useViewsAvailable() {
  const theme = useTheme()
  // noSsr: read the real width on the first render, so a view never flashes the landing page.
  return useMediaQuery(theme.breakpoints.up('lg'), { noSsr: true })
}
