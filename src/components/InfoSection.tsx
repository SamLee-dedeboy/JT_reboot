import { Box, Container, Typography, useTheme } from '@mui/material'

interface InfoSectionProps {
  id?: string;
  title: string;
  text: string;
  imagePosition?: 'left' | 'right';
  imageSrc?: string;
  imageAlt?: string;
  children?: React.ReactNode;
}

export default function InfoSection({
  id,
  title,
  text,
  imagePosition = 'right',
  imageSrc,
  imageAlt = '',
  children,
}: InfoSectionProps) {
  const theme = useTheme();
  const imgLeft = imagePosition === 'left';

  return (
    <Box component="section" id={id} sx={{ py: theme.jtSpacing.section.md, bgcolor: 'brand.base', color: 'common.white' }}>
      <Container>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: imgLeft ? '7fr 5fr' : '5fr 7fr' },
            gap: theme.jtSpacing.gap.lg,
            alignItems: 'center',
          }}
        >
          <Box sx={{ order: { xs: 1, md: imgLeft ? 2 : 1 } }}>
            <Typography variant="h2" component="h2" sx={{ color: 'primary.main', mb: theme.jtSpacing.component.sm }}>{title}</Typography>
            <Box
              component="blockquote"
              sx={{ m: 0, pl: theme.jtSpacing.component.md, borderLeft: 4, borderColor: 'primary.main', typography: 'body1', lineHeight: 1.8 }}
            >
              {text}
            </Box>
            {children}
          </Box>
          {imageSrc && (
            <Box sx={{ order: { xs: 2, md: imgLeft ? 1 : 2 } }}>
              <Box component="img" src={imageSrc} alt={imageAlt} sx={{ width: '1', height: 'auto', display: 'block', borderRadius: 1 }} />
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
}
