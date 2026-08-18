import fs from 'node:fs'
import path from 'node:path'

const roots = process.argv.slice(2)
const scanRoots = roots.length > 0 ? roots : ['src']
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
  if (!/\.(ts|tsx)$/.test(normalizedFile) || ignored.has(normalizedFile)) return

  const source = fs.readFileSync(normalizedFile, 'utf8')
  const checks = [
    [/#[0-9a-f]{3,8}\b/gi, 'literal color'],
    [/\brgba?\(/gi, 'literal rgb/rgba color'],
    [/var\(--mui-|var\(--font-/gi, 'CSS variable token access'],
    [/fontFamily\s*:\s*['"]/g, 'literal font family'],
    [
      /\b(?:fontSize|fontWeight|letterSpacing|lineHeight|textTransform)\s*:/g,
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
if (violations.length) {
  console.error(violations.join('\n'))
  process.exitCode = 1
} else {
  console.log('Source code uses centralized theme colors, typography, shape, and spacing tokens.')
}
