// Copy for the upstream habitat restoration page, condensed from a Bay-Delta Science
// Conference talk (September 29, 2026) and the NGW Upland Restoration Scenario Outcomes
// workbook (v4).
import type { Landscape, WatershedOutcomeMetric } from './types'

export const hero = {
  eyebrow: 'New Green Watershed',
  title: 'Upstream habitat restoration',
  summary:
    'How could large-scale upstream restoration of the Delta affect water, carbon storage, and land cover across montane forests, wet meadows, and floodplains?',
}

export const involve = [
  'New Green Watershed pairs restoration inside the Delta with restoration in the upstream watershed. Upstream habitat restoration focuses on three landscapes: montane forests, wet meadows, and floodplains.',
  'Each landscape is measured against how much of it exists upstream of the Delta today and how much could be restored. The benefits are followed across five types: hydrology, ecology, eco-cultural, carbon and water quality.',
]

export const estimationIntro =
  'The aim is not to predict what a given restoration will do. It is to find defensible per-acre estimates of restoration outcomes that can be applied across the scenarios.'

export const estimationSteps: Array<{ title: string; body: string }> = [
  {
    title: 'Review the literature',
    body: 'Key conceptual and quantitative papers on the benefits of restoring each landscape.',
  },
  {
    title: 'Build per-acre metrics',
    body: 'Measurements were compared across papers to set an area-based metric for each benefit. Each range runs from the low to the high end of the reviewed results.',
  },
  {
    title: 'Interview with experts',
    body: 'Researchers and practitioners reviewed and informed the metrics in expert forums.',
  },
  {
    title: 'Apply to the scenarios',
    body: 'Each per-acre metric is multiplied by the acres a scenario restores, giving a low and a high estimate for restoration at scale.',
  },
]

export interface LandscapeMethod {
  id: Landscape
  label: string
  summary: string
  spec: Array<{ label: string; value: string }>
  metrics: Array<{ benefit: string; range: string; average?: string }>
  caveat?: string
  metricNote?: string
}

export const landscapeMethods: LandscapeMethod[] = [
  {
    id: 'forests',
    label: 'Forests',
    summary:
      'Forest restoration thins dense stands and brings fire back to the landscape. Thinner forests use less water, so more of it runs off downstream.',
    spec: [
      {
        label: 'Restoration strategies',
        value:
          'Hand and mechanical thinning; prescribed burning, cultural burning and managed wildfire',
      },
      {
        label: 'Measured',
        value: 'Evapotranspiration, runoff, forest cover, wildfire carbon emissions',
      },
      {
        label: 'Described, not measured',
        value: 'Snowpack, wildlife habitat, eco-cultural restoration, water quality risk',
      },
    ],
    metrics: [
      {
        benefit: 'Decreased evapotranspiration',
        range: '0.47–0.57 acre-feet per acre per year',
        average: '0.54',
      },
      {
        benefit: 'Increased runoff, North-Central',
        range: '0.16–0.45 acre-feet per acre per year',
      },
      { benefit: 'Increased runoff, South', range: '0–0.16 acre-feet per acre per year' },
      { benefit: 'Decrease in forest density', range: '25–50% basal area reduction' },
      { benefit: 'Forest cover change', range: '22–24% decrease over 50 years' },
      { benefit: 'Reduced wildfire carbon emissions', range: '630–3,810 g/m²', average: '1,717' },
    ],
    caveat:
      'Effects on snowpack vary with treatment type, climate, topography and the vegetation already there.',
    metricNote:
      'Basal area is the combined cross-sectional area of tree trunks at breast height within a unit of land. Researchers use it to measure forest density.',
  },
  {
    id: 'meadows',
    label: 'Meadows',
    summary:
      'Meadow restoration reconnects streams to their meadows, raising groundwater and spreading wetland cover. Restored meadows use more water, not less.',
    spec: [
      {
        label: 'Restoration strategies',
        value:
          'Pond-and-plug restoration; beaver dam analogs and low-tech process-based restoration',
      },
      {
        label: 'Measured',
        value:
          'Groundwater elevation, evapotranspiration, flood peak, wetland cover, carbon storage',
      },
      {
        label: 'Described, not measured',
        value:
          'Wildlife habitat, fire resistance, sediment capture, temperature, pollutant removal, eco-cultural restoration',
      },
    ],
    metrics: [
      { benefit: 'Increased groundwater elevation', range: '0.14–0.40 m', average: '0.27 m' },
      {
        benefit: 'Increased evapotranspiration',
        range: '0.43–0.68 acre-feet per acre per year',
      },
      { benefit: 'Flood peak reduction', range: '10–25%', average: '17%' },
      { benefit: 'Increased wetland cover', range: '16.65% → 35.73% of meadow', average: '+215%' },
      { benefit: 'Carbon storage', range: '330.4–998.8 g/m²/year', average: '632.85' },
    ],
    caveat: 'Studies show no clear consensus on how meadow restoration changes streamflow volume.',
  },
  {
    id: 'floodplains',
    label: 'Floodplains',
    summary:
      'Floodplain restoration sets back, breaches or removes levees so rivers can spread out again, recharging groundwater and growing riparian and marsh habitat.',
    spec: [
      {
        label: 'Restoration strategies',
        value: 'Levee setbacks, breaches and removal; riparian restoration',
      },
      {
        label: 'Measured',
        value:
          'Groundwater recharge, irrigation demand, riparian and marsh cover, soil and vegetation carbon',
      },
      {
        label: 'Described, not measured',
        value:
          'Flood risk reduction, ecosystem productivity, pollutant removal, eco-cultural restoration',
      },
    ],
    metrics: [
      {
        benefit: 'Increased groundwater recharge',
        range: '0.0633–0.215 acre-feet per acre per day inundated',
        average: '0.139',
      },
      {
        benefit: 'Reduced irrigation demand',
        range: '0.687 acre-feet per acre per year',
      },
      { benefit: 'Riparian habitat', range: '+59%' },
      { benefit: 'Wetland and marsh habitat', range: '+10%' },
      { benefit: 'Soil carbon storage', range: '87–100 g/m²/year', average: '93.5' },
      {
        benefit: 'Vegetation carbon storage',
        range: '6,800–27,930 g/m² at maturity',
        average: '17,176',
      },
    ],
    metricNote:
      '“Per day inundated” means the groundwater-recharge rate applies only on days when the floodplain is covered by water, not throughout the year.',
  },
]

