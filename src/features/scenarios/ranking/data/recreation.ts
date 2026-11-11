// Recreation: everything the ranking shows for this criterion, in one place.
// Change a number or a sentence here and the By criterion table, its info cards, its
// maps and the By scenario rankings all follow. See ./types.ts for how to read it.
import type { Facet, Source, TeamData } from './types'

/** data: Ranking table workbook, Recreation tab, Nov 2026 */
const SOURCE_1: Source = {
  doc: 'data',
  where: 'Ranking table workbook, Recreation tab, Nov 2026',
  quote: 'Values the Recreation team entered in the ranking table sheet.',
}

/** data: RMA Salinity Scenarios Analyzed.xlsx · OVERALL · TOTAL RUN, WET SEASON and DRY SEASON SCORES; % EXCEEDANCES by scenario */
const SOURCE_2: Source = {
  doc: 'data',
  where:
    'RMA Salinity Scenarios Analyzed.xlsx · OVERALL · TOTAL RUN, WET SEASON and DRY SEASON SCORES; % EXCEEDANCES by scenario',
  quote:
    'Ranking / Scale: 5 greater than or equal to 5% less; 4 4% less; 3 3% less; 2 2% less; 1 1% less; 0 No change from baseline; -1 1% more than baseline; -2 2% more; -3 3% more; -4 4% more; -5 greater than or equal to 5% more',
}

/** data: RMA SLR Salinity Analyzed.xlsx · OVERALL · TOTAL RUN, WET SEASON and DRY SEASON SCORES; % EXCEEDANCES by scenario */
const SOURCE_3: Source = {
  doc: 'data',
  where:
    'RMA SLR Salinity Analyzed.xlsx · OVERALL · TOTAL RUN, WET SEASON and DRY SEASON SCORES; % EXCEEDANCES by scenario',
  quote:
    'Ranking / Scale: 5 greater than or equal to 5% less; … 0 No change from baseline; … -5 greater than or equal to 5% more',
}

/** data: RMA Temperature Scenarios Analyzed.xlsx · Overall · TOTAL RUN, WET SEASON and DRY SEASON SCORES; % EXCEEDANCES by scenario */
const SOURCE_4: Source = {
  doc: 'data',
  where:
    'RMA Temperature Scenarios Analyzed.xlsx · Overall · TOTAL RUN, WET SEASON and DRY SEASON SCORES; % EXCEEDANCES by scenario',
  quote:
    'Dry seasons drive dangerous threshold-crossing days for activities and recreation important species alike. Cold water, by contrast, applies only to day use (<18C) and crosses threshold days across four exceedance models during the wet seasons, Delta-wide at over 90% rates.',
}

/** data: RMA SLR Temperature Analyzed.xlsx · OVERALL · TOTAL RUN, WET SEASON and DRY SEASON SCORES; % EXCEEDANCES by scenario */
const SOURCE_5: Source = {
  doc: 'data',
  where:
    'RMA SLR Temperature Analyzed.xlsx · OVERALL · TOTAL RUN, WET SEASON and DRY SEASON SCORES; % EXCEEDANCES by scenario',
  quote:
    'Ranking / Scale: 5 greater than or equal to 5% less; … 0 No change from baseline; … -5 greater than or equal to 5% more',
}

/** data: Restoration Scenarios NGW and ECO.xlsx (Recreation, 26 Oct 2026) · Overall Restoration (Acres) */
const SOURCE_6: Source = {
  doc: 'data',
  where:
    'Restoration Scenarios NGW and ECO.xlsx (Recreation, 26 Oct 2026) · Overall Restoration (Acres)',
  quote:
    'NGW Total (Middle, 50%) 1,132,315: 41,720, 66,947, 283,904, 277,681, 462,063 … ECO Total (Only One Scenario) 43,100: 41,720, 1,380, NA, NA, NA … BAU — Existing Protected Areas (Current Inventory) 108,301: 18,139, 23,826, 56,014, 10,322',
}

/** slides: Restoration — Waterfowl & Shorebird Seasonal Wetland Deficits */
const SOURCE_7: Source = {
  doc: 'slides',
  where: 'Restoration — Waterfowl & Shorebird Seasonal Wetland Deficits',
  quote:
    'Shorebird Wetland Deficit 21,454; Waterfowl Wetland Deficit 21,336; NGW 0.25 MW 56,286 (+264%); NGW 0.5 MW 102,982 (+483%); NGW Full MW 248,815 (+1166%)',
}

/** data: Restoration Scenarios NGW and ECO.xlsx (Recreation, 26 Oct 2026) · Overall $ and Restoration ($) Combined */
const SOURCE_8: Source = {
  doc: 'data',
  where:
    'Restoration Scenarios NGW and ECO.xlsx (Recreation, 26 Oct 2026) · Overall $ and Restoration ($) Combined',
  quote:
    'AMENITY/RECREATION (SP Day Use & Boating) … BIODIVERSITY (Birding) … RECREATIONAL HUNTING (Waterfowl) … RECREATIONAL FISHING (Angling) … $/acre/yr (all islands): Recreational fishing 283.15, Amenity/recreation 372.49, Biodiversity 162.02, Recreational hunting 93.12',
}

/** data: Tiered Outflows Salinity Analyzed.xlsx · OVERALL (Recreation, 26 Oct 2026) · TOTAL RUN, WET SEASON and DRY SEASON SCORES; RUN 15/16/17 % EXCEEDANCES */
const SOURCE_9: Source = {
  doc: 'data',
  where:
    'Tiered Outflows Salinity Analyzed.xlsx · OVERALL (Recreation, 26 Oct 2026) · TOTAL RUN, WET SEASON and DRY SEASON SCORES; RUN 15/16/17 % EXCEEDANCES',
  quote:
    'Ranking / Scale: 5 greater than or equal to 5% less; … 0 No change from baseline; … -5 greater than or equal to 5% more',
}

/** ours: The mean of the activity scores on this run, place and period */
const SOURCE_10: Source = {
  doc: 'ours',
  where: 'The mean of the activity scores on this run, place and period',
  quote:
    'Recreation scores the row as the mean of its activities for the adaptation scenarios; the same rule applied to the outflow runs, which the team has not combined.',
}

/** data: Tiered Outflows Temperature Analyzed.xlsx · Overall (Recreation, 26 Oct 2026) · TOTAL RUN, WET SEASON and DRY SEASON SCORES; RUN 15/16/17 % EXCEEDANCES */
const SOURCE_11: Source = {
  doc: 'data',
  where:
    'Tiered Outflows Temperature Analyzed.xlsx · Overall (Recreation, 26 Oct 2026) · TOTAL RUN, WET SEASON and DRY SEASON SCORES; RUN 15/16/17 % EXCEEDANCES',
  quote:
    'Ranking / Scale: 5 greater than or equal to 5% less; … 0 No change from baseline; … -5 greater than or equal to 5% more',
}

const PLACES_delta_suisun_centralDelta_and2More: Facet[] = [
  { key: 'delta', label: 'Delta-wide' },
  { key: 'suisun', label: 'Suisun Marsh' },
  { key: 'centralDelta', label: 'Central Delta' },
  { key: 'northDelta', label: 'North Delta' },
  { key: 'southDelta', label: 'South Delta' },
]

const PERIODS_run_wet_dry: Facet[] = [
  { key: 'run', label: 'Whole period' },
  { key: 'wet', label: 'Wet season' },
  { key: 'dry', label: 'Dry season' },
]

const PERIODS_run_wet_dry_: Facet[] = [
  { key: 'run', label: 'Whole run · Oct 2020 – Jan 2022' },
  { key: 'wet', label: 'Wet season · Oct – Mar' },
  { key: 'dry', label: 'Dry season · Apr – Sep' },
]

