import WaterDropIcon from '@mui/icons-material/WaterDrop'
import { Stack, Typography } from '@mui/material'
import ExpandableScenarioPanels from '../../ui/animation/ExpandableScenarioPanels'
import { assetUrl } from '../../utils/baseUrl'

const outflowVariations = [
  {
    label: 'Less Delta outflow',
    eyebrow: 'A Saltier Delta',
    body: 'Explore a more constrained river outflow condition (10% decrease) in the Delta.',
  },
  {
    label: 'Business as Usual',
    eyebrow: 'Current operations',
    body: 'Begin with this starting point before changing Delta outflow assumptions.',
  },
  {
    label: 'More Delta outflow',
    eyebrow: 'A Fresher Delta',
    body: 'Explore a stronger river outflow (30% increase) in the Delta.',
  },
] as const

const panels = outflowVariations.map((variation, index) => ({
  title: variation.label,
  image: assetUrl('/images/scenarios/outflow.jpg'),
  eyebrow: variation.eyebrow,
  body: variation.body,
  href: '/scenarios',
  key: `outflow-${index}`,
}))

const sectionLabelSx = {
  color: 'primary.main',
  '& .MuiSvgIcon-root': {
    fontSize: 'inherit',
    verticalAlign: 'middle',
    mr: 1,
  },
} as const

/** Original three-column treatment, retained so the landing page can switch back easily. */
export default function OutflowVariationPanels() {
  return (
    <ExpandableScenarioPanels
      items={panels}
      actionLabel="Explore"
      sharedImage
      header={
        <Stack spacing={1.2} sx={{ maxWidth: { xs: 620, md: 760 } }}>
          <Typography component="p" variant="eyebrow" sx={sectionLabelSx}>
            <WaterDropIcon />
            Outflow Variations
          </Typography>
          <Typography id="outflow-panels-title" variant="h2" component="h2">
            Probable water futures
          </Typography>
          <Typography variant="body2" sx={{ color: 'base.100', maxWidth: '58ch' }}>
            Three vertical panels use one shared image to compare less Delta outflow, current
            operations, and more Delta outflow.
          </Typography>
        </Stack>
      }
    />
  )
}
