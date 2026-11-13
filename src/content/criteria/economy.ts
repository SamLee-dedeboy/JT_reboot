// The economy criterion: everything the site says about it, in the shape of ./types.
import { TEAM_NAMES } from '../names'
import type { Criterion } from './types'

const economyMetric = 'Gross revenue, jobs, and value added'
const economyBaseline =
  'Against Business as Usual: $1.105B direct revenue, 11,679 total jobs, and $997M total value added.'
const economySeaLevelRise = 'The score is the same with 2 feet of sea-level rise.'

export const economy: Criterion = {
  id: 'economy',
  number: TEAM_NAMES.economy.number,
  label: TEAM_NAMES.economy.name,
  summary:
    'Examines what happens to the Delta agricultural economy when salinity and landscape conditions change by tracking gross revenue, employment, and value added.',
  entityGroups: [
    {
      label: 'People and livelihoods',
      items: ['Farm workers'],
    },
    {
      label: 'Economic Status Indicators',
      items: ['Gross revenue', 'Employment', 'Economic value added'],
    },
    {
      label: 'Places',
      items: ['North, Central, South, and West Delta zones', 'Suisun Marsh land uses'],
    },
  ],
  metrics: [
    {
      name: 'Annual gross agricultural revenues',
      definition:
        'Estimates changes in gross sales by sector, including the farm-gate value of crops.',
      measurement: 'Annualized 2024 US dollars.',
    },
    {
      name: 'Agriculture-supported jobs',
      definition: 'Estimates annual changes in employment by sector.',
      measurement: 'Full- and part-time jobs for a sector in one year.',
    },
    {
      name: 'Economic value added',
      definition:
        'Measures an amount close to gross domestic product: gross revenues minus non-labor business expenses.',
      measurement: 'Annualized 2024 US dollars.',
    },
  ],
  story: {
    source:
      'Economy criterion results for data visualization, v20. WSM Lab, UC Merced, 3 November 2026.',
    brief: {
      rationale:
        'Agriculture is currently the primary land use and primary economic sector in the Delta and thus is important to consider in any future transition. Increased salinity in the Delta can reduce agricultural production (since crops require fresh water). Changes in land use (such as wetland restoration) can also affect the Delta’s economy. This criterion assesses impacts of these potential changes across all scenarios.',
      what: 'Economy examines what happens to the Delta’s agricultural economy when salinity and landscape conditions in the Delta change. It does this by tracking changes in gross revenue (production), employment, and income.',
      why: 'Nearly 500,000 acres of irrigated farmland, and the packing houses, equipment dealers, and trucking tied to them, make up a working economy. Every scenario affects the economy, and the effects show up in paychecks and farm budgets.',
    },
    what: [
      'This criterion examines effects of each scenario on Delta agriculture in three ways: how much money farms bring in from what they grow, how many jobs depend on that activity and the businesses tied to it, and how much value is added to the regional economy once wages and business income are counted.',
    ],
    why: {
      paragraphs: [
        'The Delta supports close to 500,000 acres of irrigated farmland, plus packing houses, equipment dealers, trucking, and tourism on the water. Some scenarios affect agriculture through salt water on farm fields; others convert farmland to wetland outright.',
        'Measuring the size of those effects, and where they land, is a basic way to compare the scenarios, and one of the few counted directly in dollars and jobs.',
      ],
      stats: [
        { value: '500K', label: 'acres of irrigated farmland in the Delta, approximately' },
        { value: '$1.1B', label: 'in direct farm revenue annually at baseline' },
      ],
    },
    construction: {
      intro:
        'The six scenarios change the Delta economy in two different ways. Because of this, the criterion uses two modeling chains and reports both through the same regional economic model.',
      facts: [],
      points: [
        'Changes to the **salinity field** in the Delta affect farmland and irrigation.',
        '**Land use changes** affect if agricultural production is viable, and if so, what crops can be harvested.',
      ],
      paragraphs: [
        'Every scenario changes water salinity to some degree, which can reduce crop yields, and all six scenarios were assessed for that salinity effect.',
        'Resource Management Associates (RMA) simulated salinity for all six scenarios under current climate and with 2 feet of sea-level rise (A Tunnel and Calling on Reserves together with their own base run). That salinity effect was estimated by running the RMA salinity through crop salt-tolerance functions (yield loss), applying the yield loss to OpenAg farm revenue, and then applying IMPLAN regional economic ratios to get jobs and value added.',
        'New Green Watershed goes further: it converts subsided Delta farmland itself to wetland, rice, or paludiculture at three restoration intensities, which removes that land’s revenue outright regardless of salinity. That land-use effect was modeled separately by Cai et al. (Cai et al., in preparation) in a manuscript in preparation — the DAP basecase’s official Delta-wide crop acreage and revenue data, matched island-by-island to each restoration level’s footprint, adjusted into a modified regional economic base case, and then run through IMPLAN directly to get Direct and Total (regional-multiplier) Revenue, Employment, and Value Added effects for all three restoration levels.',
        'Eco Machine’s own land conversion (Suisun Marsh and the Franks Tract Futures’ design) was estimated separately: farm revenue lost on the converted land (from DWR’s 2024 land use and corresponding OpenAg revenue per acre), jobs and value added from the same IMPLAN ratios and multipliers as the New Green Watershed runs, carbon offset revenue from the Delta Island Adaptation greenhouse-gas rates, and one-time construction cost. It was not run through IMPLAN directly, but so little of that land is farmed that a direct run is unlikely to change the scenario score.',
      ],
      steps: [],
    },
    components: {
      items: [
        {
          name: 'Annual gross agricultural revenues',
          summary: 'Change in total **dollar sales** from Delta farms.',
          spec: [
            {
              label: 'Measures',
              value: 'Change in gross farm revenue relative to Business as Usual',
            },
            { label: 'Unit', value: 'Annualized 2024 US dollars' },
            { label: 'Where', value: 'Whole Delta, with specific report-out for each region' },
          ],
          method: [
            'Apply each scenario’s April–September **salinity** to determine **crop-yield loss** and apply it to OpenAg baseline revenue.',
            'Remove revenue associated with land that is converted from farmland to wetland in a given scenario.',
            'Add revenue associated with land that is converted to rice in a given scenario.',
            'Report direct on-farm revenue.',
          ],
          caveats: [
            'Carbon-offset revenue is a possibility: its rates come from four deeply subsided central-Delta islands and assume peat soils across the whole footprint.',
            'Carbon-offset revenue is reported but not counted in the score: it is not farm revenue and its price is uncertain.',
            'The Economy scores for Eco Machine and New Green Watershed measure changes in farm revenue, jobs and value added. They do not include the other benefits of restoration (subsidence reversal, lower flood risk and levee costs, water-supply and water-quality gains from Franks Tract, habitat, and recreation), so these scores show the cost side of the two scenarios, not their net economic effect.',
            'Seasonal salinity averages hide short peaks, which could matter more for salt-sensitive crops such as stone fruit, almonds, and strawberries.',
          ],
        },
        {
          name: 'Agriculture-supported Jobs',
          summary:
            'Change in **full- and part-time jobs** tied to farm activity, directly and through supporting businesses.',
          spec: [
            { label: 'Measures', value: 'Full- and part-time jobs in a sector, annually' },
            { label: 'Unit', value: 'Number of jobs' },
            { label: 'Where', value: 'Whole Delta, with specific report-out for each region' },
          ],
          method: [
            'Apply the annual gross agricultural revenue change determined in the first metric to an indicator of jobs through the IMPLAN model, by region.',
            'Assess the changes to land use through the IMPLAN model.',
            'Report direct jobs and total jobs, which add IMPLAN’s regional multipliers (table below).',
          ],
          tables: [
            {
              caption: 'What IMPLAN’s effects include',
              columns: ['Effect', 'Includes'],
              rows: [
                ['Direct', 'Activity and jobs on the farm or island itself'],
                ['Indirect', 'Supporting businesses such as packing, equipment, and trucking'],
                ['Induced', 'Household spending as farm income circulates'],
                ['Total', 'Direct + indirect + induced'],
              ],
            },
          ],
        },
        {
          name: 'Economic value added',
          summary:
            'Change in **wages, business income, and taxes** once revenue works through the regional economy, close to regional GDP.',
          spec: [
            { label: 'Measures', value: 'Gross revenue minus non-labor business expenses' },
            { label: 'Unit', value: 'Annualized 2024 US dollars' },
            { label: 'Where', value: 'Whole Delta, with specific report-out for each region' },
          ],
          method: [
            'Use value added from the same IMPLAN runs as employment.',
            'Report direct and total value added for each scenario and restoration level.',
          ],
        },
      ],
    },
  },
  regions: {
    mapTeam: 'economy',
    intro:
      'This criterion divides the Delta into subregions of North, Central, and South Delta by water agency; the remaining fourth zone is the West Delta by default (no official agency).',
    regions: [
      // Estimated, not from the team: its 157 RMA stations placed by location in the zone
      // they fall within, or the nearest zone for the 30 outside all four outlines.
      { name: 'North Delta', note: '63 points' },
      { name: 'Central Delta', note: '23 points' },
      { name: 'South Delta', note: '40 points' },
      { name: 'West Delta', note: '31 points' },
    ],
  },
  references: [
    "Cai, Y., Milligan, B., Medellín-Azuara, J., et al. (in preparation). Economic analysis of just land-use transitions in California's Sacramento-San Joaquin Delta. Target journal: Journal of Hydrology: Regional Studies.",
    'California Department of Fish and Wildlife. (2021). Vegetation – Suisun Marsh – 2021 [ds3187]. Sacramento, CA.',
    'California Natural Resources Agency. (n.d.). Hill Slough Tidal Marsh Restoration Project, California EcoRestore project sheet. https://resources.ca.gov/CNRALegacyFiles/docs/ecorestore/projects/Hill_Slough_Tidal_Restoration.pdf',
    'Deverel, S. J., Olds, M., Burt, J. W., Hankins, D., Milligan, B., Kraus-Polk, A., Ohlson, D., Failing, E., Miller, T., & Ryan, R. (in press). Delta Island Adaptations: Development of regenerative land uses for subsided peatlands in the Sacramento–San Joaquin Delta; geospatial analysis of ecosystem, infrastructural and economic factors, and effects. San Francisco Estuary and Watershed Science.',
    'Medellín-Azuara, J., Hanak, E., Howitt, R., & Lund, J. (2012). Transitions for the Delta Economy (p. 62). Public Policy Institute of California. http://www.ppic.org/',
    'UC Davis, California Department of Fish and Wildlife, and California Department of Water Resources. (2020). Franks Tract Futures Reimagined 2020: Final Report. https://franks-tract-futures-ucdavis.hub.arcgis.com/pages/final-report',
  ],
  report: {
    status: 'final',
    source:
      'Published ranking scores from the Economy team’s results workbook. Each metric is scored on its net percent change from Business as Usual, land use plus salinity in the dry year; under 1% scores 0. The scores are the same under current climate and with 2 feet of sea-level rise.',
    findings: {
      'eco-machine': {
        headline: 'A small loss from converting farmland',
        metrics: [
          {
            name: economyMetric,
            finding: `Almost none of the restored Suisun Marsh land is farmed, so land conversion lowers direct revenue by only about $0.92M a year. Fresher irrigation water adds about $3,500 in the dry year (about $24,000 with 2 feet of sea-level rise), offsetting at most about 3% of that loss. The net change is about −0.08%; one-time construction of about $1.34B falls outside the score. ${economyBaseline}`,
            score: 0,
          },
        ],
        overall: { score: 0, summary: 'No change from Business as Usual' },
      },
      'new-green-watershed': {
        headline: 'The largest agricultural losses',
        metrics: [
          {
            name: 'Gross revenue',
            finding: `Converting farmland lowers direct revenue by $281.3M a year (−25.5%) in the 50% wetland version ($211.2M at 25%, scored −3; $503.2M at 100%, scored −5). ${economyBaseline}`,
            score: -4,
          },
          {
            name: 'Jobs',
            finding:
              'Total jobs fall by 3,995 (−34.2%) in the 50% wetland version (3,657 at 25%, scored −4; 4,999 at 100%, scored −5).',
            score: -4,
          },
          {
            name: 'Value added',
            finding:
              'Total value added falls by $230.9M a year (−23.2%) in the 50% wetland version ($160.3M at 25%, scored −3; $456.2M at 100%, scored −5).',
            score: -3,
          },
        ],
        overall: { score: -4, summary: '50% wetland version; −3 to −5 across versions' },
      },
      'bolster-and-fortify': {
        headline: 'A small dry-year loss from salinity',
        metrics: [
          {
            name: economyMetric,
            finding: `Salinity costs about $10k in the dry year (2020), mostly in the Central Delta, and about $27k with 2 feet of sea-level rise. ${economyBaseline}`,
            score: 0,
          },
        ],
        overall: {
          score: 0,
          summary: `Under 0.003% of Delta farm revenue, too small to change the score. ${economySeaLevelRise}`,
        },
      },
      'calling-on-reserves': {
        headline: 'Close to neutral',
        metrics: [
          {
            name: economyMetric,
            finding: `Against its own base run, salinity effects are about +$2.9k in the dry year (2020) and −$0.3k in the wet year (2019); +$5.7k in the dry year with 2 feet of sea-level rise. ${economyBaseline}`,
            score: 0,
          },
        ],
        overall: { score: 0, summary: `No change from Business as Usual. ${economySeaLevelRise}` },
      },
      'a-tunnel': {
        headline: 'A small dry-year loss on central Delta islands',
        metrics: [
          {
            name: economyMetric,
            finding: `In the dry year (2020) the tunnel shifts salinity from the western to the central Delta and costs about $27k against its own base run, about 80% of it in the Central Delta; about $19k with 2 feet of sea-level rise. ${economyBaseline}`,
            score: 0,
          },
        ],
        overall: {
          score: 0,
          summary: `Under 0.003% of Delta farm revenue, too small to change the score. ${economySeaLevelRise}`,
        },
      },
    },
  },
}
