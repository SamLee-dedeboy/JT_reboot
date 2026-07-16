import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Box, Button, Typography } from '@mui/material';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { ExpandableScenarioPanelItem } from './ExpandableScenarioPanels';

interface HorizontalExpandableScenarioPanelsProps {
  items: ExpandableScenarioPanelItem[];
  actionLabel?: string;
  header?: ReactNode;
}

export default function HorizontalExpandableScenarioPanels({
  items,
  actionLabel = 'Explore',
  header,
}: HorizontalExpandableScenarioPanelsProps) {
  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100svh',
        bgcolor: 'base.900',
        overflow: 'hidden',
      }}
    >
      {header && (
        <Box
          sx={{
            position: 'absolute',
            zIndex: 3,
            top: { xs: 24, md: 32 },
            left: { xs: 20, md: 36 },
            right: { xs: 20, md: 36 },
            pointerEvents: 'none',
          }}
        >
          {header}
        </Box>
      )}

      <Box
        component="ul"
        sx={{
          m: 0,
          p: 0,
          minHeight: '100svh',
          display: 'flex',
          flexDirection: 'column',
          listStyle: 'none',
        }}
      >
        {items.map((item, index) => (
          <Box
            component="li"
            key={item.title}
            tabIndex={0}
            sx={{
              position: 'relative',
              flex: { xs: '1 1 15rem', md: '1 1 0' },
              minHeight: { xs: '15rem', md: '8rem' },
              isolation: 'isolate',
              overflow: 'hidden',
              borderBottom: '1px solid rgba(81,162,189,0.3)',
              transition: 'flex 520ms cubic-bezier(0.22, 1, 0.36, 1), filter 240ms ease',
              outline: 'none',
              '&:hover, &:focus-within, &:focus-visible': {
                flex: { xs: '1.6 1 18rem', md: '2.2 1 0' },
                '& .horizontal-panel-image': {
                  transform: 'scale(1.05)',
                  opacity: 0.9,
                },
                '& .horizontal-panel-detail': {
                  opacity: 1,
                  transform: 'translateY(0)',
                },
                '&::after': {
                  opacity: 0,
                },
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                inset: 0,
                zIndex: -1,
                border: '2px solid rgba(81,162,189,0.64)',
                opacity: 0.75,
                boxShadow: 'inset 0 0 34px rgba(81,162,189,0.12)',
                pointerEvents: 'none',
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                inset: 0,
                zIndex: -1,
                opacity: 0.75,
                background: 'linear-gradient(180deg, rgba(16,22,24,0.42) 0%, rgba(16,22,24,0.3) 42%, rgba(16,22,24,0.5) 100%)',
                transition: 'opacity 260ms ease',
                pointerEvents: 'none',
              },
            }}
          >
            <Box
              className="horizontal-panel-image"
              sx={{
                position: 'absolute',
                inset: 0,
                zIndex: -3,
                width: '100%',
                height: '100%',
                opacity: 0.76,
                transform: 'scale(1)',
                transformOrigin: 'center',
                backgroundImage: `url(${item.image})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: `100% ${items.length * 100}%`,
                backgroundPosition: `center ${items.length === 1 ? 50 : (index / (items.length - 1)) * 100}%`,
                transition: 'transform 700ms cubic-bezier(0.22, 1, 0.36, 1), opacity 240ms ease',
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                zIndex: -2,
                background: 'linear-gradient(90deg, rgba(16,22,24,0.78) 0%, rgba(16,22,24,0.22) 20%, rgba(16,22,24,0) 38%, rgba(16,22,24,0) 62%, rgba(16,22,24,0.24) 80%, rgba(16,22,24,0.9) 100%)',
              }}
            />

            <Box
              sx={{
                position: 'absolute',
                top: { xs: 'auto', md: '50%' },
                right: { xs: 20, md: 44 },
                bottom: { xs: 28, md: 'auto' },
                left: { xs: 20, md: 'auto' },
                width: { xs: 'auto', md: 'min(40vw, 560px)' },
                display: 'grid',
                gridTemplateRows: 'auto auto',
                justifyItems: { xs: 'start', md: 'end' },
                gap: { xs: 1.15, md: 0.8 },
                textAlign: { xs: 'left', md: 'right' },
                transform: { xs: 'none', md: 'translateY(-50%)' },
              }}
            >
              <Typography variant="numberArticle" component="p" sx={{ color: 'secondary.main' }}>
                {item.eyebrow ?? String(index + 1).padStart(2, '0')}
              </Typography>
              <Typography variant="h3" component="h3" sx={{ maxWidth: '18ch', color: 'common.white' }}>
                {item.title}
              </Typography>
            </Box>

            <Box
              className="horizontal-panel-detail"
              sx={{
                position: 'absolute',
                right: { xs: 20, md: 44 },
                bottom: { xs: 28, md: 24 },
                left: { xs: 20, md: 'auto' },
                width: { xs: 'auto', md: 'min(40vw, 560px)' },
                display: 'grid',
                gridTemplateRows: 'minmax(72px, auto) auto',
                justifyItems: { xs: 'start', md: 'end' },
                gap: { xs: 1.15, md: 1.25 },
                textAlign: { xs: 'left', md: 'right' },
                opacity: { xs: 1, md: 0 },
                transform: { xs: 'translateY(0)', md: 'translateY(10px)' },
                transition: 'opacity 220ms ease, transform 220ms ease',
              }}
            >
              {item.body && (
                <Typography
                  variant="body2"
                  sx={{
                    maxWidth: '36ch',
                    color: 'base.100',
                    alignSelf: 'start',
                    justifySelf: { xs: 'start', md: 'end' },
                  }}
                >
                  {item.body}
                </Typography>
              )}
              {item.href && (
                <Button
                  component={Link}
                  to={item.href}
                  variant="outlined"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    justifySelf: { xs: 'start', md: 'end' },
                    color: 'common.white',
                    borderColor: 'rgba(81,162,189,0.7)',
                    bgcolor: 'rgba(81,162,189,0.08)',
                    transition: 'opacity 220ms ease, transform 220ms ease, border-color 180ms ease, background-color 180ms ease',
                    '&:hover': {
                      borderColor: 'secondary.main',
                      bgcolor: 'rgba(81,162,189,0.14)',
                    },
                  }}
                >
                  {actionLabel}
                </Button>
              )}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
