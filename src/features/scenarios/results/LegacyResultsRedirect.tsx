import { Navigate, useLocation } from 'react-router-dom'

/** Anchors from the old combined results hub, mapped to the page that now holds them. */
const evaluationAnchors = new Set(['#how-evaluated', '#evaluation-framework', '#how-compared'])

/** `/scenarios/results` was split into the modeling and evaluation pages; keep old links working. */
export default function LegacyResultsRedirect() {
  const { hash } = useLocation()
  const to = evaluationAnchors.has(hash)
    ? `/scenarios/evaluation${hash === '#how-compared' ? hash : ''}`
    : '/scenarios/modeling'
  return <Navigate to={to} replace />
}
