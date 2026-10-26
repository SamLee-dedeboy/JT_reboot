// Evaluation team findings for each scenario. Environmental Justice is drawn
// from the team's draft report, "The Story Behind the Criterion: Environmental
// Justice & Vulnerable Communities" (A. N. DePew, UC Davis, September 2026).
// Ecology, Recreation, Economy, and Eco-cultural restate the published ranking
// scores compiled in src/internal/rank-visualization/RANKINGS.md (team reports,
// Sept 2026, and Bay-Delta Science Conference slides, Oct 2026); they carry no
// narrative until the teams supply their own interpretation.
// Scores are relative to baseline; `null` marks a value not published yet.
// The criteria themselves are described in criterionStories.ts.

export interface ScenarioFinding {
  headline: string
  /** The team's published scores for this scenario; names need not match the criterion's metrics. */
  metrics: Array<{ name: string; finding: string; score: number | null }>
  /** `score` is null when the team publishes no single criterion score. */
  overall: { score: number | null; summary: string }
  /** The team's own interpretation, when it has written one. */
  narrative?: string
}

export interface TeamReport {
  status: 'draft' | 'final'
  source: string
  findings: Record<string, ScenarioFinding>
}

const ejDrinkingWater = 'Drinking water'
const ejFloodRisk = 'Flood risk'
const ejHabs = 'Harmful algal bloom conditions'

const environmentalJustice: TeamReport = {
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
}

const publishedScoresSource =
  'Published ranking scores from the team’s “Story Behind the Criterion” report (Sept 2026) and the Bay-Delta Science Conference slides (Oct 2026).'

const ecologyNoCriterionScore = {
  score: null,
  summary: 'Ecology publishes a score for each component rather than one criterion score.',
}
const ecologyNoAcreage =
  'Only Eco Machine and New Green Watershed add wetland acreage, so Landscape and Food webs stay at baseline.'

const ecology: TeamReport = {
  status: 'final',
  source: publishedScoresSource,
  findings: {
    'eco-machine': {
      headline: 'More reachable tidal wetland and a small food-web gain',
      metrics: [
        {
          name: 'Landscape',
          finding: 'Adds about 53,000 acres of tidal wetland that aquatic species can reach.',
          score: 3,
        },
        {
          name: 'Food webs',
          finding: 'Food-web index of 21,200 from the wetland it adds.',
          score: 1,
        },
        {
          name: 'Species suitability',
          finding:
            'Wet year (2019): more suitable days for juvenile longfin smelt (+1). Dry year (2020): fewer suitable days for the undesirable largemouth bass (+2) and Brazilian waterweed (+1), more for the undesirable overbite clam (−1).',
          score: null,
        },
      ],
      overall: ecologyNoCriterionScore,
    },
    'new-green-watershed': {
      headline: 'The largest gains in reachable habitat and food webs',
      metrics: [
        {
          name: 'Landscape',
          finding: 'Adds about 80,000 acres of tidal wetland, the most of any scenario.',
          score: 5,
        },
        {
          name: 'Food webs',
          finding:
            'Food-web index of 69,661 in the 50% wetland / 50% rice version (+5 with all managed wetland, +4 at 25% / 75%).',
          score: 4,
        },
        {
          name: 'Species suitability',
          finding:
            'Wet year (2019): more suitable days for juvenile longfin smelt (+1). Dry year (2020): fewer suitable days for the undesirable largemouth bass (+2) and Brazilian waterweed (+1), more for the undesirable overbite clam (−1).',
          score: null,
        },
      ],
      overall: ecologyNoCriterionScore,
    },
    'bolster-and-fortify': {
      headline: 'No change from Business as Usual',
      metrics: [
        { name: 'Landscape', finding: ecologyNoAcreage, score: 0 },
        { name: 'Food webs', finding: ecologyNoAcreage, score: 0 },
        {
          name: 'Species suitability',
          finding: 'No change for any species in either year.',
          score: 0,
        },
      ],
      overall: ecologyNoCriterionScore,
    },
    'calling-on-reserves': {
      headline: 'No habitat change; mixed results by species',
      metrics: [
        { name: 'Landscape', finding: ecologyNoAcreage, score: 0 },
        { name: 'Food webs', finding: ecologyNoAcreage, score: 0 },
        {
          name: 'Species suitability',
          finding:
            'Wet year (2019): more suitable days for juvenile Chinook salmon (+1). Dry year (2020): fewer suitable days for the undesirable largemouth bass (+2) and Brazilian waterweed (+2), more for the undesirable overbite clam (−1).',
          score: null,
        },
      ],
      overall: ecologyNoCriterionScore,
    },
    'a-tunnel': {
      headline: 'No habitat change; species suitability not modeled',
      metrics: [
        { name: 'Landscape', finding: ecologyNoAcreage, score: 0 },
        { name: 'Food webs', finding: ecologyNoAcreage, score: 0 },
        {
          name: 'Species suitability',
          finding: 'Not modeled for A Tunnel.',
          score: null,
        },
      ],
      overall: ecologyNoCriterionScore,
    },
  },
}

const recreationNoCriterionScore = {
  score: null,
  summary:
    'Recreation publishes a Delta-wide salinity score for each activity rather than one criterion score.',
}
const recreationRule =
  'One point per percentage point of days over the activity’s salinity threshold, against Business as Usual.'

