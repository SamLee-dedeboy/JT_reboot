import { Box, Typography } from '@mui/material';
import PageLayout from './PageLayout';

export default function ServiceLearning() {
  return (
    <PageLayout title="Service Learning & Education">
      <Typography variant="body1" component="p">
        Training the next generation of leaders at the intersection of science, policy,
        and community engagement is a core part of our mission. Our educational programs
        connect students with real-world challenges in the Delta.
      </Typography>

      <Typography variant="h2" component="h2">Design Studios</Typography>
      <Typography variant="body1" component="p">
        Our design studios bring together students from multiple UC campuses to work on
        interdisciplinary projects addressing Delta challenges. Students engage directly
        with community members and stakeholders to co-develop scenario visualizations
        and communication materials.
      </Typography>

      <Typography variant="h2" component="h2">Service Learning</Typography>
      <Typography variant="body1" component="p">
        Through partnerships with Delta communities, students contribute to meaningful
        research while developing skills in community engagement, scientific communication,
        and participatory methods.
      </Typography>

      <Typography variant="h2" component="h2">Student Opportunities</Typography>
      <Typography variant="body1" component="p">
        We offer research assistantships, internships, and course-based opportunities
        for undergraduate and graduate students across UC campuses. Contact us at{' '}
        <Box component="a" href="mailto:just.transitions@ucdavis.edu">just.transitions@ucdavis.edu</Box>{' '}
        to learn more.
      </Typography>
    </PageLayout>
  );
}
