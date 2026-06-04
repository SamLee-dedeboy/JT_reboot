import { Box } from '@mui/material';
import RepoLayout from '../components/repo/RepoLayout';
import Section from '../components/common/Section';
import Timeline from '../components/repo/Timeline';
import { DOC_COUNT } from '../data/docYears';

export default function ProjectDocumentation() {
  return (
    <RepoLayout
      current="docs"
      eyebrow="Repository · 01"
      title={<>Project Documentation <Box component="span" sx={{ color: 'primary.main' }}>&amp; Reports</Box></>}
      lede="Here's a look at our project findings and outreach tools. This page will be updated with more content as public engagement and scenario refinement continue."
      meta={
        <>
          <span>
            <Box component="span" sx={{ color: 'primary.main' }}>{DOC_COUNT}</Box> documents
          </span>
          <span>·</span>
          <span>2023 – 2025</span>
        </>
      }
    >
      <Section>
        <Timeline />
      </Section>
    </RepoLayout>
  );
}
