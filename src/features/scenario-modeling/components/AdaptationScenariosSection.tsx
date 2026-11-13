import { Box } from '@mui/material'
import {
  implementationDetails,
  implementationGroups,
  type ImplementationId,
} from '@/content/modeling'
import { jtSpacing } from '@/theme'
import ChoiceCards from './ChoiceCards'
import ImplementationPanel from './ImplementationPanel'
import ModelOverview from './ModelOverview'
import { GroupBlock, KeyPhrase, SubsectionHeading } from './sectionParts'
import { sectionSx } from './sectionStyles'

/** The five adaptation scenarios: the RMA model, then a card per scenario showing how it is built. */
export default function AdaptationScenariosSection({
  selectedImplementationId,
  onSelectImplementation,
}: {
  selectedImplementationId: ImplementationId
  onSelectImplementation: (id: ImplementationId) => void
}) {
  const selectedImplementation =
    implementationDetails.find(({ id }) => id === selectedImplementationId) ??
    implementationDetails[0]

  return (
    <Box
      component="section"
      id="adaptation-scenarios"
      aria-labelledby="adaptation-scenarios-title"
      sx={{ ...sectionSx, borderTop: 3, borderColor: 'primary.main' }}
    >
      <SubsectionHeading
        id="adaptation-scenarios-title"
        title="Adaptation scenarios"
        color="primary.main"
      >
        5 scenarios, modeled in RMA, compared with the <KeyPhrase>Baseline</KeyPhrase> or{' '}
        <KeyPhrase>CalSim Baseline</KeyPhrase>.
      </SubsectionHeading>
      <ModelOverview
        model="rma"
        stationNote="RMA output is sampled at 386 stations spread across the Bay and the Delta. Its salinity boundary is at the Golden Gate, where ocean salinity enters the model."
      />
      <Box sx={{ mt: jtSpacing.component.lg }}>
        <GroupBlock id="scenario-implementations" title="How each future is built">
          <ChoiceCards
            groups={implementationGroups}
            value={selectedImplementationId}
            onChange={(id) => onSelectImplementation(id as ImplementationId)}
          />
          <ImplementationPanel implementation={selectedImplementation} />
        </GroupBlock>
      </Box>
    </Box>
  )
}
