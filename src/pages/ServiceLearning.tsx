import { Box } from '@mui/material';
import RepoLayout from '../components/repo/RepoLayout';
import Section from '../components/common/Section';
import StudioShowcase from '../components/repo/StudioShowcase';

export default function ServiceLearning() {
  return (
    <RepoLayout
      current="learning"
      eyebrow="Repository · 02"
      title={<>Service Learning &amp; <Box component="span" sx={{ color: 'primary.main' }}>Design Studios</Box></>}
      lede="Here's a look at University of California undergraduate coursework focused on service learning and education through publicly engaged design studios. This page will be updated with more content as public engagement continues."
    >
      <Section>
        <StudioShowcase />
      </Section>
    </RepoLayout>
  );
}
