// Shape of editorial/criteria-copy.json and the pure helpers that keep it in step
// with the field map. Shared by the dev-server plugin, the CLI report, and the
// editor page, so it must not touch the DOM or Node APIs.
import type { CopyCriterion, FieldKind } from './fields'

export const COPY_FILE_PATH = 'editorial/criteria-copy.json'
export const COPY_ENDPOINT = '/__criteria-copy'

/** The columns a person or agent writes. Claude and GPT each own theirs; `yours` is the user's. */
export const writableColumns = ['claude', 'gpt', 'yours', 'note'] as const
export type CopyColumn = (typeof writableColumns)[number]

export interface CopyEntry {
  key: string
  label: string
  kind: FieldKind
  source: string
  claude: string
  gpt: string
  /** GPT's field-level pointer to the supporting report passage. */
  gptReference: string
  /** The user's final text. Empty means no decision yet. */
  yours: string
  /** The user's instruction for Claude or GPT about this field. */
  note: string
}

export interface CopyFile {
  readme: string[]
  criteria: Array<{
    id: string
    label: string
    sections: Array<{ id: string; label: string; page: string; entries: CopyEntry[] }>
  }>
  /** Entries whose field no longer exists on the site, kept so no writing is lost. */
  orphans: CopyEntry[]
}

export const readme = [
  'Criteria copy: the editable text for each evaluation criterion, in the order the site shows it.',
  'Edit it at /pages/criteria-copy on the dev server (npm run dev). The page saves straight to this file.',
  'Columns: claude = Claude’s draft, gpt = GPT’s draft, gptReference = the report passage supporting GPT’s draft, yours = the user’s final text, note = the user’s instruction about the field.',
  'Claude writes only `claude`; GPT writes only `gpt` and `gptReference`. Never edit `yours` or `note`, never change `key`, `label`, `kind`, or `source`, and keep the order.',
  'Lists (kind "list") hold one item per line.',
  'Source reports: editorial/criteria-sources/<criterion>.json holds the report passages behind each section (by section id). Check drafts against them. Regenerate with python scripts/extract-criterion-reports.py.',
  'To apply: for each entry whose `yours` is not empty, put that text at `source` in the code. `npm run copy:criteria` lists the entries still to apply.',
  'Structure (sections, labels, sources) is regenerated from src/internal/criteria-copy/fields.ts; change the structure there, not here.',
]

const emptyEntry = { claude: '', gpt: '', gptReference: '', yours: '', note: '' }

/** Rebuilds the file around the current field map, keeping every column already written. */
export function syncCopyFile(structure: CopyCriterion[], existing?: CopyFile): CopyFile {
  const previous = new Map<string, CopyEntry>()
  for (const criterion of existing?.criteria ?? [])
    for (const section of criterion.sections)
      for (const entry of section.entries) previous.set(entry.key, entry)
  for (const entry of existing?.orphans ?? []) previous.set(entry.key, entry)

  const used = new Set<string>()
  const criteria = structure.map((criterion) => ({
    id: criterion.id,
    label: criterion.label,
    sections: criterion.sections.map((section) => ({
      id: section.id,
      label: section.label,
      page: section.page,
      entries: section.fields.map((field): CopyEntry => {
        used.add(field.key)
        const before = previous.get(field.key)
        return {
          key: field.key,
          label: field.label,
          kind: field.kind,
          source: field.source,
          ...emptyEntry,
          claude: before ? before.claude : (field.claudeSeed ?? field.live),
          gpt: before?.gpt ?? '',
          gptReference: before?.gptReference ?? '',
          yours: before?.yours ?? '',
          note: before?.note ?? '',
        }
      }),
    })),
  }))

  const orphans = [...previous.values()].filter(
    (entry) =>
      !used.has(entry.key) &&
      (entry.claude || entry.gpt || entry.gptReference || entry.yours || entry.note),
  )
  return { readme, criteria, orphans }
}

export function findEntry(file: CopyFile, key: string): CopyEntry | undefined {
  for (const criterion of file.criteria)
    for (const section of criterion.sections) {
      const entry = section.entries.find((candidate) => candidate.key === key)
      if (entry) return entry
    }
  return undefined
}

/** Live site text by key, for comparing against the user's column. */
export function liveTextByKey(structure: CopyCriterion[]): Record<string, string> {
  const live: Record<string, string> = {}
  for (const criterion of structure)
    for (const section of criterion.sections)
      for (const field of section.fields) live[field.key] = field.live
  return live
}

/** Normalizes line endings and trailing space so a textarea round-trip is not a change. */
export const sameText = (a: string, b: string) =>
  a.replace(/\r\n/g, '\n').trim() === b.replace(/\r\n/g, '\n').trim()

export const serializeCopyFile = (file: CopyFile) => `${JSON.stringify(file, null, 2)}\n`

/** One block of a criterion report, from scripts/extract-criterion-reports.py. */
export type ReportBlock =
  | { type: 'heading'; level: number; text: string }
  | { type: 'paragraph' | 'item'; text: string }
  | { type: 'table'; rows: string[][] }

/** editorial/criteria-sources/<criterion>.json: the report passages behind each editor section. */
export interface CriterionSource {
  report: string
  sections: Record<string, ReportBlock[]>
}

export const SOURCES_DIR = 'editorial/criteria-sources'
