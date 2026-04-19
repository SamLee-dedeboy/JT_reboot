import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { assetUrl } from '../utils/baseUrl';
import './AdaptationScenarios.css';

const scenarios = [
  {
    id: 'business-as-usual',
    title: 'Business as Usual',
    subtitle: 'Baseline scenario with current water management operations',
    image: assetUrl('/images/scenarios/business-as-usual.jpg'),
    narrative:
      'In this future, things continue much like they currently are and along current trends. The Freshwater Delta / X-2 standard is maintained (as much as possible) into the future. There is likely an increased use of temporary salinity barriers, more temporary urgency change petitions (TUCPs), and exceptions to water quality standards during droughts.',
    note: 'This scenario will provide a baseline of current conditions and trends from which to compare and contrast with all other scenarios.',
    questions: [
      'How long can the current ways of managing water quality be maintained into the future?',
      'What are the thresholds at which this system breaks down and requires change?',
      'How much more water is required over time (due to sea level rise, changing precipitation patterns, increasing heat and drought severity) to maintain current water quality standards?',
    ],
    scopeImage: assetUrl('/images/scenarios/scope-business-as-usual.png'),
  },
  {
    id: 'eco-machine',
    title: 'Eco Machine',
    subtitle: 'Restoration scenario with multi-benefit, nature-based solutions',
    image: assetUrl('/images/scenarios/eco-machine.jpg'),
    narrative:
      'Delta salinity intrusion is reduced by strategically placed green infrastructure. This infrastructure is designed to provide multiple benefits to Delta communities, including the creation of recreational, economic, and eco-cultural opportunities.',
    questions: [
      'What are the potential salinity management benefits of green infrastructure strategies like the Franks Tract Futures project?',
      'How can these projects be designed to maximize Delta recreational, community, and eco-cultural benefits, in addition to salinity management benefits?',
    ],
    scopeImage: assetUrl('/images/scenarios/scope-eco-machine.png'),
  },
  {
    id: 'new-green-watershed',
    title: 'New Green Watershed',
    subtitle: 'Restoration scenario with holistic, watershed-scale strategies',
    image: assetUrl('/images/scenarios/new-green-watershed.jpg'),
    narrative:
      'Within the Delta, land subsidence of peat soils (meaning the sinking of the land surface elevation when these types of soils are dried and exposed to air) poses increasing risks to the region\u2019s levees. Water levels in the Delta\u2019s channels are increasingly higher in elevation than the subsiding lands protected by Delta levees, with some tracts as low as 20-25 feet below sea level. The New Green Watershed scenario seeks to halt and attenuate the greatest threats to the Delta \u2013 subsidence and flooding \u2013 through ecological restoration and land use adaptations that foster regenerative forms of farming and a transition to a more sustainable green economy.',
    questions: [
      'Is a viable, regenerative green economy in the Delta and surrounding regions possible?',
      'Can upstream meadow and floodplain restoration significantly increase water storage and water quality benefits and attenuate flood risks?',
      'What are the optimal locations in the delta to restore tidal processes to attenuate salinity intrusion, and how should they be phased in?',
      'Is this scenario the most adaptable and resilient to increasing climate stressors facing the Delta and salinity management?',
    ],
  },
  {
    id: 'a-tunnel',
    title: 'A Tunnel',
    subtitle: 'Infrastructure scenario with underground water conveyance',
    image: assetUrl('/images/scenarios/a-tunnel.jpg'),
    narrative:
      'After decades of debate and controversy, Delta Conveyance \u2013 also known as \u201Cthe tunnel\u201D \u2013 is approved under the current administration. Construction commences soon thereafter and is complete around 2045.',
    note: 'Many interviewees requested we model this scenario not because it was a desired management strategy, but more to have the opportunity to better understand it, and compare it to other scenarios.',
    questions: [
      'What are the potential impacts and uncertainties in operations, particularly during prolonged drought periods?',
      'How does this infrastructure perform over time?',
      'What happens if salinity is allowed to vary in the Delta during extreme droughts (and what are longer term impacts)?',
    ],
  },
  {
    id: 'bolster-and-fortify',
    title: 'Bolster & Fortify',
    subtitle: 'Infrastructure scenario with levee fortification and freshwater pathway',
    image: assetUrl('/images/scenarios/bolster-fortify.jpg'),
    narrative:
      'Future state investments are focused on upgrading the Delta\u2019s infrastructure, including operable gates and augmented levees. These engineered improvements are used to re-fashion the Delta\u2019s waterways to attenuate salinity and to protect against potential levee breaches in the deeply subsided central Delta.',
    questions: [
      'Can salinity intrusion and through-Delta conveyance be effectively managed through engineered upgrades to Delta infrastructure?',
      'How would such changes impact or benefit different communities?',
    ],
  },
  {
    id: 'calling-on-reserves',
    title: 'Calling on Reserves',
    subtitle: 'Scenario exploring strategic use of water reserves',
    image: assetUrl('/images/scenarios/calling-on-reserves.jpg'),
    narrative:
      'This scenario is currently under development. More details will be available as the participatory scenario planning process continues.',
    questions: [],
  },
];

