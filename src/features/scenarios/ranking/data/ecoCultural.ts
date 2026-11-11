// Eco-cultural: everything the ranking shows for this criterion, in one place.
// Change a number or a sentence here and the By criterion table, its info cards, its
// maps and the By scenario rankings all follow. See ./types.ts for how to read it.
import type { Source, TeamData } from './types'

/** slides: Overall Score: Adaptation Scenarios */
const SOURCE_1: Source = {
  doc: 'slides',
  where: 'Overall Score: Adaptation Scenarios',
  quote:
    'Business As Usual 0; Bolster and Fortify 0; Eco Machine +2; New Green Watershed +4; Calling on Reserves +1; A Tunnel −2',
}

/** slides: Bay-Delta Science Conference slides, Oct 2026 */
const SOURCE_2: Source = {
  doc: 'slides',
  where: 'Bay-Delta Science Conference slides, Oct 2026',
  quote: 'Rank charts read cell by cell; see RANKINGS.md.',
}

/** slides: Restoration Results & Scenario Ranking: Adaptation Scenarios */
const SOURCE_3: Source = {
  doc: 'slides',
  where: 'Restoration Results & Scenario Ranking: Adaptation Scenarios',
  quote:
    'Business As Usual 0; Bolster and Fortify 0; Eco Machine +2; New Green Watershed +5; Calling on Reserves 0; A Tunnel 0',
}

/** slides: Restoration Ranges */
const SOURCE_4: Source = {
  doc: 'slides',
  where: 'Restoration Ranges',
  quote:
    'ECO MACHINE — Suisun Marsh tidal wetland restoration 41,720 acres; Franks Tract 1,380 acres. NEW GREEN WATERSHED — In-Delta: 248,815 restored acres. Watershed (upland): managed wetland 48,213–207,004; meadow 11,586–347,591; floodplain 6,360–303,372.',
}

/** report: Table 4: RESTORED ACRES — NEW GREEN WATERSHED IN-DELTA SUB-SCENARIOS */
const SOURCE_5: Source = {
  doc: 'report',
  where: 'Table 4: RESTORED ACRES — NEW GREEN WATERSHED IN-DELTA SUB-SCENARIOS',
  quote:
    'Sub-scenario 2: 50/50 (primary scenario) — managed wetlands 102,982 acres; wet soil ag (rice) 145,833 acres.',
}

const SOURCES_2_3_4: Source[] = [SOURCE_2, SOURCE_3, SOURCE_4]

