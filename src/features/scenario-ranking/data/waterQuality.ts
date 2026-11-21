// Water Quality & Regulation: everything the ranking shows for this criterion, in one place.
// Change a number or a sentence here and the By criterion table and its info cards
// follow. See ./types.ts for how to read it.
//
// A proposed sixth criterion (draft for team review, Nov 2026), ranked with the other
// five (model/teams.ts, RANKING_ORDER). The numbers are the prototype scores of
// the Water Quality Criterion draft, computed from the RMA, RMA-CalSim and SCHISM
// salinity runs at nine D-1641 stations.
import type { Facet, Row, Source, TeamData } from './types'

/** The draft that defines the criterion and holds its prototype scores. */
const SOURCE_DRAFT: Source = {
  doc: 'data',
  where: 'Water Quality Criterion draft (Nov 2026) · 3 Scores',
  quote:
    'Water Quality = average of the two metric scores, rounded. A · Salinity change (%) = average of four group scores, rounded. B · D-1641 exceedance days = average of four group scores, rounded.',
}

/** D-1641's objectives, which the exceedance-day metric tests. */
const SOURCE_D1641: Source = {
  doc: 'report',
  where: 'SWRCB Revised Water Right Decision 1641 (15 Mar 2000), Tables 1–4 and footnotes',
  quote:
    'Tables 1 to 4: municipal and industrial chloride, agricultural and export salinity, fish and wildlife, and the number of days the western Delta must stay fresh (X2).',
}

const NOT_BROKEN_OUT: Facet[] = [{ key: '*', label: 'Not broken out' }]

const SALINITY_BANDS = [
  '35+',
  '25–35',
  '15–25',
  '5–15',
  '1–5',
  '<1',
  '1–5',
  '5–15',
  '15–25',
  '25–35',
  '35+',
]

const SALINITY_SCALE_TEXT =
  'Percent change in average EC from the baseline. Under 1% scores 0; 1–5% is ±1, 5–15% ±2, 15–25% ±3, 25–35% ±4, and 35% or more ±5. Fresher is positive.'

/** The four station groups, each counted once whatever its number of stations. */
const GROUPS = [
  {
    key: 'west',
    label: 'Delta outflow',
    salinityNote:
      'Port Chicago (station 70), Mallard Island standing in for Chipps Island (station 82) and Collinsville (station 90).',
    d1641Note:
      'Collinsville (Table 3, every day fresh, Feb–Jun), Chipps Island and Port Chicago (Table 4, required fresh days, Feb–Jun) and San Joaquin River salinity at Jersey Point (Table 3, Apr–May).',
  },
  {
    key: 'muni',
    label: 'Municipal intakes',
    salinityNote:
      'Rock Slough standing in for the Contra Costa Canal intake (station 268) and Antioch (station 96): drinking water.',
    d1641Note:
      'Table 1: chloride at or below 250 mg/L every day at Rock Slough, and the yearly count of days at or below 150 mg/L at Contra Costa Canal or Antioch.',
  },
  {
    key: 'export',
    label: 'Export intakes',
    salinityNote:
      'West Canal at Clifton Court (station 360, SWP) and the Tracy Pumping Plant (station 358, CVP).',
    d1641Note:
      'Table 1: chloride at or below 250 mg/L every day at West Canal and Tracy; Table 2: monthly average EC at or below 1.0 mmhos/cm.',
  },
  {
    key: 'ag',
    label: 'West Delta agriculture',
    salinityNote: 'Emmaton (station 104) and Jersey Point (station 113).',
    d1641Note:
      'Table 2: each day’s 14-day average EC at Emmaton and Jersey Point against that day’s limit for the water year type, Apr 1–Aug 15.',
  },
]

/** A row and every row under it marked forthcoming for these scenarios. */
const forthcomingFor = (row: Row, scenarios: Row['forthcomingFor']): Row => ({
  ...row,
  forthcomingFor: scenarios,
  children: row.children?.map((child) => forthcomingFor(child, scenarios)),
})

