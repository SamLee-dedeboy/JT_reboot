// Steps shown by CoDesignTimeline. The dashboard's four steps each open a view.

export type TimelineStep = {
  date: string
  title: string
  subtitle: string[]
  // Full-card copy; omitted in compact layouts. One or two sentences.
  body?: string
  // Full cards: a short labelled list of tags under the body ("We asked about …").
  details?: { label: string; items: string[] }
  // Full cards: the link line naming where the card goes ("Explore").
  action?: string
  // Dashboard view the card opens (e.g. '/flow').
  view?: string
  // Consecutive steps with the same group get one heading.
  group?: string
  tone?: TimelineTone
  // Hidden steps keep their place in the horizontal layout (so the visible
  // steps don't move) and are left out of the vertical one.
  hidden?: boolean
  // In-progress or planned work: adds a status tag to the card.
  status?: TimelineStatus
}

export type TimelineStatus = 'ongoing' | 'upcoming'

export type TimelineTone = 'default' | 'muted' | 'highlight' | 'future'

export const dashboardSteps: TimelineStep[] = [
  {
    date: '2023',
    view: '/flow',
    title: 'Listening',
    subtitle: ['Understanding public', 'values and concerns'],
    body: 'We interviewed Delta residents, community organizers, Indigenous community members, farmers, scientists, experts and agency officials.',
    details: {
      label: 'We asked about',
      items: [
        'What they value',
        'What drives change',
        'Strategies to explore',
        'Who is represented',
      ],
    },
    action: 'Explore',
  },
  {
    date: 'Early 2024',
    view: '/linking',
    title: 'Designing',
    subtitle: ['From ideas and values', 'to scenarios'],
    body: 'What we heard in the interviews shaped six distinct scenarios.',
    details: {
      label: 'Built from',
      items: ['Drivers of change', 'Strategies to explore', 'Values and priorities'],
    },
    action: 'Explore',
  },
  {
    date: '2025',
    view: '/mental-model',
    title: 'Conceptualizing',
    subtitle: ['Shared understandings of Delta salinity'],
    body: 'From interviews and public workshops, we map how participants understand salinity, and how that changes over time, as “mental models.”',
    details: { label: 'Each model shows', items: ['What drives salinity', 'What is most at risk'] },
    action: 'Explore',
  },
  {
    date: 'Summer 2025',
    view: '/sunburst',
    title: 'Comparing',
    subtitle: ['Different mental models'],
    body: 'We compare how mental models differ between groups of people.',
    details: {
      label: 'Compared by',
      items: [
        'Age',
        'Years of engagement',
        'Residents and non-residents',
        'Researchers and participants',
      ],
    },
    action: 'Explore',
  },
]
