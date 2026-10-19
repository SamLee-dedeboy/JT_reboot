// Evaluation team reports: the methodology behind each criterion and the
// team's findings for each scenario. Environmental Justice is drawn from the
// team's draft report, "The Story Behind the Criterion: Environmental Justice
// & Vulnerable Communities" (A. N. DePew, UC Davis, September 2026). Scores are
// relative to baseline; `null` marks a value the draft has not filled in yet.

export interface ReportDefinition {
  term: string
  text: string
  source: string
}

export interface ReportMetric {
  /** Matches the metric name in `evaluationTeams`. */
  name: string
  location: string
  methods: string[]
  results: Array<{ title: string; body: string }>
}

export interface ScenarioFinding {
  headline: string
  metrics: Array<{ name: string; finding: string; score: number | null }>
  overall: { score: number | null; summary: string }
  narrative: string
}

export interface TeamReport {
  status: 'draft' | 'final'
  source: string
  definitions: ReportDefinition[]
  classifications: { intro: string; levels: string[]; indicators: string[] }
  whyItMatters: {
    stat: { value: string; label: string }
    points: string[]
    quotes: string[]
  }
  construction: {
    background: string
    timeline: string[]
    alignment: string
    priorities: Array<{ priority: string; outcome: string }>
  }
  metrics: ReportMetric[]
  scoring: string
  rankingSummary: string[]
  findings: Record<string, ScenarioFinding>
}

const ejDrinkingWater = 'Drinking water'
const ejFloodRisk = 'Flood risk'
const ejHabs = 'Harmful algal bloom conditions'

