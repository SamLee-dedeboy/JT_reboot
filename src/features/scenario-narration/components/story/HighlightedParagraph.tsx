import { Box } from '@mui/material'
import type { ReactNode } from 'react'
import { scenarioName } from '@/content/names'

const paragraphHighlights = [
  'the land to sink',
  'If a levee fails, water can rapidly flood the deeply subsided island.',
  'water salinity intrudes',
  'restoring watersheds',
  'multi-benefit',
  'within the Delta',
  'its much larger watershed',
] as const

const primaryBlueBoldHighlights = [
  'Eco Machine adds tens of thousands of acres of tidal wetland in Suisun Marsh and Franks Tract',
  'New Green Watershed delivers the largest gains of any scenario for the Delta’s ecosystem',
  'Those benefits depend on converting farmland.',
  "The shape of the Delta's landscapes and waterways",
  'tidal wetlands within the Delta',
  'Eco Machine explores restoration on Suisun Marsh and Franks Tract',
  'tidal energy',
  'this large open-water area is a primary source of salinity intrusion',
  'Transitional areas vary from subtidal to supratidal elevations.',
  'more room to move',
  'New Green Watershed does not envision one land use covering the entire Delta.',
  'a moderate cut in flood risk',
  'drinking-water conditions for vulnerable communities hold steady',
  'little changes for habitat, species, recreation, or eco-cultural values',
  'water in Franks Tract at times grows much older',
  'targeted infrastructure improvements',
  'During drought, these gates could limit saltwater movement',
  'These improvements could reduce the risk of levee failure and help maintain a reliable connection',
  'existing reservoirs are operated',
  'whether more flexible releases can keep the long-term reliability that reservoirs provide',
  'the timing and amount',
  'a specific reservoir as an example',
  'some Sacramento River water would be diverted into an underground tunnel',
  'A roughly 45-mile underground tunnel would transport diverted water south',
] as const

const primaryBlueHighlights = [
  'By building a set of landforms within the Tract, salty water would be mostly blocked from entering further into the Delta.',
] as const

const tieredOutflowsEmphasis = [
  'Sacramento',
  'San Joaquin Rivers',
  'pushes saltwater',
  'farther toward the ocean',
  'through reductions in exports',
  'Changing how much water flows through the Delta involves difficult trade-offs between competing water needs.',
  'seasonal timing',
  'critical factor for outcomes. Two of our other project scenarios',
] as const

const tieredOutflowsAccents = [scenarioName('tunnel'), scenarioName('cor')]

/** A narrative paragraph with its key phrases set in the accent colors. */
export default function HighlightedParagraph({
  text,
  tieredOutflows = false,
  boldPrimaryBlue = false,
}: {
  text: string
  tieredOutflows?: boolean
  boldPrimaryBlue?: boolean
}) {
  const parts: ReactNode[] = []
  let cursor = 0
  const contextualPrimaryBlueBoldHighlights = text.startsWith(
    'Calling on Reserves changes how existing reservoirs are operated',
  )
    ? [scenarioName('cor')]
    : []

  while (cursor < text.length) {
    const nextHighlight = [
      ...contextualPrimaryBlueBoldHighlights.map((phrase) => ({
        phrase,
        treatment: 'primaryBlueBold' as const,
      })),
      ...primaryBlueBoldHighlights.map((phrase) => ({
        phrase,
        treatment: 'primaryBlueBold' as const,
      })),
      ...primaryBlueHighlights.map((phrase) => ({
        phrase,
        treatment: 'primaryBlue' as const,
      })),
      ...paragraphHighlights.map((phrase) => ({
        phrase,
        treatment: boldPrimaryBlue ? ('primaryBlueBold' as const) : ('secondary' as const),
      })),
      ...(tieredOutflows
        ? tieredOutflowsEmphasis.map((phrase) => ({ phrase, treatment: 'emphasis' as const }))
        : []),
      ...(tieredOutflows
        ? tieredOutflowsAccents.map((phrase) => ({ phrase, treatment: 'accent' as const }))
        : []),
    ]
      .map((highlight) => ({
        ...highlight,
        index: text.indexOf(highlight.phrase, cursor),
      }))
      .filter(({ index }) => index >= 0)
      .sort((a, b) => a.index - b.index)[0]

    if (!nextHighlight) {
      parts.push(text.slice(cursor))
      break
    }

    if (nextHighlight.index > cursor) {
      parts.push(text.slice(cursor, nextHighlight.index))
    }

    if (nextHighlight.treatment === 'emphasis' || nextHighlight.treatment === 'primaryBlueBold') {
      parts.push(
        <Box
          component="strong"
          key={`${nextHighlight.phrase}-${nextHighlight.index}`}
          sx={{ color: 'secondary.main' }}
        >
          {nextHighlight.phrase}
        </Box>,
      )
    } else {
      parts.push(
        <Box
          component="span"
          key={`${nextHighlight.phrase}-${nextHighlight.index}`}
          sx={{
            color: nextHighlight.treatment === 'accent' ? 'primary.main' : 'secondary.main',
          }}
        >
          {nextHighlight.phrase}
        </Box>,
      )
    }
    cursor = nextHighlight.index + nextHighlight.phrase.length
  }

  return <>{parts}</>
}
