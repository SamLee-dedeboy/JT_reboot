// Repository page for project documents, reports, and outreach materials.
import { Box } from '@mui/material';
import RepoLayout from './RepoLayout';
import Section from '../common/Section';
import Timeline from './Timeline';
import { DOC_COUNT } from '../../data/docYears';

export default function ProjectDocumentation() {
  return (
    <RepoLayout
      current="docs"
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
