// The editable copy for each evaluation criterion, laid out the way the site shows it:
// the criterion's summary on /scenarios/evaluation, then each section of its own
// page (/scenarios/evaluation/:id) in rail order. Every field carries a stable key,
// the text live on the site now, and where that text lives in code, so the copy
// file (editorial/criteria-copy.json) can be filled outside the codebase and then
// applied back by hand.
import {
  criterionReferences,
  criterionRegions,
  criterionStories,
  evaluationTeams,
} from '../../features/scenarios/content'

export type FieldKind = 'line' | 'paragraph' | 'list'

export interface CopyField {
  key: string
  label: string
  /** `list` values hold one item per line. */
  kind: FieldKind
  /** What the site shows now; empty when the slot is not on the site. */
  live: string
  /** Where the live text is defined, for whoever applies an edit. */
  source: string
  /** Claude's starting text when it differs from the live text. */
  claudeSeed?: string
}

export interface CopySection {
  id: string
  label: string
  page: 'evaluation' | 'criterion'
  fields: CopyField[]
}

export interface CopyCriterion {
  id: string
  label: string
  sections: CopySection[]
}

type TeamId = (typeof evaluationTeams)[number]['id']

const STORIES = 'src/features/scenarios/content/criterionStories.ts'
const REGIONS = 'src/features/scenarios/content/criterionRegions.ts'
const REFERENCES = 'src/features/scenarios/content/criterionReferences.ts'
const RESULTS = 'src/features/scenarios/content/results.ts'

// The chip group the evaluation page shows for each criterion (EvaluationFramework.tsx).
const chipGroup: Record<TeamId, string> = {
  ecology: 'Species',
  'environmental-justice': 'People and communities',
  'ecocultural-restoration': 'People and communities',
  recreation: 'People',
  economy: 'Economic sectors',
}

const lines = (items: readonly string[] | undefined) => (items ?? []).join('\n')

