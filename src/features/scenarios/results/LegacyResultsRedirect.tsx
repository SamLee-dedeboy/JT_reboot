import { Navigate, useLocation, useParams } from 'react-router-dom'
import { findTeam, methodologyPath } from '../evaluation/paths'

/** Anchors from the old combined results hub, mapped to the page that now holds them. */
const evaluationAnchors = new Set(['#how-evaluated', '#evaluation-framework', '#how-compared'])

/** `/scenarios/results` and the per-scenario results pages were retired for the modeling and evaluation pages; keep old links working. */
export default function LegacyResultsRedirect() {
  const { hash } = useLocation()
  const team = findTeam(useParams().teamId)
  if (team) return <Navigate to={methodologyPath(team.id)} replace />
  const to = evaluationAnchors.has(hash)
    ? `/scenarios/evaluation${hash === '#how-compared' ? hash : ''}`
    : '/scenarios/modeling'
  return <Navigate to={to} replace />
}
