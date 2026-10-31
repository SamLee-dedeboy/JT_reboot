import sys

S = sys.argv[1]


def ed(p, pairs):
    path = f'{S}/{p}'
    s = open(path, encoding='utf-8').read()
    for o, n in pairs:
        assert s.count(o) == 1, (p, o[:80], s.count(o))
        s = s.replace(o, n)
    open(path, 'w', encoding='utf-8', newline='').write(s)


ed('theme/theme.ts', [
    ("  dot: { size: 12, stemWidth: 2, stemOpacity: 0.55, rowHeight: 28 },",
     "  dot: { size: 12, stemWidth: 2, stemOpacity: 0.55, rowHeight: 22 },\n"
     "  /** A scenario's own row in the overall ranking (the weighted chart keeps rowHeight). */\n"
     "  overallRowHeight: 46,"),
])

R = 'features/scenarios/ranking/RankingVisualizations.tsx'
ed(R, [
    ("  0: 'as usual',", "  0: 'today',"),
    ("""const OVERALL_GAP = { xs: jtSpacing.gap.xs, md: jtSpacing.gap.md }
""", """const OVERALL_GAP = { xs: jtSpacing.gap.xs, md: jtSpacing.gap.md }

/** The run every other scenario is scored against: 0 on every criterion. */
const BASELINES = new Set(['Business as Usual', 'Historic Baseline'])

/** Beside the baseline's zero line: which side is better and which worse than today. */
function BaselineSides() {
  const side = { position: 'absolute', top: '50%', transform: 'translateY(-50%)', color: 'base.100' } as const
  return (
    <Box sx={{ position: 'relative', height: ranking.trackHeight }}>
      <Typography variant="captionSmall" sx={{ ...side, right: 'calc(50% + 10px)' }}>
        Above: better than today
      </Typography>
      <Typography variant="captionSmall" sx={{ ...side, left: 'calc(50% + 10px)' }}>
        Below: worse than today
      </Typography>
    </Box>
  )
}
"""),
    ("""          {ranked.map((scenario, index) => {
            const open = expanded.has(scenario.name)
            return (
              <Box
                key={scenario.name}
                sx={{ position: 'relative', borderTop: 1, borderColor: 'border.subtle' }}
              >""", """          {ranked.map((scenario, index) => {
            const open = expanded.has(scenario.name)
            // The baseline is a band the others are read against; the rest alternate
            // a faint ground so each scenario's block reads as one.
            const baseline = BASELINES.has(scenario.name)
            const shade = ranked
              .slice(0, index)
              .filter((other) => !BASELINES.has(other.name)).length
            return (
              <Box
                key={scenario.name}
                sx={{
                  position: 'relative',
                  ...(baseline
                    ? {
                        my: '-1px',
                        borderTop: 2,
                        borderBottom: 2,
                        borderColor: 'primary.main',
                        bgcolor: 'translucent.primaryGreenSubtle',
                        zIndex: 1,
                      }
                    : {
                        borderTop: 1,
                        borderColor: 'border.default',
                        bgcolor: shade % 2 === 0 ? 'translucent.50' : 'transparent',
                      }),
                }}
              >"""),
    ("""                    minHeight: ranking.rowHeight,
                    textAlign: 'left',""", """                    minHeight: ranking.overallRowHeight,
                    textAlign: 'left',"""),
    ("""                  <Typography variant="numberRank">
                    {scenario.hasScores ? rankLabel(index + 1) : UNRANKED}
                  </Typography>
                  <Stack
                    direction="row"
                    sx={{ alignItems: 'center', justifyContent: 'space-between' }}
                  >
                    <Typography variant="navigationLabel">{scenario.name}</Typography>""",
     """                  <Typography variant="numberRank">
                    {scenario.hasScores ? rankLabel(index + 1) : UNRANKED}
                  </Typography>
                  <Stack
                    direction="row"
                    sx={{ alignItems: 'center', justifyContent: 'space-between' }}
                  >
                    <Box>
                      <Typography variant="navigationLabel">{scenario.name}</Typography>
                      {baseline && (
                        <Typography variant="captionSmall" component="p" sx={{ color: 'primary.main' }}>
                          Today’s Delta: the baseline
                        </Typography>
                      )}
                    </Box>"""),
    ("""                  <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                    <ScoreBar score={scenario.wAvg} />
                  </Box>
                  <ScoreValue scenario={scenario} />""", """                  <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                    {baseline ? <BaselineSides /> : <ScoreBar score={scenario.wAvg} />}
                  </Box>
                  <ScoreValue scenario={scenario} />"""),
])
print('ok')
