import { Box, Card, CardContent, Typography } from '@mui/material';
import PageLayout from './PageLayout';

export default function PublicEvents() {
  return (
    <PageLayout title="Public Events">
      <Typography variant="h2" component="h2">Upcoming Events</Typography>
      <Typography variant="body1" component="p">
        We regularly host public workshops, community forums, and informational sessions
        to engage residents, stakeholders, and researchers in the participatory scenario
        planning process. These events are open to all who are interested in the future of
        the Sacramento–San Joaquin Delta.
      </Typography>

      <Box className="card-grid">
        <Card className="card">
          <CardContent>
            <Typography variant="h4" component="h3">Community Workshops</Typography>
            <Typography variant="body1" component="p">
            Interactive sessions where participants explore future scenarios for Delta
            water management, share local knowledge, and help shape research priorities.
            </Typography>
          </CardContent>
        </Card>
        <Card className="card">
          <CardContent>
            <Typography variant="h4" component="h3">Public Forums</Typography>
            <Typography variant="body1" component="p">
            Open discussions on drought, salinity, sea-level rise, and their impacts on
            Delta communities. Featuring presentations from researchers and community leaders.
            </Typography>
          </CardContent>
        </Card>
        <Card className="card">
          <CardContent>
            <Typography variant="h4" component="h3">Field Tours</Typography>
            <Typography variant="body1" component="p">
            Guided visits to key Delta sites to observe water infrastructure, ecological
            conditions, and the landscapes central to our scenario planning efforts.
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Typography variant="h2" component="h2">Past Events</Typography>
      <Typography variant="body1" component="p">
        Check back for recordings, summaries, and materials from our previous workshops
        and community engagement sessions.
      </Typography>
    </PageLayout>
  );
}
