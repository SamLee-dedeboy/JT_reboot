import { Box, Typography } from '@mui/material'
import './InfoSection.css';

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
  return (
    <Box component="section" id={id} className="info-section">
      <Box className={`info-inner container ${imagePosition === 'left' ? 'img-left' : ''}`}>
        <Box className="info-text">
          <Typography variant="h2" component="h2" className="info-title">{title}</Typography>
          <Box component="blockquote" className="info-body">{text}</Box>
          {children}
        </Box>
        {imageSrc && (
          <Box className="info-image">
            <Box component="img" src={imageSrc} alt={imageAlt} className="info-photo" />
          </Box>
        )}
      </Box>
    </Box>
  );
}
