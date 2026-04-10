import PageLayout from './PageLayout';

export default function ProjectDocumentation() {
  return (
    <PageLayout title="Project Documentation & Reports">
      <p>
        Access our project documentation, research reports, and published materials
        related to the Just Transitions in the Delta initiative.
      </p>

      <div className="card-grid">
        <div className="card">
          <h3>Research Reports</h3>
          <p>
            Published findings from our participatory scenario planning process,
            including community input summaries and scenario analyses.
          </p>
        </div>
        <div className="card">
          <h3>Workshop Materials</h3>
          <p>
            Presentations, handouts, and summary documents from our public workshops
            and community engagement events.
          </p>
        </div>
        <div className="card">
          <h3>Technical Documentation</h3>
          <p>
            Methodology descriptions, modeling frameworks, and data documentation
            supporting our scenario planning work.
          </p>
        </div>
      </div>

      <h2>Publications</h2>
      <p>
        Check back for links to peer-reviewed publications and working papers as they
        become available.
      </p>
    </PageLayout>
  );
}
