import fs from 'node:fs'
import path from 'node:path'

const roots = ['src']
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

function visit(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name).replaceAll('\\', '/')
    if (entry.isDirectory()) visit(file)
    else if (/\.(ts|tsx)$/.test(file) && !ignored.has(file)) {
      const source = fs.readFileSync(file, 'utf8')
      const checks = [
        [/#[0-9a-f]{3,8}\b/gi, 'literal color'],
        [/\brgba?\(/gi, 'literal rgb/rgba color'],
        [/var\(--mui-|var\(--font-/gi, 'CSS variable token access'],
        [/fontFamily\s*:\s*['"]/g, 'literal font family'],
        [
          /\b(?:fontSize|fontWeight|letterSpacing|lineHeight|textTransform)\s*:/g,
          'manual typography composition',
        ],
        [/\b(?:px|py|pt|pb|pl|pr|p|mx|my|mt|mb|m)\s*:/g, 'spacing shorthand'],
        [/from\s+['"][^'"]*theme\/palette['"]/g, 'direct palette import in UI code'],
      ]
      for (const [pattern, label] of checks) {
        for (const match of source.matchAll(pattern)) {
          const line = source.slice(0, match.index).split('\n').length
          violations.push(`${file}:${line} ${label}: ${match[0]}`)
        }
      }
    }
  }
}

for (const root of roots) visit(root)
if (violations.length) {
  console.error(violations.join('\n'))
  process.exitCode = 1
} else {
  console.log('Source code uses centralized theme colors, typography, shape, and spacing tokens.')
}
