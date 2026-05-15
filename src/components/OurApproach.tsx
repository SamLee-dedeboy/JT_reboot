import { Link } from 'react-router-dom';
import { Box, Button, Stack, Typography } from '@mui/material'
import './OurApproach.css';
import { assetUrl } from '../utils/baseUrl';

export default function OurApproach() {
  return (
    <Box component="section" className="our-approach" id="approach">
      <Box className="our-approach-inner container">
        <Box className="approach-content">
          <Typography variant="h2" component="h2" className="approach-title">Our Approach</Typography>
          <Box component="blockquote" className="approach-text">
            Our approach to this participatory scenario planning process is built in a variety of ways,
            including public workshops, interviews, surveys, partnerships, exhibitions, and field work
            in the Sacramento-San Joaquin Delta.
          </Box>
          <Stack className="approach-buttons" direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Button component={Link} to="/pages/project-documentation" variant="contained">Project Documentation &amp; Reports</Button>
            <Button component={Link} to="/pages/scenario-planning" variant="outlined">Participatory Scenario Planning</Button>
          </Stack>
        </Box>
        <Box className="approach-image">
          <Box component="img" src={assetUrl('/images/approach-diagram.png')} alt="Participatory process diagram" className="approach-photo" />
        </Box>
      </Box>
    </Box>
  );
}
