// Dev-server endpoint for the criteria copy editor (/pages/criteria-copy).
//   GET  /__criteria-copy  syncs editorial/criteria-copy.json with the field map and
//                          returns { file, live, sources } (live = the site's text by key,
//                          sources = the report passages behind each section)
//   POST /__criteria-copy  { key, column, value } writes one cell and saves the file
// Each request re-reads the file from disk, so drafts another agent wrote in the
// meantime are kept. Serve only; production builds have no endpoint.
import fs from 'node:fs'
import path from 'node:path'
import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Plugin, ViteDevServer } from 'vite'
import {
  COPY_ENDPOINT,
  COPY_FILE_PATH,
  findEntry,
  liveTextByKey,
  serializeCopyFile,
  SOURCES_DIR,
  syncCopyFile,
  writableColumns,
  type CopyColumn,
  type CopyFile,
  type CriterionSource,
} from '../src/internal/criteria-copy/copyFile'
import type { CopyCriterion } from '../src/internal/criteria-copy/fields'

export async function loadStructure(server: ViteDevServer): Promise<CopyCriterion[]> {
  const fields = await server.ssrLoadModule('/src/internal/criteria-copy/fields.ts')
  return fields.buildCriteriaFields()
}

export function readCopyFile(root: string): CopyFile | undefined {
  const file = path.join(root, COPY_FILE_PATH)
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : undefined
}

/** The extracted report passages per criterion; see scripts/extract-criterion-reports.py. */
function readSources(root: string): Record<string, CriterionSource> {
  const dir = path.join(root, SOURCES_DIR)
  if (!fs.existsSync(dir)) return {}
  return Object.fromEntries(
    fs
      .readdirSync(dir)
      .filter((name) => name.endsWith('.json'))
      .map((name) => [
        name.replace(/\.json$/, ''),
        JSON.parse(fs.readFileSync(path.join(dir, name), 'utf8')),
      ]),
  )
}

/** Writes only when the text changed, so an idle editor does not touch the file. */
export function writeCopyFile(root: string, copy: CopyFile) {
  const file = path.join(root, COPY_FILE_PATH)
  const next = serializeCopyFile(copy)
  if (fs.existsSync(file) && fs.readFileSync(file, 'utf8') === next) return
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, next)
}

const readBody = (req: IncomingMessage) =>
  new Promise<string>((resolve, reject) => {
    let body = ''
    req.on('data', (chunk) => (body += chunk))
    req.on('end', () => resolve(body))
    req.on('error', reject)
  })

const send = (res: ServerResponse, status: number, body: unknown) => {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(body))
}

export default function criteriaCopyPlugin(): Plugin {
  return {
    name: 'jt-criteria-copy',
    apply: 'serve',
    configureServer(server) {
      const root = server.config.root
      server.middlewares.use(COPY_ENDPOINT, async (req, res) => {
        try {
          const structure = await loadStructure(server)
          const copy = syncCopyFile(structure, readCopyFile(root))

          if (req.method === 'POST') {
            const { key, column, value } = JSON.parse(await readBody(req))
            const entry = findEntry(copy, key)
            if (!entry) return send(res, 404, { error: `No field ${key}` })
            if (!writableColumns.includes(column) || typeof value !== 'string')
              return send(res, 400, { error: 'Expected a writable column and a string value' })
            entry[column as CopyColumn] = value
          } else if (req.method !== 'GET') {
            return send(res, 405, { error: 'GET or POST only' })
          }

          writeCopyFile(root, copy)
          send(res, 200, { file: copy, live: liveTextByKey(structure), sources: readSources(root) })
        } catch (error) {
          send(res, 500, { error: String(error) })
        }
      })
    },
  }
}