export const RECREATION: TeamData = {
  team: 'recreation',
  seaLevelRiseStatus: 'loaded',
  text: {
    takeaways: [
      'Our main "recreation" score floats around zero, showing that, at a grand scale, no perceived changes would sway Delta recreation to happen less or more under salinity and temperature changes. However, because the score averages regional and seasonal differences, it acts as a muffling step.',
      'In reality, scores and metrics interact with each other and with regional thresholds, showing that **potential recreation displacement from one region to another** could happen based on days above our selected thresholds, which in turn would affect the mosaic of recreational access at different times for Delta regions.',
    ],
    caveats: [
      'Component scores: Salinity stress and Temperature stress score 0 for every adaptation scenario. Increased Delta outflow scores +1 for Salinity stress and 0 for Temperature stress. Habitat Restoration and Recreation Economy score +3 for ++Eco Machine++, +5 for ++New Green Watershed++, and 0 otherwise.',
      'Infrastructure impacts: Infrastructure impacts affect only ++Bolster & Fortify++ and ++A Tunnel++ because of their anticipated future changes, expanding on the caveat scores’ reasoning for Habitat Restoration based on infrastructural changes. Their scores, ++Bolster & Fortify++ (-1) and ++A Tunnel++ (-3), imply that for ++Bolster & Fortify++, the building of salinity gates surrounding Franks Tract would be detrimental to boaters, blocking access to waterways during dry periods to prevent salinity encroachment, while ++A Tunnel++ would impact recreation economies throughout Delta towns that depend on recreation and tourism and would also make certain areas inaccessible for extended periods of time.',
      'Restored acres: Restored acres for ++Eco Machine++ and ++New Green Watershed++ are positive (+) changes relative to ++Business as Usual++’s existing protected areas (current inventory, accessible and non-accessible: 108,301 acres). ++Eco Machine++’s +43,100 acres would bring the total to 151,401 acres; ++New Green Watershed++’s +458,948 acres, without upland restoration, to about 567,249 acres.',
      'Sea level rise columns: The sea level rise columns reuse current-conditions acres and dollars, so restoration and economy weren’t re-modeled for sea level rise.',
    ],
    criterion: {
      metrics: [
        'Salinity stress',
        'Temperature stress',
        'Habitat Restoration ×2',
        'Recreation Economy',
        'Infrastructure Impact',
      ],
      combine:
        'The mean of the five listed metrics, with **Habitat Restoration counted twice**, rounded to a whole point. The same rule applies with sea level rise.',
    },
    periodWhy:
      'Visitation to state parks for day use and boating peaks in the summer season (April–September) when temperatures are highest and water-dependent activities are most in demand, whereas birding and waterfowl hunting at wildlife reserves peak in the winter (October–March) when migratory populations overwinter and when permits are issued for harvests. In the summer, boating depends directly on expected hydrological conditions, including those associated with fisheries, while land-based day use depends indirectly on hydrological conditions as they relate to scenery and near-riverine recreational activities. In the winter, access for birders is directly dependent on hydrological conditions, and waterfowl hunting is indirectly dependent, as permit systems set a take quota that is independent of expected hydrological conditions.',
    placeWhy:
      'Tidal geography, salinity, and regional hydrological differences influence Delta regions (Andrews et al., 2017), while roadways and regional attractions drive access to recreational opportunities throughout the Legal Delta (Delta Plan, 2013).',
    placeNames: { 'Delta-wide': 'All together' },
  },
  // The By criterion table's rows, top to bottom
  rows: {
    id: 'recreation',
    label: 'Recreation',
    level: 'team',
    provenance: 'reported',
    unit: 'score',
    betterHigher: true,
    note: 'The rounded mean of Salinity stress, Temperature stress, Habitat Restoration counted twice, Recreation Economy, and Infrastructure Impact. Habitat Restoration is the only double-weighted component. The same scores apply under sea level rise.',
    places: [{ key: '*', label: 'Not broken out' }],
    periods: [{ key: '*', label: 'Not broken out' }],
    sources: [SOURCE_1],
    seaLevelRise: {
      note: 'The Recreation team reports the same overall score under sea level rise.',
      sources: [SOURCE_1],
    },
    children: [
      {
        id: 'rec-salinity',
        label: 'Salinity stress',
        level: 'metric',
        edge: 'averages',
        provenance: 'reported',
        unit: 'score',
        betterHigher: true,
        note: 'The Recreation team scores Salinity stress 0 for every adaptation scenario. Increased Delta outflow scores +1. Open the row for the workbook’s background proportions and activity-level changes from Base, CalSim Base, or Historical Baseline.',
        places: [{ key: '*', label: 'Not broken out' }],
        periods: [{ key: '*', label: 'Not broken out' }],
        sources: [
          {
            doc: 'data',
            where: 'RMA Salinity Scenarios Analyzed.xlsx · OVERALL · Notes 2',
            quote:
              'Scenario rankings (-5 to 5 vs BAU) reflect that BAF is effectively the same as BAU, scoring at 0, except for one instance for Central Delta Day use (Total Run). Tunnel performs the worst, scoring -2 to -5 across both Suisun Marsh and the Central Delta, and is the only scenario that pushes Southern Delta boating and day uses over the threshold during wet seasons (84%) or greater than a -5 move on the charts. Calling on Reserves (COR) is the second worst scenario across Suisun and the Central Delta, but having one surprising movement of (+2) in the wet seasons.',
          },
          {
            doc: 'data',
            where:
              'Recreation The Score.xlsx (Recreation, 26 Oct 2026) · Recreation Score · table 4',
            quote: 'each A/B = average of activity scores in that region',
          },
        ],
        entityNoun: 'activity',
        seaLevelRise: {
          note: 'The Recreation team reports the same component score under sea level rise.',
          sources: [SOURCE_1],
        },
        info: {
          takeaway: {
            lead: 'Salinity generally affects recreation most **in the western regions (Suisun, Central Delta),** especially during the winter seasons, for four out of five activities. Angling thresholds are crossed more in summer under ++Business as Usual++ and shift to more salinity days in winter under sea-level-rise scenarios.',
          },
          measures: 'How often the water is too salty for each activity.',
          computed:
            'Each activity’s share of days over its salinity threshold, at 32 points in 4 regions.',
          scored:
            'Each 1-percentage-point decrease in days over the threshold from Business as Usual changes the score by +1; each 1-percentage-point increase changes it by −1, capped at ±5.',
          scale: { step: '%', axis: 'Days under stress vs Business as Usual', lowerBetter: true },
        },
        children: [
          {
            id: 'rec-salinity-dayUse',
            label: 'Day use',
            level: 'entity',
            edge: 'derives',
            provenance: 'reported',
            unit: 'share',
            betterHigher: false,
            note: 'Proportion of days whose daily mean crosses the salinity threshold (1,000 µS/cm, the lowest threshold), at 32 points in 4 regions, Oct 2018–Dec 2020. The score above is read from this. Calling on Reserves and A Tunnel come from CalSim runs, whose own Business as Usual differs from RMA’s, so their days compare with each other rather than with the Business as Usual column here.',
            places: PLACES_delta_suisun_centralDelta_and2More,
            periods: PERIODS_run_wet_dry,
            sources: [SOURCE_2],
            seaLevelRise: {
              note: 'With sea level rise, against the SLR run’s own Business as Usual: the same activities, regions and periods for every scenario. Calling on Reserves and A Tunnel are CalSim runs, scored against CalSim’s own Business as Usual with sea level rise.',
              sources: [SOURCE_3],
            },
          },
          {
            id: 'rec-salinity-boating',
            label: 'Boating',
            level: 'entity',
            edge: 'derives',
            provenance: 'reported',
            unit: 'share',
            betterHigher: false,
            note: 'Proportion of days whose daily mean crosses the salinity threshold (1,000 µS/cm, the lowest threshold), at 32 points in 4 regions, Oct 2018–Dec 2020. The score above is read from this. Calling on Reserves and A Tunnel come from CalSim runs, whose own Business as Usual differs from RMA’s, so their days compare with each other rather than with the Business as Usual column here.',
            places: PLACES_delta_suisun_centralDelta_and2More,
            periods: PERIODS_run_wet_dry,
            sources: [SOURCE_2],
            seaLevelRise: {
              note: 'With sea level rise, against the SLR run’s own Business as Usual: the same activities, regions and periods for every scenario. Calling on Reserves and A Tunnel are CalSim runs, scored against CalSim’s own Business as Usual with sea level rise.',
              sources: [SOURCE_3],
            },
          },
          {
            id: 'rec-salinity-birding',
            label: 'Birding',
            level: 'entity',
            edge: 'derives',
            provenance: 'reported',
            unit: 'share',
            betterHigher: false,
            note: 'Proportion of days whose daily mean crosses the salinity threshold (2,640 µS/cm raises avian botulism risk), at 32 points in 4 regions, Oct 2018–Dec 2020. The score above is read from this. Calling on Reserves and A Tunnel come from CalSim runs, whose own Business as Usual differs from RMA’s, so their days compare with each other rather than with the Business as Usual column here.',
            places: PLACES_delta_suisun_centralDelta_and2More,
            periods: PERIODS_run_wet_dry,
            sources: [SOURCE_2],
            seaLevelRise: {
              note: 'With sea level rise, against the SLR run’s own Business as Usual: the same activities, regions and periods for every scenario. Calling on Reserves and A Tunnel are CalSim runs, scored against CalSim’s own Business as Usual with sea level rise.',
              sources: [SOURCE_3],
            },
          },
          {
            id: 'rec-salinity-waterfowl',
            label: 'Waterfowl hunting',
            level: 'entity',
            edge: 'derives',
            provenance: 'reported',
            unit: 'share',
            betterHigher: false,
            note: 'Proportion of days whose daily mean crosses the salinity threshold (3,600 µS/cm for sub-lethal effects), at 32 points in 4 regions, Oct 2018–Dec 2020. The score above is read from this. Calling on Reserves and A Tunnel come from CalSim runs, whose own Business as Usual differs from RMA’s, so their days compare with each other rather than with the Business as Usual column here.',
            places: PLACES_delta_suisun_centralDelta_and2More,
            periods: PERIODS_run_wet_dry,
            sources: [SOURCE_2],
            seaLevelRise: {
              note: 'With sea level rise, against the SLR run’s own Business as Usual: the same activities, regions and periods for every scenario. Calling on Reserves and A Tunnel are CalSim runs, scored against CalSim’s own Business as Usual with sea level rise.',
              sources: [SOURCE_3],
            },
          },
          {
            id: 'rec-salinity-angling',
            label: 'Angling',
            level: 'entity',
            edge: 'derives',
            provenance: 'reported',
            unit: 'share',
            betterHigher: false,
            note: 'Proportion of days whose daily mean crosses the salinity threshold (9,130 µS/cm, the recreation fishery habitat threshold and the highest), at 32 points in 4 regions, Oct 2018–Dec 2020. The score above is read from this. Calling on Reserves and A Tunnel come from CalSim runs, whose own Business as Usual differs from RMA’s, so their days compare with each other rather than with the Business as Usual column here.',
            places: PLACES_delta_suisun_centralDelta_and2More,
            periods: PERIODS_run_wet_dry,
            sources: [SOURCE_2],
            seaLevelRise: {
              note: 'With sea level rise, against the SLR run’s own Business as Usual: the same activities, regions and periods for every scenario. Calling on Reserves and A Tunnel are CalSim runs, scored against CalSim’s own Business as Usual with sea level rise.',
              sources: [SOURCE_3],
            },
          },
        ],
      },
      {
        id: 'rec-temperature',
        label: 'Temperature stress',
        level: 'metric',
        edge: 'averages',
        provenance: 'reported',
        unit: 'score',
        betterHigher: true,
        note: 'The Recreation team scores Temperature stress 0 for every scenario. Open the row for the workbook’s background proportions and activity-level changes from Base, CalSim Base, or Historical Baseline.',
        places: [{ key: '*', label: 'Not broken out' }],
        periods: [{ key: '*', label: 'Not broken out' }],
        sources: [
          {
            doc: 'data',
            where: 'RMA Temperature Scenarios Analyzed.xlsx · Overall · Notes 2',
            quote:
              'RMA scenario -5 to 5 rankings show that all four models are evenly distributed across most breakdowns, Delta-wide and regional, with notable exceptions: ECO and NGW performing well in Suisun Marsh, with a 1% increase for Day use and Boating Total Run, and in dry seasons. Likewise, they showed positive moves for birding and angling during wet seasons. Negative moves of (-1%) during the dry season also appear in Suisun Marsh, making it the only region affected under the -5 to 5 scoring scenario, with both waterfowl and Angling performing worse than BAU.',
          },
        ],
        entityNoun: 'activity',
        seaLevelRise: {
          note: 'The Recreation team reports the same component score under sea level rise.',
          sources: [SOURCE_1],
        },
        info: {
          takeaway: {
            lead: '**Overall temperature differences are minimal across scenarios.**',
            details: [
              'The South Delta is the hottest for waterfowl (with about 41 to 44% threshold days crossed in summer compared to 10% in Suisun), while cold-water days that hinder Day Use are present nearly the whole winter season in the North Delta.',
            ],
          },
          measures:
            'How often the water is too warm (or, for cold-water use, too cold) for each activity.',
          computed:
            'Each activity’s share of days past its temperature threshold, at 32 points in 4 regions.',
          scored:
            'Each 1-percentage-point decrease in days past the threshold from Business as Usual changes the score by +1; each 1-percentage-point increase changes it by −1, capped at ±5.',
          scale: { step: '%', axis: 'Days under stress vs Business as Usual', lowerBetter: true },
        },
        children: [
          {
            id: 'rec-temperature-dayUse',
            label: 'Day use',
            level: 'entity',
            edge: 'derives',
            provenance: 'reported',
            unit: 'share',
            betterHigher: false,
            note: 'Proportion of days whose daily mean crosses the temperature threshold (19 °C eases harmful algal bloom expansion), at 32 points in 4 regions, Oct 2018–Dec 2020. The score above is read from this. Calling on Reserves and A Tunnel come from CalSim runs, whose own Business as Usual differs from RMA’s, so their days compare with each other rather than with the Business as Usual column here.',
            places: PLACES_delta_suisun_centralDelta_and2More,
            periods: PERIODS_run_wet_dry,
            sources: [SOURCE_4],
            seaLevelRise: {
              note: 'With sea level rise, against the SLR run’s own Business as Usual: the same activities, regions and periods for every scenario. Calling on Reserves and A Tunnel are CalSim runs, scored against CalSim’s own Business as Usual with sea level rise.',
              sources: [SOURCE_5],
            },
          },
          {
            id: 'rec-temperature-boating',
            label: 'Boating',
            level: 'entity',
            edge: 'derives',
            provenance: 'reported',
            unit: 'share',
            betterHigher: false,
            note: 'Proportion of days whose daily mean crosses the temperature threshold (19 °C eases harmful algal bloom expansion), at 32 points in 4 regions, Oct 2018–Dec 2020. The score above is read from this. Calling on Reserves and A Tunnel come from CalSim runs, whose own Business as Usual differs from RMA’s, so their days compare with each other rather than with the Business as Usual column here.',
            places: PLACES_delta_suisun_centralDelta_and2More,
            periods: PERIODS_run_wet_dry,
            sources: [SOURCE_4],
            seaLevelRise: {
              note: 'With sea level rise, against the SLR run’s own Business as Usual: the same activities, regions and periods for every scenario. Calling on Reserves and A Tunnel are CalSim runs, scored against CalSim’s own Business as Usual with sea level rise.',
              sources: [SOURCE_5],
            },
          },
          {
            id: 'rec-temperature-birding',
            label: 'Birding',
            level: 'entity',
            edge: 'derives',
            provenance: 'reported',
            unit: 'share',
            betterHigher: false,
            note: 'Proportion of days whose daily mean crosses the temperature threshold (20 °C for wetland bird species), at 32 points in 4 regions, Oct 2018–Dec 2020. The score above is read from this. Calling on Reserves and A Tunnel come from CalSim runs, whose own Business as Usual differs from RMA’s, so their days compare with each other rather than with the Business as Usual column here.',
            places: PLACES_delta_suisun_centralDelta_and2More,
            periods: PERIODS_run_wet_dry,
            sources: [SOURCE_4],
            seaLevelRise: {
              note: 'With sea level rise, against the SLR run’s own Business as Usual: the same activities, regions and periods for every scenario. Calling on Reserves and A Tunnel are CalSim runs, scored against CalSim’s own Business as Usual with sea level rise.',
              sources: [SOURCE_5],
            },
          },
          {
            id: 'rec-temperature-waterfowl',
            label: 'Waterfowl hunting',
            level: 'entity',
            edge: 'derives',
            provenance: 'reported',
            unit: 'share',
            betterHigher: false,
            note: 'Proportion of days whose daily mean crosses the temperature threshold (23 °C), at 32 points in 4 regions, Oct 2018–Dec 2020. The score above is read from this. Calling on Reserves and A Tunnel come from CalSim runs, whose own Business as Usual differs from RMA’s, so their days compare with each other rather than with the Business as Usual column here.',
            places: PLACES_delta_suisun_centralDelta_and2More,
            periods: PERIODS_run_wet_dry,
            sources: [SOURCE_4],
            seaLevelRise: {
              note: 'With sea level rise, against the SLR run’s own Business as Usual: the same activities, regions and periods for every scenario. Calling on Reserves and A Tunnel are CalSim runs, scored against CalSim’s own Business as Usual with sea level rise.',
              sources: [SOURCE_5],
            },
          },
          {
            id: 'rec-temperature-angling',
            label: 'Angling',
            level: 'entity',
            edge: 'derives',
            provenance: 'reported',
            unit: 'share',
            betterHigher: false,
            note: 'Proportion of days whose daily mean crosses the temperature threshold (18.42 °C), at 32 points in 4 regions, Oct 2018–Dec 2020. The score above is read from this. Calling on Reserves and A Tunnel come from CalSim runs, whose own Business as Usual differs from RMA’s, so their days compare with each other rather than with the Business as Usual column here.',
            places: PLACES_delta_suisun_centralDelta_and2More,
            periods: PERIODS_run_wet_dry,
            sources: [SOURCE_4],
            seaLevelRise: {
              note: 'With sea level rise, against the SLR run’s own Business as Usual: the same activities, regions and periods for every scenario. Calling on Reserves and A Tunnel are CalSim runs, scored against CalSim’s own Business as Usual with sea level rise.',
              sources: [SOURCE_5],
            },
          },
          {
            id: 'rec-temperature-dayUseCold',
            label: 'Cold-water day use',
            level: 'entity',
            edge: 'derives',
            provenance: 'reported',
            unit: 'share',
            betterHigher: false,
            note: 'Proportion of days whose daily mean crosses the temperature threshold (below 18 °C is too cold for day use), at 32 points in 4 regions, Oct 2018–Dec 2020. The score above is read from this. Calling on Reserves and A Tunnel come from CalSim runs, whose own Business as Usual differs from RMA’s, so their days compare with each other rather than with the Business as Usual column here.',
            places: PLACES_delta_suisun_centralDelta_and2More,
            periods: PERIODS_run_wet_dry,
            sources: [SOURCE_4],
            seaLevelRise: {
              note: 'With sea level rise, against the SLR run’s own Business as Usual: the same activities, regions and periods for every scenario. Calling on Reserves and A Tunnel are CalSim runs, scored against CalSim’s own Business as Usual with sea level rise.',
              sources: [SOURCE_5],
            },
          },
        ],
      },
      {
        id: 'rec-restoration',
        label: 'Habitat Restoration',
        level: 'metric',
        edge: 'beside',
        provenance: 'reported',
        unit: 'score',
        betterHigher: true,
        note: 'Recreation scores restored acres added on top of Business as Usual’s protected areas: Eco Machine +3 and New Green Watershed +5, with every other scenario at 0. Habitat Restoration receives twice the weight of the other components in the overall Recreation score. Open the row for the acres Recreation reports.',
        places: [{ key: '*', label: 'Not broken out' }],
        periods: [{ key: '*', label: 'Not broken out' }],
        notApplicableAt: { em: ['northDelta', 'southDelta'] },
        sources: [SOURCE_1, SOURCE_6, SOURCE_7],
        seaLevelRise: {
          note: 'The Recreation team reports the same value under sea level rise.',
          sources: [SOURCE_1],
        },
        info: {
          takeaway: {
            lead: 'Habitat restoration would create **net acreage benefits** for currently available Delta land inventories.',
            details: [
              'Increasing current protected area acres (108,301 acres) under ++Eco Machine++ (+43,100 acres) at Suisun and Franks Tract, and ++New Green Watershed++ (+458,948 acres) Delta-wide through transitional, managed wetlands and tidal areas.',
            ],
          },
          measures: 'How much land a scenario restores for recreation.',
          scored:
            'The Recreation criterion assigns a score from restored acres on the −5 to +5 scale. This component is counted twice in the overall Recreation score.',
        },
        children: [
          {
            id: 'rec-restoration-acres',
            label: 'Restored acres',
            level: 'entity',
            edge: 'measures',
            provenance: 'reported',
            unit: 'acres',
            betterHigher: true,
            note: 'Acres as the Recreation tab of Ranking Table Final_V2 gives them: New Green Watershed at its middle (50%) bound; Eco Machine (NA in the North and South Delta); Business as Usual as existing protected areas. The workbook’s All together values are retained as published rather than recalculated from its rounded regional rows. Every New Green Watershed version exceeds the CVJV 2020 deficits of 21,454 shorebird and 21,336 waterfowl acres, which is why Recreation favours it.',
            places: PLACES_delta_suisun_centralDelta_and2More,
            periods: [{ key: '*', label: 'Not broken out' }],
            notApplicableAt: { em: ['northDelta', 'southDelta'] },
            sources: [SOURCE_6, SOURCE_7],
            seaLevelRise: {
              note: 'The Recreation team reports the same value under sea level rise.',
              sources: [SOURCE_1],
            },
          },
        ],
      },
      {
        id: 'rec-economy',
        label: 'Recreation economy',
        level: 'metric',
        edge: 'beside',
        provenance: 'reported',
        unit: 'score',
        betterHigher: true,
        note: 'The yearly value of four recreation services on restored land, added on top of Business as Usual’s protected areas: Eco Machine +3 and New Green Watershed +5, with every other scenario at 0. Day use and boating share one amenity/recreation row. Open the row for each service’s dollars, by region for New Green Watershed and Delta-wide for Eco Machine.',
        places: [{ key: '*', label: 'Not broken out' }],
        periods: [{ key: '*', label: 'Not broken out' }],
        sources: [
          SOURCE_1,
          SOURCE_8,
          {
            doc: 'slides',
            where: 'Results — Visitor-sector Earnings by Water Year',
            quote:
              'Earnings by place of work (BEA Regional Economic Accounts): Arts, entertainment and recreation, & Accommodation and food services',
          },
        ],
        entityNoun: 'service',
        seaLevelRise: {
          note: 'The Recreation team reports the same value under sea level rise.',
          sources: [SOURCE_1],
        },
        info: {
          takeaway: {
            lead: 'The recreation economy is measured by **a conservative valuation of ecosystem services in dollars per acre per year,** encompassing the five activities.',
            details: [
              'In short, we calculate four ecosystem service scenarios for restored acres from the Ecology criterion (separate from the Habitat Restoration Metric), assigning monetary values to the following measures:',
            ],
            rows: [
              ['Recreational fishing', 'Angling'],
              ['Amenity', 'Day Use and Boating combined'],
              ['Biodiversity', 'Birding'],
              ['Recreational Hunting', 'Waterfowl Hunting'],
            ],
          },
          measures: 'The yearly value of recreation on restored land.',
          computed:
            'The value of four recreation services on restored land, with day use and boating sharing the amenity values, added on top of Business as Usual’s existing protected land.',
          scored:
            'Each 1% increase in annual value from Business as Usual changes the score by +1; each 1% decrease changes it by −1, capped at ±5.',
          scale: { step: '%', axis: 'Value vs Business as Usual' },
        },
        children: [
          {
            id: 'rec-economy-amenity',
            label: 'Day use and boating',
            level: 'entity',
            edge: 'refines',
            provenance: 'reported',
            unit: 'usdValue',
            betterHigher: true,
            note: 'Yearly value in 2025 dollars as Recreation’s “Overall $” sheet gives it: New Green Watershed at 50% restoration, Business as Usual as existing protected land. Eco Machine is Business as Usual plus what its restoration adds, Delta-wide only (“Recreation The Score.xlsx”, 26 Oct 2026). The score beside each value is the team’s, against Business as Usual: 1 point per 1% more value, capped at ±5. North Delta has no restoration at 50%, so the sheet carries its existing protected land and scores it 0.',
            places: PLACES_delta_suisun_centralDelta_and2More,
            periods: [{ key: '*', label: 'Not broken out' }],
            sources: [SOURCE_8],
            notApplicableAt: { em: ['northDelta', 'southDelta'] },
            seaLevelRise: {
              note: 'The Recreation team reports the same value under sea level rise.',
              sources: [SOURCE_1],
            },
          },
          {
            id: 'rec-economy-biodiversity',
            label: 'Birding',
            level: 'entity',
            edge: 'refines',
            provenance: 'reported',
            unit: 'usdValue',
            betterHigher: true,
            note: 'Yearly value in 2025 dollars as Recreation’s “Overall $” sheet gives it: New Green Watershed at 50% restoration, Business as Usual as existing protected land. Eco Machine is Business as Usual plus what its restoration adds, Delta-wide only (“Recreation The Score.xlsx”, 26 Oct 2026). The score beside each value is the team’s, against Business as Usual: 1 point per 1% more value, capped at ±5. North Delta has no restoration at 50%, so the sheet carries its existing protected land and scores it 0.',
            places: PLACES_delta_suisun_centralDelta_and2More,
            periods: [{ key: '*', label: 'Not broken out' }],
            sources: [SOURCE_8],
            notApplicableAt: { em: ['northDelta', 'southDelta'] },
            seaLevelRise: {
              note: 'The Recreation team reports the same value under sea level rise.',
              sources: [SOURCE_1],
            },
          },
          {
            id: 'rec-economy-hunting',
            label: 'Waterfowl hunting',
            level: 'entity',
            edge: 'refines',
            provenance: 'reported',
            unit: 'usdValue',
            betterHigher: true,
            note: 'Yearly value in 2025 dollars as Recreation’s “Overall $” sheet gives it: New Green Watershed at 50% restoration, Business as Usual as existing protected land. Eco Machine is Business as Usual plus what its restoration adds, Delta-wide only (“Recreation The Score.xlsx”, 26 Oct 2026). The score beside each value is the team’s, against Business as Usual: 1 point per 1% more value, capped at ±5. North Delta has no restoration at 50%, so the sheet carries its existing protected land and scores it 0.',
            places: PLACES_delta_suisun_centralDelta_and2More,
            periods: [{ key: '*', label: 'Not broken out' }],
            sources: [SOURCE_8],
            notApplicableAt: { em: ['northDelta', 'southDelta'] },
            seaLevelRise: {
              note: 'The Recreation team reports the same value under sea level rise.',
              sources: [SOURCE_1],
            },
          },
          {
            id: 'rec-economy-fishing',
            label: 'Angling',
            level: 'entity',
            edge: 'refines',
            provenance: 'reported',
            unit: 'usdValue',
            betterHigher: true,
            note: 'Yearly value in 2025 dollars as Recreation’s “Overall $” sheet gives it: New Green Watershed at 50% restoration, Business as Usual as existing protected land. Eco Machine is Business as Usual plus what its restoration adds, Delta-wide only (“Recreation The Score.xlsx”, 26 Oct 2026). The score beside each value is the team’s, against Business as Usual: 1 point per 1% more value, capped at ±5. North Delta has no restoration at 50%, so the sheet carries its existing protected land and scores it 0.',
            places: PLACES_delta_suisun_centralDelta_and2More,
            periods: [{ key: '*', label: 'Not broken out' }],
            sources: [SOURCE_8],
            notApplicableAt: { em: ['northDelta', 'southDelta'] },
            seaLevelRise: {
              note: 'The Recreation team reports the same value under sea level rise.',
              sources: [SOURCE_1],
            },
          },
        ],
      },
      {
        id: 'rec-infrastructure',
        label: 'Infrastructure impact',
        level: 'metric',
        edge: 'beside',
        provenance: 'reported',
        unit: 'score',
        betterHigher: true,
        note: 'The team’s judgement of anticipated infrastructure changes: salinity gates around Franks Tract would block boaters’ access during dry periods under Bolster & Fortify, and A Tunnel would affect Delta towns’ recreation economies and make some areas inaccessible for extended periods.',
        sources: [SOURCE_1],
        places: [{ key: '*', label: 'Not broken out' }],
        periods: [{ key: '*', label: 'Not broken out' }],
        seaLevelRise: {
          note: 'The Recreation team reports the same value under sea level rise.',
          sources: [SOURCE_1],
        },
        info: {
          measures: 'How a scenario’s built changes would affect recreation.',
          computed: 'A qualitative judgement for the Recreation criterion.',
          scored:
            'The Recreation criterion translates this qualitative judgement into the −5 to +5 scale.',
        },
        children: [
          {
            id: 'rec-infrastructure-descriptive',
            label: 'Descriptive change from Business as Usual',
            level: 'entity',
            edge: 'measures',
            provenance: 'unscored',
            unit: 'score',
            betterHigher: true,
            note: 'A judgement the team gives in steps rather than as a score.',
            places: [{ key: '*', label: 'Not broken out' }],
            periods: [{ key: '*', label: 'Not broken out' }],
            seaLevelRise: {
              note: 'The Recreation team reports the same value under sea level rise.',
              sources: [SOURCE_1],
            },
          },
        ],
      },
    ],
  },
  // The tiered outflow table's rows
  outflowRows: {
    id: 'recreation',
    label: 'Recreation',
    level: 'team',
    provenance: 'reported',
    unit: 'score',
    betterHigher: true,
    note: 'Recreation’s overall score for +30% outflow is 0. The team has not scored −10% outflow. The workbook supplies the background proportions against the Historical Baseline.',
    places: [{ key: '*', label: 'Not broken out' }],
    periods: [{ key: '*', label: 'Not broken out' }],
    forthcoming: false,
    forthcomingFor: ['less'],
    children: [
      {
        id: 'rec-salinity',
        label: 'Salinity thresholds',
        level: 'metric',
        edge: 'averages',
        provenance: 'inferred',
        unit: 'score',
        betterHigher: true,
        note: 'The Recreation team scores +30% outflow +1 for Salinity stress. Open the row for the workbook’s activity-level proportions and changes from Historical Baseline.',
        places: [{ key: '*', label: 'Not broken out' }],
        periods: [{ key: '*', label: 'Not broken out' }],
        entityNoun: 'activity',
        sources: [SOURCE_9, SOURCE_10],
        children: [
          {
            id: 'rec-salinity-dayUse',
            label: 'Day use',
            level: 'entity',
            edge: 'averages',
            provenance: 'reported',
            unit: 'share',
            betterHigher: false,
            note: 'Proportion of days over the activity’s salinity threshold at 19 points in 4 regions, with Recreation’s own score beside it: one point per percentage point against the Historical Baseline, ±5 at five or more.',
            places: PLACES_delta_suisun_centralDelta_and2More,
            periods: PERIODS_run_wet_dry_,
            sources: [SOURCE_9],
          },
          {
            id: 'rec-salinity-boating',
            label: 'Boating',
            level: 'entity',
            edge: 'averages',
            provenance: 'reported',
            unit: 'share',
            betterHigher: false,
            note: 'Proportion of days over the activity’s salinity threshold at 19 points in 4 regions, with Recreation’s own score beside it: one point per percentage point against the Historical Baseline, ±5 at five or more.',
            places: PLACES_delta_suisun_centralDelta_and2More,
            periods: PERIODS_run_wet_dry_,
            sources: [SOURCE_9],
          },
          {
            id: 'rec-salinity-birding',
            label: 'Birding',
            level: 'entity',
            edge: 'averages',
            provenance: 'reported',
            unit: 'share',
            betterHigher: false,
            note: 'Proportion of days over the activity’s salinity threshold at 19 points in 4 regions, with Recreation’s own score beside it: one point per percentage point against the Historical Baseline, ±5 at five or more.',
            places: PLACES_delta_suisun_centralDelta_and2More,
            periods: PERIODS_run_wet_dry_,
            sources: [SOURCE_9],
          },
          {
            id: 'rec-salinity-waterfowl',
            label: 'Waterfowl hunting',
            level: 'entity',
            edge: 'averages',
            provenance: 'reported',
            unit: 'share',
            betterHigher: false,
            note: 'Proportion of days over the activity’s salinity threshold at 19 points in 4 regions, with Recreation’s own score beside it: one point per percentage point against the Historical Baseline, ±5 at five or more.',
            places: PLACES_delta_suisun_centralDelta_and2More,
            periods: PERIODS_run_wet_dry_,
            sources: [SOURCE_9],
          },
          {
            id: 'rec-salinity-angling',
            label: 'Angling',
            level: 'entity',
            edge: 'averages',
            provenance: 'reported',
            unit: 'share',
            betterHigher: false,
            note: 'Proportion of days over the activity’s salinity threshold at 19 points in 4 regions, with Recreation’s own score beside it: one point per percentage point against the Historical Baseline, ±5 at five or more.',
            places: PLACES_delta_suisun_centralDelta_and2More,
            periods: PERIODS_run_wet_dry_,
            sources: [SOURCE_9],
          },
        ],
      },
      {
        id: 'rec-temperature',
        label: 'Temperature thresholds',
        level: 'metric',
        edge: 'averages',
        provenance: 'inferred',
        unit: 'score',
        betterHigher: true,
        note: 'The Recreation team scores +30% outflow 0 for Temperature stress. Open the row for the workbook’s activity-level proportions and changes from Historical Baseline.',
        places: [{ key: '*', label: 'Not broken out' }],
        periods: [{ key: '*', label: 'Not broken out' }],
        entityNoun: 'activity',
        sources: [SOURCE_11, SOURCE_10],
        children: [
          {
            id: 'rec-temperature-dayUse',
            label: 'Day use',
            level: 'entity',
            edge: 'averages',
            provenance: 'reported',
            unit: 'share',
            betterHigher: false,
            note: 'Proportion of days over the activity’s temperature threshold at 19 points in 4 regions, with Recreation’s own score beside it: one point per percentage point against the Historical Baseline, ±5 at five or more.',
            places: PLACES_delta_suisun_centralDelta_and2More,
            periods: PERIODS_run_wet_dry_,
            sources: [SOURCE_11],
          },
          {
            id: 'rec-temperature-boating',
            label: 'Boating',
            level: 'entity',
            edge: 'averages',
            provenance: 'reported',
            unit: 'share',
            betterHigher: false,
            note: 'Proportion of days over the activity’s temperature threshold at 19 points in 4 regions, with Recreation’s own score beside it: one point per percentage point against the Historical Baseline, ±5 at five or more.',
            places: PLACES_delta_suisun_centralDelta_and2More,
            periods: PERIODS_run_wet_dry_,
            sources: [SOURCE_11],
          },
          {
            id: 'rec-temperature-birding',
            label: 'Birding',
            level: 'entity',
            edge: 'averages',
            provenance: 'reported',
            unit: 'share',
            betterHigher: false,
            note: 'Proportion of days over the activity’s temperature threshold at 19 points in 4 regions, with Recreation’s own score beside it: one point per percentage point against the Historical Baseline, ±5 at five or more.',
            places: PLACES_delta_suisun_centralDelta_and2More,
            periods: PERIODS_run_wet_dry_,
            sources: [SOURCE_11],
          },
          {
            id: 'rec-temperature-waterfowl',
            label: 'Waterfowl hunting',
            level: 'entity',
            edge: 'averages',
            provenance: 'reported',
            unit: 'share',
            betterHigher: false,
            note: 'Proportion of days over the activity’s temperature threshold at 19 points in 4 regions, with Recreation’s own score beside it: one point per percentage point against the Historical Baseline, ±5 at five or more.',
            places: PLACES_delta_suisun_centralDelta_and2More,
            periods: PERIODS_run_wet_dry_,
            sources: [SOURCE_11],
          },
          {
            id: 'rec-temperature-angling',
            label: 'Angling',
            level: 'entity',
            edge: 'averages',
            provenance: 'reported',
            unit: 'share',
            betterHigher: false,
            note: 'Proportion of days over the activity’s temperature threshold at 19 points in 4 regions, with Recreation’s own score beside it: one point per percentage point against the Historical Baseline, ±5 at five or more.',
            places: PLACES_delta_suisun_centralDelta_and2More,
            periods: PERIODS_run_wet_dry_,
            sources: [SOURCE_11],
          },
          {
            id: 'rec-temperature-dayUseCold',
            label: 'Day use, cold water',
            level: 'entity',
            edge: 'averages',
            provenance: 'reported',
            unit: 'share',
            betterHigher: false,
            note: 'Proportion of days over the activity’s temperature threshold at 19 points in 4 regions, with Recreation’s own score beside it: one point per percentage point against the Historical Baseline, ±5 at five or more.',
            places: PLACES_delta_suisun_centralDelta_and2More,
            periods: PERIODS_run_wet_dry_,
            sources: [SOURCE_11],
          },
        ],
      },
      {
        id: 'rec-restoration',
        label: 'Habitat Restoration',
        level: 'metric',
        edge: 'averages',
        provenance: 'reported',
        unit: 'score',
        betterHigher: true,
        note: 'The outflow run restores no habitat.',
        places: [{ key: '*', label: 'Not broken out' }],
        periods: [{ key: '*', label: 'Not broken out' }],
        notApplicable: ['more', 'less', 'hist'],
      },
      {
        id: 'rec-economy',
        label: 'Recreation economy',
        level: 'metric',
        edge: 'averages',
        provenance: 'reported',
        unit: 'score',
        betterHigher: true,
        note: 'The outflow run creates no recreation economy on restored land.',
        places: [{ key: '*', label: 'Not broken out' }],
        periods: [{ key: '*', label: 'Not broken out' }],
        notApplicable: ['more', 'less', 'hist'],
      },
      {
        id: 'rec-infrastructure',
        label: 'Infrastructure impact',
        level: 'metric',
        edge: 'averages',
        provenance: 'reported',
        unit: 'score',
        betterHigher: true,
        note: 'The outflow run builds no infrastructure.',
        places: [{ key: '*', label: 'Not broken out' }],
        periods: [{ key: '*', label: 'Not broken out' }],
        notApplicable: ['more', 'less', 'hist'],
      },
    ],
  },
  // Today's sea level
  current: {
    // Business as Usual
    bau: {
      measures: {
        // Salinity stress › Day use (share of days, 0 to 1)
        'rec-salinity-dayUse': {
          delta: { run: 0.277, wet: 0.2792, dry: 0.2474 },
          suisun: { run: 0.801, wet: 0.8264, dry: 0.7421 },
          centralDelta: { run: 0.272, wet: 0.2578, dry: 0.2201 },
          northDelta: { run: 0, wet: 0, dry: 0 },
          southDelta: { run: 0, wet: 0.0003, dry: 0 },
        },

        // Salinity stress › Boating (share of days, 0 to 1)
        'rec-salinity-boating': {
          delta: { run: 0.277, wet: 0.2792, dry: 0.2474 },
          suisun: { run: 0.801, wet: 0.8264, dry: 0.7421 },
          centralDelta: { run: 0.272, wet: 0.2578, dry: 0.2201 },
          northDelta: { run: 0, wet: 0, dry: 0 },
          southDelta: { run: 0, wet: 0.0003, dry: 0 },
        },

        // Salinity stress › Birding (share of days, 0 to 1)
        'rec-salinity-birding': {
          delta: { run: 0.201, wet: 0.1974, dry: 0.1839 },
          suisun: { run: 0.685, wet: 0.6808, dry: 0.6352 },
          centralDelta: { run: 0.105, wet: 0.0968, dry: 0.0893 },
          northDelta: { run: 0, wet: 0, dry: 0 },
          southDelta: { run: 0, wet: 0, dry: 0 },
        },

        // Salinity stress › Waterfowl hunting (share of days, 0 to 1)
        'rec-salinity-waterfowl': {
          delta: { run: 0.181, wet: 0.174, dry: 0.1653 },
          suisun: { run: 0.627, wet: 0.6137, dry: 0.5779 },
          centralDelta: { run: 0.085, wet: 0.0731, dry: 0.0741 },
          northDelta: { run: 0, wet: 0, dry: 0 },
          southDelta: { run: 0, wet: 0, dry: 0 },
        },

        // Salinity stress › Angling (share of days, 0 to 1)
        'rec-salinity-angling': {
          delta: { run: 0.077, wet: 0.0583, dry: 0.0686 },
          suisun: { run: 0.285, wet: 0.2147, dry: 0.262 },
          centralDelta: { run: 0.022, wet: 0.0164, dry: 0.0109 },
          northDelta: { run: 0, wet: 0, dry: 0 },
          southDelta: { run: 0, wet: 0, dry: 0 },
        },

        // Temperature stress › Day use (share of days, 0 to 1)
        'rec-temperature-dayUse': {
          delta: { run: 0.4158, wet: 0.0307, dry: 0.7957 },
          suisun: { run: 0.4231, wet: 0.0461, dry: 0.7951 },
          centralDelta: { run: 0.4223, wet: 0.0277, dry: 0.8115 },
          northDelta: { run: 0.3913, wet: 0.0028, dry: 0.7746 },
          southDelta: { run: 0.4192, wet: 0.0388, dry: 0.7945 },
        },

        // Temperature stress › Boating (share of days, 0 to 1)
        'rec-temperature-boating': {
          delta: { run: 0.4158, wet: 0.0307, dry: 0.7957 },
          suisun: { run: 0.4231, wet: 0.0461, dry: 0.7951 },
          centralDelta: { run: 0.4223, wet: 0.0277, dry: 0.8115 },
          northDelta: { run: 0.3913, wet: 0.0028, dry: 0.7746 },
          southDelta: { run: 0.4192, wet: 0.0388, dry: 0.7945 },
        },

        // Temperature stress › Birding (share of days, 0 to 1)
        'rec-temperature-birding': {
          delta: { run: 0.3677, wet: 0.0054, dry: 0.7251 },
          suisun: { run: 0.368, wet: 0.0118, dry: 0.7193 },
          centralDelta: { run: 0.3775, wet: 0.0006, dry: 0.7492 },
          northDelta: { run: 0.3418, wet: 0, dry: 0.679 },
          southDelta: { run: 0.3749, wet: 0.008, dry: 0.7368 },
        },

        // Temperature stress › Waterfowl hunting (share of days, 0 to 1)
        'rec-temperature-waterfowl': {
          delta: { run: 0.1214, wet: 0, dry: 0.2411 },
          suisun: { run: 0.0506, wet: 0, dry: 0.1004 },
          centralDelta: { run: 0.1308, wet: 0, dry: 0.2599 },
          northDelta: { run: 0.0697, wet: 0, dry: 0.1384 },
          southDelta: { run: 0.2094, wet: 0, dry: 0.4159 },
        },

        // Temperature stress › Angling (share of days, 0 to 1)
        'rec-temperature-angling': {
          delta: { run: 0.4418, wet: 0.0493, dry: 0.8289 },
          suisun: { run: 0.4579, wet: 0.0765, dry: 0.834 },
          centralDelta: { run: 0.4478, wet: 0.0459, dry: 0.8443 },
          northDelta: { run: 0.4175, wet: 0.0078, dry: 0.8215 },
          southDelta: { run: 0.4377, wet: 0.0563, dry: 0.8139 },
        },

        // Temperature stress › Cold-water day use (share of days, 0 to 1)
        'rec-temperature-dayUseCold': {
          delta: { run: 0.5412, wet: 0.9343, dry: 0.1534 },
          suisun: { run: 0.5222, wet: 0.9062, dry: 0.1434 },
          centralDelta: { run: 0.5363, wet: 0.9363, dry: 0.1418 },
          northDelta: { run: 0.566, wet: 0.9866, dry: 0.1512 },
          southDelta: { run: 0.5464, wet: 0.9224, dry: 0.1755 },
        },

        // Habitat Restoration › Restored acres (acres)
        'rec-restoration-acres': {
          delta: { '*': 0 },
          suisun: { '*': 0 },
          centralDelta: { '*': 0 },
          northDelta: { '*': 0 },
          southDelta: { '*': 0 },
        },

        // Recreation economy › Day use and boating (dollars a year)
        'rec-economy-amenity': {
          delta: { '*': 0 },
          suisun: { '*': 0 },
          centralDelta: { '*': 0 },
          northDelta: { '*': 0 },
          southDelta: { '*': 0 },
        },

        // Recreation economy › Birding (dollars a year)
        'rec-economy-biodiversity': {
          delta: { '*': 0 },
          suisun: { '*': 0 },
          centralDelta: { '*': 0 },
          northDelta: { '*': 0 },
          southDelta: { '*': 0 },
        },

        // Recreation economy › Waterfowl hunting (dollars a year)
        'rec-economy-hunting': {
          delta: { '*': 0 },
          suisun: { '*': 0 },
          centralDelta: { '*': 0 },
          northDelta: { '*': 0 },
          southDelta: { '*': 0 },
        },

        // Recreation economy › Angling (dollars a year)
        'rec-economy-fishing': {
          delta: { '*': 0 },
          suisun: { '*': 0 },
          centralDelta: { '*': 0 },
          northDelta: { '*': 0 },
          southDelta: { '*': 0 },
        },
      },
      steps: {
        // Infrastructure impact › Descriptive change from Business as Usual (score)
        'rec-infrastructure-descriptive': 0,
      },
    },

    // Business as Usual (CalSim)
    csbau: {
      measures: {
        // Salinity stress › Day use (share of days, 0 to 1)
        'rec-salinity-dayUse': {
          delta: { run: 0.336, wet: 0.342, dry: 0.2942 },
          suisun: { run: 0.842, wet: 0.8418, dry: 0.8159 },
          centralDelta: { run: 0.424, wet: 0.4381, dry: 0.3209 },
          northDelta: { run: 0, wet: 0, dry: 0 },
          southDelta: { run: 0.021, wet: 0.0298, dry: 0 },
        },

        // Salinity stress › Boating (share of days, 0 to 1)
        'rec-salinity-boating': {
          delta: { run: 0.336, wet: 0.342, dry: 0.2942 },
          suisun: { run: 0.842, wet: 0.8418, dry: 0.8159 },
          centralDelta: { run: 0.424, wet: 0.4381, dry: 0.3209 },
          northDelta: { run: 0, wet: 0, dry: 0 },
          southDelta: { run: 0.021, wet: 0.0298, dry: 0 },
        },

        // Salinity stress › Birding (share of days, 0 to 1)
        'rec-salinity-birding': {
          delta: { run: 0.261, wet: 0.2595, dry: 0.2391 },
          suisun: { run: 0.769, wet: 0.7627, dry: 0.736 },
          centralDelta: { run: 0.246, wet: 0.2447, dry: 0.1958 },
          northDelta: { run: 0, wet: 0, dry: 0 },
          southDelta: { run: 0, wet: 0, dry: 0 },
        },

        // Salinity stress › Waterfowl hunting (share of days, 0 to 1)
        'rec-salinity-waterfowl': {
          delta: { run: 0.243, wet: 0.2432, dry: 0.2215 },
          suisun: { run: 0.74, wet: 0.739, dry: 0.6964 },
          centralDelta: { run: 0.206, wet: 0.2079, dry: 0.1685 },
          northDelta: { run: 0, wet: 0, dry: 0 },
          southDelta: { run: 0, wet: 0, dry: 0 },
        },

        // Salinity stress › Angling (share of days, 0 to 1)
        'rec-salinity-angling': {
          delta: { run: 0.158, wet: 0.147, dry: 0.144 },
          suisun: { run: 0.528, wet: 0.4921, dry: 0.4908 },
          centralDelta: { run: 0.092, wet: 0.0852, dry: 0.0756 },
          northDelta: { run: 0, wet: 0, dry: 0 },
          southDelta: { run: 0, wet: 0, dry: 0 },
        },

        // Temperature stress › Day use (share of days, 0 to 1)
        'rec-temperature-dayUse': {
          delta: { run: 0.4076, wet: 0.0345, dry: 0.7869 },
          suisun: { run: 0.4137, wet: 0.0488, dry: 0.79 },
          centralDelta: { run: 0.4121, wet: 0.0372, dry: 0.7848 },
          northDelta: { run: 0.3707, wet: 0.0074, dry: 0.7564 },
          southDelta: { run: 0.4222, wet: 0.0369, dry: 0.8066 },
        },

        // Temperature stress › Boating (share of days, 0 to 1)
        'rec-temperature-boating': {
          delta: { run: 0.4076, wet: 0.0345, dry: 0.7869 },
          suisun: { run: 0.4137, wet: 0.0488, dry: 0.79 },
          centralDelta: { run: 0.4121, wet: 0.0372, dry: 0.7848 },
          northDelta: { run: 0.3707, wet: 0.0074, dry: 0.7564 },
          southDelta: { run: 0.4222, wet: 0.0369, dry: 0.8066 },
        },

        // Temperature stress › Birding (share of days, 0 to 1)
        'rec-temperature-birding': {
          delta: { run: 0.3599, wet: 0.0068, dry: 0.7302 },
          suisun: { run: 0.3495, wet: 0.0121, dry: 0.7203 },
          centralDelta: { run: 0.371, wet: 0.0037, dry: 0.7465 },
          northDelta: { run: 0.3265, wet: 0, dry: 0.6849 },
          southDelta: { run: 0.3801, wet: 0.0098, dry: 0.7529 },
        },

        // Temperature stress › Waterfowl hunting (share of days, 0 to 1)
        'rec-temperature-waterfowl': {
          delta: { run: 0.1152, wet: 0, dry: 0.2462 },
          suisun: { run: 0.0475, wet: 0, dry: 0.1018 },
          centralDelta: { run: 0.1256, wet: 0, dry: 0.269 },
          northDelta: { run: 0.0748, wet: 0, dry: 0.1603 },
          southDelta: { run: 0.1918, wet: 0, dry: 0.4092 },
        },

        // Temperature stress › Angling (share of days, 0 to 1)
        'rec-temperature-angling': {
          delta: { run: 0.4328, wet: 0.0544, dry: 0.8119 },
          suisun: { run: 0.4464, wet: 0.0783, dry: 0.82 },
          centralDelta: { run: 0.4327, wet: 0.0554, dry: 0.8051 },
          northDelta: { run: 0.399, wet: 0.0152, dry: 0.7887 },
          southDelta: { run: 0.4433, wet: 0.0585, dry: 0.827 },
        },

        // Temperature stress › Cold-water day use (share of days, 0 to 1)
        'rec-temperature-dayUseCold': {
          delta: { run: 0.5471, wet: 0.9269, dry: 0.1669 },
          suisun: { run: 0.5313, wet: 0.9044, dry: 0.1527 },
          centralDelta: { run: 0.5424, wet: 0.9209, dry: 0.1661 },
          northDelta: { run: 0.5827, wet: 0.9728, dry: 0.1926 },
          southDelta: { run: 0.5422, wet: 0.9224, dry: 0.1633 },
        },
      },
    },

    // Eco Machine
    em: {
      takeaway: {
        lead: 'Eco Machine generally **moves salinity away from the Central Delta region (+1 to +3) and into Suisun Marsh (-2 to -5).**',
        points: [
          {
            label: 'Angling',
            text: 'This interaction raises our highest angling threshold (9,130 µS/cm), making Suisun saltier and affecting all activities in that region.',
          },
          {
            label: 'Temperature and sea level',
            text: 'Temperature changes are negligible, while sea-level rise increases the total days above threshold for all of our EC thresholds.',
          },
        ],
      },
      scores: {
        // Recreation (score)
        recreation: 2,

        // Salinity stress (score)
        'rec-salinity': 0,

        // Temperature stress (score)
        'rec-temperature': 0,

        // Habitat Restoration (score)
        'rec-restoration': 3,

        // Recreation economy (score)
        'rec-economy': 3,

        // Infrastructure impact (score)
        'rec-infrastructure': 0,
      },
      measures: {
        // Salinity stress › Day use (share of days, 0 to 1)
        'rec-salinity-dayUse': {
          delta: { run: 0.276, wet: 0.2801, dry: 0.2455 },
          suisun: { run: 0.823, wet: 0.8589, dry: 0.7579 },
          centralDelta: { run: 0.25, wet: 0.232, dry: 0.1991 },
          northDelta: { run: 0, wet: 0, dry: 0 },
          southDelta: { run: 0, wet: 0.0003, dry: 0 },
        },

        // Salinity stress › Boating (share of days, 0 to 1)
        'rec-salinity-boating': {
          delta: { run: 0.276, wet: 0.2801, dry: 0.2455 },
          suisun: { run: 0.823, wet: 0.8589, dry: 0.7579 },
          centralDelta: { run: 0.25, wet: 0.232, dry: 0.1991 },
          northDelta: { run: 0, wet: 0, dry: 0 },
          southDelta: { run: 0, wet: 0.0003, dry: 0 },
        },

        // Salinity stress › Birding (share of days, 0 to 1)
        'rec-salinity-birding': {
          delta: { run: 0.21, wet: 0.2127, dry: 0.1895 },
          suisun: { run: 0.732, wet: 0.7545, dry: 0.6643 },
          centralDelta: { run: 0.096, wet: 0.0855, dry: 0.0835 },
          northDelta: { run: 0, wet: 0, dry: 0 },
          southDelta: { run: 0, wet: 0, dry: 0 },
        },

        // Salinity stress › Waterfowl hunting (share of days, 0 to 1)
        'rec-salinity-waterfowl': {
          delta: { run: 0.191, wet: 0.1908, dry: 0.1697 },
          suisun: { run: 0.672, wet: 0.6849, dry: 0.6038 },
          centralDelta: { run: 0.08, wet: 0.0694, dry: 0.0665 },
          northDelta: { run: 0, wet: 0, dry: 0 },
          southDelta: { run: 0, wet: 0, dry: 0 },
        },

        // Salinity stress › Angling (share of days, 0 to 1)
        'rec-salinity-angling': {
          delta: { run: 0.097, wet: 0.085, dry: 0.0808 },
          suisun: { run: 0.368, wet: 0.3277, dry: 0.3125 },
          centralDelta: { run: 0.018, wet: 0.011, dry: 0.0094 },
          northDelta: { run: 0, wet: 0, dry: 0 },
          southDelta: { run: 0, wet: 0, dry: 0 },
        },

        // Temperature stress › Day use (share of days, 0 to 1)
        'rec-temperature-dayUse': {
          delta: { run: 0.4164, wet: 0.0296, dry: 0.798 },
          suisun: { run: 0.4242, wet: 0.0409, dry: 0.8023 },
          centralDelta: { run: 0.4232, wet: 0.0286, dry: 0.8124 },
          northDelta: { run: 0.3911, wet: 0.0028, dry: 0.7741 },
          southDelta: { run: 0.4197, wet: 0.0385, dry: 0.7957 },
        },

        // Temperature stress › Boating (share of days, 0 to 1)
        'rec-temperature-boating': {
          delta: { run: 0.4164, wet: 0.0296, dry: 0.798 },
          suisun: { run: 0.4242, wet: 0.0409, dry: 0.8023 },
          centralDelta: { run: 0.4232, wet: 0.0286, dry: 0.8124 },
          northDelta: { run: 0.3911, wet: 0.0028, dry: 0.7741 },
          southDelta: { run: 0.4197, wet: 0.0385, dry: 0.7957 },
        },

        // Temperature stress › Birding (share of days, 0 to 1)
        'rec-temperature-birding': {
          delta: { run: 0.3673, wet: 0.0041, dry: 0.7255 },
          suisun: { run: 0.3673, wet: 0.0062, dry: 0.7234 },
          centralDelta: { run: 0.378, wet: 0.0015, dry: 0.7492 },
          northDelta: { run: 0.3418, wet: 0, dry: 0.679 },
          southDelta: { run: 0.3735, wet: 0.0074, dry: 0.7347 },
        },

        // Temperature stress › Waterfowl hunting (share of days, 0 to 1)
        'rec-temperature-waterfowl': {
          delta: { run: 0.1226, wet: 0, dry: 0.2435 },
          suisun: { run: 0.0554, wet: 0, dry: 0.11 },
          centralDelta: { run: 0.1327, wet: 0, dry: 0.2635 },
          northDelta: { run: 0.069, wet: 0, dry: 0.1371 },
          southDelta: { run: 0.208, wet: 0, dry: 0.4132 },
        },

        // Temperature stress › Angling (share of days, 0 to 1)
        'rec-temperature-angling': {
          delta: { run: 0.442, wet: 0.0477, dry: 0.8309 },
          suisun: { run: 0.458, wet: 0.0672, dry: 0.8436 },
          centralDelta: { run: 0.4483, wet: 0.048, dry: 0.843 },
          northDelta: { run: 0.417, wet: 0.0074, dry: 0.821 },
          southDelta: { run: 0.4382, wet: 0.0569, dry: 0.8142 },
        },

        // Temperature stress › Cold-water day use (share of days, 0 to 1)
        'rec-temperature-dayUseCold': {
          delta: { run: 0.5397, wet: 0.9343, dry: 0.1505 },
          suisun: { run: 0.5169, wet: 0.9082, dry: 0.1308 },
          centralDelta: { run: 0.5355, wet: 0.9347, dry: 0.1418 },
          northDelta: { run: 0.566, wet: 0.9866, dry: 0.1512 },
          southDelta: { run: 0.5467, wet: 0.9221, dry: 0.1764 },
        },

        // Habitat Restoration › Restored acres (acres)
        'rec-restoration-acres': {
          delta: { '*': 43100 },
          suisun: { '*': 41720 },
          centralDelta: { '*': 1380 },
        },

        // Recreation economy › Day use and boating (dollars a year)
        'rec-economy-amenity': {
          delta: { '*': 16127000 },
          suisun: { '*': 15613000 },
          centralDelta: { '*': 514000 },
          northDelta: { '*': 0 },
          southDelta: { '*': 0 },
        },

        // Recreation economy › Birding (dollars a year)
        'rec-economy-biodiversity': {
          delta: { '*': 6363000 },
          suisun: { '*': 6139000 },
          centralDelta: { '*': 224000 },
          northDelta: { '*': 0 },
          southDelta: { '*': 0 },
        },

        // Recreation economy › Waterfowl hunting (dollars a year)
        'rec-economy-hunting': {
          delta: { '*': 4851000 },
          suisun: { '*': 3903000 },
          centralDelta: { '*': 948000 },
          northDelta: { '*': 0 },
          southDelta: { '*': 0 },
        },

        // Recreation economy › Angling (dollars a year)
        'rec-economy-fishing': {
          delta: { '*': 12259000 },
          suisun: { '*': 11868000 },
          centralDelta: { '*': 391000 },
          northDelta: { '*': 0 },
          southDelta: { '*': 0 },
        },
      },
      steps: {
        // Infrastructure impact › Descriptive change from Business as Usual (score)
        'rec-infrastructure-descriptive': 0,
      },
    },

    // New Green Watershed
    ngw: {
      takeaway: {
        lead: 'New Green Watershed is **practically identical to Eco Machine,** with slightly more negative losses for summer-season birding at Suisun (slightly more threshold days crossed).',
        points: [
          {
            label: 'Sea level rise',
            text: 'Under Sea-level rise, EC eases in Suisun, and birding conditions are better (fewer threshold days crossed) in the Central Delta.',
          },
          {
            label: 'Temperature',
            text: 'No major discernible differences emerge across temperature scenarios under New Green Watershed.',
          },
        ],
      },
      scores: {
        // Recreation (score)
        recreation: 3,

        // Salinity stress (score)
        'rec-salinity': 0,

        // Temperature stress (score)
        'rec-temperature': 0,

        // Habitat Restoration (score)
        'rec-restoration': 5,

        // Recreation economy (score)
        'rec-economy': 5,

        // Infrastructure impact (score)
        'rec-infrastructure': 0,
      },
      measures: {
        // Salinity stress › Day use (share of days, 0 to 1)
        'rec-salinity-dayUse': {
          delta: { run: 0.276, wet: 0.2801, dry: 0.2461 },
          suisun: { run: 0.823, wet: 0.8582, dry: 0.7582 },
          centralDelta: { run: 0.251, wet: 0.2326, dry: 0.201 },
          northDelta: { run: 0, wet: 0, dry: 0 },
          southDelta: { run: 0, wet: 0.0003, dry: 0 },
        },

        // Salinity stress › Boating (share of days, 0 to 1)
        'rec-salinity-boating': {
          delta: { run: 0.276, wet: 0.2801, dry: 0.2461 },
          suisun: { run: 0.823, wet: 0.8582, dry: 0.7582 },
          centralDelta: { run: 0.251, wet: 0.2326, dry: 0.201 },
          northDelta: { run: 0, wet: 0, dry: 0 },
          southDelta: { run: 0, wet: 0.0003, dry: 0 },
        },

        // Salinity stress › Birding (share of days, 0 to 1)
        'rec-salinity-birding': {
          delta: { run: 0.21, wet: 0.2119, dry: 0.1898 },
          suisun: { run: 0.731, wet: 0.7521, dry: 0.6653 },
          centralDelta: { run: 0.096, wet: 0.0849, dry: 0.0835 },
          northDelta: { run: 0, wet: 0, dry: 0 },
          southDelta: { run: 0, wet: 0, dry: 0 },
        },

        // Salinity stress › Waterfowl hunting (share of days, 0 to 1)
        'rec-salinity-waterfowl': {
          delta: { run: 0.191, wet: 0.1904, dry: 0.1703 },
          suisun: { run: 0.672, wet: 0.6842, dry: 0.6048 },
          centralDelta: { run: 0.08, wet: 0.0688, dry: 0.0677 },
          northDelta: { run: 0, wet: 0, dry: 0 },
          southDelta: { run: 0, wet: 0, dry: 0 },
        },

        // Salinity stress › Angling (share of days, 0 to 1)
        'rec-salinity-angling': {
          delta: { run: 0.097, wet: 0.0845, dry: 0.0818 },
          suisun: { run: 0.369, wet: 0.3257, dry: 0.3159 },
          centralDelta: { run: 0.018, wet: 0.011, dry: 0.01 },
          northDelta: { run: 0, wet: 0, dry: 0 },
          southDelta: { run: 0, wet: 0, dry: 0 },
        },

        // Temperature stress › Day use (share of days, 0 to 1)
        'rec-temperature-dayUse': {
          delta: { run: 0.4164, wet: 0.0297, dry: 0.7978 },
          suisun: { run: 0.4243, wet: 0.0409, dry: 0.8026 },
          centralDelta: { run: 0.4229, wet: 0.0286, dry: 0.8118 },
          northDelta: { run: 0.3909, wet: 0.0028, dry: 0.7737 },
          southDelta: { run: 0.4198, wet: 0.0388, dry: 0.7957 },
        },

        // Temperature stress › Boating (share of days, 0 to 1)
        'rec-temperature-boating': {
          delta: { run: 0.4164, wet: 0.0297, dry: 0.7978 },
          suisun: { run: 0.4243, wet: 0.0409, dry: 0.8026 },
          centralDelta: { run: 0.4229, wet: 0.0286, dry: 0.8118 },
          northDelta: { run: 0.3909, wet: 0.0028, dry: 0.7737 },
          southDelta: { run: 0.4198, wet: 0.0388, dry: 0.7957 },
        },

        // Temperature stress › Birding (share of days, 0 to 1)
        'rec-temperature-birding': {
          delta: { run: 0.367, wet: 0.0039, dry: 0.7252 },
          suisun: { run: 0.3673, wet: 0.0062, dry: 0.7234 },
          centralDelta: { run: 0.3778, wet: 0.0009, dry: 0.7495 },
          northDelta: { run: 0.3409, wet: 0, dry: 0.6771 },
          southDelta: { run: 0.3735, wet: 0.0074, dry: 0.7347 },
        },

        // Temperature stress › Waterfowl hunting (share of days, 0 to 1)
        'rec-temperature-waterfowl': {
          delta: { run: 0.1224, wet: 0, dry: 0.2432 },
          suisun: { run: 0.0552, wet: 0, dry: 0.1096 },
          centralDelta: { run: 0.1314, wet: 0, dry: 0.2611 },
          northDelta: { run: 0.0699, wet: 0, dry: 0.1389 },
          southDelta: { run: 0.2082, wet: 0, dry: 0.4135 },
        },

        // Temperature stress › Angling (share of days, 0 to 1)
        'rec-temperature-angling': {
          delta: { run: 0.4421, wet: 0.048, dry: 0.8309 },
          suisun: { run: 0.4584, wet: 0.0679, dry: 0.8436 },
          centralDelta: { run: 0.4486, wet: 0.0483, dry: 0.8434 },
          northDelta: { run: 0.4166, wet: 0.0069, dry: 0.8206 },
          southDelta: { run: 0.4383, wet: 0.0572, dry: 0.8142 },
        },

        // Temperature stress › Cold-water day use (share of days, 0 to 1)
        'rec-temperature-dayUseCold': {
          delta: { run: 0.5396, wet: 0.9344, dry: 0.1503 },
          suisun: { run: 0.5169, wet: 0.9082, dry: 0.1308 },
          centralDelta: { run: 0.5355, wet: 0.9347, dry: 0.1418 },
          northDelta: { run: 0.5656, wet: 0.9871, dry: 0.1498 },
          southDelta: { run: 0.5467, wet: 0.9221, dry: 0.1764 },
        },

        // Habitat Restoration › Restored acres (acres)
        'rec-restoration-acres': {
          delta: { '*': 458948 },
          suisun: { '*': 41720 },
          centralDelta: { '*': 32692 },
          northDelta: { '*': 186769 },
          southDelta: { '*': 197767 },
        },

        // Recreation economy › Day use and boating (dollars a year)
        'rec-economy-amenity': {
          delta: { '*': 75352000 },
          suisun: { '*': 15613000 },
          centralDelta: { '*': 15747000 },
          northDelta: { '*': 20865000 },
          southDelta: { '*': 23127000 },
        },

        // Recreation economy › Birding (dollars a year)
        'rec-economy-biodiversity': {
          delta: { '*': 32774000 },
          suisun: { '*': 6791000 },
          centralDelta: { '*': 6849000 },
          northDelta: { '*': 9075000 },
          southDelta: { '*': 10059000 },
        },

        // Recreation economy › Waterfowl hunting (dollars a year)
        'rec-economy-hunting': {
          delta: { '*': 18838000 },
          suisun: { '*': 3903000 },
          centralDelta: { '*': 3937000 },
          northDelta: { '*': 5216000 },
          southDelta: { '*': 5782000 },
        },

        // Recreation economy › Angling (dollars a year)
        'rec-economy-fishing': {
          delta: { '*': 57278000 },
          suisun: { '*': 11868000 },
          centralDelta: { '*': 11970000 },
          northDelta: { '*': 15860000 },
          southDelta: { '*': 17580000 },
        },
      },
      steps: {
        // Infrastructure impact › Descriptive change from Business as Usual (score)
        'rec-infrastructure-descriptive': 0,
      },
    },

    // Bolster & Fortify
    bf: {
      takeaway: {
        lead: 'Bolster & Fortify is **very similar to Business as Usual,** for both salinity EC and temperature, scoring equal to or 0 change from Business as Usual nearly at every score.',
      },
      scores: {
        // Recreation (score)
        recreation: -1,

        // Salinity stress (score)
        'rec-salinity': 0,

        // Temperature stress (score)
        'rec-temperature': 0,

        // Habitat Restoration (score)
        'rec-restoration': 0,

        // Recreation economy (score)
        'rec-economy': 0,

        // Infrastructure impact (score)
        'rec-infrastructure': -1,
      },
      measures: {
        // Salinity stress › Day use (share of days, 0 to 1)
        'rec-salinity-dayUse': {
          delta: { run: 0.279, wet: 0.2802, dry: 0.2484 },
          suisun: { run: 0.801, wet: 0.8267, dry: 0.7421 },
          centralDelta: { run: 0.279, wet: 0.2612, dry: 0.2234 },
          northDelta: { run: 0, wet: 0, dry: 0 },
          southDelta: { run: 0, wet: 0.0003, dry: 0 },
        },

        // Salinity stress › Boating (share of days, 0 to 1)
        'rec-salinity-boating': {
          delta: { run: 0.279, wet: 0.2802, dry: 0.2484 },
          suisun: { run: 0.801, wet: 0.8267, dry: 0.7421 },
          centralDelta: { run: 0.279, wet: 0.2612, dry: 0.2234 },
          northDelta: { run: 0, wet: 0, dry: 0 },
          southDelta: { run: 0, wet: 0.0003, dry: 0 },
        },

        // Salinity stress › Birding (share of days, 0 to 1)
        'rec-salinity-birding': {
          delta: { run: 0.201, wet: 0.1976, dry: 0.1839 },
          suisun: { run: 0.685, wet: 0.6808, dry: 0.6352 },
          centralDelta: { run: 0.105, wet: 0.0974, dry: 0.0893 },
          northDelta: { run: 0, wet: 0, dry: 0 },
          southDelta: { run: 0, wet: 0, dry: 0 },
        },

        // Salinity stress › Waterfowl hunting (share of days, 0 to 1)
        'rec-salinity-waterfowl': {
          delta: { run: 0.181, wet: 0.1741, dry: 0.1652 },
          suisun: { run: 0.627, wet: 0.614, dry: 0.5775 },
          centralDelta: { run: 0.086, wet: 0.0731, dry: 0.0741 },
          northDelta: { run: 0, wet: 0, dry: 0 },
          southDelta: { run: 0, wet: 0, dry: 0 },
        },

        // Salinity stress › Angling (share of days, 0 to 1)
        'rec-salinity-angling': {
          delta: { run: 0.078, wet: 0.059, dry: 0.0682 },
          suisun: { run: 0.286, wet: 0.2175, dry: 0.2613 },
          centralDelta: { run: 0.022, wet: 0.0164, dry: 0.0103 },
          northDelta: { run: 0, wet: 0, dry: 0 },
          southDelta: { run: 0, wet: 0, dry: 0 },
        },

        // Temperature stress › Day use (share of days, 0 to 1)
        'rec-temperature-dayUse': {
          delta: { run: 0.4161, wet: 0.0309, dry: 0.7959 },
          suisun: { run: 0.4231, wet: 0.0461, dry: 0.7951 },
          centralDelta: { run: 0.423, wet: 0.0286, dry: 0.8121 },
          northDelta: { run: 0.3913, wet: 0.0028, dry: 0.7746 },
          southDelta: { run: 0.4192, wet: 0.0385, dry: 0.7948 },
        },

        // Temperature stress › Boating (share of days, 0 to 1)
        'rec-temperature-boating': {
          delta: { run: 0.4161, wet: 0.0309, dry: 0.7959 },
          suisun: { run: 0.4231, wet: 0.0461, dry: 0.7951 },
          centralDelta: { run: 0.423, wet: 0.0286, dry: 0.8121 },
          northDelta: { run: 0.3913, wet: 0.0028, dry: 0.7746 },
          southDelta: { run: 0.4192, wet: 0.0385, dry: 0.7948 },
        },

        // Temperature stress › Birding (share of days, 0 to 1)
        'rec-temperature-birding': {
          delta: { run: 0.3677, wet: 0.0054, dry: 0.7251 },
          suisun: { run: 0.368, wet: 0.0118, dry: 0.7193 },
          centralDelta: { run: 0.3777, wet: 0.0012, dry: 0.7489 },
          northDelta: { run: 0.342, wet: 0, dry: 0.6794 },
          southDelta: { run: 0.3746, wet: 0.0074, dry: 0.7368 },
        },

        // Temperature stress › Waterfowl hunting (share of days, 0 to 1)
        'rec-temperature-waterfowl': {
          delta: { run: 0.1217, wet: 0, dry: 0.2417 },
          suisun: { run: 0.0506, wet: 0, dry: 0.1004 },
          centralDelta: { run: 0.132, wet: 0, dry: 0.2623 },
          northDelta: { run: 0.0697, wet: 0, dry: 0.1384 },
          southDelta: { run: 0.2092, wet: 0, dry: 0.4156 },
        },

        // Temperature stress › Angling (share of days, 0 to 1)
        'rec-temperature-angling': {
          delta: { run: 0.442, wet: 0.0498, dry: 0.8289 },
          suisun: { run: 0.458, wet: 0.0769, dry: 0.834 },
          centralDelta: { run: 0.4483, wet: 0.0468, dry: 0.8443 },
          northDelta: { run: 0.4177, wet: 0.0083, dry: 0.8215 },
          southDelta: { run: 0.4377, wet: 0.0563, dry: 0.8139 },
        },

        // Temperature stress › Cold-water day use (share of days, 0 to 1)
        'rec-temperature-dayUseCold': {
          delta: { run: 0.5411, wet: 0.9341, dry: 0.1534 },
          suisun: { run: 0.5222, wet: 0.9062, dry: 0.1434 },
          centralDelta: { run: 0.5357, wet: 0.9351, dry: 0.1418 },
          northDelta: { run: 0.566, wet: 0.9866, dry: 0.1512 },
          southDelta: { run: 0.5467, wet: 0.9231, dry: 0.1755 },
        },

        // Habitat Restoration › Restored acres (acres)
        'rec-restoration-acres': {
          delta: { '*': 0 },
          suisun: { '*': 0 },
          centralDelta: { '*': 0 },
          northDelta: { '*': 0 },
          southDelta: { '*': 0 },
        },

        // Recreation economy › Day use and boating (dollars a year)
        'rec-economy-amenity': {
          delta: { '*': 0 },
          suisun: { '*': 0 },
          centralDelta: { '*': 0 },
          northDelta: { '*': 0 },
          southDelta: { '*': 0 },
        },

        // Recreation economy › Birding (dollars a year)
        'rec-economy-biodiversity': {
          delta: { '*': 0 },
          suisun: { '*': 0 },
          centralDelta: { '*': 0 },
          northDelta: { '*': 0 },
          southDelta: { '*': 0 },
        },

        // Recreation economy › Waterfowl hunting (dollars a year)
        'rec-economy-hunting': {
          delta: { '*': 0 },
          suisun: { '*': 0 },
          centralDelta: { '*': 0 },
          northDelta: { '*': 0 },
          southDelta: { '*': 0 },
        },

        // Recreation economy › Angling (dollars a year)
        'rec-economy-fishing': {
          delta: { '*': 0 },
          suisun: { '*': 0 },
          centralDelta: { '*': 0 },
          northDelta: { '*': 0 },
          southDelta: { '*': 0 },
        },
      },
      steps: {
        // Infrastructure impact › Descriptive change from Business as Usual (score)
        'rec-infrastructure-descriptive': -1,
      },
    },

    // Calling on Reserves
    cor: {
      takeaway: {
        lead: 'Calling on Reserves **performs better than Business as Usual for EC salinity** (0 to +1, with +3 for winter seasons in the Central Delta Day Use).',
        points: [
          {
            label: 'Temperature',
            text: 'The effects of temperature are negligible alongside sea-level rise.',
          },
        ],
      },
      scores: {
        // Recreation (score)
        recreation: 0,

        // Salinity stress (score)
        'rec-salinity': 0,

        // Temperature stress (score)
        'rec-temperature': 0,

        // Habitat Restoration (score)
        'rec-restoration': 0,

        // Recreation economy (score)
        'rec-economy': 0,

        // Infrastructure impact (score)
        'rec-infrastructure': 0,
      },
      measures: {
        // Salinity stress › Day use (share of days, 0 to 1)
        'rec-salinity-dayUse': {
          delta: { run: 0.331, wet: 0.3329, dry: 0.2945 },
          suisun: { run: 0.837, wet: 0.8308, dry: 0.8156 },
          centralDelta: { run: 0.414, wet: 0.4128, dry: 0.3221 },
          northDelta: { run: 0, wet: 0, dry: 0 },
          southDelta: { run: 0.02, wet: 0.0323, dry: 0 },
        },

        // Salinity stress › Boating (share of days, 0 to 1)
        'rec-salinity-boating': {
          delta: { run: 0.331, wet: 0.3329, dry: 0.2945 },
          suisun: { run: 0.837, wet: 0.8308, dry: 0.8156 },
          centralDelta: { run: 0.414, wet: 0.4128, dry: 0.3221 },
          northDelta: { run: 0, wet: 0, dry: 0 },
          southDelta: { run: 0.02, wet: 0.0323, dry: 0 },
        },

        // Salinity stress › Birding (share of days, 0 to 1)
        'rec-salinity-birding': {
          delta: { run: 0.26, wet: 0.2558, dry: 0.239 },
          suisun: { run: 0.766, wet: 0.7551, dry: 0.737 },
          centralDelta: { run: 0.242, wet: 0.2384, dry: 0.1946 },
          northDelta: { run: 0, wet: 0, dry: 0 },
          southDelta: { run: 0, wet: 0, dry: 0 },
        },

        // Salinity stress › Waterfowl hunting (share of days, 0 to 1)
        'rec-salinity-waterfowl': {
          delta: { run: 0.24, wet: 0.2376, dry: 0.2221 },
          suisun: { run: 0.734, wet: 0.7247, dry: 0.6974 },
          centralDelta: { run: 0.202, wet: 0.2006, dry: 0.1697 },
          northDelta: { run: 0, wet: 0, dry: 0 },
          southDelta: { run: 0, wet: 0, dry: 0 },
        },

        // Salinity stress › Angling (share of days, 0 to 1)
        'rec-salinity-angling': {
          delta: { run: 0.156, wet: 0.1433, dry: 0.145 },
          suisun: { run: 0.522, wet: 0.4781, dry: 0.4939 },
          centralDelta: { run: 0.092, wet: 0.0846, dry: 0.0765 },
          northDelta: { run: 0, wet: 0, dry: 0 },
          southDelta: { run: 0, wet: 0, dry: 0 },
        },

        // Temperature stress › Day use (share of days, 0 to 1)
        'rec-temperature-dayUse': {
          delta: { run: 0.4075, wet: 0.0348, dry: 0.787 },
          suisun: { run: 0.4139, wet: 0.0485, dry: 0.7906 },
          centralDelta: { run: 0.4123, wet: 0.0372, dry: 0.7854 },
          northDelta: { run: 0.3703, wet: 0.0088, dry: 0.7559 },
          southDelta: { run: 0.4218, wet: 0.0376, dry: 0.806 },
        },

        // Temperature stress › Boating (share of days, 0 to 1)
        'rec-temperature-boating': {
          delta: { run: 0.4075, wet: 0.0348, dry: 0.787 },
          suisun: { run: 0.4139, wet: 0.0485, dry: 0.7906 },
          centralDelta: { run: 0.4123, wet: 0.0372, dry: 0.7854 },
          northDelta: { run: 0.3703, wet: 0.0088, dry: 0.7559 },
          southDelta: { run: 0.4218, wet: 0.0376, dry: 0.806 },
        },

        // Temperature stress › Birding (share of days, 0 to 1)
        'rec-temperature-birding': {
          delta: { run: 0.3591, wet: 0.0068, dry: 0.7293 },
          suisun: { run: 0.3493, wet: 0.0121, dry: 0.7199 },
          centralDelta: { run: 0.372, wet: 0.004, dry: 0.7489 },
          northDelta: { run: 0.325, wet: 0, dry: 0.6826 },
          southDelta: { run: 0.3776, wet: 0.0092, dry: 0.7492 },
        },

        // Temperature stress › Waterfowl hunting (share of days, 0 to 1)
        'rec-temperature-waterfowl': {
          delta: { run: 0.1146, wet: 0, dry: 0.2451 },
          suisun: { run: 0.0478, wet: 0, dry: 0.1025 },
          centralDelta: { run: 0.1253, wet: 0, dry: 0.2684 },
          northDelta: { run: 0.0733, wet: 0, dry: 0.1571 },
          southDelta: { run: 0.1906, wet: 0, dry: 0.4074 },
        },

        // Temperature stress › Angling (share of days, 0 to 1)
        'rec-temperature-angling': {
          delta: { run: 0.4328, wet: 0.0544, dry: 0.8124 },
          suisun: { run: 0.4466, wet: 0.0783, dry: 0.8204 },
          centralDelta: { run: 0.4331, wet: 0.0554, dry: 0.8063 },
          northDelta: { run: 0.398, wet: 0.0152, dry: 0.7873 },
          southDelta: { run: 0.4435, wet: 0.0582, dry: 0.8282 },
        },

        // Temperature stress › Cold-water day use (share of days, 0 to 1)
        'rec-temperature-dayUseCold': {
          delta: { run: 0.5472, wet: 0.9273, dry: 0.1663 },
          suisun: { run: 0.5311, wet: 0.9044, dry: 0.1523 },
          centralDelta: { run: 0.5421, wet: 0.9209, dry: 0.1648 },
          northDelta: { run: 0.5835, wet: 0.9732, dry: 0.1931 },
          southDelta: { run: 0.5422, wet: 0.9234, dry: 0.1624 },
        },

        // Habitat Restoration › Restored acres (acres)
        'rec-restoration-acres': {
          delta: { '*': 0 },
          suisun: { '*': 0 },
          centralDelta: { '*': 0 },
          northDelta: { '*': 0 },
          southDelta: { '*': 0 },
        },

        // Recreation economy › Day use and boating (dollars a year)
        'rec-economy-amenity': {
          delta: { '*': 0 },
          suisun: { '*': 0 },
          centralDelta: { '*': 0 },
          northDelta: { '*': 0 },
          southDelta: { '*': 0 },
        },

        // Recreation economy › Birding (dollars a year)
        'rec-economy-biodiversity': {
          delta: { '*': 0 },
          suisun: { '*': 0 },
          centralDelta: { '*': 0 },
          northDelta: { '*': 0 },
          southDelta: { '*': 0 },
        },

        // Recreation economy › Waterfowl hunting (dollars a year)
        'rec-economy-hunting': {
          delta: { '*': 0 },
          suisun: { '*': 0 },
          centralDelta: { '*': 0 },
          northDelta: { '*': 0 },
          southDelta: { '*': 0 },
        },

        // Recreation economy › Angling (dollars a year)
        'rec-economy-fishing': {
          delta: { '*': 0 },
          suisun: { '*': 0 },
          centralDelta: { '*': 0 },
          northDelta: { '*': 0 },
          southDelta: { '*': 0 },
        },
      },
      steps: {
        // Infrastructure impact › Descriptive change from Business as Usual (score)
        'rec-infrastructure-descriptive': 0,
      },
    },

    // A Tunnel
    tunnel: {
      takeaway: {
        lead: 'The Delta Conveyance Project, or A Tunnel, is **the only scenario that worsens EC salinity intrusion** into both Suisun and the Central Delta (-1 to -3).',
        points: [
          {
            label: 'Temperature',
            text: 'Warmer summer-season conditions for waterfowl during their brooding season diminish (-1 to -2) at both the baseline and sea-level-rise levels.',
          },
        ],
      },
      scores: {
        // Recreation (score)
        recreation: -1,

        // Salinity stress (score)
        'rec-salinity': 0,

        // Temperature stress (score)
        'rec-temperature': 0,

        // Habitat Restoration (score)
        'rec-restoration': 0,

        // Recreation economy (score)
        'rec-economy': 0,

        // Infrastructure impact (score)
        'rec-infrastructure': -3,
      },
      measures: {
        // Salinity stress › Day use (share of days, 0 to 1)
        'rec-salinity-dayUse': {
          delta: { run: 0.338, wet: 0.3471, dry: 0.2954 },
          suisun: { run: 0.848, wet: 0.8455, dry: 0.8238 },
          centralDelta: { run: 0.43, wet: 0.4545, dry: 0.3182 },
          northDelta: { run: 0, wet: 0, dry: 0 },
          southDelta: { run: 0.018, wet: 0.028, dry: 0 },
        },

        // Salinity stress › Boating (share of days, 0 to 1)
        'rec-salinity-boating': {
          delta: { run: 0.338, wet: 0.3471, dry: 0.2954 },
          suisun: { run: 0.848, wet: 0.8455, dry: 0.8238 },
          centralDelta: { run: 0.43, wet: 0.4545, dry: 0.3182 },
          northDelta: { run: 0, wet: 0, dry: 0 },
          southDelta: { run: 0.018, wet: 0.028, dry: 0 },
        },

        // Salinity stress › Birding (share of days, 0 to 1)
        'rec-salinity-birding': {
          delta: { run: 0.267, wet: 0.2666, dry: 0.2454 },
          suisun: { run: 0.784, wet: 0.7764, dry: 0.7551 },
          centralDelta: { run: 0.253, wet: 0.2578, dry: 0.2013 },
          northDelta: { run: 0, wet: 0, dry: 0 },
          southDelta: { run: 0, wet: 0, dry: 0 },
        },

        // Salinity stress › Waterfowl hunting (share of days, 0 to 1)
        'rec-salinity-waterfowl': {
          delta: { run: 0.244, wet: 0.2452, dry: 0.2223 },
          suisun: { run: 0.745, wet: 0.7445, dry: 0.7022 },
          centralDelta: { run: 0.204, wet: 0.21, dry: 0.1661 },
          northDelta: { run: 0, wet: 0, dry: 0 },
          southDelta: { run: 0, wet: 0, dry: 0 },
        },

        // Salinity stress › Angling (share of days, 0 to 1)
        'rec-salinity-angling': {
          delta: { run: 0.159, wet: 0.1558, dry: 0.1381 },
          suisun: { run: 0.53, wet: 0.5199, dry: 0.4665 },
          centralDelta: { run: 0.095, wet: 0.0919, dry: 0.0762 },
          northDelta: { run: 0, wet: 0, dry: 0 },
          southDelta: { run: 0, wet: 0, dry: 0 },
        },

        // Temperature stress › Day use (share of days, 0 to 1)
        'rec-temperature-dayUse': {
          delta: { run: 0.4077, wet: 0.0343, dry: 0.7877 },
          suisun: { run: 0.4149, wet: 0.0481, dry: 0.7927 },
          centralDelta: { run: 0.4111, wet: 0.036, dry: 0.7835 },
          northDelta: { run: 0.371, wet: 0.0092, dry: 0.7568 },
          southDelta: { run: 0.4223, wet: 0.0369, dry: 0.8078 },
        },

        // Temperature stress › Boating (share of days, 0 to 1)
        'rec-temperature-boating': {
          delta: { run: 0.4077, wet: 0.0343, dry: 0.7877 },
          suisun: { run: 0.4149, wet: 0.0481, dry: 0.7927 },
          centralDelta: { run: 0.4111, wet: 0.036, dry: 0.7835 },
          northDelta: { run: 0.371, wet: 0.0092, dry: 0.7568 },
          southDelta: { run: 0.4223, wet: 0.0369, dry: 0.8078 },
        },

        // Temperature stress › Birding (share of days, 0 to 1)
        'rec-temperature-birding': {
          delta: { run: 0.3598, wet: 0.0066, dry: 0.7309 },
          suisun: { run: 0.3493, wet: 0.0118, dry: 0.7203 },
          centralDelta: { run: 0.372, wet: 0.004, dry: 0.7489 },
          northDelta: { run: 0.3276, wet: 0, dry: 0.6881 },
          southDelta: { run: 0.3784, wet: 0.0089, dry: 0.7508 },
        },

        // Temperature stress › Waterfowl hunting (share of days, 0 to 1)
        'rec-temperature-waterfowl': {
          delta: { run: 0.1184, wet: 0, dry: 0.2533 },
          suisun: { run: 0.0475, wet: 0, dry: 0.1018 },
          centralDelta: { run: 0.1319, wet: 0, dry: 0.2826 },
          northDelta: { run: 0.0816, wet: 0, dry: 0.1749 },
          southDelta: { run: 0.1923, wet: 0, dry: 0.4111 },
        },

        // Temperature stress › Angling (share of days, 0 to 1)
        'rec-temperature-angling': {
          delta: { run: 0.4328, wet: 0.0544, dry: 0.8122 },
          suisun: { run: 0.4469, wet: 0.0783, dry: 0.821 },
          centralDelta: { run: 0.4324, wet: 0.0551, dry: 0.8051 },
          northDelta: { run: 0.3982, wet: 0.0152, dry: 0.7878 },
          southDelta: { run: 0.4437, wet: 0.0588, dry: 0.8279 },
        },

        // Temperature stress › Cold-water day use (share of days, 0 to 1)
        'rec-temperature-dayUseCold': {
          delta: { run: 0.5467, wet: 0.9265, dry: 0.1662 },
          suisun: { run: 0.5309, wet: 0.9044, dry: 0.152 },
          centralDelta: { run: 0.5427, wet: 0.9206, dry: 0.1664 },
          northDelta: { run: 0.5827, wet: 0.9728, dry: 0.1917 },
          southDelta: { run: 0.5408, wet: 0.9212, dry: 0.1615 },
        },

        // Habitat Restoration › Restored acres (acres)
        'rec-restoration-acres': {
          delta: { '*': 0 },
          suisun: { '*': 0 },
          centralDelta: { '*': 0 },
          northDelta: { '*': 0 },
          southDelta: { '*': 0 },
        },

        // Recreation economy › Day use and boating (dollars a year)
        'rec-economy-amenity': {
          delta: { '*': 0 },
          suisun: { '*': 0 },
          centralDelta: { '*': 0 },
          northDelta: { '*': 0 },
          southDelta: { '*': 0 },
        },

        // Recreation economy › Birding (dollars a year)
        'rec-economy-biodiversity': {
          delta: { '*': 0 },
          suisun: { '*': 0 },
          centralDelta: { '*': 0 },
          northDelta: { '*': 0 },
          southDelta: { '*': 0 },
        },

        // Recreation economy › Waterfowl hunting (dollars a year)
        'rec-economy-hunting': {
          delta: { '*': 0 },
          suisun: { '*': 0 },
          centralDelta: { '*': 0 },
          northDelta: { '*': 0 },
          southDelta: { '*': 0 },
        },

        // Recreation economy › Angling (dollars a year)
        'rec-economy-fishing': {
          delta: { '*': 0 },
          suisun: { '*': 0 },
          centralDelta: { '*': 0 },
          northDelta: { '*': 0 },
          southDelta: { '*': 0 },
        },
      },
      steps: {
        // Infrastructure impact › Descriptive change from Business as Usual (score)
        'rec-infrastructure-descriptive': -3,
      },
    },

    // Historical Baseline
    hist: {
      measures: {
        // Salinity stress › Day use (share of days, 0 to 1)
        'rec-salinity-dayUse': {
          delta: { run: 0.461382612966601, wet: 0.443636363636364, dry: 0.482238247863248 },
          suisun: { run: 0.99803536345776, wet: 0.996363636363636, dry: 1 },
          centralDelta: { run: 0.715564287273521, wet: 0.664242424242424, dry: 0.775878442545109 },
          northDelta: {
            run: 0.0212835625409299,
            wet: 0.00181818181818182,
            dry: 0.0441595441595442,
          },
          southDelta: { run: 0.0235756385068762, wet: 0.0262626262626263, dry: 0.0204178537511871 },
        },

        // Salinity stress › Boating (share of days, 0 to 1)
        'rec-salinity-boating': {
          delta: { run: 0.461382612966601, wet: 0.443636363636364, dry: 0.482238247863248 },
          suisun: { run: 0.99803536345776, wet: 0.996363636363636, dry: 1 },
          centralDelta: { run: 0.715564287273521, wet: 0.664242424242424, dry: 0.775878442545109 },
          northDelta: {
            run: 0.0212835625409299,
            wet: 0.00181818181818182,
            dry: 0.0441595441595442,
          },
          southDelta: { run: 0.0235756385068762, wet: 0.0262626262626263, dry: 0.0204178537511871 },
        },

        // Salinity stress › Birding (share of days, 0 to 1)
        'rec-salinity-birding': {
          delta: { run: 0.343811394891945, wet: 0.336022727272727, dry: 0.352964743589744 },
          suisun: { run: 0.991895874263261, wet: 0.985, dry: 1 },
          centralDelta: { run: 0.340755293604017, wet: 0.319191919191919, dry: 0.366096866096866 },
          northDelta: { run: 0, wet: 0, dry: 0 },
          southDelta: { run: 0, wet: 0, dry: 0 },
        },

        // Salinity stress › Waterfowl hunting (share of days, 0 to 1)
        'rec-salinity-waterfowl': {
          delta: { run: 0.326805009823183, wet: 0.317954545454545, dry: 0.337206196581197 },
          suisun: { run: 0.988703339882122, wet: 0.979090909090909, dry: 1 },
          centralDelta: { run: 0.283125955031652, wet: 0.26020202020202, dry: 0.310066476733143 },
          northDelta: { run: 0, wet: 0, dry: 0 },
          southDelta: { run: 0, wet: 0, dry: 0 },
        },

        // Salinity stress › Angling (share of days, 0 to 1)
        'rec-salinity-angling': {
          delta: { run: 0.259945972495088, wet: 0.238522727272727, dry: 0.285122863247863 },
          suisun: { run: 0.850196463654224, wet: 0.791363636363636, dry: 0.919337606837607 },
          centralDelta: { run: 0.168522156734337, wet: 0.144646464646465, dry: 0.196581196581197 },
          northDelta: { run: 0, wet: 0, dry: 0 },
          southDelta: { run: 0, wet: 0, dry: 0 },
        },

        // Temperature stress › Day use (share of days, 0 to 1)
        'rec-temperature-dayUse': {
          delta: { run: 0.414415520628684, wet: 0.0905681818181818, dry: 0.795005341880342 },
          suisun: { run: 0.370333988212181, wet: 0.0845454545454545, dry: 0.706196581196581 },
          centralDelta: { run: 0.434184675834971, wet: 0.110707070707071, dry: 0.814339981006648 },
          northDelta: { run: 0.399803536345776, wet: 0.0466666666666667, dry: 0.814814814814815 },
          southDelta: { run: 0.443571272647893, wet: 0.105050505050505, dry: 0.841405508072175 },
        },

        // Temperature stress › Boating (share of days, 0 to 1)
        'rec-temperature-boating': {
          delta: { run: 0.414415520628684, wet: 0.0905681818181818, dry: 0.795005341880342 },
          suisun: { run: 0.370333988212181, wet: 0.0845454545454545, dry: 0.706196581196581 },
          centralDelta: { run: 0.434184675834971, wet: 0.110707070707071, dry: 0.814339981006648 },
          northDelta: { run: 0.399803536345776, wet: 0.0466666666666667, dry: 0.814814814814815 },
          southDelta: { run: 0.443571272647893, wet: 0.105050505050505, dry: 0.841405508072175 },
        },

        // Temperature stress › Birding (share of days, 0 to 1)
        'rec-temperature-birding': {
          delta: { run: 0.350257858546169, wet: 0.0463636363636364, dry: 0.707398504273504 },
          suisun: { run: 0.279469548133595, wet: 0.0254545454545455, dry: 0.577991452991453 },
          centralDelta: { run: 0.373499235974678, wet: 0.0549494949494949, dry: 0.747863247863248 },
          northDelta: { run: 0.337917485265226, wet: 0.016969696969697, dry: 0.715099715099715 },
          southDelta: { run: 0.398166339227243, wet: 0.075959595959596, dry: 0.776828110161443 },
        },

        // Temperature stress › Waterfowl hunting (share of days, 0 to 1)
        'rec-temperature-waterfowl': {
          delta: { run: 0.12794695481336, wet: 0.00193181818181818, dry: 0.276041666666667 },
          suisun: { run: 0.0147347740667976, wet: 0, dry: 0.032051282051282 },
          centralDelta: { run: 0.118314778432657, wet: 0, dry: 0.257359924026591 },
          northDelta: { run: 0.111984282907662, wet: 0, dry: 0.243589743589744 },
          southDelta: { run: 0.248853962017027, wet: 0.00686868686868687, dry: 0.5332383665717 },
        },

        // Temperature stress › Angling (share of days, 0 to 1)
        'rec-temperature-angling': {
          delta: { run: 0.441060903732809, wet: 0.106136363636364, dry: 0.834668803418803 },
          suisun: { run: 0.406434184675835, wet: 0.0995454545454545, dry: 0.767094017094017 },
          centralDelta: { run: 0.454267627155643, wet: 0.121212121212121, dry: 0.845679012345679 },
          northDelta: { run: 0.431237721021611, wet: 0.0781818181818182, dry: 0.846153846153846 },
          southDelta: { run: 0.46518227461253, wet: 0.115555555555556, dry: 0.876068376068376 },
        },

        // Temperature stress › Cold-water day use (share of days, 0 to 1)
        'rec-temperature-dayUseCold': {
          delta: { run: 0.542362475442043, wet: 0.884772727272727, dry: 0.139957264957265 },
          suisun: { run: 0.572937131630648, wet: 0.888636363636364, dry: 0.201923076923077 },
          centralDelta: { run: 0.53285308884523, wet: 0.875555555555556, dry: 0.130104463437797 },
          northDelta: { run: 0.548133595284872, wet: 0.903636363636364, dry: 0.13034188034188 },
          southDelta: { run: 0.520846976642654, wet: 0.877979797979798, dry: 0.101139601139601 },
        },
      },
    },

    // Increased Delta outflow
    more: {
      takeaway: {
        lead: 'Greater outflows **improve recreation conditions,** mainly by reducing salinity in the Central Delta and Suisun, where exceedances are otherwise most frequent.',
        points: [
          {
            label: 'Elsewhere',
            text: 'North and South Delta regions are otherwise unchanged from baseline, as temperature and salinity do little to change them.',
          },
        ],
      },
      scores: {
        // Recreation (score)
        recreation: 0,

        // Salinity stress (score)
        'rec-salinity': 1,

        // Temperature stress (score)
        'rec-temperature': 0,
      },
      measures: {
        // Salinity stress › Day use (share of days, 0 to 1)
        'rec-salinity-dayUse': {
          delta: { run: 0.3577, wet: 0.346477272727273, dry: 0.370860042735043 },
          suisun: { run: 0.9897, wet: 0.980909090909091, dry: 1 },
          centralDelta: { run: 0.3875, wet: 0.351515151515152, dry: 0.429724596391263 },
          northDelta: { run: 0, wet: 0, dry: 0 },
          southDelta: { run: 0.0046, wet: 0.00848484848484849, dry: 0 },
        },

        // Salinity stress › Boating (share of days, 0 to 1)
        'rec-salinity-boating': {
          delta: { run: 0.3577, wet: 0.346477272727273, dry: 0.370860042735043 },
          suisun: { run: 0.9897, wet: 0.980909090909091, dry: 1 },
          centralDelta: { run: 0.3875, wet: 0.351515151515152, dry: 0.429724596391263 },
          northDelta: { run: 0, wet: 0, dry: 0 },
          southDelta: { run: 0.0046, wet: 0.00848484848484849, dry: 0 },
        },

        // Salinity stress › Birding (share of days, 0 to 1)
        'rec-salinity-birding': {
          delta: { run: 0.3028, wet: 0.28625, dry: 0.322248931623932 },
          suisun: { run: 0.9585, wet: 0.925, dry: 0.997863247863248 },
          centralDelta: { run: 0.2246, wet: 0.195555555555556, dry: 0.258784425451092 },
          northDelta: { run: 0, wet: 0, dry: 0 },
          southDelta: { run: 0, wet: 0, dry: 0 },
        },

        // Salinity stress › Waterfowl hunting (share of days, 0 to 1)
        'rec-salinity-waterfowl': {
          delta: { run: 0.2855, wet: 0.266590909090909, dry: 0.307825854700855 },
          suisun: { run: 0.9226, wet: 0.875909090909091, dry: 0.977564102564103 },
          centralDelta: { run: 0.1952, wet: 0.169292929292929, dry: 0.225546058879392 },
          northDelta: { run: 0, wet: 0, dry: 0 },
          southDelta: { run: 0, wet: 0, dry: 0 },
        },

        // Salinity stress › Angling (share of days, 0 to 1)
        'rec-salinity-angling': {
          delta: { run: 0.1591, wet: 0.129772727272727, dry: 0.193643162393162 },
          suisun: { run: 0.5764, wet: 0.461818181818182, dry: 0.711004273504274 },
          centralDelta: { run: 0.0535, wet: 0.0509090909090909, dry: 0.0565052231718898 },
          northDelta: { run: 0, wet: 0, dry: 0 },
          southDelta: { run: 0, wet: 0, dry: 0 },
        },

        // Temperature stress › Day use (share of days, 0 to 1)
        'rec-temperature-dayUse': {
          delta: { run: 0.4163, wet: 0.0884090909090909, dry: 0.801682692307692 },
          suisun: { run: 0.3794, wet: 0.085, dry: 0.72542735042735 },
          centralDelta: { run: 0.4368, wet: 0.109090909090909, dry: 0.821937321937322 },
          northDelta: { run: 0.3949, wet: 0.0375757575757576, dry: 0.814814814814815 },
          southDelta: { run: 0.4429, wet: 0.104646464646465, dry: 0.84045584045584 },
        },

        // Temperature stress › Boating (share of days, 0 to 1)
        'rec-temperature-boating': {
          delta: { run: 0.4163, wet: 0.0884090909090909, dry: 0.801682692307692 },
          suisun: { run: 0.3794, wet: 0.085, dry: 0.72542735042735 },
          centralDelta: { run: 0.4368, wet: 0.109090909090909, dry: 0.821937321937322 },
          northDelta: { run: 0.3949, wet: 0.0375757575757576, dry: 0.814814814814815 },
          southDelta: { run: 0.4429, wet: 0.104646464646465, dry: 0.84045584045584 },
        },

        // Temperature stress › Birding (share of days, 0 to 1)
        'rec-temperature-birding': {
          delta: { run: 0.351, wet: 0.0422727272727273, dry: 0.713808760683761 },
          suisun: { run: 0.29, wet: 0.025, dry: 0.601495726495726 },
          centralDelta: { run: 0.3709, wet: 0.0468686868686869, dry: 0.751661918328585 },
          northDelta: { run: 0.3343, wet: 0.0133333333333333, dry: 0.711538461538462 },
          southDelta: { run: 0.3964, wet: 0.0723232323232323, dry: 0.777302943969611 },
        },

        // Temperature stress › Waterfowl hunting (share of days, 0 to 1)
        'rec-temperature-waterfowl': {
          delta: { run: 0.1265, wet: 0.00136363636363636, dry: 0.273637820512821 },
          suisun: { run: 0.0157, wet: 0, dry: 0.0341880341880342 },
          centralDelta: { run: 0.1177, wet: 0, dry: 0.255935422602089 },
          northDelta: { run: 0.1117, wet: 0, dry: 0.242877492877493 },
          southDelta: { run: 0.2438, wet: 0.00484848484848485, dry: 0.524691358024691 },
        },

        // Temperature stress › Angling (share of days, 0 to 1)
        'rec-temperature-angling': {
          delta: { run: 0.4431, wet: 0.104772727272727, dry: 0.840678418803419 },
          suisun: { run: 0.4138, wet: 0.102272727272727, dry: 0.77991452991453 },
          centralDelta: { run: 0.4571, wet: 0.121212121212121, dry: 0.851851851851852 },
          northDelta: { run: 0.4286, wet: 0.0684848484848485, dry: 0.851851851851852 },
          southDelta: { run: 0.4647, wet: 0.114747474747475, dry: 0.876068376068376 },
        },

        // Temperature stress › Cold-water day use (share of days, 0 to 1)
        'rec-temperature-dayUseCold': {
          delta: { run: 0.5392, wet: 0.885454545454545, dry: 0.132345085470085 },
          suisun: { run: 0.5641, wet: 0.887727272727273, dry: 0.183760683760684 },
          centralDelta: { run: 0.5311, wet: 0.875959595959596, dry: 0.125830959164292 },
          northDelta: { run: 0.5462, wet: 0.907272727272727, dry: 0.121794871794872 },
          southDelta: { run: 0.5206, wet: 0.878383838383838, dry: 0.100189933523267 },
        },
      },
    },
  },
  // With sea level rise
  seaLevelRise: {
    // Business as Usual
    bau: {
      measures: {
        // Salinity stress › Day use (share of days, 0 to 1)
        'rec-salinity-dayUse': {
          delta: { run: 0.3218, wet: 0.3204, dry: 0.2782 },
          suisun: { run: 0.8206, wet: 0.8503, dry: 0.7606 },
          centralDelta: { run: 0.3785, wet: 0.3619, dry: 0.2963 },
          northDelta: { run: 0, wet: 0, dry: 0 },
          southDelta: { run: 0.0364, wet: 0.0213, dry: 0.0167 },
        },

        // Salinity stress › Boating (share of days, 0 to 1)
        'rec-salinity-boating': {
          delta: { run: 0.3218, wet: 0.3204, dry: 0.2782 },
          suisun: { run: 0.8206, wet: 0.8503, dry: 0.7606 },
          centralDelta: { run: 0.3785, wet: 0.3619, dry: 0.2963 },
          northDelta: { run: 0, wet: 0, dry: 0 },
          southDelta: { run: 0.0364, wet: 0.0213, dry: 0.0167 },
        },

        // Salinity stress › Birding (share of days, 0 to 1)
        'rec-salinity-birding': {
          delta: { run: 0.2406, wet: 0.2323, dry: 0.2165 },
          suisun: { run: 0.7364, wet: 0.7452, dry: 0.6831 },
          centralDelta: { run: 0.2009, wet: 0.1635, dry: 0.1627 },
          northDelta: { run: 0, wet: 0, dry: 0 },
          southDelta: { run: 0, wet: 0, dry: 0 },
        },

        // Salinity stress › Waterfowl hunting (share of days, 0 to 1)
        'rec-salinity-waterfowl': {
          delta: { run: 0.2107, wet: 0.2085, dry: 0.1903 },
          suisun: { run: 0.6996, wet: 0.7031, dry: 0.6452 },
          centralDelta: { run: 0.1274, wet: 0.1163, dry: 0.1032 },
          northDelta: { run: 0, wet: 0, dry: 0 },
          southDelta: { run: 0, wet: 0, dry: 0 },
        },

        // Salinity stress › Angling (share of days, 0 to 1)
        'rec-salinity-angling': {
          delta: { run: 0.1183, wet: 0.105, dry: 0.0994 },
          suisun: { run: 0.4176, wet: 0.3777, dry: 0.3593 },
          centralDelta: { run: 0.0496, wet: 0.0374, dry: 0.034 },
          northDelta: { run: 0, wet: 0, dry: 0 },
          southDelta: { run: 0, wet: 0, dry: 0 },
        },

        // Temperature stress › Day use (share of days, 0 to 1)
        'rec-temperature-dayUse': {
          delta: { run: 0.4197, wet: 0.0428, dry: 0.7956 },
          suisun: { run: 0.4251, wet: 0.0575, dry: 0.7917 },
          centralDelta: { run: 0.4288, wet: 0.0438, dry: 0.8127 },
          northDelta: { run: 0.3919, wet: 0.0068, dry: 0.776 },
          southDelta: { run: 0.4244, wet: 0.0527, dry: 0.7951 },
        },

        // Temperature stress › Boating (share of days, 0 to 1)
        'rec-temperature-boating': {
          delta: { run: 0.4197, wet: 0.0428, dry: 0.7956 },
          suisun: { run: 0.4251, wet: 0.0575, dry: 0.7917 },
          centralDelta: { run: 0.4288, wet: 0.0438, dry: 0.8127 },
          northDelta: { run: 0.3919, wet: 0.0068, dry: 0.776 },
          southDelta: { run: 0.4244, wet: 0.0527, dry: 0.7951 },
        },

        // Temperature stress › Birding (share of days, 0 to 1)
        'rec-temperature-birding': {
          delta: { run: 0.3689, wet: 0.0116, dry: 0.7252 },
          suisun: { run: 0.3658, wet: 0.013, dry: 0.7176 },
          centralDelta: { run: 0.3767, wet: 0.0061, dry: 0.7462 },
          northDelta: { run: 0.3413, wet: 0.0009, dry: 0.6808 },
          southDelta: { run: 0.3824, wet: 0.0231, dry: 0.7407 },
        },

        // Temperature stress › Waterfowl hunting (share of days, 0 to 1)
        'rec-temperature-waterfowl': {
          delta: { run: 0.124, wet: 0, dry: 0.2477 },
          suisun: { run: 0.0498, wet: 0, dry: 0.0994 },
          centralDelta: { run: 0.1339, wet: 0, dry: 0.2675 },
          northDelta: { run: 0.0675, wet: 0, dry: 0.1348 },
          southDelta: { run: 0.2178, wet: 0, dry: 0.435 },
        },

        // Temperature stress › Angling (share of days, 0 to 1)
        'rec-temperature-angling': {
          delta: { run: 0.447, wet: 0.0634, dry: 0.8295 },
          suisun: { run: 0.4617, wet: 0.0873, dry: 0.835 },
          centralDelta: { run: 0.4531, wet: 0.0612, dry: 0.844 },
          northDelta: { run: 0.4207, wet: 0.0169, dry: 0.8233 },
          southDelta: { run: 0.4454, wet: 0.0755, dry: 0.8142 },
        },

        // Temperature stress › Cold-water day use (share of days, 0 to 1)
        'rec-temperature-dayUseCold': {
          delta: { run: 0.5355, wet: 0.9195, dry: 0.1525 },
          suisun: { run: 0.5181, wet: 0.8938, dry: 0.1434 },
          centralDelta: { run: 0.529, wet: 0.9184, dry: 0.1406 },
          northDelta: { run: 0.5618, wet: 0.9744, dry: 0.1503 },
          southDelta: { run: 0.5399, wet: 0.9068, dry: 0.174 },
        },

        // Habitat Restoration › Restored acres (acres)
        'rec-restoration-acres': {
          delta: { '*': 0 },
          suisun: { '*': 0 },
          centralDelta: { '*': 0 },
          northDelta: { '*': 0 },
          southDelta: { '*': 0 },
        },

        // Recreation economy › Day use and boating (dollars a year)
        'rec-economy-amenity': {
          delta: { '*': 0 },
          suisun: { '*': 0 },
          centralDelta: { '*': 0 },
          northDelta: { '*': 0 },
          southDelta: { '*': 0 },
        },

        // Recreation economy › Birding (dollars a year)
        'rec-economy-biodiversity': {
          delta: { '*': 0 },
          suisun: { '*': 0 },
          centralDelta: { '*': 0 },
          northDelta: { '*': 0 },
          southDelta: { '*': 0 },
        },

        // Recreation economy › Waterfowl hunting (dollars a year)
        'rec-economy-hunting': {
          delta: { '*': 0 },
          suisun: { '*': 0 },
          centralDelta: { '*': 0 },
          northDelta: { '*': 0 },
          southDelta: { '*': 0 },
        },

        // Recreation economy › Angling (dollars a year)
        'rec-economy-fishing': {
          delta: { '*': 0 },
          suisun: { '*': 0 },
          centralDelta: { '*': 0 },
          northDelta: { '*': 0 },
          southDelta: { '*': 0 },
        },
      },
    },

    // Business as Usual (CalSim)
    csbau: {
      measures: {
        // Salinity stress › Day use (share of days, 0 to 1)
        'rec-salinity-dayUse': {
          delta: { run: 0.3582, wet: 0.3757, dry: 0.2967 },
          suisun: { run: 0.8331, wet: 0.839, dry: 0.8012 },
          centralDelta: { run: 0.443, wet: 0.4608, dry: 0.3388 },
          northDelta: { run: 0, wet: 0, dry: 0 },
          southDelta: { run: 0.09, wet: 0.1293, dry: 0.0039 },
        },

        // Salinity stress › Boating (share of days, 0 to 1)
        'rec-salinity-boating': {
          delta: { run: 0.3582, wet: 0.3757, dry: 0.2967 },
          suisun: { run: 0.8331, wet: 0.839, dry: 0.8012 },
          centralDelta: { run: 0.443, wet: 0.4608, dry: 0.3388 },
          northDelta: { run: 0, wet: 0, dry: 0 },
          southDelta: { run: 0.09, wet: 0.1293, dry: 0.0039 },
        },

        // Salinity stress › Birding (share of days, 0 to 1)
        'rec-salinity-birding': {
          delta: { run: 0.2701, wet: 0.2739, dry: 0.2402 },
          suisun: { run: 0.7891, wet: 0.7922, dry: 0.7531 },
          centralDelta: { run: 0.2589, wet: 0.2696, dry: 0.1846 },
          northDelta: { run: 0, wet: 0, dry: 0 },
          southDelta: { run: 0, wet: 0, dry: 0 },
        },

        // Salinity stress › Waterfowl hunting (share of days, 0 to 1)
        'rec-salinity-waterfowl': {
          delta: { run: 0.2456, wet: 0.243, dry: 0.2215 },
          suisun: { run: 0.751, wet: 0.75, dry: 0.7131 },
          centralDelta: { run: 0.2058, wet: 0.1973, dry: 0.1536 },
          northDelta: { run: 0, wet: 0, dry: 0 },
          southDelta: { run: 0, wet: 0, dry: 0 },
        },

        // Salinity stress › Angling (share of days, 0 to 1)
        'rec-salinity-angling': {
          delta: { run: 0.1484, wet: 0.144, dry: 0.1271 },
          suisun: { run: 0.5276, wet: 0.5087, dry: 0.4727 },
          centralDelta: { run: 0.0585, wet: 0.0597, dry: 0.0319 },
          northDelta: { run: 0, wet: 0, dry: 0 },
          southDelta: { run: 0, wet: 0, dry: 0 },
        },

        // Temperature stress › Day use (share of days, 0 to 1)
        'rec-temperature-dayUse': {
          delta: { run: 0.4137, wet: 0.0377, dry: 0.7847 },
          suisun: { run: 0.4211, wet: 0.0506, dry: 0.7865 },
          centralDelta: { run: 0.4136, wet: 0.0419, dry: 0.7802 },
          northDelta: { run: 0.3854, wet: 0.0092, dry: 0.7564 },
          southDelta: { run: 0.4263, wet: 0.0409, dry: 0.8063 },
        },

        // Temperature stress › Boating (share of days, 0 to 1)
        'rec-temperature-boating': {
          delta: { run: 0.4137, wet: 0.0377, dry: 0.7847 },
          suisun: { run: 0.4211, wet: 0.0506, dry: 0.7865 },
          centralDelta: { run: 0.4136, wet: 0.0419, dry: 0.7802 },
          northDelta: { run: 0.3854, wet: 0.0092, dry: 0.7564 },
          southDelta: { run: 0.4263, wet: 0.0409, dry: 0.8063 },
        },

        // Temperature stress › Birding (share of days, 0 to 1)
        'rec-temperature-birding': {
          delta: { run: 0.3708, wet: 0.008, dry: 0.7287 },
          suisun: { run: 0.3659, wet: 0.0107, dry: 0.7162 },
          centralDelta: { run: 0.3769, wet: 0.0046, dry: 0.7441 },
          northDelta: { run: 0.3448, wet: 0, dry: 0.6849 },
          southDelta: { run: 0.3865, wet: 0.0142, dry: 0.7538 },
        },

        // Temperature stress › Waterfowl hunting (share of days, 0 to 1)
        'rec-temperature-waterfowl': {
          delta: { run: 0.1241, wet: 0, dry: 0.2465 },
          suisun: { run: 0.0495, wet: 0, dry: 0.0984 },
          centralDelta: { run: 0.136, wet: 0, dry: 0.2702 },
          northDelta: { run: 0.0773, wet: 0, dry: 0.1535 },
          southDelta: { run: 0.2097, wet: 0, dry: 0.4165 },
        },

        // Temperature stress › Angling (share of days, 0 to 1)
        'rec-temperature-angling': {
          delta: { run: 0.4384, wet: 0.059, dry: 0.8128 },
          suisun: { run: 0.4522, wet: 0.0789, dry: 0.8204 },
          centralDelta: { run: 0.4379, wet: 0.0631, dry: 0.8075 },
          northDelta: { run: 0.4051, wet: 0.0162, dry: 0.7887 },
          southDelta: { run: 0.449, wet: 0.0656, dry: 0.8273 },
        },

        // Temperature stress › Cold-water day use (share of days, 0 to 1)
        'rec-temperature-dayUseCold': {
          delta: { run: 0.5417, wet: 0.923, dry: 0.1656 },
          suisun: { run: 0.5261, wet: 0.9034, dry: 0.154 },
          centralDelta: { run: 0.538, wet: 0.9175, dry: 0.1636 },
          northDelta: { run: 0.577, wet: 0.9714, dry: 0.1881 },
          southDelta: { run: 0.5355, wet: 0.9135, dry: 0.1627 },
        },
      },
    },

    // Eco Machine
    em: {
      scores: {
        // Recreation (score)
        recreation: 2,

        // Salinity stress (score)
        'rec-salinity': 0,

        // Temperature stress (score)
        'rec-temperature': 0,

        // Habitat Restoration (score)
        'rec-restoration': 3,

        // Recreation economy (score)
        'rec-economy': 3,

        // Infrastructure impact (score)
        'rec-infrastructure': 0,
      },
      measures: {
        // Salinity stress › Day use (share of days, 0 to 1)
        'rec-salinity-dayUse': {
          delta: { run: 0.3191, wet: 0.3221, dry: 0.276 },
          suisun: { run: 0.8432, wet: 0.8853, dry: 0.7746 },
          centralDelta: { run: 0.3737, wet: 0.3516, dry: 0.2911 },
          northDelta: { run: 0, wet: 0, dry: 0 },
          southDelta: { run: 0.0113, wet: 0.0067, dry: 0.0015 },
        },

        // Salinity stress › Boating (share of days, 0 to 1)
        'rec-salinity-boating': {
          delta: { run: 0.3191, wet: 0.3221, dry: 0.276 },
          suisun: { run: 0.8432, wet: 0.8853, dry: 0.7746 },
          centralDelta: { run: 0.3737, wet: 0.3516, dry: 0.2911 },
          northDelta: { run: 0, wet: 0, dry: 0 },
          southDelta: { run: 0.0113, wet: 0.0067, dry: 0.0015 },
        },

        // Salinity stress › Birding (share of days, 0 to 1)
        'rec-salinity-birding': {
          delta: { run: 0.2402, wet: 0.2426, dry: 0.2096 },
          suisun: { run: 0.7738, wet: 0.813, dry: 0.6964 },
          centralDelta: { run: 0.1662, wet: 0.14, dry: 0.1263 },
          northDelta: { run: 0, wet: 0, dry: 0 },
          southDelta: { run: 0, wet: 0, dry: 0 },
        },

        // Salinity stress › Waterfowl hunting (share of days, 0 to 1)
        'rec-salinity-waterfowl': {
          delta: { run: 0.214, wet: 0.2179, dry: 0.1898 },
          suisun: { run: 0.7281, wet: 0.7524, dry: 0.6578 },
          centralDelta: { run: 0.1136, wet: 0.1059, dry: 0.0902 },
          northDelta: { run: 0, wet: 0, dry: 0 },
          southDelta: { run: 0, wet: 0, dry: 0 },
        },

        // Salinity stress › Angling (share of days, 0 to 1)
        'rec-salinity-angling': {
          delta: { run: 0.1391, wet: 0.1312, dry: 0.1188 },
          suisun: { run: 0.5087, wet: 0.4894, dry: 0.445 },
          centralDelta: { run: 0.0426, wet: 0.0314, dry: 0.0267 },
          northDelta: { run: 0, wet: 0, dry: 0 },
          southDelta: { run: 0, wet: 0, dry: 0 },
        },

        // Temperature stress › Day use (share of days, 0 to 1)
        'rec-temperature-dayUse': {
          delta: { run: 0.4206, wet: 0.0428, dry: 0.7973 },
          suisun: { run: 0.4268, wet: 0.0551, dry: 0.7975 },
          centralDelta: { run: 0.4302, wet: 0.0457, dry: 0.8136 },
          northDelta: { run: 0.3917, wet: 0.0073, dry: 0.775 },
          southDelta: { run: 0.4247, wet: 0.0527, dry: 0.7957 },
        },

        // Temperature stress › Boating (share of days, 0 to 1)
        'rec-temperature-boating': {
          delta: { run: 0.4206, wet: 0.0428, dry: 0.7973 },
          suisun: { run: 0.4268, wet: 0.0551, dry: 0.7975 },
          centralDelta: { run: 0.4302, wet: 0.0457, dry: 0.8136 },
          northDelta: { run: 0.3917, wet: 0.0073, dry: 0.775 },
          southDelta: { run: 0.4247, wet: 0.0527, dry: 0.7957 },
        },

        // Temperature stress › Birding (share of days, 0 to 1)
        'rec-temperature-birding': {
          delta: { run: 0.368, wet: 0.0104, dry: 0.7246 },
          suisun: { run: 0.3625, wet: 0.0082, dry: 0.7158 },
          centralDelta: { run: 0.3774, wet: 0.007, dry: 0.7468 },
          northDelta: { run: 0.3404, wet: 0.0009, dry: 0.679 },
          southDelta: { run: 0.3818, wet: 0.0222, dry: 0.7404 },
        },

        // Temperature stress › Waterfowl hunting (share of days, 0 to 1)
        'rec-temperature-waterfowl': {
          delta: { run: 0.1233, wet: 0, dry: 0.2462 },
          suisun: { run: 0.0489, wet: 0, dry: 0.0977 },
          centralDelta: { run: 0.1335, wet: 0, dry: 0.2665 },
          northDelta: { run: 0.0668, wet: 0, dry: 0.1334 },
          southDelta: { run: 0.2169, wet: 0, dry: 0.4332 },
        },

        // Temperature stress › Angling (share of days, 0 to 1)
        'rec-temperature-angling': {
          delta: { run: 0.4476, wet: 0.0632, dry: 0.8309 },
          suisun: { run: 0.4626, wet: 0.0839, dry: 0.8402 },
          centralDelta: { run: 0.454, wet: 0.0624, dry: 0.8446 },
          northDelta: { run: 0.4207, wet: 0.0169, dry: 0.8233 },
          southDelta: { run: 0.4458, wet: 0.0764, dry: 0.8142 },
        },

        // Temperature stress › Cold-water day use (share of days, 0 to 1)
        'rec-temperature-dayUseCold': {
          delta: { run: 0.5345, wet: 0.9196, dry: 0.1505 },
          suisun: { run: 0.5152, wet: 0.8959, dry: 0.1356 },
          centralDelta: { run: 0.5282, wet: 0.9166, dry: 0.1409 },
          northDelta: { run: 0.562, wet: 0.9749, dry: 0.1503 },
          southDelta: { run: 0.5397, wet: 0.9068, dry: 0.1736 },
        },

        // Habitat Restoration › Restored acres (acres)
        'rec-restoration-acres': {
          delta: { '*': 43100 },
          suisun: { '*': 41720 },
          centralDelta: { '*': 1380 },
        },

        // Recreation economy › Day use and boating (dollars a year)
        'rec-economy-amenity': {
          delta: { '*': 16127000 },
          suisun: { '*': 15613000 },
          centralDelta: { '*': 514000 },
          northDelta: { '*': 0 },
          southDelta: { '*': 0 },
        },

        // Recreation economy › Birding (dollars a year)
        'rec-economy-biodiversity': {
          delta: { '*': 6363000 },
          suisun: { '*': 6139000 },
          centralDelta: { '*': 224000 },
          northDelta: { '*': 0 },
          southDelta: { '*': 0 },
        },

        // Recreation economy › Waterfowl hunting (dollars a year)
        'rec-economy-hunting': {
          delta: { '*': 4851000 },
          suisun: { '*': 3903000 },
          centralDelta: { '*': 948000 },
          northDelta: { '*': 0 },
          southDelta: { '*': 0 },
        },

        // Recreation economy › Angling (dollars a year)
        'rec-economy-fishing': {
          delta: { '*': 12259000 },
          suisun: { '*': 11868000 },
          centralDelta: { '*': 391000 },
          northDelta: { '*': 0 },
          southDelta: { '*': 0 },
        },
      },
    },

    // New Green Watershed
    ngw: {
      scores: {
        // Recreation (score)
        recreation: 3,

        // Salinity stress (score)
        'rec-salinity': 0,

        // Temperature stress (score)
        'rec-temperature': 0,

        // Habitat Restoration (score)
        'rec-restoration': 5,

        // Recreation economy (score)
        'rec-economy': 5,

        // Infrastructure impact (score)
        'rec-infrastructure': 0,
      },
      measures: {
        // Salinity stress › Day use (share of days, 0 to 1)
        'rec-salinity-dayUse': {
          delta: { run: 0.3203, wet: 0.3218, dry: 0.278 },
          suisun: { run: 0.843, wet: 0.8849, dry: 0.7746 },
          centralDelta: { run: 0.3765, wet: 0.3519, dry: 0.2966 },
          northDelta: { run: 0, wet: 0, dry: 0 },
          southDelta: { run: 0.0129, wet: 0.0058, dry: 0.0033 },
        },

        // Salinity stress › Boating (share of days, 0 to 1)
        'rec-salinity-boating': {
          delta: { run: 0.3203, wet: 0.3218, dry: 0.278 },
          suisun: { run: 0.843, wet: 0.8849, dry: 0.7746 },
          centralDelta: { run: 0.3765, wet: 0.3519, dry: 0.2966 },
          northDelta: { run: 0, wet: 0, dry: 0 },
          southDelta: { run: 0.0129, wet: 0.0058, dry: 0.0033 },
        },

        // Salinity stress › Birding (share of days, 0 to 1)
        'rec-salinity-birding': {
          delta: { run: 0.2409, wet: 0.2423, dry: 0.2112 },
          suisun: { run: 0.774, wet: 0.8113, dry: 0.6984 },
          centralDelta: { run: 0.1687, wet: 0.1403, dry: 0.1299 },
          northDelta: { run: 0, wet: 0, dry: 0 },
          southDelta: { run: 0, wet: 0, dry: 0 },
        },

        // Salinity stress › Waterfowl hunting (share of days, 0 to 1)
        'rec-salinity-waterfowl': {
          delta: { run: 0.214, wet: 0.2176, dry: 0.1901 },
          suisun: { run: 0.7273, wet: 0.751, dry: 0.6574 },
          centralDelta: { run: 0.1145, wet: 0.1062, dry: 0.0914 },
          northDelta: { run: 0, wet: 0, dry: 0 },
          southDelta: { run: 0, wet: 0, dry: 0 },
        },

        // Salinity stress › Angling (share of days, 0 to 1)
        'rec-salinity-angling': {
          delta: { run: 0.1393, wet: 0.1306, dry: 0.1195 },
          suisun: { run: 0.5079, wet: 0.4866, dry: 0.4457 },
          centralDelta: { run: 0.0439, wet: 0.0317, dry: 0.0288 },
          northDelta: { run: 0, wet: 0, dry: 0 },
          southDelta: { run: 0, wet: 0, dry: 0 },
        },

        // Temperature stress › Day use (share of days, 0 to 1)
        'rec-temperature-dayUse': {
          delta: { run: 0.4205, wet: 0.0425, dry: 0.7975 },
          suisun: { run: 0.4268, wet: 0.0551, dry: 0.7975 },
          centralDelta: { run: 0.4299, wet: 0.0444, dry: 0.8142 },
          northDelta: { run: 0.3917, wet: 0.0073, dry: 0.775 },
          southDelta: { run: 0.4247, wet: 0.0527, dry: 0.7957 },
        },

        // Temperature stress › Boating (share of days, 0 to 1)
        'rec-temperature-boating': {
          delta: { run: 0.4205, wet: 0.0425, dry: 0.7975 },
          suisun: { run: 0.4268, wet: 0.0551, dry: 0.7975 },
          centralDelta: { run: 0.4299, wet: 0.0444, dry: 0.8142 },
          northDelta: { run: 0.3917, wet: 0.0073, dry: 0.775 },
          southDelta: { run: 0.4247, wet: 0.0527, dry: 0.7957 },
        },

        // Temperature stress › Birding (share of days, 0 to 1)
        'rec-temperature-birding': {
          delta: { run: 0.3682, wet: 0.0103, dry: 0.7251 },
          suisun: { run: 0.3629, wet: 0.0082, dry: 0.7165 },
          centralDelta: { run: 0.3774, wet: 0.0064, dry: 0.7474 },
          northDelta: { run: 0.3409, wet: 0.0009, dry: 0.6799 },
          southDelta: { run: 0.3818, wet: 0.0222, dry: 0.7404 },
        },

        // Temperature stress › Waterfowl hunting (share of days, 0 to 1)
        'rec-temperature-waterfowl': {
          delta: { run: 0.1235, wet: 0, dry: 0.2468 },
          suisun: { run: 0.0491, wet: 0, dry: 0.098 },
          centralDelta: { run: 0.1335, wet: 0, dry: 0.2665 },
          northDelta: { run: 0.0679, wet: 0, dry: 0.1357 },
          southDelta: { run: 0.2169, wet: 0, dry: 0.4332 },
        },

        // Temperature stress › Angling (share of days, 0 to 1)
        'rec-temperature-angling': {
          delta: { run: 0.4474, wet: 0.063, dry: 0.8308 },
          suisun: { run: 0.4624, wet: 0.0839, dry: 0.8398 },
          centralDelta: { run: 0.4536, wet: 0.0618, dry: 0.8443 },
          northDelta: { run: 0.4207, wet: 0.0169, dry: 0.8233 },
          southDelta: { run: 0.4458, wet: 0.0764, dry: 0.8142 },
        },

        // Temperature stress › Cold-water day use (share of days, 0 to 1)
        'rec-temperature-dayUseCold': {
          delta: { run: 0.5345, wet: 0.9196, dry: 0.1504 },
          suisun: { run: 0.515, wet: 0.8959, dry: 0.1352 },
          centralDelta: { run: 0.528, wet: 0.9169, dry: 0.1403 },
          northDelta: { run: 0.562, wet: 0.9749, dry: 0.1503 },
          southDelta: { run: 0.5397, wet: 0.9065, dry: 0.174 },
        },

        // Habitat Restoration › Restored acres (acres)
        'rec-restoration-acres': {
          delta: { '*': 458948 },
          suisun: { '*': 41720 },
          centralDelta: { '*': 32692 },
          northDelta: { '*': 186769 },
          southDelta: { '*': 197767 },
        },

        // Recreation economy › Day use and boating (dollars a year)
        'rec-economy-amenity': {
          delta: { '*': 75352000 },
          suisun: { '*': 15613000 },
          centralDelta: { '*': 15747000 },
          northDelta: { '*': 20865000 },
          southDelta: { '*': 23127000 },
        },

        // Recreation economy › Birding (dollars a year)
        'rec-economy-biodiversity': {
          delta: { '*': 32774000 },
          suisun: { '*': 6791000 },
          centralDelta: { '*': 6849000 },
          northDelta: { '*': 9075000 },
          southDelta: { '*': 10059000 },
        },

        // Recreation economy › Waterfowl hunting (dollars a year)
        'rec-economy-hunting': {
          delta: { '*': 18838000 },
          suisun: { '*': 3903000 },
          centralDelta: { '*': 3937000 },
          northDelta: { '*': 5216000 },
          southDelta: { '*': 5782000 },
        },

        // Recreation economy › Angling (dollars a year)
        'rec-economy-fishing': {
          delta: { '*': 57278000 },
          suisun: { '*': 11868000 },
          centralDelta: { '*': 11970000 },
          northDelta: { '*': 15860000 },
          southDelta: { '*': 17580000 },
        },
      },
    },

    // Bolster & Fortify
    bf: {
      scores: {
        // Recreation (score)
        recreation: -1,

        // Salinity stress (score)
        'rec-salinity': 0,

        // Temperature stress (score)
        'rec-temperature': 0,

        // Habitat Restoration (score)
        'rec-restoration': 0,

        // Recreation economy (score)
        'rec-economy': 0,

        // Infrastructure impact (score)
        'rec-infrastructure': -1,
      },
      measures: {
        // Salinity stress › Day use (share of days, 0 to 1)
        'rec-salinity-dayUse': {
          delta: { run: 0.3255, wet: 0.3284, dry: 0.2833 },
          suisun: { run: 0.8209, wet: 0.8507, dry: 0.7609 },
          centralDelta: { run: 0.4042, wet: 0.386, dry: 0.3221 },
          northDelta: { run: 0, wet: 0, dry: 0 },
          southDelta: { run: 0.0234, wet: 0.0256, dry: 0.0088 },
        },

        // Salinity stress › Boating (share of days, 0 to 1)
        'rec-salinity-boating': {
          delta: { run: 0.3255, wet: 0.3284, dry: 0.2833 },
          suisun: { run: 0.8209, wet: 0.8507, dry: 0.7609 },
          centralDelta: { run: 0.4042, wet: 0.386, dry: 0.3221 },
          northDelta: { run: 0, wet: 0, dry: 0 },
          southDelta: { run: 0.0234, wet: 0.0256, dry: 0.0088 },
        },

        // Salinity stress › Birding (share of days, 0 to 1)
        'rec-salinity-birding': {
          delta: { run: 0.241, wet: 0.2329, dry: 0.2161 },
          suisun: { run: 0.7366, wet: 0.7455, dry: 0.6831 },
          centralDelta: { run: 0.2022, wet: 0.1653, dry: 0.1612 },
          northDelta: { run: 0, wet: 0, dry: 0 },
          southDelta: { run: 0, wet: 0, dry: 0 },
        },

        // Salinity stress › Waterfowl hunting (share of days, 0 to 1)
        'rec-salinity-waterfowl': {
          delta: { run: 0.2117, wet: 0.2086, dry: 0.1913 },
          suisun: { run: 0.6996, wet: 0.7031, dry: 0.6452 },
          centralDelta: { run: 0.1309, wet: 0.1169, dry: 0.1069 },
          northDelta: { run: 0, wet: 0, dry: 0 },
          southDelta: { run: 0, wet: 0, dry: 0 },
        },

        // Salinity stress › Angling (share of days, 0 to 1)
        'rec-salinity-angling': {
          delta: { run: 0.1188, wet: 0.1058, dry: 0.0995 },
          suisun: { run: 0.4193, wet: 0.3808, dry: 0.36 },
          centralDelta: { run: 0.0497, wet: 0.0377, dry: 0.0337 },
          northDelta: { run: 0, wet: 0, dry: 0 },
          southDelta: { run: 0, wet: 0, dry: 0 },
        },

        // Temperature stress › Day use (share of days, 0 to 1)
        'rec-temperature-dayUse': {
          delta: { run: 0.4198, wet: 0.0429, dry: 0.7957 },
          suisun: { run: 0.4251, wet: 0.0575, dry: 0.7917 },
          centralDelta: { run: 0.4292, wet: 0.0447, dry: 0.8127 },
          northDelta: { run: 0.3919, wet: 0.0073, dry: 0.7755 },
          southDelta: { run: 0.4242, wet: 0.0518, dry: 0.7957 },
        },

        // Temperature stress › Boating (share of days, 0 to 1)
        'rec-temperature-boating': {
          delta: { run: 0.4198, wet: 0.0429, dry: 0.7957 },
          suisun: { run: 0.4251, wet: 0.0575, dry: 0.7917 },
          centralDelta: { run: 0.4292, wet: 0.0447, dry: 0.8127 },
          northDelta: { run: 0.3919, wet: 0.0073, dry: 0.7755 },
          southDelta: { run: 0.4242, wet: 0.0518, dry: 0.7957 },
        },

        // Temperature stress › Birding (share of days, 0 to 1)
        'rec-temperature-birding': {
          delta: { run: 0.3692, wet: 0.0118, dry: 0.7257 },
          suisun: { run: 0.3659, wet: 0.013, dry: 0.7179 },
          centralDelta: { run: 0.3776, wet: 0.0073, dry: 0.7468 },
          northDelta: { run: 0.342, wet: 0.0009, dry: 0.6821 },
          southDelta: { run: 0.382, wet: 0.0225, dry: 0.7404 },
        },

        // Temperature stress › Waterfowl hunting (share of days, 0 to 1)
        'rec-temperature-waterfowl': {
          delta: { run: 0.1242, wet: 0, dry: 0.2481 },
          suisun: { run: 0.0501, wet: 0, dry: 0.1001 },
          centralDelta: { run: 0.1354, wet: 0, dry: 0.2705 },
          northDelta: { run: 0.0675, wet: 0, dry: 0.1348 },
          southDelta: { run: 0.2168, wet: 0, dry: 0.4329 },
        },

        // Temperature stress › Angling (share of days, 0 to 1)
        'rec-temperature-angling': {
          delta: { run: 0.447, wet: 0.0634, dry: 0.8295 },
          suisun: { run: 0.4617, wet: 0.0873, dry: 0.835 },
          centralDelta: { run: 0.4533, wet: 0.0615, dry: 0.844 },
          northDelta: { run: 0.4207, wet: 0.0169, dry: 0.8233 },
          southDelta: { run: 0.4452, wet: 0.0752, dry: 0.8142 },
        },

        // Temperature stress › Cold-water day use (share of days, 0 to 1)
        'rec-temperature-dayUseCold': {
          delta: { run: 0.5354, wet: 0.9195, dry: 0.1523 },
          suisun: { run: 0.5181, wet: 0.8938, dry: 0.1434 },
          centralDelta: { run: 0.529, wet: 0.9187, dry: 0.1403 },
          northDelta: { run: 0.5616, wet: 0.974, dry: 0.1503 },
          southDelta: { run: 0.5397, wet: 0.9068, dry: 0.1736 },
        },

        // Habitat Restoration › Restored acres (acres)
        'rec-restoration-acres': {
          delta: { '*': 0 },
          suisun: { '*': 0 },
          centralDelta: { '*': 0 },
          northDelta: { '*': 0 },
          southDelta: { '*': 0 },
        },

        // Recreation economy › Day use and boating (dollars a year)
        'rec-economy-amenity': {
          delta: { '*': 0 },
          suisun: { '*': 0 },
          centralDelta: { '*': 0 },
          northDelta: { '*': 0 },
          southDelta: { '*': 0 },
        },

        // Recreation economy › Birding (dollars a year)
        'rec-economy-biodiversity': {
          delta: { '*': 0 },
          suisun: { '*': 0 },
          centralDelta: { '*': 0 },
          northDelta: { '*': 0 },
          southDelta: { '*': 0 },
        },

        // Recreation economy › Waterfowl hunting (dollars a year)
        'rec-economy-hunting': {
          delta: { '*': 0 },
          suisun: { '*': 0 },
          centralDelta: { '*': 0 },
          northDelta: { '*': 0 },
          southDelta: { '*': 0 },
        },

        // Recreation economy › Angling (dollars a year)
        'rec-economy-fishing': {
          delta: { '*': 0 },
          suisun: { '*': 0 },
          centralDelta: { '*': 0 },
          northDelta: { '*': 0 },
          southDelta: { '*': 0 },
        },
      },
    },

    // Calling on Reserves
    cor: {
      scores: {
        // Recreation (score)
        recreation: 0,

        // Salinity stress (score)
        'rec-salinity': 0,

        // Temperature stress (score)
        'rec-temperature': 0,

        // Habitat Restoration (score)
        'rec-restoration': 0,

        // Recreation economy (score)
        'rec-economy': 0,

        // Infrastructure impact (score)
        'rec-infrastructure': 0,
      },
      measures: {
        // Salinity stress › Day use (share of days, 0 to 1)
        'rec-salinity-dayUse': {
          delta: { run: 0.3517, wet: 0.3625, dry: 0.296 },
          suisun: { run: 0.8246, wet: 0.822, dry: 0.7999 },
          centralDelta: { run: 0.428, wet: 0.4294, dry: 0.3376 },
          northDelta: { run: 0, wet: 0, dry: 0 },
          southDelta: { run: 0.0894, wet: 0.129, dry: 0.0039 },
        },

        // Salinity stress › Boating (share of days, 0 to 1)
        'rec-salinity-boating': {
          delta: { run: 0.3517, wet: 0.3625, dry: 0.296 },
          suisun: { run: 0.8246, wet: 0.822, dry: 0.7999 },
          centralDelta: { run: 0.428, wet: 0.4294, dry: 0.3376 },
          northDelta: { run: 0, wet: 0, dry: 0 },
          southDelta: { run: 0.0894, wet: 0.129, dry: 0.0039 },
        },

        // Salinity stress › Birding (share of days, 0 to 1)
        'rec-salinity-birding': {
          delta: { run: 0.2661, wet: 0.2657, dry: 0.2398 },
          suisun: { run: 0.7817, wet: 0.7763, dry: 0.7531 },
          centralDelta: { run: 0.2511, wet: 0.2545, dry: 0.1831 },
          northDelta: { run: 0, wet: 0, dry: 0 },
          southDelta: { run: 0, wet: 0, dry: 0 },
        },

        // Salinity stress › Waterfowl hunting (share of days, 0 to 1)
        'rec-salinity-waterfowl': {
          delta: { run: 0.2438, wet: 0.2391, dry: 0.2217 },
          suisun: { run: 0.7444, wet: 0.7351, dry: 0.7138 },
          centralDelta: { run: 0.2052, wet: 0.1967, dry: 0.1536 },
          northDelta: { run: 0, wet: 0, dry: 0 },
          southDelta: { run: 0, wet: 0, dry: 0 },
        },

        // Salinity stress › Angling (share of days, 0 to 1)
        'rec-salinity-angling': {
          delta: { run: 0.1457, wet: 0.1373, dry: 0.1281 },
          suisun: { run: 0.5175, wet: 0.4841, dry: 0.4754 },
          centralDelta: { run: 0.0581, wet: 0.0579, dry: 0.0328 },
          northDelta: { run: 0, wet: 0, dry: 0 },
          southDelta: { run: 0, wet: 0, dry: 0 },
        },

        // Temperature stress › Day use (share of days, 0 to 1)
        'rec-temperature-dayUse': {
          delta: { run: 0.4135, wet: 0.0374, dry: 0.7844 },
          suisun: { run: 0.4206, wet: 0.0502, dry: 0.7859 },
          centralDelta: { run: 0.4137, wet: 0.0419, dry: 0.7805 },
          northDelta: { run: 0.3851, wet: 0.0092, dry: 0.7559 },
          southDelta: { run: 0.4258, wet: 0.0403, dry: 0.806 },
        },

        // Temperature stress › Boating (share of days, 0 to 1)
        'rec-temperature-boating': {
          delta: { run: 0.4135, wet: 0.0374, dry: 0.7844 },
          suisun: { run: 0.4206, wet: 0.0502, dry: 0.7859 },
          centralDelta: { run: 0.4137, wet: 0.0419, dry: 0.7805 },
          northDelta: { run: 0.3851, wet: 0.0092, dry: 0.7559 },
          southDelta: { run: 0.4258, wet: 0.0403, dry: 0.806 },
        },

        // Temperature stress › Birding (share of days, 0 to 1)
        'rec-temperature-birding': {
          delta: { run: 0.3703, wet: 0.008, dry: 0.7277 },
          suisun: { run: 0.3659, wet: 0.0107, dry: 0.7162 },
          centralDelta: { run: 0.3767, wet: 0.0043, dry: 0.7441 },
          northDelta: { run: 0.3436, wet: 0, dry: 0.6826 },
          southDelta: { run: 0.3856, wet: 0.0145, dry: 0.7517 },
        },

        // Temperature stress › Waterfowl hunting (share of days, 0 to 1)
        'rec-temperature-waterfowl': {
          delta: { run: 0.1242, wet: 0, dry: 0.2468 },
          suisun: { run: 0.0497, wet: 0, dry: 0.0987 },
          centralDelta: { run: 0.1366, wet: 0, dry: 0.2714 },
          northDelta: { run: 0.0766, wet: 0, dry: 0.1521 },
          southDelta: { run: 0.2098, wet: 0, dry: 0.4168 },
        },

        // Temperature stress › Angling (share of days, 0 to 1)
        'rec-temperature-angling': {
          delta: { run: 0.4382, wet: 0.0589, dry: 0.8123 },
          suisun: { run: 0.452, wet: 0.0786, dry: 0.8204 },
          centralDelta: { run: 0.438, wet: 0.0634, dry: 0.8075 },
          northDelta: { run: 0.4046, wet: 0.0166, dry: 0.7873 },
          southDelta: { run: 0.4484, wet: 0.0649, dry: 0.8267 },
        },

        // Temperature stress › Cold-water day use (share of days, 0 to 1)
        'rec-temperature-dayUseCold': {
          delta: { run: 0.5419, wet: 0.9235, dry: 0.1655 },
          suisun: { run: 0.5261, wet: 0.9034, dry: 0.154 },
          centralDelta: { run: 0.5381, wet: 0.9181, dry: 0.1633 },
          northDelta: { run: 0.577, wet: 0.9714, dry: 0.1881 },
          southDelta: { run: 0.5361, wet: 0.9147, dry: 0.1627 },
        },

        // Habitat Restoration › Restored acres (acres)
        'rec-restoration-acres': {
          delta: { '*': 0 },
          suisun: { '*': 0 },
          centralDelta: { '*': 0 },
          northDelta: { '*': 0 },
          southDelta: { '*': 0 },
        },

        // Recreation economy › Day use and boating (dollars a year)
        'rec-economy-amenity': {
          delta: { '*': 0 },
          suisun: { '*': 0 },
          centralDelta: { '*': 0 },
          northDelta: { '*': 0 },
          southDelta: { '*': 0 },
        },

        // Recreation economy › Birding (dollars a year)
        'rec-economy-biodiversity': {
          delta: { '*': 0 },
          suisun: { '*': 0 },
          centralDelta: { '*': 0 },
          northDelta: { '*': 0 },
          southDelta: { '*': 0 },
        },

        // Recreation economy › Waterfowl hunting (dollars a year)
        'rec-economy-hunting': {
          delta: { '*': 0 },
          suisun: { '*': 0 },
          centralDelta: { '*': 0 },
          northDelta: { '*': 0 },
          southDelta: { '*': 0 },
        },

        // Recreation economy › Angling (dollars a year)
        'rec-economy-fishing': {
          delta: { '*': 0 },
          suisun: { '*': 0 },
          centralDelta: { '*': 0 },
          northDelta: { '*': 0 },
          southDelta: { '*': 0 },
        },
      },
    },

    // A Tunnel
    tunnel: {
      scores: {
        // Recreation (score)
        recreation: -1,

        // Salinity stress (score)
        'rec-salinity': 0,

        // Temperature stress (score)
        'rec-temperature': 0,

        // Habitat Restoration (score)
        'rec-restoration': 0,

        // Recreation economy (score)
        'rec-economy': 0,

        // Infrastructure impact (score)
        'rec-infrastructure': -3,
      },
      measures: {
        // Salinity stress › Day use (share of days, 0 to 1)
        'rec-salinity-dayUse': {
          delta: { run: 0.3655, wet: 0.3846, dry: 0.3021 },
          suisun: { run: 0.8447, wet: 0.8456, dry: 0.8197 },
          centralDelta: { run: 0.4549, wet: 0.4888, dry: 0.3367 },
          northDelta: { run: 0, wet: 0, dry: 0 },
          southDelta: { run: 0.0937, wet: 0.1271, dry: 0.0088 },
        },

        // Salinity stress › Boating (share of days, 0 to 1)
        'rec-salinity-boating': {
          delta: { run: 0.3655, wet: 0.3846, dry: 0.3021 },
          suisun: { run: 0.8447, wet: 0.8456, dry: 0.8197 },
          centralDelta: { run: 0.4549, wet: 0.4888, dry: 0.3367 },
          northDelta: { run: 0, wet: 0, dry: 0 },
          southDelta: { run: 0.0937, wet: 0.1271, dry: 0.0088 },
        },

        // Salinity stress › Birding (share of days, 0 to 1)
        'rec-salinity-birding': {
          delta: { run: 0.2726, wet: 0.2787, dry: 0.241 },
          suisun: { run: 0.7903, wet: 0.7995, dry: 0.7486 },
          centralDelta: { run: 0.2669, wet: 0.2804, dry: 0.1916 },
          northDelta: { run: 0, wet: 0, dry: 0 },
          southDelta: { run: 0, wet: 0, dry: 0 },
        },

        // Salinity stress › Waterfowl hunting (share of days, 0 to 1)
        'rec-salinity-waterfowl': {
          delta: { run: 0.2459, wet: 0.2477, dry: 0.218 },
          suisun: { run: 0.7556, wet: 0.7618, dry: 0.7114 },
          centralDelta: { run: 0.2027, wet: 0.2034, dry: 0.1427 },
          northDelta: { run: 0, wet: 0, dry: 0 },
          southDelta: { run: 0, wet: 0, dry: 0 },
        },

        // Salinity stress › Angling (share of days, 0 to 1)
        'rec-salinity-angling': {
          delta: { run: 0.149, wet: 0.1498, dry: 0.1228 },
          suisun: { run: 0.523, wet: 0.5291, dry: 0.4426 },
          centralDelta: { run: 0.0649, wet: 0.0625, dry: 0.0431 },
          northDelta: { run: 0, wet: 0, dry: 0 },
          southDelta: { run: 0, wet: 0, dry: 0 },
        },

        // Temperature stress › Day use (share of days, 0 to 1)
        'rec-temperature-dayUse': {
          delta: { run: 0.4136, wet: 0.0371, dry: 0.785 },
          suisun: { run: 0.4218, wet: 0.0499, dry: 0.7886 },
          centralDelta: { run: 0.4128, wet: 0.0409, dry: 0.7796 },
          northDelta: { run: 0.3854, wet: 0.0092, dry: 0.7564 },
          southDelta: { run: 0.4261, wet: 0.0406, dry: 0.8063 },
        },

        // Temperature stress › Boating (share of days, 0 to 1)
        'rec-temperature-boating': {
          delta: { run: 0.4136, wet: 0.0371, dry: 0.785 },
          suisun: { run: 0.4218, wet: 0.0499, dry: 0.7886 },
          centralDelta: { run: 0.4128, wet: 0.0409, dry: 0.7796 },
          northDelta: { run: 0.3854, wet: 0.0092, dry: 0.7564 },
          southDelta: { run: 0.4261, wet: 0.0406, dry: 0.8063 },
        },

        // Temperature stress › Birding (share of days, 0 to 1)
        'rec-temperature-birding': {
          delta: { run: 0.3713, wet: 0.0074, dry: 0.7303 },
          suisun: { run: 0.3659, wet: 0.01, dry: 0.7169 },
          centralDelta: { run: 0.3778, wet: 0.004, dry: 0.7465 },
          northDelta: { run: 0.3466, wet: 0, dry: 0.6885 },
          southDelta: { run: 0.3862, wet: 0.0135, dry: 0.7538 },
        },

        // Temperature stress › Waterfowl hunting (share of days, 0 to 1)
        'rec-temperature-waterfowl': {
          delta: { run: 0.1287, wet: 0, dry: 0.2555 },
          suisun: { run: 0.0492, wet: 0, dry: 0.0977 },
          centralDelta: { run: 0.1437, wet: 0, dry: 0.2854 },
          northDelta: { run: 0.0857, wet: 0, dry: 0.1703 },
          southDelta: { run: 0.2129, wet: 0, dry: 0.4229 },
        },

        // Temperature stress › Angling (share of days, 0 to 1)
        'rec-temperature-angling': {
          delta: { run: 0.4385, wet: 0.059, dry: 0.8128 },
          suisun: { run: 0.4527, wet: 0.0786, dry: 0.8217 },
          centralDelta: { run: 0.4374, wet: 0.064, dry: 0.8057 },
          northDelta: { run: 0.4049, wet: 0.0162, dry: 0.7883 },
          southDelta: { run: 0.4493, wet: 0.0653, dry: 0.8282 },
        },

        // Temperature stress › Cold-water day use (share of days, 0 to 1)
        'rec-temperature-dayUseCold': {
          delta: { run: 0.5414, wet: 0.9231, dry: 0.165 },
          suisun: { run: 0.5258, wet: 0.9034, dry: 0.1533 },
          centralDelta: { run: 0.5384, wet: 0.9178, dry: 0.1642 },
          northDelta: { run: 0.5775, wet: 0.9718, dry: 0.1885 },
          southDelta: { run: 0.5343, wet: 0.9135, dry: 0.1603 },
        },

        // Habitat Restoration › Restored acres (acres)
        'rec-restoration-acres': {
          delta: { '*': 0 },
          suisun: { '*': 0 },
          centralDelta: { '*': 0 },
          northDelta: { '*': 0 },
          southDelta: { '*': 0 },
        },

        // Recreation economy › Day use and boating (dollars a year)
        'rec-economy-amenity': {
          delta: { '*': 0 },
          suisun: { '*': 0 },
          centralDelta: { '*': 0 },
          northDelta: { '*': 0 },
          southDelta: { '*': 0 },
        },

        // Recreation economy › Birding (dollars a year)
        'rec-economy-biodiversity': {
          delta: { '*': 0 },
          suisun: { '*': 0 },
          centralDelta: { '*': 0 },
          northDelta: { '*': 0 },
          southDelta: { '*': 0 },
        },

        // Recreation economy › Waterfowl hunting (dollars a year)
        'rec-economy-hunting': {
          delta: { '*': 0 },
          suisun: { '*': 0 },
          centralDelta: { '*': 0 },
          northDelta: { '*': 0 },
          southDelta: { '*': 0 },
        },

        // Recreation economy › Angling (dollars a year)
        'rec-economy-fishing': {
          delta: { '*': 0 },
          suisun: { '*': 0 },
          centralDelta: { '*': 0 },
          northDelta: { '*': 0 },
          southDelta: { '*': 0 },
        },
      },
    },
  },
}
