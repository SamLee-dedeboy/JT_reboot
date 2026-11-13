// Flags raw colors, typography, spacing and palette imports that bypass the theme.
//   node scripts/check-theme-tokens.mjs [paths...]   audit whole files (default: src)
//   node scripts/check-theme-tokens.mjs --changed    audit only the lines added or changed since
//                                                    HEAD in public-site files (untracked files in
//                                                    full), so new work is held to the rule while
//                                                    the older backlog is fixed separately
import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const args = process.argv.slice(2)
const changedOnly = args.includes('--changed')
const roots = args.filter((arg) => arg !== '--changed')

const git = (command) =>
  execSync(command, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })
    .split('\n')
    .map((line) => line.trimEnd())
    .filter(Boolean)

const inScope = (file) =>
  file.startsWith('src/') && !file.startsWith('src/internal/') && fs.existsSync(file)

/** Per changed file, the line numbers to audit: every line of a new file, else the added ones. */
function changedLines() {
  const lines = new Map()
  for (const file of git('git ls-files --others --exclude-standard').filter(inScope)) {
    lines.set(file, 'all')
  }
  let file = null
  for (const line of git('git diff --unified=0 --no-color --no-renames HEAD -- src')) {
    if (line.startsWith('+++ ')) {
      const name = line.slice(4).replace(/^b\//, '')
      file = inScope(name) ? name : null
      if (file && !lines.has(file)) lines.set(file, new Set())
      continue
    }
    const hunk = file && /^@@ -\S+ \+(\d+)(?:,(\d+))? @@/.exec(line)
    if (!hunk) continue
    const set = lines.get(file)
    if (set === 'all') continue
    const start = Number(hunk[1])
    const count = hunk[2] === undefined ? 1 : Number(hunk[2])
    for (let n = start; n < start + count; n += 1) set.add(n)
  }
  return lines
}

const auditLines = changedOnly ? changedLines() : null

const scanRoots = changedOnly ? [...auditLines.keys()] : roots.length > 0 ? roots : ['src']
const ignored = new Set([
  'src/theme/palette.ts',
  'src/theme/typography.ts',
  'src/theme/spacing.ts',
  'src/theme/components.ts',
  'src/theme/theme.ts',
  'src/theme/map.ts',
  'src/theme/chart.ts',
  'src/ui/Icon.tsx',
])
const violations = []

function inspectFile(file) {
  const normalizedFile = file.replaceAll('\\', '/')
  if (
    !/\.(ts|tsx)$/.test(normalizedFile) ||
    ignored.has(normalizedFile) ||
    normalizedFile.startsWith('src/theme/coDesign/')
  )
    return

  const source = fs.readFileSync(normalizedFile, 'utf8')
  const checks = [
    [/#[0-9a-f]{3,8}\b/gi, 'literal color'],
    [/\brgba?\(/gi, 'literal rgb/rgba color'],
    [/var\(--mui-|var\(--font-/gi, 'CSS variable token access'],
    [/fontFamily\s*:\s*['"]/g, 'literal font family'],
    [
      /\b(?:fontSize|fontWeight|fontStyle|letterSpacing|lineHeight|textTransform)\s*:/g,
      'manual typography composition',
    ],
    [
      /\b(?:px|py|pt|pb|pl|pr|p|mx|my|mt|mb|m)\s*:\s*['"]-?[\d.]+(?:px|rem|em)['"]/g,
      'literal spacing value',
    ],
    [/from\s+['"][^'"]*theme\/palette['"]/g, 'direct palette import in UI code'],
  ]
  for (const [pattern, label] of checks) {
    for (const match of source.matchAll(pattern)) {
      const line = source.slice(0, match.index).split('\n').length
      violations.push(`${normalizedFile}:${line} ${label}: ${match[0]}`)
    }
  }

  const repositoryScope =
    normalizedFile.startsWith('src/features/repository/') ||
    normalizedFile.startsWith('src/features/background/') ||
    normalizedFile === 'src/ui/cards/StudioFeatureCard.tsx' ||
    normalizedFile === 'src/ui/cards/ResourceReportCard.tsx'

  if (repositoryScope) {
    const rawSpacingChecks = [
      [
        /\b(?:gap|rowGap|columnGap|padding|paddingInline|paddingBlock|px|py|pt|pb|pl|pr|p|margin|marginInline|marginBlock|mx|my|mt|mb|m)\s*:\s*(?!0(?:\D|$))-?(?:\d*\.)?\d+/g,
        'raw numeric spacing; use jtSpacing',
      ],
      [
        /\b(?:gap|rowGap|columnGap|padding|paddingInline|paddingBlock|px|py|pt|pb|pl|pr|p|margin|marginInline|marginBlock|mx|my|mt|mb|m)\s*:\s*\{[^}]*\b(?:xs|sm|md|lg|xl)\s*:\s*(?!0(?:\D|$))-?(?:\d*\.)?\d+/gs,
        'raw responsive spacing; use jtSpacing',
      ],
      [/\bspacing=\{(?!jtSpacing\.)-?(?:\d*\.)?\d+\}/g, 'raw Stack spacing; use jtSpacing'],
    ]

    for (const [pattern, label] of rawSpacingChecks) {
      for (const match of source.matchAll(pattern)) {
        const line = source.slice(0, match.index).split('\n').length
        violations.push(`${normalizedFile}:${line} ${label}: ${match[0].split('\n')[0]}`)
      }
    }
  }
}

function visit(target) {
  const stat = fs.statSync(target)
  if (stat.isFile()) {
    inspectFile(target)
    return
  }

  for (const entry of fs.readdirSync(target, { withFileTypes: true })) {
    const file = path.join(target, entry.name).replaceAll('\\', '/')
    if (entry.isDirectory()) visit(file)
    else inspectFile(file)
  }
}

for (const root of scanRoots) visit(root)

/** In --changed mode, keep only the violations on lines this work added or changed. */
const reported = changedOnly
  ? violations.filter((violation) => {
      const [, file, line] = /^(.+?):(\d+) /.exec(violation)
      const lines = auditLines.get(file)
      return lines === 'all' || lines?.has(Number(line))
    })
  : violations
if (changedOnly) console.log(`Checked the changed lines of ${scanRoots.length} file(s).`)
if (reported.length) {
  console.error(reported.join('\n'))
  process.exitCode = 1
} else {
  console.log('Source code uses centralized theme colors, typography, shape, and spacing tokens.')
}
