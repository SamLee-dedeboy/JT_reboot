import { Box } from '@mui/material';
import PageLayout from './PageLayout';
import KelpFusionMap from '../components/maps/KelpFusionMap.tsx';

export default function KelpDiagram() {
  return (
    <PageLayout title="Kelp Diagram" fullWidthContent>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          p: 3,
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 1280,
            height: '70vh',
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: 3,
          }}
        >
          <KelpFusionMap />
        </Box>
      </Box>
    </PageLayout>
  );
}
