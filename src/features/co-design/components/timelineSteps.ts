// Steps shown by CoDesignTimeline. The dashboard's four steps each open a view.

export type TimelineStep = {
  date: string
  title: string
  subtitle: string[]
  // Full-card copy; omitted in compact layouts.
  body?: string
  hint?: string
  // Dashboard view the card opens (e.g. '/flow').
  view?: string
  // Consecutive steps with the same group get one heading.
  group?: string
  tone?: TimelineTone
  // Hidden steps keep their place in the horizontal layout (so the visible
  // steps don't move) and are left out of the vertical one.
  hidden?: boolean
}

export type TimelineTone = 'default' | 'muted' | 'highlight'

export const dashboardSteps: TimelineStep[] = [
  {
    date: '2023',
    view: '/flow',
    title: 'Listening',
    subtitle: ['Understanding public', 'values and concerns'],
    body: 'Our process began by interviewing Delta residents, community organizers, Indigenous community members, farmers, scientists, experts and agency officials. Key questions we asked interviewees included what they most value about the Delta, what factors they believe drive change, what salinity adaptation strategies they are most interested in seeing explored, and who is and isn’t represented in Delta planning efforts.',
    hint: 'Click to explore the results and connections across the interview data',
  },
  {
    date: 'Early 2024',
    view: '/linking',
    title: 'Designing',
    subtitle: ['From ideas and values', 'to scenarios'],
    body: "With a better understanding of interviewee's perceived drivers of change, management and adaptation strategies to explore, and values and priorities, we designed six distinct scenarios.",
    hint: 'Click to explore how interviews shaped the design of each scenario',
  },
  {
    date: '2025',
    view: '/mental-model',
    title: 'Conceptualizing',
    subtitle: ['Shared understandings of Delta salinity'],
    body: 'Leveraging these interviews and data collected through our public workshops, we have been documenting how project participants conceptualize and understand salinity and salinity management in the Delta, as well as how those understandings change over time. These are visualized as “mental models” which are representations of how people understand a system, concept, or process works.',
    hint: 'Click to see these mental models',
  },
  {
    date: 'Summer 2025',
    view: '/sunburst',
    title: 'Comparing',
    subtitle: ['Different mental models'],
    body: 'We then compare how the mental models are similar and different across different groups of people, including across age, years of engagement in the Delta, Delta resident or non-resident, and research team members compared to research participants.',
    hint: 'Click to explore how mental models differ across participants',
  },
]
