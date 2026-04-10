import PageLayout from './PageLayout';

export default function Resources() {
  return (
    <PageLayout title="References & Resources">
      <p>
        A curated collection of references, tools, and resources related to Delta water
        management, participatory planning, and just transitions.
      </p>

      <h2>Key References</h2>
      <ul>
        <li>Sacramento–San Joaquin Delta background and history</li>
        <li>Climate change adaptation and sea-level rise projections</li>
        <li>Salinity intrusion research and management strategies</li>
        <li>Participatory scenario planning methodology</li>
        <li>Environmental justice and just transitions literature</li>
      </ul>

      <h2>Data & Tools</h2>
      <p>
        We are developing accessible tools and data products to support co-learning
        about Delta futures. These resources will be made available as they are completed.
      </p>

      <h2>Related Organizations</h2>
      <div className="card-grid">
        <div className="card">
          <h3>Delta Stewardship Council</h3>
          <p>State agency guiding Delta policy through the Delta Plan and Delta Science Program.</p>
        </div>
        <div className="card">
          <h3>Delta Science Program</h3>
          <p>Provides science-based information to support water and environmental decision-making in the Delta.</p>
        </div>
      </div>
    </PageLayout>
  );
}
