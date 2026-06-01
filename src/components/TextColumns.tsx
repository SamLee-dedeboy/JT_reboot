import { Box, Container, Typography, useTheme } from '@mui/material'

interface Column {
  title: string;
  text: string;
}

interface TextColumnsProps {
  columns: Column[];
}

export default function TextColumns({ columns }: TextColumnsProps) {
  const theme = useTheme();

  return (
    <Box component="section" sx={{ py: theme.jtSpacing.section.md, bgcolor: 'brand.base', color: 'common.white' }}>
      <Container>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: theme.jtSpacing.gap.lg }}>
          {columns.map((col) => (
            <Box key={col.title}>
              <Typography variant="h2" component="h2" sx={{ color: 'primary.main', mb: theme.jtSpacing.component.sm }}>{col.title}</Typography>
              <Box
                component="blockquote"
                sx={{ m: 0, pl: theme.jtSpacing.component.md, borderLeft: 4, borderColor: 'primary.main', typography: 'body1', lineHeight: 1.8 }}
              >
                {col.text}
              </Box>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
