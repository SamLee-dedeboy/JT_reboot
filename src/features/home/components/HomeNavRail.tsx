import NavRail, { type NavRailItem } from '../../../ui/NavRail'

const homeRailItems: NavRailItem[] = [
  { id: 'whatif', label: 'What If?' },
  { id: 'foundations', label: 'What Futures?' },
  { id: 'stakes', label: "What's at Stake?" },
  { id: 'works', label: 'How It Works' },
]

export default function HomeNavRail() {
  return <NavRail items={homeRailItems} ariaLabel="Explore the home page" variant="home" />
}
