import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AppProviders from './app/providers'
import PublicSiteShell from './app/PublicSiteShell'
// Self-hosted web fonts so the site renders correctly without a network.
import '@fontsource-variable/nunito-sans/opsz.css'
import '@fontsource/hammersmith-one/400.css'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders>
      <PublicSiteShell />
    </AppProviders>
  </StrictMode>,
)
