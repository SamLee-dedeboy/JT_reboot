import { Box, Card, CardContent, List, ListItem, Typography } from '@mui/material';
import PageLayout from './PageLayout';

export default function Resources() {
  return (
    <PageLayout title="References & Resources">
      <Typography variant="body1" component="p">
        A curated collection of references, tools, and resources related to Delta water
        management, participatory planning, and just transitions.
      </Typography>

      <Typography variant="h2" component="h2">Key References</Typography>
      <List>
        <ListItem>Sacramento–San Joaquin Delta background and history</ListItem>
        <ListItem>Climate change adaptation and sea-level rise projections</ListItem>
        <ListItem>Salinity intrusion research and management strategies</ListItem>
        <ListItem>Participatory scenario planning methodology</ListItem>
        <ListItem>Environmental justice and just transitions literature</ListItem>
      </List>

      <Typography variant="h2" component="h2">Data & Tools</Typography>
      <Typography variant="body1" component="p">
        We are developing accessible tools and data products to support co-learning
        about Delta futures. These resources will be made available as they are completed.
      </Typography>

      <Typography variant="h2" component="h2">Related Organizations</Typography>
      <Box className="card-grid">
        <Card className="card"><CardContent>
          <Typography variant="h4" component="h3">Delta Stewardship Council</Typography>
          <Typography variant="body1" component="p">State agency guiding Delta policy through the Delta Plan and Delta Science Program.</Typography>
        </CardContent></Card>
        <Card className="card"><CardContent>
          <Typography variant="h4" component="h3">Delta Science Program</Typography>
          <Typography variant="body1" component="p">Provides science-based information to support water and environmental decision-making in the Delta.</Typography>
        </CardContent></Card>
      </Box>
    </PageLayout>
  );
}
