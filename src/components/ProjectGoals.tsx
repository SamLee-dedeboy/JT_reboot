import Accordion from './Accordion';
import './ProjectGoals.css';

const goals = [
  {
    title: 'Understanding L-SES',
    content:
      'Generate greater understanding of social-ecological systems and places impacted by Delta salinity and of how the Delta compares to other large social-ecological systems in response to change. Understand what constrains consideration of different management approaches (e.g., physical, social, and policy constraints), what flexibility exists within those constraints, what would be necessary to exercise that flexibility, and what consequences that would have.',
  },
  {
    title: 'Responsive Strategies',
    content:
      'Create and investigate a diverse range of future delta salinity scenarios that are responsive to diverse stakeholder and public input. Gather information on diverse adaptation strategies and understand how different communities make decisions in response to changing water availability and quality, how they access nature, and how they address well-being in a changing climate.',
  },
  {
    title: 'Accessible Tools',
    content:
      'Curating accessible, transparent tools and data products that can support informed decision-making and public engagement around Delta salinity issues.',
  },
  {
    title: 'Open Dialogue',
    content:
      'Promoting shared understanding through open dialogue among diverse stakeholders, including researchers, policymakers, community members, and resource managers.',
  },
  {
    title: 'Understanding Limitations',
    content:
      'Facilitating transparent conversation about what is knowable regarding future salinity management, and where significant uncertainties remain.',
  },
];

export default function ProjectGoals() {
  return (
    <div className="project-goals">
      <h2 className="goals-title">Project Goals</h2>
      <Accordion items={goals} />
    </div>
  );
}
