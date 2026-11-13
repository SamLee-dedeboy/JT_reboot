// The environmental justice criterion: everything the site says about it, in the shape of ./types.
import { TEAM_NAMES } from '../names'
import type { Criterion } from './types'

const ejDrinkingWater = 'Drinking water'
const ejFloodRisk = 'Flood risk'
const ejHabs = 'Harmful algal bloom conditions'

export const environmentalJustice: Criterion = {
  id: 'environmental-justice',
  number: TEAM_NAMES.environmentalJustice.number,
  label: TEAM_NAMES.environmentalJustice.name,
  summary:
    'Assesses whether scenario burdens fall unfairly on Delta communities through drinking-water quality, flood risk reduction, and harmful-algal-bloom conditions.',
  entityGroups: [
    {
      label: 'People and communities',
      items: [
        'Moderate-vulnerability communities',
        'High-vulnerability communities',
        'Highest-vulnerability communities',
      ],
    },
    {
      label: 'Community systems',
      items: ['In-Delta drinking-water systems'],
    },
    {
      label: 'Places',
      items: [
        'Suisun Marsh and surrounding wetlands',
        'Franks Tract',
        'South Delta',
        'Lindsey-Cache Slough',
        'McCormack-Williamson Tract',
      ],
    },
  ],
  metrics: [
    {
      name: 'Salinity impacts to in-Delta drinking water',
      definition:
        'Assesses whether salinity changes affect drinking-water systems’ ability to meet standards, with attention to community vulnerability.',
      measurement:
        'Percentage of the model run exceeding the drinking-water salinity threshold of 1,050 microsiemens per centimeter.',
    },
    {
      name: 'Flood risk attenuation',
      definition: 'Identifies the risk of inundation across the Delta.',
      measurement:
        'Qualitative assessment of in-Delta inundation risk given the green and gray infrastructure included in each scenario.',
    },
    {
      name: 'Water age + water temperature',
      definition: 'Uses water age as a proxy for conditions favorable to harmful algal blooms.',
      measurement: 'Change in water age when water temperature is above 19°C.',
    },
  ],
  story: {
    source:
      'The Story Behind the Criterion: Environmental Justice & Vulnerable Communities. A. N. DePew, UC Davis, September 2026 (draft).',
    brief: {
      rationale:
        'Understanding where and how negative impacts to vulnerable communities occur is important for decision-makers assessing the equitable distribution of scenario benefits and trade-offs. The three metrics reflect priorities identified by Delta communities and local environmental justice organizations.',
      what: 'Environmental justice assesses whether scenario burdens fall unfairly on Delta communities, paying attention to community vulnerability to climate hazards. It compares scenarios through drinking-water quality, flood risk reduction, and harmful-algal-bloom conditions.',
      chipsNote:
        'Each community in the Delta has a vulnerability score of moderate, high, or highest vulnerability, derived from the Delta Stewardship Council’s [Vulnerability to Climate Change in the Delta interactive map](https://deltascience.shinyapps.io/Delta_vulnerability_map/).',
      why: '82.6% of the project’s interviewees said Delta decision-making is not equitable or fair. Every in-Delta community is vulnerable to some degree, so knowing where undue burdens may occur helps decision-makers avoid them.',
    },
    what: [
      'As defined by the [Delta Stewardship Council](https://deltacouncil.ca.gov/environmental-justice), environmental justice is “the fair treatment and meaningful involvement of all people, regardless of race, culture, national origin, or income, in environmental laws, regulations, and policies” (Delta Stewardship Council, n.d.). This criterion applies it through the lens of vulnerable communities.',
      '[Vulnerability](https://deltacouncil.ca.gov/pdf/delta-plan/2021-06-25-delta-adapts-vulnerability-assessment.pdf) combines exposure to climate hazards, sensitivity to them, and the capacity to recover and adapt (Delta Stewardship Council, 2021, p. xi). The Delta Stewardship Council’s [Vulnerability to Climate Change in the Delta interactive map](https://deltascience.shinyapps.io/Delta_vulnerability_map/) (Delta Stewardship Council, 2020) classifies every Delta community as Moderate, High, or Highest vulnerability, derived from 14 socioeconomic indicators, from poverty and linguistic isolation to asthma and food insecurity. The lowest rating anywhere in the Delta is Moderate: every in-Delta community is vulnerable to some degree.',
    ],
    why: {
      paragraphs: [
        'The overwhelming majority of interviewees think decision-making in the Delta is not equitable and fair. They pointed to power imbalances, the influence of money, and infringement of water rights.',
        'In general, the Just Transitions Project explores more inclusive and equitable planning approaches to salinity management. The Environmental Justice and Vulnerable Communities criterion specifically assesses Delta EJ community concerns as determined through the project’s EJ-specific outreach, workshops, and consultations. This outreach established the priorities and metrics that the team assessed.',
      ],
      stats: [
        {
          value: '83%',
          label: 'of interviewees think Delta decision-making is not equitable and fair',
        },
      ],
    },
    construction: {
      intro:
        'While there is general consensus in the literature about what burdens EJ communities face, academic literature does not substitute for boots-on-the-ground, real, meaningful interaction with the community members and advocates this project intends to serve. The Just Transitions in the Delta team intentionally sought out perspectives from EJ communities as often as possible. In order to create the EJ criterion most consistently with the real priorities of our specific EJ community members and advocates, the Just Transitions in the Delta team engaged in the following ways:',
      facts: [
        { value: '49', label: 'interviews, ~20% with EJ and Tribal community members' },
        { value: '1', label: 'Environmental Justice Workshop', dates: ['December 2024'] },
        {
          value: '3',
          label: 'Tribal Workshops',
          dates: ['November 2024', 'June 2025', 'December 2025'],
        },
        { value: '2', label: 'Public Workshops', dates: ['June 2024', 'June 2025'] },
        { value: 'Periodic', label: 'Advisory Committee check-in and review' },
      ],
      outcomes: {
        intro: 'These engagement activities yielded:',
        facts: [
          { value: '6', label: 'value areas distilled from feedback' },
          { value: '3', label: 'metrics within project scope' },
        ],
      },
      steps: [
        {
          title: 'Invite less-often-heard voices',
          body: 'Interview invitations were sent intentionally to members and advocates of environmental justice and Tribal communities. Interview questions covered values, drivers of salinity change, management strategies to explore, and Delta governance; answers shaped the preliminary scenarios.',
        },
        {
          title: 'Spotlight EJ viewpoints',
          when: 'Public Workshop 1 · June 2024',
          body: 'Environmental justice perspectives were featured to the broader public workshop audience.',
        },
        {
          title: 'Environmental justice workshop',
          when: 'December 2024',
          body: 'Participants discussed the issues facing environmental justice and vulnerable communities. Their priorities became the first draft of the criterion.',
        },
        {
          title: 'Sort priorities by who can measure them',
          body: 'Feedback fell into six value areas: water quality and quantity, community and recreation, flood risk, ecological restoration and recovery, eco-cultural restoration and Indigenous sovereignty, and a sustainable economy.',
          points: [
            'Measured by EJ: drinking water, flood risk, and harmful algal bloom conditions.',
            'Measured by other criteria: recreation and ecology (Recreation, Ecology), agriculture (Economy), Indigenous sovereignty (Eco-cultural Restoration and Indigenous Sovereignty).',
            'Outside the project’s scope: pollutants, standard compliance, public health, revised water rights, energy generation, and water affordability.',
          ],
        },
        {
          title: 'Define thresholds based on literature',
          body: 'The threshold for acceptable salinity levels in drinking water was obtained from California’s secondary drinking-water standard for chloride (Title 22) (California State Water Resources Control Board, 2018), and the State Water Resources Control Board’s chloride objectives (California State Water Resources Control Board, 2004).',
        },
        {
          title: 'Review and refine',
          when: 'Public Workshop 2 · June 2025, and ongoing',
          body: 'The draft criterion was reviewed and revised with workshop participants. Feedback on methods and assumptions shaped the final iteration of the criterion, and team members checked in periodically with the project’s Advisory Committee.',
        },
      ],
    },
    components: {
      items: [
        {
          name: 'Salinity impacts to in-Delta drinking water',
          summary:
            'Whether **salinity** changes affect in-Delta **drinking-water** systems’ ability to meet safe standards, with attention to the vulnerability of the communities they serve.',
          spec: [
            {
              label: 'Measures',
              value:
                'Share of days whose average salinity is above the safe drinking-water threshold',
            },
            {
              label: 'Unit',
              value:
                'Percent of modeled days above a salinity threshold; salinity measured in microsiemens per centimeter (µS/cm)',
            },
            {
              label: 'Where',
              value: 'Whole Delta, with specific report-out for the vulnerability zones',
            },
          ],
          method: [
            'Locate in-Delta public water systems from the State Water Board’s SAFER program, including treated municipal systems, wells, and untreated surface-water systems, to identify locations of communities within the Delta.',
            'Point-drop: create a point for each inland location identified by the SAFER system into the closest channel to produce hydrodynamic modeling results for that location.',
            'Match each point to its respective vulnerability classification of the community it serves, from the Delta Stewardship Council’s Vulnerability Index.',
            'Count the number of daily means above the threshold of **1,050 µS/cm** and divide by the number of measurements.',
            'Score against baseline: change in each vulnerability zone’s percentage of threshold-exceedance days.',
          ],
          tables: [
            {
              caption: 'Points by vulnerability class',
              columns: ['Vulnerability', 'Adaptation runs', 'Tiered outflow runs'],
              rows: [
                ['Moderate', '10', '10'],
                ['High', '36', '33'],
                ['Highest', '3', '3'],
                ['Total', '49', '46'],
              ],
            },
          ],
          caveats: [
            'The 1,050 µS/cm threshold matches California’s secondary drinking-water standard for chloride (Title 22) (California State Water Resources Control Board, 2018), and the State Water Resources Control Board’s chloride objectives (California State Water Resources Control Board, 2004).',
          ],
        },
        {
          name: 'Flood risk attenuation',
          summary: 'Risk of **inundation** across the Delta.',
          spec: [
            {
              label: 'Measures',
              value: 'Direction and size of change in inundation risk from baseline',
            },
            {
              label: 'Unit',
              value:
                'Qualitative determination of change in flood risk from baseline: no change, slight decrease, moderate decrease, or significant decrease',
            },
            { label: 'Where', value: 'The Delta as a whole' },
          ],
          method: [
            'Review the measures built into each scenario that could affect flood risk (e.g., levee fortification, upland restoration, etc.).',
            'Judge the direction and size of the change in in-Delta flood risk against Business as Usual.',
            'Translate that judgement onto the −5 to +5 scale.',
          ],
          caveats: [
            'Not assessed for the tiered outflow runs, because they do not differ in landscape or land use, but only in the amount of outflow.',
            'Reservoir forecast-informed operations are not captured by the models.',
          ],
        },
        {
          name: 'Water Age + Water Temperature',
          summary: 'Conditions that favor **harmful algal blooms** in five bloom-prone regions.',
          spec: [
            {
              label: 'Measures',
              value:
                'Change in water age from baseline while water is consistently at or above 19°C',
            },
            { label: 'Unit', value: 'Days of change from baseline' },
            {
              label: 'Where',
              value:
                'Suisun Marsh and surrounding wetlands, Franks Tract, South Delta, Lindsey–Cache Slough, McCormack–Williamson Tract',
            },
            {
              label: 'When',
              value:
                'May through October, when water temperature is consistently at or above 19°C, and harmful algal bloom likelihood rises',
            },
          ],
          method: [
            'Determine time periods when water is at or above 19°C, the temperature at which blooms begin to grow.',
            'Compare water age with Business as Usual in each region using heatmap output.',
            'Place each scenario on an 11-step scale from extreme decrease to extreme increase in water age.',
          ],
          caveats: [
            'This is not a prediction of if or when harmful algal blooms will occur under any given scenario, but merely an indicator of some conditions that are favorable for harmful algal bloom formation.',
            'Water age is one of several factors that make harmful algal blooms more likely; nutrient content in the water, a main driver, as well as other factors are not modeled in this project.',
            'Water age was not available for the outflow runs.',
          ],
        },
      ],
    },
  },
  regions: {
    mapTeam: 'environmentalJustice',
    intro:
      'This criterion explores results by how vulnerable a community is, not by where it sits geographically. Therefore, instead of a regional breakdown of results, results are communicated per vulnerability zone:',
    regions: [
      { name: 'Moderate', note: '10 drinking-water points' },
      { name: 'High', note: '36 drinking-water points (33 in the tiered outflow runs)' },
      { name: 'Highest', note: '3 drinking-water points' },
    ],
  },
  references: [
    'California State Water Resources Control Board. (2004, September 30). Periodic Review of the 1995 Water Quality Control Plan for the San Francisco Bay / Sacramento-San Joaquin Delta Estuary. https://www.waterboards.ca.gov/waterrights/water_issues/programs/bay_delta/wq_control_plans/2006wqcp/exhibits/append2/doi/doi-32j.pdf',
    'California State Water Resources Control Board. (2018). Secondary Drinking Water Standards California Code of Regulations, Title 22. https://www.waterboards.ca.gov/drinking_water/certlic/drinkingwater/documents/ddw_secondary_standards.pdf',
    'Delta Stewardship Council. (n.d.). Environmental Justice. https://deltacouncil.ca.gov/environmental-justice',
    'Delta Stewardship Council. (2020). Vulnerability to Climate Change in the Delta interactive map. https://deltascience.shinyapps.io/Delta_vulnerability_map/',
    'Delta Stewardship Council. (2021). Delta Adapts: Vulnerability Assessment, p. xi. https://deltacouncil.ca.gov/pdf/delta-plan/2021-06-25-delta-adapts-vulnerability-assessment.pdf',
    'United Nations Committee for Development Policy. (2023). Just transition. https://policy.desa.un.org/sites/default/files/2025-06/cdp-excerpt-2023-1.pdf',
  ],
  report: {
    status: 'draft',
    source:
      'The Story Behind the Criterion: Environmental Justice & Vulnerable Communities. A. N. DePew, UC Davis, September 2026 (draft).',
    findings: {
      'eco-machine': {
        headline: 'Better for drinking water, no change in flood risk',
        metrics: [
          {
            name: ejDrinkingWater,
            finding:
              '1% fewer threshold exceedances over the total run, with relief in both Moderate and High vulnerability zones. The only scenario to improve the dry season.',
            score: 2,
          },
          {
            name: ejFloodRisk,
            finding:
              'No change: in-Delta wetland restoration does not significantly affect flood risk.',
            score: 0,
          },
          { name: ejHabs, finding: 'Slightly worse than Business as Usual.', score: -1 },
        ],
        overall: { score: 1, summary: 'Tied first with New Green Watershed' },
        narrative:
          'The gain in drinking-water reliability may not be obvious to residents, but less reliance on replacement water eases the burden on communities served by shallow wells and surface water.',
      },
      'new-green-watershed': {
        headline: 'Better drinking water and the largest cut in flood risk',
        metrics: [
          {
            name: ejDrinkingWater,
            finding:
              '1% fewer threshold exceedances over the total run, with relief in both Moderate and High vulnerability zones.',
            score: 2,
          },
          {
            name: ejFloodRisk,
            finding:
              'Significant decrease: upland restoration stops flooding before water enters the Delta, and wetlands help reverse subsidence.',
            score: 3,
          },
          { name: ejHabs, finding: 'Moderately worse than Business as Usual.', score: -2 },
        ],
        overall: { score: 1, summary: 'Tied first with Eco Machine' },
        narrative:
          'Residents across the Delta would see the most flood protection of any scenario, alongside a small improvement in drinking water.',
      },
      'bolster-and-fortify': {
        headline: 'No change for drinking water, a moderate cut in flood risk',
        metrics: [
          {
            name: ejDrinkingWater,
            finding:
              'Total exceedances match Business as Usual (8% of the run), with fewer exceedances in Moderate zones and slightly more in the wet season.',
            score: 0,
          },
          {
            name: ejFloodRisk,
            finding:
              'Moderate decrease, but only residents on islands along the fortified corridor benefit directly.',
            score: 2,
          },
          {
            name: ejHabs,
            finding:
              'No change overall, though Franks Tract saw extreme increases in water age at times.',
            score: 0,
          },
        ],
        overall: { score: 0, summary: 'No overall change from Business as Usual' },
        narrative:
          'The drinking-water change is so small that residents likely would not notice a difference.',
      },
      'calling-on-reserves': {
        headline: 'More drinking-water exceedances, no change in flood risk',
        metrics: [
          {
            name: ejDrinkingWater,
            finding:
              'More threshold exceedances, especially in Moderate zones and in the wet season for both Moderate and High zones.',
            score: -2,
          },
          {
            name: ejFloodRisk,
            finding:
              'No change: there are no landscape changes, and reservoir forecasting (FIRO) is not captured by the models.',
            score: 0,
          },
          { name: ejHabs, finding: 'Slightly worse than Business as Usual.', score: -1 },
        ],
        overall: { score: -1, summary: 'Overall negative' },
        narrative: 'Drinking water suffers in this scenario, most of all in the wet season.',
      },
      'a-tunnel': {
        headline: 'Lowest for drinking water, a slight cut in flood risk',
        metrics: [
          {
            name: ejDrinkingWater,
            finding:
              'The most exceedances of any adaptation scenario; replacement water is needed in the wet season in both Moderate and High zones.',
            score: -3,
          },
          {
            name: ejFloodRisk,
            finding:
              'Slight decrease, assuming the tunnel intakes intercept stormwater before it enters the Delta.',
            score: 1,
          },
          { name: ejHabs, finding: 'Pending in the draft report.', score: null },
        ],
        overall: { score: null, summary: 'Pending in the draft report' },
        narrative:
          'Drinking water suffers compared with the other adaptation scenarios, while flood benefits are modest and not localized.',
      },
      'tiered-outflows': {
        headline: 'A 30% outflow increase is strongly preferred over a 10% decrease',
        metrics: [
          {
            name: ejDrinkingWater,
            finding:
              'With 30% more outflow, exceedances stay in single digits for every period and vulnerability zone. With 10% less, exceedances rise across all of them.',
            score: 4,
          },
          {
            name: ejFloodRisk,
            finding: 'Not assessed: the outflow variations share one landscape.',
            score: null,
          },
          { name: ejHabs, finding: 'Not reported for the outflow variations.', score: null },
        ],
        overall: { score: 4, summary: '30% increase: +4 · 10% decrease: −2' },
        narrative:
          'For residents relying on shallow wells or surface water, more outflow means potable water with little need for replacement water.',
      },
    },
  },
}
