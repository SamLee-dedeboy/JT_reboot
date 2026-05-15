import { Link, Typography } from '@mui/material';
import PageLayout from './PageLayout';

export default function ScenarioPlanning() {
  return (
    <PageLayout title="Participatory Scenario Planning">
      <Typography variant="h2" component="h2">What Is Participatory Scenario Planning?</Typography>
      <Typography variant="body1" component="p">
        Participatory scenario planning is a "bottom up" approach that involves working
        directly with public contributors to create and evaluate future scenarios. Unlike
        traditional top-down planning, this method ensures that diverse perspectives —
        especially those of underrepresented communities — are central to the process.
      </Typography>

      <Typography variant="h2" component="h2">How It Works</Typography>
      <Typography variant="body1" component="p">
        Our process is built through public workshops, interviews, surveys, partnerships
        with community organizations, exhibitions, and field work throughout the
        Sacramento–San Joaquin Delta. Participants help identify key uncertainties,
        explore possible futures, and evaluate the tradeoffs associated with different
        adaptation strategies.
      </Typography>

      <Typography variant="h2" component="h2">Why Participate?</Typography>
      <Typography variant="body1" component="p">
        Scenario planning is increasingly used in conservation and climate change
        adaptation research, especially when uncertainty, vulnerability, and divergent
        stakeholder interests create conflicting mandates. By involving diverse voices,
        we develop more robust, equitable, and widely supported strategies for the future.
      </Typography>

      <Typography variant="h2" component="h2">Get Involved</Typography>
      <Typography variant="body1" component="p">
        We welcome participation from researchers, policymakers, community members,
        students, and anyone interested in shaping the future of the Delta. Contact us
        at <Link href="mailto:just.transitions@ucdavis.edu">just.transitions@ucdavis.edu</Link> to
        learn about upcoming opportunities.
      </Typography>
    </PageLayout>
  );
}
