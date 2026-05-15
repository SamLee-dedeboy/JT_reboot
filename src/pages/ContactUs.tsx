import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import PageLayout from './PageLayout';

export default function ContactUs() {
  return (
    <PageLayout title="Contact Us">
      <Typography variant="body1" component="p">
        We'd love to hear from you. Whether you're a community member, researcher,
        policymaker, or student, there are many ways to get involved with the Just
        Transitions in the Delta project.
      </Typography>

      <Typography variant="h2" component="h2">Email</Typography>
      <Typography variant="body1" component="p">
        Reach us at{' '}
        <Box component="a" href="mailto:just.transitions@ucdavis.edu">just.transitions@ucdavis.edu</Box>
      </Typography>

      <Typography variant="h2" component="h2">Send a Message</Typography>
      <Box component="form" className="contact-form" onSubmit={(e) => e.preventDefault()}>
        <Stack spacing={2}>
          <TextField label="Your Name" />
          <TextField label="Your Email" type="email" />
          <TextField label="Your Message" multiline minRows={5} />
          <Button type="submit" variant="contained">Send</Button>
        </Stack>
      </Box>
    </PageLayout>
  );
}
