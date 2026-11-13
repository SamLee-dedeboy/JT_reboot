import { Box, Typography } from '@mui/material'
import { jtSpacing } from '@/theme'
import { GateTimeline, ReleaseTimeline } from './OperationSchedules'
import { type Implementation, ecoMachineAreas, newGreenWatershedAreas } from '@/content/modeling'
import { textMaxWidth } from './sectionStyles'
import ScenarioMap from './ScenarioMap'

/** Restoration already counted in the baselines, so it is not a change in either future. */
function BaselineRestorationNote() {
  return (
    <Box sx={{ mt: jtSpacing.component.lg }}>
      <Typography variant="columnHead" component="p">
        Already in the baseline
      </Typography>
      <Typography variant="body2" sx={{ mt: jtSpacing.gap.xs }}>
        Planned restoration at Little Egbert Tract and Prospect Island is part of the Baseline, so
        it is not counted as a change here.
      </Typography>
    </Box>
  )
}

function NamedList({ items }: { items: readonly { name: string; body: string }[] }) {
  return (
    <Box sx={{ mt: jtSpacing.component.md, borderTop: 1, borderColor: 'border.strong' }}>
      {items.map(({ name, body }) => (
        <Box
          component="article"
          key={name}
          sx={{ py: jtSpacing.gap.md, borderBottom: 1, borderColor: 'border.default' }}
        >
          <Typography variant="cardTitle" component="h5">
            {name}
          </Typography>
          <Typography variant="body2" sx={{ mt: jtSpacing.gap.xs }}>
            {body}
          </Typography>
        </Box>
      ))}
    </Box>
  )
}

function NewGreenWatershedAreas() {
  const headSx = { typography: 'columnHead', pb: jtSpacing.gap.sm, textAlign: 'center' }
  const cellSx = { py: jtSpacing.gap.sm, textAlign: 'center', typography: 'body2' }

  return (
    <>
      <Box
        component="table"
        sx={{ width: '100%', mt: jtSpacing.component.md, borderCollapse: 'collapse' }}
      >
        <thead>
          <tr>
            <Box component="th" scope="col" sx={{ ...headSx, textAlign: 'left' }}>
              Restored area
            </Box>
            <Box component="th" scope="col" sx={{ ...headSx, width: '20%' }}>
              Eco Machine
            </Box>
            <Box component="th" scope="col" sx={{ ...headSx, width: '20%' }}>
              New Green Watershed
            </Box>
          </tr>
        </thead>
        <tbody>
          {newGreenWatershedAreas.map(({ name, inEcoMachine }) => (
            <Box component="tr" key={name} sx={{ borderTop: 1, borderColor: 'border.default' }}>
              <Box
                component="th"
                scope="row"
                sx={{ py: jtSpacing.gap.sm, pr: jtSpacing.gap.sm, textAlign: 'left' }}
              >
                <Typography variant="cardTitle" component="span">
                  {name}
                </Typography>
              </Box>
              <Box
                component="td"
                sx={{ ...cellSx, color: inEcoMachine ? 'common.white' : 'base.200' }}
              >
                {inEcoMachine ? 'Yes' : 'No'}
              </Box>
              <Box
                component="td"
                sx={{ ...cellSx, color: inEcoMachine ? 'common.white' : 'primary.main' }}
              >
                {inEcoMachine ? 'Yes' : 'Added'}
              </Box>
            </Box>
          ))}
        </tbody>
      </Box>
      <BaselineRestorationNote />
    </>
  )
}

/** What each scenario changes: its restored areas or operating schedule, and its map. */
export default function ImplementationPanel({
  implementation,
}: {
  implementation: Implementation
}) {
  const { id, detailTitle, lead } = implementation

  const heading = (
    <>
      <Typography variant="h4" component="h4">
        {detailTitle}
      </Typography>
      <Typography
        variant="body1"
        sx={{
          mt: jtSpacing.gap.sm,
          color: 'base.50',
          maxWidth: textMaxWidth,
        }}
      >
        {lead}
      </Typography>
    </>
  )

  if (id === 'reserves') {
    return (
      <Box sx={{ mt: jtSpacing.component.lg }}>
        {heading}
        <Box sx={{ mt: jtSpacing.component.md }}>
          <ReleaseTimeline />
        </Box>
      </Box>
    )
  }

  if (id === 'bolster') {
    return (
      <Box sx={{ mt: jtSpacing.component.lg }}>
        {heading}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'minmax(0, 1fr)', lg: 'minmax(0, 3fr) minmax(0, 2fr)' },
            gap: jtSpacing.gap.xl,
            alignItems: 'center',
            mt: jtSpacing.component.md,
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <GateTimeline />
          </Box>
          <ScenarioMap implementation={implementation} />
        </Box>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: 'minmax(0, 1fr)', lg: 'repeat(2, minmax(0, 1fr))' },
        gap: jtSpacing.gap.xl,
        alignItems: id === 'tunnel' ? 'stretch' : 'start',
        mt: jtSpacing.component.lg,
      }}
    >
      <Box sx={{ minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {heading}
        {id === 'eco' && (
          <>
            <NamedList items={ecoMachineAreas} />
            <BaselineRestorationNote />
          </>
        )}
        {id === 'ngw' && <NewGreenWatershedAreas />}
        {id === 'tunnel' && (
          <Box
            sx={{
              flex: 1,
              minHeight: 200,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mt: jtSpacing.component.md,
              p: jtSpacing.component.md,
              border: '1px dashed',
              borderColor: 'base.100',
              borderRadius: 1,
              textAlign: 'center',
            }}
          >
            <Typography variant="placeholderNote">Simulation details forthcoming</Typography>
          </Box>
        )}
      </Box>
      <ScenarioMap implementation={implementation} />
    </Box>
  )
}