export const scenariosIntro =
  'The nine scenarios come from a three-by-three matrix. The vertical axis sets how much is restored, from minimal to maximum. The horizontal axis sets which landscape restoration puts first: forests, meadows, or floodplains.'

export const scenarioReadingExample = {
  title: 'How to read one scenario',
  paragraphs: [
    'The white square is 100% of each landscape’s restorable area today.',
    'Minimal restoration prioritizing forests treats 12% of the available forest area, 10% of existing meadow area, and adds floodplain habitat equal to 10% of today’s restoration opportunity. That represents about 1.4 million forest acres, 11,600 meadow acres and 6,360 floodplain acres.',
    'The other eight scenarios use the same three measures with different restoration levels and priorities.',
  ],
}

export interface OutcomeGroup {
  id: string
  title: string
  takeaways: string[]
  metrics: Array<{ metric: WatershedOutcomeMetric; label: string }>
}

export const outcomeGroups: OutcomeGroup[] = [
  {
    id: 'water',
    title: 'Water',
    takeaways: [
      'Less evapotranspiration in thinned forests turns into more runoff.',
      'Floodplain restoration opens up opportunities for groundwater recharge.',
      'Wide ranges reflect uncertainty and differences in geography and climate.',
    ],
    metrics: [
      { metric: 'et', label: 'Change in evapotranspiration' },
      { metric: 'runoff', label: 'Change in runoff' },
      { metric: 'gwRecharge', label: 'Change in groundwater recharge' },
    ],
  },
  {
    id: 'carbon',
    title: 'Carbon',
    takeaways: [
      'Scenarios that prioritize floodplains add the most annual and vegetation carbon storage.',
      'Meadows, though small in area, store significant soil carbon.',
      'Scenarios that prioritize forests help stabilize forest carbon.',
    ],
    metrics: [
      { metric: 'carbonAnnual', label: 'Carbon storage, annual' },
      { metric: 'carbonVegetation', label: 'Vegetation carbon at maturity' },
    ],
  },
]

export const landCoverTakeaways = [
  'Restoration dramatically expands rare meadow, marsh and riparian habitat.',
  'The modeled decrease in forest cover represents deliberate thinning and managed fire over 50 years, not unplanned habitat loss.',
]

export const qualitativeIntro =
  'Some benefits are described in the literature but not yet measured per acre, so they are not counted in the scenario totals.'

export const qualitativeBenefits = {
  columns: ['Landscape', 'Hydrology and water quality', 'Ecology'],
  rows: [
    {
      landscape: 'forests',
      hydrology: 'Snowpack; reduced water quality risk',
      ecology: 'Wildlife habitat',
    },
    {
      landscape: 'meadows',
      hydrology: 'Sediment capture; change in temperature; pollutant removal',
      ecology: 'Wildlife habitat; wildfire resistance',
    },
    {
      landscape: 'floodplains',
      hydrology: 'Flood risk reduction; pollutant removal',
      ecology: 'Ecosystem productivity',
    },
  ] satisfies Array<{ landscape: Landscape; hydrology: string; ecology: string }>,
  ecoCultural:
    'In every landscape: more opportunities for cultural practice and transmission, applying Indigenous traditional ecological knowledge and reciprocal land stewardship.',
}

export const uncertainties = [
  {
    title: 'Climate variability',
    body: 'How will climate change affect the links between forest restoration, snowpack, evapotranspiration and runoff?',
  },
  {
    title: 'Meadow hydrology',
    body: 'What are the long-term effects of meadow restoration on meadow hydrology, including the timing and volume of streamflow?',
  },
  {
    title: 'Flood attenuation',
    body: 'How do the local benefits of levee setbacks scale up to watershed-level flood risk, especially in the Delta?',
  },
]

export const sources = [
  'Forest area: published forest-area research (2020); Sierra Nevada Conservancy subregions; CAL FIRE California Multi-Source Vegetation Layer (WHRTYPE).',
  'Meadow area: UC Davis Center for Watershed Sciences, Sierra Nevada Multi-source Meadow Polygons Compilation v.2.',
  'Floodplain area: Central Valley Flood Protection Plan Conservation Strategy; CAL FIRE WHRTYPE.',
]