export function buildCriteriaFields(): CopyCriterion[] {
  return evaluationTeams.map((team, teamIndex) => {
    const id = team.id as TeamId
    const story = criterionStories[id]
    const regions = criterionRegions[id]
    const at = (path: string) => `${STORIES} · ${id}.${path}`
    const key = (path: string) => `${id}.${path}`
    const chips = team.entityGroups.find((group) => group.label === chipGroup[id])

    const evaluation: CopySection = {
      id: 'summary',
      label: 'Summary on the evaluation page',
      page: 'evaluation',
      fields: [
        {
          key: key('summary.rationale'),
          label: 'Why this criterion (one line, under “Why these criteria”)',
          kind: 'paragraph',
          live: story.brief.rationale,
          source: at('brief.rationale'),
        },
        {
          key: key('summary.what'),
          label: 'What is this criterion?',
          kind: 'paragraph',
          live: story.brief.what,
          source: at('brief.what'),
        },
        {
          key: key('summary.chips'),
          label: `${chipGroup[id]} chips`,
          kind: 'list',
          live: lines(chips?.items),
          source: `${RESULTS} · evaluationTeams[${teamIndex}].entityGroups “${chipGroup[id]}”`,
        },
        {
          key: key('summary.why'),
          label: 'Why does it matter?',
          kind: 'paragraph',
          live: story.brief.why,
          source: at('brief.why'),
        },
      ],
    }

    const what: CopySection = {
      id: 'what',
      label: 'What is this criterion?',
      page: 'criterion',
      fields: story.what.map((paragraph, index) => ({
        key: key(`what.${index}`),
        label: `Paragraph ${index + 1}`,
        kind: 'paragraph',
        live: paragraph,
        source: at(`what[${index}]`),
      })),
    }

    const why: CopySection = {
      id: 'why',
      label: 'Why does it matter?',
      page: 'criterion',
      fields: [
        ...story.why.paragraphs.map((paragraph, index) => ({
          key: key(`why.${index}`),
          label: `Paragraph ${index + 1}`,
          kind: 'paragraph' as const,
          live: paragraph,
          source: at(`why.paragraphs[${index}]`),
        })),
        ...(story.why.stats ?? []).flatMap((stat, index) => [
          {
            key: key(`why.stats.${index}.value`),
            label: `Stat ${index + 1}: number`,
            kind: 'line' as const,
            live: stat.value,
            source: at(`why.stats[${index}].value`),
          },
          {
            key: key(`why.stats.${index}.label`),
            label: `Stat ${index + 1}: label`,
            kind: 'line' as const,
            live: stat.label,
            source: at(`why.stats[${index}].label`),
          },
        ]),
        ...(story.why.quote
          ? [
              {
                key: key('why.quote'),
                label: 'Quote',
                kind: 'paragraph' as const,
                live: story.why.quote,
                source: at('why.quote'),
              },
            ]
          : []),
      ],
    }

    const regionSection: CopySection[] = regions
      ? [
          {
            id: 'regions',
            label: 'Which regions does it cover?',
            page: 'criterion',
            fields: [
              {
                key: key('regions.intro'),
                label: 'Introduction',
                kind: 'paragraph',
                live: regions.intro,
                source: `${REGIONS} · ${id}.intro`,
              },
              ...regions.regions.map((region, index) => ({
                key: key(`regions.${index}.note`),
                label: `${region.name}: note (the name matches the map and stays fixed)`,
                kind: 'line' as const,
                live: region.note ?? '',
                source: `${REGIONS} · ${id}.regions[${index}].note`,
              })),
              ...(regions.mapNote
                ? [
                    {
                      key: key('regions.mapNote'),
                      label: 'Map note',
                      kind: 'paragraph' as const,
                      live: regions.mapNote,
                      source: `${REGIONS} · ${id}.mapNote`,
                    },
                  ]
                : []),
            ],
          },
        ]
      : []

    const components: CopySection = {
      id: 'components',
      label: 'What are its components?',
      page: 'criterion',
      fields: [
        ...(story.components.intro
          ? [
              {
                key: key('components.intro'),
                label: 'Introduction',
                kind: 'paragraph' as const,
                live: story.components.intro,
                source: at('components.intro'),
              },
            ]
          : []),
        ...story.components.items.flatMap((component, index) => {
          const n = index + 1
          const path = `components.items[${index}]`
          return [
            {
              key: key(`components.${index}.name`),
              label: `${n} · Name`,
              kind: 'line' as const,
              live: component.name,
              source: at(`${path}.name`),
            },
            {
              key: key(`components.${index}.summary`),
              label: `${n} · Summary (also on the evaluation page)`,
              kind: 'paragraph' as const,
              live: component.summary,
              source: at(`${path}.summary`),
            },
            ...component.spec.map((row, specIndex) => ({
              key: key(`components.${index}.spec.${specIndex}`),
              label: `${n} · ${row.label}`,
              kind: 'paragraph' as const,
              live: row.value,
              source: at(`${path}.spec[${specIndex}].value`),
            })),
            {
              key: key(`components.${index}.method`),
              label: `${n} · How it is measured (one step per line)`,
              kind: 'list' as const,
              live: lines(component.method),
              source: at(`${path}.method`),
            },
            ...(component.caveats
              ? [
                  {
                    key: key(`components.${index}.caveats`),
                    label: `${n} · Caveats (one per line)`,
                    kind: 'list' as const,
                    live: lines(component.caveats),
                    source: at(`${path}.caveats`),
                  },
                ]
              : []),
          ]
        }),
      ],
    }

    const { intro, facts, steps } = story.construction
    const construction: CopySection = {
      id: 'construction',
      label: 'How was it constructed?',
      page: 'criterion',
      fields: [
        {
          key: key('construction.intro'),
          label: 'Introduction',
          kind: 'paragraph',
          live: intro,
          source: at('construction.intro'),
        },
        ...facts.flatMap((fact, index) => [
          {
            key: key(`construction.facts.${index}.value`),
            label: `Fact ${index + 1}: number`,
            kind: 'line' as const,
            live: fact.value,
            source: at(`construction.facts[${index}].value`),
          },
          {
            key: key(`construction.facts.${index}.label`),
            label: `Fact ${index + 1}: label`,
            kind: 'line' as const,
            live: fact.label,
            source: at(`construction.facts[${index}].label`),
          },
        ]),
        ...steps.flatMap((step, index) => {
          const n = index + 1
          const path = `construction.steps[${index}]`
          return [
            {
              key: key(`construction.steps.${index}.title`),
              label: `Step ${n} · Title`,
              kind: 'line' as const,
              live: step.title,
              source: at(`${path}.title`),
            },
            ...(step.when
              ? [
                  {
                    key: key(`construction.steps.${index}.when`),
                    label: `Step ${n} · When`,
                    kind: 'line' as const,
                    live: step.when,
                    source: at(`${path}.when`),
                  },
                ]
              : []),
            {
              key: key(`construction.steps.${index}.body`),
              label: `Step ${n} · Body`,
              kind: 'paragraph' as const,
              live: step.body,
              source: at(`${path}.body`),
            },
            ...(step.points
              ? [
                  {
                    key: key(`construction.steps.${index}.points`),
                    label: `Step ${n} · Points (one per line)`,
                    kind: 'list' as const,
                    live: lines(step.points),
                    source: at(`${path}.points`),
                  },
                ]
              : []),
          ]
        }),
      ],
    }

    const references: CopySection = {
      id: 'references',
      label: 'References',
      page: 'criterion',
      fields: [
        {
          key: key('references'),
          label: 'References (one per line)',
          kind: 'list',
          live: lines(criterionReferences[id]),
          source: `${REFERENCES} · ${id}`,
        },
      ],
    }

    return {
      id,
      label: team.label,
      sections: [evaluation, what, why, ...regionSection, components, construction, references],
    }
  })
}
