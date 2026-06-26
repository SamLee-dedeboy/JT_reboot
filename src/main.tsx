import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CssBaseline, ThemeProvider } from '@mui/material'
import './index.css'
import App from './App.tsx'
import ScrollToTop from './components/common/ScrollToTop.tsx'
import ProjectDocumentation from './components/repo/ProjectDocumentation.tsx'
import ServiceLearning from './components/repo/ServiceLearning.tsx'
import Resources from './components/repo/Resources.tsx'
import Playground from './components/internal/Playground.tsx'
import Watershed from './components/internal/Watershed.tsx'
import KelpDiagram from './components/internal/KelpDiagram.tsx'
import DesignSystem from './design/DesignSystem.tsx'
import ScenariosLandingPage from './components/scenarios/ScenariosLandingPage.tsx'
import ScenariosBackgroundPage from './components/scenarios/ScenariosBackgroundPage.tsx'
import theme from './theme/muiTheme'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/scenarios" element={<ScenariosLandingPage />} />
          <Route path="/scenarios/background-context" element={<ScenariosBackgroundPage />} />
          <Route path="/pages/project-documentation" element={<ProjectDocumentation />} />
          <Route path="/pages/service-learning" element={<ServiceLearning />} />
          <Route path="/pages/resources" element={<Resources />} />
          <Route path="/pages/playground" element={<Playground />} />
          <Route path="/pages/watershed" element={<Watershed />} />
          <Route path="/pages/kelp-diagram" element={<KelpDiagram />} />
          <Route path="/design-system" element={<DesignSystem />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)
