import re
import sys

S = sys.argv[1]
R = 'features/scenarios/ranking'


def ed(p, pairs, regex=False):
    path = f'{S}/{p}'
    s = open(path, encoding='utf-8').read()
    for o, n in pairs:
        if regex:
            s, k = re.subn(o, n, s)
            assert k, (p, o)
        else:
            assert s.count(o) >= 1, (p, o[:80])
            s = s.replace(o, n)
    open(path, 'w', encoding='utf-8', newline='').write(s)


# 1. A column-head variant, so headings over a table's columns are not hand-built.
ed('theme/typography.ts', [(
    """  captionSmall: {
    fontFamily: fontBody,
    fontSize: 'clamp(0.9rem, 0.7rem + 0.16vw, 1.05rem)',
    lineHeight: 1.2,
    color: palette.base[100],
  },
""", """  captionSmall: {
    fontFamily: fontBody,
    fontSize: 'clamp(0.9rem, 0.7rem + 0.16vw, 1.05rem)',
    lineHeight: 1.2,
    color: palette.base[100],
  },
  // A heading over a table's or chart's columns: small, uppercase, tracked.
  columnHead: {
    fontFamily: fontBody,
    fontSize: 'clamp(0.9rem, 0.7rem + 0.16vw, 1.05rem)',
    lineHeight: 1.2,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: palette.base[100],
  },
""")])
ed('theme/theme.types.d.ts', [
    ("    captionSmall: CSSProperties\n", "    captionSmall: CSSProperties\n    columnHead: CSSProperties\n"),
    ("    captionSmall: true\n", "    captionSmall: true\n    columnHead: true\n"),
])
# The options interface may list variants too.
p = f'{S}/theme/theme.types.d.ts'
s = open(p, encoding='utf-8').read()
s = s.replace("    captionSmall?: CSSProperties\n", "    captionSmall?: CSSProperties\n    columnHead?: CSSProperties\n")
open(p, 'w', encoding='utf-8', newline='').write(s)

# 2. The merges, across the ranking pages.
files = [
    'Page.tsx',
    'RankingVisualizations.tsx',
    'breakout/components/controls.tsx',
    'breakout/components/Matrix.tsx',
    'breakout/components/Pins.tsx',
    'breakout/components/CellCards.tsx',
    'breakout/components/TableHeader.tsx',
]
for f in files:
    path = f'{S}/{R}/{f}'
    s = open(path, encoding='utf-8').read()
    s = re.sub(r"(['\"])meta\1", r"\1body2\1", s)
    s = s.replace("variant={nested ? 'body2' : 'body2'}", 'variant="body2"')
    s = re.sub(r"(['\"])(numberRank|numberArticle|chartValue)\1", r"\1chartValueLarge\1", s)
    s = re.sub(r"(['\"])numberBadge\1", r"\1chartTitle\1", s)
    s = re.sub(r"(['\"])cardTitle\1", r"\1navigationLabel\1", s)
    s = re.sub(r"(['\"])cardBody\1", r"\1body1\1", s)
    s = s.replace('variant="button"', 'variant="chartTitle"')
    s = s.replace("variant={lead ? 'h4' : 'body1'}", "variant={lead ? 'numberScore' : 'body1'}")
    open(path, 'w', encoding='utf-8', newline='').write(s)

ed(f'{R}/breakout/components/TableHeader.tsx', [
    ('<Typography variant="bodyLarge" component="p"', '<Typography variant="body1" component="p"'),
])

V = f'{R}/RankingVisualizations.tsx'
ed(V, [
    ("const COLUMN_HEAD = { textTransform: 'uppercase', letterSpacing: '0.06em', color: 'base.100' }\n", ""),
    ("""            variant="captionSmall"
            sx={{
              ...COLUMN_HEAD,
              position: 'absolute',""", """            variant="columnHead"
            sx={{
              position: 'absolute',"""),
    ('<Typography variant="captionSmall" sx={COLUMN_HEAD}>', '<Typography variant="columnHead">'),
    ("<Typography variant=\"captionSmall\" sx={{ ...COLUMN_HEAD, textAlign: 'right' }}>",
     "<Typography variant=\"columnHead\" sx={{ textAlign: 'right' }}>"),
])
s = open(f'{S}/{V}', encoding='utf-8').read()
assert 'COLUMN_HEAD' not in s, 'COLUMN_HEAD left'
print('ok')