/** The criterion's rows, the same in the adaptation and the tiered outflow tables. */
function criterionRows(note: string): Row {
  return {
    id: 'waterQuality',
    label: 'Water Quality & Regulation',
    level: 'team',
    provenance: 'reported',
    unit: 'score',
    betterHigher: true,
    note,
    places: NOT_BROKEN_OUT,
    periods: NOT_BROKEN_OUT,
    sources: [SOURCE_DRAFT],
    seaLevelRise: {
      note: 'With 2 ft of sea level rise, each scenario against its own Business as Usual with sea level rise.',
      sources: [SOURCE_DRAFT],
    },
    children: [
      {
        id: 'wq-salinity',
        label: 'Salinity change',
        level: 'metric',
        edge: 'averages',
        provenance: 'reported',
        unit: 'score',
        betterHigher: true,
        note: 'The percent change in average EC from the baseline, (scenario average − baseline average) ÷ baseline average, for each station and water year, then averaged across the group’s stations and the two years. Each group is scored on the Economy bands and the four group scores are averaged and rounded.',
        places: NOT_BROKEN_OUT,
        periods: NOT_BROKEN_OUT,
        sources: [SOURCE_DRAFT],
        seaLevelRise: {
          note: 'With 2 ft of sea level rise, against Business as Usual with sea level rise.',
          sources: [SOURCE_DRAFT],
        },
        info: {
          takeaway: {
            lead: 'How much **fresher or saltier** each group of D-1641 stations gets compared with the scenario’s own Business as Usual.',
            details: [
              'The same percent change means different things at different places: +10% at Port Chicago (about 11,000 µS/cm) is not +10% at the Tracy Pumping Plant, which supplies Delta exports. Grouping the stations by what they protect lets each group count once.',
              'Changes are compared as period averages, not averages of daily percentages, which overstate change on low-salinity days and can even flip its sign.',
            ],
          },
          measures:
            'Average EC (µS/cm) at nine D-1641 stations in four groups: Delta outflow, municipal intakes, export intakes and West Delta agriculture.',
          computed:
            'Percent change in average EC from the baseline, for each station and water year (2019 wet, 2020 dry), averaged across the group’s stations and both years.',
          scale: {
            axis: SALINITY_SCALE_TEXT,
            lowerBetter: true,
            bands: SALINITY_BANDS,
            ends: ['% fresher than Business as Usual', '% saltier'],
          },
          scored:
            'Each group’s percent change scores on the same bands as the Economy criterion: under 1% is 0; 1–5% is ±1, 5–15% ±2, 15–25% ±3, 25–35% ±4, and 35% or more ±5. The metric score is the mean of the four group scores, rounded.',
        },
        children: GROUPS.map((group) => ({
          id: `wq-salinity-${group.key}`,
          label: group.label,
          level: 'entity' as const,
          edge: 'averages' as const,
          provenance: 'reported' as const,
          unit: 'percent' as const,
          betterHigher: false,
          note: `Percent change in average EC, the mean of its stations: ${group.salinityNote} The group’s score sits beside it.`,
          places: NOT_BROKEN_OUT,
          periods: NOT_BROKEN_OUT,
          sources: [SOURCE_DRAFT],
          seaLevelRise: {
            note: `With 2 ft of sea level rise: ${group.salinityNote}`,
            sources: [SOURCE_DRAFT],
          },
        })),
      },
      {
        id: 'wq-d1641',
        label: 'D-1641 exceedance days',
        level: 'metric',
        edge: 'averages',
        provenance: 'reported',
        unit: 'score',
        betterHigher: true,
        note: 'The change in exceedance days, as a share of the days each objective applies. Within a group, exceedance days are added up before taking the share. 1 point per 1% change, capped at ±5; the four group scores are averaged and rounded.',
        places: NOT_BROKEN_OUT,
        periods: NOT_BROKEN_OUT,
        sources: [SOURCE_DRAFT, SOURCE_D1641],
        seaLevelRise: {
          note: 'With 2 ft of sea level rise, against Business as Usual with sea level rise.',
          sources: [SOURCE_DRAFT, SOURCE_D1641],
        },
        info: {
          takeaway: {
            lead: 'Whether the scenario changes **how often the modeled salinity misses a D-1641 water quality objective.**',
            details: [
              'An exceedance day here means the modeled salinity alone does not meet the objective; it is not a regulatory violation. D-1641 lets some objectives be met with enough Delta outflow instead, and the model results do not include outflow.',
              'Business as Usual has exceedance days too, so the score is the change from it, not a count.',
            ],
          },
          measures:
            'Days on which the modeled daily EC (or chloride converted from it) does not meet a D-1641 objective, at the same nine stations.',
          computed:
            'Exceedance days as a share of the days each objective applies, less the baseline’s share. Chloride comes from EC with the DWR-5 and Denton (2015) equations.',
          scale: {
            step: '%',
            axis: 'Change in exceedance days vs Business as Usual, 1 point per 1%, capped at ±5',
            lowerBetter: true,
          },
          scored:
            'Each group scores 1 point per 1% change in exceedance days, capped at ±5, as Environmental Justice does; fewer exceedance days is positive. The metric score is the mean of the four group scores, rounded.',
        },
        children: GROUPS.map((group) => ({
          id: `wq-d1641-${group.key}`,
          label: group.label,
          level: 'entity' as const,
          edge: 'averages' as const,
          provenance: 'reported' as const,
          unit: 'share' as const,
          betterHigher: false,
          note: `Exceedance days as a share of the days the objectives apply: ${group.d1641Note} The group’s score sits beside it.`,
          places: NOT_BROKEN_OUT,
          periods: NOT_BROKEN_OUT,
          sources: [SOURCE_DRAFT, SOURCE_D1641],
          seaLevelRise: {
            note: `With 2 ft of sea level rise: ${group.d1641Note}`,
            sources: [SOURCE_DRAFT, SOURCE_D1641],
          },
        })),
      },
    ],
  }
}

