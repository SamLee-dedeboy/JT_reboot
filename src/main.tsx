import { lazy, StrictMode, Suspense } from 'react'
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
import KelpDiagram from './components/internal/KelpDiagram.tsx'
import BaselineExploration from './components/internal/BaselineExploration.tsx'
import DesignSystem from './design/DesignSystem.tsx'
import ScenariosLandingPage from './components/scenarios/ScenariosLandingPage.tsx'
import ScenariosBackgroundPage from './components/scenarios/ScenariosBackgroundPage.tsx'
import ScenariosKeyParametersPage from './components/scenarios/ScenariosKeyParametersPage.tsx'
import theme from './theme/muiTheme'

const ScenarioExplorerPage = lazy(() => import('./features/scenario-explorer/ScenarioExplorerPage'))
const Watershed = lazy(() => import('./components/internal/Watershed'))

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
          <Route path="/scenarios/key-parameters" element={<ScenariosKeyParametersPage />} />
          <Route path="/pages/project-documentation" element={<ProjectDocumentation />} />
          <Route path="/pages/service-learning" element={<ServiceLearning />} />
          <Route path="/pages/resources" element={<Resources />} />
          <Route path="/pages/playground" element={<Playground />} />
          <Route path="/pages/baseline-exploration" element={<BaselineExploration />} />
          <Route path="/pages/scenario-explorer" element={<Suspense fallback={null}><ScenarioExplorerPage /></Suspense>} />
          <Route path="/pages/scenario-explorer/internal" element={<Suspense fallback={null}><ScenarioExplorerPage enableDateHighlights /></Suspense>} />
          <Route path="/pages/watershed" element={<Suspense fallback={null}><Watershed /></Suspense>} />
          <Route path="/pages/kelp-diagram" element={<KelpDiagram />} />
          <Route path="/design-system" element={<DesignSystem />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)
