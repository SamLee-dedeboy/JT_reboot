// The ecocultural restoration criterion: everything the site says about it, in the shape of ./types.
import { TEAM_NAMES } from '../names'
import { publishedScoresSource } from './publishedScores'
import type { Criterion } from './types'

const ecoculturalOverallBasis =
  'One overall score combining restored acres, flow, and the criterion’s qualitative judgement.'

export const ecoculturalRestoration: Criterion = {
  id: 'ecocultural-restoration',
  number: TEAM_NAMES.ecoCultural.number,
  label: TEAM_NAMES.ecoCultural.name,
  summary:
    'Assesses whether scenarios advance eco-cultural restoration and Indigenous sovereignty through ecosystem restoration, land access, Indigenous science and Traditional Ecological Knowledge, and Tribal sovereignty.',
  entityGroups: [
    {
      label: 'People and communities',
      items: [
        'Indigenous people, communities and advocates',
        'Tribal nations',
        'Indigenous Science and Traditional Ecological Knowledge (TEK) practitioners',
      ],
    },
    {
      label: 'Species and ecosystems',
      items: ['Native species and ecosystems'],
    },
    {
      label: 'Places and relationships',
      items: [
        'Culturally significant landscapes',
        'Stewardship and subsistence places',
        'Ceremonial and cultural-practice sites',
        'Tribal lands, waters, and resources',
      ],
    },
  ],
  metrics: [
    {
      name: 'Ecosystem restoration',
      definition:
        'Evaluates recovery, protection, and enhancement of species and ecosystems that are Native to the Delta and culturally significant.',
      measurement: 'Change in the number of restored acres in each scenario.',
    },
    {
      name: 'Increased land access',
      definition:
        'Considers returning land to Tribes or co-managing land with Tribes and Tribal governments for stewardship, subsistence, ceremony, and cultural practices.',
      measurement:
        'Types of agreements that can facilitate increased access to land for Tribal communities.',
    },
    {
      name: 'Implementation and application of Indigenous Science & TEK',
      definition:
        'Considers how TEK can inform management, stewardship, and land-use decisions in partnership with Tribal representatives and practitioners.',
      measurement: 'Avenues through which TEK applications can be facilitated.',
    },
    {
      name: 'Recognition and application of Tribal sovereignty',
      definition:
        'Evaluates recognition of Indigenous peoples’ authority to govern themselves, their lands, and resources and maintain Traditional ways of life.',
      measurement:
        'Instances and mechanisms that recognize and apply Indigenous sovereignty, Tribal governance, and rights.',
    },
  ],
  story: {
    source:
      'The Story Behind the Criterion: Eco-Cultural Restoration and Indigenous Sovereignty. Social Science Team, UC Davis, September 2026 (draft).',
    brief: {
      rationale:
        'Native Tribes were the original stewards of the Delta. A just transition should address the legacies of settler colonialism, genocide, forced removal, and land reclamation by respecting Tribal sovereignty, restoring eco-culturally valued habitats and species, increasing land access, and restoring Indigenous knowledge, stewardship, guardianship, and lifeways.',
      what: 'Eco-cultural restoration entails the restoration of ecosystems and Indigenous human cultures simultaneously as interconnected and reciprocal processes. It is the intentional inclusion of cultural restoration and reparation into ecological restoration planning, design, and stewardship. In the Delta, this entails engaging Indigenous people in ecological planning and design efforts so that eco-cultural restoration might occur in a collaborative, equitable, and self-determined manner.\n\nIndigenous sovereignty refers to the inherent, pre-existing right of Indigenous peoples to self-determine, govern themselves, manage their lands and resources, and maintain their unique cultures, languages, and legal systems independently of external nation-state dominion.\n\nThis criterion assesses if and how the project’s adaptation scenarios advance eco-cultural restoration and Indigenous sovereignty, as measured across four metrics: ecosystem restoration, land access, implementation and application of Indigenous science & Traditional Ecological Knowledge, and recognition and application of Tribal sovereignty.',
      why: 'The Delta was home to many Tribes long before colonization, and their ties to its land, water, and life run deep. A just transition in the Delta cannot happen without Indigenous leadership and inclusion in Delta decision-making.',
    },
    what: [
      'Leaving no one behind means accounting for past wrongs, including the exclusion of Tribal and Indigenous communities from Delta decisions. That makes eco-cultural restoration and Indigenous sovereignty pillars of a just transition.',
      'Eco-cultural restoration restores land and Indigenous cultures simultaneously as a connected and reciprocal process, with Indigenous people taking part in planning, design, and stewardship in a collaborative, self-determined way. Indigenous sovereignty is a nation’s inherent right to govern themselves and live their own way of life, free from interference. Two main pillars of this criterion are the concepts of intergenerational stewardship, and intergenerational prosperity and well-being.',
    ],
    why: {
      paragraphs: [
        'Prior to colonization, the Delta was home to many Tribes, including the Bay Miwok, Coast Miwok, Plains Miwok, Maidu, Nisenan, Ohlone, Patwin, Pomo, Wappo, Wintun, and Yokuts. Though most were relocated outside the Delta, their connections to the land, water, and the life the Delta supports remain deep. Indigenous communities’ values belong in Delta decisions. The Delta’s species, and the flow of water itself, are incredibly important to Indigenous worldviews.',
      ],
      statsInRows: true,
      stats: [
        {
          value: 'Original Stewards and Guardians',
          label: 'Native Tribes were the Delta’s first residents, long before colonization',
        },
        {
          value: '7.5 million acres',
          label:
            'California aims to bring 7.5+ million acres under Tribal stewardship (California Natural Resources Agency, 2026)',
        },
      ],
    },
    construction: {
      intro:
        'Because the inclusion and leadership of Indigenous community members and advocates is paramount to a just transition, the Just Transitions in the Delta team intentionally, consistently, and frequently checked in, applied feedback, and iterated upon this criterion through the following engagement opportunities:',
      facts: [
        {
          value: 'Invitation',
          label:
            'for initial interviews; these interviews served as the basis for the six future scenarios',
        },
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
          {
            value: '14',
            label:
              'reciprocal and interconnected components of Eco-cultural Restoration and Indigenous Sovereignty',
          },
          {
            value: '2',
            label:
              'main pillars (Intergenerational Stewardship and Intergenerational Prosperity and Well-being)',
          },
          { value: '1', label: 'quantitative metric' },
          { value: '3', label: 'descriptive metrics' },
        ],
      },
      steps: [
        {
          title: 'Intentional outreach',
          body: 'Indigenous community members and advocates were specifically invited to semi-structured interviews so Tribal values and voices could inform this research from the beginning. Findings shaped the preliminary scenario narratives.',
        },
        {
          title: 'Spotlight Indigenous community viewpoints',
          when: 'Public Workshop 1 · June 2024',
          body: 'Indigenous community member and advocate perspectives were featured to the broader public workshop audience.',
        },
        {
          title: 'Draw the connections',
          when: 'Tribal Workshop 1 · November 2024',
          body: 'Insights from interview results, literature, and conversations with Indigenous Advisory Committee members helped create a diagram of how eco-cultural restoration and sovereignty reinforce each other through 14 reciprocal and interconnected components. Workshop participants reviewed this diagram, and it was distilled into four metrics.',
        },
        {
          title: 'Review and refine',
          when: 'Public Workshop 2 and Tribal Workshop 2 · June 2025 / Tribal Workshop 3 · December 2025, and ongoing',
          body: 'Participants reviewed the four distilled metrics, and expressed that they matter equally and depend on one another. Further feedback for additions to the metrics was incorporated.',
          points: [
            'Sovereignty additions: Food sovereignty, data sovereignty, and youth education on the legacies of colonialism.',
            'TEK additions: Privacy while practicing TEK, through Tribal site selection and/or buffer zones.',
          ],
        },
        {
          title: 'Ask which landscapes matter',
          when: 'Tribal Workshop 3 · December 2025',
          body: 'Tribal Workshop 3 participants described current land access, desired landscapes, and overall governance. These priorities set the habitat types included in the restoration scenarios.',
          points: [
            'Tidal wetlands: provide clean water, biodiversity, and grasses for basket-weaving.',
            'Upper watershed forests, meadows, and floodplains: provide opportunities for hunting, gathering of food and medicine, and fire risk reduction.',
          ],
        },
        {
          title: 'Research and iteratively refine the watershed restoration scenarios',
          body: 'The upper watershed restoration scenario and associated benefits were extensively researched and iteratively developed from the time of the first Tribal workshop throughout the rest of the project. The final result of this effort is a 3 × 3 matrix of nine potential sub-scenarios: minimal, medium, or maximal effort, each prioritizing forests, meadows, or floodplains. It is combined with in-Delta tidal wetland restoration.',
        },
      ],
    },
    components: {
      intro:
        'This criterion is composed of four interdependent metrics evaluated across all future scenarios: ecosystem restoration, land access, implementation and application of Indigenous science & Traditional Ecological Knowledge, and recognition and application of Tribal sovereignty.\n\nAlthough all four metrics are equally important and interdependent to meet this criterion, only the habitat restoration metric can be spatially and quantitatively evaluated across the scenarios. The other three metrics are envisioned and assumed in Eco Machine and New Green Watershed scenarios (the two scenarios that restore land and habitats) but cannot be prescribed within the scope of this project (e.g., assigning specific areas for land-back initiatives, or determining where access may be most desired and granted on private land). Thus the evaluation for Tribal land access, Tribal sovereignty, and application of Indigenous Science and Traditional Ecological Knowledge are expressed qualitatively, where the scenarios offer the increased potential to achieve these metrics.',
      items: [
        {
          name: 'Ecosystem Restoration',
          summary:
            'Recovering and protecting the Delta’s **native, culturally significant species and ecosystems** through habitat creation, restoration, and environmental flows.',
          spec: [
            { label: 'Measures', value: 'Change in restored acres in each scenario' },
            { label: 'Unit', value: 'Acres, by habitat type' },
            { label: 'Where', value: 'Whole Delta, plus the much larger Bay–Delta watershed' },
          ],
          method: [
            'Identify the restorable area of each upland habitat (forests, meadows, floodplains).',
            'Consider the mosaic of upland restoration options across habitat types, from minimal to maximal restoration effort.',
            'Consider in-Delta wetland restoration: tidal wetland restoration in Franks Tract and Suisun Marsh for both Eco Machine and New Green Watershed; additional tidal restoration and managed wetland restoration included in New Green Watershed.',
          ],
          link: { label: 'Read more about upland watershed restoration', to: '/pages/watershed' },
          caveats: [
            '30,000 acres of already-planned restoration (such as EcoRestore) is included in the Just Transitions baseline, the Business as Usual scenario, which is assumed in all scenarios. Only restoration in addition to this baseline is counted as restoration in the adaptation scenarios.',
          ],
          tables: [
            {
              caption: 'Restorable upland area in the Bay–Delta watershed',
              columns: [
                'Habitat',
                'Low upland restoration acreage',
                'Medium upland restoration acreage',
                'High upland restoration acreage',
                'Basis',
              ],
              rows: [
                [
                  'Upland Forest',
                  '468,000 acres',
                  '2,574,000 acres',
                  '4,680,000 acres',
                  'CAL FIRE vegetation layer; Sierra Nevada Conservancy subregions',
                ],
                [
                  'Montane Meadow',
                  '11,600 acres',
                  '63,750 acres',
                  '115,900 acres',
                  'UC Davis meadow compilation; Emmons et al. (2013) and expert input',
                ],
                [
                  'Floodplain',
                  '6,400 acres',
                  '35,000 acres',
                  '63,600 acres',
                  'CAL FIRE vegetation layer; CVFPP conservation strategy',
                ],
              ],
            },
          ],
        },
        {
          name: 'Increased Land Access',
          summary:
            '**Returning land** to Tribes or **co-managing** it with Tribes and Tribal governments for stewardship, subsistence, ceremony, and cultural practice.',
          spec: [
            {
              label: 'Methods and techniques for increased land access',
              value:
                'Listing and description of the kinds of agreements that can open access to land to Tribal communities',
            },
            { label: 'Unit', value: 'Descriptive' },
            {
              label: 'Where',
              value:
                'The entire Delta watershed; expected alongside restoration in Eco Machine and New Green Watershed, but possible in any scenario',
            },
          ],
          method: [
            'Explore types of access agreements through literature review, Tribal and expert consultations.',
            'Listen to understand at three different Tribal Workshops (November 2024, June 2025, December 2025).',
            'Survey Tribal Workshop participants to determine their prioritized modes of land access.',
          ],
          caveats: [
            'Delta land is a mosaic of private and public ownership, so access cannot be prescribed to specific locations, or quantified in acreage in the scenarios.',
          ],
          tables: [
            {
              caption: 'Agreements that can expand Tribal access',
              columns: ['Agreement', 'What it does'],
              rows: [
                ['Tribal ownership', 'Returns full ownership, stewardship, and decision-making'],
                [
                  'Land trust partnership',
                  'A land trust buys land and agrees conservation, access, and stewardship terms with a Tribe',
                ],
                [
                  'Conservation easement',
                  'Legally binding limits on development that survive a sale; Tribes can hold them in California (SB 18)',
                ],
                [
                  'Cultural conservation easement',
                  'Explicitly protects ceremony and medicinal gathering and can guarantee access at set times',
                ],
                [
                  'Memorandum of Understanding (MOU) and Memorandum of Agreement (MOA)',
                  'Collaboration with agencies, landowners, or land trusts for gathering and TEK; an MOA is legally binding, an MOU is not',
                ],
              ],
            },
          ],
        },
        {
          name: 'Implementation and Application of Indigenous Science & Traditional Ecological Knowledge (TEK)',
          summary:
            'Bringing **Traditional Ecological Knowledge** into management and land use decisions in partnership with Tribal representatives and practitioners.',
          spec: [
            {
              label: 'Conditions and needs',
              value:
                'Listing of identified needs and preferred conditions through which TEK can be applied',
            },
            { label: 'Unit', value: 'Descriptive' },
            {
              label: 'Where',
              value: 'The whole Delta watershed; TEK should inform all planning decisions',
            },
          ],
          method: [
            'Understand what participants need in order to practice TEK through a literature review.',
            'Listen to understand at three different Tribal Workshops (November 2024, June 2025, December 2025).',
            'Pair each condition with examples that already exist in agreements or state policy.',
          ],
          tables: [
            {
              caption: 'Conditions needed and desired for applying TEK',
              columns: ['Condition', 'In practice'],
              rows: [
                [
                  'Privacy',
                  'Organizational partners do not ask why practices happen; Tribe-chosen sites or buffer zones keep community members unobserved and unphotographed',
                ],
                [
                  'Unrestricted access',
                  'Access without fear of trespass citations, written into agreements with landowners and land trusts',
                ],
                [
                  'Site selection',
                  'Sites are accessible to elders and people with reduced mobility',
                ],
                [
                  'Tribal stewardship group collaboration',
                  'Partnership with official groups that facilitate access',
                ],
              ],
            },
          ],
        },
        {
          name: 'Recognition and Application of Tribal Sovereignty',
          summary:
            'Advancing Indigenous peoples’ **inherent right to govern** themselves, their lands, and resources, and to maintain their cultures and ways of life.',
          spec: [
            {
              label: 'Domains and mechanisms',
              value: 'Identified key domains of sovereignty and mechanisms to achieve them',
            },
            { label: 'Unit', value: 'Descriptive' },
            { label: 'Where', value: 'The whole Delta watershed' },
          ],
          method: [
            'Understand what is needed for adequate recognition and application of Tribal sovereignty through a literature review.',
            'Listen to understand at three different Tribal Workshops (November 2024, June 2025, December 2025).',
            'Note how each connects to practical examples.',
          ],
          tables: [
            {
              caption: 'Domains of recognition',
              columns: ['Mechanism', 'Example'],
              rows: [
                [
                  'Data sovereignty',
                  'CARE principles; researchers return workshop notes so Tribal participants can correct, remove, or add',
                ],
                [
                  'Education',
                  'Materials for Tribal youth and the public on the history of colonization, made with Delta Tribes',
                ],
                [
                  'Food sovereignty',
                  'The ability to gather, prepare, and eat culturally important food produced sustainably',
                ],
                [
                  'Water rights',
                  'Federal reserved and state rights; the Tribal Nature-Based Solutions Program has supported return of about 103,000 acres (California Natural Resources Agency, 2025)',
                ],
              ],
            },
          ],
        },
      ],
    },
  },
  references: [
    'California Department of Water Resources. (2017). Central Valley Flood Protection Plan Conservation Strategy - Appendix L: Measurable Objectives Development: Summary of Conservation Needs and Scale of Restoration Opportunities. https://cawaterlibrary.net/wp-content/uploads/2019/07/Appendix-L-Measurable-Objectives-Development-Summary-of-Conservation-Needs-and-Scale-of-Restoration.pdf',
    'California Department of Water Resources. (2020). California EcoRestore Highlights 2015 to 2020. https://water.ca.gov/-/media/DWR-Website/Web-Pages/Programs/All-Programs/EcoRestore/EcoRestore-5YR-Fact-Sheet_ay20.pdf?la=en&hash=BF60A28CC870C32351F807CC11D5C1E35BAC5461',
    "California Natural Resources Agency. (2026). 'New Era': Landmark Policy to Expand Tribal Stewardship for At Least 7.5 Million Acres in California. https://resources.ca.gov/Newsroom/Page-Content/News-List/Landmark-Policy",
    'Carroll, S. R., Garba, I., Figueroa-Rodríguez, O. L., Holbrook, J., Lovett, R., Materechera, S., Parsons, M., Raseroka, K., Rodriguez-Lonebear, D., Rowe, R., Sara, R., Walker, J. D., Anderson, J., & Hudson, M. (2020). The CARE Principles for Indigenous Data Governance. Data Science Journal, 19, 43. https://doi.org/10.5334/dsj-2020-043',
    'Cobb, A. J. (2005). Understanding Tribal Sovereignty: Definitions, Conceptualizations, and Interpretations. American Studies, 46(3/4), 115–132.',
    'Delta Island Adaptations. (2022). Delta Island Adaptations Phase 1 Report: Island Evaluation and Selection. https://deltaislandadaptations-ucdavis.hub.arcgis.com/pages/repository',
    'Delta Stewardship Council. (2025). Tribal and Environmental Justice in the Sacramento-San Joaquin Delta: History, Current Perspectives, and Recommendations for a Way Forward.',
    'Emmons, J.D. (2013). Quantifying the restorable water volume of Sierran meadows. UC Davis Dissertations and Theses.',
    'Grenier, L., Gray, B., & Cole, S. (2026). Tribal Water Rights in California. Public Policy Institute of California. https://www.ppic.org/?show-pdf=true&docraptor=true&url=https%3A%2F%2Fwww.ppic.org%2Fpublication%2Ftribal-water-rights-in-california%2F',
    'Hankins, D. (2018). Ecocultural Equality in the Miwkoʔ Waaliʔ. San Francisco Estuary and Watershed Science, 16(3). https://doi.org/10.15447/sfews.2018v16iss3art1',
    'La Via Campesina. (2016). What is Food Sovereignty? https://viacampesina.org/en/what-is-food-sovereignty/',
    'Middleton, B. (2011). Trust in the Land: New Directions in Tribal Conservation. University of Arizona Press.',
    'Native News Online Staff. (2026). Washoe Tribe Completes Historic 10, 274 Acre Land Return Near Lake Tahoe. https://nativenewsonline.net/currents/washoe-tribe-completes-historic-10-274-acre-land-return-near-lake-tahoe/',
  ],
  report: {
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
            finding:
              'Restores 248,815 acres in the Delta, plus restoration in the upper watershed.',
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
  },
}
