import CriterionTable from './components/by-criterion/CriterionTable'

/**
 * /pages/breakout, the kiosk: every team's table behind the tab bar, the team in
 * `?team=` and the scenario set in `?set=` (`outflow` for the tiered outflow runs).
 */
export default function BreakoutPage() {
  return <CriterionTable />
}
