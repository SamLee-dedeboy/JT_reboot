import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import HomePage from '../features/home/HomePage'
import ProjectDocumentation from '../features/repository/ProjectDocumentation'
import Resources from '../features/repository/Resources'
import ServiceLearning from '../features/repository/ServiceLearning'
import ScenarioTemplatePage from '../features/scenarios/ScenarioTemplatePage'
import ScenarioResultsPage from '../features/scenarios/ScenarioResultsPage'
import ScenariosBackgroundPage from '../features/scenarios/ScenariosBackgroundPage'
import ScenariosKeyParametersPage from '../features/scenarios/ScenariosKeyParametersPage'
import ScenariosLandingPage from '../features/scenarios/ScenariosLandingPage'
import BaselineExploration from '../internal/BaselineExploration'
import ScenarioTimeLapse from '../internal/ScenarioTimeLapse'
import DesignSystem from '../internal/design-system/DesignSystem'
import KelpDiagram from '../internal/KelpDiagram'
import Playground from '../internal/Playground'

const ScenarioExplorerPage = lazy(
  () => import('../features/scenario-explorer/ScenarioExplorerPage'),
)
const RegionalSummaryPage = lazy(() => import('../features/regional-summary/RegionalSummaryPage'))
const Watershed = lazy(() => import('../internal/Watershed'))
const RankVisualization = lazy(() => import('../internal/rank-visualization/RankVisualization'))

const deferred = (element: React.ReactNode) => <Suspense fallback={null}>{element}</Suspense>

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/scenarios" element={<ScenariosLandingPage />} />
      <Route path="/scenarios/background-context" element={<ScenariosBackgroundPage />} />
      <Route path="/scenarios/key-parameters" element={<ScenariosKeyParametersPage />} />
      <Route path="/scenarios/:scenarioSlug/results" element={<ScenarioResultsPage />} />
      <Route path="/scenarios/:scenarioSlug" element={<ScenarioTemplatePage />} />
      <Route path="/pages/project-documentation" element={<ProjectDocumentation />} />
      <Route path="/pages/service-learning" element={<ServiceLearning />} />
      <Route path="/pages/resources" element={<Resources />} />
      <Route path="/pages/playground" element={<Playground />} />
      <Route path="/pages/baseline-exploration" element={<BaselineExploration />} />
      <Route path="/pages/scenario-time-lapse" element={<ScenarioTimeLapse />} />
      <Route
        path="/pages/scenario-explorer"
        element={deferred(<ScenarioExplorerPage enableDateHighlights publicModesOnly />)}
      />
      <Route
        path="/pages/scenario-explorer/internal"
        element={deferred(<ScenarioExplorerPage enableDateHighlights enableSlrModes />)}
      />
      <Route
        path="/pages/scenario-explorer/d1641"
        element={deferred(
          <ScenarioExplorerPage enableDateHighlights enableSlrModes d1641StationsOnly />,
        )}
      />
      <Route path="/pages/regional-summary" element={deferred(<RegionalSummaryPage />)} />
      <Route path="/pages/watershed" element={deferred(<Watershed />)} />
      <Route path="/pages/kelp-diagram" element={<KelpDiagram />} />
      <Route path="/pages/rank-visualization" element={deferred(<RankVisualization />)} />
      <Route path="/design-system" element={<DesignSystem />} />
    </Routes>
  )
}
