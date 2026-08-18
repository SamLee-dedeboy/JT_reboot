/* Project Documentation & Reports — content ported verbatim from the
   design handoff (repo-docs.jsx `DOC_YEARS`). Action hrefs are
   placeholders (`#`) until real PDFs/URLs are wired in. */

const IMG = '/images/repo/'

export type DocActionKind = 'dl' | 'view' | 'multi'

export interface DocAction {
  label: string
  kind: DocActionKind
  href?: string
}

export interface DocItem {
  badge: string
  title: string
  img?: string
  /** Solid-green title cover instead of an image (e.g. Executive Summary). */
  green?: boolean
  desc: string
  actions: DocAction[]
}

export interface Workshop {
  date: string
  title: string
  tag?: string
  docs: DocItem[]
}

export interface DocYear {
  year: string
  workshops: Workshop[]
}

export const DOC_YEARS: DocYear[] = [
  {
    year: '2025',
    workshops: [
      {
        date: 'December 2nd, 2025',
        title: 'Tribal Workshop',
        tag: 'Eco-Cultural Values & Uses (with COEQWAL)',
        docs: [
          {
            badge: 'Report',
            title: 'Full Report',
            img: IMG + 'report-cover.png',
            desc: 'Complete workshop documentation and summary of tribal feedback and findings.',
            actions: [{ label: 'Download', kind: 'dl' }],
          },
        ],
      },
      {
        date: 'June 9th, 2025',
        title: 'Public Workshop #2',
        docs: [
          {
            badge: 'Summary',
            title: 'Executive Summary',
            green: true,
            desc: 'High-level overview of workshop findings and scenario rankings.',
            actions: [{ label: 'Download', kind: 'dl' }],
          },
          {
            badge: 'Report',
            title: 'Full Report',
            img: IMG + 'report-cover.png',
            desc: 'Complete workshop documentation and summary of public feedback and findings.',
            actions: [{ label: 'Download', kind: 'dl' }],
          },
          {
            badge: 'Appendix',
            title: 'Appendix',
            img: IMG + 'watershed.png',
            desc: 'Resources and tools utilized in the public workshop and exhibition.',
            actions: [{ label: 'Download', kind: 'dl' }],
          },
        ],
      },
    ],
  },
  {
    year: '2024',
    workshops: [
      {
        date: 'December 3rd, 2024',
        title: 'Environmental Justice Workshop',
        docs: [
          {
            badge: 'Report',
            title: 'Full Report',
            img: IMG + 'report-cover.png',
            desc: 'Complete workshop documentation and summary of public feedback and findings.',
            actions: [{ label: 'Download', kind: 'dl' }],
          },
        ],
      },
      {
        date: 'June 11th, 2024',
        title: 'Public Workshop #1',
        docs: [
          {
            badge: 'Summary',
            title: 'Executive Summary',
            green: true,
            desc: 'High-level overview of workshop findings and scenario rankings.',
            actions: [{ label: 'Download', kind: 'dl' }],
          },
          {
            badge: 'Recording',
            title: 'Plenary Session Live Recording',
            img: IMG + 'plenary.png',
            desc: 'Research team presentation with interview and scenario overviews.',
            actions: [{ label: 'View', kind: 'view' }],
          },
          {
            badge: 'Report',
            title: 'Full Report',
            img: IMG + 'report-cover.png',
            desc: 'Complete workshop summary of findings and documentation.',
            actions: [{ label: 'Download', kind: 'dl' }],
          },
          {
            badge: 'Workbooks',
            title: 'Breakout Session Workbooks',
            img: IMG + 'workbook.png',
            desc: 'Scanned copies of the breakout sessions workbook results (distilled in full report).',
            actions: [
              { label: 'Group 1.A', kind: 'multi' },
              { label: 'Group 1.B', kind: 'multi' },
            ],
          },
          {
            badge: 'Slides',
            title: 'Presentation Slides',
            img: IMG + 'project-goals.png',
            desc: 'Introduction to the project objectives and workshop goals.',
            actions: [{ label: 'Download', kind: 'dl' }],
          },
          {
            badge: 'Slides',
            title: 'Interview Presentation Slides',
            img: IMG + 'interview.png',
            desc: 'Extensive summary analysis of responses from the initial interviews.',
            actions: [{ label: 'Download', kind: 'dl' }],
          },
        ],
      },
    ],
  },
  {
    year: '2023',
    workshops: [
      {
        date: 'Context Gathering',
        title: 'Context Gathering',
        docs: [
          {
            badge: 'Brochure',
            title: 'Project Brochure',
            img: IMG + 'brochure.png',
            desc: 'Overview of the Just Transitions project and core objectives.',
            actions: [{ label: 'Download', kind: 'dl' }],
          },
          {
            badge: 'Fact Sheet',
            title: 'Fact Sheet',
            img: IMG + 'factsheet.png',
            desc: 'The drivers of change and management strategies in the Delta.',
            actions: [{ label: 'Download', kind: 'dl' }],
          },
        ],
      },
    ],
  },
]

/** Total document count, for the repo hero meta row. */
export const DOC_COUNT = DOC_YEARS.reduce(
  (sum, y) => sum + y.workshops.reduce((s, w) => s + w.docs.length, 0),
  0,
)
