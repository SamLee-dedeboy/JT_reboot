// Economy: everything the ranking shows for this criterion, in one place.
// Change a number or a sentence here and the By criterion table, its info cards, its
// maps and the By scenario rankings all follow. See ./types.ts for how to read it.
import type { Facet, Source, TeamData } from './types'

/** data: JT_Economy_results_for_dataviz__v20.xlsx (3 Nov 2026) · Scores */
const SOURCE_1: Source = {
  doc: 'data',
  where: 'JT_Economy_results_for_dataviz__v20.xlsx (3 Nov 2026) · Scores',
  quote:
    'SCORING RULE (v20, applied to every scenario): for each metric, add the land-use effect and the salinity effect in the dry year (2020) and divide by the Business As Usual baseline.',
}

/** data: JT_Economy_results_for_dataviz__v20.xlsx (3 Nov 2026) · LandUse */
const SOURCE_2: Source = {
  doc: 'data',
  where: 'JT_Economy_results_for_dataviz__v20.xlsx (3 Nov 2026) · LandUse',
  quote:
    'LandUse — farm revenue, jobs, value added, carbon-offset revenue and construction cost from land conversion. These are the results that decide the Eco Machine and New Green Watershed scores.',
}

/** data: JT_Economy_takeaways_and_outflow__v20.xlsx (3 Nov 2026) · Increased_Delta_outflow */
const SOURCE_3: Source = {
  doc: 'data',
  where: 'JT_Economy_takeaways_and_outflow__v20.xlsx (3 Nov 2026) · Increased_Delta_outflow',
  quote: 'A gain of about $20,000/yr is about 0.002% of Delta farm revenue, so the score is 0.',
}

const PERIODS_2019_2020: Facet[] = [
  { key: '2019', label: 'Wet Year' },
  { key: '2020', label: 'Dry Year' },
]

