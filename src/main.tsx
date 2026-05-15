import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CssBaseline, ThemeProvider } from '@mui/material'
import './index.css'
import './pages/PageLayout.css'
import App from './App.tsx'
import AdaptationScenarios from './pages/AdaptationScenarios.tsx'
import PublicEvents from './pages/PublicEvents.tsx'
import ScenarioPlanning from './pages/ScenarioPlanning.tsx'
import ContactUs from './pages/ContactUs.tsx'
import ProjectDocumentation from './pages/ProjectDocumentation.tsx'
import ServiceLearning from './pages/ServiceLearning.tsx'
import Resources from './pages/Resources.tsx'
import Playground from './pages/Playground.tsx'
import DesignSystem from './design/DesignSystem.tsx'
import theme from './theme/muiTheme'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/pages/adaptation-scenarios" element={<AdaptationScenarios />} />
          <Route path="/pages/public-events" element={<PublicEvents />} />
          <Route path="/pages/scenario-planning" element={<ScenarioPlanning />} />
          <Route path="/pages/contact-us" element={<ContactUs />} />
          <Route path="/pages/project-documentation" element={<ProjectDocumentation />} />
          <Route path="/pages/service-learning" element={<ServiceLearning />} />
          <Route path="/pages/resources" element={<Resources />} />
          <Route path="/pages/playground" element={<Playground />} />
          <Route path="/design-system" element={<DesignSystem />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)
