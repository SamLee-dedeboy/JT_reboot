import { useState } from 'react';
import { Accordion as MuiAccordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
//import './Accordion.css';

interface AccordionItem {
  title: string;
  content: string;
}

interface AccordionProps {
  items: AccordionItem[];
}

export default function Accordion({ items }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <Box className="accordion">
      {items.map((item, i) => (
        <MuiAccordion key={i} expanded={openIndex === i} onChange={() => setOpenIndex(openIndex === i ? null : i)}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h4" component="span">{item.title}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" component="p">{item.content}</Typography>
          </AccordionDetails>
        </MuiAccordion>
      ))}
    </Box>
  );
}
