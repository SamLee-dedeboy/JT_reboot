import { Box, Card, CardContent, Typography } from '@mui/material';
import PageLayout from './PageLayout';

export default function ProjectDocumentation() {
  return (
    <PageLayout title="Project Documentation & Reports">
      <Typography variant="body1" component="p">
        Access our project documentation, research reports, and published materials
        related to the Just Transitions in the Delta initiative.
      </Typography>

      <Box className="card-grid">
        <Card className="card"><CardContent>
          <Typography variant="h4" component="h3">Research Reports</Typography>
          <Typography variant="body1" component="p">
            Published findings from our participatory scenario planning process,
            including community input summaries and scenario analyses.
          </Typography>
        </CardContent></Card>
        <Card className="card"><CardContent>
          <Typography variant="h4" component="h3">Workshop Materials</Typography>
          <Typography variant="body1" component="p">
            Presentations, handouts, and summary documents from our public workshops
            and community engagement events.
          </Typography>
        </CardContent></Card>
        <Card className="card"><CardContent>
          <Typography variant="h4" component="h3">Technical Documentation</Typography>
          <Typography variant="body1" component="p">
            Methodology descriptions, modeling frameworks, and data documentation
            supporting our scenario planning work.
          </Typography>
        </CardContent></Card>
      </Box>

      <Typography variant="h2" component="h2">Publications</Typography>
      <Typography variant="body1" component="p">
        Check back for links to peer-reviewed publications and working papers as they
        become available.
      </Typography>
    </PageLayout>
  );
}
