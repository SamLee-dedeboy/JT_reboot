// The water quality & regulation criterion: everything the site says about it, in the
// shape of ./types. A proposed sixth criterion (draft for team review, Nov 2026); its
// text and prototype scores come from the Water Quality Criterion draft.
import { TEAM_NAMES } from '../names'
import type { Criterion } from './types'

const draftSource = 'Water Quality Criterion draft (team review), November 2026.'

const salinityMetric = 'Salinity change'
const d1641Metric = 'D-1641 exceedance days'

export const waterQualityRegulation: Criterion = {
  id: 'water-quality-regulation',
  number: TEAM_NAMES.waterQuality.number,
  label: TEAM_NAMES.waterQuality.name,
  summary:
    'Compares modeled salinity at nine stations with the Delta water-quality objectives in State Water Board Decision 1641 (D-1641).',
  entityGroups: [
    {
      label: 'Water quality objectives',
      items: [
        'Delta outflow',
        'Municipal intakes · drinking water',
        'Export intakes · SWP and CVP',
        'West Delta agriculture',
      ],
    },
    {
      label: 'Regulation',
      items: [
        'Drinking-water chloride',
        'Export salinity',
        'West Delta agricultural salinity',
        'A fresh western Delta for fish (X2)',
      ],
    },
    {
      label: 'Places',
      items: [
        'Port Chicago',
        'Chipps Island',
        'Collinsville',
        'Antioch',
        'Contra Costa Canal',
        'Clifton Court Forebay',
        'Tracy Pumping Plant',
        'Emmaton',
        'Jersey Point',
      ],
    },
  ],
  metrics: [
    {
      name: salinityMetric,
      definition:
        'How much average salinity changes at four groups of stations, compared with the same model’s Business as Usual baseline.',
      measurement: 'Percent change in average electrical conductivity (EC, µS/cm).',
    },
    {
      name: d1641Metric,
      definition:
        'How much a scenario changes the share of applicable days when modeled salinity does not meet a D-1641 objective.',
      measurement: 'Exceedance days as a share of the days each objective applies.',
    },
  ],
  // Station positions are the RMA/SCHISM station coordinates projected into the shared
  // region-map frame (scripts/build-subteam-regions.py's equirectangular projection).
  stations: {
    intro:
      'Both metrics use nine D-1641 compliance stations. The stations are grouped by the people, places or resources that the water-quality objectives protect.',
    groups: [
      {
        name: 'Delta outflow',
        tone: 'blue',
        note: 'Fish and wildlife, and the fresh-water position in Suisun Bay (X2)',
        stations: [
          { name: 'Port Chicago', at: [333.0, 453.4], label: 'left' },
          { name: 'Chipps Island', at: [402.2, 466.9], label: 'below' },
          { name: 'Collinsville', at: [448.6, 440.8], label: 'above' },
        ],
      },
      {
        name: 'Municipal intakes',
        tone: 'purple',
        note: 'Drinking water chloride',
        stations: [
          { name: 'Antioch', at: [479.8, 487.9], label: 'below' },
          { name: 'Contra Costa Canal', at: [590.9, 523.1], label: 'right' },
        ],
      },
      {
        name: 'Export intakes',
        tone: 'orange',
        note: 'Water pumped south to the State and federal projects',
        stations: [
          { name: 'Clifton Court', at: [644.4, 644.3], label: 'right' },
          { name: 'Tracy Pumping Plant', at: [641.4, 656.9], label: 'below' },
        ],
      },
      {
        name: 'West Delta agriculture',
        tone: 'yellow',
        note: 'Irrigation water for West Delta farms',
        stations: [
          { name: 'Emmaton', at: [522.1, 432.2], label: 'right' },
          { name: 'Jersey Point', at: [555.2, 459.1], label: 'right' },
        ],
      },
    ],
  },
  story: {
    source: draftSource,
    brief: {
      rationale:
        'Salinity affects whether Delta water can support drinking-water supplies, water exports, farms, fish and wildlife. State Water Board Decision 1641 (D-1641) sets water-quality objectives for these uses. This criterion connects the modeled salinity results to the stations where those objectives are measured.',
      what: 'This criterion evaluates modeled salinity at nine D-1641 compliance stations. It asks two questions: How much fresher or saltier is the water than under the same model’s Business as Usual baseline? And how often does modeled salinity fail to meet a D-1641 objective?',
      why: 'A salinity change does not have the same consequence everywhere. A small increase can matter at a drinking-water or export intake even when the same percentage change is less meaningful in naturally brackish water. Looking at both the size of the change and the D-1641 objectives shows where a scenario may improve or strain the Delta’s regulated water uses.',
    },
    what: [
      'This criterion evaluates modeled salinity at nine compliance stations identified in State Water Board Decision 1641 (D-1641). The stations are organized into four groups: Delta outflow, municipal intakes, export intakes and West Delta agriculture.',
      'The criterion combines two measures. **Salinity change** shows how much fresher or saltier each group becomes compared with the same model’s Business as Usual baseline. **D-1641 exceedance days** shows whether a scenario changes the share of applicable days when modeled salinity does not meet a D-1641 objective.',
    ],
    why: {
      paragraphs: [
        '**D-1641 sets different salinity objectives for different places and seasons.** Drinking-water intakes have daily chloride limits and must also remain below a lower chloride threshold for a required number of days each year. Export facilities have daily chloride limits and a monthly average salinity limit. West Delta farms have seasonal limits that vary by water-year type. From February through June, objectives at Collinsville, Chipps Island and Port Chicago help track how far fresh water extends into the western Delta for fish and wildlife, commonly described through the location of X2.',
        'Neither measure tells the whole story on its own. A percentage change depends on where it occurs: a 10% increase at naturally brackish Port Chicago has a different consequence from the same increase at the Tracy Pumping Plant, which supplies export water to the south for drinking water use. Exceedance days show whether modeled salinity crosses a regulatory threshold, but under the current climate they change too little to distinguish some scenarios. **Together, the measures show both the overall shift in salinity and whether that shift affects the objectives for a regulated use.**',
      ],
    },
    construction: {
      intro:
        'The nine stations are grouped by what their objectives protect. Each of the four groups counts once, so the three Delta outflow stations do not outweigh the two export intakes. Each metric is the rounded average of its four group scores. The overall criterion score is the rounded average of the two metric scores.',
      facts: [],
      paragraphs: [
        'Each scenario is compared with the Business as Usual run produced by the same model under the same climate. Eco Machine, New Green Watershed and Bolster & Fortify use the RMA baseline. Calling on Reserves and A Tunnel use the CalSim baseline. Increased Delta Outflow uses the historical baseline.',
        'For salinity change, water years 2019 (wet) and 2020 (dry) are calculated separately and given equal weight. This preserves differences between wet and dry conditions. Each D-1641 objective is evaluated over the period specified in the decision—daily, monthly, seasonally or by calendar year. Increased Delta Outflow covers only water year 2021 (critical), the only year available for that run.',
        'An exceedance is not automatically caused by a scenario. Business as Usual can also miss an objective; for example, every run, including its baseline, misses some required fresh days at Chipps Island in spring 2020. The score therefore measures the change from Business as Usual, not the total number of exceedance days.',
      ],
      steps: [],
    },
    components: {
      intro:
        'Both metrics use the same nine D-1641 compliance stations in four groups, see above.',
      items: [
        {
          name: salinityMetric,
          summary:
            'The **percent change in average salinity** from Business as Usual at each group of stations.',
          spec: [
            {
              label: 'Measures',
              value: 'Percent change in average EC from the scenario’s Business as Usual',
            },
            { label: 'Unit', value: 'Percent' },
            { label: 'Where', value: 'Nine D-1641 compliance stations in four groups' },
            { label: 'When', value: 'Water years 2019 (wet) and 2020 (dry)' },
          ],
          method: [
            'Compute daily average EC values for each station.',
            'For each station, calculate the average EC for the scenario and its Business as Usual baseline. Compare those two averages to find the scenario’s percentage change in salinity.',
            'For each station group, average the percentage changes across its stations separately for water year 2019 (October 2018–September 2019; dry year) and water year 2020 (October 2019–September 2020; wet year). Then average the two yearly results, giving the wet and dry years equal weight.',
            'Use the intervals below to turn each objective’s percentage change into a score. Lower salinity receives a positive score. Average the scores across four groups to obtain the final Salinity change score for a scenario.',
          ],
          tables: [
            {
              caption: 'Score intervals',
              columns: ['Change in average EC', 'Score'],
              rows: [
                ['Under 1%', '0'],
                ['1–5%', '±1'],
                ['5–15%', '±2'],
                ['15–25%', '±3'],
                ['25–35%', '±4'],
                ['35% or more', '±5'],
              ],
            },
          ],
        },
        {
          name: d1641Metric,
          summary:
            'The change in **how often the modeled salinity misses a D-1641 objective**, as a share of the days each objective applies.',
          spec: [
            {
              label: 'Measures',
              value: 'Change in exceedance days from the scenario’s Business as Usual',
            },
            { label: 'Unit', value: 'Share of the days each objective applies' },
            { label: 'Where', value: 'The same nine stations' },
            { label: 'When', value: 'Each objective’s own season (table below)' },
          ],
          method: [
            'Convert EC to chloride for the chloride objectives with published equations: DWR-5 for the Contra Costa Canal and export intakes, Denton (2015) for Antioch. 250 mg/L works out to about 1,020 µS/cm at the Contra Costa Canal and 1,080 µS/cm at the export intakes; 150 mg/L to about 650 µS/cm at the Contra Costa Canal and 700 µS/cm at Antioch.',
            'Turn each objective below into a count of exceedance days: days that fail a daily or 14-day test, required fresh or low-chloride days that were missed, and every day of a month whose average is too high.',
            'Within a group, add up exceedance days before taking the share of days the objectives apply.',
            'Score each group 1 point per 1% change, capped at ±5, fewer exceedance days positive, and average the four group scores, rounded.',
          ],
          tables: [
            {
              caption:
                'The tested D-1641 objectives',
              defaultOpen: true,
              columns: ['Group', 'Where', 'Objective', 'When it applies'],
              rows: [
                [
                  'Delta outflow',
                  'Collinsville',
                  'Every day fresh: daily or 14-day average EC at or below 2,640 µS/cm. Not required in May and June when the Sacramento River Index is below 8.1 million acre-feet.',
                  'Feb 1–Jun 30',
                ],
                [
                  'Delta outflow',
                  'Chipps Island, Port Chicago',
                  'A required number of fresh days each month (daily or 14-day average EC at or below 2,640 µS/cm), set by the previous month’s Eight River Index, the natural runoff of the Sacramento and San Joaquin basins. At Port Chicago it applies only in months that start fresh.',
                  'Feb 1–Jun 30',
                ],
                [
                  'Delta outflow',
                  'Jersey Point',
                  'San Joaquin River salinity for fish: 14-day average EC at or below 440 µS/cm, in every year type except critical. Not required in May when the Sacramento River Index is below 8.1 million acre-feet.',
                  'Apr 1–May 31',
                ],
                [
                  'Municipal intakes',
                  'Contra Costa Canal',
                  'Daily chloride at or below 250 mg/L.',
                  'All year',
                ],
                [
                  'Municipal intakes',
                  'Contra Costa Canal or Antioch',
                  'Daily chloride at or below 150 mg/L on enough days, in runs of at least two weeks: 240 days in a wet year, 190 above normal, 175 below normal, 165 dry, 155 critical.',
                  'Calendar year (Jan 1–Dec 31)',
                ],
                [
                  'Export intakes',
                  'Clifton Court Forebay, Tracy Pumping Plant',
                  'Daily chloride at or below 250 mg/L, and each month’s average EC at or below 1,000 µS/cm.',
                  'All year',
                ],
                [
                  'West Delta agriculture',
                  'Emmaton',
                  '14-day average EC at or below 450 µS/cm in a wet year; 450, then 630 from Jul 1 above normal; 450, then 1,140 from Jun 20 below normal; 450, then 1,670 from Jun 15 dry; 2,780 critical.',
                  'Apr 1–Aug 15',
                ],
                [
                  'West Delta agriculture',
                  'Jersey Point',
                  '14-day average EC at or below 450 µS/cm in a wet or above normal year; 450, then 740 from Jun 20 below normal; 450, then 1,350 from Jun 15 dry; 2,200 critical.',
                  'Apr 1–Aug 15',
                ],
              ],
            },
          ],
          caveats: [
            'An exceedance day means the modeled salinity alone does not meet the objective; it is not a regulatory violation. D-1641 lets some objectives be met with enough Delta outflow instead, and the model results do not include outflow.',
            'A 14-day average is first tested on the 14th day of an objective’s season; if that test fails, all 14 days count as exceedance days.',
            'Water year types and indices use final values, not the forecasts available at the time: 2019 wet, 2020 dry, 2021 critical.',
            'Not included: Collinsville’s Suisun Marsh objective, which needs high-tide EC, and Prisoners Point, the second San Joaquin River salinity station.',
          ],
        },
      ],
    },
  },
  references: [
    'California State Water Resources Control Board. (2000). Revised Water Right Decision 1641 (March 15, 2000), Tables 1–4. https://www.waterboards.ca.gov/waterrights/board_decisions/adopted_orders/decisions/d1600_d1649/wrd1641_1999dec29.pdf',
    'California Department of Water Resources. (n.d.). Exhibit DWR-5, Byron-Bethany Irrigation District hearing: chloride and EC relationships at the Contra Costa Canal and Delta export intakes. https://www.waterboards.ca.gov/waterrights/water_issues/programs/hearings/byron_bethany/docs/exhibits/dwr/dwr5.pdf',
    'Denton, R. A. (2015). Delta salinity constituents analysis. Prepared for the State Water Project Contractors Authority.',
  ],
  report: {
    status: 'draft',
    source:
      'Prototype scores from the Water Quality Criterion draft (Nov 2026), each scenario against its own Business as Usual under the current climate. The criterion score is the rounded mean of the salinity change and D-1641 exceedance day scores.',
    findings: {
      'eco-machine': {
        headline: 'Fresher at every station group',
        metrics: [
          {
            name: salinityMetric,
            finding:
              'Delta outflow −5.2%, municipal intakes −14.0%, export intakes −7.7%, West Delta agriculture −14.8%.',
            score: 2,
          },
          {
            name: d1641Metric,
            finding:
              'Fewer exceedance days for Delta outflow (−1.6%) and West Delta agriculture (−2.6%).',
            score: 1,
          },
        ],
        overall: {
          score: 2,
          summary: 'Better than Business as Usual; +4 with 2 feet of sea-level rise',
        },
      },
      'new-green-watershed': {
        headline: 'Fresher at every station group',
        metrics: [
          {
            name: salinityMetric,
            finding:
              'Delta outflow −4.5%, municipal intakes −14.1%, export intakes −7.4%, West Delta agriculture −14.3%.',
            score: 2,
          },
          {
            name: d1641Metric,
            finding:
              'Fewer exceedance days for Delta outflow (−1.9%) and West Delta agriculture (−2.4%).',
            score: 1,
          },
        ],
        overall: {
          score: 2,
          summary: 'Better than Business as Usual; +4 with 2 feet of sea-level rise',
        },
      },
      'bolster-and-fortify': {
        headline: 'Fresher at the municipal and export intakes',
        metrics: [
          {
            name: salinityMetric,
            finding:
              'Municipal intakes −8.4% and export intakes −6.2%; slightly saltier for West Delta agriculture (+1.6%).',
            score: 1,
          },
          {
            name: d1641Metric,
            finding: 'Exceedance days change by 0.3% or less in every group.',
            score: 0,
          },
        ],
        overall: {
          score: 1,
          summary: 'Slightly better; +2 with 2 feet of sea-level rise',
        },
      },
      'calling-on-reserves': {
        headline: 'Slightly fresher',
        metrics: [
          {
            name: salinityMetric,
            finding:
              'Against CalSim’s Business as Usual: municipal intakes −3.2%, export intakes −2.1%, West Delta agriculture −2.0%.',
            score: 1,
          },
          {
            name: d1641Metric,
            finding: 'Exceedance days change by 0.3% or less in every group.',
            score: 0,
          },
        ],
        overall: { score: 1, summary: 'Slightly better, the same with sea-level rise' },
      },
      'a-tunnel': {
        headline: 'Saltier on average, fewer spring exceedances',
        metrics: [
          {
            name: salinityMetric,
            finding:
              'Against CalSim’s Business as Usual, saltier at every group: Delta outflow +3.0%, municipal intakes +2.5%, export intakes +3.8%, West Delta agriculture +8.6%.',
            score: -1,
          },
          {
            name: d1641Metric,
            finding:
              'Fewer exceedance days for Delta outflow (−4.1%) and West Delta agriculture (−8.2%), because the tunnel run is much fresher in spring 2020, when those objectives apply.',
            score: 2,
          },
        ],
        overall: { score: 1, summary: 'Slightly better, the same with sea-level rise' },
        narrative:
          'Two things make the D-1641 score large: CalSim’s Business as Usual is unusually salty in spring 2020, so it has many exceedance days to remove, and the saltier summer and winter months mostly fall outside the objective periods.',
      },
      'tiered-outflows': {
        headline: 'Much fresher with increased Delta outflow',
        metrics: [
          {
            name: salinityMetric,
            finding:
              'Increased Delta Outflow against the Historical Baseline, water year 2021: Delta outflow −32.7%, municipal intakes −51.0%, export intakes −33.9%, West Delta agriculture −56.3%.',
            score: 5,
          },
          {
            name: d1641Metric,
            finding:
              'Fewer exceedance days for Delta outflow (−56.3%), municipal intakes (−70.8%) and West Delta agriculture (−47.1%).',
            score: 4,
          },
        ],
        overall: {
          score: 5,
          summary: '30% increase: +5 · 10% decrease: not yet scored',
        },
      },
    },
  },
}
