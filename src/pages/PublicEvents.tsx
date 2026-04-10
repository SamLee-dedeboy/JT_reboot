import PageLayout from './PageLayout';

export default function PublicEvents() {
  return (
    <PageLayout title="Public Events">
      <h2>Upcoming Events</h2>
      <p>
        We regularly host public workshops, community forums, and informational sessions
        to engage residents, stakeholders, and researchers in the participatory scenario
        planning process. These events are open to all who are interested in the future of
        the Sacramento–San Joaquin Delta.
      </p>

      <div className="card-grid">
        <div className="card">
          <h3>Community Workshops</h3>
          <p>
            Interactive sessions where participants explore future scenarios for Delta
            water management, share local knowledge, and help shape research priorities.
          </p>
        </div>
        <div className="card">
          <h3>Public Forums</h3>
          <p>
            Open discussions on drought, salinity, sea-level rise, and their impacts on
            Delta communities. Featuring presentations from researchers and community leaders.
          </p>
        </div>
        <div className="card">
          <h3>Field Tours</h3>
          <p>
            Guided visits to key Delta sites to observe water infrastructure, ecological
            conditions, and the landscapes central to our scenario planning efforts.
          </p>
        </div>
      </div>

      <h2>Past Events</h2>
      <p>
        Check back for recordings, summaries, and materials from our previous workshops
        and community engagement sessions.
      </p>
    </PageLayout>
  );
}
