import NavRail, { type NavRailItem } from '../../../ui/NavRail'

const homeRailItems: NavRailItem[] = [
  { id: 'whatif', label: 'What If?', dotColor: 'secondary.main' },
  { id: 'foundations', label: 'What Futures?', dotColor: 'base.500' },
  { id: 'stakes', label: "What's at Stake?", dotColor: 'base.800' },
  { id: 'works', label: 'How It Works?', dotColor: 'base.900' },
]

export default function HomeNavRail() {
  return <NavRail items={homeRailItems} ariaLabel="Explore the home page" variant="home" />
}
