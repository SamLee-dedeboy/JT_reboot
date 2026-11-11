// Env. Justice: everything the ranking shows for this criterion, in one place.
// Change a number or a sentence here and the By criterion table, its info cards, its
// maps and the By scenario rankings all follow. See ./types.ts for how to read it.
import type { Facet, Source, TeamData } from './types'

/** data: Ranking table workbook, Env Justice tab, Nov 2026 */
const SOURCE_1: Source = {
  doc: 'data',
  where: 'Ranking table workbook, Env Justice tab, Nov 2026',
  quote: 'Values the Environmental Justice team entered in the ranking table sheet.',
}

const PLACES_all_moderate_high_and1More: Facet[] = [
  { key: 'all', label: 'All 49 points' },
  { key: 'moderate', label: 'Moderate vulnerability · 10' },
  { key: 'high', label: 'High vulnerability · 36' },
  { key: 'highest', label: 'Highest vulnerability · 3' },
]

const PLACES_all_moderate_high_and1More_: Facet[] = [
  { key: 'all', label: 'All 46 points' },
  { key: 'moderate', label: 'Moderate vulnerability · 10' },
  { key: 'high', label: 'High vulnerability · 33' },
  { key: 'highest', label: 'Highest vulnerability · 3' },
]

const PERIODS_run_2019_2020: Facet[] = [
  { key: 'run', label: 'Whole period' },
  { key: '2019', label: 'Wet Year' },
  { key: '2020', label: 'Dry Year' },
]

const PERIODS_run_wet_dry: Facet[] = [
  { key: 'run', label: 'Whole run · Oct 2020 – Jan 2022' },
  { key: 'wet', label: 'Wet season · Oct – Mar' },
  { key: 'dry', label: 'Dry season · Apr – Sep' },
]

