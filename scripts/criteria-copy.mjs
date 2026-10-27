// Syncs editorial/criteria-copy.json with the site's criterion fields and reports
// what is left to do, without starting the dev server:
//   - fields whose `yours` text is not on the site yet (to apply in code)
//   - fields with a note for Claude or GPT
//   - fields GPT has not drafted
//
//     npm run copy:criteria
import fs from 'node:fs'
import { createServer } from 'vite'

const server = await createServer({
  server: { middlewareMode: true, hmr: false },
  appType: 'custom',
  logLevel: 'error',
})

try {
  const { buildCriteriaFields } = await server.ssrLoadModule(
    '/src/internal/criteria-copy/fields.ts',
  )
  const copyFile = await server.ssrLoadModule('/src/internal/criteria-copy/copyFile.ts')
  const structure = buildCriteriaFields()
  const path = copyFile.COPY_FILE_PATH
  const existing = fs.existsSync(path) ? JSON.parse(fs.readFileSync(path, 'utf8')) : undefined
  const copy = copyFile.syncCopyFile(structure, existing)
  const next = copyFile.serializeCopyFile(copy)
  if (!existing || fs.readFileSync(path, 'utf8') !== next) {
    fs.mkdirSync('editorial', { recursive: true })
    fs.writeFileSync(path, next)
  }

  const live = copyFile.liveTextByKey(structure)
  const entries = copy.criteria.flatMap((criterion) =>
    criterion.sections.flatMap((section) => section.entries),
  )
  const toApply = entries.filter(
    (entry) => entry.yours.trim() && !copyFile.sameText(entry.yours, live[entry.key] ?? ''),
  )
  const notes = entries.filter((entry) => entry.note.trim())
  const noGpt = entries.filter((entry) => !entry.gpt.trim())

  console.log(`${path}: ${entries.length} fields, ${copy.orphans.length} orphaned`)
  console.log(`\nTo apply (${toApply.length}): your text is not on the site yet`)
  for (const entry of toApply) console.log(`  ${entry.key}  →  ${entry.source}`)
  console.log(`\nNotes (${notes.length})`)
  for (const entry of notes) console.log(`  ${entry.key}: ${entry.note}`)
  console.log(`\nWithout a GPT draft: ${noGpt.length} of ${entries.length}`)
} finally {
  await server.close()
}
