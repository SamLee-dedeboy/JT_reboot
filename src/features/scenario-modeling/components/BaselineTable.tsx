import { Box, Button, Stack, Typography } from '@mui/material'
import { jtSpacing } from '@/theme'
import {
  baselineRows,
  implementationDetails,
  outflowVariations,
  type Future,
} from '@/content/modeling'

/** Comparison table: each baseline, its model, what its scenarios change, and the scenarios. */
export default function BaselineTable({
  onSelectFuture,
}: {
  onSelectFuture: (future: Future) => void
}) {
  const headSx = { typography: 'columnHead', pb: jtSpacing.gap.sm, textAlign: 'left' }
  const cellSx = { py: jtSpacing.component.lg, pr: jtSpacing.gap.lg, verticalAlign: 'top' }

  return (
    <Box sx={{ mt: jtSpacing.component.lg, overflowX: 'auto', overflowY: 'hidden' }}>
      <Box
        component="table"
        sx={{ width: '100%', minWidth: 760, borderCollapse: 'collapse', textAlign: 'left' }}
      >
        <thead>
          <tr>
            <Box component="th" scope="col" sx={{ ...headSx, width: '32%' }}>
              Compared with
            </Box>
            <Box component="th" scope="col" sx={{ ...headSx, width: '10%' }}>
              Model
            </Box>
            <Box component="th" scope="col" sx={{ ...headSx, width: '22%' }}>
              Changes
            </Box>
            <Box component="th" scope="col" sx={headSx}>
              Scenarios
            </Box>
          </tr>
        </thead>
        <tbody>
          {baselineRows.map((row) => (
            <Box
              component="tr"
              key={row.baseline}
              sx={{ borderTop: 1, borderColor: 'border.strong' }}
            >
              <Box component="th" scope="row" sx={{ ...cellSx, textAlign: 'left' }}>
                <Typography variant="h4" component="span" sx={{ display: 'block' }}>
                  {row.baseline}
                </Typography>
                <Typography variant="body2" component="span" sx={{ display: 'block', mt: 1 }}>
                  {row.description}
                </Typography>
              </Box>
              <Box component="td" sx={cellSx}>
                <Typography variant="cardTitle" component="span">
                  {row.model}
                </Typography>
              </Box>
              <Box component="td" sx={cellSx}>
                {row.changes.map((line) => (
                  <Typography
                    key={line}
                    variant="cardTitle"
                    component="span"
                    sx={{ display: 'block' }}
                  >
                    {line}
                  </Typography>
                ))}
              </Box>
              <Box component="td" sx={{ ...cellSx, pr: 0 }}>
                <Typography
                  variant="columnHead"
                  component="p"
                  sx={{ mb: jtSpacing.gap.xs, color: 'primary.main' }}
                >
                  {row.scenarios}
                </Typography>
                <Stack direction="row" useFlexGap spacing={1} sx={{ flexWrap: 'wrap' }}>
                  {[...outflowVariations, ...implementationDetails]
                    .filter(({ group }) => group === row.group)
                    .map((future) => (
                      <Button
                        key={future.id}
                        variant="outlined"
                        onClick={() => onSelectFuture(future)}
                        sx={{ color: 'common.white', borderColor: 'base.300' }}
                      >
                        {future.label}
                      </Button>
                    ))}
                </Stack>
              </Box>
            </Box>
          ))}
        </tbody>
      </Box>
    </Box>
  )
}