export const ENVIRONMENTAL_JUSTICE: TeamData = {
  team: 'environmentalJustice',
  seaLevelRiseStatus: 'loaded',
  text: {
    takeaways: [
      '++Increased Delta Outflow++ changed the amount of exceedance of acceptable drinking water salinity thresholds more than adaptation scenarios. **An increase in volume of water within the Delta has the most positive effect on this criterion.**',
      'In terms of water age and water temperature, **Franks Tract and Suisun Marsh experience the highest increase in water age,** which is heavily attributed to the wetland restoration in these areas in ++Eco Machine++ and ++New Green Watershed++.',
      'Lastly, **flood risk benefits are highest in scenarios that affect the entire Delta,** rather than interventions in segmented regions; upland restoration in ++New Green Watershed++ provides the largest flood risk benefit across scenarios.',
    ],
    caveats: [
      'Salinity impacts to in-Delta drinking water: ++Increased Delta Outflow++, by far, reduces drinking water salinity threshold exceedances the most. Across adaptation scenarios, ++Eco Machine++ and ++New Green Watershed++ perform the best, and decrease threshold exceedances overall.',
      'Flood risk attenuation: Scenarios that produce Delta-wide effects, rather than localized benefits, performed the best for this metric. ++New Green Watershed++ was the leading scenario, attributed to the flood risk benefits associated with upland restoration. ++Bolster & Fortify++ performed second-best; while fortification of levees definitely reduces flood risk, these benefits are only observed along the freshwater corridor pathway, not the entire Delta. Lastly, ++A Tunnel++ was expected to slightly decrease flood risk, on the assumption that the two northern intakes would intercept water in high storm events prior to inundation into the Delta. ++Eco Machine++ and ++Calling on Reserves++ did not deviate from baseline.',
      'Water age + temperature: An increase in water age itself is not inherently negative, nor does it mean harmful algal blooms will definitely form, but it does indicate suitable conditions for their formation. Both ++New Green Watershed++ and ++Eco Machine++ increased water age the most, in the regions in which restoration was incorporated.',
    ],
    criterion: {
      metrics: [
        'Salinity impacts to in-Delta drinking water x2',
        'Flood risk attenuation',
        'Water age + temperature',
      ],
      combine:
        'The mean of the three listed metrics, with **Drinking Water counted twice**, rounded to a whole point. The same rule applies with sea level rise.',
    },
    periodWhy:
      'Understanding how scenarios perform over a wet-water year and a dry water-year allows us to observe nuance associated with overall conditions that may be otherwise washed out in the full model run (which combines both water years).',
    placeWhy:
      'Using community vulnerability classifications instead of geographic regions highlights how each scenario affects people, rather than places. Understanding where and how negative impacts may manifest, taking into account a community’s capacity to address these impacts, can inform decision-makers to intervene or choose alternative strategies to avoid these burdens coming to fruition.',
    placeNames: {
      'All 49 points': 'All together',
      'Moderate vulnerability · 10': 'Medium vulnerability',
      'High vulnerability · 36': 'High vulnerability',
      'High vulnerability · 33': 'High vulnerability',
      'Highest vulnerability · 3': 'Highest vulnerability',
    },
  },
  // The By criterion table's rows, top to bottom
  rows: {
    id: 'environmentalJustice',
    label: 'Environmental Justice',
    level: 'team',
    provenance: 'reported',
    unit: 'score',
    betterHigher: true,
    note: 'The unweighted mean of three metric scores, rounded to a whole point: drinking water (whole period), flood risk, and water age.',
    places: [{ key: '*', label: 'Not broken out' }],
    periods: [{ key: '*', label: 'Not broken out' }],
    sources: [SOURCE_1],
    seaLevelRise: { note: '', sources: [SOURCE_1] },
    children: [
      {
        id: 'ej-drinking',
        label: 'Salinity impacts to in-Delta drinking water',
        level: 'metric',
        edge: 'averages',
        provenance: 'reported',
        unit: 'score',
        betterHigher: true,
        note: 'One point per percentage point of readings over 1,050 µS/cm against Business as Usual (CalSim’s, for Calling on Reserves and A Tunnel), ±5 at five or more. Scored for all 49 points and for each class; the highest class is always 0%, so it scores 0.',
        places: PLACES_all_moderate_high_and1More,
        periods: PERIODS_run_2019_2020,
        sources: [
          SOURCE_1,
          {
            doc: 'report',
            where: 'Tables 3 and 4 — percentage of run exceeding 1,050 µS/cm',
            quote:
              'Table 3. Percentage of run exceeding 1,050 𝜇/cm in each adaptation scenario run. … Table 4. … broken down by season.',
          },
        ],
        notApplicableIn: { more: ['2019', '2020'] },
        seaLevelRise: {
          note: 'With sea level rise, against its own Business as Usual.',
          sources: [SOURCE_1],
          places: PLACES_all_moderate_high_and1More,
          periods: PERIODS_run_2019_2020,
        },
        info: {
          takeaway: {
            lead: '++Increased Delta Outflow++, by far, **reduces drinking water salinity threshold exceedances the most.**',
            details: [
              'Across adaptation scenarios, ++Eco Machine++ and ++New Green Watershed++ perform the best, and decrease threshold exceedances overall.',
            ],
          },
          measures: 'How often in-Delta drinking water is too salty.',
          computed:
            'The share of salinity readings at or above 1,050 µS/cm at in-Delta drinking-water points, over the whole run.',
          scored:
            'Each 1-percentage-point decrease in readings over the threshold from Business as Usual changes the score by +1; each 1-percentage-point increase changes it by −1, capped at ±5 for each place.',
          scale: {
            step: '%',
            axis: 'Readings over the line vs Business as Usual',
            lowerBetter: true,
          },
        },
        children: [
          {
            id: 'ej-drinking-pct',
            label: '% of days with unsuitable water quality',
            level: 'entity',
            edge: 'derives',
            provenance: 'reported',
            unit: 'share',
            betterHigher: false,
            note: 'The share of daily readings at or above 1,050 µS/cm, the drinking-water threshold, at the 49 SAFER drinking-water points: all together or by Delta Vulnerability Index class. The table shows change from Base for Eco Machine, Bolster & Fortify and New Green Watershed; from CalSim base for Calling on Reserves and A Tunnel; and from Historical Baseline for Increased Delta outflow. The highest-vulnerability class never exceeds it in any scenario.',
            places: PLACES_all_moderate_high_and1More,
            periods: PERIODS_run_2019_2020,
            sources: [SOURCE_1],
            notApplicableIn: { more: ['2019', '2020'] },
            seaLevelRise: {
              note: 'With sea level rise, against its own Business as Usual.',
              sources: [SOURCE_1],
              places: PLACES_all_moderate_high_and1More,
              periods: PERIODS_run_2019_2020,
            },
          },
        ],
      },
      {
        id: 'ej-flood',
        label: 'Flood risk attenuation',
        level: 'metric',
        edge: 'averages',
        provenance: 'reported',
        unit: 'score',
        betterHigher: true,
        note: 'Each scenario receives one qualitative judgment based on its flood-reduction design. As one of three values in the mean, it makes up one third of the EJ score and has the same weight as the drinking-water metric with 39,659 measurements; it is the only metric for A Tunnel.',
        places: [{ key: '*', label: 'Not broken out' }],
        periods: [{ key: '*', label: 'Not broken out' }],
        sources: [
          {
            doc: 'slides',
            where: 'Flood Risk: Results & Ranking',
            quote:
              'No Change: 0 — Eco Machine, Calling on Reserves. Slight Decrease: 1 — A Tunnel. Moderate Decrease: 2 — Bolster and Fortify. Significant Decrease: 3 — New Green Watershed.',
          },
        ],
        seaLevelRise: {
          note: 'The Environmental Justice team reports the same value under sea level rise.',
          sources: [SOURCE_1],
        },
        info: {
          takeaway: {
            lead: 'Scenarios that produce **Delta-wide effects,** rather than localized benefits, performed the best for this metric.',
            details: [
              '++New Green Watershed++ was the leading scenario, attributed to the flood risk benefits associated with upland restoration.',
              '++Bolster & Fortify++ performed second-best; while fortification of levees definitely reduces flood risk, these benefits are only observed along the freshwater corridor pathway, not the entire Delta.',
              'Lastly, ++A Tunnel++ was expected to slightly decrease flood risk, on the assumption that the two northern intakes would intercept water in high storm events prior to inundation into the Delta.',
              '++Eco Machine++ and ++Calling on Reserves++ did not deviate from baseline.',
            ],
          },
          measures: 'Flood risk across the Delta.',
          computed: 'A Delta-wide qualitative judgement for the Environmental Justice criterion.',
          scored: 'The Environmental Justice criterion sets the result on the −5 to +5 scale.',
        },
        children: [
          {
            id: 'ej-flood-judgement',
            label: 'Flood risk descriptive change from Business as Usual',
            level: 'entity',
            edge: 'measures',
            provenance: 'unscored',
            unit: 'score',
            betterHigher: true,
            note: 'The team’s judgement of the change in flood risk: one arrow for a slight decrease, two for a moderate decrease, three for a significant decrease.',
            places: [{ key: '*', label: 'Not broken out' }],
            periods: [{ key: '*', label: 'Not broken out' }],
          },
        ],
      },
      {
        id: 'ej-waterage',
        label: 'Water age + temperature',
        level: 'metric',
        edge: 'averages',
        provenance: 'reported',
        unit: 'score',
        betterHigher: true,
        note: 'Water at or above 19 °C and older than 14 days is a harmful-algal-bloom proxy across five hotspot areas. These are the team’s scores; open the row for each area’s change in average water age.',
        places: [{ key: '*', label: 'Not broken out' }],
        periods: [{ key: '*', label: 'Not broken out' }],
        sources: [SOURCE_1],
        seaLevelRise: { note: '', sources: [SOURCE_1] },
        info: {
          takeaway: {
            lead: 'An increase in water age itself is not inherently negative, nor does it mean harmful algal blooms will definitely form, but it does indicate suitable conditions for their formation.',
            details: [
              'Both ++New Green Watershed++ and ++Eco Machine++ increased water age the most, in the regions in which restoration was incorporated.',
            ],
          },
          measures: 'How long water sits in the Delta, and how warm it gets.',
          computed:
            'The change in average water age, in days, against Business as Usual, with water temperature.',
          scored: '',
        },
        children: [
          {
            id: 'ej-waterage-suisun',
            label: 'Suisun Marsh',
            level: 'entity',
            edge: 'derives',
            provenance: 'reported',
            unit: 'days',
            betterHigher: false,
            note: 'Change in average water age (days) from each scenario’s baseline, averaged over months reported by both runs. Eco Machine, Bolster & Fortify, and New Green Watershed use Base; Calling on Reserves and A Tunnel use CalSim base.',
            places: [{ key: '*', label: 'Not broken out' }],
            periods: [{ key: '*', label: 'Not broken out' }],
            sources: [SOURCE_1],
            forthcoming: false,
            seaLevelRise: {
              note: 'The same calculation with sea level rise, against each scenario’s sea-level-rise baseline.',
              sources: [SOURCE_1],
              places: [{ key: '*', label: 'Not broken out' }],
              periods: [{ key: '*', label: 'Not broken out' }],
            },
          },
          {
            id: 'ej-waterage-franksTract',
            label: 'Franks Tract',
            level: 'entity',
            edge: 'derives',
            provenance: 'reported',
            unit: 'days',
            betterHigher: false,
            note: 'Change in average water age (days) from each scenario’s baseline, averaged over months reported by both runs. Eco Machine, Bolster & Fortify, and New Green Watershed use Base; Calling on Reserves and A Tunnel use CalSim base.',
            places: [{ key: '*', label: 'Not broken out' }],
            periods: [{ key: '*', label: 'Not broken out' }],
            sources: [SOURCE_1],
            forthcoming: false,
            seaLevelRise: {
              note: 'The same calculation with sea level rise, against each scenario’s sea-level-rise baseline.',
              sources: [SOURCE_1],
              places: [{ key: '*', label: 'Not broken out' }],
              periods: [{ key: '*', label: 'Not broken out' }],
            },
          },
          {
            id: 'ej-waterage-southDelta',
            label: 'South Delta',
            level: 'entity',
            edge: 'derives',
            provenance: 'reported',
            unit: 'days',
            betterHigher: false,
            note: 'Change in average water age (days) from each scenario’s baseline, averaged over months reported by both runs. Eco Machine, Bolster & Fortify, and New Green Watershed use Base; Calling on Reserves and A Tunnel use CalSim base.',
            places: [{ key: '*', label: 'Not broken out' }],
            periods: [{ key: '*', label: 'Not broken out' }],
            sources: [SOURCE_1],
            forthcoming: false,
            seaLevelRise: {
              note: 'The same calculation with sea level rise, against each scenario’s sea-level-rise baseline.',
              sources: [SOURCE_1],
              places: [{ key: '*', label: 'Not broken out' }],
              periods: [{ key: '*', label: 'Not broken out' }],
            },
          },
          {
            id: 'ej-waterage-mcCormackWilliamson',
            label: 'McCormack-Williamson Tract',
            level: 'entity',
            edge: 'derives',
            provenance: 'reported',
            unit: 'days',
            betterHigher: false,
            note: 'Change in average water age (days) from each scenario’s baseline, averaged over months reported by both runs. Eco Machine, Bolster & Fortify, and New Green Watershed use Base; Calling on Reserves and A Tunnel use CalSim base.',
            places: [{ key: '*', label: 'Not broken out' }],
            periods: [{ key: '*', label: 'Not broken out' }],
            sources: [SOURCE_1],
            forthcoming: false,
            seaLevelRise: {
              note: 'The same calculation with sea level rise, against each scenario’s sea-level-rise baseline.',
              sources: [SOURCE_1],
              places: [{ key: '*', label: 'Not broken out' }],
              periods: [{ key: '*', label: 'Not broken out' }],
            },
          },
          {
            id: 'ej-waterage-lindseyCache',
            label: 'Lindsey-Cache Slough',
            level: 'entity',
            edge: 'derives',
            provenance: 'reported',
            unit: 'days',
            betterHigher: false,
            note: 'Change in average water age (days) from each scenario’s baseline, averaged over months reported by both runs. Eco Machine, Bolster & Fortify, and New Green Watershed use Base; Calling on Reserves and A Tunnel use CalSim base.',
            places: [{ key: '*', label: 'Not broken out' }],
            periods: [{ key: '*', label: 'Not broken out' }],
            sources: [SOURCE_1],
            forthcoming: false,
            seaLevelRise: {
              note: 'The same calculation with sea level rise, against each scenario’s sea-level-rise baseline.',
              sources: [SOURCE_1],
              places: [{ key: '*', label: 'Not broken out' }],
              periods: [{ key: '*', label: 'Not broken out' }],
            },
          },
        ],
      },
    ],
  },
  // The tiered outflow table's rows
  outflowRows: {
    id: 'environmentalJustice',
    label: 'Environmental Justice',
    level: 'team',
    provenance: 'reported',
    unit: 'score',
    betterHigher: true,
    note: 'Only drinking water is assessed on the outflow runs, so it is the whole EJ score: +30% outflow +4, −10% outflow −2. The report’s table gives −1 for the whole run and both seasons, then an average of −1.5 rounded to −2; −2 is the score it states.',
    places: [{ key: '*', label: 'Not broken out' }],
    periods: [{ key: '*', label: 'Not broken out' }],
    sources: [
      {
        doc: 'report',
        where:
          'EJ “Story Behind the Criterion” report, Oct 2026 · Overall Comparative Scenario Performance, tiered outflow table',
        quote:
          '30% Outflow Increase | 4 | 4 | 4 | 4 | 4 · 10% Outflow Decrease | -1 | -1 | -1 | -1.5 | -2',
      },
    ],
    children: [
      {
        id: 'ej-drinking',
        label: 'Salinity impacts to in-Delta drinking water',
        level: 'metric',
        edge: 'averages',
        provenance: 'reported',
        unit: 'score',
        betterHigher: true,
        note: 'One point per percentage point of readings over 1,050 µS/cm against the Historical Baseline, ±5 at 21 points or more, scored for all 46 points and for each class; the highest class never exceeds the threshold, so it scores 0.',
        places: PLACES_all_moderate_high_and1More_,
        periods: PERIODS_run_wet_dry,
        sources: [
          {
            doc: 'report',
            where:
              'EJ “Story Behind the Criterion” report, Oct 2026 · Comparative ranking, Tables 5–8 and the seasonal rankings',
            quote:
              'With Historic Baseline anchored at 0, the 30% Outflow Increase run scored 4, while the 10% Outflow Decrease run scored -1.',
          },
        ],
        children: [
          {
            id: 'ej-drinking-pct',
            label: 'Readings over 1,050 µS/cm',
            level: 'entity',
            edge: 'derives',
            provenance: 'reported',
            unit: 'share',
            betterHigher: false,
            note: 'Share of daily mean readings at or above 1,050 µS/cm at the 46 SAFER points, Oct 1 2020 – Jan 1 2022, all together or by Delta Vulnerability Index class.',
            places: PLACES_all_moderate_high_and1More_,
            periods: PERIODS_run_wet_dry,
            sources: [
              {
                doc: 'report',
                where:
                  'EJ “Story Behind the Criterion” report, Oct 2026 · Tiered Outflow Analysis, Tables 1 and 2',
                quote: 'Percentage of run exceeding 1,050 µ/cm in each tiered outflow run.',
              },
            ],
          },
        ],
      },
      {
        id: 'ej-flood',
        label: 'Flood risk attenuation',
        level: 'metric',
        edge: 'averages',
        provenance: 'reported',
        unit: 'score',
        betterHigher: true,
        note: 'The report: there is no tiered outflow analysis for this metric, because every outflow run uses the same landscape and varies only Delta outflow.',
        places: [{ key: '*', label: 'Not broken out' }],
        periods: [{ key: '*', label: 'Not broken out' }],
        notApplicable: ['more', 'less', 'hist'],
      },
      {
        id: 'ej-waterage',
        label: 'Water age + temperature',
        level: 'metric',
        edge: 'averages',
        provenance: 'reported',
        unit: 'score',
        betterHigher: true,
        note: 'The report: water age data was not available for the tiered outflow runs, so this metric assesses the adaptation scenarios only.',
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
        // Salinity impacts to in-Delta drinking water › % of days with unsuitable water quality (share of days, 0 to 1)
        'ej-drinking-pct': {
          all: { '2019': 0.06, '2020': 0.08, run: 0.09 },
          moderate: { '2019': 0.06, '2020': 0.03, run: 0.06 },
          high: { '2019': 0.07, '2020': 0.1, run: 0.1 },
          highest: { '2019': 0, '2020': 0, run: 0 },
        },

        // Water age + temperature › Suisun Marsh (days)
        'ej-waterage-suisun': 0,

        // Water age + temperature › Franks Tract (days)
        'ej-waterage-franksTract': 0,

        // Water age + temperature › South Delta (days)
        'ej-waterage-southDelta': 0,

        // Water age + temperature › McCormack-Williamson Tract (days)
        'ej-waterage-mcCormackWilliamson': 0,

        // Water age + temperature › Lindsey-Cache Slough (days)
        'ej-waterage-lindseyCache': 0,
      },
      steps: {
        // Flood risk attenuation › Flood risk descriptive change from Business as Usual (score)
        'ej-flood-judgement': 0,
      },
    },

    // Business as Usual (CalSim)
    csbau: {
      measures: {
        // Salinity impacts to in-Delta drinking water › % of days with unsuitable water quality (share of days, 0 to 1)
        'ej-drinking-pct': {
          all: { '2019': 0.1, '2020': 0.09, run: 0.11 },
          moderate: { '2019': 0.14, '2020': 0.03, run: 0.11 },
          high: { '2019': 0.1, '2020': 0.11, run: 0.12 },
          highest: { '2019': 0, '2020': 0, run: 0 },
        },
      },
    },

    // Eco Machine
    em: {
      takeaway: {
        lead: 'The in-Delta tidal restoration incorporated in Eco Machine **lowers overall drinking water threshold exceedances across the run the most** (tied with New Green Watershed) across scenarios, in both wet and dry water years, and the total run.',
        points: [
          {
            label: 'Water age',
            text: 'However, water age does increase in these restored regions. An increase in water age itself is not inherently negative, nor does it mean harmful algal blooms will definitely form, but it does indicate suitable conditions for their formation.',
          },
          {
            label: 'Flood risk',
            text: 'There is no change from Business as Usual in flood risk for this scenario.',
          },
        ],
      },
      scores: {
        // Environmental Justice (score)
        environmentalJustice: 1,

        // Salinity impacts to in-Delta drinking water (score)
        'ej-drinking': {
          all: { '2019': 1, '2020': 1, run: 2 },
          moderate: { '2019': 3, '2020': 1, run: 2 },
          high: { '2019': 1, '2020': 2, run: 2 },
          highest: { '2019': 0, '2020': 0, run: 0 },
        },

        // Flood risk attenuation (score)
        'ej-flood': 0,

        // Water age + temperature (score)
        'ej-waterage': -1,
      },
      measures: {
        // Salinity impacts to in-Delta drinking water › % of days with unsuitable water quality (share of days, 0 to 1)
        'ej-drinking-pct': {
          all: { '2019': 0.05, '2020': 0.07, run: 0.07 },
          moderate: { '2019': 0.03, '2020': 0.02, run: 0.04 },
          high: { '2019': 0.06, '2020': 0.08, run: 0.08 },
          highest: { '2019': 0, '2020': 0, run: 0 },
        },

        // Water age + temperature › Suisun Marsh (days)
        'ej-waterage-suisun': 3.4,

        // Water age + temperature › Franks Tract (days)
        'ej-waterage-franksTract': -0.9,

        // Water age + temperature › South Delta (days)
        'ej-waterage-southDelta': -4.9,

        // Water age + temperature › McCormack-Williamson Tract (days)
        'ej-waterage-mcCormackWilliamson': 0.4,

        // Water age + temperature › Lindsey-Cache Slough (days)
        'ej-waterage-lindseyCache': 0,
      },
      steps: {
        // Flood risk attenuation › Flood risk descriptive change from Business as Usual (score)
        'ej-flood-judgement': 0,
      },
    },

    // New Green Watershed
    ngw: {
      takeaway: {
        lead: 'The extensive watershed restoration included in this New Green Watershed **lowers overall drinking water threshold exceedances across the run the most** (tied with Eco Machine) across scenarios, in both wet and dry water years, and the total run.',
        points: [
          {
            label: 'Flood risk',
            text: 'New Green Watershed also lowers flood risk the most of all the scenarios.',
          },
          {
            label: 'Water age',
            text: 'However, this restoration slows water down; water age increases in many restored regions. An increase in water age itself is not inherently negative, nor does it mean harmful algal blooms will definitely form, but it does indicate suitable conditions for their formation.',
          },
        ],
      },
      scores: {
        // Environmental Justice (score)
        environmentalJustice: 2,

        // Salinity impacts to in-Delta drinking water (score)
        'ej-drinking': {
          all: { '2019': 1, '2020': 1, run: 2 },
          moderate: { '2019': 3, '2020': 1, run: 2 },
          high: { '2019': 1, '2020': 1, run: 2 },
          highest: { '2019': 0, '2020': 0, run: 0 },
        },

        // Flood risk attenuation (score)
        'ej-flood': 3,

        // Water age + temperature (score)
        'ej-waterage': -2,
      },
      measures: {
        // Salinity impacts to in-Delta drinking water › % of days with unsuitable water quality (share of days, 0 to 1)
        'ej-drinking-pct': {
          all: { '2019': 0.05, '2020': 0.07, run: 0.07 },
          moderate: { '2019': 0.03, '2020': 0.02, run: 0.04 },
          high: { '2019': 0.06, '2020': 0.09, run: 0.08 },
          highest: { '2019': 0, '2020': 0, run: 0 },
        },

        // Water age + temperature › Suisun Marsh (days)
        'ej-waterage-suisun': 3.3,

        // Water age + temperature › Franks Tract (days)
        'ej-waterage-franksTract': -0.9,

        // Water age + temperature › South Delta (days)
        'ej-waterage-southDelta': -4.9,

        // Water age + temperature › McCormack-Williamson Tract (days)
        'ej-waterage-mcCormackWilliamson': 0.5,

        // Water age + temperature › Lindsey-Cache Slough (days)
        'ej-waterage-lindseyCache': 3.6,
      },
      steps: {
        // Flood risk attenuation › Flood risk descriptive change from Business as Usual (score)
        'ej-flood-judgement': 3,
      },
    },

    // Bolster & Fortify
    bf: {
      takeaway: {
        lead: 'Bolster & Fortify **performs very similarly to Business as Usual** for both drinking water threshold exceedances and flood risk.',
        points: [
          {
            label: 'Drinking water',
            text: 'During a wet year, Bolster & Fortify incurs slightly fewer drinking water salinity threshold exceedances than Business as Usual, but slightly more in a dry year. Overall for the total run, there is no change from Business as Usual.',
          },
          {
            label: 'Flood risk',
            text: 'Bolster & Fortify does reduce flood risk, but only along the freshwater corridor pathway; this benefit is not felt Delta-wide.',
          },
          {
            label: 'Water age',
            text: 'Due to this pathway, Bolster & Fortify also slightly decreases water age in the South Delta during certain months, but water age increases in Franks Tract. An increase in water age itself is not inherently negative, nor does it mean harmful algal blooms will definitely form, but it does indicate suitable conditions for their formation.',
          },
        ],
      },
      scores: {
        // Environmental Justice (score)
        environmentalJustice: 0,

        // Salinity impacts to in-Delta drinking water (score)
        'ej-drinking': {
          all: { '2019': -1, '2020': 1, run: 0 },
          moderate: { '2019': 1, '2020': 1, run: 1 },
          high: { '2019': -1, '2020': 0, run: 0 },
          highest: { '2019': 0, '2020': 0, run: 0 },
        },

        // Flood risk attenuation (score)
        'ej-flood': 2,

        // Water age + temperature (score)
        'ej-waterage': -1,
      },
      measures: {
        // Salinity impacts to in-Delta drinking water › % of days with unsuitable water quality (share of days, 0 to 1)
        'ej-drinking-pct': {
          all: { '2019': 0.07, '2020': 0.07, run: 0.09 },
          moderate: { '2019': 0.05, '2020': 0.02, run: 0.05 },
          high: { '2019': 0.08, '2020': 0.1, run: 0.1 },
          highest: { '2019': 0, '2020': 0, run: 0 },
        },

        // Water age + temperature › Suisun Marsh (days)
        'ej-waterage-suisun': 0.1,

        // Water age + temperature › Franks Tract (days)
        'ej-waterage-franksTract': 2.4,

        // Water age + temperature › South Delta (days)
        'ej-waterage-southDelta': -1.1,

        // Water age + temperature › McCormack-Williamson Tract (days)
        'ej-waterage-mcCormackWilliamson': 0,

        // Water age + temperature › Lindsey-Cache Slough (days)
        'ej-waterage-lindseyCache': 0,
      },
      steps: {
        // Flood risk attenuation › Flood risk descriptive change from Business as Usual (score)
        'ej-flood-judgement': 2,
      },
    },

    // Calling on Reserves
    cor: {
      takeaway: {
        lead: 'Calling on Reserves does not deviate from baseline for drinking water salinity threshold exceedances for total run or the wet year portion of the modeling, but it does **perform better than Business as Usual in a dry year.**',
        points: [{ label: 'Flood risk', text: 'There is no change in flood risk from baseline.' }],
      },
      scores: {
        // Environmental Justice (score)
        environmentalJustice: 0,

        // Salinity impacts to in-Delta drinking water (score)
        'ej-drinking': {
          all: { '2019': 0, '2020': 2, run: 0 },
          moderate: { '2019': 0, '2020': 1, run: 0 },
          high: { '2019': 0, '2020': 1, run: 1 },
          highest: { '2019': 0, '2020': 0, run: 0 },
        },

        // Flood risk attenuation (score)
        'ej-flood': 0,

        // Water age + temperature (score)
        'ej-waterage': 0,
      },
      measures: {
        // Salinity impacts to in-Delta drinking water › % of days with unsuitable water quality (share of days, 0 to 1)
        'ej-drinking-pct': {
          all: { '2019': 0.1, '2020': 0.07, run: 0.11 },
          moderate: { '2019': 0.14, '2020': 0.02, run: 0.11 },
          high: { '2019': 0.1, '2020': 0.1, run: 0.11 },
          highest: { '2019': 0, '2020': 0, run: 0 },
        },

        // Water age + temperature › Suisun Marsh (days)
        'ej-waterage-suisun': 0,

        // Water age + temperature › Franks Tract (days)
        'ej-waterage-franksTract': -0.1,

        // Water age + temperature › South Delta (days)
        'ej-waterage-southDelta': 0.1,

        // Water age + temperature › McCormack-Williamson Tract (days)
        'ej-waterage-mcCormackWilliamson': 0.1,

        // Water age + temperature › Lindsey-Cache Slough (days)
        'ej-waterage-lindseyCache': 0,
      },
      steps: {
        // Flood risk attenuation › Flood risk descriptive change from Business as Usual (score)
        'ej-flood-judgement': 0,
      },
    },

    // A Tunnel
    tunnel: {
      takeaway: {
        lead: 'A Tunnel **does not differ from baseline** for drinking water salinity threshold exceedances at all.',
        points: [
          {
            label: 'Flood risk',
            text: 'There is a slight decrease in flood risk attributed to A Tunnel, on the assumption that the two northern intakes would intercept water in high storm events prior to inundation into the Delta.',
          },
        ],
      },
      scores: {
        // Environmental Justice (score)
        environmentalJustice: 0,

        // Salinity impacts to in-Delta drinking water (score)
        'ej-drinking': {
          all: { '2019': 0, '2020': 0, run: 0 },
          moderate: { '2019': 3, '2020': -1, run: 1 },
          high: { '2019': -1, '2020': 0, run: -1 },
          highest: { '2019': 0, '2020': 0, run: 0 },
        },

        // Flood risk attenuation (score)
        'ej-flood': 1,

        // Water age + temperature (score)
        'ej-waterage': 0,
      },
      measures: {
        // Salinity impacts to in-Delta drinking water › % of days with unsuitable water quality (share of days, 0 to 1)
        'ej-drinking-pct': {
          all: { '2019': 0.1, '2020': 0.09, run: 0.11 },
          moderate: { '2019': 0.11, '2020': 0.04, run: 0.11 },
          high: { '2019': 0.11, '2020': 0.11, run: 0.13 },
          highest: { '2019': 0, '2020': 0, run: 0 },
        },

        // Water age + temperature › Suisun Marsh (days)
        'ej-waterage-suisun': 0.1,

        // Water age + temperature › Franks Tract (days)
        'ej-waterage-franksTract': -0.1,

        // Water age + temperature › South Delta (days)
        'ej-waterage-southDelta': 0.5,

        // Water age + temperature › McCormack-Williamson Tract (days)
        'ej-waterage-mcCormackWilliamson': 0.2,

        // Water age + temperature › Lindsey-Cache Slough (days)
        'ej-waterage-lindseyCache': -0.4,
      },
      steps: {
        // Flood risk attenuation › Flood risk descriptive change from Business as Usual (score)
        'ej-flood-judgement': 1,
      },
    },

    // Historical Baseline
    hist: {
      measures: {
        // Salinity impacts to in-Delta drinking water › % of days with unsuitable water quality (share of days, 0 to 1)
        'ej-drinking-pct': {
          all: { run: 0.27, wet: 0.28, dry: 0.26 },
          moderate: { run: 0.31, wet: 0.37, dry: 0.24 },
          high: { run: 0.28, wet: 0.27, dry: 0.29 },
          highest: { run: 0, wet: 0, dry: 0 },
        },
      },
    },

    // Increased Delta outflow
    more: {
      takeaway: {
        lead: 'Increased Delta Outflow **decreases the drinking water salinity threshold exceedances the most** out of all scenarios.',
      },
      scores: {
        // Environmental Justice (score)
        environmentalJustice: 4,

        // Salinity impacts to in-Delta drinking water (score)
        'ej-drinking': {
          all: { run: 4, wet: 4, dry: 4 },
          moderate: { run: 5, wet: 5, dry: 5 },
          high: { run: 4, wet: 5, dry: 4 },
          highest: { run: 0, wet: 0, dry: 0 },
        },
      },
      measures: {
        // Salinity impacts to in-Delta drinking water › % of days with unsuitable water quality (share of days, 0 to 1)
        'ej-drinking-pct': {
          all: { run: 0.08, wet: 0.08, dry: 0.09 },
          moderate: { run: 0.01, wet: 0.01, dry: 0.02 },
          high: { run: 0.11, wet: 0.11, dry: 0.12 },
          highest: { run: 0, wet: 0, dry: 0 },
        },
      },
    },

    // Less outflow (−10%)
    less: {
      scores: {
        // Environmental Justice (score)
        environmentalJustice: -2,

        // Salinity impacts to in-Delta drinking water (score)
        'ej-drinking': {
          all: { run: -1, wet: -1, dry: -1 },
          moderate: { run: -2, wet: -2, dry: -2 },
          high: { run: -1, wet: -1, dry: -1 },
          highest: { run: 0, wet: 0, dry: 0 },
        },
      },
      measures: {
        // Salinity impacts to in-Delta drinking water › % of days with unsuitable water quality (share of days, 0 to 1)
        'ej-drinking-pct': {
          all: { run: 0.32, wet: 0.33, dry: 0.3 },
          moderate: { run: 0.41, wet: 0.45, dry: 0.33 },
          high: { run: 0.32, wet: 0.32, dry: 0.31 },
          highest: { run: 0, wet: 0, dry: 0 },
        },
      },
    },
  },
  // With sea level rise
  seaLevelRise: {
    // Business as Usual
    bau: {
      measures: {
        // Salinity impacts to in-Delta drinking water › % of days with unsuitable water quality (share of days, 0 to 1)
        'ej-drinking-pct': {
          all: { '2019': 0.11, '2020': 0.11, run: 0.13 },
          moderate: { '2019': 0.15, '2020': 0.08, run: 0.15 },
          high: { '2019': 0.1, '2020': 0.13, run: 0.13 },
          highest: { '2019': 0, '2020': 0, run: 0 },
        },

        // Water age + temperature › Suisun Marsh (days)
        'ej-waterage-suisun': 0,

        // Water age + temperature › Franks Tract (days)
        'ej-waterage-franksTract': 0,

        // Water age + temperature › South Delta (days)
        'ej-waterage-southDelta': 0,

        // Water age + temperature › McCormack-Williamson Tract (days)
        'ej-waterage-mcCormackWilliamson': 0,

        // Water age + temperature › Lindsey-Cache Slough (days)
        'ej-waterage-lindseyCache': 0,
      },
    },

    // Business as Usual (CalSim)
    csbau: {
      measures: {
        // Salinity impacts to in-Delta drinking water › % of days with unsuitable water quality (share of days, 0 to 1)
        'ej-drinking-pct': {
          all: { '2019': 0.12, '2020': 0.15, run: 0.15 },
          moderate: { '2019': 0.17, '2020': 0.13, run: 0.18 },
          high: { '2019': 0.12, '2020': 0.16, run: 0.15 },
          highest: { '2019': 0, '2020': 0, run: 0 },
        },
      },
    },

    // Eco Machine
    em: {
      scores: {
        // Environmental Justice (score)
        environmentalJustice: 1,

        // Salinity impacts to in-Delta drinking water (score)
        'ej-drinking': {
          all: { '2019': 1, '2020': 1, run: 2 },
          moderate: { '2019': 4, '2020': 3, run: 4 },
          high: { '2019': 0, '2020': 1, run: 0 },
          highest: { '2019': 0, '2020': 0, run: 0 },
        },

        // Flood risk attenuation (score)
        'ej-flood': 0,

        // Water age + temperature (score)
        'ej-waterage': -1,
      },
      measures: {
        // Salinity impacts to in-Delta drinking water › % of days with unsuitable water quality (share of days, 0 to 1)
        'ej-drinking-pct': {
          all: { '2019': 0.1, '2020': 0.1, run: 0.11 },
          moderate: { '2019': 0.11, '2020': 0.05, run: 0.11 },
          high: { '2019': 0.1, '2020': 0.12, run: 0.13 },
          highest: { '2019': 0, '2020': 0, run: 0 },
        },

        // Water age + temperature › Suisun Marsh (days)
        'ej-waterage-suisun': 5.2,

        // Water age + temperature › Franks Tract (days)
        'ej-waterage-franksTract': 0.7,

        // Water age + temperature › South Delta (days)
        'ej-waterage-southDelta': -4.1,

        // Water age + temperature › McCormack-Williamson Tract (days)
        'ej-waterage-mcCormackWilliamson': 0.5,

        // Water age + temperature › Lindsey-Cache Slough (days)
        'ej-waterage-lindseyCache': -0.3,
      },
    },

    // New Green Watershed
    ngw: {
      scores: {
        // Environmental Justice (score)
        environmentalJustice: 1,

        // Salinity impacts to in-Delta drinking water (score)
        'ej-drinking': {
          all: { '2019': 1, '2020': 1, run: 1 },
          moderate: { '2019': 4, '2020': 2, run: 3 },
          high: { '2019': 0, '2020': 1, run: 0 },
          highest: { '2019': 0, '2020': 0, run: 0 },
        },

        // Flood risk attenuation (score)
        'ej-flood': 3,

        // Water age + temperature (score)
        'ej-waterage': -2,
      },
      measures: {
        // Salinity impacts to in-Delta drinking water › % of days with unsuitable water quality (share of days, 0 to 1)
        'ej-drinking-pct': {
          all: { '2019': 0.1, '2020': 0.1, run: 0.12 },
          moderate: { '2019': 0.11, '2020': 0.06, run: 0.12 },
          high: { '2019': 0.1, '2020': 0.12, run: 0.13 },
          highest: { '2019': 0, '2020': 0, run: 0 },
        },

        // Water age + temperature › Suisun Marsh (days)
        'ej-waterage-suisun': 5.2,

        // Water age + temperature › Franks Tract (days)
        'ej-waterage-franksTract': 0.7,

        // Water age + temperature › South Delta (days)
        'ej-waterage-southDelta': -4.1,

        // Water age + temperature › McCormack-Williamson Tract (days)
        'ej-waterage-mcCormackWilliamson': 0.7,

        // Water age + temperature › Lindsey-Cache Slough (days)
        'ej-waterage-lindseyCache': 3.6,
      },
    },

    // Bolster & Fortify
    bf: {
      scores: {
        // Environmental Justice (score)
        environmentalJustice: 0,

        // Salinity impacts to in-Delta drinking water (score)
        'ej-drinking': {
          all: { '2019': 1, '2020': 1, run: 1 },
          moderate: { '2019': 4, '2020': 3, run: 5 },
          high: { '2019': -1, '2020': 0, run: 0 },
          highest: { '2019': 0, '2020': 0, run: 0 },
        },

        // Flood risk attenuation (score)
        'ej-flood': 1,

        // Water age + temperature (score)
        'ej-waterage': -1,
      },
      measures: {
        // Salinity impacts to in-Delta drinking water › % of days with unsuitable water quality (share of days, 0 to 1)
        'ej-drinking-pct': {
          all: { '2019': 0.1, '2020': 0.1, run: 0.12 },
          moderate: { '2019': 0.11, '2020': 0.05, run: 0.1 },
          high: { '2019': 0.11, '2020': 0.13, run: 0.13 },
          highest: { '2019': 0, '2020': 0, run: 0 },
        },

        // Water age + temperature › Suisun Marsh (days)
        'ej-waterage-suisun': 0.1,

        // Water age + temperature › Franks Tract (days)
        'ej-waterage-franksTract': 2.4,

        // Water age + temperature › South Delta (days)
        'ej-waterage-southDelta': -0.9,

        // Water age + temperature › McCormack-Williamson Tract (days)
        'ej-waterage-mcCormackWilliamson': 0,

        // Water age + temperature › Lindsey-Cache Slough (days)
        'ej-waterage-lindseyCache': 0,
      },
    },

    // Calling on Reserves
    cor: {
      scores: {
        // Environmental Justice (score)
        environmentalJustice: 1,

        // Salinity impacts to in-Delta drinking water (score)
        'ej-drinking': {
          all: { '2019': 0, '2020': 2, run: 1 },
          moderate: { '2019': 0, '2020': 3, run: 2 },
          high: { '2019': 0, '2020': 1, run: 0 },
          highest: { '2019': 0, '2020': 0, run: 0 },
        },

        // Flood risk attenuation (score)
        'ej-flood': 0,

        // Water age + temperature (score)
        'ej-waterage': 0,
      },
      measures: {
        // Salinity impacts to in-Delta drinking water › % of days with unsuitable water quality (share of days, 0 to 1)
        'ej-drinking-pct': {
          all: { '2019': 0.12, '2020': 0.13, run: 0.14 },
          moderate: { '2019': 0.17, '2020': 0.1, run: 0.16 },
          high: { '2019': 0.12, '2020': 0.15, run: 0.15 },
          highest: { '2019': 0, '2020': 0, run: 0 },
        },

        // Water age + temperature › Suisun Marsh (days)
        'ej-waterage-suisun': 0,

        // Water age + temperature › Franks Tract (days)
        'ej-waterage-franksTract': 0,

        // Water age + temperature › South Delta (days)
        'ej-waterage-southDelta': 0.2,

        // Water age + temperature › McCormack-Williamson Tract (days)
        'ej-waterage-mcCormackWilliamson': 0.1,

        // Water age + temperature › Lindsey-Cache Slough (days)
        'ej-waterage-lindseyCache': 0,
      },
    },

    // A Tunnel
    tunnel: {
      scores: {
        // Environmental Justice (score)
        environmentalJustice: 0,

        // Salinity impacts to in-Delta drinking water (score)
        'ej-drinking': {
          all: { '2019': -1, '2020': 1, run: 0 },
          moderate: { '2019': -1, '2020': 1, run: 0 },
          high: { '2019': -1, '2020': 1, run: 0 },
          highest: { '2019': 0, '2020': 0, run: 0 },
        },

        // Flood risk attenuation (score)
        'ej-flood': 0,

        // Water age + temperature (score)
        'ej-waterage': 0,
      },
      measures: {
        // Salinity impacts to in-Delta drinking water › % of days with unsuitable water quality (share of days, 0 to 1)
        'ej-drinking-pct': {
          all: { '2019': 0.13, '2020': 0.14, run: 0.15 },
          moderate: { '2019': 0.18, '2020': 0.12, run: 0.18 },
          high: { '2019': 0.13, '2020': 0.15, run: 0.15 },
          highest: { '2019': 0, '2020': 0, run: 0 },
        },

        // Water age + temperature › Suisun Marsh (days)
        'ej-waterage-suisun': 0,

        // Water age + temperature › Franks Tract (days)
        'ej-waterage-franksTract': -0.1,

        // Water age + temperature › South Delta (days)
        'ej-waterage-southDelta': 0.3,

        // Water age + temperature › McCormack-Williamson Tract (days)
        'ej-waterage-mcCormackWilliamson': 0.2,

        // Water age + temperature › Lindsey-Cache Slough (days)
        'ej-waterage-lindseyCache': -0.3,
      },
    },
  },
}