const environmentalJustice: TeamReport = {
  status: 'draft',
  source:
    'The Story Behind the Criterion: Environmental Justice & Vulnerable Communities. A. N. DePew, UC Davis, September 2026 (draft).',
  definitions: [
    {
      term: 'Just transition',
      text: 'Ensuring that no one is left behind or pushed behind in the transition to low-carbon and environmentally sustainable economies and societies.',
      source: 'Committee for Development Policy, 2023',
    },
    {
      term: 'Environmental justice',
      text: 'The fair treatment and meaningful involvement of all people, regardless of race, culture, national origin, or income, in the development, adoption, implementation, and enforcement of environmental laws, regulations, and policies.',
      source: 'Delta Stewardship Council',
    },
    {
      term: 'Vulnerability',
      text: 'The intersection of exposure to climate hazards, sensitivity to those hazards, and adaptive capacity: the ability to recover from and adapt to them.',
      source: 'Delta Adapts, Delta Stewardship Council, 2021',
    },
  ],
  classifications: {
    intro:
      'Each community carries a vulnerability classification from the Delta Stewardship Council’s Vulnerability to Climate Change map, weighted across 14 indicators. The lowest classification anywhere in the Delta is Moderate, so every Delta community is vulnerable to some degree.',
    levels: ['Moderate', 'High', 'Highest'],
    indicators: [
      'Children',
      'Disability',
      'Educational attainment',
      'Linguistic isolation',
      'Older adults living alone',
      'Poverty',
      'Race and ethnicity',
      'Renters',
      'Vehicle access',
      'Health insurance',
      'Asthma',
      'Cardiovascular disease',
      'Low birth weight',
      'Food insecurity',
    ],
  },
  whyItMatters: {
    stat: {
      value: '82.6%',
      label:
        'of Just Transitions interviewees think Delta decision-making is not equitable and fair',
    },
    points: [
      'Only 8.7% said decision-making is equitable and fair; another 8.7% were unsure.',
      'Interviewees pointed to power imbalances, monetary influence, and infringement of water rights.',
      'The criterion looks for undue burdens: negative impacts that fall disproportionately by place, race and ethnicity, income, or other socioeconomic factors.',
    ],
    quotes: [
      'The whole framework of salinity management in the Delta is fundamentally flawed by the institutional issues and the dominance of financial interests.',
      'The decision-makers are coming from different agencies with different missions, different agendas, different levels of resources. So is it equitable? No.',
    ],
  },
  construction: {
    background:
      'The criterion was built from direct engagement with environmental justice community members and advocates, not from literature alone. About 20% of the project’s 49 interviews were with these less-often-heard groups.',
    timeline: [
      'Interviews with EJ and Tribal community members and advocates',
      'Public Workshop 1 (June 2024)',
      'Tribal Workshop 1 (November 2024)',
      'EJ Workshop (December 2024)',
      'Initial criterion distilled from EJ Workshop feedback',
      'Review at Public Workshop 2 and Tribal Workshop 2 (June 2025)',
      'Tribal Workshop 3 (December 2025)',
      'Periodic Advisory Committee review',
    ],
    alignment:
      'Feedback from the EJ Workshop, Public Workshop 2, and ongoing collaboration was distilled into value categories. Some became EJ metrics, some are measured by other teams, and some fall outside the project’s scope.',
    priorities: [
      {
        priority: 'Water quantity and quality',
        outcome:
          'Drinking water and HAB conditions became EJ metrics; pollutants and water rights are out of scope.',
      },
      {
        priority: 'Community and recreation',
        outcome: 'Covered by the Ecology and Recreation teams.',
      },
      { priority: 'Flood risk', outcome: 'Flood risk attenuation became an EJ metric.' },
      {
        priority: 'Ecological restoration and recovery',
        outcome: 'Reflected in the scenario designs themselves (Eco Machine, New Green Watershed).',
      },
      {
        priority: 'Ecocultural restoration and Indigenous sovereignty',
        outcome: 'Given its own criterion, developed with Tribal and Indigenous communities.',
      },
      {
        priority: 'Sustainable economy and economic transitions',
        outcome:
          'Agriculture is covered by the Economy team; water affordability lacks accessible data.',
      },
    ],
  },
  metrics: [
    {
      name: ejDrinkingWater,
      location:
        '49 in-Delta drinking-water system locations from the State Water Board’s SAFER program, moved into the nearest channel so model output can be read there (46 points for the outflow runs). Points are classified 10 Moderate, 36 High, and 3 Highest vulnerability.',
      methods: [
        'Salinity as electrical conductivity (µS/cm) from hydrodynamic model output.',
        'The share of each run above 1,050 µS/cm, the drinking-water threshold.',
        'Reported for the total run, the wet and dry seasons, and each vulnerability zone.',
      ],
      results: [
        {
          title: 'Delta Outflow Variations',
          body: 'The 30% outflow increase performed best, then the historic baseline, then the 10% decrease. No run had exceedances in Highest-vulnerability zones.',
        },
        {
          title: 'Adaptation scenarios',
          body: 'Eco Machine and New Green Watershed performed best. Bolster and Fortify matched Business as Usual overall, Calling on Reserves came fifth, and A Tunnel performed worst. Every scenario saw more exceedances in the wet season than the dry season.',
        },
      ],
    },
    {
      name: ejFloodRisk,
      location: 'The Delta as a whole.',
      methods: [
        'Direction of change from Business as Usual, based on the flood-reduction measures in each scenario’s design, such as levee work and upland restoration.',
        'Not assessed for the outflow variations, which share one landscape.',
      ],
      results: [
        {
          title: 'Adaptation scenarios',
          body: 'No change: Calling on Reserves and Eco Machine. Slight decrease: A Tunnel. Moderate decrease: Bolster and Fortify. Significant decrease: New Green Watershed.',
        },
      ],
    },
    {
      name: ejHabs,
      location:
        'Five regions prone to harmful algal blooms from May through October: Suisun Marsh and surrounding wetlands, Franks Tract, South Delta, Lindsey-Cache Slough, and McCormack-Williamson Tract.',
      methods: [
        'Change in water age compared with baseline while water is at or above 19°C, the temperature at which HABs begin to grow.',
        'Water age is one of several factors that make bloom conditions more likely.',
      ],
      results: [
        {
          title: 'Adaptation scenarios',
          body: 'Bolster and Fortify: no change. Eco Machine and Calling on Reserves: slightly worse. New Green Watershed: moderately worse. A Tunnel: pending in the draft.',
        },
      ],
    },
  ],
  scoring:
    'Scores run from −5 to 5 relative to baseline. Adaptation scenarios are scored in 1% steps against Business as Usual; outflow variations in 5% steps against the historic baseline, because flow changes move salinity far more. The two sets are not directly comparable.',
  rankingSummary: [
    'Overall positive: New Green Watershed and Eco Machine.',
    'No overall change: Bolster and Fortify.',
    'Overall negative: Calling on Reserves.',
    'Among outflow variations, a 30% increase is strongly preferred over a 10% decrease.',
  ],
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
}

/** Team reports by team id; teams without one show their criterion summary only. */
export const teamReports: Partial<Record<string, TeamReport>> = {
  'environmental-justice': environmentalJustice,
}