export default function AdaptationScenarios() {
  return (
    <>
      <Navbar />
      <main className="scenarios-page">
        <header className="scenarios-cover">
          <img src={assetUrl('/images/scenarios/cover.jpg')} alt="" className="scenarios-cover-bg" />
          <div className="scenarios-cover-overlay" />
          <div className="scenarios-cover-inner">
            <h1 className="scenarios-cover-title">Adaptation Scenarios</h1>
            <p className="scenarios-cover-subtitle">
              Salinity and climate adaptation strategies for the Sacramento-San Joaquin Delta.
            </p>
          </div>
        </header>

        <nav className="scenarios-nav">
          <div className="container">
            <ul className="scenarios-nav-list">
              {scenarios.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`}>{s.title}</a>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <section className="scenarios-intro">
          <div className="container">
            <h2>Envisioning Future Scenarios</h2>
            <p>
              This resource presents the adaptation strategies for each of the six future scenarios
              as they have been developed through the publicly co-designed participatory scenario
              planning (PSP) process. The following is provided for each scenario:
            </p>
            <ol>
              <li>A short narrative describing the features and transformations entailed in the scenario, as well as some of the primary research questions being explored.</li>
              <li>Definitions of the geographic scope and extent of the scenarios. These definitions describe what is and is not included in the scenario, as well as the technical basis for modelling the scenario.</li>
              <li>Perceived benefits and impacts of each scenario, per public feedback received at our previous public workshops.</li>
              <li>An interactive, multiscalar map of the scenario. Each map provides geospatial data and information specific to the adaptation explored.</li>
            </ol>
            <p className="scenarios-note">
              The maps and information for all scenarios are works in progress, and more data and
              information may be added to them as the scenarios continue to be refined.
            </p>
          </div>
        </section>

        {scenarios.map((scenario) => (
          <section key={scenario.id} id={scenario.id} className="scenario-section">
            <div className="scenario-hero">
              <img src={scenario.image} alt={scenario.title} className="scenario-hero-img" />
            </div>
            <div className="scenario-body container">
              <h3>Scenario Narrative</h3>
              <blockquote className="scenario-narrative">{scenario.narrative}</blockquote>
              {scenario.note && (
                <p className="scenario-note"><em>{scenario.note}</em></p>
              )}

              {scenario.questions.length > 0 && (
                <>
                  <h3>Key Questions</h3>
                  <ul className="scenario-questions">
                    {scenario.questions.map((q, i) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ul>
                </>
              )}

              {'scopeImage' in scenario && scenario.scopeImage && (
                <>
                  <h3>Scope & Extent</h3>
                  <img src={scenario.scopeImage} alt={`${scenario.title} scope and extent`} className="scenario-scope-img" />
                </>
              )}

              <div className="scenario-map-placeholder">
                <p>Interactive map coming soon</p>
              </div>
            </div>
          </section>
        ))}
      </main>
      <Footer />
    </>
  );
}
