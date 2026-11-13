import { Box } from '@mui/material'
import { Navigate, useParams } from 'react-router-dom'
import { Footer, Navbar } from '@/ui'
import CriterionTable from './components/by-criterion/CriterionTable'
import RankingHero, { type RankingView } from './components/RankingHero'
import ByScenarioView from './components/by-scenario/ByScenarioView'

/**
 * One page, one hero: "Choose how to compare" in the hero picks the view, and only the
 * content beneath it changes.
 */
export default function RankingPage() {
  const { view } = useParams()
  const activeView: RankingView = view === 'by-criterion' ? view : 'by-scenario'

  if (view && view !== 'by-criterion') {
    return <Navigate to="/scenarios/ranking" replace />
  }

  return (
    <>
      <Navbar />
      <Box component="main" sx={{ bgcolor: 'base.800', color: 'common.white' }}>
        <RankingHero activeView={activeView} />
        {activeView === 'by-criterion' ? <CriterionTable embedded /> : <ByScenarioView />}
      </Box>
      <Footer />
    </>
  )
}
