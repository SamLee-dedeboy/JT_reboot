import { Link } from 'react-router-dom';
import './OurApproach.css';

export default function OurApproach() {
  return (
    <section className="our-approach" id="approach">
      <div className="our-approach-inner container">
        <div className="approach-content">
          <h2 className="approach-title">Our Approach</h2>
          <blockquote className="approach-text">
            Our approach to this participatory scenario planning process is built in a variety of ways,
            including public workshops, interviews, surveys, partnerships, exhibitions, and field work
            in the Sacramento-San Joaquin Delta.
          </blockquote>
          <div className="approach-buttons">
            <Link to="/pages/project-documentation" className="btn btn-primary">Project Documentation &amp; Reports</Link>
            <Link to="/pages/scenario-planning" className="btn btn-outline">Participatory Scenario Planning</Link>
          </div>
        </div>
        <div className="approach-image">
          <img src="/images/approach-diagram.png" alt="Participatory process diagram" className="approach-photo" />
        </div>
      </div>
    </section>
  );
}
