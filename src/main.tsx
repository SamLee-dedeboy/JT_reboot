import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AppProviders from './app/providers'
import PublicSiteShell from './app/PublicSiteShell'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders>
      <PublicSiteShell />
    </AppProviders>
  </StrictMode>,
)
