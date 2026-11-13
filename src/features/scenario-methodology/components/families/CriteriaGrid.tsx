import { Box, Stack, Typography } from '@mui/material'
import { jtSpacing } from '@/theme'
import { TeamIcon } from '@/ui'
import { criteria, criterionById, type CriterionId } from '@/content/criteria'
import ScoreBadge from './ScoreBadge'
import { teamStyle } from '@/ui/teamStyle'

const criteriaColumns = `minmax(160px, 1.2fr) repeat(${criteria.length}, minmax(88px, 1fr))`

/** One criterion's verdict on one future: its score, or why there is no single score. */
function CriterionCell({ teamId, scenarioSlug }: { teamId: CriterionId; scenarioSlug: string }) {
  const finding = criterionById[teamId].report.findings[scenarioSlug]
  if (!finding) {
    return (
      <Typography variant="captionSmall" sx={{ color: 'base.300' }}>
        Not assessed
      </Typography>
    )
  }
  if (finding.overall.score === null) {
    return (
      <Typography variant="captionSmall" sx={{ color: 'base.200' }} title={finding.overall.summary}>
        No single score
      </Typography>
    )
  }
  return <ScoreBadge score={finding.overall.score} />
}

/** Futures down the side, the five criteria across the top. */
export default function CriteriaGrid({ rows }: { rows: { slug: string; label: string }[] }) {
  return (
    <Box sx={{ overflowX: 'auto' }}>
      <Box role="table" sx={{ display: 'grid', gridTemplateColumns: criteriaColumns }}>
        <Box role="row" sx={{ display: 'contents' }}>
          <Typography role="columnheader" variant="captionSmall" sx={{ color: 'base.200' }}>
            Future
          </Typography>
          {criteria.map((team) => (
            <Stack
              key={team.id}
              role="columnheader"
              direction="row"
              spacing={jtSpacing.gap.xs}
              sx={{ alignItems: 'center', color: teamStyle[team.id].color, pb: jtSpacing.gap.sm }}
            >
              <TeamIcon team={teamStyle[team.id].icon} size={18} />
              <Typography variant="navigationSubLabel" sx={{ color: 'inherit' }}>
                {teamStyle[team.id].shortLabel}
              </Typography>
            </Stack>
          ))}
        </Box>
        {rows.map((row) => (
          <Box role="row" key={row.slug} sx={{ display: 'contents' }}>
            <Typography
              role="rowheader"
              variant="navigationLabel"
              sx={{ py: jtSpacing.component.sm, borderTop: 1, borderColor: 'border.subtle' }}
            >
              {row.label}
            </Typography>
            {criteria.map((team) => (
              <Box
                role="cell"
                key={team.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  py: jtSpacing.component.sm,
                  borderTop: 1,
                  borderColor: 'border.subtle',
                }}
              >
                <CriterionCell teamId={team.id} scenarioSlug={row.slug} />
              </Box>
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  )
}