export const ECO_CULTURAL: TeamData = {
  team: 'ecoCultural',

  text: {
    takeaways: [
      'At the beginning, the team set out to **spotlight historically underrepresented or intentionally excluded communities and people.** The research team intentionally set out to invite people and groups who have typically not been as involved in Delta decision-making processes. This included reviewing public comments and meeting attendees from previous Delta decision-making processes, such as the 2019 WaterFix Hearing and the 2023 Temporary Urgency Change Petitions. Additionally, the team held **specific meetings with Indigenous communities and nations** to build trust and create a more welcoming listening environment.',
      'In a round of semi-structured interviews, the Just Transitions in the Delta team specifically invited members of Indigenous communities to participate to ensure **Indigenous perspectives and Traditional Ecological Knowledge (TEK)** were incorporated into the research from the beginning. The team used interview findings to inform preliminary scenario narratives.',
    ],
    caveats: [
      'Although all four metrics are equally important and interdependent on one another to meet this criterion, only the ecosystem restoration metric can be spatially and quantitatively evaluated across the scenarios. The other three metrics are envisioned and assumed in ++Eco Machine++ and ++New Green Watershed++ scenarios (the two scenarios that restore land and habitats) but cannot be prescribed within the scope of this project (e.g., assigning specific areas for land-back initiatives, or determining where access may be most desired and granted on private land). Thus, the evaluation for Tribal land access, Tribal Sovereignty and Application of Indigenous Science and Traditional Ecological Knowledge are expressed qualitatively, **where the scenarios offer the increased potential to achieve these metrics.**',
    ],
    criterion: {
      metrics: [
        'Ecosystem Restoration',
        'Increased Land Access',
        'Implementation and Application of Indigenous Science & Traditional Ecological Knowledge (TEK)',
        'Recognition and Application of Tribal Sovereignty',
      ],
      combine: 'One overall score informed by restoration acres, flow and qualitative judgement.',
    },
  },
  // The By criterion table's rows, top to bottom
  rows: {
    id: 'ecoCultural',
    label: 'Eco-cultural',
    level: 'team',
    provenance: 'reported',
    unit: 'score',
    betterHigher: true,
    note: 'This composite score comes almost entirely from restored acres. Three of its four metrics are intentionally described but never scored, and the Oct 2026 slides publish these same values. This resolves the conflict with the report’s earlier RANK grid (Eco Machine 1, Calling on Reserves 0) in favor of the values already used by the app.',
    places: [{ key: '*', label: 'Not broken out' }],
    periods: [{ key: '*', label: 'Not broken out' }],
    sources: [SOURCE_1],
    seaLevelRise: {
      note: 'This composite score comes almost entirely from restored acres. Three of its four metrics are intentionally described but never scored, and the Oct 2026 slides publish these same values. This resolves the conflict with the report’s earlier RANK grid (Eco Machine 1, Calling on Reserves 0) in favor of the values already used by the app.',
      sources: [SOURCE_1],
    },
    children: [
      {
        id: 'ec-restoration',
        label: 'Ecosystem Restoration',
        level: 'metric',
        edge: 'derives',
        provenance: 'reported',
        unit: 'score',
        betterHigher: true,
        note: 'Slide 55 ranks restored acres: Eco Machine +2, New Green Watershed +5, every other scenario 0. Open the row for the habitat types and the qualitative functional-flow outcome.',
        places: [{ key: '*', label: 'Not broken out' }],
        periods: [{ key: '*', label: 'Not broken out' }],
        sources: SOURCES_2_3_4,
        seaLevelRise: {
          note: 'Slide 55 ranks restored acres: Eco Machine +2, New Green Watershed +5, every other scenario 0. Open the row for the habitat types and the qualitative functional-flow outcome.',
          sources: SOURCES_2_3_4,
        },
        info: {
          measures: 'How much land a scenario restores.',
          computed: '',
          scored: 'The Eco-cultural criterion sets the result on the −5 to +5 scale.',
        },
        children: [
          {
            id: 'ec-restoration-tidal',
            label: 'Tidal wetlands',
            level: 'entity',
            edge: 'measures',
            provenance: 'reported',
            unit: 'acres',
            betterHigher: true,
            note: 'Eco Machine’s only restoration: 41,720 acres in Suisun Marsh plus 1,380 at Franks Tract. New Green Watershed’s cell is left blank in the source — a gap, not a zero.',
            places: [{ key: 'inDelta', label: 'In-Delta' }],
            periods: [{ key: '*', label: 'Not broken out' }],
            sources: [SOURCE_5],
            seaLevelRise: {
              note: 'Eco Machine’s only restoration: 41,720 acres in Suisun Marsh plus 1,380 at Franks Tract. New Green Watershed’s cell is left blank in the source — a gap, not a zero.',
              sources: [SOURCE_5],
            },
          },
          {
            id: 'ec-restoration-managed',
            label: 'Managed wetlands',
            level: 'entity',
            edge: 'measures',
            provenance: 'reported',
            unit: 'acres',
            betterHigher: true,
            note: 'Restored acres, from the table eco-cultural titles RESTORED ACRES. Ecology’s 120,814 is not a rival reading of this: it is the total including the 5,100-acre baseline. Economy’s 80,739 splits a 202,220-acre farmland footprint rather than these 248,815 mapped Delta islands, and lands on about the same share: 40% against 41%.',
            places: [{ key: 'inDelta', label: 'In-Delta' }],
            periods: [{ key: '*', label: 'Not broken out' }],
            sources: [SOURCE_5],
            seaLevelRise: {
              note: 'Restored acres, from the table eco-cultural titles RESTORED ACRES. Ecology’s 120,814 is not a rival reading of this: it is the total including the 5,100-acre baseline. Economy’s 80,739 splits a 202,220-acre farmland footprint rather than these 248,815 mapped Delta islands, and lands on about the same share: 40% against 41%.',
              sources: [SOURCE_5],
            },
          },
          {
            id: 'ec-restoration-rice',
            label: 'Wet-soil agriculture',
            level: 'entity',
            edge: 'measures',
            provenance: 'reported',
            unit: 'acres',
            betterHigher: true,
            note: 'From the 50/50 split.',
            places: [{ key: 'inDelta', label: 'In-Delta' }],
            periods: [{ key: '*', label: 'Not broken out' }],
            sources: [SOURCE_5],
            seaLevelRise: { note: 'From the 50/50 split.', sources: [SOURCE_5] },
          },
          {
            id: 'ec-restoration-uplandWetland',
            label: 'Forests',
            level: 'entity',
            edge: 'measures',
            provenance: 'reported',
            unit: 'acres',
            betterHigher: true,
            note: 'At the 0.25MW level; 85,523 at 0.5MW and 207,004 at Full MW, from the Restoration Ranges slide. Economy’s v20 LandUse sheet counts farmed acres and differs: 43,429, 80,739 and 202,220.',
            places: [{ key: 'upper', label: 'Upper watershed' }],
            periods: [{ key: '*', label: 'Not broken out' }],
            sources: [SOURCE_5],
            seaLevelRise: {
              note: 'At the 0.25MW level; 85,523 at 0.5MW and 207,004 at Full MW, from the Restoration Ranges slide. Economy’s v20 LandUse sheet counts farmed acres and differs: 43,429, 80,739 and 202,220.',
              sources: [SOURCE_5],
            },
          },
          {
            id: 'ec-restoration-meadow',
            label: 'Meadows',
            level: 'entity',
            edge: 'measures',
            provenance: 'reported',
            unit: 'acres',
            betterHigher: true,
            note: 'Range: 11,586 to 347,591 acres.',
            places: [{ key: 'upper', label: 'Upper watershed' }],
            periods: [{ key: '*', label: 'Not broken out' }],
            sources: [SOURCE_5],
            seaLevelRise: { note: 'Range: 11,586 to 347,591 acres.', sources: [SOURCE_5] },
          },
          {
            id: 'ec-restoration-floodplain',
            label: 'Floodplains',
            level: 'entity',
            edge: 'measures',
            provenance: 'reported',
            unit: 'acres',
            betterHigher: true,
            note: 'Range: 6,360 to 303,372 acres.',
            places: [{ key: 'upper', label: 'Upper watershed' }],
            periods: [{ key: '*', label: 'Not broken out' }],
            sources: [SOURCE_5],
            seaLevelRise: { note: 'Range: 6,360 to 303,372 acres.', sources: [SOURCE_5] },
          },
          {
            id: 'ec-restoration-functional-flow',
            label: 'Potential for functional flow',
            level: 'entity',
            edge: 'measures',
            provenance: 'unscored',
            unit: 'score',
            betterHigher: true,
            note: 'A judgement the team gives in steps rather than as a score.',
            places: [{ key: '*', label: 'Not broken out' }],
            periods: [{ key: '*', label: 'Not broken out' }],
            seaLevelRise: {
              note: 'A judgement the team gives in steps rather than as a score.',
              sources: [],
            },
          },
        ],
      },
      {
        id: 'ec-access',
        label: 'Increased Land Access',
        level: 'metric',
        edge: 'unscored',
        provenance: 'unscored',
        unit: 'score',
        betterHigher: true,
        note: 'The access ladder is itself the finding: ownership > land trust > conservation easement > cultural conservation easement > MOU. No scenario is scored on it.',
        places: [{ key: '*', label: 'Not broken out' }],
        periods: [{ key: '*', label: 'Not broken out' }],
        seaLevelRise: {
          note: 'The access ladder is itself the finding: ownership > land trust > conservation easement > cultural conservation easement > MOU. No scenario is scored on it.',
          sources: [],
        },
        info: {
          measures: 'How far a scenario secures Tribal access to land.',
          computed: '',
          scored:
            'Qualitative, in steps rather than a −5 to +5 score: each arrow is one step of gain over Business as Usual.',
        },
        children: [
          {
            id: 'ec-access-ownership',
            label: 'Tribal ownership',
            level: 'entity',
            edge: 'measures',
            provenance: 'unscored',
            unit: 'score',
            betterHigher: true,
            note: 'A condition behind this metric, marked where a scenario puts it in place.',
            places: [{ key: '*', label: 'Not broken out' }],
            periods: [{ key: '*', label: 'Not broken out' }],
            condition: true,
            seaLevelRise: {
              note: 'A condition behind this metric, marked where a scenario puts it in place.',
              sources: [],
            },
          },
          {
            id: 'ec-access-landTrust',
            label: 'Land trust partnership',
            level: 'entity',
            edge: 'measures',
            provenance: 'unscored',
            unit: 'score',
            betterHigher: true,
            note: 'A condition behind this metric, marked where a scenario puts it in place.',
            places: [{ key: '*', label: 'Not broken out' }],
            periods: [{ key: '*', label: 'Not broken out' }],
            condition: true,
            seaLevelRise: {
              note: 'A condition behind this metric, marked where a scenario puts it in place.',
              sources: [],
            },
          },
          {
            id: 'ec-access-conservationEasement',
            label: 'Conservation easement',
            level: 'entity',
            edge: 'measures',
            provenance: 'unscored',
            unit: 'score',
            betterHigher: true,
            note: 'A condition behind this metric, marked where a scenario puts it in place.',
            places: [{ key: '*', label: 'Not broken out' }],
            periods: [{ key: '*', label: 'Not broken out' }],
            condition: true,
            seaLevelRise: {
              note: 'A condition behind this metric, marked where a scenario puts it in place.',
              sources: [],
            },
          },
          {
            id: 'ec-access-culturalEasement',
            label: 'Cultural conservation easement',
            level: 'entity',
            edge: 'measures',
            provenance: 'unscored',
            unit: 'score',
            betterHigher: true,
            note: 'A condition behind this metric, marked where a scenario puts it in place.',
            places: [{ key: '*', label: 'Not broken out' }],
            periods: [{ key: '*', label: 'Not broken out' }],
            condition: true,
            seaLevelRise: {
              note: 'A condition behind this metric, marked where a scenario puts it in place.',
              sources: [],
            },
          },
          {
            id: 'ec-access-mou',
            label: 'Memorandum of Understanding (MOU) and Memorandum of Agreement (MOA)',
            level: 'entity',
            edge: 'measures',
            provenance: 'unscored',
            unit: 'score',
            betterHigher: true,
            note: 'A condition behind this metric, marked where a scenario puts it in place.',
            places: [{ key: '*', label: 'Not broken out' }],
            periods: [{ key: '*', label: 'Not broken out' }],
            condition: true,
            seaLevelRise: {
              note: 'A condition behind this metric, marked where a scenario puts it in place.',
              sources: [],
            },
          },
        ],
      },
      {
        id: 'ec-tek',
        label:
          'Implementation and Application of Indigenous Science & Traditional Ecological Knowledge (TEK)',
        level: 'metric',
        edge: 'unscored',
        provenance: 'unscored',
        unit: 'score',
        betterHigher: true,
        note: 'Enabling conditions rather than outcomes — privacy, unrestricted access, site selection, partnership with Tribal stewardship groups. Specific practice sites are deliberately not mapped.',
        places: [{ key: '*', label: 'Not broken out' }],
        periods: [{ key: '*', label: 'Not broken out' }],
        seaLevelRise: {
          note: 'Enabling conditions rather than outcomes — privacy, unrestricted access, site selection, partnership with Tribal stewardship groups. Specific practice sites are deliberately not mapped.',
          sources: [],
        },
        info: {
          measures:
            'How far a scenario supports Indigenous science and traditional ecological knowledge (TEK).',
          computed: '',
          scored:
            'Qualitative, in steps rather than a −5 to +5 score: each arrow is one step of gain over Business as Usual.',
        },
        children: [
          {
            id: 'ec-tek-privacy',
            label: 'Privacy',
            level: 'entity',
            edge: 'measures',
            provenance: 'unscored',
            unit: 'score',
            betterHigher: true,
            note: 'A condition behind this metric, marked where a scenario puts it in place.',
            places: [{ key: '*', label: 'Not broken out' }],
            periods: [{ key: '*', label: 'Not broken out' }],
            condition: true,
            seaLevelRise: {
              note: 'A condition behind this metric, marked where a scenario puts it in place.',
              sources: [],
            },
          },
          {
            id: 'ec-tek-unrestrictedAccess',
            label: 'Unrestricted access',
            level: 'entity',
            edge: 'measures',
            provenance: 'unscored',
            unit: 'score',
            betterHigher: true,
            note: 'A condition behind this metric, marked where a scenario puts it in place.',
            places: [{ key: '*', label: 'Not broken out' }],
            periods: [{ key: '*', label: 'Not broken out' }],
            condition: true,
            seaLevelRise: {
              note: 'A condition behind this metric, marked where a scenario puts it in place.',
              sources: [],
            },
          },
          {
            id: 'ec-tek-siteAccess',
            label: 'Site selection',
            level: 'entity',
            edge: 'measures',
            provenance: 'unscored',
            unit: 'score',
            betterHigher: true,
            note: 'A condition behind this metric, marked where a scenario puts it in place.',
            places: [{ key: '*', label: 'Not broken out' }],
            periods: [{ key: '*', label: 'Not broken out' }],
            condition: true,
            seaLevelRise: {
              note: 'A condition behind this metric, marked where a scenario puts it in place.',
              sources: [],
            },
          },
          {
            id: 'ec-tek-stewardshipGroups',
            label: 'Tribal stewardship group collaboration',
            level: 'entity',
            edge: 'measures',
            provenance: 'unscored',
            unit: 'score',
            betterHigher: true,
            note: 'A condition behind this metric, marked where a scenario puts it in place.',
            places: [{ key: '*', label: 'Not broken out' }],
            periods: [{ key: '*', label: 'Not broken out' }],
            condition: true,
            seaLevelRise: {
              note: 'A condition behind this metric, marked where a scenario puts it in place.',
              sources: [],
            },
          },
        ],
      },
      {
        id: 'ec-sovereignty',
        label: 'Recognition and Application of Tribal Sovereignty',
        level: 'metric',
        edge: 'unscored',
        provenance: 'unscored',
        unit: 'score',
        betterHigher: true,
        note: 'Data sovereignty under CARE, education, food sovereignty, Tribal water rights. Workshop-derived content needs Tribal review before it is published anywhere.',
        places: [{ key: '*', label: 'Not broken out' }],
        periods: [{ key: '*', label: 'Not broken out' }],
        seaLevelRise: {
          note: 'Data sovereignty under CARE, education, food sovereignty, Tribal water rights. Workshop-derived content needs Tribal review before it is published anywhere.',
          sources: [],
        },
        info: {
          measures: 'How far a scenario supports Tribal sovereignty.',
          computed: '',
          scored:
            'Qualitative, in steps rather than a −5 to +5 score: each arrow is one step of gain over Business as Usual.',
        },
        children: [
          {
            id: 'ec-sovereignty-dataSovereignty',
            label: 'Data Sovereignty',
            level: 'entity',
            edge: 'measures',
            provenance: 'unscored',
            unit: 'score',
            betterHigher: true,
            note: 'A condition behind this metric, marked where a scenario puts it in place.',
            places: [{ key: '*', label: 'Not broken out' }],
            periods: [{ key: '*', label: 'Not broken out' }],
            condition: true,
            seaLevelRise: {
              note: 'A condition behind this metric, marked where a scenario puts it in place.',
              sources: [],
            },
          },
          {
            id: 'ec-sovereignty-education',
            label: 'Education',
            level: 'entity',
            edge: 'measures',
            provenance: 'unscored',
            unit: 'score',
            betterHigher: true,
            note: 'A condition behind this metric, marked where a scenario puts it in place.',
            places: [{ key: '*', label: 'Not broken out' }],
            periods: [{ key: '*', label: 'Not broken out' }],
            condition: true,
            seaLevelRise: {
              note: 'A condition behind this metric, marked where a scenario puts it in place.',
              sources: [],
            },
          },
          {
            id: 'ec-sovereignty-foodSovereignty',
            label: 'Food Sovereignty',
            level: 'entity',
            edge: 'measures',
            provenance: 'unscored',
            unit: 'score',
            betterHigher: true,
            note: 'A condition behind this metric, marked where a scenario puts it in place.',
            places: [{ key: '*', label: 'Not broken out' }],
            periods: [{ key: '*', label: 'Not broken out' }],
            condition: true,
            seaLevelRise: {
              note: 'A condition behind this metric, marked where a scenario puts it in place.',
              sources: [],
            },
          },
          {
            id: 'ec-sovereignty-waterRights',
            label: 'Water Rights',
            level: 'entity',
            edge: 'measures',
            provenance: 'unscored',
            unit: 'score',
            betterHigher: true,
            note: 'A condition behind this metric, marked where a scenario puts it in place.',
            places: [{ key: '*', label: 'Not broken out' }],
            periods: [{ key: '*', label: 'Not broken out' }],
            condition: true,
            seaLevelRise: {
              note: 'A condition behind this metric, marked where a scenario puts it in place.',
              sources: [],
            },
          },
        ],
      },
    ],
  },
  // The tiered outflow table's rows
  outflowRows: {
    id: 'ecoCultural',
    label: 'Eco-cultural',
    level: 'team',
    provenance: 'reported',
    unit: 'score',
    betterHigher: true,
    note: 'One overall score: +30% outflow +3, −10% outflow −2. Flow matters to the Tribes the team heard from, and the 30% increase clearly outperforms the other two runs.',
    places: [{ key: '*', label: 'Not broken out' }],
    periods: [{ key: '*', label: 'Not broken out' }],
    sources: [
      {
        doc: 'report',
        where:
          'Eco-cultural “Story Behind the Criterion” report, Oct 2026 · Comparative Scenario Performance Ranking, tiered outflow table',
        quote: '30% Outflow Increase | 3 · 10% Outflow Decrease | -2',
      },
    ],
    children: [
      {
        id: 'ec-restoration',
        label: 'Restoration',
        level: 'metric',
        edge: 'averages',
        provenance: 'reported',
        unit: 'score',
        betterHigher: true,
        note: 'Eco-cultural tiered-outflow ranking table.',
        places: [{ key: '*', label: 'Not broken out' }],
        periods: [{ key: '*', label: 'Not broken out' }],
        forthcoming: false,
        children: [
          {
            id: 'ec-restoration-tidal',
            label: '',
            level: 'entity',
            edge: 'measures',
            provenance: 'reported',
            unit: 'acres',
            betterHigher: true,
            note: 'Eco-cultural tiered-outflow ranking table.',
            places: [{ key: '*', label: 'Not broken out' }],
            periods: [{ key: '*', label: 'Not broken out' }],
            forthcoming: false,
          },
          {
            id: 'ec-restoration-managed',
            label: '',
            level: 'entity',
            edge: 'measures',
            provenance: 'reported',
            unit: 'acres',
            betterHigher: true,
            note: 'Eco-cultural tiered-outflow ranking table.',
            places: [{ key: '*', label: 'Not broken out' }],
            periods: [{ key: '*', label: 'Not broken out' }],
            forthcoming: false,
          },
          {
            id: 'ec-restoration-rice',
            label: '',
            level: 'entity',
            edge: 'measures',
            provenance: 'reported',
            unit: 'acres',
            betterHigher: true,
            note: 'Eco-cultural tiered-outflow ranking table.',
            places: [{ key: '*', label: 'Not broken out' }],
            periods: [{ key: '*', label: 'Not broken out' }],
            forthcoming: false,
          },
          {
            id: 'ec-restoration-uplandWetland',
            label: '',
            level: 'entity',
            edge: 'measures',
            provenance: 'reported',
            unit: 'acres',
            betterHigher: true,
            note: 'Eco-cultural tiered-outflow ranking table.',
            places: [{ key: '*', label: 'Not broken out' }],
            periods: [{ key: '*', label: 'Not broken out' }],
            forthcoming: false,
          },
          {
            id: 'ec-restoration-meadow',
            label: '',
            level: 'entity',
            edge: 'measures',
            provenance: 'reported',
            unit: 'acres',
            betterHigher: true,
            note: 'Eco-cultural tiered-outflow ranking table.',
            places: [{ key: '*', label: 'Not broken out' }],
            periods: [{ key: '*', label: 'Not broken out' }],
            forthcoming: false,
          },
          {
            id: 'ec-restoration-floodplain',
            label: '',
            level: 'entity',
            edge: 'measures',
            provenance: 'reported',
            unit: 'acres',
            betterHigher: true,
            note: 'Eco-cultural tiered-outflow ranking table.',
            places: [{ key: '*', label: 'Not broken out' }],
            periods: [{ key: '*', label: 'Not broken out' }],
            forthcoming: false,
          },
          {
            id: 'ec-restoration-functional-flow',
            label: 'Potential for functional flow',
            level: 'metric',
            edge: 'measures',
            provenance: 'unscored',
            unit: 'score',
            betterHigher: true,
            note: 'Eco-cultural tiered-outflow ranking table.',
            places: [{ key: '*', label: 'Not broken out' }],
            periods: [{ key: '*', label: 'Not broken out' }],
            forthcoming: false,
          },
        ],
      },
      {
        id: 'ec-access',
        label: 'Increased Land Access',
        level: 'metric',
        edge: 'averages',
        provenance: 'unscored',
        unit: 'score',
        betterHigher: true,
        note: 'Eco-cultural tiered-outflow ranking table.',
        places: [{ key: '*', label: 'Not broken out' }],
        periods: [{ key: '*', label: 'Not broken out' }],
        forthcoming: false,
      },
      {
        id: 'ec-tek',
        label:
          'Implementation and Application of Indigenous Science & Traditional Ecological Knowledge (TEK)',
        level: 'metric',
        edge: 'averages',
        provenance: 'unscored',
        unit: 'score',
        betterHigher: true,
        note: 'Eco-cultural tiered-outflow ranking table.',
        places: [{ key: '*', label: 'Not broken out' }],
        periods: [{ key: '*', label: 'Not broken out' }],
        forthcoming: false,
      },
      {
        id: 'ec-sovereignty',
        label: 'Recognition and Application of Tribal Sovereignty',
        level: 'metric',
        edge: 'averages',
        provenance: 'unscored',
        unit: 'score',
        betterHigher: true,
        note: 'Eco-cultural tiered-outflow ranking table.',
        places: [{ key: '*', label: 'Not broken out' }],
        periods: [{ key: '*', label: 'Not broken out' }],
        forthcoming: false,
      },
    ],
  },
  // Today's sea level
  current: {
    // Business as Usual
    bau: {
      measures: {
        // Ecosystem Restoration › Tidal wetlands (acres)
        'ec-restoration-tidal': { inDelta: { '*': 0 } },

        // Ecosystem Restoration › Managed wetlands (acres)
        'ec-restoration-managed': { inDelta: { '*': 0 } },

        // Ecosystem Restoration › Wet-soil agriculture (acres)
        'ec-restoration-rice': { inDelta: { '*': 0 } },

        // Ecosystem Restoration › Forests (acres)
        'ec-restoration-uplandWetland': { upper: { '*': 0 } },

        // Ecosystem Restoration › Meadows (acres)
        'ec-restoration-meadow': { upper: { '*': 0 } },

        // Ecosystem Restoration › Floodplains (acres)
        'ec-restoration-floodplain': { upper: { '*': 0 } },
      },
    },

    // Eco Machine
    em: {
      takeaway: {
        lead: 'This scenario is ranked as **the second best** because it has less restoration than New Green Watershed.',
        points: [
          {
            label: 'Benefits for Tribes',
            text: 'It would provide all the same benefits for Tribes as listed below',
          },
        ],
      },
      scores: {
        // Eco-cultural (score)
        ecoCultural: 2,

        // Ecosystem Restoration (score)
        'ec-restoration': 2,
      },
      measures: {
        // Ecosystem Restoration › Tidal wetlands (acres)
        'ec-restoration-tidal': { inDelta: { '*': 43100 } },

        // Ecosystem Restoration › Managed wetlands (acres)
        'ec-restoration-managed': { inDelta: { '*': 0 } },

        // Ecosystem Restoration › Wet-soil agriculture (acres)
        'ec-restoration-rice': { inDelta: { '*': 0 } },

        // Ecosystem Restoration › Forests (acres)
        'ec-restoration-uplandWetland': { upper: { '*': 0 } },

        // Ecosystem Restoration › Meadows (acres)
        'ec-restoration-meadow': { upper: { '*': 0 } },

        // Ecosystem Restoration › Floodplains (acres)
        'ec-restoration-floodplain': { upper: { '*': 0 } },
      },
      steps: {
        // Ecosystem Restoration › Potential for functional flow (score)
        'ec-restoration-functional-flow': 0,

        // Increased Land Access (score)
        'ec-access': 1,

        // Implementation and Application of Indigenous Science & Traditional Ecological Knowledge (TEK) (score)
        'ec-tek': 1,

        // Recognition and Application of Tribal Sovereignty (score)
        'ec-sovereignty': 1,
      },
      conditionsMet: [
        'ec-access-ownership',
        'ec-access-landTrust',
        'ec-access-conservationEasement',
        'ec-access-culturalEasement',
        'ec-access-mou',
        'ec-tek-privacy',
        'ec-tek-unrestrictedAccess',
        'ec-tek-siteAccess',
        'ec-tek-stewardshipGroups',
        'ec-sovereignty-waterRights',
      ],
    },

    // New Green Watershed
    ngw: {
      takeaway: {
        lead: 'Overall, New Green Watershed **performs the best among the adaptation scenarios,** due to the magnitude of restoration included.',
        points: [
          {
            label: 'Benefits for Tribes',
            text: 'The restoration creates opportunities for Tribes to gather culturally important material and gather as a community',
          },
        ],
      },
      scores: {
        // Eco-cultural (score)
        ecoCultural: 4,

        // Ecosystem Restoration (score)
        'ec-restoration': 5,
      },
      measures: {
        // Ecosystem Restoration › Tidal wetlands (acres)
        'ec-restoration-tidal': { inDelta: { '*': 67000 } },

        // Ecosystem Restoration › Managed wetlands (acres)
        'ec-restoration-managed': { inDelta: { '*': 102982 } },

        // Ecosystem Restoration › Wet-soil agriculture (acres)
        'ec-restoration-rice': { inDelta: { '*': 145833 } },

        // Ecosystem Restoration › Forests (acres)
        'ec-restoration-uplandWetland': { upper: { '*': 48213 } },

        // Ecosystem Restoration › Meadows (acres)
        'ec-restoration-meadow': { upper: { '*': 11586 } },

        // Ecosystem Restoration › Floodplains (acres)
        'ec-restoration-floodplain': { upper: { '*': 6360 } },
      },
      steps: {
        // Ecosystem Restoration › Potential for functional flow (score)
        'ec-restoration-functional-flow': 0,

        // Increased Land Access (score)
        'ec-access': 4,

        // Implementation and Application of Indigenous Science & Traditional Ecological Knowledge (TEK) (score)
        'ec-tek': 4,

        // Recognition and Application of Tribal Sovereignty (score)
        'ec-sovereignty': 4,
      },
      conditionsMet: [
        'ec-access-ownership',
        'ec-access-landTrust',
        'ec-access-conservationEasement',
        'ec-access-culturalEasement',
        'ec-access-mou',
        'ec-tek-privacy',
        'ec-tek-unrestrictedAccess',
        'ec-tek-siteAccess',
        'ec-tek-stewardshipGroups',
        'ec-sovereignty-waterRights',
      ],
    },

    // Bolster & Fortify
    bf: {
      scores: {
        // Eco-cultural (score)
        ecoCultural: 0,

        // Ecosystem Restoration (score)
        'ec-restoration': 0,
      },
      measures: {
        // Ecosystem Restoration › Tidal wetlands (acres)
        'ec-restoration-tidal': { inDelta: { '*': 0 } },

        // Ecosystem Restoration › Managed wetlands (acres)
        'ec-restoration-managed': { inDelta: { '*': 0 } },

        // Ecosystem Restoration › Wet-soil agriculture (acres)
        'ec-restoration-rice': { inDelta: { '*': 0 } },

        // Ecosystem Restoration › Forests (acres)
        'ec-restoration-uplandWetland': { upper: { '*': 0 } },

        // Ecosystem Restoration › Meadows (acres)
        'ec-restoration-meadow': { upper: { '*': 0 } },

        // Ecosystem Restoration › Floodplains (acres)
        'ec-restoration-floodplain': { upper: { '*': 0 } },
      },
      steps: {
        // Ecosystem Restoration › Potential for functional flow (score)
        'ec-restoration-functional-flow': 0,

        // Increased Land Access (score)
        'ec-access': 0,

        // Implementation and Application of Indigenous Science & Traditional Ecological Knowledge (TEK) (score)
        'ec-tek': 0,

        // Recognition and Application of Tribal Sovereignty (score)
        'ec-sovereignty': 0,
      },
    },

    // Calling on Reserves
    cor: {
      scores: {
        // Eco-cultural (score)
        ecoCultural: 1,

        // Ecosystem Restoration (score)
        'ec-restoration': 0,
      },
      measures: {
        // Ecosystem Restoration › Tidal wetlands (acres)
        'ec-restoration-tidal': { inDelta: { '*': 0 } },

        // Ecosystem Restoration › Managed wetlands (acres)
        'ec-restoration-managed': { inDelta: { '*': 0 } },

        // Ecosystem Restoration › Wet-soil agriculture (acres)
        'ec-restoration-rice': { inDelta: { '*': 0 } },

        // Ecosystem Restoration › Forests (acres)
        'ec-restoration-uplandWetland': { upper: { '*': 0 } },

        // Ecosystem Restoration › Meadows (acres)
        'ec-restoration-meadow': { upper: { '*': 0 } },

        // Ecosystem Restoration › Floodplains (acres)
        'ec-restoration-floodplain': { upper: { '*': 0 } },
      },
      steps: {
        // Ecosystem Restoration › Potential for functional flow (score)
        'ec-restoration-functional-flow': 2,

        // Increased Land Access (score)
        'ec-access': 0,

        // Implementation and Application of Indigenous Science & Traditional Ecological Knowledge (TEK) (score)
        'ec-tek': 0,

        // Recognition and Application of Tribal Sovereignty (score)
        'ec-sovereignty': 2,
      },
      conditionsMet: ['ec-sovereignty-waterRights'],
    },

    // A Tunnel
    tunnel: {
      scores: {
        // Eco-cultural (score)
        ecoCultural: -2,

        // Ecosystem Restoration (score)
        'ec-restoration': 0,
      },
      measures: {
        // Ecosystem Restoration › Tidal wetlands (acres)
        'ec-restoration-tidal': { inDelta: { '*': 0 } },

        // Ecosystem Restoration › Managed wetlands (acres)
        'ec-restoration-managed': { inDelta: { '*': 0 } },

        // Ecosystem Restoration › Wet-soil agriculture (acres)
        'ec-restoration-rice': { inDelta: { '*': 0 } },

        // Ecosystem Restoration › Forests (acres)
        'ec-restoration-uplandWetland': { upper: { '*': 0 } },

        // Ecosystem Restoration › Meadows (acres)
        'ec-restoration-meadow': { upper: { '*': 0 } },

        // Ecosystem Restoration › Floodplains (acres)
        'ec-restoration-floodplain': { upper: { '*': 0 } },
      },
      steps: {
        // Ecosystem Restoration › Potential for functional flow (score)
        'ec-restoration-functional-flow': -2,

        // Increased Land Access (score)
        'ec-access': 0,

        // Implementation and Application of Indigenous Science & Traditional Ecological Knowledge (TEK) (score)
        'ec-tek': 0,

        // Recognition and Application of Tribal Sovereignty (score)
        'ec-sovereignty': 0,
      },
    },

    // Historical Baseline
    hist: {
      measures: {
        // Ecosystem Restoration › Tidal wetlands (acres)
        'ec-restoration-tidal': 0,

        // Ecosystem Restoration › Managed wetlands (acres)
        'ec-restoration-managed': 0,

        // Ecosystem Restoration › Wet-soil agriculture (acres)
        'ec-restoration-rice': 0,

        // Ecosystem Restoration › Forests (acres)
        'ec-restoration-uplandWetland': 0,

        // Ecosystem Restoration › Meadows (acres)
        'ec-restoration-meadow': 0,

        // Ecosystem Restoration › Floodplains (acres)
        'ec-restoration-floodplain': 0,
      },
      steps: {
        // Ecosystem Restoration › Potential for functional flow (score)
        'ec-restoration-functional-flow': 0,

        // Increased Land Access (score)
        'ec-access': 0,

        // Implementation and Application of Indigenous Science & Traditional Ecological Knowledge (TEK) (score)
        'ec-tek': 0,

        // Recognition and Application of Tribal Sovereignty (score)
        'ec-sovereignty': 0,
      },
    },

    // Increased Delta outflow
    more: {
      takeaway: {
        lead: 'Our analysis of flow tiers shows that a 30% increase in flows **would decrease salinity.**',
        points: [
          {
            label: 'Cultural meaning',
            text: 'In addition to the salinity implications that an increase in flows would result in, people shared with us that flows were the “soul” of the rivers. This indicates a deep cultural meaning beyond a decrease in salinity.',
          },
        ],
      },
      steps: {
        // Ecosystem Restoration › Potential for functional flow (score)
        'ec-restoration-functional-flow': 3,

        // Increased Land Access (score)
        'ec-access': 0,

        // Implementation and Application of Indigenous Science & Traditional Ecological Knowledge (TEK) (score)
        'ec-tek': 0,

        // Recognition and Application of Tribal Sovereignty (score)
        'ec-sovereignty': 2,
      },
      conditionsMet: ['ec-sovereignty-waterRights'],
      scores: {
        // Eco-cultural (score)
        ecoCultural: 3,

        // Ecosystem Restoration (score)
        'ec-restoration': 0,

        // Ecosystem Restoration › Potential for functional flow (score)
        'ec-restoration-functional-flow': 3,

        // Increased Land Access (score)
        'ec-access': 0,

        // Implementation and Application of Indigenous Science & Traditional Ecological Knowledge (TEK) (score)
        'ec-tek': 0,

        // Recognition and Application of Tribal Sovereignty (score)
        'ec-sovereignty': 2,
      },
      measures: {
        // Ecosystem Restoration › Tidal wetlands (acres)
        'ec-restoration-tidal': 0,

        // Ecosystem Restoration › Managed wetlands (acres)
        'ec-restoration-managed': 0,

        // Ecosystem Restoration › Wet-soil agriculture (acres)
        'ec-restoration-rice': 0,

        // Ecosystem Restoration › Forests (acres)
        'ec-restoration-uplandWetland': 0,

        // Ecosystem Restoration › Meadows (acres)
        'ec-restoration-meadow': 0,

        // Ecosystem Restoration › Floodplains (acres)
        'ec-restoration-floodplain': 0,
      },
    },

    // Less outflow (−10%)
    less: {
      scores: {
        // Eco-cultural (score)
        ecoCultural: -2,

        // Ecosystem Restoration (score)
        'ec-restoration': 0,

        // Ecosystem Restoration › Potential for functional flow (score)
        'ec-restoration-functional-flow': 0,

        // Increased Land Access (score)
        'ec-access': 0,

        // Implementation and Application of Indigenous Science & Traditional Ecological Knowledge (TEK) (score)
        'ec-tek': 0,

        // Recognition and Application of Tribal Sovereignty (score)
        'ec-sovereignty': 0,
      },
      measures: {
        // Ecosystem Restoration › Tidal wetlands (acres)
        'ec-restoration-tidal': 0,

        // Ecosystem Restoration › Managed wetlands (acres)
        'ec-restoration-managed': 0,

        // Ecosystem Restoration › Wet-soil agriculture (acres)
        'ec-restoration-rice': 0,

        // Ecosystem Restoration › Forests (acres)
        'ec-restoration-uplandWetland': 0,

        // Ecosystem Restoration › Meadows (acres)
        'ec-restoration-meadow': 0,

        // Ecosystem Restoration › Floodplains (acres)
        'ec-restoration-floodplain': 0,
      },
      steps: {
        // Ecosystem Restoration › Potential for functional flow (score)
        'ec-restoration-functional-flow': -2,

        // Increased Land Access (score)
        'ec-access': 0,

        // Implementation and Application of Indigenous Science & Traditional Ecological Knowledge (TEK) (score)
        'ec-tek': 0,

        // Recognition and Application of Tribal Sovereignty (score)
        'ec-sovereignty': 0,
      },
    },
  },
  // With sea level rise
  seaLevelRise: 'sameAsCurrent',
}