export const ECONOMY: TeamData = {
  team: 'economy',
  seaLevelRiseStatus: 'loaded',
  text: {
    takeaways: [
      'The Economy score measures how each scenario changes the Delta’s farm economy: annual farm sales (gross revenue), farm-supported jobs, and value added (wages, business income and taxes). Scenarios can affect farming in two ways: **by changing the salinity of irrigation water,** which lowers crop yields, and **by converting farmland to wetland or rice.** Farm revenue is reported as direct on-farm sales; jobs and value added are reported as totals, which include spending in the regional economy (IMPLAN multipliers).',
      'Salinity changes in every scenario are very small compared with the Delta’s $1.1 billion farm economy; **converting farmland to wetland is what moves the score.** The score counts costs to the farm economy only. It does not count carbon-credit income or other benefits of restoration, such as subsidence reversal, lower flood risk, better water quality, habitat and recreation.',
    ],
    caveats: [
      'Carbon-offset revenue is reported but not counted in the score: it is not farm revenue, it has no IMPLAN estimate, and its price is uncertain ($15 per metric ton of CO2 in these results). If it were counted, one score would change: ++New Green Watershed++’s 50% wetland revenue would move from −4 to −3.',
      'The Economy scores for ++Eco Machine++ and ++New Green Watershed++ measure changes in farm revenue, jobs and value added. They do not include the other benefits of restoration (subsidence reversal, lower flood risk and levee costs, water-supply and water-quality gains from Franks Tract, habitat, and recreation), so these scores show the cost side of the two scenarios, not their net economic effect.',
    ],
    criterion: {
      metrics: [
        'Annual gross agricultural revenues',
        'Agriculture-supported jobs',
        'Economic value added',
      ],
      combine:
        'Their **unweighted mean, rounded to a whole point**: −4 at 50% wetland (−3 at 25%, −5 at 100%). The same with 2 ft of sea level rise.',
    },
    periodWhy:
      'We use a wet year (2019) and a dry year (2020) to show the range of effects; salinity is higher and its effect on crops is larger in dry years. Salinity is averaged over April to September, when crops are irrigated and most sensitive to salt. Each scenario is evaluated under current climate and with 2 feet of sea level rise. Land-conversion results are for a typical year of farming (DWR 2024 land use) and are not tied to a wet or dry year. All dollars are annual, in 2024 dollars.',
    placeWhy:
      'We look at the farmland of the legal Delta because that is where salinity and land conversion affect the economy. Results are calculated for about 130 farming areas (mostly individual islands and tracts) and summed into four zones (North, Central, South and West Delta) and a Delta-wide total. Each area uses the salinity at the nearest model station. Eco Machine also covers Suisun Marsh, which has very little farmland. Jobs and value added include spending in the surrounding regional economy (IMPLAN multipliers).',
  },
  // The By criterion table's rows, top to bottom
  rows: {
    id: 'economy',
    label: 'Economy',
    level: 'team',
    provenance: 'reported',
    unit: 'score',
    betterHigher: true,
    note: 'Each metric is scored on its net percent change from Business as Usual: land use plus salinity in the dry year. Under 1% scores 0, so Bolster & Fortify, Calling on Reserves and A Tunnel (each under 0.003%) and Eco Machine (about −0.08%) score 0. New Green Watershed is scored per metric: −4, −4 and −3 at 50% wetland. The team gives no combined score, so its −4 here is the rounded mean of the three. Carbon-offset revenue is reported but not counted. Every score is the same with 2 ft of sea level rise. New Green Watershed uses 50% wetland restoration (−4; −3 at 25%, −5 at 100%, each the rounded mean of its metrics).',
    places: [{ key: '*', label: 'Not broken out' }],
    periods: PERIODS_2019_2020,
    sources: [SOURCE_1],
    seaLevelRise: {
      note: 'With 2 ft of sea level rise. The v20 Scores sheet gives every scenario the same score as under current climate.',
      sources: [SOURCE_1],
    },
    children: [
      {
        id: 'econ-revenue',
        label: 'Annual gross agricultural revenues',
        level: 'metric',
        edge: 'measures',
        provenance: 'reported',
        unit: 'score',
        betterHigher: true,
        note: 'Dollar sales from Delta farms relative to a $1.105B/yr base. The largest salinity-only loss is A Tunnel at −$27,000 in the dry year, about 80% of it in the Central Delta. The rows below come from two different pathways, which the v20 Scores sheet adds together. The land-conversion rows are New Green Watershed’s three restoration levels and Eco Machine’s farmed share of Suisun Marsh and Franks Tract. The salinity row carries all six scenarios. For each metric the land-use effect and the dry-year salinity effect are added and divided by the Business as Usual baseline ($1,105.1M direct revenue, 11,679 total jobs, $997M total value added). Under 1% scores 0; 1–5% is ±1, 5–15% ±2, 15–25% ±3, 25–35% ±4 and 35% or more ±5. The 1% threshold decides no score: the largest salinity effect is about 0.0025%, Eco Machine’s net change about 0.08%, and the smallest New Green Watershed change 16%. Reported Delta-wide and by four Delta zones — North, Central and South Delta on water-agency boundaries, plus West Delta — for a wet (2019) and a dry (2020) water year, under current climate and with 2 ft of sea level rise. Suisun Marsh sits outside the zones and enters only through the Eco Machine land-use estimate.',
        places: [{ key: '*', label: 'Not broken out' }],
        periods: PERIODS_2019_2020,
        seaLevelRise: {
          note: 'With 2 ft of sea level rise. The v20 Scores sheet gives every scenario the same score as under current climate.',
          sources: [SOURCE_1],
        },
        info: {
          takeaway: {
            lead: 'Gross revenue is the value of crops sold from Delta farmland, **about $1.1 billion per year.**',
            details: [
              'Salinity changes it by less than $100,000 per year in every scenario, even with sea level rise. Only ++New Green Watershed++ changes it substantially (19% to 46% lower), because land leaves farming.',
              'Readers should keep in mind that gross revenue is sales, not profit: farmers’ net income falls by less than this.',
            ],
          },
          measures: 'Farm gross revenue in the Delta.',
          computed: 'Direct gross revenue against Business as Usual ($1.105B a year).',
          scale: {
            axis: 'Net percent change from Business as Usual. Under 1% scores 0; 1–5% is ±1, 5–15% ±2, 15–25% ±3, 25–35% ±4, and 35% or more ±5.',
            bands: [
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
            ],
            ends: ['% lower than Business as Usual', '% higher'],
          },
          scoreRows: {
            heading: 'New Green Watershed, by restoration level',
            rows: [
              ['25% wetland', '−19.1%', -3],
              ['50% wetland', '−25.5%', -4],
              ['100% wetland', '−45.5%', -5],
            ],
          },
          scored:
            'Each scenario’s net percentage change from Business as Usual determines its score: under 1% is 0; 1–5% is ±1, 5–15% is ±2, 15–25% is ±3, 25–35% is ±4, and 35% or more is ±5.',
        },
        children: [
          {
            id: 'econ-revenue-land',
            label: 'Change from converting farmland to wetland',
            level: 'entity',
            edge: 'measures',
            provenance: 'reported',
            unit: 'usd',
            betterHigher: true,
            note: 'The change from converting farmland to wetland: Eco Machine’s tidal wetland in Suisun Marsh and Franks Tract, and New Green Watershed at 25%, 50% and 100% wetland restoration, each including Eco Machine’s footprint. The 50% level is the one the score uses. Land conversion is the same with sea level rise.',
            places: [{ key: '*', label: 'Not broken out' }],
            periods: [{ key: '*', label: 'Not broken out' }],
            sources: [
              {
                doc: 'data',
                where:
                  'JT_Economy_results_for_dataviz__v20.xlsx (3 Nov 2026) · LandUse, direct farm gross revenue',
                quote:
                  'Total incl. Eco Machine — Full MW –$503.2M (-45.5%); 0.5MW –$281.3M (-25.5%); 0.25MW –$211.2M (-19.1%). Eco Machine –$0.92M (-0.1%).',
              },
            ],
            notApplicable: ['bf', 'cor', 'tunnel'],
            notApplicableAt: {
              em: ['north', 'central', 'south', 'west'],
              ngw: ['north', 'central', 'south', 'west'],
            },
            seaLevelRise: {
              note: 'Land conversion is the same with sea level rise: the report carries these figures unchanged into the 2 ft runs, and its scores do not change.',
              sources: [SOURCE_2],
            },
          },
          {
            id: 'econ-revenue-carbon',
            label: 'Carbon-offset revenue',
            level: 'entity',
            edge: 'measures',
            provenance: 'reported',
            unit: 'usd',
            betterHigher: true,
            note: 'Yearly revenue from selling carbon offsets on converted land, at $15 per metric ton of CO2: 512% of the direct farm revenue Eco Machine loses, and 7.6–12.1% for New Green Watershed depending on the wetland level. Reported but not counted in the score: it is not farm revenue and its price is uncertain.',
            places: [{ key: '*', label: 'Not broken out' }],
            periods: [{ key: '*', label: 'Not broken out' }],
            sources: [SOURCE_2],
            notApplicable: ['bf', 'cor', 'tunnel'],
            notApplicableAt: {
              em: ['north', 'central', 'south', 'west'],
              ngw: ['north', 'central', 'south', 'west'],
            },
            seaLevelRise: {
              note: 'The LandUse sheet gives one set of carbon figures, with no separate sea-level-rise run.',
              sources: [SOURCE_2],
            },
          },
        ],
      },
      {
        id: 'econ-jobs',
        label: 'Agriculture-supported Jobs',
        level: 'metric',
        edge: 'measures',
        provenance: 'reported',
        unit: 'score',
        betterHigher: true,
        note: 'This includes direct farm jobs and the total after IMPLAN multipliers. The baseline is 7,526 direct and 11,679 total jobs. The rows below show total jobs. The largest salinity-only change is A Tunnel at −0.25 jobs in the dry year. The rows below come from two different pathways, which the v20 Scores sheet adds together. The land-conversion rows are New Green Watershed’s three restoration levels and Eco Machine’s farmed share of Suisun Marsh and Franks Tract. The salinity row carries all six scenarios. For each metric the land-use effect and the dry-year salinity effect are added and divided by the Business as Usual baseline ($1,105.1M direct revenue, 11,679 total jobs, $997M total value added). Under 1% scores 0; 1–5% is ±1, 5–15% ±2, 15–25% ±3, 25–35% ±4 and 35% or more ±5. The 1% threshold decides no score: the largest salinity effect is about 0.0025%, Eco Machine’s net change about 0.08%, and the smallest New Green Watershed change 16%. Reported Delta-wide and by four Delta zones — North, Central and South Delta on water-agency boundaries, plus West Delta — for a wet (2019) and a dry (2020) water year, under current climate and with 2 ft of sea level rise. Suisun Marsh sits outside the zones and enters only through the Eco Machine land-use estimate.',
        places: [{ key: '*', label: 'Not broken out' }],
        periods: PERIODS_2019_2020,
        seaLevelRise: {
          note: 'With 2 ft of sea level rise. The v20 Scores sheet gives every scenario the same score as under current climate.',
          sources: [SOURCE_1],
        },
        info: {
          takeaway: {
            lead: 'Jobs include farm work and jobs in businesses that serve farms and farm households (**about 11,700 in total,** including multiplier effects).',
            details: [
              'Through salinity, no scenario differs from ++Business as Usual++ by more than about half a job. ++New Green Watershed++ reduces total jobs by about 3,700 to 5,000 (31% to 43%), so its job scores (−4, −4, −5) are as low as or lower than its revenue scores.',
              'Job losses are proportionally larger than revenue losses when land switches to rice, because rice needs fewer workers per dollar of revenue.',
            ],
          },
          measures: 'Farm jobs in the Delta.',
          computed: 'Total jobs against Business as Usual (7,526 direct, 11,679 total).',
          scale: {
            axis: 'Net percent change from Business as Usual. Under 1% scores 0; 1–5% is ±1, 5–15% ±2, 15–25% ±3, 25–35% ±4, and 35% or more ±5.',
            bands: [
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
            ],
            ends: ['% lower than Business as Usual', '% higher'],
          },
          scoreRows: {
            heading: 'New Green Watershed, by restoration level',
            rows: [
              ['25% wetland', '−31.3%', -4],
              ['50% wetland', '−34.2%', -4],
              ['100% wetland', '−42.8%', -5],
            ],
          },
          scored:
            'Each scenario’s net percentage change from Business as Usual determines its score: under 1% is 0; 1–5% is ±1, 5–15% is ±2, 15–25% is ±3, 25–35% is ±4, and 35% or more is ±5.',
        },
        children: [
          {
            id: 'econ-jobs-land',
            label: 'Change from converting farmland to wetland',
            level: 'entity',
            edge: 'measures',
            provenance: 'reported',
            unit: 'jobs',
            betterHigher: true,
            note: 'The change from converting farmland to wetland: Eco Machine’s tidal wetland in Suisun Marsh and Franks Tract, and New Green Watershed at 25%, 50% and 100% wetland restoration, each including Eco Machine’s footprint. The 50% level is the one the score uses. Land conversion is the same with sea level rise.',
            places: [{ key: '*', label: 'Not broken out' }],
            periods: [{ key: '*', label: 'Not broken out' }],
            sources: [
              {
                doc: 'data',
                where:
                  'JT_Economy_results_for_dataviz__v20.xlsx (3 Nov 2026) · LandUse, total jobs',
                quote:
                  'Total incl. Eco Machine — Full MW -4,999; 0.5MW -3,995; 0.25MW -3,657. Eco Machine -9.7.',
              },
            ],
            notApplicable: ['bf', 'cor', 'tunnel'],
            notApplicableAt: {
              em: ['north', 'central', 'south', 'west'],
              ngw: ['north', 'central', 'south', 'west'],
            },
            seaLevelRise: {
              note: 'Land conversion is the same with sea level rise: the report carries these figures unchanged into the 2 ft runs, and its scores do not change.',
              sources: [SOURCE_2],
            },
          },
        ],
      },
      {
        id: 'econ-value',
        label: 'Economic value added',
        level: 'metric',
        edge: 'measures',
        provenance: 'reported',
        unit: 'score',
        betterHigher: true,
        note: 'Wages, business income, and taxes after revenue circulates, approximately regional GDP: $670M direct and $997M with multipliers. The rows below show total value added. The largest salinity-only loss is A Tunnel at −$24,000 total value added in the dry year. The rows below come from two different pathways, which the v20 Scores sheet adds together. The land-conversion rows are New Green Watershed’s three restoration levels and Eco Machine’s farmed share of Suisun Marsh and Franks Tract. The salinity row carries all six scenarios. For each metric the land-use effect and the dry-year salinity effect are added and divided by the Business as Usual baseline ($1,105.1M direct revenue, 11,679 total jobs, $997M total value added). Under 1% scores 0; 1–5% is ±1, 5–15% ±2, 15–25% ±3, 25–35% ±4 and 35% or more ±5. The 1% threshold decides no score: the largest salinity effect is about 0.0025%, Eco Machine’s net change about 0.08%, and the smallest New Green Watershed change 16%. Reported Delta-wide and by four Delta zones — North, Central and South Delta on water-agency boundaries, plus West Delta — for a wet (2019) and a dry (2020) water year, under current climate and with 2 ft of sea level rise. Suisun Marsh sits outside the zones and enters only through the Eco Machine land-use estimate.',
        places: [{ key: '*', label: 'Not broken out' }],
        periods: PERIODS_2019_2020,
        seaLevelRise: {
          note: 'With 2 ft of sea level rise. The v20 Scores sheet gives every scenario the same score as under current climate.',
          sources: [SOURCE_1],
        },
        info: {
          takeaway: {
            lead: 'Value added is the income that Delta farming generates in the regional economy: wages, business income and taxes, **about $1 billion per year in total.**',
            details: [
              'It follows the same pattern as revenue: negligible change from salinity, and a 16% to 46% reduction under ++New Green Watershed++.',
              'Construction spending and carbon-credit income are not included in value added.',
            ],
          },
          measures: 'Value added: wages, business income and taxes from Delta farming.',
          computed:
            'Total value added against Business as Usual ($670M direct, $997M total a year).',
          scale: {
            axis: 'Net percent change from Business as Usual. Under 1% scores 0; 1–5% is ±1, 5–15% ±2, 15–25% ±3, 25–35% ±4, and 35% or more ±5.',
            bands: [
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
            ],
            ends: ['% lower than Business as Usual', '% higher'],
          },
          scoreRows: {
            heading: 'New Green Watershed, by restoration level',
            rows: [
              ['25% wetland', '−16.1%', -3],
              ['50% wetland', '−23.2%', -3],
              ['100% wetland', '−45.8%', -5],
            ],
          },
          scored:
            'Each scenario’s net percentage change from Business as Usual determines its score: under 1% is 0; 1–5% is ±1, 5–15% is ±2, 15–25% is ±3, 25–35% is ±4, and 35% or more is ±5.',
        },
        children: [
          {
            id: 'econ-value-land',
            label: 'Change from converting farmland to wetland',
            level: 'entity',
            edge: 'measures',
            provenance: 'reported',
            unit: 'usd',
            betterHigher: true,
            note: 'The change from converting farmland to wetland: Eco Machine’s tidal wetland in Suisun Marsh and Franks Tract, and New Green Watershed at 25%, 50% and 100% wetland restoration, each including Eco Machine’s footprint. The 50% level is the one the score uses. Land conversion is the same with sea level rise.',
            places: [{ key: '*', label: 'Not broken out' }],
            periods: [{ key: '*', label: 'Not broken out' }],
            sources: [
              {
                doc: 'data',
                where:
                  'JT_Economy_results_for_dataviz__v20.xlsx (3 Nov 2026) · LandUse, total value added',
                quote:
                  'Total incl. Eco Machine — Full MW –$456.2M; 0.5MW –$230.9M; 0.25MW –$160.3M. Eco Machine –$0.83M.',
              },
            ],
            notApplicable: ['bf', 'cor', 'tunnel'],
            notApplicableAt: {
              em: ['north', 'central', 'south', 'west'],
              ngw: ['north', 'central', 'south', 'west'],
            },
            seaLevelRise: {
              note: 'Land conversion is the same with sea level rise: the report carries these figures unchanged into the 2 ft runs, and its scores do not change.',
              sources: [SOURCE_2],
            },
          },
        ],
      },
    ],
  },
  // The tiered outflow table's rows
  outflowRows: {
    id: 'economy',
    label: 'Economy',
    level: 'team',
    provenance: 'reported',
    unit: 'score',
    betterHigher: true,
    note: 'The +30% Sacramento River flow run (SCHISM run 16) against its Historical Baseline (run 15), water year 2021: a dry year, in a different model and year from the other scenarios, with no sea level rise run. Under 1% of the baseline scores 0, the same rule as every scenario. The team has not scored −10% outflow.',
    places: [{ key: '*', label: 'Not broken out' }],
    periods: [{ key: '*', label: 'Not broken out' }],
    forthcoming: false,
    forthcomingFor: ['less'],
    sources: [SOURCE_3],
    children: [
      {
        id: 'econ-revenue',
        label: 'Gross revenues',
        level: 'metric',
        edge: 'averages',
        provenance: 'reported',
        unit: 'score',
        betterHigher: true,
        note: 'The +30% Sacramento River flow run (SCHISM run 16) against its Historical Baseline (run 15), water year 2021: a dry year, in a different model and year from the other scenarios, with no sea level rise run. Under 1% of the baseline scores 0, the same rule as every scenario. The team has not scored −10% outflow.',
        places: [{ key: '*', label: 'Not broken out' }],
        periods: [{ key: '*', label: 'Not broken out' }],
        forthcoming: false,
        forthcomingFor: ['less'],
        sources: [SOURCE_3],
        children: [
          {
            id: 'econ-revenue-land',
            label: 'Change from converting farmland to wetland',
            level: 'metric',
            edge: 'averages',
            provenance: 'reported',
            unit: 'score',
            betterHigher: true,
            note: 'The tiered outflow runs change flow, not the landscape.',
            places: [{ key: '*', label: 'Not broken out' }],
            periods: [{ key: '*', label: 'Not broken out' }],
            notApplicable: ['more', 'less', 'hist'],
          },
          {
            id: 'econ-revenue-salinity',
            label: 'Salinity effects across the Delta',
            level: 'entity',
            edge: 'measures',
            provenance: 'reported',
            unit: 'usd',
            betterHigher: true,
            note: 'The +30% Sacramento River flow run (SCHISM run 16) against its Historical Baseline (run 15), water year 2021: a dry year, in a different model and year from the other scenarios, with no sea level rise run. Under 1% of the baseline scores 0, the same rule as every scenario. The team has not scored −10% outflow.',
            places: [{ key: '*', label: 'Not broken out' }],
            periods: [{ key: '*', label: 'Not broken out' }],
            forthcoming: false,
            forthcomingFor: ['less'],
            sources: [SOURCE_3],
          },
          {
            id: 'econ-revenue-carbon',
            label: 'Carbon-offset revenue',
            level: 'metric',
            edge: 'averages',
            provenance: 'reported',
            unit: 'score',
            betterHigher: true,
            note: 'The tiered outflow runs change flow, not the landscape.',
            places: [{ key: '*', label: 'Not broken out' }],
            periods: [{ key: '*', label: 'Not broken out' }],
            notApplicable: ['more', 'less', 'hist'],
          },
        ],
      },
      {
        id: 'econ-jobs',
        label: 'Jobs',
        level: 'metric',
        edge: 'averages',
        provenance: 'reported',
        unit: 'score',
        betterHigher: true,
        note: 'The +30% Sacramento River flow run (SCHISM run 16) against its Historical Baseline (run 15), water year 2021: a dry year, in a different model and year from the other scenarios, with no sea level rise run. Under 1% of the baseline scores 0, the same rule as every scenario. The team has not scored −10% outflow.',
        places: [{ key: '*', label: 'Not broken out' }],
        periods: [{ key: '*', label: 'Not broken out' }],
        forthcoming: false,
        forthcomingFor: ['less'],
        sources: [SOURCE_3],
        children: [
          {
            id: 'econ-jobs-land',
            label: 'Change from converting farmland to wetland',
            level: 'metric',
            edge: 'averages',
            provenance: 'reported',
            unit: 'score',
            betterHigher: true,
            note: 'The tiered outflow runs change flow, not the landscape.',
            places: [{ key: '*', label: 'Not broken out' }],
            periods: [{ key: '*', label: 'Not broken out' }],
            notApplicable: ['more', 'less', 'hist'],
          },
          {
            id: 'econ-jobs-salinity',
            label: 'Salinity effects across the Delta',
            level: 'entity',
            edge: 'measures',
            provenance: 'reported',
            unit: 'jobs',
            betterHigher: true,
            note: 'The +30% Sacramento River flow run (SCHISM run 16) against its Historical Baseline (run 15), water year 2021: a dry year, in a different model and year from the other scenarios, with no sea level rise run. Under 1% of the baseline scores 0, the same rule as every scenario. The team has not scored −10% outflow.',
            places: [{ key: '*', label: 'Not broken out' }],
            periods: [{ key: '*', label: 'Not broken out' }],
            forthcoming: false,
            forthcomingFor: ['less'],
            sources: [SOURCE_3],
          },
        ],
      },
      {
        id: 'econ-value',
        label: 'Value added',
        level: 'metric',
        edge: 'averages',
        provenance: 'reported',
        unit: 'score',
        betterHigher: true,
        note: 'The +30% Sacramento River flow run (SCHISM run 16) against its Historical Baseline (run 15), water year 2021: a dry year, in a different model and year from the other scenarios, with no sea level rise run. Under 1% of the baseline scores 0, the same rule as every scenario. The team has not scored −10% outflow.',
        places: [{ key: '*', label: 'Not broken out' }],
        periods: [{ key: '*', label: 'Not broken out' }],
        forthcoming: false,
        forthcomingFor: ['less'],
        sources: [SOURCE_3],
        children: [
          {
            id: 'econ-value-land',
            label: 'Change from converting farmland to wetland',
            level: 'metric',
            edge: 'averages',
            provenance: 'reported',
            unit: 'score',
            betterHigher: true,
            note: 'The tiered outflow runs change flow, not the landscape.',
            places: [{ key: '*', label: 'Not broken out' }],
            periods: [{ key: '*', label: 'Not broken out' }],
            notApplicable: ['more', 'less', 'hist'],
          },
          {
            id: 'econ-value-salinity',
            label: 'Salinity effects across the Delta',
            level: 'entity',
            edge: 'measures',
            provenance: 'reported',
            unit: 'usd',
            betterHigher: true,
            note: 'The +30% Sacramento River flow run (SCHISM run 16) against its Historical Baseline (run 15), water year 2021: a dry year, in a different model and year from the other scenarios, with no sea level rise run. Under 1% of the baseline scores 0, the same rule as every scenario. The team has not scored −10% outflow.',
            places: [{ key: '*', label: 'Not broken out' }],
            periods: [{ key: '*', label: 'Not broken out' }],
            forthcoming: false,
            forthcomingFor: ['less'],
            sources: [SOURCE_3],
          },
        ],
      },
    ],
  },
  // Today's sea level
  current: {
    // Business as Usual
    bau: {
      measures: {
        // Annual gross agricultural revenues › Change from converting farmland to wetland (dollars a year, change)
        'econ-revenue-land': 0,

        // Annual gross agricultural revenues › Carbon-offset revenue (dollars a year, change)
        'econ-revenue-carbon': 0,

        // Agriculture-supported Jobs › Change from converting farmland to wetland (jobs)
        'econ-jobs-land': 0,

        // Economic value added › Change from converting farmland to wetland (dollars a year, change)
        'econ-value-land': 0,
      },
    },

    // Eco Machine
    em: {
      takeaway: {
        lead: 'Eco Machine restores about 43,120 acres of tidal marsh in Suisun Marsh and Franks Tract, but **almost none of this land is farmed.**',
        points: [
          {
            label: 'Farm economy',
            text: 'Converting that land lowers farm revenue by about $0.9 million per year and affects about 10 jobs (including multiplier effects).',
          },
          {
            label: 'Salinity',
            text: 'The fresher irrigation water it brings to Delta farms adds about $3,500 per year in a dry year ($24,000 with 2 feet of sea level rise), which offsets at most about 3% of that loss.',
          },
          { label: 'Score', text: 'The net change is less than 0.1%, so the score is 0.' },
          {
            label: 'Construction and credits',
            text: 'The main economic cost is construction, about $1.3 billion one time. Carbon credits would bring about $4.7 million per year.',
          },
          {
            label: 'Not counted',
            text: 'Benefits such as better water quality for exports from the Franks Tract redesign and new habitat are not counted in the score.',
          },
        ],
      },
      scores: {
        // Economy (score)
        economy: 0,

        // Annual gross agricultural revenues (score)
        'econ-revenue': 0,

        // Agriculture-supported Jobs (score)
        'econ-jobs': 0,

        // Economic value added (score)
        'econ-value': 0,
      },
      measures: {
        // Annual gross agricultural revenues › Change from converting farmland to wetland (dollars a year, change)
        'econ-revenue-land': -922132,

        // Annual gross agricultural revenues › Carbon-offset revenue (dollars a year, change)
        'econ-revenue-carbon': 4724540,

        // Agriculture-supported Jobs › Change from converting farmland to wetland (jobs)
        'econ-jobs-land': -10,

        // Economic value added › Change from converting farmland to wetland (dollars a year, change)
        'econ-value-land': -833472,
      },
    },

    // New Green Watershed
    ngw: {
      takeaway: {
        lead: 'New Green Watershed has **the largest economic cost of the scenarios** because it takes farmland out of production.',
        points: [
          {
            label: 'Farm economy',
            text: 'Depending on how much land becomes wetland, direct farm revenue falls 19% to 46%, total jobs (including multiplier effects) fall 31% to 43%, and total value added falls 16% to 46%.',
          },
          {
            label: 'Scores',
            text: 'Scores: −3 (revenue), −4 (jobs), −3 (value added) at 25% wetland; −4, −4, −3 at 50%; and −5 on all three at 100%.',
          },
          {
            label: 'Conversion',
            text: 'Converting land to rice instead of wetland keeps more revenue but fewer jobs.',
          },
          {
            label: 'Construction and credits',
            text: 'Carbon credits would replace about 8% to 12% of the lost farm revenue. Construction would cost about $1.6 to $1.9 billion.',
          },
          {
            label: 'Not counted',
            text: 'Subsidence reversal, lower levee and flood costs, and habitat are not counted, so the score shows the cost side only.',
          },
        ],
      },
      wetlandTakeaways: [
        {
          lead: 'New Green Watershed has **the largest economic cost of the scenarios** because it takes farmland out of production.',
          points: [
            {
              label: 'Farm economy',
              text: 'At 25% wetland, direct farm revenue falls 19.1%, total jobs (including multiplier effects) fall 31.3%, and total value added falls 16.1%. Scores: −3 (revenue), −4 (jobs), −3 (value added).',
            },
            {
              label: 'Carbon credits',
              text: 'Carbon credits would replace about 12% of the lost farm revenue.',
            },
            {
              label: 'Conversion',
              text: 'Converting land to rice instead of wetland keeps more revenue but fewer jobs. Construction would cost about $1.6 to $1.9 billion.',
            },
            {
              label: 'Not counted',
              text: 'Subsidence reversal, lower levee and flood costs, and habitat are not counted, so the score shows the cost side only.',
            },
          ],
        },
        {
          lead: 'New Green Watershed has **the largest economic cost of the scenarios** because it takes farmland out of production.',
          points: [
            {
              label: 'Farm economy',
              text: 'At 50% wetland, direct farm revenue falls 25.5%, total jobs (including multiplier effects) fall 34.2%, and total value added falls 23.2%. Scores: −4 (revenue), −4 (jobs), −3 (value added).',
            },
            {
              label: 'Carbon credits',
              text: 'Carbon credits would replace about 10% of the lost farm revenue.',
            },
            {
              label: 'Conversion',
              text: 'Converting land to rice instead of wetland keeps more revenue but fewer jobs. Construction would cost about $1.6 to $1.9 billion.',
            },
            {
              label: 'Not counted',
              text: 'Subsidence reversal, lower levee and flood costs, and habitat are not counted, so the score shows the cost side only.',
            },
          ],
        },
        {
          lead: 'New Green Watershed has **the largest economic cost of the scenarios** because it takes farmland out of production.',
          points: [
            {
              label: 'Farm economy',
              text: 'At 100% wetland, direct farm revenue falls 45.5%, total jobs (including multiplier effects) fall 42.8%, and total value added falls 45.8%. Scores: −5 on all three.',
            },
            {
              label: 'Carbon credits',
              text: 'Carbon credits would replace about 8% of the lost farm revenue.',
            },
            {
              label: 'Conversion',
              text: 'Converting land to rice instead of wetland keeps more revenue but fewer jobs. Construction would cost about $1.6 to $1.9 billion.',
            },
            {
              label: 'Not counted',
              text: 'Subsidence reversal, lower levee and flood costs, and habitat are not counted, so the score shows the cost side only.',
            },
          ],
        },
      ],
      scores: {
        // Economy (score)
        economy: -4,

        // Annual gross agricultural revenues (score)
        'econ-revenue': -4,

        // Agriculture-supported Jobs (score)
        'econ-jobs': -4,

        // Economic value added (score)
        'econ-value': -3,
      },
      wetlandLevels: {
        // Economy (score)
        economy: { wetland25: -3, wetland100: -5 },

        // Annual gross agricultural revenues (score)
        'econ-revenue': { wetland25: -3, wetland100: -5 },

        // Annual gross agricultural revenues › Change from converting farmland to wetland (dollars a year, change)
        'econ-revenue-land': { wetland25: -211201749, wetland100: -503210966 },

        // Annual gross agricultural revenues › Carbon-offset revenue (dollars a year, change)
        'econ-revenue-carbon': { wetland25: 25463214, wetland100: 38180334 },

        // Agriculture-supported Jobs (score)
        'econ-jobs': { wetland25: -4, wetland100: -5 },

        // Agriculture-supported Jobs › Change from converting farmland to wetland (jobs)
        'econ-jobs-land': { wetland25: -3657, wetland100: -4999 },

        // Economic value added (score)
        'econ-value': { wetland25: -3, wetland100: -5 },

        // Economic value added › Change from converting farmland to wetland (dollars a year, change)
        'econ-value-land': { wetland25: -160317849, wetland100: -456217849 },
      },
      measures: {
        // Annual gross agricultural revenues › Change from converting farmland to wetland (dollars a year, change)
        'econ-revenue-land': -281295055,

        // Annual gross agricultural revenues › Carbon-offset revenue (dollars a year, change)
        'econ-revenue-carbon': 28591277,

        // Agriculture-supported Jobs › Change from converting farmland to wetland (jobs)
        'econ-jobs-land': -3995,

        // Economic value added › Change from converting farmland to wetland (dollars a year, change)
        'econ-value-land': -230917849,
      },
    },

    // Bolster & Fortify
    bf: {
      takeaway: {
        lead: 'Bolster & Fortify **affects farming only through salinity.**',
        points: [
          {
            label: 'Salinity',
            text: 'In a dry year it makes irrigation water slightly saltier, mostly in the Central Delta, and lowers farm revenue by about $10,000 per year (about $27,000 with 2 feet of sea level rise).',
          },
          {
            label: 'Score',
            text: 'This is less than 0.003% of Delta farm revenue, so the score is 0.',
          },
        ],
      },
      scores: {
        // Economy (score)
        economy: 0,

        // Annual gross agricultural revenues (score)
        'econ-revenue': 0,

        // Agriculture-supported Jobs (score)
        'econ-jobs': 0,

        // Economic value added (score)
        'econ-value': 0,
      },
    },

    // Calling on Reserves
    cor: {
      takeaway: {
        lead: 'Calling on Reserves **leaves irrigation-water salinity and farm income about where they are.**',
        points: [
          {
            label: 'Salinity',
            text: 'In a dry year it makes water slightly fresher on some western islands, a gain of a few thousand dollars per year.',
          },
          { label: 'Score', text: 'The score is 0.' },
        ],
      },
      scores: {
        // Economy (score)
        economy: 0,

        // Annual gross agricultural revenues (score)
        'econ-revenue': 0,

        // Agriculture-supported Jobs (score)
        'econ-jobs': 0,

        // Economic value added (score)
        'econ-value': 0,
      },
    },

    // A Tunnel
    tunnel: {
      takeaway: {
        lead: 'A Tunnel **shifts dry-year salinity from the western to the central Delta:** water becomes somewhat saltier on central islands such as Rindge Tract, Roberts Island, McDonald Island and Jones Tract, and fresher on western islands.',
        points: [
          {
            label: 'Farm revenue',
            text: 'Farm revenue falls by about $27,000 per year in a dry year (about $19,000 with sea level rise).',
          },
          {
            label: 'Score',
            text: 'This is less than 0.003% of Delta farm revenue, so the score is 0.',
          },
        ],
      },
      scores: {
        // Economy (score)
        economy: 0,

        // Annual gross agricultural revenues (score)
        'econ-revenue': 0,

        // Agriculture-supported Jobs (score)
        'econ-jobs': 0,

        // Economic value added (score)
        'econ-value': 0,
      },
    },

    // Historical Baseline
    hist: {
      measures: {
        // Gross revenues › Salinity effects across the Delta (dollars a year, change)
        'econ-revenue-salinity': 0,

        // Jobs › Salinity effects across the Delta (jobs)
        'econ-jobs-salinity': 0,

        // Value added › Salinity effects across the Delta (dollars a year, change)
        'econ-value-salinity': 0,
      },
    },

    // Increased Delta outflow
    more: {
      takeaway: {
        lead: 'Increasing Sacramento River flow by 30% **makes Delta irrigation water fresher,** especially in the Central Delta and on Sherman Island, and raises farm revenue by about $20,000 per year in a dry year (water year 2021), with about a quarter of a job gained (including multiplier effects).',
        points: [
          {
            label: 'Score',
            text: 'This is less than 0.002% of Delta farm revenue, so the score is 0.',
          },
          {
            label: 'Comparison',
            text: 'These results come from a different model (SCHISM) and year than the other scenarios (RMA, 2019–2020), so they are less directly comparable.',
          },
        ],
      },
      scores: {
        // Economy (score)
        economy: 0,

        // Annual gross agricultural revenues (score)
        'econ-revenue': 0,

        // Agriculture-supported Jobs (score)
        'econ-jobs': 0,

        // Economic value added (score)
        'econ-value': 0,
      },
      measures: {
        // Gross revenues › Salinity effects across the Delta (dollars a year, change)
        'econ-revenue-salinity': 19939,

        // Jobs › Salinity effects across the Delta (jobs)
        'econ-jobs-salinity': 0,

        // Value added › Salinity effects across the Delta (dollars a year, change)
        'econ-value-salinity': 18772,
      },
    },
  },
  // With sea level rise
  seaLevelRise: {
    // Business as Usual
    bau: {
      measures: {
        // Annual gross agricultural revenues › Change from converting farmland to wetland (dollars a year, change)
        'econ-revenue-land': 0,

        // Annual gross agricultural revenues › Carbon-offset revenue (dollars a year, change)
        'econ-revenue-carbon': 0,

        // Agriculture-supported Jobs › Change from converting farmland to wetland (jobs)
        'econ-jobs-land': 0,

        // Economic value added › Change from converting farmland to wetland (dollars a year, change)
        'econ-value-land': 0,
      },
    },

    // Eco Machine
    em: {
      scores: {
        // Economy (score)
        economy: 0,

        // Annual gross agricultural revenues (score)
        'econ-revenue': 0,

        // Agriculture-supported Jobs (score)
        'econ-jobs': 0,

        // Economic value added (score)
        'econ-value': 0,
      },
      measures: {
        // Annual gross agricultural revenues › Change from converting farmland to wetland (dollars a year, change)
        'econ-revenue-land': -922132,

        // Annual gross agricultural revenues › Carbon-offset revenue (dollars a year, change)
        'econ-revenue-carbon': 4724540,

        // Agriculture-supported Jobs › Change from converting farmland to wetland (jobs)
        'econ-jobs-land': -10,

        // Economic value added › Change from converting farmland to wetland (dollars a year, change)
        'econ-value-land': -833472,
      },
    },

    // New Green Watershed
    ngw: {
      scores: {
        // Economy (score)
        economy: -4,

        // Annual gross agricultural revenues (score)
        'econ-revenue': -4,

        // Agriculture-supported Jobs (score)
        'econ-jobs': -4,

        // Economic value added (score)
        'econ-value': -3,
      },
      measures: {
        // Annual gross agricultural revenues › Change from converting farmland to wetland (dollars a year, change)
        'econ-revenue-land': -281295055,

        // Annual gross agricultural revenues › Carbon-offset revenue (dollars a year, change)
        'econ-revenue-carbon': 28591277,

        // Agriculture-supported Jobs › Change from converting farmland to wetland (jobs)
        'econ-jobs-land': -3995,

        // Economic value added › Change from converting farmland to wetland (dollars a year, change)
        'econ-value-land': -230917849,
      },
    },

    // Bolster & Fortify
    bf: {
      scores: {
        // Economy (score)
        economy: 0,

        // Annual gross agricultural revenues (score)
        'econ-revenue': 0,

        // Agriculture-supported Jobs (score)
        'econ-jobs': 0,

        // Economic value added (score)
        'econ-value': 0,
      },
    },

    // Calling on Reserves
    cor: {
      scores: {
        // Economy (score)
        economy: 0,

        // Annual gross agricultural revenues (score)
        'econ-revenue': 0,

        // Agriculture-supported Jobs (score)
        'econ-jobs': 0,

        // Economic value added (score)
        'econ-value': 0,
      },
    },

    // A Tunnel
    tunnel: {
      scores: {
        // Economy (score)
        economy: 0,

        // Annual gross agricultural revenues (score)
        'econ-revenue': 0,

        // Agriculture-supported Jobs (score)
        'econ-jobs': 0,

        // Economic value added (score)
        'econ-value': 0,
      },
    },
  },
}