export const WATER_QUALITY: TeamData = {
  team: 'waterQuality',
  seaLevelRiseStatus: 'loaded',
  text: {
    takeaways: [
      'The Water Quality & Regulation score links the salinity modeling to each scenario at nine D-1641 compliance stations, grouped by what they protect: **Delta outflow, municipal intakes, export intakes and West Delta agriculture.** It asks two questions: how much fresher or saltier each place gets compared with the scenario’s own Business as Usual, and whether the scenario changes how often the D-1641 water quality objectives are exceeded.',
      'Under the current climate, ++Eco Machine++ and ++New Green Watershed++ are fresher at every group (+2); ++Bolster & Fortify++ and ++Calling on Reserves++ score +1. ++A Tunnel++ is saltier on average (−1 on salinity change) yet has fewer exceedance days in spring, when most objectives apply (+2). **With sea level rise, exceedance days separate the scenarios much more**, lifting Eco Machine and New Green Watershed to +4.',
    ],
    caveats: [
      'Draft: This is a proposed sixth criterion for team review. Its prototype scores count in the By scenario rankings like the other five criteria, so they may change once the team settles the open decisions (year weighting, the D-1641 scale and the overlap with Environmental Justice and Economy).',
      'Exceedance days: An exceedance day means the modeled salinity alone does not meet a D-1641 objective; it is not a regulatory violation. Some objectives can be met with enough Delta outflow instead, and the model results do not include outflow. Collinsville’s Suisun Marsh objective (high-tide EC) and Prisoners Point are not included.',
      'Baselines: Each scenario is compared with its own Business as Usual under the same climate. ++Eco Machine++, ++New Green Watershed++ and ++Bolster & Fortify++ use RMA’s Business as Usual; ++Calling on Reserves++ and ++A Tunnel++ use CalSim’s, which is unusually salty in spring 2020. ++Increased Delta Outflow++ is compared with the Historical Baseline (SCHISM run 15) for water year 2021 only.',
      'Stand-in stations: Four of the nine compliance points have no model station of their own, so the closest one stands in: Mallard Island for Chipps Island, Antioch near the Antioch Water Works intake, Rock Slough for the Contra Costa Canal intake, and West Canal near Clifton Court.',
      'Overlap: Environmental Justice also scores salinity in drinking water (at 49 small community systems), and Economy scores crop losses from irrigation salinity. Whether the municipal and West Delta agriculture groups stay here is a decision for the team.',
    ],
    criterion: {
      metrics: ['Salinity change', 'D-1641 exceedance days'],
      combine:
        'Their **mean, rounded to a whole point.** Each metric is itself the rounded mean of its four station groups, so each group counts once. The same rule applies with sea level rise.',
    },
    periodWhy:
      'Salinity change is calculated for each water year, 2019 (wet) and 2020 (dry), and the two are averaged with equal weight: scenarios behave differently in wet and dry years, and one year would hide that. D-1641 objectives keep their own periods, the day, the month or the calendar year, as each is written. Increased Delta Outflow covers water year 2021 (critical), the only year in that run.',
    placeWhy:
      'Nine model stations stand for the D-1641 compliance points in the western, central and south Delta. They are grouped by what they protect so that the three Delta outflow stations do not outweigh the two export intakes.',
  },
  // The By criterion table's rows, top to bottom
  rows: criterionRows(
    'The mean of two metric scores, rounded: Salinity change (banded percent change in average EC) and D-1641 exceedance days (1 point per 1% change). Each metric averages four station groups: Delta outflow, municipal intakes, export intakes and West Delta agriculture. Each scenario is read against its own Business as Usual: RMA’s for Eco Machine, New Green Watershed and Bolster & Fortify, CalSim’s for Calling on Reserves and A Tunnel.',
  ),
  outflowRows: forthcomingFor(
    criterionRows(
      'The mean of two metric scores, rounded, for water year 2021 (critical) against the Historical Baseline (SCHISM run 15). Only the +30% run has been scored; the −10% run is forthcoming.',
    ),
    ['less'],
  ),
  current: {
    // Business as Usual (RMA)
    bau: {
      measures: {
        'wq-salinity-west': 0,
        'wq-salinity-muni': 0,
        'wq-salinity-export': 0,
        'wq-salinity-ag': 0,
        // 61 of 736 days
        'wq-d1641-west': 0.0829,
        // 7 of 1136 days
        'wq-d1641-muni': 0.0062,
        // 0 of 2924 days
        'wq-d1641-export': 0,
        // 24 of 548 days
        'wq-d1641-ag': 0.0438,
      },
    },

    // CalSim’s Business as Usual
    csbau: {
      measures: {
        'wq-salinity-west': 0,
        'wq-salinity-muni': 0,
        'wq-salinity-export': 0,
        'wq-salinity-ag': 0,
        // 118 of 712 days
        'wq-d1641-west': 0.1657,
        // 113 of 1136 days
        'wq-d1641-muni': 0.0995,
        // 0 of 2924 days
        'wq-d1641-export': 0,
        // 68 of 548 days
        'wq-d1641-ag': 0.1241,
      },
    },

    // Eco Machine
    em: {
      takeaway: {
        lead: '++Eco Machine++ is **fresher at every station group** than Business as Usual. Its Water Quality & Regulation score, +2, is the rounded mean of its salinity change (+2) and D-1641 (+1) scores.',
        points: [
          {
            label: 'Salinity change',
            text: 'Average EC against Business as Usual, water years 2019 (wet) and 2020 (dry): Delta outflow −5.2%, municipal intakes −14.0%, export intakes −7.7%, West Delta agriculture −14.8%. Score +2.',
          },
          {
            label: 'D-1641',
            text: 'Change in exceedance days, as a share of the days each objective applies: Delta outflow −1.6%, municipal intakes −0.3%, export intakes 0%, West Delta agriculture −2.6%. Score +1.',
          },
        ],
      },
      scores: {
        waterQuality: 2,
        // Mean of the four group scores +2.00, rounded
        'wq-salinity': 2,
        // Mean of the four group scores +1.12, rounded
        'wq-d1641': 1,
      },
      measures: {
        'wq-salinity-west': -5.2,
        'wq-salinity-muni': -14,
        'wq-salinity-export': -7.7,
        'wq-salinity-ag': -14.8,
        // 49 of 736 days
        'wq-d1641-west': 0.0666,
        // 4 of 1136 days
        'wq-d1641-muni': 0.0035,
        // 0 of 2924 days
        'wq-d1641-export': 0,
        // 10 of 548 days
        'wq-d1641-ag': 0.0182,
      },
      ranks: {
        'wq-salinity-west': 2,
        'wq-salinity-muni': 2,
        'wq-salinity-export': 2,
        'wq-salinity-ag': 2,
        'wq-d1641-west': 1.6,
        'wq-d1641-muni': 0.3,
        'wq-d1641-export': 0,
        'wq-d1641-ag': 2.6,
      },
    },

    // New Green Watershed
    ngw: {
      takeaway: {
        lead: '++New Green Watershed++ is **fresher at every station group** than Business as Usual. Its Water Quality & Regulation score, +2, is the rounded mean of its salinity change (+2) and D-1641 (+1) scores.',
        points: [
          {
            label: 'Salinity change',
            text: 'Average EC against Business as Usual, water years 2019 (wet) and 2020 (dry): Delta outflow −4.5%, municipal intakes −14.1%, export intakes −7.4%, West Delta agriculture −14.3%. Score +2.',
          },
          {
            label: 'D-1641',
            text: 'Change in exceedance days, as a share of the days each objective applies: Delta outflow −1.9%, municipal intakes −0.4%, export intakes 0%, West Delta agriculture −2.4%. Score +1.',
          },
        ],
      },
      scores: {
        waterQuality: 2,
        // Mean of the four group scores +1.75, rounded
        'wq-salinity': 2,
        // Mean of the four group scores +1.18, rounded
        'wq-d1641': 1,
      },
      measures: {
        'wq-salinity-west': -4.5,
        'wq-salinity-muni': -14.1,
        'wq-salinity-export': -7.4,
        'wq-salinity-ag': -14.3,
        // 47 of 736 days
        'wq-d1641-west': 0.0639,
        // 3 of 1136 days
        'wq-d1641-muni': 0.0026,
        // 0 of 2924 days
        'wq-d1641-export': 0,
        // 11 of 548 days
        'wq-d1641-ag': 0.0201,
      },
      ranks: {
        'wq-salinity-west': 1,
        'wq-salinity-muni': 2,
        'wq-salinity-export': 2,
        'wq-salinity-ag': 2,
        'wq-d1641-west': 1.9,
        'wq-d1641-muni': 0.4,
        'wq-d1641-export': 0,
        'wq-d1641-ag': 2.4,
      },
    },

    // Bolster & Fortify
    bf: {
      takeaway: {
        lead: '++Bolster & Fortify++ is **fresher at the municipal intakes and export intakes** and saltier at the West Delta agriculture stations than Business as Usual. Its Water Quality & Regulation score, +1, is the rounded mean of its salinity change (+1) and D-1641 (0) scores.',
        points: [
          {
            label: 'Salinity change',
            text: 'Average EC against Business as Usual, water years 2019 (wet) and 2020 (dry): Delta outflow +0.3%, municipal intakes −8.4%, export intakes −6.2%, West Delta agriculture +1.6%. Score +1.',
          },
          {
            label: 'D-1641',
            text: 'Change in exceedance days, as a share of the days each objective applies: Delta outflow 0%, municipal intakes −0.3%, export intakes 0%, West Delta agriculture +0.2%. Score 0.',
          },
        ],
      },
      scores: {
        waterQuality: 1,
        // Mean of the four group scores +0.75, rounded
        'wq-salinity': 1,
        // Mean of the four group scores +0.02, rounded
        'wq-d1641': 0,
      },
      measures: {
        'wq-salinity-west': 0.3,
        'wq-salinity-muni': -8.4,
        'wq-salinity-export': -6.2,
        'wq-salinity-ag': 1.6,
        // 61 of 736 days
        'wq-d1641-west': 0.0829,
        // 4 of 1136 days
        'wq-d1641-muni': 0.0035,
        // 0 of 2924 days
        'wq-d1641-export': 0,
        // 25 of 548 days
        'wq-d1641-ag': 0.0456,
      },
      ranks: {
        'wq-salinity-west': 0,
        'wq-salinity-muni': 2,
        'wq-salinity-export': 2,
        'wq-salinity-ag': -1,
        'wq-d1641-west': 0,
        'wq-d1641-muni': 0.3,
        'wq-d1641-export': 0,
        'wq-d1641-ag': -0.2,
      },
    },

    // Calling on Reserves
    cor: {
      takeaway: {
        lead: '++Calling on Reserves++ is **fresher at the municipal intakes, export intakes and West Delta agriculture stations** than CalSim’s Business as Usual. Its Water Quality & Regulation score, +1, is the rounded mean of its salinity change (+1) and D-1641 (0) scores.',
        points: [
          {
            label: 'Salinity change',
            text: 'Average EC against CalSim’s Business as Usual, water years 2019 (wet) and 2020 (dry): Delta outflow −0.8%, municipal intakes −3.2%, export intakes −2.1%, West Delta agriculture −2.0%. Score +1.',
          },
          {
            label: 'D-1641',
            text: 'Change in exceedance days, as a share of the days each objective applies: Delta outflow +0.3%, municipal intakes 0%, export intakes 0%, West Delta agriculture 0%. Score 0.',
          },
        ],
      },
      scores: {
        waterQuality: 1,
        // Mean of the four group scores +0.75, rounded
        'wq-salinity': 1,
        // Mean of the four group scores −0.07, rounded
        'wq-d1641': 0,
      },
      measures: {
        'wq-salinity-west': -0.8,
        'wq-salinity-muni': -3.2,
        'wq-salinity-export': -2.1,
        'wq-salinity-ag': -2,
        // 124 of 736 days
        'wq-d1641-west': 0.1685,
        // 113 of 1136 days
        'wq-d1641-muni': 0.0995,
        // 0 of 2924 days
        'wq-d1641-export': 0,
        // 68 of 548 days
        'wq-d1641-ag': 0.1241,
      },
      ranks: {
        'wq-salinity-west': 0,
        'wq-salinity-muni': 1,
        'wq-salinity-export': 1,
        'wq-salinity-ag': 1,
        'wq-d1641-west': -0.3,
        'wq-d1641-muni': 0,
        'wq-d1641-export': 0,
        'wq-d1641-ag': 0,
      },
    },

    // A Tunnel
    tunnel: {
      takeaway: {
        lead: '++A Tunnel++ is **saltier at every station group** than CalSim’s Business as Usual. Its Water Quality & Regulation score, +1, is the rounded mean of its salinity change (−1) and D-1641 (+2) scores.',
        points: [
          {
            label: 'Salinity change',
            text: 'Average EC against CalSim’s Business as Usual, water years 2019 (wet) and 2020 (dry): Delta outflow +3.0%, municipal intakes +2.5%, export intakes +3.8%, West Delta agriculture +8.6%. Score −1.',
          },
          {
            label: 'D-1641',
            text: 'Change in exceedance days, as a share of the days each objective applies: Delta outflow −4.1%, municipal intakes +0.1%, export intakes +1.1%, West Delta agriculture −8.2%. Score +2.',
          },
          {
            label: 'Why D-1641 scores high',
            text: 'A Tunnel is saltier than CalSim’s Business as Usual for most of the year, but much fresher in spring 2020, when the Collinsville, Jersey Point and Emmaton objectives apply (Collinsville −52% in April 2020). The saltier summer and winter months mostly fall outside the objective periods.',
          },
        ],
      },
      scores: {
        waterQuality: 1,
        // Mean of the four group scores −1.25, rounded
        'wq-salinity': -1,
        // Mean of the four group scores +1.97, rounded
        'wq-d1641': 2,
      },
      measures: {
        'wq-salinity-west': 3,
        'wq-salinity-muni': 2.5,
        'wq-salinity-export': 3.8,
        'wq-salinity-ag': 8.6,
        // 89 of 712 days
        'wq-d1641-west': 0.125,
        // 114 of 1136 days
        'wq-d1641-muni': 0.1004,
        // 31 of 2924 days
        'wq-d1641-export': 0.0106,
        // 23 of 548 days
        'wq-d1641-ag': 0.042,
      },
      ranks: {
        'wq-salinity-west': -1,
        'wq-salinity-muni': -1,
        'wq-salinity-export': -1,
        'wq-salinity-ag': -2,
        'wq-d1641-west': 4.1,
        'wq-d1641-muni': -0.1,
        'wq-d1641-export': -1.1,
        'wq-d1641-ag': 5,
      },
    },

    // Historical Baseline (SCHISM run 15)
    hist: {
      measures: {
        'wq-salinity-west': 0,
        'wq-salinity-muni': 0,
        'wq-salinity-export': 0,
        'wq-salinity-ag': 0,
        // 103 of 103 days
        'wq-d1641-west': 1,
        // 368 of 520 days
        'wq-d1641-muni': 0.7077,
        // 0 of 1460 days
        'wq-d1641-export': 0,
        // 173 of 274 days
        'wq-d1641-ag': 0.6314,
      },
    },

    // Increased Delta Outflow
    more: {
      takeaway: {
        lead: '++Increased Delta Outflow++ is **fresher at every station group** than the Historical Baseline. Its Water Quality & Regulation score, +5, is the rounded mean of its salinity change (+5) and D-1641 (+4) scores.',
        points: [
          {
            label: 'Salinity change',
            text: 'Average EC against the Historical Baseline, water year 2021 (critical): Delta outflow −32.7%, municipal intakes −51.0%, export intakes −33.9%, West Delta agriculture −56.3%. Score +5.',
          },
          {
            label: 'D-1641',
            text: 'Change in exceedance days, as a share of the days each objective applies: Delta outflow −56.3%, municipal intakes −70.8%, export intakes 0%, West Delta agriculture −47.1%. Score +4.',
          },
        ],
      },
      scores: {
        waterQuality: 5,
        // Mean of the four group scores +4.50, rounded
        'wq-salinity': 5,
        // Mean of the four group scores +3.75, rounded
        'wq-d1641': 4,
      },
      measures: {
        'wq-salinity-west': -32.7,
        'wq-salinity-muni': -51,
        'wq-salinity-export': -33.9,
        'wq-salinity-ag': -56.3,
        // 45 of 103 days
        'wq-d1641-west': 0.4369,
        // 0 of 520 days
        'wq-d1641-muni': 0,
        // 0 of 1460 days
        'wq-d1641-export': 0,
        // 44 of 274 days
        'wq-d1641-ag': 0.1606,
      },
      ranks: {
        'wq-salinity-west': 4,
        'wq-salinity-muni': 5,
        'wq-salinity-export': 4,
        'wq-salinity-ag': 5,
        'wq-d1641-west': 5,
        'wq-d1641-muni': 5,
        'wq-d1641-export': 0,
        'wq-d1641-ag': 5,
      },
    },
  },
  seaLevelRise: {
    // Business as Usual (RMA)
    bau: {
      measures: {
        'wq-salinity-west': 0,
        'wq-salinity-muni': 0,
        'wq-salinity-export': 0,
        'wq-salinity-ag': 0,
        // 175 of 712 days
        'wq-d1641-west': 0.2458,
        // 166 of 1136 days
        'wq-d1641-muni': 0.1461,
        // 199 of 2924 days
        'wq-d1641-export': 0.0681,
        // 188 of 548 days
        'wq-d1641-ag': 0.3431,
      },
    },

    // CalSim’s Business as Usual
    csbau: {
      measures: {
        'wq-salinity-west': 0,
        'wq-salinity-muni': 0,
        'wq-salinity-export': 0,
        'wq-salinity-ag': 0,
        // 263 of 712 days
        'wq-d1641-west': 0.3694,
        // 189 of 1136 days
        'wq-d1641-muni': 0.1664,
        // 468 of 2924 days
        'wq-d1641-export': 0.1601,
        // 229 of 548 days
        'wq-d1641-ag': 0.4179,
      },
    },

    // Eco Machine
    em: {
      takeaway: {
        lead: '++Eco Machine++ is **fresher at every station group** than Business as Usual. Its Water Quality & Regulation score, +4, is the rounded mean of its salinity change (+2) and D-1641 (+5) scores.',
        points: [
          {
            label: 'Salinity change',
            text: 'Average EC against Business as Usual, water years 2019 (wet) and 2020 (dry): Delta outflow −6.4%, municipal intakes −16.1%, export intakes −11.3%, West Delta agriculture −14.4%. Score +2.',
          },
          {
            label: 'D-1641',
            text: 'Change in exceedance days, as a share of the days each objective applies: Delta outflow −4.8%, municipal intakes −7.8%, export intakes −6.8%, West Delta agriculture −14.2%. Score +5.',
          },
        ],
      },
      scores: {
        waterQuality: 4,
        // Mean of the four group scores +2.25, rounded
        'wq-salinity': 2,
        // Mean of the four group scores +4.95, rounded
        'wq-d1641': 5,
      },
      measures: {
        'wq-salinity-west': -6.4,
        'wq-salinity-muni': -16.1,
        'wq-salinity-export': -11.3,
        'wq-salinity-ag': -14.4,
        // 141 of 712 days
        'wq-d1641-west': 0.198,
        // 77 of 1136 days
        'wq-d1641-muni': 0.0678,
        // 0 of 2924 days
        'wq-d1641-export': 0,
        // 110 of 548 days
        'wq-d1641-ag': 0.2007,
      },
      ranks: {
        'wq-salinity-west': 2,
        'wq-salinity-muni': 3,
        'wq-salinity-export': 2,
        'wq-salinity-ag': 2,
        'wq-d1641-west': 4.8,
        'wq-d1641-muni': 5,
        'wq-d1641-export': 5,
        'wq-d1641-ag': 5,
      },
    },

    // New Green Watershed
    ngw: {
      takeaway: {
        lead: '++New Green Watershed++ is **fresher at every station group** than Business as Usual. Its Water Quality & Regulation score, +4, is the rounded mean of its salinity change (+2) and D-1641 (+5) scores.',
        points: [
          {
            label: 'Salinity change',
            text: 'Average EC against Business as Usual, water years 2019 (wet) and 2020 (dry): Delta outflow −5.7%, municipal intakes −16.0%, export intakes −10.9%, West Delta agriculture −13.1%. Score +2.',
          },
          {
            label: 'D-1641',
            text: 'Change in exceedance days, as a share of the days each objective applies: Delta outflow −4.9%, municipal intakes −7.9%, export intakes −6.8%, West Delta agriculture −13.1%. Score +5.',
          },
        ],
      },
      scores: {
        waterQuality: 4,
        // Mean of the four group scores +2.25, rounded
        'wq-salinity': 2,
        // Mean of the four group scores +4.97, rounded
        'wq-d1641': 5,
      },
      measures: {
        'wq-salinity-west': -5.7,
        'wq-salinity-muni': -16,
        'wq-salinity-export': -10.9,
        'wq-salinity-ag': -13.1,
        // 140 of 712 days
        'wq-d1641-west': 0.1966,
        // 76 of 1136 days
        'wq-d1641-muni': 0.0669,
        // 0 of 2924 days
        'wq-d1641-export': 0,
        // 116 of 548 days
        'wq-d1641-ag': 0.2117,
      },
      ranks: {
        'wq-salinity-west': 2,
        'wq-salinity-muni': 3,
        'wq-salinity-export': 2,
        'wq-salinity-ag': 2,
        'wq-d1641-west': 4.9,
        'wq-d1641-muni': 5,
        'wq-d1641-export': 5,
        'wq-d1641-ag': 5,
      },
    },

    // Bolster & Fortify
    bf: {
      takeaway: {
        lead: '++Bolster & Fortify++ is **fresher at the municipal intakes and export intakes** and saltier at the West Delta agriculture stations than Business as Usual. Its Water Quality & Regulation score, +2, is the rounded mean of its salinity change (+1) and D-1641 (+3) scores.',
        points: [
          {
            label: 'Salinity change',
            text: 'Average EC against Business as Usual, water years 2019 (wet) and 2020 (dry): Delta outflow +0.3%, municipal intakes −9.8%, export intakes −8.8%, West Delta agriculture +3.1%. Score +1.',
          },
          {
            label: 'D-1641',
            text: 'Change in exceedance days, as a share of the days each objective applies: Delta outflow 0%, municipal intakes −9.3%, export intakes −6.8%, West Delta agriculture 0%. Score +3.',
          },
        ],
      },
      scores: {
        waterQuality: 2,
        // Mean of the four group scores +0.75, rounded
        'wq-salinity': 1,
        // Mean of the four group scores +2.50, rounded
        'wq-d1641': 3,
      },
      measures: {
        'wq-salinity-west': 0.3,
        'wq-salinity-muni': -9.8,
        'wq-salinity-export': -8.8,
        'wq-salinity-ag': 3.1,
        // 175 of 712 days
        'wq-d1641-west': 0.2458,
        // 60 of 1136 days
        'wq-d1641-muni': 0.0528,
        // 0 of 2924 days
        'wq-d1641-export': 0,
        // 188 of 548 days
        'wq-d1641-ag': 0.3431,
      },
      ranks: {
        'wq-salinity-west': 0,
        'wq-salinity-muni': 2,
        'wq-salinity-export': 2,
        'wq-salinity-ag': -1,
        'wq-d1641-west': 0,
        'wq-d1641-muni': 5,
        'wq-d1641-export': 5,
        'wq-d1641-ag': 0,
      },
    },

    // Calling on Reserves
    cor: {
      takeaway: {
        lead: '++Calling on Reserves++ is **fresher at the municipal intakes, export intakes and West Delta agriculture stations** than CalSim’s Business as Usual. Its Water Quality & Regulation score, +1, is the rounded mean of its salinity change (+1) and D-1641 (0) scores.',
        points: [
          {
            label: 'Salinity change',
            text: 'Average EC against CalSim’s Business as Usual, water years 2019 (wet) and 2020 (dry): Delta outflow −0.9%, municipal intakes −3.0%, export intakes −3.0%, West Delta agriculture −1.3%. Score +1.',
          },
          {
            label: 'D-1641',
            text: 'Change in exceedance days, as a share of the days each objective applies: Delta outflow 0%, municipal intakes −3.3%, export intakes −0.1%, West Delta agriculture +1.8%. Score 0.',
          },
        ],
      },
      scores: {
        waterQuality: 1,
        // Mean of the four group scores +0.75, rounded
        'wq-salinity': 1,
        // Mean of the four group scores +0.40, rounded
        'wq-d1641': 0,
      },
      measures: {
        'wq-salinity-west': -0.9,
        'wq-salinity-muni': -3,
        'wq-salinity-export': -3,
        'wq-salinity-ag': -1.3,
        // 263 of 712 days
        'wq-d1641-west': 0.3694,
        // 152 of 1136 days
        'wq-d1641-muni': 0.1338,
        // 465 of 2924 days
        'wq-d1641-export': 0.159,
        // 239 of 548 days
        'wq-d1641-ag': 0.4361,
      },
      ranks: {
        'wq-salinity-west': 0,
        'wq-salinity-muni': 1,
        'wq-salinity-export': 1,
        'wq-salinity-ag': 1,
        'wq-d1641-west': 0,
        'wq-d1641-muni': 3.3,
        'wq-d1641-export': 0.1,
        'wq-d1641-ag': -1.8,
      },
    },

    // A Tunnel
    tunnel: {
      takeaway: {
        lead: '++A Tunnel++ is **saltier at every station group** than CalSim’s Business as Usual. Its Water Quality & Regulation score, +1, is the rounded mean of its salinity change (−1) and D-1641 (+2) scores.',
        points: [
          {
            label: 'Salinity change',
            text: 'Average EC against CalSim’s Business as Usual, water years 2019 (wet) and 2020 (dry): Delta outflow +2.3%, municipal intakes +2.0%, export intakes +4.5%, West Delta agriculture +7.5%. Score −1.',
          },
          {
            label: 'D-1641',
            text: 'Change in exceedance days, as a share of the days each objective applies: Delta outflow −8.1%, municipal intakes +0.5%, export intakes +1.6%, West Delta agriculture −5.1%. Score +2.',
          },
        ],
      },
      scores: {
        waterQuality: 1,
        // Mean of the four group scores −1.25, rounded
        'wq-salinity': -1,
        // Mean of the four group scores +1.98, rounded
        'wq-d1641': 2,
      },
      measures: {
        'wq-salinity-west': 2.3,
        'wq-salinity-muni': 2,
        'wq-salinity-export': 4.5,
        'wq-salinity-ag': 7.5,
        // 205 of 712 days
        'wq-d1641-west': 0.2879,
        // 195 of 1136 days
        'wq-d1641-muni': 0.1717,
        // 514 of 2924 days
        'wq-d1641-export': 0.1758,
        // 201 of 548 days
        'wq-d1641-ag': 0.3668,
      },
      ranks: {
        'wq-salinity-west': -1,
        'wq-salinity-muni': -1,
        'wq-salinity-export': -1,
        'wq-salinity-ag': -2,
        'wq-d1641-west': 5,
        'wq-d1641-muni': -0.5,
        'wq-d1641-export': -1.6,
        'wq-d1641-ag': 5,
      },
    },
  },
}