/** Delta-wide, whole-run salinity scores: day use & boating, birding, waterfowl hunting, angling. */
function recreationMetrics(
  [dayUse, birding, hunting, angling]: [number, number, number, number],
  temperature: { finding: string; score: number | null },
) {
  const activity = (name: string, threshold: string, score: number) => ({
    name,
    finding:
      score === 0
        ? `No change in days over ${threshold}.`
        : `About ${-score} percentage point${score === -1 ? '' : 's'} more days over ${threshold}.`,
    score,
  })
  return [
    activity('Day use & boating', '1,000 µS/cm', dayUse),
    activity('Birding', '2,640 µS/cm', birding),
    activity('Waterfowl hunting', '3,600 µS/cm', hunting),
    activity('Angling', '9,130 µS/cm', angling),
    { name: 'Water temperature', ...temperature },
  ]
}
const recreationTemperatureUnchanged = {
  finding: 'No change in days over any activity’s temperature threshold.',
  score: 0,
}
const recreationNoTemperatureRun = {
  finding: 'No temperature run for this scenario.',
  score: null,
}

const recreation: TeamReport = {
  status: 'final',
  source: `${publishedScoresSource} ${recreationRule}`,
  findings: {
    'eco-machine': {
      headline: 'Slightly saltier for anglers, birders, and hunters',
      metrics: recreationMetrics([0, -1, -1, -2], recreationTemperatureUnchanged),
      overall: recreationNoCriterionScore,
    },
    'new-green-watershed': {
      headline: 'Slightly saltier for anglers, birders, and hunters',
      metrics: recreationMetrics([0, -1, -1, -2], recreationTemperatureUnchanged),
      overall: recreationNoCriterionScore,
    },
    'bolster-and-fortify': {
      headline: 'No change in recreation conditions',
      metrics: recreationMetrics([0, 0, 0, 0], recreationTemperatureUnchanged),
      overall: recreationNoCriterionScore,
    },
    'calling-on-reserves': {
      headline: 'Saltier for every activity, most of all angling',
      metrics: recreationMetrics([-2, -2, -2, -4], recreationNoTemperatureRun),
      overall: recreationNoCriterionScore,
    },
    'a-tunnel': {
      headline: 'The largest salinity losses for every activity',
      metrics: recreationMetrics([-4, -4, -3, -5], recreationNoTemperatureRun),
      overall: recreationNoCriterionScore,
    },
  },
}

const economyMetric = 'Gross revenue, jobs, and value added'
const economyBaseline =
  'Against Business as Usual: $1.107B direct revenue, about 7,700 jobs, and $671M value added.'
const economySeaLevelRise = 'The score is the same with 2 feet of sea-level rise.'

const economy: TeamReport = {
  status: 'final',
  source:
    'Published ranking scores from the team’s “Story Behind the Criterion” report, v16 (25 Oct 2026). One score covers revenue, jobs, and value added, and is the same under current climate and with 2 feet of sea-level rise.',
  findings: {
    'eco-machine': {
      headline: 'A small loss from converting farmland',
      metrics: [
        {
          name: economyMetric,
          finding: `Almost none of the restored Suisun Marsh land is farmed, so land conversion lowers direct revenue by only $0.29M–$1.15M a year; one-time construction of about $0.85–1.5B falls outside the score. ${economyBaseline}`,
          score: 0,
        },
      ],
      overall: { score: 0, summary: 'No change from Business as Usual' },
    },
    'new-green-watershed': {
      headline: 'The largest agricultural losses',
      metrics: [
        {
          name: economyMetric,
          finding: `Converting farmland lowers direct revenue by $282.5M a year in the 50% wetland version ($212.4M at 25%, scored −3; $504.5M at 100%, scored −5). ${economyBaseline}`,
          score: -4,
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
          score: -1,
        },
      ],
      overall: {
        score: -1,
        summary: `Slightly worse than Business as Usual. ${economySeaLevelRise}`,
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
          score: -1,
        },
      ],
      overall: {
        score: -1,
        summary: `Slightly worse than Business as Usual. ${economySeaLevelRise}`,
      },
    },
  },
}

const ecoculturalOverallBasis =
  'One overall score combining restored acres, flow, and the team’s qualitative judgement.'

const ecoculturalRestoration: TeamReport = {
  status: 'final',
  source: `${publishedScoresSource} ${ecoculturalOverallBasis}`,
  findings: {
    'eco-machine': {
      headline: 'Restoration in Suisun Marsh and Franks Tract',
      metrics: [
        {
          name: 'Restoration',
          finding: 'Restores 43,100 acres: 41,720 in Suisun Marsh and 1,380 in Franks Tract.',
          score: 2,
        },
      ],
      overall: { score: 2, summary: ecoculturalOverallBasis },
    },
    'new-green-watershed': {
      headline: 'The most restoration, in the Delta and the upper watershed',
      metrics: [
        {
          name: 'Restoration',
          finding: 'Restores 248,815 acres in the Delta, plus restoration in the upper watershed.',
          score: 5,
        },
      ],
      overall: { score: 4, summary: ecoculturalOverallBasis },
    },
    'bolster-and-fortify': {
      headline: 'No change from Business as Usual',
      metrics: [{ name: 'Restoration', finding: 'No restored acres.', score: 0 }],
      overall: { score: 0, summary: ecoculturalOverallBasis },
    },
    'calling-on-reserves': {
      headline: 'Slightly better overall without new restoration',
      metrics: [{ name: 'Restoration', finding: 'No restored acres.', score: 0 }],
      overall: { score: 1, summary: ecoculturalOverallBasis },
    },
    'a-tunnel': {
      headline: 'Worse than Business as Usual',
      metrics: [{ name: 'Restoration', finding: 'No restored acres.', score: 0 }],
      overall: { score: -2, summary: ecoculturalOverallBasis },
    },
  },
}

/** Team reports by team id; teams without one show their criterion summary only. */
export const teamReports: Partial<Record<string, TeamReport>> = {
  ecology,
  'environmental-justice': environmentalJustice,
  'ecocultural-restoration': ecoculturalRestoration,
  recreation,
  economy,
}
