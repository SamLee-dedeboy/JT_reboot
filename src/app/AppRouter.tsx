import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from '../features/home/HomePage'
import ProjectDocumentation from '../features/repository/ProjectDocumentation'
import Resources from '../features/repository/Resources'
import ServiceLearning from '../features/repository/ServiceLearning'
import ScenarioPlanningPage from '../features/background/ScenarioPlanningPage'
import LandingPage from '../features/scenario-narration/LandingPage'
import BackgroundPage from '../features/scenario-narration/BackgroundPage'
import KeyParametersPage from '../features/scenario-narration/KeyParametersPage'
import StoryPage from '../features/scenario-narration/StoryPage'
import ModelingPage from '../features/scenario-modeling/ModelingPage'
import BaselineExploration from '../internal/BaselineExploration'
import CoDesignTimelinePage from '../internal/CoDesignTimeline'
import ScenarioTimeLapse from '../internal/ScenarioTimeLapse'
import DesignSystem from '../internal/design-system/DesignSystem'
import KelpDiagram from '../internal/KelpDiagram'
import Playground from '../internal/Playground'

const ScenarioExplorerPage = lazy(
  () => import('../features/scenario-explorer/ScenarioExplorerPage'),
)
const RegionalSummaryPage = lazy(() => import('../features/regional-summary/RegionalSummaryPage'))
const UpstreamRestorationPage = lazy(() => import('../features/watershed/UpstreamRestorationPage'))
const RankVisualization = lazy(() => import('../internal/rank-visualization/RankVisualization'))
const BreakoutPage = lazy(() => import('../features/scenario-ranking/BreakoutPage'))
const CoDesignDashboard = lazy(() => import('../features/co-design/CoDesignDashboard'))
const SiteMapPage = lazy(() => import('../internal/site-map/SiteMapPage'))
const CriteriaCopyEditor = lazy(() => import('../internal/criteria-copy/CriteriaCopyEditor'))
const TribalStewardshipSpectrum = lazy(() => import('../internal/TribalStewardshipSpectrum'))
const EcoculturalMetricsArrow = lazy(() => import('../internal/EcoculturalMetricsArrow'))
const CriterionPage = lazy(() => import('../features/scenario-methodology/CriterionPage'))
const RankingPage = lazy(() => import('../features/scenario-ranking/RankingPage'))
const EvaluationPage = lazy(() => import('../features/scenario-methodology/EvaluationPage'))
const FamiliesPage = lazy(() => import('../features/scenario-methodology/FamiliesPage'))

const deferred = (element: React.ReactNode) => <Suspense fallback={null}>{element}</Suspense>

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/scenarios" element={<LandingPage />} />
      <Route path="/scenarios/background-context" element={<BackgroundPage />} />
      <Route path="/scenarios/key-parameters" element={<KeyParametersPage />} />
      <Route path="/scenarios/modeling" element={<ModelingPage />} />
      <Route path="/scenarios/evaluation" element={deferred(<EvaluationPage />)} />
      <Route path="/scenarios/evaluation/families" element={deferred(<FamiliesPage />)} />
      <Route path="/scenarios/evaluation/:teamId" element={deferred(<CriterionPage />)} />
      <Route path="/scenarios/ranking" element={deferred(<RankingPage />)} />
      <Route path="/scenarios/ranking/:view" element={deferred(<RankingPage />)} />
      <Route path="/scenarios/:scenarioSlug" element={<StoryPage />} />
      <Route path="/pages/project-documentation" element={<ProjectDocumentation />} />
      <Route path="/pages/service-learning" element={<ServiceLearning />} />
      <Route path="/pages/resources" element={<Resources />} />
      <Route path="/pages/scenario-planning" element={<ScenarioPlanningPage />} />
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
      <Route path="/pages/co-design-dashboard/*" element={deferred(<CoDesignDashboard />)} />
      <Route path="/pages/watershed" element={deferred(<UpstreamRestorationPage />)} />
      <Route path="/pages/kelp-diagram" element={<KelpDiagram />} />
      <Route path="/pages/rank-visualization" element={deferred(<RankVisualization />)} />
      <Route path="/pages/breakout" element={deferred(<BreakoutPage />)} />
      <Route path="/pages/co-design-timeline" element={<CoDesignTimelinePage />} />
      <Route path="/pages/site-map" element={deferred(<SiteMapPage />)} />
      <Route path="/pages/criteria-copy" element={deferred(<CriteriaCopyEditor />)} />
      <Route
        path="/pages/tribal-stewardship-spectrum"
        element={deferred(<TribalStewardshipSpectrum />)}
      />
      <Route path="/pages/ecocultural-metrics" element={deferred(<EcoculturalMetricsArrow />)} />
      <Route path="/design-system" element={<DesignSystem />} />
      {/* Any URL the site no longer has (or never had) goes home. */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
