import { Box, Typography } from '@mui/material'
import './Footer.css';
import { assetUrl } from '../utils/baseUrl';

export default function Footer() {
  return (
    <Box component="footer" className="footer">
      <Box className="footer-funding container">
        <Box className="footer-funding-text">
          <Typography variant="h2" component="h2" className="footer-funding-title">Project Funding</Typography>
          <Box component="blockquote" className="footer-funding-body">
            This project is supported by the University of California's Multicampus Research Programs
            and Initiatives (MRPI) grant, which funds system-wide, cross-campus collaborative research
            of significance to the State of California.
          </Box>
        </Box>
        <Box className="footer-funding-logo">
          <Box component="img" src={assetUrl('/images/uc-logo-white.png')} alt="University of California" />
        </Box>
      </Box>
      <Box className="footer-bottom container">
        <Typography component="p" className="footer-brand">Just Transitions in the Delta</Typography>
        <Typography component="p" className="footer-copy">&copy; {new Date().getFullYear()} All rights reserved.</Typography>
        <Box component="a" href="mailto:just.transitions@ucdavis.edu" className="footer-email">
          just.transitions@ucdavis.edu
        </Box>
        <Typography component="p" className="footer-org">UC Multicampus Research Program Initiative</Typography>
      </Box>
    </Box>
  );
}
