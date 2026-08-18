import { CssBaseline, ThemeProvider } from '@mui/material'
import type { PropsWithChildren } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { theme } from '../theme'

export default function AppProviders({ children }: PropsWithChildren) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter basename={import.meta.env.BASE_URL}>{children}</BrowserRouter>
    </ThemeProvider>
  )
}
