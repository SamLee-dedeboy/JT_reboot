import { Box, Typography } from '@mui/material'
import './TextColumns.css';

interface Column {
  title: string;
  text: string;
}

interface TextColumnsProps {
  columns: Column[];
}

export default function TextColumns({ columns }: TextColumnsProps) {
  return (
    <Box component="section" className="text-columns">
      <Box className="text-columns-inner container">
        {columns.map((col) => (
          <Box key={col.title} className="text-col">
            <Typography variant="h2" component="h2" className="text-col-title">{col.title}</Typography>
            <Box component="blockquote" className="text-col-body">{col.text}</Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
