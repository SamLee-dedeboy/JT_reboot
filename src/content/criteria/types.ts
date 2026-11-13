// The shape every criterion file in this folder shares. A criterion file holds, in order:
//   - who it is: id, number, label, and the summary card on the evaluation page
//   - `entityGroups` and `metrics`: the chips and metric cards on the evaluation page
//   - `story`: the criterion page's text, condensed from the team's draft "The Story Behind
//     the Criterion" report. `brief` is the short version the evaluation page shows; the
//     rest (`what`, `why`, `construction`, `components`) is the technical summary on the
//     criterion's own page, for readers who will not open the full report.
//   - `regions`: the places the team reports by, for the "Which regions" map. Region names
//     match the outlines in src/content/deltaRegions.ts so the map can label them.
//   - `references`: the report's reference list, in the order given there
//   - `report`: the team's findings for each scenario. Scores are relative to baseline;
//     `null` marks a value not published yet.

export type CriterionId =
  'ecology' | 'environmental-justice' | 'ecocultural-restoration' | 'recreation' | 'economy'

export interface Criterion {
  /** The criterion page's URL segment, as in /scenarios/evaluation/<id>. */
  id: CriterionId
  number: string
  label: string
  /** One sentence for the criterion's card on the evaluation page. */
  summary: string
  /** Chip groups: who and what the criterion looks at. A chip written "Name · qualifier" sets the qualifier lighter. */
  entityGroups: Array<{ label: string; items: string[] }>
  metrics: Array<{ name: string; definition: string; measurement: string }>
  story: CriterionStory
  /** Left out where the team maps no regions (eco-cultural: specific sites are deliberately not mapped). */
  regions?: CriterionRegions
  references: string[]
  report: TeamReport
}

export interface StoryTable {
  caption: string
  columns: string[]
  rows: string[][]
}

export interface CriterionComponent {
  name: string
  summary: string
  /** The evaluation overview's wording, where it differs from `summary`. */
  overviewSummary?: string
  /** A page on this site that goes deeper, offered after the component's tables. */
  link?: { label: string; to: string }
  /** Label/value pairs: what is measured, its unit, and where. */
  spec: Array<{ label: string; value: string }>
  /** How the value is produced, in order. */
  method: string[]
  tables?: StoryTable[]
  /** Limits and assumptions a technical reader should know. */
  caveats?: string[]
}

export interface ConstructionStep {
  title: string
  /** When it happened, if the report dates it. */
  when?: string
  body?: string
  points?: string[]
}

export interface CriterionStory {
  source: string
  /** For the evaluation page: why the criterion is in the set, what it is, and why it matters. */
  brief: { rationale: string; what: string; why: string; chipsNote?: string }
  what: string[]
  why: {
    paragraphs: string[]
    stats?: Array<{ value: string; label: string }>
    /** Stack the stats in rows, for values too long to sit side by side. */
    statsInRows?: boolean
    quote?: string
  }
  construction: {
    intro: string
    /** Who was engaged or what was used; a value can be a word, like "Periodic". */
    facts: Array<{ value: string; label: string; dates?: string[] }>
    /** What that engagement yielded. */
    outcomes?: { intro: string; facts: Array<{ value: string; label: string }> }
    /** Prose after the intro, for a criterion told as narrative rather than steps. */
    points?: string[]
    paragraphs?: string[]
    steps: ConstructionStep[]
  }
  components: { intro?: string; items: CriterionComponent[] }
}

export interface CriterionRegions {
  /** The shapefile's team key for these outlines. */
  mapTeam: 'ecology' | 'environmentalJustice' | 'recreation' | 'economy'
  intro: string
  /** One entry per outline on the map, in reading order. */
  regions: Array<{ name: string; note?: string }>
  /** What the map leaves out, where it does. */
  mapNote?: string
}

export interface ScenarioFinding {
  headline: string
  /** The team's published scores for this scenario; names need not match the criterion's metrics. */
  metrics: Array<{ name: string; finding: string; score: number | null }>
  /** `score` is null when the team publishes no single criterion score. */
  overall: { score: number | null; summary: string }
  /** The team's own interpretation, when it has written one. */
  narrative?: string
}

export interface TeamReport {
  status: 'draft' | 'final'
  source: string
  findings: Record<string, ScenarioFinding>
}
