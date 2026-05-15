import { Typography } from '@mui/material'
import Accordion from './Accordion';
import './ProjectScope.css';

const scopeItems = [
  {
    title: 'About the Initiative',
    content:
      'We plan to envision and evaluate alternative futures and salinity management in the Bay-Delta region through collaborative, convergent, and co-production processes. Our team brings together expertise from leading institutions and diverse disciplines, with a strong focus on stakeholder engagement, scenario planning, and science-policy communication. We strive to create a neutral space for science-informed conversations, fostering inclusivity, integration, and innovation to enable meaningful action on politically sensitive water-related topics.',
  },
  {
    title: 'Our Shared Vision',
    content:
      'We are determined to create a safe space and provide necessary resources for a more collaborative and integrative long-term planning process for the Bay-Delta region. Through our work, we aim to generate a comprehensive and trusted set of tradeoff analyses for alternative futures in salinity management. By doing so, we hope to empower decision-makers and stakeholders with the knowledge and insights needed to make informed choices that benefit the environment, economy, and communities.',
  },
  {
    title: 'Why a Safe Space?',
    content:
      'Salinity management in the Delta is a "wicked problem" — one with no simple solutions and many competing interests. Our Co-In science approach (inclusive, collaborative) acknowledges this complexity and creates room for honest dialogue about tradeoffs and uncertainties.',
  },
  {
    title: 'The Next Generation',
    content:
      'A core part of our mission is training future leaders at the science-policy nexus. Through service learning and hands-on research experiences, we prepare students to tackle the complex environmental and social challenges facing California\'s water systems.',
  },
  {
    title: 'Shaping the Future',
    content:
      'We invite researchers, policymakers, community members, and students to participate in shaping equitable futures for the Delta. Your voice matters in ensuring that future salinity management strategies reflect the needs of all communities.',
  },
];

export default function ProjectScope() {
  return (
    <div className="project-scope">
      <Typography variant="h2" component="h2" className="scope-title">Project Scope</Typography>
      <Accordion items={scopeItems} />
    </div>
  );
}
