import { Box, Typography } from '@mui/material'
import './Funding.css';
import { assetUrl } from '../utils/baseUrl';

export default function Funding() {
  return (
    <Box component="section" className="funding">
      <Box className="funding-inner container">
        <Box className="funding-text">
          <Typography variant="h2" component="h2" className="funding-title">Project Funding</Typography>
          <Box component="blockquote" className="funding-body">
            This project is supported by the University of California's Multicampus Research Programs
            and Initiatives (MRPI) grant, which funds system-wide, cross-campus collaborative research
            of significance to the State of California.
          </Box>
        </Box>
        <Box className="funding-logo">
          <Box component="img" src={assetUrl('/images/uc-logo-white.png')} alt="University of California" />
        </Box>
      </Box>
    </Box>
  );
}
