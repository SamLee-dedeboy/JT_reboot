import { Link } from 'react-router-dom';
import { Box, Button, Container, Stack, Typography, useTheme } from '@mui/material'
import { assetUrl } from '../utils/baseUrl';

export default function OurApproach() {
  const theme = useTheme();

  return (
    <Box component="section" id="approach" sx={{ py: theme.jtSpacing.section.md, bgcolor: 'brand.base', color: 'common.white' }}>
      <Container>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '5fr 7fr' },
            gap: theme.jtSpacing.gap.lg,
            alignItems: 'center',
          }}
        >
          <Box>
            <Typography variant="h2" component="h2" sx={{ color: 'primary.main', mb: theme.jtSpacing.component.sm }}>Our Approach</Typography>
            <Box
              component="blockquote"
              sx={{ m: 0, mb: theme.jtSpacing.component.lg, pl: theme.jtSpacing.component.md, borderLeft: 4, borderColor: 'primary.main', typography: 'body1', lineHeight: 1.8 }}
            >
              Our approach to this participatory scenario planning process is built in a variety of ways,
              including public workshops, interviews, surveys, partnerships, exhibitions, and field work
              in the Sacramento-San Joaquin Delta.
            </Box>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button component={Link} to="/pages/project-documentation" variant="contained">Project Documentation &amp; Reports</Button>
              <Button component={Link} to="/pages/scenario-planning" variant="outlined">Participatory Scenario Planning</Button>
            </Stack>
          </Box>
          <Box>
            <Box component="img" src={assetUrl('/images/approach-diagram.png')} alt="Participatory process diagram" sx={{ width: '1', height: 'auto', display: 'block', borderRadius: 1 }} />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
