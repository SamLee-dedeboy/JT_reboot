import { Box, Typography } from '@mui/material'
import './WhatIf.css';
import { assetUrl } from '../utils/baseUrl';

export default function WhatIf() {
  return (
    <Box component="section" className="what-if">
      <Box className="what-if-inner container">
        <Box className="what-if-text">
          <Typography variant="h2" component="h2" className="what-if-heading">
            What If?
          </Typography>
          <Box component="blockquote" className="what-if-quote">
            What if we considered a wide range of future scenarios for equitable water management
            in the Delta, under a shifting climate of uncertainty? What would these scenarios look
            like? How might these scenarios compare amongst the many social and ecological factors
            at play? What potential benefits and tradeoffs would need to be considered in each of
            these futures? How might these adaptation scenarios support a framework for Just
            Transitions in the Delta?
          </Box>
        </Box>
        <Box className="what-if-image">
          <Box component="img" src={assetUrl('/images/delta-aerial.jpg')} alt="Aerial view of the Sacramento-San Joaquin Delta" className="what-if-photo" />
        </Box>
      </Box>
    </Box>
  );
}
